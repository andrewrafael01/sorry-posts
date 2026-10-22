"""Batch 51: education reels, countdown rankings (bars reveal from the bottom up while the narrator counts down)."""
import math
from edu import *
import functools
R = functools.partial(R, chip="RANKED")

def tall_buildings():
    items = [("Burj Khalifa", 828), ("Merdeka 118", 679), ("Shanghai Tower", 632), ("Makkah Clock Tower", 601), ("Ping An Centre", 599), ("Lotte World Tower", 555), ("One World Trade", 541), ("Guangzhou CTF", 530)]
    n = [
     N("The eight tallest buildings on Earth. Number one is so tall it isn't even close, and number two will surprise you.", T.kinetic([("THE TALLEST", WHITE, 100), ("BUILDINGS ON EARTH", GOLD, 80)], "ink")),
     N("Starting the countdown. Number eight, the Guangzhou C T F Finance Centre in China, at five hundred thirty meters.", T.bars("tallest buildings, meters", items, fmt="{:,.0f}", unit=" m", theme="ink", words=["Burj", "Merdeka", "Shanghai", "Makkah", "Ping", "Lotte", "World", "Guangzhou"])),
     N("Number seven, One World Trade Center in New York. Five hundred forty one meters, and the tallest building in the Western Hemisphere.", T.stat("#7", "ONE WORLD TRADE", "541 m, New York", CY, "tallest in the Western Hemisphere", 100, theme="ink")),
     N("Number six, the Lotte World Tower in Seoul, five hundred fifty five meters. Number five, Ping An Finance Centre, five ninety nine.", T.stat("#6 and #5", "SEOUL + SHENZHEN", "555 m and 599 m", ORG, "", 100, theme="ink")),
     N("Number four, the Makkah Royal Clock Tower in Saudi Arabia, six hundred one meters, with the biggest clock face in the world.", T.stat("#4", "MAKKAH CLOCK TOWER", "601 m, the world's biggest clock face", GRN, "", 76, theme="ink")),
     N("Number three, the Shanghai Tower, six hundred thirty two meters, with a twisting shape that reduces wind forces by about a quarter.", T.stat("#3", "SHANGHAI TOWER", "632 m, a twisting design", VIO, "", 100, theme="ink")),
     N("Number two, the Merdeka one eighteen in Kuala Lumpur, six hundred seventy nine meters. It opened in twenty twenty three.", T.stat("#2", "MERDEKA 118", "679 m, Kuala Lumpur", PINK, "opened 2023", 110, theme="ink")),
     N("And number one, the Burj Khalifa in Dubai, at eight hundred twenty eight meters. It's one hundred fifty meters taller than the runner up. Nothing else is even close.", T.num("the Burj Khalifa", 828, fmt="{:,.0f}", post=" m", color=GOLD, bottom="150 meters taller than #2", theme="ink", word="Burj", dur=1.4)),
    ]
    return R(327, "tallest_buildings_ranked", "the tallest buildings in the world", "the tallest building in the world is 150 meters taller than number two. countdown of the top 8. send this to someone who lives in a tall building",
             "Heights (CTBUH): Burj Khalifa 828 m; Merdeka 118 678.9 m; Shanghai Tower 632 m; Makkah Royal Clock Tower 601 m; Ping An Finance Centre 599 m; Lotte World Tower 554.5 m; One World Trade Center 541.3 m; Guangzhou CTF Finance Centre 530 m (tie with Tianjin CTF).", "trap", n)

