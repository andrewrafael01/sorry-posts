"""Premium 19: the Ouchi illusion. A disc of vertical bricks inside horizontal bricks seems to float free when the whole image sways. Sways, then stops dead. No text, no voice."""
import math
import numpy as np
from PIL import Image
import reel
from engine import W, H

_yy, _xx = np.mgrid[0:H * 2, 0:W * 2].astype(np.float32); _xx *= .5; _yy *= .5      # 2x supersample grid
BW_, BH_ = 60.0, 20.0; DISC = 360.0; CXX, CYY = W / 2, H / 2
def pattern(ox, oy):
    u = _xx - ox; v = _yy - oy
    bg = (np.floor(u / BW_) + np.floor(v / BH_)) % 2; dk = (np.floor(u / BH_) + np.floor(v / BW_)) % 2
    inside = np.hypot(_xx - CXX - ox, _yy - CYY - oy) < DISC
    img = np.where(inside, dk, bg).astype(np.float32) * .92 + .04
    img = img.reshape(H, 2, W, 2).mean((1, 3)); return (np.dstack([img, img, img]) * 255 + .5).astype(np.uint8)
class Ouchi(reel.Shot):
    cut = "cut"
    def __init__(self, dur=26.0, sway_end=17.0): self.dur = dur; self.sway_end = sway_end; self.cues = []
    def render(self, lt):
        # the whole picture, disc included, rocks gently on a small loop; at sway_end it stops dead
        k = min(1.0, lt / 1.2) * max(0.0, 1 - max(0.0, lt - self.sway_end) / .6)
        ox = 15 * math.sin(lt * 2 * math.pi * .62) * k; oy = 11 * math.sin(lt * 2 * math.pi * .31 + .9) * k
        im = Image.fromarray(pattern(ox, oy), "RGB"); fade = min(1.0, lt / .7, (self.dur - lt) / .7)
        return Image.eval(im, lambda v: int(v * fade))
def mk():
    return reel.Reel("524_ouchi", [Ouchi(26.0)], style="cine", seed=524, gain_music=.85, loop=True, snap=False, grid=0, safe_zone=False, title="ouchi illusion", caption="x", story="Ouchi illusion: horizontal brick checker with a vertical brick disc; whole image sways about 15 px for 17 s so the disc seems to float free, then stops.")
REELS = dict(ouchi=mk)
