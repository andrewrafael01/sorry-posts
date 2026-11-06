"""Premium 39: three more vulgar what-ifs. (A) you keep every shit you ever take: 0.128 kg x 365 x 80 = 3,738 kg = 2.5 hippos (1,500 kg). (B) you fart every time you blink: about 15,000 blinks a day x 90 mL = 1,350 L/day, a 50 m3 conference room fills in 37 days.
(C) every human pukes at once: 8.2e9 x 0.5 L = 4.1e9 L = 1,640 Olympic pools."""
import math, random
import numpy as np
import reel, whatif, lowpoly as lp
from motion import Clean
from engine import W, H
from premium import sphere, bloom
from PIL import Image, ImageDraw
from scripts.p35 import clamp, smooth, big_word, space_beat
from scripts.p36 import mkq
def hudn(img, label, value, sub=None): whatif.hud(img, label, value, sub, y=250, big=84)
BROWN = (116, 78, 40)

# ------------------------------------------------------------ A: hippos
def hippo(sc, x, z, yaw, s=1.0, t=0.0, tail=True):
    c, sn = math.cos(yaw), math.sin(yaw)
    def put(lx, ly, lz, size, col): sc.box((x + (lx * c + lz * sn) * s, ly * s, z + (-lx * sn + lz * c) * s), (size[0] * s, size[1] * s, size[2] * s), col, yaw)
    g = (128, 120, 140); put(0, 1.25, 0, (1.9, 1.5, 3.4), g)
    for lx in (-.7, .7):
        for lz in (-1.2, 1.2): put(lx, .35, lz, (.55, .7, .55), (112, 104, 124))
    put(0, 1.45, 2.1, (1.5, 1.2, 1.3), g); put(0, 1.05, 2.9, (1.4, .8, .6), (146, 118, 130)); put(-.5, 2.15, 2.0, (.22, .22, .22), g); put(.5, 2.15, 2.0, (.22, .22, .22), g)
    for ex in (-.45, .45): put(ex, 1.72, 2.45, (.16, .16, .16), (20, 20, 20))
    if tail:
        for q in range(8): a = t * 9 + q * .7; sc.disc((x + (-math.sin(yaw) * -1.9) + math.sin(a) * .6, 1.5 + math.cos(a) * .3, z - math.cos(yaw) * 1.9 - q * .22), .09, BROWN)
def hippo_beat(frac, cam_fn, mass_fn, sub, label="You shat"):
    def draw(img, lt, p, b):
        sc = lp.Scene(); rs = random.Random(6)
        sc.floor((0, -.06, 20), (140, .1, 140), (120, 172, 100)); sc.floor((0, .01, 8), (6, .04, 40), (190, 180, 160))
        for q in range(8): sc.tree((-12 if q % 2 else 12), 4 + q * 7, 1.2)
        f = frac(p); pile_h = 0.0 + 4.2 * f
        sc.box((-3, pile_h / 2, 8), (3.2 + 3 * f, pile_h + .1, 3.0 + 3 * f), BROWN); sc.box((-3, pile_h + .2, 8), (1.6 + 2 * f, .6, 1.4 + 2 * f), (96, 62, 30))
        sc.person(1.6, 6.0, -math.pi / 2, lt * (3 if f < 1 else 0), shirt=(240, 200, 70), anim="idle", s=1.0)
        if f > .45: hippo(sc, 8.5, 11, math.pi, 1.0, lt)
        if f > .75: hippo(sc, 8.5, 16, math.pi, 1.0, lt)
        if f > .95: hippo(sc, 12.5, 13.5, math.pi, .55, lt)
        img.paste(lp.render(sc, cam_fn(p, lt), sky=((110, 165, 235), (212, 230, 246)), fog=((212, 230, 246), 80.0, 260.0))); mkq("What if you kept every shit you ever took?")(img)
        hudn(img, label, f"{mass_fn(p):,.0f} kg", sub); big_word(img, b, lt)
    return draw
