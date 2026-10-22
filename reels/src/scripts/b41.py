"""Batch 41: education reels, space and Earth."""
import math
from edu import *
import functools
R = functools.partial(R, chip="SPACE")

def earth_day():
    def clock(ma):
        s = (4540 - ma) / 4540 * 86400; return f"{int(s // 3600):02d}:{int(s % 3600 // 60):02d}"
    assert clock(66) == "23:39" and clock(539) == "21:09"
    human = 300000 / 4.54e9 * 86400; assert 5 < human < 6.5
    n = [
     N("Imagine all 4.5 billion years of Earth's history squeezed into one single day. Midnight is the moment Earth forms. Now watch where we show up.", T.kinetic([("EARTH'S WHOLE HISTORY", WHITE, 70), ("IN 24 HOURS", GOLD, 110)], "space")),
     N("The first life appears around four in the morning. Then nothing but microbes for almost the entire day. Oxygen doesn't build up until late morning.", T.steps("the first half of the day", [("04:20", "first life, just microbes"), ("11:20", "oxygen fills the air")], theme="space", words=["four", "oxygen"])),
     N("Animals don't show up until nine o'clock at night. Plants and fish come after. At ten forty eight, the dinosaurs arrive.", T.steps("the evening", [("21:09", "animals appear"), ("22:48", "dinosaurs arrive")], theme="space", words=["nine", "ten"])),
     N("The dinosaurs die out at eleven thirty nine. That means they ruled for about fifty minutes of this day.", T.num("dinosaurs end at", 23.65, fmt="{:.2f}", color=PINK, bottom="23:39, fifty minutes of rule", theme="space", word="eleven", dur=1.2)),
     N("And humans? Modern humans appear in the last six seconds before midnight.", T.num("humans appear", 6, fmt="{:.0f}", post=" seconds", color=GOLD, bottom="before midnight", theme="space", word="six", dur=1.0)),
     N("All of recorded history, every pyramid, empire, and war, happens in the last tenth of a second.", T.num("all recorded history", .1, fmt="{:.1f}", post=" second", color=CY, bottom="every empire and every war", theme="space", word="tenth", dur=1.0)),
     N("We feel like the center of the story. But Earth has been running for a whole day, and we just walked in at the very last moment.", T.kinetic([("WE ARRIVED", WHITE, 90), ("AT THE LAST SECOND", GOLD, 80)], "space")),
    ]
    return R(225, "earth_in_24_hours", "Earth's history as one day", "if Earth's history were one day, humans show up in the last 6 seconds. send this to someone who thinks they're early",
             "Earth 4.54 Ga = 24 h. First life ~3.7 Ga = 04:26; oxygen 2.4 Ga = 11:18; animals 539 Ma = 21:09; dinosaurs 230 Ma = 22:48; extinction 66 Ma = 23:39; Homo sapiens 300,000 y = 5.7 s; recorded history 5,000 y = 0.095 s.", "cine", n)

