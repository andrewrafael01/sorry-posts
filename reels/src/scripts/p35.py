"""Premium 35: What if every human flushed the toilet at the same time. Low-poly 3D world (lowpoly.py), voiced with word-by-word captions, live water counter.
Numbers: 8.2 billion people x about 6 L per flush = 49.2 billion L = about 19,700 Olympic pools (2.5 million L each)."""
import math, random
import numpy as np
from PIL import Image, ImageDraw, ImageFont
import reel, whatif, lowpoly as lp
from motion import Clean
from engine import W, H
from premium import sphere, bloom

LITRES = 49.2e9; POOL = 2.5e6
WATER = (150, 205, 255)
def clamp(x, a=0.0, b=1.0): return max(a, min(b, x))
def smooth(u): u = clamp(u); return u * u * (3 - 2 * u)

# ---------------------------------------------------------------- world
_C = {}
def city():
    if "c" in _C: return _C["c"]
    rs = random.Random(11); st = lp.Scene()
    st.floor((0, -.06, 60), (700, .1, 700), (126, 178, 108)); st.floor((0, 0, 60), (14, .12, 400), (74, 76, 84)); st.floor((0, .01, 60), (.3, .12, 400), (230, 200, 70))
    for sx in (-1, 1): st.floor((sx * 9.2, .05, 60), (4.4, .2, 400), (190, 186, 178))
    for z in np.arange(-10, 190, 30):
        for sx in (-1, 1):
            w = rs.uniform(11, 16); h = rs.uniform(14, 46); col = (rs.randint(150, 215), rs.randint(140, 200), rs.randint(125, 190))
            st.building(sx * (18 + w / 2 - 2), z + rs.uniform(-4, 4), w, h, 14, col, win=(rs.randint(40, 70), rs.randint(70, 100), rs.randint(110, 150)))
    for z in np.arange(0, 190, 11):
        for sx in (-1, 1): st.tree(sx * 11.3, z + 4, rs.uniform(.8, 1.2))
    cars = [(rs.choice([-4.2, -1.9, 2.1, 4.4]), rs.uniform(8, 160), (rs.randint(50, 240), rs.randint(50, 240), rs.randint(50, 240))) for _ in range(16)]
    man = [(x, z) for z in np.arange(9, 120, 11) for x in (-3.6, 0.0, 3.6)]
    crowd = [(rs.choice([-1, 1]) * rs.uniform(8.3, 10.2), rs.uniform(0, 140), rs.choice([-1, 1]), rs.uniform(.8, 1.6), (rs.randint(40, 240), rs.randint(40, 240), rs.randint(40, 240)), rs.random() * 6.28) for _ in range(150)]
    _C["c"] = (st, cars, man, crowd); return _C["c"]
def fresh(st):
    s = lp.Scene(); s.boxes = list(st.boxes); s.flat = list(st.flat); s.quads = list(st.quads); return s

def street(lt, burst_t0, cam, flood=0.0, hz=None, extra=None):
    st, cars, man, crowd = city(); sc = fresh(st); rs = random.Random(5)
    for (x, z, col) in cars: sc.car(x, z - (lt * 2.0 if abs(x) < 3 else 0.0) * (1 if x > 0 else 0), 0 if x > 0 else math.pi, col)
    for (x, z0, dr, sp, col, ph) in crowd:
        panic = burst_t0 is not None and lt > burst_t0 + (z0 % 3) * .2
        z = z0 + dr * sp * lt * (3.0 if panic else 1.0); sc.person(x, z % 150, 0 if dr > 0 else math.pi, lt + ph, shirt=col, anim="panic" if panic else "walk")
    for k, (x, z) in enumerate(man):
        tb = None if burst_t0 is None else lt - (burst_t0 + (z - 9) / 11 * .16 + (x + 3.6) * .02)
        if tb is None or tb < 0: sc.floor((x, .13, z), (1.0, .06, 1.0), (50, 52, 58))
        else:
            hgt = min(16.0, 34 * tb) * (1.0 if tb < 2.6 else max(0.0, 1 - (tb - 2.6) * .5))
            for i in range(14):
                yy = i / 13 * hgt; sc.disc((x + math.sin(i * 1.7 + tb * 9) * .25, .3 + yy, z), .24 + .10 * (1 - i / 13), WATER)
            for q in range(26):
                a = (q * 2.399 + k) % 6.283; sp = 2 + (q % 5); tt = (tb * .9 + q * .07) % 1.6
                sc.disc((x + math.cos(a) * sp * tt, .3 + 15 * tt - 9.8 * tt * tt * .9 + (q % 4) * .4, z + math.sin(a) * sp * tt * .6), .12, (215, 236, 255))
            yc = 22 * tb - 4.9 * tb * tb
            if yc > 0: sc.box((x, .3 + yc, z), (1.0, .12, 1.0), (60, 62, 70), tb * 5 + k)
    if extra: extra(sc)
    if flood > 0:
        for z in np.arange(0, 140, 14): sc.floor((0, .14, z + 7), (14 + flood * 22, .06, 14), (84, 146, 226))
    return lp.render(sc, cam, sky=((110, 165, 235), (212, 230, 246)), fog=((212, 230, 246), 70.0, 260.0))

