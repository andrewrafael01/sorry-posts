"""Batch 50: education reels, "how far is it, really" and what-if questions."""
import math
from edu import *
import functools
R = functools.partial(R, chip="WHAT IF")

def drive_space():
    n = [
     N("Space is closer than you think. If you could drive a car straight up at a hundred kilometers an hour, you'd reach space in one hour. Less than a movie.", T.kinetic([("DRIVE TO SPACE", WHITE, 100), ("AT 100 KM/H", GOLD, 100)], "space")),
     N("Space officially begins at the Karman line, one hundred kilometers above the ground. That's about as far as driving across a county.", T.num("the edge of space", 100, fmt="{:.0f}", post=" km up", color=CY, bottom="1 hour by car", theme="space", word="hundred", dur=1.0)),
     N("The International Space Station orbits at about four hundred kilometers. That's a four hour drive, like going from New York to Washington.", T.num("to the Space Station", 4, fmt="{:.0f}", post=" hours", color=GOLD, bottom="408 km at 100 km/h", theme="space", word="four", dur=0.9)),
     N("But the satellites that carry your TV and weather signals sit much higher, at thirty six thousand kilometers. That's a fifteen day drive.", T.num("to a TV satellite", 15, fmt="{:.0f}", post=" days", color=ORG, bottom="35,786 km, non stop", theme="space", word="thirty", dur=1.0)),
     N("The Moon, three hundred eighty four thousand kilometers away, would take one hundred sixty days. Over five months of nonstop driving.", T.num("to the Moon", 160, fmt="{:.0f}", post=" days", color=PINK, bottom="384,400 km, non stop", theme="space", word="Moon", dur=1.2)),
     N("And the Sun, a hundred fifty million kilometers away? One hundred seventy years. You'd have to start before your great grandparents were born.", T.num("to the Sun", 171, fmt="{:.0f}", post=" years", color=ORG, bottom="150 million km, non stop", theme="space", word="Sun", dur=1.4)),
     N("So getting to space is mostly about speed, not distance. A rocket needs to go about twenty eight thousand kilometers an hour, to stay up there.", T.steps("by car, at 100 km/h", [("space", "1 hour"), ("the Moon", "160 days"), ("the Sun", "171 years")], theme="space", words=["space", "Moon", "Sun"])),
    ]
    return R(317, "drive_to_space_moon_sun", "how long to drive to space, the Moon and the Sun", "driving straight up at 100 km/h you'd reach space in 1 hour, the Moon in 160 days, the Sun in 171 years. send this to someone who hates road trips",
             "At 100 km/h: Karman line 100 km = 1 h; ISS 408 km = 4.1 h; geostationary 35,786 km = 14.9 days; Moon 384,400 km = 160 days; Sun 149.6 million km = 170.7 years.", "synth", n)

def walk_world():
    n = [
     N("How long would it take to walk around the entire Earth, if you could walk straight across the oceans? And how long did the first person who really did it take?", T.kinetic([("WALK AROUND", WHITE, 100), ("THE EARTH", GOLD, 130)], "green")),
     N("The Earth's circumference at the equator is forty thousand seventy five kilometers.", T.num("around the Earth", 40075, fmt="{:,.0f}", post=" km", color=CY, bottom="at the equator", theme="green", word="forty", dur=1.4)),
     N("A comfortable walking speed is about five kilometers an hour. That's eight thousand fifteen hours of nonstop walking.", T.num("non stop walking", 8015, fmt="{:,.0f}", post=" hours", color=GOLD, bottom="at 5 km/h", theme="green", word="eight", dur=1.4)),
     N("That's three hundred thirty four days with no sleep, no food, and no rest. A full year, minus a month.", T.num("without stopping", 334, fmt="{:.0f}", post=" days", color=PINK, bottom="almost a year", theme="green", word="three", dur=1.2)),
     N("In reality, you'd walk perhaps eight hours a day. At that pace, it takes about one thousand days. Nearly three years.", T.num("walking 8 hours a day", 2.7, fmt="{:.1f}", post=" years", color=ORG, bottom="about 1,000 days", theme="green", word="eight", dur=1.2)),
     N("The first person to be officially recorded walking around the world was Dave Kunst, an American, who walked from nineteen seventy to nineteen seventy four. It took four years and three months.", T.num("Dave Kunst's walk", 4.3, fmt="{:.1f}", post=" years", color=GRN, bottom="1970 to 1974, 23,000 km", theme="green", word="four", dur=1.2)),
     N("He wore out twenty one pairs of shoes, and his brother was killed on the way. The world is big enough to take years, even at a gentle pace.", T.num("pairs of shoes worn out", 21, fmt="{:.0f}", color=VIO, bottom="and a lot of courage", theme="green", word="twenty", dur=0.9)),
    ]
    return R(318, "walk_around_the_earth", "how long to walk around the Earth", "walking around the Earth non stop at 5 km/h takes 334 days, and the first person to really do it took 4 years. send this to someone who wants to travel",
             "Equator 40,075 km / 5 km/h = 8,015 h = 334 days; at 8 h/day = 1,002 days = 2.7 years. Dave Kunst walked about 23,250 km from 1970 to 1974 (4 years 3 months), wearing out 21 pairs of shoes; his brother John was killed in Afghanistan.", "bounce", n)

