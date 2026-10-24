"""Premium 16: the gray strawberries. Every berry pixel is neutral gray (R=G=B); only the cyan cast on everything else makes the brain paint them red."""
import math
import numpy as np
from ill import *
from scripts import p09

BW, BH = 380, 470
_C = {}
def prof(t):
    """half-width of a strawberry at normalized height t (0 top, 1 tip): round shoulders, long taper"""
    t = np.asarray(t, np.float32)
    top = np.sqrt(np.clip(1 - ((.30 - t) / .30) ** 2, 0, 1)); low = np.clip(1 - (np.clip(t - .30, 0, None) / .70) ** 1.55, 0, 1) ** .72
    return np.where(t < .30, top, low) * .98
def berry_sprite(seed):
    """neutral-gray shaded strawberry with seed dimples and a green calyx"""
    rs = np.random.RandomState(seed)
    yy, xx = np.mgrid[0:BH, 0:BW].astype(np.float32); t = (yy - 14) / (BH - 28); u = (xx - BW / 2) / (BW / 2)
    w = np.maximum(prof(t), 1e-3); inside = ((t >= 0) & (t <= 1)).astype(np.float32)
    q = np.clip(1 - (u / w) ** 2, 0, 1); h = np.sqrt(q) * (.62 + .38 * w)
    gy, gx = np.gradient(h); nx, ny, nz = -gx * 11, -gy * 11, np.ones_like(h); n = np.sqrt(nx * nx + ny * ny + nz * nz); nx, ny, nz = nx / n, ny / n, nz / n
    dark = np.zeros_like(h); hi = np.zeros_like(h)
    for r_ in range(17):
        tt = .09 + r_ * .052
        for c_ in range(-5, 6):
            uu = (c_ * .17 + (.085 if r_ % 2 else 0)); ww = float(prof(tt))
            if abs(uu) > ww * .88: continue
            sc_ = .6 + .4 * ww
            px = BW / 2 + uu * BW / 2 + rs.randn() * 1.5; py = 14 + tt * (BH - 28) + rs.randn() * 1.5
            d2 = ((xx - px) ** 2 + ((yy - py) * 1.15) ** 2) / (30.0 * sc_)
            dark += np.exp(-d2 * 1.4) * .75; hi += np.exp(-(((xx - px + 2.5) ** 2 + (yy - py + 3) ** 2) / (8.0 * sc_))) * .6
    lam = np.clip(nx * -.5 + ny * -.55 + nz * .67, 0, 1)
    spec = np.clip(nx * -.35 + ny * -.45 + nz * .82, 0, 1) ** 36 * .5
    g = .16 + .68 * lam + spec + hi * .20 - dark * .26
    g = np.clip(g * .80, 0, 1) * .90 + .05
    g = g * (1 - np.clip(1 - np.sqrt(q), 0, 1) ** 2.4 * .45)
    alpha = np.clip(inside * np.clip(np.sqrt(q) * 36, 0, 1), 0, 1)
    body = np.dstack([g, g, g]).astype(np.float32)
    leaf = np.zeros((BH, BW), np.float32); lg = np.zeros((BH, BW, 3), np.float32)
    cx, cy = BW / 2, 34.0
    for k in range(9):
        a = -math.pi / 2 + (k - 4) * .46 + rs.randn() * .05; L = 92 + rs.rand() * 26; wd = 20
        dx, dy = math.cos(a), math.sin(a); tt_ = (xx - cx) * dx + (yy - cy) * dy; s = -(xx - cx) * dy + (yy - cy) * dx
        m = np.clip((1 - np.abs(s) / (wd * np.sin(np.clip(tt_ / L, 0, 1) * math.pi) + .5)) * 6, 0, 1) * (tt_ > -4) * (tt_ < L)
        shade = .55 + .45 * np.clip(tt_ / L, 0, 1); col = np.array([.17, .50, .22], np.float32)[None, None] * shade[..., None]
        lg = np.where(m[..., None] > leaf[..., None], col, lg); leaf = np.maximum(leaf, m)
    stem = ((np.abs(xx - cx - 5) < 6) & (yy > cy - 36) & (yy < cy + 6)).astype(np.float32)
    lg = np.where(stem[..., None] > leaf[..., None], np.array([.22, .42, .17], np.float32), lg); leaf = np.maximum(leaf, stem)
    rgb = body * alpha[..., None] * (1 - leaf[..., None]) + lg * leaf[..., None]
    return rgb, np.clip(alpha + leaf, 0, 1), alpha

