"""Batch 44: education reels, history and geography."""
import math
from edu import *
import functools
R = functools.partial(R, chip="HISTORY & GEOGRAPHY")

def cleopatra():
    a = 2560 - 69; b = 69 + 1969 - 1; c = 69 + 2007 - 1
    assert (a, b) == (2491, 2037)
    n = [
     N("Cleopatra lived closer in time to the Moon landing than to the building of the Great Pyramid. That sounds impossible. Let's check.", T.kinetic([("CLEOPATRA", WHITE, 100), ("vs THE PYRAMID", GOLD, 100), ("vs THE MOON", CY, 100)])),
     N("The Great Pyramid of Giza was built around twenty five hundred and sixty B.C. Cleopatra was born in sixty nine B.C.", T.timeline("the timeline", [(-2560, "Great Pyramid"), (-69, "Cleopatra")], -2700, 2100, fmtx=lambda x: f"{abs(x):.0f} {'BC' if x < 0 else 'AD'}")),
     N("That is a gap of about twenty five hundred years between the pyramid and Cleopatra.", T.num("pyramid to Cleopatra", 2491, fmt="{:,.0f}", post=" years", color=ORG, bottom="2,491 years", word="twenty", dur=1.4)),
     N("Now count forward. Cleopatra died in thirty B.C. The Moon landing was in nineteen sixty nine. That gap is only about two thousand years.", T.timeline("the timeline", [(-2560, "Great Pyramid"), (-69, "Cleopatra"), (1969, "Moon landing")], -2700, 2100, fmtx=lambda x: f"{abs(x):.0f} {'BC' if x < 0 else 'AD'}")),
     N("About two thousand thirty seven years from her birth to the Moon landing. Cleopatra is about four hundred fifty years closer to us than to the pyramid builders.", T.num("Cleopatra to the Moon landing", 2037, fmt="{:,.0f}", post=" years", color=CY, bottom="450 years closer than the pyramid", word="two", dur=1.4)),
     N("The pyramid was already ancient when Cleopatra was alive. To her, it was older than the Roman Empire is to us.", T.kinetic([("TO CLEOPATRA", WHITE, 80), ("THE PYRAMID", GOLD, 100), ("WAS ANCIENT", GOLD, 100)])),
     N("History is not a straight line of equal steps. Some eras are separated by millennia, and some are practically neighbors.", T.kinetic([("TIME IS", WHITE, 90), ("NOT EVEN", GOLD, 120)])),
    ]
    return R(255, "cleopatra_pyramid_moon", "Cleopatra lived closer to the Moon landing than the pyramids", "Cleopatra lived closer in time to the Moon landing than to the building of the Great Pyramid. send this to a history teacher",
             "Great Pyramid built c. 2560 BC. Cleopatra VII born 69 BC. Moon landing AD 1969. 2560-69 = 2,491 years; 69 + 1969 - 1 (no year 0) = 2,037 years.", "cine", n)

def oxford():
    n = [
     N("Oxford University is older than the Aztec Empire. Real history is stranger than the myths we learned.", T.kinetic([("OXFORD", WHITE, 100), ("IS OLDER THAN", WHITE, 70), ("THE AZTECS", GOLD, 110)])),
     N("There is evidence of teaching at Oxford as far back as ten ninety six. It grew quickly after eleven sixty seven, when English students were banned from studying in Paris.", T.stat("teaching at Oxford", "1096", "earliest evidence of teaching", GOLD, "", 190)),
     N("The Aztec city of Tenochtitlan was founded in thirteen twenty five. That's more than two hundred years after teaching began at Oxford.", T.timeline("the timeline", [(1096, "teaching begins at Oxford"), (1325, "Tenochtitlan founded")], 1050, 1550, fmtx=lambda x: f"{x:.0f}")),
     N("The Aztec Empire itself, the Triple Alliance, began even later, in fourteen twenty eight, and it fell to the Spanish in fifteen twenty one.", T.timeline("the timeline", [(1096, "Oxford"), (1325, "Tenochtitlan"), (1428, "Aztec Empire begins"), (1521, "falls to Spain")], 1050, 1550, fmtx=lambda x: f"{x:.0f}")),
     N("So when the Aztec Empire fell, Oxford had already been teaching students for over four hundred years.", T.num("Oxford had been teaching for", 425, fmt="{:,.0f}", post=" years", color=GOLD, bottom="when the Aztec Empire fell", word="four", dur=1.4)),
     N("It gets better. Oxford was already older when the University of Cambridge, Harvard, and Yale were founded. Harvard came in sixteen thirty six.", T.bars("year founded", [("Oxford (teaching)", 1096), ("Cambridge", 1209), ("Harvard", 1636), ("Yale", 1701)], fmt="{:.0f}", cols=[GOLD, CY, PINK, ORG], words=["Oxford", "Cambridge", "Harvard", "Yale"])),
     N("We tend to think old means ancient history, and new means modern. But a university and an empire can overlap in ways that break the story we expect.", T.kinetic([("HISTORY", WHITE, 100), ("OVERLAPS", GOLD, 120)])),
    ]
    return R(256, "oxford_older_than_aztecs", "Oxford University is older than the Aztec Empire", "Oxford was teaching students 200 years before the Aztec city of Tenochtitlan was founded. send this to someone who loves history",
             "Teaching at Oxford is documented from 1096; Tenochtitlan was founded in 1325 and the Aztec Triple Alliance formed in 1428; the Spanish conquest was completed in 1521. Cambridge 1209, Harvard 1636, Yale 1701.", "cine", n)

