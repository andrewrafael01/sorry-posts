"""Batch 42: education reels, the human body."""
import math
from edu import *
import functools
R = functools.partial(R, chip="YOUR BODY")

def heart():
    perday = 72 * 1440; life = perday * 365 * 80; liters = 5 * 1440 * 365 * 80
    assert 2.9e9 < life < 3.1e9 and 80 < liters / 2.5e6 < 90
    n = [
     N("Your heart has never taken a day off. Not one. Let's count what it has done for you so far, and what it will do in a lifetime.", T.kinetic([("YOUR HEART", WHITE, 100), ("NEVER STOPS", GOLD, 120)], "warm")),
     N("It beats about a hundred thousand times every single day. That's about seventy two beats every minute, all day, all night, even while you sleep.", T.num("beats per day", 103680, fmt="{:,.0f}", color=PINK, bottom="about 72 every minute", theme="warm", word="hundred", dur=1.6)),
     N("Over eighty years, that adds up to almost three billion heartbeats. And you never had to think about a single one.", T.num("beats in 80 years", 2.9e9, fmt="{:,.0f}", color=GOLD, bottom="nearly 3 billion", theme="warm", word="eighty", dur=1.8)),
     N("A single drop of blood makes a complete lap of your body, out to your toes and back to your heart, in about one minute.", T.num("one full lap of your body", 60, fmt="{:.0f}", post=" seconds", color=CY, bottom="for every drop of blood", theme="warm", word="minute", dur=1.2)),
     N("In one day your heart pumps about seven thousand liters of blood. That's enough to fill thirty five bathtubs.", T.num("liters pumped per day", 7200, fmt="{:,.0f}", color=PINK, bottom="about 35 bathtubs", theme="warm", word="seven", dur=1.4)),
     N("In a lifetime, that's around two hundred million liters. Enough to fill eighty four Olympic swimming pools, from a muscle the size of your fist.", T.num("Olympic pools of blood", 84, fmt="{:.0f}", color=GOLD, bottom="from a fist-sized muscle", theme="warm", word="eighty", dur=1.2)),
     N("And it does all of that on about one point three watts of power at rest. A tiny, tireless pump. Be kind to it.", T.kinetic([("1.3 WATTS", GOLD, 130), ("be kind to it", WHITE, 70)], "warm")),
    ]
    return R(235, "heartbeats_lifetime", "your heart in numbers", "your heart beats 100,000 times a day and pumps 84 Olympic pools of blood in a lifetime. send this to someone you love",
             "72 bpm x 1,440 = 103,680/day; x 365 x 80 = 3.0e9 beats. Cardiac output about 5 L/min = 7,200 L/day = 210 million L in 80 years = 84 Olympic pools (2.5 million L). Resting cardiac power about 1-1.5 W.", "lofi", n)

def brain():
    n = [
     N("Your brain is two percent of your body weight. But it burns twenty percent of your energy. Here's where all that power goes.", T.kinetic([("2% OF YOUR WEIGHT", WHITE, 84), ("20% OF YOUR ENERGY", GOLD, 84)], "warm")),
     N("Inside are about eighty six billion neurons, nerve cells that talk to each other with tiny electric signals.", T.num("neurons", 86, fmt="{:.0f}", post=" billion", color=PINK, bottom="the same ballpark as stars in our galaxy", theme="warm", word="eighty", dur=1.4)),
     N("Each one connects to thousands of others. Together there are at least a hundred trillion connections.", T.num("connections", 100, fmt="{:.0f}", post=" trillion", color=GOLD, bottom="each neuron links to thousands", theme="warm", word="hundred", dur=1.4)),
     N("Signals race along the fastest nerves at about a hundred twenty meters a second. That's two hundred seventy miles an hour.", T.num("signal speed", 270, fmt="{:.0f}", post=" mph", color=CY, bottom="120 meters per second", theme="warm", word="hundred", dur=1.2)),
     N("And all of that runs on just twenty watts, about the same as a dim light bulb.", T.num("brain power", 20, fmt="{:.0f}", post=" watts", color=GRN, bottom="a dim light bulb", theme="warm", word="twenty", dur=1.0)),
     N("The world's fastest supercomputer uses over twenty million watts. A million times more power, to do things your brain does effortlessly.", T.vs(("your brain", 20, GRN), ("supercomputer", 21000000, ORG), unit=" W", fmt="{:,.0f}", log=True, theme="warm", word="supercomputer")),
     N("So when you feel too tired to think, remember. The most powerful computer you own runs on the energy of a light bulb.", T.kinetic([("YOU RUN ON", WHITE, 80), ("20 WATTS", GOLD, 140)], "warm")),
    ]
    return R(236, "brain_20_watts", "your brain runs on 20 watts", "your brain is 2% of your weight and uses 20% of your energy, on just 20 watts. send this to someone who needs a nap",
             "Human brain about 86 billion neurons (Azevedo 2009), about 20% of resting energy, about 20 W. Fast myelinated axons about 120 m/s (268 mph). Frontier exascale supercomputer draws about 21-22 MW.", "lofi", n)

