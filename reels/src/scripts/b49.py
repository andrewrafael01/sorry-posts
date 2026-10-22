"""Batch 49: education reels, maths curiosities."""
import math
from edu import *
import functools
R = functools.partial(R, chip="MATHS")

def monty():
    n = [
     N("You're on a game show. Three doors. A car behind one, goats behind the other two. You pick a door. Then the host opens another door, showing a goat, and asks, do you want to switch? Should you?", T.kinetic([("3 DOORS", WHITE, 110), ("1 CAR", GOLD, 110), ("SWITCH OR STAY?", PINK, 84)], "ink")),
     N("Most people say it doesn't matter. Two doors left, so it's fifty fifty. But that's wrong. Switching wins two thirds of the time.", T.num("chance of winning if you switch", 66.7, fmt="{:.1f}", post="%", color=GOLD, bottom="not 50%", theme="ink", word="two", dur=1.4)),
     N("Here's why. When you first pick, you have a one in three chance of being right, and a two in three chance of being wrong.", T.dots("your first pick", [(33, GOLD, "car"), (67, MUT, "goat")], theme="ink")),
     N("The host knows where the car is. He will always open a door with a goat. So he isn't picking randomly. He's giving you information.", T.kinetic([("THE HOST", WHITE, 100), ("KNOWS", GOLD, 140)], "ink")),
     N("If your first pick was wrong, which happens two thirds of the time, the host must leave the car as the other door. Switching wins.", T.ring("you picked wrong at first", .6667, "so switching wins", GRN, theme="ink", word="wrong")),
     N("If your first pick was right, which happens a third of the time, switching loses. So switching wins in the two thirds where you started wrong.", T.bars("win rate", [("stay", 33.3), ("switch", 66.7)], fmt="{:.1f}", unit="%", cols=[PINK, GRN], theme="ink", words=["stay", "switching"])),
     N("Still unsure? Imagine a hundred doors. You pick one, and the host opens ninety eight goats. Would you switch to the last door? Of course. That's the same logic.", T.num("switch wins with 100 doors", 99, fmt="{:.0f}", post="%", color=GOLD, bottom="the same logic, scaled up", theme="ink", word="hundred", dur=1.0)),
     N("This famous puzzle fooled thousands of readers, including professional mathematicians, who wrote angry letters. When they ran simulations, they all agreed. Switch.", T.kinetic([("ALWAYS", WHITE, 100), ("SWITCH", GOLD, 150)], "ink")),
    ]
    return R(307, "monty_hall_switch", "the Monty Hall problem", "in the Monty Hall problem switching wins 2/3 of the time, not 50/50. send this to someone who thinks they're good at probability",
             "Monty Hall: P(win | stay) = 1/3, P(win | switch) = 2/3 (host knows and always opens a goat door). With 100 doors and 98 goats opened, switching wins 99/100. Popularised by Marilyn vos Savant's Parade column (1990).", "synth", n)

def point_nine():
    n = [
     N("Is zero point nine nine nine, repeating forever, equal to one? Most people say no. It's so close, but not quite one. The math says they're exactly equal.", T.kinetic([("0.999...", GOLD, 140), ("= 1 ?", WHITE, 140)], "ink")),
     N("Start with something you already agree with. One third is zero point three three three, repeating forever.", T.formula(["1 ÷ 3 = 0.333..."], theme="ink", title="step one")),
     N("Now multiply both sides by three. Three times one third is one. And three times zero point three three three is zero point nine nine nine.", T.formula(["3 × (1 ÷ 3) = 1", "3 × 0.333... = 0.999...", "so 0.999... = 1"], theme="ink", title="step two")),
     N("Still not convinced? Here's another way. Call the number x, equal to zero point nine nine nine repeating.", T.formula(["x = 0.999..."], theme="ink", title="another proof")),
     N("Multiply by ten. Ten x equals nine point nine nine nine, repeating. Now subtract the original x from both sides.", T.formula(["10x = 9.999...", "−  x = 0.999...", "9x = 9"], theme="ink")),
     N("That leaves nine x equals nine. So x equals one. Zero point nine nine nine repeating really is one.", T.formula(["9x = 9", "x = 1"], theme="ink", title="done")),
     N("There's no gap between them, no tiny number you can squeeze in. Two names, one number. Math doesn't care what looks close. It cares what's equal.", T.kinetic([("TWO NAMES", WHITE, 100), ("ONE NUMBER", GOLD, 120)], "ink")),
    ]
    return R(308, "zero_point_nine_repeating", "0.999... equals 1", "0.999 repeating is exactly equal to 1, here's the proof. send this to someone who disagrees",
             "1/3 = 0.333...; 3 x 1/3 = 1 = 0.999.... Also x = 0.999..., 10x = 9.999..., 9x = 9, x = 1. In the real numbers there is no number between 0.999... and 1, so they are the same number.", "synth", n)

