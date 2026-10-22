"""Batch 53: education reels, numbers about you, pets and the planet."""
import math
from edu import *
import functools
R = functools.partial(R, chip="DID YOU KNOW")

def birthday_twins():
    n = [
     N("Right now, about twenty two million people share your exact birthday. And if you were born on February twenty ninth, you're part of a much smaller club.", T.kinetic([("22 MILLION PEOPLE", GOLD, 100), ("SHARE YOUR BIRTHDAY", WHITE, 70)], "warm")),
     N("There are about eight point two billion people on Earth. There are three hundred sixty five days in a year, give or take.", T.formula(["8,200,000,000 people", "÷ 365.25 days"], theme="warm", title="the math")),
     N("Divide them, and you get about twenty two and a half million people born on each day of the year, on average.", T.num("people per birthday", 22.4, fmt="{:.1f}", post=" million", color=GOLD, bottom="on average, on any date", theme="warm", word="twenty", dur=1.4)),
     N("Some dates are more common than others. In the United States, birthdays cluster in September, about nine months after the winter holidays.", T.kinetic([("SEPTEMBER", GOLD, 120), ("IS BUSY", WHITE, 100)], "warm")),
     N("Now leap day. February twenty ninth only exists once every four years, which makes it rare. About five point six million people are born on it, worldwide, in total.", T.num("people born on Feb 29", 5.6, fmt="{:.1f}", post=" million", color=PINK, bottom="a 1 in 1,461 chance", theme="warm", word="five", dur=1.2)),
     N("That's a one in fourteen hundred sixty one chance. Leap day babies celebrate real birthdays only every four years, and some count their age in leaplings.", T.kinetic([("1 IN 1,461", WHITE, 100), ("LEAPLINGS", GOLD, 120)], "warm")),
     N("So tonight, send this to someone who shares your birthday, because somewhere out there, twenty two million of them are blowing out the same candles.", T.kinetic([("SAME DAY,", WHITE, 90), ("SAME CANDLES", GOLD, 110)], "warm")),
    ]
    return R(347, "birthday_twins_22_million", "how many people share your birthday", "about 22 million people share your birthday, and only 5.6 million were born on a leap day. send this to your birthday twin",
             "8.2e9 / 365.25 = 22.4 million per calendar date; Feb 29: 8.2e9 / 1,461 = 5.6 million. US births peak in September (CDC/NCHS).", "bounce", n)

def trees():
    n = [
     N("There are about three trillion trees on Earth. That's about three hundred seventy for every person alive. But we're losing them fast.", T.kinetic([("370 TREES", GOLD, 130), ("FOR EVERY PERSON", WHITE, 80)], "green")),
     N("In twenty fifteen, scientists combined satellite pictures with measurements on the ground, and estimated three point oh four trillion trees worldwide.", T.num("trees on Earth", 3.04, fmt="{:.2f}", post=" trillion", color=GRN, bottom="Crowther et al., Nature, 2015", theme="green", word="three", dur=1.4)),
     N("Divide that by eight point two billion people, and you get about three hundred seventy trees per person.", T.num("trees per person", 370, fmt="{:.0f}", color=GOLD, bottom="3.04 trillion ÷ 8.2 billion", theme="green", word="three", dur=1.2)),
     N("That sounds like plenty. But the same study found that humans cut down about fifteen billion trees every year.", T.num("trees cut down each year", 15, fmt="{:.0f}", post=" billion", color=PINK, bottom="about 28,000 every minute", theme="green", word="fifteen", dur=1.0)),
     N("And we plant only about five billion. So the net loss is around ten billion trees a year.", T.vs(("planted", 5, GRN), ("cut down", 15, PINK), unit=" billion", fmt="{:.0f}", note="a net loss of 10 billion a year", theme="green", word="plant")),
     N("Before human civilization began, the Earth had about six trillion trees. We've cut down roughly half of them.", T.ring("of the world's trees are gone", .46, "since the start of agriculture", ORG, theme="green", word="half")),
     N("The good news is that we can replant. Planting a tree is one of the cheapest and simplest things you can do for the air, the soil, and the planet.", T.kinetic([("PLANT ONE", WHITE, 100), ("TODAY", GOLD, 140)], "green")),
    ]
    return R(348, "trees_per_person", "how many trees are there on Earth", "there are about 3 trillion trees on Earth, 370 per person, but we cut down 15 billion a year. send this to someone who loves nature",
             "Crowther et al., Nature 2015: about 3.04 trillion trees; about 46% fewer than before the start of human civilisation (about 5.6 trillion); about 15 billion trees are cut down and about 5 billion planted each year (net loss about 10 billion). 3.04e12 / 8.2e9 = 370 per person.", "lofi", n)

