"""Batch 40: education reels, maths and physics you can check. Every number is computed or well sourced (see each story)."""
import math
from edu import *
import functools
R = functools.partial(R, chip="SCIENCE")

def pb(n):
    q = 1.0
    for k in range(n): q *= 1 - k / 365
    return 1 - q

def birthday():
    assert abs(pb(23) - .5073) < .001 and pb(70) > .999
    n = [
     N("How many people do you need in a room before two of them probably share a birthday? Not a hundred. Not even close.", T.kinetic([("HOW MANY PEOPLE", WHITE, 84), ("SHARE A BIRTHDAY?", GOLD, 84)])),
     N("Your gut says one hundred eighty three, half of three hundred sixty five. The real answer is twenty three.", T.stat("The real answer", "23 PEOPLE", "for a 50% chance", GOLD, "not 183", 190)),
     N("The trick is that you're not comparing people to dates. You're comparing every person to every other person. Twenty three people make two hundred fifty three pairs.", T.formula(["23 people", "23 × 22 ÷ 2", "= 253 pairs"], title="count the pairs")),
     N("Each pair has a small chance to match, and two hundred fifty three small chances add up to fifty point seven percent.", T.ring("23 people", .5073, "chance of a shared birthday", GOLD, word="fifty")),
     N("At thirty people it's seventy one percent. At fifty people, ninety seven percent.", T.bars("chance of a match", [("30 people", 70.6), ("50 people", 97.0)], fmt="{:.0f}", unit="%", cols=[CY, GRN])),
     N("And with just seventy people in the room, it's ninety nine point nine percent. A match is basically guaranteed.", T.ring("70 people", .9992, "chance of a match", GRN, word="seventy")),
     N("Next time you're in a class or an office with thirty people, check. There's a good chance two of you share a birthday.", T.kinetic([("30 PEOPLE", WHITE, 100), ("71% CHANCE", GOLD, 100), ("go check", CY, 64)])),
    ]
    return R(215, "birthday_paradox", "23 people is enough for a shared birthday", "in a room of 23 people there's a 50.7% chance two share a birthday. with 70 it's 99.9%. send this to someone in a big group chat",
             "P(no match among n) = product of (1 - k/365); n=23 gives 0.5073 match; 30 -> 70.6%; 50 -> 97.0%; 70 -> 99.92%. 23 people = 253 pairs.", "synth", n)

def rice():
    tot = 2 ** 64 - 1; kg = tot * 25e-6
    assert round(kg / 1e12) == 461   # kilograms -> billions of tonnes
    n = [
     N("A man asks a king for a reward. One grain of rice on the first square of a chessboard, then double it on every square after. The king laughs. He shouldn't.", T.kinetic([("1 GRAIN OF RICE", WHITE, 80), ("DOUBLED 64 TIMES", GOLD, 80)])),
     N("Square one, one grain. Square two, two. Square three, four. By square ten, five hundred twelve grains. Still a small handful.", T.steps("grains on each square", [("1", "square 1"), ("4", "square 3"), ("512", "square 10")], words=["one", "four", "five"])),
     N("By square twenty, over a million. By square thirty, over five hundred million grains. Now it's a lot.", T.steps("keep doubling", [("524,288", "square 20"), ("536,870,912", "square 30")], words=["twenty", "thirty"])),
     N("Square forty, over five hundred billion grains. Square fifty, over five hundred trillion.", T.steps("it speeds up", [("549 billion", "square 40"), ("562 trillion", "square 50")], words=["forty", "fifty"])),
     N("The final square alone holds nine quintillion grains. All sixty four squares together: eighteen point four quintillion.", T.num("all 64 squares", tot, fmt="{:,.0f}", bottom="grains of rice", sub="18.4 quintillion", word="eighteen", base=130)),
     N("That's about four hundred sixty billion tonnes of rice. The whole world grows around five hundred million tonnes a year, so this one chessboard is nine hundred years of global harvests.", T.num("that weighs", 461, fmt="{:,.0f}", bottom="billion tonnes", color=GRN, sub="about 900 years of world rice", word="four", dur=1.4)),
     N("This is exponential growth. It looks slow, then it explodes. The same math runs viruses, compound interest, and every viral video.", T.kinetic([("SLOW", CY, 100), ("SLOW", CY, 100), ("BOOM", GOLD, 140)])),
    ]
    return R(216, "chessboard_rice", "the chessboard rice problem", "one grain doubled 64 times is about 900 years of the world's rice. send this to someone who says 'it starts small'",
             "2^64 - 1 = 18,446,744,073,709,551,615 grains; at about 25 mg a grain = 461 billion tonnes. World rice production is roughly 520 million tonnes a year, so about 890 years.", "funk", n)

