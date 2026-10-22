"""Batch 31: relatable scale explainers: ping pong balls in a bus, stopping distance, your life in weeks, how fast you're moving."""
import math, os
import numpy as np
from PIL import Image, ImageDraw
from scripts.common import *
from motion import *
import motion, voice
from scripts.b30 import planet

GOLD = (255, 214, 0); CY = (140, 220, 255); PINK = (255, 110, 150); GRN = (120, 255, 160)

def bg(c1=(14, 12, 40), c2=(40, 24, 80), key=None):
    return vgrad(c1, c2, key=key or str((c1, c2)))

# ------------------------------------------------------------------ ping pong balls in a bus
def bus(img, x, y, w, h, a=1.0, wob=0.0):
    y = y + wob
    box(img, x, y, x + w, y + h, 40, (255, 190, 20), a, outline=(200, 140, 0), ow=4)
    n = 6; ww = w / (n + 1)
    for k in range(n): box(img, x + 40 + k * ww, y + 40, x + 40 + k * ww + ww * .72, y + h * .42, 8, (150, 215, 255), a)
    box(img, x + w - 12 - ww * .6, y + 40, x + w - 12, y + h * .6, 8, (150, 215, 255), a)
    for cx in (x + w * .22, x + w * .74): disc(img, cx, y + h + 2, h * .17, (24, 24, 34), a, outline=(160, 160, 170), ow=4)

