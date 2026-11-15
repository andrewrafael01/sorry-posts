import datetime as dt
exec(open('mqueue.py').read().split('open("/tmp')[0])  # gives cs (carousel date->name), CAROUSELS, CAR_DATES
cdate = {n: d for d, n in cs.items()}
B = [(i, n, cap) for i, (n, cap, _) in enumerate(CAROUSELS) if n not in CAR_DATES]
B.sort(key=lambda x: cdate[x[1]]); h = len(B)//2; B = B[h:]+B[:h]
slots = [d for d in (dt.date(2026, 11, 18)+dt.timedelta(k) for k in range(44)) if d.isoweekday() != 7 and d not in (dt.date(2026,12,24), dt.date(2026,12,25), dt.date(2026,12,31))]
assert len(slots) == len(B), (len(slots), len(B))
vals = []
for d, (i, n, cap) in zip(slots, B):
    gap = abs((d-cdate[n]).days)
    vals.append(f"('{100+i+1}_c_{n}', {q(cap)}, '{d}', {gap})")
print("min gap days", min(int(v.split(', ')[-1].rstrip(')')) for v in vals))
sql = f"""with v(name, cap, d, gap) as (values {', '.join(vals)})
insert into public.ig_carousels (kind,title,video_url,cover_url,caption,scheduled_at,status)
select 'reel', 'mochi reel B: '||name,
 'https://raw.githubusercontent.com/andrewrafael01/sorry-posts/main/mochi/reels/'||name||'.mp4',
 'https://raw.githubusercontent.com/andrewrafael01/sorry-posts/main/mochi/reels/covers/'||name||'.jpg',
 cap||' 🤍'||E'\\n\\n'||'mochi and toast: a cute cat comic about love, comfort and cozy days. send this to someone who needs it.'||E'\\n\\n'||'#cutecats #catcomic #wholesome #mochiandtoast #kawaii',
 ((d::date + time '21:30') at time zone 'UTC'), 'queued' from v;"""
open('/tmp/claude-0/cats/mochi/qb.sql', 'w').write(sql)
