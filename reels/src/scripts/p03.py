"""Premium 03: the satisfying ball sim, rebuilt (sim2): black background, glossy balls, live exact count that never freezes, plain tones that rise with where the ball hits."""
import sys
from scripts.common import *
import reel, sim2

def mk(name, num, shape, caption, dur=42.0, **kw):
    def f():
        s = sim2.BallSim("Every time a ball escapes\n3 new balls spawn", shape=shape, dur=dur, **kw)
        return reel.Reel(f"{num}_{name}", [s], style="lofi", seed=num, gain_music=0.0, loop=True, snap=False, grid=0, safe_zone=False, title="every time a ball escapes 3 new balls spawn", caption=caption,
                         story="Ball sim: elastic ball-ball and wall collisions (C grid), exact live ball count, plain tone per bounce (pitch rises with hit height).")
    return f

ramp = lambda t: .95 - .5 * min(1.0, t / 14.0)
REELS = dict(
    ring=mk("ring_tones", 490, "ring", "x", gapf=ramp, spin=.9, boost=1.0, seed=2, ball_r=8, n0=6),
    hex=mk("hex_tones", 491, "hex", "x", pgap=.42, spin=.7, boost=1.0, seed=3, ball_r=8, n0=6),
    square=mk("square_tones", 492, "square", "x", pgap=.36, spin=.6, boost=1.0, seed=4, ball_r=8, n0=6),
    tri=mk("tri_tones", 493, "tri", "x", pgap=.46, spin=.45, boost=1.0, seed=6, ball_r=7, n0=6),
)
