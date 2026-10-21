"""Batch 3: group archetype reels 011-020."""
from arch import *

def meta(r, title, caption, story): r.title, r.caption, r.story = title, caption, story; return r

# ------------------------------------------------------------------ 011 BMW
def bmw_guys():
    K = dict(lease=person("23232b", "tan", "black", glasses="sun"), rev=person("34343e", "light", "black", glasses="sun"), badge=person("3f4552", "brown", "black"),
             park=person("2b3a55", "light", "brown"), fix=person("6c7a89", "pale", "grey"), friend=person("d9534f", "light", "red"), other=person("3a9d5d", "tan", "brown"))
    car = lambda c, **k: P("car", k.pop("x", .5), k.pop("y", .72), k.pop("size", 520), kw=dict(color=c), **k)
    sh = [lineup("bmw guys", ["lease", "rev", "badge", "park", "fix"], K, "parking", dur=3.2)]
    sh.append(beat("THE LEASE GUY", "says \"my car\" for 36 payments", ["\"my", "car\""], "parking", [A("lease", .3, "smirk", "talk", 2.2)], [car("1f2430", x=.7, size=560)],
                   [S("my car", 0, .5, 1.3)], card=dict(title="payment 14 of 36", y=.5, at=1.4), cast=K, dur=3.2))
    sh.append(beat("THE TURN SIGNAL GUY", "his blinker is a rumor", ["rumor"], "highway", [], [P("car", .25, .74, 480, kw=dict(color="3a6fd8"), anim="shake"), P("car", .7, .72, 560, kw=dict(color="1f2430"), anim="move", tx=.35, ty=.72, md=1.1, flip=True)],
                   pop=dict(text="NO SIGNAL", at=1.2, color=rgb("ff4d4d"), y=.42), cues=[(1.4, "horn", .8)], cast=K, shake=[(1.4, 14, .4)], dur=3.2))
    sh.append(beat("THE \"M\" GUY", "the M is a sticker. the car is a 318i", ["sticker.", "318i"], "parking", [A("badge", .25, "smirk", "talk", 2.1), A("friend", .78, "worried", "idle", 2.1, flip=True)],
                   [car("8a93a5", x=.5, y=.78, size=420), P("sign", .5, .62, 200, text="318i", fg="1a1a1a")], [S("it's the M package", 0, .4, 1.7, size=40), S("that's a sticker", 1, 2.0, 1.4)], cast=K, dur=3.8))
    sh.append(beat("THE REV GUY", "revs it at a red light. alone. at 2 am.", ["2", "am."], "highway", [A("rev", .3, "cool", "idle", 2.0)], [car("c0392b", x=.7, y=.74, size=560, anim="shake")],
                   pop=dict(text="VROOOM", at=.7, color=YELLOW, y=.4, size=150), cues=[(.7, "boom", .6)], tint=(15, 20, 60, .35), shake=[(.7, 16, .6)], cast=K, dur=3.0))
    sh.append(beat("THE PARKING GUY", "takes two spots so nobody touches it", ["two", "spots"], "parking", [A("other", .84, "angry", "idle", 1.9, flip=True)], [car("1f2430", x=.4, y=.76, size=900, pop=False), car("e6c94d", x=.9, y=.8, size=300, pop=False)],
                   [S("...really?", 0, 1.0, 1.4)], cast=K, dur=3.2))
    sh.append(beat("THE REPAIR GUY", "\"check engine\" is a monthly subscription", ["monthly", "subscription"], "dealer", [A("fix", .26, "shock", "shrug", 2.1)],
                   [P("receipt", .72, .56, 420, lines=[("oil change", "$249"), ("wipers", "$180"), ("\"a noise\"", "$740")], total="$1,169", at=.4, rot=3)], cues=[(.4, "cash", .6)], cast=K, dur=3.4))
    sh.append(beat("THE BMW GUY", "\"best car i've ever owned\"", ["best", "car"], "street", [A("lease", .28, "cool", "talk", 2.2)], [car("1f2430", x=.72, y=.74, size=560), P("smoke", .86, .6, 300, at=.3, anim="float")],
                   [S("best car i've ever owned", 0, .5, 1.9, size=40)], cues=[(.3, "alarm", .35)], cast=K, shake=[(.3, 6, .4)], dur=3.4))
    return meta(Reel("011_bmw_guys", sh, "synth", 6), "bmw guys", "every bmw guy has a bmw story and none of them are good. tag yours", "BMW owners: the 36-payment lease, the signal-less lane change, the M sticker on a 318i, the 2am rev, the two-spot park, the $1,169 oil change, the 'best car i've ever owned' with smoke coming out.")

