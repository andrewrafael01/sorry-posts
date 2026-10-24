"""Premium 08: the checker-shadow illusion as a real ray-traced 3D scene. Soft area-light shadow, glossy cylinder, moving camera;
A and B are calibrated to identical radiance; proof by a connecting strip, by masking everything else, and by switching the shadow off."""
import math
import numpy as np
from ill import *
import rt

W_, H_ = 1080, 1920
_SC = {}
def scene():
    if "s" not in _SC: _SC["s"] = rt.Scene(res=2048, nsamp=96)
    return _SC["s"]
def cam_for(pos, tgt=(0.9, 0.0, 0.2), fov=32, shift=(0.0, 0.005)): return rt.Camera(pos, tgt, fov, W_, H_, shift=shift)
SS = 2

def frame(pos, tgt=(0.9, 0.0, 0.2), fov=32, shadow=1.0, ss=None):
    sc = scene(); cam = cam_for(pos, tgt, fov); lin = sc.render(cam, ss=ss or SS, shadow=shadow); return Image.fromarray((rt.tonemap(lin) * 255 + .5).astype(np.uint8), "RGB"), cam

def lerp3(a, b, t): return tuple(a[i] + (b[i] - a[i]) * t for i in range(3))

def A_B(cam):
    sc = scene(); out = []
    for sq in (sc.A, sc.B):
        x, z = sc.sq_center(*sq); out.append((cam.project((x, 0, z)), [cam.project((x + dx, 0, z + dz)) for dx, dz in ((-.5, -.5), (.5, -.5), (.5, .5), (-.5, .5))]))
    return out

def gray_at(img, p, r=6):
    x, y = int(p[0]), int(p[1]); box_ = img.crop((x - r, y - r, x + r, y + r)).resize((1, 1), Image.BOX); return box_.getpixel((0, 0))

def tag(img, p, name, a=1.0, lift=110):
    x, y = p; y2 = y - lift; line(img, [(x, y - 12), (x, y2 + 30)], 3, (255, 255, 255), a=.8 * a); disc(img, x, y, 7, (255, 255, 255), a=a)
    box(img, x - 40, y2 - 36, x + 40, y2 + 36, 22, (255, 255, 255), a=.95 * a); tx(img, name, x, y2 - 2, 56, "black", (12, 14, 24), a=a, shadow=False)

def fin(img, vig=.55): bloom(img, 215, .30, 10); vignette(img, vig)

def bokeh(img, lt):
    rs = np.random.RandomState(8)
    for k in range(16):
        x = rs.rand() * 1080; y = 40 + rs.rand() * 520; r = 26 + rs.rand() * 52; ph = rs.rand() * 6.28; a = .05 + .05 * math.sin(lt * .7 + ph)
        x = (x + 14 * math.sin(lt * .3 + ph)) % 1080; disc(img, x, y - 6 * lt % 30, r, (150 + int(60 * rs.rand()), 170, 255), a=a)

def draw_scene(img, lt, pos, tgt=(0.9, 0.0, 0.2), shadow=1.0, labels=1.0, strip=0.0, mask=0.0, swatch=0.0, lift=110):
    pos = (pos[0] + .22 * math.sin(lt * .5), pos[1] + .12 * math.sin(lt * .35), pos[2] + .10 * math.cos(lt * .4))
    base, cam = frame(pos, tgt, shadow=shadow); (pa, qa), (pb, qb) = A_B(cam)
    ca, cb = gray_at(base, pa), gray_at(base, pb); gv = tuple(int((ca[i] + cb[i]) / 2) for i in range(3))
    if mask > 0:
        keep = Image.new("L", base.size, 0); kd = ImageDraw.Draw(keep)
        for q in (qa, qb): kd.polygon([(float(x), float(y)) for x, y in q], fill=255)
        dark = Image.new("RGB", base.size, (0, 0, 0)); base = Image.composite(base, Image.blend(base, dark, mask), keep)
    img.paste(base)
    if mask < .5: bokeh(img, lt)
    if strip > 0:
        u = ease_out(strip); x0, y0 = float(pa[0]), float(pa[1]); x1, y1 = x0 + (float(pb[0]) - x0) * u, y0 + (float(pb[1]) - y0) * u
        line(img, [(x0, y0), (x1, y1)], 26, gv); disc(img, x0, y0, 14, gv)
        if u > .96: disc(img, float(pb[0]), float(pb[1]), 14, gv)
    if labels > 0: tag(img, (float(pa[0]), float(pa[1])), "A", labels, lift); tag(img, (float(pb[0]), float(pb[1])), "B", labels, lift)
    if swatch > 0:
        for i, (nm, xx) in enumerate((("A", 300), ("B", 780))):
            box(img, xx - 150, 1500, xx + 150, 1640, 26, gv, a=swatch); tx(img, f"{nm} = #{gv[0]:02X}{gv[1]:02X}{gv[2]:02X}", xx, 1570, 40, "black", (255, 255, 255), a=swatch, shadow=False)
    return pa, pb, gv

