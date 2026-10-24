"""Premium 21: the Hering illusion. Two perfectly straight neon lines bow apart over a fan of spokes; the spokes melt away and the lines are dead straight. No text, no voice."""
import math
import numpy as np
from PIL import Image, ImageDraw
import reel
from engine import W, H
from premium import bloom

CX_, CY_ = W / 2, H / 2 - 10; NSP = 72; SEP = 215
def smooth(u): u = max(0.0, min(1.0, u)); return u * u * (3 - 2 * u)
def spokes_alpha(lt, dur):
    # present 0-8, melt 8-11, gone 11-14.5, back 14.5-17.5 so the loop restarts on the full illusion
    if lt < 8: return 1.0
    if lt < 11: return 1 - smooth((lt - 8) / 3)
    if lt < 14.5: return 0.0
    return smooth((lt - 14.5) / 3)
def frame(lt, dur):
    ss = 2; im = Image.new("RGB", (W * ss, H * ss), (0, 0, 0)); d = ImageDraw.Draw(im); a = spokes_alpha(lt, dur); rot = lt * .045
    if a > 0:
        for k in range(NSP):
            th = rot + 2 * math.pi * k / NSP; L = 1500 * ss; x1, y1 = CX_ * ss + math.cos(th) * L, CY_ * ss + math.sin(th) * L
            hue = .54 + .10 * math.sin(k * .3); import colorsys
            c = colorsys.hsv_to_rgb(hue, .35, 1.0); c = tuple(int(255 * v * a * .9) for v in c)
            d.line([(CX_ * ss, CY_ * ss), (x1, y1)], fill=c, width=int(3.2 * ss))
    for sx in (-SEP, SEP):
        x = (CX_ + sx) * ss; d.line([(x, 120 * ss), (x, (H - 120) * ss)], fill=(255, 40, 70), width=int(13 * ss))
    img = im.resize((W, H), Image.LANCZOS); bloom(img, 150, .6, 8)
    fade = min(1.0, lt / .7, (dur - lt) / .7)
    return Image.eval(img, lambda v: int(v * fade))
class Hering(reel.Shot):
    cut = "cut"
    def __init__(self, dur=22.0): self.dur = dur; self.cues = []
    def render(self, lt): return frame(lt, self.dur)
def mk():
    return reel.Reel("526_hering", [Hering(22.0)], style="cine", seed=526, gain_music=.85, loop=True, snap=False, grid=0, safe_zone=False, title="straight lines", caption="x", story="Hering illusion: two straight vertical neon lines look bowed apart over a rotating fan of spokes; spokes melt away and the lines are straight.")
REELS = dict(hering=mk)
