"""Batch 48: education reels, food and health."""
import math
from edu import *
import functools
R = functools.partial(R, chip="FOOD & HEALTH")

def cola():
    n = [
     N("A single can of cola has more sugar than most people eat in a whole breakfast. Here's what thirty nine grams really looks like.", T.kinetic([("ONE CAN OF COLA", WHITE, 80), ("= 10 TEASPOONS", GOLD, 100), ("OF SUGAR", WHITE, 90)], "warm")),
     N("A twelve ounce can of regular Coca Cola has thirty nine grams of sugar. A teaspoon of sugar is about four grams.", T.num("sugar in one can", 39, fmt="{:.0f}", post=" grams", color=PINK, bottom="a 12 oz can of Coca-Cola", theme="warm", word="thirty", dur=1.2)),
     N("Divide thirty nine by four, and you get nearly ten teaspoons. Imagine stirring ten teaspoons of sugar into a glass of water, and drinking it.", T.num("teaspoons of sugar", 9.75, fmt="{:.1f}", color=GOLD, bottom="in one small can", theme="warm", word="teaspoons", dur=1.2)),
     N("The American Heart Association recommends no more than thirty six grams of added sugar a day for men, and twenty five for women.", T.bars("daily limit of added sugar, grams", [("women", 25), ("men", 36), ("one can of cola", 39)], fmt="{:.0f}", unit=" g", cols=[CY, GRN, PINK], theme="warm", words=["women", "men", "can"])),
     N("So one can already puts you above the limit, before you've eaten anything else that day. Sugar hides in sauces, cereals, and juices too.", T.kinetic([("ONE CAN", WHITE, 100), ("> YOUR DAILY LIMIT", PINK, 80)], "warm")),
     N("The World Health Organization suggests keeping free sugars under ten percent of your calories, and ideally under five. For most adults, that's twenty five to fifty grams.", T.ring("of calories from free sugar, at most", .10, "ideally under 5%", GOLD, theme="warm", word="ten")),
     N("You don't have to give up everything. But now you know what you're drinking. Check the label, and picture the teaspoons.", T.kinetic([("CHECK THE LABEL", WHITE, 80), ("COUNT TEASPOONS", GOLD, 90)], "warm")),
    ]
    return R(297, "cola_sugar_teaspoons", "how much sugar is in a can of cola", "one can of cola has 39 grams of sugar, almost 10 teaspoons, more than the daily limit for women. send this to someone with a soda habit",
             "Coca-Cola Classic 12 fl oz: 39 g sugar. 1 teaspoon about 4 g. AHA added-sugar limits: 36 g/day men, 25 g/day women. WHO: free sugars less than 10% of energy, ideally less than 5%.", "funk", n)

def pizza():
    a16 = math.pi * 8 ** 2; a18 = math.pi * 9 ** 2; a12 = math.pi * 36
    assert round((a18 / a16 - 1) * 100) == 27 and abs((2 * a12 / a16 - 1) * 100 - 12.5) < .1
    n = [
     N("Pizza shops quietly use a math trick on you. A bigger pizza is a much better deal than it looks. The numbers are not what your eyes tell you.", T.kinetic([("THE PIZZA TRICK", GOLD, 120), ("YOUR EYES FAIL", WHITE, 84)], "warm")),
     N("Pizza is priced by diameter, but you eat the area. And area grows with the square of the width.", T.formula(["area = π × r²"], theme="warm", title="the rule")),
     N("A sixteen inch pizza has a radius of eight inches. That gives about two hundred one square inches of pizza.", T.num("a 16 inch pizza", 201, fmt="{:,.0f}", post=" in²", color=CY, bottom="radius 8, area π × 64", theme="warm", word="sixteen", dur=1.2)),
     N("An eighteen inch pizza looks only a bit bigger. But it has two hundred fifty five square inches, twenty seven percent more food for two inches of width.", T.vs(("16 inch", 201, CY), ("18 inch", 255, GOLD), unit=" in²", fmt="{:,.0f}", note="+27% pizza", theme="warm", word="eighteen")),
     N("Here's the shocker. Two twelve inch pizzas, each one hundred thirteen square inches, give you two hundred twenty six. That's more than one sixteen inch pizza.", T.vs(("one 16 inch", 201, CY), ("two 12 inch", 226, GRN), unit=" in²", fmt="{:,.0f}", note="two small > one big", theme="warm", word="twelve")),
     N("And a small eight inch pizza, half the diameter of a sixteen inch, has only one quarter of the pizza. Half the width, a quarter of the food.", T.num("an 8 inch pizza has", 25, fmt="{:.0f}", post="%", color=PINK, bottom="of the food of a 16 inch", theme="warm", word="quarter", dur=1.0)),
     N("So the next time you order, don't compare the inches. Compare the area, or the price per square inch. Your wallet, and your stomach, will thank you.", T.kinetic([("COMPARE", WHITE, 90), ("THE AREA", GOLD, 130)], "warm")),
    ]
    return R(298, "pizza_size_math", "the pizza size math trick", "an 18 inch pizza has 27% more food than a 16 inch, and two 12 inch pizzas beat one 16 inch. send this to someone who orders pizza",
             "Area = pi r^2: 8 in -> 50.3; 12 in -> 113.1; 16 in -> 201.1; 18 in -> 254.5 square inches. 18 vs 16: +26.6%; two 12 in = 226.2 vs 201.1: +12.5%.", "funk", n)

