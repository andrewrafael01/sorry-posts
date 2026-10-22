"""Batch 52: education reels, Earth, units and deep time."""
import math
from edu import *
import functools
R = functools.partial(R, chip="SCIENCE")

def bulge():
    n = [
     N("The Earth is not round. It's fatter around the middle, and that tiny bulge changes how much you weigh. Here are the numbers.", T.kinetic([("THE EARTH IS", WHITE, 90), ("NOT ROUND", GOLD, 140)], "space")),
     N("Earth spins once a day, and that spin flings the equator outward. The planet is squashed, like a ball someone sat on very gently.", T.kinetic([("SPIN SQUASHES", WHITE, 90), ("THE PLANET", GOLD, 110)], "space")),
     N("The radius at the equator is six thousand three hundred seventy eight kilometers. At the poles, six thousand three hundred fifty seven.", T.vs(("pole radius", 6357, CY), ("equator radius", 6378, GOLD), unit=" km", fmt="{:,.0f}", theme="space", word="equator")),
     N("That's a difference of twenty one kilometers in radius, so the whole planet is about forty three kilometers wider at the equator than pole to pole.", T.num("wider at the equator", 42.8, fmt="{:.1f}", post=" km", color=PINK, bottom="about 0.34% of its width", theme="space", word="forty", dur=1.2)),
     N("That bulge, plus the spin, means gravity is slightly weaker at the equator. You're farther from the center, and spinning pulls you outward.", T.kinetic([("FARTHER OUT", WHITE, 90), ("+ SPINNING", WHITE, 90), ("= LIGHTER", GOLD, 110)], "space")),
     N("A person who weighs seventy kilograms at the poles weighs about point three seven kilograms less at the equator. That's about half a percent.", T.num("lighter at the equator", 370, fmt="{:.0f}", post=" grams", color=GRN, bottom="for a 70 kg person, no diet needed", theme="space", word="point", dur=1.0)),
     N("It also means the highest point measured from Earth's center isn't Everest. It's Chimborazo in Ecuador, which sits right on the bulge.", T.kinetic([("THE BULGE MOVES", WHITE, 80), ("THE RECORD", GOLD, 110)], "space")),
    ]
    return R(337, "earth_equator_bulge", "the Earth is not round", "the Earth bulges 43 km at the equator, so you weigh about 0.5% less there. send this to someone planning a diet (not really)",
             "WGS84: equatorial radius 6,378.137 km, polar 6,356.752 km (difference 21.4 km, flattening 1/298.257). Surface gravity 9.780 m/s2 at the equator vs 9.832 at the poles (0.53% less): 70 kg -> 0.37 kg lighter.", "cine", n)

def escape():
    n = [
     N("How fast do you have to go to leave a planet forever? It's called escape velocity, and the numbers get wild very fast.", T.kinetic([("HOW FAST TO", WHITE, 90), ("LEAVE A PLANET?", GOLD, 110)], "space")),
     N("To escape Earth, a rocket must reach eleven point two kilometers a second. That's about forty thousand kilometers an hour.", T.num("escape speed from Earth", 11.2, fmt="{:.1f}", post=" km/s", color=CY, bottom="about 40,300 km/h", theme="space", word="eleven", dur=1.2)),
     N("It depends on the planet's mass and size. The Moon is small, so you only need two point four kilometers a second. Mars needs five.", T.bars("escape speed, km/s", [("Moon", 2.38), ("Mars", 5.03), ("Earth", 11.19)], fmt="{:.1f}", unit=" km/s", cols=[CY, ORG, GRN], theme="space", words=["Moon", "Mars", "Earth"])),
     N("Jupiter is a giant. To leave it, you'd need nearly sixty kilometers a second, over five times Earth's.", T.bars("escape speed, km/s", [("Earth", 11.19), ("Jupiter", 59.5)], fmt="{:.1f}", unit=" km/s", cols=[GRN, PINK], theme="space", words=["Earth", "Jupiter"])),
     N("And to escape the surface of the Sun, you'd need six hundred seventeen kilometers a second, over two million kilometers an hour.", T.num("escape speed from the Sun", 617, fmt="{:,.0f}", post=" km/s", color=ORG, bottom="over 2 million km/h", theme="space", word="six", dur=1.4)),
     N("Now the extreme. A black hole's escape speed is the speed of light, three hundred thousand kilometers a second. Nothing can reach it, so nothing gets out.", T.num("a black hole", 299792, fmt="{:,.0f}", post=" km/s", color=VIO, bottom="the speed of light", theme="space", word="black", dur=1.4)),
     N("That's the whole idea. A black hole is just a place where the escape speed is faster than light. The rest follows from there.", T.kinetic([("ESCAPE SPEED", WHITE, 80), ("> LIGHT", GOLD, 130)], "space")),
    ]
    return R(338, "escape_velocity_ladder", "how fast to escape a planet", "you need 11.2 km/s to escape Earth, 617 km/s to escape the Sun, and a black hole needs more than light. send this to someone who wants to leave",
             "Escape velocity v = sqrt(2GM/r): Moon 2.38 km/s, Mars 5.03, Earth 11.19 (40,270 km/h), Jupiter 59.5-60.2, Sun 617.5 km/s; a black hole's escape speed at the horizon equals c = 299,792 km/s.", "synth", n)

