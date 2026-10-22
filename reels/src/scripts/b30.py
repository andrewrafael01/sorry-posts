"""Batch 30: relatable physics and scale explainers: planet bounce, crash falls, billion seconds, age on planets."""
import math, os
import numpy as np
from PIL import Image, ImageDraw
from scripts.common import *
from motion import *
import motion, voice
from scripts.b29 import ballspr, floor, G

PLANETS = {  # name: (g m/s2, base colour, band colour, orbital period years)
 "Mercury": (3.7, (170, 160, 150), (120, 110, 100), .2408), "Venus": (8.87, (230, 190, 120), (200, 150, 80), .6152), "Earth": (9.81, (70, 130, 220), (60, 170, 90), 1.0),
 "Moon": (1.62, (200, 200, 205), (150, 150, 158), None), "Mars": (3.71, (210, 110, 70), (160, 70, 40), 1.8808), "Jupiter": (24.79, (220, 170, 120), (170, 110, 80), 11.862),
 "Saturn": (10.44, (230, 205, 150), (200, 170, 110), 29.457), "Uranus": (8.69, (150, 225, 230), (120, 200, 210), 84.02), "Neptune": (11.15, (70, 110, 230), (50, 80, 190), 164.8),
 "Sun": (274, (255, 220, 110), (255, 170, 60), None), "Pluto": (.62, (200, 175, 150), (160, 130, 110), None),
}
_pl = {}
def planet(img, x, y, r, name, a=1.0, ring_=False):
    r = int(r)
    if r < 4: return
    base, band = PLANETS[name][1], PLANETS[name][2]; k = (name, r)
    if k not in _pl:
        yy, xx = np.mgrid[-r:r, -r:r]; d = np.sqrt(xx * xx + yy * yy) / r
        arr = np.zeros((2 * r, 2 * r, 3), dtype=np.float32); arr[:] = base
        stripes = (np.sin(yy / r * 9 + np.sin(xx / r * 3) * .6) * .5 + .5)[..., None]
        if name in ("Jupiter", "Saturn", "Neptune", "Uranus", "Venus", "Earth", "Mars", "Moon", "Mercury", "Pluto"): arr = arr * (1 - .45 * stripes) + np.array(band) * .45 * stripes
        shade = np.clip(1.2 - .75 * d ** 2 - .35 * ((xx + yy) / r), .18, 1.2)[..., None]; arr = np.clip(arr * shade, 0, 255).astype(np.uint8)
        im = Image.fromarray(arr); m = Image.fromarray((np.clip((1 - d) * r, 0, 1) * 255).astype(np.uint8)); im.putalpha(m); _pl[k] = im
    sp = _pl[k]
    if a < 1: sp = sp.copy(); sp.putalpha(sp.getchannel("A").point(lambda v: int(v * a)))
    if name == "Sun": glow(img, x, y, r * 2.4, (255, 190, 80), .7 * a)
    img.paste(sp, (int(x - r), int(y - r)), sp)
    if ring_: line(img, [(x - r * 1.7, y + r * .3), (x + r * 1.7, y - r * .3)], max(4, r * .12), (225, 200, 150), .8 * a)

E_ = math.sqrt(.5)
def total_time(g): t0 = math.sqrt(2 / g); return t0 * (1 + E_) / (1 - E_)
def height_g(tt, g):
    t0 = math.sqrt(2 / g)
    if tt < t0: return 1 - .5 * g * tt * tt
    t = t0
    for n in range(1, 60):
        f = 2 * t0 * E_ ** n
        if t <= tt < t + f: u = tt - t; return g * t0 * E_ ** n * u - .5 * g * u * u
        t += f
    return 0.0

