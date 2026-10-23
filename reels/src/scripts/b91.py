"""Batch 91: time, heat, body and scale facts."""
import math
from facts import *

def yr(t): return f"{int(-t)} BC" if t < 0 else f"{int(t)}"
def mya(t):
    if t > -1: return f"{int(-t * 1000):,} years ago"
    return f"{int(-t)} million years ago"
D1 = (18, 12, 6, 0); D2 = (8, 10, 26, 1); D3 = (24, 8, 12, 0); D4 = (6, 18, 22, 0); D5 = (20, 12, 30, 0)

def blood():
    N = [
     ("Your body makes about two million red blood cells every second.", words_scene(["YOUR BODY MAKES", "2 MILLION", "RED BLOOD CELLS", "EVERY SECOND"], D3, [SOFT, GOLD, RED, WHITE], 90)),
     ("Right now, your bone marrow is making them. This counter is running at the real speed.", counter_scene(2000000, lambda n: f"{int(n):,}", "NEW RED BLOOD CELLS, LIVE", D3, col=RED, label2="ONE SECOND = 2,000,000")),
     ("That adds up to hundreds of billions every day.", words_scene(["~170 BILLION", "EVERY DAY"], D3, [RED, WHITE], 110)),
     ("Each one lives about four months, then your body recycles it.", words_scene(["EACH ONE LASTS", "ABOUT 4 MONTHS"], D3, [SOFT, GOLD], 96)),
     ("Your blood is brand new every four months.", words_scene(["YOUR BLOOD", "IS BRAND NEW", "EVERY 4 MONTHS"], D3, [WHITE, RED, GOLD], 96)),
    ]
    return make_reel(440, "blood_cells", "your body makes 2 million red blood cells every second", N, story="Bone marrow produces about 2-3 million RBC per second; lifespan about 120 days.")

def oxford():
    ev = [(1096, "Oxford starts teaching", GOLD, 0), (1325, "Tenochtitlan founded", ORANGE, 2), (1428, "Aztec Empire begins", RED, 1), (1521, "Aztecs fall to Spain", SOFT, 3)]
    N = [
     ("Oxford University is older than the Aztec Empire.", words_scene(["OXFORD", "IS OLDER THAN", "THE AZTEC EMPIRE"], D1, [GOLD, SOFT, ORANGE], 100)),
     ("Students were already being taught at Oxford in the eleventh century. The Aztec capital was not founded until the fourteenth century, and the empire itself came later.", timeline_scene("1096 VS 1428", "OXFORD VS THE AZTEC EMPIRE", D1, ev, 1050, 1560, lambda t: str(int(t)), gaps=[(0, 2, "OVER 300 YEARS EARLIER")])),
     ("A university that is older than an empire.", words_scene(["A UNIVERSITY", "OLDER THAN", "AN EMPIRE"], D1, [SOFT, WHITE, GOLD], 100)),
    ]
    return make_reel(441, "oxford_aztec", "oxford is older than the aztec empire", N, story="Teaching at Oxford existed by 1096; Aztec Triple Alliance 1428; Tenochtitlan founded 1325.")

def cleopatra():
    ev = [(-2560, "Great Pyramid built", ORANGE, 0), (-69, "Cleopatra born", GOLD, 2), (1969, "Moon landing", BLUE, 0)]
    N = [
     ("Cleopatra lived closer in time to the Moon landing than to the building of the Great Pyramid.", words_scene(["CLEOPATRA LIVED", "CLOSER TO THE", "MOON LANDING"], D1, [WHITE, SOFT, BLUE], 90)),
     ("The Great Pyramid went up about forty five hundred years ago. Cleopatra was born about two thousand years ago. And the Moon landing was in nineteen sixty nine.", timeline_scene("2,491 VS 2,038", "YEARS APART", D1, ev, -2800, 2100, yr, gaps=[(0, 1, "2,491 YEARS"), (1, 2, "2,038 YEARS")])),
     ("The pyramids were more ancient to Cleopatra than she is to us.", words_scene(["THE PYRAMIDS WERE", "ANCIENT TO HER", "TOO"], D1, [SOFT, GOLD, WHITE], 92)),
    ]
    return make_reel(442, "cleopatra_moon", "cleopatra lived closer to the moon landing than to the pyramids", N, story="Great Pyramid c. 2560 BC; Cleopatra VII b. 69 BC; Apollo 11 1969.")