def bathroom(lt, press_t, cam_t, walkers=False):
    sc = lp.Scene()
    sc.floor((0, -.05, 2), (9, .1, 9), (232, 236, 240)); sc.box((0, 1.7, 4.4), (9, 3.4, .3), (112, 190, 205)); sc.box((-3.9, 1.7, 2), (.3, 3.4, 9), (128, 200, 214)); sc.box((0, 3.45, 2), (9, .2, 9), (245, 247, 250))
    sc.box((3.9, 1.7, 2), (.3, 3.4, 9), (112, 190, 205))
    for i in range(-4, 5):
        for j in range(-2, 8): sc.floor((i * 1.0, .0, j * 1.0), (.96, .03, .96), (236, 240, 244) if (i + j) % 2 else (150, 205, 225))
    sc.box((0, .22, 3.3), (.58, .44, .78), (255, 255, 255)); sc.box((0, .5, 3.15), (.66, .22, .88), (255, 255, 255)); sc.box((0, .64, 3.15), (.6, .05, .8), (90, 160, 225)); sc.box((0, 1.02, 3.95), (.64, .9, .26), (255, 255, 255)); sc.box((0, 1.5, 3.95), (.7, .06, .3), (230, 234, 238))
    if press_t is not None and lt > press_t:
        u = lt - press_t
        for k in range(10):
            a = u * 7 + k * .7; r = .27 * (1 - clamp(u / 1.8)) * (1 - k * .07); sc.disc((math.cos(a) * r, .68, 3.15 + math.sin(a) * r), .06 + .02 * (k % 3), (230, 244, 255))
    sc.box((.28 + 0 * lt, 1.28 - (.05 if (press_t is not None and press_t < lt < press_t + .4) else 0), 3.78), (.1, .07, .12), (190, 196, 204))
    sc.box((2.6, .45, 3.9), (1.0, .9, .6), (240, 240, 244)); sc.box((2.6, .96, 3.9), (1.06, .1, .66), (250, 250, 252)); sc.disc((2.6, 1.1, 3.75), .18, (140, 200, 240)); sc.box((2.6, 1.15, 4.15), (.06, .3, .06), (200, 204, 210))
    if walkers:
        for i, (c0, sh) in enumerate(((0.0, (230, 80, 80)), (.9, (80, 150, 235)), (1.8, (90, 200, 120)))):
            xx = -1.4 + lt * .7 + c0 * .5
            sc.person(min(xx, 3.8), 1.6 + .6 * i, -math.pi / 2, lt + i, shirt=sh, anim="walk")
    else: sc.person(-.9, 2.3, -math.pi / 2, lt * .3, shirt=(240, 200, 60), anim="idle")
    return lp.render(sc, cam_t, sky=((200, 225, 238), (225, 238, 246)), fog=((225, 238, 246), 14.0, 45.0))

def space_beat(lt):
    img = Image.new("RGB", (W, H), (4, 6, 14)); d = ImageDraw.Draw(img); rs = random.Random(2)
    for _ in range(160): x, y = rs.randint(0, W), rs.randint(0, H); d.ellipse([x, y, x + 2, y + 2], fill=(180, 190, 210))
    cx, cy, R = W / 2, 900, 360 + 18 * lt
    sphere(img, cx, cy, R, (60, 120, 230), light=(-.5, -.5), tex="noise", atmo=(90, 160, 255), seed=9, ambient=.12)
    for i in range(60):
        a = rs.random() * 6.283; rr = R * math.sqrt(rs.random()) * .97; x, y = cx + math.cos(a) * rr, cy + math.sin(a) * rr; z = math.sqrt(max(0.0, 1 - (rr / R) ** 2))
        tt = clamp((lt - .2 - rs.random() * 1.6) / .5)
        if tt > 0:
            ln = (30 + 70 * rs.random()) * tt * (1 - z * .3); ang = math.atan2(y - cy, x - cx)
            d.line([(x, y), (x + math.cos(ang) * ln, y + math.sin(ang) * ln)], fill=(220, 238, 255), width=4)
    bloom(img, 200, .5, 8); return img

