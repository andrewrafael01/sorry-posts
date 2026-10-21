"""Batch 21: search-bar and notes/reminders formats 172-184. The list is the joke."""
from scripts.common import *
from phone import Search, Notes

def search_reel(num, name, hook, hl, events, title, caption, story, dark=False, bg=(40, 90, 200), style="pop", hold=3.0):
    ui = Search(events, dark=dark)
    last = max(i["at"] for i in ui.items)
    shot = PhoneShot(ui, dur=last + hold, caps=[dict(text=hook, style="hook", hl=hl, y=290)], bg=bg, music_dip=(last - .2, last + 1.2, .3), cues=[(last, "boom", .5), (last + .6, "womp", .4)])
    return Reel(f"{num}_{name}", [shot], style=style, seed=num, title=title, caption=caption, story=story)

def notes_reel(num, name, hook, hl, nt, lines, title, caption, story, dark=False, bg=(250, 160, 20), style="lofi", accent=(255, 159, 10), back="Notes", gap=1.0):
    ev, t = [], .7
    for ln in lines:
        kind, text = ln if isinstance(ln, tuple) else ("line", ln)
        ev.append(dict(at=t, text=text, kind=kind)); t += gap + (.25 if len(text) > 30 else 0)
    ui = Notes(nt, ev, dark=dark, accent=accent, back=back)
    shot = PhoneShot(ui, dur=t + 2.4, caps=[dict(text=hook, style="hook", hl=hl, y=290)], bg=bg, music_dip=(t - .6, t + .8, .3), cues=[(t - gap, "boom", .5), (t, "womp", .4)])
    return Reel(f"{num}_{name}", [shot], style=style, seed=num, title=title, caption=caption, story=story)

def g_mom():
    return search_reel(172, "g_mom", "googling why my immigrant mom does things", ["mom"], [dict(at=.4, q="why does my mom ", type_time=1.2, sugg=["keep 400 bags in a drawer", "say 'call me' and not say why", "wrap my plate while i'm still eating", "know i'm lying through the phone", "text me good morning flowers at 6am", "cut fruit and say nothing", "ask if i ate when i'm eating"], final="cut fruit and say nothing")],
        "googling why my immigrant mom does things", "'wrap my plate while i'm still eating.' send this to your mom's biggest fan", "Search suggestions for 'why does my mom': 400 bags in a drawer, 'call me' without a reason, wrapping your plate mid-meal, silent cut fruit.", bg=(66, 133, 244), style="pop")

def g_dad():
    return search_reel(173, "g_dad", "googling why my immigrant dad does things", ["dad"], [dict(at=.4, q="why does my dad ", type_time=1.2, sugg=["circle the parking lot for 20 minutes to save $3", "give me oranges at the airport", "never say i love you", "fall asleep at 8pm with the tv on", "drive 15 minutes to save 4 cents", "say 'i'm not tired' while asleep", "say he can fix it (he can't)"], final="give me oranges at the airport")],
        "googling why my immigrant dad does things", "'give me oranges at the airport.' tag your dad", "Search suggestions for 'why does my dad': $3 parking circles, oranges at the airport, never saying i love you, asleep with the tv on.", bg=(52, 100, 90), style="synth")

def g_aunties():
    return search_reel(174, "g_aunties", "googling why desi aunties do things", ["aunties"], [dict(at=.4, q="why do desi aunties ", type_time=1.3, sugg=["know everything", "bring 11 kilos of food 'for nothing'", "say you got dark", "stay one night for 9 days", "ask if you're married at a funeral", "call you beta after 4 seconds", "say 'i only told you' to 40 people"], final="know everything")],
        "googling why desi aunties do things", "'know everything.' tag the aunty", "Search suggestions for 'why do desi aunties': know everything, bring 11 kilos of food 'for nothing', ask if you're married at a funeral.", bg=(180, 70, 110), style="funk")

def g_arab():
    return search_reel(175, "g_arab", "googling why arab families do things", ["arab"], [dict(at=.4, q="why do arab families ", type_time=1.3, sugg=["say 5 minutes and mean 2 hours", "fight over the bill like it's a sport", "feed you until you cry", "have 40 cousins", "say wallah every 4 words", "insist you stay for dinner at 9pm", "say 'it's nothing' and bring 14 dishes"], final="fight over the bill like it's a sport")],
        "googling why arab families do things", "'say it's nothing and bring 14 dishes.' tag your arab friend", "Search suggestions for 'why do arab families': 5 minutes means 2 hours, fighting over the bill, 'it's nothing' with 14 dishes.", bg=(30, 120, 110), style="jazz")

def g_leave():
    return search_reel(176, "g_leave", "googling how to leave a party", ["leave"], [dict(at=.4, q="how to leave a desi house ", type_time=1.2, sugg=["without eating", "before 11 pm", "is it possible", "after 5 goodbyes"]),
        dict(at=5.6, q="how to leave an italian house ", type_time=1.2, sugg=["without a bag of food", "without 3 more plates", "is it legal"]), dict(at=10.6, q="how to leave a mexican party ", type_time=1.2, sugg=["without hugging 40 people", "in under 3 hours", "before the abuela finds out"], final="in under 3 hours")],
        "googling how to leave a party", "'is it legal.' tag who you can never leave a party with", "Three searches: how to leave a desi, Italian and Mexican house, each with escalating impossible suggestions.", bg=(120, 80, 190), style="bounce")

