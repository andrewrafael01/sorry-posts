"""Premium 20: Anstis' footsteps illusion. Blue and yellow bars slide at exactly the same constant speed over black and white stripes and seem to step out of time; the stripes melt to gray and they lock together. No text, no voice."""
import math
import numpy as np
from PIL import Image
import reel
from engine import W, H

STRIPE = 54; ROWH = 236; GAP = 22; NPAIR = 3; BARW = 300; Y0 = 150
YEL = np.array([255, 214, 0], np.float32) / 255; BLU = np.array([24, 52, 236], np.float32) / 255
cols = np.arange(W, dtype=np.float32)
def tri(u): u = u % 1.0; return 1 - abs(2 * u - 1) * 1.0      # 0..1..0 constant speed
def cover(x0, x1):
    return np.clip(np.minimum(cols + 1, x1) - np.maximum(cols, x0), 0, 1)
def frame(lt, dur):
    ph = min(1.0, max(0.0, (lt - 10.5) / 2.0)) - min(1.0, max(0.0, (lt - (dur - 4.0)) / 2.0)) * 0     # stripes -> gray at 10.5..12.5
    back = max(0.0, min(1.0, (lt - (dur - 3.2)) / 1.6)); ph = ph * (1 - back)                          # and back to stripes for a clean loop
    st = ((cols // STRIPE) % 2).astype(np.float32) * .96 + .02; gray = .5
    row = st * (1 - ph) + gray * ph
    img = np.tile(row[None, :, None], (H, 1, 3)).astype(np.float32)
    travel = W - 2 * 70 - BARW
    for i in range(NPAIR):
        y = Y0 + i * (2 * ROWH + GAP * 3)
        for j, col in enumerate((YEL, BLU)):
            u = tri(lt / 6.2); x0 = 70 + travel * u; cv = cover(x0, x0 + BARW)
            ys = int(y + j * (ROWH + GAP)); sl = img[ys:ys + ROWH]
            sl[:] = sl * (1 - cv[None, :, None]) + col[None, None, :] * cv[None, :, None]
    fade = min(1.0, lt / .7, (dur - lt) / .7)
    return Image.fromarray((np.clip(img * fade, 0, 1) * 255 + .5).astype(np.uint8), "RGB")
class Footsteps(reel.Shot):
    cut = "cut"
    def __init__(self, dur=24.0): self.dur = dur; self.cues = []
    def render(self, lt): return frame(lt, self.dur)
def mk():
    return reel.Reel("525_footsteps", [Footsteps(24.0)], style="cine", seed=525, gain_music=.85, loop=True, snap=False, grid=0, safe_zone=False, title="footsteps illusion", caption="x", story="Anstis footsteps: yellow and blue bars slide at identical constant speed over black/white stripes and seem to speed up and slow down out of step; stripes fade to gray and they move in lockstep.")
REELS = dict(foot=mk)
