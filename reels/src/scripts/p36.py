"""Premium 36: three dumb viral what-ifs in the low-poly world: a treadmill that gets 1 km/h faster every minute, everyone screaming at once, and everyone punching you once. Voiced, swearing, word-by-word captions, live counters."""
import math, random
import numpy as np
from PIL import Image, ImageDraw
import reel, whatif, lowpoly as lp
from motion import Clean
from engine import W, H
from premium import sphere, bloom
from scripts import p35
from scripts.p35 import clamp, smooth, big_word, street, space_beat

def mkq(text):
    def f(img): whatif.title(img, text, y=96, size=46, maxw=940)
    return f
def hudn(img, label, value, sub=None): whatif.hud(img, label, value, sub, y=250, big=84)

# ============================================================ 1. treadmill
def gym(lt, speed, cam, shake=0.0, fire=False):
    sc = lp.Scene()
    sc.floor((0, -.05, 4), (16, .1, 16), (176, 130, 84)); sc.box((0, 2.0, 9.5), (16, 4, .3), (214, 226, 236)); sc.box((-7.5, 2.0, 4), (.3, 4, 16), (226, 190, 120)); sc.box((7.5, 2.0, 4), (.3, 4, 16), (226, 190, 120)); sc.box((0, 4.05, 4), (16, .2, 16), (240, 240, 244))
    for i in range(-3, 4): sc.box((i * 2.0, 2.4, 9.3), (1.7, 2.2, .05), (150, 190, 215))      # mirror panels
    sc.box((0, .25, 4.0), (1.3, .5, 3.0), (60, 62, 70)); sc.box((0, .52, 4.0), (1.0, .06, 2.7), (34, 36, 42)); sc.box((0, 1.4, 5.5), (1.2, .2, .2), (60, 62, 70)); sc.box((-.55, 1.0, 5.5), (.1, 1.8, .1), (60, 62, 70)); sc.box((.55, 1.0, 5.5), (.1, 1.8, .1), (60, 62, 70))
    for k in range(10):          # belt stripes sliding backwards
        z = 2.7 + ((k * .27 + lt * speed * .28) % 2.7); sc.floor((0, .56, z), (.9, .02, .08), (230, 230, 240))
    rate = min(14.0, 1.0 + speed * .55) * .35
    sc.person(0, 3.6, 0, lt * rate * 3.0, shirt=(235, 80, 70), anim="run" if speed > 7 else "walk", s=1.0)
    if fire:
        for q in range(14): sc.disc((((q * 37) % 9) / 40 - .1, .6 + (q % 5) * .13 + abs(math.sin(lt * 20 + q)) * .15, 3.5 - (q % 4) * .12), .09 + .03 * (q % 3), (255, 140 + (q * 17) % 90, 30))
    rs = random.Random(3)
    for i, (x, z) in enumerate(((-5, 6.0), (-4.2, 3.0), (5.0, 5.2), (4.4, 2.2), (-6, 4.4))):
        sc.person(x, z, math.pi / 2 if x < 0 else -math.pi / 2, lt * .5 + i, shirt=(rs.randint(40, 240), rs.randint(40, 240), rs.randint(40, 240)), anim="panic" if speed > 150 else "idle")
    return lp.render(sc, cam, sky=((226, 232, 240), (240, 243, 248)), fog=((240, 243, 248), 18.0, 60.0))
def speed_lines(img, speed, lt):
    if speed < 40: return
    d = ImageDraw.Draw(img); rs = random.Random(int(lt * 30)); n = int(min(60, speed / 5))
    for _ in range(n):
        x = rs.randint(0, W); y = rs.randint(250, 1500); l = rs.randint(120, 420); d.line([(x, y), (x, y + l)], fill=(255, 255, 255), width=rs.randint(2, 5))
class TM:
    # (narration, minute0, minute1)
    pass
def mk_tm_beat(m0, m1, cam_fn, fire=False, label="Treadmill speed"):
    def draw(img, lt, p, b):
        mins = m0 + (m1 - m0) * p; speed = mins * 1.0; cam = cam_fn(p, lt)
        img.paste(gym(lt, speed, cam, fire=fire or speed > 80)); speed_lines(img, speed, lt); mkq("What if a treadmill got 1 km/h faster every minute?")(img)
        hudn(img, label, f"{speed:,.0f} km/h", f"minute {int(mins)}"); big_word(img, b, lt)
    return draw
