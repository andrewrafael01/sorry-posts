"""Batch 72: dinners left with a grandparent. An 80-year-old lives about 9 more years (SSA life table); monthly visits = 108 plates on the table, each one a dinner."""
import math
import numpy as np
from PIL import Image, ImageDraw
from scripts.common import *
from motion import *
import motion, voice

GOLD = (255, 214, 120); SOFT = (235, 220, 205); WHITE = (255, 255, 255); WARM = (255, 170, 120)
def A(b, w, d=None, occ=0): return b.at(w, occ, d)
def bg(img): img.paste(vgrad((34, 20, 18), (86, 52, 36), key="table"))
COLS, ROWS, PX0, PY0, PP = 12, 9, 112, 470, 78      # 12 dinners a year x 9 years

def plate(img, cx, cy, r, a=1.0, lit=1.0, steam=0.0, t=0.0):
    if lit <= .02: disc(img, cx, cy, r * .55, (60, 40, 40), a * .6); return
    glow(img, cx, cy, r * 1.7, (255, 200, 140), .35 * lit * a)
    disc(img, cx, cy, r, mix((70, 52, 48), (250, 244, 236), lit), a); disc(img, cx, cy, r * .72, mix((60, 44, 40), (232, 226, 216), lit), a)
    disc(img, cx, cy, r * .38, mix((60, 44, 40), (255, 190, 90), lit), a)   # the meal
    if steam > 0:
        for k in range(3):
            u = (t * .7 + k * .33) % 1; line(img, [(cx - r * .3 + k * r * .3, cy - r * .2), (cx - r * .3 + k * r * .3 + math.sin(u * 6 + k) * r * .2, cy - r * .2 - u * r * 1.6)], 3, (255, 255, 255), .5 * (1 - u) * steam)

def table(img, shown, gone, t, pulse_last=False):
    for i in range(COLS * ROWS):
        r, c = i // COLS, i % COLS; cx = PX0 + c * PP; cy = PY0 + r * PP
        if i >= shown: continue
        lit = 0.0 if i < gone else 1.0
        plate(img, cx, cy, 28, 1.0, lit, steam=1.0 if (i == gone and pulse_last) else 0.0, t=t)
    for r in range(ROWS): tx(img, f"{80 + r}", 50, PY0 + r * PP, 24, "bold", SOFT, shadow=False)

def hud(img, big, sub, col=GOLD):
    tx(img, big, 540, 225, 118 if len(big) < 12 else 84, "black", col, maxw=980); tx(img, sub, 540, 330, 34, "bold", SOFT, shadow=False, maxw=980)

def grandma():
    def hook(img, lt, p, b):
        bg(img); n = int(108 * eio(seg(lt, .3, b.dur - .5))); hud(img, f"~{n} DINNERS", "LEFT WITH A GRANDMA WHO IS 80"); table(img, n, 0, lt)
    def math_(img, lt, p, b):
        bg(img); hud(img, "12 × 9", "MONTHLY VISITS × YEARS LEFT AT 80", WARM); table(img, 108, 0, lt)
        a = clamp((lt - A(b, "nine", 1.5)) / .3); tx(img, "average life expectancy at 80: ~9 more years", 540, 1330, 28, "bold", SOFT, a=a, shadow=False, maxw=980)
    def few(img, lt, p, b):
        bg(img); t0 = A(b, "plates", 2.0); gone = int(40 * eio(seg(lt, t0, b.dur - .4))); hud(img, f"{108 - gone}", "DINNERS LEFT", WHITE); table(img, 108, gone, lt)
    def last(img, lt, p, b):
        bg(img); hud(img, "WHICH ONE?", "NOBODY KNOWS WHICH DINNER IS THE LAST", GOLD)
        k = int(70 + 30 * eio(seg(lt, .4, b.dur - .5))); table(img, 108, k, lt)
        # a single plate stays lit, pulsing
        for i in range(108):
            if i >= k: pass
    def go(img, lt, p, b):
        bg(img); hud(img, "ASK HER", "ABOUT HER LIFE. RECORD THE ANSWERS.", GOLD); table(img, 108, 54, lt, pulse_last=True)
    def end(img, lt, p, b):
        bg(img); hud(img, "CALL HER", "TONIGHT", WARM); table(img, 108, 54, lt, pulse_last=True)
    N = [
     ("If your grandma is eighty, you have about a hundred dinners left with her.", hook),
     ("The average eighty year old lives about nine more years. See her once a month, and that's a hundred and eight dinners.", math_),
     ("That's not a lot of plates.", few),
     ("And nobody knows which one is the last.", last),
     ("So go to the next one. Ask her about her life. Record the answers.", go),
     ("Send this to someone who still has a grandparent. Then call yours.", end),
    ]
    beats = [Clean(n, d, 3.0, cut="cut", push=0) for n, d in N]
    return Reel("414_grandma_dinners", beats, style="cine", seed=414, gain_music=.5, snap=False, grid=0, safe_zone=False, vo=[(i, n) for i, (n, d) in enumerate(N)],
        title="you have about 108 dinners left with grandma", caption="x", story="US Social Security period life table: remaining life expectancy at age 80 is about 8-9.5 years (male ~8.2, female ~9.6). 12 visits a year x 9 years = 108. Illustrative: viewer substitutes their own visit frequency.")
REELS = dict(grandma=grandma)
