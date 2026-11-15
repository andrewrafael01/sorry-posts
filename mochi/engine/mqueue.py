import datetime as dt, json, os
from content import REELS, CAROUSELS, REEL_DATES, CAR_DATES, TAGS
BASE = "https://raw.githubusercontent.com/andrewrafael01/sorry-posts/main/mochi"
start = dt.date(2026, 11, 17); end = dt.date(2026, 12, 31)
days = [start+dt.timedelta(d) for d in range((end-start).days+1)]
def assign(items, fixed):
    slot = {}
    for name, d in fixed.items(): slot[dt.date.fromisoformat(d)] = name
    rest = [n for n, *_ in items if n not in fixed]
    for d in days:
        if d not in slot and rest: slot[d] = rest.pop(0)
    assert not rest, rest
    return slot
rs = assign(REELS, REEL_DATES); cs = assign(CAROUSELS, CAR_DATES)
ri = {n: (i, cap) for i, (n, cap, _) in enumerate(REELS)}
ci = {n: (i, cap, sl) for i, (n, cap, sl) in enumerate(CAROUSELS)}
FOLLOW = "follow @mochaandtoastworld for daily mochi + toast"
def q(s): return "'" + s.replace("'", "''") + "'"
rows = []
for d in days:
    n = cs[d]; i, cap, sl = ci[n]
    urls = [f"{BASE}/carousels/{n}/{k+1:02d}.jpg" for k in range(len(sl))]
    capf = f"{cap} 🤍\n\n{FOLLOW}\n\n{TAGS}"
    rows.append(f"('carousel', {q('mochi carousel: '+n)}, array[{', '.join(q(u) for u in urls)}], null, {q(capf)}, '{d}T17:00:00Z', 'queued')")
    n = rs[d]; i, cap = ri[n]
    t = dt.datetime.combine(d+dt.timedelta(1), dt.time(0, 0))
    capf = f"{cap} 🤍\n\n{FOLLOW}\n\n{TAGS} #catreels"
    rows.append(f"('reel', {q('mochi reel: '+n)}, null, {q(f'{BASE}/reels/{i+1:02d}_{n}.mp4')}, {q(capf)}, '{t.isoformat()}Z', 'queued')")
open("/tmp/claude-0/cats/mochi/queue.sql", "w").write(
    "insert into public.ig_carousels (kind, title, image_urls, video_url, caption, scheduled_at, status) values\n" + ",\n".join(rows) + ";")
print(len(rows), "rows")