def dog_years():
    n = [
     N("Dog years are a myth. The rule that one dog year equals seven human years is wrong, and in two thousand nineteen scientists found a better formula.", T.kinetic([("1 DOG YEAR", WHITE, 100), ("= 7 HUMAN YEARS?", GOLD, 80), ("WRONG", PINK, 130)], "warm")),
     N("The seven year rule is only a rough guess. It came from the idea that humans live about seventy years and dogs about ten. But it ignores how aging really works.", T.kinetic([("70 ÷ 10 = 7", WHITE, 90), ("TOO SIMPLE", GOLD, 100)], "warm")),
     N("Researchers at the University of California San Diego studied chemical changes on the DNA of Labrador retrievers as they aged, and compared them with humans.", T.stat("the 2019 study", "DNA METHYLATION", "a chemical clock that tracks aging", CY, "Labradors vs humans", 90, theme="warm")),
     N("They found a formula. Human age equals sixteen times the natural log of the dog's age, plus thirty one.", T.formula(["human age =", "16 × ln(dog age) + 31"], theme="warm", title="the formula")),
     N("A one year old dog is equal to a thirty one year old human. A two year old dog, about forty two.", T.bars("dog's age → human age", [("1 year", 31), ("2 years", 42)], fmt="{:.0f}", cols=[CY, GOLD], theme="warm", words=["one", "two"])),
     N("A seven year old dog is about sixty two, and a ten year old dog is nearly sixty eight. After the first couple of years, dogs age much more slowly than the old rule says.", T.bars("dog's age → human age", [("7 years", 62), ("10 years", 68), ("15 years", 74)], fmt="{:.0f}", cols=[ORG, PINK, VIO], theme="warm", words=["seven", "ten", "fifteen"])),
     N("Dogs age fast when they're young, and slow down later. And different breeds age differently, so use this as a guide, and give your dog an extra treat for being a very good boy.", T.kinetic([("YOUNG: FAST", WHITE, 100), ("OLD: SLOW", GOLD, 100)], "warm")),
    ]
    return R(349, "dog_years_formula", "the real dog years formula", "a 1 year old dog is like a 31 year old human, not 7. the formula is 16 x ln(age) + 31. send this to a dog owner",
             "Wang et al., Cell Systems 2020 (bioRxiv 2019): human age = 16 ln(dog age) + 31 for Labrador retrievers based on DNA methylation: 1 y -> 31; 2 y -> 42; 7 y -> 62; 10 y -> 68; 15 y -> 74. Breed dependent.", "bounce", n)

def krakatoa():
    n = [
     N("In eighteen eighty three, a volcano exploded with the loudest sound in recorded history. People heard it nearly five thousand kilometers away. It's called Krakatoa.", T.kinetic([("THE LOUDEST SOUND", WHITE, 80), ("EVER RECORDED", GOLD, 100)], "warm")),
     N("Krakatoa is a volcanic island in Indonesia. On August twenty seventh, eighteen eighty three, it erupted in a series of huge explosions.", T.stat("August 27, 1883", "KRAKATOA", "Indonesia", ORG, "", 140, theme="warm")),
     N("The last and biggest explosion was heard in Rodrigues Island, near Mauritius. That's about four thousand eight hundred kilometers away, farther than Los Angeles to New York.", T.num("heard from", 4800, fmt="{:,.0f}", post=" km away", color=GOLD, bottom="a sound heard across an ocean", theme="warm", word="four", dur=1.4)),
     N("A hundred sixty kilometers away, the sound was measured at about one hundred seventy two decibels. A jet engine at takeoff is around one hundred forty.", T.vs(("jet engine", 140, CY), ("Krakatoa, 160 km away", 172, PINK), unit=" dB", fmt="{:.0f}", theme="warm", word="decibels")),
     N("In ships close to the island, sailors' eardrums burst. The pressure wave circled the Earth several times, and barometers around the world recorded it for days.", T.num("times the shock wave circled the Earth", 3.5, fmt="{:.1f}", color=VIO, bottom="recorded by barometers", theme="warm", word="circled", dur=1.0)),
     N("The eruption also caused giant tsunamis that killed over thirty six thousand people. Ash blocked sunlight, and global temperatures fell for years.", T.num("people killed", 36000, fmt="{:,.0f}", color=PINK, bottom="mostly by the tsunamis", theme="warm", word="thirty", dur=1.2)),
     N("Skies turned red around the world for months. Some think that the blood red sky in Edvard Munch's painting, The Scream, was inspired by Krakatoa's sunsets.", T.kinetic([("THE SCREAM'S", WHITE, 90), ("RED SKY?", GOLD, 120)], "warm")),
    ]
    return R(350, "krakatoa_loudest_sound", "the loudest sound in history", "Krakatoa's 1883 explosion was heard 4,800 km away and its shock wave circled the Earth several times. send this to someone who talks loudly",
             "Krakatoa, 27 August 1883: heard at Rodrigues (about 4,800 km), peak about 172 dB at 160 km; the pressure wave was recorded circling the globe 3-4 times; about 36,000 deaths, mostly from tsunamis; global cooling of about 0.4 C in 1884.", "cine", n)

