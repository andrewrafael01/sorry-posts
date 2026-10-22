"""Batch 45: education reels, money and numbers you can check. Not financial advice: every figure is arithmetic, the assumptions are stated."""
import math
from edu import *
import functools
R = functools.partial(R, chip="MONEY MATH")

def five_dollars():
    fv = 1825 * ((1.07 ** 40 - 1) / .07); assert 364000 < fv < 365000
    n = [
     N("Five dollars a day. That's a coffee, a snack, a small thing you barely notice. But what if you invested it instead? The math is wild.", T.kinetic([("$5 A DAY", GOLD, 140), ("FOR 40 YEARS", WHITE, 90)], "green")),
     N("Five dollars a day is about eighteen hundred twenty five dollars a year. Over forty years, that's seventy three thousand dollars you put in.", T.num("total you put in", 73000, fmt="{:,.0f}", pre="$", color=CY, bottom="$1,825 a year for 40 years", theme="green", word="seventy", dur=1.4)),
     N("Now invest it, and assume the stock market averages seven percent a year after inflation, which is roughly its long term history.", T.stat("the assumption", "7% A YEAR", "a long-term stock market average", ORG, "after inflation, not guaranteed", 150, theme="green")),
     N("At the end of forty years, those seventy three thousand dollars become about three hundred sixty four thousand dollars.", T.num("what it becomes", 364334, fmt="{:,.0f}", pre="$", color=GOLD, bottom="from $73,000 you put in", theme="green", word="three", dur=1.8)),
     N("That means about two hundred ninety one thousand dollars, about four times what you put in, came from growth alone. You didn't earn it. Time did.", T.vs(("you put in", 73000, CY), ("growth added", 291334, GRN), pre="$", fmt="{:,.0f}", theme="green", word="growth")),
     N("And the first years matter the most. Starting ten years later cuts the result by more than half. Time is the secret ingredient.", T.num("waiting 10 years costs", 53, fmt="{:.0f}", post="%", color=PINK, bottom="of the final amount", theme="green", word="ten", dur=1.0)),
     N("So the best time to start is as early as you can, even with a small amount. This isn't financial advice, just arithmetic. Check it yourself.", T.kinetic([("START EARLY", GOLD, 120), ("EVEN SMALL", WHITE, 90)], "green")),
    ]
    return R(267, "five_dollars_a_day", "what $5 a day becomes in 40 years", "$5 a day invested at 7% for 40 years becomes about $364,000. start early. send this to someone who buys a coffee every day (not financial advice)",
             "Annual $1,825 invested at 7% for 40 years: FV = 1825 x ((1.07^40 - 1) / 0.07) = $364,334 vs $73,000 contributed. Assumes 7% real return, annual contributions; not financial advice.", "funk", n)

def million_hours():
    n = [
     N("How many years of work does it take to earn a million dollars? The answer depends on your hourly pay, and it might make you rethink your career.", T.kinetic([("HOW LONG TO EARN", WHITE, 70), ("A MILLION?", GOLD, 140)], "green")),
     N("A full time worker works about two thousand eighty hours a year, forty hours a week for fifty two weeks.", T.num("work hours per year", 2080, fmt="{:,.0f}", color=CY, bottom="40 hours × 52 weeks", theme="green", word="two", dur=1.2)),
     N("At fifteen dollars an hour, you'd earn about thirty one thousand dollars a year. A million dollars would take thirty two years.", T.num("at $15 an hour", 32, fmt="{:.0f}", post=" years", color=ORG, bottom="to earn $1,000,000 before tax", theme="green", word="fifteen", dur=1.0)),
     N("At twenty dollars an hour, it takes twenty four years. At fifty dollars an hour, it takes just under ten years.", T.bars("years to earn $1 million", [("$15 / hour", 32), ("$20 / hour", 24), ("$50 / hour", 9.6)], fmt="{:.1f}", unit=" yrs", cols=[ORG, GOLD, GRN], theme="green", words=["fifteen", "twenty", "fifty"])),
     N("But wait. That's before taxes, rent, and food. After those, saving a million dollars out of pay takes much, much longer.", T.kinetic([("BEFORE TAXES", WHITE, 90), ("BEFORE RENT", WHITE, 90), ("BEFORE FOOD", GOLD, 90)], "green")),
     N("This is why people say you can't just trade time for money forever. Somewhere, your savings have to start working for you.", T.num("a million at 7% earns about", 70000, fmt="{:,.0f}", pre="$", post=" a year", color=GRN, bottom="while you sleep", theme="green", word="working", dur=1.4)),
     N("Seventy thousand dollars a year, from one million dollars. That's more than many people earn by working full time.", T.kinetic([("MONEY AT WORK", WHITE, 90), ("BEATS YOU AT WORK", GOLD, 80)], "green")),
    ]
    return R(268, "million_dollars_hours", "how long to earn a million dollars", "at $20 an hour it takes 24 years of full time work to earn a million dollars before tax. send this to someone chasing their first million",
             "2,080 h/year. $1M / ($15 x 2,080) = 32.1 years; $20 -> 24.0; $50 -> 9.6 (gross, before tax). A $1M portfolio at an assumed 7% return yields $70,000 a year (not guaranteed).", "funk", n)

