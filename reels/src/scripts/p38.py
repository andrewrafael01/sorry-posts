"""Premium 38: adult-humor what-if (kept non-explicit: a clothed blocky guy under a blanket, only a bumping lump and an arm are shown). Each stroke is twice as fast as the last; hand speed = rate x 0.3 m. Passes the speed of sound (343 m/s) at about 1,143 strokes/s and the speed of light at 1e9 strokes/s."""
import math, random
import numpy as np
import reel, whatif, lowpoly as lp
from motion import Clean
from engine import W, H
from scripts.p35 import clamp, smooth, big_word
from scripts.p36 import mkq
def hudn(img, label, value, sub=None): whatif.hud(img, label, value, sub, y=250, big=84)

def bedroom(lt, rate, cam, stage):
    """stage 0 normal, 1 smoke, 2 fire, 3 house blown apart"""
    sc = lp.Scene(); rs = random.Random(8)
    vis = min(rate, 5.0) * (1 if stage < 2 else 3.0); amp = .05 + .05 * math.log2(max(1, rate)) / 4; shake = .0 if rate < 40 else min(.35, .03 * math.log2(rate))
    if stage >= 3:
        u = lt; push = lambda x, y, z: ((x * (1 + u * 1.2)), y + u * rs.uniform(1, 4) * (1 if y > 0 else 0), z + u * rs.uniform(-1, 3))
    sc.floor((0, -.05, 3), (12, .1, 12), (176, 130, 84)); sc.box((0, 1.6, 8.6), (12, 3.2, .3), (210, 190, 200)); sc.box((-5.9, 1.6, 3), (.3, 3.2, 12), (190, 170, 190)); sc.box((5.9, 1.6, 3), (.3, 3.2, 12), (190, 170, 190)); sc.box((0, 3.3, 3), (12, .2, 12), (240, 240, 244))
    sc.quad([(-1.0, 1.2, 8.44), (1.0, 1.2, 8.44), (1.0, 2.6, 8.44), (-1.0, 2.6, 8.44)], (110, 150, 200), bias=-.05)
    sc.box((0, .35, 5.2), (2.6, .7, 4.2), (90, 90, 150)); sc.box((0, .75, 3.7), (2.4, .12, 1.0), (240, 240, 244))                       # bed + pillow
    sc.box((0, 1.0, 3.75), (.38, .38, .38), (236, 190, 150)); sc.box((0, 1.24, 3.75), (.4, .12, .4), (60, 40, 30))                   # head on pillow
    if stage < 3:
        bump = math.sin(lt * math.pi * 2 * vis) * amp; blanket = (210, 90, 90)
        if stage < 2: sc.box((0 + math.sin(lt * 90) * shake * .3, .82, 5.5), (2.3, .22, 3.2), blanket)
        sc.box((.55 + math.sin(lt * 80) * shake * .2, .9 + bump, 5.5), (.28, .3 + abs(bump) * .8, .5), blanket if stage < 2 else (60, 30, 30))   # the lump
        sc.box((.9, .95 + bump * .6, 5.0), (.22, .22, .7), (240, 200, 70))                                                              # forearm
    if stage >= 1:
        for q in range(30): a = lt * 3 + q; sc.disc((.6 + math.sin(a) * .5, 1.0 + ((lt * 1.2 + q * .13) % 2.6), 5.3 + math.cos(a * .8) * .5), .22 + .02 * (q % 4), (90, 90, 96))
    if stage >= 2:
        for q in range(40): a = lt * 9 + q * 1.7; sc.disc((math.sin(a) * 1.4, .8 + abs(math.sin(lt * 7 + q)) * 1.6, 4.4 + math.cos(a * .7) * 1.6), .18 + .05 * (q % 3), (255, 120 + (q * 23) % 110, 30))
    if stage >= 3:
        for q in range(5):
            r = (lt * 9 + q * 4) % 22; sc.disc((0, 1.6, 5.2), r * .4 + .2, (255, 230 - q * 20, 190 - q * 20))
    return lp.render(sc, cam, sky=((226, 218, 226), (240, 234, 240)), fog=((240, 234, 240), 16.0, 60.0))