def stars():
    n = [
     N("On the darkest night, far from any city, you can see about two and a half thousand stars. But there are hundreds of billions in our galaxy alone.", T.kinetic([("YOU CAN SEE", WHITE, 80), ("2,500 STARS", GOLD, 120)], "space")),
     N("Across the whole sky, both hemispheres, the naked eye can see about forty five hundred stars. At one time, you only see half the sky.", T.num("stars visible to the naked eye", 4500, fmt="{:,.0f}", color=CY, bottom="in the whole sky, under dark skies", theme="space", word="forty", dur=1.4)),
     N("Our galaxy, the Milky Way, has somewhere between a hundred and four hundred billion stars. That's tens of millions of times more than you can see.", T.num("stars in the Milky Way", 200, fmt="{:,.0f}", post=" billion", color=GOLD, bottom="a rough estimate, 100 to 400", theme="space", word="hundred", dur=1.4)),
     N("Almost every star you see at night is in our own neighborhood of the galaxy, within about a few thousand light years of the Sun.", T.kinetic([("EVERY STAR YOU SEE", WHITE, 70), ("IS OUR NEIGHBOR", GOLD, 80)], "space")),
     N("And the observable universe has about two trillion galaxies, with an estimated total of over ten to the twenty two stars.", T.stat("the observable universe", "10²² STARS", "a 1 followed by 22 zeros, at least", PINK, "", 150, theme="space")),
     N("In a city, light pollution hides all but a few hundred of those stars. Many people have never seen the Milky Way, even though it's there every night.", T.num("stars visible in a bright city", 200, fmt="{:,.0f}", color=ORG, bottom="at most, on a clear night", theme="space", word="city", dur=1.0)),
     N("So find the darkest place you can, wait twenty minutes for your eyes to adjust, and look up. It's the best free show on Earth.", T.kinetic([("WAIT 20 MINUTES", WHITE, 80), ("THEN LOOK UP", GOLD, 100)], "space")),
    ]
    return R(351, "stars_you_can_see", "how many stars can you see", "you can see about 2,500 stars on a perfect night, out of at least 10 sextillion in the universe. send this to someone who needs to look up",
             "Naked-eye limit magnitude 6: about 4,500-9,000 stars over the whole sky (about 2,500 visible at once in perfect dark conditions); Milky Way 100-400 billion stars; observable universe about 2 trillion galaxies and an estimated 1e22-1e24 stars. Dark adaptation takes about 20-30 minutes.", "cine", n)

def left_handed():
    n = [
     N("About one in ten people is left handed. That's around eight hundred million people. And for most of history, they were treated very badly.", T.kinetic([("1 IN 10", GOLD, 150), ("IS LEFT-HANDED", WHITE, 80)], "ink")),
     N("A large review of studies published in twenty twenty found that about ten point six percent of people are left handed.", T.ring("of people are left-handed", .106, "a 2020 review of 2 million people", CY, theme="ink", word="ten")),
     N("With eight point two billion people, that works out to roughly eight hundred seventy million lefties. More than the population of Europe.", T.num("left-handed people", 870, fmt="{:,.0f}", post=" million", color=GOLD, bottom="more than all of Europe", theme="ink", word="eight", dur=1.2)),
     N("It's more common in men than in women, about twelve and a half percent, compared with nine and a half in women. Scientists still don't fully know why.", T.vs(("women", 9.5, PINK), ("men", 12.6, CY), unit="%", fmt="{:.1f}", theme="ink", word="men")),
     N("The word sinister comes from Latin for left. In many languages, the word for right also means correct. Lefties were often seen as unlucky, or even evil.", T.kinetic([("SINISTER", GOLD, 120), ("= LEFT, IN LATIN", WHITE, 70)], "ink")),
     N("In the past, many left handed children in schools were forced to write with their right hand. That is now widely recognized as harmful and wrong.", T.kinetic([("FORCED TO", WHITE, 90), ("SWITCH HANDS", PINK, 100)], "ink")),
     N("Today, left handers do just fine. A few things, like scissors and desks, were designed for right handers, but it's one of the most normal variations in human biology.", T.kinetic([("NORMAL.", WHITE, 100), ("FASCINATING.", GOLD, 100)], "ink")),
    ]
    return R(352, "left_handed_one_in_ten", "1 in 10 people is left handed", "about 10.6% of people are left handed, around 870 million worldwide. send this to your left handed friend",
             "Papadatou-Pastou et al., Psychological Bulletin 2020 meta-analysis (2.3 million people): 10.6% left-handed overall (men 12.6%, women 9.5%). 8.2e9 x 0.106 = about 870 million. Latin sinister = left.", "lofi", n)

