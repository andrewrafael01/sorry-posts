"""Batch 82: you're not late. An age line from 20 to 80 with fireworks at the ages real people started: Julia Child 49, Vera Wang 40, Colonel Sanders early 60s, Laura Ingalls Wilder 65, Grandma Moses late 70s."""
import math
import numpy as np
from PIL import Image, ImageDraw
from scripts.common import *
from motion import *
import motion, voice

GOLD = (255, 214, 120); SOFT = (205, 220, 245); WHITE = (255, 255, 255); WARM = (255, 150, 110)
def A(b, w, d=None, occ=0): return b.at(w, occ, d)
X0, X1, AY = 90, 990, 1180
def ax(age): return X0 + (X1 - X0) * (age - 20) / 60.0
EVENTS = [("Julia Child", "first cookbook", 49, (255, 130, 150)), ("Vera Wang", "first collection", 40, (190, 150, 255)), ("Colonel Sanders", "KFC franchising", 62, (255, 190, 90)), ("Laura Ingalls Wilder", "Little House", 65, (120, 220, 255)), ("Grandma Moses", "started painting", 78, (140, 255, 170))]
ROWY = {49: 520, 40: 700, 62: 880, 65: 640, 78: 800}

def bg(img): img.paste(vgrad((8, 10, 30), (30, 26, 60), key="late"))
def axis(img, lt, you=True, upto=80):
    d = ImageDraw.Draw(img, "RGBA"); d.line([(X0, AY), (X1, AY)], fill=(120, 130, 190, 255), width=5)
    for a_ in range(20, 81, 10): d.line([(ax(a_), AY - 10), (ax(a_), AY + 10)], fill=(160, 170, 220, 255), width=3); tx(img, f"{a_}", ax(a_), AY + 46, 32, "bold", SOFT, shadow=False)
    if you: glow(img, ax(25), AY, 40, GOLD, .9); disc(img, ax(25), AY, 14, GOLD); tx(img, "YOU?", ax(25), AY - 50, 30, "black", GOLD, shadow=False)

def burst(img, lt, t0, age, name, what, col, big=True):
    u = lt - t0
    if u < 0: return
    x = ax(age); y_top = ROWY[age]; rise = clamp(u / .7)
    if rise < 1:   # rocket
        yy = AY - (AY - y_top) * eio(rise); line(img, [(x, yy), (x, yy + 60)], 5, col, .8); glow(img, x, yy, 40, col, .9)
    else:
        k = clamp((u - .7) / 1.2)
        for q in range(26):
            a = q / 26 * 2 * math.pi; r = 105 * (1 - (1 - k) ** 2); px = x + math.cos(a) * r; py = y_top + math.sin(a) * r + 40 * k * k
            glow(img, px, py, 14, col, .8 * (1 - k * .6)); disc(img, px, py, 4, col, 1 - k * .4)
        glow(img, x, y_top, 120, col, .35 * (1 - k))
        a2 = clamp((u - .8) / .3)
        tx(img, name, min(800, max(280, x)), y_top - 18, 38, "black", WHITE, a=a2, shadow=True, maxw=520)
        tx(img, f"{what} · age {age}" if age != 62 and age != 78 else (f"{what} · early 60s" if age == 62 else f"{what} · late 70s"), min(800, max(280, x)), y_top + 28, 28, "bold", col, a=a2, shadow=False, maxw=440)
    line(img, [(x, AY), (x, AY - 14)], 3, col, .8); disc(img, x, AY, 8, col)

def hud(img, big, sub, col=GOLD):
    tx(img, big, 540, 225, 108 if len(big) < 14 else 76, "black", col, maxw=980); tx(img, sub, 540, 330, 32, "bold", SOFT, shadow=False, maxw=980)

def late():
    def hook(img, lt, p, b):
        bg(img); hud(img, "FEEL BEHIND?", "THIS IS FOR YOU", GOLD); axis(img, lt)
    def julia(img, lt, p, b):
        bg(img); hud(img, "AGE 49", "JULIA CHILD'S FIRST COOKBOOK", EVENTS[0][3]); axis(img, lt); burst(img, lt, A(b, "forty", .4) - .3, 49, *EVENTS[0][:2], EVENTS[0][3])
    def vera(img, lt, p, b):
        bg(img); hud(img, "AGE 40", "VERA WANG'S FIRST COLLECTION", EVENTS[1][3]); axis(img, lt); burst(img, lt, .2, 49, *EVENTS[0][:2], EVENTS[0][3]); burst(img, lt, A(b, "forty", .3) - .3, 40, *EVENTS[1][:2], EVENTS[1][3])
    def sanders(img, lt, p, b):
        bg(img); hud(img, "EARLY 60s", "COLONEL SANDERS STARTS FRANCHISING KFC", EVENTS[2][3]); axis(img, lt)
        for i in (0, 1): burst(img, lt, -9, EVENTS[i][2], *EVENTS[i][:2], EVENTS[i][3])
        burst(img, lt, A(b, "sixties", .8) - .3, 62, *EVENTS[2][:2], EVENTS[2][3])
    def late_(img, lt, p, b):
        bg(img); hud(img, "65 · 78", "LITTLE HOUSE · FIRST PAINTINGS", EVENTS[3][3]); axis(img, lt)
        for i in (0, 1, 2): burst(img, lt, -9, EVENTS[i][2], *EVENTS[i][:2], EVENTS[i][3])
        burst(img, lt, A(b, "sixty", .4) - .3, 65, *EVENTS[3][:2], EVENTS[3][3]); burst(img, lt, A(b, "seventy", 3.0) - .3, 78, *EVENTS[4][:2], EVENTS[4][3])
    def end(img, lt, p, b):
        bg(img); hud(img, "YOU'RE NOT LATE", "SEND THIS TO SOMEONE WHO FEELS BEHIND", GOLD); axis(img, lt)
        for i in range(5): burst(img, lt, -9, EVENTS[i][2], *EVENTS[i][:2], EVENTS[i][3])
    N = [
     ("If you feel behind in life, this is for you.", hook),
     ("Julia Child published her first cookbook at forty nine.", julia),
     ("Vera Wang designed her first collection at forty.", vera),
     ("Colonel Sanders started franchising KFC in his early sixties.", sanders),
     ("Laura Ingalls Wilder published Little House at sixty five. Grandma Moses started painting in her late seventies.", late_),
     ("You're not late. You're on your own timeline. Send this to someone who feels behind.", end),
    ]
    beats = [Clean(n, d, 3.0, cut="cut", push=0) for n, d in N]
    return Reel("426_not_late", beats, style="cine", seed=426, gain_music=.55, snap=False, grid=0, safe_zone=False, vo=[(i, n) for i, (n, d) in enumerate(N)],
        title="you're not late", caption="x", story="Julia Child (b. 1912) published Mastering the Art of French Cooking in 1961 at 49. Vera Wang (b. 1949) launched her first collection in 1990 at 40. Colonel Harland Sanders (b. 1890) began franchising in 1952 at 61-62. Laura Ingalls Wilder (b. 1867) published Little House in the Big Woods in 1932 at 65. Grandma Moses (b. 1860) began painting in earnest in her late 70s.")
REELS = dict(late=late)
