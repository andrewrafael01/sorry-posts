"""Batch 2: reels 002-010."""
from scripts.common import *
from phone import Messages, LockScreen, VoiceMemo

# ------------------------------------------------------------------ 002
def voice_memo():
    lines = [dict(at=.5, text="0:00 · [wind]"), dict(at=.75, text="0:19 · [car door]"), dict(at=1.5, text='0:41 · "ok so"'),
             dict(at=3.2, text='1:30 · "wait hold on" [orders a burrito]'), dict(at=5.0, text='2:21 · [to someone else] "no, mild"'),
             dict(at=6.3, text='2:58 · "anyway"'), dict(at=7.7, text='3:40 · "so yeah"'), dict(at=8.9, text='4:12 · "actually it\'s not that deep lol"')]
    s1 = PhoneShot(VoiceMemo(rate=28.6, lines=lines, end=9.0, clock="12:31"), dur=10.4,
                   caps=[dict(text="she sent a 4 minute voice memo. i transcribed it.", style="hook", hl=["transcribed"], y=300)],
                   bg=(52, 120, 246), music_dip=(8.7, 10.2, .1), cues=[(8.95, "crickets", .6)])
    s2 = PhoneShot(Messages("Dani", [
        dict(at=-1, stamp="Today 12:36 PM"), dict(at=-1, who="them", text="", audio="4:12"),
        dict(at=1.5, who="me", text="omg no way 😭", type_time=1.0), dict(at=2.6, who="them", text="RIGHT?? 😭", typing=.7),
        dict(at=3.5, who="them", text="did you hear the part at the end"), dict(at=5.9, who="me", text="yes!!", type_time=1.6),
        dict(at=7.2, who="them", text="so what do i do", typing=1.0)], avatar_color=PINK, clock="12:36"),
        caps=[dict(text="i listened to 14 seconds", style="sub", y=300, at=7.4)], dur=9.4, bg=(52, 120, 246), music_dip=(6.5, 7.4, .15), cues=[(7.4, "boom", .6)],
        zoom=[(6.9, 7.6, 1.3, 440, 700)])
    return Reel("002_voice_memo", [s1, s2], style="lofi", seed=4, title="4 minute voice memo, transcribed",
        caption="i have said 'omg no way' to a voice memo i did not play. i'm sorry. i'm sorry. send this to whoever sends you the long ones",
        story="She sends a 4:12 voice memo; the transcript is wind, a car door, a burrito order and 'actually it's not that deep'. You reply 'omg no way' having heard 14 seconds. She asks what she should do.")

# ------------------------------------------------------------------ 003
def group_dinner():
    G = lambda at, who, text, sender=None, **k: dict(at=at, who=who, text=text, sender=sender, **k)
    ev = [dict(at=-1, stamp="Fri 6:12 PM"), G(-1, "them", "where do we want to eat", "Jake"), G(-1, "them", "im good w whatever", "Marcus"), G(-1, "them", "same!!", "Priya"),
          G(-1, "them", "i'm easy", "Dani"), G(.5, "them", "ok so... somewhere", "Jake"), G(1.3, "me", "tacos?", type_time=.6), G(2.1, "them", "not tacos", "Marcus"),
          G(2.7, "them", "had tacos tuesday", "Priya"), G(3.3, "them", "mm not feeling it", "Dani"), G(3.9, "them", "ok so what ARE we feeling", "Jake"),
          G(4.4, "them", "idk", "Marcus"), G(4.8, "them", "idk", "Priya"), G(5.3, "them", "something light", "Dani"), G(6.0, "me", "salad??", type_time=.6),
          G(6.9, "them", "i'm not paying $19 for lettuce", "Marcus"), G(7.8, "them", "ok i'll just pick", "Jake"), dict(at=9.0, stamp="Fri 7:04 PM"),
          G(9.6, "them", "tacos", "Jake"), G(10.5, "them", "...fine", "Marcus"), G(11.2, "them", "i literally had tacos tuesday", "Priya"),
          G(12.4, "me", "i said tacos at 6:13", type_time=1.0), G(13.9, "them", "oh", "Jake")]
    s1 = PhoneShot(Messages("college bros", ev, group=True, dark=True, clock="7:04"), dur=15.8,
                   caps=[dict(text="54 minutes. nobody has said a restaurant.", style="hook", hl=["54", "minutes."], y=290, until=13.8), dict(text="6:13. tacos.", style="title", y=290, at=13.9)],
                   bg=(30, 36, 60), zoom=[(12.2, 13.0, 1.25, 600, 900)], music_dip=(11.6, 12.4, .3), cues=[(13.9, "boom", .7), (15.0, "womp", .0)])
    return Reel("003_group_dinner", [s1], style="pop", seed=11, title="54 minutes to pick dinner",
        caption="the person who suggested the place at 6:13 will never be thanked. tag the 'i'm good with whatever' friend",
        story="Four people say 'whatever' and veto tacos, then salad. After 54 minutes the host picks tacos, the first thing you suggested. Priya complains she had tacos Tuesday. You point out the 6:13 timestamp.")

