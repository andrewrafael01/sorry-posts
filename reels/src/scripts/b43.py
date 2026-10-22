"""Batch 43: education reels, animals."""
import math
from edu import *
import functools
R = functools.partial(R, chip="ANIMALS")

def peregrine():
    n = [
     N("What is the fastest animal on Earth? Not the cheetah. Not even close. Let's race them.", T.kinetic([("FASTEST ANIMAL", WHITE, 90), ("ON EARTH?", GOLD, 120)], "green")),
     N("A human sprinter at top speed, Usain Bolt, reached about forty five kilometers an hour. That's our baseline.", T.race("top speed, km/h", [("Usain Bolt", 44.7)], unit=" km/h", fmt="{:.0f}", theme="green", secs=3.0)),
     N("A house cat can sprint at about forty eight. So Bolt and your cat are almost equal over a short sprint.", T.race("top speed, km/h", [("Usain Bolt", 44.7), ("house cat", 48)], unit=" km/h", fmt="{:.0f}", theme="green", secs=3.0)),
     N("The pronghorn antelope can run eighty eight kilometers an hour, and keep it up for many kilometers.", T.race("top speed, km/h", [("Usain Bolt", 44.7), ("house cat", 48), ("pronghorn", 88)], unit=" km/h", fmt="{:.0f}", theme="green", secs=3.0)),
     N("The cheetah is the fastest on land, about one hundred ten kilometers an hour, but only for a few hundred meters.", T.race("top speed, km/h", [("Usain Bolt", 44.7), ("house cat", 48), ("pronghorn", 88), ("cheetah", 110)], unit=" km/h", fmt="{:.0f}", theme="green", secs=3.0)),
     N("But the real winner is in the sky. When a peregrine falcon dives, it reaches three hundred ninety kilometers an hour. That's faster than a Formula One car.", T.race("top speed, km/h", [("house cat", 48), ("cheetah", 110), ("F1 car", 370), ("peregrine falcon", 389)], unit=" km/h", fmt="{:.0f}", theme="green", secs=3.5)),
     N("It folds its wings, tucks in, and drops out of the sky onto its prey. The fastest animal on Earth is a bird that falls.", T.kinetic([("THE FASTEST", WHITE, 90), ("ANIMAL FALLS", GOLD, 110)], "green")),
    ]
    return R(245, "fastest_animal_peregrine", "the fastest animal on Earth", "a peregrine falcon dives at 390 km/h, faster than a Formula One car. a cheetah only does 110. send this to a bird person",
             "Peregrine falcon stoop up to about 389 km/h (240 mph; Ken Franklin's Frank Lloyd Wright trained bird, 2005 record 389 km/h). Cheetah about 100-120 km/h, pronghorn about 88 km/h sustained, Bolt 44.7 km/h (2009), house cat about 48 km/h.", "bounce", n)

def blue_whale():
    n = [
     N("The blue whale is the biggest animal that has ever lived, bigger than any dinosaur. And its body parts are almost unbelievable.", T.kinetic([("THE BIGGEST ANIMAL", WHITE, 76), ("EVER", GOLD, 130)], "teal")),
     N("It can grow thirty meters long. That's about two and a half school buses in a row.", T.vs(("school bus", 12, CY), ("blue whale", 30, GOLD), unit=" m", fmt="{:.0f}", theme="teal", word="thirty")),
     N("It weighs up to a hundred fifty tonnes, about the same as thirty African elephants.", T.vs(("African elephant", 5, CY), ("blue whale", 150, GOLD), unit=" t", fmt="{:.0f}", theme="teal", word="tonnes")),
     N("Its heart alone weighs about a hundred eighty kilograms, roughly as much as a grand piano.", T.num("the heart weighs", 180, fmt="{:.0f}", post=" kg", color=PINK, bottom="about a grand piano", theme="teal", word="hundred", dur=1.3)),
     N("Its tongue weighs about as much as an elephant, nearly three tonnes.", T.num("the tongue", 2.7, fmt="{:.1f}", post=" tonnes", color=ORG, bottom="as heavy as an elephant", theme="teal", word="tongue", dur=1.0)),
     N("And yet it eats some of the smallest animals in the ocean. In peak season, a blue whale can eat about four tonnes of krill in a single day.", T.num("krill eaten per day", 4, fmt="{:.0f}", post=" tonnes", color=GRN, bottom="about 40 million krill", theme="teal", word="four", dur=1.0)),
     N("A newborn calf drinks around two hundred liters of milk a day and gains ninety kilograms every day. Imagine growing like that.", T.num("calf weight gain", 90, fmt="{:.0f}", post=" kg / day", color=GOLD, bottom="drinking 200 liters of milk", theme="teal", word="ninety", dur=1.0)),
     N("The largest animal ever lives in our oceans today. And we almost lost it, but protection has helped blue whales begin to recover.", T.kinetic([("STILL HERE", WHITE, 90), ("STILL GROWING", GOLD, 100)], "teal")),
    ]
    return R(246, "blue_whale_numbers", "the blue whale in numbers", "a blue whale's heart weighs as much as a grand piano and its tongue weighs as much as an elephant. send this to someone who loves the ocean",
             "Blue whale: up to about 30 m, up to about 150-190 tonnes; heart about 180 kg (preserved specimen, 2014); tongue about 2.7 tonnes; eats up to about 3.6 tonnes of krill a day; calves gain about 90 kg a day on about 200 L of milk.", "cine", n)