def earth_black_hole():
    G, c = 6.674e-11, 299792458.0
    def rs(m): return 2 * G * m / c ** 2
    assert abs(rs(5.972e24) * 1000 - 8.87) < .02 and abs(rs(1.989e30) - 2953) < 5
    sgr = rs(4.3e6 * 1.989e30) / 1000
    n = [
     N("What if you squeezed the entire Earth until it became a black hole? How small would it have to be? The answer is smaller than a grape.", T.kinetic([("SQUEEZE EARTH", WHITE, 90), ("INTO A BLACK HOLE", GOLD, 84)], "space")),
     N("Every object has a size where its gravity becomes so strong that not even light can escape. Scientists call it the Schwarzschild radius.", T.formula(["radius = 2GM ÷ c²"], theme="space", title="the formula")),
     N("For Earth, that radius is only eight point nine millimeters. The whole planet, packed into something the size of a marble.", T.num("Earth's black hole radius", 8.87, fmt="{:.2f}", post=" mm", color=GOLD, bottom="the size of a marble", theme="space", word="eight", dur=1.3)),
     N("For the Sun, it's about three kilometers. The entire Sun, squeezed into a ball you could walk across in about an hour.", T.num("the Sun's radius", 2.95, fmt="{:.2f}", post=" km", color=ORG, bottom="an hour's walk across", theme="space", word="three", dur=1.3)),
     N("Our galaxy has a real black hole at its center, called Sagittarius A star. It weighs as much as four million Suns.", T.num("Sagittarius A*", 4.3, fmt="{:.1f}", post=" million Suns", color=VIO, bottom="at the center of our galaxy", theme="space", word="four", dur=1.2)),
     N("Yet even that giant is only about twelve million kilometers wide. Smaller than the orbit of Mercury.", T.num("its radius", 12.7, fmt="{:.1f}", post=" million km", color=PINK, bottom="smaller than Mercury's orbit", theme="space", word="twelve", dur=1.2)),
     N("Gravity isn't about size. It's about how much stuff you pack into how little space. A black hole is just that, taken to the limit.", T.kinetic([("NOT SIZE", WHITE, 90), ("DENSITY", GOLD, 140)], "space")),
    ]
    return R(226, "earth_black_hole", "squeeze Earth into a black hole", "to turn Earth into a black hole you'd have to squeeze it to the size of a marble (9 mm). send this to someone with a gravity problem",
             "Schwarzschild radius r = 2GM/c^2: Earth 5.972e24 kg -> 8.87 mm; Sun 1.989e30 kg -> 2.95 km; Sagittarius A* 4.3 million solar masses -> about 12.7 million km radius.", "cine", n)

def venus_day():
    n = [
     N("On Venus, a day is longer than a year. That's not a trick. It's real, and it gets weirder from there.", T.kinetic([("ON VENUS", WHITE, 100), ("A DAY > A YEAR", GOLD, 100)], "space")),
     N("Venus spins so slowly that one full turn takes two hundred forty three Earth days. But it circles the Sun in only two hundred twenty five.", T.vs(("year", 225, CY), ("day", 243, GOLD), unit=" days", fmt="{:.0f}", theme="space", word="two")),
     N("It also spins backward. On Venus, the Sun rises in the west and sets in the east.", T.kinetic([("SUN RISES IN", WHITE, 70), ("THE WEST", GOLD, 130)], "space")),
     N("And it's the hottest planet, even though Mercury is closer to the Sun. The surface is four hundred sixty five degrees Celsius. Hot enough to melt lead.", T.num("surface temperature", 465, fmt="{:.0f}", post="°C", color=PINK, bottom="hotter than Mercury", theme="space", word="four", dur=1.4)),
     N("The air pressure is ninety two times Earth's. Standing there would feel like being nine hundred meters under the ocean.", T.num("air pressure", 92, fmt="{:.0f}", post="× Earth", color=ORG, bottom="like 900 m under the sea", theme="space", word="ninety", dur=1.2)),
     N("The Soviet Union landed probes on Venus in the nineteen seventies. The longest one survived just two hours before it was crushed and cooked.", T.num("longest surviving probe", 2, fmt="{:.0f}", post=" hours", color=CY, bottom="Venera 13, 1982", theme="space", word="two", dur=0.8)),
     N("Venus is nearly the same size as Earth. It's the cautionary tale of what a runaway greenhouse effect can do.", T.kinetic([("EARTH'S TWIN", WHITE, 90), ("GONE WRONG", PINK, 110)], "space")),
    ]
    return R(227, "venus_day", "a day on Venus is longer than its year", "a day on Venus is longer than a year on Venus, and the Sun rises in the west. send this to your slowest friend",
             "Venus sidereal rotation 243.0 Earth days (retrograde), orbital period 224.7 days; surface 465 C, pressure about 92 bar (NASA); Venera 13 lander survived 127 minutes in 1982.", "synth", n)