def earth_stops():
    n = [
     N("What if the Earth suddenly stopped spinning? Everything not nailed down would be launched at over a thousand kilometers an hour. Here's the physics.", T.kinetic([("EARTH STOPS", WHITE, 100), ("SPINNING", GOLD, 130)], "space")),
     N("Right now, the ground at the equator moves east at about sixteen hundred seventy kilometers an hour, as the Earth turns. You don't feel it because everything moves together.", T.num("the equator's speed", 1670, fmt="{:,.0f}", post=" km/h", color=CY, bottom="as the Earth rotates", theme="space", word="sixteen", dur=1.4)),
     N("It's less as you move toward the poles. At the latitude of New York, it's about twelve hundred sixty kilometers an hour.", T.num("speed in New York", 1266, fmt="{:,.0f}", post=" km/h", color=GOLD, bottom="faster than a jet", theme="space", word="New", dur=1.4)),
     N("If the ground stopped instantly, you and everything on it would keep moving at that speed. That's faster than the speed of sound.", T.kinetic([("YOU KEEP MOVING", WHITE, 80), ("FASTER THAN SOUND", PINK, 90)], "space")),
     N("The oceans and the atmosphere would also keep going, sweeping across the land in a huge wave, with winds of over a thousand kilometers an hour.", T.kinetic([("OCEANS + AIR", WHITE, 90), ("KEEP GOING", GOLD, 120)], "space")),
     N("After the chaos, the days would be strange. One day would last a whole year, because the Sun would only appear to move as the Earth orbits it.", T.num("one day would last", 365, fmt="{:.0f}", post=" days", color=ORG, bottom="six months of light, six of dark", theme="space", word="year", dur=1.2)),
     N("This can't actually happen. Nothing is strong enough to stop the Earth so suddenly. But Earth is slowing down very, very gradually, about two milliseconds per century.", T.num("Earth's spin slows by", 1.8, fmt="{:.1f}", post=" ms / century", color=GRN, bottom="thanks to the Moon's tides", theme="space", word="two", dur=1.0)),
    ]
    return R(319, "earth_stops_spinning", "what if the Earth stopped spinning", "if Earth suddenly stopped, everything on the surface would keep moving at over 1,000 km/h. send this to someone who asks 'what if' at 3 am",
             "Equatorial rotation speed 1,670 km/h (465 m/s); at 40.7 N (New York) 1,266 km/h. A stopped Earth would have a solar day equal to a year (365.25 days) rather than 24 hours. Tidal friction lengthens the day by about 1.8 ms per century.", "cine", n)

