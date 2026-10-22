"""Batch 62: your life in full moons. 990 moons in a grid; the narration spends them."""
import math
import numpy as np
from PIL import Image, ImageDraw
from scripts.common import *
from motion import *
import motion, voice

PER_YEAR = 365.25 / 29.530588; TOTAL = 990
GX0, GY0, PITCH, COLS = 45, 780, 22, 45
LIT = (255, 238, 176); GRAYC = (62, 66, 98); GOLD = (255, 214, 0); BG = (6, 6, 14)
SEEN = [9, 33, 61, 88, 120, 151, 187, 214, 250, 286]
def A(b, w, d=None, occ=0): return b.at(w, occ, d)

def grid(img, vis, gray, lt, hl_first=0, seen=0, pulse=0.0, scale=1.0):
    ss = 2; w, h = COLS * PITCH + 20, 22 * PITCH + 20; lay = Image.new("RGBA", (w * ss, h * ss), (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
    vis = int(min(TOTAL, vis)); gray = int(min(vis, gray))
    for i in range(vis):
        cx = (10 + PITCH * (i % COLS) + PITCH / 2) * ss; cy = (10 + PITCH * (i // COLS) + PITCH / 2) * ss
        if i < gray:
            if seen and i in SEEN[:seen]: r = 9.5 * ss; c = (255, 214, 0)
            else: r = 6.5 * ss; c = GRAYC
        else:
            k = 1 + pulse * .12 * math.sin(lt * 5 + i * .31); r = 8.5 * ss * k; c = LIT
        d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=c + (255,))
        if i < hl_first: d.ellipse([cx - 11 * ss, cy - 11 * ss, cx + 11 * ss, cy + 11 * ss], outline=GOLD + (255,), width=2 * ss)
    lay = lay.resize((w, h), Image.LANCZOS); img.paste(lay, (GX0 - 10, GY0 - 10), lay)
    if 0 < gray < vis:   # the moon being spent right now: a ring bursts from the leading edge
        i = gray - 1; cx = GX0 + PITCH * (i % COLS) + PITCH / 2; cy = GY0 + PITCH * (i // COLS) + PITCH / 2; ph = (lt * 6) % 1.0
        ring(img, cx, cy, 8 + 26 * ph, 3, (255, 140, 150), .9 * (1 - ph)); glow(img, cx, cy, 34, (255, 140, 150), .45)

_ph = {}
def moon_phase(img, cx, cy, r, ph, a=1.0):
    key = (r, int(ph * 90) % 90)
    if key not in _ph:
        n = int(2 * r); yy, xx = np.mgrid[0:n, 0:n]; u = (xx - r + .5) / r; v = (yy - r + .5) / r; rr = u * u + v * v; edge = np.sqrt(np.clip(1 - v * v, 0, 1)); p_ = key[1] / 90
        xt = math.cos(2 * math.pi * p_) * edge
        lit = (u > xt) if p_ < .5 else (u < -xt); disc_ = np.clip((1 - np.sqrt(rr)) * r, 0, 1)
        shade = .82 + .18 * np.cos(np.sqrt(np.clip(rr, 0, 1)) * 1.2)
        base = np.zeros((n, n, 4), np.uint8); base[..., :3] = np.array([26, 30, 52]); lc = (np.array([236, 236, 244])[None, None] * shade[..., None]); base[..., :3] = np.where(lit[..., None], lc, base[..., :3]).astype(np.uint8)
        # a few craters on the lit side
        for (dx, dy, q) in ((-.3, -.25, .2), (.3, .2, .26), (-.1, .5, .12), (.45, -.35, .1)):
            m = ((u - dx) ** 2 + (v - dy) ** 2) < q * q; base[..., :3] = np.where((m & lit)[..., None], (base[..., :3] * .86).astype(np.uint8), base[..., :3])
        base[..., 3] = (disc_ * 255).astype(np.uint8); _ph[key] = Image.fromarray(base, "RGBA")
    sp = _ph[key]
    if a < 1: sp = sp.copy(); sp.putalpha(sp.getchannel("A").point(lambda v: int(v * a)))
    glow(img, cx, cy, r * 1.9, (180, 195, 255), .28 * a * (.3 + .7 * abs(math.sin(math.pi * ph))))
    img.paste(sp, (int(cx - r), int(cy - r)), sp)

def hud(img, big, sub, col=(255, 255, 255), lt=0, a=1.0):
    tx(img, big, 540, 230, 150, "black", col, a=a, maxw=900); tx(img, sub, 540, 345, 38, "bold", (190, 198, 235), a=a, shadow=False, maxw=900)

def moons():
    def hook(img, lt, p, b):
        t1 = A(b, "whole", b.dur - 1.0); u = eio(seg(lt, .5, t1)); vis = TOTAL * u
        hud(img, f"{int(vis)}", "FULL MOONS. THAT'S YOUR WHOLE LIFE.", GOLD)
        moon_phase(img, 540, 520, 150, (lt * .18) % 1.0); grid(img, vis, 0, lt)
    def cycle(img, lt, p, b):
        ts = A(b, "twentynine", .8); ph = clamp((lt - ts) / 2.2) if lt > ts else 0.0
        moon_phase(img, 540, 520, 150, (.5 + ph) % 1.0 if lt > ts else .5)
        days = 29.5 * ph; hud(img, f"{days:.1f} days" if lt > ts else "29.5 days", "FROM FULL MOON TO FULL MOON", (255, 255, 255))
        hl = 12 if lt > A(b, "twelve", 3.6) else 0
        grid(img, TOTAL, 0, lt, hl_first=hl)
        if hl: tx(img, "12 = one year", 540, 700, 40, "black", GOLD, a=clamp((lt - A(b, "twelve", 3.6)) / .3), shadow=False)
        t3 = A(b, "nine", b.dur - 1.3)
        if t3 < lt and not lt > A(b, "seventythree", b.dur - .8): tx(img, "80 YEARS = 989", 540, 1310, 50, "black", GOLD, a=clamp((lt - t3) / .3), shadow=False, maxw=900)
        t4 = A(b, "seventythree", b.dur - .8)
        if lt > t4: tx(img, "73 YEARS = 903", 540, 1310, 50, "black", (255, 140, 150), a=clamp((lt - t4) / .3), shadow=False, maxw=900)
    def eighteen(img, lt, p, b):
        t0 = A(b, "eighteen", .3); t1 = A(b, "gone", 2.8); g = 222 * eio(seg(lt, t0, t1))
        hud(img, f"{int(g)}", "GONE BY AGE 18", (255, 140, 150)); moon_phase(img, 540, 520, 150, (lt * .12) % 1.0); grid(img, TOTAL, g, lt)
        tx(img, "AGE 18", 850, 520, 44, "black", GOLD, shadow=False)
    def decades(img, lt, p, b):
        t30 = A(b, "thirty", .4); t40 = A(b, "forty", 3.0)
        g = 309 + (371 - 309) * eio(seg(lt, t30 - .2, t30 + 1.0)); g = g + (495 - 371) * eio(seg(lt, t40 - .2, t40 + 1.0)) if lt > t30 + 1.0 else g
        age = "AGE 30" if lt < t40 - .2 else "AGE 40"; hud(img, f"{int(g)}", "FULL MOONS ALREADY GONE", (255, 140, 150)); moon_phase(img, 540, 520, 150, (lt * .12) % 1.0); tx(img, age, 850, 520, 44, "black", GOLD, shadow=False); grid(img, TOTAL, g, lt)
    def twentyfive(img, lt, p, b):
        t0 = A(b, "twentyfive", .5); t1 = A(b, "behind", 3.0); g = 222 + (309 - 222) * eio(seg(lt, t0 - .3, t0 + .9)); left = TOTAL - int(g) - 1 + 1
        hud(img, f"{TOTAL - int(g)} left", f"{int(g)} already gone", LIT); moon_phase(img, 540, 520, 150, (lt * .12) % 1.0); grid(img, TOTAL, g, lt, pulse=1.0)
        tx(img, "AGE 25", 850, 520, 44, "black", GOLD, shadow=False)
    def honest(img, lt, p, b):
        t0 = A(b, "many", 1.0); n = int(10 * clamp((lt - t0) / 2.5)); hud(img, "?", "HOW MANY DID YOU LOOK AT?", GOLD); moon_phase(img, 540, 520, 150, (lt * .1) % 1.0)
        grid(img, TOTAL, 495, lt, seen=n, pulse=0)
        if lt > A(b, "twenty", 4.0): tx(img, "10? 20?", 850, 520, 54, "black", GOLD, scale=pop((lt - A(b, "twenty", 4.0)) / .3), shadow=False)
    def parents(img, lt, p, b):
        t0 = A(b, "sixty", 2.0); g = 495 + (742 - 495) * eio(seg(lt, t0 - .2, t0 + 1.6)); hud(img, f"{TOTAL - int(g)}", "FULL MOONS LEFT. PARENTS AT 60.", (255, 214, 0)); moon_phase(img, 540, 520, 150, (lt * .12) % 1.0)
        grid(img, TOTAL, g, lt, pulse=1.0)
    def call(img, lt, p, b):
        hud(img, "247", "NIGHTS TO CALL AND SAY: GO LOOK OUTSIDE", LIT); moon_phase(img, 540, 520, 150, .5); grid(img, TOTAL, 742, lt, pulse=1.0)
    def end(img, lt, p, b):
        k = eio(seg(lt, .2, b.dur - .3)); g = 742 + 247 * k; hud(img, "TONIGHT", "IF IT'S OUT, GO LOOK UP", GOLD, a=1.0)
        if k > .05: starfield(img, lt, 10)
        glow(img, 540, 650, 520 * k + 120, (150, 170, 255), .35 * k); moon_phase(img, 540, 650, int(120 + 100 * k), .5); grid(img, TOTAL, g, lt, pulse=0, scale=1) if k < .98 else None
    N = [
     ("You will see about nine hundred and ninety full moons in your whole life. That's it. That's the entire supply.", hook),
     ("A full moon comes around every twenty-nine and a half days. Twelve and a bit every year. Eighty years gives you nine hundred eighty-nine. The world average is closer to seventy-three, which is about nine hundred.", cycle),
     ("By eighteen, over two hundred are already gone. Most of them, you never even noticed.", eighteen),
     ("If you're twenty-five, three hundred and nine are behind you. Six hundred eighty are left.", twentyfive),
     ("At thirty, you've used up three hundred and seventy-one. At forty, nearly five hundred.", decades),
     ("Be honest. How many did you actually stop and look at? Ten? Twenty?", honest),
     ("Now think about your parents. At sixty, they have about two hundred and fifty left.", parents),
     ("Not years. Full moons. Every one of them is a night to call and say, go look outside.", call),
     ("Tonight, if it's out, look up. Then tell someone to do the same.", end),
    ]
    beats = [Clean(n, d, 3.0, cut="cut", push=0) for n, d in N]
    return Reel("402_full_moons", beats, style="cine", seed=402, gain_music=.5, snap=False, grid=0, safe_zone=False, vo=[(i, n) for i, (n, d) in enumerate(N)],
        title="you will only see 990 full moons", caption="you only get about 990 full moons in a whole life. send this to your parents and tell them to go look outside tonight",
        story="Synodic month 29.53 days -> 12.37 full moons a year. 80 years = 989; age 18 = 223 used; age 25 = 309 used (680 left); age 60 = 742 used (about 247 left).")
REELS = dict(full_moons=moons)
