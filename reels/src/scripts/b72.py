"""Batch 72: dinners left with a grandparent, as one long table. An 80-year-old lives about 9 more years (SSA life table); monthly visits = 108 plates. The camera walks the table and the plates behind you go dark."""
import math
import numpy as np
from PIL import Image, ImageDraw
from scripts.common import *
from motion import *
import motion, voice

GOLD = (255, 214, 140); SOFT = (235, 220, 205); WHITE = (255, 255, 255); WARM = (255, 170, 120)
HOR = 600; F = 760.0; CAMH = 1.75; TOPH = .75; NP = 54
def A(b, w, d=None, occ=0): return b.at(w, occ, d)
ZP = [1.4 + k * .55 for k in range(NP)]

_bg = None
def room():
    global _bg
    if _bg is None:
        a = np.linspace(0, 1, H)[:, None, None]; top = np.array((16, 10, 14)); bot = np.array((58, 34, 26)); arr = (top * (1 - a) + bot * a) * np.ones((1, W, 1)); _bg = Image.fromarray(arr.astype(np.uint8))
    return _bg.copy()

def P(X, z, h=TOPH): return (540 + F * X / z, HOR + F * (CAMH - h) / z)

def ellipse(img, cx, cy, rx, ry, col, a=1.0):
    if rx < .6 or ry < .4: return
    pad = 3; w, h = int(2 * rx + 2 * pad), int(2 * ry + 2 * pad); p = Image.new("RGBA", (w * 2, h * 2), (0, 0, 0, 0)); ImageDraw.Draw(p).ellipse([pad * 2, pad * 2, (pad + 2 * rx) * 2, (pad + 2 * ry) * 2], fill=tuple(int(c) for c in col) + (int(255 * a),))
    p = p.resize((w, h), Image.LANCZOS); img.paste(p, (int(cx - rx - pad), int(cy - ry - pad)), p)

def scene(img, zc, lt, lit_gone=0):
    img.paste(room()); d = ImageDraw.Draw(img, "RGBA")
    # table top (receding to a vanishing point)
    z0 = max(.35, 0.1); zf = zc + 60
    near = (P(-.62, z0 + 0.001)[0], P(-.62, 0.5)[1])
    poly_pts = [P(-.62, .55), P(.62, .55), P(.62, 60), P(-.62, 60)]
    from scripts.b61 import poly
    poly(img, poly_pts, (92, 58, 40))
    # fog toward the far end
    for k in range(18):
        zz = 4 + k * 3.2; y = P(0, zz)[1]; d.rectangle([0, y - 20, W, y + 20], fill=(22, 14, 16, int(18 + k * 2)))
    # plates and candles, far to near
    left = 0
    items = []
    for k, z in enumerate(ZP):
        for X in (-.40, .40): items.append((z - zc, X, "plate"))
    for k in range(40): items.append((2.4 + k * 2.2 - zc, 0.0, "candle"))
    for dz, X, kind in sorted([i for i in items if i[0] > .25], key=lambda t: -t[0]):
        s = F / dz; cx, cy = P(X, dz)[0], HOR + F * (CAMH - TOPH) / dz; fog = clamp(1 - dz / 34) ** 1.1
        if kind == "plate":
            left += 1; rx = .15 * s; ry = rx * min(.55, 1.1 / dz * .9 + .12); a = fog
            ellipse(img, cx, cy + ry * .15, rx * 1.12, ry * 1.12, (30, 18, 16), a * .5)
            ellipse(img, cx, cy, rx, ry, (246, 240, 230), a); ellipse(img, cx, cy, rx * .72, ry * .72, (226, 220, 210), a); ellipse(img, cx, cy - ry * .04, rx * .4, ry * .4, (170, 110, 70), a)
            glow(img, cx, cy, rx * 1.6, (255, 190, 120), .22 * a)
        else:
            by = HOR + F * (CAMH - TOPH) / dz; h_ = .16 * s; w_ = .018 * s
            d.rectangle([cx - w_, by - h_, cx + w_, by], fill=(240, 230, 210, int(255 * fog))); fl = 1 + .18 * math.sin(lt * 11 + dz * 3)
            glow(img, cx, by - h_ - .02 * s, .22 * s * fl, (255, 170, 70), .7 * fog); ellipse(img, cx, by - h_ - .015 * s, w_ * 1.3, .03 * s * fl, (255, 220, 140), fog)
    return left

def hud(img, big, sub, col=GOLD):
    tx(img, big, 540, 225, 118 if len(big) < 12 else 84, "black", col, maxw=980); tx(img, sub, 540, 330, 34, "bold", SOFT, shadow=False, maxw=980)

class TBeat(Clean):
    def __init__(self, narr, kf, head, extra=None):
        self.kf, self.head, self.extra = kf, head, extra; self._pts = None
        super().__init__(narr, self._d, 3.0, cut="cut", push=0)
    def zc(self, lt):
        if self._pts is None: self._pts = sorted(self.kf(self))
        P_ = self._pts
        if lt <= P_[0][0]: return P_[0][1]
        for (t0, k0), (t1, k1) in zip(P_, P_[1:]):
            if lt <= t1: return k0 + (k1 - k0) * eio((lt - t0) / max(1e-6, t1 - t0))
        return P_[-1][1]
    def _d(self, img, lt, p, b):
        z = self.zc(lt); left = scene(img, z, lt); big, sub, col = self.head(self, lt, left)
        hud(img, big, sub, col)
        if self.extra: self.extra(img, lt, b, left)

def grandma():
    N = [
     ("If your grandma is eighty, you have about a hundred dinners left with her.", lambda b: [(0, 0), (b.dur, 2.0)], lambda b, lt, n: (f"~{n} DINNERS", "LEFT WITH A GRANDMA WHO IS 80", GOLD), None),
     ("The average eighty year old lives about nine more years. See her once a month, and that's a hundred and eight dinners.", lambda b: [(0, 2.0), (b.dur, 9.0)], lambda b, lt, n: ("12 × 9 = 108", "MONTHLY VISITS × YEARS LEFT AT 80", WARM), None),
     ("That's not a lot of plates.", lambda b: [(0, 9.0), (b.dur, 13.0)], lambda b, lt, n: (f"{n} LEFT", "EVERY STEP FORWARD IS ONE DINNER", WHITE), None),
     ("And nobody knows which one is the last.", lambda b: [(0, 13.0), (b.dur, 19.0)], lambda b, lt, n: ("WHICH ONE?", "NOBODY KNOWS WHICH DINNER IS THE LAST", GOLD), None),
     ("So go to the next one. Ask her about her life. Record the answers.", lambda b: [(0, 19.0), (b.dur, 26.0)], lambda b, lt, n: ("ASK HER", "ABOUT HER LIFE. RECORD THE ANSWERS.", GOLD), None),
     ("Send this to someone who still has a grandparent. Then call yours.", lambda b: [(0, 26.0), (b.dur, 27.6)], lambda b, lt, n: ("CALL HER", "TONIGHT", WARM), None),
    ]
    beats = [TBeat(n, kf, head, ex) for n, kf, head, ex in N]
    return Reel("414_grandma_dinners", beats, style="cine", seed=414, gain_music=.5, snap=False, grid=0, safe_zone=False, vo=[(i, n) for i, (n, kf, h, e) in enumerate(N)],
        title="you have about 108 dinners left with grandma", caption="x", story="US Social Security period life table: remaining life expectancy at age 80 is about 8-9.5 years. 12 visits a year x 9 years = 108 dinners. Illustrative: the viewer substitutes their own visit frequency.")
REELS = dict(grandma=grandma)