def mars_delay():
    n = [
     N("When NASA's engineers talk to the rover on Mars, they can't have a conversation. Every message takes minutes to arrive. Here's why, and what it means.", T.kinetic([("TALKING TO", WHITE, 90), ("MARS", GOLD, 150)], "space")),
     N("Radio signals travel at the speed of light, nearly three hundred thousand kilometers a second. Very fast, but space is very big.", T.num("speed of a radio signal", 299792, fmt="{:,.0f}", post=" km/s", color=CY, bottom="the speed of light", theme="space", word="three", dur=1.4)),
     N("When Earth and Mars are as close as they ever get, about fifty five million kilometers, a signal takes just over three minutes.", T.num("closest approach", 3.1, fmt="{:.1f}", post=" minutes", color=GRN, bottom="55 million km apart", theme="space", word="fifty", dur=1.0)),
     N("When they're on opposite sides of the Sun, four hundred million kilometers apart, a signal takes twenty two minutes, one way.", T.num("farthest apart", 22, fmt="{:.0f}", post=" minutes", color=PINK, bottom="400 million km, one way", theme="space", word="four", dur=1.0)),
     N("So a question and an answer can take up to forty four minutes. Imagine asking a friend something and waiting almost an hour for the reply.", T.num("round trip, worst case", 44, fmt="{:.0f}", post=" minutes", color=ORG, bottom="question and answer", theme="space", word="forty", dur=1.0)),
     N("That's why rovers can't be steered like a toy car. They make small decisions on their own, and drive carefully a few meters at a time, after engineers send plans ahead.", T.kinetic([("THE ROVER", WHITE, 90), ("THINKS FOR ITSELF", GOLD, 80)], "space")),
     N("And a trip there takes about seven months. For future astronauts on Mars, mom's call would always arrive with a delay of minutes. Space is far.", T.num("travel time to Mars", 7, fmt="{:.0f}", post=" months", color=GOLD, bottom="with today's rockets", theme="space", word="seven", dur=0.9)),
    ]
    return R(320, "mars_signal_delay", "why you can't chat with Mars", "a message to Mars takes 3 to 22 minutes one way, so there are no live chats with the rover. send this to someone who takes too long to reply",
             "Earth-Mars distance ranges about 55 million km to about 400 million km; light time about 3 to 22 minutes one way. Typical transit to Mars about 7 months (Hohmann transfer, about 260 days).", "synth", n)

def baumgartner():
    n = [
     N("In two thousand twelve, a man jumped from the edge of space and broke the speed of sound with just his body. No engine. No rocket. Just gravity.", T.kinetic([("JUMPING FROM", WHITE, 90), ("THE EDGE OF SPACE", GOLD, 90)], "space")),
     N("Felix Baumgartner rode a helium balloon up to thirty nine kilometers, more than three times higher than a passenger jet flies.", T.num("jump altitude", 39, fmt="{:.0f}", post=" km", color=CY, bottom="over 3× a jet's cruising height", theme="space", word="thirty", dur=1.0)),
     N("Up there, the air is so thin that there's almost nothing to slow you down. So when he jumped, he accelerated for almost the whole fall.", T.kinetic([("THIN AIR", WHITE, 100), ("NO BRAKES", GOLD, 120)], "space")),
     N("Within about fifty seconds, he reached one thousand three hundred fifty seven kilometers an hour. That's Mach one point two five. Faster than the speed of sound.", T.num("top speed", 1357, fmt="{:,.0f}", post=" km/h", color=GOLD, bottom="Mach 1.25", theme="space", word="thirteen", dur=1.4)),
     N("He fell for four minutes and nineteen seconds before opening his parachute. The whole descent took about ten minutes.", T.num("free fall time", 259, fmt="{:.0f}", post=" seconds", color=PINK, bottom="4 minutes 19 seconds", theme="space", word="four", dur=1.2)),
     N("In nineteen sixty, a US Air Force captain named Joseph Kittinger jumped from almost thirty two kilometers. His record stood for fifty two years.", T.num("Kittinger's record jump", 1960, fmt="{:.0f}", color=ORG, bottom="31.3 km, record for 52 years", theme="space", word="nineteen", dur=1.2)),
     N("Baumgartner became the first human to break the sound barrier outside of a vehicle. The suit and the training that kept him alive took years to build.", T.kinetic([("FIRST HUMAN", WHITE, 90), ("TO GO SUPERSONIC", GOLD, 80), ("WITHOUT AN ENGINE", WHITE, 56)], "space")),
    ]
    return R(321, "felix_baumgartner_supersonic", "the man who broke the sound barrier falling", "Felix Baumgartner jumped from 39 km up and fell at 1,357 km/h, faster than the speed of sound. send this to your most daring friend",
             "Red Bull Stratos, 14 October 2012: exit altitude 39,045 m, maximum speed 1,357.6 km/h (Mach 1.25), free fall 4 min 19 s. Kittinger's 1960 jump from 31.3 km stood as the high-altitude record.", "cine", n)

