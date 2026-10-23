"""Batch 64: ten years on your phone. 80 year-squares; every adult year loses a sixth to the screen; the slivers fly together into ten whole years."""
import math
import numpy as np
from PIL import Image, ImageDraw
from scripts.common import *
from motion import *
import motion, voice

GOLD = (255, 214, 0); RED = (255, 90, 110); CREAM = (214, 224, 255); DIM = (56, 62, 100)
CP, GX0, GY0, COLS = 84, 120, 520, 10          # grid pitch, left, top, columns
def A(b, w, d=None, occ=0): return b.at(w, occ, d)
def cell(i): return GX0 + CP * (i % COLS), GY0 + CP * (i // COLS)
SX0, SY0, SP = 150, 1215, 78                    # stack of ten merged years: x0, y0, pitch

def squares(img, lt, red_upto=0, merge=0.0, flash=None, highlight=None):
    """red_upto: how many adult years (0..60) show their red sliver; merge 0..1: slivers fly to the stack."""
    d = ImageDraw.Draw(img, "RGBA")
    for i in range(80):
        x, y = cell(i); s = CP - 10; c = CREAM if i >= 18 else DIM
        d.rounded_rectangle([x, y, x + s, y + s], 10, fill=c + (255,))
        j = i - 18
        if 0 <= j < 60 and j < red_upto:
            hh = s / 6
            if merge <= 0: d.rounded_rectangle([x, y + s - hh, x + s, y + s], 6, fill=RED + (255,))
    if merge > 0:
        for j in range(60):
            i = j + 18; x, y = cell(i); s = CP - 10; hh = s / 6
            k, lev = j // 6, j % 6; tx_, ty_ = SX0 + SP * k, SY0 + SP - 12 - (lev + 1) * (SP - 12) / 6
            u = clamp(merge * 1.6 - j / 60 * .6); e = eio(u); px = x + (tx_ - x) * e; py = (y + s - hh) + (ty_ - (y + s - hh)) * e - math.sin(e * math.pi) * 90
            w_ = s + (SP - 12 - s) * e; h_ = hh + ((SP - 12) / 6 - hh) * e
            if u < 1 or True: d.rounded_rectangle([px, py, px + w_, py + h_], 4, fill=RED + (255,))
    if merge > .95:
        for k in range(10): d.rounded_rectangle([SX0 + SP * k, SY0, SX0 + SP * k + SP - 12, SY0 + SP - 12], 8, outline=GOLD + (255,), width=3)

def phone(img, cx, cy, w, h, a=1.0, lt=0.0, label="4h"):
    box(img, cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2, 40, (18, 20, 34), a, outline=(120, 126, 170), ow=5)
    box(img, cx - w / 2 + 14, cy - h / 2 + 18, cx + w / 2 - 14, cy + h / 2 - 18, 30, (36, 18, 40), a)
    glow(img, cx, cy, w * .9, (255, 90, 120), .5 * a * (.7 + .3 * math.sin(lt * 4)))
    tx(img, label, cx, cy, int(w * .36), "black", WHITE, a=a, shadow=False, maxw=w - 40)

def hud(img, big, sub, col=WHITE):
    tx(img, big, 540, 235, 130 if len(big) <= 9 else 96, "black", col, maxw=900); tx(img, sub, 540, 345, 34 if len(sub) < 34 else 28, "bold", (190, 198, 235), shadow=False, maxw=940)

def phone_years():
    def hook(img, lt, p, b):
        t0 = A(b, "math", b.dur - 1.6); m = 1 - eio(seg(lt, t0, t0 + 1.3))
        hud(img, "10 YEARS" if m > .5 else "YOUR LIFE", "ON YOUR PHONE" if m > .5 else "80 YEARS. HERE'S THE MATH.", GOLD if m > .5 else WHITE)
        squares(img, lt, red_upto=60, merge=m)
    def four(img, lt, p, b):
        hud(img, "4 h / day", "YOUR SCREEN TIME", RED); squares(img, lt)
        a = clamp((lt - .2) / .3); phone(img, 540, 860, 330, 560, a, lt, "4h")
    def pick(img, lt, p, b):
        n = int(200 * eio(seg(lt, .4, b.dur - .6))); hud(img, f"{n}", "PICKUPS A DAY (SURVEYS: 90 TO 200)", RED); squares(img, lt)
        phone(img, 540 + 16 * math.sin(lt * 30) * (1 if int(lt * 8) % 2 == 0 else 0), 860, 300, 520, 1.0, lt, "!")
    def days(img, lt, p, b):
        t0 = A(b, "sixty", 1.0); n = 1 if lt < t0 + .3 else 1; hud(img, "61 DAYS", "EVERY YEAR", RED)
        squares(img, lt, red_upto=1 + int(60 * eio(seg(lt, t0 + 1.4, b.dur - .4))))
        j = 18; x, y = cell(j); ring(img, x + 37, y + 37, 46 + 6 * math.sin(lt * 6), 4, GOLD, clamp((lt - t0) / .3) * (1 - clamp((lt - t0 - 1.4) / .6)))
    def add(img, lt, p, b):
        t0 = A(b, "three", 3.0); m = eio(seg(lt, t0 - .2, b.dur - .5)); hud(img, f"{int(3650 * m):,}", "DAYS ADD UP", RED); squares(img, lt, red_upto=60, merge=m)
        if m > .95: tx(img, "= 10 YEARS", 540, 1330, 60, "black", GOLD, a=clamp((m - .95) / .05), shadow=False)
    def five(img, lt, p, b):
        hud(img, "12.5 YEARS", "AT FIVE HOURS A DAY", RED); squares(img, lt, red_upto=60, merge=1.0)
        a = clamp((lt - A(b, "five", 2.0)) / .4)
        for k in range(10, 12): box(img, SX0 + SP * k - 0, SY0, SX0 + SP * k + SP - 12, SY0 + SP - 12, 8, RED, a) if k == 10 else None
    def compare(img, lt, p, b):
        hud(img, "10 YEARS", "FIRST GRADE TO A DRIVER'S LICENSE", GOLD); squares(img, lt, red_upto=60, merge=1.0)
        tx(img, "6", 220, 1100, 70, "black", WHITE, a=clamp((lt - .3) / .3), shadow=False); tx(img, "16", 860, 1100, 70, "black", WHITE, a=clamp((lt - 1.0) / .3), shadow=False)
    def cta(img, lt, p, b):
        hud(img, "A DECADE", "YOU CAN'T SCROLL BACK", GOLD); phone(img, 540, 840, 330, 560, 1.0, lt, "?")
    N = [
     ("At four hours a day, you will spend about ten years of your life looking at your phone.", hook),
     ("Four hours a day is two whole months, gone, every single year.", days),
     ("Ten years. That's first grade all the way to your driver's license.", compare),
     ("A decade of your life you can't scroll back.", cta),
    ]
    beats = [Clean(n, d, 3.0, cut="cut", push=0) for n, d in N]
    return Reel("406_phone_ten_years", beats, style="cine", seed=406, gain_music=.5, snap=False, grid=0, safe_zone=False, vo=[(i, n) for i, (n, d) in enumerate(N)],
        title="you will spend 10 years on your phone", caption="four hours a day is about ten years of your life",
        story="4 h x 365 = 1,460 h = 60.8 days/yr; x 60 years (18 to 78) = 3,650 days = 10.0 years. At 5 h/day: 4,562 days = 12.5 years. Reviews.org 2024 survey reports about 5 h/day for US adults (other surveys range 3.3-6.6 h).")
REELS = dict(phone_years=phone_years)