def mammoth():
    n = [
     N("Woolly mammoths were still alive when the Great Pyramid was being built. Let that sink in.", T.kinetic([("MAMMOTHS WERE ALIVE", WHITE, 70), ("WHEN THE PYRAMIDS", WHITE, 70), ("WERE BUILT", GOLD, 110)])),
     N("We picture mammoths and ice age hunters as ancient history, from a different world, tens of thousands of years ago.", T.kinetic([("ICE AGE", WHITE, 100), ("= LONG AGO?", GOLD, 100)])),
     N("But on Wrangel Island, off the coast of Siberia, a small population of mammoths survived until about four thousand years ago.", T.num("last mammoths died", 4000, fmt="{:,.0f}", post=" years ago", color=PINK, bottom="on Wrangel Island, Siberia", word="four", dur=1.3)),
     N("The Great Pyramid of Giza was built around forty five hundred years ago. So the pyramid builders lived while mammoths were still walking the Earth.", T.timeline("years ago", [(-4500, "Great Pyramid built"), (-4000, "last mammoths on Wrangel")], -5000, 0, fmtx=lambda x: f"{abs(x):,.0f}")),
     N("The mammoths on the island were a tiny, isolated group, stuck on a landmass cut off from the mainland by rising seas.", T.stat("the last herd", "A FEW HUNDRED", "stuck on an island", CY, "isolated by rising seas", 100)),
     N("They were small in number and had low genetic variety, and they died out a few thousand years after the island was cut off.", T.kinetic([("TRAPPED", WHITE, 100), ("THEN GONE", GOLD, 120)])),
     N("The ancient world was not as ancient as it feels. The lives of pyramid builders and the last mammoths overlapped.", T.kinetic([("PYRAMIDS + MAMMOTHS", GOLD, 80), ("SAME ERA", WHITE, 110)])),
    ]
    return R(257, "mammoths_pyramids", "mammoths were alive when the pyramids were built", "the last woolly mammoths died about 4,000 years ago, after the Great Pyramid was built. send this to a dinosaur kid",
             "Woolly mammoths survived on Wrangel Island until about 4,000 years ago (Vartanyan 1993; Dehasque 2024: population of a few hundred, extinct about 4,000 years ago); the Great Pyramid of Giza was completed about 4,500 years ago.", "cine", n)

