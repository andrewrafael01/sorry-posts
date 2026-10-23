// One-time sign-in for YouTube and TikTok. Open  .../oauth?platform=youtube&key=<cron_token>  (or platform=tiktok) in a browser,
// approve, and the refresh token is stored in platform_tokens for the post-cross function.
import { createClient } from "jsr:@supabase/supabase-js@2";

const SELF = () => `${Deno.env.get("SUPABASE_URL")}/functions/v1/oauth`;
const hex = (b: ArrayBuffer) => [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");
const sign = async (secret: string, msg: string) => hex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(secret + "|" + msg)));
const page = (msg: string, status = 200) => new Response(`<!doctype html><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><body style="font:18px system-ui;padding:32px;max-width:520px;margin:auto">${msg}</body>`, { status, headers: { "Content-Type": "text/html; charset=utf-8" } });

Deno.serve(async (req) => {
  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { data: cfg } = await sb.from("ig_config").select("value").eq("key", "cron_token").single();
  const secret = cfg?.value ?? "";
  const u = new URL(req.url);
  const code = u.searchParams.get("code"), state = u.searchParams.get("state");

  if (!code) {   // step 1: send the browser to the platform's consent screen
    const platform = u.searchParams.get("platform");
    if (u.searchParams.get("key") !== secret || (platform !== "youtube" && platform !== "tiktok")) return page("forbidden", 403);
    const ts = String(Date.now()); const st = `${platform}.${ts}.${await sign(secret, platform + ts)}`;
    const url = platform === "youtube"
      ? "https://accounts.google.com/o/oauth2/v2/auth?" + new URLSearchParams({ client_id: Deno.env.get("YT_CLIENT_ID")!, redirect_uri: SELF(), response_type: "code", scope: "https://www.googleapis.com/auth/youtube.upload", access_type: "offline", prompt: "consent", state: st })
      : "https://www.tiktok.com/v2/auth/authorize/?" + new URLSearchParams({ client_key: Deno.env.get("TIKTOK_CLIENT_KEY")!, scope: "video.publish,video.upload", response_type: "code", redirect_uri: SELF(), state: st });
    return Response.redirect(url, 302);
  }

  // step 2: the platform sends the browser back with a code
  const [platform, ts, sig] = (state ?? "").split(".");
  if (!platform || sig !== await sign(secret, platform + ts) || Date.now() - Number(ts) > 15 * 60 * 1000) return page("This sign-in link expired or is invalid. Start again.", 400);
  const body = platform === "youtube"
    ? new URLSearchParams({ code, client_id: Deno.env.get("YT_CLIENT_ID")!, client_secret: Deno.env.get("YT_CLIENT_SECRET")!, redirect_uri: SELF(), grant_type: "authorization_code" })
    : new URLSearchParams({ code, client_key: Deno.env.get("TIKTOK_CLIENT_KEY")!, client_secret: Deno.env.get("TIKTOK_CLIENT_SECRET")!, redirect_uri: SELF(), grant_type: "authorization_code" });
  const r = await (await fetch(platform === "youtube" ? "https://oauth2.googleapis.com/token" : "https://open.tiktokapis.com/v2/oauth/token/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body })).json();
  if (!r.refresh_token) return page(`Connected, but no refresh token came back. ${platform === "youtube" ? "Remove the app at myaccount.google.com/permissions and try again." : ""}<pre>${JSON.stringify(r).slice(0, 300).replace(/</g, "&lt;")}</pre>`, 400);
  await sb.from("platform_tokens").upsert({ platform, refresh_token: r.refresh_token, updated_at: new Date().toISOString() });
  return page(`<b>${platform}</b> is connected. New Instagram posts will be cross-posted automatically. You can close this tab.`);
});