def countries_area():
    items = [("Russia", 17.1), ("Canada", 9.98), ("United States", 9.83), ("China", 9.60), ("Brazil", 8.52), ("Australia", 7.69), ("India", 3.29)]
    n = [
     N("The biggest countries in the world by area. Some of these will shock you, especially when you see how small India looks.", T.kinetic([("THE BIGGEST", WHITE, 100), ("COUNTRIES", GOLD, 130)], "blue")),
     N("India comes in at number seven, with three point three million square kilometers. Remember that. It has the largest population on Earth.", T.bars("area, million km²", items, fmt="{:.2f}", unit=" M", theme="blue", words=["Russia", "Canada", "United", "China", "Brazil", "Australia", "India"])),
     N("Number six, Australia, seven point seven million. An entire continent that is also one country.", T.stat("#6", "AUSTRALIA", "7.69 million km²", ORG, "a whole continent", 150, theme="blue")),
     N("Number five, Brazil, eight and a half million. Number four, China, nine point six.", T.stat("#5 and #4", "BRAZIL + CHINA", "8.52 and 9.60 million km²", GOLD, "", 100, theme="blue")),
     N("Number three, the United States, at nine point eight million, and number two, Canada, at almost ten million, are nearly the same size.", T.stat("#3 and #2", "USA + CANADA", "9.83 and 9.98 million km²", CY, "nearly identical", 100, theme="blue")),
     N("And number one, Russia, at seventeen point one million square kilometers. It's almost double Canada.", T.num("Russia", 17.1, fmt="{:.1f}", post=" million km²", color=GOLD, bottom="almost double #2", theme="blue", word="Russia", dur=1.2)),
     N("Russia spans eleven time zones, from Europe to the Pacific, and it borders fourteen other countries. One country, bigger than any continent except six.", T.kinetic([("11 TIME ZONES", GOLD, 110), ("ONE COUNTRY", WHITE, 100)], "blue")),
    ]
    return R(328, "biggest_countries_ranked", "the biggest countries by area", "the biggest countries by area, with India at number 7 and Russia almost double Canada. send this to someone who thinks Canada is the biggest",
             "Total area (km2, incl. inland water): Russia 17,098,246; Canada 9,984,670; United States 9,833,517; China 9,596,961; Brazil 8,515,767; Australia 7,741,220; India 3,287,263.", "lofi", n)

def populations():
    items = [("India", 1450), ("China", 1419), ("United States", 345), ("Indonesia", 283), ("Pakistan", 251), ("Nigeria", 232), ("Brazil", 212), ("Bangladesh", 174)]
    n = [
     N("The most populated countries on Earth. The top two are in a league of their own, and India took the crown in twenty twenty three.", T.kinetic([("THE MOST", WHITE, 100), ("POPULATED", GOLD, 120), ("COUNTRIES", WHITE, 100)], "green")),
     N("Number eight, Bangladesh, with a hundred seventy four million people, in a country about the size of Illinois.", T.bars("population, millions", items, fmt="{:,.0f}", unit=" M", theme="green", words=["India", "China", "United", "Indonesia", "Pakistan", "Nigeria", "Brazil", "Bangladesh"])),
     N("Number seven, Brazil, two hundred twelve million. Number six, Nigeria, two hundred thirty two million, the biggest country in Africa.", T.stat("#7 and #6", "BRAZIL + NIGERIA", "212 and 232 million", ORG, "Nigeria is Africa's largest", 100, theme="green")),
     N("Number five, Pakistan, with two hundred fifty one million. Number four, Indonesia, with two hundred eighty three million people, spread over thousands of islands.", T.stat("#5 and #4", "PAKISTAN + INDONESIA", "251 and 283 million", GOLD, "", 76, theme="green")),
     N("Number three, the United States, at three hundred forty five million. Notice how far down that is. The gap above it is huge.", T.stat("#3", "UNITED STATES", "345 million", CY, "then a huge gap", 110, theme="green")),
     N("Number two, China, with one billion four hundred nineteen million people. And number one, India, at one billion four hundred fifty million.", T.num("India, #1", 1450, fmt="{:,.0f}", post=" million", color=GOLD, bottom="passed China in 2023", theme="green", word="India", dur=1.4)),
     N("Together, India and China hold more than one third of everyone alive. Just those two countries.", T.ring("of humanity lives in India or China", .35, "2.87 billion people", PINK, theme="green", word="third")),
    ]
    return R(329, "most_populated_countries_ranked", "the most populated countries", "India passed China as the most populated country in 2023, and the two together hold 35% of humanity. send this to an Indian or Chinese friend",
             "UN World Population Prospects 2024 (2024 estimates, millions): India 1,450; China 1,419; United States 345; Indonesia 283; Pakistan 251; Nigeria 232; Brazil 212; Bangladesh 174. India overtook China in 2023.", "funk", n)

