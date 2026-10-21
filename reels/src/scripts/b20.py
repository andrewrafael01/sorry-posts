"""Batch 20: non-block formats. 'translated' kinetic reels (what they say / what it means) and lock-screen pile-ups. 160-171."""
from scripts.common import *
from phone import LockScreen

PAL = [(YELLOW, (46, 52, 96), (24, 28, 60)), (rgb("7dff9a"), (24, 90, 70), (10, 50, 40)), (rgb("ff8f5c"), (110, 40, 28), (60, 20, 16)), (rgb("9ad0ff"), (30, 70, 120), (14, 40, 80)),
       (rgb("ffd23f"), (120, 60, 160), (70, 30, 110)), (rgb("ff9ad0"), (150, 60, 100), (90, 30, 70)), (rgb("a6ffe8"), (20, 80, 100), (10, 40, 60))]

def translated(num, name, who, pairs, last, title, caption, story, style="bounce"):
    """pairs: [(what they say, what it actually means)]; last = (say, mean) saddest/funniest, shown on a dark card."""
    anims = ["slam", "pop", "shake", "slide", "pop", "wobble", "slam"]; sfx = ["hit", "pop", "hit", "swipe", "pop", "boing", "hit"]
    n = len(pairs) + 1
    shots = [KineticShot([dict(text=f"{who}, translated", at=0, size=104, weight="black", anim="pop", y=.4, hl=["translated"], maxw=940)], dur=2.2, bg=(16, 16, 20), bg2=(40, 40, 52))]
    for i, (say, mean) in enumerate(pairs):
        col, b1, b2 = PAL[i % len(PAL)]
        shots.append(KineticShot([dict(text=f"\"{say}\"", at=0, size=118 if len(say) < 14 else 92, weight="black", color=col, anim=anims[i % 7], y=.38, maxw=900, sfx=sfx[i % 7]),
                                  dict(text=mean, at=.5, size=78, weight="xbold", color=WHITE, anim="rise", y=.6, maxw=900)],
                                 dur=min(3.2, 1.7 + .05 * len(mean)), bg=b1, bg2=b2, fx=("rays",), fx_y=.38, counter=f"{i + 1} / {n}"))
    say, mean = last
    fin = KineticShot([dict(text=f"\"{say}\"", at=0, size=104 if len(say) < 16 else 84, weight="black", color=rgb("c9c9d6"), anim="pop", y=.38, maxw=900, sfx="pop"),
                       dict(text=mean, at=.6, size=78, weight="xbold", color=WHITE, anim="rise", y=.6, maxw=900)], dur=3.4, bg=(14, 14, 18), bg2=(14, 14, 18), counter=f"{n} / {n}", cues=[(.7, "womp", .4)])
    fin.music_dip = (.2, 3.2, .2); shots.append(fin)
    return Reel(f"{num}_{name}", shots, style=style, seed=num, title=title, caption=caption, story=story)

def desi_moms_translated():
    return translated(160, "desi_moms_translated", "desi moms", [("we'll see", "no"), ("do what you want", "you will regret this and i will remember"), ("i'm fine", "call me. now"), ("who is this friend", "i need his parents' names"), ("eat something", "i love you"), ("your cousin got engaged", "do you see where this is going"), ("no no it's okay", "it is not okay")],
        ("i'm not angry", "(she used your full name)"), "desi moms, translated", "'i'm not angry' with your full name. tag your mom", "Translations: we'll see = no; do what you want = you will regret it; i'm fine = call me; eat something = i love you; 'i'm not angry' = she used your full name.")

def arab_phrases_translated():
    return translated(161, "arab_phrases_translated", "arab families", [("inshallah", "no"), ("5 minutes", "90 minutes"), ("no no i insist", "i insist. do not argue"), ("you're like my brother", "i'm about to cut in line"), ("wallah", "i am lying but with feeling"), ("just a little tea", "you are not leaving"), ("welcome", "welcome. sit. eat. you live here now")],
        ("it's nothing", "(14 dishes)"), "arab families, translated", "'it's nothing' means 14 dishes. tag your arab friend", "Translations: inshallah = no; 5 minutes = 90; wallah = a lie with feeling; just a little tea = you're not leaving; 'it's nothing' = 14 dishes.", style="jazz")