def planet_bounce():
    LANES = ["Moon", "Mars", "Earth", "Jupiter", "Sun"]; FY = 1130; SC = 560
    def lanes(img, lt, tt_of, b, hi=None, show_times=True):
        img.paste(vgrad((10, 12, 36), (30, 22, 70), key="pb")); starfield(img, lt, 3); d = ImageDraw.Draw(img)
        d.rectangle([0, FY, CW, CH], fill=(30, 34, 76)); d.line([(0, FY), (CW, FY)], fill=(160, 170, 255), width=4)
        for i, nm in enumerate(LANES):
            cx = 108 + i * 216; g = PLANETS[nm][0]; tt = tt_of(g, nm); on = hi is None or hi == nm
            if hi == nm: box(img, cx - 104, 330, cx + 104, FY + 330, 24, (40, 44, 100), .55, outline=(255, 214, 0), ow=3)
            h = height_g(tt, g); y = FY - SC * h - 34
            for k in range(1, 6): ballspr(img, cx, FY - SC * height_g(max(0, tt - k * .02), g) - 34, 34, (255, 90, 100), 1.0, .08 * (6 - k) / 5 * (1 if on else .4))
            ballspr(img, cx, y, 34, (255, 90, 100), .72 if h < .02 else 1.0, 1.0 if on else .5)
            planet(img, cx, 250 if True else 0, 54, nm, 1.0 if on else .55); tx(img, nm.upper(), cx, 340 if False else 330, 28, "black", WHITE if on else (150, 160, 200), maxw=200, shadow=False)
            if show_times: tx(img, f"{min(tt, total_time(g)):.2f}s", cx, FY + 70, 40, "black", (255, 214, 0) if on else (150, 160, 200), maxw=200, shadow=False)
    def hook(img, lt, p, b):
        lanes(img, lt, lambda g, nm: lt * .9, b, show_times=False); tx(img, "SAME BALL.", 540, 1330, 66, "black", WHITE, a=clamp(lt / .3)) if False else None
        tx(img, "WHICH WORLD", 540, 1290, 66, "black", WHITE, scale=pop(lt / .4)); tx(img, "STOPS IT FIRST?", 540, 1370, 58, "black", (255, 214, 0), scale=pop((lt - .3) / .4)) if False else None
    def solo(name, hi_text):
        def f(img, lt, p, b):
            lanes(img, lt, lambda g, nm: lt * 1.0, b, hi=name)
        return f
    def rule(img, lt, p, b):
        img.paste(vgrad((10, 12, 36), (30, 22, 70), key="pb2")); tx(img, "stronger gravity", 540, 520, 84, "black", WHITE, scale=pop(lt / .4)); tx(img, "faster bounce", 540, 660, 100, "black", (255, 214, 0), scale=pop((lt - .8) / .4), a=clamp((lt - .8) / .1))
        tx(img, "time = 1 / √gravity", 540, 840, 80, "black", (140, 220, 255), a=clamp((lt - 1.8) / .3))
    def bars(img, lt, p, b):
        img.paste(vgrad((10, 12, 36), (30, 22, 70), key="pb3")); names = ["Moon", "Pluto", "Mars", "Earth", "Jupiter", "Sun"]; vals = {n: total_time(PLANETS[n][0]) for n in names}; names = sorted(names, key=lambda n: -vals[n]); mx = max(vals.values())
        tx(img, "time until it stops", 540, 250, 66, "black", WHITE)
        for i, n in enumerate(names):
            u = eio(seg(lt, .3 + i * .35, .9 + i * .35)); y = 420 + i * 150; w = 520 * vals[n] / mx * u
            planet(img, 120, y, 50, n); box(img, 200, y - 36, 200 + max(10, w), y + 36, 18, mix((90, 170, 255), (255, 214, 0), vals[n] / mx), 1.0); tx(img, f"{vals[n] * u:.1f}s", 200 + max(10, w) + 80, y, 44, "black", WHITE, maxw=200, shadow=False)
    N = [
     ("What if you bounced the exact same ball on every world in the solar system? Which one stops it first?", hook, "whip"),
     ("On Earth, a ball dropped from one meter, bouncing half as high each time, stops in two point six seconds.", solo("Earth", ""), "flash"),
     ("On the Moon, gravity is six times weaker, so everything happens in slow motion. Six and a half seconds.", solo("Moon", ""), "zoom"),
     ("Mars has less than half of Earth's gravity, so the ball lasts about four point three seconds.", solo("Mars", ""), "whip"),
     ("Jupiter's gravity is two and a half times Earth's. The ball is done in one point seven seconds.", solo("Jupiter", ""), "flash"),
     ("And if you could somehow stand on the Sun, it would be over in half a second.", solo("Sun", ""), "zoom"),
     ("Notice the pattern. The stronger the gravity, the faster everything happens. Double the pull, and the time shrinks by about thirty percent.", rule, "whip"),
     ("Line them up and the pattern is clear. The weaker the gravity, the longer the ball keeps going. The Moon lasts two and a half times longer than Earth. And on Pluto, a ball keeps bouncing for over ten seconds. Same ball, same drop, different world.", bars, "dip"),
    ]
    beats = [Beat(n, d, 3.0, cut=c, cues=[(0, "whoosh", .5)]) for n, d, c in N]
    for bi in range(1, 6): beats[bi].min_dur = 3.0
    return Reel("190_planet_bounce", beats, style="synth", seed=190, snap=False, grid=4, safe_zone=False, vo=[(i, n) for i, (n, d, c) in enumerate(N)], title="the same ball bounced on every planet",
        caption="the same ball bounces for 6.5 seconds on the Moon and half a second on the Sun. send this to someone who'd bring a basketball to Mars", story="Drop from 1 m, each bounce half as high (e = sqrt(1/2)). Total time = sqrt(2/g) * (1+e)/(1-e): Moon 6.5 s, Pluto 10.5 s, Mars 4.3 s, Earth 2.6 s, Jupiter 1.7 s, Sun (g=274 m/s2) 0.5 s.")