# ------------------------------------------------------------------ 004
def goodbye():
    D = lambda: dict(n="door", x=.9, y=.55, size=760)
    s1 = SceneShot("room", 3.2, cast=CAST, actors=[dict(c="dani", x=.30, s=2.3, flip=False, pose="talk", expr="smile"), dict(c="me", x=.68, s=2.3, flip=True, pose="idle", expr="smile")],
        props=[D()], hud=[(0, "10:02 PM")], caps=[dict(text="it takes 59 minutes to leave dani's apartment", style="hook", hl=["59", "minutes"], y=300)],
        lines=[dict(at=.4, who=1, text="ok we should head out", dur=1.3), dict(at=1.8, who=0, text="no stay!!", dur=1.2)], tint=(255, 200, 140, .06))
    s2 = SceneShot("room", 3.2, cast=CAST, actors=[dict(c="dani", x=.30, s=2.3, pose="point", expr="smile"), dict(c="me", x=.68, s=2.3, flip=True, pose="talk", expr="smile")],
        props=[D(), dict(n="plant", x=.30, y=.58, size=360, at=1.9, front=False)], hud=[(0, "10:19 PM")],
        lines=[dict(at=.3, who=1, text="this was so fun", dur=1.2), dict(at=1.5, who=0, text="oh wait, you have to see my plant", dur=1.7)], cues=[(1.9, "sparkle", .5)], tint=(255, 200, 140, .06))
    s3 = SceneShot("room", 3.6, cast=CAST, actors=[dict(c="dani", x=.28, s=2.3, pose="talk", expr="smile"), dict(c="me", x=.7, s=2.3, flip=True, pose="idle", expr="worried")],
        props=[D(), dict(n="plant", x=.5, y=.7, size=520, front=True, pop=False)], hud=[(0, "10:33 PM")],
        lines=[dict(at=.3, who=1, text="wow. so green", dur=1.1), dict(at=1.5, who=0, text="she's a monstera. i named her", dur=1.7), dict(at=3.0, who=1, text="...what's her name", dur=1.0)],
        pops=[dict(text="Brenda.", at=3.1, x=.5, y=.38, size=150, rot=-5)], tint=(255, 200, 140, .06))
    s4 = SceneShot("street", 3.6, cast=CAST, actors=[dict(c="dani", x=.3, s=2.1, pose="wave", expr="smile", flip=False), dict(c="me", x=.68, s=2.1, flip=True, pose="idle", expr="smile")],
        props=[dict(n="car", x=.84, y=.74, size=480, flip=True, pop=False)], hud=[(0, "10:41 PM")], cut="whip", tint=(20, 30, 90, .30), amb="night",
        lines=[dict(at=.5, who=0, text="ok text me when you're home!!", dur=1.6), dict(at=2.2, who=1, text="i'm 5 minutes away", dur=1.2), dict(at=3.0, who=0, text="text me.", dur=.6)])
    s5 = SceneShot("street", 4.0, cast=CAST, actors=[dict(c="dani", x=.3, s=2.1, pose="talk", expr="smile", expr_at=[(2.0, "shock")], look=0), dict(c="me", x=.68, s=2.1, flip=True, pose="idle", expr="smirk")],
        props=[dict(n="car", x=.84, y=.74, size=480, flip=True, pop=False)], hud=[(0, "11:07 PM")], tint=(20, 30, 90, .30), amb="night",
        lines=[dict(at=.4, who=0, text="ok i should get going", dur=1.4), dict(at=1.9, who=1, text="...you live here", dur=1.3), dict(at=3.3, who=0, text="...right.", dur=.7)],
        cues=[(2.0, "crickets", .5)], music_dip=(1.7, 3.6, .15), shake=[(3.3, 6, .2)])
    s6 = PhoneShot(Messages("Dani", [dict(at=-1, stamp="Today 11:12 PM"), dict(at=-1, who="them", text="did you get home??"),
        dict(at=.5, who="me", text="i'm still outside your building", type_time=1.4), dict(at=2.8, who="them", text="come back up", typing=.9), dict(at=3.6, react="ha", to=2)],
        avatar_color=PINK, clock="11:12"), dur=5.0, caps=[dict(text="she's still waiting for the 'home' text", style="sub", y=300)], bg=(34, 40, 78), zoom=[(3.0, 3.8, 1.2, 540, 600)])
    return Reel("004_goodbye", [s1, s2, s3, s4, s5, s6], style="funk", seed=5, title="59 minutes to leave dani's apartment",
        caption="it is a law that leaving takes longer than the party. send to the friend who says 'ok we should go' and then starts a new topic",
        story="The goodbye at the door takes 59 minutes (a monstera named Brenda). At the car Dani says 'ok i should get going'. It's her building. She asks for the 'home' text; you're still outside.")

