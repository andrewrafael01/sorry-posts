"""Batch 23: real-data rankings and head to heads 198-206. Every figure is sourced on screen; the story field lists where each came from."""
from scripts.common import *
from scripts.b22 import title_slide, text_slide, num_slide
from scripts.b20 import PAL
import scripts.vo_scripts  # noqa: narration registered with voice.SCRIPTS

SAY = {
"198": [
"And number one. Cristiano Ronaldo. Three hundred million dollars.",
"Number 2. Canelo Alvarez. One hundred seventy million.",
"Number 3. Lionel Messi. One hundred forty million.",
"Number 4. LeBron James. One hundred thirty eight million.",
"Number 5. Shohei Ohtani. One hundred twenty eight million.",
"Number 6. Stephen Curry. One hundred twenty five million.",
"Number 7. Jon Rahm. One hundred seven million.",
"Number 8. Karim Benzema. One hundred four million.",
"Number 9. Kevin Durant. One hundred four million.",
"Number 10. Lewis Hamilton. One hundred million."
],
"199": [
"And number one. Elon Musk. Eight hundred thirty nine billion dollars.",
"Number 2. Larry Page. Two hundred fifty seven billion.",
"Number 3. Sergey Brin. Two hundred thirty seven billion.",
"Number 4. Jeff Bezos. Two hundred twenty four billion.",
"Number 5. Mark Zuckerberg. Two hundred twenty two billion.",
"Number 6. Larry Ellison. One hundred ninety billion.",
"Number 7. Bernard Arnault. One hundred seventy one billion.",
"Number 8. Jensen Huang. One hundred fifty four billion.",
"Number 9. Warren Buffett. One hundred forty nine billion.",
"Number 10. Amancio Ortega. One hundred forty eight billion."
],
"202": [
"And number one. Cristiano Ronaldo. About six hundred seventy million followers.",
"Number 2. Lionel Messi. About five hundred eleven million.",
"Number 3. Selena Gomez. About four hundred five million.",
"Number 4. Kylie Jenner. About three hundred ninety million.",
"Number 5. Dwayne Johnson. About three hundred ninety million.",
"Number 6. Ariana Grande. About three hundred seventy one million.",
"Number 7. Kim Kardashian. About three hundred fifty three million.",
"Number 8. Beyonce. About three hundred seven million."
],
"203": [
"And number one. LeBron James. Forty three thousand four hundred forty points.",
"Number 2. Kareem Abdul-Jabbar. Thirty eight thousand three eighty seven.",
"Number 3. Karl Malone. Thirty six thousand nine twenty eight.",
"Number 4. Kobe Bryant. Thirty three thousand six forty three.",
"Number 5. Kevin Durant. Thirty two thousand five ninety seven.",
"Number 6. Michael Jordan. Thirty two thousand two ninety two.",
"Number 7. Dirk Nowitzki. Thirty one thousand five sixty.",
"Number 8. Wilt Chamberlain. Thirty one thousand four nineteen.",
"Number 9. James Harden. Twenty nine thousand three thirty nine.",
"Number 10. Shaquille O'Neal. Twenty eight thousand five ninety six."
],
"204": [
"And number one. Kylian Mbappe. Twenty two goals.",
"Number 2. Lionel Messi. Twenty one goals.",
"Number 3. Miroslav Klose. Sixteen goals.",
"Number 4. Ronaldo of Brazil. Fifteen goals.",
"Number 5. Gerd Muller. Fourteen goals.",
"Number 6. Just Fontaine. Thirteen goals."
],
"205": [
"And number one. The badminton smash. Five hundred sixty five kilometers an hour.",
"Number 2. The jai alai ball. Three hundred six.",
"Number 3. The squash ball. Two hundred sixty seven.",
"Number 4. The tennis serve. Two hundred sixty three.",
"Number 5. The baseball pitch. One hundred seventy.",
"Number 6. Usain Bolt. Forty four point seven."
],
"206": [
"And number one. The peregrine falcon, in a dive. Three hundred eighty nine kilometers an hour.",
"Number 2. The cheetah. One hundred twelve.",
"Number 3. The pronghorn antelope. Eighty eight.",
"Number 4. The ostrich. Seventy.",
"Number 5. Usain Bolt. Forty four point seven."
]
}

def rank_reel(num, name, hook, hl, rank, tail, title, caption, story, style="trap", seed=None):
    shots = [title_slide(hook, hl, 2.6), rank] + tail
    return Reel(f"{num}_{name}", shots, style=style, seed=seed or num, title=title, caption=caption, story=story)

