"""Batch 32: doubling and gravity explainers: fold paper to the Moon, the penny that doubles, a hole through the Earth, the world as 100 people."""
import math
import numpy as np
from PIL import Image, ImageDraw
from scripts.common import *
from motion import *
import motion, voice
from scripts.b30 import planet
from scripts.b31 import bg, GOLD, CY, PINK, GRN

# ------------------------------------------------------------------ fold paper to the Moon
def fold_moon():
    T = 1e-4   # sheet thickness in metres
    def h(n): return T * 2 ** n
    def fmt(m):
        if m < 1: return f"{m * 100:.1f} cm"
        if m < 1000: return f"{m:,.0f} m"
        return f"{m / 1000:,.0f} km"
    def stack(img, lt, n, col=GOLD):
        base = 1180; top = base - min(560, 20 + 540 * (math.log10(max(h(n), 1e-3) / 1e-3) / 11.0)) if n > 0 else base - 8
        box(img, 360, top, 720, base, 6, col, 1.0); line(img, [(300, base), (780, base)], 6, (150, 160, 220))
        for k in range(0, 3): line(img, [(360, base - 4 - k * 4), (720, base - 4 - k * 4)], 2, mix(col, (0, 0, 0), .35), .6)
    def hook(img, lt, p, b):
        img.paste(bg()); starfield(img, lt, 4)
        tx(img, "FOLD A PAPER", 540, 330, 92, "black", WHITE, scale=pop(lt / .4), maxw=1000); tx(img, "TO THE MOON", 540, 470, 110, "black", GOLD, scale=pop((lt - .3) / .4), maxw=1000)
        tx(img, "how many folds?", 540, 610, 56, "bold", (200, 210, 255), a=clamp((lt - 1.4) / .3))
        box(img, 360, 900, 720, 1180, 8, (245, 245, 250), 1.0); line(img, [(540, 900), (540, 1180)], 3, (200, 200, 215), clamp((lt - 2.0) / .4))
        disc(img, 880, 1000, 70, (225, 225, 230), 1.0); disc(img, 860, 985, 14, (190, 190, 200), .8)
    def double(img, lt, p, b):
        img.paste(bg()); tx(img, "a sheet is 0.1 mm thick", 540, 330, 56, "black", WHITE, maxw=1000)
        tx(img, "each fold", 540, 520, 80, "black", (200, 210, 255), a=clamp((lt - .6) / .3)); tx(img, "DOUBLES", 540, 680, 150, "black", GOLD, scale=pop((lt - 1.0) / .4), a=clamp((lt - 1.0) / .1), maxw=1000)
        tx(img, "the whole stack", 540, 840, 56, "bold", (200, 210, 255), a=clamp((lt - 2.0) / .3))
    def fold7(img, lt, p, b):
        img.paste(bg()); stack(img, lt, 7)
        tx(img, "7 folds", 540, 300, 100, "black", WHITE, maxw=1000); tx(img, "1.3 cm", 540, 440, 130, "black", GOLD, scale=pop((lt - .4) / .4), maxw=1000)
        tx(img, "10 folds", 540, 700, 80, "black", WHITE, a=clamp((lt - 2.0) / .3), maxw=1000); tx(img, "10 cm", 540, 820, 100, "black", GOLD, a=clamp((lt - 2.3) / .3), maxw=1000); tx(img, "a hand, wide", 540, 920, 44, "bold", (200, 210, 255), a=clamp((lt - 2.6) / .3), maxw=1000)
    def fold17(img, lt, p, b):
        img.paste(bg()); stack(img, lt, 17)
        tx(img, "17 folds", 540, 300, 100, "black", WHITE, maxw=1000); tx(img, "13 m", 540, 440, 130, "black", GOLD, scale=pop((lt - .4) / .4), maxw=1000); tx(img, "a four story building", 540, 550, 44, "bold", (200, 210, 255), a=clamp((lt - 1.0) / .3), maxw=1000)
        tx(img, "23 folds", 540, 700, 80, "black", WHITE, a=clamp((lt - 2.2) / .3), maxw=1000); tx(img, "839 m", 540, 820, 100, "black", GOLD, a=clamp((lt - 2.5) / .3), maxw=1000); tx(img, "taller than the Burj Khalifa", 540, 920, 40, "bold", (200, 210, 255), a=clamp((lt - 2.8) / .3), maxw=1000)
    def fold30(img, lt, p, b):
        img.paste(bg()); starfield(img, lt, 3)
        tx(img, "27 folds", 540, 300, 100, "black", WHITE, maxw=1000); tx(img, "13 km", 540, 440, 130, "black", GOLD, scale=pop((lt - .4) / .4), maxw=1000); tx(img, "higher than Everest", 540, 550, 44, "bold", (200, 210, 255), a=clamp((lt - 1.0) / .3), maxw=1000)
        tx(img, "30 folds", 540, 700, 80, "black", WHITE, a=clamp((lt - 2.0) / .3), maxw=1000); tx(img, "107 km", 540, 820, 100, "black", GOLD, a=clamp((lt - 2.3) / .3), maxw=1000); tx(img, "that's space", 540, 920, 50, "black", PINK, a=clamp((lt - 2.8) / .3), maxw=1000)
    def fold42(img, lt, p, b):
        img.paste(bg((6, 8, 24), (24, 16, 54))); starfield(img, lt, 4)
        disc(img, 540, 1100, 70, (80, 130, 220), 1.0); disc(img, 540, 380, 90, (225, 225, 230), 1.0); disc(img, 515, 360, 18, (190, 190, 200), .8); disc(img, 570, 410, 12, (190, 190, 200), .8)
        u = eio(seg(lt, .4, b.dur - .5)); y = 1100 - 720 * u; line(img, [(540, 1030), (540, y)], 14, GOLD)
        tx(img, "42 folds", 540, 250, 80, "black", WHITE, maxw=1000); v = 439805 * u
        tx(img, f"{v:,.0f} km", 540, 700, 96, "black", GOLD, maxw=1000); tx(img, "the Moon is 384,400 km away", 540, 800, 40, "bold", (200, 210, 255), a=clamp((lt - 1.8) / .3), maxw=1000)
    def real(img, lt, p, b):
        img.paste(bg()); tx(img, "in real life?", 540, 340, 80, "black", WHITE, maxw=1000)
        tx(img, "12 folds", 540, 560, 150, "black", PINK, scale=pop((lt - .6) / .4), a=clamp((lt - .6) / .1), maxw=1000); tx(img, "world record", 540, 720, 56, "bold", (200, 210, 255), a=clamp((lt - 1.4) / .3))
        tx(img, "Britney Gallivan, 2002", 540, 860, 50, "black", GOLD, a=clamp((lt - 2.2) / .3), maxw=1000); tx(img, "1.2 km of toilet paper", 540, 950, 44, "bold", WHITE, a=clamp((lt - 3.0) / .3), maxw=1000)
    N = [
     ("Take one sheet of paper. Fold it in half, and keep folding. How many folds until the stack reaches the Moon?", hook, "whip"),
     ("A sheet is only a tenth of a millimeter thick. But every fold doubles the whole stack.", double, "flash"),
     ("After seven folds, it's about a centimeter. After ten, it's as thick as your hand is wide.", fold7, "zoom"),
     ("Seventeen folds is thirteen meters, a four story building. Twenty three folds, and you're taller than the Burj Khalifa.", fold17, "whip"),
     ("At twenty seven folds, you're higher than Mount Everest. At thirty, you're a hundred and seven kilometers up. That's space.", fold30, "flash"),
     ("And at forty two folds, the stack is four hundred thirty nine thousand kilometers tall. The Moon is only three hundred eighty four thousand away.", fold42, "zoom"),
     ("In real life, though, you can't. The world record is twelve folds, by a high school student named Britney Gallivan, in two thousand two. She needed over a kilometer of toilet paper.", real, "dip"),
    ]
    beats = [Beat(n, d, 3.0, cut=c, cues=[(0, "whoosh", .5)]) for n, d, c in N]
    return Reel("211_fold_to_moon", beats, style="synth", seed=211, snap=False, grid=4, safe_zone=False, vo=[(i, n) for i, (n, d, c) in enumerate(N)], title="fold a paper 42 times and reach the Moon",
        caption="fold a sheet of paper 42 times and it reaches the Moon. the real world record is 12. send this to someone who says 'it's just paper'", story="Sheet 0.1 mm; thickness after n folds = 0.1 mm x 2^n: 7 -> 1.28 cm; 10 -> 10.2 cm; 17 -> 13.1 m; 23 -> 839 m; 27 -> 13.4 km; 30 -> 107 km; 42 -> 439,805 km (Moon 384,400 km). Britney Gallivan folded paper 12 times (2002) using about 1.2 km of toilet paper.")