def billiard():
    n = [
     N("If you shrank the Earth to the size of a billiard ball, it would feel smoother than the ball. Even with Everest and the deepest ocean trench included.", T.kinetic([("EARTH vs A", WHITE, 90), ("BILLIARD BALL", GOLD, 110)], "ink")),
     N("The highest mountain is about nine kilometers above sea level, and the deepest trench is about eleven kilometers below it. That's about twenty kilometers of total relief.", T.num("total relief on Earth", 19.8, fmt="{:.1f}", post=" km", color=CY, bottom="Everest to the Mariana Trench", theme="ink", word="twenty", dur=1.2)),
     N("The Earth is twelve thousand seven hundred forty two kilometers wide. Twenty kilometers is only point one five percent of that.", T.num("relief compared to width", 0.155, fmt="{:.3f}", post="%", color=GOLD, bottom="19.8 km ÷ 12,742 km", theme="ink", word="point", dur=1.4)),
     N("Now the billiard ball. Official rules allow its size to vary by plus or minus about point two two percent.", T.num("a billiard ball's allowed variation", 0.22, fmt="{:.2f}", post="%", color=PINK, bottom="plus or minus, by official rules", theme="ink", word="point", dur=1.2)),
     N("So Earth's mountains and trenches, scaled down, are smoother than a legal billiard ball. If you shrank Earth to the ball's size, you couldn't feel Everest with your finger.", T.vs(("Earth", .155, GRN), ("billiard ball", .22, PINK), unit="%", fmt="{:.2f}", note="Earth is smoother", theme="ink", word="smoother")),
     N("There's a catch. We're ignoring the equatorial bulge. That's a bigger bump than any mountain, but it's a smooth, gradual one that you couldn't feel either.", T.kinetic([("IGNORING THE", WHITE, 80), ("EQUATORIAL BULGE", GOLD, 80)], "ink")),
     N("It shows how thin the surface really is. Everything you've ever seen, every mountain and ocean, is a coat of paint on a huge ball of rock.", T.kinetic([("EVERYTHING", WHITE, 100), ("IS A COAT", GOLD, 110), ("OF PAINT", WHITE, 100)], "ink")),
    ]
    return R(339, "earth_smoother_than_billiard_ball", "Earth is smoother than a billiard ball", "scaled to billiard ball size, Earth's mountains and trenches are smoother than a legal pool ball. send this to someone who plays pool",
             "Total relief about 8.85 km + 10.93 km = 19.8 km = 0.155% of the 12,742 km diameter; Billiard Congress of America allows +/-0.005 in on a 2.25 in ball = 0.22% (ignoring the equatorial bulge of 0.34%).", "lofi", n)

