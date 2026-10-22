"""Batch 63: staying awake as a drunk-goggle night drive. The picture degrades with hours awake: blur, double vision, lane drift, eyelids."""
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageChops
from scripts.common import *
from motion import *
import motion, voice

HOR = 640; F = 900.0; CAMH = 1.25
GOLD = (255, 214, 0); RED = (255, 90, 110); WHITE = (255, 255, 255)
def A(b, w, d=None, occ=0): return b.at(w, occ, d)
def bac(h): return max(0.0, .05 + (h - 17) * .05 / 7)

_sky = None
def road(t, camx, hours):
    global _sky
    if _sky is None:
        a = np.linspace(0, 1, HOR)[:, None, None]; sky = (np.array([8, 10, 30])[None, None] * (1 - a) + np.array([52, 40, 92])[None, None] * a) * np.ones((1, W, 1)); _sky = sky.astype(np.uint8)
    img = Image.new("RGB", (W, H), (22, 24, 32)); img.paste(Image.fromarray(_sky), (0, 0)); d = ImageDraw.Draw(img)
    r = np.random.RandomState(4)
    for k in range(30):   # skyline
        x = k * 38 - 20; hh = 60 + r.rand() * 230; d.rectangle([x, HOR - hh, x + 34, HOR], fill=(14, 14, 34))
        for wy in range(int(HOR - hh + 8), HOR - 6, 22):
            if r.rand() < .35: d.rectangle([x + 6, wy, x + 12, wy + 8], fill=(255, 214, 120))
    d.rectangle([0, HOR, W, H], fill=(34, 36, 46))
    def P(X, z, y=0.0): return (540 + F * (X - camx) / z, HOR + F * (CAMH - y) / z)
    # road surface with edges
    d.polygon([P(-5.2, 1.2), P(-5.2, 400), P(5.2, 400), P(5.2, 1.2)], fill=(40, 42, 54))
    for X in (-5.0, 5.0):
        d.polygon([P(X - .12, 1.2), P(X - .12, 400), P(X + .12, 400), P(X + .12, 1.2)], fill=(210, 210, 225))
    sp = 30.0; off = (t * sp) % 14
    for k in range(-1, 30):
        z0 = k * 14 - off; z1 = z0 + 5
        if z1 < 1.3: continue
        z0 = max(z0, 1.3); d.polygon([P(-.1, z0), P(-.1, z1), P(.1, z1), P(.1, z0)], fill=(235, 235, 245))
    # street lights
    for k in range(0, 14):
        z = k * 30 - (t * sp) % 30 + 8
        for X in (-6.4, 6.4):
            if z > 1.5:
                px, py = P(X, z, 6.0); bx, by = P(X, z, 0); line(img, [(bx, by), (px, py)], max(2, 120 / z), (60, 62, 84)); glow(img, px, py, max(16, 700 / z), (255, 214, 140), .85)
    # the car ahead
    zc = 38.0; cx_ = 1.8 + .8 * math.sin(t * .5)
    px, py = P(cx_, zc, .7); w = F * 1.8 / zc
    box(img, px - w / 2, py - w * .55, px + w / 2, py + w * .15, 6, (60, 30, 42)); box(img, px - w * .38, py - w * .85, px + w * .38, py - w * .5, 6, (50, 40, 70))
    for sx in (-1, 1): glow(img, px + sx * w * .36, py - w * .2, w * .9, (255, 40, 60), .9); disc(img, px + sx * w * .36, py - w * .2, max(3, w * .08), (255, 120, 120))
    # steering wheel, drifting with the driver
    ang = camx_wheel = (camx - 1.8) * -6.0; cxw, cyw, ro = 540, 1930, 470
    ring_c = (18, 18, 26)
    ring(img, cxw, cyw, ro, 70, ring_c, 1.0); ring(img, cxw, cyw, ro + 35, 6, (70, 72, 96), .9)
    for k in range(3):
        a = math.radians(ang + 180 + k * 120 - 90 + 90)
        line(img, [(cxw, cyw), (cxw + (ro - 20) * math.cos(a), cyw + (ro - 20) * math.sin(a))], 44, ring_c)
    disc(img, cxw, cyw, 120, (30, 30, 42), outline=(80, 82, 110), ow=4)
    return img