# ------------------------------------------------------------------ 012 Mercedes
def mercedes_guys():
    K = dict(star=person("e8e4dc", "light", "grey", extra="vest"), amg=person("20232b", "tan", "black", glasses="sun"), valet=person("d9d9df", "brown", "black", extra="tie"), dad=person("8a6a45", "light", "grey"), sell=person("3a4a6a", "pale", "blond", extra="tie"), meh=person("c0392b", "light", "brown"))
    car = lambda c, **k: P("car", k.pop("x", .5), k.pop("y", .72), k.pop("size", 520), kw=dict(color=c), **k)
    sh = [lineup("mercedes guys", ["star", "amg", "valet", "dad", "sell"], K, "dealer", dur=3.2)]
    sh.append(beat("THE ENTRANCE GUY", "parks it nose out, front row, for the star", ["front", "row,"], "parking", [A("star", .25, "cool", "idle", 2.1)], [car("d9dce6", x=.68, y=.76, size=600)],
                   [S("it's about presence", 0, .6, 1.8)], cast=K, dur=3.2))
    sh.append(beat("THE \"AMG\" GUY", "\"it's the AMG.\" it's the AMG Line.", ["AMG", "Line."], "street", [A("amg", .26, "smirk", "talk", 2.1), A("meh", .8, "worried", "idle", 2.0, flip=True)],
                   [car("20232b", x=.55, y=.8, size=460), P("sign", .55, .64, 190, text="AMG LINE", fg="1a1a1a")], [S("it's the AMG", 0, .4, 1.4), S("it says 'line'", 1, 1.9, 1.5)], cast=K, dur=3.6))
    sh.append(beat("THE VALET GUY", "hands over the keys like a knighting", ["knighting"], "street", [A("valet", .3, "smile", "idle", 2.1), A("star", .72, "cool", "point", 2.1, flip=True)], [car("d9dce6", x=.5, y=.84, size=360)],
                   [S("take care of her", 1, .5, 1.6)], pop=dict(text="($20)", at=1.8, color=rgb("7dff9a"), y=.4, size=110), cues=[(1.8, "cash", .7)], cast=K, dur=3.4))
    sh.append(beat("THE DEALERSHIP", "oil change: $400 and a free bottle of water", ["$400", "water"], "dealer", [A("sell", .72, "smile", "wave", 2.1, flip=True)], [P("receipt", .28, .5, 400, lines=[("oil change", "$400"), ("free water", "$0")], total="$400", rot=-3), P("tumbler", .5, .66, 160, kw=dict(color="6c8ebf"), at=1.2)],
                   [S("complimentary", 0, 1.4, 1.5)], cues=[(1.2, "sparkle", .5)], cast=K, dur=3.4))
    sh.append(beat("THE \"MY DAD'S\" GUY", "\"it's my dad's.\" dad is 41 payments in", ["dad's.", "41"], "parking", [A("meh", .26, "smirk", "talk", 2.1), A("dad", .78, "worried", "idle", 2.1, flip=True)], [car("1f2430", x=.55, y=.78, size=520)],
                   [S("it's my dad's", 0, .4, 1.4), S("it's the bank's", 1, 1.9, 1.5)], cast=K, dur=3.6))
    sh.append(beat("THE MERCEDES GUY", "the warning light says \"service A\" and he is scared", ["\"service", "A\""], "dealer", [A("star", .3, "worried", "shock", 2.1)], [P("sign", .72, .55, 420, text="SERVICE A", fg="d62828"), P("receipt", .72, .78, 260, lines=[("it's not the", "tires")], total="$1,860", at=1.3)],
                   cues=[(.3, "alarm", .5), (1.3, "boom", .6)], cast=K, shake=[(1.3, 10, .3)], dur=3.6))
    return meta(Reel("012_mercedes_guys", sh, "jazz", 8), "mercedes guys", "the star on the hood is carrying so much emotional weight. tag the mercedes guy", "Mercedes owners: front-row nose-out parking, the AMG Line, valet knighting, the $400 oil change with free water, 'it's my dad's', and Service A.")

# ------------------------------------------------------------------ 013 High schoolers
def highschoolers():
    K = dict(front=person("2a6fdb", "light", "brown", glasses="round"), nap=person("6e7a8a", "tan", "black", extra="hoodie"), car=person("e6c94d", "brown", "black", style="cap"), proj=person("a678de", "pale", "red"), late=person("3aa655", "light", "blond"), teach=person("8a5a3a", "tan", "grey", extra="tie"))
    sh = [lineup("high schoolers", ["front", "nap", "car", "proj", "late"], K, "hallway", dur=3.2)]
    sh.append(beat("THE FRONT ROW KID", "hand is up before the question ends", ["before"], "class", [A("front", .3, "smile", "hands_up", 2.1), A("teach", .78, "worried", "talk", 2.1, flip=True)], [P("whiteboard", .65, .38, 520, text="Q: what is the cap")],
                   [S("it's...", 0, .4, 1.0), S("...let me finish the question", 1, 1.5, 1.7, size=40)], cast=K, dur=3.4))
    sh.append(beat("THE \"IS THIS GRADED\" KID", "if it's not graded, he's not there", ["not", "graded,"], "class", [A("nap", .3, "sleepy", "slump", 2.1)], [P("whiteboard", .7, .38, 420, text="worksheet #7")],
                   [S("is this graded", 0, .5, 1.5)], pop=dict(text="no", at=1.8, color=WHITE, y=.45, size=140), tint=(60, 60, 80, .1), cast=K, dur=3.2))
    sh.append(beat("THE 16-YEAR-OLD DRIVER", "his mom's minivan is a status symbol", ["minivan"], "parking", [A("car", .28, "cool", "flex", 2.1)], [P("car", .7, .76, 600, kw=dict(color="9aa3b5")), P("sign", .7, .6, 200, text="MOM'S", fg="1a1a1a")],
                   [S("park next to the good spot", 0, .5, 1.8, size=38)], pop=dict(text="5 passengers", at=1.6, color=YELLOW, y=.4, size=110), cast=K, dur=3.2))
    sh.append(beat("THE GROUP PROJECT", "4 kids, 1 slideshow, 1 who did it at 2am", ["1", "who"], "class", [A("proj", .24, "dead", "shrug", 2.0), A("late", .5, "smile", "idle", 2.0), A("front", .76, "smile", "wave", 2.0)], [P("laptop", .5, .55, 360, screen="fff2cc")],
                   [S("i'll add my part tonight", 1, .4, 1.7, size=38), S("i did it all", 0, 2.2, 1.2)], cast=K, dur=3.6))
    sh.append(beat("THE LATE BUS KID", "runs for the bus. every day. same place.", ["every", "day."], "street", [A("late", .22, "scream", "run", 2.1, slide_to=.78, slide_at=.2, slide_dur=2.0, slide_pose="run")], [P("car", .88, .76, 520, kw=dict(color="f4c20d"), anim="move", tx=1.4, ty=.76, md=2.6)],
                   cues=[(2.3, "horn", .5), (2.6, "womp", .0)], pop=dict(text="0:01", at=1.6, color=rgb("ff4d4d"), y=.38), cast=K, dur=3.2))
    sh.append(beat("THE NAP KID", "asleep with the hood up. gets an A.", ["gets", "an", "A."], "class", [A("nap", .5, "sleepy", "slump", 2.2)], [P("sign", .5, .3, 180, text="Zzz", fg="2a6fdb", color="eef3ff")], pop=dict(text="A+", at=1.6, color=rgb("7dff9a"), y=.42, size=190), cues=[(1.6, "ding", .6)], cast=K, dur=3.2))
    return meta(Reel("013_highschoolers", sh, "bounce", 12), "high schoolers", "everyone was one of these. tag the kid who did the whole group project", "High-school archetypes: hand-up-before-the-question-ends front row kid, 'is this graded', the minivan driver, the 2am group project hero, the daily bus runner, and the hood-up napper who still gets an A.")

