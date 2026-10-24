"""Premium 17: the ring that shrinks every time the ball bounces (sim3). Plain tones that climb with the count, black background, exact live bounce count."""
import reel, sim3

def mk(name, num, **kw):
    def f():
        s = sim3.ShrinkRing("The ring shrinks\nevery time the ball bounces", **kw)
        return reel.Reel(f"{num}_{name}", [s], style="lofi", seed=num, gain_music=0.0, loop=True, snap=False, grid=0, safe_zone=False, title="the ring shrinks every time the ball bounces", caption="x",
                         story="Single ball under gravity in a ring; every wall hit shrinks the ring by a fixed step. Exact bounce count; pitch climbs with the count.")
    return f
REELS = dict(shrink=mk("shrinking_ring", 521, shrink=3.6, seed=1))