def metric():
    n = [
     N("The metric system looks random until you know the secret. Everything is connected, to the Earth and to water. Here's how it was designed.", T.kinetic([("THE METRIC", WHITE, 100), ("SYSTEM'S SECRET", GOLD, 100)], "ink")),
     N("In seventeen ninety one, French scientists defined the meter as one ten millionth of the distance from the North Pole to the Equator.", T.num("the original meter", 10, fmt="{:.0f}", post=" million", color=CY, bottom="meters from the Pole to the Equator", theme="ink", word="ten", dur=1.0)),
     N("They were off by only about two tenths of a millimeter per meter. The actual distance is just over ten thousand and two kilometers.", T.num("the Pole to the Equator", 10002, fmt="{:,.0f}", post=" km", color=GOLD, bottom="a 0.02% error", theme="ink", word="ten", dur=1.2)),
     N("Then they connected everything else to the meter. A cube ten centimeters on each side is one liter.", T.formula(["10 cm × 10 cm × 10 cm", "= 1 liter"], theme="ink", title="volume from length")),
     N("And a liter of water weighs one kilogram. That's not a coincidence. The kilogram was defined from the water in that cube.", T.formula(["1 liter of water", "= 1 kilogram"], theme="ink", title="weight from volume")),
     N("A cubic centimeter of water is one milliliter, and weighs one gram. Length, volume, and weight, all tied together by water.", T.steps("one system", [("1 cm³", "= 1 milliliter"), ("1 mL of water", "= 1 gram")], theme="ink", words=["cubic", "milliliter"])),
     N("Even the old units connect. Water freezes at zero degrees Celsius and boils at one hundred. The whole system was designed around water, and around the Earth.", T.kinetic([("0°C = FREEZES", CY, 80), ("100°C = BOILS", ORG, 80)], "ink")),
     N("Today, the units are defined using physical constants instead. But the old logic still makes the system easy to use. Ten, a hundred, a thousand. Everything scales by tens.", T.kinetic([("EVERYTHING", WHITE, 100), ("SCALES BY 10", GOLD, 100)], "ink")),
    ]
    return R(340, "metric_system_logic", "how the metric system connects", "a liter of water weighs one kilogram, and the meter came from the Earth itself. the metric system was designed around water and the planet. send this to someone who still uses feet",
             "Meter 1791: 1/10,000,000 of the quarter meridian (pole to equator, actual 10,002 km); 1 L = 1 dm3; 1 kg = mass of 1 L of water (at 4 C); 1 mL = 1 cm3 = 1 g. Redefined in 2019 using fundamental constants.", "lofi", n)

def bulb():
    n = [
     N("There's a light bulb in California that has been on for over a hundred and twenty years. It's been burning since nineteen oh one, and it has never been turned off for long.", T.kinetic([("A LIGHT BULB", WHITE, 90), ("ON FOR 120 YEARS", GOLD, 90)], "warm")),
     N("It hangs in a fire station in Livermore, California. It's called the Centennial Light, and a webcam watches it around the clock.", T.stat("the Centennial Light", "LIVERMORE, CA", "hanging in a fire station since 1901", GOLD, "", 90, theme="warm")),
     N("It has burned for over a million hours. A modern bulb lasts a thousand to twenty five thousand, depending on the type.", T.num("hours of light so far", 1.1, fmt="{:.1f}", post=" million", color=CY, bottom="a normal bulb: about 1,000", theme="warm", word="million", dur=1.2)),
     N("It's very dim, only about four watts today. That's one reason it has lasted so long. Its thick carbon filament is gentle on itself.", T.num("its power", 4, fmt="{:.0f}", post=" watts", color=ORG, bottom="as bright as a night light", theme="warm", word="four", dur=0.8)),
     N("It only went dark a few times, for a short time, during a move and during power cuts. It has been through two world wars and the Great Depression.", T.kinetic([("TWO WORLD WARS", WHITE, 80), ("ONE LIGHT BULB", GOLD, 100)], "warm")),
     N("Why don't modern bulbs last as long? In nineteen twenty four, the major bulb makers formed a group called the Phoebus cartel. They agreed to limit bulb life to a thousand hours.", T.num("the Phoebus cartel's limit", 1000, fmt="{:,.0f}", post=" hours", color=PINK, bottom="agreed in 1924", theme="warm", word="thousand", dur=1.2)),
     N("It's one of the first well documented cases of planned obsolescence, making products fail on purpose, so you buy another. A bulb that never dies is bad for business.", T.kinetic([("PLANNED", WHITE, 100), ("OBSOLESCENCE", GOLD, 80)], "warm")),
    ]
    return R(341, "centennial_light_bulb", "the light bulb that has burned for 120 years", "a light bulb in California has been on since 1901. the 1924 Phoebus cartel limited bulbs to 1,000 hours on purpose. send this to someone who just replaced a bulb",
             "Centennial Light, Livermore-Pleasanton Fire Department, lit since 1901 (about 1.1 million hours by 2021), about 4 W; Phoebus cartel formed 1924-25 and agreed to limit incandescent life to 1,000 hours.", "lofi", n)

