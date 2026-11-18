import datetime as dt, json
from content_v3 import NEW_REELS
exec(open('mcaptions.py').read().split('out = {}')[0])
ORDER = """proud_part2 strong_friend not_behind too_much still_awake im_fine takes_care homesick thanks_for_staying glad_you_exist
your_toast allowed_to_rest monday hard_on_yourself check_in december_is_a_lot rough_week brave_today for_your_mom studying_now
big_day you_matter winter_blues first_step quiet_friend still_scrolling start_over dont_compare long_distance drink_water
hard_job roommate someone_missing text_them for_your_dad you_are_the_gift sibling cat_loves_you new_start good_news
coffee_person year_proud no_new_you""".split()
idx = {n: i for i, (n, _, _) in enumerate(NEW_REELS)}
assert sorted(ORDER) == sorted(idx), set(idx) ^ set(ORDER)
q = lambda s: "'"+s.replace("'", "''")+"'"
vals = []; plan = []
for k, n in enumerate(ORDER):
    d = dt.date(2026, 11, 18)+dt.timedelta(k); i = idx[n]; _, c, b = NEW_REELS[i]
    f = f"{200+i+1}_n_{n}"
    vals.append(f"({q(f)}, {q(cap(c, n, b))}, '{d}')"); plan.append((str(d), f))
sql = f"""with v(name, cap, d) as (values {', '.join(vals)})
insert into public.ig_carousels (kind,title,video_url,cover_url,caption,scheduled_at,status)
select 'reel', 'mochi reel N: '||name,
 'https://raw.githubusercontent.com/andrewrafael01/sorry-posts/main/mochi/reels/'||name||'.mp4',
 'https://raw.githubusercontent.com/andrewrafael01/sorry-posts/main/mochi/reels/covers/'||name||'.jpg',
 cap, ((d::date + time '19:30') at time zone 'America/New_York'), 'draft' from v;"""
open('/tmp/claude-0/cats/mochi/qn.sql', 'w').write(sql)
json.dump(plan, open('/tmp/claude-0/cats/mochi/qn_plan.json', 'w'))
print(len(plan), plan[0], plan[-1]); print(cap(*NEW_REELS[0][1:2], NEW_REELS[0][0], NEW_REELS[0][2]))
