"""Batch 77: Sundays left with your dad. A mechanical flip counter runs down one year per half second while the age climbs."""
import math
import numpy as np
from PIL import Image, ImageDraw
from scripts.common import *
from motion import *
import motion, voice

GOLD = (255, 200, 110); SOFT = (225, 215, 235); WHITE = (255, 255, 255); WARM = (255, 150, 110); RED = (255, 100, 110)
def A(b, w, d=None, occ=0): return b.at(w, occ, d)
CW_, CH_ = 150, 220; GAP = 20
_dig = {}
def digit_layer(ch):
    if ch not in _dig:
        L = Image.new("RGBA", (CW_, CH_), (0, 0, 0, 0)); d = ImageDraw.Draw(L); d.rounded_rectangle([0, 0, CW_ - 1, CH_ - 1], 18, fill=(30, 30, 42, 255))
        t = text_layer(ch, 170, "black", (245, 245, 250), maxw=CW_ - 6); L.alpha_composite(t, ((CW_ - t.width) // 2, (CH_ - t.height) // 2)); _dig[ch] = L
    return _dig[ch]

def card(img, cx, cy, old, new, u):
    """one flip card; u in [0,1) while flipping old->new, else static new"""
    x0, y0 = int(cx - CW_ / 2), int(cy - CH_ / 2); half = CH_ // 2
    shadow = Image.new("RGBA", (CW_ + 20, CH_ + 20), (0, 0, 0, 0)); ImageDraw.Draw(shadow).rounded_rectangle([10, 14, CW_ + 10, CH_ + 14], 20, fill=(0, 0, 0, 120)); img.paste(shadow, (x0 - 10, y0 - 10), shadow)
    Ln, Lo = digit_layer(new), digit_layer(old)
    if u >= 1 or old == new:
        img.paste(Ln, (x0, y0), Ln)
    else:
        img.paste(Ln.crop((0, 0, CW_, half)), (x0, y0), Ln.crop((0, 0, CW_, half)))           # top shows new (behind)
        img.paste(Lo.crop((0, half, CW_, CH_)), (x0, y0 + half), Lo.crop((0, half, CW_, CH_)))   # bottom still old
        if u < .5:
            h = max(1, int(half * (1 - 2 * u))); top = Lo.crop((0, 0, CW_, half)).resize((CW_, h), Image.BILINEAR); img.paste(top, (x0, y0 + half - h), top)
        else:
            h = max(1, int(half * (2 * (u - .5)))); bot = Ln.crop((0, half, CW_, CH_)).resize((CW_, h), Image.BILINEAR); img.paste(bot, (x0, y0 + half), bot)
    ImageDraw.Draw(img).rectangle([x0, y0 + half - 2, x0 + CW_, y0 + half + 2], fill=(8, 8, 14))

def flipboard(img, cy, val_fn, lt, n_digits=4):
    v = val_fn(lt); vp = val_fn(max(0, lt - .16)); s = str(int(v)).zfill(n_digits); sp = str(int(vp)).zfill(n_digits)
    total = n_digits * CW_ + (n_digits - 1) * GAP; x = 540 - total / 2 + CW_ / 2
    for i in range(n_digits):
        u = 1.0
        if s[i] != sp[i]:
            tc = lt
            for k in range(16):   # when did this digit last change
                t_ = lt - k * .01
                if str(int(val_fn(max(0, t_)))).zfill(n_digits)[i] != s[i]: break
                tc = t_
            u = clamp((lt - tc) / .16)
        card(img, x + i * (CW_ + GAP), cy, sp[i], s[i], u)

def bg(img): img.paste(vgrad((26, 18, 30), (60, 36, 40), key="sun"))
def hud(img, big, sub, col=GOLD):
    tx(img, big, 540, 225, 108 if len(big) < 14 else 80, "black", col, maxw=980); tx(img, sub, 540, 330, 32, "bold", SOFT, shadow=False, maxw=980)

class FBeat(Clean):
    def __init__(self, narr, draw, count=None, min_dur=0):
        self.count = count; self.min_dur = min_dur; self._auto = None; self._cues = []
        super().__init__(narr, draw, 3.0, cut="cut", push=0)
    cues = property(lambda self: list(self._cues) + (self._acues() if getattr(self, "count", None) else []), lambda self, v: setattr(self, "_cues", list(v)))
    def _acues(self):
        if self._auto is None:
            t0, t1 = self.count(self); out = []; t = t0
            while t < t1: out.append((t, "clk%d" % int(520 + 200 * math.sin(t * 7)), .55)); t += .075
            self._auto = out
        return self._auto

def dad():
    state = {}
    def val(b):
        t0, t1 = 0.6, b.dur - .5
        return lambda lt: 1144 * (1 - eio(seg(lt, t0, t1)) ** 1.0)
    def hook(img, lt, p, b):
        bg(img); hud(img, "SUNDAYS", "LEFT WITH DAD IF HE'S 60", GOLD); flipboard(img, 860, lambda t: 1144, lt)
    def math_(img, lt, p, b):
        bg(img); hud(img, "22 × 52", "YEARS LEFT × SUNDAYS A YEAR", WARM); flipboard(img, 860, lambda t: 1144, lt)
        a = clamp((lt - A(b, "twenty", 2.0)) / .3); tx(img, "average 60-year-old man: ~22 more years (SSA)", 540, 1090, 28, "bold", SOFT, a=a, shadow=False, maxw=980)
    def run(img, lt, p, b):
        bg(img); f = val(b); age = 60 + 22 * (1 - f(lt) / 1144); hud(img, f"DAD IS {int(age)}", "TWO YEARS EVERY SECOND", RED if age > 75 else GOLD); flipboard(img, 860, f, lt)
    def call(img, lt, p, b):
        bg(img); hud(img, "THIS SUNDAY", "CALL HIM. NOT NEXT MONTH.", GOLD); flipboard(img, 860, lambda t: 1144 - 1, lt)
    def end(img, lt, p, b):
        bg(img); hud(img, "SEND THIS", "TO SOMEONE WHO SHOULD CALL THEIR DAD", WARM); flipboard(img, 860, lambda t: 1143, lt)
    N = [
     ("If your dad is sixty, you have about eleven hundred Sundays left with him.", hook, None),
     ("Twenty two years, times fifty two Sundays. The average sixty year old man lives about twenty two more.", math_, None),
     ("Watch it. Two years every second. Every Sunday you don't call is one you don't get back.", run, lambda b: (.6, b.dur - .5), 11.5),
     ("So call him this Sunday. Not next month. This Sunday.", call, None),
     ("And send this to someone who should call their dad.", end, None),
    ]
    beats = [FBeat(n, d, c, m) for n, d, c, m in [(x + (0,))[:4] if len(x) == 3 else x for x in N]]
    return Reel("419_dad_sundays", beats, style="cine", seed=419, gain_music=.55, snap=False, grid=0, safe_zone=False, vo=[(i, x[0]) for i, x in enumerate(N)],
        title="you have about 1,100 Sundays left with your dad", caption="x", story="US Social Security period life table: remaining life expectancy of a 60-year-old man is about 21-22 years. 22 x 52 = 1,144 Sundays. Illustrative: the viewer substitutes their dad's age.")
REELS = dict(dad=dad)