def rubik():
    perms = 43252003274489856000; ly = perms * .057 / 9.4607e15; assert 255 < ly < 265; assert abs(4.35e17 / perms - .01) < .001
    n = [
     N("A Rubik's cube has forty three quintillion possible positions. That's a number so large that it's hard to even say. Let's make it real.", T.kinetic([("43 QUINTILLION", GOLD, 110), ("POSITIONS", WHITE, 100)], "ink")),
     N("That's forty three million million million. In digits, a four three followed by eighteen zeros.", T.num("positions", 43.25, fmt="{:.2f}", post=" quintillion", color=GOLD, bottom="43,252,003,274,489,856,000", theme="ink", word="forty", dur=1.6)),
     N("Say you could try one position every second, since the universe began, about thirteen point eight billion years ago.", T.num("seconds since the Big Bang", 4.35, fmt="{:.2f}", post=" × 10¹⁷", color=CY, bottom="13.8 billion years", theme="ink", word="universe", dur=1.4)),
     N("After all that time, you'd have seen only about one percent of all the positions.", T.ring("of all positions, seen since the Big Bang", .01, "at one per second", PINK, theme="ink", word="percent")),
     N("Or line up one cube for every position, side by side. Each cube is about five point seven centimeters wide. The row would be two hundred sixty light years long.", T.num("a row of every cube", 260, fmt="{:,.0f}", post=" light years", color=GOLD, bottom="cubes side by side", theme="ink", word="two", dur=1.4)),
     N("And yet, no matter how scrambled it is, any cube can be solved in twenty moves or fewer. In twenty ten, computers proved that number. It's called God's number.", T.num("God's number", 20, fmt="{:.0f}", post=" moves", color=GRN, bottom="proved in 2010", theme="ink", word="twenty", dur=0.9)),
     N("So the cube hides a mind bending truth. Out of forty three quintillion paths, there's always a short way home.", T.kinetic([("43 QUINTILLION PATHS", WHITE, 70), ("A SHORT WAY HOME", GOLD, 80)], "ink")),
    ]
    return R(309, "rubiks_cube_quintillion", "43 quintillion Rubik's cube positions", "a Rubik's cube has 43 quintillion positions, but can always be solved in 20 moves. send this to someone who can't solve it",
             "Rubik's cube: 43,252,003,274,489,856,000 reachable positions. Age of universe 13.8 Gyr = 4.35e17 s -> 1.0% at one per second. 4.3e19 x 5.7 cm = 2.5e18 m = about 260 light years. God's number = 20 (Rokicki et al., 2010).", "bounce", n)

