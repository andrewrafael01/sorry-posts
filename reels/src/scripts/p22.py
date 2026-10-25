"""Premium 22: the Ponzo illusion on a ray-cast railway at dusk. Two identical neon bars: the one higher up the tracks looks far longer. A copy of the top bar slides down and sits exactly on the lower one. No text, no voice."""
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy.ndimage import gaussian_filter
import reel
from engine import W, H
from premium import bloom, vignette

YH = 330.0; CAMH = 1.7; F = 880.0; BARL = 300; Y_TOP = 760; Y_BOT = 1500; BARW_ = 26
_C = {}
def hash2(x, y):
    n = np.sin(x * 127.1 + y * 311.7) * 43758.5453; return n - np.floor(n)
def vnoise(x, y):
    xi, yi = np.floor(x), np.floor(y); xf, yf = x - xi, y - yi; u = xf * xf * (3 - 2 * xf); v = yf * yf * (3 - 2 * yf)
    a, b, c, d = hash2(xi, yi), hash2(xi + 1, yi), hash2(xi, yi + 1), hash2(xi + 1, yi + 1)
    return a * (1 - u) * (1 - v) + b * u * (1 - v) + c * (1 - u) * v + d * u * v
def ground():
    if "g" in _C: return _C["g"]
    ss = 2; hh, ww = H * ss, W * ss; yy, xx = np.mgrid[0:hh, 0:ww].astype(np.float32); yy /= ss; xx /= ss
    dy = np.maximum(yy - YH, .8); Z = F * CAMH / dy; X = (xx - W / 2) * Z / F
    fog = (1 - np.exp(-Z / 60.0))[..., None]
    # gravel: two noise octaves, detail fades with distance so it never shimmers
    det = np.clip(1 - Z / 38, 0, 1)
    g = (vnoise(X * 9, Z * 9) * .5 + vnoise(X * 31, Z * 31) * .35 + vnoise(X * 90, Z * 90) * .15 * det) * det + .5 * (1 - det)
    gravel = (.10 + .20 * g)[..., None] * np.array([1.0, .96, .90], np.float32)
    # sleepers
    pitch = .85; sz = (Z % pitch) / pitch; tie = ((sz > .18) & (sz < .70) & (np.abs(X) < 1.45)).astype(np.float32)
    tie = gaussian_filter(tie, 1.1); grain = (vnoise(X * 40, Z * 6) * .5 + .5)
    woodc = np.array([.26, .17, .12], np.float32)[None, None] * (.65 + .6 * grain[..., None]) * (1 - .35 * np.abs(X)[..., None] / 1.45)
    base = gravel * (1 - tie[..., None]) + woodc * tie[..., None]
    # rails: steel with a bright top edge
    rx = np.abs(np.abs(X) - .72); rail = np.clip(1 - (rx - .045) / .02, 0, 1); head = np.clip(1 - np.abs(rx) / .035, 0, 1)
    steel = np.array([.80, .84, .92], np.float32)[None, None] * (.55 + .9 * head[..., None]) * (.8 + .4 * np.clip(1 - Z / 60, 0, 1))[..., None]
    base = base * (1 - rail[..., None]) + steel * rail[..., None]
    # dusk sky glow on the ground ahead, warm light low on the horizon
    glow = np.exp(-(dy / 260.0))[..., None] * np.array([.60, .30, .16], np.float32)
    col = (base * 1.15 * np.array([1.0, .80, .62], np.float32) * (1 - fog) + glow * fog * 1.25) 
    # sky
    sky_t = np.clip((YH - yy) / YH, 0, 1)[..., None]
    sky = np.array([.95, .50, .26], np.float32) * (1 - sky_t) ** 2.2 + np.array([.12, .10, .30], np.float32) * (1 - (1 - sky_t) ** 2.2)
    sky = sky + np.exp(-((yy - YH + 6) / 18) ** 2)[..., None] * .5
    img = np.where((yy < YH)[..., None], sky, col)
    img = img.reshape(H, ss, W, ss, 3).mean((1, 3)); img = np.clip(img, 0, 1) ** (1 / 1.25)
    _C["g"] = np.clip(img, 0, 1).astype(np.float32); return _C["g"]
def smooth(u): u = max(0.0, min(1.0, u)); return u * u * (3 - 2 * u)
def draw_bar(im, y, col, a=1.0, glow=True):
    d = ImageDraw.Draw(im, "RGBA"); x0, x1 = W / 2 - BARL / 2, W / 2 + BARL / 2
    d.rounded_rectangle([x0, y - BARW_ / 2, x1, y + BARW_ / 2], BARW_ / 2, fill=col + (int(255 * a),))
def frame(lt, dur):
    base = (ground() * 255).astype(np.uint8); im = Image.fromarray(base, "RGB").convert("RGBA")
    # bars: the two real ones; at 7.5 s a ghost copy of the top bar travels down onto the lower one and holds, then returns
    cyan = (40, 235, 255); mag = (255, 70, 200)
    draw_bar(im, Y_TOP, cyan); draw_bar(im, Y_BOT, cyan)
    if 6.5 < lt < 17.0:
        if lt < 10.5: u = smooth((lt - 6.5) / 4.0)
        elif lt < 13.0: u = 1.0
        else: u = 1 - smooth((lt - 13.0) / 3.5)
        a = smooth((lt - 6.5) / .5) * (1 - smooth((lt - 16.5) / .5))
        draw_bar(im, Y_TOP + (Y_BOT - Y_TOP) * u, mag, a * (.55 if u > .98 else .95))
    img = im.convert("RGB"); bloom(img, 200, .5, 8); vignette(img, .5)
    fade = min(1.0, lt / .7, (dur - lt) / .7)
    return Image.eval(img, lambda v: int(v * fade))
class Ponzo(reel.Shot):
    cut = "cut"
    def __init__(self, dur=22.0): self.dur = dur; self.cues = []
    def render(self, lt): return frame(lt, self.dur)
def mk():
    return reel.Reel("528_ponzo_tracks", [Ponzo(22.0)], style="cine", seed=528, gain_music=.85, loop=True, snap=False, grid=0, safe_zone=False, title="railway ponzo", caption="x", story="Ponzo illusion on a ray-cast dusk railway: two identical 300 px neon bars, the upper looks longer; a ghost copy slides down onto the lower bar and matches it exactly.")
REELS = dict(ponzo=mk)
