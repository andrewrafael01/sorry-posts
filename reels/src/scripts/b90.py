"""Batch 90: space and scale facts."""
import math
from facts import *

def venus():
    N = [
     ("A day on Venus is longer than its year.", words_scene(["A DAY ON VENUS", "IS LONGER THAN", "ITS YEAR"], (14, 10, 30, 1), [WHITE, SOFT, GOLD], 96)),
     ("Venus takes two hundred and twenty five days to go around the Sun. But one spin on its axis takes two hundred and forty three.", orbit_scene("DAY > YEAR", "VENUS SPINS SLOWER THAN IT ORBITS", (10, 8, 26, 1), [dict(r=360, period=225, color=(255, 190, 110), size=44, spin=243, label="Venus")], days_per_s=28)),
     ("It also spins backwards, so the Sun rises in the west.", words_scene(["IT SPINS", "BACKWARDS", "SUN RISES IN THE WEST"], (14, 10, 30, 1), [SOFT, GOLD, ORANGE], 92)),
     ("Our closest neighbour runs on a clock that makes no sense.", words_scene(["THE PLANET NEXT DOOR", "BREAKS THE RULES"], (14, 10, 30, 1), [SOFT, GOLD], 96)),
    ]
    return make_reel(432, "venus_day", "a day on venus is longer than its year", N, story="Venus sidereal rotation 243 Earth days (retrograde); orbital period 225 days.")

def trees():
    N = [
     ("There are more trees on Earth than stars in the Milky Way.", words_scene(["MORE TREES", "THAN STARS", "IN OUR GALAXY"], (6, 22, 16, 1), [GREEN, WHITE, GOLD], 100)),
     ("Earth has about three trillion trees.", bars_scene("TREES ON EARTH", [("Trees on Earth", 3000, GREEN, "3 trillion"), ("Stars in the Milky Way", 300, GOLD, "100 to 400 billion")], (6, 22, 16, 1), anchors=["Earth", "stars"])),
     ("Our whole galaxy has somewhere between one hundred and four hundred billion stars.", bars_scene("STARS IN THE MILKY WAY", [("Trees on Earth", 3000, GREEN, "3 trillion"), ("Stars in the Milky Way", 300, GOLD, "100 to 400 billion")], (6, 22, 16, 1), anchors=["trees", "galaxy"])),
     ("The forest outnumbers the galaxy.", words_scene(["THE FOREST", "OUTNUMBERS", "THE GALAXY"], (6, 22, 16, 1), [GREEN, SOFT, GOLD], 100)),
    ]
    return make_reel(433, "trees_vs_stars", "more trees on earth than stars in the milky way", N, story="Crowther et al. 2015: about 3.04 trillion trees. Milky Way: 100-400 billion stars.")

def sun():
    def suns(img, lt, n, b):
        disc(img, 540, 880, 280, (255, 180, 60)); glow(img, 540, 880, 380, (255, 150, 40), .5)
        rs = np.random.RandomState(4); k = int(260 * n / 1300000)
        for i in range(k):
            a = rs.rand() * 6.283; r = 270 * math.sqrt(rs.rand()); disc(img, 540 + r * math.cos(a), 880 + r * math.sin(a), 5, (110, 190, 255))
    N = [
     ("About one point three million Earths would fit inside the Sun.", num_scene(0, 1300000, lambda n: f"{int(n):,}", "EARTHS INSIDE THE SUN", (255, 190, 90), (18, 8, 8, 1), deco=suns, t0=.8)),
     ("It holds nearly all the mass in our entire solar system.", words_scene(["99.86% OF ALL", "THE MASS", "IN OUR SOLAR SYSTEM"], (18, 8, 8, 1), [GOLD, WHITE, SOFT], 88)),
     ("Across, the Sun is about one hundred and nine Earths.", circles_scene("109 EARTHS WIDE", "THE SUN NEXT TO EARTH", (18, 8, 8, 1), [("Sun", 109, (255, 180, 60), "SUN"), ("Earth", 1, (110, 190, 255), "Earth")], maxr=300, baseline=1000)),
     ("Everything that has ever happened to anyone happened on that dot.", words_scene(["EVERYONE YOU KNOW", "LIVES ON", "THAT DOT"], (18, 8, 8, 1), [WHITE, SOFT, (110, 190, 255)], 96)),
    ]
    return make_reel(434, "sun_earths", "1.3 million earths fit inside the sun", N, story="Sun volume / Earth volume = about 1.3 million; diameter ratio about 109.")

def drive():
    N = [
     ("Space is closer than your commute.", words_scene(["SPACE IS CLOSER", "THAN YOUR", "COMMUTE"], (30, 70, 140), [WHITE, SOFT, GOLD], 100)),
     ("The edge of space is about a hundred kilometers straight up.", drive_scene(lambda u: "100 KM UP", "WHERE SPACE BEGINS", u0=0, u1=.45)),
     ("A passenger plane cruises at about ten kilometers. Space starts ten times higher.", words_scene(["PLANES FLY AT 10 KM", "SPACE STARTS AT 100"], (30, 70, 140), [SOFT, GOLD], 88)),
     ("Drive that at highway speed and you would be there in an hour.", drive_scene(lambda u: "ONE HOUR", "AT HIGHWAY SPEED", u0=.45, u1=1.0)),
     ("You live closer to space than you think.", words_scene(["YOU'RE CLOSER", "TO SPACE", "THAN YOU THINK"], (4, 4, 16, 1), [SOFT, WHITE, GOLD], 96)),
    ]
    return make_reel(435, "space_drive", "space is a one hour drive away", N, story="Karman line 100 km; 100 km/h gives one hour.")