# ------------------------------------------------------------------ 014 Dads at the hardware store
def dads_hardware():
    K = dict(dad1=person("c0392b", "light", "grey", extra="vest"), dad2=person("2a6fdb", "pale", "brown", style="cap", cap="3a6fd8"), dad3=person("e6c94d", "tan", "black"), dad4=person("5a7a4a", "light", "red"), emp=person("f08a3c", "brown", "black", extra="vest"), mom=person("3fb0a8", "light", "grey", style="bob"))
    sh = [lineup("dads at the hardware store", ["dad1", "dad2", "dad3", "dad4", "emp"], K, "store", dur=3.2)]
    sh.append(beat("THE \"JUST LOOKING\" DAD", "went in for 1 screw. 2 hours later.", ["2", "hours"], "store", [A("dad1", .3, "smile", "idle", 2.1)], [P("clock", .78, .3, 200, kw=dict(hour=2, minute=10)), P("cart", .7, .78, 360, front=True, pop=False), P("hammer", .72, .62, 180, rot=20, at=.6), P("cone", .88, .75, 200, at=1.2)],
                   [S("i'll just grab a screw", 0, .4, 1.5)], hud=[(0, "11:02 AM"), (1.6, "1:14 PM")], cast=K, dur=3.4))
    sh.append(beat("THE \"I CAN FIX IT\" DAD", "learned it 4 minutes ago on youtube", ["4", "minutes"], "living", [A("dad2", .3, "smirk", "flex", 2.1), A("mom", .78, "worried", "shrug", 2.1, flip=True)], [P("phone", .5, .52, 260, kw=dict(text="how to fix pipe")), P("hammer", .5, .75, 200, rot=-30, anim="swing")],
                   [S("i've got it", 0, .4, 1.3), S("we have a plumber", 1, 1.9, 1.5)], cast=K, dur=3.4))
    sh.append(beat("THE EMPLOYEE'S FRIEND", "knows every employee by name. 40 min chat.", ["every", "employee"], "store", [A("dad3", .3, "smile", "talk", 2.1), A("emp", .72, "dead", "idle", 2.1, flip=True)], [],
                   [S("how's the knee, Gary", 0, .4, 1.6), S("it's fine, sir", 1, 2.0, 1.3), ], hud=[(0, "12:01 PM"), (2.2, "12:41 PM")], cues=[(2.4, "crickets", .3)], cast=K, dur=3.6))
    sh.append(beat("THE THERMOSTAT DAD", "\"it's 71. we don't need 72.\"", ["71.", "72."], "living", [A("dad4", .28, "angry", "point", 2.1)], [P("sign", .75, .4, 320, text="71°", fg="d62828")], [S("who touched it", 0, .4, 1.4), S("somebody's rich", 0, 1.9, 1.4)], pop=dict(text="71", at=1.8, color=rgb("ff4d4d"), y=.5, size=180), cast=K, dur=3.6))
    sh.append(beat("THE GRILL DAD", "stands guard. no one else may touch the tongs.", ["tongs."], "park", [A("dad1", .28, "cool", "flex", 2.2)], [P("grill", .72, .7, 420)], [S("step away from the grill", 0, .5, 1.6, size=38)], cues=[(.5, "tick", .4)], cast=K, dur=3.2))
    sh.append(beat("EVERY DAD", "\"come here, hold this.\" (it's a 3-hour job)", ["\"come", "here,", "hold", "this.\""], "store", [A("dad2", .28, "smile", "point", 2.1), A("mom", .76, "dead", "idle", 2.1, flip=True)], [P("hammer", .5, .6, 180)], [S("come here. hold this", 0, .4, 1.5)], hud=[(0, "2:00 PM"), (1.8, "5:00 PM")], cast=K, dur=3.4))
    return meta(Reel("014_dads_hardware", sh, "funk", 14), "dads at the hardware store", "my dad went in for a screw and came back with a ladder and a story about Gary. tag your dad", "Hardware store dads: one screw, two hours; 'i can fix it' from a 4-minute YouTube video; best friends with every employee; the thermostat police; grill guard; 'come hold this'.")