def highest_paid():
    r = RankingShot([("Cristiano Ronaldo", 300, "$300M"), ("Canelo Alvarez", 170, "$170M"), ("Lionel Messi", 140, "$140M"), ("LeBron James", 137.8, "$138M"), ("Shohei Ohtani", 127.6, "$128M"), ("Stephen Curry", 124.7, "$125M"), ("Jon Rahm", 107, "$107M"), ("Karim Benzema", 104, "$104M"), ("Kevin Durant", 103.8, "$104M"), ("Lewis Hamilton", 100, "$100M")],
                    "the 10 highest-paid athletes in the world", say=SAY["198"], source="Forbes, earnings May 2025 to May 2026", dur=10.5)
    return rank_reel(198, "highest_paid", "who gets paid the most in all of sports", ["paid", "most"], r,
        [num_slide("Ronaldo makes", 0, 9.51, "${:,.2f}", "every single second", 1, 3.6, 210, sub="even while he's asleep"), text_slide("$300M a year", "is about $822,000 a day", None, 2, 3.2, 96)],
        "the 10 highest-paid athletes right now", "Ronaldo makes $9.51 every second. who's your number 1?", "Forbes 2026 list (May 2025 to May 2026 earnings): Ronaldo $300M, Canelo $170M, Messi $140M, LeBron $137.8M, Ohtani $127.6M, Curry $124.7M, Rahm $107M, Benzema $104M, Durant $103.8M, Hamilton $100M (a few outlets differ slightly on Benzema and Curry). Math: $300M / 31,536,000 s = $9.51 per second; /365 = $821,918 per day.")

def richest():
    r = RankingShot([("Elon Musk", 839, "$839B"), ("Larry Page", 257, "$257B"), ("Sergey Brin", 237, "$237B"), ("Jeff Bezos", 224, "$224B"), ("Mark Zuckerberg", 222, "$222B"), ("Larry Ellison", 190, "$190B"), ("Bernard Arnault", 171, "$171B"), ("Jensen Huang", 154, "$154B"), ("Warren Buffett", 149, "$149B"), ("Amancio Ortega", 148, "$148B")],
                    "the 10 richest people on earth", say=SAY["199"], source="Forbes World's Billionaires 2026", dur=10.5, cols=((60, 170, 120), (255, 200, 40)))
    return rank_reel(199, "richest_people", "the 10 richest people alive. look at number 1", ["richest", "number", "1"], r,
        [text_slide("Musk is worth more than", "#2, #3 and #4 added together ($718B)", None, 3, 3.6, 90), num_slide("spend $1 million a day", 0, 2298, "{:,.0f}", "years to run out of Musk's money", 4, 3.6, 210)],
        "the 10 richest people on earth", "Musk is worth more than #2, #3 and #4 combined. tag the person who 'needs a raise'", "Forbes World's Billionaires 2026 (as reported): Musk $839B, Page $257B, Brin $237B, Bezos $224B, Zuckerberg $222B, Ellison $190B, Arnault family $171B, Huang $154B, Buffett $149B, Ortega $148B. Math: 257+237+224 = 718 < 839; 839e9 / (1e6 x 365) = 2,298 years.", style="synth")

def ronaldo_vs_elon():
    s = [title_slide("how long would Ronaldo have to play to earn Elon Musk's fortune", ["Ronaldo", "Musk"], 3.0),
         text_slide("Ronaldo earns", "$300 million a year (Forbes 2026)", None, 0, 2.8, 100),
         text_slide("Musk is worth", "$839 billion (Forbes 2026)", None, 1, 2.8, 100),
         num_slide("years Ronaldo would need", 0, 2797, "{:,.0f}", "years of earning $300M, no spending", 2, 3.6, 220),
         text_slide("he'd have started in about 770 BC", "before Rome was founded", None, 3, 3.6, 84),
         text_slide("and by then", "elon has made more", None, 4, 3.0, 96)]
    return Reel("200_ronaldo_vs_elon", s, style="cine", seed=200, title="how long for Ronaldo to earn Musk's fortune", caption="Ronaldo would need 2,797 years to earn what Elon Musk is worth. tag someone who says money isn't everything", story="Math: $839B / $300M per year = 2,797 years; 2026 - 2,797 = about 771 BC (traditional founding of Rome: 753 BC). Sources: Forbes 2026 athletes list and Forbes 2026 billionaires list.")