def spend_1000():
    n = [
     N("If you could spend one thousand dollars every single second, how long would it take to spend a billion? Most people guess a few hours.", T.kinetic([("SPEND $1,000", WHITE, 100), ("EVERY SECOND", GOLD, 110)], "green")),
     N("One thousand dollars a second is sixty thousand dollars a minute, and three point six million an hour.", T.steps("at $1,000 per second", [("$60,000", "every minute"), ("$3.6 million", "every hour")], theme="green", words=["sixty", "three"])),
     N("A million dollars? That takes only one thousand seconds, about sixteen and a half minutes.", T.num("to spend $1 million", 16.7, fmt="{:.1f}", post=" minutes", color=CY, bottom="1,000 seconds", theme="green", word="million", dur=1.2)),
     N("But a billion dollars, a thousand times more, takes a thousand times longer. One million seconds. That's eleven and a half days of non stop spending.", T.num("to spend $1 billion", 11.6, fmt="{:.1f}", post=" days", color=GOLD, bottom="1,000,000 seconds, no sleep", theme="green", word="billion", dur=1.4)),
     N("And a trillion dollars, a thousand times more again? That's one billion seconds. Thirty one point seven years.", T.num("to spend $1 trillion", 31.7, fmt="{:.1f}", post=" years", color=PINK, bottom="1,000,000,000 seconds", theme="green", word="trillion", dur=1.6)),
     N("Millions, billions, and trillions sound like they're one step apart. They're each a thousand times bigger. That's a huge gap.", T.steps("each is 1,000× bigger", [("million", "16 minutes"), ("billion", "11 days"), ("trillion", "32 years")], theme="green", words=["Millions", "billions", "trillions"])),
     N("So when you hear about a company worth a trillion, remember. It would take you three decades to spend it, at a thousand dollars a second.", T.kinetic([("A TRILLION", WHITE, 100), ("= 32 YEARS", GOLD, 120)], "green")),
    ]
    return R(269, "spend_1000_per_second", "spending $1,000 a second", "spending $1,000 every second, a million takes 16 minutes, a billion takes 11 days, a trillion takes 32 years. send this to someone who says 'it's just a billion'",
             "$1,000/s: $1M = 1,000 s = 16.7 min; $1B = 1e6 s = 11.57 days; $1T = 1e9 s = 31.7 years.", "funk", n)

