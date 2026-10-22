"""Batch 60: satisfying physics sims. Balls bounce in a spinning shape, every wall hit plays the next note of a famous melody, every escape spawns more balls."""
import sys, os
from scripts.common import *
import reel, sim

def mk(name, num, title, shape, caption, story, sub="guess the song", **kw):
    def f():
        s = sim.RingSim(title, shape=shape, dur=55.0, sub=sub, **kw)
        return reel.Reel(f"{num}_{name}", [s], style="lofi", seed=num, gain_music=0.0, loop=True, snap=False, grid=0, safe_zone=False, title=title.replace("\n", " "), caption=caption, story=story)
    return f

REELS = dict(
    ring_ode=mk("ring_ode", 400, "Every time a ball escapes\n3 new balls spawn", "ring", "every bounce plays a note. which song is it? comment before the end", "Ball physics sim, 300 balls cap, Ode to Joy (public domain) advanced by bounces on a 0.17 s grid.", gap=.42, spin=.9, boost=1.0, cap=300, seed=5, n0=3),
)