LAYOUT = [  # x, y, rot deg, scale
 (330, 880, 24, .86), (760, 860, -26, .84), (540, 870, 4, .92),
 (250, 1150, 40, .95), (835, 1150, -38, .93), (540, 1180, -6, 1.08), (420, 1420, 18, .90), (680, 1420, -14, .92)]
def scene():
    if "s" in _C: return _C["s"]
    H, Wd = 1920, 1080; yy, xx = np.mgrid[0:H, 0:Wd].astype(np.float32)
    # tablecloth: soft gray gradient with a fine weave
    bg = .86 - .20 * ((yy - 950) / 1100) ** 2 + .015 * np.random.RandomState(2).randn(H, Wd); bg = np.dstack([bg, bg, bg]).astype(np.float32)
    pe = ((xx - 540) / 500) ** 2 + ((yy - 1190) / 560) ** 2
    shadow = np.exp(-np.clip(pe - 1, 0, 9) * 2.2) * (pe > 1) * .33
    bg = bg * (1 - shadow[..., None])
    rimz = np.clip((1 - pe) * 12, 0, 1); plate_v = .93 - .16 * np.clip(pe, 0, 1) ** 2 - .12 * np.exp(-((np.sqrt(pe) - .93) / .035) ** 2)
    pl = np.dstack([plate_v] * 3).astype(np.float32); bg = bg * (1 - rimz[..., None]) + pl * rimz[..., None]
    lay = np.zeros((H, Wd, 3), np.float32); al = np.zeros((H, Wd), np.float32); sh = np.zeros((H, Wd), np.float32)
    for i, (x, y, rot, sc) in enumerate(LAYOUT):
        rgb, a, body = berry_sprite(40 + i)
        im = Image.fromarray(np.dstack([np.clip(rgb * 255, 0, 255), a * 255]).astype(np.uint8), "RGBA")
        im = im.resize((int(BW * sc), int(BH * sc)), Image.LANCZOS).rotate(rot, resample=Image.BICUBIC, expand=True)
        arr = np.asarray(im).astype(np.float32) / 255.0; h_, w_ = arr.shape[:2]; x0, y0 = int(x - w_ / 2), int(y - h_ / 2)
        # soft contact shadow under each berry
        sm = Image.fromarray((arr[..., 3] * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(22)); sma = np.asarray(sm).astype(np.float32) / 255.0 * .5
        sx0, sy0 = x0 + 26, y0 + 34
        ys0, ys1, xs0, xs1 = max(0, sy0), min(H, sy0 + h_), max(0, sx0), min(Wd, sx0 + w_)
        if ys1 > ys0 and xs1 > xs0: sh[ys0:ys1, xs0:xs1] = np.maximum(sh[ys0:ys1, xs0:xs1], sma[ys0 - sy0:ys1 - sy0, xs0 - sx0:xs1 - sx0])
        ys0, ys1, xs0, xs1 = max(0, y0), min(H, y0 + h_), max(0, x0), min(Wd, x0 + w_)
        if ys1 <= ys0 or xs1 <= xs0: continue
        sub = arr[ys0 - y0:ys1 - y0, xs0 - x0:xs1 - x0]; a_ = sub[..., 3:4]
        lay[ys0:ys1, xs0:xs1] = lay[ys0:ys1, xs0:xs1] * (1 - a_) + sub[..., :3] * a_
        al[ys0:ys1, xs0:xs1] = np.clip(al[ys0:ys1, xs0:xs1] * (1 - a_[..., 0]) + a_[..., 0], 0, 1)
    bg = bg * (1 - sh[..., None] * (1 - al[..., None]))
    _C["s"] = (bg, lay, al); return _C["s"]

CAST = np.array([.22, .84, 1.0], np.float32)
def frame(img, tint, zoom=1.0, cy=1090):
    bg, lay, al = scene(); tint = np.asarray(tint, np.float32); tint = tint[None, :, None] if tint.ndim == 1 else tint; m = 1 + (CAST - 1) * tint
    lm = 1 + (CAST ** .7 - 1) * tint * (lay[..., 1] > lay[..., 0] * 1.25)[..., None]
    out = bg * m * (1 - al[..., None]) + lay * lm * al[..., None]
    im = Image.fromarray(np.clip(out * 255 + .5, 0, 255).astype(np.uint8), "RGB")
    if zoom != 1.0:
        bw, bh = 1080 / zoom, 1920 / zoom; x0 = 540 - bw / 2; y0 = min(max(cy - bh / 2, 0), 1920 - bh)
        im = im.crop((int(x0), int(y0), int(x0 + bw), int(y0 + bh))).resize((1080, 1920), Image.BICUBIC)
    img.paste(im)
def fin(img): bloom(img, 235, .16, 10); vignette(img, .42)
def plate(img, y0=170, y1=440): p09.plate(img, y0, y1)

def hook(img, lt, p, b):
    frame(img, 1.0, 1.0 + .03 * lt / b.dur); plate(img, 170, 440)
    tx(img, "WHAT COLOR ARE", 540, 250, 76, "black", WHITE, shadow=True); tx(img, "THESE STRAWBERRIES?", 540, 365, 78, "black", GOLD, shadow=True, maxw=1000); fin(img)
def remove(img, lt, p, b):
    k = eio(seg(lt, b.dur * .35, b.dur - .5)); frame(img, 1.0 - k, 1.03); plate(img, 170, 440)
    tx(img, "REMOVE THE BLUE", 540, 250, 82, "black", WHITE, shadow=True); tx(img, "AND LOOK AGAIN", 540, 365, 82, "black", GOLD, shadow=True); fin(img)
def swatch(img, lt, p, b):
    # a divider sweeps across the very same berries: tinted on one side, untinted on the other
    k = eio(seg(lt, .5, b.dur - .6)); xd = -40 + k * 1160; xs = np.arange(1080, dtype=np.float32)
    tint = np.clip((xs - xd) / 36 + .5, 0, 1); frame(img, tint, 1.03); plate(img, 170, 440)
    d = ImageDraw.Draw(img); xx = int(xd)
    if 0 < xx < 1080: d.line([(xx, 470), (xx, 1900)], fill=(255, 255, 255), width=4)
    tx(img, "THEY ARE GRAY", 540, 250, 96, "black", WHITE, shadow=True); tx(img, "SAME BERRIES. SAME PIXELS.", 540, 365, 56, "black", GOLD, shadow=True, maxw=1000); fin(img)
def breathe(img, lt, p, b):
    k = .5 - .5 * math.cos(2 * math.pi * lt / 3.2); frame(img, k, 1.03); plate(img, 170, 440)
    tx(img, "THE BLUE TINT", 540, 250, 84, "black", WHITE, shadow=True); tx(img, "TRICKS YOUR BRAIN", 540, 365, 74, "black", GOLD, shadow=True); fin(img)
def end(img, lt, p, b):
    k = 1.0 - (1 - .5 * (1 + math.cos(2 * math.pi * lt / 1.5))) * (1 - eio(seg(lt, b.dur - 1.2, b.dur - .3)))
    frame(img, k, 1.03 - .03 * eio(seg(lt, b.dur - 1.2, b.dur))); plate(img, 170, 440)
    tx(img, "THE RED ISN'T THERE", 540, 250, 80, "black", WHITE, shadow=True, maxw=1000); tx(img, "YOUR BRAIN ADDED IT", 540, 365, 74, "black", GOLD, shadow=True, maxw=1000); fin(img)

N = [
 ("What color are these strawberries?", hook),
 ("Red, right? Now watch what happens when I remove the blue tint.", remove),
 ("They are gray. Same berries, same pixels. Every one of them is pure gray.", swatch),
 ("Your brain assumes the light is blue, so it subtracts the blue, and what is left looks red.", breathe),
 ("The red was never on the screen. Your brain added it.", end),
]
def strawberries():
    return make_reel(520, "gray_strawberries", "what color are these strawberries", N, style="cine", story="Strawberry pixels are neutral gray; a cyan cast on the rest of the scene makes them look red; cast removed they look gray.")
REELS = dict(strawberries=strawberries)
