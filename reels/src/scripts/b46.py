"""Batch 46: education reels, everyday science."""
import math
from edu import *
import functools
R = functools.partial(R, chip="EVERYDAY SCIENCE")

def sky_blue():
    r = (700 / 450) ** 4; assert 5.8 < r < 5.9
    n = [
     N("Why is the sky blue? Everyone asks, and most explanations skip the one detail that makes it click. It all comes down to one number.", T.kinetic([("WHY IS THE", WHITE, 90), ("SKY BLUE?", GOLD, 140)], "blue")),
     N("Sunlight looks white, but it's a mix of every color. When it hits the air, tiny gas molecules bounce it in all directions. Scientists call this scattering.", T.kinetic([("WHITE LIGHT", WHITE, 100), ("= ALL COLORS", GOLD, 100)], "blue")),
     N("But the air doesn't scatter every color equally. Short wavelengths, like blue, scatter much more strongly than long wavelengths, like red.", T.vs(("red light", 700, ORG), ("blue light", 450, CY), unit=" nm", fmt="{:.0f}", note="wavelength", theme="blue", word="short")),
     N("The rule is that scattering strength equals one divided by the wavelength to the fourth power. A small change in wavelength makes a huge change.", T.formula(["strength = 1 ÷ λ⁴", "λ = wavelength"], theme="blue", title="Rayleigh's rule")),
     N("Blue light at four hundred fifty nanometers scatters nearly six times more than red light at seven hundred.", T.num("blue scatters", 5.85, fmt="{:.1f}", post="× more", color=CY, bottom="than red light", theme="blue", word="six", dur=1.2)),
     N("So when you look at any part of the sky away from the Sun, you're seeing scattered blue light, bounced toward you from all over the atmosphere.", T.kinetic([("BLUE LIGHT", CY, 100), ("BOUNCES TO YOU", WHITE, 80)], "blue")),
     N("At sunset, the light travels through much more air before it reaches you. Most of the blue is scattered away, and what's left is red and orange.", T.kinetic([("SUNSET", WHITE, 100), ("= BLUE IS GONE", ORG, 100)], "blue")),
     N("And here's a fun fact. On Mars, it's the opposite. Mars has a butterscotch sky in the day, and a blue sunset.", T.stat("on Mars", "BLUE SUNSETS", "butterscotch sky by day", CY, "", 120, theme="blue")),
    ]
    return R(277, "why_sky_is_blue", "why the sky is blue", "blue light scatters almost 6x more than red, that's why the sky is blue and sunsets are red. send this to the kid who asks why",
             "Rayleigh scattering intensity is proportional to 1/wavelength^4: (700/450)^4 = 5.85. Violet scatters more but the Sun emits less violet, the upper atmosphere absorbs some and our eyes are less sensitive to it. Mars has dusty butterscotch skies and blue sunsets (NASA).", "lofi", n)

def lightning_sun():
    n = [
     N("A bolt of lightning is hotter than the surface of the Sun. About five times hotter. Here's what's happening inside it.", T.kinetic([("LIGHTNING IS", WHITE, 90), ("HOTTER THAN", WHITE, 90), ("THE SUN", GOLD, 130)], "ink")),
     N("The surface of the Sun is about five thousand eight hundred degrees Celsius.", T.num("the Sun's surface", 5772, fmt="{:,.0f}", post=" K", color=ORG, bottom="about 5,500 °C", theme="ink", word="five", dur=1.2)),
     N("The air along a lightning bolt heats to around thirty thousand kelvin, in a few millionths of a second.", T.num("a lightning bolt", 30000, fmt="{:,.0f}", post=" K", color=PINK, bottom="in microseconds", theme="ink", word="thirty", dur=1.4)),
     N("That's about five times hotter than the Sun's surface. But the bolt is very thin, only a few centimeters wide, and lasts less than a second.", T.vs(("Sun's surface", 5772, ORG), ("lightning", 30000, PINK), unit=" K", fmt="{:,.0f}", note="5× hotter", theme="ink", word="five")),
     N("The sudden heating makes the air explode outward. That shockwave is thunder, which can be heard from about ten to fifteen miles away.", T.stat("thunder", "A SHOCKWAVE", "air exploding outward", CY, "", 100, theme="ink")),
     N("Around the world, there are about forty lightning flashes every second. Most of them are inside clouds, never reaching the ground.", T.num("flashes every second, worldwide", 44, fmt="{:.0f}", color=GOLD, bottom="about 4 million a day", theme="ink", word="forty", dur=1.2)),
     N("Lightning is also powerful. A bolt carries around a billion joules. But most of that energy is lost as light, sound and heat, and can't be captured.", T.num("energy in a bolt", 1, fmt="{:.0f}", post=" billion joules", color=VIO, bottom="mostly lost as heat and light", theme="ink", word="billion", dur=1.0)),
     N("So the next time you watch a storm, you're watching nature create temperatures hotter than the Sun, right outside your window.", T.kinetic([("HOTTER THAN", WHITE, 80), ("THE SUN", GOLD, 130), ("OUTSIDE YOUR WINDOW", WHITE, 56)], "ink")),
    ]
    return R(278, "lightning_hotter_than_sun", "lightning is hotter than the Sun", "lightning heats the air to about 30,000 K, five times hotter than the Sun's surface. send this to someone who loves storms",
             "Lightning channel peak temperature about 30,000 K (NOAA/NWS: 'five times hotter than the surface of the Sun'); solar photosphere 5,772 K; global lightning about 44 flashes/s (NASA LIS/OTD); typical flash energy about 1 GJ.", "trap", n)