# ------------------------------------------------------------------ 005
def roommate_notes():
    Y, P = "ffe66d", "ffb3c7"
    fr = dict(n="fridge", x=.5, y=.5, size=1280, pop=False)
    n = lambda text, x, y, at, col=Y, rot=0, size=380: dict(n="note", x=x, y=y, size=size, kw=dict(text=text, color=col, rot=rot), at=at)
    s1 = SceneShot("kitchen", 6.0, cast=CAST, props=[fr, n("hey! could you do your dishes? :)", .5, .36, .3, rot=-2), n("hi again!! dishes :)", .5, .52, 2.1, rot=3), n("DISHES.", .52, .68, 3.9, rot=-4, size=330)],
        hud=[(0, "day 1"), (1.9, "day 3"), (3.7, "day 5")], caps=[dict(text="my roommate and i only communicate through sticky notes", style="hook", hl=["sticky", "notes"], y=300)],
        cues=[(.3, "thud", .5), (2.1, "thud", .6), (3.9, "thud", .9)], shake=[(3.9, 12, .3)])
    s2 = SceneShot("kitchen", 3.2, cast=CAST, props=[fr, n(".", .5, .46, .5, size=420)], hud=[(0, "day 6")], caps=[],
        cues=[(.5, "thud", 1.0), (.9, "crickets", .5)], music_dip=(0, 3.0, .12), shake=[(.5, 14, .35)])
    s3 = SceneShot("kitchen", 4.4, cast=CAST, props=[fr, n("i did them. all of them. you're welcome.", .5, .44, .4, col=P, rot=2, size=400)], hud=[(0, "day 7")],
        actors=[dict(c="me", x=.15, s=1.5, pose="cheer", expr="smile"), dict(c="roomie", x=.86, s=1.5, flip=True, pose="flex", expr="smirk")],
        caps=[dict(text="he actually did them", style="sub", y=300)], cues=[(.4, "sparkle", .6)])
    s4 = SceneShot("kitchen", 7.2, cast=CAST, props=[dict(n="table", x=.5, y=.84, size=900, front=True, pop=False), dict(n="bowl", x=.5, y=.765, size=240, pop=False),
            n("whose is the blue bowl", .22, .4, .4, size=300, rot=-3), n("not mine", .78, .4, 2.0, col=P, size=240, rot=3), n("not mine either", .5, .27, 3.4, size=250, rot=-2)],
        actors=[dict(c="me", x=.18, s=2.0, y=60, pose="idle", expr="worried", look=1), dict(c="roomie", x=.82, s=2.0, y=60, flip=True, pose="idle", expr="worried", look=-1)],
        hud=[(0, "day 8"), (4.2, "since august")], lines=[dict(at=4.8, who=1, text="have you tried washing it", dur=1.5, size=40), dict(at=6.2, who=0, text="no. it's not mine.", dur=1.0)],
        pops=[dict(text="the blue bowl", at=4.3, x=.5, y=.56, size=120, color=rgb("6fb1ff"), rot=-3)], cues=[(.4, "thud", .5), (2.0, "thud", .5), (3.4, "thud", .5)], push=.06)
    return Reel("005_roommate_notes", [s1, s2, s3, s4], style="bounce", seed=9, title="sticky note war ends with a haunted bowl",
        caption="every apartment has one dish that belongs to nobody and cannot be thrown away. who's yours",
        story="A passive-aggressive sticky note escalation over dishes (day 1 smiley, day 6 a single period) ends in a truce. Then both roommates discover a blue bowl neither owns, there since August.")

