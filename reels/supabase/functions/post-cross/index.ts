// Cross-posts every reel that Instagram has published (after ig_config.crosspost_since) to YouTube Shorts and TikTok.
// One upload per platform per run. A platform is skipped until its tokens exist in platform_tokens (see the oauth function).
import { createClient } from "jsr:@supabase/supabase-js@2";

type Reel = { id: string; title: string | null; caption: string | null; video_path: string };
const now = () => new Date().toISOString();
const form = (o: Record<string, string>) => ({ method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams(o) });

Deno.serve(async (req) => {
  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { data: cfg } = await sb.from("ig_config").select("value").eq("key", "cron_token").single();
  const tok = req.headers.get("x-cron-token");
  if (!tok || tok !== cfg?.value) return new Response("forbidden", { status: 403 });

  const { data: sinceRow } = await sb.from("ig_config").select("value").eq("key", "crosspost_since").single();
  const since = sinceRow?.value ?? now();
  const log: unknown[] = [];

  for (const platform of ["youtube", "tiktok"] as const) {
    const { data: t } = await sb.from("platform_tokens").select("refresh_token").eq("platform", platform).maybeSingle();
    if (!t?.refresh_token) { log.push({ platform, skipped: "not connected" }); continue; }

    const { data: done } = await sb.from("cross_posts").select("reel_id").eq("platform", platform);
    const seen = new Set((done ?? []).map((d) => d.reel_id));
    const { data: posted } = await sb.from("ig_reels").select("id,title,caption,video_path").eq("status", "posted").gte("updated_at", since).order("updated_at");
    const next = (posted ?? []).find((r) => !seen.has(r.id)) as Reel | undefined;
    if (!next) { log.push({ platform, idle: true }); continue; }

    // claim first: the unique (reel_id, platform) key stops a double upload if two runs overlap
    const { error: claimErr } = await sb.from("cross_posts").insert({ reel_id: next.id, platform, status: "processing" });
    if (claimErr) { log.push({ platform, claim: claimErr.message }); continue; }
    try {
      const bytes = new Uint8Array(await (await fetch(next.video_path)).arrayBuffer());
      if (bytes.byteLength < 100000) throw new Error("video fetch too small, got " + bytes.byteLength + " bytes");
      const res = platform === "youtube" ? await youtube(sb, t.refresh_token, next, bytes) : await tiktok(sb, t.refresh_token, next, bytes);
      await sb.from("cross_posts").update({ status: "posted", external_id: res.id, note: res.note ?? null, updated_at: now() }).eq("reel_id", next.id).eq("platform", platform);
      log.push({ platform, posted: next.title, id: res.id, note: res.note });
    } catch (e) {
      await sb.from("cross_posts").update({ status: "failed", error: String((e as Error).message ?? e).slice(0, 800), updated_at: now() }).eq("reel_id", next.id).eq("platform", platform);
      log.push({ platform, failed: next.title, error: String((e as Error).message ?? e).slice(0, 200) });
    }
  }
  return Response.json({ ok: true, log });
});

async function youtube(sb: ReturnType<typeof createClient>, refresh: string, r: Reel, bytes: Uint8Array) {
  const tr = await (await fetch("https://oauth2.googleapis.com/token", form({
    client_id: Deno.env.get("YT_CLIENT_ID")!, client_secret: Deno.env.get("YT_CLIENT_SECRET")!, refresh_token: refresh, grant_type: "refresh_token" }))).json();
  if (!tr.access_token) throw new Error("youtube token refresh: " + JSON.stringify(tr).slice(0, 300));
  const title = `${(r.title ?? "").trim()} #shorts`.slice(0, 100);
  const description = `${stripBait(r.caption ?? "")}\n\n#shorts`.slice(0, 4900);
  const meta = { snippet: { title, description, categoryId: "22" }, status: { privacyStatus: "public", selfDeclaredMadeForKids: false } };
  const init = await fetch("https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status", {
    method: "POST",
    headers: { Authorization: `Bearer ${tr.access_token}`, "Content-Type": "application/json; charset=UTF-8", "X-Upload-Content-Length": String(bytes.byteLength), "X-Upload-Content-Type": "video/mp4" },
    body: JSON.stringify(meta),
  });
  if (!init.ok) throw new Error("youtube init " + init.status + " " + (await init.text()).slice(0, 300));
  const loc = init.headers.get("location");
  if (!loc) throw new Error("youtube: no upload location");
  const put = await fetch(loc, { method: "PUT", headers: { "Content-Type": "video/mp4" }, body: bytes });
  const j = await put.json();
  if (!j.id) throw new Error("youtube upload " + put.status + " " + JSON.stringify(j).slice(0, 300));
  return { id: j.id as string, note: j.status?.privacyStatus };
}

async function tiktok(sb: ReturnType<typeof createClient>, refresh: string, r: Reel, bytes: Uint8Array) {
  const tr = await (await fetch("https://open.tiktokapis.com/v2/oauth/token/", form({
    client_key: Deno.env.get("TIKTOK_CLIENT_KEY")!, client_secret: Deno.env.get("TIKTOK_CLIENT_SECRET")!, grant_type: "refresh_token", refresh_token: refresh }))).json();
  if (!tr.access_token) throw new Error("tiktok token refresh: " + JSON.stringify(tr).slice(0, 300));
  // TikTok rotates refresh tokens, so keep the newest one
  if (tr.refresh_token) await sb.from("platform_tokens").update({ refresh_token: tr.refresh_token, updated_at: now() }).eq("platform", "tiktok");
  const auth = { Authorization: `Bearer ${tr.access_token}`, "Content-Type": "application/json; charset=UTF-8" };
  const ci = await (await fetch("https://open.tiktokapis.com/v2/post/publish/creator_info/query/", { method: "POST", headers: auth })).json();
  const opts: string[] = ci?.data?.privacy_level_options ?? ["SELF_ONLY"];
  const privacy = opts.includes("PUBLIC_TO_EVERYONE") ? "PUBLIC_TO_EVERYONE" : opts[0];   // unaudited apps only offer SELF_ONLY
  const size = bytes.byteLength;
  const init = await (await fetch("https://open.tiktokapis.com/v2/post/publish/video/init/", {
    method: "POST", headers: auth,
    body: JSON.stringify({
      post_info: { title: stripBait(r.caption ?? r.title ?? "").slice(0, 2000), privacy_level: privacy, disable_comment: false, disable_duet: false, disable_stitch: false },
      source_info: { source: "FILE_UPLOAD", video_size: size, chunk_size: size, total_chunk_count: 1 },
    }),
  })).json();
  const up = init?.data?.upload_url, pid = init?.data?.publish_id;
  if (!up || !pid) throw new Error("tiktok init " + JSON.stringify(init).slice(0, 300));
  const put = await fetch(up, { method: "PUT", headers: { "Content-Type": "video/mp4", "Content-Length": String(size), "Content-Range": `bytes 0-${size - 1}/${size}` }, body: bytes });
  if (!put.ok) throw new Error("tiktok upload " + put.status + " " + (await put.text()).slice(0, 200));
  return { id: pid as string, note: privacy };
}

// the bait-free rule applies to every platform: drop any leftover "tag / comment / send this" line
function stripBait(s: string) {
  return s.split("\n").filter((l) => !/\b(tag (someone|the person)|comment (your|the|below)|send this to|share this with)\b/i.test(l)).join("\n").replace(/\n{3,}/g, "\n\n").trim();
}