def cloud_weight():
    n = [
     N("A normal cloud weighs as much as a hundred elephants. And somehow it just floats there above your head. Here's how.", T.kinetic([("A CLOUD WEIGHS", WHITE, 90), ("100 ELEPHANTS", GOLD, 120)], "blue")),
     N("Take a typical fluffy cumulus cloud, about one kilometer across in every direction. It's a cube of cloud, one cubic kilometer.", T.num("one cloud, cubic kilometers", 1, fmt="{:.0f}", post=" km³", color=CY, bottom="a typical cumulus", theme="blue", word="kilometer", dur=0.8)),
     N("Each cubic meter of cloud holds about half a gram of liquid water, in billions of tiny droplets.", T.num("water per cubic meter", 0.5, fmt="{:.1f}", post=" g", color=GOLD, bottom="as tiny droplets", theme="blue", word="half", dur=0.8)),
     N("A cubic kilometer has a billion cubic meters. Multiply it out, and you get five hundred million grams of water.", T.formula(["1,000,000,000 m³", "× 0.5 g each", "= 500 tonnes"], theme="blue", title="the math")),
     N("Five hundred tonnes. That's about a hundred African elephants, hanging in the sky.", T.num("a cloud weighs", 500, fmt="{:,.0f}", post=" tonnes", color=PINK, bottom="about 100 elephants", theme="blue", word="five", dur=1.2)),
     N("So why doesn't it fall? Because the droplets are tiny, only about a hundredth of a millimeter wide. They fall so slowly that even a gentle rising air current holds them up.", T.num("droplet size", 0.01, fmt="{:.2f}", post=" mm", color=CY, bottom="so light, they barely fall", theme="blue", word="hundredth", dur=1.0)),
     N("The cloud is also floating in air that's denser than the cloud itself. The cloud's whole mass is spread over a huge space.", T.kinetic([("FLOATING IN", WHITE, 90), ("DENSER AIR", GOLD, 110)], "blue")),
     N("When droplets merge and grow heavy enough, they finally fall. And that's rain, the cloud's weight finally coming down.", T.kinetic([("HEAVY ENOUGH?", WHITE, 90), ("IT RAINS", CY, 120)], "blue")),
    ]
    return R(279, "cloud_weight", "how much does a cloud weigh", "a normal cloud weighs about 500 tonnes, the same as 100 elephants, and it floats. send this to someone with their head in the clouds",
             "Cumulus cloud 1 km3 x about 0.5 g/m3 liquid water = 5e8 g = 500 tonnes (USGS cites about 1.1 million pounds). African elephant about 5 tonnes. Cloud droplets about 10-20 micrometres across.", "lofi", n)