def b_tm_fly(img, lt, p, b):
    px = 0; z = -6 + lt * 40; cam = lp.Cam((8, 6, z - 16), (0, 3, z + 14), 66)
    def extra(sc):
        sc.person(0, z, 0, lt * 3, shirt=(235, 80, 70), anim="panic"); sc.box((0, 3.0, z), (.01, .01, .01), (0, 0, 0))
        for q in range(16): sc.disc((((q * 13) % 5) / 3 - .8, 1.4 + (q % 4) * .2, z - 1.2 - q * .35), .14 - q * .005, (255, 150 + q * 5, 40))
    img.paste(street(lt, None, cam, extra=extra)); mkq("What if a treadmill got 1 km/h faster every minute?")(img); hudn(img, "Treadmill speed", "387 km/h", "out of the building"); big_word(img, b, lt)
TM_N = [
 ("What if a treadmill got one kilometer per hour faster every minute?", mk_tm_beat(1, 4, lambda p, t: lp.Cam((3.2, 2.0, .5), (0, 1.0, 4.0), 66))),
 ("Minute 10. You're jogging. Doing great, sweetie.", mk_tm_beat(5, 12, lambda p, t: lp.Cam((3.0 - p, 1.9, .8), (0, 1.0, 4.0), 66))),
 ("Minute 20. Sprinting now. Also regretting every life choice.", mk_tm_beat(15, 22, lambda p, t: lp.Cam((2.6, 1.7, 1.3), (0, 1.0, 4.0), 62))),
 ("Minute 44. You're the fastest man alive. On a treadmill. In a sweaty gym in Ohio.", mk_tm_beat(36, 45, lambda p, t: lp.Cam((2.4, 1.6, 1.8), (0, 1.1, 4.0), 60))),
 ("Minute 100. Faster than a cheetah. Your shoes are on fire.", mk_tm_beat(90, 110, lambda p, t: lp.Cam((2.2, 1.5, 2.0), (0, 1.0, 4.0), 58), fire=True)),
 ("Minute 300. Faster than a bullet train. The gym is now a crime scene.", mk_tm_beat(250, 320, lambda p, t: lp.Cam((2.0 + math.sin(t * 50) * .05, 1.4, 2.2), (0, 1.0, 4.0), 56), fire=True)),
 ("And then you launch through the wall, three parked cars, and into a different zip code.", b_tm_fly),
 ("Congratulations. You've invented the worst sport on Earth.", mk_tm_beat(1, 4, lambda p, t: lp.Cam((3.2, 2.0, .5), (0, 1.0, 4.0), 66))),
]
def treadmill():
    shots = [Clean(n, d, 3.0, cut="cut", push=0, cap=False) for n, d in TM_N]
    return reel.Reel("588_whatif_treadmill", shots, style="cine", seed=588, gain_music=.35, snap=False, grid=0, safe_zone=False, vo=[(i, n) for i, (n, d) in enumerate(TM_N)], title="what if a treadmill got faster every minute", caption="x", story="Treadmill gets 1 km/h faster every minute: Usain Bolt 44 km/h at minute 44, cheetah about 100, bullet train about 320.")

# ============================================================ 2. everyone screams
def scream_street(lt, shatter_t, cam, wave=False, flip=False):
    st, cars, man, crowd = p35.city(); sc = p35.fresh(st); rs = random.Random(9)
    if shatter_t is not None and lt > shatter_t:
        tt = lt - shatter_t; sc.quads = [(pts, (18, 22, 30) if col != (0, 0, 0) and bias == -.05 else col, bias) for pts, col, bias in sc.quads]
        for q in range(140):
            x = rs.choice([-1, 1]) * rs.uniform(14, 28); z = rs.uniform(0, 70); y = rs.uniform(3, 36); vx = (-1 if x > 0 else 1) * rs.uniform(3, 9); tq = tt * rs.uniform(.6, 1.0)
            sc.disc((x + vx * tq, y + 2 * tq - 6 * tq * tq, z + rs.uniform(-3, 3) * tq), .12, (225, 240, 252))
    for (x, z, col) in cars:
        lift = 0.0 if not flip or lt < shatter_t + .3 else min(5.0, (lt - shatter_t - .3) * 6) * abs(math.sin(z))
        sc.car(x, z, 0 if x > 0 else math.pi, col); 
        if lift > 0: sc.box((x, 1.6 + lift, z), (.01, .01, .01), (0, 0, 0))
    for (x, z0, dr, sp, col, ph) in crowd:
        panic = shatter_t is not None and lt > shatter_t - .6
        sc.person(x, (z0 + dr * sp * lt) % 150, 0 if dr > 0 else math.pi, lt + ph, shirt=col, anim="panic" if panic else "walk")
    if wave:
        for k in range(6):
            r = ((lt * 7 + k * 3.3) % 20); sc.disc((0, 1.7, 14 + r * .0), .2 + r * .55, (255, 255, 255), 1.0)
    for q in range(24):          # birds
        bx = rs.uniform(-14, 14); bz = rs.uniform(8, 70); by = rs.uniform(12, 30); fall = 0 if shatter_t is None or lt < shatter_t else min(by, 6 * (lt - shatter_t) ** 2)
        sc.box((bx, by - fall, bz), (.5, .12, .25), (40, 40, 48), lt * 8 + q)
    return lp.render(sc, cam, sky=((110, 165, 235), (212, 230, 246)), fog=((212, 230, 246), 70.0, 260.0))
