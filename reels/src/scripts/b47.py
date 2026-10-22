"""Batch 47: education reels, technology."""
import math
from edu import *
import functools
R = functools.partial(R, chip="TECH")

def apollo():
    n = [
     N("The computer that landed humans on the Moon was less powerful than a modern pocket calculator. Here are the numbers.", T.kinetic([("APOLLO'S COMPUTER", WHITE, 80), ("vs YOUR PHONE", GOLD, 110)], "space")),
     N("The Apollo Guidance Computer ran on a two megahertz clock, but it could execute only tens of thousands of instructions a second.", T.num("Apollo's clock speed", 2.05, fmt="{:.2f}", post=" MHz", color=CY, bottom="tens of thousands of instructions a second", theme="space", word="two", dur=1.2)),
     N("A modern phone chip runs near four gigahertz, per core. That's about nineteen hundred times faster, and it has many cores.", T.vs(("Apollo", 2.05, CY), ("modern phone", 3780, GOLD), unit=" MHz", fmt="{:,.0f}", log=True, theme="space", word="modern")),
     N("The Apollo computer had about four kilobytes of working memory. An iPhone has eight gigabytes. That's two million times more.", T.num("an iPhone has memory", 2, fmt="{:.0f}", post=" million × more", color=PINK, bottom="8 GB vs about 4 KB", theme="space", word="eight", dur=1.2)),
     N("The software was stored on a hand woven rope memory. Women in factories literally threaded wires through magnetic cores, to write the code.", T.stat("the software", "WOVEN BY HAND", "wires through magnetic cores", ORG, "'little old ladies' wove the code", 110, theme="space")),
     N("And yet it worked. In nineteen sixty nine, with a computer this small, astronauts landed on the Moon, with less than a minute of fuel to spare on Apollo eleven.", T.num("the first Moon landing", 1969, fmt="{:.0f}", color=GOLD, bottom="done with 4 KB of RAM", theme="space", word="nineteen", dur=1.2)),
     N("It shows that hardware isn't everything. Brilliant engineers, careful code, and strict limits can do the impossible.", T.kinetic([("LIMITS", WHITE, 100), ("CREATE", WHITE, 80), ("GENIUS", GOLD, 130)], "space")),
    ]
    return R(287, "apollo_computer_vs_iphone", "the Apollo computer vs your phone", "the computer that landed on the Moon had 4 KB of memory. your phone has 2 million times more. send this to someone who complains about their phone",
             "Apollo Guidance Computer: 2.048 MHz clock, 2,048 words erasable memory (about 4 KB), 36,864 words rope memory (about 72 KB). An iPhone with 8 GB of RAM has about 2 million times more memory; 3.78 GHz is about 1,850 times the AGC clock rate per core.", "synth", n)

def transistors():
    r = 114e9 / 2300; assert 4.9e7 < r < 5.0e7
    n = [
     N("In nineteen seventy one, a computer chip had two thousand three hundred transistors. Today's best chips have a hundred and fourteen billion. That's one of the greatest growth stories ever.", T.kinetic([("2,300", WHITE, 120), ("→", MUT, 80), ("114 BILLION", GOLD, 100)], "space")),
     N("A transistor is a tiny electric switch. Billions of them, switching on and off, are what let a chip do math, show images, and run an app.", T.kinetic([("A TRANSISTOR =", WHITE, 70), ("A TINY SWITCH", GOLD, 100)], "space")),
     N("In nineteen seventy one, Intel's four thousand four chip had two thousand three hundred of them. It powered a desktop calculator.", T.num("Intel 4004, 1971", 2300, fmt="{:,.0f}", color=CY, bottom="transistors, in a calculator", theme="space", word="two", dur=1.4)),
     N("In twenty twenty two, Apple's M one Ultra chip had one hundred fourteen billion transistors on a piece of silicon smaller than your hand.", T.num("Apple M1 Ultra, 2022", 114, fmt="{:,.0f}", post=" billion", color=GOLD, bottom="transistors", theme="space", word="hundred", dur=1.6)),
     N("That's about fifty million times more, in fifty one years. If a car's speed had grown like that, it would travel faster than light.", T.num("growth in 51 years", 49.6, fmt="{:.1f}", post=" million ×", color=PINK, bottom="114 billion ÷ 2,300", theme="space", word="fifty", dur=1.4)),
     N("This pattern has a name, Moore's law. In nineteen sixty five, Gordon Moore noticed the number of transistors doubled about every two years.", T.stat("Moore's law", "DOUBLES", "every two years or so", GRN, "noticed by Gordon Moore, 1965", 150, theme="space")),
     N("Doubling every two years for fifty one years is two to the power of twenty five and a half, about forty seven million. The prediction matched.", T.formula(["2 ^ 25.5", "≈ 47 million"], theme="space", title="51 years ÷ 2")),
     N("Chip makers now build features only a few atoms wide, close to the limit of physics. The next fifty years of progress won't look like the last.", T.kinetic([("A FEW ATOMS WIDE", WHITE, 70), ("THE LIMIT IS NEAR", GOLD, 80)], "space")),
    ]
    return R(288, "transistors_4004_to_m1", "2,300 transistors to 114 billion", "in 1971 a chip had 2,300 transistors. today's has 114 billion, 50 million times more. send this to someone who still uses a calculator",
             "Intel 4004 (1971): 2,300 transistors. Apple M1 Ultra (2022): 114 billion. Ratio 4.96e7; Moore's law doubling every 2 years over 51 years gives 2^25.5 = 4.7e7.", "synth", n)

