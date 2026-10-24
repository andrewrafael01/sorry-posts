"""Premium 05: the Fraser spiral. It looks like a spiral. Every ring is a closed concentric circle; proven by tracing one ring and tinting them one by one."""
import math
import numpy as np
from ill import *

D = 820; CXs, CYs = 540, 1000; R = D / 2
_yy, _xx = np.mgrid[0:D, 0:D].astype(np.float32); _x = _xx - D / 2; _y = _yy - D / 2; _r = np.hypot(_x, _y); _th = np.arctan2(_y, _x)
RINGW = 41.0; NSEG = 48
K = np.floor(_r / RINGW); FR = (_r - K * RINGW) / RINGW
_cord = np.sin(NSEG * _th + 1.2 * FR * math.pi) > 0
_g = ((np.floor((NSEG * _th) / math.pi) + K) % 2 == 0)
VAL = np.where(_cord, np.where(_g, 0.0, .25), np.where(_g, 1.0, .75)).astype(np.float32)
INSIDE = _r <= R - 2
NRINGS = int(R // RINGW)

def pattern(tint_rings=0, tint_phase=0.0, dim=1.0):
    """grey-scale Fraser pattern; rings with index >= NRINGS - tint_rings (outermost first) are tinted with a rainbow hue"""
    v = VAL * dim; rgb = np.dstack([v, v, v])
    if tint_rings > 0:
        import colorsys
        for i in range(min(tint_rings, NRINGS)):
            k = NRINGS - 1 - i; m = (K == k) & INSIDE
            if not m.any(): continue
            col = np.array(colorsys.hsv_to_rgb((k * .083 + tint_phase) % 1, .75, 1.0), np.float32)
            rgb[m] = 0.35 * rgb[m] + 0.65 * (rgb[m] * 0 + col * (.35 + .65 * v[m, None]))
    a = (INSIDE * 255).astype(np.uint8)
    im = Image.fromarray((np.clip(rgb, 0, 1) * 255).astype(np.uint8), "RGB").convert("RGBA"); im.putalpha(Image.fromarray(a)); return im

_cache = {}
def base(): 
    if "b" not in _cache: _cache["b"] = pattern()
    return _cache["b"]

def bgdark(img): img.paste(vgrad((18, 16, 30), (6, 6, 14), key="fr1"))

def place(img, im, scale=1.0, rot=0.0):
    if scale != 1.0: im = im.resize((int(im.width * scale), int(im.height * scale)), Image.LANCZOS)
    if rot: im = im.rotate(math.degrees(rot), resample=Image.BICUBIC)
    img.paste(im, (int(CXs - im.width / 2), int(CYs - im.height / 2)), im)

def fin(img): bloom(img, 210, .25); vignette(img, .5)

def hook(img, lt, p, b):
    bgdark(img); place(img, base(), 1.0 + .05 * eio(seg(lt, 0, b.dur))); tx(img, "WHICH WAY", 540, 270, 96, "black", WHITE, shadow=True); tx(img, "DOES IT SPIRAL?", 540, 400, 96, "black", GOLD, shadow=True); fin(img)
def follow(img, lt, p, b):
    bgdark(img); place(img, base()); u = seg(lt, .4, b.dur - .5); tt = 2 * math.pi * 2.2 * u + .3
    for k in range(18):
        uu = max(0, u - k * .012); th = 2 * math.pi * 2.2 * uu * 1.0 + .3; rr = (R - 14) * (1 - .93 * uu); disc(img, CXs + rr * math.cos(th), CYs + rr * math.sin(th), 16 - k * .6, (255, 80, 80), a=(1 - k / 18) * .9)
    tx(img, "FOLLOW IT WITH YOUR EYES", 540, 300, 70, "black", WHITE, shadow=True); fin(img)
def circle(img, lt, p, b):
    bgdark(img); place(img, base(), 1.0); k = 4; rr = (k + .5) * RINGW; u = eio(seg(lt, .5, 2.8)); ellipse_ring(img, CXs, CYs, rr, rr, 9, (255, 60, 60), a=1.0, arc=(-math.pi / 2, -math.pi / 2 + 2 * math.pi * u))
    glow(img, CXs + rr * math.cos(-math.pi / 2 + 2 * math.pi * u), CYs + rr * math.sin(-math.pi / 2 + 2 * math.pi * u), 50, (255, 60, 60), .8)
    tx(img, "THERE IS NO SPIRAL", 540, 290, 78, "black", WHITE, shadow=True); tx(img, "THIS LINE CLOSES ON ITSELF", 540, 410, 52, "black", (255, 120, 120), a=eio(seg(lt, 2.4, 3.0)), shadow=True); fin(img)
def tint(img, lt, p, b):
    n = int(NRINGS * eio(seg(lt, .3, b.dur - .6))); bgdark(img); place(img, pattern(tint_rings=n, tint_phase=lt * .15)); tx(img, "EVERY RING", 540, 290, 84, "black", WHITE, shadow=True); tx(img, "A PERFECT CIRCLE", 540, 410, 84, "black", GOLD, shadow=True); fin(img)
def why(img, lt, p, b):
    bgdark(img); k = eio(seg(lt, .3, 1.4)); sc = 1 + 1.6 * k; im = pattern(tint_rings=NRINGS, tint_phase=.0) if False else base()
    big = im.resize((int(D * sc), int(D * sc)), Image.LANCZOS); cx0, cy0 = big.width / 2, big.height / 2; crop = big.crop((int(cx0 + R * sc * .28 - 380), int(cy0 - 260), int(cx0 + R * sc * .28 + 380), int(cy0 + 260)))
    img.paste(crop, (160, 760), crop); tx(img, "THE TILTED CORDS", 540, 290, 78, "black", WHITE, shadow=True); tx(img, "LEAN THE SAME WAY", 540, 410, 78, "black", GOLD, shadow=True); fin(img)
def end(img, lt, p, b):
    bgdark(img); place(img, base(), 1.0 + .03 * math.sin(lt * 2)); tx(img, "NOW YOU KNOW", 540, 290, 78, "black", WHITE, shadow=True); tx(img, "AND YOU STILL SEE A SPIRAL", 540, 410, 56, "black", GOLD, shadow=True); fin(img)

N = [
 ("Which way does this spiral?", hook),
 ("It looks like a spiral. Follow it inward with your eyes.", follow),
 ("But there is no spiral here. This line closes on itself. It is a perfect circle.", circle),
 ("Every single ring is the same. Dozens of separate, concentric circles.", tint),
 ("The tilted pieces all lean the same way, so your brain connects them into a spiral.", why),
 ("And even now, you still see it spiral.", end),
]
def spiral():
    return make_reel(495, "fraser_spiral", "this spiral is not a spiral", N, style="cine", story="Fraser spiral: concentric rings of twisted-cord segments (tilt 1.2*pi across ring width) over a polar checker; ring index k depends only on radius, so every ring is a closed circle.")
REELS = dict(spiral=spiral)