def bones():
    n = [
     N("Babies have more bones than adults. A lot more. And the missing bones are not lost. They are fused. Here's what happens.", T.kinetic([("BABIES HAVE", WHITE, 90), ("MORE BONES", GOLD, 120)], "warm")),
     N("A newborn has around three hundred bones, mostly soft cartilage that will slowly harden.", T.num("bones at birth", 300, fmt="{:.0f}", color=PINK, bottom="soft and flexible", theme="warm", word="three", dur=1.2)),
     N("An adult has just two hundred six. Over the years, many of those small bones join together into bigger ones.", T.num("bones in an adult", 206, fmt="{:.0f}", color=GOLD, bottom="about 100 fewer", theme="warm", word="two", dur=1.2)),
     N("Your skull is a good example. At birth it's several separate plates with soft gaps between them, so the head can squeeze through during birth.", T.stat("the baby's skull", "SEVERAL PLATES", "soft gaps let the head squeeze through", CY, "", 90, theme="warm")),
     N("Those soft spots close by around age two, and the plates slowly lock together into one solid protective helmet.", T.num("soft spots close by", 2, fmt="{:.0f}", post=" years", color=GRN, bottom="then the plates lock into a helmet", theme="warm", word="two", dur=0.8)),
     N("And here's a surprise. More than half of all the bones in your body are in your hands and feet. Each hand has twenty seven bones, each foot twenty six.", T.ring("of your bones are in your hands and feet", .51, "106 of 206", ORG, theme="warm", word="more")),
     N("The longest bone is the thigh bone. The smallest is a tiny bone inside your ear, about three millimeters long. Both are working for you right now.", T.vs(("thigh bone", 480, GOLD), ("ear bone", 3, CY), unit=" mm", fmt="{:,.0f}", log=True, theme="warm", word="longest")),
    ]
    return R(237, "baby_bones", "babies have more bones than adults", "a baby has about 300 bones, an adult has 206. over half your bones are in your hands and feet. send this to a new parent",
             "Newborn about 270-300 bones (many cartilaginous), adult 206; hands 27 each and feet 26 each = 106 bones (51%). Femur about 48 cm; stapes about 3 mm.", "lofi", n)