def immigrant_dads_translated():
    return translated(162, "immigrant_dads_translated", "immigrant dads", [("we'll talk later", "never"), ("go to sleep", "i'm worried about you but i said it as an order"), ("how much was it", "i'm going to remember this for 6 years"), ("just drive safe", "i love you"), ("i'm not tired", "(asleep in the chair with the tv on)"), ("it's fine, i'll fix it", "i'll fix it in 2031"), ("what did you eat", "i miss you")],
        ("i'm proud of you", "(he told a stranger at the gas station, not you)"), "immigrant dads, translated", "'i'm proud of you' goes to a stranger at the gas station. tag your dad", "Translations: we'll talk later = never; just drive safe = i love you; what did you eat = i miss you; he's proud of you but tells a stranger.", style="synth")

def mexican_moms_translated():
    return translated(163, "mexican_moms_translated", "mexican moms", [("ahorita", "sometime between now and next year"), ("ya mero", "not even close"), ("no, si quieres", "(no. she wants you to want)"), ("ven acá", "you're in trouble. no one knows why yet"), ("nomás un poquito", "a plate the size of a hubcap"), ("no tengo nada", "(14 pots)"), ("mijo, come", "i love you")],
        ("estoy bien", "(she is not bien)"), "mexican moms, translated", "'ahorita' is a time zone. tag your mexican friend's mom", "Translations: ahorita = between now and next year; ya mero = not close; ven acá = you're in trouble; no tengo nada = 14 pots; estoy bien = she's not.", style="bounce")

def italian_grandmas_translated():
    return translated(164, "italian_grandmas_translated", "italian grandmas", [("just a little", "three plates"), ("i'm making something light", "lasagna"), ("you're so thin", "eat"), ("i'm fine", "i'm dying, call the priest"), ("mangia", "this is not a request"), ("it's nothing special", "the sauce she made since thursday"), ("don't bring anything", "bring dessert")],
        ("we'll see", "(she already decided)"), "italian grandmas, translated", "'i'm making something light.' it's lasagna. tag your nonna", "Translations: just a little = three plates; something light = lasagna; i'm fine = call the priest; don't bring anything = bring dessert.", style="funk")

def chinese_parents_translated():
    return translated(165, "chinese_parents_translated", "chinese parents", [("did you eat", "i love you"), ("you gained weight", "i love you"), ("not bad", "the best thing i've ever seen"), ("you got a 98? what happened to the 2", "i'm proud and i'll never tell you"), ("wear more clothes", "i love you"), ("drink hot water", "i love you"), ("come home", "i miss you")],
        ("we'll see", "(they saved your childhood artwork)"), "chinese parents, translated", "everything means i love you. tag your chinese friend", "Translations: nearly every phrase, from 'did you eat' to 'wear more clothes', means i love you; 'not bad' is the best praise.", style="lofi")

def persian_taarof_translated():
    return translated(166, "persian_taarof_translated", "persian hosts", [("ghabeleh nadareh", "pay me (it's already a lot)"), ("no, please, you first", "no, you first. no, YOU first"), ("don't bring anything", "bring dessert. and flowers"), ("i insist", "i've been insisting since 1994"), ("you're too kind", "you owe me a favor"), ("please, have more", "(a 4th plate)"), ("the house is yours", "(do not touch the couch)")],
        ("we're just having a small dinner", "(40 people)"), "persian hosts, translated", "'the house is yours' means don't touch the couch. tag your persian friend", "Translations of taarof: don't bring anything = bring dessert and flowers; the house is yours = don't touch the couch; a small dinner = 40 people.", style="jazz")

def desi_uncles_translated():
    return translated(167, "desi_uncles_translated", "desi uncles", [("just one question", "40 minutes"), ("let me explain", "he cannot"), ("in my time", "a story with a bus and no point"), ("what's the mileage", "hello"), ("i'll give you a good price", "i will ask my cousin"), ("don't worry about it", "worry about it"), ("beta, i know a guy", "he does not exist")],
        ("i'm not here to give advice", "(advice. 3 hours)"), "desi uncles, translated", "'i know a guy.' he does not exist. tag your uncle", "Translations: just one question = 40 minutes; what's the mileage = hello; i know a guy = nobody; i'm not here to give advice = three hours of advice.", style="funk")

def nigerian_parents_translated():
    return translated(168, "nigerian_parents_translated", "nigerian parents", [("we'll see", "no, and don't ask again"), ("i'm not angry", "(full name, middle name, and surname)"), ("come and eat", "this is an order with love"), ("is it a small thing?", "it is a very big thing"), ("my friend's son is a doctor", "i have no further comment"), ("the party starts at 4", "start at 8"), ("so you didn't call", "i have been waiting 4 years")],
        ("god will provide", "(also, send money)"), "nigerian parents, translated", "'i'm not angry' with your full name and surname. tag your nigerian friend", "Translations: we'll see = no; i'm not angry = full name; the party starts at 4 = it starts at 8; god will provide = also send money.", style="funk")