# ------------------------------------------------------------------ 015 Moms in cars
def moms_cars():
    K = dict(mom=person("3fb0a8", "light", "grey", style="bob"), kid=person("f2a1b8", "tan", "black", style="long"), kid2=person("e6c94d", "light", "brown"), dad=person("8a6a45", "light", "grey", extra="vest"))
    car_in = lambda: [P("car", .5, .74, 1080, kw=dict(color="6c8ebf"), pop=False)]
    sh = [lineup("moms in cars", ["mom", "kid", "kid2", "dad", "mom"], K, "highway", dur=3.2)]
    sh.append(beat("THE PASSENGER BRAKE", "presses an imaginary brake pedal", ["imaginary", "brake"], "highway", [A("mom", .4, "worried", "shock", 2.0), A("dad", .75, "dead", "idle", 2.0, flip=True)], [P("car", .5, .74, 1100, kw=dict(color="6c8ebf"), pop=False, front=False)],
                   [S("(stomps floor)", 0, .5, 1.3, size=40), S("it's green", 1, 1.8, 1.2)], shake=[(.5, 8, .25), (1.2, 8, .25)], cast=K, dur=3.4))
    sh.append(beat("THE \"WHO IS THAT?\" MOM", "asks it about every actor. every time.", ["every", "time."], "living", [A("mom", .3, "smile", "point", 2.1), A("kid", .76, "dead", "idle", 2.1, flip=True)], [P("tv", .5, .45, 520, screen="2b2f3a", text="a famous actor")],
                   [S("who is that", 0, .4, 1.1), S("tom hanks", 1, 1.5, 1.0), S("no, who IS that", 0, 2.6, 1.3)], cast=K, dur=3.8))
    sh.append(beat("THE \"TEXT ME WHEN\" MOM", "\"text me when you get there\" (you're at the door)", ["\"text", "me", "when"], "street", [A("mom", .26, "smile", "wave", 2.1), A("kid", .72, "smirk", "idle", 2.1, flip=True)], [P("phone", .5, .55, 240, kw=dict(text="Mom: did u get there?"), at=1.6, anim="bounce")],
                   [S("text me when you get there", 0, .4, 1.5), S("...i'm in the driveway", 1, 2.0, 1.3)], cues=[(1.6, "buzz", .7)], cast=K, dur=3.6))
    sh.append(beat("THE PURSE MOM", "carries everything. a bandage, 6 pens, a snack from 2019", ["everything."], "living", [A("mom", .3, "smile", "flex", 2.1)], [P("bag", .72, .6, 340, kw=dict(color="a8774c"))],
                   [S("i have a bandage", 0, .4, 1.3)], card=dict(title="snack from 2019", sub="still good", y=.42, at=1.5), cast=K, dur=3.4))
    sh.append(beat("THE \"I'M NOT MAD\" MOM", "(she is mad. she's using a different voice)", ["mad.", "voice)"], "living", [A("mom", .3, "angry", "idle", 2.2), A("kid2", .76, "scream", "shock", 2.0, flip=True)], [],
                   [S("i'm not mad", 0, .5, 1.3)], pop=dict(text="FULL NAME", at=1.5, color=rgb("ff4d4d"), y=.42, size=120), cues=[(1.5, "boom", .8)], shake=[(1.5, 14, .4)], cast=K, dur=3.4))
    sh.append(beat("EVERY MOM", "\"i'm fine. eat. have you eaten?\"", ["eaten?\""], "kitchen", [A("mom", .3, "smile", "talk", 2.2)], [P("dish", .72, .72, 360, food="f4e3b0")], [S("have you eaten", 0, .4, 1.4), S("i'm fine. eat", 0, 1.9, 1.3)], cues=[(.4, "sparkle", .4)], cast=K, dur=3.4))
    return meta(Reel("015_moms_in_cars", sh, "lofi", 15), "moms", "mom's invisible brake pedal has saved us all. tag your mom", "Moms: imaginary passenger brake, 'who is that' about every actor, 'text me when you get there' while you're in the driveway, the infinite purse, 'i'm not mad', and 'have you eaten'.")

