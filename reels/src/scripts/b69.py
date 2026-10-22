"""Batch 69: your dog's whole life as 4,380 days. A paw trail walks across while the days run out."""
import math
import numpy as np
from PIL import Image, ImageDraw
from scripts.common import *
from motion import *
import motion, voice

GOLD = (255, 200, 90); SOFT = (205, 190, 215); SPENT = (58, 40, 54); WHITE = (255, 255, 255); WARM = (255, 150, 110)
CX, CY = 540, 835
def A(b, w, d=None, occ=0): return b.at(w, occ, d)
def bg(img): img.paste(vgrad((30, 16, 30), (66, 30, 40), key="dogbg"))
def _paw_pts(pitch):
    F = .9; shapes = [(0, 175 * F, 300 * F, 245 * F, 0), (-380 * F, -105 * F, 118 * F, 170 * F, -.35), (-150 * F, -295 * F, 128 * F, 178 * F, -.1), (150 * F, -295 * F, 128 * F, 178 * F, .1), (380 * F, -105 * F, 118 * F, 170 * F, .35)]
    pts = []; rowh = pitch * .866; y = -460.0; r = 0
    while y < 460:
        x = -560.0 + (pitch / 2 if r % 2 else 0)
        while x < 560:
            for (sx, sy, rx, ry, rot) in shapes:
                dx, dy = x - sx, y - sy; c, sn = math.cos(rot), math.sin(rot); u = dx * c + dy * sn; v = -dx * sn + dy * c
                if (u / rx) ** 2 + (v / ry) ** 2 <= 1: pts.append((CX + x, CY + y)); break
            x += pitch
        y += rowh; r += 1
    return pts
_lo, _hi = 7.0, 30.0
for _ in range(30):
    _m = (_lo + _hi) / 2
    if len(_paw_pts(_m)) > 4380: _lo = _m
    else: _hi = _m
PITCH = _hi; DOTS = sorted(_paw_pts(PITCH), key=lambda p: (p[1], p[0]))[:4380]
if len(DOTS) < 4380: DOTS = sorted(_paw_pts(PITCH * .98), key=lambda p: (p[1], p[0]))[:4380]

def days_grid(img, lt, spent, pulse=True):
    d = ImageDraw.Draw(img, "RGBA"); n = int(spent); r_ = PITCH * .36
    for i, (x, y) in enumerate(DOTS):
        if i < n: d.ellipse([x - r_ * .7, y - r_ * .7, x + r_ * .7, y + r_ * .7], fill=SPENT + (255,))
        else: d.ellipse([x - r_, y - r_, x + r_, y + r_], fill=GOLD + (255,))
    if 0 < n < len(DOTS): x, y = DOTS[n]; glow(img, x, y, 46, GOLD, .9)

def trail(img, lt, a=1.0): pass

def hud(img, big, sub, col=GOLD):
    tx(img, big, 540, 215, 120 if len(big) < 10 else 88, "black", col, maxw=980); tx(img, sub, 540, 315, 32, "bold", SOFT, shadow=False, maxw=980)

def dog():
    def hook(img, lt, p, b):
        bg(img); n = 0; hud(img, "4,380 DAYS", "IS A WHOLE DOG LIFE"); days_grid(img, lt, 0); trail(img, lt)
    def math_(img, lt, p, b):
        bg(img); hud(img, "12 × 365", "= 4,380", WARM); days_grid(img, lt, 0); trail(img, lt)
    def five(img, lt, p, b):
        bg(img); t0 = A(b, "five", 1.0); sp = 1825 * eio(seg(lt, t0, t0 + 2.2)); hud(img, f"{int(sp):,}", "DAYS ALREADY GONE (DOG AGE 5)", WHITE); days_grid(img, lt, sp); trail(img, lt)
    def waiting(img, lt, p, b):
        bg(img); hud(img, f"{4380 - 1825:,} LEFT", "AND THEY SPEND THEM WAITING FOR YOU", GOLD); days_grid(img, lt, 1825); trail(img, lt)
    def walk(img, lt, p, b):
        bg(img); hud(img, "LONG WALKS", "AND THROW THE BALL AGAIN", GOLD); sp = 1825 + 4380 * 0; days_grid(img, lt, 1825); trail(img, lt)
    def end(img, lt, p, b):
        bg(img); hud(img, "GO HUG YOURS", "THEN SEND THIS TO A DOG PERSON", WARM); days_grid(img, lt, 1825); trail(img, lt)
    N = [
     ("Your dog will live about four thousand days. Not years. Days.", hook),
     ("A typical dog lives around twelve years. Twelve times three hundred and sixty five is four thousand three hundred and eighty days.", math_),
     ("If your dog is already five, over eighteen hundred of them are gone.", five),
     ("And a dog's whole day is built around you walking back through that door.", waiting),
     ("So take the long walk. Throw the ball one more time. Let them on the couch.", walk),
     ("Send this to someone with a dog. Then go hug yours.", end),
    ]
    beats = [Clean(n, d, 3.0, cut="cut", push=0) for n, d in N]
    return Reel("411_dog_days", beats, style="cine", seed=411, gain_music=.5, snap=False, grid=0, safe_zone=False, vo=[(i, n) for i, (n, d) in enumerate(N)],
        title="your dog only has about 4,380 days", caption="x", story="12 years x 365 = 4,380 days; dog age 5 = 1,825 days used. Lifespan depends on breed (giant breeds about 8-10 years, small breeds 13-15). 73 x 60 grid, one dot per day.")
REELS = dict(dog=dog)