def penny_myth():
    n = [
     N("Can a penny dropped from the top of the Empire State Building kill someone below? You've probably heard it can. It's a myth, and physics explains why.", T.kinetic([("A PENNY FROM", WHITE, 90), ("THE EMPIRE STATE", WHITE, 90), ("BUILDING?", GOLD, 120)], "ink")),
     N("The building is about three hundred eighty one meters tall to the roof. In a vacuum, a falling object would reach about three hundred ten kilometers an hour.", T.num("speed in a vacuum", 310, fmt="{:,.0f}", post=" km/h", color=PINK, bottom="after 381 meters of falling", theme="ink", word="three", dur=1.2)),
     N("But the air pushes back. A penny is light and flat, and it tumbles as it falls. Air resistance quickly balances its weight, and it stops speeding up.", T.kinetic([("AIR PUSHES BACK", WHITE, 80), ("PENNY TUMBLES", GOLD, 90)], "ink")),
     N("That maximum speed is called terminal velocity. For a falling penny, it's about thirty to fifty miles an hour.", T.num("a penny's terminal speed", 40, fmt="{:.0f}", post=" mph", color=CY, bottom="30 to 50 miles per hour", theme="ink", word="thirty", dur=1.0)),
     N("A penny weighs two and a half grams. At that speed, it stings. It might leave a mark. But it can't hurt you seriously.", T.num("weight of a penny", 2.5, fmt="{:.1f}", post=" grams", color=GOLD, bottom="a stinging tap at most", theme="ink", word="two", dur=0.8)),
     N("Compare that to a bullet, which travels at over a thousand kilometers an hour and weighs several grams, shaped to cut through the air.", T.vs(("falling penny", 65, CY), ("bullet", 1000, PINK), unit=" km/h", fmt="{:,.0f}", theme="ink", word="bullet")),
     N("The real danger from the sky is something heavier and more streamlined, like a tool or a brick. A penny is safe. Physics saved you again.", T.kinetic([("MYTH", PINK, 140), ("BUSTED", WHITE, 120)], "ink")),
    ]
    return R(322, "penny_empire_state_myth", "can a penny from the Empire State Building kill you", "a penny dropped from the Empire State Building can't kill you, air resistance caps it at about 40 mph. send this to someone who believes every myth",
             "Empire State Building roof 381 m; free fall without air v = sqrt(2gh) = 86 m/s (310 km/h); a tumbling flat coin has a terminal velocity of roughly 10-25 m/s (about 25-55 mph) (MythBusters and physics analyses); penny mass 2.5 g.", "trap", n)

def wikipedia_read():
    n = [
     N("How long would it take to read all of English Wikipedia? Not skim it. Read every word, nonstop. The answer will make you appreciate how much we know.", T.kinetic([("READ ALL OF", WHITE, 90), ("WIKIPEDIA", GOLD, 130)], "ink")),
     N("English Wikipedia has about seven million articles. Together, they contain more than four billion words.", T.num("words on English Wikipedia", 4.4, fmt="{:.1f}", post=" billion", color=CY, bottom="over 7 million articles", theme="ink", word="seven", dur=1.4)),
     N("An average adult reads about two hundred fifty words a minute. So four point four billion words takes seventeen and a half million minutes.", T.formula(["4,400,000,000 words", "÷ 250 words per minute", "= 17.6 million minutes"], theme="ink", title="the math")),
     N("Divide by sixty, and then by twenty four, and you get twelve thousand days of nonstop reading. That's over thirty three years, without sleeping or eating.", T.num("nonstop reading", 33.5, fmt="{:.1f}", post=" years", color=GOLD, bottom="no sleep, no breaks", theme="ink", word="thirty", dur=1.4)),
     N("A more realistic eight hours of reading a day would take about a hundred years. A whole life, just to read one website.", T.num("reading 8 hours a day", 100, fmt="{:.0f}", post=" years", color=PINK, bottom="a lifetime", theme="ink", word="eight", dur=1.2)),
     N("And Wikipedia grows by thousands of edits every hour, so you'd never catch up. By the time you finish, there'd be millions of new words.", T.kinetic([("IT GROWS FASTER", WHITE, 80), ("THAN YOU READ", GOLD, 90)], "ink")),
     N("Knowledge isn't something you finish. It's something you explore. So pick your next rabbit hole, and enjoy the ride.", T.kinetic([("PICK A RABBIT HOLE", WHITE, 70), ("AND DIVE", GOLD, 120)], "ink")),
    ]
    return R(323, "read_all_wikipedia", "how long to read all of Wikipedia", "reading all of English Wikipedia nonstop would take over 33 years. send this to someone who goes down rabbit holes",
             "English Wikipedia about 7 million articles and about 4.4-4.9 billion words (2024-25). At 250 wpm: 4.4e9/250 = 17.6 million minutes = 33.5 years nonstop; at 8 h/day about 100 years.", "lofi", n)

