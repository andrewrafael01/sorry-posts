"""Premium 02: Cleopatra lived closer to the Moon landing than to the building of the Great Pyramid.
One continuous world: x is real time (years), sky fades from desert sunset to space as the camera travels; spans measured with live counters."""
import math
import numpy as np
from premium import *

K = .42                                  # px per year in world space
Y_PYR, Y_CLEO, Y_MOON = -2560, -69, 1969
wx = lambda y: (y - Y_PYR) * K           # world x of a year
GROUND = 1180

def sky(img, cam, lt):
    t = clamp((cam - wx(Y_PYR)) / (wx(Y_MOON) - wx(Y_PYR)))
    top = np.array((250, 150, 90), float) * (1 - t) + np.array((4, 5, 16), float) * t
    low = np.array((255, 214, 140), float) * (1 - t) + np.array((12, 14, 40), float) * t
    img.paste(vgrad(tuple(int(x) for x in top), tuple(int(x) for x in low), key=("cl", int(top[0] / 6), int(low[0] / 6))))
    if t > .25: depth_stars(img, lt, vx=-4, vy=0, n=int(30 + 150 * t), seed=2)
    return t

def pyramid(img, x, base, w, a=1.0):
    h = w * .62; apex = (x, base - h)
    left = [(x - w / 2, base), apex, (x, base)]; right = [(x, base), apex, (x + w / 2, base)]
    for pts, col in ((left, (232, 188, 112)), (right, (172, 120, 66))):
        xs = [p[0] for p in pts]; ys = [p[1] for p in pts]; x0, y0 = int(min(xs)) - 2, int(min(ys)) - 2
        m = Image.new("L", (int(max(xs)) - x0 + 4, int(max(ys)) - y0 + 4), 0); ImageDraw.Draw(m).polygon([(px - x0, py - y0) for px, py in pts], fill=int(255 * a))
        img.paste(Image.new("RGB", m.size, col), (x0, y0), m)
    for k in range(1, 7):
        yy = base - h * k / 7; hw = w / 2 * (1 - k / 7)
        line(img, [(x - hw, yy), (x + hw, yy)], 2, (140, 98, 52), a=.35 * a)

def dunes(img, cam, s, t):
    arr = np.arange(0, 1080, 6); d = ImageDraw.Draw(img)
    for layer, (sp, col, amp, y0) in enumerate(((.5, (206, 148, 84), 40, GROUND + 4), (.8, (176, 120, 62), 60, GROUND + 70), (1.0, (130, 88, 48), 80, GROUND + 160))):
        col = tuple(int(c * (1 - t * .85) + 8 * t) for c in col); pts = [(0, 1920)]
        for x in arr: pts.append((x, y0 + amp * math.sin((x + cam * s * sp) * .006 + layer) + amp * .5 * math.sin((x + cam * s * sp) * .017 + layer * 2)))
        pts.append((1080, 1920)); d.polygon(pts, fill=col)

def poly(img, pts, col, a=1.0):
    xs = [p[0] for p in pts]; ys = [p[1] for p in pts]; x0, y0 = int(min(xs)) - 2, int(min(ys)) - 2
    m = Image.new("L", (int(max(xs)) - x0 + 4, int(max(ys)) - y0 + 4), 0); ImageDraw.Draw(m).polygon([(px - x0, py - y0) for px, py in pts], fill=int(255 * a))
    img.paste(Image.new("RGB", m.size, col), (x0, y0), m)