def gauss():
    assert sum(range(1, 101)) == 5050
    n = [
     N("Add up every number from one to a hundred. It looks like a long calculation. But a young boy, the story goes, found a trick that did it in seconds.", T.kinetic([("1 + 2 + 3 + ... + 100", WHITE, 70), ("= ?", GOLD, 140)], "ink")),
     N("The boy was Carl Friedrich Gauss, who later became one of the greatest mathematicians in history. The story says his teacher wanted to keep the class busy.", T.kinetic([("YOUNG GAUSS", GOLD, 100), ("A BUSY TEACHER", WHITE, 80)], "ink")),
     N("Gauss wrote the numbers twice, once forward and once backward. Then he added them in pairs, top to bottom.", T.formula(["1 + 2 + 3 + ... + 100", "100 + 99 + 98 + ... + 1"], theme="ink", title="write it twice")),
     N("Every pair added to a hundred and one. One plus a hundred. Two plus ninety nine. Three plus ninety eight. And so on.", T.formula(["1 + 100 = 101", "2 + 99 = 101", "3 + 98 = 101"], theme="ink", title="every pair is the same")),
     N("There are a hundred pairs. So the double sum is a hundred times a hundred and one, which is ten thousand one hundred ten.", T.formula(["100 × 101 = 10,100"], theme="ink", title="the double sum")),
     N("But that counted everything twice. So divide by two. The answer is five thousand fifty.", T.num("the sum of 1 to 100", 5050, fmt="{:,.0f}", color=GOLD, bottom="10,100 ÷ 2", theme="ink", word="five", dur=1.4)),
     N("The general rule works for any number. The sum of one to n is n times n plus one, divided by two. For a million, it's five hundred billion five hundred thousand.", T.formula(["1 + 2 + ... + n", "= n × (n + 1) ÷ 2"], theme="ink", title="the rule for any n")),
     N("A simple pattern, seen differently, turns a long job into a single step. That's what mathematicians do.", T.kinetic([("SEE THE PATTERN", WHITE, 90), ("SKIP THE WORK", GOLD, 100)], "ink")),
    ]
    return R(310, "gauss_sum_1_to_100", "add 1 to 100 in seconds", "the sum of 1 to 100 is 5,050, and young Gauss found the trick in seconds. send this to a math teacher",
             "Sum_{k=1}^{n} k = n(n+1)/2: n=100 -> 5,050; n=1,000,000 -> 500,000,500,000. The Gauss schoolboy anecdote is traditional and may be embellished.", "synth", n)

def handshake():
    n = [
     N("Add one more person to a group chat, and the number of possible private conversations jumps by much more than one. This is why big groups get chaotic.", T.kinetic([("GROUP CHATS", WHITE, 100), ("GET CHAOTIC", GOLD, 120)], "ink")),
     N("With three friends, there are three possible pairs. With four, six pairs. With five people, ten pairs.", T.steps("pairs of friends", [("3 people", "3 pairs"), ("4 people", "6 pairs"), ("5 people", "10 pairs")], theme="ink", words=["three", "four", "five"])),
     N("The pattern has a formula. With n people, the number of pairs is n times n minus one, divided by two.", T.formula(["pairs = n × (n − 1) ÷ 2"], theme="ink", title="the formula")),
     N("A group of ten has forty five possible private chats. A group of twenty has a hundred ninety.", T.bars("possible private chats", [("5 people", 10), ("10 people", 45), ("20 people", 190)], fmt="{:,.0f}", cols=[CY, GOLD, PINK], theme="ink", words=["five", "ten", "twenty"])),
     N("Fifty people have twelve hundred twenty five possible pairs. And a hundred people, forty nine hundred fifty.", T.num("50 people have", 1225, fmt="{:,.0f}", post=" pairs", color=PINK, bottom="100 people: 4,950 pairs", theme="ink", word="fifty", dur=1.4)),
     N("That's called quadratic growth. People grow in a straight line, but the connections between them grow with the square. That's why a family reunion feels so complicated.", T.kinetic([("PEOPLE: +1", WHITE, 90), ("CONNECTIONS: +n", GOLD, 100)], "ink")),
     N("It's also why companies break into small teams. Every new person adds more connections to manage than the last one did.", T.kinetic([("SMALL TEAMS", WHITE, 100), ("WORK BETTER", GOLD, 100)], "ink")),
    ]
    return R(311, "group_chat_pairs", "why group chats get chaotic", "a group of 10 has 45 possible private chats, a group of 50 has 1,225. send this to your biggest group chat",
             "Number of pairs C(n,2) = n(n-1)/2: 5 -> 10; 10 -> 45; 20 -> 190; 50 -> 1,225; 100 -> 4,950 (the handshake problem).", "funk", n)

