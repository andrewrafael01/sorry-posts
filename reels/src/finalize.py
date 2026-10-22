"""Collects the voiced renders, copies them into reels/, ranks everything not yet posted by virality and writes the 5-a-day SQL.
python3 finalize.py 'YYYY-MM-DD' [skip_names_file]   (first posting day, ET; slots 08:00 11:30 15:00 18:00 21:00)"""
import sys, os, glob, json, shutil, datetime as dt
sys.path.insert(0, os.path.dirname(__file__))
os.environ.setdefault("VOICE", "off")
import virality, virality2, schedule
from rank import niche
S = "/tmp/claude-0/-home-user-sorry-posts/aeda3cd8-6be4-5731-8b3d-d9639f60d4f0/scratchpad"
REELS = os.path.join(os.path.dirname(__file__), "..")
SLOTS = ["07:00", "09:30", "12:00", "14:30", "17:00", "19:30", "21:30", "23:30"]
SILENT = {"002_voice_memo", "003_group_dinner", "006_haha_ranked", "171_aunty_whatsapp_lock"}   # formats with no voice yet: last in line
MISC = {"172_g_mom", "173_g_dad", "174_g_aunties", "175_g_arab", "176_g_leave", "177_g_parents_normal", "178_g_inshallah", "179_r_dad_fix", "180_n_desi_wedding", "181_n_mom_grocery", "182_n_contacts", "183_n_grandma_rules", "184_r_before_parents"}

def score(name):
    import edu_scores
    if name in edu_scores.S: return edu_scores.score(name) + 5   # retention bonus: voiced, paced, fact-checked explainers
    try: n = int(name[:3])
    except ValueError: return 60.0
    if n in virality2.F: return virality2.score(n)
    try: return round(virality.score(n) * .8, 1)
    except Exception: return 60.0

def collect():
    scene = {t[2] for t in json.load(open(S + "/scene_tasks.json"))}
    have = {}
    for d in ("out_old", "out_misc", "out_scene", "out_edu"):   # later directories win
        for f in glob.glob(f"{S}/{d}/*.mp4"):
            name = os.path.basename(f)[:-4]
            if d == "out_old" and (name in scene or name in MISC): continue   # silent versions of reels that get a voiced render
            have[name] = f
    n = 0
    import subprocess
    def ok(f):
        if os.path.exists(f + ".wav"): return False   # still rendering
        r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f], capture_output=True, text=True)
        try: return float(r.stdout.strip()) > 8
        except ValueError: return False
    for name, f in list(have.items()):
        if not ok(f): del have[name]
    for name, f in have.items():
        dst = os.path.join(REELS, name + ".mp4")
        if not os.path.exists(dst) or os.path.getsize(dst) != os.path.getsize(f): shutil.copy(f, dst); n += 1
    return n

BRANCH = "https://raw.githubusercontent.com/andrewrafael01/sorry-posts/claude/100-credits-usage-9ysxsh/reels/{}.mp4"
INSERTED = set(open(S + "/inserted.txt").read().split()) if os.path.exists(S + "/inserted.txt") else set()
def edu_meta():
    import build
    out = {}
    for m in ("b40", "b41", "b42", "b43", "b44", "b45", "b46", "b47", "b48", "b49", "b50", "b51", "b52", "b53"):
        for k, fn in build.load(m).REELS.items():
            r = fn(); out[r.name] = (r.title or k, r.caption)
    return out

def sequence(skip):
    scene = {t[2] for t in json.load(open(S + "/scene_tasks.json"))}
    done = {os.path.basename(f)[:-4] for d in ("out_scene", "out_misc") for f in glob.glob(f"{S}/{d}/*.mp4")}
    skip = set(skip) | ((scene | MISC) - done)   # still the silent version: wait for the voiced render
    names = sorted({os.path.basename(f)[:-4] for f in glob.glob(REELS + "/*.mp4")} - skip)
    voiced = [n for n in names if n not in SILENT]
    items = sorted(((score(n) * (.9 if n in SILENT else 1.0), n, niche(int(n[:3])) if n[:3].isdigit() else "other") for n in voiced), key=lambda x: (-x[0], x[1]))
    items += [(score(n) - 30, n, "other") for n in names if n in SILENT]
    seq = []
    while items:
        k = next((j for j, it in enumerate(items) if not seq or it[2] != seq[-1][2] or it[2] == "other"), 0)
        seq.append(items.pop(k))
    return seq

if __name__ == "__main__":
    day = dt.date.fromisoformat(sys.argv[1]); skip = set(open(sys.argv[2]).read().split()) if len(sys.argv) > 2 else set()
    print("copied", collect())
    seq = sequence(skip); rows = []; d = day; i = 0
    first = sys.argv[3] if len(sys.argv) > 3 else "00:00"
    while i < len(seq):
        for t in SLOTS:
            if d == day and t < first: continue
            if i < len(seq): rows.append((seq[i][1], f"{d.isoformat()} {t}", seq[i][0])); i += 1
        d += dt.timedelta(days=1)
    vals = ",\n".join(f"('{n}','{w}')" for n, w, s in rows)
    meta = edu_meta(); q = lambda t: "$q$" + t + "$q$"
    ins = ",\n".join(f"({q(meta[n][0])}, '{BRANCH.format(n)}', {q(meta[n][1])})" for n, w, s in rows if n in meta and n not in INSERTED)
    pre = ("insert into ig_reels (title, video_path, caption, scheduled_at, status)\nselect v.t, v.p, v.c, timestamptz '2030-01-01', 'draft' from (values\n" + ins + "\n) as v(t, p, c) where not exists (select 1 from ig_reels r where r.video_path = v.p);\n") if ins else ""
    open(S + "/final_order.sql", "w").write(pre +
        "with o(n,ts) as (values\n" + vals + "\n) update ig_reels r set scheduled_at = (o.ts::timestamp at time zone 'America/New_York'), status = 'queued', error = null from o where r.video_path like '%/' || o.n || '.mp4' and r.status in ('draft','failed','queued');\n")
    with open(REELS + "/RANKING.md", "w") as f:
        f.write("# Virality ranking\n\nEvery reel not yet posted, best first, 5 a day (08:00, 11:30, 15:00, 18:00, 21:00 ET). Score = 10 x (.20 hook + .20 button + .25 send + .15 originality + .20 reach) - 4; reels that are still the old format count 0.8x.\n\n| # | when (ET) | score | reel |\n|---|---|---|---|\n")
        for k, (n, w, s) in enumerate(rows, 1): f.write(f"| {k} | {w} | {s} | {n} |\n")
    print(len(rows), "reels;", rows[0][1], "->", rows[-1][1]); print([(r[0], r[2]) for r in rows[:12]])