def rivers():
    items = [("Nile", 6650), ("Amazon", 6400), ("Yangtze", 6300), ("Mississippi-Missouri", 6275), ("Yenisei", 5539), ("Yellow River", 5464), ("Ob-Irtysh", 5410), ("Parana", 4880)]
    n = [
     N("The longest rivers in the world. And there's a big argument about number one, one that scientists still haven't settled.", T.kinetic([("THE LONGEST", WHITE, 100), ("RIVERS", GOLD, 140)], "blue")),
     N("Number eight, the Parana in South America, forty eight hundred eighty kilometers. Number seven, the Ob Irtysh in Russia, fifty four hundred ten.", T.bars("length, kilometers", items, fmt="{:,.0f}", unit=" km", theme="blue", words=["Nile", "Amazon", "Yangtze", "Mississippi", "Yenisei", "Yellow", "Ob", "Parana"])),
     N("Number six, China's Yellow River, fifty four sixty four kilometers. It's called the cradle of Chinese civilization.", T.stat("#6", "YELLOW RIVER", "5,464 km, China", ORG, "the cradle of Chinese civilization", 110, theme="blue")),
     N("Number five, the Yenisei in Siberia. Number four, the Mississippi Missouri system in the United States, six thousand two hundred seventy five.", T.stat("#5 and #4", "YENISEI + MISSISSIPPI", "5,539 and 6,275 km", GOLD, "", 76, theme="blue")),
     N("Number three, the Yangtze in China, six thousand three hundred kilometers. The longest river that flows entirely within one country.", T.stat("#3", "YANGTZE", "6,300 km", CY, "the longest river inside one country", 110, theme="blue")),
     N("Number two and one are a famous argument. The Nile, in Africa, is traditionally measured at sixty six fifty kilometers.", T.num("the Nile", 6650, fmt="{:,.0f}", post=" km", color=GOLD, bottom="the traditional #1", theme="blue", word="Nile", dur=1.2)),
     N("But some studies measure the Amazon at nearly seven thousand kilometers, if you choose a different source. Where a river begins is hard to decide, so the argument continues.", T.num("the Amazon, longer in some studies", 6992, fmt="{:,.0f}", post=" km", color=GRN, bottom="depends on where you start", theme="blue", word="Amazon", dur=1.2)),
    ]
    return R(330, "longest_rivers_ranked", "the longest rivers in the world", "the Nile vs the Amazon: which river is longer? it depends where you measure. countdown of the 8 longest rivers. send this to a geography nerd",
             "Lengths (km, commonly cited): Nile 6,650; Amazon 6,400 (some studies about 6,992); Yangtze 6,300; Mississippi-Missouri 6,275; Yenisei-Angara-Selenga 5,539; Yellow River 5,464; Ob-Irtysh 5,410; Parana 4,880. Rankings vary with source and measurement.", "lofi", n)