def replaced():
    n = [
     N("Your body is rebuilding itself right now. Some parts in days, some over years. Here's the schedule.", T.kinetic([("YOU ARE REBUILT", WHITE, 84), ("CONSTANTLY", GOLD, 120)], "warm")),
     N("Your red blood cells live about a hundred twenty days, and your body makes around two million new ones every single second.", T.num("new red blood cells every second", 2.4, fmt="{:.1f}", post=" million", color=PINK, bottom="they live about 120 days", theme="warm", word="two", dur=1.2)),
     N("The lining of your stomach is replaced every few days. If it weren't, your own acid would digest you.", T.num("stomach lining replaced in", 4, fmt="{:.0f}", post=" days", color=ORG, bottom="or your acid would eat you", theme="warm", word="days", dur=0.9)),
     N("The outer layer of your skin renews roughly every four weeks, and the old cells just flake away.", T.num("skin renews in", 4, fmt="{:.0f}", post=" weeks", color=CY, bottom="old cells flake away", theme="warm", word="four", dur=0.8)),
     N("Even your skeleton is constantly remodeled. Old bone is dissolved and new bone is built. About every ten years, you have a nearly new skeleton.", T.num("skeleton renewed in", 10, fmt="{:.0f}", post=" years", color=GOLD, bottom="constant remodeling", theme="warm", word="ten", dur=1.0)),
     N("There are exceptions. Most of the neurons in your brain, and the lens of your eyes, stay with you for your whole life.", T.stat("never replaced", "NEURONS + EYE LENS", "stay with you for life", GRN, "", 80, theme="warm")),
     N("So you are less a thing and more a pattern, one that keeps rebuilding itself from the food you eat. The same you, made from new material.", T.kinetic([("YOU'RE A PATTERN", WHITE, 76), ("NOT A THING", GOLD, 110)], "warm")),
    ]
    return R(238, "body_rebuilt", "your body replaces itself", "your body makes 2 million new red blood cells every second and has a nearly new skeleton every 10 years. send this to someone who 'hasn't changed'",
             "Red cells live about 120 days, with about 2-2.5 million made per second; stomach lining turns over in about 3-5 days; epidermis about 28 days; skeleton remodels about every 10 years; cortical neurons and the lens are largely lifelong.", "lofi", n)

def breaths():
    n = [
     N("You take about twenty thousand breaths every day, and you almost never notice. Let's look at what those breaths really add up to.", T.kinetic([("20,000 BREATHS", GOLD, 110), ("A DAY", WHITE, 90)], "warm")),
     N("At rest, an adult breathes about twelve to twenty times a minute. That's roughly seventeen thousand to twenty nine thousand breaths a day.", T.num("breaths per day", 20000, fmt="{:,.0f}", color=CY, bottom="12 to 20 every minute", theme="warm", word="twelve", dur=1.4)),
     N("Each breath moves about half a liter of air. Over a day, you move around ten thousand liters through your lungs.", T.num("liters of air a day", 10000, fmt="{:,.0f}", color=GOLD, bottom="half a liter each breath", theme="warm", word="half", dur=1.4)),
     N("In an eighty year life, that's about six hundred million breaths.", T.num("breaths in a lifetime", 600, fmt="{:.0f}", post=" million", color=PINK, bottom="about 80 years", theme="warm", word="six", dur=1.2)),
     N("And here's a strange fact. Only about twenty one percent of the air you inhale is oxygen. You take in some, and breathe out the rest.", T.ring("of the air is oxygen", .21, "the rest is mostly nitrogen", CY, theme="warm", word="twenty")),
     N("Even more surprising. The air you exhale still has about sixteen percent oxygen. That's why mouth to mouth rescue breathing can save a life.", T.ring("oxygen in the air you breathe out", .16, "enough to keep someone alive", GRN, theme="warm", word="sixteen")),
     N("Breathing is the only automatic function you can also control. Take a slow deep breath right now. You just reset your nervous system.", T.kinetic([("TRY IT:", WHITE, 80), ("BREATHE SLOWLY", GOLD, 100), ("4 SECONDS IN", CY, 80)], "warm")),
    ]
    return R(239, "breaths_a_day", "you breathe 20,000 times a day", "you take about 20,000 breaths a day and 600 million in a lifetime. the air you breathe out is still 16% oxygen. send this to someone who needs to relax",
             "Resting adult 12-20 breaths/min = 17,000-29,000/day; tidal volume about 0.5 L => about 8,000-10,000 L/day; 80 years about 5.8e8 breaths. Inhaled air 20.9% O2, exhaled about 16% O2.", "lofi", n)

