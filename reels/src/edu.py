"""Template toolkit for the education reels: a reel is a list of narrated beats, each beat picks a visual template (counter, bars, versus, steps, dots, timeline, race, kinetic text).
Every template keeps its content in the zone y 190-1330 (above the caption strip) so nothing overlaps.
    R(num, name, title, caption, story, style, [N(narration, T.num(...)), ...])"""
import math
import numpy as np
from PIL import Image, ImageDraw
from scripts.common import *
from motion import *
import motion, voice

GOLD = (255, 214, 0); CY = (140, 220, 255); PINK = (255, 110, 150); GRN = (120, 255, 160); ORG = (255, 160, 80); VIO = (190, 150, 255); MUT = (200, 210, 255)
PAL = [GOLD, CY, PINK, GRN, ORG, VIO, (255, 120, 120), (120, 190, 255)]
CUTS = ["whip", "flash", "zoom", "whip", "flash", "zoom"]

def bg(c1=(14, 12, 40), c2=(40, 24, 80)): return vgrad(c1, c2, key=str((c1, c2)))
THEMES = {"space": ((6, 8, 24), (24, 16, 54)), "deep": ((14, 12, 40), (40, 24, 80)), "teal": ((8, 24, 34), (14, 60, 74)), "warm": ((38, 16, 24), (80, 36, 40)), "green": ((10, 26, 22), (22, 62, 44)), "ink": ((16, 16, 28), (36, 34, 60)), "blue": ((10, 18, 48), (24, 56, 110))}

def txa(img, s, x, y, size, weight, color, anchor="l", a=1.0, maxw=900):
    """Text anchored at its left (anchor "l") or right ("r") edge at x."""
    L = motion.text_layer(s, size, weight, color, maxw=maxw); cx = x + L.width / 2 if anchor == "l" else x - L.width / 2
    tx(img, s, cx, y, size, weight, color, a=a, maxw=maxw)

def fit(s, base, maxw=940, k=.66):
    return int(max(36, min(base, maxw / (k * max(1, len(s))))))

CHIP = {"text": ""}
def paint(img, theme, lt):
    img.paste(bg(*THEMES[theme]))
    if theme == "space": starfield(img, lt, 4)
    if CHIP["text"]:
        w = 40 + 26 * len(CHIP["text"]); box(img, 540 - w / 2, 190, 540 + w / 2, 244, 27, (255, 255, 255), .12, outline=(200, 210, 255), ow=2)
        tx(img, CHIP["text"], 540, 218, 30, "black", MUT, maxw=900, shadow=False)

class N:
    """One beat: narration + a template draw function."""
    def __init__(self, narr, draw): self.narr, self.draw = narr, draw

def count(lt, b, at, dur=1.6, word=None):
    t0 = b.at(word, default=at) - .25 if word else at
    return eio(seg(lt, t0, t0 + dur))