def sharks():
    ev = [(-450, "First sharks", BLUE, 0), (-385, "First forests", GREEN, 2), (-230, "First dinosaurs", ORANGE, 0), (-0.3, "Humans", PINKC, 2)]
    N = [
     ("Sharks are older than trees.", words_scene(["SHARKS", "ARE OLDER", "THAN TREES"], D4, [BLUE, SOFT, GREEN], 110)),
     ("Sharks have been around for over four hundred and fifty million years. The first forests did not appear until about three hundred and eighty five million years ago.", timeline_scene("SHARKS FIRST", "MILLIONS OF YEARS AGO", D4, ev, -500, 0, mya, gaps=[(0, 1, "65 MILLION YEARS EARLIER")])),
     ("For tens of millions of years the ocean had top predators and the land had no forests.", words_scene(["THE OCEAN HAD", "APEX PREDATORS", "BEFORE LAND HAD FORESTS"], D4, [SOFT, BLUE, GREEN], 86)),
    ]
    return make_reel(443, "sharks_trees", "sharks are older than trees", N, story="Earliest shark-like fossils about 450 Mya; Gilboa forest about 385 Mya.")

def mammoth():
    ev = [(-2560, "Great Pyramid built", ORANGE, 0), (-2000, "Last mammoths", PINKC, 2)]
    N = [
     ("Woolly mammoths were still alive when the Great Pyramid was built.", words_scene(["MAMMOTHS WERE", "STILL ALIVE", "WHEN THE PYRAMIDS WENT UP"], D1, [SOFT, GOLD, ORANGE], 90)),
     ("The Great Pyramid was built around twenty five sixty BC. The last mammoths lived on an island off Siberia until about two thousand BC.", timeline_scene("MAMMOTHS + PYRAMIDS", "THEY OVERLAPPED", D1, ev, -2800, -1600, yr, gaps=[(0, 1, "MAMMOTHS OUTLASTED IT")])),
     ("Some mammoths were still around when the pyramids were new.", words_scene(["STILL AROUND", "WHEN THE PYRAMIDS", "WERE NEW"], D1, [GOLD, SOFT, WHITE], 96)),
    ]
    return make_reel(444, "mammoth_pyramid", "mammoths were alive when the great pyramid was built", N, story="Wrangel Island mammoths survived until about 4,000 years ago (c. 2000 BC).")

def lightning():
    it = [("Lava", 1200, ORANGE, "1,200 C"), ("Surface of the Sun", 5500, GOLD, "5,500 C"), ("A lightning bolt", 30000, BLUE, "30,000 C")]
    N = [
     ("A bolt of lightning is about five times hotter than the surface of the Sun.", words_scene(["LIGHTNING", "IS 5 TIMES HOTTER", "THAN THE SUN"], D2, [BLUE, SOFT, GOLD], 96)),
     ("Lava is around twelve hundred degrees Celsius. The surface of the Sun is about fifty five hundred.", thermo_scene("HOW HOT?", "DEGREES CELSIUS", D2, it[:2], vmax=30000, anchors=["Lava", "Sun"])),
     ("Lightning heats the air around it to roughly thirty thousand.", thermo_scene("30,000 C", "A LIGHTNING BOLT", D2, it, vmax=30000, anchors=["Lava", "Sun", "thirty"])),
     ("Gone in a fraction of a second.", words_scene(["ALL OF IT", "IN A FRACTION", "OF A SECOND"], D2, [BLUE, SOFT, WHITE], 100)),
    ]
    return make_reel(445, "lightning_hotter", "lightning is five times hotter than the sun", N, story="Lightning channel about 30,000 K; solar photosphere about 5,800 K.")