def octopus():
    n = [
     N("An octopus has three hearts, blue blood, and a brain that spreads into its arms. It's the closest thing we have to an alien on Earth.", T.kinetic([("THE OCTOPUS", WHITE, 100), ("IS AN ALIEN", GOLD, 120)], "teal")),
     N("First, three hearts. Two pump blood through the gills. The third sends blood around the rest of the body.", T.num("hearts", 3, fmt="{:.0f}", color=PINK, bottom="two for the gills, one for the body", theme="teal", word="three", dur=0.8)),
     N("Its blood is blue. Instead of iron, it uses copper to carry oxygen, which works better in cold, low oxygen water.", T.stat("octopus blood", "BLUE", "copper carries the oxygen, not iron", CY, "", 190, theme="teal")),
     N("The brain has about five hundred million neurons, similar to a dog. But two thirds of them are not in the head. They're in the arms.", T.ring("of its neurons are in its arms", .67, "500 million in total", VIO, theme="teal", word="two")),
     N("So each arm can solve problems on its own, tasting and feeling and deciding, even when it's cut off from the main brain.", T.kinetic([("EACH ARM", WHITE, 100), ("THINKS", GOLD, 140)], "teal")),
     N("An octopus has no bones, so it can squeeze through any gap larger than its beak, the only hard part of its body.", T.stat("the only hard part", "THE BEAK", "everything else can squeeze through", ORG, "", 150, theme="teal")),
     N("And it only lives one to five years. Most species die soon after breeding. All of that intelligence, in such a short life.", T.num("typical lifespan", 2, fmt="{:.0f}", post=" years", color=GRN, bottom="1 to 5 years, depending on species", theme="teal", word="one", dur=0.8)),
    ]
    return R(247, "octopus_alien", "the octopus is an alien", "an octopus has 3 hearts, blue blood and two thirds of its neurons in its arms. send this to someone who loves weird animals",
             "Octopus: 3 hearts (2 branchial, 1 systemic); copper-based hemocyanin makes the blood blue; about 500 million neurons, about two thirds in the arms; no skeleton, can pass through any opening larger than its beak; lifespan about 1-5 years.", "lofi", n)

