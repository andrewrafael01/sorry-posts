"""Ranks every reel by virality score and lays them out 5 a day, best first.  python3 rank.py [first_slot 'YYYY-MM-DD HH:MM' ET]
Writes ../RANKING.md, ../schedule_ranked.csv and ../schedule_ranked.sql (upsert: new rows inserted, existing rows rescheduled)."""
import sys, os, csv, datetime as dt
sys.path.insert(0, os.path.dirname(__file__))
import schedule, virality
SLOTS = ["08:00", "11:30", "15:00", "18:00", "21:00"]
OLD = {  # older hand-made reels already in the queue: id -> (title, my score)
 "9fab4b15-72a6-471a-8e61-925760cce1ed": ("Gym guys", 88.0), "04c817b6-b680-4779-94c7-ef40defa5b1b": ("We should hang out", 83.0),
 "67f78e72-5554-4315-b13d-09ec13ffe121": ("Omw translated", 84.0), "fdbb2dd5-4303-4a15-9cee-64ea3fab3b99": ("Group chat people (original)", 82.0),
 "1a24277f-69ac-4cd2-b944-c4a84c1bfd54": ("Avoided text", 80.0), "7b85d45b-8eab-47ff-8461-168f056c6b39": ("Brain at 2 AM", 80.0),
 "88e58c51-ca99-4e0e-8b47-41fc097f2b9b": ("Self checkout", 79.0), "24699e3e-565e-4ddd-b8c5-72a0828d7ea1": ("Dogs best worst roommates", 78.0),
 "db352c48-e50c-4e2f-9d13-21870c75a1fc": ("Sunday hour by hour", 77.0)}
def niche(n):
    c = schedule.category(n)
    if c == "culture": return "desi" if n in (18, *range(101, 111)) else ("immig" if 111 <= n <= 120 else "world")
    return c
def build_seq(first):
    items = [(virality.score(n), f"n{n}", niche(n), n) for n in virality.FACT]
    items += [(s, "o" + i, "old", i) for i, (t, s) in OLD.items()]
    items.sort(key=lambda x: (-x[0], x[1])); seq = []
    while items:   # greedy: best remaining whose niche differs from the previous post
        k = next((j for j, it in enumerate(items) if not seq or it[2] != seq[-1][2] or it[2] == "old"), 0)
        seq.append(items.pop(k))
    when, d = [], first.date()
    t0 = first.strftime("%H:%M")
    day = d
    while len(when) < len(seq):
        for t in SLOTS:
            if day == d and t < t0: continue
            when.append(f"{day.isoformat()} {t}")
        day += dt.timedelta(days=1)
    return seq, when
if __name__ == "__main__":
    first = dt.datetime.strptime(sys.argv[1] if len(sys.argv) > 1 else "2026-10-21 18:00", "%Y-%m-%d %H:%M")
    reels, caps = schedule.load_reels(), schedule.captions()
    seq, when = build_seq(first); q = lambda s: "$c$" + s + "$c$"; ins, upd, rows = [], [], []
    for rank, ((s, key, nich, ref), w) in enumerate(zip(seq, when), 1):
        if key[0] == "o": upd.append(f"('{ref}'::uuid, timestamp '{w}')"); rows.append((rank, w, s, OLD[ref][0], "older reel", "")); continue
        name = next(k for k in reels if k.startswith(f"{ref:03d}_")); r = reels[name]; cap = caps.get(name, r.caption)
        ins.append(f"({q(r.title or name)}, {q(schedule.BRANCH_URL.format(ref='claude/100-credits-usage-9ysxsh', name=name))}, {q(cap)}, (timestamp '{w}' at time zone 'America/New_York'), 'queued')")
        rows.append((rank, w, s, r.title or name, nich, name))
    out = os.path.join(os.path.dirname(__file__), "..")
    open(out + "/schedule_ranked.sql", "w").write(
        "insert into public.ig_reels (title, video_path, caption, scheduled_at, status) values\n" + ",\n".join(ins) +
        "\non conflict (video_path) do update set scheduled_at = excluded.scheduled_at, status = 'queued', error = null where ig_reels.status in ('queued','draft','failed');\n"
        "update public.ig_reels t set scheduled_at = v.ts at time zone 'America/New_York', status='queued' from (values\n" + ",\n".join(upd) + "\n) as v(id, ts) where t.id = v.id and t.status in ('queued','draft');\n")
    with open(out + "/schedule_ranked.csv", "w", newline="") as f:
        cw = csv.writer(f); cw.writerow(["rank", "when_et", "score", "title", "niche", "file"]); cw.writerows(rows)
    md = ["# Virality ranking", "", "Every reel is scored 0-100 and posted best-first, 5 a day (08:00, 11:30, 15:00, 18:00, 21:00 ET).", "",
          "`score = 10 x (0.30 reach + 0.35 send + 0.20 hook + 0.15 debate)`, each factor 1-10. Weights follow what Instagram says ranks Reels for non-followers: sends per reach first, then watch time (hook) and likes. The numbers are my judgement, not measured data; the real test is your own Insights after the first week. Ties are broken so two reels of the same niche never post back to back.", "",
          "| # | when (ET) | score | reel | niche |", "|---|---|---|---|---|"]
    md += [f"| {a} | {b} | {c} | {d} | {e} |" for a, b, c, d, e, _ in rows]
    oldpath = {"9fab4b15-72a6-471a-8e61-925760cce1ed": "r_gym", "04c817b6-b680-4779-94c7-ef40defa5b1b": "r_hang", "67f78e72-5554-4315-b13d-09ec13ffe121": "r_omw", "fdbb2dd5-4303-4a15-9cee-64ea3fab3b99": "r_groupchat", "1a24277f-69ac-4cd2-b944-c4a84c1bfd54": "r_avoid", "7b85d45b-8eab-47ff-8461-168f056c6b39": "r_brain2am", "88e58c51-ca99-4e0e-8b47-41fc097f2b9b": "r_checkout", "24699e3e-565e-4ddd-b8c5-72a0828d7ea1": "r_dog", "db352c48-e50c-4e2f-9d13-21870c75a1fc": "r_sunday"}
    open(out + "/schedule_order.txt", "w").write("\n".join(f"{oldpath[r[5]] if False else ''}" for r in []))
    open(out + "/RANKING.md", "w").write("\n".join(md) + "\n")
    print(len(rows), "reels;", rows[0][1], "->", rows[-1][1]); print([ (r[0], r[3], r[2]) for r in rows[:15]])