# ------------------------------------------------------------------ the penny that doubles
def penny():
    def amt(d): return .01 * 2 ** (d - 1)
    def money(v): return f"${v:,.2f}" if v < 1000 else f"${v:,.0f}"
    def bars(img, lt, upto, hi=None, base=1180, top=420):
        mx = amt(30); d = ImageDraw.Draw(img)
        for k in range(1, int(upto) + 1):
            x = 90 + (k - 1) * 31; hh = max(3, (base - top) * amt(k) / mx); col = GOLD if k != hi else PINK
            d.rectangle([x, base - hh, x + 25, base], fill=col)
        d.line([(80, base), (1010, base)], fill=(150, 160, 220), width=4)
    def hook(img, lt, p, b):
        img.paste(bg()); starfield(img, lt, 4)
        box(img, 80, 540, 500, 900, 40, (20, 70, 40), 1.0, outline=GRN, ow=5); tx(img, "$1,000,000", 290, 720, 62, "black", GRN, maxw=380)
        disc(img, 790, 720, 110, (205, 130, 70), 1.0, outline=(150, 90, 40), ow=6); tx(img, "1¢", 790, 720, 90, "black", WHITE)
        tx(img, "TAKE THE MILLION", 540, 300, 76, "black", WHITE, scale=pop(lt / .4), maxw=1000); tx(img, "OR A DOUBLING PENNY?", 540, 410, 64, "black", GOLD, scale=pop((lt - .4) / .4), maxw=1000)
        tx(img, "for 30 days", 540, 1040, 56, "bold", (200, 210, 255), a=clamp((lt - 1.6) / .3))
    def early(img, lt, p, b):
        img.paste(bg()); n = 1 + int(9 * eio(seg(lt, .3, b.dur - .5))); bars(img, lt, n)
        tx(img, f"day {n}", 540, 300, 80, "black", WHITE, maxw=1000); tx(img, money(amt(n)), 540, 450, 130, "black", GOLD, maxw=1000)
        tx(img, "this looks terrible", 540, 590, 50, "bold", PINK, a=clamp((lt - 2.0) / .3))
    def mid(img, lt, p, b):
        img.paste(bg()); n = 10 + int(15 * eio(seg(lt, .3, b.dur - .5))); bars(img, lt, n)
        tx(img, f"day {n}", 540, 300, 80, "black", WHITE, maxw=1000); tx(img, money(amt(n)), 540, 450, 130, "black", GOLD, maxw=1000)
    def late(img, lt, p, b):
        img.paste(bg()); n = 25 + int(5 * eio(seg(lt, .3, b.dur - .8))); bars(img, lt, n, hi=n)
        tx(img, f"day {n}", 540, 300, 80, "black", WHITE, maxw=1000); tx(img, money(amt(n)), 540, 450, 130, "black", GOLD if n < 28 else GRN, maxw=1000)
    def total(img, lt, p, b):
        img.paste(bg()); bars(img, lt, 30, hi=30)
        tx(img, "ALL 30 DAYS", 540, 290, 66, "black", WHITE, maxw=1000); v = 10737418.23 * eio(seg(lt, .4, 2.4)); tx(img, f"${v:,.0f}", 540, 440, 140, "black", GRN, maxw=1000)
    def vs(img, lt, p, b):
        img.paste(bg()); tx(img, "the penny wins", 540, 330, 80, "black", WHITE, maxw=1000)
        w1 = 800 * .093; box(img, 140, 520, 140 + 800 * .093, 620, 20, GRN, 1.0); box(img, 140, 700, 140 + 800 * eio(seg(lt, .4, 2.4)), 800, 20, GOLD, 1.0)
        tx(img, "$1 million", 140 + w1 + 150, 570, 40, "black", GRN, maxw=300, shadow=False); tx(img, "$10.7 million", 540, 850, 52, "black", GOLD, maxw=900, a=clamp((lt - 2.4) / .3))
        tx(img, "by about 10×", 540, 960, 60, "black", PINK, a=clamp((lt - 3.0) / .3), maxw=1000)
    def end(img, lt, p, b):
        img.paste(bg()); tx(img, "doubling feels slow", 540, 520, 72, "black", WHITE, maxw=1000, a=clamp(lt / .3)); tx(img, "until it doesn't", 540, 650, 100, "black", GOLD, scale=pop((lt - 1.0) / .4), a=clamp((lt - 1.0) / .1), maxw=1000)
        tx(img, "that's why starting early wins", 540, 820, 48, "bold", (200, 210, 255), a=clamp((lt - 2.2) / .3), maxw=1000)
    N = [
     ("Would you take a million dollars right now, or one penny that doubles every day for a month? Most people take the million. They're wrong.", hook, "whip"),
     ("Day one, one cent. Day two, two cents. By day ten, you have five dollars and twelve cents. That looks terrible. Most people would have quit by now.", early, "flash"),
     ("Day twenty, five thousand dollars. Day twenty five, over a hundred and sixty seven thousand.", mid, "zoom"),
     ("Day twenty eight, one million. Day thirty, five point four million dollars, in a single day. That means half of everything you earn comes on the very last day.", late, "whip"),
     ("Add up all thirty days, and the penny has made ten point seven million dollars.", total, "flash"),
     ("That's more than ten times the million you turned down.", vs, "zoom"),
     ("Doubling feels slow, right up until it doesn't. It's the same reason starting to save early beats starting late. Warren Buffett made over ninety nine percent of his wealth after his fiftieth birthday.", end, "dip"),
    ]
    beats = [Beat(n, d, 3.0, cut=c, cues=[(0, "whoosh", .5)]) for n, d, c in N]
    return Reel("212_penny_doubling", beats, style="funk", seed=212, snap=False, grid=4, safe_zone=False, vo=[(i, n) for i, (n, d, c) in enumerate(N)], title="a million dollars or a penny that doubles for 30 days",
        caption="a penny that doubles every day is worth $10.7 million after 30 days. would you have taken the million? send this to someone who says 'a penny is nothing'", story="Day n amount = $0.01 x 2^(n-1): day 10 $5.12; day 20 $5,243; day 25 $167,772; day 28 $1,342,177; day 30 $5,368,709; total of 30 days = $10,737,418.23.")