def mountains8000():
    items = [("Everest", 8849), ("K2", 8611), ("Kangchenjunga", 8586), ("Lhotse", 8516), ("Makalu", 8485), ("Cho Oyu", 8188), ("Dhaulagiri", 8167), ("Manaslu", 8163)]
    n = [
     N("Fourteen mountains on Earth rise above eight thousand meters. Here are the top eight, and one of them is much more dangerous than Everest.", T.kinetic([("THE HIGHEST", WHITE, 100), ("MOUNTAINS", GOLD, 130)], "blue")),
     N("Number eight, Manaslu in Nepal, at eight thousand one hundred sixty three meters. Number seven, Dhaulagiri, eight thousand one sixty seven.", T.bars("height above sea level, meters", items, fmt="{:,.0f}", unit=" m", theme="blue", words=["Everest", "K2", "Kangchenjunga", "Lhotse", "Makalu", "Cho", "Dhaulagiri", "Manaslu"])),
     N("Number six, Cho Oyu, eight thousand one eighty eight. It's considered the easiest of the eight thousanders to climb.", T.stat("#6", "CHO OYU", "8,188 m", ORG, "the 'easiest' 8,000er", 150, theme="blue")),
     N("Number five, Makalu, eighty four eighty five meters, with a perfect four sided pyramid shape. Number four, Lhotse, eighty five sixteen.", T.stat("#5 and #4", "MAKALU + LHOTSE", "8,485 and 8,516 m", GOLD, "", 90, theme="blue")),
     N("Number three, Kangchenjunga, eighty five eighty six meters, on the border of Nepal and India. It was once thought to be the highest mountain in the world.", T.stat("#3", "KANGCHENJUNGA", "8,586 m", CY, "once thought to be the highest", 76, theme="blue")),
     N("Number two, K two, at eighty six eleven. It's only about two hundred meters shorter than Everest, but far harder and more deadly to climb.", T.num("K2", 8611, fmt="{:,.0f}", post=" m", color=PINK, bottom="called the Savage Mountain", theme="blue", word="K", dur=1.2)),
     N("And number one, Everest, at eight thousand eight hundred forty nine. The summit has grown a little taller over time as the Himalayas keep rising.", T.num("Everest", 8849, fmt="{:,.0f}", post=" m", color=GOLD, bottom="still rising about 4 mm a year", theme="blue", word="Everest", dur=1.4)),
    ]
    return R(331, "highest_mountains_ranked", "the highest mountains in the world", "the 8 highest mountains in the world, K2 is only 200 meters shorter than Everest but far more deadly. send this to a hiker",
             "Heights (m): Everest 8,848.86 (2020 China-Nepal survey); K2 8,611; Kangchenjunga 8,586; Lhotse 8,516; Makalu 8,485; Cho Oyu 8,188; Dhaulagiri I 8,167; Manaslu 8,163. The Himalaya rise about 4-5 mm a year.", "cine", n)

def languages():
    items = [("English", 1515), ("Mandarin", 1118), ("Hindi", 609), ("Spanish", 559), ("Arabic", 335), ("French", 310)]
    n = [
     N("The most spoken languages on Earth. And number one is a language that most of its speakers learned as a second language.", T.kinetic([("THE MOST SPOKEN", WHITE, 90), ("LANGUAGES", GOLD, 120)], "green")),
     N("Number six, French, with about three hundred ten million speakers in total, spread across five continents.", T.bars("total speakers, millions", items, fmt="{:,.0f}", unit=" M", theme="green", words=["English", "Mandarin", "Hindi", "Spanish", "Arabic", "French"])),
     N("Number five, Standard Arabic, about three hundred thirty five million total speakers, as the language of the Quran and of news and education across the Arab world.", T.stat("#5", "ARABIC", "about 335 million speakers", ORG, "the language of the Quran", 150, theme="green")),
     N("Number four, Spanish, five hundred fifty nine million speakers. Number three, Hindi, six hundred nine million, spoken across India and the diaspora.", T.stat("#4 and #3", "SPANISH + HINDI", "559 and 609 million", GOLD, "", 100, theme="green")),
     N("Number two, Mandarin Chinese, one billion one hundred eighteen million speakers, mostly native speakers, the most of any language.", T.stat("#2", "MANDARIN", "1.12 billion, mostly native", PINK, "", 120, theme="green")),
     N("And number one, English, at one point five billion speakers. But only about three hundred eighty million speak it as a first language. Most learned it as a second.", T.num("English, total speakers", 1515, fmt="{:,.0f}", post=" million", color=GOLD, bottom="only about 380 million native", theme="green", word="English", dur=1.4)),
     N("There are about seven thousand languages in the world, and just twenty three of them are spoken by half of everyone. Every language that disappears takes a whole world of stories with it.", T.num("languages spoken by half of humanity", 23, fmt="{:.0f}", color=CY, bottom="out of about 7,000", theme="green", word="twenty", dur=1.0)),
    ]
    return R(332, "most_spoken_languages_ranked", "the most spoken languages in the world", "English has 1.5 billion speakers, but only about 380 million are native. half of humanity speaks just 23 languages. send this to someone who speaks more than one",
             "Ethnologue 2024 total speakers (L1+L2, millions, approximate): English 1,515; Mandarin 1,118; Hindi 609; Spanish 559; Standard Arabic about 335; French 310; English L1 about 380. About 7,168 living languages; 23 languages account for more than half of the world's population.", "lofi", n)