def first_sms():
    n = [
     N("The first text message ever sent said, Merry Christmas. And the reason your texts, and even tweets, are limited in length goes back to that day.", T.kinetic([("THE FIRST TEXT", WHITE, 90), ("EVER SENT", GOLD, 120)], "ink")),
     N("It was sent on the third of December, nineteen ninety two, by a young engineer named Neil Papworth, from a computer in the United Kingdom to a colleague's phone at a Christmas party.", T.stat("the first SMS", "DEC 3, 1992", "Neil Papworth, Vodafone", CY, "", 120, theme="ink")),
     N("It read, Merry Christmas. That's it. And the person who received it couldn't even reply, because phones back then had no keyboard.", T.stat("the message", "MERRY CHRISTMAS", "the receiver couldn't reply", GOLD, "", 90, theme="ink")),
     N("So why are text messages limited to one hundred sixty characters? It came from a German engineer, Friedhelm Hillebrand, in nineteen eighty five.", T.num("the SMS limit", 160, fmt="{:.0f}", post=" characters", color=PINK, bottom="decided in 1985", theme="ink", word="hundred", dur=1.2)),
     N("He sat at a typewriter and typed random sentences and postcards. He found that most of his messages were under one hundred sixty characters, and decided that was enough.", T.stat("his research", "TYPEWRITER + POSTCARDS", "most messages fit in 160 characters", ORG, "", 70, theme="ink")),
     N("Years later, Twitter's creators wanted tweets to work as text messages. SMS allows one hundred sixty. They saved twenty for the username, and left one hundred forty.", T.formula(["160 − 20 (username)", "= 140 characters"], theme="ink", title="where tweets came from")),
     N("One engineer's guess at a typewriter, in nineteen eighty five, shaped how billions of people communicate today.", T.kinetic([("ONE GUESS", WHITE, 100), ("SHAPED", WHITE, 80), ("EVERY TEXT", GOLD, 120)], "ink")),
    ]
    return R(289, "first_text_message_160", "why texts are 160 characters", "the first text message said Merry Christmas. the 160 character limit came from postcards, and tweets used to be 140 because of it. send this to someone you text too much",
             "First SMS: 3 December 1992, Neil Papworth to Richard Jarvis (Vodafone) 'Merry Christmas'. 160-character limit: Friedhelm Hillebrand, 1985 (postcards and telex messages). Twitter's 140 = 160 minus 20 for the username.", "lofi", n)

