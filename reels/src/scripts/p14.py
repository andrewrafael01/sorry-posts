"""Premium 14: double helix, hourglass, galaxy. Text-free reverse-the-spin point clouds (orthographic, equal dots, no occlusion)."""
import math
import numpy as np
from PIL import Image
import reel, trip
from scripts.common import *
from trip import hsv, rot_y, project, splat, ring
from engine import W, H

OMEGA = 2 * math.pi * .17
class Cloud2(reel.Shot):
    cut = "cut"
    def __init__(self, kind, dur=26.0, seed=1):
        self.kind, self.dur = kind, dur; rs = np.random.RandomState(seed); self.cues = []; self.extra = None
        if kind == "helix":
            n = 26000; t = rs.rand(n) * 4 * math.pi * 1.5 - 2 * math.pi * 1.5; ph = rs.randint(0, 2, n) * math.pi; R = 1.0; pitch = .165
            P = np.stack([R * np.cos(t + ph) + rs.randn(n) * .015, t * pitch + rs.randn(n) * .015, R * np.sin(t + ph) + rs.randn(n) * .015], -1).astype(np.float32); h = np.where(ph == 0, .50, .88)
            tr = np.linspace(-2 * math.pi * 1.5, 2 * math.pi * 1.5, 60); rungs = []; rh = []
            for tt in tr:
                for f in np.linspace(0, 1, 26):
                    a = np.array([R * math.cos(tt), tt * pitch, R * math.sin(tt)]); b = np.array([R * math.cos(tt + math.pi), tt * pitch, R * math.sin(tt + math.pi)]); rungs.append(a * (1 - f) + b * f); rh.append(.13)
            self.P = np.concatenate([P, np.array(rungs, np.float32)]); self.h0 = np.concatenate([h, np.array(rh)]); self.sat = .75; self.amp = np.concatenate([np.full(n, 1.5), np.full(len(rungs), 1.5)]).astype(np.float32)
            self.size = 370; self.elev = math.radians(10); self.cy = 960
        elif kind == "hourglass":
            n = 60000; y = rs.rand(n) * 2 - 1; r = .22 + .78 * np.abs(y) ** 1.4; a = rs.rand(n) * 2 * math.pi
            self.P = np.stack([r * np.cos(a), y * 1.25, r * np.sin(a)], -1).astype(np.float32); self.h0 = .08 + .55 * (y + 1) / 2 + .03 * np.sin(a * 2); self.sat = .8; self.amp = np.full(n, .9, np.float32)
            self.size = 430; self.elev = math.radians(20); self.cy = 960; self.extra = np.concatenate([ring(2200, 1.0, 1.25), ring(2200, 1.0, -1.25), ring(1400, .22, 0.0)])
        elif kind == "galaxy":
            n = 90000; arms = 3; rr = rs.rand(n) ** .62; th = rs.randint(0, arms, n) * 2 * math.pi / arms + rr * 5.2 + rs.randn(n) * (.22 + .35 * (1 - rr)) * .55
            y = rs.randn(n) * .035 * (1 - rr * .6); r = rr * 1.0
            self.P = np.stack([r * np.cos(th), y, r * np.sin(th)], -1).astype(np.float32); self.h0 = .09 + .56 * rr ** .8; self.sat = .75; self.amp = (1.1 - .6 * rr).astype(np.float32)
            self.size = 480; self.elev = math.radians(52); self.cy = 960
        self.phase = rs.rand(len(self.P)) * 6.28
    def render(self, lt):
        th = OMEGA * lt * (.8 if self.kind == "galaxy" else 1.0); fade = min(1.0, lt / .9, (self.dur - lt) / .9); buf = np.zeros((H, W, 3), np.float32)
        P = rot_y(self.P, th); x, y = project(P, self.elev, self.size, W / 2, self.cy); tw = (.72 + .28 * np.sin(lt * 3.1 + self.phase))[:, None]
        splat(buf, x, y, hsv(self.h0 + .018 * lt, self.sat, 1.0) * self.amp[:, None] * tw, 1.0)
        if self.extra is not None:
            x2, y2 = project(rot_y(self.extra, th), self.elev, self.size, W / 2, self.cy); splat(buf, x2, y2, np.tile(np.array([[1.0, .8, .45]], np.float32), (len(x2), 1)) * 1.2, .55)
        if self.kind == "galaxy":   # warm glowing core
            c = np.random.RandomState(9).randn(6000, 3).astype(np.float32) * np.array([.06, .02, .06], np.float32); cx2, cy2 = project(rot_y(c, th), self.elev, self.size, W / 2, self.cy); splat(buf, cx2, cy2, np.tile(np.array([[1.0, .8, .5]], np.float32), (6000, 1)) * 1.6, 1.0)
        img = trip.finish(buf, exposure=1.1 if self.kind != "galaxy" else .95); return Image.fromarray((img * fade).astype(np.uint8), "RGB")

def mk(kind, num, name, seed):
    def f(): return reel.Reel(f"{num}_{name}", [Cloud2(kind, 26.0, seed)], style="cine", seed=num, gain_music=.85, loop=True, snap=False, grid=0, safe_zone=False, title="reverse the spin", caption="x", story="Orthographic dot cloud, no depth cues: bistable rotation.")
    return f
REELS = dict(helix=mk("helix", 516, "spin_helix", 5), hourglass=mk("hourglass", 517, "spin_hourglass", 6), galaxy=mk("galaxy", 518, "spin_galaxy", 7))