def olympus():
    n = [
     N("Mars has a volcano so big it covers an area the size of a whole US state. It's called Olympus Mons.", T.kinetic([("THE TALLEST", WHITE, 90), ("VOLCANO IN THE", WHITE, 90), ("SOLAR SYSTEM", GOLD, 100)], "space")),
     N("Olympus Mons is about twenty two kilometers tall. Mount Everest is eight point eight. That makes it two and a half Everests, stacked.", T.vs(("Everest", 8.85, CY), ("Olympus Mons", 21.9, ORG), unit=" km", fmt="{:.1f}", note="2.5× taller", theme="space", word="twenty")),
     N("It's also huge sideways. About six hundred kilometers across, covering roughly the area of the state of Arizona.", T.num("width", 600, fmt="{:.0f}", post=" km", color=GOLD, bottom="about the size of Arizona", theme="space", word="six", dur=1.2)),
     N("The slope is so gentle that it rises only about five percent, one meter up for every twenty across. You could almost walk it.", T.num("average slope", 5, fmt="{:.0f}", post="%", color=PINK, bottom="one meter up per twenty across", theme="space", word="five", dur=1.0)),
     N("Why so big? Mars has no moving plates. A volcano on Earth moves off its hot spot. On Mars it just keeps piling up for billions of years.", T.kinetic([("NO MOVING PLATES", WHITE, 70), ("= KEEPS GROWING", GOLD, 80)], "space")),
     N("On Earth, the biggest volcano by height from its base is Mauna Kea, at ten kilometers, mostly hidden under the Pacific Ocean.", T.num("Mauna Kea, base to peak", 10.2, fmt="{:.1f}", post=" km", color=CY, bottom="most of it underwater", theme="space", word="Mauna", dur=1.0)),
     N("So the next time someone calls a hill a mountain, remember that on Mars there's a volcano that would swallow the whole of Arizona.", T.kinetic([("ARIZONA-SIZED", WHITE, 80), ("VOLCANO", GOLD, 130)], "space")),
    ]
    return R(228, "olympus_mons", "the biggest volcano in the solar system", "Olympus Mons is 2.5x taller than Everest and as wide as Arizona. send this to someone who calls a hill a mountain",
             "Olympus Mons: about 21.9 km high (above the Martian datum), about 600 km wide, average flank slope about 5 percent. Everest 8.85 km. Mauna Kea about 10.2 km from base to summit.", "cine", n)

def iss():
    v = 7.66; period = 92.7; assert 15 < 1440 / period < 16
    n = [
     N("The astronauts on the International Space Station see the Sun rise sixteen times every single day. Here's why, and what it does to the human body.", T.kinetic([("16 SUNRISES", GOLD, 130), ("EVERY DAY", WHITE, 84)], "space")),
     N("The station orbits about four hundred kilometers above us, moving at twenty eight thousand kilometers an hour.", T.num("speed", 27600, fmt="{:,.0f}", post=" km/h", color=CY, bottom="400 km above Earth", theme="space", word="twenty", dur=1.6)),
     N("At that speed, it circles the entire planet in just ninety two minutes. That's fifteen and a half laps every day.", T.num("one lap", 92, fmt="{:.0f}", post=" min", color=GOLD, bottom="15.5 laps a day", theme="space", word="ninety", dur=1.2)),
     N("Each lap has a sunrise and a sunset. So astronauts see about sixteen of each, every twenty four hours.", T.steps("every 24 hours", [("16 sunrises", ""), ("16 sunsets", "")], theme="space", words=["sixteen", "sunsets"])),
     N("Here's the surprise. The station is only four hundred kilometers up. That's like driving from New York to Washington. About four hours by car.", T.num("by car, at 100 km/h", 4, fmt="{:.0f}", post=" hours", color=ORG, bottom="that's how close space is", theme="space", word="four", dur=0.8)),
     N("So why do astronauts float? Not because there's no gravity. At that height gravity is still ninety percent as strong. They're floating because they're falling, constantly, around the Earth.", T.ring("gravity at the ISS", .9, "of what you feel on the ground", CY, theme="space", word="ninety")),
     N("The station is in free fall, and so is everything inside it. That's what weightlessness really is. Falling and always missing the ground.", T.kinetic([("WEIGHTLESS", WHITE, 100), ("= FALLING", GOLD, 120), ("AND MISSING", CY, 80)], "space")),
    ]
    return R(229, "iss_sixteen_sunrises", "16 sunrises a day on the ISS", "astronauts on the ISS see 16 sunrises a day. weightlessness is really just falling and missing the ground. send this to your space-obsessed friend",
             "ISS altitude about 408 km, speed 7.66 km/s (27,600 km/h), period about 92.7 min = 15.5 orbits/day. Gravity at 400 km = (6371/6771)^2 = 88.5% of surface gravity.", "synth", n)