class T:
    @staticmethod
    def kinetic(lines, theme="deep"):
        """lines: [(text, color, size)] popping in one after the other."""
        def draw(img, lt, p, b):
            paint(img, theme, lt); n = len(lines); y = 600 if n <= 3 else 460
            for i, (s, col, sz) in enumerate(lines):
                t0 = .15 + i * .45; sz = fit(s, sz, 900, .68); tx(img, s, 540, y, sz, "black", col, scale=pop((lt - t0) / .4), a=clamp((lt - t0) / .1), maxw=1000); y += int(sz * 1.5) + 24
        return draw

    @staticmethod
    def num(top, value, fmt="{:,.0f}", bottom="", color=GOLD, sub="", pre="", post="", word=None, theme="deep", base=210, dur=1.8, start=0):
        """Big animated counter."""
        def draw(img, lt, p, b):
            paint(img, theme, lt)
            tx(img, top, 540, 450, 68, "black", WHITE, a=clamp(lt / .3), maxw=980)
            v = start + (value - start) * count(lt, b, .4, dur, word); s = pre + fmt.format(v) + post; full = pre + fmt.format(value) + post
            tx(img, s, 540, 760, fit(full, base + 40), "black", color, maxw=1040)
            if bottom: tx(img, bottom, 540, 980, 62, "black", WHITE, a=clamp((lt - .9) / .3), maxw=980)
            if sub: tx(img, sub, 540, 1130, 46, "bold", MUT, a=clamp((lt - 1.5) / .3), maxw=980)
            if True: u = count(lt, b, .4, dur, word); box(img, 140, 1230, 940, 1250, 10, (60, 64, 110), 1.0); box(img, 140, 1230, 140 + max(20, 800 * u), 1250, 10, color, .9)
        return draw

    @staticmethod
    def bars(title, items, fmt="{:,.0f}", unit="", hi=None, theme="deep", words=None, sort=False, cols=None):
        """Horizontal bars. items: [(label, value)]. hi: index highlighted in colour, others dim."""
        its = sorted(items, key=lambda x: -x[1]) if sort else list(items); mx = max(v for _, v in its); n = len(its)
        rh = min(150, 840 / n)
        def draw(img, lt, p, b):
            paint(img, theme, lt); tx(img, title, 540, 330, 56, "black", WHITE, maxw=1000, a=clamp(lt / .3))
            for i, (lab, v) in enumerate(its):
                t0 = (b.at(words[i], default=.5 + i * .5) - .2) if words else .5 + i * .45; u = eio(seg(lt, t0, t0 + .7)); y = 450 + i * rh
                col = (cols[i] if cols else PAL[i % len(PAL)]) if (hi is None or i == hi) else (90, 100, 150)
                if u <= 0: continue
                txa(img, lab, 70, y, 46, "black", WHITE if (hi is None or i == hi) else MUT, "l", u, 640); txa(img, fmt.format(v * u) + unit, 1010, y, 46, "black", col, "r", u, 400)
                w = max(14, (930 - 70) * v / mx * u); box(img, 70, y + 38, 70 + w, y + 38 + min(58, rh * .42), 14, col, 1.0)
        return draw

    @staticmethod
    def vs(a, b_, fmt="{:,.0f}", unit="", note="", theme="deep", log=False, word=None, pre="", post=""):
        """Two blocks scaled by value. a/b_: (label, value, color)."""
        def draw(img, lt, p, b):
            paint(img, theme, lt); base = 1190; H = 600
            va, vb = a[1], b_[1]
            def hgt(v):
                m = max(va, vb)
                return max(10, H * (math.log10(v + 1) / math.log10(m + 1) if log else v / m))
            u = count(lt, b, .3, 1.4, word)
            for cx, (lab, v, col) in ((300, a), (780, b_)):
                h = hgt(v) * u; box(img, cx - 150, base - h, cx + 150, base, 20, col, 1.0)
                tx(img, pre + fmt.format(v * u) + unit + post, cx, base - h - 60, fit(pre + fmt.format(v) + unit + post, 70, 400, .66), "black", col, maxw=420)
                tx(img, lab, cx, base + 60, 44, "black", WHITE, maxw=420)
            if note: tx(img, note, 540, 340, 60, "black", GOLD, a=clamp((lt - 1.2) / .3), maxw=1000)
        return draw

    @staticmethod
    def steps(title, items, theme="deep", words=None, size=70):
        """Stacked reveals. items: [(big, small)]; each pops in on its word (or evenly)."""
        n = len(items)
        def draw(img, lt, p, b):
            paint(img, theme, lt); tx(img, title, 540, 330, 56, "black", WHITE, maxw=1000, a=clamp(lt / .3)); gap = min(230, 800 / n)
            for i, (big, small) in enumerate(items):
                t0 = (b.at(words[i], default=.5 + i * .8) - .2) if words else .5 + i * .8; u = clamp((lt - t0) / .35)
                if u <= 0: continue
                y = 500 + i * gap; col = PAL[i % len(PAL)]
                tx(img, big, 540, y, fit(big, size, 1000), "black", col, scale=pop((lt - t0) / .4), a=u, maxw=1040)
                if small: tx(img, small, 540, y + size * .75 + 16, 40, "bold", MUT, a=u, maxw=1000)
        return draw

    @staticmethod
    def dots(title, groups, theme="deep", legend=True):
        """10 x 10 grid. groups: [(count, color, label)] filled in order (the rest stay dim)."""
        def draw(img, lt, p, b):
            paint(img, theme, lt); tx(img, title, 540, 330, 58, "black", WHITE, maxw=1000, a=clamp(lt / .3))
            cols = [None] * 100; k = 0
            for cnt, col, lab in groups:
                for _ in range(cnt):
                    if k < 100: cols[k] = col; k += 1
            for i in range(100):
                r_, c_ = divmod(i, 10); x = 144 + c_ * 88; y = 450 + r_ * 78; on = clamp((lt - .4 - i * .012) / .2)
                disc(img, x, y, 28 * (.5 + .5 * on), mix((70, 76, 120), cols[i], on) if cols[i] else (70, 76, 120))
            if legend and groups:
                tx(img, "   ".join(f"{cnt} {lab}" for cnt, col, lab in groups), 540, 1290, 40, "black", WHITE, maxw=1000, a=clamp((lt - 1.6) / .3))
        return draw

    @staticmethod
    def timeline(title, events, lo, hi, theme="deep", fmtx=None, words=None):
        """events: [(x, label)] along an axis from lo to hi; labels alternate above and below."""
        fmtx = fmtx or (lambda x: f"{abs(x):.0f} {'BC' if x < 0 else 'AD'}")
        def draw(img, lt, p, b):
            paint(img, theme, lt); tx(img, title, 540, 330, 56, "black", WHITE, maxw=1000, a=clamp(lt / .3)); d = ImageDraw.Draw(img)
            d.line([(90, 800), (990, 800)], fill=(150, 160, 220), width=6)
            for i, (x, lab) in enumerate(events):
                t0 = (b.at(words[i], default=.4 + i * .9) - .2) if words else .4 + i * .9; u = clamp((lt - t0) / .3)
                if u <= 0: continue
                px = 200 + 680 * (x - lo) / (hi - lo); up = i % 2 == 0; col = PAL[i % len(PAL)]
                disc(img, px, 800, 16, col, u); line(img, [(px, 800), (px, 800 + (-90 if up else 90))], 4, col, u)
                tx(img, fmtx(x), px, 800 + (-150 if up else 150), 40, "black", col, a=u, maxw=300); tx(img, lab, px, 800 + (-215 if up else 215), 34, "bold", WHITE, a=u, maxw=300)
        return draw

    @staticmethod
    def race(title, items, unit="", theme="deep", fmt="{:,.0f}", secs=3.0):
        """Runners cross the screen at speeds proportional to the values. items: [(label, speed)]."""
        mx = max(v for _, v in items); n = len(items); rh = min(210, 800 / n)
        def draw(img, lt, p, b):
            paint(img, theme, lt); tx(img, title, 540, 330, 56, "black", WHITE, maxw=1000, a=clamp(lt / .3)); d = ImageDraw.Draw(img)
            for i, (lab, v) in enumerate(items):
                y = 440 + i * rh; col = PAL[i % len(PAL)]; frac = clamp((lt - .5) / secs) * (v / mx)
                d.line([(90, y + 62), (990, y + 62)], fill=(70, 78, 130), width=8); x = 90 + 900 * min(1.0, frac)
                txa(img, lab, 90, y, 48, "black", WHITE, "l", 1.0, 600); txa(img, fmt.format(v) + unit, 1010, y, 48, "black", col, "r", clamp((lt - 1.0) / .4), 400)
                glow(img, x, y + 62, 44, col, .55); disc(img, x, y + 62, 28, col, 1.0, outline=WHITE, ow=4)
        return draw

    @staticmethod
    def grid(title, rows, cols, filled, color=GOLD, theme="deep", label="", total_label="", word=None):
        """rows x cols of squares, `filled` highlighted."""
        def draw(img, lt, p, b):
            paint(img, theme, lt); tx(img, title, 540, 330, 56, "black", WHITE, maxw=1000, a=clamp(lt / .3)); d = ImageDraw.Draw(img)
            cell = min(900 // cols, 760 // rows); x0 = 540 - cell * cols / 2; y0 = 420; k = int(filled * count(lt, b, .4, 1.6, word))
            for i in range(rows * cols):
                r_, c_ = divmod(i, cols); d.rectangle([x0 + c_ * cell + 1, y0 + r_ * cell + 1, x0 + (c_ + 1) * cell - 2, y0 + (r_ + 1) * cell - 2], fill=color if i < k else (58, 62, 108))
            if label: tx(img, label, 540, y0 + rows * cell + 70, 46, "black", color, maxw=1000, a=clamp((lt - 1.4) / .3))
        return draw

    @staticmethod
    def stat(top, big, bottom="", color=GOLD, sub="", base=170, theme="deep"):
        """Static big text with pop (no counting)."""
        def draw(img, lt, p, b):
            paint(img, theme, lt)
            tx(img, top, 540, 470, 62, "black", WHITE, a=clamp(lt / .3), maxw=980); tx(img, big, 540, 760, fit(big, base, 860), "black", color, scale=pop((lt - .3) / .4), a=clamp((lt - .3) / .1), maxw=1000)
            if bottom: tx(img, bottom, 540, 960, 60, "black", WHITE, a=clamp((lt - 1.0) / .3), maxw=980)
            if sub: tx(img, sub, 540, 1090, 46, "bold", MUT, a=clamp((lt - 1.7) / .3), maxw=980)
        return draw

    @staticmethod
    def formula(lines, theme="ink", title=""):
        """Maths lines revealed one by one; the last line is gold. lines: [str]."""
        def draw(img, lt, p, b):
            paint(img, theme, lt)
            if title: tx(img, title, 540, 330, 56, "black", WHITE, maxw=1000, a=clamp(lt / .3))
            n = len(lines); gap = min(170, 760 / n)
            for i, s in enumerate(lines):
                t0 = .3 + i * .9; last = i == n - 1
                tx(img, s, 540, 560 + i * gap, fit(s, 92 if last else 64, 1000), "black", GOLD if last else WHITE, scale=pop((lt - t0) / .4), a=clamp((lt - t0) / .1), maxw=1040)
        return draw

    @staticmethod
    def ring(title, frac, label, color=GOLD, theme="deep", sub="", word=None):
        """Progress ring that fills to `frac`; the percentage counts up in the middle."""
        def draw(img, lt, p, b):
            paint(img, theme, lt); tx(img, title, 540, 340, 60, "black", WHITE, maxw=1000, a=clamp(lt / .3)); u = count(lt, b, .4, 1.6, word); d = ImageDraw.Draw(img)
            cx, cy, r = 540, 790, 290
            d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=(58, 62, 108), width=44)
            d.arc([cx - r, cy - r, cx + r, cy + r], -90, -90 + 360 * frac * u, fill=color, width=44)
            tx(img, f"{frac * 100 * u:.0f}%", 540, 790, 170, "black", color, maxw=440); tx(img, label, 540, 1190, 56, "black", WHITE, maxw=1000, a=clamp((lt - 1.2) / .3))
            if sub: tx(img, sub, 540, 1280, 40, "bold", MUT, a=clamp((lt - 1.8) / .3), maxw=1000)
        return draw

OUTROS = ["Follow for a new one every day.", "Follow, and tomorrow I'll show you something even stranger.", "Follow for more things nobody told you.", "Follow, there's a new surprise waiting for you tomorrow."]

def R(num, name, title, caption, story, style, beats, chip="", outro=True):
    """Builds the Reel. Beat 0 is the hook."""
    CHIP["text"] = chip
    if outro:
        line = OUTROS[num % len(OUTROS)]
        beats = list(beats) + [N(line, T.kinetic([("FOLLOW", GOLD, 140), ("FOR MORE", WHITE, 100), ("every day", MUT, 60)], "deep"))]
    bs = [Beat(n.narr, n.draw, 3.0, cut=CUTS[i % len(CUTS)] if i else "whip", cues=[(0, "whoosh", .5)]) for i, n in enumerate(beats)]
    return Reel(f"{num:03d}_{name}", bs, style=style, seed=num, snap=False, grid=4, safe_zone=False, vo=[(i, b.narr) for i, b in enumerate(bs)], title=title, caption=caption, story=story)