def g_parents_normal():
    return search_reel(177, "g_parents_normal", "googling 'is it normal that my parents'", ["normal"], [dict(at=.4, q="is it normal that my parents ", type_time=1.3, sugg=["have a drawer of 400 bags", "save every butter tub", "won't use the good dishes", "keep the plastic on the couch", "call every day to say nothing", "wake me at 6am to say good morning", "say 'we'll see' and mean no"], final="keep the plastic on the couch")],
        "googling 'is it normal that my parents'", "'keep the plastic on the couch.' yes. tag your parents", "Search suggestions for 'is it normal that my parents': 400 bags, butter tubs, good dishes never used, plastic on the couch.", bg=(24, 25, 29), dark=True, style="lofi")

def g_inshallah():
    return search_reel(178, "g_inshallah", "googling 'what does inshallah mean'", ["inshallah"], [dict(at=.4, q="what does inshallah mean ", type_time=1.3, sugg=["no", "maybe", "yes, in 2 hours", "it depends on my mood", "i'll be there in 5 minutes", "i'll never be there"], final="no")],
        "googling 'what does inshallah mean'", "'it depends on my mood.' tag your arab friend", "Search suggestions for 'what does inshallah mean': no, maybe, yes in 2 hours, it depends on my mood.", bg=(30, 120, 80), style="jazz")

def r_dad_fix():
    return notes_reel(179, "r_dad_fix", "things my dad said he'd fix", ["fix"], "Reminders: dad", [("done", "buy a ladder"), ("check", "fix the faucet (2019)"), ("check", "fix the faucet (2021)"), ("check", "fix the faucet (2023)"), ("done", "watch 3 youtube videos on faucets"), ("check", "call a plumber (he will not)"), ("head", "status: it's fine. it drips. it's a feature.")],
        "things my dad said he'd fix", "'it's a feature.' tag your dad", "A reminders list of Dad's repairs: the faucet is on the list for 2019, 2021 and 2023; he buys a ladder and watches videos but never calls a plumber; 'it drips. it's a feature.'", back="Lists", accent=(255, 69, 58), bg=(60, 70, 110))

def n_desi_wedding():
    return notes_reel(180, "n_desi_wedding", "how to survive a desi wedding", ["survive"], "desi wedding checklist", ["eat first", "greet 400 people", "hide from the aunty who asks about marriage", "avoid the uncle who wants to talk politics", "dance exactly one song", "take 14 photos with someone you don't know", "leave at 5 pm", ("head", "(left at 1:40 am)")],
        "how to survive a desi wedding", "'(left at 1:40 am).' tag your wedding plus one", "A notes checklist for a desi wedding ending with 'leave at 5 pm' and '(left at 1:40 am)'.", bg=(200, 80, 100), style="pop")

def n_mom_grocery():
    return notes_reel(181, "n_mom_grocery", "my mom's grocery list", ["grocery"], "grocery", ["milk", "eggs", "milk (again)", "the thing we always get", "the other thing", "whatever's on sale", "20 pound bag of rice (we have 2)", "a gift for someone (don't tell dad)", ("head", "total: $214. 'it was a good price'")],
        "my mom's grocery list", "'the thing we always get.' tag your mom", "A grocery list: milk twice, 'the thing we always get', a 20-pound rice bag when you have two, total $214 'a good price'.", bg=(70, 150, 90), accent=(52, 199, 89))

def n_contacts():
    return notes_reel(182, "n_contacts", "my phone contacts, desi edition", ["contacts"], "contacts", ["Mom", "Mom (other number)", "Dad (don't call during work)", "Aunty (Dubai)", "Aunty (Edison)", "Aunty (do not pick up)", "Uncle (knows a guy)", "Cousin (doctor)", "Cousin (also doctor)", ("head", "Cousin (got married, don't ask)")],
        "my phone contacts, desi edition", "'aunty (do not pick up).' tag your contacts list", "A desi contact list: Mom twice, Dad not at work, Aunty in Dubai and Edison and one you must not pick up, an uncle who knows a guy, and two doctor cousins.", bg=(40, 60, 120), style="funk", back="Contacts", accent=(10, 132, 255))

def n_grandma_rules():
    return notes_reel(183, "n_grandma_rules", "rules at my grandma's house", ["rules"], "grandma's house rules", ["don't say you're full", "don't say no thank you", "take the $20", "don't ask where she got it", "not eating = you're sick", "she's already packing your food", ("head", "you are leaving with a bag. there is no appeal.")],
        "rules at my grandma's house", "'you are leaving with a bag.' tag your grandma", "Rules at grandma's: no 'full', no 'no thank you', take the $20, not eating means you're sick, and you leave with a bag.", bg=(150, 90, 50), style="lofi")

def r_before_parents():
    return notes_reel(184, "r_before_parents", "before my immigrant parents visit", ["visit"], "Reminders: they're coming", [("check", "clean the bathroom (they will check)"), ("check", "hide the cereal"), ("check", "buy tea. the good tea"), ("check", "buy fruit. so much fruit"), ("done", "clean the whole apartment"), ("done", "buy a mop (just in case)"), ("head", "dad arrives with a mop.")],
        "before my immigrant parents visit", "'dad arrives with a mop.' tag who's visiting", "A reminders checklist before immigrant parents visit: hide the cereal, buy fruit, clean the bathroom they will check, and dad arrives with his own mop.", back="Lists", accent=(255, 69, 58), bg=(80, 60, 130), style="lofi")

REELS = dict(g_mom=g_mom, g_dad=g_dad, g_aunties=g_aunties, g_arab=g_arab, g_leave=g_leave, g_parents_normal=g_parents_normal, g_inshallah=g_inshallah, r_dad_fix=r_dad_fix, n_desi_wedding=n_desi_wedding, n_mom_grocery=n_mom_grocery, n_contacts=n_contacts, n_grandma_rules=n_grandma_rules, r_before_parents=r_before_parents)
