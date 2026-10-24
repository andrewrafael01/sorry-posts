"""Premium 07: the motion aftereffect (waterfall illusion). Stare at a rotating spiral, then a perfectly still face seems to breathe."""
import math
import numpy as np
from ill import *

D = 860; CXs, CYs = 540, 960
_yy, _xx = np.mgrid[0:D, 0:D].astype(np.float32); _x = _xx - D / 2; _y = _yy - D / 2; _r = np.hypot(_x, _y) + 1e-3; _th = np.arctan2(_y, _x); _lr = np.log(_r + 6.0)
_mask = (_r < D / 2 - 2)
def spiral_img(t, speed=1.6, arms=8, pitch=3.2):
    ph = arms * _th + pitch * _lr * arms / 2.0 - speed * t * 2 * math.pi * .6
    v = (np.sin(ph) > 0).astype(np.float32) * 255; rgba = np.dstack([v, v, v, _mask * 255]).astype(np.uint8); return Image.fromarray(rgba, "RGBA")

def bgd(img): img.paste(vgrad((12, 12, 24), (4, 4, 10), key="ma"))
def fin(img): bloom(img, 230, .18); vignette(img, .5)

def face(img, cx, cy, s, a=1.0):
    sphere(img, cx, cy, s, (232, 188, 150), tex="plain", atmo=(255, 210, 170), ambient=.4)
    for sx in (-1, 1):
        disc(img, cx + sx * s * .36, cy - s * .12, s * .16, (250, 250, 250)); disc(img, cx + sx * s * .36, cy - s * .10, s * .08, (60, 40, 30)); disc(img, cx + sx * s * .38, cy - s * .13, s * .025, (255, 255, 255))
        line(img, [(cx + sx * s * .6, cy - s * .38), (cx + sx * s * .18, cy - s * .36)], max(5, int(s * .035)), (80, 54, 40))
    line(img, [(cx, cy - s * .05), (cx - s * .06, cy + s * .22), (cx + s * .06, cy + s * .24)], max(4, int(s * .02)), (190, 140, 110))
    pts = [(cx + s * .42 * math.cos(math.pi * (.15 + .7 * u)), cy + s * .34 + s * .22 * math.sin(math.pi * (.15 + .7 * u))) for u in np.linspace(0, 1, 18)]
    line(img, pts, max(6, int(s * .045)), (170, 60, 70))
    # hair
    for k in range(14):
        th = math.pi * (1.08 + .84 * k / 13); x = cx + s * 1.0 * math.cos(th); y = cy + s * 1.0 * math.sin(th); disc(img, x, y + s * .12, s * .2, (70, 46, 34))

def hook(img, lt, p, b):
    bgd(img); im = spiral_img(lt); img.paste(im, (CXs - D // 2, CYs - D // 2), im); disc(img, CXs, CYs, 18, (255, 60, 60)); glow(img, CXs, CYs, 40, (255, 60, 60), .6)
    tx(img, "STARE AT THE DOT", 540, 280, 88, "black", WHITE, shadow=True); tx(img, "DON'T LOOK AWAY", 540, 400, 70, "black", GOLD, shadow=True); fin(img)
def stare(img, lt, p, b):
    bgd(img); tt = 4.0 + lt; im = spiral_img(tt); img.paste(im, (CXs - D // 2, CYs - D // 2), im); disc(img, CXs, CYs, 18, (255, 60, 60)); glow(img, CXs, CYs, 40, (255, 60, 60), .6)
    left = max(0, b.dur - lt - .0); tx(img, f"{int(math.ceil(left))}", 540, 330, 140, "black", GOLD, shadow=True); tx(img, "KEEP YOUR EYES ON THE DOT", 540, 440, 50, "black", WHITE, shadow=True); fin(img)
def still(img, lt, p, b):
    bgd(img); face(img, CXs, CYs, 330); tx(img, "NOW LOOK AT THIS FACE", 540, 270, 66, "black", WHITE, shadow=True, maxw=1000); tx(img, "DOES IT MOVE?", 540, 400, 92, "black", GOLD, shadow=True); fin(img)
def proof(img, lt, p, b):
    bgd(img); face(img, CXs, CYs, 330); line(img, [(CXs - 330, CYs + 330 + 40), (CXs + 330, CYs + 330 + 40)], 4, (255, 255, 255), a=.5); line(img, [(CXs - 330 - 40, CYs - 330), (CXs - 330 - 40, CYs + 330)], 4, (255, 255, 255), a=.5)
    tx(img, "NOTHING IS MOVING", 540, 300, 78, "black", WHITE, shadow=True); tx(img, "THE FRAME IS PERFECTLY STILL", 540, 420, 52, "black", GOLD, shadow=True); fin(img)
def why(img, lt, p, b):
    bgd(img); k = eio(seg(lt, .2, 1.2)); face(img, CXs, CYs + 30, 300 * (1 + .0)); tx(img, "YOUR MOTION DETECTORS", 540, 270, 58, "black", WHITE, shadow=True, maxw=1000); tx(img, "GOT TIRED", 540, 400, 96, "black", GOLD, shadow=True); fin(img)
def end(img, lt, p, b):
    bgd(img); face(img, CXs, CYs, 330); tx(img, "THE MOTION YOU SAW", 540, 300, 70, "black", WHITE, shadow=True); tx(img, "WAS IN YOUR BRAIN", 540, 420, 80, "black", GOLD, shadow=True); fin(img)

N = [
 ("Stare at the dot in the middle. Do not look away.", hook),
 ("Keep your eyes on it. Do not follow the spiral. Your motion detectors are getting tired.", stare),
 ("Now look at this face. Does it move?", still),
 ("Nothing here is moving. This frame is perfectly still.", proof),
 ("After watching motion in one direction, your brain overcorrects, and still things seem to move the other way.", why),
 ("The motion was never on the screen. It was in your head.", end),
]
def aftereffect():
    return make_reel(497, "stare_aftereffect", "stare at the dot then look at the face", N, style="cine", story="Motion aftereffect (waterfall illusion): log-spiral rotating about 13 s, then a static drawn face. No on-screen motion in the static scenes.")
REELS = dict(aftereffect=aftereffect)
