"""Premium 26: a breathing Ebbinghaus. Both orange spheres stay exactly the same size while the rings of blue spheres around them swell and shrink in opposite time; each centre seems to pulse. Then identical rings draw around both. No text, no voice."""
import math
import numpy as np
from PIL import Image, ImageDraw
import reel
from engine import W, H
from premium import sphere, bloom, vignette

RC = 72; GAP = 46; Y1, Y2 = 560, 1370; CXC = W / 2
ORANGE = (255, 138, 30); BLUE = (64, 118, 255)
_bg = {}
def bg():
    if "b" not in _bg:
        yy, xx = np.mgrid[0:H, 0:W].astype(np.float32); d = np.hypot((xx - W / 2) / W, (yy - H / 2) / H)
        c = np.array([22, 26, 52], np.float32)[None, None] * (1.15 - 1.1 * d)[..., None] + np.array([6, 8, 18], np.float32)[None, None] * d[..., None] * 1.1
        _bg["b"] = Image.fromarray(np.clip(c, 0, 255).astype(np.uint8), "RGB")
    return _bg["b"].copy()
def cluster(img, cy, rs, rot):
    n = 6; dist = RC + GAP + rs
    for k in range(n):
        a = rot + 2 * math.pi * k / n; x = CXC + dist * math.cos(a); y = cy + dist * math.sin(a)
        sphere(img, x, y, rs, BLUE, light=(-.55, -.6), tex="plain", ambient=.22)
    sphere(img, CXC, cy, RC, ORANGE, light=(-.55, -.6), tex="plain", ambient=.22)
def smooth(u): u = max(0.0, min(1.0, u)); return u * u * (3 - 2 * u)
class Breath(reel.Shot):
    cut = "cut"
    def __init__(self, dur=26.0): self.dur = dur; self.cues = []
    def render(self, lt):
        img = bg(); ph = lt * 2 * math.pi / 5.2
        rs_a = 76 + 39 * math.sin(ph); rs_b = 76 - 39 * math.sin(ph)      # 37 .. 115, in opposite phase, never touching
        cluster(img, Y1, rs_a, lt * .12); cluster(img, Y2, rs_b, -lt * .12 + .5)
        # proof: both centres get the same white ring, drawn on over three seconds
        u = smooth((lt - 15.0) / 3.0) * (1 - smooth((lt - 22.0) / 1.5))
        if u > 0:
            ov = Image.new("RGBA", (W * 2, H * 2), (0, 0, 0, 0)); d = ImageDraw.Draw(ov)
            for cy in (Y1, Y2):
                bb = [(CXC - RC - 9) * 2, (cy - RC - 9) * 2, (CXC + RC + 9) * 2, (cy + RC + 9) * 2]
                d.arc(bb, -90, -90 + 360 * u, fill=(255, 255, 255, 255), width=8)
            ov = ov.resize((W, H), Image.LANCZOS); img.paste(ov, (0, 0), ov)
        bloom(img, 215, .25, 10); vignette(img, .45)
        fade = min(1.0, lt / .7, (self.dur - lt) / .7); return Image.eval(img, lambda v: int(v * fade))
def mk():
    return reel.Reel("532_breathing_ebbinghaus", [Breath(26.0)], style="cine", seed=532, gain_music=.85, loop=True, snap=False, grid=0, safe_zone=False, title="breathing circles", caption="x", story="Ebbinghaus: two identical 72 px orange spheres inside rings of blue spheres that swell and shrink in opposite phase; at 15 s identical white rings draw around both.")
REELS = dict(eb=mk)