def reaction():
    d = .5 * 9.81 * .2 ** 2; assert abs(d - .196) < .001
    n = [
     N("Here's a test you can do right now with a ruler. It measures how fast your brain reacts, and it's pure physics.", T.kinetic([("THE RULER TEST", GOLD, 120), ("try it now", WHITE, 70)], "warm")),
     N("Have a friend hold a ruler at the top. Put your fingers at the bottom. They drop it without warning. You catch it as fast as you can.", T.steps("how to do it", [("1. friend holds the ruler", ""), ("2. fingers at the bottom", ""), ("3. drop it. catch it.", "")], theme="warm", words=["friend", "fingers", "drop"])),
     N("The ruler falls because of gravity, so the distance it fell tells you the time. Twenty centimeters means two tenths of a second.", T.formula(["distance = ½ g t²", "20 cm = 0.2 seconds"], theme="warm", title="gravity is the stopwatch")),
     N("An average person catches it near twenty centimeters, about point two to point two five seconds. That's your reaction time.", T.num("average reaction", 0.22, fmt="{:.2f}", post=" s", color=GOLD, bottom="a 20 cm catch", theme="warm", word="point", dur=1.0)),
     N("Eleven centimeters means a fast point one five seconds. Thirty centimeters is a slow point two five. Tired or distracted people catch it much later.", T.bars("ruler caught at", [("11 cm", .15), ("20 cm", .20), ("30 cm", .25)], fmt="{:.2f}", unit=" s", cols=[GRN, GOLD, PINK], theme="warm", words=["Eleven", "twenty", "Thirty"])),
     N("In sprinting, a runner who reacts to the starting gun in under one tenth of a second is called a false start. Humans can't react that fast. They must have guessed.", T.num("false start limit", 0.1, fmt="{:.1f}", post=" s", color=PINK, bottom="faster than humans can react", theme="warm", word="one", dur=0.8)),
     N("Now try it five times. Your reaction time will be different every time. And it gets worse when you're tired. That's why drowsy driving is so dangerous.", T.kinetic([("TIRED = SLOWER", WHITE, 84), ("DON'T DRIVE", PINK, 110), ("DROWSY", PINK, 110)], "warm")),
    ]
    return R(240, "ruler_reaction_test", "the ruler reaction test", "catch a falling ruler: 20 cm = 0.2 seconds of reaction time. try it and tell me your score. send this to a friend and test them",
             "d = 1/2 g t^2: 20 cm falls in 0.202 s; 11 cm in 0.15 s; 30 cm in 0.25 s. Typical simple visual reaction time 0.2-0.25 s. World Athletics false-start threshold is a reaction under 0.100 s.", "bounce", n)

def steps():
    n = [
     N("You've heard you need ten thousand steps a day. It's on every watch and every phone. But where did that number even come from?", T.kinetic([("10,000 STEPS", GOLD, 120), ("A DAY?", WHITE, 100)], "green")),
     N("It started as a marketing slogan. In nineteen sixty five, a Japanese company sold a pedometer called the Manpo-kei, which literally means ten thousand steps meter.", T.stat("the origin", "1965", "a Japanese pedometer ad", GOLD, "Manpo-kei: '10,000 steps meter'", 190, theme="green")),
     N("Ten thousand sounded nice and round, and it made a catchy slogan. There was no scientific study behind it.", T.kinetic([("ROUND + CATCHY", GOLD, 100), ("NOT SCIENTIFIC", WHITE, 84)], "green")),
     N("So what does the science say? A large two thousand twenty five review pooled data from over one hundred sixty thousand adults.", T.num("adults studied", 160, fmt="{:.0f}", post=",000+", color=CY, bottom="a 2025 review in The Lancet", theme="green", word="over", dur=1.2)),
     N("It found that health benefits climb fast at first. Walking seven thousand steps a day was linked to nearly half the risk of dying early, compared with two thousand steps.", T.ring("lower risk of early death at 7,000 steps", .47, "versus 2,000 steps", GRN, theme="green", word="seven")),
     N("Past about seven thousand, the extra benefit gets smaller. And most of the gain comes from moving more than you do now.", T.steps("what the research says", [("2,000 → 7,000", "biggest jump in benefit"), ("7,000 → 10,000", "smaller extra gains")], theme="green", words=["Past", "extra"])),
     N("So the best step count is the one you'll actually do. Go for a walk today, not for the slogan, but because every extra step counts.", T.kinetic([("MORE STEPS", WHITE, 90), ("= BETTER", GOLD, 120)], "green")),
    ]
    return R(241, "ten_thousand_steps", "where 10,000 steps came from", "10,000 steps started as a 1965 Japanese pedometer ad. the science says 7,000 gets you most of the benefit. send this to someone who's counting",
             "Manpo-kei pedometer (Yamasa, 1965). Lancet Public Health 2025 meta-analysis of 57 studies (more than 160,000 adults): 7,000 steps/day linked to about 47% lower all-cause mortality vs 2,000; benefits continue to rise to about 10,000 more slowly.", "lofi", n)

