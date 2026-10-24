"""Premium 13: spinning dancer silhouette and flipping wireframe cube. No text. Orthographic, flat silhouette, no depth cues: direction is bistable."""
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy.ndimage import gaussian_filter
import reel, trip
from scripts.common import *
from trip import hsv, rot_y, project, splat, ring
from engine import W, H

OMEGA = 2 * math.pi * .20
def bg_img(lt, h0=.74):
    key = None; yy = np.linspace(0, 1, H, dtype=np.float32)[:, None]; xx = np.linspace(-1, 1, W, dtype=np.float32)[None, :]
    r = np.sqrt(xx ** 2 * .6 + (yy - .5) ** 2 * 1.4); base = hsv(np.full((H, W), (h0 + .02 * lt) % 1), .65, 1.0) * np.clip(.45 - r * .55, 0, .45)[..., None]
    return base.astype(np.float32)

# --- dancer skeleton: (a, b, radius) capsules in a y-up unit space, hips at origin, plus the tutu ring
BONES = [((0, 0, 0), (0, .46, 0), .135), ((0, .46, 0), (0, .66, 0), .07), ((-.18, .46, 0), (.18, .46, 0), .085),
         ((-.18, .46, 0), (-.32, .72, .05), .052), ((-.32, .72, .05), (-.13, 1.0, .10), .042), ((.18, .46, 0), (.34, .70, -.05), .052), ((.34, .70, -.05), (.15, 1.0, -.10), .042),
         ((-.08, 0, 0), (-.08, -.44, .03), .085), ((-.08, -.44, .03), (-.08, -.88, 0), .058), ((-.08, -.88, 0), (-.08, -.95, .12), .032),
         ((.08, 0, 0), (.22, -.22, -.26), .078), ((.22, -.22, -.26), (.14, -.52, -.52), .054), ((.14, -.52, -.52), (.14, -.56, -.68), .030),
         ((0, .90, -.06), (0, .90, -.06), .05)]
HEAD = ((0, .78, 0), .115)
def dancer_mask(th, elev, scale, cx, cy, ss=2):
    w, h = W * ss, H * ss; im = Image.new("L", (w, h), 0); d = ImageDraw.Draw(im)
    def P(p):
        q = rot_y(np.array([p], np.float32), th); x, y = project(q, elev, scale * ss, cx * ss, cy * ss); return float(x[0]), float(y[0])
    for a, b, r in BONES:
        pa, pb = P(a), P(b); rr = r * scale * ss; d.line([pa, pb], fill=255, width=int(2 * rr)); d.ellipse([pa[0] - rr, pa[1] - rr, pa[0] + rr, pa[1] + rr], fill=255); d.ellipse([pb[0] - rr, pb[1] - rr, pb[0] + rr, pb[1] + rr], fill=255)
    c, r = HEAD; pc = P(c); rr = r * scale * ss; d.ellipse([pc[0] - rr, pc[1] - rr * 1.12, pc[0] + rr, pc[1] + rr * 1.12], fill=255)
    tut = [P((.30 * math.cos(a), -.04 + .02 * math.sin(a * 2), .30 * math.sin(a))) for a in np.linspace(0, 2 * math.pi, 60)]; d.polygon(tut, fill=255)
    return np.asarray(im.resize((W, H), Image.LANCZOS), np.float32) / 255.0

class Dancer(reel.Shot):
    cut = "cut"
    def __init__(self, dur=26.0): self.dur = dur; self.cues = []
    def render(self, lt):
        th = OMEGA * lt; fade = min(1.0, lt / .9, (self.dur - lt) / .9); m = dancer_mask(th, math.radians(14), 560, W / 2, 1040)
        base = bg_img(lt, .78); glow1 = gaussian_filter(m, 6)[..., None] * hsv(np.full((1, 1), (.52 + .02 * lt) % 1), .8, 1.0)[0] * 1.1; glow2 = gaussian_filter(m, 24)[..., None] * hsv(np.full((1, 1), (.60 + .02 * lt) % 1), .8, 1.0)[0] * .9
        # a glowing floor ellipse the dancer spins above (rotationally symmetric, so it adds no direction cue)
        yy, xx = np.mgrid[0:H, 0:W].astype(np.float32); e = ((xx - W / 2) / 330) ** 2 + ((yy - 1620) / 70) ** 2; floor = np.exp(-e * 1.4)[..., None] * np.array([.55, .35, 1.0], np.float32) * .55
        out = base + floor + glow2 * .7 + glow1 * .8 + m[..., None] * np.array([1.0, .97, 1.0], np.float32) * .95
        out = 1 - np.exp(-out * 1.5); return Image.fromarray((np.clip(out, 0, 1) * 255 * fade).astype(np.uint8), "RGB")

CUBE = np.array([[x, y, z] for x in (-1, 1) for y in (-1, 1) for z in (-1, 1)], np.float32)
EDGES = [(i, j) for i in range(8) for j in range(i + 1, 8) if np.abs(CUBE[i] - CUBE[j]).sum() == 2]
class Cube(reel.Shot):
    cut = "cut"
    def __init__(self, dur=26.0): self.dur = dur; self.cues = []; self.rs = np.random.RandomState(5); self.fog = (self.rs.rand(9000, 3).astype(np.float32) - .5) * np.array([5.2, 6.4, 5.2], np.float32)
    def render(self, lt):
        th = OMEGA * lt; fade = min(1.0, lt / .9, (self.dur - lt) / .9); buf = np.zeros((H, W, 3), np.float32); elev = math.radians(26); sc = 300
        V = rot_y(CUBE, th); x, y = project(V, elev, sc, W / 2, 960)
        for (i, j) in EDGES:
            n = 900; t = np.linspace(0, 1, n, dtype=np.float32)[:, None]; P = CUBE[i][None] * (1 - t) + CUBE[j][None] * t; Q = rot_y(P, th); ex, ey = project(Q, elev, sc, W / 2, 960)
            col = hsv(np.full(n, (.56 + .06 * (i + j) / 8 + .02 * lt) % 1), .75, 1.0) * 5.0; splat(buf, ex, ey, col, 1.0)
        splat(buf, x, y, np.tile(hsv(np.array([.12]), .5, 1.0), (8, 1)) * 70.0, 1.0)
        F = rot_y(self.fog, th * .35); fx, fy = project(F, elev, 190, W / 2, 960); splat(buf, fx, fy, hsv(self.fog[:, 0] * .08 + .72, .6, 1.0) * 1.1, 1.0)
        img = trip.finish(buf, glow1=3.0, glow2=14.0, g1=1.0, g2=.9, exposure=1.05, size=1.3); return Image.fromarray((img * fade).astype(np.uint8), "RGB")

def mk(cls, num, name):
    def f(): return reel.Reel(f"{num}_{name}", [cls(26.0)], style="cine", seed=num, gain_music=.85, loop=True, snap=False, grid=0, safe_zone=False, title="reverse the spin", caption="x", story="Orthographic bistable rotation: no depth cues.")
    return f
REELS = dict(dancer=mk(Dancer, 514, "spin_dancer"), cube=mk(Cube, 515, "flip_cube"))
