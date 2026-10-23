"""Batch 66: every human who ever lived as one galaxy. 1,170 stars (100 million people each); the last 80 glow: everyone alive today."""
import math
import numpy as np
from PIL import Image, ImageDraw
from scripts.common import *
from motion import *
import motion, voice

GOLD = (255, 214, 0); SOFT = (190, 198, 235); N = 1170; ALIVE = 80
def A(b, w, d=None, occ=0): return b.at(w, occ, d)
_r = np.random.RandomState(9); STARS = []
for i in range(N):
    u = i / N; rad = 36 + 470 * u ** .62; arm = i % 3; th = arm * 2 * math.pi / 3 + 3.1 * math.log(1 + rad / 40) + _r.randn() * .16
    STARS.append((rad, th, 2.6 + _r.rand() * 1.8))
CX, CY, SQ = 540, 830, .74

def galaxy(img, lt, vis, glow_k=0.0, rot0=0.0):
    d = ImageDraw.Draw(img, "RGBA"); rot = rot0 + lt * .06; vis = int(min(N, vis))
    glow(img, CX, CY, 150, (120, 130, 255), .35 * min(1, vis / 200))
    for i in range(vis):
        rad, th, s = STARS[i]; x = CX + rad * math.cos(th + rot); y = CY + rad * math.sin(th + rot) * SQ
        if i >= N - ALIVE:
            if glow_k > 0: glow(img, x, y, 22, GOLD, .6 * glow_k); d.ellipse([x - 6.5, y - 6.5, x + 6.5, y + 6.5], fill=(255, 226, 120, int(255 * (.35 + .65 * glow_k))))
            else: d.ellipse([x - s, y - s, x + s, y + s], fill=(96, 104, 150, 255))
        else:
            a = 140 + int(80 * math.sin(lt * 2 + i)); d.ellipse([x - s, y - s, x + s, y + s], fill=(96, 104, 150, a))

def hud(img, big, sub, col=(255, 255, 255)):
    tx(img, big, 540, 235, 120 if len(big) < 8 else 84, "black", col, maxw=980); tx(img, sub, 540, 345, 32, "bold", SOFT, shadow=False, maxw=980)

def galaxy_reel():
    def hook(img, lt, p, b):
        hud(img, "14 : 1", "DEAD FOR EVERY PERSON ALIVE", GOLD); galaxy(img, lt, N * eio(seg(lt, .2, b.dur - .5)))
    def counts(img, lt, p, b):
        t0 = A(b, "eight", 4.0); g = eio(seg(lt, t0, t0 + .8)); n = 117e9 * eio(seg(lt, .3, 2.6))
        hud(img, f"{n / 1e9:.0f} billion" if lt < t0 else "8 billion", "HUMANS EVER BORN" if lt < t0 else "ALIVE TODAY", (255, 255, 255) if lt < t0 else GOLD); galaxy(img, lt, N, g)
    def dark(img, lt, p, b):
        t0 = A(b, "ninety", 2.0); k = eio(seg(lt, t0, t0 + .6)); hud(img, "93% DARK" if lt > t0 else "ONE STAR EACH", "117 BILLION PEOPLE, 1 STAR PER 100 MILLION", (255, 140, 150) if lt > t0 else (255, 255, 255)); galaxy(img, lt, N, 1.0)
    def edge(img, lt, p, b):
        hud(img, "THE EDGE", "THE THIN GLOWING RIM IS NOW", GOLD); galaxy(img, lt, N, 1.0, rot0=.3)
        ring(img, CX, CY, 520 + 8 * math.sin(lt * 3), 3, GOLD, .35)
    def end(img, lt, p, b):
        hud(img, "BE KIND", "EVERY DARK STAR WAS SOMEONE'S WHOLE WORLD", (255, 255, 255)); galaxy(img, lt, N, .6 + .4 * math.sin(lt * 3), rot0=.6)
    N_ = [
     ("For every person alive right now, about fourteen have already died.", hook),
     ("About a hundred and seventeen billion humans have ever lived. Eight billion are alive today.", counts),
     ("Give every person who ever lived one star, and the sky is ninety three percent dark.", dark),
     ("You are one of the glowing few, standing at the very edge of the biggest crowd in history.", edge),
     ("Every dark star was someone's whole world. You are standing on the bright edge.", end),
    ]
    beats = [Clean(n, d, 3.0, cut="cut", push=0) for n, d in N_]
    return Reel("408_117_billion", beats, style="cine", seed=408, gain_music=.55, snap=False, grid=0, safe_zone=False, vo=[(i, n) for i, (n, d) in enumerate(N_)],
        title="for every person alive, 14 have died", caption="117 billion humans have ever lived and only 8 billion are alive. you are on the bright edge",
        story="Population Reference Bureau (Kaneda & Haub 2022): about 117 billion humans ever born, 8 billion alive today = about 7%; (117-8)/8 = 13.6 dead per living person. Estimates range about 100-120 billion depending on assumptions. 1 star = 100 million people: 1,170 stars, 80 glowing.")
REELS = dict(galaxy=galaxy_reel)
