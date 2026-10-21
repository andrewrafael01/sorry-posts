import sys, os, importlib, time, argparse
sys.path.insert(0, os.path.dirname(__file__))
from PIL import Image
S = "/tmp/claude-0/-home-user-sorry-posts/aeda3cd8-6be4-5731-8b3d-d9639f60d4f0/scratchpad/"
def load(mod): return importlib.import_module("scripts." + mod)
def preview(r, n=12, path=None):
    ts = [r.dur * (i + .5) / n for i in range(n)]
    sheet = Image.new("RGB", (6 * 270, ((n + 5) // 6) * 480))
    for i, t in enumerate(ts): sheet.paste(r.frame(t).resize((270, 480)), ((i % 6) * 270, (i // 6) * 480))
    sheet.save(path or S + r.name + "_prev.png")
if __name__ == "__main__":
    ap = argparse.ArgumentParser(); ap.add_argument("mod"); ap.add_argument("name", nargs="?"); ap.add_argument("--preview", action="store_true"); ap.add_argument("--out", default="..")
    a = ap.parse_args(); m = load(a.mod)
    for name, fn in m.REELS.items():
        if a.name and name != a.name: continue
        r = fn(); print(name, "dur", round(r.dur, 1), "bpm", r.bpm, "shots", [round(s.dur, 1) for s in r.shots])
        if a.preview: preview(r, 12)
        else: t0 = time.time(); p = r.render(a.out); print("rendered", p, round(time.time() - t0), "s", os.path.getsize(p) // 1024, "KB")