def mk_sc_beat(db0, db1, shatter, cam_fn, wave=False, sub=None):
    def draw(img, lt, p, b):
        st = None if shatter is None else shatter(b)
        img.paste(scream_street(lt, st, cam_fn(p, lt), wave=wave, flip=st is not None)); mkq("What if every human on Earth screamed at the same time?")(img)
        hudn(img, "Loudness", f"{db0 + (db1 - db0) * smooth(p):,.0f} dB", sub); big_word(img, b, lt)
    return draw
def b_sc_space(img, lt, p, b):
    img.paste(space_beat(lt)); mkq("What if every human on Earth screamed at the same time?")(img); hudn(img, "Loudness in space", "0 dB", "no air. no sound."); big_word(img, b, lt)
SC_N = [
 ("What if every human on Earth screamed at the exact same time?", mk_sc_beat(0, 0, None, lambda p, t: lp.Cam((0, 2.4, -3 + 3 * p), (0, 4.0, 40), 64))),
 ("One scream is 110 decibels. That's rude. But fine.", mk_sc_beat(0, 110, None, lambda p, t: lp.Cam((0, 2.2, -2 + 2 * p), (0, 3.5, 40), 62), wave=True)),
 ("8 billion screams? 209 decibels.", mk_sc_beat(110, 209, None, lambda p, t: lp.Cam((0, 2.2, 0 + 2 * p), (0, 3.5, 40), 60), wave=True)),
 ("Past 194 decibels, sound stops being sound. It becomes a shock wave. Which is bad.", mk_sc_beat(209, 209, lambda b: b.at("wave", 0, 2.0) - .2, lambda p, t: lp.Cam((math.sin(t * 40) * .15, 2.2 + math.cos(t * 44) * .15, 2), (0, 3.5, 40), 60))),
 ("Every window on Earth: gone. Every bird: also gone. Cars: now airborne.", mk_sc_beat(209, 209, lambda b: -1.0, lambda p, t: lp.Cam((0, 24 - 4 * p, -14), (0, 5, 46), 72))),
 ("Meanwhile in space, nobody hears a thing. The aliens are so confused.", b_sc_space),
 ("Then everyone loses their voice for four days. Honestly? Worth it.", mk_sc_beat(0, 0, lambda b: -9.0, lambda p, t: lp.Cam((0, 2.4, -3 + 3 * p), (0, 4.0, 40), 64))),
]
def scream():
    shots = [Clean(n, d, 3.0, cut="cut", push=0, cap=False) for n, d in SC_N]
    return reel.Reel("589_whatif_everyone_screams", shots, style="cine", seed=589, gain_music=.35, snap=False, grid=0, safe_zone=False, vo=[(i, n) for i, (n, d) in enumerate(SC_N)], title="what if every human screamed at once", caption="x", story="One scream 110 dB; 8.2 billion in phase adds 10 log10(8.2e9) = 99 dB for 209 dB; past about 194 dB sound becomes a shock wave.")