def lottery():
    r = 292201338 / 15300; assert 19000 < r < 19200
    n = [
     N("Winning the Powerball is far less likely than getting struck by lightning. But how much less? The answer is bigger than you think.", T.kinetic([("LOTTERY vs", WHITE, 100), ("LIGHTNING", GOLD, 130)], "ink")),
     N("The odds of winning the Powerball jackpot are one in two hundred ninety two million.", T.num("Powerball odds", 292, fmt="{:,.0f}", pre="1 in ", post=" million", color=GOLD, bottom="to win the jackpot", theme="ink", word="two", dur=1.2)),
     N("Your lifetime odds of being struck by lightning, according to the US National Weather Service, are about one in fifteen thousand.", T.num("lightning, lifetime odds", 15300, fmt="{:,.0f}", pre="1 in ", color=CY, bottom="over an 80 year life", theme="ink", word="fifteen", dur=1.2)),
     N("Do the division, and you're about nineteen thousand times more likely to be struck by lightning than to win the jackpot.", T.num("lightning is more likely by", 19100, fmt="{:,.0f}", post="×", color=PINK, bottom="than winning the Powerball", theme="ink", word="nineteen", dur=1.4)),
     N("Another way to see it. If you bought one ticket every single week, you'd expect to win about once every five point six million years.", T.num("one ticket a week, expect to win in", 5.6, fmt="{:.1f}", post=" million years", color=GOLD, bottom="longer than humans have existed", theme="ink", word="week", dur=1.4)),
     N("A single ticket costs two dollars, and on average it pays back less than that. Roughly half of ticket sales go to prizes. The lottery is a tax on hope.", T.stat("a $2 ticket is worth", "LESS THAN $2", "on average, by design", ORG, "about half of sales go to prizes", 130, theme="ink")),
     N("That doesn't mean you can't play for fun. Just know what you're buying, which is a daydream, and not a plan.", T.kinetic([("A DAYDREAM", GOLD, 120), ("NOT A PLAN", WHITE, 100)], "ink")),
    ]
    return R(270, "lottery_vs_lightning", "the lottery vs lightning", "you're about 19,000 times more likely to be struck by lightning than to win the Powerball. send this to someone who buys tickets",
             "Powerball jackpot odds 1 in 292,201,338; NOAA lifetime lightning odds about 1 in 15,300; ratio about 19,098.", "trap", n)

def gold_cube():
    side = (216265e3 / 19320) ** (1 / 3); assert 22 < side < 23
    n = [
     N("All the gold ever mined in human history, every ring, coin, crown, and bar, fits in a cube smaller than you'd guess.", T.kinetic([("ALL THE GOLD", WHITE, 100), ("EVER MINED", GOLD, 120)], "warm")),
     N("According to the World Gold Council, humans have mined about two hundred sixteen thousand tonnes of gold throughout history.", T.num("all gold ever mined", 216, fmt="{:,.0f}", post=",000 tonnes", color=GOLD, bottom="since ancient times", theme="warm", word="two", dur=1.4)),
     N("Gold is incredibly dense, nineteen point three times heavier than water. So all that gold takes up much less room than you'd expect.", T.num("density of gold", 19.3, fmt="{:.1f}", post=" × water", color=ORG, bottom="very heavy for its size", theme="warm", word="nineteen", dur=1.2)),
     N("Divide the weight by the density, and all the gold in the world takes up about eleven thousand cubic meters.", T.num("total volume", 11200, fmt="{:,.0f}", post=" m³", color=CY, bottom="216,000 t ÷ 19.3", theme="warm", word="eleven", dur=1.4)),
     N("If you stacked it into a cube, each side would be about twenty two meters, roughly the height of a seven story building.", T.num("the cube's side", 22.4, fmt="{:.1f}", post=" meters", color=GOLD, bottom="a seven story building", theme="warm", word="twenty", dur=1.2)),
     N("That's about four and a half Olympic swimming pools of solid gold. Everything humanity has ever dug up, in one place.", T.num("Olympic pools", 4.5, fmt="{:.1f}", color=PINK, bottom="of solid gold", theme="warm", word="four", dur=1.0)),
     N("And most of it is still around. Gold is rarely destroyed, only melted and reused. Some of the gold in your phone may have been a Roman coin.", T.kinetic([("GOLD IS", WHITE, 90), ("RECYCLED", GOLD, 120), ("FOREVER", WHITE, 90)], "warm")),
    ]
    return R(271, "all_gold_one_cube", "all the gold ever mined fits in one cube", "all the gold humans have ever mined fits in a cube about 22 meters on each side. send this to someone who likes shiny things",
             "World Gold Council: about 216,265 tonnes above ground (end 2023). Volume = 216,265,000 kg / 19,320 kg/m3 = 11,194 m3 = a cube of 22.4 m; Olympic pool 2,500 m3 = 4.5 pools.", "trap", n)