def youtube():
    h = 500 * 60 * 24 / 8760; assert 82 < h < 83
    n = [
     N("The first video ever uploaded to YouTube was nineteen seconds long, and it's about elephants. Today, the site gets about three weeks of video every single minute.", T.kinetic([("THE FIRST", WHITE, 90), ("YOUTUBE VIDEO", GOLD, 110)], "ink")),
     N("It was called Me at the zoo, uploaded on April twenty third, two thousand five, by YouTube co founder Jawed Karim.", T.stat("uploaded", "APRIL 23, 2005", "'Me at the zoo' by Jawed Karim", CY, "", 110, theme="ink")),
     N("It shows him standing in front of elephants at the San Diego Zoo. He says the elephants have really, really long trunks, and that's pretty much all.", T.num("length of the first video", 19, fmt="{:.0f}", post=" seconds", color=GOLD, bottom="elephants and trunks", theme="ink", word="elephants", dur=0.9)),
     N("Today, more than five hundred hours of video are uploaded to YouTube every single minute. That's a figure the company shared in twenty nineteen.", T.num("hours uploaded every minute", 500, fmt="{:,.0f}", color=PINK, bottom="a 2019 figure from YouTube", theme="ink", word="five", dur=1.2)),
     N("Do the math. Five hundred hours a minute is seven hundred twenty thousand hours a day. That's eighty two years of video, uploaded every single day.", T.num("video uploaded per day", 82, fmt="{:.0f}", post=" years", color=GOLD, bottom="720,000 hours, every day", theme="ink", word="eighty", dur=1.2)),
     N("You could watch for your whole life and never see even one day's worth of uploads. Most of what's out there will never be seen by more than a handful of people.", T.kinetic([("ONE DAY OF UPLOADS", WHITE, 70), ("> YOUR LIFETIME", GOLD, 80)], "ink")),
     N("That's why a hook and a clear story matter so much. In an ocean of video, your first two seconds decide everything.", T.kinetic([("THE FIRST", WHITE, 90), ("2 SECONDS", GOLD, 130)], "ink")),
    ]
    return R(290, "first_youtube_video", "the first YouTube video", "the first YouTube video was 19 seconds of elephants. today 82 years of video is uploaded every day. send this to a creator",
             "'Me at the zoo' uploaded 23 April 2005 (19 s). YouTube said in 2019 that more than 500 hours of video were uploaded every minute: 500 x 60 x 24 = 720,000 h/day = 82.2 years/day.", "lofi", n)

def first_website():
    n = [
     N("The very first website is still online today. You can visit it right now. And it explains something important about how the web began.", T.kinetic([("THE FIRST WEBSITE", WHITE, 80), ("IS STILL ONLINE", GOLD, 100)], "ink")),
     N("In nineteen eighty nine, a British scientist named Tim Berners-Lee, working at CERN in Switzerland, proposed a way for researchers to share documents.", T.stat("invented at CERN", "1989", "Tim Berners-Lee's proposal", CY, "", 190, theme="ink")),
     N("By nineteen ninety one, the first website was live. It was a plain page explaining what the World Wide Web was, and how to make your own page.", T.stat("first website live", "1991", "info.cern.ch", GOLD, "plain text and links, nothing more", 190, theme="ink")),
     N("It had no pictures, no ads, and no videos. Just text and links. But the idea of links, one page pointing to another, was revolutionary.", T.kinetic([("TEXT", WHITE, 100), ("+ LINKS", GOLD, 120)], "ink")),
     N("In nineteen ninety three, CERN announced that the web technology would be free for anyone to use, forever. No patents, no fees.", T.stat("April 30, 1993", "FREE FOR ALL", "CERN put the web in the public domain", GRN, "", 100, theme="ink")),
     N("Today there are over one billion websites. Though only about two hundred million are active. A billion pages, from one plain page about itself.", T.num("websites today", 1.1, fmt="{:.1f}", post=" billion", color=PINK, bottom="about 200 million active", theme="ink", word="billion", dur=1.2)),
     N("Had the web been patented, it might never have spread. Giving it away free is one of the most valuable decisions in history.", T.kinetic([("GIVEN AWAY FREE", WHITE, 80), ("CHANGED THE WORLD", GOLD, 70)], "ink")),
    ]
    return R(291, "first_website_1991", "the first website is still online", "the first website went live in 1991 and is still online, and the web was given away free in 1993. send this to someone online too much",
             "Tim Berners-Lee proposed the Web at CERN in 1989; the first web page went live on info.cern.ch around 1991 (publicly announced 6 August 1991); on 30 April 1993 CERN placed the Web software in the public domain. About 1.1 billion websites exist, roughly 200 million active.", "lofi", n)

