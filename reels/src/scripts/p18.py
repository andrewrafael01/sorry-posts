"""Premium 18: the lilac chaser. Twelve soft lilac discs, one vanishing at a time around the ring: a green disc chases the gap, then the lilac ones disappear. No text, no voice."""
import math
import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter
import reel
from engine import W, H

N = 12; RR = 330.0; DR = 68.0; CXX, CYY = W / 2, H / 2 - 20
BG = np.array([138, 138, 138], np.float32) / 255; LILAC = np.array([240, 148, 236], np.float32) / 255
_yy, _xx = np.mgrid[0:H, 0:W].astype(np.float32)
_F = {}
def frames():
    if _F: return _F["f"]
    discs = []
    for k in range(N):
        a = -math.pi / 2 + 2 * math.pi * k / N; cx, cy = CXX + RR * math.cos(a), CYY + RR * math.sin(a)
        m = (np.hypot(_xx - cx, _yy - cy) <= DR).astype(np.float32); discs.append(gaussian_filter(m, 5.0))
    cross = np.zeros((H, W), np.float32)
    cross[(np.abs(_xx - CXX) < 2.5) & (np.abs(_yy - CYY) < 24)] = 1; cross[(np.abs(_yy - CYY) < 2.5) & (np.abs(_xx - CXX) < 24)] = 1; cross = gaussian_filter(cross, .8)
    out = []
    for gap in range(N):
        a = np.clip(sum(d for k, d in enumerate(discs) if k != gap), 0, 1)[..., None]
        img = BG[None, None] * (1 - a) + LILAC[None, None] * a; img = img * (1 - cross[..., None]) + 0.02 * cross[..., None]
        out.append((np.clip(img, 0, 1) * 255 + .5).astype(np.uint8))
    _F["f"] = out; return out
class Chaser(reel.Shot):
    cut = "cut"
    def __init__(self, dur=26.0, step=.092): self.dur = dur; self.step = step; self.cues = []
    def render(self, lt):
        fr = frames(); k = int(lt / self.step) % N; im = Image.fromarray(fr[k], "RGB")
        fade = min(1.0, lt / .8, (self.dur - lt) / .8); return Image.eval(im, lambda v: int(v * fade))
def mk():
    return reel.Reel("522_lilac_chaser", [Chaser(26.0)], style="cine", seed=522, gain_music=.85, loop=True, snap=False, grid=0, safe_zone=False, title="lilac chaser", caption="x", story="Lilac chaser: 12 soft lilac discs on mid gray with a fixation cross; one disc vanishes at a time in rotation (about 11 Hz); afterimage shows a green disc.")
REELS = dict(lilac=mk)