# ------------------------------------------------------------------ a hole through the Earth
def earth_hole():
    T = 42.2 * 60; R = 6371.0
    def cross(img, lt, tfrac, show_speed=True, chord=False):
        img.paste(bg((6, 8, 24), (24, 16, 54))); starfield(img, lt, 3)
        cx, cy, r = 540, 800, 380
        disc(img, cx, cy, r, (60, 90, 170), 1.0, outline=(120, 170, 255), ow=6); disc(img, cx, cy, r * .55, (200, 140, 70), 1.0); disc(img, cx, cy, r * .2, (255, 190, 90), 1.0)
        if chord: line(img, [(cx - 312, cy - 217), (cx + 312, cy - 217)], 10, (20, 20, 40))
        else: line(img, [(cx, cy - r), (cx, cy + r)], 12, (20, 20, 40))
        pos = math.cos(math.pi * tfrac)
        if chord: bx = cx + pos * 312; by = cy - 217
        else: bx = cx; by = cy - pos * (r - 20)
        glow(img, bx, by, 50, GOLD, .6); disc(img, bx, by, 22, GOLD, 1.0, outline=WHITE, ow=3)
        return pos
    def hook(img, lt, p, b):
        cross(img, lt, 0, False)
        tx(img, "DIG A HOLE", 540, 230, 76, "black", WHITE, scale=pop(lt / .4), maxw=1000); tx(img, "THROUGH THE EARTH", 540, 320, 64, "black", GOLD, scale=pop((lt - .3) / .4), maxw=1000)
        tx(img, "and jump in", 540, 1260, 56, "bold", (200, 210, 255), a=clamp((lt - 1.4) / .3))
    def fall(img, lt, p, b):
        u = seg(lt, .3, b.dur); pos = cross(img, lt, .5 * eio(u) * .9); tx(img, "you speed up", 540, 230, 76, "black", WHITE, maxw=1000)
        tx(img, f"{(1 - pos ** 2) ** .5 * 7.9:.1f} km/s", 540, 1220, 90, "black", GOLD, maxw=1000)
    def center(img, lt, p, b):
        pos = cross(img, lt, .5); tx(img, "THE CENTER", 540, 230, 76, "black", WHITE, maxw=1000); tx(img, "no pull at all", 540, 320, 56, "bold", CY, a=clamp((lt - .4) / .3))
        tx(img, "7.9 km/s", 540, 1220, 100, "black", GOLD, maxw=1000); tx(img, "20× the speed of sound", 540, 1310, 44, "bold", (200, 210, 255), a=clamp((lt - 1.2) / .3), maxw=1000)
    def up(img, lt, p, b):
        u = seg(lt, .3, b.dur); pos = cross(img, lt, .5 + .5 * eio(u)); tx(img, "slowing down", 540, 230, 76, "black", WHITE, maxw=1000); tx(img, f"{(1 - pos ** 2) ** .5 * 7.9:.1f} km/s", 540, 1220, 90, "black", GOLD, maxw=1000)
        tx(img, "then you stop at the other side", 540, 320, 44, "bold", (200, 210, 255), a=clamp((lt - 1.4) / .3), maxw=1000)
    def total(img, lt, p, b):
        u = eio(seg(lt, .3, b.dur - .6)); cross(img, lt, u); tx(img, "ONE WAY", 540, 230, 66, "black", WHITE, maxw=1000)
        tx(img, f"{42 * u:.0f} min", 540, 1220, 120, "black", GOLD, maxw=1000)
    def chord(img, lt, p, b):
        u = eio(seg(lt, .3, b.dur - .6)); cross(img, lt, u, chord=True); tx(img, "any straight tunnel", 540, 230, 66, "black", WHITE, maxw=1000)
        tx(img, f"{42 * u:.0f} min", 540, 1220, 120, "black", GOLD, maxw=1000); tx(img, "New York to London: 42 min", 540, 1320, 44, "bold", (200, 210, 255), a=clamp((lt - 1.6) / .3), maxw=1000)
    def end(img, lt, p, b):
        img.paste(bg((6, 8, 24), (24, 16, 54))); starfield(img, lt, 4); planet(img, 540, 760, 260, "Earth"); a = lt * 1.0
        ring(img, 540, 760, 292, 4, GOLD, .8)
        sx = 540 + math.cos(a) * 292; sy = 760 + math.sin(a) * 292; disc(img, sx, sy, 16, WHITE)
        tx(img, "same as half an orbit", 540, 300, 60, "black", WHITE, maxw=1000); tx(img, "42 minutes. everywhere.", 540, 1220, 66, "black", GOLD, maxw=1000)
    N = [
     ("What if you dug a hole straight through the Earth, and jumped in? How long until you come out the other side? Spoiler: it's shorter than most people's commute.", hook, "whip"),
     ("At first, you fall like jumping off a cliff. Gravity pulls you faster and faster, with nothing in the way.", fall, "flash"),
     ("Deeper down, less of the planet is below you, so the pull fades. At the very center, there is no pull at all. But you're moving at your top speed, about eight kilometers every second.", center, "zoom"),
     ("Then the other side starts pulling you back. You slow down, all the way up, and stop right at the surface.", up, "whip"),
     ("The whole trip takes about forty two minutes. In the real Earth, a little less, closer to thirty eight.", total, "flash"),
     ("And here's the strange part. It doesn't matter where you dig. Even a short tunnel, from New York to London, takes the same forty two minutes.", chord, "zoom"),
     ("It's exactly half the time a satellite takes to circle the Earth. Forty two minutes, anywhere on the planet.", end, "dip"),
    ]
    beats = [Beat(n, d, 3.0, cut=c, cues=[(0, "whoosh", .5)]) for n, d, c in N]
    return Reel("213_hole_through_earth", beats, style="cine", seed=213, snap=False, grid=4, safe_zone=False, vo=[(i, n) for i, (n, d, c) in enumerate(N)], title="jump into a hole through the Earth",
        caption="jump into a hole through the Earth and you come out the other side in 42 minutes. any tunnel, anywhere, same time. send this to someone who asks 'what if' at 2am", story="Uniform-density Earth, no air: simple harmonic motion with period 84.4 min (equal to a low orbit); one pass = 42.2 min for any straight tunnel; top speed at the center about 7.9 km/s. Real Earth density is higher in the core: about 38 min.")

