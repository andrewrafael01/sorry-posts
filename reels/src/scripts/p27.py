"""Premium 27: cute spinners. A smiling flame, heart, star and ghost built from glittering dots as thick pillows with a face on both sides; orthographic, equal dots, no occlusion, so the spin direction flips at will. No text, no voice."""
import math
import numpy as np
from PIL import Image, ImageDraw
from scipy.ndimage import gaussian_filter, distance_transform_edt
import reel, trip
from trip import hsv, rot_y, project, splat
from engine import W, H

OMEGA = 2 * math.pi * .17; M = 640
def blob(draw_fn, blur=5.0):
    im = Image.new("L", (M * 2, M * 2), 0); d = ImageDraw.Draw(im); draw_fn(d, 2); a = gaussian_filter(np.asarray(im, np.float32) / 255, blur * 2)
    return np.asarray(Image.fromarray(((a > .5) * 255).astype(np.uint8)).resize((M, M), Image.LANCZOS)) > 127
def feats(draw_fn):
    im = Image.new("L", (M * 2, M * 2), 0); d = ImageDraw.Draw(im); draw_fn(d, 2); return np.asarray(im.resize((M, M), Image.LANCZOS)) > 100
def smile(d, s, cx, cy, w, h, lw):
    d.arc([(cx - w) * s, (cy - h) * s, (cx + w) * s, (cy + h) * s], 20, 160, fill=255, width=int(lw * s))
def eyes(d, s, ex, ey, rx, ry, sep):
    for k in (-1, 1): d.ellipse([(ex + k * sep - rx) * s, (ey - ry) * s, (ex + k * sep + rx) * s, (ey + ry) * s], fill=255)

def flame_body(d, s):
    d.ellipse([105 * s, 185 * s, 535 * s, 615 * s], fill=255)
    pts = []
    for y in np.linspace(30, 400, 60):
        t = (400 - y) / 370; hw = 215 * (1 - t) ** 1.5 * 1.0; cx = 320 + 70 * t ** 2.2; pts.append(((cx + hw) * s, y * s))
    for y in np.linspace(400, 30, 60):
        t = (400 - y) / 370; hw = 215 * (1 - t) ** 1.5; cx = 320 + 70 * t ** 2.2; pts.append(((cx - hw) * s, y * s))
    d.polygon(pts, fill=255)
    d.polygon([(400 * s, 250 * s), (470 * s, 130 * s), (535 * s, 360 * s)], fill=255)
def heart_body(d, s):
    d.ellipse([60 * s, 90 * s, 330 * s, 360 * s], fill=255); d.ellipse([310 * s, 90 * s, 580 * s, 360 * s], fill=255)
    d.polygon([(72 * s, 280 * s), (568 * s, 280 * s), (320 * s, 590 * s)], fill=255)
def star_body(d, s):
    pts = []
    for k in range(10):
        r = 300 if k % 2 == 0 else 150; a = -math.pi / 2 + k * math.pi / 5; pts.append(((320 + r * math.cos(a)) * s, (330 + r * math.sin(a)) * s))
    d.polygon(pts, fill=255)
def ghost_body(d, s):
    d.pieslice([100 * s, 40 * s, 540 * s, 480 * s], 180, 360, fill=255); d.rectangle([100 * s, 260 * s, 540 * s, 545 * s], fill=255)
    for cx in (173, 320, 467): d.ellipse([(cx - 74) * s, (545 - 74) * s, (cx + 74) * s, (545 + 74) * s], fill=255)