def moon_leaving():
    n = [
     N("The Moon is slowly leaving us. That's not a theory. It's measured with lasers, and it changes how long your day is.", T.kinetic([("THE MOON", WHITE, 100), ("IS LEAVING", GOLD, 120)], "space")),
     N("Apollo astronauts left mirrors on the Moon. Scientists bounce lasers off them and time the trip, and the Moon is drifting away by three point eight centimeters every year.", T.num("moving away", 3.8, fmt="{:.1f}", post=" cm / year", color=GOLD, bottom="measured with lasers", theme="space", word="three", dur=1.3)),
     N("That's about as fast as your fingernails grow. It sounds tiny, but it adds up over billions of years.", T.vs(("fingernail", 3.6, CY), ("Moon", 3.8, GOLD), unit=" cm/yr", fmt="{:.1f}", theme="space", word="fingernails")),
     N("When the Moon formed, it was more than ten times closer than it is now. It would have looked enormous in the sky.", T.vs(("then", 1, PINK), ("today", 10, CY), unit="×", fmt="{:.0f}", note="distance", theme="space", word="ten")),
     N("The Moon's gravity pulls on our oceans, and that creates friction that slows down the Earth. Our days are getting longer, by about two milliseconds every hundred years.", T.num("days get longer by", 1.8, fmt="{:.1f}", post=" ms / century", color=ORG, bottom="because of the Moon", theme="space", word="two", dur=1.2)),
     N("When the dinosaurs lived, a day was about twenty three and a half hours. In the far future, days will be longer still.", T.num("a day in the dinosaur age", 23.5, fmt="{:.1f}", post=" hours", color=GRN, bottom="and getting longer", theme="space", word="twenty", dur=1.2)),
     N("And in about six hundred million years, the Moon will be too small in the sky to cover the Sun completely. Total solar eclipses will end forever.", T.kinetic([("TOTAL ECLIPSES", WHITE, 80), ("END IN 600 MILLION YEARS", GOLD, 56)], "space")),
    ]
    return R(230, "moon_leaving", "the Moon is leaving us", "the Moon moves away 3.8 cm every year, the same speed your fingernails grow. send this to someone who's drifting away",
             "Lunar laser ranging: recession 3.8 cm/yr. Tidal friction lengthens the day by about 1.7-2.3 ms per century. Cretaceous day about 23.5 h (coral growth rings). Total solar eclipses end in roughly 600 million years.", "cine", n)

def sun_power():
    n = [
     N("Every single second, the Sun turns four million tonnes of itself into pure energy. And just one hour of that sunlight could power the whole planet for a year.", T.kinetic([("THE SUN BURNS", WHITE, 84), ("4 MILLION TONNES", GOLD, 100), ("A SECOND", WHITE, 84)], "space")),
     N("Deep in the core, hydrogen fuses into helium. A tiny bit of mass goes missing, and Einstein's famous equation says that missing mass becomes energy.", T.formula(["E = mc²"], theme="space", title="mass becomes energy")),
     N("Four million tonnes a second is about the weight of twenty eight thousand blue whales, vanishing into light, every second, for four and a half billion years.", T.num("blue whales of mass per second", 28000, fmt="{:,.0f}", color=GOLD, bottom="converted to light", theme="space", word="twenty", dur=1.4)),
     N("Earth catches only a tiny sliver of that, about one two-billionth. But that sliver is enormous.", T.num("sunlight reaching Earth", 173000, fmt="{:,.0f}", post=" TW", color=CY, bottom="at every moment", theme="space", word="tiny", dur=1.4)),
     N("In one hour, the sunlight hitting Earth carries about as much energy as all humanity uses in an entire year.", T.vs(("1 hour of sunlight", 6.1, GOLD), ("1 year of human energy", 6.0, CY), unit=" × 10²⁰ J", fmt="{:.1f}", theme="space", word="hour")),
     N("The problem isn't the energy. It's capturing and storing it. That's why solar panels and batteries are such a big deal.", T.kinetic([("THE ENERGY IS THERE", WHITE, 70), ("WE JUST HAVE", WHITE, 60), ("TO CATCH IT", GOLD, 90)], "space")),
    ]
    assert abs(1.73e17 * 3600 - 6.2e20) < 1e19
    return R(231, "sun_power_hour", "one hour of sunlight powers the world for a year", "one hour of sunlight hitting Earth equals all the energy humans use in a year. send this to someone who still pays a power bill",
             "Sun converts about 4.26 million tonnes of mass to energy each second (3.8e26 W). Solar power intercepted by Earth about 1.73e17 W x 3600 s = 6.2e20 J, about the world's annual primary energy use (about 6e20 J, 2019-2023).", "bounce", n)

