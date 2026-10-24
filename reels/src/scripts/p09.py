"""Premium 09: the Fraser spiral as a lit 3D plate. The pattern slowly turns, the camera descends to a top-down view, one ring is traced in 3D, rings tint one by one."""
import math, colorsys
import numpy as np
from ill import *
import rt, rt2

RES = 2048; EXT = 6.5; PR = 4.3; RINGW = .36; NSEG = 52
_F = {}
def floor():
    if "f" not in _F:
        _F["f"] = rt2.Floor(ext=EXT, res=RES); X, Z = _F["f"].X, _F["f"].Z; r = np.hypot(X, Z); _F["r"] = r; _F["th"] = np.arctan2(Z, X); _F["k"] = np.floor(r / RINGW); _F["fr"] = (r - _F["k"] * RINGW) / RINGW; _F["in"] = r <= PR
    return _F["f"]
NR = int(PR // RINGW)

def albedo(rot=0.0, tint=0, tphase=0.0, dim=1.0):
    floor(); th = _F["th"] + rot; k = _F["k"]; fr = _F["fr"]
    cord = np.sin(NSEG * th + 1.2 * fr * math.pi) > 0; g = ((np.floor((NSEG * th) / math.pi) + k) % 2 == 0)
    v = np.where(cord, np.where(g, .03, .20), np.where(g, .92, .62)).astype(np.float32)
    rgb = np.dstack([v, v, v])
    if tint > 0:
        for i in range(min(tint, NR)):
            kk = NR - 1 - i; m = (k == kk) & _F["in"]; col = np.array(colorsys.hsv_to_rgb((kk * .07 + tphase) % 1, .8, 1.0), np.float32)
            rgb[m] = rgb[m] * .25 + col[None] * (.12 + .9 * v[m][:, None])
    out = np.where(_F["in"][..., None], rgb * dim, np.array([.028, .028, .033], np.float32)[None, None])
    return out.astype(np.float32)

W_, H_ = 1080, 1920
def cam_for(pos, tgt=(0.0, 0.0, 0.0), fov=34, shift=(0.0, 0.0), up=(0, 1, 0)): return rt.Camera(pos, tgt, fov, W_, H_, shift=shift, up=up)
SS = 2
def render(pos, rot=0.0, tint=0, tphase=0.0, tgt=(0.0, 0.0, 0.0), fov=34, up=(0, 1, 0), ss=None):
    f = floor(); cam = cam_for(pos, tgt, fov, up=up); lin = f.render(cam, albedo(rot, tint, tphase), ss=ss or SS, rim=(PR + .12, .07))
    return Image.fromarray((rt.tonemap(lin, 1.25) * 255 + .5).astype(np.uint8), "RGB"), cam
def lerp3(a, b, t): return tuple(a[i] + (b[i] - a[i]) * t for i in range(3))
def circle_pts(cam, rad, u, n=120):
    pts = []
    for a in np.linspace(-math.pi / 2, -math.pi / 2 + 2 * math.pi * u, max(2, int(n * u) + 2)): x, y = cam.project((rad * math.cos(a), 0.02, rad * math.sin(a))); pts.append((float(x), float(y)))
    return pts
def plate(img, y0=170, y1=470):
    ov = Image.new("RGBA", (1080, 1920), (0, 0, 0, 0)); ImageDraw.Draw(ov).rounded_rectangle([40, y0, 1040, y1], 44, fill=(6, 7, 14, 150)); img.paste(ov, (0, 0), ov)
def fin(img): bloom(img, 215, .28, 10); vignette(img, .5)
OBL = (4.5, 11.5, -12.0); TOP = (0.0, 15.5, -0.01)     # oblique start, top-down end (up vector handled by tiny z offset)
def hook(img, lt, p, b):
    u = eio(seg(lt, 0, b.dur)); im, cam = render(lerp3(OBL, TOP, u * .55), rot=lt * .06); img.paste(im)
    plate(img); tx(img, "WHICH WAY", 540, 230, 92, "black", WHITE, shadow=True); tx(img, "DOES IT SPIRAL?", 540, 350, 92, "black", GOLD, shadow=True); fin(img)
def follow(img, lt, p, b):
    u = seg(lt, .3, b.dur - .4); im, cam = render(lerp3(lerp3(OBL, TOP, .55), TOP, eio(seg(lt, 0, b.dur))), rot=(lt + 2) * .06); img.paste(im)
    for k in range(16):
        uu = max(0, u - k * .014); th = 2 * math.pi * 2.3 * uu + .3; rr = (PR - .2) * (1 - .92 * uu); x, y = cam.project((rr * math.cos(th), .02, rr * math.sin(th))); disc(img, float(x), float(y), 18 - k * .7, (255, 80, 80), a=(1 - k / 16) * .95)
    plate(img, 200, 380); tx(img, "FOLLOW IT WITH YOUR EYES", 540, 290, 66, "black", WHITE, shadow=True); fin(img)
def circle(img, lt, p, b):
    im, cam = render(TOP, rot=(lt + 5) * .06); img.paste(im); u = eio(seg(lt, .5, 3.0)); rad = (4 + .5) * RINGW; pts = circle_pts(cam, rad, u)
    if len(pts) > 1: line(img, pts, 12, (255, 60, 60)); glow(img, pts[-1][0], pts[-1][1], 56, (255, 60, 60), .8)
    plate(img); tx(img, "THERE IS NO SPIRAL", 540, 270, 78, "black", WHITE, shadow=True); tx(img, "THIS LINE CLOSES ON ITSELF", 540, 390, 52, "black", (255, 120, 120), a=eio(seg(lt, 2.6, 3.2)), shadow=True); fin(img)
def tint(img, lt, p, b):
    n = int(NR * eio(seg(lt, .3, b.dur - .6))); im, cam = render(TOP, rot=(lt + 8) * .06, tint=n, tphase=lt * .12); img.paste(im)
    plate(img); tx(img, "EVERY RING", 540, 270, 84, "black", WHITE, shadow=True); tx(img, "A PERFECT CIRCLE", 540, 390, 84, "black", GOLD, shadow=True); fin(img)
def why(img, lt, p, b):
    u = eio(seg(lt, 0, b.dur)); pos = lerp3((0.0, 5.0, -3.2), (1.2, 3.6, -1.6), u); im, cam = render(pos, rot=(lt + 12) * .06, tgt=(1.8, 0.0, 0.4), fov=30); img.paste(im)
    plate(img); tx(img, "THE TILTED CORDS", 540, 270, 78, "black", WHITE, shadow=True); tx(img, "LEAN THE SAME WAY", 540, 390, 78, "black", GOLD, shadow=True); fin(img)
def end(img, lt, p, b):
    u = eio(seg(lt, 0, b.dur)); im, cam = render(lerp3(TOP, (3.0, 12.5, -9.5), u * .5), rot=(lt + 15) * .06); img.paste(im)
    plate(img); tx(img, "NOW YOU KNOW", 540, 270, 78, "black", WHITE, shadow=True); tx(img, "AND YOU STILL SEE A SPIRAL", 540, 390, 54, "black", GOLD, shadow=True); fin(img)
def T(b, w, d=None, occ=0): return b.at(w, occ, d)

N = [
 ("Which way does this spiral?", hook),
 ("It looks like a spiral. Follow it inward with your eyes.", follow),
 ("But there is no spiral here. This line closes on itself. It is a perfect circle.", circle),
 ("Every single ring is the same. Dozens of separate, concentric circles.", tint),
 ("The tilted pieces all lean the same way, so your brain connects them into a spiral.", why),
 ("And even now, you still see it spiral.", end),
]
def spiral3d():
    return make_reel(499, "spiral3d", "this spiral is not a spiral", N, style="cine", story="Fraser spiral printed on a lit 3D plate (rt2): ring index depends only on radius so every ring is a closed circle; the pattern turns slowly; one ring traced in 3D, then rings tinted.")
REELS = dict(spiral3d=spiral3d)