def sun_earths():
    ratio = (695700 / 6371) ** 3
    assert 1.30e6 < ratio < 1.31e6
    n = [
     N("How many Earths could you fit inside the Sun? A thousand? A hundred thousand? Prepare to be wrong.", T.kinetic([("HOW MANY EARTHS", WHITE, 84), ("FIT INSIDE THE SUN?", GOLD, 84)], "space")),
     N("The Sun is about one hundred nine times wider than Earth. If Earth were a marble, the Sun would be over a meter wide.", T.vs(("Earth", 1, CY), ("Sun", 109, GOLD), fmt="{:,.0f}", unit="×", note="width", word="hundred", theme="space")),
     N("But volume grows with the cube. A hundred and nine times wider means over a million times more space.", T.formula(["109 × 109 × 109", "≈ 1.3 million"], theme="space", title="width cubed")),
     N("You could pour one point three million Earths into the Sun, and that's if you pack them with no gaps.", T.num("fits inside the Sun", 1.3e6, fmt="{:,.0f}", bottom="Earths", color=GOLD, word="one", theme="space", dur=2.0)),
     N("Now Jupiter. Jupiter is the biggest planet, and you could fit thirteen hundred Earths inside it.", T.num("fits inside Jupiter", 1321, fmt="{:,.0f}", bottom="Earths", color=ORG, word="thirteen", theme="space")),
     N("And the Sun? It could hold nearly a thousand Jupiters. The Sun is ninety nine point eight six percent of all the mass in our solar system.", T.ring("mass of the solar system", .9986, "is just the Sun", GOLD, word="ninety", theme="space")),
     N("Everything else, every planet, moon, and asteroid, shares the last fraction of a percent. We live on a rounding error.", T.kinetic([("EVERYTHING ELSE", WHITE, 76), ("0.14%", GOLD, 160), ("we're a rounding error", CY, 52)], "space")),
    ]
    return R(217, "earths_in_sun", "how many Earths fit inside the Sun", "1.3 million Earths fit inside the Sun. the Sun is 99.86% of everything in our solar system. send this to someone who thinks they're the main character",
             "Volume ratio (695,700 km / 6,371 km)^3 = 1.30 million. Jupiter: (69,911/6,371)^3 = 1,321. Sun is 99.86% of the solar system's mass (NASA).", "cine", n)

def light_speed():
    n = [
     N("Light is the fastest thing in the universe. But how fast is that, really? Let's make it make sense.", T.kinetic([("HOW FAST", WHITE, 100), ("IS LIGHT?", GOLD, 120)], "space")),
     N("In one second, light travels almost three hundred thousand kilometers. That's seven and a half laps around the entire Earth. In one second.", T.num("laps around Earth", 7.5, fmt="{:.1f}", bottom="in a single second", color=GOLD, word="seven", theme="space", dur=1.4)),
     N("The Moon is far away, but sunlight bounces off it and reaches you in one point three seconds. Blink once and you've seen the Moon as it was a moment ago.", T.num("light from the Moon", 1.28, fmt="{:.2f}", post=" s", bottom="to reach you", color=CY, word="one", theme="space", dur=1.2)),
     N("The Sun is much farther. Its light takes eight minutes and twenty seconds. If the Sun vanished, you'd have eight minutes of daylight left.", T.num("light from the Sun", 8.33, fmt="{:.1f}", post=" min", bottom="eight minutes, twenty seconds", color=ORG, word="eight", theme="space", dur=1.6)),
     N("The farthest spacecraft, Voyager one, has been flying for almost fifty years. Light reaches it in about twenty three hours.", T.num("Voyager 1", 23, fmt="{:.0f}", post=" hours", bottom="of light travel from Earth", color=PINK, word="twenty", theme="space", dur=1.5)),
     N("And the nearest star beyond the Sun, Proxima Centauri? Four point two years, at the speed of light. Voyager, at seventeen kilometers a second, would need over seventy thousand years.", T.vs(("light", 4.2, GOLD), ("Voyager's speed", 73000, PINK), unit=" yrs", fmt="{:,.1f}", log=True, theme="space", word="four")),
     N("So when you look at the stars tonight, you're not seeing them now. You're looking into the past.", T.kinetic([("EVERY STAR", WHITE, 84), ("IS THE PAST", GOLD, 100)], "space")),
    ]
    return R(218, "speed_of_light", "how fast is the speed of light really", "light does 7.5 laps around the Earth every second. Voyager 1 is 23 light hours away. send this to someone who's always late",
             "c = 299,792 km/s; Earth circumference 40,075 km = 7.48 laps/s. Moon 1.28 s, Sun 8.32 min, Voyager 1 about 23 light hours (NASA), Proxima 4.24 ly; Voyager 1 at 17 km/s would need about 74,000 years (Parker Solar Probe, the fastest craft at 192 km/s, about 6,600).", "cine", n)

