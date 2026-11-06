"""Premium 31: one bouncing ball plays a real, public-domain song: every bounce sounds the next note of the tune. Same black-background sim3 look, exact live bounce count."""
import reel, sim3

SONGS = {
 "ode": ("Ode to Joy", [64,64,65,67,67,65,64,62,60,60,62,64,64,62,62, 64,64,65,67,67,65,64,62,60,60,62,64,62,60,60, 62,62,64,60,62,64,65,64,60,62,64,65,64,62,60,62,55, 64,64,65,67,67,65,64,62,60,60,62,64,62,60,60]),
 "jingle": ("Jingle Bells", [64,64,64, 64,64,64, 64,67,60,62,64, 65,65,65,65,65,64,64,64,64,62,62,64,62,67, 64,64,64, 64,64,64, 64,67,60,62,64, 65,65,65,65,65,64,64,64,67,67,65,62,60]),
 "elise": ("Für Elise", [76,75,76,75,76,71,74,72,69, 60,64,69,71, 64,68,71,72, 64, 76,75,76,75,76,71,74,72,69, 60,64,69,71, 64,72,71,69]),
 "twinkle": ("Twinkle Twinkle", [60,60,67,67,69,69,67, 65,65,64,64,62,62,60, 67,67,65,65,64,64,62, 67,67,65,65,64,64,62, 60,60,67,67,69,69,67, 65,65,64,64,62,62,60]),
 "silent": ("Silent Night", [67,69,67,64, 67,69,67,64, 74,74,71, 72,72,67, 69,69,72,71,69, 67,69,67,64, 69,69,72,71,69, 67,69,67,64, 74,74,77,74,71, 72,76,72, 67,64,67,65,62,60]),
}
def mk(name, num, song, **kw):
    ttl, notes = SONGS[song]
    def f():
        s = sim3.ShrinkRing(f"One ball plays\n{ttl}", melody=notes, **kw)
        return reel.Reel(f"{num}_{name}", [s], style="lofi", seed=num, gain_music=0.0, loop=True, snap=False, grid=0, safe_zone=False, title=f"one ball plays {ttl}", caption="x",
                         story=f"One ball in a shrinking container; each bounce plays the next note of {ttl} (public domain). Exact bounce count, black background.")
    return f
REELS = dict(
    ode=mk("song_ode_to_joy", 564, "ode", shrink=4.4, sides=6, spin=.55, seed=1, hue0=.08, ball_r=14, Rmin=96.0),
    jingle=mk("song_jingle_bells", 565, "jingle", shrink=4.4, sides=5, spin=.5, trail=140, hue0=.0, ball_r=14, Rmin=96.0),
    elise=mk("song_fur_elise", 566, "elise", shrink=3.9, trail=170, g=2000.0, hue0=.75, ball_r=13),
    twinkle=mk("song_twinkle", 567, "twinkle", shrink=4.4, sides=8, spin=.3, hue0=.15, ball_r=13, Rmin=96.0),
    silent=mk("song_silent_night", 568, "silent", shrink=4.4, sides=4, spin=.4, hue0=.58, ball_r=14, Rmin=96.0),
)