def sun_future():
    n = [
     N("The Sun is going to die, and we can predict almost exactly how. Here's the timeline, in order.", T.kinetic([("HOW THE SUN", WHITE, 90), ("WILL DIE", GOLD, 120)], "space")),
     N("Right now, the Sun is about four and a half billion years old. It's roughly halfway through its life, and it's quite stable.", T.ring("the Sun's life so far", .5, "about half done", GOLD, theme="space", word="half")),
     N("But it's getting brighter, about ten percent every billion years. In roughly one billion years, Earth's oceans will begin to boil away.", T.num("until the oceans boil", 1, fmt="{:.0f}", post=" billion years", color=ORG, bottom="the Sun gets 10% brighter", theme="space", word="one", dur=1.0)),
     N("In about five billion years, the Sun runs out of hydrogen in its core and swells into a red giant, hundreds of times wider than today.", T.num("red giant in", 5, fmt="{:.0f}", post=" billion years", color=PINK, bottom="hundreds of times wider", theme="space", word="five", dur=1.2)),
     N("It will swallow Mercury and Venus. Earth might be swallowed too, or just scorched into a dead rock.", T.kinetic([("MERCURY: GONE", WHITE, 76), ("VENUS: GONE", WHITE, 76), ("EARTH: ???", PINK, 90)], "space")),
     N("After that, the Sun sheds its outer layers and shrinks into a white dwarf, a glowing ember about the size of Earth that cools for trillions of years.", T.stat("what's left", "WHITE DWARF", "the size of Earth", CY, "cooling for trillions of years", 130, theme="space")),
     N("Our whole story fits in the stable middle part of a star's life. And every atom in your body was made inside a star that already did this.", T.kinetic([("YOU'RE MADE OF", WHITE, 70), ("DEAD STARS", GOLD, 120)], "space")),
    ]
    return R(232, "sun_death_timeline", "how the Sun will die", "in about 5 billion years the Sun becomes a red giant. every atom in your body came from a dead star. send this to someone who needs perspective",
             "Sun age about 4.6 billion years; luminosity rises about 1% per 100 million years; oceans lost in roughly 1 billion years; hydrogen core exhausted in about 5 billion years (red giant); ends as a white dwarf.", "cine", n)

