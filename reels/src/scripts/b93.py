"""Batch 93: more space, body and planet facts."""
import math
from facts import *
from scripts.b91 import mya, D1, D2, D3, D4, D5

def andromeda():
    ev = [(-2500000, "Light leaves Andromeda", VIOLET, 0), (-300000, "Homo sapiens appears", GOLD, 2), (0, "Today", WHITE, 0)]
    def f(t): return "2.5 million years ago" if t < -2000000 else ("300,000 years ago" if t < -1000 else "now")
    N = [
     ("When you look at the Andromeda galaxy, you are seeing light that left before our species existed.", words_scene(["THE LIGHT FROM", "ANDROMEDA", "IS OLDER THAN", "HUMANITY"], D2, [SOFT, VIOLET, WHITE, GOLD], 88)),
     ("The light left Andromeda about two and a half million years ago. Modern humans have only been around for around three hundred thousand.", timeline_scene("2.5 MILLION YEARS", "LIGHT FROM ANDROMEDA", D2, ev, -2800000, 100000, f, gaps=[(0, 1, "BEFORE OUR SPECIES")])),
     ("You can see it from a dark sky with the naked eye. Older than us, and still arriving.", words_scene(["OLDER THAN US", "AND STILL", "ARRIVING"], D2, [VIOLET, SOFT, WHITE], 100)),
    ]
    return make_reel(470, "andromeda_light", "the light from andromeda is older than humanity", N, story="Andromeda about 2.5 million light-years away; Homo sapiens about 300,000 years old; visible naked-eye in dark skies.")

def sunmass():
    N = [
     ("The Sun loses about four million tons of mass every single second.", words_scene(["THE SUN LOSES", "4 MILLION TONS", "EVERY SECOND"], D1, [SOFT, GOLD, WHITE], 96)),
     ("It turns that mass into the energy that lights your day. This counter is running at the real rate.", counter_scene(4000000, lambda n: f"{int(n):,} t", "SUN MASS CONVERTED TO LIGHT, LIVE", D1, col=GOLD)),
     ("It has been doing that for four and a half billion years, and it has barely made a dent.", words_scene(["4.5 BILLION YEARS", "BARELY A DENT"], D1, [GOLD, SOFT], 100)),
     ("Every sunrise is the Sun getting a little lighter.", words_scene(["EVERY SUNRISE", "COSTS THE SUN", "MASS"], D1, [SOFT, WHITE, GOLD], 100)),
    ]
    return make_reel(471, "sun_loses_mass", "the sun loses 4 million tons every second", N, story="Fusion converts about 4.3 million tonnes of mass to energy per second (E=mc2 at 3.8e26 W).")

def seafloor():
    N = [
     ("We have mapped more of Mars in detail than the floor of our own oceans.", words_scene(["WE'VE MAPPED", "MORE OF MARS", "THAN OUR SEAFLOOR"], D4, [SOFT, OR, CY], 92)),
     ("Only about a quarter of the seafloor has been mapped in high resolution.", dots_scene("ABOUT 25%", "OF THE SEAFLOOR IS MAPPED", D4, 25, total=100, cols=10, col_hl=CY, label_hl="THE OTHER 75% IS A GUESS", anchor="quarter", big_fmt=lambda k: f"{k}%")),
     ("The surface of Mars is easier to see than the bottom of the sea.", words_scene(["THE SEA FLOOR", "IS THE LAST", "UNKNOWN ON EARTH"], D4, [SOFT, WHITE, CY], 92)),
    ]
    return make_reel(472, "seafloor_mars", "we've mapped more of mars than our own seafloor", N, story="Seabed 2030: about 25% of the ocean floor mapped to modern standards (2023).")