def nintendo():
    n = [
     N("Nintendo is older than the airplane, the car assembly line, and the Titanic. It started in eighteen eighty nine, and it didn't make video games.", T.kinetic([("NINTENDO", WHITE, 100), ("IS OLDER THAN", WHITE, 70), ("THE AIRPLANE", GOLD, 100)])),
     N("A craftsman named Fusajiro Yamauchi founded it in Kyoto, Japan, in eighteen eighty nine, to sell handmade playing cards.", T.stat("founded in Kyoto", "1889", "handmade playing cards, called hanafuda", GOLD, "", 190)),
     N("That same year, Benjamin Harrison was the president of the United States, and the Eiffel Tower had just opened in Paris.", T.stat("also in 1889", "EIFFEL TOWER", "Benjamin Harrison was president", CY, "", 110)),
     N("The Wright brothers' first flight was fourteen years later, in nineteen oh three. The Model T came in nineteen oh eight. The Titanic sailed in nineteen twelve.", T.timeline("the timeline", [(1889, "Nintendo founded"), (1903, "first airplane flight"), (1908, "Model T"), (1912, "Titanic")], 1880, 1920, fmtx=lambda x: f"{x:.0f}")),
     N("Nintendo kept making playing cards for over seventy years. It tried a taxi company, instant rice, and even a love hotel, before landing on toys.", T.steps("before video games", [("playing cards", "1889"), ("taxis, instant rice", "1950s to 60s"), ("toys", "then video games")], words=["playing", "taxi", "toys"])),
     N("Its first electronic hit arrived in nineteen eighty one, with Donkey Kong. A company that began in the Wild West era became a video game giant.", T.num("years from cards to Donkey Kong", 92, fmt="{:.0f}", post=" years", color=PINK, bottom="1889 to 1981", word="nineteen", dur=1.2)),
     N("So next time you hold a Nintendo controller, remember. It comes from a company founded when horses were the main way to travel.", T.kinetic([("FOUNDED WHEN", WHITE, 80), ("HORSES WERE", WHITE, 80), ("THE TAXIS", GOLD, 120)])),
    ]
    return R(258, "nintendo_1889", "Nintendo is older than the airplane", "Nintendo was founded in 1889, before the airplane, the Model T and the Titanic. it started with playing cards. send this to a gamer",
             "Nintendo Koppai founded 23 Sep 1889 in Kyoto by Fusajiro Yamauchi (hanafuda cards). Wright Flyer 1903, Model T 1908, Titanic 1912, Donkey Kong 1981. Diversifications 1960s: taxi service, instant rice, love hotels.", "bounce", n)

def russia_pluto():
    a = 4 * math.pi * 1188.3 ** 2
    assert 17.6e6 < a < 17.9e6
    n = [
     N("Pluto is smaller than our Moon. But it has as much land as the largest country on Earth. Let me show you how that works.", T.kinetic([("PLUTO IS TINY", WHITE, 90), ("BUT HUGE", GOLD, 140)], "space")),
     N("Pluto is about two thousand three hundred seventy six kilometers wide. Our Moon is thirty four seventy four. So Pluto is only two thirds the Moon's width.", T.vs(("Pluto", 2376, CY), ("Moon", 3474, GOLD), unit=" km", fmt="{:,.0f}", theme="space", word="Pluto")),
     N("But surface area depends on the square of the width. And Pluto's surface works out to about seventeen point seven million square kilometers.", T.num("Pluto's surface area", 17.7, fmt="{:.1f}", post=" million km²", color=GOLD, bottom="radius squared times four pi", theme="space", word="seventeen", dur=1.4)),
     N("Russia, the biggest country on Earth, covers seventeen point one million square kilometers.", T.num("Russia's area", 17.1, fmt="{:.1f}", post=" million km²", color=PINK, bottom="the largest country", theme="space", word="Russia", dur=1.2)),
     N("That means Pluto's entire surface, mountains of water ice, nitrogen glaciers, and all, is about the same size as Russia.", T.vs(("Russia", 17.1, PINK), ("Pluto", 17.7, CY), unit="M km²", fmt="{:.1f}", theme="space", word="same")),
     N("The Moon, by contrast, has about thirty eight million square kilometers. That's roughly Africa plus Australia, together.", T.num("the Moon's surface", 37.9, fmt="{:.1f}", post=" million km²", color=GRN, bottom="about Africa + Australia", theme="space", word="Moon", dur=1.2)),
     N("Distance and size can fool us. A world that looks like a dot in the telescope has as much land as the biggest country on Earth.", T.kinetic([("A DOT", WHITE, 100), ("WITH A", WHITE, 70), ("RUSSIA OF LAND", GOLD, 100)], "space")),
    ]
    return R(259, "pluto_vs_russia", "Pluto has as much land as Russia", "Pluto is smaller than our Moon, but its surface area is about the same as Russia's. send this to someone who thinks Pluto doesn't count",
             "Pluto radius 1,188.3 km -> surface area 17.7 million km2; Russia 17.1 million km2. Moon radius 1,737.4 km -> 37.9 million km2 (about Africa 30.4 + Australia 7.7 million km2).", "cine", n)

