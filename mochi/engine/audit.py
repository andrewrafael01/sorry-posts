import subprocess, os, sys
from PIL import Image, ImageDraw, ImageFont
from content import REELS, CAROUSELS, CAR_DATES
R = "/tmp/claude-0/cats/mochi"; A = R+"/audit"
def times(beats):
    T = []; t = 0.0
    for i, (txt, spec, sub) in enumerate(beats):
        n = txt.count("\n")+1; d = 2.25+0.3*(n-1)+(0.5 if sub else 0)
        if i == len(beats)-1: d = max(d, 3.2)+0.3
        T.append(t+min(d-0.15, 1.3+(0.4 if sub else 0))); t += d
    return T
def grab(path, ts):
    ims = []
    for t in ts:
        out = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{t:.2f}", "-i", path, "-frames:v", "1", "-f", "image2pipe", "-vcodec", "png", "-"], capture_output=True).stdout
        import io; ims.append(Image.open(io.BytesIO(out)).convert("RGB").resize((200, 356)))
    return ims
def sheet(items, name):
    W = 200*7+160; H = 356*len(items)
    s = Image.new("RGB", (W, H), "white"); d = ImageDraw.Draw(s)
    for r, (label, ims) in enumerate(items):
        d.text((6, r*356+10), label, fill=(0, 0, 0))
        for i, im in enumerate(ims): s.paste(im, (160+i*200, r*356))
        d.line((0, r*356, W, r*356), fill=(200, 0, 0), width=2)
    s.save(f"{A}/{name}.jpg", quality=80)
kind = sys.argv[1]
items = []
if kind == "A":
    for i, (n, cap, beats) in enumerate(REELS):
        items.append((f"{i+1:02d} {n}", grab(f"{R}/reels/{i+1:02d}_{n}.mp4", times(beats))))
elif kind == "B":
    for i, (n, cap, slides) in enumerate(CAROUSELS):
        if n in CAR_DATES: continue
        beats = list(slides); t, sp, sub = beats[-1]
        if not sub or "send" not in sub: beats[-1] = (t, sp, "send this to someone who needs it")
        items.append((f"{100+i+1} {n}", grab(f"{R}/reels/{100+i+1}_c_{n}.mp4", times(beats))))
for k in range(0, len(items), 6): sheet(items[k:k+6], f"{kind}{k//6:02d}")
print(len(items))