# ------------------------------------------------------------------ 006
def haha_ranked():
    def it(label, defn, col, bg, bg2, anim, dur, sfx_name, fx=("rays",), cnt=None):
        return KineticShot([dict(text=label, at=0, size=190 if len(label) < 8 else 140, color=col, anim=anim, y=.42, sfx=sfx_name),
                            dict(text=defn, at=.55, size=84, weight="xbold", color=WHITE, anim="rise", y=.62, maxw=900)], dur=dur, bg=bg, bg2=bg2, fx=fx, fx_y=.42, counter=cnt)
    shots = [KineticShot([dict(text="ranking every way to type \"haha\" by how much it means you hate me", at=0, size=88, weight="black", anim="pop", y=.4, hl=["hate", "me"], maxw=940)], dur=2.8, bg=(16, 16, 20), bg2=(40, 40, 52)),
             it("haha", "i am a customer service representative", YELLOW, (46, 52, 96), (24, 28, 60), "slam", 2.6, "hit", cnt="1 / 8"),
             it("hahaha", "ok that one actually got me", rgb("7dff9a"), (24, 90, 70), (10, 50, 40), "slam", 2.4, "hit", cnt="2 / 8"),
             it("HAHA", "i will be thinking about this tonight", rgb("ff8f5c"), (110, 40, 28), (60, 20, 16), "shake", 2.6, "hit", cnt="3 / 8"),
             it("ha.", "we are no longer friends", WHITE, (10, 10, 12), (30, 30, 36), "pop", 2.8, "scratch", fx=None, cnt="4 / 8"),
             it("lol", "my face did nothing", rgb("9ad0ff"), (30, 70, 120), (14, 40, 80), "slide", 2.2, "swipe", fx=("dots",), cnt="5 / 8"),
             it("LMAOOOO", "i dropped my phone on my face", rgb("ffd23f"), (120, 60, 160), (70, 30, 110), "shake", 2.6, "boing", fx=("rays", "confetti"), cnt="6 / 8"),
             it("😭😭😭", "stop it i'm in a meeting", WHITE, (150, 60, 100), (90, 30, 70), "wobble", 2.4, "pop", fx=("dots",), cnt="7 / 8"),
             it("haha yeah", "i didn't read it", rgb("c9c9d6"), (14, 14, 18), (14, 14, 18), "pop", 3.2, "fail", fx=None, cnt="8 / 8")]
    shots[-1].music_dip = (.2, 3.0, .15)
    return Reel("006_haha_ranked", shots, style="bounce", seed=21, title="every way to type haha, ranked",
        caption="'haha yeah' is a hostage note. which one do you send",
        story="Eight ways to type 'haha' with what they actually mean ('haha' = customer service rep, 'ha.' = we are no longer friends), ending on the saddest one: 'haha yeah' = i didn't read it.")

