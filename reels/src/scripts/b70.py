"""Batch 70: your life as one day. 80 years = 24 hours, so every year is 18 minutes. The sky runs through a real day as the age changes."""
import math
import numpy as np
from PIL import Image, ImageDraw
from scripts.common import *
from motion import *
import motion, voice

GOLD = (255, 214, 0); SOFT = (225, 225, 245); WHITE = (255, 255, 255)
HZ = 1180   # horizon
def A(b, w, d=None, occ=0): return b.at(w, occ, d)
def hours(age): return age * 24.0 / 80.0
def clock(age):
    h = hours(age); hh = int(h) % 24; mm = int(round((h - int(h)) * 60)) % 60
    if round((h - int(h)) * 60) == 60: hh = (hh + 1) % 24; mm = 0
    ap = "AM" if hh < 12 else "PM"; return f"{(hh % 12) or 12}:{mm:02d} {ap}"

# sky keyframes: hour -> (top colour, horizon colour)
KEYS = [(0, (6, 8, 26), (18, 22, 58)), (5, (22, 26, 70), (200, 110, 110)), (6.5, (80, 120, 210), (255, 190, 140)), (9, (70, 140, 240), (170, 215, 255)), (13, (60, 140, 250), (150, 205, 255)),
        (17, (90, 120, 220), (255, 180, 110)), (19, (50, 40, 110), (250, 110, 90)), (21, (12, 14, 44), (60, 40, 90)), (24, (6, 8, 26), (18, 22, 58))]
def sky_cols(h):
    for (h0, t0, b0), (h1, t1, b1) in zip(KEYS, KEYS[1:]):
        if h0 <= h <= h1:
            u = (h - h0) / (h1 - h0); return tuple(int(t0[i] + (t1[i] - t0[i]) * u) for i in range(3)), tuple(int(b0[i] + (b1[i] - b0[i]) * u) for i in range(3))
    return KEYS[0][1], KEYS[0][2]
_stars = np.random.RandomState(8).rand(220, 3)
def night_k(h): return clamp((6.2 - h) / 1.8) if h < 12 else clamp((h - 18) / 2.0)

def scene(img, age, lt):
    h = hours(age) % 24.0001; top, hor = sky_cols(h)
    a = np.linspace(0, 1, HZ)[:, None, None] ** .85; arr = (np.array(top)[None, None] * (1 - a) + np.array(hor)[None, None] * a) * np.ones((1, W, 1))
    full = np.zeros((H, W, 3), np.float32); full[:HZ] = arr; full[HZ:] = np.array(hor)[None, None] * .25 + np.array((8, 8, 18)) * .5
    img.paste(Image.fromarray(full.astype(np.uint8))); d = ImageDraw.Draw(img, "RGBA"); nk = night_k(h)
    if nk > .02:
        for x, y, b in _stars:
            al = int(255 * nk * (.35 + .65 * b) * (.7 + .3 * math.sin(lt * 2 + x * 40))); d.ellipse([x * W - 1.6, y * HZ * .9 - 1.6, x * W + 1.6, y * HZ * .9 + 1.6], fill=(235, 235, 255, al))
    # sun: above the horizon 6:00-18:00; moon the rest
    if 5.2 <= h <= 18.8:
        u = clamp((h - 6) / 12); ang = math.pi * (1 - u); sx = 540 + 430 * math.cos(ang); sy = HZ - 600 * math.sin(ang) + 10
        glow(img, sx, sy, 330, (255, 220, 150), .55); glow(img, sx, sy, 150, (255, 245, 210), .8); disc(img, sx, sy, 62, (255, 250, 225))
    else:
        hh = h if h >= 18.8 else h + 24; u = clamp((hh - 18) / 12); ang = math.pi * (1 - u); mx = 540 + 430 * math.cos(ang); my = HZ - 580 * math.sin(ang) + 10
        glow(img, mx, my, 220, (170, 190, 255), .4); disc(img, mx, my, 50, (232, 232, 244)); disc(img, mx + 16, my - 8, 12, (204, 204, 220)); disc(img, mx - 14, my + 14, 9, (204, 204, 220))
    # silhouette hills + a few trees
    pts = [(0, H)] + [(x, HZ - 40 - 36 * math.sin(x * .006) - 26 * math.sin(x * .017 + 1)) for x in range(0, W + 30, 30)] + [(W, H)]
    d.polygon(pts, fill=(10, 10, 20, 255)); d.rectangle([0, HZ + 10, W, H], fill=(10, 10, 20, 255))