def honey():
    n = [
     N("Honey is the only food that never really spoils. Archaeologists have found jars of it in ancient tombs, still perfectly good thousands of years later.", T.kinetic([("HONEY", GOLD, 150), ("NEVER SPOILS", WHITE, 100)], "warm")),
     N("It's not magic. It's chemistry, and there are three reasons. First, honey has almost no water. It's about eighty percent sugar and only seventeen percent water.", T.ring("of honey is water", .17, "microbes need more water to live", CY, theme="warm", word="seventeen")),
     N("Bacteria and mold need water to grow. In honey, the sugar is so concentrated that it pulls water out of any microbe that lands in it. They dry out and die.", T.kinetic([("SUGAR SUCKS", WHITE, 90), ("WATER OUT", GOLD, 110), ("OF GERMS", WHITE, 80)], "warm")),
     N("Second, honey is acidic. Its pH is around four, about as acidic as orange juice, which discourages most microbes.", T.num("honey's pH", 3.9, fmt="{:.1f}", color=ORG, bottom="similar to orange juice", theme="warm", word="four", dur=0.9)),
     N("Third, bees add an enzyme called glucose oxidase. When it's slightly diluted, it makes small amounts of hydrogen peroxide, a natural disinfectant.", T.stat("the bees' secret", "HYDROGEN PEROXIDE", "a natural disinfectant", GRN, "", 76, theme="warm")),
     N("So honey stays safe in a sealed jar for an incredibly long time. If it crystallizes, that's just the sugar forming crystals. Warm it up, and it's fine.", T.kinetic([("HARDENED?", WHITE, 100), ("JUST WARM IT", GOLD, 100)], "warm")),
     N("One thing to remember. Never give honey to babies under one year old. Their gut can't handle a bacteria spore that can survive in it. For everyone else, the jar in your cabinet will outlast you.", T.kinetic([("NEVER FOR BABIES", PINK, 80), ("UNDER 1 YEAR OLD", PINK, 80)], "warm")),
    ]
    return R(299, "honey_never_spoils", "why honey never spoils", "honey never spoils because it's low in water, acidic, and bees add a natural disinfectant. send this to someone who throws out old honey",
             "Honey: about 17% water, 80% sugars, pH about 3.4-4.5; bee-derived glucose oxidase produces hydrogen peroxide when diluted. Infant botulism risk: do not feed honey to infants under 12 months (CDC).", "lofi", n)

