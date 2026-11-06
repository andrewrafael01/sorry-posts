"""Premium 37: vulgar what-ifs in the low-poly world. (A) everyone takes a shit at the same time: 8.2e9 x 128 g = 1.05 million tonnes = about 3 Empire State Buildings = 29 cm deep over Central Park (3.41 km2).
(B) you piss non-stop for 75 years: 1.5 L/day x 365 x 75 = about 41,000 L, a backyard swimming pool."""
import math, random
import numpy as np
from PIL import Image
import reel, whatif, lowpoly as lp
from motion import Clean
from engine import W, H
from scripts.p35 import clamp, smooth, big_word
from scripts.p36 import mkq
def hudn(img, label, value, sub=None): whatif.hud(img, label, value, sub, y=250, big=84)

BROWN = (116, 78, 40)
# ---------------------------------------------------------------- A: park
def park(lt, mode, cam, k=0.0):
    rs = random.Random(7); sc = lp.Scene()
    sc.floor((0, -.06, 100), (240, .1, 700), (110, 170, 96)); sc.floor((0, 0, 100), (4, .05, 600), (190, 180, 160)); sc.floor((-14, .01, 100), (14, .04, 600), (80, 150, 220) if False else (96, 160, 90))
    for z in np.arange(-10, 260, 12):
        for sx in (-1, 1): sc.tree(sx * rs.uniform(10, 36), z + rs.uniform(-4, 4), rs.uniform(.8, 1.3))
    for z in np.arange(-10, 260, 28):
        for sx in (-1, 1): sc.building(sx * 70, z, 22, rs.uniform(40, 110), 22, (rs.randint(150, 210), rs.randint(140, 200), rs.randint(125, 190)))
    pl = random.Random(3)
    n = 200 if mode == "aerial" else 40
    for i in range(n):
        x = pl.uniform(-13, 13) if mode == "aerial" else pl.uniform(-4, 4); z = pl.uniform(8, 80) if mode == "aerial" else pl.uniform(4, 28)
        sh = (pl.randint(40, 240), pl.randint(40, 240), pl.randint(40, 240)); tpile = clamp(k * 1.4 - pl.random() * .4)
        if mode == "aerial": sc.person(x, z, pl.random() * 6.28, lt, shirt=sh, anim="squat" if tpile > 0 or k > 0 else "walk")
        else: sc.person(x, z, pl.random() * 6.28, lt + i, shirt=sh, anim="panic" if i % 3 == 0 else "idle")
        if mode == "aerial" and tpile > 0: sc.box((x, .28 * tpile, z - .5), (.9, .55 * tpile + .08, .9), BROWN); sc.box((x, .62 * tpile + .12, z - .5), (.55, .3 * tpile, .55), (96, 62, 30))
        if mode == "aerial" and tpile > .3 and i % 3 == 0:
            for f in range(3): a = lt * 6 + f * 2.1 + i; sc.disc((x + math.cos(a) * .5, 1.4 + math.sin(lt * 9 + f) * .2, z - .45 + math.sin(a) * .5), .05, (20, 20, 24))
    if mode == "ground":
        sc.floor((0, .29 * clamp(k * 1.2), 16), (80, .08, 90), BROWN)
        for f in range(40):
            a = lt * 5 + f * 1.7; sc.disc((math.cos(a * .7 + f) * 6, 1.2 + math.sin(a + f) * .6, 16 + math.sin(a * .5 + f * 3) * 10), .06, (20, 20, 24))
    return lp.render(sc, cam, sky=((110, 165, 235), (212, 230, 246)), fog=((212, 230, 246), 90.0, 320.0))
def pq(img): mkq("What if every human on Earth took a shit at the same time?")(img)
def a_beat(mode, kfn, cam_fn, mass=None, sub=None, depth=None):
    def draw(img, lt, p, b):
        img.paste(park(lt, mode, cam_fn(p, lt), kfn(p))); pq(img)
        if mass is not None: hudn(img, "Shit produced", f"{mass(p):,.0f} kg", sub)
        if depth is not None: hudn(img, "Depth over Central Park", f"{depth(p):,.0f} cm", "in shit")
        big_word(img, b, lt)
    return draw
MASS = 8.2e9 * 0.128
A_N = [
 ("What if every human on Earth took a shit at the exact same time?", a_beat("aerial", lambda p: 0.0, lambda p, t: lp.Cam((0, 17 - 3 * p, 0), (0, 0, 46), 66))),
 ("8 billion people. About 128 grams each. That's over a billion kilos of pure shit.", a_beat("aerial", lambda p: smooth(p), lambda p, t: lp.Cam((9, 13 - 2 * p, 4), (0, 0, 40), 66), mass=lambda p: MASS * smooth(p * 1.1), sub="8.2 billion people. 128 g each")),
 ("That's three Empire State Buildings. Made of shit.", a_beat("aerial", lambda p: 1.0, lambda p, t: lp.Cam((-9, 12, 4 + 6 * p), (0, 0, 42), 66), mass=lambda p: MASS, sub="three empire state buildings")),
 ("Spread it over Central Park and it's 29 centimeters of shit.", a_beat("ground", lambda p: smooth(p), lambda p, t: lp.Cam((0, 1.6, -3), (0, 1.0, 20), 66), depth=lambda p: 29 * smooth(p * 1.2))),
 ("The flies would be absolutely thriving.", a_beat("ground", lambda p: 1.0, lambda p, t: lp.Cam((1.5, 1.2 + .3 * p, 2), (0, 1.2, 20), 62), depth=lambda p: 29)),
 ("Every toilet on Earth is busy. Every bush is also busy.", a_beat("aerial", lambda p: 1.0, lambda p, t: lp.Cam((0, 30 - 8 * p, 10), (0, 0, 60), 70), mass=lambda p: MASS, sub="")),
 ("Anyway, somebody has to clean that up. Not me. Good luck.", a_beat("ground", lambda p: 1.0, lambda p, t: lp.Cam((2.5 - 2 * p, 1.5, -2), (0, 1.0, 18), 66), depth=lambda p: 29)),
]
def everyone_shits():
    shots = [Clean(n, d, 3.0, cut="cut", push=0, cap=False) for n, d in A_N]
    return reel.Reel("591_whatif_everyone_shits", shots, style="cine", seed=591, gain_music=.35, snap=False, grid=0, safe_zone=False, vo=[(i, n) for i, (n, d) in enumerate(A_N)], title="what if every human took a shit at once", caption="x", story="8.2e9 x 128 g = 1.05 million tonnes, about 3 Empire State Buildings, 29 cm deep over Central Park (3.41 km2).")