def impair(img, t, e):
    """The drunk goggles: blur, double vision, lids."""
    if e <= 0: return img
    out = img.filter(ImageFilter.GaussianBlur(.2 + 4.5 * e ** 1.4)) if e > .05 else img
    dx = int((18 + 55 * math.sin(t * .8)) * e); dy = int(10 * e * math.sin(t * .6 + 1))
    ghost = ImageChops.offset(out, dx, dy); out = Image.blend(out, ghost, min(.55, .5 * e))
    # eyelids: slow droop plus microsleep closures at high impairment
    drop = e ** 1.6 * (.09 + .06 * math.sin(t * 1.1)); blink = 0.0
    if e > .55: blink = max(0, math.sin(t * 1.7 + 1)) ** 22 * (e - .4) * 1.4
    cover = min(.40, drop + blink * .38); hh = int(H * cover)
    if hh > 2:
        lid = Image.new("RGB", (W, hh), (4, 4, 8)); soft = Image.linear_gradient("L").resize((W, hh)).rotate(180) if False else None
        ImageDraw.Draw(out).rectangle([0, 0, W, hh], fill=(4, 4, 8)); ImageDraw.Draw(out).rectangle([0, H - hh, W, H], fill=(4, 4, 8))
    return out

def hud(img, hours, lt, show_meter=True):
    tx(img, "HOURS AWAKE", 540, 215, 34, "bold", (190, 198, 235), shadow=False); tx(img, f"{hours:.0f}", 540, 300, 130, "black", GOLD if hours < 17 else RED, maxw=500)
    if show_meter:
        x0, x1, y = 120, 960, 470; box(img, x0, y - 18, x1, y + 18, 18, (30, 32, 52)); v = bac(hours) / .12; w = max(0, (x1 - x0) * clamp(v))
        if w > 6: box(img, x0, y - 18, x0 + w, y + 18, 18, mix((255, 214, 0), (255, 70, 100), clamp((hours - 17) / 7)))
        for val, lab in ((.05, ".05"), (.08, ".08 LEGAL LIMIT"), (.10, ".10")):
            xx = x0 + (x1 - x0) * val / .12; line(img, [(xx, y - 28), (xx, y + 28)], 3, (235, 235, 250)); tx(img, lab, xx if val != .08 else xx - 40, y + 52 + (22 if val == .08 else 0), 24, "bold", (200, 208, 240), shadow=False, maxw=300)
        tx(img, f"performs like BAC {bac(hours):.2f}", 540, 395, 34, "black", WHITE, shadow=False, maxw=900)

def kfs(pts, ease=True):
    def f(b):
        P = sorted(pts(b)); return P
    return f
class SBeat(Clean):
    def __init__(self, narr, kf, extra=None, meter=True, dur=3.0):
        self.kf, self.extra, self.meter = kf, extra, meter; self._pts = None
        super().__init__(narr, self._d, dur, cut="cut", push=0)
    def Hh(self, lt):
        if self._pts is None: self._pts = sorted(self.kf(self))
        P = self._pts
        if lt <= P[0][0]: return P[0][1]
        for (t0, k0), (t1, k1) in zip(P, P[1:]):
            if lt <= t1: return k0 + (k1 - k0) * eio((lt - t0) / max(1e-6, t1 - t0))
        return P[-1][1]
    def _d(self, img, lt, p, b):
        h = self.Hh(lt); e = clamp((h - 10) / 14); t = lt + getattr(self, "t0", 0)
        sc = road(t, 1.8 + 1.0 * e * math.sin(t * 1.1) + .6 * e * e * math.sin(t * 2.3), h); sc = impair(sc, t, e); img.paste(sc)
        hud(img, h, lt, self.meter)
        if self.extra: self.extra(img, lt, b, h)

