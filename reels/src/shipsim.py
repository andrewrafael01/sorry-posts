"""python3 shipsim.py <out_dir> key...  -> re-encode a sim render smaller (reliable fetch), build typographic covers."""
import sys, os, subprocess
sys.path.insert(0, os.path.dirname(__file__))
import ship
R = ship.R
for key in sys.argv[2:]:
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", os.path.join(sys.argv[1], key + ".mp4"), "-c:v", "libx264", "-preset", "slow", "-b:v", "1700k", "-maxrate", "2200k", "-bufsize", "4400k", "-pix_fmt", "yuv420p", "-profile:v", "high", "-movflags", "+faststart", "-c:a", "copy", os.path.join(R, key + "_f1.mp4")], check=True)
    for v in "ABC": ship.cover(key, v)
    print("ok", key, os.path.getsize(os.path.join(R, key + "_f1.mp4")) // 1024, "KB", flush=True)
