"""Batch 74: sleeping next to each other. 50 years x 8 h = 16.7 years asleep beside your partner. A bed, a window, a moon that runs through the years."""
import math
import numpy as np
from PIL import Image, ImageDraw
from scripts.common import *
from motion import *
from scripts.b61 import poly
import motion, voice

GOLD = (255, 214, 140); SOFT = (205, 214, 245); WHITE = (255, 255, 255); WARM = (255, 160, 130)
def A(b, w, d=None, occ=0): return b.at(w, occ, d)
_st = np.random.RandomState(14).rand(120, 3)

def room(img, years, lt):
    img.paste(vgrad((10, 14, 38), (34, 30, 62), key="bed"))
    d = ImageDraw.Draw(img, "RGBA")
    # window
    wx0, wy0, wx1, wy1 = 190, 430, 890, 980; box(img, wx0 - 18, wy0 - 18, wx1 + 18, wy1 + 18, 30, (60, 52, 84)); box(img, wx0, wy0, wx1, wy1, 20, (14, 22, 58))
    for x, y, b in _st:
        sx = wx0 + 14 + x * (wx1 - wx0 - 28); sy = wy0 + 14 + y * (wy1 - wy0 - 28)
        if y < .85: d.ellipse([sx - 2, sy - 2, sx + 2, sy + 2], fill=(255, 255, 255, int(120 + 100 * b * (.5 + .5 * math.sin(lt * 2 + x * 30)))))
    # moon sweeps the window; each pass is a night (time-lapse speed grows with the years)
    ph = (years * 6.0) % 1.0; mx = wx0 + 60 + (wx1 - wx0 - 120) * ph; my = wy0 + 150 - 90 * math.sin(math.pi * ph)
    glow(img, mx, my, 150, (170, 190, 255), .45); disc(img, mx, my, 44, (232, 232, 244)); disc(img, mx + 12, my - 6, 11, (204, 204, 220))
    line(img, [((wx0 + wx1) / 2, wy0), ((wx0 + wx1) / 2, wy1)], 10, (60, 52, 84)); line(img, [(wx0, (wy0 + wy1) / 2), (wx1, (wy0 + wy1) / 2)], 10, (60, 52, 84))

def bed(img, lt):
    # bed frame, mattress, pillows, two sleepers breathing under a blanket
    box(img, 90, 1090, 990, 1300, 30, (74, 52, 70)); box(img, 100, 1050, 980, 1150, 34, (226, 218, 236))
    for cx in (330, 750):
        box(img, cx - 140, 1010, cx + 140, 1100, 36, (244, 240, 250)); disc(img, cx, 1020, 54, (255, 214, 184))      # pillow + head
        line(img, [(cx - 24, 1014), (cx - 14, 1021), (cx - 4, 1014)], 4, (90, 60, 60)); line(img, [(cx + 4, 1014), (cx + 14, 1021), (cx + 24, 1014)], 4, (90, 60, 60))
    for k, cx in enumerate((330, 750)):
        br = 1 + .02 * math.sin(lt * 1.6 + k * .9)
        pts = [(cx - 230, 1150)] + [(cx - 230 + 460 * u / 24, 1150 - (86 * br) * math.sin(math.pi * u / 24) ** .7 * (1 if u not in (0, 24) else 0) - 18 * math.sin(math.pi * u / 24 * 3)) for u in range(25)] + [(cx + 230, 1150)]
        poly(img, pts, (mix((120, 140, 220), (230, 140, 160), k)), 1.0)
    for z in range(3):   # little z's
        u = (lt * .35 + z * .33) % 1; tx(img, "z", 330 + 26 * z + u * 40, 980 - u * 150, int(34 + 16 * u), "black", (200, 210, 255), a=.85 * (1 - u), shadow=False)

def hud(img, big, sub, col=GOLD):
    tx(img, big, 540, 225, 108 if len(big) < 14 else 80, "black", col, maxw=980); tx(img, sub, 540, 330, 32, "bold", SOFT, shadow=False, maxw=980)

def sleep_together():
    def hook(img, lt, p, b):
        y = 16.7 * eio(seg(lt, .4, b.dur - .5)); room(img, y, lt); bed(img, lt); hud(img, f"{y:.1f} YEARS", "ASLEEP NEXT TO EACH OTHER")
    def math_(img, lt, p, b):
        y = 16.7; room(img, lt * .3, lt); bed(img, lt); hud(img, "50 × 8", "YEARS TOGETHER × HOURS A NIGHT", WARM)
    def more(img, lt, p, b):
        room(img, lt * .5, lt); bed(img, lt); hud(img, "16.7 YEARS", "MORE THAN YOU'LL SPEND DOING ANYTHING ELSE TOGETHER", GOLD)
    def end(img, lt, p, b):
        room(img, lt * .2, lt); bed(img, lt); hud(img, "TAG THEM", "SEND THIS TO THE PERSON NEXT TO YOU", WARM)
    N = [
     ("If you stay together for fifty years, you will spend almost seventeen of them asleep next to each other.", hook),
     ("Fifty years, times eight hours a night. That's sixteen point seven years.", math_),
     ("More time than you'll spend eating together, traveling together, or talking. Just breathing in the dark, side by side.", more),
     ("So tag the person next to you. Tonight.", end),
    ]
    beats = [Clean(n, d, 3.0, cut="cut", push=0) for n, d in N]
    return Reel("416_sleep_together", beats, style="cine", seed=416, gain_music=.55, snap=False, grid=0, safe_zone=False, vo=[(i, n) for i, (n, d) in enumerate(N)],
        title="you will spend 16 years asleep next to your partner", caption="x", story="50 years x 365 x 8 h = 146,000 h = 16.7 years asleep beside your partner. Comparison claim is illustrative: waking time spent together is typically spread across work and other commitments.")
REELS = dict(sleep_together=sleep_together)