def iceberg():
    f = 1 - 917 / 1025; assert .10 < f < .11
    n = [
     N("Only ten percent of an iceberg is visible. The other ninety percent hides under the water. But why exactly ninety? It comes down to density.", T.kinetic([("90% OF AN ICEBERG", WHITE, 76), ("IS HIDDEN", GOLD, 130)], "blue")),
     N("Ice is less dense than liquid water. That's unusual. Most solids sink in their own liquid, but ice floats.", T.stat("ice floats", "ODD", "most solids sink in their liquid", CY, "", 190, theme="blue")),
     N("Water is densest at about four degrees Celsius. As it freezes, the molecules lock into an open crystal shape, and it expands by about nine percent.", T.num("water expands by", 9, fmt="{:.0f}", post="%", color=ORG, bottom="when it freezes", theme="blue", word="nine", dur=0.9)),
     N("Ice has a density of about nine hundred seventeen kilograms per cubic meter. Fresh water is a thousand.", T.vs(("ice", 917, CY), ("fresh water", 1000, GRN), unit=" kg/m³", fmt="{:,.0f}", theme="blue", word="seventeen")),
     N("Sea water is even denser, about a thousand twenty five. So ice floats a little higher in the sea, with about eighty nine percent underwater.", T.ring("of an iceberg is underwater", .894, "in salt water", CY, theme="blue", word="eighty")),
     N("That's why icebergs are so dangerous. The Titanic hit a hull-ripping piece of ice below the waterline that no one could see from the deck.", T.kinetic([("THE DANGER", WHITE, 90), ("IS BELOW", GOLD, 130)], "blue")),
     N("And this strange property keeps life alive. Lakes freeze from the top down, so fish survive in the water below the ice all winter.", T.kinetic([("ICE FLOATS", WHITE, 100), ("SO LAKES LIVE", GOLD, 100)], "blue")),
    ]
    return R(280, "iceberg_90_percent", "why only 10% of an iceberg is visible", "ice is 9% less dense than water, so 90% of an iceberg is hidden underwater. send this to someone who only shows 10% of themselves",
             "Ice density about 917 kg/m3, seawater about 1,025 kg/m3: submerged fraction = 917/1025 = 89.5%; in fresh water 91.7%. Water expands about 9% on freezing.", "lofi", n)

def leap():
    d = 24.22; assert abs(.2422 * 100 - d) < .01
    n = [
     N("Why do we have a leap year? It's not just a calendar quirk. Without it, summer would slowly drift into winter. Let's do the math.", T.kinetic([("WHY DO WE", WHITE, 90), ("HAVE LEAP YEARS?", GOLD, 100)], "ink")),
     N("It takes the Earth three hundred sixty five point two four two two days to go around the Sun. Not exactly three sixty five.", T.num("one orbit takes", 365.2422, fmt="{:.4f}", post=" days", color=GOLD, bottom="not exactly 365", theme="ink", word="three", dur=1.6)),
     N("That extra quarter of a day, about six hours, gets left out of a normal year. After four years, it adds up to a whole day.", T.num("lost each year", 6, fmt="{:.0f}", post=" hours", color=CY, bottom="about a quarter of a day", theme="ink", word="six", dur=0.8)),
     N("Without a leap day, the calendar would drift by about twenty four days every century. After four hundred years, summer would start in what's now spring.", T.num("drift per century", 24, fmt="{:.0f}", post=" days", color=PINK, bottom="seasons slowly sliding", theme="ink", word="twenty", dur=1.0)),
     N("So we add February twenty ninth every four years. But that adds a bit too much, because the real extra is slightly under a quarter day.", T.stat("every 4 years", "FEB 29", "a little too much", ORG, "11 minutes per year too much", 190, theme="ink")),
     N("So the Gregorian calendar skips three leap years every four hundred years. Years divisible by a hundred don't count, unless they're divisible by four hundred. That's why two thousand was a leap year, but nineteen hundred wasn't.", T.steps("leap year rule", [("every 4 years", "leap year"), ("every 100 years", "NOT a leap year"), ("every 400 years", "leap year again")], theme="ink", words=["four", "hundred", "four"])),
     N("When this system started, in fifteen eighty two, Europe had to skip ten whole days. People went to bed on October fourth and woke up on October fifteenth.", T.stat("in 1582", "10 DAYS", "vanished from the calendar", CY, "Oct 4 → Oct 15", 160, theme="ink")),
    ]
    return R(281, "leap_year_math", "why we have leap years", "without leap years the seasons would drift by 24 days every century. in 1582 ten days vanished from the calendar. send this to someone born on February 29",
             "Tropical year 365.2422 days: 0.2422 x 100 = 24.2 days drift per century. Gregorian rule: divisible by 4, except centuries unless divisible by 400. Reform 1582: Thursday 4 October was followed by Friday 15 October (Catholic countries).", "synth", n)