def ping_pong_bus():
    L, WD = 11.0, 2.4
    def hook(img, lt, p, b):
        img.paste(bg()); starfield(img, lt, 4)
        tx(img, "HOW MANY PING PONG", 540, 330, 70, "black", WHITE, scale=pop(lt / .4), maxw=1000); tx(img, "BALLS FIT IN A", 540, 430, 70, "black", WHITE, scale=pop((lt - .2) / .4), maxw=1000); tx(img, "SCHOOL BUS?", 540, 560, 110, "black", GOLD, scale=pop((lt - .4) / .4), maxw=1000)
        bus(img, 120, 900, 840, 280, wob=math.sin(lt * 6) * 4)
        r = np.random.RandomState(3)
        for k in range(14):
            u = (lt * .5 + k * .37) % 1; ballx = 160 + (k * 61) % 760; bally = 640 + u * 240; disc(img, ballx, bally, 22, (255, 255, 255), .9 * (1 - u * .3), outline=(220, 220, 230), ow=2)
    def size(img, lt, p, b):
        img.paste(bg()); a = clamp(lt / .4)
        bus(img, 120, 700, 840, 280)
        line(img, [(120, 1080), (960, 1080)], 6, CY, a); line(img, [(120, 1060), (120, 1100)], 6, CY, a); line(img, [(960, 1060), (960, 1100)], 6, CY, a)
        tx(img, "11 m long", 540, 1150, 60, "black", CY, a=a)
        tx(img, "inside space", 540, 300, 56, "bold", WHITE, a=clamp((lt - .6) / .3)); v = 44 * eio(seg(lt, .8, b.dur - .5)); tx(img, f"{v:.0f} m³", 540, 510, 170, "black", GOLD, a=clamp((lt - .6) / .3), maxw=1000)
        tx(img, "about 44 cubic meters", 540, 650, 46, "bold", (200, 210, 255), a=clamp((lt - 1.6) / .3), maxw=1000)
    def ball(img, lt, p, b):
        img.paste(bg()); disc(img, 540, 760, 230, (255, 255, 255), 1.0, outline=(225, 225, 235), ow=6); glow(img, 540, 760, 300, (255, 255, 255), .25)
        a = clamp((lt - .3) / .3); line(img, [(310, 1060), (770, 1060)], 6, CY, a); line(img, [(310, 1040), (310, 1080)], 6, CY, a); line(img, [(770, 1040), (770, 1080)], 6, CY, a)
        tx(img, "40 mm", 540, 1130, 80, "black", CY, a=a); tx(img, "33 cm³ each", 540, 1290, 80, "black", GOLD, a=clamp((lt - 1.5) / .3), maxw=1000)
        tx(img, "ONE PING PONG BALL", 540, 300, 62, "black", WHITE, maxw=1000)
    def naive(img, lt, p, b):
        img.paste(bg()); tx(img, "bus ÷ ball", 540, 300, 80, "black", WHITE, maxw=1000)
        v = 1.31 * eio(seg(lt, .5, 2.2)); tx(img, f"{v:.2f} million", 540, 520, 130, "black", GOLD, maxw=1000); tx(img, "if balls had no gaps", 540, 660, 50, "bold", (200, 210, 255), a=clamp((lt - 1.4) / .3))
        x0, y0 = 240, 860; box(img, x0 - 10, y0 - 10, x0 + 610, y0 + 430, 20, (22, 24, 56), 1.0, outline=(110, 120, 200), ow=4)
        for i in range(10):
            for j in range(7):
                cx = x0 + 30 + i * 60 + (30 if j % 2 else 0); cy = y0 + 30 + j * 58
                if cx < x0 + 590: disc(img, cx, cy, 26, (255, 255, 255), clamp((lt - 1.0 - (i + j) * .04) / .2))
        tx(img, "but round things leave gaps", 540, 1330, 50, "bold", PINK, a=clamp((lt - 2.6) / .3), maxw=1000)
    def pack(img, lt, p, b):
        img.paste(bg()); tx(img, "poured in randomly", 540, 320, 62, "black", WHITE, maxw=1000)
        pc = 64 * eio(seg(lt, .4, b.dur - 1.2)); tx(img, f"{pc:.0f}%", 540, 560, 250, "black", GOLD)
        tx(img, "of the space is ball", 540, 740, 54, "bold", (200, 210, 255));
        box(img, 140, 900, 940, 980, 30, (40, 44, 90), 1.0); w = 800 * pc / 100; box(img, 140, 900, 140 + max(30, w), 980, 30, GOLD, 1.0)
        tx(img, "the rest is air", 540, 1080, 56, "black", PINK, a=clamp((lt - 2.0) / .3))
    def answer(img, lt, p, b):
        img.paste(bg()); bus(img, 120, 940, 840, 280)
        n = int(840000 * eio(seg(lt, .6, b.dur - .8)))
        r = np.random.RandomState(7)
        for k in range(int(260 * eio(seg(lt, .6, b.dur - .8)))): disc(img, 160 + r.rand() * 760, 990 + r.rand() * 120, 12, (255, 255, 255), .85)
        tx(img, f"{n:,}", 540, 520, 200, "black", GOLD, maxw=1000); tx(img, "ping pong balls", 540, 680, 80, "black", WHITE, maxw=1000)
        tx(img, "about 800,000", 540, 800, 52, "bold", (200, 210, 255), a=clamp((lt - 2.0) / .3))
    def cost(img, lt, p, b):
        img.paste(bg((20, 30, 40), (10, 70, 60))); starfield(img, lt, 4)
        tx(img, "20¢ a ball", 540, 340, 90, "black", WHITE, scale=pop(lt / .4)); v = 168000 * eio(seg(lt, .7, 2.8)); tx(img, f"${v:,.0f}", 540, 640, 190, "black", GRN, maxw=1000, scale=pop((lt - .5) / .4))
        tx(img, "to fill one school bus", 540, 820, 56, "bold", WHITE, a=clamp((lt - 1.6) / .3))
    def end(img, lt, p, b):
        img.paste(bg()); bus(img, 120, 760, 840, 280, wob=math.sin(lt * 5) * 3); r = np.random.RandomState(7)
        for k in range(260): disc(img, 160 + r.rand() * 760, 810 + r.rand() * 120, 12, (255, 255, 255), .85)
        tx(img, "a full bus is still", 540, 400, 62, "black", WHITE, maxw=1000); tx(img, "under a million", 540, 540, 110, "black", GOLD, scale=pop((lt - .4) / .4), maxw=1000)
    N = [
     ("How many ping pong balls fit inside a school bus? Take a guess. Most people say a few thousand.", hook, "whip"),
     ("A standard school bus is about eleven meters long, and holds roughly forty four cubic meters of empty space inside.", size, "flash"),
     ("Now the ball. One ping pong ball is forty millimeters wide. That's thirty three cubic centimeters.", ball, "zoom"),
     ("Divide the bus by the ball, and you get one point three million. But that assumes the balls have no gaps, and round things always leave gaps.", naive, "whip"),
     ("Poured in randomly, round balls fill only about sixty four percent of the space. The rest is just air.", pack, "flash"),
     ("So the real answer is about eight hundred thousand ping pong balls.", answer, "zoom"),
     ("At twenty cents a ball, that's roughly one hundred sixty eight thousand dollars, just to fill one bus.", cost, "whip"),
     ("So next time someone says a million, remember. A whole school bus, packed to the roof, is still not even a million ping pong balls.", end, "dip"),
    ]
    beats = [Beat(n, d, 3.0, cut=c, cues=[(0, "whoosh", .5)]) for n, d, c in N]
    return Reel("207_ping_pong_bus", beats, style="bounce", seed=207, snap=False, grid=4, safe_zone=False, vo=[(i, n) for i, (n, d, c) in enumerate(N)], title="how many ping pong balls fit in a school bus",
        caption="a school bus holds about 800,000 ping pong balls. not even a million. send this to the friend who says 'a million is nothing'", story="Bus interior about 11 m x 2.4 m x 1.7 m = about 44 m3. Ping pong ball 40 mm diameter = 33.5 cm3. 44e6 / 33.5 = 1.31 million with no gaps; random close packing of spheres is about 64% -> about 840,000 balls. At about $0.20 each = about $168,000.")