def humans_ever():
    n = [
     N("How many humans have ever lived? Not just now, but in all of history. The answer will change how you feel about the people around you.", T.kinetic([("HOW MANY HUMANS", WHITE, 90), ("HAVE EVER LIVED?", GOLD, 100)], "warm")),
     N("Demographers estimate that about one hundred seventeen billion members of our species have been born since the first modern humans, around fifty thousand years ago.", T.num("humans ever born", 117, fmt="{:,.0f}", post=" billion", color=GOLD, bottom="Population Reference Bureau estimate", theme="warm", word="hundred", dur=1.6)),
     N("There are about eight point two billion people alive today. That's only about seven percent of everyone who has ever lived.", T.ring("of all humans ever, alive today", .07, "about 8.2 billion of 117 billion", CY, theme="warm", word="seven")),
     N("Flip it around. For every person alive right now, about thirteen people have lived and died before us.", T.num("past people for each living person", 13, fmt="{:.0f}", color=PINK, bottom="we're the minority", theme="warm", word="thirteen", dur=1.0)),
     N("Why so many? For most of history, populations grew slowly, but births added up. And a high share of babies didn't survive, so many of those lives were very short.", T.kinetic([("MOST LIVES", WHITE, 90), ("WERE SHORT", GOLD, 110)], "warm")),
     N("The world's population only passed one billion in eighteen oh four. It took two hundred twenty years to get from one billion to eight.", T.steps("how fast it grew", [("1804", "1 billion"), ("1927", "2 billion"), ("2022", "8 billion")], theme="warm", words=["eighteen", "nineteen", "eight"])),
     N("So every person you meet is part of a small group of the living, standing on the shoulders of more than a hundred billion people who came before. Make it count.", T.kinetic([("108 BILLION", GOLD, 120), ("CAME BEFORE US", WHITE, 80)], "warm")),
    ]
    return R(324, "humans_ever_lived", "how many humans have ever lived", "about 117 billion humans have ever lived, we're only 7% of them. 13 people have died for every one alive. send this to someone who needs perspective",
             "PRB (2022 update): about 117 billion people born since 190,000 BCE; world population 8.0-8.2 billion = about 7% of all ever born; dead about 109 billion = about 13 per living person. UN: 1 billion in 1804, 2 billion in 1927, 8 billion in November 2022.", "cine", n)

def new_horizons():
    n = [
     N("The fastest spacecraft ever launched took nine and a half years to reach Pluto. And when it got there, its pictures took more than four hours to come home.", T.kinetic([("THE FASTEST", WHITE, 90), ("TRIP TO PLUTO", GOLD, 100)], "space")),
     N("In January two thousand six, NASA launched New Horizons. It left Earth at about fifty eight thousand kilometers an hour, the fastest launch speed ever.", T.num("launch speed", 58536, fmt="{:,.0f}", post=" km/h", color=CY, bottom="the fastest ever launched", theme="space", word="fifty", dur=1.4)),
     N("It passed the Moon in just nine hours. The Apollo astronauts took three days.", T.vs(("Apollo to the Moon", 72, ORG), ("New Horizons", 9, GOLD), unit=" hours", fmt="{:.0f}", note="past the Moon", theme="space", word="nine")),
     N("Still, Pluto is far. At closest approach, it was about four point eight billion kilometers away.", T.num("distance to Pluto at flyby", 4.8, fmt="{:.1f}", post=" billion km", color=PINK, bottom="far, far away", theme="space", word="four", dur=1.2)),
     N("It took nine and a half years to get there, arriving in July two thousand fifteen, and it zoomed past Pluto in just a few hours.", T.num("travel time", 9.5, fmt="{:.1f}", post=" years", color=GOLD, bottom="Jan 2006 to Jul 2015", theme="space", word="nine", dur=1.2)),
     N("Its radio signals traveled at the speed of light, yet each message took four and a half hours to get back to Earth.", T.num("signal travel time from Pluto", 4.5, fmt="{:.1f}", post=" hours", color=ORG, bottom="at the speed of light", theme="space", word="four", dur=1.0)),
     N("And it was worth the wait. It showed us a heart shaped glacier of nitrogen ice, mountains of water ice, and blue skies on a world that was once just a dot.", T.kinetic([("A HEART", WHITE, 100), ("ON PLUTO", GOLD, 120)], "space")),
    ]
    return R(325, "new_horizons_pluto", "the fastest trip to Pluto", "New Horizons launched at 58,536 km/h, the fastest ever, and still took 9.5 years to reach Pluto. send this to someone who thinks a 2 hour flight is long",
             "New Horizons launched 19 January 2006 at about 16.26 km/s (58,536 km/h), passed the Moon's orbit in about 9 hours, flew past Pluto on 14 July 2015 at about 4.8 billion km from Earth; one-way light time about 4.5 hours.", "cine", n)