# ---------------------------------------------------------------- B: piss for 75 years
def yard(lt, frac, cam, stream=True):
    sc = lp.Scene(); rs = random.Random(4)
    sc.floor((0, -.06, 10), (120, .1, 120), (112, 176, 98)); sc.floor((0, .01, 8), (12, .05, 9), (214, 204, 186))
    sc.box((0, 3, 24), (20, 6, 10), (200, 170, 140)); sc.box((0, 6.6, 24), (21, 1.2, 11), (150, 70, 60)); 
    for i in range(-2, 3): sc.quad([(i * 3.5 - .8, 1.2, 18.95), (i * 3.5 + .8, 1.2, 18.95), (i * 3.5 + .8, 3.2, 18.95), (i * 3.5 - .8, 3.2, 18.95)], (70, 100, 140), bias=-.05)
    sc.floor((0, .02, 8), (9.0, .05, 6.0), (222, 220, 210)); yc = (np.array([86, 160, 235]) * (1 - frac) + np.array([232, 208, 60]) * frac).astype(int)
    sc.floor((0, .02 + .12, 8), (8.0, .05, 5.0), tuple(int(v) for v in yc))
    for x in (-9, 9): sc.tree(x, 14, 1.3)
    sc.person(-5.2, 5.0, math.pi / 2 + .0, lt * .2, shirt=(240, 200, 70), anim="idle")
    if stream:
        for q in range(30):
            u = (q / 30 + lt * 1.5) % 1.0; sc.disc((-4.8 + u * 4.4, 1.05 + .55 * math.sin(u * math.pi) - .75 * u * u, 5.0), .07, (240, 224, 90))
    return lp.render(sc, cam, sky=((110, 165, 235), (212, 230, 246)), fog=((212, 230, 246), 60.0, 200.0))
def qb(img): mkq("What if you pissed every second of your life?")(img)
def b_beat(frac_fn, cam_fn, years=None, litres=None, sub=None):
    def draw(img, lt, p, b):
        img.paste(yard(lt, frac_fn(p), cam_fn(p, lt))); qb(img)
        if litres is not None: hudn(img, "Piss produced", (f"{litres(p):,.1f} L" if litres(p) < 10 else f"{litres(p):,.0f} L"), sub)
        big_word(img, b, lt)
    return draw
B_N = [
 ("What if you pissed every second of your life?", b_beat(lambda p: 0.0, lambda p, t: lp.Cam((-1.5, 2.2, -2), (-3, 1.0, 6), 62))),
 ("An average adult pisses about a liter and a half every day. Disgusting. Consistent. But disgusting.", b_beat(lambda p: .02, lambda p, t: lp.Cam((-6.5 + p, 1.6, 1), (-4, 1.2, 6), 58), litres=lambda p: 1.5, sub="per day")),
 ("Over 75 years, that's 41 thousand liters of piss.", b_beat(lambda p: smooth(p) * 1.0, lambda p, t: lp.Cam((3 - 6 * p, 5 + 3 * p, -3), (0, .5, 8), 64), litres=lambda p: 41000 * smooth(p), sub="75 years")),
 ("Congratulations. You've filled a backyard swimming pool. With your own piss.", b_beat(lambda p: 1.0, lambda p, t: lp.Cam((8 - 4 * p, 7, -6), (0, .5, 9), 62), litres=lambda p: 41000, sub="a backyard swimming pool")),
 ("Now imagine your neighbor Dave swimming in it. Dave has no idea. Dave never has any idea.", b_beat(lambda p: 1.0, lambda p, t: lp.Cam((0, 4, -4 + 2 * p), (0, .5, 9), 66), litres=lambda p: 41000, sub="dave is fine")),
 ("And the worst part? You still have to pee again.", b_beat(lambda p: 1.0, lambda p, t: lp.Cam((-1.5, 2.2, -2 + 2 * p), (-3, 1.0, 6), 62), litres=lambda p: 41000 + 1.5 * p, sub="")),
]
def piss_pool():
    shots = [Clean(n, d, 3.0, cut="cut", push=0, cap=False) for n, d in B_N]
    return reel.Reel("592_whatif_piss_a_pool", shots, style="cine", seed=592, gain_music=.35, snap=False, grid=0, safe_zone=False, vo=[(i, n) for i, (n, d) in enumerate(B_N)], title="what if you pissed non-stop for your whole life", caption="x", story="1.5 L/day x 365 x 75 years = about 41,000 L = a backyard pool.")
REELS = dict(shits=everyone_shits, pool=piss_pool)