def googol():
    n = [
     N("A googol is a one followed by a hundred zeros. And it's bigger than the number of atoms in the entire observable universe. By a lot.", T.kinetic([("A GOOGOL", GOLD, 130), ("= 1 + 100 ZEROS", WHITE, 80)], "space")),
     N("Scientists estimate the observable universe contains about ten to the eighty atoms. That's a one with eighty zeros.", T.stat("atoms in the universe", "10⁸⁰", "a 1 with 80 zeros", CY, "", 190, theme="space")),
     N("A googol has a hundred zeros. That's twenty more. So a googol is a hundred quintillion times larger than the number of atoms in the universe.", T.stat("a googol is", "10²⁰ × MORE", "a hundred quintillion times more", GOLD, "than the atoms in the universe", 140, theme="space")),
     N("The word googol was invented in nineteen twenty, by a nine year old boy named Milton Sirotta, nephew of the mathematician Edward Kasner.", T.stat("invented in 1920", "A 9 YEAR OLD", "Milton Sirotta, a mathematician's nephew", GOLD, "", 110, theme="space")),
     N("And yes, the company Google was named after it. The founders wanted a name that stood for the huge amount of information on the web, but they misspelled it.", T.stat("Google", "A MISSPELLING", "of googol, in 1997", GRN, "", 110, theme="space")),
     N("There's an even bigger number, a googolplex. That's ten to the power of a googol. A one followed by a googol zeros.", T.formula(["googolplex = 10^googol"], theme="space", title="even bigger")),
     N("You couldn't write a googolplex. There isn't enough room in the universe. Even if every atom held a digit, you'd run out of atoms long before you ran out of zeros.", T.kinetic([("NOT ENOUGH ATOMS", WHITE, 70), ("TO WRITE IT", GOLD, 90)], "space")),
    ]
    return R(312, "googol_vs_atoms", "a googol is bigger than the universe's atoms", "a googol (1 followed by 100 zeros) is a hundred quintillion times more than the atoms in the universe, and it's where Google got its name. send this to someone who thinks they know big numbers",
             "Observable universe about 1e78-1e82 atoms (commonly 1e80); googol = 1e100; ratio about 1e20. Term coined 1920 by Milton Sirotta (age 9), nephew of Edward Kasner; Google (1997) was a misspelling of googol.", "cine", n)

def dice():
    n = [
     N("Roll two dice. Which total is the most likely? Most people say it doesn't matter. But one total shows up six times more often than another.", T.kinetic([("ROLL TWO DICE", WHITE, 100), ("WHICH TOTAL", WHITE, 80), ("WINS?", GOLD, 140)], "warm")),
     N("There are thirty six ways two dice can land. Six sides on one die, times six sides on the other.", T.num("possible rolls of two dice", 36, fmt="{:.0f}", color=CY, bottom="6 × 6", theme="warm", word="thirty", dur=0.9)),
     N("A total of two can only happen one way, with a one and a one. That's one in thirty six, just two point eight percent.", T.num("chance of rolling a 2", 2.8, fmt="{:.1f}", post="%", color=PINK, bottom="only 1 way: 1 + 1", theme="warm", word="two", dur=0.9)),
     N("But a total of seven can happen six ways. One and six, two and five, three and four, and each of those backwards.", T.steps("ways to roll a 7", [("1 + 6", "and 6 + 1"), ("2 + 5", "and 5 + 2"), ("3 + 4", "and 4 + 3")], theme="warm", words=["one", "two", "three"])),
     N("Six out of thirty six, that's sixteen point seven percent. Seven is the most likely total, and the gap to the extremes is huge.", T.bars("chance of each total, %", [("2", 2.8), ("4", 8.3), ("6", 13.9), ("7", 16.7), ("9", 11.1), ("12", 2.8)], fmt="{:.1f}", unit="%", hi=3, theme="warm", words=["two", "four", "six", "seven", "nine", "twelve"])),
     N("That's why casinos love a game called craps. The most common roll, seven, wins or loses depending on the stage, and the house arranges the odds in its favor.", T.kinetic([("SEVEN IS", WHITE, 90), ("KING", GOLD, 140)], "warm")),
     N("It's also why the board game Catan puts the number tokens six and eight on the best tiles. They're the next most likely after seven.", T.kinetic([("6 AND 8", GOLD, 130), ("ARE NEXT BEST", WHITE, 80)], "warm")),
    ]
    return R(313, "two_dice_seven", "why seven is the most likely roll", "seven is 6 times more likely than a 2 or a 12 when you roll two dice. send this to your board game friend",
             "Two dice: 36 outcomes; P(7) = 6/36 = 16.7%; P(2) = P(12) = 1/36 = 2.8%; P(6) = P(8) = 5/36 = 13.9%; P(4) = P(10) = 3/36 = 8.3%; P(9) = 4/36 = 11.1%.", "bounce", n)