def core():
    it = [("Boiling water", 100, CYAN, "100 C"), ("Lava", 1200, ORANGE, "1,200 C"), ("Earth's core", 5200, RED, "5,200 C"), ("Sun's surface", 5500, GOLD, "5,500 C")]
    N = [
     ("The center of the Earth is about as hot as the surface of the Sun.", words_scene(["THE CENTER", "OF THE EARTH", "IS AS HOT AS", "THE SUN'S SURFACE"], D3, [SOFT, WHITE, GOLD, ORANGE], 84)),
     ("Boiling water is a hundred degrees. Lava is about twelve hundred.", thermo_scene("HOW HOT?", "DEGREES CELSIUS", D3, it[:2], vmax=5500, anchors=["Boiling", "Lava"])),
     ("Down in the core it is roughly fifty two hundred. The Sun's surface is only a little more.", thermo_scene("5,200 C", "EARTH'S CORE VS THE SUN'S SURFACE", D3, it, vmax=5500, anchors=["Boiling", "Lava", "core", "Sun's"])),
     ("We live on a thin crust above a core as hot as a star's surface.", words_scene(["A THIN CRUST", "OVER A CORE AS", "HOT AS A STAR"], D3, [SOFT, WHITE, RED], 92)),
    ]
    return make_reel(446, "core_hot", "the earth's core is as hot as the sun's surface", N, story="Inner core about 5,200 C; photosphere about 5,500 C.")

def cloud():
    N = [
     ("A single fluffy cloud can weigh as much as eighty elephants.", words_scene(["A FLUFFY CLOUD", "WEIGHS AS MUCH AS", "80 ELEPHANTS"], D2, [WHITE, SOFT, GOLD], 94)),
     ("A typical cumulus cloud holds about five hundred tons of water.", dots_scene("80 ELEPHANTS", "ABOUT 500 TONS OF WATER", D2, 80, total=100, cols=10, col_hl=(150, 190, 255), label_hl="1 DOT = 1 ELEPHANT", anchor="cumulus", big_fmt=lambda k: f"{k} ELEPHANTS")),
     ("It floats because the water is spread out across billions of tiny droplets in a huge volume of air.", words_scene(["TINY DROPLETS", "SPREAD ACROSS", "A HUGE SPACE"], D2, [SOFT, WHITE, (150, 190, 255)], 96)),
     ("Next time you see one, you are looking at a herd.", words_scene(["YOU ARE LOOKING", "AT A HERD"], D2, [SOFT, GOLD], 104)),
    ]
    return make_reel(447, "cloud_elephants", "a cloud weighs as much as 80 elephants", N, story="Cumulus about 500,000 kg; elephant about 6,000 kg.")

def gps():
    N = [
     ("Your phone's GPS only works because of Einstein.", words_scene(["YOUR MAPS APP", "NEEDS", "EINSTEIN"], D5, [SOFT, WHITE, GOLD], 104)),
     ("Clocks on satellites tick slightly faster than clocks on the ground.", words_scene(["SATELLITE CLOCKS", "TICK FASTER", "THAN YOURS"], D5, [SOFT, GOLD, WHITE], 92)),
     ("If engineers ignored that, your location would drift by about ten kilometers every single day.", num_scene(0, 10, lambda n: f"{n:.1f} km", "OFF EVERY DAY WITHOUT RELATIVITY", GOLD, D5, t0=.6)),
     ("Relativity is not just a theory. It is in your pocket.", words_scene(["RELATIVITY", "IS IN", "YOUR POCKET"], D5, [GOLD, SOFT, WHITE], 100)),
    ]
    return make_reel(448, "gps_einstein", "your phone's gps only works because of einstein", N, story="Relativistic corrections total about 38 microseconds per day, about 11 km of ranging error.")

def apollo():
    it = [("Apollo 11 guidance computer", 4, ORANGE, "4 KB"), ("A modern phone", 8000000, BLUE, "8 GB")]
    N = [
     ("The computer that guided Apollo eleven to the Moon had about four kilobytes of memory.", words_scene(["APOLLO 11", "RAN ON ABOUT", "4 KB OF MEMORY"], D2, [ORANGE, SOFT, GOLD], 96)),
     ("That is less than a single photo on your phone.", words_scene(["LESS THAN", "ONE PHOTO", "ON YOUR PHONE"], D2, [SOFT, WHITE, GOLD], 104)),
     ("It still navigated three hundred and eighty four thousand kilometers to the Moon and back.", words_scene(["384,000 KM", "TO THE MOON", "AND BACK"], D2, [GOLD, SOFT, WHITE], 100)),
     ("Your phone has around two million times more.", bars_scene("MEMORY (LOG SCALE)", it, D2, log=True, anchors=["four", "phone"], top=640, gapy=250)),
     ("They still made it.", words_scene(["AND THEY", "STILL MADE IT"], D2, [SOFT, GOLD], 112)),
    ]
    return make_reel(449, "apollo_phone", "your phone has 2 million times the memory of the apollo computer", N, story="AGC about 4 KB erasable RAM (2K words) and 72 KB ROM; a phone with 8 GB RAM is about 2,000,000x.")