def saturn():
    N = [
     ("Saturn is so light it would float in water.", words_scene(["SATURN WOULD", "FLOAT", "IN WATER"], (20, 14, 6, 1), [WHITE, GOLD, (110, 170, 255)], 104)),
     ("It is the only planet less dense than water.", float_scene("LESS DENSE THAN WATER", "THE ONLY PLANET THAT FLOATS", (20, 14, 6, 1))),
     ("Its rings are over two hundred thousand kilometers wide, and in places only about ten meters thick.", words_scene(["RINGS: 280,000 KM WIDE", "IN PLACES ONLY", "10 METERS THICK"], (20, 14, 6, 1), [GOLD, SOFT, WHITE], 84)),
     ("You would just need a bathtub a hundred and twenty thousand kilometers wide.", float_scene("A TUB 120,000 KM WIDE", "SATURN IS 116,000 KM ACROSS", (20, 14, 6, 1))),
    ]
    return make_reel(436, "saturn_floats", "saturn would float in water", N, story="Saturn mean density 0.687 g/cm3 vs water 1.0; diameter about 116,460 km.")

def moon():
    def drift(img, lt, n, b):
        disc(img, 220, 880, 110, (110, 170, 255)); glow(img, 220, 880, 170, (110, 170, 255), .35); d = 520 + 160 * (n / 3.8); disc(img, 220 + d, 880, 50, (225, 225, 235))
        tx(img, "every year", 700, 1120, 38, "bold", SOFT, a=clamp(lt / .8), shadow=False)
    N = [
     ("The Moon is moving away from Earth at the same speed your fingernails grow.", words_scene(["THE MOON IS", "DRIFTING AWAY", "AS FAST AS YOUR", "FINGERNAILS GROW"], (8, 8, 24, 1), [WHITE, GOLD, SOFT, GOLD], 84)),
     ("About three point eight centimeters a year.", num_scene(0, 3.8, lambda n: f"{n:.1f} cm", "FARTHER AWAY EVERY YEAR", (225, 225, 235), (8, 8, 24, 1), deco=drift, t0=.5)),
     ("It always has been. The Moon was once so close it filled the sky.", words_scene(["IT ALWAYS HAS", "BEEN LEAVING"], (8, 8, 24, 1), [SOFT, GOLD], 96)),
     ("In about six hundred million years, a total solar eclipse will no longer be possible.", words_scene(["600 MILLION YEARS", "NO MORE TOTAL", "SOLAR ECLIPSES"], (8, 8, 24, 1), [GOLD, WHITE, SOFT], 88)),
    ]
    return make_reel(437, "moon_fingernail", "the moon drifts away as fast as your fingernails grow", N, story="Lunar recession about 3.8 cm/yr (laser ranging). Total eclipses end in roughly 600 million years.")

def sugar():
    N = [
     ("Everyone alive could fit inside a sugar cube.", words_scene(["EVERY HUMAN ALIVE", "FITS IN A", "SUGAR CUBE"], (14, 10, 30, 1), [WHITE, SOFT, GOLD], 96)),
     ("Every atom in your body is mostly empty space.", converge_scene("ATOMS ARE MOSTLY EMPTY", "PEOPLE, SQUEEZED", (14, 10, 30, 1), "8 BILLION PEOPLE", anchor="almost")),
     ("Squeeze that emptiness out, and all eight billion people would be about the size of a sugar cube.", converge_scene("ALL 8 BILLION", "REMOVE THE EMPTY SPACE", (14, 10, 30, 1), "ABOUT A SUGAR CUBE", anchor="Squeeze")),
     ("A neutron star is exactly that. Matter with the empty space squeezed out.", words_scene(["A NEUTRON STAR", "IS ATOMS WITH", "THE SPACE REMOVED"], (14, 10, 30, 1), [GOLD, WHITE, SOFT], 92)),
     ("You are mostly nothing.", words_scene(["YOU ARE", "MOSTLY", "NOTHING"], (14, 10, 30, 1), [SOFT, WHITE, GOLD], 110)),
    ]
    return make_reel(438, "sugar_cube", "everyone alive could fit in a sugar cube", N, story="Nuclear matter density about 2.3e17 kg/m3; 8e9 people at about 60 kg is 5e11 kg, which is about 2 cm3.")

def brain():
    items = [("Your brain", 20, GOLD, "20 watts"), ("A laptop charger", 65, BLUE, "65 watts"), ("A microwave", 1100, ORANGE, "1,100 watts"), ("The world's fastest supercomputer", 20000000, RED, "20,000,000 watts")]
    N = [
     ("Your brain runs on about twenty watts.", words_scene(["YOUR BRAIN", "RUNS ON", "20 WATTS"], (20, 10, 30, 1), [WHITE, SOFT, GOLD], 104)),
     ("That is less than a laptop charger.", bars_scene("POWER USE", items[:2], (20, 10, 30, 1), anchors=["brain", "laptop"], top=620, gapy=240)),
     ("And it does that while thinking, moving, and dreaming at once.", words_scene(["THINKING", "MOVING", "DREAMING"], (20, 10, 30, 1), [GOLD, WHITE, SOFT], 100)),
     ("The fastest supercomputer in the world uses about twenty million.", bars_scene("POWER USE", items, (20, 10, 30, 1), log=True, anchors=["fastest", "twenty", "million", "million"], top=560, gapy=200)),
     ("That is a million times more power.", words_scene(["TWENTY WATTS", "VERSUS", "TWENTY MILLION"], (20, 10, 30, 1), [GOLD, SOFT, RED], 90)),
    ]
    return make_reel(439, "brain_watts", "your brain runs on 20 watts", N, story="Brain about 20 W. Frontier exascale system about 21 MW.")

REELS = dict(venus=venus, trees=trees, sun=sun, drive=drive, saturn=saturn, moon=moon, sugar=sugar, brain=brain)