def water():
    n = [
     N("Your body is mostly water. But not evenly. Some parts are almost pure water and some are almost dry. The numbers might surprise you.", T.kinetic([("YOU ARE", WHITE, 90), ("60% WATER", GOLD, 130)], "teal")),
     N("An adult is about sixty percent water. A newborn baby is even more, around seventy eight percent.", T.vs(("adult", 60, CY), ("newborn", 78, GOLD), unit="%", fmt="{:.0f}", theme="teal", word="adult")),
     N("Your lungs are about eighty three percent water. Your brain and heart are about seventy three. Your skin, sixty four.", T.bars("percent water", [("lungs", 83), ("brain and heart", 73), ("skin", 64), ("muscles", 79)], fmt="{:.0f}", unit="%", theme="teal", sort=True)),
     N("Surprisingly, even your bones are about thirty one percent water. Your body fat holds the least, around ten percent.", T.bars("percent water", [("bones", 31), ("body fat", 10)], fmt="{:.0f}", unit="%", cols=[CY, ORG], theme="teal", words=["bones", "fat"])),
     N("You lose about two and a half liters of water a day, through breathing, sweating, and the bathroom. That has to be replaced.", T.num("lost every day", 2.5, fmt="{:.1f}", post=" liters", color=PINK, bottom="breathing, sweat, waste", theme="teal", word="two", dur=1.0)),
     N("But you don't need to drink all of it. A lot comes from food. Fruits and vegetables are up to ninety percent water.", T.ring("a cucumber is", .96, "water", GRN, theme="teal", word="ninety")),
     N("So the rule of eight glasses a day is not a law. Your thirst, your food, and the weather all matter. Drink when you're thirsty, and check your color.", T.kinetic([("PALE YELLOW", GOLD, 110), ("= WELL HYDRATED", WHITE, 70)], "teal")),
    ]
    return R(242, "body_water", "your body is 60% water", "your lungs are 83% water, your bones 31%, and a cucumber 96%. send this to someone who forgets to drink water",
             "Adult body about 60% water (newborn about 78%). Lungs about 83%, muscles/kidneys about 79%, brain/heart about 73%, skin about 64%, bones about 31%, adipose tissue about 10% (Mitchell 1945 / USGS). Cucumber about 96% water.", "lofi", n)