def drop():
    mol = .05 / 18.015 * 6.022e23; assert 1.6e21 < mol < 1.75e21
    n = [
     N("One single drop of water contains more molecules than all the grains of sand on every beach on Earth. That sounds impossible. Let's count.", T.kinetic([("1 DROP OF WATER", WHITE, 90), ("> ALL THE SAND", GOLD, 100)], "teal")),
     N("A drop of water is about five hundredths of a milliliter, which weighs about point zero five grams.", T.num("one drop weighs", 0.05, fmt="{:.2f}", post=" g", color=CY, bottom="about 1/20 of a milliliter", theme="teal", word="five", dur=0.8)),
     N("One mole of water, about eighteen grams, contains six hundred two sextillion molecules. That number is called Avogadro's number.", T.num("molecules in 18 grams", 602, fmt="{:,.0f}", post=" sextillion", color=ORG, bottom="Avogadro's number", theme="teal", word="mole", dur=1.6)),
     N("The drop is about three hundred sixty times lighter than that, so it holds about one point seven sextillion molecules.", T.num("molecules in one drop", 1.67, fmt="{:.2f}", post=" sextillion", color=GOLD, bottom="1.67 × 10²¹", theme="teal", word="one", dur=1.8)),
     N("Now the sand. Scientists estimate there are about seven and a half quintillion grains of sand on all of Earth's beaches.", T.num("grains of sand on Earth's beaches", 7.5, fmt="{:.1f}", post=" quintillion", color=ORG, bottom="a rough estimate", theme="teal", word="seven", dur=1.8)),
     N("Divide one by the other. The single drop has over two hundred times more molecules than there are sand grains on all the world's beaches.", T.num("drop vs all beach sand", 220, fmt="{:,.0f}", post="× more", color=PINK, bottom="molecules vs grains", theme="teal", word="two", dur=1.2)),
     N("This is what makes atoms hard to imagine. They're so small that even a drop of water holds a number we can't picture.", T.kinetic([("ATOMS ARE", WHITE, 90), ("UNIMAGINABLY SMALL", GOLD, 70)], "teal")),
    ]
    return R(282, "water_drop_molecules", "one drop of water vs all the sand on Earth", "one drop of water has more molecules than all the sand on Earth's beaches has grains. send this to someone who thinks small things don't matter",
             "1 drop about 0.05 mL = 0.05 g = 0.05/18.015 mol x 6.022e23 = 1.67e21 molecules. Hawaii Univ. estimate of sand grains on beaches about 7.5e18. Ratio about 220.", "lofi", n)

def doorknob():
    n = [
     N("Why do you get shocked when you touch a door handle? Here's the physics, and the number that will make you wince.", T.kinetic([("THE DOORKNOB", WHITE, 90), ("SHOCK", GOLD, 140)], "ink")),
     N("When you walk across carpet in socks, electrons rub off the carpet onto your body. You build up a negative charge, called static electricity.", T.kinetic([("SOCKS + CARPET", WHITE, 80), ("= CHARGE", GOLD, 120)], "ink")),
     N("Your body can reach ten thousand volts or more, especially when the air is dry. Dry winter air lets the charge build up without leaking away.", T.num("voltage on your body", 10000, fmt="{:,.0f}", post=" V", color=PINK, bottom="in dry winter air", theme="ink", word="ten", dur=1.4)),
     N("You start to feel a shock at about three thousand volts. You can see a spark at around four thousand.", T.steps("how much you notice", [("3,000 V", "you feel the zap"), ("4,000 V", "you can see the spark")], theme="ink", words=["three", "four"])),
     N("So why doesn't it hurt you, even at ten thousand volts? Because the current is tiny, and lasts only a billionth of a second. The total energy is just a fraction of a millijoule.", T.num("shock duration", 1, fmt="{:.0f}", post=" nanosecond", color=GOLD, bottom="harmless, but unpleasant", theme="ink", word="billionth", dur=0.8)),
     N("Compare that to a household outlet, only a hundred twenty volts, but with a huge, steady current. That can be deadly. Volts alone don't hurt. It's the current that matters.", T.vs(("static shock", 10000, PINK), ("wall outlet", 120, CY), unit=" V", fmt="{:,.0f}", note="volts alone don't hurt", theme="ink", word="household")),
     N("To avoid the zap, touch the metal with a key first. The spark jumps to the key, and not to your finger.", T.kinetic([("TOUCH THE", WHITE, 90), ("KEY FIRST", GOLD, 120)], "ink")),
    ]
    return R(283, "doorknob_shock_volts", "why you get shocked by a doorknob", "a static shock is about 10,000 volts but harmless because the current is tiny. send this to someone who hates winter",
             "Static discharge is felt from about 3 kV, seen from about 4 kV, can reach 10-25 kV in dry air; energy of a human-body discharge is only about 0.1-1 mJ lasting nanoseconds. Wall outlet 120 V can deliver lethal current.", "trap", n)

