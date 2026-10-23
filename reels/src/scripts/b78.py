"""Batch 78: two money trees. $300 a month at 7%: start at 25 -> $787k at 65, start at 35 -> $366k. The early tree put in only $36k more."""
import math
import numpy as np
from PIL import Image, ImageDraw
from scripts.common import *
from motion import *
import motion, voice

GOLD = (255, 214, 90); SOFT = (205, 220, 240); WHITE = (255, 255, 255); GREEN = (90, 220, 140); RED = (255, 120, 120)
def A(b, w, d=None, occ=0): return b.at(w, occ, d)
R_ = .07 / 12
def fv(age, start):
    m = max(0.0, (age - start) * 12); return 300 * (((1 + R_) ** m - 1) / R_) if m > 0 else 0.0
FMAX = fv(65, 25); GROUND = 1260

def branches(seed, depth=9):
    rs = np.random.RandomState(seed); out = []   # (x0,y0,x1,y1,depth) in unit space: trunk length 1 going up
    def rec(x, y, ang, ln, d):
        x1 = x + math.sin(ang) * ln; y1 = y + math.cos(ang) * ln; out.append((x, y, x1, y1, d))
        if d >= depth: return
        for sgn in (-1, 1):
            rec(x1, y1, ang + sgn * (.30 + rs.rand() * .10) + (rs.rand() - .5) * .06, ln * (.73 + rs.rand() * .04), d + 1)
    rec(0, 0, 0.0, .27, 0); return out
TREE_A = branches(3); TREE_B = branches(8)

def tree(img, cx, ground, h_px, growth, tr, lt, tint=GREEN):
    """h_px: final-height scale; growth 0..1 how much of the tree exists"""
    if growth <= 0.003: return
    d = ImageDraw.Draw(img, "RGBA"); maxd = 9; vis = growth * (maxd + 1.2); s = h_px * (.30 + .70 * growth) / 1.05
    for (x0, y0, x1, y1, dp) in tr:
        if dp > vis: continue
        a = clamp(vis - dp); w = max(1.5, (10 - dp) * 1.7 * (h_px / 640)); fx = lambda x: cx + x * s; fy = lambda y: ground - y * s
        sway = math.sin(lt * 1.2 + dp * .6) * 2.0 * dp * .12
        d.line([(fx(x0) + sway, fy(y0)), (fx(x1) + sway, fy(y1))], fill=(110 + dp * 6, 80 + dp * 4, 52, int(255 * a)), width=int(w))
        if dp >= maxd - 2: glow(img, fx(x1) + sway, fy(y1), 12 + (dp - 6) * 2, tint, .22 * a); disc(img, fx(x1) + sway, fy(y1), 4 + (dp - 7) * 1.5, tint, .9 * a)
        if dp == maxd: disc(img, fx(x1) + sway, fy(y1) - 2, 5, GOLD, a)

def ground_line(img):
    d = ImageDraw.Draw(img); d.rectangle([0, GROUND, W, H], fill=(12, 20, 20)); d.line([(0, GROUND), (W, GROUND)], fill=(70, 110, 90), width=3)

def bgf(img): img.paste(vgrad((10, 24, 36), (22, 52, 56), key="money"))
def hud(img, big, sub, col=GOLD):
    tx(img, big, 540, 225, 108 if len(big) < 14 else 76, "black", col, maxw=980); tx(img, sub, 540, 330, 32, "bold", SOFT, shadow=False, maxw=980)
def label(img, name, x, money, a=1.0):
    tx(img, name, x, 1330, 34, "black", WHITE, a=a, shadow=False); 
def mny(v): return f"${v / 1000:,.0f}k" if v >= 1000 else f"${v:,.0f}"

def scene(img, lt, age, show_money=True, finals=False):
    bgf(img); ground_line(img); fa, fb = fv(age, 25), fv(age, 35)
    tree(img, 270, GROUND, 520, (fa / FMAX) ** .62, TREE_A, lt); tree(img, 810, GROUND, 520, (fb / FMAX) ** .62, TREE_B, lt)
    if show_money:
        tx(img, "ALEX · from 25", 270, 450, 32, "black", SOFT, shadow=False, maxw=420); tx(img, "SAM · from 35", 810, 450, 32, "black", SOFT, shadow=False, maxw=420)
        tx(img, mny(fa), 270, 520, 64, "black", GREEN, shadow=False, maxw=420); tx(img, mny(fb), 810, 520, 64, "black", GREEN if fb > 0 else (110, 120, 130), shadow=False, maxw=420)

def trees():
    def hook(img, lt, p, b):
        age = 25 + 40 * eio(seg(lt, .4, b.dur - .3)); scene(img, lt, age, show_money=False); hud(img, "-$421,000", "THE COST OF WAITING 10 YEARS", RED)
    def two(img, lt, p, b):
        age = 25 + 10 * eio(seg(lt, A(b, "twenty", 2.0), b.dur - .4)); scene(img, lt, age); hud(img, f"AGE {int(age)}", "$300 A MONTH · 7% A YEAR", GOLD)
    def sam(img, lt, p, b):
        age = 35 + 6 * eio(seg(lt, .4, b.dur - .2)); scene(img, lt, age); hud(img, f"AGE {int(age)}", "SAM FINALLY STARTS", WHITE)
    def grow(img, lt, p, b):
        age = 41 + 24 * eio(seg(lt, .2, b.dur - .5)); scene(img, lt, age); hud(img, f"AGE {int(age)}", "TIME DOES THE WORK", GOLD)
    def result(img, lt, p, b):
        scene(img, lt, 65); hud(img, "AGE 65", "$787,000 VS $366,000", WHITE)
    def why(img, lt, p, b):
        scene(img, lt, 65); hud(img, "ONLY $36K MORE", "ALEX PUT IN $144K · SAM PUT IN $108K", GOLD)
    def end(img, lt, p, b):
        scene(img, lt, 65); hud(img, "TELL THEM", "SEND THIS TO SOMEONE IN THEIR 20S", GREEN)
        tx(img, "assumes 7% a year · not financial advice", 540, 1400, 22, "bold", (150, 165, 180), shadow=False, a=.0)
    N = [
     ("Waiting ten years to start investing costs you about four hundred twenty thousand dollars.", hook),
     ("Two friends invest three hundred dollars a month. Alex starts at twenty five. Sam waits until thirty five.", two),
     ("Ten years later, Sam finally starts.", sam),
     ("Both keep going, same amount every month, until age sixty five.", grow),
     ("Alex ends up with about seven hundred eighty seven thousand. Sam, about three hundred sixty six.", result),
     ("Alex only put in thirty six thousand dollars more. The extra years did the rest.", why),
    ]
    beats = [Clean(n, d, 3.0, cut="cut", push=0) for n, d in N]
    return Reel("420_two_trees", beats, style="cine", seed=420, gain_music=.55, snap=False, grid=0, safe_zone=False, vo=[(i, n) for i, (n, d) in enumerate(N)],
        title="waiting 10 years costs you $421,000", caption="x", story="$300/month at 7% annual return, monthly compounding: from 25 to 65 = about $787k (contributions $144k); from 35 to 65 = about $366k (contributions $108k); difference about $421k. Illustrative: 7% is a historical average for US stocks, not guaranteed. Not financial advice.")
REELS = dict(trees=trees)