def coffee():
    n = [
     N("Every day, the world drinks about two and a quarter billion cups of coffee. Here's the journey behind just one of them.", T.kinetic([("2.25 BILLION", GOLD, 120), ("CUPS A DAY", WHITE, 100)], "warm")),
     N("That's about ten million tonnes of coffee beans harvested every year, mostly from just a handful of countries around the equator.", T.num("coffee harvested each year", 10, fmt="{:.0f}", post=" million tonnes", color=ORG, bottom="grown near the equator", theme="warm", word="ten", dur=1.0)),
     N("Brazil alone grows about a third of the world's coffee. Vietnam is second, and Colombia is third.", T.bars("share of world coffee", [("Brazil", 37), ("Vietnam", 17), ("Colombia", 8)], fmt="{:.0f}", unit="%", cols=[GRN, CY, GOLD], theme="warm", words=["Brazil", "Vietnam", "Colombia"])),
     N("A coffee tree takes about three to four years before it gives its first fruit. And a mature tree produces only about half a kilogram of roasted coffee a year.", T.num("coffee per tree, per year", 0.5, fmt="{:.1f}", post=" kg", color=PINK, bottom="enough for about 50 cups", theme="warm", word="half", dur=0.9)),
     N("So one tree supplies only about one cup a week. And every cup uses roughly seventy beans.", T.num("beans in one cup", 70, fmt="{:.0f}", color=GOLD, bottom="from a small red cherry", theme="warm", word="seventy", dur=0.9)),
     N("Who drinks the most? Finland, per person, with about twelve kilograms of coffee a year. That's roughly four cups a day, for everyone.", T.num("Finland, per person per year", 12, fmt="{:.0f}", post=" kg", color=CY, bottom="the world's biggest coffee drinkers", theme="warm", word="Finland", dur=1.0)),
     N("And caffeine isn't just for people. The coffee plant makes it to poison insects that try to eat it. We just learned to enjoy the plant's defense.", T.kinetic([("CAFFEINE IS", WHITE, 90), ("A PLANT'S", WHITE, 70), ("POISON", GOLD, 130)], "warm")),
    ]
    return R(300, "coffee_world_numbers", "how the world drinks coffee", "the world drinks 2.25 billion cups of coffee every day, and Finland drinks the most per person. send this to your coffee addict",
             "ICO: about 2.25 billion cups/day; world production about 10.5 million tonnes (2022/23); Brazil about 37%, Vietnam about 17%, Colombia about 8% by volume (USDA). Finland about 12 kg per capita per year.", "lofi", n)

def beef_water():
    n = [
     N("It takes about fifteen thousand liters of water to produce one kilogram of beef. That's a lot more than a kilogram of rice, or even chicken. Here's the comparison.", T.kinetic([("1 KG OF BEEF", WHITE, 90), ("= 15,000 LITERS", GOLD, 90), ("OF WATER", WHITE, 80)], "teal")),
     N("This number is called the water footprint. It counts all the water used to grow the feed, give the animal a drink, and process the meat.", T.stat("water footprint", "ALL THE WATER", "feed, drinking, processing", CY, "", 120, theme="teal")),
     N("For comparison, one kilogram of wheat needs about eighteen hundred liters. Rice, about twenty five hundred liters.", T.bars("liters of water per kilogram", [("wheat", 1827), ("rice", 2497), ("chicken", 4325), ("beef", 15415)], fmt="{:,.0f}", unit=" L", cols=[GRN, CY, ORG, PINK], theme="teal", words=["wheat", "Rice", "chicken", "beef"])),
     N("Chicken is about forty three hundred. And beef is more than fifteen thousand, because a cow eats for years before it's slaughtered.", T.num("beef vs wheat", 8.4, fmt="{:.1f}", post="× more water", color=PINK, bottom="per kilogram", theme="teal", word="beef", dur=1.0)),
     N("But there's an important detail. About ninety percent of that water is green water, rain that falls on pasture and feed crops. It's not pumped from rivers.", T.ring("of beef's water is rainwater", .94, "'green water' that falls on the fields", GRN, theme="teal", word="ninety")),
     N("Still, the numbers show why food choices matter. Eating less beef, even once or twice a week, saves tens of thousands of liters a year.", T.kinetic([("ONE LESS BURGER", WHITE, 80), ("SAVES ABOUT", WHITE, 70), ("2,500 LITERS", GOLD, 110)], "teal")),
     N("You don't have to give up what you love. Just know that every kilogram of food has a hidden river inside it.", T.kinetic([("EVERY MEAL", WHITE, 90), ("HAS A HIDDEN RIVER", GOLD, 70)], "teal")),
    ]
    return R(301, "beef_water_footprint", "how much water it takes to make beef", "one kilogram of beef takes about 15,000 liters of water, mostly rainwater, 8 times more than wheat. send this to someone planning a barbecue",
             "Mekonnen & Hoekstra 2012 global averages (liters per kg): beef 15,415; chicken 4,325; rice 2,497; wheat 1,827. About 94% of beef's footprint is green (rain) water.", "cine", n)