def texas():
    per = 695662e6 / 8.2e9; assert 84 < per < 86
    stand = 8.2e9 * .25 / 1e6
    n = [
     N("What if every single person on Earth went to Texas? Would they fit? They would, and they'd have a lot more room than you think.", T.kinetic([("ALL 8 BILLION PEOPLE", WHITE, 70), ("IN ONE STATE", GOLD, 110)])),
     N("Texas covers about six hundred ninety six thousand square kilometers. The world has around eight point two billion people.", T.num("Texas", 696, fmt="{:,.0f}", post=",000 km²", color=GOLD, bottom="8.2 billion people on Earth", word="six", dur=1.2)),
     N("Divide the area by the people, and each person gets about eighty five square meters. That's a house with a small yard, for everyone, in Texas.", T.formula(["696,000 km²  ÷  8.2 billion", "≈ 85 m² each"], title="the math")),
     N("Eighty five square meters is about nine hundred square feet. Roughly the size of a one bedroom apartment, for every person alive.", T.num("room for each person", 85, fmt="{:.0f}", post=" m²", color=GRN, bottom="about 900 square feet", word="eighty", dur=1.0)),
     N("Let's go further. If everyone stood shoulder to shoulder, with a quarter of a square meter each, the entire human race would fit in about two thousand square kilometers.", T.num("everyone, standing", 2050, fmt="{:,.0f}", post=" km²", color=PINK, bottom="a quarter of a meter each", word="quarter", dur=1.4)),
     N("That's smaller than Rhode Island, the smallest US state. All of humanity, standing, in an area smaller than one tiny state.", T.vs(("all of humanity", 2050, PINK), ("Rhode Island", 3144, CY), unit=" km²", fmt="{:,.0f}", theme="deep", word="Rhode")),
     N("So the problem isn't that the Earth is full. It's that we've spread out, and cities use space very differently than farmland. The planet has room. How we share it is the question.", T.kinetic([("THE EARTH", WHITE, 90), ("ISN'T FULL", GOLD, 130)])),
    ]
    return R(260, "world_fits_in_texas", "all 8 billion people fit in Texas", "every person on Earth could fit in Texas with 85 square meters each, or standing shoulder to shoulder in Rhode Island. send this to someone who says Earth is full",
             "Texas 695,662 km2 / 8.2e9 people = 84.8 m2 each (the often-quoted 'about 1,000 sq ft'). At 0.25 m2 per person standing, 8.2e9 x 0.25 = 2,050 km2, smaller than Rhode Island (3,144 km2).", "synth", n)

def canada():
    assert abs(243042 / 40075 - 6.06) < .01
    n = [
     N("Canada has more lakes than every other country in the world combined, and a coastline that could go around the Earth six times.", T.kinetic([("CANADA HAS", WHITE, 90), ("MORE LAKES THAN", WHITE, 70), ("THE WORLD", GOLD, 120)], "blue")),
     N("The Canadian landscape was carved by glaciers during the last ice age. The retreating ice left millions of dents that filled with water.", T.kinetic([("GLACIERS", WHITE, 100), ("CARVED IT", GOLD, 120)], "blue")),
     N("Canada has over eight hundred thousand lakes larger than three hectares, and by some counts more than two million in total.", T.num("lakes bigger than 3 hectares", 879800, fmt="{:,.0f}", color=CY, bottom="over 2 million, counting small ones", theme="blue", word="eight", dur=1.4)),
     N("By some counts, it holds more than half of all the lakes in the world. The rest of the planet shares what's left.", T.ring("of the world's lakes, by some counts", .62, "are in Canada", CY, theme="blue", word="half")),
     N("And its coastline is the longest in the world, about two hundred forty three thousand kilometers.", T.num("Canada's coastline", 243042, fmt="{:,.0f}", post=" km", color=GOLD, bottom="the longest in the world", theme="blue", word="two", dur=1.4)),
     N("That's more than six times the distance around the Earth at the equator.", T.vs(("around the Earth", 40075, CY), ("Canada's coast", 243042, GOLD), unit=" km", fmt="{:,.0f}", note="6× around the world", theme="blue", word="six")),
     N("Canada has only about forty million people. That's a lot of water and shoreline for each of them.", T.kinetic([("40 MILLION PEOPLE", WHITE, 80), ("2 MILLION LAKES", GOLD, 100)], "blue")),
    ]
    return R(261, "canada_lakes_coast", "Canada has more lakes than the rest of the world", "Canada has more lakes than the rest of the world combined and a coastline that circles the Earth 6 times. send this to a Canadian",
             "Canada: about 62% of the world's lake area by some estimates; at least 879,800 lakes over 3 ha (Natural Resources Canada), up to about 2 million; coastline 243,042 km (Canadian figure, the world's longest); Earth equator 40,075 km.", "lofi", n)