def blink():
    N = [
     ("You spend up to ten percent of your waking life with your eyes closed, and you never notice.", words_scene(["UP TO 10%", "OF YOUR WAKING LIFE", "EYES CLOSED"], D5, [GOLD, SOFT, WHITE], 90)),
     ("You blink about fifteen times a minute. Each blink is a fraction of a second.", dots_scene("UP TO 10%", "BLINKING", D5, 10, total=100, cols=10, col_hl=GOLD, label_hl="OF YOUR WAKING DAY", anchor="blink", big_fmt=lambda k: f"{k}%")),
     ("Your brain quietly fills in the gaps, so the world never goes dark.", words_scene(["YOUR BRAIN", "FILLS IN", "THE GAPS"], D5, [SOFT, GOLD, WHITE], 100)),
    ]
    return make_reel(452, "blink_ten_percent", "you spend up to 10 percent of your waking life blinking", N, story="Blink rate 15-20/min; blinking can occupy roughly 4-10% of waking time.")

def pluto():
    N = [
     ("Pluto has not finished a single lap around the Sun since we discovered it.", words_scene(["PLUTO HAS NOT", "FINISHED ONE LAP", "SINCE WE FOUND IT"], D2, [GOLD, SOFT, WHITE], 90)),
     ("We found it in nineteen thirty. One trip around the Sun takes Pluto two hundred and forty eight years.", orbit_scene("PLUTO", "ONE LAP TAKES 248 YEARS", D2, [dict(r=360, period=248, color=(210, 190, 170), size=26, label="Pluto")], star_r=30, show_arc=(0, .387))),
     ("It will not finish its first lap until twenty one seventy eight.", words_scene(["FIRST LAP ENDS", "IN 2178"], D2, [SOFT, GOLD], 110)),
    ]
    return make_reel(454, "pluto_lap", "pluto hasn't finished one orbit since it was discovered", N, story="Discovered 1930; orbital period 248 years; first full orbit ends about 2178.")

def maunakea():
    it = [("Mount Everest, above sea level", 8849, WHITE, "8,849 m"), ("Mauna Kea, base to summit", 10210, GREEN, "10,210 m")]
    N = [
     ("Mount Everest is not the tallest mountain on Earth.", words_scene(["EVEREST", "IS NOT THE", "TALLEST MOUNTAIN"], D4, [WHITE, SOFT, GREEN], 100)),
     ("Mauna Kea in Hawaii is over ten thousand meters from its base to its summit.", bars_scene("MOUNTAIN HEIGHT", it, D4, anchors=["Everest", "Mauna"], top=640, gapy=250)),
     ("Most of it sits underwater. Everest is just the highest above the sea.", words_scene(["MOST OF IT", "IS UNDERWATER"], D4, [GREEN, SOFT], 104)),
     ("And measured from the center of the Earth, the tallest point is Chimborazo in Ecuador, because the planet bulges at the equator.", words_scene(["FARTHEST FROM", "EARTH'S CENTER:", "CHIMBORAZO"], D4, [SOFT, WHITE, GREEN], 88)),
    ]
    return make_reel(455, "mauna_kea", "everest is not the tallest mountain on earth", N, story="Mauna Kea about 10,210 m from base on the ocean floor; 4,207 m above sea level. Everest 8,849 m above sea level.")

def redspot():
    N = [
     ("Jupiter has a storm that has been raging for at least two hundred years, and it is wider than Earth.", words_scene(["A STORM ON JUPITER", "WIDER THAN EARTH", "FOR 200 YEARS"], D3, [SOFT, GOLD, ORANGE], 88)),
     ("The Great Red Spot is about sixteen thousand kilometers across. Earth is about thirteen thousand.", circles_scene("WIDER THAN EARTH", "THE GREAT RED SPOT", D3, [("Earth", 12.7, (110, 170, 255), "EARTH"), ("Great Red Spot", 16.3, (230, 100, 70), "SPOT")], maxr=300, baseline=1000)),
     ("People have been watching it since at least eighteen thirty one.", words_scene(["SEEN SINCE", "AT LEAST", "1831"], D3, [SOFT, WHITE, GOLD], 104)),
    ]
    return make_reel(456, "great_red_spot", "a storm on jupiter is wider than earth and 200 years old", N, story="Great Red Spot about 16,350 km wide (2017); continuous observation since 1831.")