def trex_stego():
    n = [
     N("Tyrannosaurus rex lived closer in time to us than to Stegosaurus. The dinosaurs weren't all alive together. Their story is spread over a huge stretch of time.", T.kinetic([("T. REX vs", WHITE, 100), ("STEGOSAURUS", GOLD, 110), ("vs YOU", CY, 100)], "green")),
     N("Stegosaurus lived about a hundred fifty million years ago, in the late Jurassic.", T.num("Stegosaurus", 150, fmt="{:.0f}", post=" million years ago", color=GRN, bottom="late Jurassic", theme="green", word="hundred", dur=1.0)),
     N("Tyrannosaurus rex lived about sixty seven to sixty six million years ago, at the very end of the Cretaceous, just before the asteroid.", T.num("T. rex", 66, fmt="{:.0f}", post=" million years ago", color=ORG, bottom="the last days of the dinosaurs", theme="green", word="sixty", dur=1.0)),
     N("So the gap between Stegosaurus and T. rex is about eighty four million years.", T.timeline("millions of years ago", [(-150, "Stegosaurus"), (-66, "T. rex")], -160, 10, theme="green", fmtx=lambda x: f"{abs(x):.0f} Ma")),
     N("And the gap between T. rex and today is only about sixty six million years. T. rex is closer to your phone than to Stegosaurus.", T.vs(("Stegosaurus to T. rex", 84, GRN), ("T. rex to today", 66, ORG), unit=" million yrs", fmt="{:.0f}", theme="green", word="phone")),
     N("The dinosaur age lasted over a hundred sixty million years. Humans have existed for three hundred thousand. Dinosaurs ruled for more than five hundred times longer.", T.num("how many times longer dinosaurs ruled", 500, fmt="{:,.0f}", post="×", color=PINK, bottom="than humans have existed", theme="green", word="five", dur=1.2)),
     N("The movies put them all in one picture. In real life, a time traveler could visit Stegosaurus, wait eighty million years, and then meet T. rex.", T.kinetic([("MOVIES SQUASH", WHITE, 80), ("DEEP TIME", GOLD, 110)], "green")),
    ]
    return R(342, "trex_closer_to_us_than_stegosaurus", "T. rex lived closer to us than to Stegosaurus", "T. rex lived 66 million years ago, Stegosaurus 150 million. T. rex is closer in time to us than to Stegosaurus. send this to a dinosaur fan",
             "Stegosaurus about 155-150 Ma (Late Jurassic); Tyrannosaurus rex about 68-66 Ma; difference about 84 million years vs 66 million years to today. Non-avian dinosaurs ruled about 165 million years (about 230-66 Ma).", "cine", n)

def microbiome():
    n = [
     N("You have about as many bacterial cells in and on your body as human cells. You are not alone. You are a walking ecosystem.", T.kinetic([("YOU HAVE AS MANY", WHITE, 80), ("BACTERIA AS", WHITE, 80), ("HUMAN CELLS", GOLD, 100)], "green")),
     N("For decades, textbooks said bacteria outnumber your own cells ten to one. A careful study in twenty sixteen corrected that.", T.stat("the old textbook number", "10 : 1", "was a rough guess from 1972", ORG, "", 190, theme="green")),
     N("The new estimate is about thirty eight trillion bacteria, compared with about thirty trillion human cells. Roughly one to one.", T.vs(("human cells", 30, CY), ("bacterial cells", 38, GRN), unit=" trillion", fmt="{:.0f}", note="about 1.3 : 1", theme="green", word="thirty")),
     N("Most of them live in your large intestine. Together they weigh about two hundred grams, less than a small bag of sugar.", T.num("weight of your bacteria", 200, fmt="{:.0f}", post=" grams", color=GOLD, bottom="mostly in your gut", theme="green", word="weigh", dur=1.0)),
     N("They aren't just passengers. They help digest food, make some vitamins, train your immune system, and crowd out harmful germs.", T.steps("what they do for you", [("digest food", ""), ("make vitamins", ""), ("train your immune system", "")], theme="green", words=["digest", "vitamins", "immune"])),
     N("And your gut microbes talk to your brain. They make a large share of the body's serotonin, a chemical tied to mood.", T.num("of your serotonin is made in the gut", 90, fmt="{:.0f}", post="%", color=PINK, bottom="partly with help from microbes", theme="green", word="serotonin", dur=1.0)),
     N("You're not just a person. You're a person plus trillions of tiny partners. Eat plants and fiber, and you feed the right ones.", T.kinetic([("FEED THEM", WHITE, 100), ("FIBER", GOLD, 140)], "green")),
    ]
    return R(343, "bacteria_vs_human_cells", "you have as many bacteria as human cells", "you have about 38 trillion bacteria and 30 trillion human cells, roughly 1 to 1, not 10 to 1. send this to someone who thinks they're alone",
             "Sender, Fuchs & Milo, Cell 2016: about 3.8e13 bacteria vs 3.0e13 human cells in a 70 kg reference man (ratio about 1.3:1); total bacterial mass about 0.2 kg. About 90% of serotonin is produced in the gut (enterochromaffin cells, with microbial influence).", "lofi", n)

