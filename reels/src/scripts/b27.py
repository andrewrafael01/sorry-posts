"""Batch 27: money and athletes (narrated motion graphics with real photos)."""
import math, os, json
from PIL import Image, ImageDraw
from scripts.common import *
from motion import *
import motion, voice
from scripts.b24 import photo, PH
from scripts.b25 import wimg, credit_of

def split_cards(img, lt, b, left, right, lab_l, lab_r, big_l, big_r):
    for (name, x, lab, big, col) in ((left, 270, lab_l, big_l, (90, 170, 255)), (right, 810, lab_r, big_r, (255, 110, 130))):
        crop, m = photo(name, 430, 560, lt, b.dur, 1.0, 1.15, rad=40); a = clamp((lt - .1) / .3)
        m = m.point(lambda v: int(v * a)); img.paste(crop, (x - 215, 400), m); box(img, x - 219, 396, x + 219, 964, 44, None, a, outline=col, ow=5)
        tx(img, lab, x, 1030, 44, "black", col, a=a, maxw=430); tx(img, big, x, 1110, 62, "black", WHITE, a=clamp((lt - .6) / .3), maxw=430)

def ronaldo_vs_elon():
    R = wimg("Cristiano Ronaldo", 0); E = wimg("Elon Musk", 0)
    def hook(img, lt, p, b):
        img.paste(vgrad((12, 10, 30), (30, 14, 60), key="rve")); starfield(img, lt, 8)
        split_cards(img, lt, b, R, E, "RONALDO", "MUSK", "$300M / year", "$839B")
        glow(img, 540, 690, 150, (255, 214, 0), .5); tx(img, "VS", 540, 690, 130, "black", (255, 214, 0), scale=pop((lt - .3) / .4), a=clamp((lt - .3) / .1))
        tx(img, "how long to earn his entire fortune?", 540, 290, 50, "black", WHITE, a=clamp((lt - .6) / .3), maxw=900)
    def ronaldo(img, lt, p, b):
        img.paste(vgrad((10, 14, 40), (26, 20, 70), key="ron")); crop, m = photo(R, 960, 900, lt, b.dur, 1.0, 1.2, rad=44); img.paste(crop, (60, 220), m)
        v = 300_000_000 * eio(seg(lt, .2, 1.6)); box(img, 130, 1040, 950, 1260, 36, (10, 12, 30), .88, outline=(255, 214, 0), ow=4)
        tx(img, f"${v:,.0f}", 540, 1120, 90, "black", (255, 214, 0)); tx(img, "per year (Forbes, 2026)", 540, 1210, 42, "bold", WHITE)
    def persec(img, lt, p, b):
        img.paste(vgrad((8, 30, 24), (4, 14, 12), key="persec")); s = lt * 1.0; v = 9.51 * s
        tx(img, f"${v:,.2f}", 540, 430, 180, "black", (120, 255, 160)); tx(img, "earned so far", 540, 560, 44, "bold", WHITE)
        for k in range(12):
            u = ((lt * 1.0 + k * .41) % 1.0); side = -1 if k % 2 else 1; x = 540 + side * (330 + (k * 37) % 130); y = 640 + u * 560
            disc(img, x, y, 28, (255, 214, 0), 1 - u, outline=(200, 150, 0), ow=3); tx(img, "$", x, y, 32, "black", (150, 100, 0), a=1 - u, shadow=False)
        cx, cy, r = 540, 920, 190; glow(img, cx, cy, r * 1.4, (120, 255, 160), .25); ring(img, cx, cy, r, 10, (80, 120, 100), 1.0); ang = lt * 2 * math.pi - math.pi / 2
        for k in range(12): a2 = k * math.pi / 6; line(img, [(cx + math.cos(a2) * (r - 26), cy + math.sin(a2) * (r - 26)), (cx + math.cos(a2) * (r - 8), cy + math.sin(a2) * (r - 8))], 5, (200, 230, 210))
        line(img, [(cx, cy), (cx + math.cos(ang) * (r - 30), cy + math.sin(ang) * (r - 30))], 9, (255, 214, 0)); disc(img, cx, cy, 14, (255, 214, 0))
        tx(img, "$9.51 every second", 540, 1210, 58, "black", WHITE)
    def perday(img, lt, p, b):
        img.paste(vgrad((8, 30, 24), (4, 14, 12), key="perday")); d_ = 821918 * eio(seg(lt, .3, b.dur - .8)); tx(img, f"${d_:,.0f}", 540, 560, 150, "black", (120, 255, 160)); tx(img, "every single day", 540, 720, 60, "bold", WHITE, a=clamp((lt - .8) / .3))
        for k in range(30):
            on = k < int(30 * eio(seg(lt, .3, b.dur - .8))); box(img, 90 + (k % 10) * 90, 900 + (k // 10) * 100, 90 + (k % 10) * 90 + 74, 900 + (k // 10) * 100 + 80, 12, (120, 255, 160) if on else (30, 60, 50), 1.0)
        tx(img, "weekends too", 540, 1230, 48, "bold", (200, 230, 215), a=clamp((lt - 1.8) / .3))
    def elon(img, lt, p, b):
        img.paste(vgrad((14, 10, 30), (6, 8, 22), key="elon2")); starfield(img, lt, 8); crop, m = photo(E, 960, 900, lt, b.dur, 1.0, 1.2, rad=44); img.paste(crop, (60, 220), m)
        v = 839_000_000_000 * eio(seg(lt, .2, 2.2)); box(img, 100, 1040, 980, 1260, 36, (10, 12, 30), .88, outline=(255, 110, 130), ow=4)
        tx(img, f"${v:,.0f}", 540, 1120, 74, "black", (255, 110, 130), maxw=900); tx(img, "net worth (Forbes, 2026)", 540, 1210, 42, "bold", WHITE)
    def divide(img, lt, p, b):
        img.paste(vgrad((14, 14, 40), (30, 20, 70), key="div")); a = clamp(lt / .4)
        tx(img, "$839,000,000,000", 540, 560, 84, "black", (255, 110, 130), a=a, maxw=1000); line(img, [(160, 680), (920, 680)], 8, WHITE, a)
        tx(img, "$300,000,000", 540, 800, 84, "black", (255, 214, 0), a=clamp((lt - .6) / .4), maxw=1000); tx(img, "per year", 540, 890, 50, "bold", WHITE, a=clamp((lt - .6) / .4))
        tx(img, "=", 540, 980, 90, "black", WHITE, a=clamp((lt - 1.6) / .3)); tx(img, "?", 540, 1180, 180, "black", (255, 214, 0), a=clamp((lt - 2.0) / .3), scale=pop((lt - 2.0) / .5))
    def years(img, lt, p, b):
        img.paste(vgrad((10, 10, 30), (40, 14, 70), key="yrs")); v = 2797 * eio(seg(lt, .2, 1.6)); tx(img, f"{v:,.0f}", 540, 640, 270, "black", (255, 214, 0), scale=1 + .02 * math.sin(lt * 6))
        tx(img, "YEARS", 540, 900, 130, "black", WHITE, a=clamp((lt - 1.4) / .2), scale=pop((lt - 1.4) / .4)); glow(img, 540, 760, 420, (255, 140, 60), .25 + .1 * math.sin(lt * 5))
    EV = [(2026, "today"), (1969, "Moon landing"), (1776, "USA founded"), (1492, "Columbus"), (476, "Rome falls"), (0, "year 1"), (-490, "Marathon"), (-753, "Rome founded"), (-776, "first Olympics")]
    def timeline(img, lt, p, b, y0=-770):
        img.paste(vgrad((14, 12, 40), (50, 24, 70), key="tl")); starfield(img, lt, 10)
        yr = 2026 + (y0 - 2026) * eio(seg(lt, .3, b.dur - .5)); ppy = .62; base = 900; d = ImageDraw.Draw(img)
        d.line([(0, base), (CW, base)], fill=(200, 210, 255), width=4)
        for k in range(-1000, 2100, 50):
            x = 540 + (k - yr) * ppy
            if -50 < x < CW + 50:
                big = k % 500 == 0; d.line([(x, base - (30 if big else 12)), (x, base + (30 if big else 12))], fill=(200, 210, 255), width=3 if big else 2)
                if big and abs(x - 540) > 120 and 90 < x < 990: tx(img, (f"{abs(k)} BC" if k < 0 else (f"{k}" if k else "0")), x, base + 70, 30, "bold", (200, 210, 255), shadow=False)
        shown = 0
        for y_, lab in sorted(EV, key=lambda e: abs((540 + (e[0] - yr) * ppy) - 540)):
            x = 540 + (y_ - yr) * ppy
            if abs(x - 540) < 340 and shown < 2:
                disc(img, x, base, 13, (255, 214, 0)); tx(img, lab, x, base - 100 - 70 * shown, 36, "black", WHITE, maxw=340); line(img, [(x, base - 20), (x, base - 70 - 70 * shown + 30)], 3, (255, 214, 0), .6); shown += 1
            elif -100 < x < CW + 100: disc(img, x, base, 8, (120, 130, 180))
        line(img, [(540, base + 20), (540, base + 120)], 6, (255, 110, 130)); disc(img, 540, base + 130, 14, (255, 110, 130))
        yrs = int(round(yr)); label = f"{abs(yrs)} BC" if yrs < 0 else f"{yrs}"
        tx(img, label, 540, 470, 190, "black", (255, 255, 255), maxw=1000); tx(img, "Ronaldo starts playing", 540, 600, 50, "bold", (255, 110, 130), a=clamp((lt - 1.2) / .3))
    def olympics(img, lt, p, b):
        img.paste(vgrad((18, 12, 44), (60, 26, 80), key="olym")); starfield(img, lt, 10)
        cols = [(0, 133, 199), (244, 195, 0), (0, 0, 0), (0, 159, 61), (223, 0, 36)]
        pos = [(300, 620), (540, 620), (780, 620), (420, 740), (660, 740)]
        for (c, (x, y)), k in zip(zip(cols, pos), range(5)):
            u = pop((lt - k * .15) / .4); ring(img, x, y, 100 * u, 14, c if c != (0, 0, 0) else (240, 240, 240), 1.0)
        tx(img, "776 BC", 540, 960, 120, "black", (255, 214, 0), a=clamp((lt - .8) / .3)); tx(img, "first ancient Olympics", 540, 1070, 52, "bold", WHITE, a=clamp((lt - 1.1) / .3)); tx(img, "770 BC: six years later", 540, 1170, 56, "black", (255, 110, 130), a=clamp((lt - 2.2) / .3))
    def nospend(img, lt, p, b):
        img.paste(vgrad((14, 14, 34), (36, 20, 60), key="nsp")); items = [("no cars", 420), ("no houses", 560), ("no lunch", 700), ("no taxes", 840)]
        for i, (s, y) in enumerate(items):
            u = clamp((lt - .4 - i * .7) / .3); tx(img, s, 540, y, 96, "black", WHITE, a=u, scale=pop((lt - .4 - i * .7) / .4)); 
            if u > .5: line(img, [(250, y), (830, y)], 10, (255, 90, 90), clamp((lt - .6 - i * .7) / .3))
        tx(img, "not one cent", 540, 1090, 110, "black", (255, 214, 0), a=clamp((lt - 3.4) / .3))
    def finale(img, lt, p, b):
        img.paste(vgrad((10, 10, 30), (40, 14, 70), key="fin")); crop, m = photo(E, 960, 760, lt, b.dur, 1.0, 1.2, rad=44); img.paste(crop, (60, 240), m)
        v = 839 + 8.4 * (lt / b.dur) * 4; tx(img, "and Elon's fortune", 540, 1080, 56, "bold", WHITE); tx(img, "keeps growing", 540, 1180, 90, "black", (120, 255, 160), scale=pop((lt - .4) / .4))
    N = [
     ("How long would Cristiano Ronaldo have to play, to earn Elon Musk's entire fortune?", hook, "whip"),
     ("Ronaldo is the highest paid athlete on the planet. About three hundred million dollars a year.", ronaldo, "flash"),
     ("That's nine dollars and fifty one cents, every single second.", persec, "zoom"),
     ("That works out to roughly eight hundred twenty two thousand dollars a day. Weekends included.", perday, "flash"),
     ("Elon Musk is worth about eight hundred thirty nine billion dollars.", elon, "whip"),
     ("So we just divide. Eight hundred thirty nine billion, by three hundred million a year.", divide, "flash"),
     ("Twenty seven hundred, and ninety seven years.", years, "zoom"),
     ("To get there, Ronaldo would have needed to start playing in seven hundred seventy B.C.", timeline, "whip"),
     ("That's six years after the first ancient Olympic Games. And before Rome was even founded.", olympics, "flash"),
     ("And he couldn't spend a single cent.", nospend, "zoom"),
     ("Meanwhile, Elon's fortune would keep on growing.", finale, "dip"),
    ]
    beats = [Beat(n, d, 3.0, cut=c, cues=[(0, "whoosh", .5)]) for n, d, c in N]; beats[6].cues += [(1.5, "hit", .9)]; beats[6].min_dur = 3.3; beats[7].min_dur = 6.0
    return Reel("200_ronaldo_vs_elon", beats, style="trap", seed=200, snap=False, grid=4, safe_zone=False, vo=[(i, n) for i, (n, d, c) in enumerate(N)], title="how long for Ronaldo to earn Musk's fortune",
        caption="Ronaldo would need 2,797 years to earn what Elon Musk is worth. tag someone who says money isn't everything. photos: " + credit_of(R) + "; " + credit_of(E), story="Forbes 2026: Ronaldo $300M/yr; Musk ~$839B. $839e9 / $300e6 = 2,797 years; 2026 - 2,797 = 771 BC; first ancient Olympics 776 BC; Rome founded 753 BC (traditional). $300M / 31.536M s = $9.51 per second.")

REELS = dict(ronaldo_vs_elon=ronaldo_vs_elon)