def scoville():
    n = [
     N("How hot is hot? Scientists measure the spiciness of peppers on something called the Scoville scale. And the top of the scale is truly insane.", T.kinetic([("HOW SPICY", WHITE, 100), ("IS SPICY?", GOLD, 130)], "warm")),
     N("The scale counts how many times you'd have to dilute a pepper's extract before you can't taste any heat. More dilution means hotter.", T.stat("the Scoville scale", "HEAT UNITS", "how much you must dilute it", ORG, "", 120, theme="warm")),
     N("A bell pepper has zero. A jalapeno is about five thousand. Tabasco sauce is about forty thousand.", T.bars("Scoville units", [("bell pepper", 0), ("jalapeno", 5000), ("Tabasco sauce", 40000)], fmt="{:,.0f}", cols=[GRN, ORG, PINK], theme="warm", words=["bell", "jalapeno", "Tabasco"])),
     N("A habanero is much hotter, around two hundred thousand. A ghost pepper climbs to over a million.", T.bars("Scoville units", [("habanero", 200000), ("ghost pepper", 1000000)], fmt="{:,.0f}", cols=[ORG, PINK], theme="warm", words=["habanero", "ghost"])),
     N("The Carolina Reaper, once the world's hottest pepper, averages about one point six million units. Police grade pepper spray is around two million.", T.bars("Scoville units", [("Carolina Reaper", 1640000), ("pepper spray", 2000000)], fmt="{:,.0f}", cols=[PINK, VIO], theme="warm", words=["Reaper", "spray"])),
     N("And pure capsaicin, the chemical that makes peppers hot, scores sixteen million units. That's about six times hotter than the hottest pepper ever bred.", T.num("pure capsaicin", 16, fmt="{:.0f}", post=" million units", color=PINK, bottom="6× the hottest pepper ever bred", theme="warm", word="sixteen", dur=1.2)),
     N("Funny enough, birds can't feel capsaicin at all. That's why peppers evolved to be hot. They want birds to eat them and spread the seeds, but not mammals who chew them up.", T.kinetic([("BIRDS CAN'T", WHITE, 90), ("FEEL THE HEAT", GOLD, 100)], "warm")),
    ]
    return R(302, "scoville_scale", "how spicy are peppers", "pure capsaicin is 16 million Scoville units, about 6x hotter than the hottest pepper ever bred. send this to someone who thinks they can handle spice",
             "Typical Scoville heat units: bell pepper 0; jalapeno 2,500-8,000; Tabasco sauce 30,000-50,000; habanero 100,000-350,000; ghost pepper about 1,000,000; Carolina Reaper about 1.64 million average; pepper spray about 2 million; pure capsaicin 16 million.", "bounce", n)

def caffeine():
    n = [
     N("How much caffeine is too much? The answer is more specific than you think. And there's a number that explains why coffee at three in the afternoon ruins your night.", T.kinetic([("HOW MUCH", WHITE, 100), ("CAFFEINE", GOLD, 130), ("IS TOO MUCH?", WHITE, 90)], "warm")),
     N("The US Food and Drug Administration says up to four hundred milligrams a day is generally safe for most healthy adults.", T.num("safe daily limit", 400, fmt="{:,.0f}", post=" mg", color=GRN, bottom="for most healthy adults (FDA)", theme="warm", word="four", dur=1.2)),
     N("A cup of brewed coffee has about ninety five milligrams. So four hundred milligrams is about four cups. An energy drink has around one hundred sixty.", T.bars("caffeine, mg", [("cup of coffee", 95), ("energy drink", 160), ("daily limit", 400)], fmt="{:.0f}", unit=" mg", cols=[ORG, PINK, GRN], theme="warm", words=["coffee", "energy", "limit"])),
     N("What about the dangerous amount? A fatal dose is around ten grams, which is about a hundred cups of coffee, drunk quickly. That's very hard to do from drinks.", T.num("a dangerous dose", 10, fmt="{:.0f}", post=" grams", color=PINK, bottom="about 100 cups at once", theme="warm", word="ten", dur=0.9)),
     N("But the real problem is timing. Caffeine has a half life of about five hours. That means half of it is still in your body five hours later.", T.num("caffeine half-life", 5, fmt="{:.0f}", post=" hours", color=GOLD, bottom="half is still in your body", theme="warm", word="half", dur=0.9)),
     N("So a coffee at three in the afternoon has still half its caffeine in your system at eight. And a quarter of it at one in the morning.", T.steps("one coffee at 3 pm", [("8 pm", "half is still in you"), ("1 am", "a quarter is still in you")], theme="warm", words=["eight", "one"])),
     N("That caffeine blocks the chemical that makes you feel sleepy, so you sleep lighter, even if you can fall asleep. Try cutting off caffeine by noon, and see what happens.", T.kinetic([("CAFFEINE CUTOFF:", WHITE, 70), ("NOON", GOLD, 140)], "warm")),
    ]
    return R(303, "caffeine_half_life", "how much caffeine is too much", "caffeine has a 5 hour half life, a 3pm coffee is still half in your body at 8pm. send this to someone who can't sleep",
             "FDA: up to 400 mg caffeine/day is not generally associated with adverse effects for most healthy adults. Brewed coffee about 95 mg/8 oz. Half-life about 5 hours (range 3-7). Acute toxic dose roughly 150-200 mg/kg (about 10 g).", "funk", n)

