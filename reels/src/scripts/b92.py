"""Batch 92: more melody sims (the approved format): same mechanic, different shape and song."""
from scripts.b60 import mk
import sim

REELS = dict(
    jingle_ring=mk("jingle_ring", 464, "Every time a ball escapes\n3 new balls spawn", "ring", "every bounce is a note of a song you know", "Ring sim, Jingle Bells (public domain), 110 ball cap.", gap=.42, spin=.9, boost=1.0, cap=110, seed=2, n0=3, mel=sim.JINGLE),
    twinkle_hex=mk("twinkle_hex", 465, "Every time a ball escapes\n3 new balls spawn", "hex", "every bounce is a note. you know this one", "Hexagon sim, Twinkle Twinkle (public domain), 110 ball cap.", pgap=.36, spin=.7, boost=1.0, cap=110, seed=2, n0=3, mel=sim.TWINKLE),
    auld_square=mk("auld_square", 466, "Every time a ball escapes\n3 new balls spawn", "square", "every bounce is a note of the song everyone sings at midnight", "Square sim, Auld Lang Syne (public domain), 110 ball cap.", pgap=.26, spin=.6, boost=1.0, cap=110, seed=2, n0=3, mel=sim.AULD),
    frere_tri=mk("frere_tri", 467, "Every time a ball escapes\n3 new balls spawn", "tri", "every bounce is a note. you learned this one as a kid", "Triangle sim, Frere Jacques (public domain), 60 ball cap.", pgap=.42, spin=.45, boost=1.0, cap=60, ball_r=12, seed=6, n0=3, mel=sim.FRERE),
    row_ring=mk("row_ring", 468, "Every time a ball escapes\n3 new balls spawn", "ring", "every bounce is a note. row row row", "Ring sim, Row Row Row Your Boat (public domain), 110 ball cap.", gap=.42, spin=.8, boost=1.0, cap=110, seed=7, n0=3, mel=sim.ROW),
    mary_square=mk("mary_square", 469, "Every time a ball escapes\n3 new balls spawn", "square", "every bounce is a note. which song is it?", "Square sim, Mary Had a Little Lamb (public domain), 110 ball cap.", pgap=.26, spin=.55, boost=1.0, cap=110, seed=3, n0=3, mel=sim.MARY),
)
