"""Batch 94: planets, trees and ocean facts."""
import math
from facts import *
from scripts.b91 import yr, D1, D2, D3, D4, D5

def olympus():
    it = [("Mount Everest", 8.8, WHITE, "8.8 km"), ("Olympus Mons, Mars", 21.9, OR, "21.9 km")]
    N = [
     ("There is a volcano on Mars about two and a half times taller than Mount Everest.", words_scene(["A VOLCANO ON MARS", "2.5X TALLER", "THAN EVEREST"], D3, [SOFT, OR, WHITE], 92)),
     ("Olympus Mons rises almost twenty two kilometers above the surrounding plain. Everest reaches less than nine.", bars_scene("HEIGHT IN KILOMETERS", it, D3, anchors=["Olympus", "Everest"], top=640, gapy=250)),
     ("It is also more than six hundred kilometers wide, so gentle you could climb it without noticing the slope.", words_scene(["600 KM WIDE", "A SLOPE SO GENTLE", "YOU'D MISS IT"], D3, [OR, SOFT, WHITE], 90)),
    ]
    return make_reel(480, "olympus_mons", "a volcano on mars is 2.5 times taller than everest", N, story="Olympus Mons about 21.9 km high, about 600 km across; Everest 8.85 km.")

def moondrive():
    def road(img, lt, n, b):
        disc(img, 170, 880, 90, (110, 170, 255)); glow(img, 170, 880, 150, (110, 170, 255), .3); disc(img, 910, 880, 40, (225, 225, 235))
        x = 170 + 90 + (910 - 40 - 170 - 90) * (n / 160); box(img, x - 30, 860, x + 30, 892, 8, (240, 90, 90)); line(img, [(260, 930), (870, 930)], 4, (80, 88, 130), a=.7)
    N = [
     ("If you could drive to the Moon at highway speed, the trip would take about a hundred and sixty days.", words_scene(["DRIVE TO THE MOON", "AT HIGHWAY SPEED", "160 DAYS"], D2, [SOFT, WHITE, GOLD], 90)),
     ("The Moon is about three hundred and eighty four thousand kilometers away. At a hundred an hour, you would be driving for over five months.", num_scene(0, 160, lambda n: f"{int(n)} days", "NON-STOP AT 100 KM/H", GOLD, D2, deco=road, t0=.6)),
     ("The Moon is the closest thing we have to a neighbor, and it is still a five month drive.", words_scene(["OUR CLOSEST", "NEIGHBOR IS", "5 MONTHS AWAY"], D2, [SOFT, WHITE, GOLD], 96)),
    ]
    return make_reel(481, "moon_road_trip", "driving to the moon would take 160 days", N, story="384,400 km / 100 km/h = 3,844 h = 160 days.")

def venushot():
    it = [("Mercury, hottest daytime", 430, OR, "430 C"), ("Venus, everywhere", 465, RD, "465 C")]
    N = [
     ("Venus is hotter than Mercury, even though Mercury is much closer to the Sun.", words_scene(["VENUS IS HOTTER", "THAN MERCURY", "THOUGH FARTHER"], D3, [RD, SOFT, OR], 92)),
     ("Mercury's daytime side reaches about four hundred and thirty degrees. The surface of Venus is about four hundred and sixty five, day and night.", thermo_scene("465 C", "THE HOTTEST PLANET", D3, it, vmax=500, anchors=["Mercury", "Venus"])),
     ("Venus is wrapped in a thick blanket of carbon dioxide that traps all that heat.", words_scene(["A BLANKET OF CO2", "TRAPS THE HEAT", "DAY AND NIGHT"], D3, [SOFT, RD, WHITE], 92)),
    ]
    return make_reel(482, "venus_hotter", "venus is hotter than mercury", N, story="Venus surface about 465 C; Mercury daytime max about 430 C.")

def oldlight():
    it = [("Out of the Sun's core, to its surface", 5e10, GOLD, "tens of thousands of years"), ("From the Sun's surface to you", 8, CYAN, "8 minutes")]
    N = [
     ("The sunlight on your face took eight minutes to get here, but it spent tens of thousands of years just getting out of the Sun.", words_scene(["SUNLIGHT IS OLD", "TENS OF THOUSANDS", "OF YEARS OLD"], D1, [SOFT, GOLD, WHITE], 90)),
     ("Light bounces around the Sun's dense core for a very long time before it escapes.", bars_scene("THE JOURNEY OF A PHOTON", it, D1, log=True, anchors=["bounces", "escapes"], top=640, gapy=260)),
     ("The warmth you feel today started its trip long before humans learned to farm.", words_scene(["TODAY'S SUNLIGHT", "LEFT THE CORE", "BEFORE FARMING"], D1, [SOFT, GOLD, WHITE], 92)),
    ]
    return make_reel(483, "sunlight_age", "the sunlight on your face is tens of thousands of years old", N, story="Photon random walk out of the Sun's core takes about 10,000 to 170,000 years; then 8.3 minutes to Earth.")

