"""Batch 1."""
import sys; sys.path.insert(0, "..")
from reel import *
from phone import Messages

ME = C("6c8ebf", pants="2b3040", hair="brown", extra="hoodie")
DANI = C("f2a1b8", hair="black", style="long", skin="tan")
WAIT = C("f4f1ea", pants="1a1a1f", hair="black", skin="brown", extra="tie")
CAST = dict(me=ME, dani=DANI, waiter=WAIT)

def five_min():
    """STORY: dani said 5 min at 7:02. it's 8:14. i've eaten 3 bread baskets and befriended the waiter.
    she arrives with 'sorry just seeing this'. i side with brandon. loop: she texts 'omw 5 min' for next week."""
    s1 = PhoneShot(Messages("Dani", [
        dict(at=-1, stamp="Today 7:02 PM"), dict(at=-1, who="me", text="u close?"), dict(at=-1, who="them", text="omw!! 5 min 🫶"),
        dict(at=-1, stamp="Today 8:14 PM"), dict(at=.35, who="me", text="u close??", type_time=.5), dict(at=1.5, status="Delivered")],
        avatar_color=(238, 130, 160), clock="8:14"),
        caps=[dict(text="she said '5 min' at 7:02. it's 8:14.", style="hook", hl=["8:14."], y=300)], dur=3.0,
        zoom=[(.2, 1.2, 1.16, 540, 400)], cues=[(0, "buzz", .9)], cut="cut")
    s2 = SceneShot("cafe", 4.0, cast=CAST,
        actors=[dict(c="me", x=.30, s=2.3, y=70, pose="slump", expr="sad"), dict(c="waiter", x=.84, s=2.1, flip=True, pose="idle", expr="smile", enter="right")],
        props=[dict(n="clock", x=.84, y=.2, size=170, kw=dict(hour=8, minute=14)),
               dict(n="table", x=.42, y=.835, size=700, front=True, pop=False),
               dict(n="basket", x=.27, y=.765, size=260, kw=dict(n=1), at=0, pop=False, front=True), dict(n="basket", x=.50, y=.765, size=260, kw=dict(n=2), at=.9, front=True),
               dict(n="glass", x=.58, y=.77, size=130, pop=False)],
        lines=[dict(at=.9, who=1, text="another basket?", dur=1.5, bx=-40), dict(at=2.3, who=0, text="please.", dur=1.4)],
        caps=[dict(text="8:14. i'm on basket #3.", style="sub", y=300)],
        cues=[(.9, "thud", .6), (2.9, "thud", .6)], amb="crowd", tint=(255, 190, 120, .08))
    s3 = PhoneShot(Messages("Dani", [
        dict(at=-1, who="me", text="where are you"), dict(at=.25, who="them", text="parking!!", typing=.5),
        dict(at=1.8, who="me", text="find my says you're at your apartment", type_time=1.3),
        dict(at=5.2, who="them", text="ok i'm leaving rn", typing=2.6), dict(at=5.8, react="emph", to=2)],
        avatar_color=(238, 130, 160), clock="8:19"),
        caps=[dict(text="find my doesn't lie", style="sub", y=300)], dur=6.6,
        zoom=[(1.7, 2.6, 1.22, 640, 560), (5.1, 5.7, 1.5, 420, 880)], music_dip=(3.2, 5.2, .12), cut="cut", cues=[(5.2, "boom", .7)])
    s4 = SceneShot("cafe", 4.6, cast=CAST,
        actors=[dict(c="me", x=.2, s=2.3, y=70, pose="slump", expr="smirk"), dict(c="waiter", x=.5, s=2.1, flip=False, pose="wave", expr="smile", at=0),
                dict(c="dani", x=.84, s=2.2, flip=True, pose="wave", expr="smile", enter="right", at=.3)],
        props=[dict(n="door", x=.95, y=.55, size=620), dict(n="table", x=.22, y=.835, size=620, front=True, pop=False),
               dict(n="basket", x=.12, y=.765, size=230, kw=dict(n=3), pop=False, front=True), dict(n="basket", x=.32, y=.765, size=230, kw=dict(n=2), pop=False, front=True)],
        lines=[dict(at=1.0, who=2, text="omg sorry!! just seeing this", dur=1.7), dict(at=2.7, who=0, text="brandon was here.", dur=1.5, size=48), dict(at=3.8, who=2, text="...who's brandon", dur=1.2)],
        caps=[dict(text="8:41", style="sub", y=300)], cut="whip", amb="crowd", cues=[(.3, "doorbell", .5)], shake=[(2.7, 10, .3)])
    s5 = PhoneShot(Messages("Dani", [
        dict(at=-1, stamp="Next Saturday 7:02 PM"), dict(at=.2, who="them", text="omw!! 5 min 🫶", typing=.7)], avatar_color=(238, 130, 160), clock="7:02"),
        caps=[dict(text="same time next week", style="sub", y=300)], dur=2.6, zoom=[(1.0, 1.6, 1.3, 400, 420)], cut="cut")
    return Reel("001_five_min", [s1, s2, s3, s4, s5], style="funk", seed=7,
                title="she said 5 min at 7:02",
                caption="we've all been dani. we've all been brandon's favorite customer. send this to the friend who is 'parking'",
                story="Dani says '5 min' at 7:02. By 8:14 you're on bread basket #3 and the waiter knows you. Find My exposes her apartment. She arrives with 'sorry just seeing this'. You side with the waiter. Loop: she texts 'omw 5 min' for next week.")

REELS = dict(five_min=five_min)
