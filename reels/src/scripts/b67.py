"""Batch 67: your parents' remaining days. 20 columns (years) x 10 gold days; the whole remaining supply is less than one calendar year."""
import math
import numpy as np
from PIL import Image, ImageDraw
from scripts.common import *
from motion import *
import motion, voice

GOLD = (255, 214, 0); SOFT = (190, 198, 235); DIMC = (44, 48, 80); WARM = (255, 170, 120)
def A(b, w, d=None, occ=0): return b.at(w, occ, d)
GX0, GY0, CELL = 60, 520, 48   # 20 columns x 10 rows

def grid200(img, lt, filled, pulse=0.0, labels=True):
    d = ImageDraw.Draw(img, "RGBA"); n = int(filled)
    for col in range(20):
        for row in range(10):
            i = col * 10 + row; x = GX0 + col * CELL; y = GY0 + row * CELL; w_ = CELL - 6
            if i < n: d.rounded_rectangle([x, y, x + w_, y + w_], 7, fill=GOLD + (255,))
            else: d.rounded_rectangle([x, y, x + w_, y + w_], 7, fill=DIMC + (255,))
    if n > 0:
        i = min(n, 200) - 1; col, row = i // 10, i % 10; glow(img, GX0 + col * CELL + 21, GY0 + row * CELL + 21, 56, GOLD, .7)
    if labels:
        for col, lab in ((0, "60"), (19, "80")): tx(img, lab, GX0 + col * CELL + 21, GY0 - 26, 26, "bold", SOFT, shadow=False)
        tx(img, "their age", 540, GY0 - 26, 26, "bold", SOFT, shadow=False)
        tx(img, "10 days each year", 540, GY0 + 10 * CELL + 34, 28, "bold", SOFT, shadow=False)

def year365(img, lt, golds, seed=3, a=1.0):
    d = ImageDraw.Draw(img, "RGBA"); r = np.random.RandomState(seed); pick = set(r.choice(365, 10, replace=False).tolist()); cs = 40
    for i in range(365):
        col, row = i % 19, i // 19; x = 80 + col * (cs + 2) - 0; y = 560 + row * (cs + 2) - 0
        x = 141 + col * 42; y = 470 + row * 42
        if i in pick and golds: d.rounded_rectangle([x, y, x + 34, y + 34], 7, fill=GOLD + (int(255 * a),)); glow(img, x + 17, y + 17, 34, GOLD, .5 * a)
        else: d.rounded_rectangle([x, y, x + 34, y + 34], 7, fill=DIMC + (255,))

def hud(img, big, sub, col=(255, 255, 255)):
    tx(img, big, 540, 235, 120 if len(big) < 9 else 88, "black", col, maxw=980); tx(img, sub, 540, 345, 32, "bold", SOFT, shadow=False, maxw=980)

def parents():
    def hook(img, lt, p, b):
        img.paste(vgrad((24, 12, 34), (58, 26, 44), key="warm"))
        t1 = A(b, "days", b.dur - 1.0); n = 200 * eio(seg(lt, .4, t1)); hud(img, f"{int(n)} DAYS", "LEFT WITH YOUR PARENTS (A GENEROUS ESTIMATE)", GOLD); grid200(img, lt, n)
    def math_(img, lt, p, b):
        img.paste(vgrad((24, 12, 34), (58, 26, 44), key="warm"))
        hud(img, "10 × 20", "DAYS A YEAR × YEARS LEFT", WARM); n = 200 * eio(seg(lt, A(b, "ten", 1.5), b.dur - .5)); grid200(img, lt, n)
    def lessthan(img, lt, p, b):
        img.paste(vgrad((24, 12, 34), (58, 26, 44), key="warm"))
        hud(img, "200 < 365", "LESS THAN ONE SINGLE YEAR", GOLD); m = eio(seg(lt, .4, 1.9)); d = ImageDraw.Draw(img, "RGBA")
        for i in range(365):
            bx, by = 141 + (i % 19) * 42, 470 + (i // 19) * 42
            if i < 200:
                ax, ay = GX0 + (i // 10) * CELL, GY0 + (i % 10) * CELL; x = ax + (bx - ax) * m; y = ay + (by - ay) * m; w_ = 42 + (34 - 42) * m
                d.rounded_rectangle([x, y, x + w_, y + w_], 7, fill=GOLD + (255,))
            else: d.rounded_rectangle([bx, by, bx + 34, by + 34], 7, fill=DIMC + (int(255 * m),))
    def scattered(img, lt, p, b):
        img.paste(vgrad((24, 12, 34), (58, 26, 44), key="warm"))
        hud(img, "IN PIECES", "A WEEKEND HERE, A HOLIDAY THERE", WARM); year365(img, lt, True, a=clamp(lt / .5))
        tx(img, "this is one year of it", 540, 1380, 1, "bold", SOFT, a=0.0)
    def others(img, lt, p, b):
        img.paste(vgrad((24, 12, 34), (58, 26, 44), key="warm"))
        hud(img, "NOW YOURS", "DO THE MATH FOR THE PEOPLE YOU LOVE", GOLD); year365(img, lt, True, seed=int(lt * 2) % 9 + 1, a=1.0)
    def end(img, lt, p, b):
        img.paste(vgrad((24, 12, 34), (58, 26, 44), key="warm"))
        hud(img, "CALL THEM", "TONIGHT. NOT NEXT WEEK.", GOLD); grid200(img, lt, 200 - 1 * (lt * 3 % 1), labels=False)
    N = [
     ("You will see your parents about two hundred more days. Not years. Days.", hook),
     ("Here's the math. Say you see them ten days a year. If they're sixty and live to eighty, that's ten days, times twenty years.", math_),
     ("Two hundred days. That's less than one single year.", lessthan),
     ("And it won't come as one long year. It comes as a weekend here, a holiday there.", scattered),
     ("Now do that math for the people you love. Your grandparents. Your best friend.", others),
     ("Pick one person. Call them tonight. And send this to someone who should call their mom.", end),
    ]
    beats = [Clean(n, d, 3.0, cut="cut", push=0) for n, d in N]
    return Reel("409_parents_days", beats, style="cine", seed=409, gain_music=.5, snap=False, grid=0, safe_zone=False, vo=[(i, n) for i, (n, d) in enumerate(N)],
        title="you only have about 200 days left with your parents", caption="10 days a year x 20 years = 200 days with your parents. less than one year. what's your number? send this to someone who should call their mom",
        story="Illustrative arithmetic with stated assumptions: 10 days/year in person x 20 remaining years = 200 days; a calendar year has 365. The viewer substitutes their own numbers.")
REELS = dict(parents=parents)