def inflation():
    k = 313.689 / 38.8; assert 8.0 < k < 8.2
    n = [
     N("A dollar in nineteen seventy buys what eight dollars buys today. Your money is quietly shrinking every year, and the math shows how fast.", T.kinetic([("$1 IN 1970", WHITE, 100), ("= $8 TODAY", GOLD, 120)], "warm")),
     N("The government tracks prices with the Consumer Price Index. In nineteen seventy, the index was thirty eight point eight. In twenty twenty four, it was about three hundred fourteen.", T.steps("the Consumer Price Index", [("1970", "38.8"), ("2024", "313.7")], theme="warm", words=["seventy", "twenty"])),
     N("Divide those numbers, and prices are about eight times higher. Something that cost one dollar in nineteen seventy costs about eight dollars now.", T.num("prices multiplied by", 8.1, fmt="{:.1f}", post="×", color=PINK, bottom="since 1970", theme="warm", word="eight", dur=1.4)),
     N("Turn it around. A dollar in your pocket from nineteen seventy is worth only about twelve cents in today's buying power.", T.num("1970's dollar is now worth", 12, fmt="{:.0f}", post="¢", color=ORG, bottom="of its buying power", theme="warm", word="twelve", dur=1.0)),
     N("Inflation of just three percent a year may sound small. By the rule of seventy two, prices double every twenty four years.", T.num("prices double every", 24, fmt="{:.0f}", post=" years", color=GOLD, bottom="at 3% a year (72 ÷ 3)", theme="warm", word="twenty", dur=1.0)),
     N("That's why money sitting under a mattress slowly loses value. A hundred dollars today buys only about fifty dollars' worth in twenty four years.", T.vs(("$100 today", 100, GRN), ("same $100 in 24 years", 50, PINK), pre="$", fmt="{:,.0f}", theme="warm", word="fifty")),
     N("So the goal isn't just to save. It's to earn more than inflation. Otherwise, you're running on a treadmill that moves backward.", T.kinetic([("BEAT", WHITE, 100), ("INFLATION", GOLD, 130)], "warm")),
    ]
    return R(272, "inflation_one_dollar", "what a dollar from 1970 is worth today", "a dollar from 1970 is worth about 12 cents today. prices have multiplied by 8. send this to someone who keeps their cash under a mattress",
             "US CPI-U annual average 1970 = 38.8; 2024 = 313.689; ratio 8.08. 1/8.08 = 12 cents. At 3% inflation, prices double in 72/3 = 24 years.", "trap", n)

def retire_early():
    a = 300 * (((1 + .07 / 12) ** 480 - 1) / (.07 / 12)); b = 300 * (((1 + .07 / 12) ** 360 - 1) / (.07 / 12))
    assert abs(a - 787444) < 5 and abs(b - 365991) < 5
    n = [
     N("Two people invest the same three hundred dollars a month, at the same return, until they're sixty five. One starts at twenty five. One starts at thirty five. The gap will shock you.", T.kinetic([("START AT 25", WHITE, 100), ("vs START AT 35", GOLD, 100)], "green")),
     N("Both invest three hundred dollars a month and earn seven percent a year. The only difference is that one waits ten years.", T.vs(("starts at 25", 300, CY), ("starts at 35", 300, ORG), pre="$", post="/mo", fmt="{:.0f}", note="same monthly amount", theme="green", word="three")),
     N("The early starter puts in four hundred eighty months of payments, a total of one hundred forty four thousand dollars.", T.num("early starter puts in", 144000, fmt="{:,.0f}", pre="$", color=CY, bottom="$300 × 480 months", theme="green", word="four", dur=1.4)),
     N("The late starter puts in only one hundred eight thousand dollars. That's thirty six thousand dollars less.", T.num("late starter puts in", 108000, fmt="{:,.0f}", pre="$", color=ORG, bottom="$36,000 less", theme="green", word="hundred", dur=1.4)),
     N("At sixty five, the person who started at twenty five has about seven hundred eighty seven thousand dollars.", T.num("starts at 25", 787444, fmt="{:,.0f}", pre="$", color=GRN, bottom="at age 65", theme="green", word="seven", dur=1.8)),
     N("The person who started at thirty five has about three hundred sixty six thousand. That's less than half, even though they only put in twenty five percent less.", T.num("starts at 35", 365991, fmt="{:,.0f}", pre="$", color=PINK, bottom="less than half", theme="green", word="three", dur=1.8)),
     N("Those ten extra years cost about four hundred twenty one thousand dollars. Time in the market beats almost everything. Start now, even small. This is arithmetic, not advice.", T.kinetic([("10 YEARS LATE", WHITE, 100), ("COSTS $421,000", GOLD, 100)], "green")),
    ]
    return R(273, "start_at_25_vs_35", "starting to invest at 25 vs 35", "investing $300 a month from 25 gives $787K at 65. starting at 35 gives $366K. same effort, 10 years apart. send this to someone in their 20s (not financial advice)",
             "$300/month, 7% annual return compounded monthly, to age 65: 480 months -> $787,444 (contributed $144,000); 360 months -> $365,991 (contributed $108,000). Illustrative arithmetic, not advice.", "funk", n)