# ------------------------------------------------------------------ 016 Grandmas
def grandmas():
    K = dict(gma=person("e8a0b8", "pale", "white", style="bob", glasses="round"), gpa=person("7a8a9a", "light", "grey", extra="vest"), kid=person("6c8ebf", "tan", "black", extra="hoodie"), kid2=person("3aa655", "light", "red"))
    sh = [lineup("grandmas", ["gma", "gma", "gma", "gma", "gma"], K, "living", dur=3.2)]
    sh.append(beat("THE HUG GRANDMA", "slides $20 in your hand like it's illegal", ["$20"], "living", [A("gma", .3, "smile", "wave", 2.2), A("kid", .74, "shock", "idle", 2.1, flip=True)], [P("money", .52, .55, 200, anim="move", tx=.66, ty=.55, md=.8, at=.8, rot=15)],
                   [S("don't tell your mother", 0, .4, 1.6, size=40)], cues=[(.8, "swipe", .6)], cast=K, dur=3.2))
    sh.append(beat("THE \"JUST A LITTLE\" GRANDMA", "\"just a little\" = a plate you could lie down on", ["a", "little"], "kitchen", [A("gma", .28, "smile", "flex", 2.1), A("kid", .76, "worried", "idle", 2.1, flip=True)], [P("dish", .5, .78, 700, food="f2c94c", at=.8)],
                   [S("just a little", 0, .4, 1.4), S("that's a mountain", 1, 1.6, 1.3)], cues=[(.8, "thud", .8)], cast=K, shake=[(.8, 8, .3)], dur=3.4))
    sh.append(beat("THE WRONG-NAME GRANDMA", "calls you every name before yours", ["every", "name"], "living", [A("gma", .28, "smile", "talk", 2.1), A("kid", .74, "dead", "idle", 2.1, flip=True)], [],
                   [S("Michael... David... Sandra...", 0, .4, 1.9, size=40), S("...the dog", 0, 2.4, 1.2, size=40), S("it's me", 1, 3.2, 1.0)], cast=K, dur=4.2))
    sh.append(beat("THE GIFT GRANDMA", "gives you socks. with the receipt.", ["socks.", "receipt."], "living", [A("gma", .28, "smile", "cheer", 2.1), A("kid", .74, "smirk", "idle", 2.1, flip=True)], [P("gift", .5, .7, 300, at=.3), P("receipt", .5, .5, 260, lines=[("socks", "$4")], total="$4", at=1.8, rot=3)],
                   [S("in case you want to return them", 0, 1.2, 1.7, size=38)], cues=[(.3, "sparkle", .5)], cast=K, dur=3.6))
    sh.append(beat("THE FORWARD GRANDMA", "sends 11 prayers and a 2009 email chain", ["11", "2009"], "living", [A("gma", .28, "smile", "point", 2.1)], [P("phone", .72, .55, 300, kw=dict(text="FWD: FWD: FWD: Fw: GOOD MORNING"), anim="bounce")], card=dict(title="forwarded 47 times", y=.4, at=1.2), cues=[(.4, "buzz", .6)], cast=K, dur=3.2))
    sh.append(beat("THE KITCHEN GRANDMA", "\"i'm not hungry\" (cooks for 14)", ["cooks", "for", "14)"], "kitchen", [A("gma", .3, "smile", "flex", 2.1)], [P("pot", .72, .66, 380), P("pot", .9, .7, 300, kw=dict(color="c0392b")), P("dish", .5, .84, 220)],
                   [S("i'm not hungry", 0, .4, 1.3)], card=dict(title="14 guests", sub="she expected 3", y=.4, at=1.6), cast=K, dur=3.4))
    sh.append(beat("EVERY GRANDMA", "\"call me when you get home\" then calls you first", ["calls", "you", "first"], "living", [A("gma", .3, "smile", "wave", 2.2)], [P("phone", .72, .55, 260, kw=dict(text="Grandma calling..."), anim="bounce")], [S("did you get home", 0, .4, 1.4)], cues=[(.4, "buzz", .7)], cast=K, dur=3.2))
    return meta(Reel("016_grandmas", sh, "jazz", 16), "grandmas", "grandma's love language is food and a folded $20. tag your grandma", "Grandma archetypes: slides you $20, 'just a little' plate, wrong-name roll call, socks with receipt, chain-email forwarder, cooks for 14 while 'not hungry', calls first after 'call me when you get home'.")