def population():
    n = [
     N("It took all of human history to reach one billion people. Then it took only twelve years to add the most recent billion. This is how fast the world changed.", T.kinetic([("THE TIME TO ADD", WHITE, 80), ("A BILLION PEOPLE", GOLD, 100)], "warm")),
     N("The world reached one billion people around eighteen oh four. That took roughly three hundred thousand years of human history.", T.num("1 billion people", 1804, fmt="{:.0f}", color=CY, bottom="after 300,000 years of humanity", theme="warm", word="eighteen", dur=1.2)),
     N("The second billion took a hundred twenty three years, until nineteen twenty seven. The third billion took only thirty three years, until nineteen sixty.", T.steps("years to add each billion", [("2nd billion", "123 years (1927)"), ("3rd billion", "33 years (1960)")], theme="warm", words=["second", "third"])),
     N("Then it sped up. The fourth took fourteen years, the fifth thirteen, the sixth and seventh twelve years each.", T.bars("years to add each billion", [("2nd", 123), ("3rd", 33), ("4th", 14), ("5th", 13), ("6th", 12), ("7th", 12)], fmt="{:.0f}", unit=" yrs", cols=[PINK, ORG, GOLD, GOLD, GRN, GRN], theme="warm", words=["second", "third", "fourth", "fifth", "sixth", "seventh"])),
     N("The eight billionth person was born in November two thousand twenty two. That billion took eleven years.", T.num("8 billion people", 2022, fmt="{:.0f}", color=GOLD, bottom="the 8th billion took 11 years", theme="warm", word="eight", dur=1.2)),
     N("But growth is now slowing. The world's population is expected to peak at around ten point three billion in the twenty eighties, and then begin to fall.", T.num("expected peak", 10.3, fmt="{:.1f}", post=" billion", color=VIO, bottom="in the 2080s, then decline", theme="warm", word="ten", dur=1.2)),
     N("Families around the world are having fewer children. The age of explosive growth is ending. Our challenge shifts from too many to enough.", T.kinetic([("THE BOOM", WHITE, 100), ("IS ENDING", GOLD, 120)], "warm")),
    ]
    return R(326, "population_billions_faster", "how fast the world population grew", "the first billion people took 300,000 years, the last billion took 11. send this to someone who thinks the world is slowing down",
             "UN World Population Prospects: 1 billion in 1804, 2 billion 1927, 3 billion 1960, 4 billion 1974, 5 billion 1987, 6 billion 1999, 7 billion 2011, 8 billion 15 Nov 2022; projected peak about 10.3 billion in the mid-2080s (UN WPP 2024).", "cine", n)

REELS = dict(drive_to_space_moon_sun=drive_space, walk_around_the_earth=walk_world, earth_stops_spinning=earth_stops, mars_signal_delay=mars_delay, felix_baumgartner_supersonic=baumgartner, penny_empire_state_myth=penny_myth, read_all_wikipedia=wikipedia_read, humans_ever_lived=humans_ever, new_horizons_pluto=new_horizons, population_billions_faster=population)
