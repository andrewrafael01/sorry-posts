"""Premium 15: Rotating Snakes (Kitaoka-style peripheral drift). A still pattern that seems to rotate. No text, no voice."""
import math
import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter
import reel
from scripts.common import *
from engine import W, H

TONES = np.array([[12, 12, 14], [34, 74, 178], [248, 248, 244], [236, 204, 48]], np.float32) / 255.0     # black, blue, white, yellow
_yy, _xx = np.mgrid[0:H, 0:W].astype(np.float32)
COLS, ROWS = 3, 4; CW = W / COLS; CH = 1500 / ROWS; Y0 = 210
def pattern(nseg=18, ring=44.0):
    gx = np.clip(np.floor(_xx / CW), 0, COLS - 1); gy = np.clip(np.floor((_yy - Y0) / CH), 0, ROWS - 1)
    cx = (gx + .5) * CW; cy = Y0 + (gy + .5) * CH; dx = _xx - cx; dy = _yy - cy; r = np.hypot(dx, dy); th = np.arctan2(dy, dx)
    k = np.floor(r / ring); inside = (r < min(CW, CH) / 2 - 8) & (_yy >= Y0) & (_yy < Y0 + 1500) & (k >= 1)
    direction = np.where((gx + gy) % 2 == 0, 1, -1); f = ((th / (2 * math.pi)) * nseg * direction + (k % 2) * .5) % 1.0
    idx = np.floor(f * 4).astype(int) % 4; img = TONES[idx]
    fr = f * 4 - np.floor(f * 4); edge = np.clip((fr - .90) / .10, 0, 1)[..., None] * .0     # clean edges, no outlines (outlines weaken the drift)
    out = np.where(inside[..., None], img, np.array([.93, .86, .60], np.float32)[None, None])
    return out.astype(np.float32)
_P = {}
class Snakes(reel.Shot):
    cut = "cut"
    def __init__(self, dur=24.0): self.dur = dur; self.cues = []
    def render(self, lt):
        if "p" not in _P: _P["p"] = pattern()
        fade = min(1.0, lt / .9, (self.dur - lt) / .9); z = 1.0 + .012 * lt / 4          # a very slow push keeps the eyes moving without adding any real motion cue to the pattern
        img = Image.fromarray((_P["p"] * 255).astype(np.uint8), "RGB"); cw, ch = W / z, H / z; img = img.crop((int((W - cw) / 2), int((H - ch) / 2), int((W + cw) / 2), int((H + ch) / 2))).resize((W, H), Image.LANCZOS)
        return Image.eval(img, lambda v: int(v * fade))
def mk():
    return reel.Reel("519_rotating_snakes", [Snakes(24.0)], style="cine", seed=519, gain_music=.85, loop=True, snap=False, grid=0, safe_zone=False, title="rotating snakes", caption="x", story="Kitaoka rotating snakes: ring segments in a black-blue-white-yellow luminance sequence; alternate discs run in opposite order. Static image, peripheral drift.")
REELS = dict(snakes=mk)