def crash_equiv():
    FLOOR = 3.0; BOT = 1180
    def tower(img, lt, h_m, mph, label, b, col=(255, 214, 0)):
        img.paste(vgrad((14, 18, 50), (50, 30, 90), key="cr")); starfield(img, lt, 3); d = ImageDraw.Draw(img); d.rectangle([0, BOT, CW, CH], fill=(24, 24, 46)); d.line([(0, BOT), (CW, BOT)], fill=(160, 170, 255), width=4)
        top = max(330, BOT - h_m * 9.0 * (1 if h_m < 80 else 80 / h_m)); sc = (BOT - top) / h_m; floors = int(round(h_m / FLOOR))
        x0, x1 = 470, 710; box(img, x0, top, x1, BOT, 6, (36, 42, 90), 1.0, outline=(110, 120, 200), ow=3)
        for k in range(floors + 1):
            y = BOT - k * FLOOR * sc; d.line([(x0, y), (x1, y)], fill=(70, 80, 150), width=1)
            for xx in range(x0 + 20, x1 - 20, 44):
                if k < floors and (k + xx // 44) % 3 != 0: d.rectangle([xx, y - FLOOR * sc + 4, xx + 22, y - 5], fill=(255, 205, 120)) if FLOOR * sc > 12 else None
        u = eio(seg(lt, .4, b.dur - .8)); yb = top + (BOT - top) * (u * u); person(img, 590, yb + 40, 70, (255, 90, 90)) if False else disc(img, 590 + 0, yb - 20, 18, (255, 120, 120), 1.0)
        tx(img, f"{mph} mph", 540, 230, 120, "black", col); tx(img, f"= {h_m:.0f} m fall", 540, 350 if False else 330, 70, "black", WHITE, a=clamp((lt - .6) / .3), maxw=900)
        tx(img, f"{floors} floors", 540, 1280, 80, "black", col, a=clamp((lt - 1.2) / .3), scale=pop((lt - 1.2) / .4))
        glow(img, 880, 900, 150, col, .12)
    def hook(img, lt, p, b):
        img.paste(vgrad((14, 18, 50), (50, 30, 90), key="cr")); starfield(img, lt, 3); d = ImageDraw.Draw(img)
        x = 100 + eio(seg(lt, 0, 2.2)) * 640; box(img, x, 900, x + 260, 1010, 30, (255, 90, 90), 1.0); disc(img, x + 60, 1030, 34, (20, 20, 30)); disc(img, x + 200, 1030, 34, (20, 20, 30)); box(img, x + 150, 920, x + 230, 970, 12, (150, 210, 255), 1.0)
        d.rectangle([860, 520, 1040, 1060], fill=(36, 42, 90)); d.rectangle([0, 1060, CW, CH], fill=(24, 24, 46))
        tx(img, "A CRASH IS A FALL", 540, 300, 86, "black", WHITE, scale=pop(lt / .4)); tx(img, "how tall?", 540, 430, 100, "black", (255, 214, 0), scale=pop((lt - .4) / .4))
    def s30(img, lt, p, b): tower(img, lt, 9.2, 30, "", b, (140, 220, 255))
    def s60(img, lt, p, b): tower(img, lt, 36.7, 60, "", b, (255, 214, 0))
    def s75(img, lt, p, b): tower(img, lt, 57.2, 75, "", b, (255, 140, 120))
    def s75b(img, lt, p, b): tower(img, lt, 36.7, 60, "", b, (255, 214, 0))
    def s100(img, lt, p, b): tower(img, lt, 101.9, 100, "", b, (255, 90, 110))
    def belt(img, lt, p, b):
        img.paste(vgrad((14, 18, 50), (50, 30, 90), key="cr2")); d = ImageDraw.Draw(img)
        tx(img, "seatbelts and crumple zones", 540, 300, 62, "black", WHITE, maxw=980); tx(img, "stretch the stop", 540, 410, 70, "black", (255, 214, 0), a=clamp((lt - .5) / .3))
        a = eio(seg(lt, 1.0, 2.6)); line(img, [(150, 700), (150 + 770 * a, 700)], 18, (120, 255, 160)); disc(img, 150 + 770 * a, 700, 24, WHITE); tx(img, "stopping over half a meter or more", 540, 800, 46, "bold", (200, 230, 215), a=clamp((lt - 2.0) / .3), maxw=980)
        line(img, [(150, 960), (150 + 40 * a, 960)], 18, (255, 90, 110)); disc(img, 150 + 40 * a, 960, 24, WHITE); tx(img, "no belt: centimeters", 540, 1060, 46, "bold", (255, 170, 180), a=clamp((lt - 2.6) / .3))
    def end(img, lt, p, b):
        tower(img, lt, 36.7, 60, "", b); 
    N = [
     ("Hitting a wall in a car is the same as falling off a building. But how tall a building? It depends only on your speed.", hook, "whip"),
     ("Crash at thirty miles an hour, and it's like falling nine meters. Three floors.", s30, "flash"),
     ("Now double the speed, to sixty miles an hour. It is not double the height. It is thirty seven meters. Twelve floors.", s60, "zoom"),
     ("At seventy five, it's fifty seven meters. Nineteen floors.", s75, "whip"),
     ("And at a hundred miles an hour, a hundred and two meters. A thirty four story fall.", s100, "flash"),
     ("Why does it grow so fast? Because the fall height depends on speed squared. Twice as fast means four times the drop.", s75b, "whip"),
     ("That's why seatbelts and crumple zones matter. They stretch the stop over half a meter or more, instead of a few centimeters.", belt, "zoom"),
     ("So next time you're doing sixty on the highway, remember. That's the same as dropping from a twelve story building. Buckle up.", end, "dip"),
    ]
    beats = [Beat(n, d, 3.0, cut=c, cues=[(0, "whoosh", .5)]) for n, d, c in N]
    return Reel("191_crash_equivalent", beats, style="trap", seed=191, snap=False, grid=4, safe_zone=False, vo=[(i, n) for i, (n, d, c) in enumerate(N)], title="a car crash is a fall from how high",
        caption="60 mph is the same as falling off a 12 story building. send this to someone who drives like it's nothing", story="h = v^2 / (2g): 30 mph = 13.4 m/s -> 9.2 m (3 floors); 60 mph = 26.8 m/s -> 36.7 m (12 floors); 75 mph = 33.5 m/s -> 57 m (19 floors); 100 mph = 44.7 m/s -> 102 m (34 floors), at 3 m per floor, ignoring air drag.")

def billion_seconds():
    def hook(img, lt, p, b):
        img.paste(vgrad((14, 12, 40), (40, 24, 80), key="bs")); starfield(img, lt, 4)
        for i, (v, y, col) in enumerate((("1,000,000", 520, (140, 220, 255)), ("1,000,000,000", 760, (255, 214, 0)))):
            tx(img, v, 540, y, 120 if i == 0 else 100, "black", col, scale=pop((lt - i * .4) / .4), maxw=1000); tx(img, "seconds", 540, y + 100, 44, "bold", WHITE, a=clamp((lt - i * .4 - .2) / .3))
        tx(img, "THE DIFFERENCE IS INSANE", 540, 1060, 58, "black", (255, 110, 150), a=clamp((lt - 1.4) / .3), maxw=1000)
    def mil(img, lt, p, b):
        img.paste(vgrad((14, 12, 40), (40, 24, 80), key="bs")); d_ = 11.57 * eio(seg(lt, .3, b.dur - .6)); tx(img, f"{d_:.1f}", 540, 560, 270, "black", (140, 220, 255)); tx(img, "days", 540, 780, 80, "black", WHITE)
        for k in range(12): box(img, 100 + (k % 6) * 150, 930 + (k // 6) * 130, 100 + (k % 6) * 150 + 130, 930 + (k // 6) * 130 + 110, 14, (140, 220, 255) if k < d_ else (36, 44, 90), 1.0)
    def bil(img, lt, p, b):
        img.paste(vgrad((14, 12, 40), (40, 24, 80), key="bs")); y = 31.7 * eio(seg(lt, .3, b.dur - .6)); tx(img, f"{y:.1f}", 540, 560, 270, "black", (255, 214, 0)); tx(img, "YEARS", 540, 780, 100, "black", WHITE)
        for k in range(32): disc(img, 80 + (k % 16) * 58, 960 + (k // 16) * 62, 20, (255, 214, 0) if k < y else (60, 62, 100))
    def ago94(img, lt, p, b):
        img.paste(vgrad((14, 12, 40), (40, 24, 80), key="bs")); yr = 2026 - 31.7 * eio(seg(lt, .3, 2.2)); d = ImageDraw.Draw(img)
        tx(img, f"{yr:.0f}", 540, 560, 270, "black", WHITE); tx(img, "a billion seconds ago", 540, 780, 54, "bold", (200, 210, 255))
        d.line([(100, 960), (980, 960)], fill=(160, 170, 255), width=5)
        for y_, lab in ((1994, "Amazon is founded"), (2007, "first iPhone"), (2026, "today")):
            x = 100 + (y_ - 1990) / 36 * 880; on = (y_ <= 2026) and yr <= y_ + .5; disc(img, x, 960, 14, (255, 214, 0) if on else (90, 100, 160)); tx(img, lab, x, 1040 + (50 if y_ == 2007 else 0), 34, "black", (255, 255, 255) if on else (130, 140, 190), maxw=300, a=1.0 if on else .5)
        px = 100 + (yr - 1990) / 36 * 880; line(img, [(px, 900), (px, 1010)], 6, (255, 110, 150)); 
    def tril(img, lt, p, b):
        img.paste(vgrad((14, 12, 40), (40, 24, 80), key="bs")); y = 31709 * eio(seg(lt, .3, b.dur - .6)); tx(img, f"{y:,.0f}", 540, 560, 230, "black", (255, 110, 150)); tx(img, "YEARS", 540, 760, 100, "black", WHITE); tx(img, "for one trillion seconds", 540, 880, 46, "bold", (200, 210, 255), a=clamp((lt - 1.2) / .3))
    def cave(img, lt, p, b):
        img.paste(vgrad((40, 24, 20), (14, 10, 16), key="cave")); d = ImageDraw.Draw(img)
        r = np.random.RandomState(4)
        for k in range(22): x = 100 + r.rand() * 880; y = 300 + r.rand() * 500; line(img, [(x, y), (x + 30 + r.rand() * 70, y + 20 - r.rand() * 40)], 8, (150, 90, 60), clamp((lt - .6 - k * .1) / .3) * .8)
        tx(img, "29,700 BC", 540, 960, 100, "black", (255, 190, 120), a=clamp((lt - .4) / .3)); tx(img, "people were painting cave walls", 540, 1070, 50, "bold", WHITE, a=clamp((lt - 1.0) / .3), maxw=980); tx(img, "and mammoths still roamed", 540, 1150, 50, "bold", (255, 210, 170), a=clamp((lt - 1.8) / .3), maxw=980)
    def history(img, lt, p, b):
        img.paste(vgrad((14, 12, 40), (40, 24, 80), key="bs")); tx(img, "all of recorded history", 540, 360, 64, "black", WHITE, maxw=980); tx(img, "≈ 5,000 years", 540, 470, 70, "black", (140, 220, 255), a=clamp((lt - .3) / .3))
        box(img, 90, 700, 90 + 140, 800, 14, (140, 220, 255), 1.0); tx(img, "5,000", 160, 850, 30, "bold", WHITE, shadow=False)
        w = 880 * eio(seg(lt, 1.0, 3.0)); box(img, 90, 960, 90 + max(10, w), 1060, 14, (255, 110, 150), 1.0); tx(img, "a trillion seconds", 540, 1110, 44, "bold", (255, 170, 190), a=clamp((lt - 2.8) / .3)); tx(img, "6× longer", 540, 1200, 100, "black", (255, 214, 0), a=clamp((lt - 3.2) / .3), scale=pop((lt - 3.2) / .4))
    N = [
     ("A million seconds, and a billion seconds. Most people think they're close. They are not. Let's turn both into real time.", hook, "whip"),
     ("A million seconds is eleven and a half days. That is a long vacation, but not even two weeks.", mil, "flash"),
     ("Now a billion seconds. Not a hundred days, not a few years. Thirty one point seven years.", bil, "zoom"),
     ("So a billion seconds ago, it was nineteen ninety four. Amazon was just getting started. A billion seconds from now, you will be thirty two years older.", ago94, "whip"),
     ("Each step is a thousand times bigger. So what about a trillion seconds? Thirty one thousand, seven hundred years.", tril, "flash"),
     ("A trillion seconds ago, humans were painting cave walls, and mammoths were still around.", cave, "zoom"),
     ("That is about six times longer than all of recorded history. Every empire, every war, every language you have ever heard of, fits inside one sixth of a trillion seconds.", history, "whip"),
     ("A million is a vacation. A billion is a generation. A trillion is the whole human story.", None, "dip"),
    ]
    def finale(img, lt, p, b):
        img.paste(vgrad((14, 12, 40), (40, 24, 80), key="bs")); starfield(img, lt, 4)
        for i, (s, col, y) in enumerate((("a million = a vacation", (140, 220, 255), 520), ("a billion = a generation", (255, 214, 0), 700), ("a trillion = the whole human story", (255, 110, 150), 880))):
            tx(img, s, 540, y, 56, "black", col, a=clamp((lt - .3 - i * 1.3) / .3), scale=pop((lt - .3 - i * 1.3) / .4), maxw=1000)
    N[-1] = (N[-1][0], finale, "dip")
    beats = [Beat(n, d, 3.0, cut=c, cues=[(0, "whoosh", .5)]) for n, d, c in N]
    return Reel("192_billion_seconds", beats, style="cine", seed=192, snap=False, grid=4, safe_zone=False, vo=[(i, n) for i, (n, d, c) in enumerate(N)], title="how big is a billion seconds",
        caption="a billion seconds ago it was 1994. a trillion seconds ago there were mammoths. send this to someone who says 'it's just a few zeros'", story="1e6 s = 11.57 days; 1e9 s = 31.69 years (2026 - 31.7 = 1994; Amazon founded 1994); 1e12 s = 31,688 years (about 29,700 BC; early cave art such as Chauvet is roughly 30,000+ years old; mammoths existed); recorded history ~5,000 years.")

def age_planets():
    ORB = [("Mercury", .2408, 130), ("Venus", .6152, 190), ("Earth", 1.0, 250), ("Mars", 1.8808, 310), ("Jupiter", 11.862, 370), ("Saturn", 29.457, 430), ("Uranus", 84.02, 490), ("Neptune", 164.8, 550)]
    AGE = 25.0
    def system(img, lt, upto, b, focus=None, show=True):
        img.paste(vgrad((6, 8, 24), (20, 14, 50), key="ap")); starfield(img, lt, 4); cx, cy = 540, 660
        glow(img, cx, cy, 90, (255, 180, 60), .8); planet(img, cx, cy, 34, "Sun")
        for i, (nm, per, rad) in enumerate(ORB):
            if i >= upto: break
            R = rad * .98; ring(img, cx, cy, R, 2, (60, 70, 120), .6); ang = lt * (1.0 / per) * 1.2 + i; px = cx + math.cos(ang) * R; py = cy + math.sin(ang) * R * .98
            planet(img, px, py, 16 if nm in ("Earth", "Venus", "Mars", "Mercury") else (26 if nm in ("Jupiter", "Saturn") else 20), nm, ring_=(nm == "Saturn"))
    def hook(img, lt, p, b): system(img, lt, 8, b); tx(img, "HOW OLD ARE YOU", 540, 1130, 66, "black", WHITE, scale=pop(lt / .4)); tx(img, "ON EVERY PLANET?", 540, 1210, 66, "black", (255, 214, 0), scale=pop((lt - .3) / .4))
    def one(nm, upto, per):
        def f(img, lt, p, b):
            system(img, lt, upto, b); a = AGE / per
            box(img, 190, 1030, 890, 1250, 34, (10, 12, 34), .92, outline=(255, 214, 0), ow=4); tx(img, nm.upper(), 540, 1075, 50, "black", WHITE, maxw=600)
            v = a * eio(seg(lt, .3, b.dur - .8)); tx(img, f"{v:.1f}" if a >= 1 else f"{v:.2f}", 540, 1170, 100, "black", (255, 214, 0)); tx(img, "years old", 780, 1180, 36, "bold", (200, 210, 255), shadow=False, maxw=200)
        return f
    def fin(img, lt, p, b):
        system(img, lt, 8, b); tx(img, "Neptune: 0.15", 540, 1100, 90, "black", (110, 150, 255), scale=pop(lt / .4)); tx(img, "your first birthday there", 540, 1200, 52, "bold", WHITE, a=clamp((lt - .6) / .3)); tx(img, "is 165 years away", 540, 1270, 52, "bold", (255, 214, 0), a=clamp((lt - 1.2) / .3))
    N = [
     ("How old would you be on every planet in the solar system? Let's say you're twenty five. A year is just one trip around the Sun, and every planet takes a different time.", hook, "whip"),
     ("Start close to the Sun. On Mercury, a year lasts only eighty eight days. So you've lived through a hundred and four of them. You're a hundred and four years old.", one("Mercury", 1, .2408), "flash"),
     ("Venus is farther out, and takes two hundred twenty five days. So you're forty point six.", one("Venus", 2, .6152), "zoom"),
     ("Mars takes almost two Earth years to go around. So you're thirteen point three. Basically a teenager.", one("Mars", 4, 1.8808), "whip"),
     ("Out at Jupiter, one trip takes almost twelve of our years. You're barely two years old.", one("Jupiter", 5, 11.862), "flash"),
     ("Saturn takes twenty nine years. So you haven't even had your first birthday. You're point eight five.", one("Saturn", 6, 29.457), "zoom"),
     ("Uranus takes eighty four years to go around. You're point three years old, about four months.", one("Uranus", 7, 84.02), "whip"),
     ("And on Neptune, the farthest planet, a year lasts a hundred and sixty five Earth years. You're point one five. Barely born.", fin, "dip"),
    ]
    beats = [Beat(n, d, 3.0, cut=c, cues=[(0, "whoosh", .5)]) for n, d, c in N]
    return Reel("195_age_on_planets", beats, style="pop", seed=195, snap=False, grid=4, safe_zone=False, vo=[(i, n) for i, (n, d, c) in enumerate(N)], title="how old you are on every planet",
        caption="at 25 you're 104 on Mercury and 0.15 on Neptune. comment your age and i'll do the math. send this to someone who hates getting older", story="Age = Earth age / orbital period in Earth years: Mercury 0.2408 y -> 103.8; Venus 0.6152 -> 40.6; Mars 1.8808 -> 13.3; Jupiter 11.862 -> 2.1; Saturn 29.457 -> 0.85; Uranus 84.02 -> 0.30; Neptune 164.8 -> 0.15 (for a 25-year-old).")

REELS = dict(planet_bounce=planet_bounce, crash_equiv=crash_equiv, billion_seconds=billion_seconds, age_planets=age_planets)