def hummingbird():
    n = [
     N("A hummingbird's heart beats over a thousand times a minute, and it has to eat every ten minutes just to stay alive. Here's why.", T.kinetic([("A HUMMINGBIRD'S", WHITE, 76), ("HEART RACES", GOLD, 110)], "green")),
     N("A resting human heart beats about seventy times a minute. A hummingbird's heart, when it's flying, reaches up to twelve hundred and sixty.", T.vs(("human at rest", 70, CY), ("hummingbird flying", 1260, PINK), unit=" bpm", fmt="{:,.0f}", theme="green", word="twelve")),
     N("Its wings beat fifty to eighty times every second, a blur your eyes can't follow. That's why they can hover and even fly backward.", T.num("wingbeats per second", 53, fmt="{:.0f}", color=GOLD, bottom="50 to 80, depending on species", theme="green", word="fifty", dur=1.0)),
     N("All of this burns energy fast. A hummingbird has the highest metabolism of any warm blooded animal, and weighs just three grams, about a penny.", T.num("body weight", 3, fmt="{:.0f}", post=" grams", color=CY, bottom="about the weight of a penny", theme="green", word="three", dur=0.8)),
     N("So it feeds on nectar all day, visiting hundreds of flowers and eating many times, sometimes every ten to fifteen minutes.", T.num("flowers visited each day", 1000, fmt="{:,.0f}", color=GRN, bottom="and a meal every 10 to 15 minutes", theme="green", word="hundreds", dur=1.2)),
     N("At night, when it can't feed, it does something amazing. It goes into torpor, almost like hibernation, and its heart slows to about fifty beats a minute.", T.vs(("awake, flying", 1260, PINK), ("asleep, torpor", 50, CY), unit=" bpm", fmt="{:,.0f}", log=True, theme="green", word="fifty")),
     N("Without that trick, it would starve before morning. Even the tiniest hearts on Earth know when to slow down.", T.kinetic([("KNOW WHEN", WHITE, 90), ("TO SLOW DOWN", GOLD, 100)], "green")),
    ]
    return R(248, "hummingbird_heart", "a hummingbird's heart rate", "a hummingbird's heart beats 1,260 times a minute and it eats every 10 minutes. at night it nearly shuts down. send this to someone who needs to slow down",
             "Hummingbird heart rate up to about 1,260 bpm in flight (about 250 at rest, about 50 in torpor); wingbeats 50-80 per second; ruby-throated hummingbird about 3 g.", "bounce", n)

def elephant():
    n = [
     N("An elephant is pregnant for twenty two months. That's almost two years. And the facts about how it grows are even more incredible.", T.kinetic([("PREGNANT FOR", WHITE, 84), ("22 MONTHS", GOLD, 130)], "green")),
     N("A human pregnancy lasts nine months. A horse, eleven. A giraffe, fifteen. An elephant, twenty two, the longest of any land animal.", T.bars("pregnancy, months", [("human", 9), ("horse", 11), ("giraffe", 15), ("elephant", 22)], fmt="{:.0f}", unit=" mo", cols=[CY, GRN, ORG, GOLD], theme="green", words=["human", "horse", "giraffe", "elephant"])),
     N("The baby calf is born weighing about a hundred kilograms, and it can stand up within an hour.", T.num("a newborn calf weighs", 100, fmt="{:.0f}", post=" kg", color=PINK, bottom="and stands within an hour", theme="green", word="hundred", dur=1.0)),
     N("To make that much elephant, adults need to eat up to a hundred fifty kilograms of plants every single day.", T.num("food each day", 150, fmt="{:.0f}", post=" kg", color=GRN, bottom="of grass, leaves and bark", theme="green", word="hundred", dur=1.2)),
     N("An elephant's brain weighs about five kilograms, the largest of any land animal. It's built for memory, and they remember friends and water holes for decades.", T.num("brain", 4.8, fmt="{:.1f}", post=" kg", color=VIO, bottom="the biggest on land", theme="green", word="five", dur=1.0)),
     N("They mourn their dead. Herds return to the bones of lost family members, and touch them gently with their trunks.", T.kinetic([("THEY MOURN", WHITE, 100), ("THEIR DEAD", GOLD, 110)], "green")),
     N("Elephants live up to seventy years, led by an older female called the matriarch, whose memory can guide a whole herd through a drought.", T.num("lifespan", 70, fmt="{:.0f}", post=" years", color=CY, bottom="led by the matriarch", theme="green", word="seventy", dur=1.0)),
    ]
    return R(249, "elephant_facts", "elephants are pregnant for 22 months", "an elephant is pregnant for 22 months and eats 150 kg of food a day. send this to someone who's 'overdue'",
             "African elephant gestation about 22 months; calf about 100 kg; adult eats up to about 150 kg of vegetation daily; brain about 4.8 kg (largest land animal); lifespan up to about 70 years; matriarch-led herds.", "lofi", n)