def pacific():
    N = [
     ("The Pacific Ocean is bigger than all of Earth's land put together.", words_scene(["THE PACIFIC", "IS BIGGER THAN", "ALL THE LAND"], D4, [CYAN, SOFT, GREEN], 100)),
     ("The Pacific covers about one hundred and sixty five million square kilometers. All the land adds up to about one hundred and forty nine million.", circles_scene("PACIFIC > ALL LAND", "AREA, MILLION KM2", D4, [("All of Earth's land", 149, GREEN, "149"), ("The Pacific Ocean", 165, CYAN, "165")], area=True, maxr=300, baseline=1000)),
     ("One ocean is larger than every continent combined.", words_scene(["ONE OCEAN", "BEATS EVERY", "CONTINENT COMBINED"], D4, [CYAN, SOFT, GREEN], 96)),
    ]
    return make_reel(457, "pacific_vs_land", "the pacific ocean is bigger than all land combined", N, story="Pacific about 165.25 million km2; Earth's land about 148.9 million km2.")

def eiffel():
    def tower(img, lt, n, b):
        top = 520 - n * 3.0; base = 1180
        for w, col in ((1, (200, 205, 225)),):
            line(img, [(540 - 190, base), (540, top)], 10, col); line(img, [(540 + 190, base), (540, top)], 10, col)
            for k in range(1, 6): y = base - k * (base - top) / 6; hw = 190 * (y - top) / (base - top); line(img, [(540 - hw, y), (540 + hw, y)], 5, col, a=.6)
        disc(img, 540, top, 12, GOLD)
    N = [
     ("The Eiffel Tower is taller in summer than in winter.", words_scene(["THE EIFFEL TOWER", "GROWS IN", "THE SUMMER"], D3, [SOFT, WHITE, GOLD], 96)),
     ("Heat expands the iron, so on a hot day it grows by up to fifteen centimeters.", num_scene(0, 15, lambda n: f"+{n:.0f} cm", "TALLER ON A HOT DAY", GOLD, D3, deco=tower, t0=.8)),
     ("It shrinks back when it cools. Every year, again.", words_scene(["IT SHRINKS BACK", "WHEN IT COOLS"], D3, [SOFT, WHITE], 100)),
    ]
    return make_reel(458, "eiffel_summer", "the eiffel tower grows 15 cm in summer", N, story="Thermal expansion of the iron: up to about 15 cm.")

def bees():
    N = [
     ("A worker bee makes about one twelfth of a teaspoon of honey in her entire life.", words_scene(["ONE BEE'S LIFE", "ONE TWELFTH", "OF A TEASPOON"], D1, [SOFT, GOLD, WHITE], 96)),
     ("So one spoonful on your toast took twelve bees their whole lives.", dots_scene("12 BEES", "ONE TEASPOON OF HONEY", D1, 12, total=12, cols=4, col_hl=GOLD, col_rest=DIM, label_hl="THEIR WHOLE LIVES", anchor="twelve", big_fmt=lambda k: f"{k} BEES")),
     ("To fill a single jar, a hive visits around two million flowers.", words_scene(["ONE JAR", "~2 MILLION", "FLOWERS"], D1, [SOFT, GOLD, WHITE], 104)),
     ("Every spoonful is twelve lifetimes of work.", words_scene(["EVERY SPOONFUL", "IS TWELVE", "LIFETIMES OF WORK"], D1, [SOFT, GOLD, WHITE], 96)),
    ]
    return make_reel(463, "bees_teaspoon", "12 bees make one teaspoon of honey in their whole lives", N, story="One worker bee produces about 1/12 teaspoon of honey in her lifetime.")

REELS = dict(blood=blood, oxford=oxford, cleopatra=cleopatra, sharks=sharks, mammoth=mammoth, lightning=lightning, core=core, cloud=cloud, gps=gps, apollo=apollo, blink=blink, pluto=pluto, maunakea=maunakea, redspot=redspot, pacific=pacific, bees=bees)
