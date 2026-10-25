"""Premium 25: pendulum wave. Eighteen bobs, each completing exactly one more swing per 40 s cycle than its neighbour, braid into waves and snap back into a single line. A plain tone rings each time a bob crosses the centre. Black background, no voice."""
import math
import numpy as np
from PIL import Image, ImageDraw
import reel
from engine import W, H
from premium import bloom
from sim2 import sprite, PENTA_NOTES
from sim import hue

N = 18; CYCLE = 40.0; N0 = 9; AMP = 400.0; Y0 = 330.0; DY = 76.0; CXC = W / 2; DURR = CYCLE
def x_of(k, t): return AMP * math.sin(2 * math.pi * (N0 + k) * t / CYCLE + math.pi / 2)    # all start at the right edge: a clean line to begin with
class Wave(reel.Shot):
    cut = "cut"
    def __init__(self):
        self.dur = DURR; self.cues = []
        for k in range(N):
            f = (N0 + k) / CYCLE; t = 1 / (4 * f)          # first centre crossing, then every half period
            note = PENTA_NOTES[min(len(PENTA_NOTES) - 1, int(k * len(PENTA_NOTES) / N))] - 12
            while t < self.dur - .3:
                self.cues.append((t, "n%d" % note, .09)); t += 1 / (2 * f)
    def render(self, lt):
        img = Image.new("RGB", (W, H), (0, 0, 0)); d = ImageDraw.Draw(img)
        d.line([(CXC, Y0 - 40), (CXC, Y0 + DY * (N - 1) + 40)], fill=(30, 32, 44), width=2)
        for k in range(N):
            y = Y0 + k * DY; h = k / N; d.line([(CXC - AMP - 30, y), (CXC + AMP + 30, y)], fill=(14, 15, 22), width=2)
            for b in range(7, 0, -1):          # short motion trail
                xb = CXC + x_of(k, max(0.0, lt - b * .018)); s = sprite(h * .85 + .02, 26 * (1 - b * .05), .18 * (1 - b / 8.0) ** 1.3 + .02); img.paste(s, (int(xb - s.width / 2), int(y - s.height / 2)), s)
            x = CXC + x_of(k, lt); s = sprite(h * .85 + .02, 26); img.paste(s, (int(x - s.width / 2), int(y - s.height / 2)), s)
        bloom(img, 100, .85, 9)
        fade = min(1.0, lt / .6, (self.dur - lt) / .6); return Image.eval(img, lambda v: int(v * fade))
def mk():
    return reel.Reel("531_pendulum_wave", [Wave()], style="lofi", seed=531, gain_music=0.0, loop=True, snap=False, grid=0, safe_zone=False, title="pendulum wave", caption="x", story="Pendulum wave: 18 bobs with 9..26 swings per 40 s cycle, one full cycle that loops seamlessly; plain tone (pentatonic by bob) on every centre crossing.")
REELS = dict(wave=mk)
