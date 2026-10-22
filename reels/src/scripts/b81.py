"""Batch 81: happiness spreads three degrees (Christakis & Fowler, BMJ 2008, Framingham: 4,739 people). A glowing network; the ripple travels outward from one person."""
import math
import numpy as np
from PIL import Image, ImageDraw
from scripts.common import *
from motion import *
import motion, voice

GOLD = (255, 214, 120); SOFT = (205, 220, 245); WHITE = (255, 255, 255); WARM = (255, 150, 110); PINK = (255, 130, 190)
def A(b, w, d=None, occ=0): return b.at(w, occ, d)
CX, CY = 540, 860
rs = np.random.RandomState(11)
# three rings of people: 5 friends, 5x3 friends-of-friends, 15x2 third degree; each child links to a parent
NODES = [(CX, CY, 0, -1)]
R1, R2, R3 = 170, 330, 500
for i in range(5):
    a = -math.pi / 2 + 2 * math.pi * i / 5 + .1; NODES.append((CX + R1 * math.cos(a), CY + R1 * math.sin(a) * .95, 1, 0))
l1 = list(range(1, 6)); l2 = []
for pi_, p in enumerate(l1):
    for j in range(3):
        a = -math.pi / 2 + 2 * math.pi * pi_ / 5 + (j - 1) * .34 + .1; NODES.append((CX + R2 * math.cos(a), CY + R2 * math.sin(a) * .95, 2, p)); l2.append(len(NODES) - 1)
for pi_, p in enumerate(l2):
    for j in range(2):
        a0 = math.atan2((NODES[p][1] - CY) / .95, NODES[p][0] - CX); a = a0 + (j - .5) * .17; NODES.append((CX + R3 * math.cos(a), CY + R3 * math.sin(a) * .95, 3, p))

def net(img, lt, wave, you=True):
    """wave: how far the ripple has travelled, in degrees (0..3.2)"""
    d = ImageDraw.Draw(img, "RGBA")
    for i, (x, y, deg, par) in enumerate(NODES):
        if par < 0: continue
        px, py = NODES[par][0], NODES[par][1]; k = clamp(wave - (deg - 1) - .0); lit = clamp(wave - deg + 1)
        d.line([(px, py), (x, y)], fill=(120, 140, 200, int(60 + 150 * lit)), width=2 + int(2 * lit))
    for i, (x, y, deg, par) in enumerate(NODES):
        lit = clamp(wave - deg + 1) if deg > 0 else 1.0; col = (255, 214, 120) if deg == 0 else (PINK if deg == 1 else ((255, 170, 110) if deg == 2 else (120, 220, 255)))
        r = 12 + (6 if deg == 0 else 0) - deg
        if lit > .02: glow(img, x, y, 30 + 30 * lit * (1 + .2 * math.sin(lt * 4 + i)), col, .55 * lit)
        d.ellipse([x - r, y - r, x + r, y + r], fill=tuple(int(c * (.25 + .75 * lit)) for c in col) + (255,))
    # the ripple ring itself
    if 0 < wave < 3.3:
        rr = [0, R1, R2, R3][int(min(3, math.floor(wave)))] + (([R1, R2, R3, R3][int(min(3, math.floor(wave)))] - [0, R1, R2, R3][int(min(3, math.floor(wave)))]) * (wave - math.floor(wave)))
        ring(img, CX, CY, rr, 4, (255, 255, 255), .35 * (1 - clamp((wave - 3) / .3)))
    tx(img, "YOU", CX, CY, 26, "black", (30, 20, 10), shadow=False)

def bg(img): img.paste(vgrad((14, 12, 32), (40, 24, 60), key="happy"))
def hud(img, big, sub, col=GOLD):
    tx(img, big, 540, 225, 108 if len(big) < 12 else 76, "black", col, maxw=980); tx(img, sub, 540, 330, 32, "bold", SOFT, shadow=False, maxw=980)
def pct(img, x, y, txt, a, col):
    if a > .03: tx(img, txt, x, y, 72, "black", col, a=a, scale=motion.pop(a), shadow=True, maxw=300)

def happy():
    def hook(img, lt, p, b):
        bg(img); w = 3.2 * eio(seg(lt, .8, b.dur - .5)); hud(img, "IT SPREADS", "A STUDY OF 4,739 PEOPLE OVER 20 YEARS", GOLD); net(img, lt, w)
    def one(img, lt, p, b):
        bg(img); hud(img, "+15%", "A HAPPY FRIEND MAKES YOU MORE LIKELY TO BE HAPPY", PINK); net(img, lt, 1.0 + .1 * math.sin(lt * 3))
    def two(img, lt, p, b):
        bg(img); w = 1 + 2.2 * eio(seg(lt, .2, b.dur - .5)); a = clamp((lt - A(b, "ten", 1.2)) / .3); b2 = clamp((lt - A(b, "six", 3.4)) / .3)
        hud(img, "+10% · +6%" if lt > A(b, "six", 3.4) else ("+10%" if lt > A(b, "ten", 1.2) else "+?"), "FRIEND OF A FRIEND · AND ONE MORE STEP", (255, 170, 110) if b2 < .3 else (120, 220, 255)); net(img, lt, w)
    def stranger(img, lt, p, b):
        bg(img); hud(img, "3 STEPS AWAY", "SOMEONE YOU'LL NEVER MEET", (120, 220, 255)); net(img, lt, 3.1 + .1 * math.sin(lt * 4))
    def end(img, lt, p, b):
        bg(img); w = 3.2; hud(img, "TAG THEM", "THE PERSON WHO MAKES YOUR DAY BETTER", GOLD); net(img, lt, w)
    N = [
     ("Your happiness doesn't stop at you. A study of nearly five thousand people, over twenty years, found it spreads.", hook),
     ("A happy friend makes you about fifteen percent more likely to be happy.", one),
     ("A friend of a friend, about ten percent. And one more step out, about six. A stranger you'll never meet.", two),
     ("So when you make one person's day, you might be changing someone three steps away.", stranger),
     ("Tag the person who makes your day better. Then be that for someone else today.", end),
    ]
    beats = [Clean(n, d, 3.0, cut="cut", push=0) for n, d in N]
    return Reel("425_happiness_spreads", beats, style="cine", seed=425, gain_music=.55, snap=False, grid=0, safe_zone=False, vo=[(i, n) for i, (n, d) in enumerate(N)],
        title="happiness spreads three degrees", caption="x", story="Christakis & Fowler, BMJ 2008 (Framingham Heart Study social network, 4,739 people, 1983-2003): a person is about 15% more likely to be happy if a directly connected person is happy, about 10% for a friend of a friend, about 6% for a friend of a friend of a friend. Observational; effect sizes are estimates.")
REELS = dict(happy=happy)