def thunder():
    n = [
     N("You see lightning. You count the seconds until thunder. Did you know that number tells you exactly how far away the storm is?", T.kinetic([("COUNT THE SECONDS", WHITE, 80), ("AFTER LIGHTNING", GOLD, 80)])),
     N("Light arrives almost instantly. Sound is slow, about three hundred forty three meters every second.", T.vs(("light", 299792458, GOLD), ("sound", 343, CY), unit=" m/s", fmt="{:,.0f}", log=True, word="sound")),
     N("So every three seconds you count means about one kilometer. Count nine seconds, and the lightning was about three kilometers away.", T.steps("seconds to distance", [("3 seconds", "1 km"), ("9 seconds", "3 km"), ("15 seconds", "5 km")], words=["three", "nine", "fifteen"])),
     N("If you use miles, it's five seconds per mile. Count ten seconds, and it's two miles away.", T.steps("or in miles", [("5 seconds", "1 mile"), ("10 seconds", "2 miles")], words=["five", "ten"])),
     N("Here's the safety rule. If you count thirty seconds or less, you're within the range where lightning can still strike you. Go inside.", T.num("30 seconds or less", 30, fmt="{:.0f}", post=" s", bottom="means get inside", color=PINK, word="thirty")),
     N("And wait thirty minutes after the last thunder before you go back out. Storms can still reach you after they seem to pass.", T.kinetic([("LAST THUNDER", WHITE, 80), ("WAIT 30 MIN", GOLD, 110)])),
    ]
    return R(219, "thunder_math", "count the seconds between lightning and thunder", "3 seconds between lightning and thunder = 1 km. send this to the friend who stays outside during storms",
             "Speed of sound about 343 m/s: 3 s = 1.03 km, 5 s = 1 mile. The US National Weather Service 30/30 rule: go indoors if flash-to-bang is 30 s or less; wait 30 minutes after the last thunder.", "trap", n)

def deck():
    f = math.factorial(52)
    assert 8.06e67 < f < 8.07e67
    n = [
     N("Every time you properly shuffle a deck of cards, you create an order that has never existed before in history. That sounds fake. The math says it's true.", T.kinetic([("EVERY SHUFFLE", WHITE, 90), ("IS UNIQUE", GOLD, 110)])),
     N("A deck has fifty two cards. The first card can be any of fifty two. The next, any of fifty one. Then fifty, then forty nine, all the way down.", T.formula(["52 × 51 × 50 × ...", "× 3 × 2 × 1"], title="orders of 52 cards")),
     N("Multiply them all and you get about eight followed by sixty seven zeros.", T.num("possible orders", 8.07, fmt="{:.2f}", post=" × 10⁶⁷", color=GOLD, bottom="an 8 followed by 67 zeros", word="eight", base=150, dur=2.0)),
     N("The entire Earth has about one point three times ten to the fiftieth atoms. That sounds huge, but a deck of cards has about six hundred quadrillion times more orders than the Earth has atoms.", T.steps("compare", [("1.3 × 10⁵⁰", "atoms in the whole Earth"), ("8.1 × 10⁶⁷", "ways to order a deck")], words=["entire", "deck"], size=76)),
     N("If every person alive shuffled a deck every second since the universe began, they would barely have scratched it.", T.stat("8 billion people", "1 shuffle / second", "for 13.8 billion years", CY, "not even a dent", 120)),
     N("So the next time you shuffle, remember. That exact order has almost certainly never happened before, and never will again.", T.kinetic([("NEVER BEFORE", WHITE, 90), ("NEVER AGAIN", GOLD, 110)])),
    ]
    return R(220, "deck_of_cards", "every card shuffle is unique", "a shuffled deck is in an order that has never existed before. 52! = 8 x 10^67. send this to the card shark in your group",
             "52! = 80,658,175,170,943,878,571,660,636,856,403,766,975,289,505,440,883,277,824,000,000,000,000 = 8.07e67. Earth has about 1.3e50 atoms. 8e9 people x 4.4e17 s = 3.5e27 shuffles = 4e-41 of 52!.", "jazz", n)

