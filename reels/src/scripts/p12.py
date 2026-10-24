"""Premium 12: trippy reverse-the-spin point clouds. No text, no explanation: dots that rotate with no depth cues, so the spin flips when the viewer wills it."""
import math
import numpy as np
from PIL import Image
import reel, trip
from scripts.common import *
from trip import hsv, rot_y, project, splat, ring, cylinder_pts, hemisphere_pts, sphere_pts, torus_pts
from premium import sphere

OMEGA = 2 * math.pi * .17        # rotation speed rad/s
class Cloud(reel.Shot):
    cut = "cut"
    def __init__(self, kind, dur=26.0, seed=1):
        self.kind, self.dur = kind, dur; rs = np.random.RandomState(seed); self.rs = rs; self.cues = []
        if kind == "cyl":
            P, a, y = cylinder_pts(15000, 1.0, .85, rs); self.P = P; self.h0 = .58 + .10 * np.sin(a * 2) + .06 * y; self.sat = .7; self.amp = .95; self.size = 500; self.elev = math.radians(24); self.cy = 1010
            self.rims = np.concatenate([ring(1800, 1.0, .425), ring(1800, 1.0, -.425)]); self.rimcol = hsv(np.full(3600, .63), .8, 1.0) * 1.1
        elif kind == "bowl":
            P, u, z = hemisphere_pts(64000, 1.0, rs); self.P = P; self.h0 = rs.rand(len(u)) * .95; self.sat = .75; self.amp = .85; self.size = 520; self.elev = math.radians(27); self.cy = 930
            self.rims = ring(3200, 1.0, 0.0); self.rimcol = np.tile(np.array([[1.0, .78, .25]], np.float32), (3200, 1)) * 1.3
        elif kind == "sphere":
            P, u, z = sphere_pts(70000, 1.0, rs); self.P = P; self.h0 = .85 - .55 * (z + 1) / 2 + .08 * np.sin(u * 3); self.sat = .85; self.amp = .80; self.size = 470; self.elev = math.radians(18); self.cy = 960
            self.rims = ring(3000, 1.0, 0.0); self.rimcol = np.tile(np.array([[1.0, 1.0, 1.0]], np.float32), (3000, 1)) * .9
        elif kind == "torus":
            P, u, v = torus_pts(70000, 1.0, .40, rs); self.P = P; self.h0 = .50 + .30 * np.sin(v); self.sat = .8; self.amp = .85; self.size = 330; self.elev = math.radians(38); self.cy = 960
            self.rims = np.zeros((0, 3), np.float32); self.rimcol = np.zeros((0, 3), np.float32)
        self.phase = rs.rand(len(self.P)) * 6.28
    def render(self, lt):
        th = OMEGA * lt; fade = min(1.0, lt / .9, (self.dur - lt) / .9); buf = np.zeros((H, W, 3), np.float32)
        P = rot_y(self.P, th); x, y = project(P, self.elev, self.size, W / 2, self.cy); tw = (.70 + .30 * np.sin(lt * 3.1 + self.phase))[:, None]; col = hsv(self.h0 + .018 * lt, self.sat, 1.0) * self.amp
        splat(buf, x, y, col * tw, 1.0)
        if len(self.rims): Rr = self.rims; x2, y2 = project(Rr, self.elev, self.size, W / 2, self.cy); splat(buf, x2, y2, self.rimcol, .55)
        if self.kind == "cyl":                            # orange orb riding the top rim: its direction is as ambiguous as the dots
            ang = th * 1.0 + .6; o = np.array([[math.cos(ang), .425, math.sin(ang)]], np.float32); ox, oy = project(o, self.elev, self.size, W / 2, self.cy)
            pil = Image.fromarray((np.clip(trip.finish(buf, size=.8), 0, 255)), "RGB"); sphere(pil, float(ox[0]), float(oy[0]) - 40, 82, (255, 120, 40), tex="noise", emissive=.55, atmo=(255, 190, 90), seed=7, rot=th * 2.5)
            return Image.eval(pil, lambda v: int(v * fade))
        img = trip.finish(buf); return Image.fromarray((img * fade).astype(np.uint8), "RGB")

def mk(kind, num, name, seed=1, dur=26.0, style="cine"):
    def f():
        return reel.Reel(f"{num}_{name}", [Cloud(kind, dur, seed)], style=style, seed=num, gain_music=.85, loop=True, snap=False, grid=0, safe_zone=False, title="reverse the spin", caption="x", story="Orthographic dot cloud with no depth cues (kinetic depth effect): rotation direction is bistable.")
    return f
REELS = dict(cyl=mk("cyl", 510, "spin_cylinder"), bowl=mk("bowl", 511, "spin_bowl", 2), sphere=mk("sphere", 512, "spin_sphere", 3), torus=mk("torus", 513, "spin_torus", 4))