# ------------------------------------------------------------------ 017 Egyptian
def egyptian_guys():
    K = dict(horn=person("2d2d36", "tan", "black", glasses="sun", extra="stripe"), insh=person("f2f2f2", "tan", "black"), tea=person("3a6fd8", "tan", "black"), cousin=person("c0392b", "tan", "black"), uncle=person("8a6a45", "tan", "grey", extra="vest"), mom=person("e8a0b8", "tan", "black", style="long"), kid=person("2a9d8f", "tan", "black"))
    sh = [lineup("egyptian guys", ["horn", "insh", "tea", "cousin", "uncle"], K, "street", dur=3.2)]
    sh.append(beat("THE HORN GUY", "honks to say hello. honks to say thank you.", ["hello.", "thank", "you."], "highway", [A("horn", .26, "cool", "idle", 2.0)], [P("car", .66, .74, 640, kw=dict(color="2d2d36"), anim="shake")],
                   [S("(honk)", 0, .4, 1.0), S("(honk honk)", 0, 1.5, 1.2)], cues=[(.4, "horn", .9), (1.5, "horn", .9), (1.8, "horn", .9)], shake=[(.4, 6, .2), (1.5, 8, .3)], cast=K, dur=3.4))
    sh.append(beat("THE \"INSHALLAH\" GUY", "\"see you at 7\" = \"inshallah\" = 10:40", ["\"inshallah\"", "10:40"], "cafe", [A("insh", .28, "smile", "talk", 2.1), A("kid", .74, "worried", "idle", 2.1, flip=True)], [],
                   [S("see you at 7", 1, .3, 1.3), S("inshallah", 0, 1.6, 1.2)], hud=[(0, "7:00 PM"), (2.2, "10:40 PM")], cast=K, dur=3.6))
    sh.append(beat("THE TEA GUY", "no problem can't be solved with a cup of shai", ["cup", "of", "shai"], "living", [A("tea", .3, "cool", "flex", 2.1)], [P("tea", .72, .66, 280, anim="float"), P("tea", .86, .7, 220, at=.5), P("tea", .58, .72, 220, at=.9)],
                   [S("sit. have tea", 0, .4, 1.4)], cues=[(.5, "pop", .5), (.9, "pop", .5)], cast=K, dur=3.2))
    sh.append(beat("THE \"MY COUSIN\" GUY", "his cousin knows a guy. everyone's does.", ["cousin", "knows", "a", "guy."], "street", [A("cousin", .28, "smirk", "talk", 2.1), A("kid", .74, "smile", "idle", 2.1, flip=True)], [],
                   [S("my cousin knows a guy", 0, .4, 1.6), S("is he your real cousin", 1, 2.0, 1.6, size=38), S("we're from the same street", 0, 3.7, 1.7, size=38)], cast=K, dur=5.6))
    sh.append(beat("THE ARGUING UNCLES", "two uncles deciding lunch. sounds like war.", ["lunch.", "war."], "living", [A("uncle", .28, "angry", "point", 2.0), A("cousin", .72, "angry", "point", 2.0, flip=True)], [P("dish", .5, .84, 220)],
                   [S("NO NO NO", 0, .3, 1.0, size=48), S("YOU ARE WRONG", 1, .9, 1.1, size=44), S("(they love each other)", 0, 2.3, 1.2, size=36)], shake=[(.3, 8, .3), (.9, 8, .3)], cast=K, dur=3.6))
    sh.append(beat("THE \"YOU DIDN'T EAT\" MOM", "after 3 plates. \"you didn't eat.\"", ["3", "plates."], "kitchen", [A("mom", .3, "smile", "point", 2.1), A("kid", .76, "worried", "shrug", 2.1, flip=True)], [P("dish", .5, .82, 260), P("dish", .62, .8, 260), P("dish", .74, .84, 260)],
                   [S("you didn't eat", 0, .4, 1.4), S("i had 3 plates", 1, 1.9, 1.4, size=40)], cast=K, dur=3.6))
    sh.append(beat("EVERYONE", "\"we're cousins\" (their grandmothers met once)", ["cousins\""], "wedding", [A("cousin", .3, "smile", "wave", 2.0), A("insh", .62, "smile", "wave", 2.0), A("tea", .88, "smile", "wave", 2.0)], [],
                   [S("my cousin!!", 0, .4, 1.1), S("my cousin!!", 1, .8, 1.1), S("my cousin!!", 2, 1.2, 1.1)], card=dict(title="family tree", sub="87 people", y=.42, at=1.8), cast=K, dur=3.6))
    return meta(Reel("017_egyptian_guys", sh, "funk", 17), "egyptian guys", "tea, horns, cousins and a mom who knows you didn't eat. tag your egyptian friend", "Egyptian archetypes, affectionate: the horn as a language, 'inshallah' meaning 10:40, tea for every problem, 'my cousin knows a guy', uncles debating lunch like a war, 'you didn't eat' after 3 plates.")

# ------------------------------------------------------------------ 018 Indian
def indian_families():
    K = dict(unc=person("8a6a45", "brown", "grey", extra="vest"), aunt=person("e8a0b8", "brown", "black", style="long"), dab=person("f4a300", "brown", "black", style="bun"), kid=person("2a6fdb", "brown", "black", extra="hoodie"), bro=person("3aa655", "brown", "black"), cous=person("a678de", "brown", "black", glasses="round"))
    sh = [lineup("indian families", ["unc", "aunt", "dab", "kid", "bro"], K, "living", dur=3.2)]
    sh.append(beat("THE \"WHAT ARE YOU DOING NOW\" UNCLE", "asks the same question at every wedding", ["same", "question"], "wedding", [A("unc", .28, "smile", "point", 2.1), A("kid", .76, "worried", "idle", 2.1, flip=True)], [],
                   [S("so beta, what are you doing now?", 0, .3, 1.8, size=38), S("same as last year", 1, 2.2, 1.4)], cast=K, dur=3.8))
    sh.append(beat("THE STEEL DABBA AUNTY", "\"is it rice?\" it's dal. it's always been dal.", ["dal."], "kitchen", [A("dab", .28, "smile", "flex", 2.1), A("kid", .76, "smirk", "idle", 2.1, flip=True)], [P("tupper", .5, .72, 300, text="rice", at=.2, n_=2)],
                   [S("open it", 0, .4, 1.1), S("it says rice", 1, 1.4, 1.2), S("that's dal", 0, 2.4, 1.2)], cast=K, dur=3.6))
    sh.append(beat("THE SMALL WEDDING", "\"small wedding.\" 600 guests", ["600", "guests"], "wedding", [A("aunt", .28, "smile", "cheer", 2.1)], [P("sign", .72, .45, 360, text="SMALL WEDDING", fg="e86a92")], card=dict(title="600 guests", sub="\"we kept it simple\"", y=.62, at=.8), cues=[(.8, "ding", .5)], cast=K, dur=3.4))
    sh.append(beat("THE GROUP CHAT", "140 good morning images before 7 am", ["140", "good", "morning"], "living", [A("kid", .28, "dead", "idle", 2.1)], [P("phone", .72, .52, 320, kw=dict(text="Good Morning! have a blessed day")), P("phone", .88, .6, 240, kw=dict(text="Good Morning!!"), at=.6, rot=8)],
                   card=dict(title="143 new messages", y=.38, at=1.0), cues=[(.4, "buzz", .6), (.7, "buzz", .6), (1.0, "buzz", .6)], cast=K, dur=3.4))
    sh.append(beat("THE \"CALL WHEN YOU REACH\" AUNTY", "calls to ask if you've reached. you're still in the car.", ["calls"], "highway", [A("aunt", .28, "worried", "talk", 2.1), A("kid", .74, "smirk", "idle", 2.1, flip=True)], [P("phone", .5, .5, 260, kw=dict(text="Aunty calling..."), anim="bounce")],
                   [S("did you reach", 0, .4, 1.2), S("i'm in the car", 1, 1.6, 1.2), S("call when you reach", 0, 2.8, 1.5)], cues=[(.4, "buzz", .7)], cast=K, dur=4.0))
    sh.append(beat("THE CHAI GUY", "\"just chai\" is a 3-hour commitment", ["3-hour"], "living", [A("unc", .28, "smile", "flex", 2.2)], [P("tea", .72, .66, 280)], [S("just chai", 0, .4, 1.2)], hud=[(0, "4:00 PM"), (1.8, "7:00 PM")], cast=K, dur=3.4))
    sh.append(beat("EVERY INDIAN HOUSE", "someone will say \"eat more\" (you're lying down)", ["\"eat", "more\""], "living", [A("aunt", .3, "smile", "point", 2.1), A("bro", .78, "dead", "slump", 2.1, flip=True)], [P("dish", .5, .82, 380)], [S("eat more", 0, .4, 1.1), S("i can't", 1, 1.4, 1.0), S("one more", 0, 2.3, 1.1)], cast=K, dur=3.4))
    return meta(Reel("018_indian_families", sh, "bounce", 18), "indian families", "the dabba is never what's written on it. tag the aunty who keeps feeding you", "Affectionate Indian-family archetypes: the wedding-question uncle, the steel dabba, a 'small' 600-guest wedding, 143 good-morning images, 'call when you reach', chai commitment, 'eat more'.")