def chess():
    it = [("Atoms in the observable universe", 1e80, VIOLET, "10^80"), ("Possible chess games", 1e120, GOLD, "10^120")]
    N = [
     ("There are more possible chess games than atoms in the observable universe.", words_scene(["MORE CHESS GAMES", "THAN ATOMS IN", "THE UNIVERSE"], D5, [GOLD, SOFT, VIOLET], 92)),
     ("The universe has about ten to the eighty atoms. The number of possible chess games is about ten to the one hundred and twenty.", bars_scene("HOW MANY?", it, D5, log=True, anchors=["universe", "chess"], top=640, gapy=260)),
     ("That is a number with forty more zeros than the atoms in the universe. And it all starts from a board with thirty two pieces.", words_scene(["32 PIECES", "64 SQUARES", "MORE GAMES THAN ATOMS"], D5, [SOFT, WHITE, GOLD], 84)),
    ]
    return make_reel(473, "chess_atoms", "more possible chess games than atoms in the universe", N, story="Shannon number about 10^120 games; observable universe about 10^80 atoms.")

def bones():
    N = [
     ("You were born with about three hundred bones. You have two hundred and six now.", words_scene(["BORN WITH", "~300 BONES", "NOW YOU HAVE 206"], D3, [SOFT, GOLD, WHITE], 96)),
     ("Many of them fuse together as you grow. Your skull plates, your spine, your pelvis.", dots_scene("300 TO 206", "BONES AS A BABY, BONES NOW", D3, 94, total=300, cols=20, col_hl=DIM, col_rest=GOLD, label_hl="94 FUSED AWAY", anchor="fuse", big_fmt=lambda k: f"{300 - k} BONES")),
     ("You have been losing bones your whole life, and every one of them was supposed to go.", words_scene(["YOU LOST", "ABOUT 100 BONES", "ON PURPOSE"], D3, [SOFT, GOLD, WHITE], 92)),
    ]
    return make_reel(474, "born_with_bones", "you were born with about 100 more bones than you have now", N, story="Newborns have about 270-300 bones (cartilage ossifies and fuses); adults 206.")

def pulsar():
    def spin(img, lt, n, b):
        cx, cy = 540, 860; disc(img, cx, cy, 90, (200, 230, 255)); glow(img, cx, cy, 200, (150, 200, 255), .6); a = lt * 12
        for s in (0, math.pi):
            line(img, [(cx + 110 * math.cos(a + s), cy + 110 * math.sin(a + s)), (cx + 420 * math.cos(a + s), cy + 420 * math.sin(a + s))], 8, (150, 200, 255), a=.35); glow(img, cx + 420 * math.cos(a + s), cy + 420 * math.sin(a + s), 60, (150, 200, 255), .3)
    N = [
     ("The fastest known pulsar spins seven hundred and sixteen times every second.", words_scene(["716 SPINS", "EVERY SECOND"], D2, [(150, 200, 255), WHITE], 118)),
     ("It is a collapsed star about as wide as a city, spinning faster than a kitchen blender.", num_scene(0, 716, lambda n: f"{int(n)}", "ROTATIONS PER SECOND", (150, 200, 255), D2, deco=spin, t0=.5)),
     ("A thing the size of a city, spinning more than seven hundred times in a second.", words_scene(["A CITY-SIZED STAR", "SPINNING 716 TIMES", "A SECOND"], D2, [SOFT, (150, 200, 255), WHITE], 88)),
    ]
    return make_reel(475, "pulsar_716", "a pulsar spins 716 times every second", N, story="PSR J1748-2446ad spins at 716 Hz; neutron star radius about 10-12 km.")

