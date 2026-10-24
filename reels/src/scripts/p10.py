"""Premium 10: the cafe wall illusion on a real lit, glazed tile wall (analytic per-pixel tiles, soft key light with gloss, moving camera).
Straight laser lines are projected in 3D along the mortar; tiles then fade away; rows line up and the illusion vanishes."""
import math
import numpy as np
from ill import *
import rt

W_, H_ = 1080, 1920
TILE = .24; ROW = .24; MORT = .017
KEY = np.array([-3.5, 6.5, -6.0], np.float32)
SS = 2

def cam_for(x=0.0, y=4.6, z=-8.6, fov=30, tgt=None): return rt.Camera((x, y, z), tgt or (x * .6, y, 0.0), fov, W_, H_)

def wall(cam, off=1.0, tiles=1.0, ss=None):
    ss = ss or SS; D = cam.rays(ss); H, W = D.shape[:2]; o = cam.pos
    t = -o[2] / np.maximum(D[..., 2], 1e-4); hx = o[0] + t * D[..., 0]; hy = o[1] + t * D[..., 1]
    row = np.floor(hy / ROW); fy = hy / ROW - row; mort = fy < (MORT / ROW)                      # grout band at the bottom of each row
    shift = np.where(row % 2 == 0, 0.0, off * TILE / 2)                                          # alternate rows shifted by half a tile (scaled)
    u = (hx + shift) / TILE; col = np.floor(u); fx = u - col; white = (col % 2 == 0)
    albedo = np.where(white, .86, .035).astype(np.float32)
    # bevel: tiles brighten at the upper/left edge and darken at the lower/right edge
    edge = np.clip((.07 - fy) / .07, 0, 1) * -.18 + np.clip((fy - .93) / .07, 0, 1) * .12 + np.clip((.05 - fx) / .05, 0, 1) * .08 - np.clip((fx - .95) / .05, 0, 1) * .10
    albedo = np.clip(albedo * (1 + edge * (1 + 3 * (~white))) + (~white) * edge * .04, 0, 1)
    gro = .34; col_rgb = np.where(mort, gro, albedo)
    P = np.stack([hx, hy, np.zeros_like(hx)], -1); Ld = rt.norm(KEY[None, None] - P); n = np.array([0, 0, -1], np.float32)
    lam = np.clip((Ld * n).sum(-1), 0, 1); dist = np.linalg.norm(KEY[None, None] - P, axis=-1); fall = 1.0 / (1 + .018 * dist ** 2)
    V = -D; Hh = rt.norm(Ld + V); spec = np.clip((Hh * n).sum(-1), 0, 1) ** 80
    irr = (.30 + 1.9 * lam * fall)
    rgb = col_rgb[..., None] * irr[..., None] * np.array([1.0, .98, .95], np.float32) + (spec * (~mort) * (.22 + .5 * (~white)))[..., None] * np.array([1, .97, .92], np.float32)
    if tiles < 1.0:     # tiles fade to a dark glaze, grout stays lit
        dark = np.full_like(rgb, .004); rgb = np.where(mort[..., None], rgb, rgb * tiles + dark * (1 - tiles))
    vig = np.clip(1.15 - ((hx - o[0]) ** 2 + (hy - 4.6) ** 2) / 12.0, .35, 1.1); rgb = rgb * vig[..., None]
    if ss > 1: rgb = rgb.reshape(H // ss, ss, W // ss, ss, 3).mean((1, 3))
    return rgb.astype(np.float32)

def render(cam, off=1.0, tiles=1.0):
    lin = wall(cam, off, tiles); return Image.fromarray((rt.tonemap(lin, 1.25) * 255 + .5).astype(np.uint8), "RGB")

def laser(img, cam, u, n=22, y0=13 * ROW, gap=ROW, half=3.2):
    """straight glowing lines along the mortar, drawn in 3D and swept left to right"""
    for r in range(n):
        yy = y0 + r * gap + MORT / 2; uu = ease_out(clamp(u * 1.5 - r * .035)); x1 = -half + 2 * half * uu
        a = cam.project((-half, yy, 0)); b = cam.project((x1, yy, 0)); line(img, [(float(a[0]), float(a[1])), (float(b[0]), float(b[1]))], 5, (255, 70, 70)); glow(img, float(b[0]), float(b[1]), 26, (255, 70, 70), .55)

def plate(img, y0=170, y1=470):
    ov = Image.new("RGBA", (1080, 1920), (0, 0, 0, 0)); ImageDraw.Draw(ov).rounded_rectangle([40, y0, 1040, y1], 44, fill=(6, 7, 14, 150)); img.paste(ov, (0, 0), ov)
def fin(img): bloom(img, 215, .26, 10); vignette(img, .5)
def lerp(a, b, t): return a + (b - a) * t
def T(b, w, d=None, occ=0): return b.at(w, occ, d)

def hook(img, lt, p, b):
    u = eio(seg(lt, 0, b.dur)); cam = cam_for(x=lerp(-.9, .3, u), z=lerp(-7.6, -8.8, u)); img.paste(render(cam)); plate(img, 170, 400)
    tx(img, "ARE THESE LINES", 540, 245, 80, "black", WHITE, shadow=True); tx(img, "TILTED?", 540, 360, 110, "black", GOLD, shadow=True, scale=1 + .03 * math.sin(lt * 5)); fin(img)
def wedge(img, lt, p, b):
    cam = cam_for(x=lerp(.3, 1.0, eio(seg(lt, 0, b.dur))), z=-8.8); img.paste(render(cam)); plate(img, 170, 400)
    tx(img, "THEY LOOK LIKE WEDGES", 540, 255, 68, "black", WHITE, shadow=True, maxw=1000); tx(img, "SLOPING UP AND DOWN", 540, 355, 56, "black", GOLD, shadow=True); fin(img)
def parallel(img, lt, p, b):
    cam = cam_for(x=1.0, z=-8.8); img.paste(render(cam)); laser(img, cam, seg(lt, .5, 3.6)); plate(img, 170, 400)
    tx(img, "PERFECTLY PARALLEL", 540, 255, 76, "black", WHITE, shadow=True, maxw=1000); tx(img, "EVERY LINE IS STRAIGHT", 540, 355, 56, "black", (255, 120, 120), a=eio(seg(lt, 2.6, 3.2)), shadow=True); fin(img)
def remove(img, lt, p, b):
    k = 1 - eio(seg(lt, .3, 1.9)); cam = cam_for(x=1.0, z=-8.8); img.paste(render(cam, tiles=k)); laser(img, cam, 1.0); plate(img, 170, 400)
    tx(img, "TAKE THE TILES AWAY", 540, 255, 70, "black", WHITE, shadow=True, maxw=1000); tx(img, "JUST STRAIGHT LINES", 540, 355, 62, "black", GOLD, a=eio(seg(lt, 1.9, 2.5)), shadow=True); fin(img)
def shift(img, lt, p, b):
    off = 1 - eio(seg(lt, .8, 3.4)); cam = cam_for(x=lerp(1.0, .2, eio(seg(lt, 0, b.dur))), z=-8.8); img.paste(render(cam, off=off)); laser(img, cam, 1.0); plate(img, 170, 400)
    tx(img, "LINE THE ROWS UP", 540, 255, 76, "black", WHITE, shadow=True); tx(img, "AND THE ILLUSION VANISHES", 540, 355, 54, "black", GOLD, a=eio(seg(lt, 3.0, 3.6)), shadow=True, maxw=1000); fin(img)
def end(img, lt, p, b):
    off = eio(seg(lt, .4, 2.0)); cam = cam_for(x=lerp(.2, -.8, eio(seg(lt, 0, b.dur))), z=lerp(-8.8, -10.2, eio(seg(lt, 0, b.dur)))); img.paste(render(cam, off=off)); plate(img, 170, 400)
    tx(img, "SHIFT EACH ROW HALF A TILE", 540, 255, 58, "black", WHITE, shadow=True, maxw=1000); tx(img, "STRAIGHT BECOMES CROOKED", 540, 355, 56, "black", GOLD, shadow=True, maxw=1000); fin(img)

N = [
 ("Are these lines tilted?", hook),
 ("They look like wedges, sloping up and down.", wedge),
 ("But every one of them is perfectly parallel. A ruler would agree.", parallel),
 ("Take the tiles away, and there are only straight lines left.", remove),
 ("Line the rows up, and the illusion disappears.", shift),
 ("Shift each row by half a tile, and straight becomes crooked.", end),
]
def cafe3d():
    return make_reel(500, "cafe3d", "are these lines tilted", N, style="cine", story="Cafe wall illusion on a lit glazed tile wall: analytic tiles, alternate rows shifted half a tile, uniform grout; laser lines are straight in 3D.")
REELS = dict(cafe3d=cafe3d)
