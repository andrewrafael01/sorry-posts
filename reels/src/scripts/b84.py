"""Batch 84: triangle melody sim, Canon in D (public domain)."""
from scripts.b60 import mk
import sim

REELS = dict(
    tri_canon=mk("tri_canon", 428, "Every time a ball escapes\n3 new balls spawn", "tri", "every bounce is a note. you know this song. comment it", "Triangle sim, Pachelbel Canon in D melody (public domain), 160 balls cap.", pgap=.42, spin=.45, boost=1.0, cap=60, ball_r=12, seed=6, n0=3, mel=sim.CANON),
)