def big_mac():
    t = 590 / (3.5 * 70); assert 2.3 < t < 2.5
    n = [
     N("A Big Mac has about five hundred ninety calories. But what does that actually mean? How long would you have to walk or run to burn it off?", T.kinetic([("1 BIG MAC", WHITE, 100), ("= HOW MUCH WALKING?", GOLD, 70)], "warm")),
     N("A calorie is just a unit of energy. A Big Mac holds about five hundred ninety of them, over a quarter of a typical day's food.", T.num("a Big Mac", 590, fmt="{:,.0f}", post=" kcal", color=PINK, bottom="over 25% of a day's energy", theme="warm", word="five", dur=1.2)),
     N("A seventy kilogram person walking at a normal pace, about five kilometers an hour, burns around two hundred forty five calories an hour.", T.num("walking burns", 245, fmt="{:.0f}", post=" kcal / hour", color=CY, bottom="70 kg person, 5 km/h", theme="warm", word="two", dur=1.2)),
     N("That means it takes about two and a half hours of walking, about twelve kilometers, to burn one Big Mac.", T.num("walk to burn one Big Mac", 2.4, fmt="{:.1f}", post=" hours", color=GOLD, bottom="about 12 kilometers", theme="warm", word="two", dur=1.0)),
     N("Running is more efficient per minute. A seventy kilogram person burns about seventy calories per kilometer, so you'd need to run eight kilometers.", T.num("run to burn one Big Mac", 8, fmt="{:.0f}", post=" km", color=ORG, bottom="about 5 miles", theme="warm", word="eight", dur=1.0)),
     N("A medium fries adds another three hundred twenty, and a medium cola about two hundred. The whole meal is around eleven hundred calories, four and a half hours of walking.", T.num("a full meal", 1110, fmt="{:,.0f}", post=" kcal", color=PINK, bottom="burger + fries + cola", theme="warm", word="eleven", dur=1.4)),
     N("This isn't about guilt. It's about perspective. Food is energy, and it's much easier to eat it than to burn it. Knowing the numbers helps you choose.", T.kinetic([("EASY TO EAT", WHITE, 90), ("HARD TO BURN", GOLD, 100)], "warm")),
    ]
    return R(304, "big_mac_walk", "how long to walk off a Big Mac", "to burn off a Big Mac you'd need to walk 12 km or run 8 km. send this to someone who just ordered fast food",
             "McDonald's US Big Mac about 590 kcal (older listings 563). Walking about 3.5 METs x 70 kg x 1 h = 245 kcal/h -> 2.4 h; running about 1 kcal/kg/km = 70 kcal/km -> 8.4 km. Medium fries about 320 kcal, medium Coke about 200 kcal.", "funk", n)