# ============================================================ 3. everyone punches you once
def queue_scene(lt, cam, n_people=260, punch_rate=1.0):
    sc = lp.Scene(); rs = random.Random(21)
    sc.floor((0, -.06, 100), (500, .1, 500), (120, 176, 104)); sc.floor((0, 0, 100), (8, .12, 600), (74, 76, 84)); sc.floor((0, .01, 100), (.2, .12, 600), (230, 200, 70))
    for z in range(10, 240, 22):
        for sx in (-1, 1): sc.tree(sx * 7.5, z, 1.0)
    sc.person(0, 0, 0, lt, shirt=(250, 210, 70), anim="idle")
    hit = abs(math.sin(lt * math.pi * punch_rate)) > .8
    for i in range(n_people):
        z = 1.1 + i * .62; sh = (rs.randint(40, 240), rs.randint(40, 240), rs.randint(40, 240))
        sc.person(0, z, math.pi, lt + i * .13, shirt=sh, anim="idle" if i else "idle")
        if i == 0 and hit: sc.box((0, 1.2, .5), (.18, .18, .5), (236, 190, 150))
    return lp.render(sc, cam, sky=((110, 165, 235), (212, 230, 246)), fog=((212, 230, 246), 80.0, 280.0))
def earth_rings(lt, wraps):
    img = Image.new("RGB", (W, H), (4, 6, 14)); d = ImageDraw.Draw(img); rs = random.Random(2)
    for _ in range(160): x, y = rs.randint(0, W), rs.randint(0, H); d.ellipse([x, y, x + 2, y + 2], fill=(180, 190, 210))
    cx, cy, R = W / 2, 900, 330
    sphere(img, cx, cy, R, (60, 120, 230), light=(-.5, -.5), tex="noise", atmo=(90, 160, 255), seed=9, ambient=.12)
    n = int(min(122, wraps))
    for k in range(n):       # each wrap is a ring a little higher up, so it winds round like a spool
        yy = cy + R * 0.96 * math.sin((k / 122 - .5) * 2.6); rx = R * math.cos((k / 122 - .5) * 2.6) * 1.0
        d.ellipse([cx - rx, yy - rx * .22, cx + rx, yy + rx * .22], outline=(255, 255, 255), width=2)
    bloom(img, 200, .5, 8); return img
def mk_pq_beat(kind, count0, count1, cam_fn, sub_fn):
    def draw(img, lt, p, b):
        if kind == "earth": img.paste(earth_rings(lt, 122 * p))
        else: img.paste(queue_scene(lt, cam_fn(p, lt)))
        mkq("What if every human on Earth punched you once?")(img); v = count0 + (count1 - count0) * smooth(p); hudn(img, "Punches", f"{v:,.0f}", sub_fn(v)); big_word(img, b, lt)
    return draw
PQ_N = [
 ("What if every human on Earth punched you once?", mk_pq_beat("street", 0, 3, lambda p, t: lp.Cam((3.2, 2.0, -2.5 + .5 * p), (0, 1.2, 8), 62), lambda v: "one per second")),
 ("That's 8 billion punches. One every second. It would take 260 years.", mk_pq_beat("street", 3, 8.2e9, lambda p, t: lp.Cam((4, 3.0 + 10 * p, -3 - 6 * p), (0, 1.0, 20 + 30 * p), 62), lambda v: f"{v / 3.15e7:,.0f} years of punching")),
 ("The line would be almost 5 million kilometers long.", mk_pq_beat("street", 8.2e9, 8.2e9, lambda p, t: lp.Cam((0, 4 + 60 * p, -10 - 20 * p), (0, 0, 60 + 80 * p), 64), lambda v: "line length 4.9 million km")),
 ("That's the Moon and back 6 times. It also wraps around Earth 122 times.", mk_pq_beat("earth", 8.2e9, 8.2e9, None, lambda v: "wraps earth 122 times")),
 ("You'd die on the first punch. Everyone else punches a very confused corpse.", mk_pq_beat("street", 8.2e9, 8.2e9, lambda p, t: lp.Cam((3.2, 2.0, -2.5), (0, 1.2, 8), 62), lambda v: "still going")),
 ("8 billion people finally agree on something. And it's violence. Classic humanity.", mk_pq_beat("street", 8.2e9, 8.2e9, lambda p, t: lp.Cam((6, 2.6 + 6 * p, -4 - 10 * p), (0, 1.0, 40), 60), lambda v: "")),
]
def punches():
    shots = [Clean(n, d, 3.0, cut="cut", push=0, cap=False) for n, d in PQ_N]
    return reel.Reel("590_whatif_everyone_punches_you", shots, style="cine", seed=590, gain_music=.35, snap=False, grid=0, safe_zone=False, vo=[(i, n) for i, (n, d) in enumerate(PQ_N)], title="what if every human punched you once", caption="x", story="8.2e9 punches at 1 per second = about 260 years; 0.6 m spacing = 4.9 million km = Moon round trip x6 = Earth circumference x122.")
REELS = dict(treadmill=treadmill, scream=scream, punches=punches)
