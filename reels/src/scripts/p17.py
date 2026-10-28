"""Premium 17: the ring that shrinks every time the ball bounces (sim3). Plain tones that climb with the count, black background, exact live bounce count."""
import reel, sim3

def mk(name, num, ttl="The ring shrinks\nevery time the ball bounces", **kw):
    def f():
        s = sim3.ShrinkRing(ttl, **kw)
        return reel.Reel(f"{num}_{name}", [s], style="lofi", seed=num, gain_music=0.0, loop=True, snap=False, grid=0, safe_zone=False, title="the ring shrinks every time the ball bounces", caption="x",
                         story="Single ball under gravity in a ring; every wall hit shrinks the ring by a fixed step. Exact bounce count; pitch climbs with the count.")
    return f
REELS = dict(shrink=mk("shrinking_ring", 521, shrink=3.6, seed=1),
             grow=mk("growing_ball", 523, ttl="The ball grows\nevery time it bounces", shrink=0.0, grow=3.2, ball_max=200, ball_r=10, descend=True, hue0=.92, hold=3.0),
             spiro=mk("spirograph_ball", 527, ttl="The gravity turns\nevery time it bounces", shrink=0.0, gang=2.399963, trail=220, g=2800.0, fixed=34.0, ball_r=14, hue0=.30, hold=1.0, tail=1.5),
             hexs=mk("hex_shrink", 541, ttl="The hexagon shrinks\nevery time the ball bounces", shrink=4.4, sides=6, spin=.55, seed=1, hue0=.08, ball_r=14, Rmin=96.0),
             squs=mk("square_shrink", 542, ttl="The square shrinks\nevery time the ball bounces", shrink=4.4, sides=4, spin=.40, seed=1, hue0=.40, ball_r=14, Rmin=96.0))