SHAPES = {
 "flame": dict(body=flame_body, blur=4, face=lambda d, s: (eyes(d, s, 320, 400, 26, 38, 78), smile(d, s, 320, 440, 70, 56, 16)), hue=(.12, .02), th=.32, sc=410),
 "heart": dict(body=heart_body, blur=4, face=lambda d, s: (eyes(d, s, 320, 275, 24, 36, 78), smile(d, s, 320, 312, 62, 50, 15)), hue=(.97, .90), th=.34, sc=420),
 "star": dict(body=star_body, blur=5, face=lambda d, s: (eyes(d, s, 320, 330, 20, 30, 56), smile(d, s, 320, 362, 48, 38, 13)), hue=(.15, .10), th=.30, sc=430),
 "ghost": dict(body=ghost_body, blur=6, face=lambda d, s: (eyes(d, s, 320, 270, 26, 42, 76), d.ellipse([296 * s, 350 * s, 344 * s, 410 * s], fill=255)), hue=(.55, .62), th=.33, sc=400),
}
def build(name, seed):
    S = SHAPES[name]; rs = np.random.RandomState(seed); mask = blob(S["body"], S["blur"]); fm = feats(S["face"]) & mask
    dist = distance_transform_edt(mask); dn = dist / dist.max()
    ys, xs = np.nonzero(mask); n = 24000; pick = rs.randint(0, len(xs), n)
    px, py = xs[pick].astype(np.float32), ys[pick].astype(np.float32); z = S["th"] * np.sqrt(np.clip(dn[py.astype(int), px.astype(int)], 0, 1)) * rs.choice([-1, 1], n)
    z = z + rs.randn(n) * .008
    P = np.stack([(px - M / 2) / (M / 2), -(py - M / 2) / (M / 2), z], -1).astype(np.float32)
    h = S["hue"][0] + (S["hue"][1] - S["hue"][0]) * (py / M) + rs.randn(n) * .01; amp = np.full(n, S.get('amp', 1.15), np.float32)
    # face: denser, bright white dots on both faces, nudged just proud of the surface
    fy, fx = np.nonzero(fm); m = 5500; pk = rs.randint(0, len(fx), m); qx, qy = fx[pk].astype(np.float32), fy[pk].astype(np.float32); side = rs.choice([-1, 1], m)
    fz = (S["th"] * np.sqrt(np.clip(dn[qy.astype(int), qx.astype(int)], 0, 1)) + .012) * side
    F = np.stack([(qx - M / 2) / (M / 2), -(qy - M / 2) / (M / 2), fz], -1).astype(np.float32)
    return np.concatenate([P, F]), np.concatenate([h, np.full(m, .0)]), np.concatenate([amp, np.full(m, 1.8, np.float32)]), np.concatenate([np.full(n, .85), np.full(m, .0)]).astype(np.float32)
class Cute(reel.Shot):
    cut = "cut"
    def __init__(self, name, dur=26.0, seed=1):
        self.name, self.dur, self.cues = name, dur, []; self.P, self.h0, self.amp, self.sat = build(name, seed); self.size = SHAPES[name]["sc"]; self.phase = np.random.RandomState(seed + 1).rand(len(self.P)) * 6.28
    def render(self, lt):
        th = OMEGA * lt; fade = min(1.0, lt / .9, (self.dur - lt) / .9); buf = np.zeros((H, W, 3), np.float32)
        P = rot_y(self.P, th); x, y = project(P, math.radians(8), self.size * 1.38, W / 2, 940); tw = (.78 + .22 * np.sin(lt * 3.3 + self.phase))[:, None]
        splat(buf, x, y, hsv(self.h0 + .01 * math.sin(lt * .7), self.sat, 1.0) * self.amp[:, None] * tw, 1.0)
        img = trip.finish(buf, exposure=1.05); return Image.fromarray((img * fade).astype(np.uint8), "RGB")
def mk(name, num, seed):
    def f(): return reel.Reel(f"{num}_cute_{name}", [Cute(name, 26.0, seed)], style="cine", seed=num, gain_music=.85, loop=True, snap=False, grid=0, safe_zone=False, title="reverse the spin", caption="x", story=f"Cute {name}: pillow-thick dot cloud with a white-dot smiling face on both sides, orthographic and occlusion-free so the spin direction is bistable.")
    return f
REELS = dict(flame=mk("flame", 533, 11), heart=mk("heart", 534, 12), star=mk("star", 535, 13), ghost=mk("ghost", 536, 14))