# ------------------------------------------------------------------ stopping distance
def stopping_distance():
    V = 26.8; RT = 1.5; DRY = V * V / (2 * .7 * 9.81); WET = V * V / (2 * .4 * 9.81); FAST = (2 * V) ** 2 / (2 * .7 * 9.81)
    def car(img, x, y, col=(255, 90, 100), a=1.0):
        box(img, x, y, x + 150, y + 56, 16, col, a); box(img, x + 36, y - 30, x + 112, y + 6, 12, mix(col, (255, 255, 255), .25), a)
        disc(img, x + 34, y + 58, 17, (20, 20, 30), a, outline=(150, 150, 160), ow=3); disc(img, x + 118, y + 58, 17, (20, 20, 30), a, outline=(150, 150, 160), ow=3)
    def road(img, lt, carm, meters, marks, b, a_=1.0, col=(255, 90, 100), wet=False):
        img.paste(bg((16, 16, 34), (30, 28, 60) if not wet else (20, 30, 70))); d = ImageDraw.Draw(img)
        d.rectangle([0, 760, 1080, 960], fill=(40, 42, 58) if not wet else (34, 44, 80)); d.line([(0, 860), (1080, 860)], fill=(120, 120, 140), width=4)
        sc = 800 / meters; x0 = 200
        for m in range(0, int(meters) + 1, 10 if meters <= 150 else 50):
            xx = x0 + m * sc; d.line([(xx, 760), (xx, 780)], fill=(200, 200, 230), width=3)
            if m % (20 if meters <= 150 else 100) == 0: tx(img, f"{m}", xx, 1000, 30, "bold", (200, 210, 255), shadow=False)
        tx(img, "meters", 980, 1050, 28, "bold", (160, 170, 220), shadow=False)
        for lab, m0, m1, c in marks:
            if m1 - m0 > 1: box(img, x0 + m0 * sc, 700, x0 + m1 * sc, 744, 10, c, .9)
            if m1 - m0 > 14: tx(img, lab, max(170, min(910, (x0 + m0 * sc + x0 + m1 * sc) / 2)), 672 if lab != "braking" and lab != "braking only" else 640, 34, "black", c, maxw=300, shadow=False)
        car(img, x0 + carm * sc - 150, 770, col)
    def hook(img, lt, p, b):
        road(img, lt, 0, 100, [], b); tx(img, "60 MPH.", 540, 280, 130, "black", WHITE, scale=pop(lt / .4)); tx(img, "A DEER STEPS OUT.", 540, 420, 80, "black", GOLD, scale=pop((lt - .5) / .4), maxw=1000)
        tx(img, "how far until you stop?", 540, 560, 56, "bold", (200, 210, 255), a=clamp((lt - 1.4) / .3))
        u = seg(lt, 0, b.dur); box(img, 900, 700, 960, 770, 10, PINK, a=clamp((lt - 1.0) / .2)); tx(img, "!", 930, 735, 56, "black", WHITE, a=clamp((lt - 1.0) / .2), shadow=False)
    def react(img, lt, p, b):
        m = RT * V * eio(seg(lt, .4, b.dur - .5)); road(img, lt, m, 100, [("reaction", 0, m, CY)], b)
        tx(img, "1.5 seconds", 540, 300, 100, "black", CY, maxw=1000); tx(img, f"{m:.0f} meters", 540, 440, 100, "black", WHITE, maxw=1000)
        tx(img, "before your foot touches the brake", 540, 560, 44, "bold", (200, 210, 255), a=clamp((lt - 1.6) / .3), maxw=1000)
    def brake(img, lt, p, b):
        m0 = RT * V; m = m0 + DRY * eio(seg(lt, .4, b.dur - .5)); road(img, lt, m, 100, [("reaction", 0, m0, CY), ("braking", m0, m, PINK)], b)
        tx(img, "then the brakes work", 540, 300, 66, "black", WHITE, maxw=1000); tx(img, f"+{(m - m0):.0f} meters", 540, 440, 110, "black", PINK, maxw=1000)
    def total(img, lt, p, b):
        m0 = RT * V; tot = m0 + DRY; road(img, lt, tot, 100, [("reaction", 0, m0, CY), ("braking", m0, tot, PINK)], b)
        tx(img, f"{tot:.0f} meters", 540, 290, 140, "black", GOLD, scale=pop(lt / .4), maxw=1000); tx(img, "20 car lengths", 540, 440, 76, "black", WHITE, a=clamp((lt - 1.0) / .3), maxw=1000); tx(img, "almost a football field", 540, 540, 52, "bold", (200, 210, 255), a=clamp((lt - 2.0) / .3), maxw=1000)
    def wet(img, lt, p, b):
        m0 = RT * V; tot = m0 + WET; m = m0 + WET * eio(seg(lt, .4, b.dur - .6)); road(img, lt, m, 140, [("reaction", 0, m0, CY), ("braking", m0, m, PINK)], b, wet=True)
        tx(img, "WET ROAD", 540, 290, 100, "black", (120, 170, 255), maxw=1000); tx(img, f"{(m0 + (m - m0)):.0f} meters", 540, 430, 120, "black", GOLD, maxw=1000)
    def quad(img, lt, p, b):
        img.paste(bg()); tx(img, "2× the speed", 540, 480, 120, "black", WHITE, scale=pop(lt / .4), maxw=1000); tx(img, "4× the braking", 540, 700, 120, "black", PINK, scale=pop((lt - .9) / .4), a=clamp((lt - .9) / .1), maxw=1000)
        tx(img, "distance grows with speed squared", 540, 900, 46, "bold", (200, 210, 255), a=clamp((lt - 2.2) / .3), maxw=1000)
    def fast(img, lt, p, b):
        tot = DRY * 4; m = tot * eio(seg(lt, .4, b.dur - .6)); road(img, lt, m, 250, [("braking only", 0, m, PINK)], b, col=(255, 140, 90))
        tx(img, "120 MPH", 540, 290, 110, "black", WHITE, maxw=1000); tx(img, f"{m:.0f} m to stop", 540, 430, 100, "black", PINK, maxw=1000)
    def end(img, lt, p, b):
        img.paste(bg()); tx(img, "leave space.", 540, 600, 130, "black", GOLD, scale=pop(lt / .4), maxw=1000); tx(img, "it's not about being polite.", 540, 780, 54, "bold", WHITE, a=clamp((lt - 1.0) / .3), maxw=1000); tx(img, "it's physics.", 540, 880, 70, "black", CY, a=clamp((lt - 1.8) / .3), scale=pop((lt - 1.8) / .4))
    N = [
     ("You're doing sixty miles an hour, and a deer steps out. How far does your car go before it stops? The answer is longer than most people think.", hook, "whip"),
     ("First, you have to notice. A normal reaction time is about one and a half seconds. At sixty miles an hour, that's forty meters, before your foot even touches the brake.", react, "flash"),
     ("Then the brakes do their work. On a dry road, that takes another fifty two meters.", brake, "zoom"),
     ("Add it up. Ninety two meters. That's twenty car lengths, almost a full football field.", total, "whip"),
     ("Now make the road wet. Braking stretches to about ninety meters, so the whole stop takes a hundred and thirty.", wet, "flash"),
     ("And speed matters more than you think. Double your speed, and braking distance does not double. It quadruples.", quad, "zoom"),
     ("At a hundred and twenty miles an hour, braking alone takes over two hundred meters.", fast, "whip"),
     ("So that gap between you and the car ahead? Leave it. Pick a sign, and when the car ahead passes it, count three seconds before you do.", end, "dip"),
    ]
    beats = [Beat(n, d, 3.0, cut=c, cues=[(0, "whoosh", .5)]) for n, d, c in N]
    return Reel("208_stopping_distance", beats, style="trap", seed=208, snap=False, grid=4, safe_zone=False, vo=[(i, n) for i, (n, d, c) in enumerate(N)], title="how far does your car go before it stops",
        caption="at 60 mph you travel 92 meters before you stop. that's a whole football field. send this to the person who tailgates", story="v = 26.8 m/s. Reaction 1.5 s -> 40 m. Dry braking v^2/(2 mu g), mu 0.7 -> 52 m (total 92 m). Wet mu 0.4 -> 91 m (total 131 m). Double speed: braking x4 (209 m at 120 mph).")

