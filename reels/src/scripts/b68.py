"""Batch 68: pedigree collapse. Your ancestor count doubles every generation until it needs more people than ever existed, so the same people keep reappearing in your tree."""
import math
import numpy as np
from PIL import Image, ImageDraw
from scripts.common import *
from motion import *
import motion, voice

GOLD = (255, 214, 0); RED = (255, 80, 110); BLUE = (110, 170, 255); SOFT = (190, 198, 235)
def A(b, w, d=None, occ=0): return b.at(w, occ, d)
ROWS = 7; RY0, RDY = 520, 54
def hue(h, s=.55, v=1.0):
    import colorsys; r, g, b = colorsys.hsv_to_rgb(h % 1, s, v); return (int(r * 255), int(g * 255), int(b * 255))
_rr = np.random.RandomState(12)
COLORS = [_rr.rand() for _ in range(300)]
REPEAT = {(5, 3), (6, 40), (7, 91), (7, 17), (6, 11), (7, 120), (4, 12)}   # the same ancestor, appearing again and again

def tree(img, lt, rows_vis, repeat_k=0.0, dupes=False, compact=False):
    d = ImageDraw.Draw(img, "RGBA"); y0 = 470 if compact else 520; dy = 76 if compact else 112; pad = 80; span = 1080 - 2 * pad
    def pos(g, k): n = 2 ** g; return (540 if n == 1 else pad + span * (k + .5) / n, y0 + g * dy)
    top = min(ROWS - 1, int(rows_vis))
    for g in range(1, top + 1):   # parent links
        a = 1.0 if g < int(rows_vis) else clamp(rows_vis - int(rows_vis))
        for k in range(2 ** g):
            (x, y), (px, py) = pos(g, k), pos(g - 1, k // 2); line(img, [(px, py), (x, y)], 2, (120, 130, 190), .35 * a) if g <= 5 else d.line([(px, py), (x, y)], fill=(120, 130, 190, int(90 * a)), width=1)
    for g in range(top + 1):
        n = 2 ** g; a = 1.0 if g < int(rows_vis) else clamp(rows_vis - int(rows_vis)); r = max(4.5, min(16, span / n * .4))
        for k in range(n):
            if dupes and (g, k) in REPEAT: continue
            x, y = pos(g, k); c = hue(COLORS[(g * 37 + k * 7) % 300]); d.ellipse([x - r, y - r, x + r, y + r], fill=c + (int(255 * a),))
    if dupes and repeat_k > 0:
        pts = [pos(g, k) for (g, k) in sorted(REPEAT) if g <= rows_vis]
        for i in range(len(pts) - 1): line(img, [pts[i], pts[i + 1]], 3, GOLD, .55 * repeat_k)
        for x, y in pts: glow(img, x, y, 38, GOLD, .85 * repeat_k); d.ellipse([x - 10, y - 10, x + 10, y + 10], fill=GOLD + (255,))
    glow(img, 540, y0 - 66, 60, (255, 255, 255), .5); tx(img, "YOU", 540, y0 - 66, 34, "black", (255, 255, 255), shadow=False)

def deep(img, lt, g_reveal, flash=0.0):
    """Generations 7..30 as smooth glowing bands (a crowd that keeps doubling); past the population line the crowd cannot exist, so the bands turn red."""
    gstar = math.log2(350e6); top = 950; h = 11; n = min(30, int(g_reveal)) - 6
    if n > 0:
        H_ = n * h; xs = np.linspace(0, 1, 1080)[None, :, None]; ys = np.arange(H_)[:, None, None]; g = 7 + ys // h
        hueb = (xs * .75 + .55 + g * .01 + lt * .03) % 1; import colorsys
        r = np.zeros((H_, 1080, 3), np.float32)
        for c, f in enumerate((0, 1, 2)):
            r[..., c] = (np.clip(np.abs(((hueb[..., 0] * 6 + [0, 4, 2][c]) % 6) - 3) - 1, 0, 1)) * .55 + .35
        bad = (g[..., 0] > gstar)[..., None]; red = np.array([1.0, .22, .35])[None, None]
        r = np.where(bad, r * .35 + red * .65, r)
        shade = (.72 + .28 * np.sin(ys / h * math.pi * 2 - lt * 2))[..., 0:1]
        arr = np.clip(r * shade * 255, 0, 255).astype(np.uint8); edge = ((ys % h) < h - 2)[..., 0]; arr = arr * edge[..., None]
        img.paste(Image.fromarray(arr), (0, top))
    for gg, lab in ((10, "1,024"), (20, "1 million"), (30, "1 billion")):
        if g_reveal >= gg: y = top + (gg - 7) * h; tx(img, lab, 130, y + 4, 28, "black", (255, 255, 255), shadow=True, maxw=240)
    if g_reveal > gstar:
        yl = top + (gstar - 7) * h; line(img, [(40, yl), (1040, yl)], 4, (255, 255, 255), .95); tx(img, "WORLD POPULATION THEN: ~350 MILLION", 540, yl - 28, 26, "black", (255, 255, 255), maxw=980)
    if flash > 0: glow(img, 540, 1130, 480, (255, 60, 90), .35 * flash)

def hud(img, big, sub, col=(255, 255, 255)):
    tx(img, big, 540, 215, 100 if len(big) < 14 else 76, "black", col, maxw=980); tx(img, sub, 540, 315, 30, "bold", SOFT, shadow=False, maxw=980)

def ancestors():
    def hook(img, lt, p, b):
        hud(img, "MORE ANCESTORS", "THAN PEOPLE WHO EXISTED", GOLD); tree(img, lt, 1 + 5 * eio(seg(lt, .5, b.dur - .3)))
    def doubling(img, lt, p, b):
        rows = 6 * eio(seg(lt, .2, b.dur - .5)); g = int(rows)
        sub = ["YOU", "2 PARENTS", "4 GRANDPARENTS", "8 GREAT-GRANDPARENTS"][g] if g < 4 else f"{g} GENERATIONS BACK"
        hud(img, f"{2 ** g:,}", sub, WHITE); tree(img, lt, rows)
    def thirty(img, lt, p, b):
        g = 30 * eio(seg(lt, .3, A(b, "billion", b.dur - 1.0))); hud(img, f"{int(2 ** g):,}", f"{int(g)} GENERATIONS BACK · ~{int(g) * 30} YEARS", RED); tree(img, lt, 6, compact=True); deep(img, lt, g)
    def impossible(img, lt, p, b):
        hud(img, "IMPOSSIBLE", "YOU NEED 1,073,741,824. THE WORLD HAD ~350 MILLION.", RED); tree(img, lt, 6, compact=True); deep(img, lt, 30, flash=clamp(1 - (lt - 1.0) / 1.2))
    def shared(img, lt, p, b):
        k = eio(seg(lt, .4, 1.8)); hud(img, "SAME PEOPLE", "SHOWING UP AGAIN AND AGAIN IN YOUR TREE", GOLD); tree(img, lt, 6, k, dupes=True)
    def everyone(img, lt, p, b):
        hud(img, "RELATED", "EVERYONE ALIVE SHARES AN ANCESTOR WITHIN A FEW THOUSAND YEARS", GOLD); tree(img, lt, 6, 1.0, dupes=True)
        t0 = A(b, "stand", b.dur - 1.4); a = clamp((lt - t0) / .4)
        if a > 0: tx(img, "yes, even them", 540, 1180, 60, "black", WHITE, a=a, scale=motion.pop((lt - t0) / .4), shadow=False)
    def end(img, lt, p, b):
        hud(img, "COUSIN", "YOU DIDN'T KNOW YOU HAD", GOLD); tree(img, lt, 6, 1.0, dupes=True)
    N = [
     ("You have more ancestors than there were people alive to be your ancestors.", hook),
     ("Two parents. Four grandparents. Eight great-grandparents. It doubles every generation.", doubling),
     ("Go back thirty generations, about nine hundred years, and the math says you need over a billion ancestors.", thirty),
     ("But around the year eleven hundred, the whole world had only about three hundred and fifty million people.", impossible),
     ("So your ancestors weren't a billion different people. They were the same people, showing up again and again in your family tree.", shared),
     ("Which means you're related to everyone you've ever met. Scientists estimate we all share an ancestor within the last few thousand years. Yes, even the person you can't stand.", everyone),
     ("Send this to a cousin you didn't know you had.", end),
    ]
    beats = [Clean(n, d, 3.0, cut="cut", push=0) for n, d in N]
    return Reel("410_ancestors", beats, style="cine", seed=410, gain_music=.5, snap=False, grid=0, safe_zone=False, vo=[(i, n) for i, (n, d) in enumerate(N)],
        title="you have more ancestors than people who existed", caption="x", story="2^30 = 1,073,741,824 ancestor slots 30 generations (about 900 years) back; world population around 1100 CE was roughly 300-400 million (HYDE/UN estimates). Pedigree collapse: the same ancestors appear many times. Rohde, Olson & Chang 2004 (Nature 431:562): the most recent common ancestor of all living humans lived a few thousand years ago.")
REELS = dict(ancestors=ancestors)
