"""Batch 26: space and earth explainers (narrated motion graphics)."""
import math, os
import numpy as np
from PIL import Image, ImageDraw
from scripts.common import *
from motion import *
import motion, voice

def sun_disc(img, cx, cy, r, a=1.0, t=0):
    glow(img, cx, cy, r * 3.2, (255, 170, 60), .55 * a); glow(img, cx, cy, r * 1.8, (255, 220, 120), .8 * a)
    disc(img, cx, cy, r, (255, 232, 150), a); disc(img, cx, cy, r * .86, (255, 246, 205), a)
    for k in range(14):
        ang = k * .45 + t * .35; l = r * (1.25 + .15 * math.sin(t * 2 + k)); line(img, [(cx + math.cos(ang) * r * 1.05, cy + math.sin(ang) * r * 1.05), (cx + math.cos(ang) * l, cy + math.sin(ang) * l)], 5, (255, 200, 90), .5 * a)

def sun_vanishes():
    def hook(img, lt, p, b):
        img.paste(space(lt)); r = 230 * (1 - eio(seg(lt, 1.6, 2.4))) + 1; 
        if r > 3: sun_disc(img, 540, 720, r, 1.0, lt)
        if lt > 2.0:
            u = lt - 2.0; img.paste(Image.new("RGB", (CW, CH), WHITE), (0, 0), Image.new("L", (CW, CH), int(clamp(1 - u / .25) * 160)))
        tx(img, "THE SUN", 540, 960, 120, "black", WHITE, a=clamp((lt - .2) / .2)); 
        if lt > 2.1: tx(img, "VANISHES", 540, 1120, 120, "black", (255, 214, 0), scale=pop((lt - 2.1) / .4))
    def instant(img, lt, p, b):
        img.paste(space(lt, (2, 3, 10), (8, 10, 24))); earth(img, 540, 760, 240)
        tx(img, "gone. instantly.", 540, 1100, 90, "black", WHITE, scale=pop(lt / .5), a=clamp(lt / .1))
    def timer(img, lt, p, b):
        img.paste(space(lt)); sun = (540, 330); earth_p = (540, 1130)
        for k in range(6): line(img, [(540, 1020 - k * 140), (540, 960 - k * 140)], 4, (60, 70, 110), .5)
        earth(img, 540, 1130, 90); disc(img, 540, 330, 70, (40, 40, 60), 1.0, outline=(90, 100, 150), ow=3)
        s = 499 * eio(seg(lt, .4, b.dur - .5)); u = s / 499.0
        y = 330 + (1130 - 330) * u; glow(img, 540, y, 70, (255, 230, 140), .9); disc(img, 540, y, 16, (255, 245, 200))
        tx(img, f"{int(s) // 60}:{int(s) % 60:02d}", 540, 650, 190, "black", (255, 214, 0)); tx(img, "minutes : seconds", 540, 780, 40, "bold", (200, 215, 255), a=.8)
        tx(img, "the sky still looks normal", 540, 1330, 48, "bold", WHITE)
    def light(img, lt, p, b):
        img.paste(space(lt)); sun_disc(img, 140, 760, 70, .35, lt); earth(img, 940, 760, 70)
        line(img, [(230, 760), (860, 760)], 4, (255, 214, 0), .55); u = (lt * .7) % 1; glow(img, 230 + 630 * u, 760, 50, (255, 240, 160), .9); disc(img, 230 + 630 * u, 760, 12, WHITE)
        tx(img, "150,000,000 km", 540, 520, 100, "black", (255, 214, 0), scale=pop(lt / .5)); tx(img, "at the speed of light", 540, 630, 52, "bold", WHITE, a=clamp((lt - .8) / .3))
        tx(img, "300,000 km every second", 540, 960, 46, "bold", (200, 215, 255), a=clamp((lt - 1.6) / .3))
    def gravity(img, lt, p, b):
        img.paste(space(lt)); cx, cy = 540, 560; 
        for k in range(4):
            u = (lt * .5 + k / 4) % 1; ring(img, cx, cy, 40 + u * 480, 3, (255, 160, 80), (1 - u) * .5)
        disc(img, cx, cy, 20, (60, 60, 80), 1.0, outline=(120, 120, 160), ow=3); a = lt * .6; ex, ey = cx + math.cos(a) * 240, cy + math.sin(a) * 240
        ring(img, cx, cy, 240, 2, (110, 120, 190), .5); earth(img, ex, ey, 46)
        tx(img, "gravity travels at light speed too", 540, 960, 52, "bold", WHITE, a=clamp((lt - .5) / .3)); tx(img, "Earth keeps orbiting", 540, 1060, 64, "black", (255, 214, 0), a=clamp((lt - 1.5) / .3)); tx(img, "an empty spot", 540, 1140, 64, "black", (255, 214, 0), a=clamp((lt - 1.5) / .3))
    def dark(img, lt, p, b):
        k = clamp(lt / 1.2); img.paste(space(lt, mix((5, 8, 22), (0, 0, 0), k), mix((14, 20, 50), (0, 0, 0), k)))
        a = lt * .6 + 1.2; e = eio(seg(lt, 1.2, 4.0)); cx, cy = 540, 760; ex0, ey0 = cx + math.cos(1.2) * 280, cy + math.sin(1.2) * 280
        # earth leaves along tangent
        tx_, ty_ = -math.sin(1.2), math.cos(1.2); ex, ey = ex0 + tx_ * 700 * e, ey0 + ty_ * 700 * e
        ring(img, cx, cy, 280, 2, (60, 70, 110), .35 * (1 - e)); 
        for k in range(6): u = e * (1 - k * .12); 
        line(img, [(ex0, ey0), (ex, ey)], 4, (120, 180, 255), .4); earth(img, ex, ey, 60, glow_a=.35)
        tx(img, "8 minutes 20 seconds", 540, 220, 70, "black", (255, 214, 0)); tx(img, "then: darkness", 540, 1180, 100, "black", WHITE, a=clamp((lt - .6) / .4))
        tx(img, "flying off at 30 km/s", 540, 1290, 52, "bold", (200, 215, 255), a=clamp((lt - 2.4) / .3))
    def moondark(img, lt, p, b):
        img.paste(space(lt)); k = eio(seg(lt, .8, 2.6)); col = mix((235, 235, 245), (14, 14, 22), k)
        glow(img, 540, 700, 330, (200, 210, 255), .45 * (1 - k)); disc(img, 540, 700, 220, col, 1.0, outline=(110, 120, 160), ow=3)
        for cx_, cy_, r_ in ((470, 640, 40), (610, 760, 55), (540, 560, 28), (450, 790, 24)): disc(img, cx_, cy_, r_, mix((200, 200, 212), (10, 10, 16), k), 1.0)
        tx(img, "the Moon goes dark too", 540, 1100, 76, "black", WHITE, a=clamp(lt / .3)); tx(img, "it only shines by reflecting sunlight", 540, 1200, 44, "bold", (200, 215, 255), a=clamp((lt - 1.2) / .3))
    def lifeout(img, lt, p, b):
        img.paste(vgrad((20, 50, 30), (4, 14, 10), key="plant")); k = eio(seg(lt, .8, 3.5)); col = mix((90, 200, 90), (110, 90, 60), k)
        line(img, [(540, 1100), (540, 760)], 14, col); 
        for sgn in (-1, 1): disc(img, 540 + sgn * 90, 740 + sgn * 0, 80 - 20 * k, col, 1.0); line(img, [(540, 840), (540 + sgn * 90, 740)], 10, col)
        tx(img, "photosynthesis stops", 540, 360, 76, "black", WHITE, a=clamp(lt / .3)); tx(img, "plants die within weeks", 540, 460, 56, "bold", (255, 214, 0), a=clamp((lt - 1.2) / .3))
        tx(img, "deep-sea vents could keep life going", 540, 1230, 44, "bold", (150, 210, 255), a=clamp((lt - 3.2) / .3))
    def cold(img, lt, p, b):
        img.paste(vgrad((6, 14, 40), (2, 4, 14), key="cold")); starfield(img, lt, 6)
        T = 15 - 88 * eio(seg(lt, .3, 4.5)); col = mix((255, 180, 90), (110, 190, 255), eio(seg(T, 15, -73) * -1 if False else (15 - T) / 88))
        box(img, 240, 420, 840, 760, 40, (14, 20, 44), .9, outline=col, ow=5); tx(img, f"{T:.0f}°C", 540, 590, 190, "black", col)
        tx(img, "average surface temperature", 540, 360, 44, "bold", (200, 215, 255)); tx(img, "below freezing within about a week", 540, 880, 48, "bold", WHITE, a=clamp((lt - 1.6) / .3)); tx(img, "oceans freeze over in about a year", 540, 960, 48, "bold", (150, 210, 255), a=clamp((lt - 3.2) / .3))
        tx(img, "(scientists' estimates)", 540, 1060, 36, "bold", (150, 160, 200), a=.8)
    def enjoy(img, lt, p, b):
        img.paste(space(lt)); sun_disc(img, 540, 700, 200, 1.0, lt); 
        tx(img, "8:20", 540, 1020, 200, "black", (255, 214, 0), scale=pop(lt / .5)); tx(img, "that's your free time", 540, 1210, 58, "bold", WHITE, a=clamp((lt - .8) / .3))
    N = [
     ("What if the Sun just disappeared?", hook, "whip"),
     ("Not slowly. Gone. Instantly.", instant, "flash"),
     ("The first thing you'd notice, is nothing. For eight minutes and twenty seconds.", timer, "zoom"),
     ("That's how long sunlight takes to reach us. A hundred and fifty million kilometers, at the speed of light.", light, "whip"),
     ("And gravity travels at that same speed. So Earth would keep orbiting an empty spot.", gravity, "zoom"),
     ("Then, at exactly eight minutes and twenty seconds, the sky goes dark. And Earth flies off in a straight line.", dark, "flash"),
     ("The Moon would go dark too, since it only shines by reflecting sunlight.", moondark, "zoom"),
     ("Photosynthesis stops. Plants die within weeks, and most life on the surface follows. Life around deep ocean vents could carry on.", lifeout, "whip"),
     ("Within about a week, the surface drops below freezing. In a year, the oceans freeze over, scientists estimate.", cold, "whip"),
     ("But for eight minutes, you'd be completely fine. So make them count.", enjoy, "dip"),
    ]
    beats = [Beat(n, d, 3.0, cut=c, cues=[(0, "whoosh", .5)]) for n, d, c in N]
    beats[0].min_dur = 3.4; beats[0].cues += [(1.9, "boom", .9)]; beats[5].min_dur = 5.5
    return Reel("194_sun_vanishes", beats, style="cine", seed=194, snap=False, grid=4, safe_zone=False, vo=[(i, n) for i, (n, d, c) in enumerate(N)], title="what if the sun disappeared",
        caption="for 8 minutes and 20 seconds nothing would change. send this to the friend who procrastinates", story="Sun-Earth distance 1.496e8 km / 299,792 km/s = 499 s = 8 min 19 s. Gravity propagates at c. Earth orbital speed ~29.8 km/s. Estimated surface cooling: below freezing within about a week, oceans' surface freezing over in about a year (popular science estimates).")

