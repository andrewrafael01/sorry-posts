"""Premium 30: variants of the proven escape-spawn ball sim (the format that reached 436 views): same rules as 490-492 with a different spawn count, wall shape, ball size and speed."""
from scripts.common import *
import reel, sim2

def mk(name, num, shape, spawn, dur=40.0, **kw):
    def f():
        s = sim2.BallSim(f"Every time a ball escapes\n{spawn} new balls spawn", shape=shape, dur=dur, spawn=spawn, **kw)
        return reel.Reel(f"{num}_{name}", [s], style="lofi", seed=num, gain_music=0.0, loop=True, snap=False, grid=0, safe_zone=False, title=f"every time a ball escapes {spawn} new balls spawn", caption="x",
                         story="Ball sim: elastic ball-ball and wall collisions (C grid), exact live ball count, plain tone per bounce.")
    return f
ramp = lambda t: .95 - .5 * min(1.0, t / 14.0)
REELS = dict(
    hex2=mk("hex_spawn2", 555, "hex", 2, pgap=.50, spin=.9, boost=1.0, seed=11, ball_r=9, n0=8, hue0=.10),
    hex5=mk("hex_spawn5", 556, "hex", 5, pgap=.30, spin=.6, boost=1.0, seed=12, ball_r=7, n0=4, hue0=.60),
    sq2=mk("square_spawn2", 557, "square", 2, pgap=.40, spin=.8, boost=1.0, seed=13, ball_r=9, n0=8, hue0=.30),
    ring10=mk("ring_spawn6", 558, "ring", 6, gapf=ramp, spin=1.2, boost=1.0, seed=14, ball_r=6, n0=3, hue0=.90),
)
