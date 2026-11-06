"""Premium 31: one bouncing ball plays a real, public-domain song: every bounce sounds the next note of the tune. Same black-background sim3 look, exact live bounce count."""
import reel, sim3

SONGS = {
 "ode": ("Ode to Joy", [64,64,65,67,67,65,64,62,60,60,62,64,64,62,62, 64,64,65,67,67,65,64,62,60,60,62,64,62,60,60, 62,62,64,60,62,64,65,64,60,62,64,65,64,62,60,62,55, 64,64,65,67,67,65,64,62,60,60,62,64,62,60,60]),
 "jingle": ("Jingle Bells", [64,64,64, 64,64,64, 64,67,60,62,64, 65,65,65,65,65,64,64,64,64,62,62,64,62,67, 64,64,64, 64,64,64, 64,67,60,62,64, 65,65,65,65,65,64,64,64,67,67,65,62,60]),
 "elise": ("Für Elise", [76,75,76,75,76,71,74,72,69, 60,64,69,71, 64,68,71,72, 64, 76,75,76,75,76,71,74,72,69, 60,64,69,71, 64,72,71,69]),
 "twinkle": ("Twinkle Twinkle", [60,60,67,67,69,69,67, 65,65,64,64,62,62,60, 67,67,65,65,64,64,62, 67,67,65,65,64,64,62, 60,60,67,67,69,69,67, 65,65,64,64,62,62,60]),
 "silent": ("Silent Night", [67,69,67,64, 67,69,67,64, 74,74,71, 72,72,67, 69,69,72,71,69, 67,69,67,64, 69,69,72,71,69, 67,69,67,64, 74,74,77,74,71, 72,76,72, 67,64,67,65,62,60]),

 "mountain": ("In the Hall of the Mountain King", [71,73,74,76,78,74,78, 77,73,77, 76,72,76, 71,73,74,76,78,74,78,83,82,78,74,78,82, 71,73,74,76,78,74,78,77,73,77,76,72,76,71]),
 "canon": ("Canon in D", [78,76,74,73,71,69,71,73, 74,73,71,69,67,66,67,64, 78,76,74,73,71,69,71,73, 74,73,71,69,67,66,67,64]),
 "greensleeves": ("Greensleeves", [69,72,74,76,77,76,74,71,67,69,71,72,69,69,68,69,71,68,64, 69,72,74,76,77,76,74,71,67,69,71,72,71,70,71,68,64]),
 "carol": ("Carol of the Bells", [67,66,67,64]*4 + [69,68,69,66]*4 + [71,70,71,67]*4 + [67,66,67,64]*4),
 "joy": ("Joy to the World", [72,71,69,67,65,64,62,60, 67,69,69,71,71,72,72,72,71,69,67,67,65,64,72,72,71,69,67,65,64,62,64,64,64,64,64]),
 "deck": ("Deck the Halls", [67,65,64,62,60,62,64,60, 62,64,65,62,64,62,60,59,60, 67,65,64,62,60,62,64,60, 62,64,65,62,64,62,60,59,60]),
 "merry": ("We Wish You a Merry Christmas", [62,67,67,69,67,66,64,64,64,69,69,71,69,67,66,62,62,71,71,72,71,69,67,64,62,64,69,66,67]),
 "birthday": ("Happy Birthday", [67,67,69,67,72,71, 67,67,69,67,74,72, 67,67,79,76,72,71,69, 77,77,76,72,74,72]),
 "row": ("Row Row Row Your Boat", [60,60,60,62,64, 64,62,64,65,67, 72,72,72,67,67,67,64,64,64,60,60,60, 67,65,64,62,60]),

 "lamb": ("Mary Had a Little Lamb", [64,62,60,62,64,64,64,62,62,62,64,67,67,64,62,60,62,64,64,64,64,62,62,64,62,60]),
 "buns": ("Hot Cross Buns", [64,62,60,64,62,60,60,60,60,60,62,62,62,62,64,62,60]),
 "saints": ("When the Saints Go Marching In", [60,64,65,67,60,64,65,67,60,64,65,67,64,60,64,62, 64,64,62,60,60,64,67,67,65,64,65,67,64,60,62,60]),
 "london": ("London Bridge", [67,69,67,65,64,65,67,62,64,65,64,65,67,67,69,67,65,64,65,67,62,67,64,60]),
 "yankee": ("Yankee Doodle", [60,60,62,64,60,64,62,55,60,60,62,64,60,59,60,60,62,64,65,64,62,60,59,55,57,59,60,60]),
 "auld": ("Auld Lang Syne", [62,67,67,67,71,69,67,69,71,67,67,71,74,76,74,71,71,67,69,67,69,67,64,64,62,67]),
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
    mountain=mk("song_mountain_king", 569, "mountain", shrink=5.0, sides=6, spin=.8, trail=100, hue0=.98, ball_r=13, Rmin=96.0),
    canon=mk("song_canon_in_d", 570, "canon", shrink=3.6, trail=200, g=1800.0, hue0=.58, ball_r=13),
    greensleeves=mk("song_greensleeves", 571, "greensleeves", shrink=4.4, sides=5, spin=.35, hue0=.33, ball_r=14, Rmin=96.0),
    carol=mk("song_carol_of_the_bells", 572, "carol", shrink=4.4, sides=8, spin=.3, trail=120, hue0=.62, ball_r=13, Rmin=96.0),
    joy=mk("song_joy_to_the_world", 573, "joy", shrink=3.6, hue0=.12, ball_r=14),
    deck=mk("song_deck_the_halls", 574, "deck", shrink=4.4, sides=4, spin=.4, hue0=.0, ball_r=14, Rmin=96.0),
    merry=mk("song_merry_christmas", 575, "merry", shrink=1.3, sides=3, spin=.6, hue0=.33, ball_r=14, R0=250.0, Rmin=70.0),
    birthday=mk("song_happy_birthday", 576, "birthday", shrink=4.6, sides=10, spin=.35, trail=100, hue0=.9, ball_r=13, Rmin=96.0),
    row=mk("song_row_row_row", 577, "row", shrink=5.2, trail=90, g=2200.0, hue0=.3, ball_r=12, Rmin=100.0),
    lamb=mk("song_mary_little_lamb", 578, "lamb", shrink=3.9, trail=170, g=2000.0, hue0=.95, ball_r=13),
    buns=mk("song_hot_cross_buns", 579, "buns", shrink=3.9, trail=150, g=2100.0, hue0=.08, ball_r=13),
    saints=mk("song_when_the_saints", 580, "saints", shrink=3.9, trail=190, g=1900.0, hue0=.55, ball_r=13),
    london=mk("song_london_bridge", 581, "london", shrink=3.9, trail=170, g=2000.0, hue0=.35, ball_r=13),
    yankee=mk("song_yankee_doodle", 582, "yankee", shrink=3.9, trail=160, g=2100.0, hue0=.62, ball_r=13),
    auld=mk("song_auld_lang_syne", 583, "auld", shrink=3.9, trail=180, g=1900.0, hue0=.12, ball_r=13),
)
