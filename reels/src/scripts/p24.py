"""Premium 24: the stream-bounce illusion. Two orbs glide through each other in silence; add a click at the crossing and the same motion looks like a collision. The sound changes what you see. No text, no voice, music off."""
import math
import numpy as np
from PIL import Image, ImageDraw
import reel
from engine import W, H
from premium import bloom
from sim2 import sprite

T = 2.5; REST = .55; T0 = 1.2; NP = 8; CLICK = {2, 3, 4, 5}
A0 = (170.0, 470.0); A1 = (910.0, 1450.0); B0 = (910.0, 470.0); B1 = (170.0, 1450.0)
def pos(p0, p1, u): return (p0[0] + (p1[0] - p0[0]) * u, p0[1] + (p1[1] - p0[1]) * u)
def ease(u): return u            # constant speed: that is what makes streaming look like streaming
class Stream(reel.Shot):
    cut = "cut"
    def __init__(self):
        self.dur = T0 + NP * (T + REST) + .6; self.cues = []
        for i in CLICK:
            tc = T0 + i * (T + REST) + T / 2; self.cues.append((tc, "pop", .95))
    def render(self, lt):
        img = Image.new("RGB", (W, H), (0, 0, 0)); i = int((lt - T0) // (T + REST)) if lt >= T0 else -1
        for k in range(3):    # a faint rail for each path so the straight line is obvious
            pass
        d = ImageDraw.Draw(img)
        pass
        if 0 <= i < NP:
            u = (lt - T0 - i * (T + REST)) / T
            if 0 <= u <= 1:
                for (p0, p1, hue) in ((A0, A1, .52), (B0, B1, .90)):
                    for b in range(9, 0, -1):
                        ub = max(0.0, u - b * .012); x, y = pos(p0, p1, ub); s = sprite(hue, 30 * (1 - b * .06), .30 * (1 - b / 10.0) ** 1.4 + .02); img.paste(s, (int(x - s.width / 2), int(y - s.height / 2)), s)
                    x, y = pos(p0, p1, u); s = sprite(hue, 30); img.paste(s, (int(x - s.width / 2), int(y - s.height / 2)), s)
                # on clicked passes a brief ring marks the instant of the sound
                if i in CLICK:
                    dt = (u - .5) * T
                    if 0 <= dt < .35:
                        r = 20 + dt * 520; a = (1 - dt / .35) ** 2; c = int(210 * a); ImageDraw.Draw(img).ellipse([540 - r, 960 - r, 540 + r, 960 + r], outline=(c, c, c), width=3)
        bloom(img, 110, .9, 9)
        fade = min(1.0, lt / .6, (self.dur - lt) / .6); return Image.eval(img, lambda v: int(v * fade))
def mk():
    return reel.Reel("530_stream_bounce", [Stream()], style="lofi", seed=530, gain_music=0.0, loop=True, snap=False, grid=0, safe_zone=False, title="stream bounce", caption="x", story="Stream-bounce illusion: two orbs cross at constant speed; silent passes read as passing through, clicked passes read as a bounce.")
REELS = dict(sb=mk)