def tardigrade():
    n = [
     N("There's an animal smaller than a grain of sand that has survived in outer space. It's called a tardigrade, or water bear.", T.kinetic([("THE ANIMAL THAT", WHITE, 70), ("SURVIVED SPACE", GOLD, 100)], "space")),
     N("It's only about half a millimeter long, with eight stubby legs, and it lives in moss, soil, and puddles all around you.", T.num("length", 0.5, fmt="{:.1f}", post=" mm", color=CY, bottom="eight legs, found everywhere", theme="space", word="half", dur=0.9)),
     N("In two thousand seven, scientists sent tardigrades into low Earth orbit, exposed to the vacuum of space and harsh radiation, for ten days.", T.num("exposed to open space for", 10, fmt="{:.0f}", post=" days", color=GOLD, bottom="vacuum and solar radiation, 2007", theme="space", word="ten", dur=0.9)),
     N("Many survived, and some even laid eggs when they came back. They can handle temperatures as low as minus two hundred seventy two degrees Celsius.", T.num("coldest they survive", -272, fmt="{:,.0f}", post="°C", color=CY, bottom="almost absolute zero", theme="space", word="minus", dur=1.2)),
     N("And as high as about one hundred fifty. They can survive radiation about a thousand times stronger than a dose that would kill a human.", T.num("hottest", 150, fmt="{:.0f}", post="°C", color=PINK, bottom="hotter than boiling water", theme="space", word="hundred", dur=1.0)),
     N("Their trick is something called cryptobiosis. They dry out, curl into a tiny ball, and shut down almost all their metabolism, waiting for water.", T.stat("their trick", "CRYPTOBIOSIS", "dry out, curl up, shut down", GRN, "", 120, theme="space")),
     N("Scientists have revived tardigrades that were frozen for thirty years. They just woke up, and walked away.", T.num("revived after", 30, fmt="{:.0f}", post=" years frozen", color=VIO, bottom="and walked away", theme="space", word="thirty", dur=1.0)),
     N("So if anything is going to survive on a harsh planet, it's probably small, strange, and very patient.", T.kinetic([("SMALL", WHITE, 100), ("STRANGE", WHITE, 100), ("UNSTOPPABLE", GOLD, 100)], "space")),
    ]
    return R(250, "tardigrade_space", "the animal that survived space", "tardigrades survived 10 days in open space and can be frozen for 30 years and wake up. send this to your most resilient friend",
             "Tardigrades (about 0.5 mm) survived 10 days exposed to vacuum and solar UV on ESA's FOTON-M3 in 2007 (Jonsson et al., Current Biology 2008); tolerate about -272 C to +150 C in cryptobiosis; a specimen was revived after about 30 years frozen (Tsujimoto et al., 2016).", "synth", n)

def ants():
    assert abs(20e15 / 8.2e9 - 2.44e6) < 1e5
    n = [
     N("For every single human alive, there are about two and a half million ants. And together, they've built something bigger than any country.", T.kinetic([("2.5 MILLION ANTS", GOLD, 100), ("PER HUMAN", WHITE, 100)], "green")),
     N("A twenty twenty two study counted all the ants on Earth and came up with twenty quadrillion. That's a twenty with fifteen zeros.", T.num("ants on Earth", 20, fmt="{:.0f}", post=" quadrillion", color=GOLD, bottom="20,000,000,000,000,000", theme="green", word="twenty", dur=1.2)),
     N("There are about eight billion people. So divide twenty quadrillion by eight billion, and you get roughly two and a half million ants for each of us.", T.formula(["20,000,000,000,000,000", "÷ 8,200,000,000", "≈ 2.4 million ants each"], theme="green", title="the math")),
     N("Some ants build supercolonies. One colony of Argentine ants stretches six thousand kilometers along the Mediterranean coast of Europe.", T.num("one supercolony", 6000, fmt="{:,.0f}", post=" km", color=CY, bottom="all one family, no fighting", theme="green", word="six", dur=1.2)),
     N("A single ant can carry up to fifty times its own body weight. For a human, that would be like lifting a school bus.", T.num("carries", 50, fmt="{:.0f}", post="× its weight", color=PINK, bottom="like a human lifting a bus", theme="green", word="fifty", dur=1.0)),
     N("And queens can live for decades. A queen ant of the black garden ant has been recorded living twenty eight years in a lab.", T.num("a queen's lifespan", 28, fmt="{:.0f}", post=" years", color=VIO, bottom="one of the longest-lived insects", theme="green", word="twenty", dur=1.0)),
     N("Next time you step over an ant, remember. You're stepping over one member of the most numerous society on the planet.", T.kinetic([("THE MOST", WHITE, 90), ("NUMEROUS SOCIETY", GOLD, 80)], "green")),
    ]
    return R(251, "ants_per_person", "2.5 million ants for every human", "there are about 20 quadrillion ants, 2.5 million for every person alive. send this to someone who hates bugs",
             "Schultheiss et al., PNAS 2022: about 20 quadrillion ants (2e16). 2e16 / 8.2e9 = 2.4 million per person. Argentine ant supercolony about 6,000 km (Giraud 2002). Queen Lasius niger lived 28 years in captivity.", "bounce", n)