A_N = [
 ("What if you kept every single shit you ever took?", hippo_beat(lambda p: 0.0, lambda p, t: lp.Cam((2.5, 2.6, -2.5), (-1, 1.2, 8), 64), lambda p: 0, "age 0")),
 ("You shit about 128 grams a day. That's nothing. Cute, even.", hippo_beat(lambda p: .08 * p, lambda p, t: lp.Cam((3.5 - p, 2.6, -1.5), (-2, 1.0, 8), 62), lambda p: 128 * (1 + 364 * p), "year one")),
 ("By 80 years old, that's 3,700 kilos. A mountain. Of your own shit.", hippo_beat(lambda p: .1 + .9 * smooth(p), lambda p, t: lp.Cam((4 + 5 * p, 3.0 + 3 * p, -4), (-1, 1.5, 9), 64), lambda p: 3738 * smooth(p), "age 80")),
 ("That's two and a half hippos. You made that. Alone. Congratulations.", hippo_beat(lambda p: 1.0, lambda p, t: lp.Cam((14 - 6 * p, 4, 2), (6, 1.4, 12), 64), lambda p: 3738, "two and a half hippos")),
 ("Fun fact. Hippos spray their shit with their tail like a lawn sprinkler. Absolute legends.", hippo_beat(lambda p: 1.0, lambda p, t: lp.Cam((12, 2.6, 4 + 2 * p), (8, 1.5, 12), 58), lambda p: 3738, "hippos do it better")),
 ("You're not even in the top three. Do better.", hippo_beat(lambda p: 1.0, lambda p, t: lp.Cam((2.5, 2.6 + 6 * p, -2.5 - 6 * p), (-1, 1.2, 10), 66), lambda p: 3738, "")),
]
def hippos():
    shots = [Clean(n, d, 3.0, cut="cut", push=0, cap=False) for n, d in A_N]
    return reel.Reel("594_whatif_keep_every_shit", shots, style="cine", seed=594, gain_music=.35, snap=False, grid=0, safe_zone=False, vo=[(i, n) for i, (n, d) in enumerate(A_N)], title="what if you kept every shit you ever took", caption="x", story="128 g x 365 x 80 = 3,738 kg = 2.5 hippos.")

# ------------------------------------------------------------ B: fart every blink
def meeting(lt, gas, cam):
    sc = lp.Scene(); rs = random.Random(2)
    sc.floor((0, -.05, 4), (14, .1, 14), (150, 150, 160)); sc.box((0, 1.8, 10.4), (14, 3.6, .3), (214, 220, 230)); sc.box((-6.9, 1.8, 4), (.3, 3.6, 14), (200, 205, 215)); sc.box((6.9, 1.8, 4), (.3, 3.6, 14), (200, 205, 215)); sc.box((0, 3.7, 4), (14, .2, 14), (240, 240, 244))
    sc.box((0, .8, 6), (3.4, .12, 6.0), (150, 110, 70)); sc.box((0, .4, 6), (.5, .8, 5.0), (110, 80, 50))
    sc.quad([(-3, 1.3, 10.24), (3, 1.3, 10.24), (3, 3.0, 10.24), (-3, 3.0, 10.24)], (250, 250, 252), bias=-.05)
    for i, (x, z) in enumerate(((-2.4, 4.0), (-2.4, 6.0), (-2.4, 8.0), (2.4, 4.0), (2.4, 6.0), (2.4, 8.0))):
        sc.person(x, z, math.pi / 2 if x < 0 else -math.pi / 2, lt * .3 + i, shirt=(rs.randint(40, 230), rs.randint(60, 230), rs.randint(80, 240)), anim="idle")
    sc.person(0, 1.8, 0, lt * .3, shirt=(240, 200, 70), anim="idle")
    n = int(gas * 160)
    for q in range(n):
        a = q * 2.399; r = 1.0 + 5.5 * gas * ((q * 7 % 100) / 100) ** .6; sc.disc((math.cos(a) * r * .9, 1.0 + ((q * 13) % 60) / 60 * 2.4 * min(1, gas * 2 + .2), 3 + 1.0 + math.sin(a) * r * .9 + 2), .5 + .35 * ((q % 5) / 5), (120 + (q % 4) * 14, 160 + (q % 3) * 14, 70 + (q % 5) * 6))
    return lp.render(sc, cam, sky=((226, 230, 238), (240, 242, 246)), fog=((236, 240, 238), 14.0, 40.0))
def blink_beat(frac_fn, cam_fn, farts_fn, sub):
    def draw(img, lt, p, b):
        img.paste(meeting(lt, frac_fn(p), cam_fn(p, lt))); mkq("What if you farted every time you blinked?")(img)
        f = farts_fn(p); hudn(img, "Farts", f"{f:,.0f}", sub if sub else f"{f * .09:,.0f} L of gas"); big_word(img, b, lt)
    return draw
B_N = [
 ("What if you farted every single time you blinked?", blink_beat(lambda p: 0.0, lambda p, t: lp.Cam((2.5, 2.2, -1), (0, 1.3, 6), 66), lambda p: 0, "")),
 ("You blink about 15,000 times a day. That's 15,000 farts. Daily.", blink_beat(lambda p: .05 * p, lambda p, t: lp.Cam((2.6, 2.2, -.6), (0, 1.3, 6), 64), lambda p: 15000 * p, None)),
 ("At 90 milliliters each, that's 1,350 liters of ass gas. Every day. Your coworkers have questions.", blink_beat(lambda p: .05 + .3 * p, lambda p, t: lp.Cam((2.6, 2.4, 0), (0, 1.3, 6), 62), lambda p: 15000 + 15000 * p, None)),
 ("Week one. Nobody makes eye contact. Not even Karen. Karen, who has seen everything.", blink_beat(lambda p: .35 + .25 * p, lambda p, t: lp.Cam((0, 3.0, 0), (0, 1.0, 7), 70), lambda p: 105000 + 100000 * p, None)),
 ("In 37 days, the entire conference room is full of your ass. Meeting adjourned.", blink_beat(lambda p: .6 + .4 * p, lambda p, t: lp.Cam((3 - 3 * p, 3.4, -1.5), (0, 1.0, 6), 72), lambda p: 555000 * (1 + 0 * p), None)),
 ("Nobody can prove it was you. Except literally everyone.", blink_beat(lambda p: 1.0, lambda p, t: lp.Cam((2.4, 2.2, -1), (0, 1.3, 6), 66), lambda p: 555000, None)),
]
def blink():
    shots = [Clean(n, d, 3.0, cut="cut", push=0, cap=False) for n, d in B_N]
    return reel.Reel("595_whatif_fart_every_blink", shots, style="cine", seed=595, gain_music=.35, snap=False, grid=0, safe_zone=False, vo=[(i, n) for i, (n, d) in enumerate(B_N)], title="what if you farted every time you blinked", caption="x", story="15,000 blinks a day x 90 mL = 1,350 L per day; a 50 m3 room fills in about 37 days.")