def sleep_cycles():
    n = [
     N("Why do you sometimes wake up exhausted after eight hours, and other times feel great after six? It's not how long you sleep. It's where in the cycle you wake up.", T.kinetic([("WHY AM I TIRED", WHITE, 80), ("AFTER 8 HOURS?", GOLD, 100)], "ink")),
     N("Sleep isn't one long block. It runs in cycles of about ninety minutes, each moving from light sleep, to deep sleep, to dream sleep.", T.num("one sleep cycle", 90, fmt="{:.0f}", post=" minutes", color=CY, bottom="light, deep, then dreams", theme="ink", word="ninety", dur=1.0)),
     N("A good night has about five of these cycles. That adds up to seven and a half hours.", T.num("five cycles", 7.5, fmt="{:.1f}", post=" hours", color=GOLD, bottom="5 × 90 minutes", theme="ink", word="five", dur=1.0)),
     N("If your alarm rings in the middle of deep sleep, you wake up foggy and groggy. That feeling is called sleep inertia, and it can last for half an hour.", T.stat("woken in deep sleep", "SLEEP INERTIA", "grogginess for up to 30 minutes", PINK, "", 110, theme="ink")),
     N("If instead you wake at the end of a cycle, in light sleep, you feel much more alert, even with a bit less sleep in total.", T.kinetic([("END OF A CYCLE", WHITE, 80), ("= FEEL FRESH", GOLD, 100)], "ink")),
     N("So aim your bedtime around the cycles. If you wake at six, go to sleep at ten thirty for five cycles. At midnight, for four. And remember you need about fifteen minutes to fall asleep.", T.steps("wake at 6:00 am, sleep at", [("10:30 pm", "5 cycles"), ("12:00 am", "4 cycles")], theme="ink", words=["thirty", "midnight"])),
     N("Cycle length varies from person to person, so treat these as a guide. But if you're always groggy, shifting your alarm by thirty minutes might change your mornings.", T.kinetic([("SHIFT YOUR ALARM", WHITE, 80), ("BY 30 MINUTES", GOLD, 100)], "ink")),
    ]
    return R(305, "sleep_cycles_90", "the 90 minute sleep cycle", "sleep runs in 90 minute cycles, wake at the end of one and you feel fresh. 5 cycles is 7.5 hours. send this to someone who's always tired",
             "Typical NREM-REM cycle about 90 minutes (range 80-110); about 4-6 cycles per night; sleep inertia after waking from slow wave sleep can last up to 30 minutes; sleep onset about 10-20 minutes.", "lofi", n)

def ocean_salt():
    n = [
     N("If you took all the salt out of the ocean and spread it over the land, it would cover every continent in a layer about a hundred and fifty meters thick. That's taller than a forty story building.", T.kinetic([("OCEAN SALT", WHITE, 100), ("OVER ALL LAND", GOLD, 100), ("150 METERS DEEP", WHITE, 70)], "blue")),
     N("Seawater is about three point five percent salt. That means every liter holds about thirty five grams, the weight of two tablespoons.", T.num("salt in one liter of seawater", 35, fmt="{:.0f}", post=" grams", color=CY, bottom="about 2 tablespoons", theme="blue", word="thirty", dur=1.0)),
     N("The ocean holds about one point three billion cubic kilometers of water. Multiply it out, and the total weighs about forty eight quadrillion tonnes of salt.", T.num("salt in the ocean", 48, fmt="{:.0f}", post=" quadrillion tonnes", color=GOLD, bottom="about 4.8 × 10¹⁶ tonnes", theme="blue", word="forty", dur=1.4)),
     N("If you spread that over all the land on Earth, about a hundred forty nine million square kilometers, you'd get a layer roughly a hundred fifty meters deep.", T.num("depth of the salt layer", 150, fmt="{:.0f}", post=" meters", color=PINK, bottom="a 40 story building", theme="blue", word="hundred", dur=1.2)),
     N("Where did it all come from? Rain slowly dissolves minerals from rocks, and rivers carry them to the sea. When the water evaporates, the salt stays behind.", T.kinetic([("RIVERS CARRY", WHITE, 80), ("SALT TO THE SEA", GOLD, 80)], "blue")),
     N("The sea has been collecting salt for billions of years. Yet the saltiness stays about the same, because salt also settles out and forms deposits on the seafloor.", T.kinetic([("SALT IN = SALT OUT", WHITE, 80), ("BALANCED", GOLD, 120)], "blue")),
     N("So the oceans are very, very salty. But Earth's lakes are saltier. The Dead Sea is about ten times saltier than the ocean, so salty that you can't sink.", T.num("the Dead Sea", 10, fmt="{:.0f}", post="× saltier", color=VIO, bottom="you float without trying", theme="blue", word="ten", dur=1.0)),
    ]
    return R(306, "ocean_salt_layer", "if ocean salt covered the land", "all the salt in the ocean would cover the land in a layer 150 meters thick. send this to someone who loves the beach",
             "Ocean volume 1.335e9 km3, salinity 35 g/kg: about 4.8e16 tonnes of salt (USGS often quotes a layer about 500 feet (152 m) thick if spread on all land: 4.8e16 t / 2.16 t/m3 = 2.2e16 m3 / 1.49e14 m2 = about 150 m). Dead Sea about 34% salinity.", "cine", n)

REELS = dict(cola_sugar_teaspoons=cola, pizza_size_math=pizza, honey_never_spoils=honey, coffee_world_numbers=coffee, beef_water_footprint=beef_water, scoville_scale=scoville, caffeine_half_life=caffeine, big_mac_walk=big_mac, sleep_cycles_90=sleep_cycles, ocean_salt_layer=ocean_salt)