def shark_tree():
    n = [
     N("Sharks are older than trees. Not by a little. Sharks were swimming in the oceans long before the first forest ever grew.", T.kinetic([("SHARKS ARE OLDER", WHITE, 70), ("THAN TREES", GOLD, 110)], "teal")),
     N("The first shark-like fish appeared about four hundred fifty million years ago. The first real trees showed up around three hundred eighty five million years ago.", T.timeline("millions of years ago", [(-450, "first sharks"), (-385, "first trees")], -460, 0, theme="teal", fmtx=lambda x: f"{abs(x):.0f} Ma")),
     N("That gives sharks a head start of about sixty five million years. About as long as the time since the dinosaurs died.", T.num("sharks' head start", 65, fmt="{:.0f}", post=" million years", color=GOLD, bottom="as long as since the dinosaurs died", theme="teal", word="sixty", dur=1.0)),
     N("Sharks are also older than the dinosaurs, who first appeared around two hundred thirty million years ago.", T.timeline("millions of years ago", [(-450, "sharks"), (-385, "trees"), (-230, "dinosaurs")], -460, 0, theme="teal", fmtx=lambda x: f"{abs(x):.0f} Ma")),
     N("They survived all five mass extinctions, including the Great Dying, which wiped out about ninety percent of all species, and the one that killed the dinosaurs.", T.num("mass extinctions survived", 5, fmt="{:.0f}", color=PINK, bottom="sharks outlived them all", theme="teal", word="five", dur=0.8)),
     N("Compared to sharks, our species is brand new. Humans have existed for only about three hundred thousand years.", T.timeline("millions of years ago", [(-450, "sharks"), (-230, "dinosaurs"), (-0.3, "humans")], -460, 10, theme="teal", fmtx=lambda x: f"{abs(x):.1f} Ma")),
     N("So when you swim in the ocean, you're visiting an ancient neighborhood. The sharks were here first. They deserve some respect.", T.kinetic([("THEY WERE", WHITE, 90), ("HERE FIRST", GOLD, 120)], "teal")),
    ]
    return R(252, "sharks_older_than_trees", "sharks are older than trees", "sharks are about 450 million years old, trees only 385 million. sharks were here before the dinosaurs. send this to someone who's afraid of the ocean",
             "Oldest shark-like scales about 450 Ma (Ordovician); earliest trees (Wattieza/Archaeopteris) about 385 Ma (Devonian); dinosaurs about 230 Ma; Homo sapiens about 300,000 years.", "cine", n)

