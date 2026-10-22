"""SQL for three trial-reel rows per video (variants A stat, B question, C shock), 25 minutes apart.
python3 trials.py 411_dog_days "your dog only has about 4,380 days" "2026-10-22 19:00"   (ET)   or  NOW   for 'in two minutes'"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__)); import captions
B = "https://raw.githubusercontent.com/andrewrafael01/sorry-posts/claude/100-credits-usage-9ysxsh/reels/"
def sql(name, title, when, gap=25):
    rows = []
    for k, v in enumerate("ABC"):
        ts = f"now() + interval '{2 + k * gap} minutes'" if when == "NOW" else f"(timestamp '{when}' + interval '{k * gap} minutes') at time zone 'America/New_York'"
        rows.append(f"($q${title}$q$, '{B}{name}_v2.mp4', $q${captions.cap(name)}$q$, {ts}, 'queued', true, '{B}covers/{name}_{v}.jpg', '{v}', '{name}')")
    return "insert into ig_reels (title, video_path, caption, scheduled_at, status, trial, cover_url, variant, group_key) values\n" + ",\n".join(rows) + ";"
if __name__ == "__main__": print(sql(sys.argv[1], sys.argv[2], sys.argv[3]))

def normal(name, title, when, variant):
    """one ordinary reel post with an engineered cover (trial reels need a larger account)"""
    return (f"insert into ig_reels (title, video_path, caption, scheduled_at, status, cover_url, variant, group_key) values ($q${title}$q$, '{B}{name}_v2.mp4', $q${captions.cap(name)}$q$, "
            f"(timestamp '{when}' at time zone 'America/New_York'), 'queued', '{B}covers/{name}_{variant}.jpg', '{variant}', '{name}');")