def coin_streak():
    n = [
     N("Here's a party trick that exposes fake randomness. I'll tell you how to tell a real coin flip sequence from one a human made up. It works almost every time.", T.kinetic([("REAL OR", WHITE, 100), ("FAKE FLIPS?", GOLD, 130)], "ink")),
     N("Imagine flipping a coin a hundred times. Most people, when they invent a sequence, avoid long runs. They think six heads in a row looks suspicious.", T.kinetic([("HUMANS AVOID", WHITE, 90), ("LONG STREAKS", GOLD, 110)], "ink")),
     N("But in a real sequence of a hundred flips, a run of five or more of the same side is almost certain. It happens about ninety seven percent of the time.", T.ring("chance of a run of 5+ in 100 flips", .972, "almost always", CY, theme="ink", word="ninety")),
     N("A run of six or more? About eighty one percent. A run of seven or more? Still better than fifty fifty, about fifty four percent.", T.bars("chance of a run in 100 flips", [("5 or more", 97.2), ("6 or more", 80.7), ("7 or more", 54.2)], fmt="{:.0f}", unit="%", cols=[GRN, GOLD, ORG], theme="ink", words=["five", "six", "seven"])),
     N("So if someone shows you a hundred flips with no streak longer than four, they almost certainly made it up.", T.kinetic([("NO LONG STREAKS?", WHITE, 80), ("PROBABLY FAKE", PINK, 100)], "ink")),
     N("Statisticians use this to catch fraud. Real data is more clumpy than we expect, and fake data looks too evenly mixed.", T.kinetic([("REAL = CLUMPY", WHITE, 90), ("FAKE = TOO SMOOTH", GOLD, 80)], "ink")),
     N("Try it yourself. Flip a coin a hundred times, or ask a friend to fake it, and check for the longest streak. Random doesn't look random.", T.kinetic([("RANDOM", WHITE, 120), ("DOESN'T LOOK", WHITE, 90), ("RANDOM", GOLD, 130)], "ink")),
    ]
    return R(314, "coin_flip_streaks", "how to spot fake random coin flips", "in 100 coin flips a run of 6 or more is 81% likely. if a sequence has no streaks, a human probably faked it. send this to someone who 'knows probability'",
             "Probability of at least one run of k identical results in 100 fair flips (exact recurrence): k=5 97.2%, k=6 80.7%, k=7 54.2%.", "synth", n)

def benford():
    n = [
     N("Pick any big list of real numbers, like city populations or river lengths. About thirty percent of them start with the digit one. Not eleven percent, thirty.", T.kinetic([("30% OF NUMBERS", GOLD, 100), ("START WITH 1", WHITE, 100)], "ink")),
     N("If digits were random, each of the nine starting digits would appear about eleven percent of the time. But real data doesn't work that way.", T.num("if every digit were equal", 11.1, fmt="{:.1f}", post="% each", color=CY, bottom="but it isn't", theme="ink", word="eleven", dur=1.0)),
     N("This is Benford's law. A starting digit one shows up thirty point one percent of the time, a two seventeen point six percent, and it keeps falling.", T.bars("how often each digit comes first", [("1", 30.1), ("2", 17.6), ("3", 12.5), ("4", 9.7), ("5", 7.9)], fmt="{:.1f}", unit="%", hi=0, theme="ink", words=["one", "two", "three", "four", "five"])),
     N("By the time you get to nine, it's only four point six percent. The formula is the base ten logarithm of one plus one over the digit.", T.formula(["P(d) = log₁₀(1 + 1/d)"], theme="ink", title="Benford's formula")),
     N("Why? Think about growth. A number must pass through the ones, the hundred to one ninety nine, before it can reach the twos. If it grows steadily, it spends far more time starting with one.", T.kinetic([("TO GET TO 2", WHITE, 90), ("YOU MUST DOUBLE", GOLD, 80)], "ink")),
     N("Auditors use this to catch fake numbers. When people invent data, they spread digits evenly. Real financial data follows Benford's law. Fakes don't.", T.stat("fraud detectors", "FAKE DATA", "has the wrong first digits", PINK, "", 130, theme="ink")),
     N("Next time you see a long list of numbers, check the first digits. If one doesn't win by a lot, someone may have made them up.", T.kinetic([("CHECK THE", WHITE, 90), ("FIRST DIGIT", GOLD, 110)], "ink")),
    ]
    return R(315, "benfords_law", "Benford's law, the fraud detector", "in real data about 30% of numbers start with the digit 1, and fake data gets caught by it. send this to an accountant",
             "Benford's law: P(first digit = d) = log10(1 + 1/d): 1 -> 30.1%, 2 -> 17.6%, 3 -> 12.5%, 4 -> 9.7%, 5 -> 7.9%, 9 -> 4.6%. Used in forensic accounting as a screening test.", "synth", n)