def baikal():
    N = [
     ("One lake in Siberia holds about a fifth of all the unfrozen fresh water on Earth.", words_scene(["ONE LAKE HOLDS", "1/5 OF EARTH'S", "FRESH WATER"], D4, [SOFT, CY, WHITE], 92)),
     ("Lake Baikal is more than sixteen hundred meters deep, and it is about twenty five million years old.", dots_scene("20%", "OF THE WORLD'S UNFROZEN FRESH WATER", D4, 20, total=100, cols=10, col_hl=CY, label_hl="LAKE BAIKAL, SIBERIA", anchor="Baikal", big_fmt=lambda k: f"{k}%")),
     ("It holds more water than all five Great Lakes combined.", words_scene(["MORE WATER", "THAN ALL FIVE", "GREAT LAKES"], D4, [CY, SOFT, WHITE], 100)),
    ]
    return make_reel(476, "baikal_fifth", "one lake holds a fifth of earth's fresh water", N, story="Baikal about 23,600 km3, roughly 20% of unfrozen surface fresh water; max depth 1,642 m; Great Lakes about 22,700 km3.")

def iss():
    N = [
     ("Astronauts on the space station see sixteen sunrises every day.", words_scene(["16 SUNRISES", "EVERY DAY", "IN ORBIT"], D2, [GOLD, WHITE, SOFT], 108)),
     ("The station travels around Earth once every ninety minutes at about twenty eight thousand kilometers an hour.", orbit_scene("ONE LAP = 90 MINUTES", "THE SPACE STATION", D2, [dict(r=330, period=1.5, color=(220, 225, 240), size=22, label="ISS")], star=(110, 170, 255), star_r=90, days_per_s=.62)),
     ("Night never lasts longer than about forty five minutes up there.", words_scene(["A DAY IN SPACE", "HAS NO NIGHT", "UNDER 45 MINUTES"], D2, [SOFT, WHITE, GOLD], 84)),
    ]
    return make_reel(477, "iss_sunrises", "astronauts see 16 sunrises every day", N, story="ISS orbital period about 92 minutes; about 15.5 orbits per day.")

def sahara():
    N = [
     ("Six thousand years ago, the Sahara was green.", words_scene(["6,000 YEARS AGO", "THE SAHARA", "WAS GREEN"], D1, [GOLD, SOFT, GR], 100)),
     ("It had lakes, grassland, hippos, and people who painted giraffes on cave walls.", words_scene(["LAKES", "GRASSLAND", "HIPPOS"], D1, [CY, GR, OR], 108)),
     ("A small wobble in Earth's tilt changed the monsoon, and it turned to desert within a few thousand years.", words_scene(["A SMALL WOBBLE", "IN EARTH'S TILT", "ENDED IT ALL"], D1, [SOFT, GOLD, RD], 90)),
     ("The biggest hot desert in the world used to be a garden.", words_scene(["THE BIGGEST", "DESERT WAS", "A GARDEN"], D1, [SOFT, WHITE, GR], 100)),
    ]
    return make_reel(478, "green_sahara", "the sahara was green 6000 years ago", N, story="African Humid Period ended about 5,500 years ago; Tassili n'Ajjer rock art includes giraffes and cattle.")

def russia():
    N = [
     ("Russia has a larger surface area than the planet Pluto.", words_scene(["RUSSIA IS", "BIGGER THAN", "PLUTO"], D3, [SOFT, GOLD, OR], 108)),
     ("Russia covers about seventeen million square kilometers. Pluto's whole surface is about sixteen and a half million.", circles_scene("RUSSIA > PLUTO", "SURFACE AREA, MILLION KM2", D3, [("Pluto", 16.7, (215, 190, 170), "16.7"), ("Russia", 17.1, (230, 90, 90), "17.1")], area=True, maxr=300, baseline=1000)),
     ("One country is bigger than a planet. A dwarf one, but still a planet.", words_scene(["ONE COUNTRY", "BIGGER THAN", "A WORLD"], D3, [SOFT, WHITE, GOLD], 100)),
    ]
    return make_reel(479, "russia_pluto", "russia is bigger than pluto", N, story="Russia 17.1 million km2; Pluto surface about 16.65 million km2.")

REELS = dict(andromeda=andromeda, sunmass=sunmass, seafloor=seafloor, chess=chess, bones=bones, pulsar=pulsar, baikal=baikal, iss=iss, sahara=sahara, russia=russia)