def mariana():
    d = 10935 - 8849; assert d == 2086
    n = [
     N("If you took Mount Everest and dropped it into the deepest part of the ocean, its peak would still be underwater, by more than two kilometers.", T.kinetic([("DROP EVEREST", WHITE, 90), ("IN THE OCEAN", WHITE, 90), ("STILL UNDERWATER", GOLD, 80)], "blue")),
     N("The deepest point on Earth is the Challenger Deep, in the Mariana Trench in the western Pacific. It's about ten thousand nine hundred thirty five meters down.", T.num("Challenger Deep", 10935, fmt="{:,.0f}", post=" m", color=CY, bottom="the deepest place on Earth", theme="blue", word="ten", dur=1.6)),
     N("Mount Everest, the highest point above sea level, is eight thousand eight hundred forty nine meters tall.", T.vs(("Everest's height", 8849, ORG), ("ocean's depth", 10935, CY), unit=" m", fmt="{:,.0f}", theme="blue", word="Everest")),
     N("So if Everest sat on the bottom of the trench, its summit would be about two thousand eighty six meters below the surface.", T.num("summit depth below the surface", 2086, fmt="{:,.0f}", post=" m", color=PINK, bottom="a deep dive on its own", theme="blue", word="two", dur=1.4)),
     N("The water pressure down there is more than a thousand times greater than at the surface. That's over a tonne pressing on every square centimeter.", T.num("pressure", 1086, fmt="{:,.0f}", post=" × atmospheric", color=VIO, bottom="over 1,000 atmospheres", theme="blue", word="thousand", dur=1.4)),
     N("Only a handful of people have been there. In nineteen sixty, two men reached it in a submarine called the Trieste. It took them almost five hours to go down.", T.num("first visit", 1960, fmt="{:.0f}", color=GOLD, bottom="the Trieste, 5 hours down", theme="blue", word="sixty", dur=1.2)),
     N("In twenty twelve, filmmaker James Cameron went alone, in a sub designed for the dive. The deepest place on Earth is still mostly unexplored.", T.kinetic([("THE DEEP OCEAN", WHITE, 90), ("IS STILL", WHITE, 70), ("A MYSTERY", GOLD, 110)], "blue")),
    ]
    return R(262, "mariana_trench_everest", "Everest would be underwater in the Mariana Trench", "the Mariana Trench is deep enough to hide Mount Everest with 2 km of water above it. send this to someone who's scared of deep water",
             "Challenger Deep about 10,935 m; Everest 8,849 m; difference 2,086 m. Pressure about 1,086 bar (more than 1,000 atm). Trieste dive 23 January 1960 (Piccard & Walsh, about 4 h 47 min descent). James Cameron solo dive March 2012.", "cine", n)

def antarctica():
    n = [
     N("The biggest desert on Earth isn't the Sahara. It's covered in ice. It's Antarctica, and it's stranger than you think.", T.kinetic([("THE BIGGEST DESERT", WHITE, 76), ("IS ICE", GOLD, 130)], "blue")),
     N("A desert isn't defined by heat. It's defined by how little rain or snow falls. Antarctica gets very little precipitation, so it counts.", T.num("Antarctica's area", 14.2, fmt="{:.1f}", post=" million km²", color=CY, bottom="the largest desert on Earth", theme="blue", word="Antarctica", dur=1.2)),
     N("The Sahara, the biggest hot desert, covers about nine point two million square kilometers. Antarctica is about fifty percent bigger.", T.vs(("Sahara", 9.2, ORG), ("Antarctica", 14.2, CY), unit="M km²", fmt="{:.1f}", theme="blue", word="Sahara")),
     N("Some parts of Antarctica, called the Dry Valleys, haven't had rain or snow in an estimated two million years.", T.num("dry valleys: no rain for about", 2, fmt="{:.0f}", post=" million years", color=PINK, bottom="drier than any hot desert", theme="blue", word="two", dur=1.0)),
     N("It's also the coldest place on Earth. The lowest temperature ever measured was minus eighty nine point two degrees Celsius, at Vostok Station in nineteen eighty three.", T.num("coldest ever recorded", -89.2, fmt="{:.1f}", post="°C", color=VIO, bottom="Vostok, 1983", theme="blue", word="minus", dur=1.4)),
     N("And under all that ice, it holds about ninety percent of all the ice on Earth, and about seventy percent of the planet's fresh water.", T.ring("of Earth's ice is in Antarctica", .9, "70% of all fresh water", CY, theme="blue", word="ninety")),
     N("If all that ice melted, sea levels would rise about sixty meters. It's a desert holding most of our fresh water, and the fate of our coastlines.", T.kinetic([("A DESERT", WHITE, 90), ("HOLDING OUR", WHITE, 70), ("COASTLINES", GOLD, 110)], "blue")),
    ]
    return R(263, "antarctica_desert", "the biggest desert is Antarctica", "Antarctica is the largest desert on Earth and holds 70% of the world's fresh water. send this to someone who thinks deserts are hot",
             "Antarctica about 14.2 million km2 (largest desert); Sahara about 9.2 million km2; McMurdo Dry Valleys largely ice and snow free; lowest temperature -89.2 C at Vostok on 21 July 1983; about 90% of Earth's ice and about 70% of its fresh water; full melt about 58 m of sea level rise.", "lofi", n)