# ------------------------------------------------------------------ 007
def just_seeing_this():
    bed = lambda: [dict(n="bed", x=.5, y=.87, size=1100, front=True, pop=False), dict(n="phone", x=.5, y=.815, size=250, kw=dict(text="lunch thursday??"), front=True, pop=False)]
    s1 = SceneShot("bedroom", 4.0, cast=CAST, actors=[dict(c="me", x=.5, s=2.2, y=110, pose="idle", expr="worried")], props=bed(), hud=[(0, "Fri 2:47 AM")],
        caps=[dict(text="replying to a text from tuesday. it's friday. 2:47am", style="hook", hl=["tuesday.", "2:47am"], y=300)], tint=(10, 20, 70, .38),
        lines=[dict(at=.6, who=0, text="oh no", dur=1.0), dict(at=2.0, who=0, text="she asked about THURSDAY", dur=1.8, size=42)], amb="night", cues=[(.2, "gasp", .6)])
    s2 = PhoneShot(Messages("Dani", [dict(at=-1, stamp="Tue 1:12 PM"), dict(at=-1, who="them", text="wanna get lunch thursday?"), dict(at=-1, stamp="Fri 2:47 AM"),
        dict(at=3.2, who="me", text="omg sorry just seeing this!! yes let's do thursday", type_time=2.6), dict(at=4.8, who="them", text="thursday was yesterday", typing=1.0),
        dict(at=7.0, who="me", text="lunch next thursday??", type_time=1.4), dict(at=8.6, who="them", text="ok. i'll text you wednesday", typing=1.0)], avatar_color=PINK, clock="2:47"),
        caps=[dict(text="sorry just seeing this", style="sub", y=300, at=3.2)], dur=10.6, bg=(24, 30, 70), zoom=[(2.6, 3.3, 1.14, 590, 560), (4.6, 5.2, 1.18, 470, 760), (6.2, 6.8, 1.0, 540, 750)],
        music_dip=(4.4, 4.9, .15), cues=[(4.8, "boom", .5)])
    s3 = SceneShot("bedroom", 3.2, cast=CAST, actors=[dict(c="me", x=.5, s=2.2, y=110, pose="idle", expr="worried")], props=bed(), hud=[(0, "next Fri 2:47 AM")],
        caps=[dict(text="next week", style="sub", y=300)], tint=(10, 20, 70, .38), lines=[dict(at=.8, who=0, text="oh no", dur=1.2)], amb="night", cut="dip")
    return Reel("007_just_seeing_this", [s1, s2, s3], style="lofi", seed=13, title="replying to tuesday's text on friday at 2:47am",
        caption="the account is named after this exact feeling. who did you leave on read this week",
        story="2:47 AM: you finally answer Tuesday's 'lunch thursday?' with a cheerful yes to a Thursday that already happened. She says she'll text Wednesday. Loop: next Friday, same bed, same 'oh no'.")

# ------------------------------------------------------------------ 008
def mom_call():
    mom = lambda body, at, **k: dict(at=at, app="Messages", title="Mom", body=body, color=(52, 199, 89), icon="M", **k)
    s1 = PhoneShot(LockScreen("11:14", "Sunday, October 12", [mom("call me", -1), mom("when you can", .9), mom("no rush", 1.8), mom("(not an emergency)", 2.7), mom("(but call)", 3.7)], max_cards=4),
        dur=5.2, caps=[dict(text="mom: \"call me\". no other information.", style="hook", hl=["no", "other", "information."], y=300)], bg=(52, 56, 120), zoom=[(3.5, 4.2, 1.15, 540, 600)])
    s2 = SceneShot("room", 4.0, cast=CAST, actors=[dict(c="me", x=.5, s=2.2, pose="run", expr="scream", slide_to=.5, hop=[2.2])],
        props=[], lines=[dict(at=.3, who=0, text="someone died", dur=1.1), dict(at=1.4, who=0, text="it's grandma", dur=1.1), dict(at=2.5, who=0, text="it's the dog. we don't have a dog", dur=1.5, size=40)],
        caps=[dict(text="me, calling back", style="sub", y=300)], cues=[(0, "riser", .6)], shake=[(2.5, 8, .3)], push=.07)
    s3 = SceneShot("kitchen", 8.0, cast=CAST, actors=[dict(c="me", x=.22, s=2.0, pose="talk", expr="worried"), dict(c="mom", x=.78, s=2.0, flip=True, pose="talk", expr="smile")],
        props=[dict(n="fridge", x=.12, y=.46, size=1000, pop=False), dict(n="phone", x=.62, y=.52, size=210, kw=dict(text="", color="2b2f3a"), front=True, anim="float", pop=False), dict(n="plant", x=.93, y=.64, size=380, pop=False)],
        lines=[dict(at=.3, who=0, text="MOM. WHAT HAPPENED", dur=1.4, size=46), dict(at=1.8, who=1, text="so my phone is on and i can't turn it off", dur=2.4, size=40),
               dict(at=4.4, who=0, text="...on?", dur=.9), dict(at=5.4, who=1, text="it's making a light", dur=1.4), dict(at=6.9, who=0, text="the flashlight??", dur=1.0)],
        pops=[dict(text="SINCE SUNDAY", at=7.2, x=.5, y=.34, size=120, rot=-4)], music_dip=(5.3, 7.6, .2), cues=[(7.2, "boom", .8)], cut="cut")
    s4 = PhoneShot(LockScreen("11:31", "Sunday, October 12", [mom("thank you hon!! love you", -1), mom("(that was an emergency)", 1.1)], max_cards=5),
        dur=3.2, caps=[dict(text="love you mom", style="sub", y=300)], bg=(52, 56, 120))
    return Reel("008_mom_call", [s1, s2, s3, s4], style="synth", seed=3, title="mom: call me",
        caption="the 'not an emergency (but call)' text has aged me. tag your mom's worst-timed text",
        story="Mom texts 'call me', 'no rush', '(not an emergency)', '(but call)'. You spiral through dead grandma and a dog you don't own. The emergency is a flashlight that's been on since Sunday. She follows up with '(that was an emergency)'.")