def bug():
    n = [
     N("The word bug, for a computer problem, has a famous origin story. It involves a real moth, stuck in a real computer, in nineteen forty seven.", T.kinetic([("THE FIRST", WHITE, 90), ("COMPUTER BUG", GOLD, 120)], "ink")),
     N("On September ninth, nineteen forty seven, engineers at Harvard were working on a huge computer called the Mark Two. It stopped working.", T.stat("September 9, 1947", "HARVARD MARK II", "the computer suddenly failed", CY, "", 110, theme="ink")),
     N("They searched the machine, and found the problem. A moth had flown into a relay, a mechanical switch, and jammed it shut.", T.stat("the culprit", "A MOTH", "stuck in relay number 70", ORG, "", 150, theme="ink")),
     N("They carefully removed the moth with tweezers and taped it into the logbook. Next to it they wrote, first actual case of bug being found.", T.kinetic([("TAPED INTO", WHITE, 80), ("THE LOGBOOK", GOLD, 100)], "ink")),
     N("The joke only works because engineers already used the word bug for any glitch. Thomas Edison used it in eighteen seventy eight.", T.num("Edison used 'bug' in", 1878, fmt="{:.0f}", color=GOLD, bottom="69 years before the moth", theme="ink", word="Edison", dur=1.2)),
     N("The logbook, with the moth still taped inside, is now in the Smithsonian's National Museum of American History. Grace Hopper's team gets the credit for the story.", T.kinetic([("THE MOTH IS", WHITE, 80), ("IN A MUSEUM", GOLD, 100)], "ink")),
     N("So the next time your phone glitches, remember. The first computer bug was a real insect, and the first debugging was tweezers.", T.kinetic([("FIRST DEBUGGER", WHITE, 80), ("= TWEEZERS", GOLD, 110)], "ink")),
    ]
    return R(292, "first_computer_bug_moth", "the first computer bug was a real moth", "the first computer bug was an actual moth found in a Harvard computer in 1947. send this to a programmer",
             "Harvard Mark II logbook entry, 9 September 1947 (Grace Hopper's team): moth removed from relay 70, panel F; 'First actual case of bug being found'. The term 'bug' was used by Thomas Edison in 1878. The page is at the Smithsonian National Museum of American History.", "lofi", n)

def cables():
    n = [
     N("Almost everything you do on the internet, from watching videos to sending messages to other continents, travels through cables at the bottom of the ocean. Not satellites.", T.kinetic([("THE INTERNET", WHITE, 90), ("LIVES UNDER", WHITE, 70), ("THE OCEAN", GOLD, 120)], "blue")),
     N("About ninety nine percent of all international data travels through undersea fiber optic cables.", T.ring("of intercontinental data", .99, "goes through undersea cables", CY, theme="blue", word="ninety")),
     N("There are over five hundred cables in service, stretching a total of about one point four million kilometers. That's more than three times the distance to the Moon.", T.num("cables in the sea", 1.4, fmt="{:.1f}", post=" million km", color=GOLD, bottom="over 500 cables", theme="blue", word="five", dur=1.2)),
     N("Surprisingly, most of the cable is as thin as a garden hose. Just a few glass fibers, wrapped in layers of plastic and copper.", T.num("cable thickness", 2.5, fmt="{:.1f}", post=" cm", color=PINK, bottom="about a garden hose", theme="blue", word="garden", dur=0.9)),
     N("The cables lie on the ocean floor, up to eight kilometers deep. Near the coast, ships and anchors can damage them, so those parts get armor.", T.num("deepest cable", 8000, fmt="{:,.0f}", post=" m", color=ORG, bottom="on the seabed", theme="blue", word="eight", dur=1.2)),
     N("Sharks sometimes bite them, and earthquakes can break them. Ships carry replacements, and repair a broken cable in a week or two.", T.stat("broken cable?", "REPAIR SHIPS", "fixed within a week or two", GRN, "", 110, theme="blue")),
     N("A single modern cable can carry hundreds of terabits per second. Your next video call is a beam of light, crossing an ocean floor.", T.kinetic([("YOUR VIDEO CALL", WHITE, 70), ("IS LIGHT IN GLASS", GOLD, 80)], "blue")),
    ]
    return R(293, "undersea_internet_cables", "the internet runs under the sea", "99% of intercontinental internet traffic travels through undersea cables as thin as a garden hose. send this to someone who thinks the internet is in the cloud",
             "TeleGeography: about 570 in-service submarine cables, about 1.4 million km (2024); about 95-99% of intercontinental data travels via submarine cables; typical cable diameter about 2-5 cm; repairs by cable ships take days to weeks.", "cine", n)