def saturn_float():
    n = [
     N("Saturn is so light that it would float on water. That sounds impossible for a planet, so let's check the math.", T.kinetic([("SATURN WOULD", WHITE, 90), ("FLOAT ON WATER", GOLD, 100)], "space")),
     N("Things float when they're less dense than water. Water has a density of one gram per cubic centimeter.", T.num("water", 1.0, fmt="{:.2f}", post=" g/cm³", color=CY, bottom="the line between sink and float", theme="space", word="one", dur=0.8)),
     N("Saturn's density is only point six eight seven. That's lower than water, and lower than any other planet.", T.bars("density, g/cm³", [("Earth", 5.51), ("Mars", 3.93), ("Neptune", 1.64), ("Jupiter", 1.33), ("Water", 1.00), ("Saturn", .69)], fmt="{:.2f}", hi=5, theme="space")),
     N("It's mostly hydrogen and helium, the two lightest elements in the universe, wrapped around a small rocky core.", T.stat("made of", "HYDROGEN + HELIUM", "the two lightest elements", ORG, "around a small rocky core", 90, theme="space")),
     N("You'd need a bathtub about a hundred twenty thousand kilometers wide to try it. So this experiment isn't happening.", T.num("the bathtub", 120000, fmt="{:,.0f}", post=" km wide", color=GOLD, bottom="to float Saturn", theme="space", word="hundred", dur=1.4)),
     N("And those famous rings? They stretch two hundred eighty thousand kilometers across, but they're often just ten meters thick.", T.num("ring thickness", 10, fmt="{:.0f}", post=" m", color=PINK, bottom="across 282,000 km", theme="space", word="ten", dur=1.0)),
     N("Scale them down to a city twenty eight kilometers wide, and the rings would be about as thick as a credit card.", T.kinetic([("28 KM WIDE", WHITE, 100), ("CREDIT CARD THIN", GOLD, 84)], "space")),
    ]
    return R(233, "saturn_floats", "Saturn would float on water", "Saturn is less dense than water, it would float. its rings are as thin as paper at scale. send this to someone who's light on their feet",
             "Saturn mean density 0.687 g/cm3 (NASA). Main rings span about 282,000 km and are typically about 10 m thick; scaled to 28 km wide that is about 1 mm.", "synth", n)

def mountains():
    n = [
     N("What is the tallest mountain on Earth? Everyone says Everest. But there are actually three correct answers.", T.kinetic([("TALLEST MOUNTAIN", WHITE, 84), ("3 RIGHT ANSWERS", GOLD, 100)])),
     N("Answer one, Everest. Measured from sea level, it's the highest point on Earth, eight thousand eight hundred forty nine meters.", T.num("Everest, above sea level", 8849, fmt="{:,.0f}", post=" m", color=CY, bottom="highest point on Earth", word="Everest", dur=1.4)),
     N("Answer two, Mauna Kea in Hawaii. Measured from its base on the ocean floor to its peak, it's about ten thousand two hundred meters, taller than Everest.", T.vs(("Everest", 8849, CY), ("Mauna Kea", 10211, ORG), unit=" m", fmt="{:,.0f}", note="from base to peak", word="Mauna")),
     N("Answer three, Chimborazo in Ecuador. Earth bulges at the equator, so Chimborazo's summit is the farthest point on the surface from the center of the planet.", T.num("Chimborazo is farther out by", 2.1, fmt="{:.1f}", post=" km", color=GRN, bottom="than Everest, from Earth's center", word="Chimborazo", dur=1.2)),
     N("Chimborazo is only six thousand three hundred meters above sea level, but its top is two kilometers farther from the center than Everest's.", T.bars("distance from Earth's center, km", [("Chimborazo", 6384.4), ("Everest", 6382.3)], fmt="{:,.1f}", cols=[GRN, CY], words=["Chimborazo", "Everest"])),
     N("So which is the tallest? It depends on what you measure. Sea level, base to peak, or distance from the center. Each gives a different winner.", T.steps("the winner depends", [("Everest", "above sea level"), ("Mauna Kea", "base to peak"), ("Chimborazo", "from Earth's center")], words=["Sea", "base", "center"])),
    ]
    return R(234, "tallest_mountain_three_answers", "what's the tallest mountain on Earth", "the tallest mountain has 3 right answers: Everest, Mauna Kea and Chimborazo. send this to someone who thinks they know geography",
             "Everest 8,849 m above sea level; Mauna Kea about 10,211 m base to summit; Chimborazo summit about 6,384.4 km from Earth's center versus Everest 6,382.3 km (about 2.1 km farther).", "jazz", n)

REELS = dict(earth_in_24_hours=earth_day, earth_black_hole=earth_black_hole, venus_day=venus_day, olympus_mons=olympus, iss_sixteen_sunrises=iss, moon_leaving=moon_leaving, sun_power_hour=sun_power, sun_death_timeline=sun_future, saturn_floats=saturn_float, tallest_mountain_three_answers=mountains)