# ---------------------------------------------------------------- overlays
BIG = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 118)
def big_word(img, b, lt, y=1290):
    words = b.narr.split(); rt = b.real_times(); 
    if not rt or len(rt) != len(words): L = b.speech_len(); rt = [(i * L / len(words), (i + 1) * L / len(words)) for i in range(len(words))]
    idx = max([i for i, (a, e) in enumerate(rt) if lt >= a] or [0]); w = words[idx].upper().strip(".,!?")
    u = clamp((lt - rt[idx][0]) / .08); sc = .75 + .25 * smooth(u)
    f = BIG if sc > .99 else ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", int(118 * sc))
    lay = Image.new("RGBA", img.size, (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
    d.text((W / 2, y), w, font=f, fill=(255, 255, 255, 255), anchor="mm", stroke_width=9, stroke_fill=(0, 0, 0, 255)); img.paste(lay, (0, 0), lay)
def top_question(img):
    whatif.title(img, "What if every human flushed the toilet at the same time?", y=96, size=46, maxw=940)
def counter(img, frac):
    litres = LITRES * frac; whatif.hud(img, "Water flushed", f"{litres:,.0f} L", f"= {litres / POOL:,.0f} olympic pools" if frac > 0 else None, y=250, big=84)

# ---------------------------------------------------------------- beats
def b_bath1(img, lt, p, b):
    cam = lp.Cam((.5, 2.2 - .3 * p, -1.4 + .6 * p), (-.2, .6, 3.2), 68); img.paste(bathroom(lt, None, cam)); top_question(img); big_word(img, b, lt)
def b_bath2(img, lt, p, b):
    pr = b.at("billion", 0, .9); cam = lp.Cam((.8 - .8 * p, 1.7, -.2 + .8 * p), (0.0, .5, 3.3), 56); img.paste(bathroom(lt, pr, cam)); top_question(img); big_word(img, b, lt)
def b_calm(img, lt, p, b):
    cam = lp.Cam((0, 2.4, -2 + 3 * p), (0, 2.6, 40), 64); img.paste(street(lt, None, cam)); top_question(img); counter(img, 0.0); big_word(img, b, lt)
def b_burst(img, lt, p, b):
    t0 = b.at("manhole", 0, 1.0) - .3; sh = max(0.0, 1 - abs(lt - t0 - .6) / 1.2) * .25
    cam = lp.Cam((math.sin(lt * 40) * sh, 2.4 + math.cos(lt * 47) * sh, -2 + 6 * p), (0, 5.0 + 5 * smooth(p), 40), 64); img.paste(street(lt, t0, cam)); top_question(img)
    counter(img, smooth((lt - t0) / max(.5, b.dur - t0 - .2)) * .6); big_word(img, b, lt)
def b_flood(img, lt, p, b):
    cam = lp.Cam((30 - 6 * p, 52 - 8 * p, -30), (0, 2, 46), 62); img.paste(street(lt + 3.0, -2.0, cam, flood=smooth(p) * 1.0)); top_question(img); counter(img, .6 + .3 * p); big_word(img, b, lt)
def b_space(img, lt, p, b):
    img.paste(space_beat(lt)); top_question(img); counter(img, .9 + .07 * p); big_word(img, b, lt)
def b_pools(img, lt, p, b):
    cam = lp.Cam((0, 80 - 10 * p, 20), (0, 0, 60), 64); img.paste(street(lt + 6.0, -4.0, cam, flood=1.0)); top_question(img); counter(img, .97 + .03 * smooth(p)); big_word(img, b, lt)
def b_wash(img, lt, p, b):
    cam = lp.Cam((2.6, 2.3, -1.6), (.4, .8, 3.0), 68); sc = bathroom(lt, None, cam, walkers=True); img.paste(sc); top_question(img); counter(img, 1.0); big_word(img, b, lt)

N = [
 ("What if every human on Earth flushed the toilet at the exact same time?", b_bath1, []),
 ("That's eight billion flushes. Forty nine billion liters, all going down at once.", b_bath2, []),
 ("Your pipes? Fine. For about one second.", b_calm, []),
 ("Then the sewers say absolutely not. Every manhole cover on Earth launches like a shitty little rocket.", b_burst, []),
 ("Streets turn into rivers. Cars float. Somebody's Roomba is gone forever.", b_flood, []),
 ("From space, Earth looks like it's having a nervous breakdown.", b_space, []),
 ("Forty nine billion liters. That's nineteen thousand Olympic swimming pools of regret.", b_pools, []),
 ("Then the water drains. And honestly? Half of them still didn't wash their hands.", b_wash, []),
]
def flush():
    shots = [Clean(n, d, 3.0, cut="cut", push=0, cap=False) for n, d, c in N]
    return reel.Reel("587_whatif_everyone_flushes", shots, style="cine", seed=587, gain_music=.35, snap=False, grid=0, safe_zone=False, vo=[(i, n) for i, (n, d, c) in enumerate(N)],
                     title="what if every human flushed at once", caption="x", story="Low-poly what-if: 8.2B x 6 L = 49.2B L = about 19,700 Olympic pools; manholes launch; voiced, word-by-word captions.")
REELS = dict(flush=flush)
