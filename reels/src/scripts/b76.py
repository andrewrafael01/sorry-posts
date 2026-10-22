"""Batch 76: 80 summers as 80 sky lanterns. Each year a lantern lifts away; you are at lantern N. A night sky with parallax, glow and drifting embers."""
import math
import numpy as np
from PIL import Image, ImageDraw
from scripts.common import *
from motion import *
from scripts.b61 import poly
import motion, voice

GOLD = (255, 200, 110); SOFT = (225, 215, 240); WHITE = (255, 255, 255); WARM = (255, 150, 100)
def A(b, w, d=None, occ=0): return b.at(w, occ, d)
rs = np.random.RandomState(77)
# 80 lanterns: row/col layout in a loose field, each with a phase
LAN = []
for i in range(80):
    col = i % 10; row = i // 10
    LAN.append((120 + col * 88 + rs.randn() * 14, 1130 - row * 105 + rs.randn() * 10, rs.rand() * 6.28, .8 + .5 * rs.rand()))
_stars = np.random.RandomState(5).rand(160, 3)

def sky(img, lt):
    img.paste(vgrad((6, 8, 24), (40, 22, 52), key="lan")); d = ImageDraw.Draw(img, "RGBA")
    for x, y, b in _stars:
        d.ellipse([x * W - 1.5, y * 900 - 1.5, x * W + 1.5, y * 900 + 1.5], fill=(255, 255, 255, int(70 + 140 * b * (.6 + .4 * math.sin(lt * 1.6 + x * 20)))))
    pts = [(0, H)] + [(x, 1330 - 40 * math.sin(x * .004 + 1) - 22 * math.sin(x * .013)) for x in range(0, W + 40, 40)] + [(W, H)]
    d.polygon(pts, fill=(8, 8, 18, 255))

def lantern(img, x, y, s, a=1.0, lt=0.0, ph=0.0, lit=1.0):
    fl = .85 + .15 * math.sin(lt * 4 + ph)
    glow(img, x, y, 78 * s * (.7 + .3 * lit), (255, 170, 80), .8 * a * lit * fl)
    body = [(x - 17 * s, y - 20 * s), (x + 17 * s, y - 20 * s), (x + 24 * s, y + 18 * s), (x - 24 * s, y + 18 * s)]
    poly(img, body, mix((70, 60, 70), (255, 196, 110), lit), a); poly(img, [(x - 12 * s, y - 14 * s), (x + 12 * s, y - 14 * s), (x + 16 * s, y + 12 * s), (x - 16 * s, y + 12 * s)], mix((60, 50, 60), (255, 236, 170), lit), a * .8)

def field(img, lt, gone, rise_prog=None, only_remaining=False):
    """gone: how many lanterns have lifted away (they are not drawn once above the screen)"""
    for i, (x, y, ph, sp) in enumerate(LAN):
        if i < gone:
            u = clamp((gone - i) / 3.0)
            if u >= 1: continue
            yy = y - (u ** 1.6) * 1500; xx = x + math.sin(lt + ph) * 14 + u * 60 * (1 if i % 2 else -1); lantern(img, xx, yy, 1.0 + u * .4, 1 - u * .5, lt, ph, 1.0)
        else:
            lantern(img, x + math.sin(lt * .5 + ph) * 6, y + math.sin(lt * .7 + ph) * 8, .9, 1.0, lt, ph, 1.0)

def hud(img, big, sub, col=GOLD):
    tx(img, big, 540, 225, 108 if len(big) < 14 else 80, "black", col, maxw=980); tx(img, sub, 540, 330, 32, "bold", SOFT, shadow=False, maxw=980)

def lanterns():
    def hook(img, lt, p, b):
        sky(img, lt); n = 80 * eio(seg(lt, .3, b.dur - .4)); hud(img, "80 SUMMERS", "THAT'S ABOUT ALL YOU GET")
        for i, (x, y, ph, sp) in enumerate(LAN):
            if i < n: lantern(img, x + math.sin(lt * .5 + ph) * 6, y + math.sin(lt * .7 + ph) * 8, .9, 1.0, lt, ph)
    def used(img, lt, p, b):
        sky(img, lt); t0 = A(b, "twenty", 1.5); g = 25 * eio(seg(lt, t0, t0 + 3.0)); hud(img, f"{int(g)} GONE", "IF YOU'RE 25", (255, 140, 130)); field(img, lt, g)
    def left(img, lt, p, b):
        sky(img, lt); hud(img, "55 LEFT", "NOT A LOT OF SKY", GOLD); field(img, lt, 25 + 0 * lt)
    def gone(img, lt, p, b):
        sky(img, lt); g = 25 + 55 * eio(seg(lt, .5, b.dur - .4)); hud(img, f"{80 - int(g) if 80 - int(g) > 0 else 0} LEFT", "ONE LIFTS AWAY EVERY YEAR", WHITE); field(img, lt, g)
    def one(img, lt, p, b):
        sky(img, lt); hud(img, "THIS ONE", "THE SUMMER YOU'RE IN", GOLD); field(img, lt, 25)
        x, y, ph, sp = LAN[25]; ring(img, x, y, 56 + 6 * math.sin(lt * 5), 4, GOLD, .9)
    def end(img, lt, p, b):
        sky(img, lt); hud(img, "SEND THIS", "TO SOMEONE YOU WANT TO SPEND IT WITH", WARM); field(img, lt, 25)
    N = [
     ("You get about eighty summers. That's all. Eighty.", hook),
     ("If you're twenty five, twenty five of them are already gone.", used),
     ("That leaves about fifty five. It's not a lot of sky.", left),
     ("And one lifts away every single year, whether you looked up or not.", gone),
     ("So make this one count. Go outside. Stay out late. Send this to someone you want to spend it with.", one),
    ]
    beats = [Clean(n, d, 3.0, cut="cut", push=0) for n, d in N]
    return Reel("418_eighty_summers", beats, style="cine", seed=418, gain_music=.55, snap=False, grid=0, safe_zone=False, vo=[(i, n) for i, (n, d) in enumerate(N)],
        title="you only get about 80 summers", caption="x", story="Assumes an 80-year life: one summer per year, 80 in total; at 25, 25 used and 55 left. Illustrative.")
REELS = dict(lanterns=lanterns)