def download():
    n = [
     N("How long does it take to download a movie? It depends. In nineteen ninety eight it would have taken more than a week. Here's how it changed.", T.kinetic([("DOWNLOADING", WHITE, 100), ("A MOVIE", GOLD, 130)], "ink")),
     N("Let's say the movie file is five gigabytes, a typical high definition film. That's forty billion bits.", T.num("one HD movie", 5, fmt="{:.0f}", post=" GB", color=CY, bottom="40 billion bits", theme="ink", word="five", dur=0.8)),
     N("On a nineteen ninety eight dial up modem running at fifty six kilobits a second, it would take about eight days of non stop downloading.", T.num("dial-up, 1998", 8.3, fmt="{:.1f}", post=" days", color=PINK, bottom="at 56 kilobits a second", theme="ink", word="eight", dur=1.2)),
     N("On early broadband, around two thousand, at one megabit a second, it would take about eleven hours.", T.num("early broadband, 2000", 11, fmt="{:.0f}", post=" hours", color=ORG, bottom="at 1 megabit a second", theme="ink", word="eleven", dur=1.0)),
     N("On a modern five G phone at five hundred megabits, about eighty seconds.", T.num("5G, today", 80, fmt="{:.0f}", post=" seconds", color=GRN, bottom="at 500 megabits a second", theme="ink", word="five", dur=1.0)),
     N("And on a gigabit fiber connection, forty seconds. Faster than the movie's opening credits.", T.num("gigabit fiber", 40, fmt="{:.0f}", post=" seconds", color=GOLD, bottom="at 1 gigabit a second", theme="ink", word="forty", dur=1.0)),
     N("From eight days to forty seconds, that's about seventeen thousand times faster, in a single generation. Patience used to be a feature. Now it's a bug.", T.num("faster than dial-up", 17000, fmt="{:,.0f}", post="×", color=PINK, bottom="in about 25 years", theme="ink", word="seventeen", dur=1.4)),
    ]
    assert abs(5e9 * 8 / 56e3 / 86400 - 8.27) < .01
    return R(294, "download_speed_history", "how long to download a movie, then and now", "downloading a 5 GB movie took 8 days on dial-up and takes 40 seconds on gigabit fiber. send this to someone who remembers dial-up",
             "5 GB = 4e10 bits. At 56 kbps = 714,286 s = 8.3 days; at 1 Mbps = 11.1 h; at 500 Mbps = 80 s; at 1 Gbps = 40 s. Speedup 8.3 days / 40 s = 17,900x (ideal throughput, no overhead).", "bounce", n)

def passwords():
    n = [
     N("How long does it take a computer to crack your password? The answer ranges from twenty one seconds to longer than the age of the universe. It all depends on length.", T.kinetic([("HOW LONG TO", WHITE, 90), ("CRACK YOUR", WHITE, 90), ("PASSWORD?", GOLD, 120)], "ink")),
     N("A modern graphics card setup can try about ten billion guesses a second against a stolen password database.", T.num("guesses per second", 10, fmt="{:.0f}", post=" billion", color=CY, bottom="a high end cracking rig", theme="ink", word="ten", dur=1.0)),
     N("An eight letter password, using only lowercase letters, has two hundred eight billion possibilities. At ten billion a second, it falls in twenty one seconds.", T.num("8 lowercase letters", 21, fmt="{:.0f}", post=" seconds", color=PINK, bottom="208 billion possibilities", theme="ink", word="eight", dur=1.0)),
     N("Eight characters using uppercase, lowercase, numbers and symbols, ninety four choices each, would last about one hundred seventy hours, around a week.", T.num("8 mixed characters", 170, fmt="{:.0f}", post=" hours", color=ORG, bottom="about a week", theme="ink", word="mixed", dur=1.0)),
     N("Now go longer. Twelve random characters, using all ninety four symbols, would take about one and a half million years.", T.num("12 random characters", 1.5, fmt="{:.1f}", post=" million years", color=GOLD, bottom="94 choices each", theme="ink", word="twelve", dur=1.2)),
     N("And here's the clever part. Six random words, from a list of seventy seven hundred words, give you seven hundred thousand years. And words are easy to remember.", T.num("6 random words", 700, fmt="{:,.0f}", post=",000 years", color=GRN, bottom="easy to remember", theme="ink", word="six", dur=1.2)),
     N("So length beats complexity. Use a long passphrase of random words, a different one for each site, and a password manager to keep them.", T.kinetic([("LONG BEATS", WHITE, 90), ("COMPLEX", GOLD, 130)], "ink")),
    ]
    return R(295, "password_crack_time", "how long it takes to crack a password", "an 8 letter lowercase password falls in 21 seconds, 6 random words takes 700,000 years. length beats complexity. send this to someone who uses the same password everywhere",
             "At 1e10 guesses/s: 26^8 = 2.09e11 -> 21 s; 94^8 = 6.1e15 -> 170 hours; 94^12 = 4.8e23 -> 1.5 million years; 7776^6 = 2.2e23 -> 700,000 years (Diceware wordlist 7,776 words). Assumes offline attack on a fast hash.", "trap", n)