# ------------------------------------------------------------ C: everyone pukes
def puke_scene(lt, k, cam, mode="aerial"):
    pl = random.Random(3); sc = lp.Scene()
    sc.floor((0, -.06, 60), (240, .1, 400), (110, 170, 96)); sc.floor((0, 0, 60), (5, .05, 300), (190, 180, 160))
    for z in np.arange(-10, 200, 12):
        for sx in (-1, 1): sc.tree(sx * pl.uniform(14, 30), z, pl.uniform(.8, 1.3))
    for i in range(240):
        x = pl.uniform(-12, 12); z = pl.uniform(8, 80); sh = (pl.randint(40, 240), pl.randint(40, 240), pl.randint(40, 240)); t0 = pl.random() * .6
        on = k > t0
        sc.person(x, z, pl.random() * 6.28, lt + i, shirt=sh, anim="squat" if on else "walk")
        if on:
            for q in range(7): u = ((lt * 1.6 + q * .13 + i * .07) % 1.0); sc.disc((x + .6 * u * math.cos(i), 1.0 - 1.0 * u * u + .25, z + .9 * u * math.sin(i) + .3), .09 + .03 * (q % 3), (150 + (q * 29) % 90, 190, 60 + (q * 41) % 70))
            sc.box((x, .06, z + .5), (.8, .06, .8), (170, 190, 70))
    return lp.render(sc, cam, sky=((110, 165, 235), (212, 230, 246)), fog=((212, 230, 246), 90.0, 320.0))
def puke_beat(kfn, cam_fn, lit_fn, sub, space=False):
    def draw(img, lt, p, b):
        if space: img.paste(space_beat(lt))
        else: img.paste(puke_scene(lt, kfn(p), cam_fn(p, lt)))
        mkq("What if every human puked at the same time?")(img); l = lit_fn(p); hudn(img, "Puke", f"{l:,.0f} L", sub if sub else f"= {l / 2.5e6:,.0f} olympic pools"); big_word(img, b, lt)
    return draw
C_N = [
 ("What if every human on Earth puked at the exact same time?", puke_beat(lambda p: 0.0, lambda p, t: lp.Cam((0, 17 - 3 * p, 0), (0, 0, 46), 66), lambda p: 0, "")),
 ("One person throws up about half a liter. Times 8 billion people. That's 4 billion liters of vomit.", puke_beat(lambda p: p, lambda p, t: lp.Cam((8, 12, 4), (0, 0, 40), 66), lambda p: 4.1e9 * smooth(p), None)),
 ("Every cruise ship, every roller coaster, every dumbass who tried the gas station sushi. All at once.", puke_beat(lambda p: 1.0, lambda p, t: lp.Cam((-9, 12 - 2 * p, 6 + 6 * p), (0, 0, 42), 66), lambda p: 4.1e9, None)),
 ("That's 1,640 Olympic swimming pools of vomit. Chunky ones.", puke_beat(lambda p: 1.0, lambda p, t: lp.Cam((0, 30 - 8 * p, 10), (0, 0, 60), 70), lambda p: 4.1e9, None)),
 ("From space, Earth looks like a drunk freshman at a frat party.", puke_beat(lambda p: 1.0, None, lambda p: 4.1e9, None, space=True)),
 ("The only upside? Everyone finally feels better. Spiritually.", puke_beat(lambda p: 1.0, lambda p, t: lp.Cam((2.5, 2.6, 6), (0, 1.0, 20), 66), lambda p: 4.1e9, None)),
]
def puke():
    shots = [Clean(n, d, 3.0, cut="cut", push=0, cap=False) for n, d in C_N]
    return reel.Reel("596_whatif_everyone_pukes", shots, style="cine", seed=596, gain_music=.35, snap=False, grid=0, safe_zone=False, vo=[(i, n) for i, (n, d) in enumerate(C_N)], title="what if every human puked at once", caption="x", story="8.2e9 x 0.5 L = 4.1e9 L = 1,640 Olympic pools (2.5e6 L each).")
REELS = dict(hippos=hippos, blink=blink, puke=puke)
