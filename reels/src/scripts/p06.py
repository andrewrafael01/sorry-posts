"""Premium 06: the cafe wall illusion. Rows of tiles shifted half a tile make perfectly parallel lines look tilted; proven with a straight-edge, then the tiles are removed."""
import math
import numpy as np
from ill import *

TILE = 78; ROWH = 78; NR = 11; NC = 12; MORT = 5; OFF = 39    # tile width, row height, rows, cols, mortar thickness, row shift
X0 = (1080 - NC * TILE) // 2; Y0 = 560
GRAY = (128, 128, 128)

def draw_wall(img, alpha=1.0, shift=1.0, tiles=1.0):
    d = ImageDraw.Draw(img, "RGBA")
    for r in range(NR):
        y = Y0 + r * ROWH; off = (OFF * shift) if r % 2 else 0.0
        if tiles > 0:
            for c in range(-1, NC + 1):
                x = X0 + c * TILE + off; col = (0, 0, 0) if c % 2 == 0 else (245, 245, 245)
                x0, x1 = max(X0, x), min(X0 + NC * TILE, x + TILE)
                if x1 > x0: d.rectangle([x0, y, x1, y + ROWH - MORT], fill=col + (int(255 * alpha * tiles),))
        d.rectangle([X0, y + ROWH - MORT, X0 + NC * TILE, y + ROWH], fill=GRAY + (int(255 * alpha),))

def mortar_lines(img, u, col=(255, 70, 70), w=6):
    for r in range(NR):
        yy = Y0 + r * ROWH + ROWH - MORT / 2; xe = X0 + (NC * TILE) * ease_out(clamp(u * 1.4 - r * .06))
        line(img, [(X0 - 20, yy), (xe + 20 if u > 0 else X0, yy)], w, col); glow(img, xe + 20, yy, 24, col, .5)

def bgd(img): img.paste(vgrad((20, 18, 30), (6, 6, 12), key="cw"))
def fin(img): bloom(img, 215, .2); vignette(img, .45)

def hook(img, lt, p, b):
    bgd(img); draw_wall(img); tx(img, "ARE THESE LINES", 540, 270, 84, "black", WHITE, shadow=True); tx(img, "TILTED?", 540, 395, 120, "black", GOLD, shadow=True, scale=1 + .03 * math.sin(lt * 5)); fin(img)
def wedge(img, lt, p, b):
    bgd(img); draw_wall(img); tx(img, "THEY LOOK LIKE WEDGES", 540, 300, 74, "black", WHITE, shadow=True); tx(img, "SLOPING UP AND DOWN", 540, 420, 62, "black", GOLD, shadow=True); fin(img)
def parallel(img, lt, p, b):
    bgd(img); draw_wall(img); mortar_lines(img, seg(lt, .5, 3.0)); tx(img, "PERFECTLY PARALLEL", 540, 300, 86, "black", WHITE, shadow=True); tx(img, "EVERY LINE IS STRAIGHT", 540, 425, 62, "black", (255, 120, 120), a=eio(seg(lt, 2.4, 3.0)), shadow=True); fin(img)
def remove(img, lt, p, b):
    t = eio(seg(lt, .3, 1.8)); bgd(img); draw_wall(img, tiles=1 - t); mortar_lines(img, 1.0)
    tx(img, "TAKE THE TILES AWAY", 540, 300, 74, "black", WHITE, shadow=True); tx(img, "JUST STRAIGHT LINES", 540, 425, 66, "black", GOLD, a=eio(seg(lt, 1.8, 2.4)), shadow=True); fin(img)
def shift(img, lt, p, b):
    s = 1.0 - eio(seg(lt, .8, 3.4)); bgd(img); draw_wall(img, shift=s); mortar_lines(img, 1.0, col=(255, 70, 70), w=5)
    tx(img, "LINE THE ROWS UP", 540, 300, 80, "black", WHITE, shadow=True); tx(img, "AND THE ILLUSION VANISHES", 540, 420, 58, "black", GOLD, a=eio(seg(lt, 3.0, 3.6)), shadow=True); fin(img)
def end(img, lt, p, b):
    s = .5 + .5 * math.sin(lt * 1.4) * .0 + .5; bgd(img); draw_wall(img, shift=1.0); tx(img, "SHIFT THEM HALF A TILE", 540, 300, 66, "black", WHITE, shadow=True); tx(img, "AND STRAIGHT BECOMES CROOKED", 540, 420, 54, "black", GOLD, shadow=True); fin(img)

N = [
 ("Are these lines tilted?", hook),
 ("They look like wedges, sloping up and down.", wedge),
 ("But every one of them is perfectly parallel. A ruler would agree.", parallel),
 ("Take the tiles away, and there are only straight lines left.", remove),
 ("Line the rows up, and the illusion disappears.", shift),
 ("Shift each row by half a tile, and straight becomes crooked.", end),
]
def cafe():
    return make_reel(496, "cafe_wall", "are these lines tilted", N, style="cine", story="Cafe wall illusion: alternating black/white tile rows, alternate rows shifted half a tile, gray mortar lines; all mortar lines are horizontal and parallel.")
REELS = dict(cafe=cafe)