def sonic_town(lt, cam, rate):
    sc = lp.Scene(); rs = random.Random(12)
    sc.floor((0, -.06, 40), (300, .1, 300), (118, 174, 100)); sc.floor((0, 0, 40), (7, .1, 300), (74, 76, 84))
    for z in np.arange(8, 120, 14):
        for sx in (-1, 1):
            d = abs(z - 14); alive = lt < d * .05
            if alive: sc.box((sx * 9.5, 3, z), (7, 6, 8), (rs.randint(190, 235), rs.randint(170, 215), rs.randint(150, 200))); sc.box((sx * 9.5, 6.8, z), (7.4, 1.6, 8.4), (150, 70, 60))
    r = lt * 26
    for k in range(3): sc.disc((0, 1.5, 14), r * (.9 - k * .08) + .5, (255, 255 - k * 20, 220 - k * 30))
    for q in range(40): a = q * 2.399; sc.disc((math.cos(a) * r * .7, 1 + (q % 7) * .8, 14 + math.sin(a) * r * .7), .3, (210, 90, 30))
    return lp.render(sc, cam, sky=((226, 218, 226), (240, 234, 240)), fog=((240, 234, 240), 60.0, 240.0))
Q = "What if every jerk was twice as fast as the last?"
def beat(rate0, rate1, stage, cam_fn, sub=None, town=False):
    def draw(img, lt, p, b):
        rate = rate0 * (rate1 / rate0) ** p if rate0 > 0 else 0
        cam = cam_fn(p, lt)
        img.paste(sonic_town(lt, cam, rate) if town else bedroom(lt, rate, cam, stage)); mkq(Q)(img)
        hand = rate * 0.3
        hudn(img, "Strokes per second", f"{rate:,.0f}", sub or (f"hand speed {hand:,.0f} m/s" + ("  ·  sound is 343" if hand > 100 else "")))
        big_word(img, b, lt)
    return draw
N = [
 ("What if you jerked off twice as fast every single time?", beat(1, 1, 0, lambda p, t: lp.Cam((3.2, 2.6, 0.5), (0, .8, 5.2), 66), sub="hand speed 0 m/s")),
 ("One stroke per second. Casual. Relaxing. Almost therapeutic.", beat(1, 2, 0, lambda p, t: lp.Cam((3.0, 2.4 - .3 * p, 1.0), (0, .8, 5.2), 64))),
 ("8 per second. Now it's cardio.", beat(4, 8, 0, lambda p, t: lp.Cam((2.8, 2.2, 1.4), (0, .8, 5.2), 62))),
 ("64 per second. Your arm is filing a complaint.", beat(32, 64, 0, lambda p, t: lp.Cam((2.6, 2.1, 1.8), (0, .8, 5.2), 60))),
 ("1,200 a second, and your hand breaks the sound barrier. Congratulations. You're a fighter jet.", beat(500, 1200, 1, lambda p, t: lp.Cam((2.4 + math.sin(t * 60) * .04, 2.0, 2.0), (0, .8, 5.2), 58))),
 ("Your bed catches fire. The blanket is gone. The neighbors hear a sonic boom and assume it's a gas leak.", beat(1200, 20000, 2, lambda p, t: lp.Cam((3.2 - 1.2 * p, 3.0, 0.4), (0, .8, 5.2), 66))),
 ("At a billion strokes a second, your hand hits the speed of light. The whole street is gone.", beat(1e6, 1e9, 3, lambda p, t: lp.Cam((0, 5 + 14 * p, -6 - 4 * p), (0, 1, 18), 70), town=True)),
 ("And you still didn't finish. Typical.", beat(1e9, 1e9, 3, lambda p, t: lp.Cam((0, 10, -8), (0, 1, 18), 70), town=True)),
]
def jerk():
    shots = [Clean(n, d, 3.0, cut="cut", push=0, cap=False) for n, d in N]
    return reel.Reel("593_whatif_jerk_doubling", shots, style="cine", seed=593, gain_music=.35, snap=False, grid=0, safe_zone=False, vo=[(i, n) for i, (n, d) in enumerate(N)], title="what if every jerk was twice as fast", caption="x", story="Doubling stroke rate; hand speed = rate x 0.3 m: sound barrier at about 1,143 per second, light speed at 1e9 per second. Non-explicit visuals: blanket lump and forearm only.")
REELS = dict(jerk=jerk)