def pyramid_rate():
    n = [
     N("The Great Pyramid has over two million blocks, and it was built in about twenty years. Do the math, and the pace is astonishing.", T.kinetic([("2.3 MILLION BLOCKS", GOLD, 90), ("20 YEARS", WHITE, 120)], "warm")),
     N("It contains about two point three million blocks of stone, with an average weight of around two and a half tonnes each.", T.num("blocks in the Great Pyramid", 2.3, fmt="{:.1f}", post=" million", color=GOLD, bottom="about 2.5 tonnes each", theme="warm", word="two", dur=1.0)),
     N("The pharaoh Khufu ruled for about twenty three years, and most historians think the pyramid was built within about twenty of them.", T.num("construction time", 20, fmt="{:.0f}", post=" years", color=CY, bottom="during Khufu's reign", theme="warm", word="twenty", dur=0.9)),
     N("Twenty years is about seven thousand three hundred days. Divide two point three million blocks by that, and you get over three hundred blocks placed every single day.", T.num("blocks per day", 315, fmt="{:.0f}", color=PINK, bottom="every day for 20 years", theme="warm", word="three", dur=1.0)),
     N("If crews worked ten hours a day, that's a block every two minutes, from morning to night, for two decades.", T.num("one block every", 1.9, fmt="{:.1f}", post=" minutes", color=ORG, bottom="over 10 hour days", theme="warm", word="block", dur=1.0)),
     N("The total weight is about six million tonnes. It was the tallest building on Earth for nearly four thousand years, until Lincoln Cathedral in England, around thirteen hundred.", T.num("the tallest building for", 3800, fmt="{:,.0f}", post=" years", color=GOLD, bottom="until about 1311", theme="warm", word="tallest", dur=1.4)),
     N("And it was built without wheels for hauling, iron tools, or cranes. Organized, paid workers, not slaves, as the nearby workers' town shows. Humans can do impressive things together.", T.kinetic([("WORKERS,", WHITE, 90), ("NOT SLAVES", GOLD, 110)], "warm")),
    ]
    return R(344, "pyramid_block_every_2_minutes", "a block every 2 minutes for 20 years", "the Great Pyramid needed one 2.5 tonne block every 2 minutes for 20 years. send this to someone who thinks they work hard",
             "Great Pyramid of Giza: about 2.3 million blocks (average about 2.5 t), about 5.9 million tonnes; built in about 20 years (c. 2560 BC). 2.3e6 / (20 x 365) = 315 blocks/day; at 10 h/day = about one every 1.9 minutes. Tallest structure until about 1311 (Lincoln Cathedral) by common accounts.", "cine", n)