P0 = (2.0, 10.4, -14.0)
def hook(img, lt, p, b):
    u = eio(seg(lt, 0, b.dur)); draw_scene(img, lt, lerp3((3.2, 8.6, -11.4), P0, u)); tx(img, "WHICH SQUARE IS DARKER?", 540, 250, 66, "black", WHITE, shadow=True, maxw=1000); tx(img, "A OR B", 540, 380, 128, "black", GOLD, a=eio(seg(lt, .5, 1.0)), shadow=True); fin(img)
def same(img, lt, p, b):
    t0 = T(b, "same", 2.5); draw_scene(img, lt, P0, swatch=eio(seg(lt, t0, t0 + .5))); tx(img, "A LOOKS DARK. B LOOKS LIGHT.", 540, 250, 52, "black", WHITE, shadow=True, maxw=1000)
    tx(img, "THEY'RE THE SAME GRAY", 540, 360, 78, "black", GOLD, a=eio(seg(lt, t0, t0 + .5)), shadow=True, maxw=1000); fin(img)
def bar(img, lt, p, b):
    draw_scene(img, lt, P0, labels=.9, strip=seg(lt, .6, b.dur - .8)); tx(img, "A STRIP OF THAT GRAY", 540, 250, 60, "black", WHITE, shadow=True, maxw=1000); tx(img, "JOINS THEM", 540, 370, 92, "black", GOLD, shadow=True); fin(img)
def mask(img, lt, p, b):
    k = eio(seg(lt, .4, 1.6)); draw_scene(img, lt, P0, labels=.9, mask=k, swatch=eio(seg(lt, 1.8, 2.4))); tx(img, "REMOVE EVERYTHING ELSE", 540, 250, 58, "black", WHITE, shadow=True, maxw=1000)
    tx(img, "NOTHING TO ARGUE ABOUT", 540, 370, 62, "black", GOLD, a=eio(seg(lt, 1.8, 2.4)), shadow=True, maxw=1000); fin(img)
def why(img, lt, p, b):
    s = 1 - eio(seg(lt, .8, 2.2)); s = s if lt < 3.6 else eio(seg(lt, 3.6, 5.0)); draw_scene(img, lt, P0, shadow=s, labels=.9)
    tx(img, "TURN THE SHADOW OFF", 540, 250, 66, "black", WHITE, shadow=True, maxw=1000); tx(img, "AND B IS THE LIGHT SQUARE", 540, 370, 56, "black", GOLD, a=eio(seg(lt, 1.8, 2.6)), shadow=True, maxw=1000); fin(img)
def end(img, lt, p, b):
    u = eio(seg(lt, 0, b.dur)); draw_scene(img, lt, lerp3(P0, (1.2, 12.0, -16.4), u)); tx(img, "YOU STILL SEE", 540, 250, 66, "black", WHITE, shadow=True); tx(img, "B AS LIGHTER", 540, 380, 112, "black", GOLD, shadow=True); fin(img)
def T(b, w, d=None, occ=0): return b.at(w, occ, d)

N = [
 ("Which one is darker? Square A, or square B?", hook),
 ("A looks dark. B looks light. But they are the exact same shade of gray.", same),
 ("Watch. A strip of that gray joins them, and it never changes color.", bar),
 ("Remove everything else, and there is nothing left to argue about.", mask),
 ("The shadow fools you. Turn it off, and B really is the light square. Your brain subtracts the shadow, so it lies about the color.", why),
 ("And even now that you know, you still see B as lighter.", end),
]
def checker3d():
    return make_reel(498, "checker3d", "which square is darker", N, style="cine", story="Ray-traced Adelson checker-shadow: area-light soft shadow baked to a floor texture, numeric calibration so A (dark, lit) and B (light, in shadow) have identical linear radiance; shadow strength animated for the explanation.")
REELS = dict(checker3d=checker3d)