def bristle():
    ev = [(-2833, "Methuselah sprouts", GR, 2), (-2560, "Great Pyramid built", OR, 0)]
    N = [
     ("A tree in California is older than the Great Pyramid of Giza.", words_scene(["A TREE IN CALIFORNIA", "IS OLDER THAN", "THE GREAT PYRAMID"], D4, [GR, SOFT, OR], 90)),
     ("A bristlecone pine called Methuselah sprouted about forty eight hundred years ago. The pyramid was built a few centuries after.", timeline_scene("OLDER THAN THE PYRAMID", "A TREE THAT'S STILL ALIVE", D4, ev, -2950, -2450, yr, gaps=[(0, 1, "273 YEARS EARLIER")])),
     ("It is still alive today, in the White Mountains.", words_scene(["IT'S STILL ALIVE", "TODAY"], D4, [GR, SOFT], 108)),
    ]
    return make_reel(484, "bristlecone_pyramid", "a tree in california is older than the great pyramid", N, story="Methuselah, Pinus longaeva, about 4,855 years old (germinated about 2833 BC); Great Pyramid about 2560 BC.")

def hyperion():
    it = [("Statue of Liberty, to the torch", 93, GOLD, "93 m"), ("Hyperion, a coast redwood", 116, GR, "116 m")]
    N = [
     ("The tallest tree on Earth is taller than the Statue of Liberty.", words_scene(["THE TALLEST TREE", "BEATS THE STATUE", "OF LIBERTY"], D4, [GR, SOFT, GOLD], 92)),
     ("Hyperion, a coast redwood in California, stands about a hundred and sixteen meters tall. The Statue of Liberty reaches ninety three, torch included.", bars_scene("HEIGHT IN METERS", it, D4, anchors=["Hyperion", "Statue"], top=640, gapy=250)),
     ("Its exact location is a secret, to protect the tree.", words_scene(["ITS LOCATION", "IS A SECRET"], D4, [SOFT, GR], 108)),
    ]
    return make_reel(485, "tallest_tree", "the tallest tree on earth is taller than the statue of liberty", N, story="Hyperion about 116 m (2019); Statue of Liberty 93 m from ground to torch. Location closed to the public.")

def antarctica():
    N = [
     ("About sixty percent of all the fresh water on Earth is frozen in Antarctica.", words_scene(["60% OF ALL", "FRESH WATER", "IS IN ANTARCTICA"], D4, [CY, SOFT, WHITE], 92)),
     ("The Antarctic ice sheet is nearly five kilometers thick in places.", dots_scene("ABOUT 60%", "OF EARTH'S FRESH WATER", D4, 60, total=100, cols=10, col_hl=CY, label_hl="FROZEN IN ONE CONTINENT", anchor="Antarctic", big_fmt=lambda k: f"{k}%")),
     ("If it all melted, sea levels would rise by about fifty eight meters.", words_scene(["IF IT ALL MELTED", "+58 METERS", "OF SEA LEVEL"], D4, [SOFT, CY, WHITE], 92)),
    ]
    return make_reel(486, "antarctica_water", "60 percent of earth's fresh water is in antarctica", N, story="Antarctic ice sheet holds about 61% of Earth's fresh water; sea-level equivalent about 58 m; max thickness about 4.8 km.")

def challenger():
    it = [("Mount Everest, height", 8849, WHITE, "8,849 m"), ("Challenger Deep, depth", 10935, CY, "10,935 m")]
    N = [
     ("The deepest point in the ocean is deeper than Everest is tall.", words_scene(["THE OCEAN'S DEEPEST", "POINT IS DEEPER", "THAN EVEREST IS TALL"], D5, [CY, SOFT, WHITE], 88)),
     ("Challenger Deep is almost eleven thousand meters down. Everest is under nine thousand meters tall.", bars_scene("DEPTH VS HEIGHT, IN METERS", it, D5, anchors=["Challenger", "Everest"], top=640, gapy=250)),
     ("Drop Everest in, and its peak would still be over two kilometers underwater.", words_scene(["EVEREST WOULD BE", "2 KM UNDERWATER"], D5, [SOFT, CY], 100)),
    ]
    return make_reel(487, "challenger_deep", "the ocean is deeper than everest is tall", N, story="Challenger Deep about 10,935 m; Everest 8,849 m; difference about 2,086 m.")

REELS = dict(olympus=olympus, moondrive=moondrive, venushot=venushot, oldlight=oldlight, bristle=bristle, hyperion=hyperion, antarctica=antarctica, challenger=challenger)