def rule72():
    n = [
     N("There's a trick that tells you how fast your money doubles. No calculator. It's called the rule of seventy two.", T.kinetic([("THE RULE", WHITE, 100), ("OF 72", GOLD, 150)])),
     N("Take seventy two, and divide it by your interest rate. The answer is the number of years until your money doubles.", T.formula(["72 ÷ interest rate", "= years to double"], title="the trick")),
     N("At seven percent, seventy two divided by seven is about ten years. A thousand dollars becomes two thousand.", T.steps("at 7%", [("72 ÷ 7", "≈ 10 years"), ("$1,000", "→ $2,000")], words=["seven", "thousand"])),
     N("At ten percent, it doubles in seven point two years. At two percent, a savings account, it takes thirty six years.", T.bars("years to double", [("10% return", 7.2), ("7% return", 10.3), ("2% savings", 36)], fmt="{:.1f}", unit=" yrs", cols=[GRN, GOLD, PINK], words=["ten", "seven", "two"])),
     N("Here's the power. Invest at seven percent for forty years, and your money doubles four times. One thousand becomes fourteen thousand.", T.steps("7% for 40 years", [("$1,000", "start"), ("$2,000 → $4,000", "20 years"), ("$14,974", "40 years")], words=["one", "four", "fourteen"])),
     N("The same rule works for debt, too. A credit card at twenty four percent doubles what you owe in just three years.", T.num("24% credit card", 3, fmt="{:.0f}", post=" years", bottom="to double your debt", color=PINK, word="three", dur=1.0)),
     N("So the rate you choose, in either direction, matters more than almost anything else you do with money.", T.kinetic([("72 ÷ RATE", GOLD, 120), ("= YOUR FUTURE", WHITE, 80)])),
    ]
    assert round(1000 * 1.07 ** 40) == 14974
    return R(221, "rule_of_72", "the rule of 72", "divide 72 by your interest rate to see how many years until your money doubles. send this to someone who doesn't save",
             "Rule of 72: years to double = 72 / rate (%). 7% -> 10.3 y; 10% -> 7.2 y; 2% -> 36 y; 24% -> 3 y. $1,000 at 7% for 40 years = $14,974.", "funk", n)

def gps():
    n = [
     N("Your phone's GPS is correct because of Einstein. Without his theory, it would be wrong by ten kilometers every single day.", T.kinetic([("GPS WORKS", WHITE, 100), ("BECAUSE OF EINSTEIN", GOLD, 76)], "space")),
     N("GPS satellites orbit about twenty thousand kilometers up, moving at fourteen thousand kilometers an hour.", T.num("satellite speed", 14000, fmt="{:,.0f}", post=" km/h", bottom="20,000 km above Earth", color=CY, word="fourteen", theme="space", dur=1.4)),
     N("Einstein said moving clocks run slow. Because the satellites move fast, their clocks lose seven microseconds every day.", T.num("clock loses", 7, fmt="{:.0f}", post=" μs / day", bottom="from their speed", color=PINK, word="seven", theme="space", dur=1.0)),
     N("But gravity is weaker up there, and weaker gravity makes clocks run fast. That adds forty five microseconds a day.", T.num("clock gains", 45, fmt="{:.0f}", post=" μs / day", bottom="from weaker gravity", color=GRN, word="forty", theme="space", dur=1.2)),
     N("Net result, the satellite clocks run thirty eight microseconds fast every day. That sounds tiny.", T.num("net error", 38, fmt="{:.0f}", post=" μs / day", bottom="fast, every day", color=GOLD, word="thirty", theme="space", dur=1.2)),
     N("But GPS works by timing signals that move at the speed of light. Thirty eight microseconds equals about eleven kilometers of error, and it grows every day.", T.num("position error", 11, fmt="{:.0f}", post=" km", bottom="per day, uncorrected", color=PINK, word="eleven", theme="space", dur=1.2)),
     N("So engineers build the correction right into the satellites. Every time your map says turn left, you're using relativity.", T.kinetic([("EVERY TURN LEFT", WHITE, 76), ("= RELATIVITY", GOLD, 110)], "space")),
    ]
    return R(222, "gps_einstein", "GPS works because of Einstein", "GPS would be off by 10 km a day without Einstein's relativity. send this to someone who gets lost with Google Maps",
             "Satellite orbit radius 26,600 km, speed 3.87 km/s (14,000 km/h). Special relativity -7 us/day, general relativity +45 us/day, net +38 us/day = c x 38 us = 11.4 km/day of ranging error.", "cine", n)