def great_wall():
    n = [
     N("You've probably heard the Great Wall of China is the only man made structure you can see from space. That is a myth, and it's easy to prove.", T.kinetic([("THE GREAT WALL", WHITE, 90), ("FROM SPACE?", GOLD, 120), ("MYTH", PINK, 130)], "ink")),
     N("The Wall is long, about twenty one thousand kilometers in total. But it's narrow, usually only five to nine meters wide.", T.vs(("length", 21196, GOLD), ("width", 6.5, CY), unit=" m", fmt="{:,.0f}", log=True, theme="ink", word="long")),
     N("The International Space Station orbits about four hundred kilometers up. From that height, a six meter wide object looks like a single human hair seen from five meters away.", T.num("ISS altitude", 400, fmt="{:,.0f}", post=" km", color=CY, bottom="like a hair, from 5 meters", theme="ink", word="four", dur=1.0)),
     N("China's first astronaut, Yang Liwei, flew in two thousand three. When he got back, he said he looked for the Wall, and couldn't see it.", T.stat("Yang Liwei, 2003", "NOT VISIBLE", "China's first astronaut looked for it", PINK, "", 120, theme="ink")),
     N("Even better, the claim was made long before spaceflight. In seventeen fifty four, an English antiquarian wrote that the Wall could be seen from the Moon. It can't.", T.stat("from the Moon?", "1754", "someone claimed it, before flight existed", ORG, "", 190, theme="ink")),
     N("What can astronauts see? Cities at night, glowing like jewels. Highways lit by streetlights. Big airports. Much more obvious than a gray stone wall.", T.kinetic([("CITIES AT NIGHT", GOLD, 90), ("ARE EASY", WHITE, 100)], "ink")),
     N("So the Wall is incredible. But myths like this show how easily a good story can beat the facts. Always check the numbers.", T.kinetic([("CHECK", WHITE, 100), ("THE NUMBERS", GOLD, 100)], "ink")),
    ]
    return R(284, "great_wall_from_space_myth", "the Great Wall is not visible from space", "the Great Wall of China is NOT visible from space with the naked eye. China's first astronaut said so. send this to someone who still believes it",
             "Great Wall about 21,196 km (2012 survey), typically 5-9 m wide; ISS altitude about 400 km. Yang Liwei (Shenzhou 5, 2003) said he could not see it. The claim appears in print as early as 1932 (Ripley's) and similar claims predate spaceflight.", "trap", n)