def old_things():
    items = [("Methuselah, bristlecone pine", 4855), ("Ming, ocean clam", 507), ("Greenland shark", 400), ("Jonathan, giant tortoise", 193), ("Jeanne Calment, human", 122)]
    n = [
     N("The oldest living things on Earth. One of them was already alive when the pyramids were being built, and it's still growing today.", T.kinetic([("THE OLDEST", WHITE, 100), ("LIVING THINGS", GOLD, 100)], "green")),
     N("Starting with the oldest human ever recorded, Jeanne Calment of France, who lived to one hundred twenty two years and one hundred sixty four days.", T.bars("age in years", items, fmt="{:,.0f}", unit=" yrs", theme="green", words=["Methuselah", "Ming", "Greenland", "Jonathan", "Jeanne"])),
     N("Next, Jonathan, a giant tortoise living on the island of Saint Helena, who was born around eighteen thirty two, and is now over a hundred ninety years old.", T.stat("Jonathan the tortoise", "190+ YEARS", "born around 1832, still going", ORG, "", 130, theme="green")),
     N("The Greenland shark can live about four hundred years. It grows only about a centimeter a year, and reaches adulthood at around age one fifty.", T.stat("the Greenland shark", "~400 YEARS", "the longest-lived vertebrate", CY, "adult at around 150", 130, theme="green")),
     N("A clam called Ming, pulled up off Iceland in two thousand six, was five hundred seven years old. It was born during the Ming dynasty, in fourteen ninety nine.", T.stat("Ming the clam", "507 YEARS", "born in 1499, off Iceland", PINK, "the oldest known animal", 130, theme="green")),
     N("But the oldest of all are plants. A bristlecone pine named Methuselah, growing in California, is about forty eight hundred fifty years old. It started growing before the Great Pyramid was finished.", T.num("Methuselah, a pine in California", 4855, fmt="{:,.0f}", post=" years", color=GOLD, bottom="older than the pyramids", theme="green", word="Methuselah", dur=1.4)),
     N("And some colonies are even older. A Norway spruce in Sweden called Old Tjikko has roots almost ten thousand years old. The oldest living things are quiet, and patient.", T.kinetic([("OLDEST = QUIET", WHITE, 80), ("AND PATIENT", GOLD, 100)], "green")),
    ]
    return R(333, "oldest_living_things_ranked", "the oldest living things on Earth", "a pine tree in California is 4,855 years old, older than the pyramids. a clam was 507. send this to someone who needs patience",
             "Ages: Methuselah (Great Basin bristlecone pine, White Mountains, CA) about 4,855 years (Schulman); Ming the ocean quahog 507 years (2006, Bangor University); Greenland shark about 392 +/- 120 years (Nielsen 2016); Jonathan the tortoise about 193 (hatched about 1832); Jeanne Calment 122 years 164 days. Old Tjikko clonal root system about 9,560 years.", "lofi", n)