def daybar(img, age, show=True):
    x0, x1, y = 90, 990, 1295; box(img, x0, y - 8, x1, y + 8, 8, (40, 44, 70)); xx = x0 + (x1 - x0) * clamp(age / 80)
    box(img, x0, y - 8, max(x0 + 10, xx), y + 8, 8, GOLD); disc(img, xx, y, 17, WHITE, outline=GOLD, ow=4)
    for ag, lab in ((0, "0"), (20, "20"), (40, "40"), (60, "60"), (80, "80")): tx(img, lab, x0 + (x1 - x0) * ag / 80, y + 38, 24, "bold", SOFT, shadow=False)

def hud(img, age, sub=None, big=None):
    tx(img, big or clock(age), 540, 230, 120, "black", WHITE, maxw=900); tx(img, sub or f"AGE {int(round(age))}", 540, 335, 36, "bold", GOLD, shadow=False, maxw=900)

class DayBeat(Clean):
    def __init__(self, narr, kf, sub=None, extra=None, big=None):
        self.kf, self.sub_, self.extra, self.big_ = kf, sub, extra, big; self._pts = None
        super().__init__(narr, self._d, 3.0, cut="cut", push=0)
    def age(self, lt):
        if self._pts is None: self._pts = sorted(self.kf(self))
        P = self._pts
        if lt <= P[0][0]: return P[0][1]
        for (t0, k0), (t1, k1) in zip(P, P[1:]):
            if lt <= t1: return k0 + (k1 - k0) * eio((lt - t0) / max(1e-6, t1 - t0))
        return P[-1][1]
    def _d(self, img, lt, p, b):
        age = self.age(lt); scene(img, age, lt); daybar(img, age); hud(img, age, self.sub_(self, lt, age) if callable(self.sub_) else self.sub_, self.big_)
        if self.extra: self.extra(img, lt, b, age)

def life_day():
    def x_hook(img, lt, b, age):
        a = clamp((lt - .2) / .3); tx(img, "IF YOUR LIFE WAS ONE DAY", 540, 470, 44, "black", WHITE, a=a, shadow=True, maxw=980)
    def x_eighteen(img, lt, b, age):
        a = clamp((lt - A(b, "eighteen", 1.5)) / .3); tx(img, "1 year = 18 minutes", 540, 470, 56, "black", GOLD, a=a, scale=motion.pop((lt - A(b, "eighteen", 1.5)) / .4), shadow=True, maxw=980)
    def x_end(img, lt, b, age):
        a = clamp((lt - A(b, "what", b.dur - 2.4)) / .3); tx(img, "WHAT TIME IS IT FOR YOU?", 540, 560, 60, "black", GOLD, a=a, scale=motion.pop((lt - A(b, "what", b.dur - 2.4)) / .4), maxw=980)
    N = [
     ("If your whole life was one single day, what time is it for you right now?", lambda b: [(0, 0), (b.dur - .2, 25)], None, x_hook),
     ("Eighty years is twenty four hours. So every single year is eighteen minutes.", lambda b: [(0, 25), (.8, 0), (b.dur - .4, 80)], None, x_eighteen),
     ("At eighteen, it's five twenty four in the morning. The sun hasn't even come up.", lambda b: [(0, 80), (1.0, 18), (b.dur, 18)], None, None),
     ("At twenty five, it's seven thirty. You're barely out of bed.", lambda b: [(0, 18), (A(b, "twenty", .3) + .2, 25), (b.dur, 25)], None, None),
     ("At forty, it's noon. Half the day is already over.", lambda b: [(0, 25), (A(b, "forty", .3) + .4, 40), (b.dur, 40)], None, None),
     ("At sixty, it's six in the evening. The sun is going down.", lambda b: [(0, 40), (A(b, "sixty", .3) + .6, 60), (b.dur, 60)], None, None),
     ("And the clock never stops. So what are you doing with your morning? Comment what time it is for you.", lambda b: [(0, 60), (.8, 30), (b.dur, 30)], None, x_end),
    ]
    beats = [DayBeat(n, kf, sub, ex) for n, kf, sub, ex in N]
    return Reel("412_life_one_day", beats, style="cine", seed=412, gain_music=.55, snap=False, grid=0, safe_zone=False, vo=[(i, n) for i, (n, kf, s, e) in enumerate(N)],
        title="if your life was one day, what time is it for you", caption="x", story="Assuming an 80-year life = 24 hours: 1 year = 18 minutes. Age 18 = 5:24 AM, 25 = 7:30 AM, 30 = 9:00 AM, 40 = 12:00 PM, 50 = 3:00 PM, 60 = 6:00 PM, 70 = 9:00 PM.")
REELS = dict(life_day=life_day)