# ------------------------------------------------------------------ your life in weeks
def life_weeks():
    COLS, ROWS = 52, 80; X0, Y0, CELL = 202, 330, 13
    def paint(img, lt, layers):
        d = ImageDraw.Draw(img); cols = [(52, 56, 100)] * (COLS * ROWS)
        for start, cnt, col, t0, t1 in layers:
            k = int(cnt * eio(seg(lt, t0, t1)))
            for i in range(start, start + k): cols[i] = col
        for i in range(COLS * ROWS):
            r_, c_ = divmod(i, COLS); x = X0 + c_ * CELL; y = Y0 + r_ * 14 + (0)
            d.rectangle([x, y, x + 10, y + 11], fill=cols[i])
    def hook(img, lt, p, b):
        img.paste(bg()); paint(img, lt, [(0, 4160, (255, 214, 0), 1.2, b.dur - .3)])
        tx(img, "A LONG LIFE", 540, 180, 70, "black", WHITE, scale=pop(lt / .4), maxw=1000); tx(img, "IN WEEKS", 540, 270, 80, "black", GOLD, scale=pop((lt - .3) / .4), maxw=1000)
    def total(img, lt, p, b):
        img.paste(bg()); paint(img, lt, [(0, 4160, (255, 214, 0), .2, 2.0)]); v = 4160 * eio(seg(lt, .3, 2.0))
        box(img, 140, 1530, 940, 1700, 30, (10, 12, 34), .92, outline=GOLD, ow=4); tx(img, f"{v:,.0f}", 540, 1590, 90, "black", GOLD, maxw=800); tx(img, "weeks in 80 years", 540, 1665, 40, "bold", WHITE, maxw=800)
        tx(img, "each square = one week", 540, 150, 56, "black", WHITE, maxw=1000, a=clamp((lt - .6) / .3)); tx(img, "52 across, 80 down", 540, 240, 44, "bold", (200, 210, 255), a=clamp((lt - 1.2) / .3), maxw=1000)
    def sleep(img, lt, p, b):
        img.paste(bg()); paint(img, lt, [(0, 1387, (90, 150, 255), .3, 2.4)]); v = 1387 * eio(seg(lt, .3, 2.4))
        box(img, 140, 1530, 940, 1700, 30, (10, 12, 34), .92, outline=(90, 150, 255), ow=4); tx(img, f"{v:,.0f}", 540, 1590, 90, "black", (110, 170, 255), maxw=800); tx(img, "weeks asleep (26 years)", 540, 1665, 40, "bold", WHITE, maxw=800)
        tx(img, "a third of everything", 540, 150, 60, "black", WHITE, maxw=1000, a=clamp((lt - .4) / .3))
    def work(img, lt, p, b):
        img.paste(bg()); paint(img, lt, [(0, 1387, (90, 150, 255), 0, 0.01), (1387, 535, (255, 150, 60), .3, 2.4)]); v = 90000 * eio(seg(lt, .3, 2.4))
        box(img, 140, 1530, 940, 1700, 30, (10, 12, 34), .92, outline=(255, 150, 60), ow=4); tx(img, f"{v:,.0f}", 540, 1590, 90, "black", (255, 160, 70), maxw=800); tx(img, "hours at work (about 10 years)", 540, 1665, 38, "bold", WHITE, maxw=800)
        tx(img, "a career", 540, 150, 70, "black", WHITE, maxw=1000, a=clamp((lt - .4) / .3))
    def used(img, lt, p, b):
        img.paste(bg()); paint(img, lt, [(0, 1300, (255, 214, 0), .3, 2.2)]); v = 1300 * eio(seg(lt, .3, 2.2))
        box(img, 140, 1530, 940, 1700, 30, (10, 12, 34), .92, outline=GOLD, ow=4); tx(img, f"{v:,.0f}", 540, 1590, 90, "black", GOLD, maxw=800); tx(img, "weeks used by age 25", 540, 1665, 40, "bold", WHITE, maxw=800)
        tx(img, "if you're 25", 540, 175, 76, "black", WHITE, maxw=1000, a=clamp((lt - .3) / .3))
    def left(img, lt, p, b):
        img.paste(bg()); paint(img, lt, [(0, 1300, (255, 214, 0), 0, .01), (1300, 2860, (110, 255, 170), .3, 2.2)]); v = 2860 * eio(seg(lt, .3, 2.2))
        box(img, 140, 1530, 940, 1700, 30, (10, 12, 34), .92, outline=GRN, ow=4); tx(img, f"{v:,.0f}", 540, 1590, 90, "black", GRN, maxw=800); tx(img, "weeks left", 540, 1665, 40, "bold", WHITE, maxw=800)
        tx(img, "about", 540, 150, 56, "bold", WHITE, maxw=1000, a=clamp((lt - .3) / .3))
    def parents(img, lt, p, b):
        img.paste(bg()); paint(img, lt, [(0, 1300, (255, 214, 0), 0, .01), (1300, 2860, (60, 110, 90), 0, .01), (1300, 40, PINK, .6, 2.6)])
        v = 40 * eio(seg(lt, .6, 2.6)); box(img, 140, 1530, 940, 1700, 30, (10, 12, 34), .92, outline=PINK, ow=4); tx(img, f"{v:.0f}", 540, 1590, 90, "black", PINK, maxw=800); tx(img, "visits left with your parents", 540, 1665, 36, "bold", WHITE, maxw=800)
        tx(img, "twice a year, 20 years", 540, 150, 56, "black", WHITE, maxw=1000, a=clamp((lt - .3) / .3))
    def end(img, lt, p, b):
        img.paste(bg()); starfield(img, lt, 4); tx(img, "send this to them.", 540, 700, 90, "black", GOLD, scale=pop(lt / .4), maxw=1000); tx(img, "don't wait for the squares", 540, 880, 56, "bold", WHITE, a=clamp((lt - 1.0) / .3), maxw=1000); tx(img, "to run out.", 540, 960, 56, "bold", WHITE, a=clamp((lt - 1.6) / .3), maxw=1000)
    N = [
     ("A long life is about eighty years. That sounds like a lot, until you count it in weeks.", hook, "whip"),
     ("Eighty years is only four thousand, one hundred sixty weeks. Every square on screen is one week of your life.", total, "flash"),
     ("A third of them, about fourteen hundred weeks, you'll spend asleep. That is twenty six years in bed.", sleep, "zoom"),
     ("Work takes another ten years or so. About ninety thousand hours, at forty hours a week, for forty five years.", work, "whip"),
     ("Now the part that stings. If you're twenty five, you've already used thirteen hundred of your weeks. Most of them went to school, sleep, and things you barely remember.", used, "flash"),
     ("That leaves about twenty eight hundred. It looks like plenty. But the best squares, the ones with the people you love, are fewer than you think.", left, "zoom"),
     ("And if you see your parents twice a year, and they have twenty good years left, that's only forty visits.", parents, "whip"),
     ("So send this to them. Don't wait for the squares to run out.", end, "dip"),
    ]
    beats = [Beat(n, d, 3.0, cut=c, cues=[(0, "whoosh", .5)]) for n, d, c in N]
    return Reel("209_life_weeks", beats, style="lofi", seed=209, snap=False, grid=4, safe_zone=False, vo=[(i, n) for i, (n, d, c) in enumerate(N)], title="your whole life is 4,160 weeks",
        caption="80 years is only 4,160 weeks. if you see your parents twice a year you have about 40 visits left. send this to your mom or dad", story="80 years x 52 = 4,160 weeks. Sleep 8 h/day = one third = 1,387 weeks. 40 h x 50 wk x 45 y = 90,000 work hours = about 10.3 years. At 25 you have used 1,300 weeks; 2,860 remain. Two visits a year for 20 years = 40.")

