"""Builds the posting schedule + the SQL that queues reels in Supabase (ig_reels). Run: python3 schedule.py 1 50"""
import sys, os, glob, datetime as dt, csv, re
sys.path.insert(0, os.path.dirname(__file__))
import build

BRANCH_URL = "https://raw.githubusercontent.com/andrewrafael01/sorry-posts/{ref}/reels/{name}.mp4"
SLOTS7 = ["08:15", "10:30", "12:30", "14:45", "17:00", "19:30", "21:30"]
OLD_BUSY = {"12:30", "19:30"}                    # slots already used by the older queued reels (through Oct 25)
OLD_UNTIL = dt.date(2026, 10, 25)
CULTURE = {17, 18, 19, 20, *range(31, 41), *range(101, 111), *range(111, 121)}  # held back from the first days

def category(n):
    if n <= 10: return "phone"
    if n in (11, 12) or 21 <= n <= 30: return "vehicle"
    if 41 <= n <= 50: return "job"
    if n in (13, 14, 15, 16): return "family"
    if n in CULTURE: return "culture"
    if 51 <= n <= 60: return "hobby"
    if 61 <= n <= 70: return "region"
    if 71 <= n <= 80: return "stage"
    if 81 <= n <= 90: return "place"
    if 91 <= n <= 100: return "persona"
    return "other"

def load_reels():
    mods = sorted(os.path.basename(p)[:-3] for p in glob.glob(os.path.join(os.path.dirname(__file__), "scripts", "b*.py")))
    out = {}
    for m in mods:
        for name, fn in build.load(m).REELS.items():
            r = fn(); out[r.name] = r
    return out

def captions():
    import re
    txt = open(os.path.join(os.path.dirname(__file__), "..", "INDEX.md")).read()
    caps = {}
    for m in re.finditer(r"## (\d{3}_[a-z0-9_]+).*?\n- \*\*length:.*?\n- \*\*suggested caption:\*\* (.*?)\n", txt, re.S): caps[m.group(1)] = m.group(2).strip()
    return caps

def order(nums):
    """Interleave categories so neighbours differ; culture reels start after day 4."""
    buckets = {}
    for n in sorted(nums): buckets.setdefault(category(n), []).append(n)
    seq, last = [], None
    cyc = ["phone", "vehicle", "job", "family", "hobby", "region", "stage", "place", "persona", "other"]
    first = [n for n in sorted(nums) if n == 1]
    if first: buckets["phone"].remove(1); seq.append(1)
    non = [c for c in cyc if buckets.get(c)]
    while any(buckets.get(c) for c in non):
        for c in non:
            if buckets.get(c): seq.append(buckets[c].pop(0))
    cul = buckets.get("culture", [])
    # weave culture: starting at position 20, one culture reel after every ~2 others
    out, ci = [], 0
    for i, n in enumerate(seq):
        out.append(n)
        if i >= 19 and (i - 19) % 2 == 1 and ci < len(cul): out.append(cul[ci]); ci += 1
    out += cul[ci:]
    return out

def slots(start, count):
    d, res = start, []
    while len(res) < count:
        for t in SLOTS7:
            if d <= OLD_UNTIL and t in OLD_BUSY: continue
            res.append((d, t))
            if len(res) == count: break
        d += dt.timedelta(days=1)
    return res

if __name__ == "__main__":
    lo, hi = int(sys.argv[1]), int(sys.argv[2]); ref = sys.argv[3] if len(sys.argv) > 3 else "claude/100-credits-usage-9ysxsh"
    start = dt.date.fromisoformat(sys.argv[4]) if len(sys.argv) > 4 else dt.date(2026, 10, 22)
    reels, caps = load_reels(), captions()
    nums = [n for n in range(lo, hi + 1) if any(k.startswith(f"{n:03d}_") for k in reels)]
    seq = order(nums); sl = slots(start, len(seq)); rows = []
    for n, (d, t) in zip(seq, sl):
        name = next(k for k in reels if k.startswith(f"{n:03d}_")); r = reels[name]
        rows.append(dict(n=n, name=name, title=r.title or name, caption=caps.get(name, r.caption), when=f"{d.isoformat()} {t}", url=BRANCH_URL.format(ref=ref, name=name)))
    q = lambda s: "$c$" + s + "$c$"
    sql = "insert into public.ig_reels (title, video_path, caption, scheduled_at, status) values\n" + ",\n".join(
        f"({q(x['title'])}, {q(x['url'])}, {q(x['caption'])}, (timestamp '{x['when']}' at time zone 'America/New_York'), 'queued')" for x in rows) + "\non conflict (video_path) do nothing;"
    out = os.path.join(os.path.dirname(__file__), "..", f"schedule_{lo:03d}_{hi:03d}")
    open(out + ".sql", "w").write(sql)
    with open(out + ".csv", "w", newline="") as f:
        w = csv.writer(f); w.writerow(["when_et", "file", "category", "title", "caption"])
        for x in rows: w.writerow([x["when"], x["name"] + ".mp4", category(x["n"]), x["title"], x["caption"]])
    print(len(rows), "rows", rows[0]["when"], "->", rows[-1]["when"], "| culture first at day", next((i for i, x in enumerate(rows) if category(x["n"]) == "culture"), None))
