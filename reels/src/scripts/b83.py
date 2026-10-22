"""Batch 83: the reunions left. A grandmother back home is 78; you fly back every two years; she lives about ten more years (SSA table, women at 78: about 10.5). Five flights."""
import math
import numpy as np
from PIL import Image, ImageDraw
from scripts.common import *
from motion import *
import motion, voice

GOLD = (255, 214, 120); SOFT = (205, 220, 245); WHITE = (255, 255, 255); WARM = (255, 150, 110)
def A(b, w, d=None, occ=0): return b.at(w, occ, d)
EC = (540, 800); ER = 330
HERE = (EC[0] - 210, EC[1] + 120); HOME = (EC[0] + 215, EC[1] - 150)

def bez(t, p0, p1, p2):
    return ((1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * p1[0] + t * t * p2[0], (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * p1[1] + t * t * p2[1])

def arcs(img, lt, n_done, cur_u, tag=True):
    ctrl = (EC[0] - 20, EC[1] - ER - 90)
    for k in range(n_done):
        pts = [bez(t / 40, HERE, ctrl, HOME) for t in range(41)]; line(img, pts, 3, GOLD, .35 + .3 * (k == n_done - 1))
    if cur_u is not None and 0 < cur_u < 1:
        pts = [bez(min(cur_u, t / 40), HERE, ctrl, HOME) for t in range(int(cur_u * 40) + 1)]
        if len(pts) > 1: line(img, pts, 4, GOLD, .9)
        x, y = bez(cur_u, HERE, ctrl, HOME); ahead = bez(min(1, cur_u + .02), HERE, ctrl, HOME); ang = math.atan2(ahead[1] - y, ahead[0] - x)
        glow(img, x, y, 60, (255, 240, 200), .9); disc(img, x, y, 9, WHITE)
        from scripts.b61 import poly
        poly(img, [(x + 24 * math.cos(ang), y + 24 * math.sin(ang)), (x + 10 * math.cos(ang + 2.5), y + 10 * math.sin(ang + 2.5)), (x + 10 * math.cos(ang - 2.5), y + 10 * math.sin(ang - 2.5))], WHITE)
    for (x, y), lab, col in ((HERE, "HERE", (140, 220, 255)), (HOME, "HOME", (255, 170, 120))):
        glow(img, x, y, 70, col, .8 + .2 * math.sin(lt * 3)); disc(img, x, y, 14, col); tx(img, lab, x, y + 44, 30, "black", WHITE, shadow=True)

def globe(img, lt):
    cx, cy, r = EC[0], EC[1], ER
    glow(img, cx, cy, r * 1.5, (60, 110, 255), .35)
    ss = 2; S = int(2 * r + 40); lay = Image.new("RGBA", (S * ss, S * ss), (0, 0, 0, 0)); d = ImageDraw.Draw(lay); c = S * ss / 2; R = r * ss
    yy, xx = np.mgrid[0:S * ss, 0:S * ss]; dist = np.sqrt((xx - c) ** 2 + (yy - c) ** 2) / R; shade = np.clip(1 - dist ** 2, 0, 1)
    arr = np.zeros((S * ss, S * ss, 4), np.uint8); arr[..., 0] = (14 + 40 * shade).astype(np.uint8); arr[..., 1] = (26 + 80 * shade).astype(np.uint8); arr[..., 2] = (70 + 130 * shade).astype(np.uint8); arr[..., 3] = (dist < 1) * 255
    lay = Image.fromarray(arr, "RGBA"); d = ImageDraw.Draw(lay)
    for k in range(-3, 4):   # parallels
        y = c + R * k / 4.0; w = R * math.sqrt(max(0.0, 1 - (k / 4.0) ** 2)); d.ellipse([c - w, y - w * .12, c + w, y + w * .12], outline=(120, 170, 255, 110), width=2 * ss)
    for k in range(6):       # meridians, slowly turning
        a = (k / 6 + lt * .02) % 1.0 * math.pi; w = abs(math.cos(a)) * R; d.ellipse([c - w, c - R, c + w, c + R], outline=(120, 170, 255, 110), width=2 * ss)
    d.ellipse([c - R, c - R, c + R, c + R], outline=(170, 210, 255, 200), width=3 * ss)
    lay = lay.resize((S, S), Image.LANCZOS); img.paste(lay, (int(cx - S / 2), int(cy - S / 2)), lay)

def bg(img): img.paste(vgrad((6, 8, 24), (18, 22, 52), key="globe"))
def hud(img, big, sub, col=GOLD):
    tx(img, big, 540, 225, 108 if len(big) < 14 else 76, "black", col, maxw=980); tx(img, sub, 540, 330, 32, "bold", SOFT, shadow=False, maxw=980)

def reunions():
    def base(img, lt): bg(img); globe(img, lt)
    def hook(img, lt, p, b):
        base(img, lt); hud(img, "HOW MANY?", "MORE TIMES WILL YOU SEE HER", GOLD); arcs(img, lt, 0, None)
    def setup(img, lt, p, b):
        base(img, lt); hud(img, "AGE 78", "GRANDMA BACK HOME · YOU FLY EVERY 2 YEARS", WARM); arcs(img, lt, 0, (lt * .4) % 1)
    def math_(img, lt, p, b):
        base(img, lt); u = eio(seg(lt, .5, b.dur - .6)); age = 78 + 10 * u; n = int(u * 5 + .001); cur = (u * 5) % 1 if n < 5 else None
        hud(img, f"AGE {int(age)}", "ABOUT TEN MORE YEARS (WOMEN AT 78)", GOLD); arcs(img, lt, n, cur)
    def five(img, lt, p, b):
        base(img, lt); hud(img, "5 MORE", "REUNIONS", GOLD); arcs(img, lt, 5, None)
        tx(img, "5", EC[0], EC[1] - 10, 220, "black", WHITE, a=.0)
    def hug(img, lt, p, b):
        base(img, lt); hud(img, "ONE FLIGHT", "A SUITCASE. A LONG HUG AT THE AIRPORT.", WARM); arcs(img, lt, 5, None)
    def end(img, lt, p, b):
        base(img, lt); hud(img, "BOOK IT", "SEND THIS TO SOMEONE WHO LEFT HOME FOR YOU", GOLD); arcs(img, lt, 4, (lt * .5) % 1)
    N = [
     ("If your parents left their home country, here's a number nobody says out loud.", hook),
     ("Say grandma back home is seventy eight, and you fly back every two years.", setup),
     ("Women her age live about ten more years. Two years, ten years. That's five more reunions.", math_),
     ("Five. Each one a flight, a suitcase, and a long hug at the airport.", hug),
     ("So book the flight. And send this to someone who left home for you.", end),
    ]
    beats = [Clean(n, d, 3.0, cut="cut", push=0) for n, d in N]
    return Reel("427_reunions_left", beats, style="cine", seed=427, gain_music=.55, snap=False, grid=0, safe_zone=False, vo=[(i, n) for i, (n, d) in enumerate(N)],
        title="how many more times will you see grandma back home", caption="x", story="US Social Security period life table: remaining life expectancy of a 78-year-old woman is about 10-11 years. A visit every 2 years = about 5 more. Illustrative: the viewer substitutes their own numbers.")
REELS = dict(reunions=reunions)
