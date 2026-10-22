"""Batch 69: your dog's whole life as 4,380 days. A paw trail walks across while the days run out."""
import math
import numpy as np
from PIL import Image, ImageDraw
from scripts.common import *
from motion import *
import motion, voice

GOLD = (255, 200, 90); SOFT = (205, 190, 215); SPENT = (58, 40, 54); WHITE = (255, 255, 255); WARM = (255, 150, 110)
CX, CY = 540, 885
def A(b, w, d=None, occ=0): return b.at(w, occ, d)
def bg(img): img.paste(vgrad((30, 16, 30), (66, 30, 40), key="dogbg"))
def _in_tri(x, y, t):
    (x1, y1), (x2, y2), (x3, y3) = t; d = (y2 - y3) * (x1 - x3) + (x3 - x2) * (y1 - y3)
    a = ((y2 - y3) * (x - x3) + (x3 - x2) * (y - y3)) / d; b = ((y3 - y1) * (x - x3) + (x1 - x3) * (y - y3)) / d; return a >= 0 and b >= 0 and a + b <= 1
def _cat_pts(pitch):
    F = 1.2; pts = []; rowh = pitch * .866; y = -520.0; r = 0
    EARS = [[(-330 * F, -40 * F), (-300 * F, -330 * F), (-70 * F, -200 * F)], [(330 * F, -40 * F), (300 * F, -330 * F), (70 * F, -200 * F)]]
    while y < 520:
        x = -520.0 + (pitch / 2 if r % 2 else 0)
        while x < 520:
            inhead = (x / (335 * F)) ** 2 + ((y - 50 * F) / (275 * F)) ** 2 <= 1; inear = any(_in_tri(x, y, t) for t in EARS)
            eye = any(((x - ex) / (52 * F)) ** 2 + ((y - 20 * F) / (66 * F)) ** 2 <= 1 for ex in (-125 * F, 125 * F)); nose = _in_tri(x, y, [(-34 * F, 105 * F), (34 * F, 105 * F), (0, 150 * F)])
            if (inhead or inear) and not eye and not nose: pts.append((CX + x, CY + y))
            x += pitch
        y += rowh; r += 1
    return pts
_lo, _hi = 7.0, 30.0
N_DAYS = 5475
for _ in range(30):
    _m = (_lo + _hi) / 2
    if len(_cat_pts(_m)) > N_DAYS: _lo = _m
    else: _hi = _m
PITCH = _hi; DOTS = sorted(_cat_pts(PITCH), key=lambda p: (p[1], p[0]))[:N_DAYS]
if len(DOTS) < N_DAYS: DOTS = sorted(_cat_pts(PITCH * .98), key=lambda p: (p[1], p[0]))[:N_DAYS]

def days_grid(img, lt, spent, pulse=True):
    d = ImageDraw.Draw(img, "RGBA"); n = int(spent); r_ = PITCH * .36
    for i, (x, y) in enumerate(DOTS):
        if i < n: d.ellipse([x - r_ * .7, y - r_ * .7, x + r_ * .7, y + r_ * .7], fill=SPENT + (255,))
        else: d.ellipse([x - r_, y - r_, x + r_, y + r_], fill=GOLD + (255,))
    if 0 < n < len(DOTS): x, y = DOTS[n]; glow(img, x, y, 46, GOLD, .9)

def trail(img, lt, a=1.0): pass

def hud(img, big, sub, col=GOLD):
    tx(img, big, 540, 215, 120 if len(big) < 10 else 88, "black", col, maxw=980); tx(img, sub, 540, 315, 32, "bold", SOFT, shadow=False, maxw=980)

def cat():
    def hook(img, lt, p, b):
        bg(img); n = 0; hud(img, "5,475 DAYS", "IS A WHOLE CAT LIFE"); days_grid(img, lt, 0); trail(img, lt)
    def math_(img, lt, p, b):
        bg(img); hud(img, "15 × 365", "= 5,475", WARM); days_grid(img, lt, 0); trail(img, lt)
    def five(img, lt, p, b):
        bg(img); t0 = A(b, "five", 1.0); sp = 2555 * eio(seg(lt, t0, t0 + 2.2)); hud(img, f"{int(sp):,}", "DAYS ALREADY GONE (CAT AGE 7)", WHITE); days_grid(img, lt, sp); trail(img, lt)
    def waiting(img, lt, p, b):
        bg(img); hud(img, f"{5475 - 2555:,} LEFT", "MANY OF THEM ASLEEP ON YOU", GOLD); days_grid(img, lt, 2555); trail(img, lt)
    def walk(img, lt, p, b):
        bg(img); hud(img, "GOOD TREATS", "LET THEM ON THE BED", GOLD); days_grid(img, lt, 2555); trail(img, lt)
    def end(img, lt, p, b):
        bg(img); hud(img, "GO PET YOURS", "THEN SEND THIS TO A CAT PERSON", WARM); days_grid(img, lt, 2555); trail(img, lt)
    N = [
     ("Your cat will live about fifty five hundred days. Not years. Days.", hook),
     ("A typical indoor cat lives around fifteen years. Fifteen times three hundred and sixty five is five thousand four hundred and seventy five days.", math_),
     ("If your cat is already seven, over twenty five hundred of them are gone.", five),
     ("And they spend a lot of those days asleep on the one person they trust.", waiting),
     ("So buy the good treats. Let them on the bed. Stop saying later.", walk),
     ("Send this to a cat person. Then go pet yours.", end),
    ]
    beats = [Clean(n, d, 3.0, cut="cut", push=0) for n, d in N]
    return Reel("417_cat_days", beats, style="cine", seed=417, gain_music=.5, snap=False, grid=0, safe_zone=False, vo=[(i, n) for i, (n, d) in enumerate(N)],
        title="your cat only has about 5,475 days", caption="x", story="15 years x 365 = 5,475 days; cat age 7 = 2,555 days used. Indoor cats commonly live 12-18 years. One dot per day, arranged as a cat face.")
REELS = dict(cat=cat)