def glass():
    n = [
     N("You've heard that glass is a slow moving liquid, and that's why old church windows are thicker at the bottom. It's a popular story, and it's false.", T.kinetic([("GLASS IS A", WHITE, 90), ("SLOW LIQUID?", GOLD, 100), ("FALSE", PINK, 130)], "ink")),
     N("Old windows were made by spinning molten glass into a flat disc, called crown glass. The result was never perfectly even.", T.stat("old windows", "CROWN GLASS", "spun into an uneven disc", CY, "", 120, theme="ink")),
     N("Glaziers often installed the heavy edge at the bottom, because it was more stable. That's why some old windows are thicker at the bottom. Some are thicker at the top, or on the sides.", T.kinetic([("INSTALLED", WHITE, 90), ("THICK SIDE DOWN", GOLD, 100)], "ink")),
     N("If glass really flowed, scientists could compute how long it would take. A study found that it would take far longer than the age of the universe for glass at room temperature to visibly flow.", T.num("time for glass to flow", 1, fmt="{:.0f}", post=" × 10³² years", color=PINK, bottom="the universe is 1.4 × 10¹⁰ years old", theme="ink", word="longer", dur=1.4)),
     N("So what is glass? It's an amorphous solid. Its atoms are arranged randomly, like a liquid, but they're locked in place, like a solid.", T.stat("glass is", "AMORPHOUS SOLID", "random atoms, locked in place", GRN, "", 100, theme="ink")),
     N("We also see really ancient glass in museums. Roman glass from two thousand years ago still has perfectly even shapes, with no sagging.", T.num("Roman glass, still perfect", 2000, fmt="{:,.0f}", post=" years old", color=GOLD, bottom="no sagging, no flowing", theme="ink", word="two", dur=1.4)),
     N("Myths like this stick because they sound clever. But when you check the numbers, glass is a solid, and church windows are just uneven.", T.kinetic([("SOUNDS CLEVER", WHITE, 90), ("ISN'T TRUE", GOLD, 110)], "ink")),
    ]
    return R(285, "glass_is_not_liquid", "glass is not a slow liquid", "glass is NOT a slow moving liquid, old windows are thick at the bottom because of how they were made. send this to someone who loves fun facts that aren't facts",
             "Zanotto, Am. J. Phys. 66 (1998): flow in cathedral glass at room temperature would take longer than about 1e32 years. Crown-glass windows were uneven as made. Roman glass is not sagged.", "lofi", n)

def rainbow():
    n = [
     N("Every person who sees a rainbow sees a different one. Even your two eyes see slightly different rainbows. A rainbow isn't a thing in the sky. It's a direction.", T.kinetic([("EVERYONE SEES", WHITE, 80), ("THEIR OWN", GOLD, 100), ("RAINBOW", GOLD, 130)], "blue")),
     N("A rainbow forms when sunlight enters a raindrop, bounces off the back, and exits, splitting into colors as it bends.", T.kinetic([("ENTER", WHITE, 100), ("BOUNCE", WHITE, 100), ("SPLIT INTO COLORS", GOLD, 70)], "blue")),
     N("Each color leaves the drop at a slightly different angle. Red comes out at about forty two degrees from the line pointing away from the Sun.", T.num("red light exits at", 42, fmt="{:.0f}", post="°", color=PINK, bottom="from the point opposite the Sun", theme="blue", word="forty", dur=1.0)),
     N("You only see the light from the raindrops that sit at exactly that angle from you. That makes a circle around the point opposite the Sun.", T.kinetic([("A CIRCLE", WHITE, 100), ("AROUND YOUR SHADOW", GOLD, 70)], "blue")),
     N("You usually see only the top half, because the ground gets in the way. But from a plane or a mountain, you can see a complete circle.", T.stat("from a plane", "A FULL CIRCLE", "the ground no longer blocks it", CY, "", 120, theme="blue")),
     N("Your neighbor, standing a few meters away, is looking at light from different raindrops. So the two of you aren't seeing the same rainbow at all.", T.kinetic([("YOUR RAINBOW", WHITE, 90), ("≠ THEIRS", GOLD, 130)], "blue")),
     N("And when you see a double rainbow, the second one is fainter, higher, and has its colors reversed. It comes from light bouncing twice inside the drops, at fifty one degrees.", T.num("double rainbow angle", 51, fmt="{:.0f}", post="°", color=VIO, bottom="colors reversed", theme="blue", word="fifty", dur=1.0)),
    ]
    return R(286, "rainbow_circle_42", "a rainbow is a full circle", "every rainbow is a full circle, and everyone sees their own. send this to someone you'd show a rainbow to",
             "Primary rainbow: red at about 42 degrees from the antisolar point (violet about 40), secondary about 51 degrees with reversed colour order. Seen as a full circle from aircraft or high vantage points; each observer sees light from different drops.", "lofi", n)

REELS = dict(why_sky_is_blue=sky_blue, lightning_hotter_than_sun=lightning_sun, cloud_weight=cloud_weight, iceberg_90_percent=iceberg, leap_year_math=leap, water_drop_molecules=drop, doorknob_shock_volts=doorknob, great_wall_from_space_myth=great_wall, glass_is_not_liquid=glass, rainbow_circle_42=rainbow)
