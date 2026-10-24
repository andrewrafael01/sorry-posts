"""Covers from the real rendered frames: scrimmed headline over the hero frame. python3 cover3d.py <video> <key> <t> "LINE1" "LINE2" [colour]"""
import sys, os, subprocess
sys.path.insert(0, os.path.dirname(__file__))
from PIL import Image, ImageDraw
from facts import *
R = os.path.join(os.path.dirname(__file__), "..")
def make(video, key, t, l1, l2, col=(255, 214, 0)):
    tmp = os.path.join(R, "covers", f"_{key}.png"); subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(t), "-i", video, "-frames:v", "1", tmp], check=True)
    base = Image.open(tmp).convert("RGB"); os.remove(tmp); compose(base, key, l1, l2, col)

def compose(base, key, l1, l2, col=(255, 214, 0)):
    for v, (a, b, c) in {"A": (l1, l2, 0), "B": (l1, l2, 1), "C": (l1, l2, 2)}.items():
        img = base.copy(); ov = Image.new("RGBA", img.size, (0, 0, 0, 0)); d = ImageDraw.Draw(ov)
        for y in range(0, 760):
            d.line([(0, y), (1080, y)], fill=(0, 0, 0, int(215 * (1 - y / 760) ** 1.3)))
        img.paste(ov, (0, 0), ov)
        tx(img, l1, 540, 230, 104 if len(l1) < 14 else 82, "black", WHITE, maxw=1000, shadow=True); tx(img, l2, 540, 380, 118 if len(l2) < 10 else 84, "black", col, maxw=1000, shadow=True)
        img.save(os.path.join(R, "covers", f"{key}_{v}.jpg"), quality=93)
if __name__ == "__main__":
    make(sys.argv[1], sys.argv[2], float(sys.argv[3]), sys.argv[4], sys.argv[5], tuple(int(x) for x in sys.argv[6].split(",")) if len(sys.argv) > 6 else (255, 214, 0))