def cleo(img, x, y, size, a=1.0, lt=0.0):
    z = size; glow(img, x, y - z * .4, z * 2.4, (255, 215, 120), .45 * a)
    # sun disc between two horns
    for sgn in (-1, 1):
        pts = [(x + sgn * z * (.30 + .52 * math.sin(th)), y - z * 1.12 - z * .5 * (1 - math.cos(th))) for th in np.linspace(0, math.pi / 1.5, 16)]
        line(img, pts, max(5, int(z * .12)), (240, 196, 80), a=a)
    disc(img, x, y - z * 1.18, z * .30, (255, 226, 130), a=a)
    # nemes headdress with gold stripes
    poly(img, [(x - z * .62, y + z * 1.0), (x - z * .44, y - z * .55), (x, y - z * .85), (x + z * .44, y - z * .55), (x + z * .62, y + z * 1.0)], (24, 30, 74), a)
    for k in range(5):
        f = k / 4; yy = y - z * .5 + z * .30 * k
        line(img, [(x - z * (.46 + .06 * f), yy), (x - z * (.62 - .02 * f), yy + z * .10)], max(3, int(z * .05)), (240, 196, 80), a=a)
        line(img, [(x + z * (.46 + .06 * f), yy), (x + z * (.62 - .02 * f), yy + z * .10)], max(3, int(z * .05)), (240, 196, 80), a=a)
    # face
    ex = z * .30; ey = z * .46
    img_face = Image.new("RGBA", (int(2 * ex + 6), int(2 * ey + 6)), (0, 0, 0, 0)); ImageDraw.Draw(img_face).ellipse([3, 3, 2 * ex + 3, 2 * ey + 3], fill=(214, 160, 108, int(255 * a)))
    img.paste(img_face, (int(x - ex - 3), int(y - z * .05 - ey - 3)), img_face)
    for sgn in (-1, 1):
        line(img, [(x + sgn * z * .06, y - z * .06), (x + sgn * z * .20, y - z * .10), (x + sgn * z * .26, y - z * .16)], max(3, int(z * .04)), (20, 18, 28), a=a)
        disc(img, x + sgn * z * .13, y - z * .075, max(2, z * .03), (255, 255, 255), a=a)
    line(img, [(x - z * .07, y + z * .22), (x + z * .07, y + z * .22)], max(3, int(z * .04)), (170, 70, 70), a=a)
    # broad collar
    poly(img, [(x - z * .78, y + z * 1.0), (x - z * .30, y + z * .45), (x + z * .30, y + z * .45), (x + z * .78, y + z * 1.0)], (240, 196, 80), a)
    poly(img, [(x - z * .55, y + z * 1.0), (x - z * .2, y + z * .62), (x + z * .2, y + z * .62), (x + z * .55, y + z * 1.0)], (46, 110, 170), a)

def moon_scene(img, x, ground, size, a=1.0):
    sphere(img, x, ground - size * 1.7, size * 1.1, (210, 212, 222), tex="noise", seed=9, ambient=.28, atmo=(150, 170, 220))
    gy = ground + 20; box(img, x - size * 1.6, gy, x + size * 1.6, gy + 30, 12, (170, 172, 184), a=a)
    box(img, x + size * .55, gy - 80, x + size * .65, gy, 2, (235, 235, 240)); box(img, x + size * .65, gy - 80, x + size * 1.25, gy - 40, 2, (200, 60, 70)); box(img, x + size * .65, gy - 80, x + size * .9, gy - 60, 2, (60, 80, 180))
    box(img, x - size * .6, gy - 70, x - size * .1, gy - 22, 8, (230, 200, 120)); line(img, [(x - size * .6, gy - 22), (x - size * .75, gy)], 4, (210, 210, 220)); line(img, [(x - size * .1, gy - 22), (x + size * .05, gy)], 4, (210, 210, 220))

def world(img, lt, cam, s, show=(1, 1, 1), spans=0.0, count=0.0):
    t = sky(img, cam, lt); sx = lambda wx_: 540 + (wx_ - cam) * s
    dunes(img, cam, s, t)
    if show[0]: pyramid(img, sx(wx(Y_PYR)), GROUND + 4, 560 * s)
    if show[1]: cleo(img, sx(wx(Y_CLEO)), GROUND - 150 * s, 120 * s, lt=lt)
    if show[2]: moon_scene(img, sx(wx(Y_MOON)), GROUND, 120 * s)
    # year ticks along the ground
    for y, lab, col in ((Y_PYR, "~2560 BC", GOLD), (Y_CLEO, "69 BC", (255, 230, 150)), (Y_MOON, "1969", (190, 215, 255))):
        x = sx(wx(y)); ty = GROUND + 150
        if show[(0, 1, 2)[(Y_PYR, Y_CLEO, Y_MOON).index(y)]] and -60 < x < 1140: tx(img, lab, min(max(x, 150), 930), ty, int(54 * min(1, s + .35)), "black", col, shadow=True)
    if spans > 0:
        ya = 560 + 0; xa, xb, xc = sx(wx(Y_PYR)), sx(wx(Y_CLEO)), sx(wx(Y_MOON))
        u = ease_out(spans)
        def span(x0, x1, y, col, label, n):
            xe = x0 + (x1 - x0) * u; line(img, [(x0, y), (xe, y)], 10, col); line(img, [(x0, y - 22), (x0, y + 22)], 6, col); line(img, [(xe, y - 22), (xe, y + 22)], 6, col)
            glow(img, xe, y, 44, col, .6); tx(img, f"{int(n * u):,} YEARS", (x0 + xe) / 2, y - 62, 60, "black", col, a=clamp(u * 2), shadow=True)
        span(xa, xb, 520, (255, 200, 90), "", 2491); span(xb, xc, 700, (140, 200, 255), "", 2038)
    return t