def plastic():
    n = [
     N("Every single minute, a garbage truck's worth of plastic ends up in the ocean. And it's been happening for decades. Here are the numbers.", T.kinetic([("A GARBAGE TRUCK", WHITE, 90), ("OF PLASTIC", GOLD, 100), ("EVERY MINUTE", WHITE, 90)], "blue")),
     N("A study in twenty fifteen estimated that between five and thirteen million tonnes of plastic enter the ocean each year. The middle estimate is eight million tonnes.", T.num("plastic into the ocean each year", 8, fmt="{:.0f}", post=" million tonnes", color=PINK, bottom="a 2015 estimate, 5 to 13", theme="blue", word="eight", dur=1.2)),
     N("There are about five hundred twenty five thousand six hundred minutes in a year. Divide eight million tonnes by that, and you get about fifteen tonnes a minute.", T.formula(["8,000,000 tonnes", "÷ 525,600 minutes", "≈ 15 tonnes / minute"], theme="blue", title="the math")),
     N("A garbage truck carries about fifteen tonnes. So the world dumps a truckload of plastic into the sea every minute.", T.num("one garbage truck every", 1, fmt="{:.0f}", post=" minute", color=GOLD, bottom="about 15 tonnes of plastic", theme="blue", word="truck", dur=0.8)),
     N("Most of that doesn't disappear. Plastic breaks into tiny pieces called microplastics, and these have been found in the deepest ocean trench and in Arctic ice.", T.stat("microplastics found in", "THE DEEPEST TRENCH", "and in Arctic ice", CY, "", 90, theme="blue")),
     N("They've also been found inside fish, birds, and in human blood and placentas. We now eat and drink a little plastic every week.", T.num("plastic ingested per week, by one estimate", 5, fmt="{:.0f}", post=" grams", color=ORG, bottom="about a credit card, a debated figure", theme="blue", word="plastic", dur=1.0)),
     N("The good news is that most of the plastic comes from just a few rivers and from places with poor waste collection. Better recycling, and fewer single use items, make a real difference.", T.kinetic([("FEWER", WHITE, 100), ("SINGLE-USE ITEMS", GOLD, 70)], "blue")),
    ]
    return R(353, "plastic_garbage_truck_minute", "a garbage truck of plastic every minute", "about 8 million tonnes of plastic enter the ocean each year, a garbage truck every minute. send this to someone who still uses plastic bags",
             "Jambeck et al., Science 2015: 4.8-12.7 (mid 8) million tonnes of plastic waste entered the ocean in 2010. 8e6 t / 525,600 min = 15.2 t/min, about one garbage truck. Microplastics detected in the Mariana Trench and Arctic sea ice; weekly intake of about 5 g is a widely quoted but contested estimate.", "cine", n)