def zero():
    n = [
     N("Zero seems so obvious that it's hard to believe someone had to invent it. But for most of human history, nobody had it. And the person who wrote the rules came from India.", T.kinetic([("WHO INVENTED", WHITE, 90), ("ZERO?", GOLD, 150)], "warm")),
     N("The Romans, with all their roads and aqueducts, had no zero. They couldn't write it, and their number system made math painfully hard.", T.stat("Roman numerals", "NO ZERO", "try multiplying XLVII by XIX", CY, "", 160, theme="warm")),
     N("In India, mathematicians started using a dot, and later a circle, to mean nothing. The Bakhshali manuscript contains hundreds of these dots.", T.stat("the Bakhshali manuscript", "DOTS FOR ZERO", "carbon dated to about the 3rd or 4th century", GOLD, "", 90, theme="warm")),
     N("That's the oldest known use of a zero symbol anywhere in the world. Dated to around the third or fourth century, it's older than scientists had thought.", T.num("oldest zero symbol", 300, fmt="{:.0f}", post=" CE or earlier", color=ORG, bottom="found in India", theme="warm", word="third", dur=1.0)),
     N("In six twenty eight, the Indian mathematician Brahmagupta wrote the first clear rules for zero as a number, how to add it, subtract it, and multiply by it.", T.num("Brahmagupta's rules", 628, fmt="{:.0f}", post=" CE", color=GOLD, bottom="zero as a real number", theme="warm", word="six", dur=1.0)),
     N("The idea traveled through the Arab world, where scholars like al Khwarizmi spread the Hindu Arabic number system, and then to Europe.", T.kinetic([("INDIA", WHITE, 90), ("→ ARAB WORLD", GOLD, 80), ("→ EUROPE", WHITE, 90)], "warm")),
     N("In twelve oh two, the Italian mathematician Fibonacci, who learned it in North Africa, brought zero and the numbers one to nine to Europe in his famous book.", T.num("Fibonacci's Liber Abaci", 1202, fmt="{:.0f}", color=PINK, bottom="brought zero to Europe", theme="warm", word="twelve", dur=1.0)),
     N("Without zero, there's no place value, no decimal, no algebra, and no computers. Every phone is built on a dot someone drew in India.", T.kinetic([("NO ZERO", WHITE, 90), ("NO COMPUTERS", GOLD, 100)], "warm")),
    ]
    return R(316, "who_invented_zero", "where zero came from", "zero was invented in India, the Romans never had it, and every computer depends on it. send this to your math friend",
             "Bakhshali manuscript (radiocarbon dated by Oxford in 2017 to as early as the 3rd-4th century CE) uses a dot for zero; Brahmagupta's Brahmasphutasiddhanta (628 CE) gave arithmetic rules for zero; Fibonacci's Liber Abaci (1202) introduced Hindu-Arabic numerals to Europe.", "lofi", n)

REELS = dict(monty_hall_switch=monty, zero_point_nine_repeating=point_nine, rubiks_cube_quintillion=rubik, gauss_sum_1_to_100=gauss, group_chat_pairs=handshake, googol_vs_atoms=googol, two_dice_seven=dice, coin_flip_streaks=coin_streak, benfords_law=benford, who_invented_zero=zero)
