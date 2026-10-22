"""Batch 73: twenty Christmases left with your parents. A tree of 20 lights; one goes out per year; relight it by showing up."""
import math
import numpy as np
from PIL import Image, ImageDraw
from scripts.common import *
from motion import *
from scripts.b61 import poly
import motion, voice

GOLD = (255, 214, 120); SOFT = (225, 230, 250); WHITE = (255, 255, 255); WARM = (255, 170, 120)
def A(b, w, d=None, occ=0): return b.at(w, occ, d)
CX = 540
TIERS = [(560, 840, 215), (740, 1050, 290), (930, 1260, 365)]   # (apex y, base y, half width)
rr = np.random.RandomState(31)
BULBS = []; COLS = [(255, 90, 90), (255, 210, 90), (110, 190, 255), (255, 140, 220), (140, 255, 170)]
for k in range(20):
    t = TIERS[k % 3]; y = t[0] + (t[1] - t[0]) * (.35 + .55 * rr.rand()); hw = t[2] * (y - t[0]) / (t[1] - t[0]); x = CX + (rr.rand() * 2 - 1) * hw * .78; BULBS.append((x, y, COLS[k % 5]))
_snow = np.random.RandomState(4).rand(90, 4)

def bg(img, lt):
    img.paste(vgrad((8, 12, 30), (24, 30, 58), key="xmas")); d = ImageDraw.Draw(img, "RGBA")
    for x, y, s, sp in _snow:
        yy = (y * H + lt * (30 + 50 * sp)) % H; xx = (x * W + math.sin(lt * .8 + y * 9) * 20) % W; d.ellipse([xx - 2 - 2 * s, yy - 2 - 2 * s, xx + 2 + 2 * s, yy + 2 + 2 * s], fill=(255, 255, 255, int(110 + 100 * s)))
    d.rectangle([0, 1275, W, H], fill=(14, 16, 30, 255))

def tree(img, lit, lt, star=1.0, warm=1.0):
    d = ImageDraw.Draw(img, "RGBA")
    box(img, CX - 32, 1250, CX + 32, 1300, 4, (70, 44, 30))
    for k, (ay, by, hw) in enumerate(TIERS):
        poly(img, [(CX, ay), (CX - hw, by), (CX + hw, by)], (22 + 6 * k, 74 + 10 * k, 52 + 6 * k))
        poly(img, [(CX, ay + 30), (CX - hw * .85, by - 6), (CX + hw * .85, by - 6)], (28 + 6 * k, 92 + 10 * k, 64 + 6 * k), .5)
    for k, (ay, by, hw) in enumerate(TIERS):   # garlands
        for j in range(3):
            y0 = ay + (by - ay) * (.28 + j * .24); w0 = hw * (y0 - ay) / (by - ay); pts = [(CX - w0 * .9 + 1.8 * w0 * u / 20, y0 + 22 * math.sin(math.pi * u / 20) + 6) for u in range(21)]
            line(img, pts, 5, (255, 214, 120), .55)
    glow(img, CX, 560, 150, (255, 230, 160), .6 * star); poly(img, [(CX + 40 * math.cos(math.radians(-90 + 72 * i)) * (1 if i % 2 == 0 else .42), 545 + 40 * math.sin(math.radians(-90 + 72 * i)) * (1 if i % 2 == 0 else .42)) for i in range(10)], mix((90, 80, 70), (255, 226, 130), star))
    for k, (x, y, c) in enumerate(BULBS):
        on = clamp(lit - k) if isinstance(lit, float) or True else 1.0
        if on > 0: fl = .85 + .15 * math.sin(lt * 5 + k * 1.7); glow(img, x, y, 86, c, .85 * on * fl * warm); disc(img, x, y, 15, mix((50, 50, 60), c, on), 1.0); disc(img, x - 4, y - 5, 4, (255, 255, 255), .55 * on)
        else: disc(img, x, y, 15, (50, 52, 64), 1.0)

def hud(img, big, sub, col=GOLD):
    tx(img, big, 540, 225, 108 if len(big) < 14 else 80, "black", col, maxw=980); tx(img, sub, 540, 330, 32, "bold", SOFT, shadow=False, maxw=980)

def xmas():
    cues_off = []
    def hook(img, lt, p, b):
        bg(img, lt); t0 = A(b, "twenty", 3.0); n = 20 * eio(seg(lt, t0 - .2, t0 + 1.4)); hud(img, f"{int(round(n))} CHRISTMASES" if lt > t0 - .3 else "HOW MANY CHRISTMASES", "LEFT WITH YOUR PARENTS IF THEY'RE 60"); tree(img, n, lt)
    def twenty(img, lt, p, b):
        bg(img, lt); hud(img, "20", "NOT 40. NOT 100."); tree(img, 20.0, lt)
    def out(img, lt, p, b):
        bg(img, lt); n = 20 * (1 - eio(seg(lt, .6, b.dur - .5))); hud(img, f"{int(math.ceil(n))}", "LIGHTS LEFT. ONE GOES OUT EVERY YEAR.", WHITE); tree(img, n, lt, star=.35 + .65 * clamp(n / 20), warm=1.0)
    def back(img, lt, p, b):
        bg(img, lt); n = 20 * eio(seg(lt, .3, 1.8)); hud(img, "SHOW UP", "STAY LONGER. TAKE THE PHOTO.", GOLD); tree(img, n, lt)
    def end(img, lt, p, b):
        bg(img, lt); hud(img, "THIS YEAR", "SEND THIS TO SOMEONE YOU WANT AT YOUR TABLE", WARM); tree(img, 20.0, lt)
    N = [
     ("If your parents are sixty, and you see them every Christmas, you have about twenty Christmases left.", hook),
     ("Twenty. Not forty. Not a hundred. Twenty.", twenty),
     ("One light goes out every year. And nobody tells you which one is the last.", out),
     ("So this year, show up. Stay longer. Take the photo.", back),
     ("Send this to someone you want at your table this year.", end),
    ]
    beats = [Clean(n, d, 3.0, cut="cut", push=0) for n, d in N]
    r = Reel("415_christmases_left", beats, style="cine", seed=415, gain_music=.55, snap=False, grid=0, safe_zone=False, vo=[(i, n) for i, (n, d) in enumerate(N)],
        title="you have about 20 Christmases left with your parents", caption="x", story="Illustrative: parents aged 60, remaining life expectancy about 20 years, seen every Christmas = 20 Christmases. The viewer substitutes their own ages.")
    # chime per light going out (descending), at the pace of the 'out' beat
    s = r.shots[2]
    for k in range(20):
        t = .6 + (s.dur - 1.1) * k / 20.0 + .02
        s.cues = list(s.cues) + [(t, "n%d" % (84 - int(k * 1.6)), .5)]
    s = r.shots[3]
    s.cues = list(s.cues) + [(.3 + i * .08, "n%d" % (60 + i * 2), .35) for i in range(10)]
    return r
REELS = dict(xmas=xmas)