def speed_ladder():
    n = [
     N("A speed ladder. From the slowest animal to the fastest human made object. Each step is much faster than the one before, and the last one will blow your mind.", T.kinetic([("THE SPEED", WHITE, 100), ("LADDER", GOLD, 140)], "space")),
     N("Step one, you, walking at five kilometers an hour. Step two, a cheetah at a hundred ten.", T.steps("speed, km/h", [("5", "you, walking"), ("110", "a cheetah")], theme="space", words=["Step", "cheetah"], size=100)),
     N("Step three, a passenger jet, about nine hundred kilometers an hour. Step four, the speed of sound, about twelve hundred thirty five.", T.steps("speed, km/h", [("900", "a passenger jet"), ("1,235", "the speed of sound")], theme="space", words=["jet", "sound"], size=100)),
     N("Step five, the International Space Station, twenty seven thousand six hundred kilometers an hour. Orbiting the Earth every ninety minutes.", T.steps("speed, km/h", [("27,600", "the Space Station")], theme="space", words=["Station"], size=100)),
     N("Step six, Voyager one, the farthest spacecraft, at about sixty one thousand kilometers an hour, leaving the solar system.", T.steps("speed, km/h", [("61,000", "Voyager 1, leaving the solar system")], theme="space", words=["Voyager"], size=100)),
     N("And the top step, the Parker Solar Probe, which skims the Sun's atmosphere. In twenty twenty four it hit six hundred ninety two thousand kilometers an hour. The fastest human made object ever.", T.num("Parker Solar Probe", 692000, fmt="{:,.0f}", post=" km/h", color=GOLD, bottom="the fastest human made object", theme="space", word="six", dur=1.6)),
     N("That's over a hundred thousand times faster than you walk. It could fly from New York to Tokyo in under a minute. The Sun's gravity is a powerful slingshot.", T.num("New York to Tokyo", 1, fmt="{:.0f}", post=" minute", color=PINK, bottom="at 692,000 km/h", theme="space", word="Tokyo", dur=0.8)),
    ]
    return R(334, "speed_ladder", "the speed ladder from walking to the Parker Probe", "from a walking human at 5 km/h to the Parker Solar Probe at 692,000 km/h, the fastest thing humans ever built. send this to someone who thinks they're fast",
             "Parker Solar Probe reached about 692,000 km/h (192 km/s) on 24 Dec 2024 at 6.1 million km from the Sun; Voyager 1 about 17 km/s (61,000 km/h); ISS 27,600 km/h; sound at sea level 1,235 km/h; cheetah about 110 km/h. New York to Tokyo is about 10,850 km = about 57 s at 192 km/s.", "synth", n)

def deadliest_animals():
    items = [("Mosquito", 725000), ("Humans", 475000), ("Snakes", 50000), ("Dogs", 25000), ("Tsetse fly", 10000), ("Crocodiles", 1000), ("Hippos", 500), ("Lions", 100), ("Sharks", 10)]
    n = [
     N("The most dangerous animals in the world. And the real winner is smaller than your fingernail, while sharks barely make the list.", T.kinetic([("THE DEADLIEST", WHITE, 100), ("ANIMALS", GOLD, 140)], "warm")),
     N("These numbers are deaths per year. Starting at the bottom, sharks kill about ten people a year. Ten. Despite every movie.", T.bars("human deaths per year", items, fmt="{:,.0f}", theme="warm", words=["Mosquito", "Humans", "Snakes", "Dogs", "Tsetse", "Crocodiles", "Hippos", "Lions", "Sharks"])),
     N("Lions kill about a hundred, and hippos about five hundred, more than lions, even though they eat plants.", T.stat("hippos vs lions", "500 vs 100", "deaths a year", ORG, "hippos are more dangerous", 150, theme="warm")),
     N("Crocodiles, about a thousand a year. Tsetse flies, which spread sleeping sickness, ten thousand.", T.stat("#5 and #6", "FLIES > CROCODILES", "10,000 vs 1,000 a year", GOLD, "", 90, theme="warm")),
     N("Dogs, mostly through rabies, kill about twenty five thousand people a year. Snakes, about fifty thousand.", T.stat("dogs + snakes", "25,000 + 50,000", "mostly rabies and venom", CY, "", 110, theme="warm")),
     N("Number two is the one that might surprise you. Humans, about four hundred seventy five thousand deaths a year, killing each other.", T.num("humans", 475000, fmt="{:,.0f}", color=PINK, bottom="number two, by a lot", theme="warm", word="Humans", dur=1.4)),
     N("And number one, by far, the mosquito. About seven hundred twenty five thousand deaths a year, from diseases like malaria and dengue. The smallest animal is the deadliest.", T.num("mosquitoes", 725000, fmt="{:,.0f}", color=GOLD, bottom="deaths a year, the deadliest animal", theme="warm", word="mosquito", dur=1.4)),
    ]
    return R(335, "deadliest_animals_ranked", "the deadliest animals on Earth", "mosquitoes kill about 725,000 people a year, sharks kill about 10. countdown of the deadliest animals. send this to someone afraid of sharks",
             "Gates Notes (2014, using WHO and other data): mosquitoes about 725,000 deaths/year; humans about 475,000 (homicides); snakes about 50,000; dogs about 25,000; tsetse flies about 10,000; crocodiles about 1,000; hippos about 500; lions about 100; sharks about 10. Figures are estimates.", "trap", n)