def terabyte():
    n = [
     N("You buy a one terabyte hard drive. You plug it in, and your computer says nine hundred thirty one gigabytes. Did the store cheat you? No. And the reason is a math quirk.", T.kinetic([("1 TB DRIVE", WHITE, 100), ("SHOWS 931 GB", GOLD, 110)], "space")),
     N("Drive makers use the metric system. One terabyte equals exactly one trillion bytes. One gigabyte equals one billion bytes.", T.formula(["1 TB = 1,000,000,000,000 bytes", "1 GB = 1,000,000,000 bytes"], theme="space", title="drive makers count like this")),
     N("But computers count in powers of two, because everything inside them is built from binary. In that system, a gigabyte is two to the thirtieth power, or one billion seventy three million bytes.", T.formula(["1 GB = 2³⁰ bytes", "= 1,073,741,824 bytes"], theme="space", title="computers count like this")),
     N("So when your computer divides one trillion bytes by one billion seventy three million, it gets nine hundred thirty one.", T.formula(["1,000,000,000,000", "÷ 1,073,741,824", "≈ 931 GB"], theme="space")),
     N("You didn't lose seven percent of your drive. The bytes are all there. The two sides just use different units for the same word.", T.num("the missing space", 7, fmt="{:.0f}", post="%", color=PINK, bottom="not missing, just different units", theme="space", word="seven", dur=1.0)),
     N("The gap grows with every prefix. A kilobyte is off by two percent, a gigabyte by seven, a terabyte by nine, and a petabyte by eleven.", T.bars("what the computer shows, % of the label", [("kilobyte", 97.7), ("gigabyte", 93.1), ("terabyte", 90.9), ("petabyte", 88.8)], fmt="{:.1f}", unit="%", cols=[CY, GOLD, ORG, PINK], theme="space", words=["kilobyte", "gigabyte", "terabyte", "petabyte"])),
     N("To fix the confusion, standards groups created a new name, gibibyte, for the power of two version. Almost nobody uses it. So the mystery lives on.", T.kinetic([("GIBIBYTE", GOLD, 120), ("nobody says it", WHITE, 64)], "space")),
    ]
    return R(296, "terabyte_shows_931", "why a 1 TB drive shows 931 GB", "a 1 TB drive shows 931 GB because drive makers count in thousands and computers count in powers of 2. you didn't lose anything. send this to someone who thinks they got scammed",
             "1 TB = 1e12 bytes; 1 GiB = 2^30 = 1,073,741,824 bytes; 1e12 / 2^30 = 931.3 GiB. Prefix gaps: KiB 97.7%, GiB 93.1%, TiB 90.9%, PiB 88.8% of the decimal label.", "synth", n)

REELS = dict(apollo_computer_vs_iphone=apollo, transistors_4004_to_m1=transistors, first_text_message_160=first_sms, first_youtube_video=youtube, first_website_1991=first_website, first_computer_bug_moth=bug, undersea_internet_cables=cables, download_speed_history=download, password_crack_time=passwords, terabyte_shows_931=terabyte)