def eiffel():
    d = 300 * 11.7e-6 * 40 * 100; assert 13 < d < 15
    n = [
     N("The Eiffel Tower is taller in the summer than in the winter. By about as much as the length of your hand. It's not a trick. It's physics.", T.kinetic([("THE EIFFEL TOWER", WHITE, 80), ("GROWS IN SUMMER", GOLD, 100)], "ink")),
     N("Metal expands when it heats up. The tower is built of about seven thousand tonnes of wrought iron, and in Paris summers the iron gets hot in the sun.", T.stat("iron + sun", "THERMAL EXPANSION", "metal grows when it warms", ORG, "", 100, theme="ink")),
     N("There's a simple formula. The change in length equals the original length, times a number for the material, times the change in temperature.", T.formula(["ΔL = L × α × ΔT"], theme="ink", title="the formula")),
     N("For iron, that number is about eleven point seven millionths per degree Celsius. The tower's iron structure is about three hundred meters tall.", T.formula(["L = 300 m", "α = 0.0000117 per °C", "ΔT = 40 °C"], theme="ink")),
     N("Multiply them, and the tower grows by about fourteen centimeters between a cold winter day and a hot summer day.", T.num("summer growth", 14, fmt="{:.0f}", post=" cm", color=GOLD, bottom="about the length of your hand", theme="ink", word="fourteen", dur=1.0)),
     N("The tower also leans slightly away from the sun, because the sunny side expands more than the shaded side. It sways by several centimeters during the day.", T.kinetic([("IT LEANS", WHITE, 100), ("AWAY FROM THE SUN", GOLD, 70)], "ink")),
     N("Engineers design for this. Bridges have gaps called expansion joints, railways leave tiny spaces, and the next time you see a gap, you'll know what it's for.", T.kinetic([("GAPS ARE", WHITE, 90), ("ON PURPOSE", GOLD, 110)], "ink")),
    ]
    return R(345, "eiffel_tower_summer_growth", "the Eiffel Tower grows in summer", "the Eiffel Tower grows about 14 cm taller in summer because iron expands when it's hot. send this to someone going to Paris",
             "Linear thermal expansion dL = L alpha dT: iron alpha about 11.7e-6 /C; L about 300 m, dT about 40 C -> about 14 cm (the operator quotes up to 15 cm). The tower also leans away from the sun by a few centimeters.", "lofi", n)

def great_dying():
    n = [
     N("Two hundred fifty two million years ago, life on Earth almost ended. About ninety percent of all species disappeared. It's called the Great Dying.", T.kinetic([("THE GREAT DYING", WHITE, 100), ("90% OF SPECIES", PINK, 100)], "warm")),
     N("It happened at the end of the Permian period, long before the dinosaurs. It was the worst mass extinction in Earth's history, far worse than the one that killed the dinosaurs.", T.num("species lost", 90, fmt="{:.0f}", post="%", color=PINK, bottom="96% of marine species", theme="warm", word="ninety", dur=1.0)),
     N("The cause was huge volcanic eruptions in what is now Siberia, called the Siberian Traps. Lava covered an area as big as Europe over about a million years.", T.stat("the Siberian Traps", "LAVA THE SIZE OF EUROPE", "over about a million years", ORG, "", 76, theme="warm")),
     N("The eruptions pumped enormous amounts of carbon dioxide and methane into the air. Global temperatures rose, and the oceans warmed by around ten degrees.", T.num("ocean warming", 10, fmt="{:.0f}", post="°C", color=PINK, bottom="warm, acidic, low in oxygen", theme="warm", word="ten", dur=1.0)),
     N("Warm water holds less oxygen, and the seas became acidic and suffocating. Trilobites, a group that had survived for almost three hundred million years, vanished.", T.num("trilobites, gone after", 270, fmt="{:.0f}", post=" million years", color=CY, bottom="they ruled the seas", theme="warm", word="trilobites", dur=1.2)),
     N("Life took about ten million years to recover. It was a slow rebuilding, and it cleared the way for the dinosaurs to take over.", T.num("recovery time", 10, fmt="{:.0f}", post=" million years", color=GRN, bottom="before ecosystems rebuilt", theme="warm", word="ten", dur=1.0)),
     N("The Great Dying is a warning from deep time. Rapid changes in carbon and temperature can reshape life on the whole planet. It has happened before.", T.kinetic([("A WARNING", WHITE, 100), ("FROM DEEP TIME", GOLD, 90)], "warm")),
    ]
    return R(346, "the_great_dying", "the Great Dying", "252 million years ago 90% of all species disappeared, caused by Siberian volcanoes and warming oceans. send this to someone who needs perspective",
             "End-Permian extinction about 251.9 Ma: about 81-96% of marine species and about 70% of land vertebrate species lost; Siberian Traps volcanism; ocean temperatures up by about 10 C; recovery took about 5-10 million years.", "cine", n)

REELS = dict(earth_equator_bulge=bulge, escape_velocity_ladder=escape, earth_smoother_than_billiard_ball=billiard, metric_system_logic=metric, centennial_light_bulb=bulb, trex_closer_to_us_than_stegosaurus=trex_stego, bacteria_vs_human_cells=microbiome, pyramid_block_every_2_minutes=pyramid_rate, eiffel_tower_summer_growth=eiffel, the_great_dying=great_dying)