# ------------------------------------------------------------------ 019 Filipino
def filipino_parties():
    K = dict(kar=person("e63946", "tan", "black"), rice=person("f2f2f2", "tan", "black", style="bun"), box=person("2a9d8f", "tan", "black", style="cap", cap="2a6fdb"), tito=person("8a6a45", "tan", "black", extra="vest"), mom=person("e8a0b8", "tan", "black", style="long"), kid=person("f4a300", "tan", "black"))
    sh = [lineup("filipino parties", ["kar", "rice", "box", "tito", "mom"], K, "living", dur=3.2)]
    sh.append(beat("THE VIDEOKE GUY", "the machine has 12,000 songs. he sings 1.", ["12,000", "1."], "living", [A("kar", .3, "cool", "flex", 2.1)], [P("mic", .62, .6, 280, anim="float"), P("speaker", .84, .76, 280)],
                   [S("one more song", 0, .4, 1.2)], hud=[(0, "7:00 PM"), (1.6, "1:30 AM")], cues=[(.4, "boom", .4)], cast=K, dur=3.4))
    sh.append(beat("THE RICE COOKER", "never off. never empty. never questioned.", ["never", "off."], "kitchen", [A("rice", .28, "smile", "flex", 2.1)], [P("pot", .72, .64, 420, kw=dict(steam=True, color="e8e8ee"))], card=dict(title="rice", sub="always", y=.42, at=1.0), cues=[(1.0, "ding", .5)], cast=K, dur=3.2))
    sh.append(beat("THE BALIKBAYAN BOX", "packs a box for 11 relatives. it's taller than him.", ["11", "relatives."], "living", [A("box", .26, "worried", "flex", 1.9)], [P("suitcase", .66, .66, 760, kw=dict(color="c9a46a"), pop=True)], [S("it's only a few things", 0, .6, 1.6, size=40)], cast=K, dur=3.4))
    sh.append(beat("THE TSINELAS MOM", "never misses. never needs to aim.", ["never", "misses."], "living", [A("mom", .72, "angry", "point", 2.1, flip=True), A("kid", .22, "scream", "run", 2.0, slide_to=.1, slide_at=.9, slide_dur=1.0)], [P("slipper", .6, .5, 200, anim="move", tx=.14, ty=.55, md=.5, at=.9, rot=15)],
                   [S("come here", 0, .3, 1.0)], cues=[(.9, "whoosh", .7), (1.4, "boing", .6)], cast=K, shake=[(1.4, 10, .3)], dur=3.2))
    sh.append(beat("THE \"EAT!\" TITO", "\"kain na!\" (you just ate)", ["\"kain", "na!\""], "living", [A("tito", .3, "smile", "point", 2.1), A("kid", .76, "worried", "idle", 2.1, flip=True)], [P("dish", .5, .82, 300)], [S("kain na!", 0, .4, 1.1), S("i just ate", 1, 1.5, 1.0), S("kain na!", 0, 2.4, 1.1)], cast=K, dur=3.4))
    sh.append(beat("THE \"TITA\" TITLE", "everyone over 30 is an auntie. even strangers.", ["auntie.", "strangers."], "street", [A("kid", .28, "smile", "wave", 2.1), A("mom", .76, "dead", "idle", 2.1, flip=True)], [], [S("hi tita!", 0, .4, 1.2), S("i'm 31", 1, 1.6, 1.0)], cast=K, dur=3.2))
    sh.append(beat("EVERY FILIPINO PARTY", "ends with 14 foil trays and \"take some home\"", ["14", "foil", "trays"], "kitchen", [A("mom", .3, "smile", "point", 2.1)], [P("tupper", .72, .66, 340, n_=4, text="take home"), P("tupper", .88, .7, 260, n_=3)], [S("take some home", 0, .4, 1.3)], cast=K, dur=3.2))
    return meta(Reel("019_filipino_parties", sh, "bounce", 19), "filipino parties", "the rice cooker is the heart of the house and the slipper is the law. tag your tita", "Affectionate Filipino party archetypes: videoke until 1:30am, the endless rice cooker, balikbayan boxes, the always-accurate slipper, 'kain na', everyone is tita, foil trays to take home.")