# ------------------------------------------------------------------ 009
def venmo():
    V = lambda title, body, at, col=(61, 149, 206): dict(at=at, app="Venmo", title=title, body=body, color=col, icon="V")
    dates = [(0, "Saturday, March 1"), (2.2, "Tuesday, March 4"), (4.2, "Sunday, March 9"), (6.2, "Monday, March 17"), (8.2, "Wednesday, April 2")]
    s1 = PhoneShot(LockScreen("9:41", "Saturday, March 1", [V("Chris requested $4.37", "🍕 pizza", -1), V("Chris sent a reminder", "🍕 pizza", 2.2), V("Chris requested $4.37", "pizza?? 🍕", 4.2),
                   V("Chris", "just a little reminder 😊", 6.2), V("Chris requested $4.37", "no worries if not!!", 8.2)], wall=((20, 70, 140), (8, 28, 70)), dates=dates, max_cards=4),
        dur=10.4, caps=[dict(text="chris has been requesting $4.37 for five weeks", style="hook", hl=["$4.37", "five", "weeks"], y=300)], bg=(30, 90, 170), cues=[(8.2, "womp", .0)],
        zoom=[(8.0, 8.8, 1.18, 540, 800)])
    s2 = SceneShot("room", 3.4, cast=CAST, actors=[dict(c="me", x=.5, s=2.2, pose="shrug", expr="smirk", pose_at=[(1.4, "cheer")])],
        props=[dict(n="pizza_box", x=.2, y=.72, size=300, kw=dict(open_=False), pop=False)], lines=[dict(at=.3, who=0, text="fine.", dur=.8), dict(at=1.2, who=0, text="FINE.", dur=1.0)],
        pops=[dict(text="$4.37 sent", at=1.9, x=.5, y=.36, size=130, color=rgb("7dff9a"), rot=-3, sg=.0)], cues=[(1.9, "cash", .9)], caps=[dict(text="march 29", style="sub", y=300)])
    s3 = PhoneShot(LockScreen("9:42", "Thursday, April 3", [V("You paid Chris $4.37", "🍕 pizza", -1, (52, 199, 89)), V("Chris requested $0.63", "tax", 1.3)], wall=((20, 70, 140), (8, 28, 70)), max_cards=4),
        dur=4.0, bg=(30, 90, 170), caps=[dict(text="four seconds later", style="sub", y=300)], music_dip=(.9, 3.6, .15), cues=[(1.3, "boom", .7)], zoom=[(1.2, 1.9, 1.2, 540, 700)])
    return Reel("009_venmo", [s1, s2, s3], style="pop", seed=17, title="chris wants $4.37",
        caption="there is always a friend who will request the tax separately. we respect it and we fear it",
        story="Chris requests $4.37 for pizza at escalating politeness until 'no worries if not!!'. You pay. Four seconds later he requests $0.63 for 'tax'.")