def temperatures():
    n = [
     N("The hottest temperature ever recorded on Earth and the coldest are separated by nearly a hundred fifty degrees. And both are in places you might not expect.", T.kinetic([("HOTTEST", ORG, 120), ("vs", WHITE, 70), ("COLDEST", CY, 120)], "ink")),
     N("The official world record is fifty six point seven degrees Celsius, from Death Valley, California, in nineteen thirteen. Many experts now doubt it.", T.num("Death Valley, 1913", 56.7, fmt="{:.1f}", post="°C", color=ORG, bottom="the official record, disputed", theme="ink", word="fifty", dur=1.2)),
     N("Modern, trusted measurements at the same place reached fifty four point four, in August twenty twenty and July twenty twenty one.", T.num("Death Valley, 2020 and 2021", 54.4, fmt="{:.1f}", post="°C", color=PINK, bottom="130 °F, trusted modern readings", theme="ink", word="fifty", dur=1.2)),
     N("The coldest was minus eighty nine point two degrees Celsius, at Vostok Station in Antarctica, on July twenty first, nineteen eighty three.", T.num("Vostok Station, Antarctica", -89.2, fmt="{:.1f}", post="°C", color=CY, bottom="July 21, 1983", theme="ink", word="minus", dur=1.4)),
     N("The gap between the two records is about a hundred forty six degrees Celsius. That's more than the difference between freezing and boiling water.", T.vs(("coldest", 89.2, CY), ("hottest", 56.7, ORG), unit=" degrees", fmt="{:.1f}", note="a 146° gap", theme="ink", word="gap")),
     N("The human body can't survive either extreme for long. In heat above about thirty five degrees with high humidity, sweat can't cool you, even in the shade.", T.num("wet-bulb limit for humans", 35, fmt="{:.0f}", post="°C", color=GOLD, bottom="the point where sweat stops working", theme="ink", word="thirty", dur=1.0)),
     N("The Earth has places that are harsher than anything in your life. And all of it sits on one planet, in a thin layer we call the habitable zone.", T.kinetic([("ONE PLANET", WHITE, 100), ("146° OF RANGE", GOLD, 100)], "ink")),
    ]
    return R(354, "hottest_vs_coldest_on_earth", "the hottest and coldest places on Earth", "the hottest temperature ever recorded was 56.7 C and the coldest -89.2 C. a 146 degree gap on one planet. send this to someone who says it's too cold",
             "WMO: highest air temperature 56.7 C, Furnace Creek, Death Valley, 10 July 1913 (disputed; 54.4 C recorded 16 Aug 2020 and 9 Jul 2021 are accepted); lowest 89.2 C at Vostok Station, 21 July 1983. Gap 145.9 C. A wet-bulb temperature of 35 C is the theoretical human survivability limit.", "lofi", n)

def spf():
    n = [
     N("SPF one hundred is not twice as good as SPF fifty. The sunscreen numbers on the bottle hide a surprising truth. Let's do the math.", T.kinetic([("SPF 100", WHITE, 110), ("≠ 2× SPF 50", GOLD, 100)], "warm")),
     N("SPF stands for sun protection factor. It tells you how much longer your skin takes to burn, compared with wearing nothing.", T.stat("SPF", "SUN PROTECTION FACTOR", "how much longer before you burn", CY, "", 76, theme="warm")),
     N("But what matters is how much UVB radiation gets through. The formula is one divided by the SPF. That's the fraction of UVB that still reaches your skin.", T.formula(["UVB let through = 1 ÷ SPF"], theme="warm", title="the rule")),
     N("SPF fifteen lets through one fifteenth, so it blocks about ninety three percent. SPF thirty blocks about ninety seven percent.", T.bars("UVB blocked, %", [("SPF 15", 93.3), ("SPF 30", 96.7)], fmt="{:.1f}", unit="%", cols=[CY, GOLD], theme="warm", words=["fifteen", "thirty"])),
     N("SPF fifty blocks ninety eight percent. And SPF one hundred blocks ninety nine percent. That's only one percent more than SPF fifty, for double the number.", T.bars("UVB blocked, %", [("SPF 50", 98.0), ("SPF 100", 99.0)], fmt="{:.1f}", unit="%", cols=[GRN, PINK], theme="warm", words=["fifty", "hundred"])),
     N("So going from thirty to fifty helps a little. Going from fifty to one hundred barely helps. The real difference is how much you apply, and how often.", T.kinetic([("HOW MUCH", WHITE, 100), ("MATTERS MORE", GOLD, 100)], "warm")),
     N("Most people apply only a quarter to half of the recommended amount, which cuts the real protection a lot. Use about a teaspoon for your face and neck, and reapply every two hours.", T.num("reapply every", 2, fmt="{:.0f}", post=" hours", color=GOLD, bottom="and use a full teaspoon for your face", theme="warm", word="two", dur=0.8)),
    ]
    return R(355, "spf_math_100_vs_50", "SPF 100 vs SPF 50", "SPF 50 blocks 98% of UVB and SPF 100 blocks 99%. how much you apply matters more than the number. send this to someone going to the beach",
             "Fraction of UVB transmitted = 1/SPF: SPF 15 blocks 93.3%, SPF 30 96.7%, SPF 50 98.0%, SPF 100 99.0%. People typically apply 25-50% of the tested 2 mg/cm2 amount. Check with a dermatologist for personal advice.", "funk", n)

REELS = dict(birthday_twins_22_million=birthday_twins, trees_per_person=trees, dog_years_formula=dog_years, krakatoa_loudest_sound=krakatoa, stars_you_can_see=stars, left_handed_one_in_ten=left_handed, plastic_garbage_truck_minute=plastic, hottest_vs_coldest_on_earth=temperatures, spf_math_100_vs_50=spf)