def messi_vs_ronaldo():
    v = VersusShot("Messi", "Ronaldo", [("Ballon d'Or wins", "8", "5", "l"), ("earnings, 2026", "$140M", "$300M", "r"), ("Instagram followers", "~511M", "~670M", "r"), ("World Cup goals (all-time)", "21", "11", "l")], title="Messi vs Ronaldo, by the numbers", source="Ballon d'Or: SI. Earnings: Forbes 2026. Followers: 2026 lists. WC goals: Reuters, July 2026", step=1.1, dur=9.8, say=["Ballon d'Or wins. Messi, eight. Ronaldo, five.", "Earnings in twenty twenty six. Messi, one forty million. Ronaldo, three hundred million.", "Instagram followers. Messi, about five hundred eleven million. Ronaldo, about six seventy million.", "World Cup goals, all time. Messi, twenty one. Ronaldo, eleven."])
    s = [title_slide("messi or ronaldo. let's settle it with numbers", ["messi", "ronaldo"], 2.8), v, text_slide("it's 2 - 2", "you're going to argue in the comments anyway", None, 2, 3.0, 96)]
    return Reel("201_messi_vs_ronaldo", s, style="trap", seed=201, title="Messi vs Ronaldo by the numbers", caption="it's 2-2. pick one in the comments. no, you can't say both", story="Messi 8 Ballon d'Or vs Ronaldo 5 (SI). Forbes 2026 earnings: Ronaldo $300M, Messi $140M. Instagram ~670M vs ~511M (2026 lists, vary by snapshot). World Cup goals all-time after the 2026 tournament per Reuters: Messi 21, Cristiano Ronaldo 11.")

def insta_followers():
    r = RankingShot([("Cristiano Ronaldo", 670, "~670M"), ("Lionel Messi", 511, "~511M"), ("Selena Gomez", 405, "~405M"), ("Kylie Jenner", 390, "~390M"), ("Dwayne Johnson", 390, "~390M"), ("Ariana Grande", 371, "~371M"), ("Kim Kardashian", 353, "~353M"), ("Beyonce", 307, "~307M")],
                    "most followed people on instagram", say=SAY["202"], source="approximate, 2026 snapshots", dur=9.2, cols=((190, 70, 150), (255, 200, 40)))
    return rank_reel(202, "insta_followers", "the 8 most followed people on instagram", ["followed"], r,
        [text_slide("Ronaldo has about", "twice the population of the united states in followers", None, 5, 3.6, 84)],
        "most followed people on instagram", "Ronaldo has twice the US population in followers. you have 400. tag the person who has 3,000 and posts like 5 million", "Follower counts vary by snapshot (Epidemic Sound, SocialPilot and others, 2026): Ronaldo ~666-679M, Messi ~511M, Selena Gomez ~403-415M, Kylie Jenner ~390M, Dwayne Johnson ~390M, Ariana Grande ~371M, Kim Kardashian ~353M, Beyonce ~307M. US population ~340M.", style="pop")

def nba_scorers():
    r = RankingShot([("LeBron James", 43440, "43,440"), ("Kareem Abdul-Jabbar", 38387, "38,387"), ("Karl Malone", 36928, "36,928"), ("Kobe Bryant", 33643, "33,643"), ("Kevin Durant", 32597, "32,597"), ("Michael Jordan", 32292, "32,292"), ("Dirk Nowitzki", 31560, "31,560"), ("Wilt Chamberlain", 31419, "31,419"), ("James Harden", 29339, "29,339"), ("Shaquille O'Neal", 28596, "28,596")],
                    "NBA all-time scoring leaders", say=SAY["203"], source="regular season points, start of 2026-27", dur=10.5, cols=((230, 120, 40), (255, 200, 40)))
    return rank_reel(203, "nba_scorers", "the 10 players who scored the most points in NBA history", ["scored", "most"], r,
        [num_slide("LeBron is ahead of #2 by", 0, 5053, "{:,.0f}", "points", 1, 3.2, 210, sub="that's 126 games of 40 points"), text_slide("and Durant just passed Jordan", "in March 2026", None, 2, 3.0, 96)],
        "NBA all-time scoring leaders", "LeBron is 5,053 points clear of Kareem. who do you think is the GOAT? i'll wait", "Regular-season career points entering 2026-27 (The Analyst / bet365): LeBron 43,440; Kareem 38,387; Malone 36,928; Kobe 33,643; Durant 32,597 (passed Jordan 21 March 2026); Jordan 32,292; Nowitzki 31,560; Chamberlain 31,419; Harden 29,339; Shaq 28,596. 43,440 - 38,387 = 5,053; 5,053 / 40 = 126.", style="trap")