def subscriptions():
    fv = 75 * (((1 + .07 / 12) ** 240 - 1) / (.07 / 12)); assert abs(fv - 39069) < 5
    n = [
     N("Five subscriptions at fifteen dollars each. That doesn't feel like much. But over twenty years, it adds up to a car.", T.kinetic([("5 SUBSCRIPTIONS", WHITE, 90), ("$15 EACH", GOLD, 130)], "ink")),
     N("Five times fifteen dollars is seventy five dollars a month. That's nine hundred dollars a year.", T.num("per year", 900, fmt="{:,.0f}", pre="$", color=CY, bottom="$75 every month", theme="ink", word="nine", dur=1.2)),
     N("Over twenty years, even with no price increases, you'll pay eighteen thousand dollars.", T.num("over 20 years", 18000, fmt="{:,.0f}", pre="$", color=GOLD, bottom="and prices usually rise", theme="ink", word="eighteen", dur=1.4)),
     N("Now imagine you invested that seventy five dollars a month instead, earning seven percent a year.", T.stat("the same $75 a month", "INVESTED INSTEAD", "at an assumed 7% a year", GRN, "", 90, theme="ink")),
     N("After twenty years, you'd have about thirty nine thousand dollars. More than double what you spent.", T.num("after 20 years invested", 39069, fmt="{:,.0f}", pre="$", color=GRN, bottom="more than double", theme="ink", word="thirty", dur=1.6)),
     N("After thirty years, it grows to over ninety one thousand dollars. That's from seventy five dollars a month, the price of five streaming apps.", T.num("after 30 years invested", 91498, fmt="{:,.0f}", pre="$", color=GOLD, bottom="from $27,000 put in", theme="ink", word="ninety", dur=1.8)),
     N("This isn't about never having fun. It's about knowing which subscriptions you actually use. Check your bank statement today. You might find money you forgot about.", T.kinetic([("CHECK YOUR", WHITE, 90), ("SUBSCRIPTIONS", GOLD, 110), ("TODAY", WHITE, 90)], "ink")),
    ]
    return R(274, "subscriptions_add_up", "what your subscriptions really cost", "5 subscriptions at $15 a month cost $18,000 over 20 years, or $39,000 if invested instead. check your bank statement today. send this to someone with too many apps",
             "5 x $15 = $75/month = $900/yr = $18,000 over 20 years. $75/month at 7% (monthly compounding) = $39,069 after 20 years, $91,498 after 30 years. Illustrative.", "trap", n)