def finish(img): bloom(img, 160, .5); vignette(img, .45)

FULL = (wx(Y_PYR) + wx(Y_MOON)) / 2; S_FULL = 1080 * .86 / (wx(Y_MOON) - wx(Y_PYR))

def hook(img, lt, p, b):
    u = eio(seg(lt, 2.2, b.dur - .3)); cam = wx(Y_CLEO) + (FULL - wx(Y_CLEO)) * u; s = 1.0 + (S_FULL - 1.0) * u
    t = world(img, lt, cam, s, show=(u > .15, 1, u > .25))
    kword(img, "CLEOPATRA", 540, 300, 120, GOLD, lt, .1, .05); tx(img, "LIVED CLOSER TO", 540, 450, 52, "black", WHITE, a=eio(seg(lt, .8, 1.3)), shadow=True); 
    tx(img, "THE MOON LANDING", 540, 530, 64, "black", (150, 200, 255), a=eio(seg(lt, 1.4, 1.9)) * (1 - u), shadow=True); finish(img)

def travel(img, lt, p, b):
    tp = T(b, "pyramid", 1.0); tc = T(b, "Cleopatra", 4.0); tm = T(b, "Moon", 8.0)
    k = [(0, wx(Y_PYR) + 140), (tp, wx(Y_PYR) + 140), (tp + 1.6, wx(Y_PYR) + 140), (tc, wx(Y_CLEO)), (tc + 1.2, wx(Y_CLEO)), (tm, wx(Y_MOON) - 60), (b.dur, wx(Y_MOON) - 60)]
    cam = np.interp(lt, [a for a, _ in k], [c for _, c in k]); cam = cam if lt >= k[0][0] else k[0][1]
    s = 1.0; t = world(img, lt, cam, s, show=(1, lt > tc - 1.4, lt > tm - 1.8)); finish(img)
    lab = "THE GREAT PYRAMID" if lt < tc - .6 else ("CLEOPATRA" if lt < tm - .6 else "APOLLO 11"); tx(img, lab, 540, 330, 66, "black", WHITE, shadow=True)

def measure(img, lt, p, b):
    s = S_FULL * 1.0; u = eio(seg(lt, .4, 1.4)); w = lambda: None
    t = world(img, lt, FULL, s, spans=seg(lt, .8, 3.8)); finish(img)
    tx(img, "SHE IS CLOSER TO US", 540, 280, 60, "black", (150, 200, 255), a=eio(seg(lt, 3.2, 3.9)), shadow=True) if lt > 3.2 else tx(img, "TWO SPANS OF TIME", 540, 280, 60, "black", WHITE, shadow=True)

def kicker(img, lt, p, b):
    t = world(img, lt, wx(Y_PYR) + 140, 1.0, show=(1, 0, 0)); finish(img)
    kword(img, "ANCIENT", 540, 360, 130, GOLD, lt, .2, .06); tx(img, "EVEN TO HER", 540, 500, 70, "black", WHITE, a=eio(seg(lt, 1.2, 1.8)), shadow=True)

def T(b, w, d=None, occ=0): return b.at(w, occ, d)

N = [
 ("Cleopatra lived closer in time to the Moon landing than to the building of the Great Pyramid.", hook),
 ("The Great Pyramid went up about forty five hundred years ago. Cleopatra was born about two thousand years ago. And the Moon landing was in nineteen sixty nine.", travel),
 ("Put the gaps side by side. Twenty four ninety one years back to the pyramid. Twenty thirty eight years forward to the Moon.", measure),
 ("The pyramids were already ancient to her.", kicker),
]
def cleopatra_reel():
    return make_reel(442, "cleopatra_premium", "cleopatra lived closer to the moon landing than to the pyramids", N, style="cine", story="Great Pyramid c. 2560 BC; Cleopatra VII born 69 BC; Apollo 11 1969. Gaps: 2491 and 2038 years.")
REELS = dict(cleopatra=cleopatra_reel)
