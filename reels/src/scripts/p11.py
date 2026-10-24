"""Premium 11: the motion aftereffect (waterfall illusion) with real lit scenes: a spiral plate turning under spotlight, then a perfectly still ray-traced scene that seems to drift."""
import math
import numpy as np
from ill import *
import rt, rt2
from scripts import p08, p09

_F = {}
def pf():
    p09.floor(); return p09._F
def spiral_albedo(t, speed=1.0, arms=8, pitch=3.0):
    F = pf(); X, Z = F["r"], F["th"]; r = F["r"]; th = F["th"]
    ph = arms * th + pitch * np.log(r + .25) * arms / 2.2 - speed * t * 2 * math.pi * .55
    v = (np.sin(ph) > 0).astype(np.float32) * .88 + .03
    out = np.where(F["in"], v, .028).astype(np.float32); rgb = np.dstack([out, out, out])
    return rgb
def render_spiral(pos, t, speed=1.0, tgt=(0.0, 0.0, 0.0), fov=34):
    f = p09.floor(); cam = p09.cam_for(pos, tgt, fov); lin = f.render(cam, spiral_albedo(t, speed), ss=2, rim=(p09.PR + .12, .07))
    return Image.fromarray((rt.tonemap(lin, 1.25) * 255 + .5).astype(np.uint8), "RGB"), cam
def dot(img, cam, a=1.0):
    x, y = cam.project((0, 0.02, 0)); disc(img, float(x), float(y), 17, (255, 50, 50), a=a); glow(img, float(x), float(y), 46, (255, 50, 50), .7 * a)
def still(img):
    im, cam = p08.frame(p08.P0, tgt=(0.9, 0.0, 0.2)); img.paste(im)
def plate(img, y0=170, y1=470): p09.plate(img, y0, y1)
def fin(img): bloom(img, 225, .22, 10); vignette(img, .5)
def T(b, w, d=None, occ=0): return b.at(w, occ, d)

OBL = (4.5, 11.5, -12.0); TOP = (0.0, 15.5, -0.01)
def hook(img, lt, p, b):
    u = eio(seg(lt, 0, b.dur)); im, cam = render_spiral(p09.lerp3(OBL, TOP, u * .8), lt); img.paste(im); dot(img, cam); plate(img, 170, 440)
    tx(img, "STARE AT THE DOT", 540, 250, 86, "black", WHITE, shadow=True); tx(img, "DON'T LOOK AWAY", 540, 365, 66, "black", GOLD, shadow=True); fin(img)
def stare(img, lt, p, b):
    im, cam = render_spiral(TOP, lt + 4.0); img.paste(im); dot(img, cam); plate(img, 190, 440)
    left = max(0, b.dur - lt); tx(img, f"{int(math.ceil(left))}", 540, 270, 120, "black", GOLD, shadow=True); tx(img, "KEEP YOUR EYES ON THE DOT", 540, 385, 46, "black", WHITE, shadow=True); fin(img)
def still1(img, lt, p, b):
    still(img); plate(img, 170, 440); tx(img, "NOW LOOK AT THIS", 540, 250, 76, "black", WHITE, shadow=True); tx(img, "DOES IT MOVE?", 540, 365, 92, "black", GOLD, shadow=True); fin(img)
def proof(img, lt, p, b):
    still(img); plate(img, 170, 440); tx(img, "NOTHING IS MOVING", 540, 250, 78, "black", WHITE, shadow=True); tx(img, "THIS FRAME IS PERFECTLY STILL", 540, 365, 50, "black", GOLD, shadow=True); fin(img)
def why(img, lt, p, b):
    still(img); plate(img, 170, 440); tx(img, "YOUR MOTION DETECTORS", 540, 250, 58, "black", WHITE, shadow=True, maxw=1000); tx(img, "GOT TIRED", 540, 365, 96, "black", GOLD, shadow=True); fin(img)
def end(img, lt, p, b):
    still(img); plate(img, 170, 440); tx(img, "THE MOTION YOU SAW", 540, 250, 70, "black", WHITE, shadow=True); tx(img, "WAS IN YOUR BRAIN", 540, 365, 80, "black", GOLD, shadow=True); fin(img)

N = [
 ("Stare at the dot in the middle. Do not look away.", hook),
 ("Keep your eyes on it. Do not follow the spiral. Your motion detectors are getting tired.", stare),
 ("Now look at this. Does it move?", still1),
 ("Nothing here is moving. This frame is perfectly still.", proof),
 ("After watching motion in one direction, your brain overcorrects, and still things seem to move the other way.", why),
 ("The motion was never on the screen. It was in your head.", end),
]
def after3d():
    return make_reel(501, "after3d", "stare at the dot then look at the scene", N, style="cine", story="Motion aftereffect: lit spiral plate rotating about 13 s with a fixation dot, then a perfectly static ray-traced scene.")
REELS = dict(after3d=after3d)