# ------------------------------------------------------------------ the world as 100 people
def world_100():
    REG = [("Asia", 59, (255, 150, 70)), ("Africa", 18, (110, 220, 130)), ("Americas", 13, (90, 170, 255)), ("Europe", 9, (190, 140, 255)), ("Oceania", 1, (255, 110, 150))]
    COL = []
    for nm, n, c in REG: COL += [c] * n
    def dots(img, lt, colors, t0=.3, per=.03, r=34, x0=140, y0=520, gap=80, dim=(70, 76, 120)):
        for i in range(100):
            rr, cc = divmod(i, 10); x = x0 + cc * gap + 6; y = y0 + rr * gap
            on = clamp((lt - t0 - i * per) / .2); col = colors[i] if colors[i] else dim
            disc(img, x + 30, y, r * (.5 + .5 * on) * .72, mix(dim, col, on) if colors[i] else dim)
    def hook(img, lt, p, b):
        img.paste(bg()); starfield(img, lt, 3); dots(img, lt, [(255, 214, 0)] * 100, .8, .02)
        tx(img, "THE WORLD AS", 540, 260, 70, "black", WHITE, scale=pop(lt / .4), maxw=1000); tx(img, "100 PEOPLE", 540, 380, 96, "black", GOLD, scale=pop((lt - .3) / .4), maxw=1000)
    def regions(img, lt, p, b):
        img.paste(bg()); dots(img, lt, COL, .2, .015); 
        tx(img, "Asia 59   Africa 18", 540, 200, 56, "black", WHITE, maxw=1000, a=clamp((lt - .4) / .3)); tx(img, "Americas 13   Europe 9   Oceania 1", 540, 280, 44, "black", WHITE, maxw=1000, a=clamp((lt - 1.2) / .3))
    def chindia(img, lt, p, b):
        img.paste(bg()); cols = [(255, 150, 70) if i < 35 else None for i in range(100)]; dots(img, lt, cols, 0, 0.0)
        tx(img, "35 live in", 540, 230, 66, "black", WHITE, maxw=1000); tx(img, "INDIA OR CHINA", 540, 340, 76, "black", GOLD, scale=pop((lt - .4) / .4), a=clamp((lt - .4) / .1), maxw=1000)
    def usa(img, lt, p, b):
        img.paste(bg()); cols = [(90, 170, 255) if i < 4 else None for i in range(100)]; dots(img, lt, cols, 0, 0.0)
        tx(img, "only 4 are", 540, 230, 66, "black", WHITE, maxw=1000); tx(img, "AMERICAN", 540, 340, 90, "black", CY, scale=pop((lt - .4) / .4), a=clamp((lt - .4) / .1), maxw=1000)
    def online(img, lt, p, b):
        img.paste(bg()); n = int(68 * eio(seg(lt, .3, 2.2))); cols = [(120, 255, 160) if i < n else None for i in range(100)]; dots(img, lt, cols, 0, 0.0)
        tx(img, "68 are online", 540, 230, 76, "black", GRN, maxw=1000); tx(img, "32 never have been", 540, 340, 54, "black", (200, 210, 255), a=clamp((lt - 2.0) / .3), maxw=1000)
    def young(img, lt, p, b):
        img.paste(bg()); n = int(50 * eio(seg(lt, .3, 2.0))); cols = [(255, 110, 150) if i < n else None for i in range(100)]; dots(img, lt, cols, 0, 0.0)
        tx(img, "half are", 540, 230, 66, "black", WHITE, maxw=1000); tx(img, "UNDER 30", 540, 340, 96, "black", PINK, scale=pop((lt - .4) / .4), a=clamp((lt - .4) / .1), maxw=1000)
    def city(img, lt, p, b):
        img.paste(bg()); n = int(57 * eio(seg(lt, .3, 2.0))); cols = [(255, 214, 90) if i < n else (120, 150, 255) for i in range(100)]; dots(img, lt, cols, 0, 0.0)
        tx(img, "57 in cities", 540, 230, 70, "black", (255, 214, 90), maxw=1000); tx(img, "43 in towns and villages", 540, 330, 46, "black", (150, 175, 255), a=clamp((lt - 2.0) / .3), maxw=1000)
    def hungry(img, lt, p, b):
        img.paste(bg()); cols = [(255, 90, 90) if i < 9 else None for i in range(100)]; dots(img, lt, cols, 0, 0.0)
        tx(img, "about 9", 540, 230, 76, "black", (255, 110, 110), maxw=1000); tx(img, "didn't have enough food", 540, 340, 46, "black", (200, 210, 255), a=clamp((lt - .6) / .3), maxw=1000)
    def end(img, lt, p, b):
        img.paste(bg()); cols = [(255, 214, 0) if i == 57 else None for i in range(100)]; dots(img, lt, cols, 0, 0.0)
        x, y = 140 + 7 * 80 + 36, 520 + 5 * 80; ring(img, x, y, 24 + 14 * math.sin(lt * 6) ** 2, 4, GOLD, .9)
        tx(img, "one of them", 540, 230, 66, "black", WHITE, maxw=1000); tx(img, "is you", 540, 340, 110, "black", GOLD, scale=pop((lt - .4) / .4), a=clamp((lt - .4) / .1), maxw=1000)
    N = [
     ("If the whole world were just one hundred people, who would they be?", hook, "whip"),
     ("Fifty nine would live in Asia. Eighteen in Africa. Thirteen in the Americas. Nine in Europe. And only one in Oceania. Asia alone has more people than the rest of the world combined.", regions, "flash"),
     ("Thirty five of them would be from just two countries, India and China.", chindia, "zoom"),
     ("And only four would be from the United States. The rest of the world is very far from what we see on our feeds.", usa, "whip"),
     ("Sixty eight would be online. The other thirty two have never used the internet. That's about two and a half billion people.", online, "flash"),
     ("About half would be under thirty years old.", young, "zoom"),
     ("Fifty seven would live in cities, and the other forty three in towns and villages.", city, "whip"),
     ("And about nine would not have enough to eat today.", hungry, "flash"),
     ("And one of those hundred is you, watching this. So next time the world feels huge, remember. It's a hundred people, and you're one of them.", end, "dip"),
    ]
    beats = [Beat(n, d, 3.0, cut=c, cues=[(0, "whoosh", .5)]) for n, d, c in N]
    return Reel("214_world_100_people", beats, style="lofi", seed=214, snap=False, grid=4, safe_zone=False, vo=[(i, n) for i, (n, d, c) in enumerate(N)], title="the world as 100 people",
        caption="if the world were 100 people, 35 would be from India or China and only 4 from the US. send this to someone who thinks the world is small", story="World population about 8.2 billion: Asia 59%, Africa 18%, Americas 13%, Europe 9%, Oceania 0.5%. India + China about 35%. USA about 4%. About 68% use the internet (ITU 2024). Median age about 30.")

REELS = dict(fold_to_moon=fold_moon, penny_doubling=penny, hole_through_earth=earth_hole, world_100_people=world_100)