def wc_scorers():
    r = RankingShot([("Kylian Mbappe", 22, "22"), ("Lionel Messi", 21, "21"), ("Miroslav Klose", 16, "16"), ("Ronaldo (Brazil)", 15, "15"), ("Gerd Muller", 14, "14"), ("Just Fontaine", 13, "13")],
                    "most goals in World Cup history", say=SAY["204"], source="Reuters factbox, July 2026", dur=7.6, cols=((70, 160, 100), (255, 200, 40)), step=.7)
    return rank_reel(204, "wc_scorers", "the new king of World Cup goals", ["king"], r,
        [text_slide("Just Fontaine scored 13", "in ONE tournament. in 1958", None, 3, 3.4, 90), text_slide("that record is still standing", "nobody has come close in 68 years", None, 4, 3.4, 90)],
        "all-time World Cup top scorers", "Mbappe passed Messi. Fontaine scored 13 in one tournament and nobody has touched it. which one is crazier?", "Per Reuters factbox compiled after the 2026 third-place match: Mbappe 22 (22 matches), Messi 21 (33), Klose 16 (24), Ronaldo (Brazil) 15, Gerd Muller 14, Fontaine 13. Fontaine's 13 came at the 1958 World Cup (widely documented single-tournament record).", style="cine")

def fastest_sport():
    r = RankingShot([("badminton smash", 565, "565 km/h"), ("jai alai ball", 306, "306 km/h"), ("squash ball", 267, "267 km/h"), ("tennis serve", 263, "263 km/h"), ("baseball pitch", 170, "170 km/h"), ("Usain Bolt", 44.7, "44.7 km/h")],
                    "the fastest things in sports", say=SAY["205"], source="Guinness (badminton, 2023), ATP/Challenger, MLB (Chapman, 2010)", dur=8.4, cols=((60, 150, 230), (255, 90, 90)), step=.7)
    return rank_reel(205, "fastest_sport", "what's the fastest thing in sports. it's not a ball", ["fastest", "ball"], r,
        [text_slide("a badminton shuttle", "is faster than a formula 1 car's top speed (~370)", None, 1, 3.6, 84), text_slide("and a human sprinting", "is slower than all of them", None, 2, 3.0, 90)],
        "the fastest things in sports", "a badminton smash is 565 km/h. tag the friend who says badminton is 'not a real sport'", "Badminton smash 565 km/h (Satwiksairaj Rankireddy, Guinness-verified 2023); jai alai pelota ~306 km/h (measured top speed); squash ball ~267 km/h; tennis serve 263.4 km/h (Sam Groth, Challenger level; unofficial for ATP); baseball 170.3 km/h (Chapman, 2010); Bolt's peak 44.7 km/h. F1 top speeds are about 370 km/h.", style="trap")

def fastest_animals():
    r = RankingShot([("peregrine falcon (dive)", 389, "389 km/h"), ("cheetah", 112, "112 km/h"), ("pronghorn antelope", 88, "88 km/h"), ("ostrich", 70, "70 km/h"), ("Usain Bolt", 44.7, "44.7 km/h")],
                    "fastest animals vs the fastest human", say=SAY["206"], source="approximate top speeds", dur=7.2, cols=((70, 170, 120), (255, 200, 40)), step=.8)
    return rank_reel(206, "fastest_animals", "how fast is the fastest human vs the animal kingdom", ["human"], r,
        [text_slide("a peregrine falcon in a dive", "is faster than a formula 1 car", None, 3, 3.4, 90), text_slide("the fastest human", "loses to an ostrich", None, 4, 3.0, 96)],
        "the fastest animals vs the fastest human", "Usain Bolt loses to an ostrich. tag your fastest friend", "Approximate maximum speeds: peregrine falcon in a dive ~389 km/h; cheetah ~112; pronghorn ~88; ostrich ~70; Usain Bolt peak ~44.7 km/h.", style="bounce")

REELS = dict(highest_paid=highest_paid, richest=richest, ronaldo_vs_elon=ronaldo_vs_elon, messi_vs_ronaldo=messi_vs_ronaldo, insta_followers=insta_followers, nba_scorers=nba_scorers, wc_scorers=wc_scorers, fastest_sport=fastest_sport, fastest_animals=fastest_animals)
