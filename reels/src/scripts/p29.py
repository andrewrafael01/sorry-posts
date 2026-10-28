"""Premium 29: a batch of sim3 variants. Each is a different container / gravity rule / ball rule; all share plain tones, an exact bounce count and a black background."""
import reel, sim3
def mk(name, num, ttl, **kw):
    def f():
        s = sim3.ShrinkRing(ttl, **kw)
        return reel.Reel(f"{num}_{name}", [s], style="lofi", seed=num, gain_music=0.0, loop=True, snap=False, grid=0, safe_zone=False, title=ttl.replace("\n", " ").lower(), caption="x",
                         story="Single ball sim: plain pentatonic tone on every bounce, exact live bounce count, black background.")
    return f
G = 2.399963
REELS = dict(
    hept=mk("heptagon_turning_gravity", 547, "The gravity turns\nevery time it bounces", shrink=0.0, sides=7, spin=.28, gang=G, trail=220, g=2800.0, fixed=36.0, hue0=.85, ball_r=13, hold=1.0, tail=1.5),
    hexg=mk("hexagon_growing_ball", 548, "The ball grows\nevery time it bounces", shrink=0.0, sides=6, spin=.40, grow=2.8, ball_max=165, ball_r=10, descend=True, hue0=.15, hold=3.0),
    sqg=mk("square_turning_gravity", 549, "The gravity turns\nevery time it bounces", shrink=0.0, sides=4, spin=.25, gang=G, trail=200, g=2800.0, fixed=34.0, hue0=.12, ball_r=13, hold=1.0, tail=1.5),
    rg120=mk("ring_gravity_120", 550, "The gravity turns 120°\nevery time it bounces", shrink=0.0, gang=2.0943951, trail=240, g=2600.0, fixed=32.0, hue0=.50, ball_r=13, hold=1.0, tail=1.5),
    rg70=mk("ring_gravity_70", 551, "The gravity turns 70°\nevery time it bounces", shrink=0.0, gang=1.2217305, trail=240, g=2600.0, fixed=34.0, hue0=.92, ball_r=13, hold=1.0, tail=1.5),
    deca=mk("decagon_shrink", 552, "The decagon shrinks\nevery time the ball bounces", shrink=4.6, sides=10, spin=.35, trail=100, hue0=.95, ball_r=13, Rmin=96.0),
    pentg=mk("pentagon_growing_ball", 553, "The ball grows\nevery time it bounces", shrink=0.0, sides=5, spin=.35, grow=2.6, ball_max=150, ball_r=9, descend=True, hue0=.60, hold=3.0),
    ring_dbl=mk("ring_shrink_fast", 554, "The ring shrinks\nevery time the ball bounces", shrink=5.2, trail=90, g=2200.0, hue0=.30, ball_r=12, Rmin=100.0),
)
