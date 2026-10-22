"""Batch 60: satisfying physics sims. Balls bounce in a spinning shape with one opening; every wall hit plays the next note of a public-domain melody; every escape spawns more balls. Same mechanic, different shapes."""
import sys, os
from scripts.common import *
import reel, sim

def mk(name, num, title, shape, caption, story, sub="every bounce plays a note. guess the song", **kw):
    def f():
        s = sim.RingSim(title, shape=shape, dur=55.0, sub=sub, **kw)
        return reel.Reel(f"{num}_{name}", [s], style="lofi", seed=num, gain_music=0.0, loop=True, snap=False, grid=0, safe_zone=False, title=title.replace("\n", " "), caption=caption, story=story)
    return f

REELS = dict(
    ring_ode=mk("ring_ode", 400, "Every time a ball escapes\n3 new balls spawn", "ring", "every bounce plays a note. which song is it? comment before the end", "Ball physics sim (elastic ball-ball and wall collisions, validated: 0 wall leaks), 160 balls cap, Ode to Joy (public domain) advanced by bounces on a 0.17 s grid.", gap=.42, spin=.9, boost=1.0, cap=160, seed=5, n0=3),
    hex_king=mk("hex_king", 403, "Every time a ball escapes\n3 new balls spawn", "hex", "the ball is playing a song. do you know it? comment it", "Hexagon sim, Hall of the Mountain King melody (public domain), 160 balls cap.", pgap=.36, spin=.7, boost=1.0, cap=160, seed=1, n0=3, mel=sim.MOUNTAIN_KING),
    square_elise=mk("square_elise", 404, "Every time a ball escapes\n3 new balls spawn", "square", "every bounce is a note of a famous song. which one?", "Square sim, Fur Elise melody (public domain), 160 balls cap.", pgap=.26, spin=.6, boost=1.0, cap=160, seed=1, n0=3, mel=sim.ELISE),
)