def sleep_goggles():
    def x1(img, lt, b, h): pass
    def x_hook(img, lt, b, h):
        a = clamp((lt - .1) / .25); tx(img, "24 HOURS AWAKE", 540, 760, 76, "black", WHITE, a=a, scale=pop(a), maxw=1000)
        t2 = A(b, "legally", b.dur - 1.2)
        if lt > t2: tx(img, "DRUNK", 540, 900, 110, "black", RED, a=clamp((lt - t2) / .2), scale=pop((lt - t2) / .3), maxw=1000)
    def x_study(img, lt, b, h):
        a = clamp((lt - A(b, "two", .3)) / .3); tx(img, "OCCUP. & ENVIRON. MEDICINE · 2000", 540, 575, 30, "bold", (255, 224, 120), a=a, shadow=False, maxw=900)
    def x_micro(img, lt, b, h):
        t4 = A(b, "four", 3.0)
        if lt > t4 - .2: tx(img, "4 s asleep at 100 km/h = 111 m blind", 540, 620, 40, "black", RED, a=clamp((lt - t4 + .2) / .3), shadow=False, maxw=980)
    def x_deaths(img, lt, b, h):
        a = clamp((lt - A(b, "official", .3)) / .3); tx(img, "684 official", 300, 640, 54, "black", (255, 224, 120), a=a, shadow=False, maxw=500)
        a2 = clamp((lt - A(b, "aaa", 3.0)) / .3); tx(img, "~6,700 AAA estimate", 770, 640, 48, "black", RED, a=a2, shadow=False, maxw=520)
    def x_end(img, lt, b, h):
        a = clamp((lt - A(b, "treat", 1.0)) / .3); tx(img, "TREAT IT LIKE A DRINK", 540, 640, 64, "black", WHITE, a=a, scale=pop(a), maxw=1000)
    N = [
     ("This is what twenty four hours without sleep does to you. Not tired. Legally drunk.", lambda b: [(0, 24), (A(b, "legally", b.dur - 1.2), 24), (b.dur, 4)], x_hook),
     ("In the year two thousand, a study tested exactly this. After seventeen hours awake, people performed like they had a blood alcohol of point zero five.", lambda b: [(0, 4), (A(b, "seventeen", 2.5), 17), (b.dur, 17.2)], x_study),
     ("Stay up twenty hours and you're near the legal limit. Twenty four hours, and it's point one zero.", lambda b: [(0, 17.2), (A(b, "twenty", 1.0), 20.4), (A(b, "four", 3.0), 24), (b.dur, 24)], x1),
     ("And here's the scary part. You don't feel that drunk. Sleepy people are terrible judges of how impaired they are.", lambda b: [(0, 24), (b.dur, 24)], x1),
     ("Even four seconds of microsleep at a hundred kilometers an hour is a hundred and eleven meters, with nobody driving.", lambda b: [(0, 24), (b.dur, 24)], x_micro),
     ("The official US count is six hundred eighty four drowsy driving deaths in a year. A big AAA study puts the real number near six thousand seven hundred.", lambda b: [(0, 24), (b.dur, 24)], x_deaths),
     ("So the all-nighter, or the late drive home. Treat it like a drink. Don't. And send this to someone who pulls all-nighters.", lambda b: [(0, 24), (A(b, "treat", 1.0), 24), (b.dur, 24)], x_end),
    ]
    beats = []
    for n, kf, ex in N:
        beats.append(SBeat(n, kf, ex))
    return Reel("405_sleep_drunk", beats, style="cine", seed=405, gain_music=.45, snap=False, grid=0, safe_zone=False, vo=[(i, n) for i, (n, kf, ex) in enumerate(N)],
        title="24 hours awake is legally drunk", caption="staying up 24 hours impairs you like a blood alcohol of 0.10. send this to the friend who pulls all-nighters",
        story="Williamson & Feyer 2000, Occup Environ Med 57:649: after 17 h awake performance equals BAC 0.05%; after 24 h equals about 0.10%. 100 km/h = 27.8 m/s; 4 s = 111 m. Van Dongen 2003: chronic sleep restriction - subjective sleepiness lags behind performance loss.")
REELS = dict(sleep_goggles=sleep_goggles)