def sahara():
    n = [
     N("The Sahara, the biggest hot desert on Earth, was a green land of lakes, rivers and grasslands just six thousand years ago.", T.kinetic([("THE SAHARA", WHITE, 100), ("WAS GREEN", GOLD, 130)])),
     N("Between about fifteen thousand and five thousand five hundred years ago, North Africa had a very different climate. It's called the African Humid Period.", T.timeline("years ago", [(-14800, "green Sahara begins"), (-5500, "desertification")], -16000, 0, fmtx=lambda x: f"{abs(x):,.0f}")),
     N("Rock paintings found deep in the desert show crocodiles, hippos, giraffes, and people swimming. Those were real animals in real water.", T.kinetic([("HIPPOS", WHITE, 100), ("CROCODILES", WHITE, 100), ("SWIMMERS", GOLD, 100)])),
     N("The cause was a slow wobble in Earth's tilt. About twenty three thousand years ago, a slightly different angle pushed the monsoon rains farther north, across the Sahara.", T.stat("the cause", "EARTH'S TILT", "a slow wobble changed the rain", CY, "", 130)),
     N("When the tilt shifted back, the rains retreated and the land dried out, in just a few thousand years. The desert returned.", T.num("time to dry out", 3, fmt="{:.0f}", post=",000 years", color=ORG, bottom="green to desert", word="few", dur=1.0)),
     N("The Sahara still feeds a rainforest. Every year, about twenty eight million tonnes of its dust blow across the Atlantic, and fertilize the Amazon.", T.num("Saharan dust to the Amazon, per year", 28, fmt="{:.0f}", post=" million tonnes", color=GOLD, bottom="the Amazon's free fertilizer", word="twenty", dur=1.4)),
     N("Models say the Sahara will turn green again in about fifteen thousand years, as the tilt wobbles back. Climate isn't fixed. It's a slow moving dance.", T.kinetic([("CLIMATE ISN'T FIXED", WHITE, 70), ("IT DANCES", GOLD, 120)])),
    ]
    return R(264, "sahara_was_green", "the Sahara was green 6,000 years ago", "the Sahara was green with lakes and hippos just 6,000 years ago, and its dust still fertilizes the Amazon. send this to a geography nerd",
             "African Humid Period about 14,800-5,500 years ago, driven by orbital precession; Saharan dust: about 182 million tonnes leave the Sahara per year and about 27.7 million tonnes reach the Amazon (Yu et al. 2015, from CALIPSO).", "cine", n)

