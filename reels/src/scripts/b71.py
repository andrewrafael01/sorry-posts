"""Batch 71: your lifetime coffee as bathtubs. One cup a day from 20 to 80 = 21,900 cups = 5,256 L = 35 bathtubs (150 L each)."""
import math
import numpy as np
from PIL import Image, ImageDraw
from scripts.common import *
from motion import *
import motion, voice

COF = (92, 54, 30); COF2 = (140, 86, 48); CREAM = (240, 226, 205); GOLD = (255, 214, 0); SOFT = (225, 205, 190); WHITE = (255, 255, 255)
def A(b, w, d=None, occ=0): return b.at(w, occ, d)
def bg(img): img.paste(vgrad((38, 24, 20), (92, 60, 40), key="cafe"))

def _prof(cx, yt, yb, w, r):
    """x-extents of a bathtub-like profile (flat top, curved bottom corners) at height y"""
    def f(y):
        if y <= yb - r: return cx - w / 2, cx + w / 2
        dy = y - (yb - r); k = math.sqrt(max(0.0, r * r - dy * dy)); return cx - w / 2 + r - k, cx + w / 2 - r + k
    return f

def tub(img, cx, cy, w, fill, t, a=1.0, tint=COF):
    """A clawfoot-style bathtub (side view) with coffee at level `fill` (0..1) and a moving surface."""
    h = w * .46; yt, yb = cy - h / 2, cy + h / 2; r = h * .55; wall = max(3, w * .035)
    d = ImageDraw.Draw(img, "RGBA"); S = 2
    # outer shell
    fo = _prof(cx, yt, yb, w, r); pts = []
    ys = np.linspace(yt, yb, 34); pts += [(fo(y)[0], y) for y in ys]; pts += [(fo(y)[1], y) for y in ys[::-1]]
    poly_ = pts; from scripts.b61 import poly; poly(img, poly_, (238, 240, 246), a)
    # rim
    box(img, cx - w / 2 - w * .015, yt - h * .05, cx + w / 2 + w * .015, yt + h * .07, h * .05, (252, 252, 255), a)
    wi = w - 2 * wall; fi = _prof(cx, yt + h * .07, yb - wall, wi, r - wall * .5); ytop = yt + h * .07; ybot = yb - wall
    ysi = np.linspace(ytop, ybot, 34); inner = [(fi(y)[0], y) for y in ysi] + [(fi(y)[1], y) for y in ysi[::-1]]; poly(img, inner, (176, 182, 202), a)
    if fill > .01:
        lvl = ybot - (ybot - ytop - 3) * min(1, fill); n = 40; left = []; right = []
        ysl = np.linspace(lvl, ybot, 24)
        surf = [(fi(lvl)[0] + (fi(lvl)[1] - fi(lvl)[0]) * k / n, lvl + math.sin(t * 4 + k * .55) * w * .007) for k in range(n + 1)]
        body = surf + [(fi(y)[1], y) for y in ysl[1:]] + [(fi(y)[0], y) for y in ysl[::-1][:-1]]
        poly(img, [p for p in body], tint, a)
        poly(img, [(x, y - 1) for x, y in surf] + [(x, y + max(3, w * .012)) for x, y in surf[::-1]], mix(tint, (255, 220, 170), .35), a * .6)
    for fx, sgn in ((cx - w * .36, -1), (cx + w * .36, 1)):   # claw feet
        poly(img, [(fx - w * .035, yb - 1), (fx + w * .035, yb - 1), (fx + w * .05, yb + h * .17), (fx - w * .05, yb + h * .17)], (186, 150, 70), a)
    # faucet
    fx0 = cx - w / 2 + w * .1; box(img, fx0 - w * .018, yt - h * .55, fx0 + w * .018, yt - h * .05, 3, (190, 194, 206), a); box(img, fx0 - w * .018, yt - h * .58, fx0 + w * .13, yt - h * .5, h * .05, (190, 194, 206), a)