def credit_card():
    r = .22 / 12; nn = -math.log(1 - r * 3000 / 100) / math.log(1 + r); assert 43 < nn < 45
    n = [
     N("You owe three thousand dollars on a credit card. You pay one hundred dollars a month. How long until you're free? Most people say thirty months. The real answer is longer.", T.kinetic([("$3,000 DEBT", WHITE, 100), ("$100 A MONTH", GOLD, 110)], "warm")),
     N("The card charges twenty two percent a year. That's about one point eight percent every month, taken on whatever you still owe.", T.num("monthly interest", 1.83, fmt="{:.2f}", post="%", color=PINK, bottom="22% a year, charged monthly", theme="warm", word="twenty", dur=1.0)),
     N("In the first month, you owe fifty five dollars in interest. So of your one hundred dollar payment, only forty five dollars actually reduces the debt.", T.vs(("paid toward debt", 45, GRN), ("eaten by interest", 55, PINK), pre="$", fmt="{:.0f}", theme="warm", word="fifty")),
     N("It takes forty four months, almost four years, to clear the balance. Not thirty.", T.num("months to pay it off", 44, fmt="{:.0f}", color=GOLD, bottom="almost 4 years", theme="warm", word="forty", dur=1.2)),
     N("In total, you pay about forty four hundred dollars. That's nearly fourteen hundred dollars in pure interest, for a three thousand dollar purchase.", T.num("total paid", 4395, fmt="{:,.0f}", pre="$", color=ORG, bottom="$1,395 of it is interest", theme="warm", word="forty", dur=1.6)),
     N("Now imagine paying just the minimum, which shrinks every month. It can take many years, and double what you borrowed.", T.kinetic([("THE MINIMUM", WHITE, 100), ("IS A TRAP", PINK, 120)], "warm")),
     N("The fix is simple, and hard. Pay more than the minimum, as early as you can. Every extra dollar attacks the interest, and saves you money.", T.kinetic([("PAY MORE", GOLD, 120), ("THAN THE MINIMUM", WHITE, 70)], "warm")),
    ]
    return R(275, "credit_card_trap", "how credit card interest works", "$3,000 on a 22% credit card paying $100 a month takes 44 months and costs $1,395 in interest. send this to someone with a credit card",
             "Balance $3,000, 22% APR (1.833%/month), fixed payment $100: n = -ln(1 - rB/P) / ln(1+r) = 43.95 months; total paid $4,395; interest $1,395.", "trap", n)

def weigh_million():
    n = [
     N("How much does a million dollars weigh? It depends entirely on how you carry it. And the answer is surprising.", T.kinetic([("HOW MUCH DOES", WHITE, 80), ("$1 MILLION WEIGH?", GOLD, 80)], "green")),
     N("A US banknote of any value weighs almost exactly one gram. A one dollar bill and a hundred dollar bill weigh the same.", T.num("one banknote", 1, fmt="{:.0f}", post=" gram", color=CY, bottom="a $1 bill = a $100 bill", theme="green", word="gram", dur=0.7)),
     N("So a million dollars in hundred dollar bills is ten thousand notes. That's only ten kilograms, about twenty two pounds.", T.num("$1 million in $100 bills", 10, fmt="{:.0f}", post=" kg", color=GOLD, bottom="22 pounds, fits in a backpack", theme="green", word="ten", dur=1.0)),
     N("Now carry the same million in one dollar bills. That's a million notes, weighing a full tonne.", T.num("$1 million in $1 bills", 1000, fmt="{:,.0f}", post=" kg", color=PINK, bottom="one tonne, like a small car", theme="green", word="million", dur=1.4)),
     N("What about a billion dollars in hundred dollar bills? Ten million notes. That's ten tonnes of paper.", T.num("$1 billion in $100 bills", 10, fmt="{:.0f}", post=" tonnes", color=ORG, bottom="a loaded truck", theme="green", word="billion", dur=1.0)),
     N("And it takes space, too. A million in hundred dollar bills is a stack just over a meter tall. A billion would be about a kilometer high.", T.vs(("$1 million", 1.1, GOLD), ("$1 billion", 1100, PINK), unit="", fmt="{:,.1f}", note="meters tall", log=True, theme="green", word="stack")),
     N("Next time a movie shows a hero running with millions in a small bag, remember. In hundreds, it's possible. In ones, that's a truck.", T.kinetic([("IN HUNDREDS: A BACKPACK", WHITE, 56), ("IN ONES: A TRUCK", GOLD, 70)], "green")),
    ]
    return R(276, "weight_of_a_million", "how much does a million dollars weigh", "a million dollars in $100 bills weighs 10 kg, but in $1 bills it weighs a full tonne. send this to someone who watches heist movies",
             "US notes weigh about 1 g each (1.0 g). $1M in $100s = 10,000 notes = 10 kg; in $1s = 1,000,000 notes = 1 tonne; $1B in $100s = 10 tonnes. Note thickness about 0.11 mm: $1M in $100s about 1.1 m; $1B about 1.1 km.", "funk", n)

REELS = dict(five_dollars_a_day=five_dollars, million_dollars_hours=million_hours, spend_1000_per_second=spend_1000, lottery_vs_lightning=lottery, all_gold_one_cube=gold_cube, inflation_one_dollar=inflation, start_at_25_vs_35=retire_early, subscriptions_add_up=subscriptions, credit_card_trap=credit_card, weight_of_a_million=weigh_million)