def time_zones():
    n = [
     N("Which country has the most time zones? It's not the United States and it's not Russia. The answer is France.", T.kinetic([("MOST TIME ZONES", WHITE, 90), ("IN THE WORLD?", GOLD, 100)])),
     N("France has twelve time zones, thirteen if you count its claim in Antarctica. That's because of its overseas territories scattered around the globe.", T.bars("time zones", [("France", 12), ("Russia", 11), ("United States", 11), ("United Kingdom", 9)], fmt="{:.0f}", cols=[GOLD, CY, PINK, GRN], words=["France", "Russia", "United", "Kingdom"])),
     N("Russia is the largest country, and has eleven zones on the mainland. When it's eight in the morning in Kaliningrad, it's already six in the evening in Kamchatka.", T.num("Russia's time zones", 11, fmt="{:.0f}", color=CY, bottom="8 am at one end, 6 pm at the other", word="eleven", dur=0.8)),
     N("Now the opposite. China is nearly as wide as the United States, yet the whole country uses just one time zone, Beijing time.", T.num("China's time zones", 1, fmt="{:.0f}", color=PINK, bottom="for 5 time zones' worth of land", word="one", dur=0.8)),
     N("So in far western China, the sun may not rise until ten in the morning by the official clock. Many locals use their own unofficial time instead.", T.num("sunrise in far west China", 10, fmt="{:.0f}", post=" am", color=ORG, bottom="by Beijing time, in winter", word="ten", dur=0.8)),
     N("And some places use half hour or even forty five minute offsets. India is five and a half hours ahead of UTC. Nepal is five hours forty five.", T.steps("odd time zones", [("India", "UTC +5:30"), ("Nepal", "UTC +5:45")], words=["India", "Nepal"])),
     N("Time zones are not nature. They're a human agreement. And every country draws its own lines in a different way.", T.kinetic([("TIME ZONES", WHITE, 100), ("ARE A", WHITE, 70), ("CHOICE", GOLD, 130)])),
    ]
    return R(265, "most_time_zones", "which country has the most time zones", "France has 12 time zones, more than any other country, while China has just one. send this to someone who's always on a different time",
             "Countries with the most time zones (including overseas territories): France 12 (13 with Adelie Land), Russia 11, United States 11, UK 9. China uses a single standard time (UTC+8) over land spanning about five geographic zones; India UTC+5:30; Nepal UTC+5:45.", "bounce", n)

def vatican():
    r = 3.41 / .44
    n = [
     N("The smallest country in the world is smaller than a city park. You could walk across it in about ten minutes.", T.kinetic([("THE SMALLEST COUNTRY", WHITE, 70), ("IS SMALLER THAN", WHITE, 70), ("A PARK", GOLD, 110)])),
     N("The Vatican City covers just point four four square kilometers. That's less than half of one square kilometer.", T.num("Vatican City", 0.44, fmt="{:.2f}", post=" km²", color=GOLD, bottom="the smallest country on Earth", word="point", dur=1.0)),
     N("New York's Central Park is about three point four square kilometers. You could fit the whole Vatican inside Central Park about seven and a half times.", T.vs(("Vatican City", .44, GOLD), ("Central Park", 3.41, GRN), unit=" km²", fmt="{:.2f}", note="7.7× bigger", word="Central")),
     N("About eight hundred people live there, and about half of them hold Vatican citizenship. Citizenship usually depends on your job, not your birth.", T.num("people who live there", 800, fmt="{:,.0f}", color=CY, bottom="citizenship comes with the job", word="eight", dur=1.0)),
     N("The second smallest is Monaco, at about two square kilometers, with nearly forty thousand residents. That makes it the most crowded country on Earth.", T.vs(("Vatican", .44, GOLD), ("Monaco", 2.02, CY), unit=" km²", fmt="{:.2f}", word="Monaco")),
     N("Yet the Vatican has its own post office, radio, stamps, railway station, and a famous army, the Swiss Guard, with about a hundred and thirty five members.", T.num("Swiss Guard soldiers", 135, fmt="{:.0f}", color=PINK, bottom="the world's smallest army", word="hundred", dur=1.0)),
     N("A country doesn't have to be big to matter. A tiny state can hold a language, a currency, and centuries of art in a space smaller than a golf course.", T.kinetic([("SMALL SIZE", WHITE, 90), ("BIG INFLUENCE", GOLD, 100)])),
    ]
    return R(266, "smallest_country_vatican", "the smallest country in the world", "the Vatican is the smallest country, about 0.44 km2, 7 times smaller than Central Park. send this to someone who needs a vacation",
             "Vatican City 0.44 km2 (49 ha); Central Park 3.41 km2; Monaco 2.02 km2 (about 39,000 residents); Vatican population about 800; Pontifical Swiss Guard about 135 members.", "lofi", n)

REELS = dict(cleopatra_pyramid_moon=cleopatra, oxford_older_than_aztecs=oxford, mammoths_pyramids=mammoth, nintendo_1889=nintendo, pluto_vs_russia=russia_pluto, world_fits_in_texas=texas, canada_lakes_coast=canada, mariana_trench_everest=mariana, antarctica_desert=antarctica, sahara_was_green=sahara, most_time_zones=time_zones, smallest_country_vatican=vatican)