def honeybee():
    n = [
     N("A single honeybee will make about one twelfth of a teaspoon of honey in its entire life. That's all. So how does a jar of honey exist?", T.kinetic([("ONE BEE", WHITE, 100), ("= 1/12 TEASPOON", GOLD, 100)], "warm")),
     N("A worker bee only lives about six weeks in summer, and spends most of it working. She visits flowers, collects nectar, and brings it back.", T.num("a worker's summer life", 6, fmt="{:.0f}", post=" weeks", color=ORG, bottom="of non-stop work", theme="warm", word="six", dur=0.8)),
     N("Twelve bees working their whole lives make one teaspoon of honey. A single teaspoon of that sweet gold took twelve lives.", T.num("bees per teaspoon", 12, fmt="{:.0f}", color=GOLD, bottom="a lifetime of work each", theme="warm", word="twelve", dur=0.9)),
     N("To make just one pound of honey, a colony visits about two million flowers.", T.num("flowers for 1 pound of honey", 2, fmt="{:.0f}", post=" million", color=PINK, bottom="visited by the whole hive", theme="warm", word="two", dur=1.0)),
     N("And the bees fly about fifty five thousand miles to make that pound, more than twice around the Earth.", T.num("distance flown", 55000, fmt="{:,.0f}", post=" miles", color=CY, bottom="more than twice around the Earth", theme="warm", word="fifty", dur=1.4)),
     N("They also tell each other where the flowers are, by dancing. The angle and length of the waggle dance shows direction and distance to the food.", T.stat("the waggle dance", "A MAP IN MOTION", "angle = direction, length = distance", GRN, "", 100, theme="warm")),
     N("So next time you put honey in your tea, take a moment. You're tasting the life's work of a dozen tiny dancers.", T.kinetic([("12 BEES", GOLD, 130), ("IN YOUR TEA", WHITE, 90)], "warm")),
    ]
    return R(253, "honeybee_teaspoon", "how much honey does one bee make", "one honeybee makes 1/12 of a teaspoon of honey in her whole life. a pound of honey takes 2 million flowers. send this to a honey lover",
             "Worker bee lifetime honey production about 1/12 teaspoon; about 12 bees per teaspoon; one pound of honey requires about 2 million flower visits and about 55,000 miles of flight (commonly cited by beekeeping extensions).", "lofi", n)

def giraffe():
    n = [
     N("A giraffe has the longest neck of any animal, but it has the same number of neck bones as you. Seven. Here's the incredible design.", T.kinetic([("GIRAFFE NECK", WHITE, 100), ("= YOUR NECK", GOLD, 100), ("BUT BIGGER", WHITE, 70)], "warm")),
     N("Almost all mammals, from mice to whales to humans, have exactly seven neck vertebrae. A giraffe's are just enormous, each one up to a quarter of a meter long.", T.num("neck bones, same as you", 7, fmt="{:.0f}", color=GOLD, bottom="each up to 25 cm long", theme="warm", word="seven", dur=0.8)),
     N("The neck is about two meters long. To push blood all the way up to the brain, the heart has to be huge, about eleven kilograms.", T.num("a giraffe's heart", 11, fmt="{:.0f}", post=" kg", color=PINK, bottom="pumping blood 2 meters uphill", theme="warm", word="eleven", dur=0.9)),
     N("Its blood pressure is about twice as high as ours, which is why a giraffe has special valves and tight skin in its legs, to stop blood pooling.", T.vs(("human", 120, CY), ("giraffe", 280, PINK), unit=" mmHg", fmt="{:.0f}", theme="warm", word="twice")),
     N("The tongue is about forty five centimeters long, and dark bluish black, which protects it from the sun while eating high acacia leaves.", T.num("tongue length", 45, fmt="{:.0f}", post=" cm", color=VIO, bottom="dark to resist sunburn", theme="warm", word="forty", dur=1.0)),
     N("A baby giraffe is born standing up. It falls nearly two meters to the ground at birth, and is on its feet within an hour.", T.num("the drop at birth", 1.8, fmt="{:.1f}", post=" meters", color=ORG, bottom="standing within an hour", theme="warm", word="falls", dur=1.0)),
     N("And giraffes sleep very little, from about half an hour to a few hours a day. Tall, quiet, and always alert.", T.kinetic([("TALL.", WHITE, 100), ("QUIET.", WHITE, 100), ("ALERT.", GOLD, 100)], "warm")),
    ]
    return R(254, "giraffe_neck", "giraffe neck facts", "a giraffe has the same 7 neck bones as you, and its heart weighs 11 kg. send this to your tallest friend",
             "Giraffes have 7 cervical vertebrae like nearly all mammals (each up to about 25 cm); neck about 1.8-2 m; heart about 11 kg; blood pressure about 280/180 mmHg; tongue about 45-50 cm; calf drops about 1.8 m at birth.", "lofi", n)

REELS = dict(fastest_animal_peregrine=peregrine, blue_whale_numbers=blue_whale, octopus_alien=octopus, hummingbird_heart=hummingbird, elephant_facts=elephant, tardigrade_space=tardigrade, ants_per_person=ants, sharks_older_than_trees=shark_tree, honeybee_teaspoon=honeybee, giraffe_neck=giraffe)