def fall_earth():
    LAYERS = [(300, (120, 80, 50), "crust and mantle"), (230, (200, 90, 40), "outer core"), (110, (255, 200, 80), "inner core")]
    def cross(img, cx, cy, R, a=1.0):
        glow(img, cx, cy, R * 1.3, (80, 140, 255), .3)
        disc(img, cx, cy, R, (70, 130, 190), 1.0, outline=(150, 200, 255), ow=4); disc(img, cx, cy, R * .93, (130, 86, 54), 1.0); disc(img, cx, cy, R * .55, (210, 100, 40), 1.0); disc(img, cx, cy, R * .22, (255, 214, 100), 1.0)
    def hook(img, lt, p, b):
        img.paste(space(lt)); e = eio(seg(lt, .0, 1.2)); cross(img, 540, 900, 380 * (.6 + .4 * e))
        tx(img, "A TUNNEL THROUGH", 540, 300, 80, "black", WHITE, a=clamp(lt / .2)); tx(img, "THE EARTH", 540, 440, 110, "black", (255, 214, 0), a=clamp((lt - .3) / .2), scale=pop((lt - .3) / .4))
        u = eio(seg(lt, 1.2, 3.0)); line(img, [(540, 520), (540, 520 + 760 * u)], 12, (10, 10, 24))
    def fall(img, lt, p, b, y_of=None, show=True):
        img.paste(space(lt)); cross(img, 540, 760, 330); line(img, [(540, 430), (540, 1090)], 12, (10, 10, 24))
        u = clamp(lt / b.dur)
        y = 430 + 330 * math.sin(u * math.pi / 2)
        glow(img, 540, y, 50, (255, 255, 255), .7); disc(img, 540, y, 16, WHITE)
        v = 28400 * math.sin(u * math.pi / 2); tx(img, f"{v:,.0f}", 540, 1200, 100, "black", (255, 214, 0)); tx(img, "km/h", 540, 1280, 42, "bold", (200, 215, 255))
    def gravity(img, lt, p, b):
        img.paste(space(lt)); cross(img, 540, 640, 300); disc(img, 540, 640, 14, WHITE)
        for k, (R, lab) in enumerate(((270, "gravity pulls you in"), (140, "pull gets weaker"), (30, "zero at the center"))):
            u = clamp((lt - .3 - k * .9) / .4)
            if u > 0: ring(img, 540, 640, R, 4, (255, 214, 0), u * .8); tx(img, lab, 540, 1030 + k * 80, 48, "bold", WHITE if k < 2 else (255, 214, 0), a=u)
    def center(img, lt, p, b):
        img.paste(space(lt)); cross(img, 540, 800, 330); u = eio(seg(lt, .0, 2.0)); y = 800 + (1 - u) * -180 * 0
        glow(img, 540, 800, 90, (255, 255, 255), .8); disc(img, 540, 800, 18, WHITE)
        tx(img, "28,400 km/h", 540, 1230, 120, "black", (255, 214, 0), scale=pop(lt / .5)); tx(img, "at the center", 540, 1330, 54, "bold", WHITE, a=clamp((lt - .5) / .3))
    def kola(img, lt, p, b):
        img.paste(space(lt)); cross(img, 540, 800, 330)
        u = eio(seg(lt, .4, 2.2)); line(img, [(540, 470), (540, 470 + 12 / 6371 * 330 * 6 * u)], 10, (255, 90, 90)); disc(img, 540, 470, 8, (255, 90, 90))
        v = 12 * u; tx(img, f"{v:,.0f} km", 540, 1220, 150, "black", (255, 90, 90)); tx(img, "the deepest hole ever dug", 540, 1330, 52, "bold", WHITE, a=clamp((lt - .6) / .3))
    def kola2(img, lt, p, b):
        img.paste(space(lt)); cross(img, 540, 760, 330); u = eio(seg(lt, .3, 3.0)); line(img, [(540, 430), (540, 430 + 330 * u)], 10, (255, 214, 0)); disc(img, 540, 430 + 330 * u, 14, WHITE)
        v = 6371 * u; tx(img, f"{v:,.0f} km", 540, 1220, 150, "black", (255, 214, 0)); tx(img, "to the center of the Earth", 540, 1330, 52, "bold", WHITE, a=clamp((lt - .6) / .3))
    def hot(img, lt, p, b):
        img.paste(space(lt)); cross(img, 540, 700, 300); e = eio(seg(lt, .3, 2.0)); glow(img, 540, 700, 130, (255, 220, 120), .9 * e)
        v = 5200 * e; tx(img, f"{v:,.0f}°C", 540, 1040, 140, "black", (255, 214, 0)); tx(img, "at the center. as hot as the Sun's surface.", 540, 1200, 44, "bold", WHITE, a=clamp((lt - 1.6) / .3))
    def timeline(img, lt, p, b):
        img.paste(space(lt)); cross(img, 540, 760, 300)
        for i, (t, lab) in enumerate(((21, "center"), (42, "other side"))):
            pass
        s = 42 * eio(seg(lt, .3, b.dur - .6)); y = 760 + 300 * math.sin(clamp(s / 42) * math.pi)  # goes down to the centre at 21 and back up
        yy = 460 + (1 - math.cos(clamp(s / 42) * math.pi)) / 2 * 600
        line(img, [(540, 460), (540, 1060)], 10, (10, 10, 24)); glow(img, 540, yy, 50, WHITE, .8); disc(img, 540, yy, 16, WHITE)
        tx(img, f"{int(s)} minutes", 540, 1230, 130, "black", (255, 214, 0)); tx(img, "to the other side of the planet", 540, 1330, 46, "bold", WHITE)
    def stop(img, lt, p, b):
        img.paste(space(lt)); cross(img, 540, 760, 300); u = clamp(lt / b.dur); y = 1060 - 40 * math.sin(u * math.pi) 
        glow(img, 540, y, 50, WHITE, .8); disc(img, 540, y, 16, WHITE); line(img, [(540, 460), (540, 1060)], 10, (10, 10, 24))
        tx(img, "and stop", 540, 1200, 120, "black", WHITE, scale=pop(lt / .4)); tx(img, "right at the opening", 540, 1310, 54, "bold", (255, 214, 0), a=clamp((lt - .6) / .3))
    def swing(img, lt, p, b):
        img.paste(space(lt)); cross(img, 540, 760, 300); line(img, [(540, 460), (540, 1060)], 10, (10, 10, 24)); y = 760 - 300 * math.cos(lt * 2.4)
        glow(img, 540, y, 50, WHITE, .8); disc(img, 540, y, 16, WHITE); tx(img, "back and forth.", 540, 1200, 96, "black", WHITE); tx(img, "like a very long swing", 540, 1310, 54, "bold", (255, 214, 0), a=clamp((lt - .6) / .3))
    def chord(img, lt, p, b):
        img.paste(space(lt)); cross(img, 540, 760, 300)
        for k, (a1, a2) in enumerate(((.5, 2.6), (3.6, 5.4), (1.2, 4.2))):
            u = clamp((lt - .3 - k * .8) / .6)
            if u > 0: line(img, [(540 + 300 * math.cos(a1), 760 + 300 * math.sin(a1)), (540 + 300 * math.cos(lerp(a1, a2, u)), 760 + 300 * math.sin(lerp(a1, a2, u)))], 8, (255, 214, 0), .9)
        tx(img, "ANY straight tunnel", 540, 1190, 78, "black", WHITE); tx(img, "takes 42 minutes", 540, 1290, 90, "black", (255, 214, 0), scale=pop((lt - 1.2) / .4), a=clamp((lt - 1.2) / .1))
    N = [
     ("What if you dug a tunnel straight through the center of the Earth, and jumped in?", hook, "whip"),
     ("Real life is nowhere close. The deepest hole humans ever dug is twelve kilometers.", kola, "flash"),
     ("The center of the Earth is more than six thousand kilometers down.", kola2, "zoom"),
     ("And it's hot. About five thousand degrees Celsius, as hot as the surface of the Sun.", hot, "zoom"),
     ("Ignore the heat, the air, and the pressure. Just gravity. You start falling, faster, and faster.", fall, "flash"),
     ("The deeper you go, the less gravity pulls. Right at the center, it's zero.", gravity, "zoom"),
     ("But you're moving so fast, that you shoot right through. At about twenty eight thousand kilometers per hour.", center, "whip"),
     ("Forty two minutes after you jumped, you reach the other side of the planet.", timeline, "flash"),
     ("And you stop. Right at the opening, for a split second.", stop, "zoom"),
     ("Then you fall back in. Again, and again, like a very long swing.", swing, "whip"),
     ("And here's the crazy part. Any straight tunnel, even a short one, takes the same forty two minutes.", chord, "dip"),
    ]
    beats = [Beat(n, d, 3.0, cut=c, cues=[(0, "whoosh", .5)]) for n, d, c in N]
    return Reel("193_fall_earth", beats, style="cine", seed=193, snap=False, grid=4, safe_zone=False, vo=[(i, n) for i, (n, d, c) in enumerate(N)], title="what if you fell through the earth",
        caption="42 minutes to the other side of the planet. any straight tunnel takes the same time. send this to the person who'd go back for their phone", story="Uniform-density model: gravity inside grows linearly with r, so motion is simple harmonic with period 84.4 min; one way is half = 42 min; max speed sqrt(gR) = 7.9 km/s = 28,400 km/h. For a straight chord (gravity train) the one-way time is also ~42 min. Ignores air, heat and Earth's non-uniform density.")

REELS = dict(sun_vanishes=sun_vanishes, fall_earth=fall_earth)
