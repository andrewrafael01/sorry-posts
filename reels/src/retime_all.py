"""Compress every long re-voiced reel to ~15-20 s: new beat lengths, audio re-voiced to them, scene time-warped to the old (source) beat timing via srcStart/srcDur."""
import json, os, subprocess, sys, shutil
from concurrent.futures import ThreadPoolExecutor
W3 = "/home/user/sorry-posts/reels/w3d"; TMP = "/tmp/retime"; os.makedirs(TMP, exist_ok=True)
KEYS = sys.argv[1:]
PLAIN = json.load(open('/home/user/sorry-posts/reels/src/plain_labels.json'))
def run(k):
    cur = json.load(open(f"{W3}/tl/{k}.json")); bs = cur["beats"]
    src = [(b.get("srcStart", b["start"]), b.get("srcDur", b["dur"])) for b in bs]
    newd = [3.6] + [2.6] * (len(bs) - 2) + [3.0]
    narrs = [b["narr"] for b in bs]; num = int(k[:3])
    if k[:3] in PLAIN and len(PLAIN[k[:3]]) == len(bs) - 1: narrs = [bs[0]["narr"]] + PLAIN[k[:3]]; out = f"{TMP}/{k}"; os.makedirs(out, exist_ok=True)
    env = dict(os.environ, MIN_DURS=json.dumps(newd))
    r = subprocess.run(["python3", "tl3d.py", k + "_rt", str(num), "cine", ".35", out] + narrs, env=env, capture_output=True, text=True, cwd="/home/user/sorry-posts/reels/src")
    j = f"{out}/{k}_rt.json"; w = f"{out}/{k}_rt.wav"
    if not (os.path.exists(j) and os.path.exists(w)): return f"FAIL {k} {r.stderr[-120:]}"
    t = json.load(open(j)); t["key"] = k
    for b, (ss, sd) in zip(t["beats"], src): b["srcStart"] = round(ss, 3); b["srcDur"] = round(sd, 3)
    if "hookT" in cur: t["hookT"] = cur["hookT"]
    json.dump(t, open(f"{W3}/tl/{k}.json", "w"), indent=1)
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", w, "-c:a", "aac", "-b:a", "192k", f"{W3}/tl/{k}.m4a"])
    return f"{k}: {round(t['dur'],1)}s (was {round(sum(sd for _,sd in src),1)}s)"
with ThreadPoolExecutor(3) as ex:
    for line in ex.map(run, KEYS): print(line, flush=True)