# ------------------------------------------------------------------ 010
def grocery_avoid():
    sign = lambda t, at=0: dict(n="sign", x=.5, y=.29, size=360, kw=dict(text=t, color="ffffff", fg="d62828"), at=at)
    s1 = SceneShot("store", 3.4, cast=CAST, actors=[dict(c="me", x=.3, s=2.1, pose="walk", expr="smile", slide_to=.36, slide_at=0, slide_dur=1.2), dict(c="kyle", x=.82, s=2.1, flip=True, pose="idle", expr="smile")],
        props=[sign("AISLE 5"), dict(n="cart", x=.46, y=.84, size=360, front=True, pop=False)], caps=[dict(text="i have been in this store for 52 minutes", style="hook", hl=["52", "minutes"], y=300)],
        lines=[dict(at=1.4, who=0, text="...is that kyle", dur=1.4)], expr=None) if False else None
    s1 = SceneShot("store", 3.4, cast=CAST, actors=[dict(c="me", x=.30, s=2.1, pose="idle", expr="smile", expr_at=[(1.3, "shock")]), dict(c="kyle", x=.84, s=2.1, flip=True, pose="idle", expr="smile")],
        props=[sign("AISLE 5"), dict(n="cart", x=.46, y=.84, size=360, front=True, pop=False)], caps=[dict(text="i have been in this store for 52 minutes", style="hook", hl=["52", "minutes"], y=300)],
        lines=[dict(at=1.4, who=0, text="...is that kyle", dur=1.4)], cues=[(1.4, "gasp", .5)], amb="crowd")
    s2 = SceneShot("store", 3.0, cast=CAST, actors=[dict(c="me", x=.5, s=2.1, y=0, pose="idle", expr="worried", look=1), dict(c="kyle", x=.12, s=1.6, pose="walk", expr="smile", slide_to=.95, slide_at=0, slide_dur=2.8)],
        props=[dict(n="shelf", x=.5, y=.66, size=700, front=True, pop=False), sign("AISLE 9")], lines=[dict(at=.4, who=0, text="act normal", dur=1.4, by=70)], cut="whip", amb="crowd")
    s3 = SceneShot("store", 3.4, cast=CAST, actors=[dict(c="me", x=.5, s=2.1, pose="idle", expr="smirk")],
        props=[sign("AISLE 12"), dict(n="sign", x=.5, y=.56, size=300, kw=dict(text="CHEERIOS", color="f4c20d", fg="1a1a1a"), rot=180, front=True, anim="float", pop=True, at=.2)],
        lines=[dict(at=.8, who=0, text="i love reading the back of a box about cereal i hate", dur=2.4, size=40)], amb="crowd", cut="whip")
    s4 = SceneShot("store", 4.4, cast=CAST, actors=[dict(c="me", x=.26, s=2.1, pose="idle", expr="smile"), dict(c="kyle", x=.74, s=2.1, flip=True, pose="wave", expr="shock", expr_at=[(1.0, "smile")])],
        props=[sign("CHECKOUT 4"), dict(n="cart", x=.42, y=.84, size=340, front=True, pop=False)],
        lines=[dict(at=.3, who=1, text="kyle: hey!!", dur=1.1), dict(at=1.5, who=0, text="oh hey kyle", dur=1.2), dict(at=2.8, who=1, text="i was hiding from you in aisle 9", dur=1.6, size=40)], cut="whip", amb="crowd", cues=[(.3, "ding", .4)])
    s5 = SceneShot("store", 3.4, cast=CAST, actors=[dict(c="me", x=.26, s=2.1, pose="shrug", expr="shock"), dict(c="kyle", x=.74, s=2.1, flip=True, pose="shrug", expr="shock")],
        props=[dict(n="receipt", x=.5, y=.5, size=420, kw=dict(lines=[("gum", "$2.49"), ("TIME IN STORE", "52 min")], total="$2.49"), at=1.2, rot=-3)],
        lines=[dict(at=.2, who=0, text="i was in aisle 9", dur=1.1), dict(at=.4, who=1, text="wait what", dur=.8, bx=60)], cues=[(1.2, "tick", .8)], amb="crowd", caps=[dict(text="52 minutes. one pack of gum.", style="sub", y=300, at=1.2)])
    return Reel("010_grocery_avoid", [s1, s2, s3, s4, s5], style="jazz", seed=2, title="hiding from kyle in aisle 9",
        caption="i have rerouted an entire grocery trip to avoid a hello. send this to the person you avoided at the store",
        story="You spot Kyle in aisle 5 and spend 52 minutes dodging him (hiding behind shelves, reading cereal boxes). At checkout he reveals he was hiding from you in aisle 9 too.")

REELS = dict(voice_memo=voice_memo, group_dinner=group_dinner, goodbye=goodbye, roommate_notes=roommate_notes, haha_ranked=haha_ranked,
             just_seeing_this=just_seeing_this, mom_call=mom_call, venmo=venmo, grocery_avoid=grocery_avoid)