def dna():
    n = [
     N("Any two humans on Earth share ninety nine point nine percent of their DNA. So where do all our differences come from?", T.kinetic([("99.9% THE SAME", GOLD, 100), ("so what's different?", WHITE, 64)], "green")),
     N("Your DNA has about three billion letters. A difference of point one percent still means about three million places where you and any other person differ.", T.num("differences between any two people", 3, fmt="{:.0f}", post=" million", color=PINK, bottom="out of 3 billion letters", theme="green", word="three", dur=1.2)),
     N("It gets stranger. Compared with a chimpanzee, you share about ninety eight point eight percent of your DNA.", T.ring("shared with a chimpanzee", .988, "98.8%", ORG, theme="green", word="ninety")),
     N("With a mouse, about eighty five percent of the protein coding genes are matched. Even with a fruit fly, about sixty percent of human genes have a counterpart.", T.bars("shared with humans", [("another human", 99.9), ("chimpanzee", 98.8), ("mouse", 85), ("fruit fly", 60)], fmt="{:.1f}", unit="%", cols=[GOLD, ORG, CY, GRN], theme="green", words=["human", "chimpanzee", "mouse", "fruit"])),
     N("That's because life shares a common toolkit. The same genes that build a fruit fly's body plan help build yours.", T.kinetic([("ONE TOOLKIT", WHITE, 100), ("FOR ALL LIFE", GOLD, 100)], "green")),
     N("And if you could stretch out the DNA from a single human cell, it would be about two meters long, folded inside a space far smaller than a speck of dust.", T.num("DNA in one cell", 2, fmt="{:.0f}", post=" meters", color=CY, bottom="inside a microscopic nucleus", theme="green", word="two", dur=0.8)),
     N("So you are almost identical to every stranger you meet, and distantly related to every living thing. We're a lot closer than we look.", T.kinetic([("WE'RE ALL", WHITE, 90), ("FAMILY", GOLD, 140)], "green")),
    ]
    return R(243, "dna_shared", "how much DNA do we share", "any two humans share 99.9% of their DNA, with chimps 98.8%, with a fruit fly 60% of genes have a match. send this to someone who thinks they're different",
             "Human genome about 3.1 billion base pairs; two people differ at about 0.1% (about 3-4 million sites). Chimpanzee about 98.8% identity (2005). Mouse about 85% in coding regions; about 60% of human genes have a fruit fly ortholog. One cell's DNA is about 2 m.", "lofi", n)

def sleep_loss():
    n = [
     N("Staying awake for just seventeen hours makes you as impaired as a person who's had a couple of drinks. And most people do it without noticing.", T.kinetic([("17 HOURS AWAKE", GOLD, 100), ("= DRUNK?", WHITE, 100)], "warm")),
     N("In a famous study, researchers compared the performance of people kept awake with people who had been drinking alcohol.", T.kinetic([("AWAKE vs", WHITE, 80), ("ALCOHOL", GOLD, 110)], "warm")),
     N("After seventeen to nineteen hours without sleep, performance dropped to the level of someone with a blood alcohol content of point zero five percent.", T.num("17-19 hours awake", 0.05, fmt="{:.2f}", post="% BAC", color=ORG, bottom="about two drinks", theme="warm", word="seventeen", dur=1.2)),
     N("After twenty four hours, it's like point one percent. That's above the legal driving limit in nearly every country.", T.num("24 hours awake", 0.10, fmt="{:.2f}", post="% BAC", color=PINK, bottom="over the legal limit", theme="warm", word="twenty", dur=1.2)),
     N("The longest recorded period without sleep is eleven days, set by a teenager named Randy Gardner in nineteen sixty four. He hallucinated, forgot words, and could barely focus.", T.num("Randy Gardner, 1964", 11, fmt="{:.0f}", post=" days", color=CY, bottom="264 hours without sleep", theme="warm", word="eleven", dur=1.0)),
     N("That is why drowsy driving is so dangerous. Tired drivers react slower, and some fall asleep at the wheel for a few seconds, which is long enough.", T.kinetic([("DROWSY DRIVING", PINK, 100), ("IS DANGEROUS", WHITE, 84)], "warm")),
     N("So an all nighter is not a badge of honor. If you have to drive, sleep first. Your brain at seventeen hours is not your best brain.", T.kinetic([("SLEEP FIRST", GOLD, 120), ("DRIVE SECOND", WHITE, 90)], "warm")),
    ]
    return R(244, "sleep_vs_drunk", "17 hours awake equals being drunk", "17 hours without sleep impairs you like a 0.05% blood alcohol level. 24 hours is like 0.10%. send this to someone who pulls all nighters",
             "Williamson & Feyer (2000), Occup Environ Med: 17-19 h of wakefulness gives performance equivalent to BAC 0.05%; after 24 h equivalent to 0.10%. Randy Gardner stayed awake 264 hours (11 days) in 1964.", "lofi", n)

REELS = dict(heartbeats_lifetime=heart, brain_20_watts=brain, baby_bones=bones, body_rebuilt=replaced, breaths_a_day=breaths, ruler_reaction_test=reaction, ten_thousand_steps=steps, body_water=water, dna_shared=dna, sleep_vs_drunk=sleep_loss)