def immigrant_moms_translated():
    return translated(169, "immigrant_moms_translated", "immigrant moms", [("i made something small", "40 samosas"), ("nobody is coming", "12 people are coming"), ("take it for the road", "11 containers"), ("don't help, sit", "(why aren't you helping)"), ("i'm not hungry", "(she'll eat what's left of yours)"), ("it's easy to make", "(it took 6 hours)"), ("you look tired", "you look fat")],
        ("i don't need anything", "(she needs everything. she'll never say)"), "immigrant moms, translated", "'i don't need anything.' tag your mom", "Translations: something small = 40 samosas; don't help, sit = why aren't you helping; i'm not hungry = she'll eat yours; i don't need anything = she'll never say.", style="lofi")

def filipino_translated():
    return translated(170, "filipino_families_translated", "filipino families", [("ok lang", "it's not ok"), ("kain na", "eat. now. you're late"), ("anong oras ka uuwi", "i'm already awake waiting"), ("ito lang ang dala ko", "(a 20 pound suitcase of snacks)"), ("tita says hi", "tita is behind you. say hi"), ("bahala na", "i'm panicking, god help me"), ("sandali lang", "(40 minutes)")],
        ("no, it's fine", "(the slipper is in her hand)"), "filipino families, translated", "'ok lang' is never ok lang. tag your filipino friend", "Translations: ok lang = not ok; kain na = eat now; ito lang dala ko = 20 pounds of snacks; sandali lang = 40 minutes; the slipper means business.", style="bounce")

def aunty_whatsapp_lock():
    n = lambda app, title, body, at, **k: dict(at=at, app=app, title=title, body=body, color=(37, 211, 102), icon="W", **k)
    items = [n("WhatsApp", "FAMILY 🪔", "Raj Uncle: Good morning 🌻🙏", -1), n("WhatsApp", "FAMILY 🪔", "Meena Aunty: Good morning 🌻🙏🙏", .9), n("WhatsApp", "Priya Aunty (Forwarded)", "ALERT: do not drink water from the fridge after 3pm. doctors in germany confirm", 1.9),
             n("WhatsApp", "FAMILY 🪔", "Raj Uncle: who is this", 3.0), n("WhatsApp", "FAMILY 🪔", "Raj Uncle: this woman is looking for her family 🙏 pls share", 4.1), n("WhatsApp", "Meena Aunty", "📞 Missed voice call", 5.2), n("WhatsApp", "Meena Aunty", "📞 Missed voice call", 6.1), n("WhatsApp", "Meena Aunty", "ok call me when free. not urgent", 7.0)]
    s1 = PhoneShot(LockScreen("6:03", "Wednesday, October 22", items, max_cards=5, more=None), dur=9.4, caps=[dict(text="my phone at 6:03 am. the family group chat", style="hook", hl=["6:03", "am."], y=300)], bg=(30, 60, 50),
                   zoom=[(7.0, 7.9, 1.15, 540, 700)], music_dip=(6.9, 8.3, .2), cues=[(7.0, "boom", .5), (8.0, "womp", .4)])
    return Reel("171_aunty_whatsapp_lock", [s1], style="pop", seed=171, title="the family group chat at 6am", caption="'not urgent.' it's 6:03 am. tag the aunty who sends good morning", story="Lock screen at 6:03am: good-morning flowers, a 'doctors in germany' fridge forward, 'who is this', a 'woman looking for her family' chain, two missed calls and 'not urgent'.")

REELS = dict(desi_moms_translated=desi_moms_translated, arab_phrases_translated=arab_phrases_translated, immigrant_dads_translated=immigrant_dads_translated, mexican_moms_translated=mexican_moms_translated, italian_grandmas_translated=italian_grandmas_translated, chinese_parents_translated=chinese_parents_translated, persian_taarof_translated=persian_taarof_translated, desi_uncles_translated=desi_uncles_translated, nigerian_parents_translated=nigerian_parents_translated, immigrant_moms_translated=immigrant_moms_translated, filipino_translated=filipino_translated, aunty_whatsapp_lock=aunty_whatsapp_lock)