def moons():
    items = [("Jupiter", 139820), ("Saturn", 116460), ("Uranus", 50724), ("Neptune", 49244), ("Earth", 12742), ("Venus", 12104), ("Mars", 6779), ("Ganymede, moon", 5268), ("Titan, moon", 5150), ("Mercury", 4879)]
    n = [
     N("Two moons in our solar system are bigger than the planet Mercury. And one of them has an atmosphere thicker than ours.", T.kinetic([("MOONS BIGGER", WHITE, 100), ("THAN A PLANET", GOLD, 100)], "space")),
     N("Here are the diameters, from Jupiter, the largest, all the way down to Mercury, the smallest planet.", T.bars("diameter, km", items, fmt="{:,.0f}", unit=" km", theme="space", sort=False, words=["Jupiter", "Saturn", "Uranus", "Neptune", "Earth", "Venus", "Mars", "Ganymede", "Titan", "Mercury"])),
     N("Mercury, the smallest planet, is four thousand eight hundred seventy nine kilometers across.", T.num("Mercury's diameter", 4879, fmt="{:,.0f}", post=" km", color=CY, bottom="the smallest planet", theme="space", word="Mercury", dur=1.2)),
     N("But Jupiter's moon Ganymede is fifty two sixty eight kilometers wide. Bigger than Mercury, and the biggest moon in the solar system.", T.vs(("Mercury", 4879, CY), ("Ganymede", 5268, GOLD), unit=" km", fmt="{:,.0f}", note="the moon is bigger", theme="space", word="Ganymede")),
     N("Saturn's moon Titan is fifty one fifty kilometers across. Also bigger than Mercury. Titan has a thick atmosphere, and lakes and rivers of liquid methane.", T.vs(("Mercury", 4879, CY), ("Titan", 5150, ORG), unit=" km", fmt="{:,.0f}", note="Titan is bigger too", theme="space", word="Titan")),
     N("Mercury is still heavier, though, because it's made of dense metal. Ganymede and Titan are mostly ice and rock. So the moons are bigger but lighter.", T.kinetic([("BIGGER", WHITE, 90), ("BUT LIGHTER", GOLD, 110)], "space")),
     N("Our own Moon is smaller, at thirty four seventy four kilometers. But in size, it ranks fifth among all moons. The solar system is full of worlds we've barely seen.", T.num("our Moon, the 5th largest", 3474, fmt="{:,.0f}", post=" km", color=GRN, bottom="fifth largest moon in the solar system", theme="space", word="Moon", dur=1.2)),
    ]
    return R(336, "moons_bigger_than_mercury", "two moons are bigger than Mercury", "Ganymede and Titan are both bigger than the planet Mercury. send this to someone who thinks planets are always bigger than moons",
             "Diameters (km): Jupiter 139,820; Saturn 116,460; Uranus 50,724; Neptune 49,244; Earth 12,742; Venus 12,104; Mars 6,779; Ganymede 5,268; Titan 5,150; Mercury 4,879; Callisto 4,821; Io 3,643; Moon 3,474. Mercury mass 3.3e23 kg exceeds Ganymede 1.5e23 kg.", "cine", n)

REELS = dict(tallest_buildings_ranked=tall_buildings, biggest_countries_ranked=countries_area, most_populated_countries_ranked=populations, longest_rivers_ranked=rivers, highest_mountains_ranked=mountains8000, most_spoken_languages_ranked=languages, oldest_living_things_ranked=old_things, speed_ladder=speed_ladder, deadliest_animals_ranked=deadliest_animals, moons_bigger_than_mercury=moons)