# ------------------------------------------------------------------ 020 Korean
def korean_moms():
    K = dict(mom=person("c0a0e0", "pale", "black", style="bob", glasses="round"), mom2=person("e8a0b8", "light", "black", style="long"), kid=person("2a6fdb", "light", "black"), dad=person("3a3f4f", "light", "black"), kid2=person("3aa655", "pale", "black", style="beanie", cap="2a9d8f"))
    sh = [lineup("korean moms", ["mom", "mom2", "kid", "dad", "kid2"], K, "kitchen", dur=3.2)]
    sh.append(beat("THE FRUIT MOM", "no meal ends without a plate of cut fruit", ["cut", "fruit"], "kitchen", [A("mom", .28, "smile", "flex", 2.1), A("kid", .76, "dead", "idle", 2.1, flip=True)], [P("dish", .5, .8, 360, food="f4a8a8", garnish="3aa655", at=.6)], [S("eat fruit", 0, .4, 1.1), S("i'm full", 1, 1.4, 1.1), S("eat fruit", 0, 2.3, 1.1)], cues=[(.6, "pop", .5)], cast=K, dur=3.4))
    sh.append(beat("THE BANCHAN MOM", "7 side dishes for 2 people. \"it's nothing.\"", ["7", "side", "dishes"], "kitchen", [A("mom", .28, "smile", "cheer", 2.1)], [P("dish", .55, .84, 200, garnish="3aa655"), P("dish", .72, .84, 200, food="e74c3c"), P("dish", .88, .84, 200, food="f2c94c"), P("dish", .6, .74, 200, food="d9d9d9"), P("dish", .8, .72, 200, food="9ac36a")],
                   [S("it's nothing", 0, .5, 1.3)], cues=[(.3, "pop", .5), (.5, "pop", .5), (.7, "pop", .5)], cast=K, dur=3.4))
    sh.append(beat("THE SOUP THAT'S FINE", "100°C. \"it's not hot.\"", ["100°C."], "kitchen", [A("mom", .28, "smile", "point", 2.1), A("kid", .76, "scream", "shock", 2.1, flip=True)], [P("pot", .5, .72, 400)], [S("just drink it", 0, .4, 1.2), S("OW", 1, 1.6, .8)], pop=dict(text="100°C", at=1.1, color=rgb("ff4d4d"), y=.42, size=130), cues=[(1.6, "boing", .6)], cast=K, shake=[(1.6, 10, .3)], dur=3.4))
    sh.append(beat("THE \"WHO PAYS\" FIGHT", "two moms fight to pay. 11 minutes. nobody wins.", ["11", "minutes."], "cafe", [A("mom", .26, "angry", "point", 2.0), A("mom2", .74, "angry", "point", 2.0, flip=True)], [P("card", .5, .7, 180, anim="shake"), P("card", .5, .62, 180, anim="shake", at=.2)],
                   [S("i'll get it", 0, .3, 1.0), S("no, i'll get it", 1, .9, 1.2)], hud=[(0, "2:00 PM"), (1.8, "2:11 PM")], shake=[(.3, 6, .4)], cast=K, dur=3.6))
    sh.append(beat("THE \"HAVE YOU EATEN?\" MOM", "she says it instead of \"i love you\"", ["instead", "of"], "kitchen", [A("mom", .3, "smile", "talk", 2.2)], [], [S("have you eaten?", 0, .4, 1.5)], card=dict(title="= i love you", y=.42, at=1.4), cues=[(1.4, "sparkle", .6)], cast=K, dur=3.2))
    sh.append(beat("THE TUPPERWARE MOM", "gives you food. you owe her the container.", ["owe", "container."], "kitchen", [A("mom", .28, "smile", "flex", 2.1), A("kid", .76, "worried", "idle", 2.1, flip=True)], [P("tupper", .5, .72, 320, n_=3, text="RETURN", at=.3)], [S("bring back the container", 0, 1.0, 1.6, size=38)], cues=[(.3, "thud", .6)], cast=K, dur=3.4))
    sh.append(beat("EVERY KOREAN MOM", "\"i'm fine\" (she carried the whole table)", ["\"i'm", "fine\""], "kitchen", [A("mom", .5, "smile", "flex", 2.3)], [P("table", .5, .82, 900, front=True, pop=False)], [S("i'm fine", 0, .5, 1.3)], cast=K, dur=3.0))
    return meta(Reel("020_korean_moms", sh, "pop", 20), "korean moms", "the fruit plate is a love language. tag the mom who made you take the container", "Affectionate Korean-mom archetypes: cut fruit after every meal, 7 banchan 'it's nothing', 100°C soup 'it's not hot', the who-pays fight, 'have you eaten', tupperware you owe her.")

REELS = dict(bmw_guys=bmw_guys, mercedes_guys=mercedes_guys, highschoolers=highschoolers, dads_hardware=dads_hardware, moms_cars=moms_cars, grandmas=grandmas,
             egyptian_guys=egyptian_guys, indian_families=indian_families, filipino_parties=filipino_parties, korean_moms=korean_moms)