def pi_digits():
    n = [
     N("Pi has infinite digits. So how many do you actually need? The answer will make you feel better about forgetting them.", T.kinetic([("HOW MANY DIGITS", WHITE, 76), ("OF PI DO YOU NEED?", GOLD, 76)])),
     N("With just ten digits of pi, you can calculate the circumference of the entire Earth to within about a centimeter.", T.num("digits of pi", 10, fmt="{:.0f}", bottom="Earth, to within a centimeter", color=CY, word="ten", dur=1.0)),
     N("NASA's most precise calculations for sending spacecraft across the solar system use just fifteen digits after the decimal point.", T.num("NASA uses", 15, fmt="{:.0f}", bottom="digits of pi", color=GOLD, sub="3.141592653589793", word="fifteen", dur=1.0)),
     N("What about the whole universe? To measure the entire observable universe to the width of a single hydrogen atom, you need only thirty nine digits.", T.num("the whole universe", 39, fmt="{:.0f}", bottom="digits, to one atom's width", color=PINK, word="thirty", dur=1.2)),
     N("Yet computers have calculated pi to over a hundred trillion digits, just to prove they can.", T.num("record digits", 100, fmt="{:,.0f}", post=" trillion", bottom="and counting", color=GRN, word="hundred", dur=1.4)),
     N("So memorizing seventy thousand digits, like the record holder, is a talent. But the universe itself only asks for thirty nine.", T.kinetic([("39 DIGITS", GOLD, 130), ("is the whole universe", WHITE, 56)])),
    ]
    return R(223, "pi_digits", "how many digits of pi do you need", "NASA uses 15 digits of pi. the whole universe needs 39. send this to your math teacher",
             "NASA JPL: 15 digits suffice for interplanetary navigation; 39 digits of pi give the circumference of a circle the size of the observable universe (about 93 billion light years) to within the width of a hydrogen atom. Record: over 100 trillion digits (2022).", "synth", n)

def banana():
    n = [
     N("Bananas are radioactive. That is not a myth. And the math behind it is a great way to understand radiation.", T.kinetic([("BANANAS ARE", WHITE, 90), ("RADIOACTIVE", GOLD, 120)], "green")),
     N("Bananas are full of potassium, and a tiny part of all potassium is a radioactive form called potassium forty.", T.stat("one banana", "~15 decays", "every second", GRN, "from potassium-40", 160), ),
     N("The dose from eating one banana is about point one microsieverts. Scientists even use it as a unit. It's called the banana equivalent dose.", T.num("one banana", .1, fmt="{:.1f}", post=" μSv", bottom="the banana equivalent dose", color=GOLD, word="point", theme="green", dur=1.0)),
     N("A dental x-ray is about fifty bananas. A chest x-ray is about a thousand bananas.", T.bars("in bananas", [("dental x-ray", 50), ("chest x-ray", 1000)], fmt="{:,.0f}", cols=[CY, PINK], theme="green", words=["dental", "chest"])),
     N("You'd get more from a long flight, around four hundred bananas. And a chest CT scan is about seventy thousand.", T.bars("in bananas", [("cross-country flight", 400), ("CT scan", 70000)], fmt="{:,.0f}", cols=[ORG, PINK], theme="green", words=["flight", "CT"])),
     N("To get a lethal dose, you'd have to eat about forty million bananas in one sitting. The potassium would get you long before the radiation.", T.num("bananas for a lethal dose", 40, fmt="{:,.0f}", post=" million", bottom="in one sitting", color=PINK, word="forty", theme="green", dur=1.2)),
     N("So don't worry about the banana. Radiation is everywhere. What matters is the dose.", T.kinetic([("DOSE", GOLD, 150), ("makes the poison", WHITE, 64)], "green")),
    ]
    return R(224, "banana_radiation", "bananas are radioactive", "a chest x-ray is 1,000 bananas of radiation. a lethal dose is 40 million bananas. send this to the person who's scared of microwaves",
             "Banana equivalent dose about 0.1 uSv (1 banana). Dental x-ray ~0.005 mSv = 50 BED; chest x-ray ~0.1 mSv = 1,000 BED; cross-country flight ~0.04 mSv = 400 BED; chest CT ~7 mSv = 70,000 BED. A lethal acute dose of ~4 Sv is about 4e7 bananas.", "bounce", n)

REELS = dict(birthday_paradox=birthday, chessboard_rice=rice, earths_in_sun=sun_earths, speed_of_light=light_speed, thunder_math=thunder, deck_of_cards=deck, rule_of_72=rule72, gps_einstein=gps, pi_digits=pi_digits, banana_radiation=banana)