def cup(img, cx, cy, s, a=1.0, t=0.0, tilt=0.0):
    box(img, cx - s, cy - s * .9, cx + s, cy + s * .6, s * .3, (245, 240, 235), a); box(img, cx - s * .85, cy - s * .8, cx + s * .85, cy - s * .55, s * .1, COF, a)
    line(img, [(cx + s, cy - s * .4), (cx + s * 1.5, cy - s * .35), (cx + s * 1.4, cy + s * .15), (cx + s * .9, cy + s * .15)], max(5, s * .16), (245, 240, 235), a)
    for k in range(3):
        u = (t * .6 + k * .33) % 1; sx = cx - s * .4 + k * s * .4 + math.sin(u * 6 + k) * s * .12; line(img, [(sx, cy - s * 1.05), (sx + math.sin(u * 5) * s * .12, cy - s * 1.05 - u * s * .9)], 4, (255, 255, 255), .55 * (1 - u) * a)

def hud(img, big, sub, col=GOLD):
    tx(img, big, 540, 225, 118 if len(big) < 11 else 84, "black", col, maxw=980); tx(img, sub, 540, 330, 34, "bold", SOFT, shadow=False, maxw=980)

def tubgrid(img, n, cols, y0, w, dy, t, filled=None):
    gap = 1000 / cols
    for i in range(n):
        r, c = i // cols, i % cols; cx = 40 + gap * (c + .5); cy = y0 + r * dy
        tub(img, cx, cy, w, 1.0, t + i * .2)

def coffee():
    def hook(img, lt, p, b):
        bg(img); hud(img, "35 BATHTUBS", "OF COFFEE IN YOUR LIFETIME"); f = (lt * .55) % 1; cup(img, 540 + 130, 520, 92, 1.0, lt)
        tub(img, 540, 1010, 640, .25 + .7 * eio(clamp(lt / (b.dur - .4))), lt)
        line(img, [(670, 600), (670, 1010 - 130 + (1 - (.25 + .7 * eio(clamp(lt / (b.dur - .4))))) * 130)], 10, COF2, .0)
    def cups(img, lt, p, b):
        bg(img); n = int(21900 * eio(seg(lt, .4, b.dur - .5))); hud(img, f"{n:,}", "CUPS · 1 A DAY · AGE 20 TO 80"); cup(img, 540, 760, 150, 1.0, lt)
    def liters(img, lt, p, b):
        bg(img); n = 5256 * eio(seg(lt, .4, b.dur - .5)); hud(img, f"{int(n):,} L", "A CUP IS ABOUT A QUARTER LITER"); tub(img, 540, 860, 700, clamp(n / 5256 * 1.0) , lt)
    def tubs35(img, lt, p, b):
        bg(img); k = int(35 * eio(seg(lt, .3, b.dur - .6))); hud(img, f"{k} BATHTUBS", "150 LITERS EACH"); tubgrid(img, k, 7, 560, 130, 160, lt)
    def three(img, lt, p, b):
        bg(img); t0 = A(b, "three", 2.5); k = 35 + int(70 * eio(seg(lt, t0 + .2, b.dur - .4))); hud(img, f"{k}" if lt < t0 else f"{k} BATHTUBS", "AT 3 CUPS A DAY" if lt > t0 else "AND IF IT'S THREE A DAY?", WHITE if lt < t0 else GOLD)
        tubgrid(img, k, 15, 520, 62, 80, lt)
    def end(img, lt, p, b):
        bg(img); hud(img, "ONE CUP AT A TIME", "ADDS UP"); cup(img, 540, 780, 150, 1.0, lt)
    N = [
     ("If you drink one cup of coffee a day, you will drink about thirty five bathtubs of it.", hook),
     ("One cup a day, from twenty to eighty. Thirty five bathtubs, full to the top.", tubs35),
     ("And if it's three cups a day? That's over a hundred bathtubs.", three),
     ("One cup at a time adds up.", end),
    ]
    beats = [Clean(n, d, 3.0, cut="cut", push=0) for n, d in N]
    return Reel("413_coffee_bathtubs", beats, style="cine", seed=413, gain_music=.5, snap=False, grid=0, safe_zone=False, vo=[(i, n) for i, (n, d) in enumerate(N)],
        title="you will drink 35 bathtubs of coffee", caption="x", story="1 cup (240 ml) a day x 365 x 60 years (20 to 80) = 21,900 cups = 5,256 L; a standard bathtub holds about 150 L -> 35 tubs. 3 cups a day = 105 tubs.")
REELS = dict(coffee=coffee)