# ------------------------------------------------------------------ how fast are you moving
def how_fast():
    def scene_bg(img, lt): img.paste(bg((6, 8, 24), (24, 16, 54))); starfield(img, lt, 5)
    def hook(img, lt, p, b):
        scene_bg(img, lt); disc(img, 540, 900, 160, (255, 214, 90), 1.0); person(img, 540, 1000, 220, (255, 130, 90))
        tx(img, "RIGHT NOW", 540, 350, 90, "black", WHITE, scale=pop(lt / .4), maxw=1000); tx(img, "YOU'RE SITTING STILL", 540, 470, 66, "black", GOLD, scale=pop((lt - .4) / .4), maxw=1000)
        tx(img, "or are you?", 540, 580, 56, "bold", (200, 210, 255), a=clamp((lt - 1.4) / .3))
    def spin(img, lt, p, b):
        scene_bg(img, lt); planet(img, 540, 760, 300, "Earth"); ang = lt * 1.2
        for k in range(8):
            a_ = ang + k * math.pi / 4; px = 540 + math.cos(a_) * 300; py = 760 + math.sin(a_) * 300 * .3
            disc(img, px, py, 7, WHITE, .8)
        ring(img, 540, 760, 315, 4, CY, .6); tx(img, "EARTH SPINS", 540, 360, 80, "black", WHITE, maxw=1000)
        v = 1037 * eio(seg(lt, .4, b.dur - .6)); tx(img, f"{v:,.0f} mph", 540, 1200, 130, "black", GOLD, maxw=1000); tx(img, "at the equator", 540, 1300, 44, "bold", (200, 210, 255), a=clamp((lt - 1.4) / .3))
    def orbit(img, lt, p, b):
        scene_bg(img, lt); glow(img, 540, 760, 160, (255, 190, 80), .7); planet(img, 540, 760, 60, "Sun"); ring(img, 540, 760, 300, 3, (90, 100, 170), .8)
        a_ = lt * .9; ex = 540 + math.cos(a_) * 300; ey = 760 + math.sin(a_) * 300; planet(img, ex, ey, 34, "Earth")
        tx(img, "AND RACES", 540, 320, 70, "black", WHITE, maxw=1000); tx(img, "AROUND THE SUN", 540, 410, 70, "black", GOLD, maxw=1000)
        v = 67000 * eio(seg(lt, .4, b.dur - .6)); tx(img, f"{v:,.0f} mph", 540, 1200, 130, "black", GOLD, maxw=1000); tx(img, "over 100× a passenger jet", 540, 1300, 44, "bold", (200, 210, 255), a=clamp((lt - 1.6) / .3), maxw=1000)
    def galaxy(img, lt, p, b):
        scene_bg(img, lt); r = np.random.RandomState(11)
        for k in range(260):
            arm = k % 3; t = r.rand(); ang = t * 5.2 + arm * 2.094 + lt * .12; rad = 40 + t * 380; x = 540 + math.cos(ang) * rad + r.randn() * 14; y = 760 + math.sin(ang) * rad * .5 + r.randn() * 10
            disc(img, x, y, 3 + r.rand() * 3, mix((255, 230, 180), (150, 190, 255), t), .75)
        glow(img, 540, 760, 70, (255, 220, 150), .8)
        a_ = lt * .6 + 1.0; sx = 540 + math.cos(a_) * 250; sy = 760 + math.sin(a_) * 125; disc(img, sx, sy, 9, (255, 255, 120)); tx(img, "us", sx, sy - 30, 32, "black", GOLD, shadow=False)
        tx(img, "THE WHOLE SOLAR SYSTEM", 540, 330, 62, "black", WHITE, maxw=1000); tx(img, "ORBITS THE GALAXY", 540, 420, 62, "black", GOLD, maxw=1000)
        v = 514000 * eio(seg(lt, .4, b.dur - .6)); tx(img, f"{v:,.0f} mph", 540, 1200, 120, "black", GOLD, maxw=1000)
    def trip(img, lt, p, b):
        scene_bg(img, lt); tx(img, "WHILE YOU WATCH THIS", 540, 330, 56, "black", WHITE, maxw=1000)
        km = 1640 * eio(seg(lt, .6, b.dur - .8)); tx(img, f"{km:,.0f} km", 540, 600, 190, "black", GOLD, maxw=1000); tx(img, "around the Sun", 540, 760, 56, "bold", (200, 210, 255))
        x0, x1 = 120, 960; line(img, [(x0, 1000), (x1, 1000)], 8, (90, 100, 170)); disc(img, x0, 1000, 14, WHITE); disc(img, x1, 1000, 14, WHITE)
        px = x0 + (x1 - x0) * km / 1640; line(img, [(x0, 1000), (px, 1000)], 12, GOLD); disc(img, px, 1000, 20, WHITE)
        tx(img, "Los Angeles", 230, 1070, 36, "black", WHITE, maxw=300, shadow=False); tx(img, "Seattle", 850, 1070, 36, "black", WHITE, maxw=300, shadow=False); tx(img, "about the same distance", 540, 1180, 44, "bold", (200, 210, 255), a=clamp((lt - 2.0) / .3), maxw=1000)
    def end(img, lt, p, b):
        scene_bg(img, lt); person(img, 540, 1050, 260, (255, 130, 90)); tx(img, "you felt nothing.", 540, 420, 100, "black", WHITE, scale=pop(lt / .4), maxw=1000)
        tx(img, "you can't feel speed.", 540, 560, 60, "black", GOLD, a=clamp((lt - .9) / .3), maxw=1000); tx(img, "only changes in speed.", 540, 650, 60, "black", CY, a=clamp((lt - 1.7) / .3), maxw=1000)
    N = [
     ("Right now, you feel like you're sitting still. You are actually moving faster than anything humans have ever built. And it happens in three layers.", hook, "whip"),
     ("First, Earth spins. At the equator, the ground under you moves at about one thousand miles an hour.", spin, "flash"),
     ("But Earth is also racing around the Sun, at sixty seven thousand miles an hour. That's over a hundred times faster than a passenger jet.", orbit, "zoom"),
     ("And the whole solar system circles the center of our galaxy, at about five hundred thousand miles an hour. Nothing in the universe is standing still.", galaxy, "whip"),
     ("So how far did you travel while watching this video? Around the Sun alone, about sixteen hundred kilometers. That's roughly the distance from Los Angeles to Seattle. Every second you sit here, you move another thirty kilometers.", trip, "flash"),
     ("And you felt nothing. Because you can't feel speed. You can only feel changes in speed.", end, "dip"),
    ]
    beats = [Beat(n, d, 3.0, cut=c, cues=[(0, "whoosh", .5)]) for n, d, c in N]
    return Reel("210_how_fast_moving", beats, style="cine", seed=210, snap=False, grid=4, safe_zone=False, vo=[(i, n) for i, (n, d, c) in enumerate(N)], title="how fast are you moving right now",
        caption="you're moving 500,000 mph right now and you can't feel it. send this to someone who says they're 'not going anywhere'", story="Earth's rotation at the equator is about 1,670 km/h (1,037 mph). Orbit around the Sun 29.8 km/s (about 67,000 mph). The Sun orbits the galaxy at about 230 km/s (about 514,000 mph). In 55 s: 29.8 x 55 = 1,640 km, about Los Angeles to Seattle in a straight line.")

REELS = dict(ping_pong_bus=ping_pong_bus, stopping_distance=stopping_distance, life_weeks=life_weeks, how_fast_moving=how_fast)
