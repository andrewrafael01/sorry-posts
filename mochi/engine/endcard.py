"""Follow end card (Nov 26). Overlays '*follow* for a new one every day' in the free band above the headline
for the last 1.6 s of a Reel. Adds no length (watch time and loops untouched).
usage: python3 endcard.py <file.mp4> [...]   (edits in place; skips files already listed in endcard_done.txt)
Not for series episodes (they carry their own follow line) or films."""
import sys, os, subprocess, json
from PIL import Image
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import soft
HERE = os.path.dirname(os.path.abspath(__file__))
DONE = os.path.join(HERE, "endcard_done.txt")
PNG = "/tmp/claude-0/cats/mochi/endcard.png"

def card():
    if os.path.exists(PNG): return PNG
    cv = Image.new("RGBA", (1080, 1920), (0, 0, 0, 0))
    soft.text(cv, "*follow* for a new one every day", 205, size=46, col=(150, 140, 170))
    cv.save(PNG); return PNG

def done():
    return set(open(DONE).read().split()) if os.path.exists(DONE) else set()

def apply(path):
    name = os.path.basename(path)
    if name in done() or name.startswith("s") and name[1:3].isdigit() or name.startswith("film"): return False
    d = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path]).decode())
    st = max(0.0, d - 1.6); tmp = path + ".ec.mp4"
    fc = f"[1:v]format=rgba,fade=in:st={st:.2f}:d=0.3:alpha=1[o];[0:v][o]overlay=0:0:enable='gte(t,{st:.2f})'[v]"
    subprocess.check_call(["ffmpeg", "-loglevel", "error", "-y", "-i", path, "-loop", "1", "-t", f"{d:.3f}", "-i", card(),
                           "-filter_complex", fc, "-map", "[v]", "-map", "0:a?", "-c:v", "libx264", "-preset", "veryfast", "-crf", "20",
                           "-pix_fmt", "yuv420p", "-c:a", "copy", "-movflags", "+faststart", tmp])
    os.replace(tmp, path)
    with open(DONE, "a") as f: f.write(name + "\n")
    return True

if __name__ == "__main__":
    for p in sys.argv[1:]:
        print("endcard", os.path.basename(p), apply(p), flush=True)
