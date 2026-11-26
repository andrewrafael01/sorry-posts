# v5 (Nov 22): research-driven formats.
# 1) EPISODES: a numbered daily series with a running arc and a heart meter, so viewers have a reason to follow.
#    Day 1 posts Nov 24, day 31 (100%) posts Dec 24.
# 2) SKITS: single-situation couple loops ("him when i'm hungry"), POV caption visible from frame 0,
#    motion in the first 0.3 s, 5-7 s so rewatches push average watch time past 100%.
# Actor specs: SPEC@X~MOTION (see mskit.py). Mochi sits left (~300), Toast right (~780).
H = "toast is trying to win mochi's heart"
def F(n): return f"day {n+1} tomorrow · follow so you don't miss it"
# v6 (Nov 25): day 1 reached 483 and day 2 629 with 0 and 3 sends; every other reel floors at ~1,000.
# Frame 0 said "day 1" in big type, which means nothing to a stranger, and nothing asked to be sent.
# Now: the premise is the big header, "day N of 31" is the small line, and each episode ends on a send line
# naming a person in the viewer's life (sends correlate 0.91 with reach across 15 reels).
SEND = {1: "send this to your toast", 2: "send this to who eats your snacks", 3: "send this to someone who'd draw themselves",
 4: "send this to the loudest person you love", 5: "send this to who steals your warm spot", 6: "send this to someone who tries too hard",
 7: "send this to your blanket thief", 8: "send this to someone who just gets you", 9: "send this to someone whose gifts look like this",
 10: "send this to who waits for you to get home", 11: "send this to someone who'd make you warm milk", 12: "send this to someone who can't play it cool",
 13: "send this to who texts you 40 times", 14: "send this to whoever kills the bugs", 15: "send this to your first-snow person",
 16: "send this to who gives you the last bite", 17: "send this to someone who falls asleep waiting up", 18: "send this to someone who just stays",
 19: "send this to the jealous one", 20: "send this to someone who panics around you", 21: "send this to someone studying right now",
 22: "send this to someone who deserves a gift back", 23: "send this to who you'd match with", 24: "send this to your nap person",
 25: "send this to someone who took care of you", 26: "send this to someone you'd keep", 27: "send this to someone you almost told",
 28: "send this to someone who'd run away too", 29: "send this to someone you're waiting on", 30: "send this to someone who said it back",
 31: "send this to your person"}
def ep(n, slug, meter, steps, **kw):
    d = dict(slug=f"s{n:02d}_{slug}", header=(f"day {n} of 31", "toast is trying to\nwin *mochi's* heart"), meter=meter,
             foot=kw.pop("foot", F(n)), send=SEND[n], seed=100+n, steps=steps)
    steps[-1]["d"] = steps[-1]["d"]+0.6  # time to read the send line
    d.update(kw); return d

EPISODES = [
 ep(1, "flower", (0, 2), [
  dict(d=1.6, cap="he picked her a *flower*", m="m:dot@300", t="th:flower:happy@780"),
  dict(d=1.4, cap="she *sniffed* it", m="m:squint@310", t="th:flower:sparkle@600~hop"),
  dict(d=1.3, cap="*ACHOO*", m="m:shock@300~shake", t="t:shock@700~jump", fx=["bang@m"]),
  dict(d=2.9, m="m:pout@300", t="t:cry@780~tremble")]),
 ep(2, "cookie", (2, 1), [
  dict(d=1.6, cap="he brought her a *cookie*", m="m:dot@300", t="th:cookie:happy@780"),
  dict(d=1.4, cap="it smelled *so* good", m="m:dot@300", t="th:cookie:squint@700~tremble", fx=["sweat@t"]),
  dict(d=1.4, cap="he ate it", m="m:shock@300~shake", t="t:blep@700~hop", fx=["bang@m"]),
  dict(d=2.9, m="m:pout@300", t="t:smug@720~tremble", fx=["sweat@t"])]),
 ep(3, "letter", (1, 4), [
  dict(d=1.6, cap="he wrote her a *love letter*", m="m:dot@300", t="th:letter:happy@780"),
  dict(d=1.4, cap="she opened it", m="mh:letter:sparkle@300~hop", t="t:happy@760", fx=["sparkles@m"]),
  dict(d=1.5, cap="it was a drawing of *himself*", m="mh:letter:squint@300", t="t:smug@700"),
  dict(d=2.9, m="m:happy@300", t="t:smug:stand@720~hop", fx=["sparkles@t"])]),
 ep(4, "song", (4, 3), [
  dict(d=1.5, cap="he wrote her a *song*", m="m:dot@300", t="t:happy@760"),
  dict(d=1.5, cap="he sang it", m="m:dot@300", t="t:sparkle:stand@760~sway", fx=["notes@t"]),
  dict(d=1.4, cap="it was *very* loud", m="m:shock@300~tremble", t="t:sparkle:stand@760~sway", fx=["bang@m", "notes@t"]),
  dict(d=2.9, m="m:pout@300", t="t:happy@760~sway", fx=["notes@t"])]),
 ep(5, "seat", (3, 5), [
  dict(d=1.6, cap="he saved her the *warm* spot", m="m:dot@300", t="t:happy@780"),
  dict(d=1.5, cap="then he got *comfy*", m="m:dot@300", t="ts@770", fx=["zzz@t"]),
  dict(d=1.4, cap="*very* comfy", m="m:squint@300", t="ts@770", fx=["zzz@t"]),
  dict(d=2.9, m="m:happy@300", t="ts@770", fx=["zzz@t", "hearts@m"])]),
 ep(6, "cool", (5, 9), [
  dict(d=1.6, cap="he tried to look *cool*", m="m:dot@300", t="t:smug:stand@760", fx=["sparkles@t"]),
  dict(d=1.1, cap="*very* cool", m="m:dot@300", t="t:sparkle:stand@760~jump", fx=["sparkles@t"]),
  dict(d=1.4, cap="he fell over", m="m:shock@300~shake", t="t:shock@760~faint", fx=["bang@m"]),
  dict(d=2.9, m="m:happy@300~hop", t="t:pout@760~faint", fx=["hearts@m"], cap="she giggled")]),
 ep(7, "blanket", (9, 8), [
  dict(d=1.6, cap="she looked *cold*", m="m:cry@300~tremble", t="t:stare@780", fx=["snow"]),
  dict(d=1.6, cap="so he shared his *blanket*", m="ss@540", t="-", fx=["snow", "hearts@m"]),
  dict(d=1.4, cap="then he fell asleep", m="ss@540", t="-", fx=["snow", "zzz@m"]),
  dict(d=2.9, m="m:pout@300~tremble", t="ts@770", fx=["snow", "zzz@t"])]),
 ep(8, "box", (8, 15), [
  dict(d=1.6, cap="he found her a *box*", m="m:dot@300", t="t:sparkle@780~hop"),
  dict(d=1.4, cap="she got in", m="mbox:shock@300", t="t:stare@760"),
  dict(d=1.4, cap="she *loved* it", m="mbox:love@300~hop", t="t:happy@760", fx=["hearts@m"]),
  dict(d=2.9, m="mbox:love@300", t="t:sparkle@760~hop", fx=["sparkles@t"])]),
 ep(9, "paw_heart", (15, 16), [
  dict(d=1.6, cap="he made her a *heart*", m="m:dot@300", t="th:heart:happy@780"),
  dict(d=1.5, cap="by hand", m="m:squint@300", t="th:heart:sparkle@760~hop"),
  dict(d=1.5, cap="she said it looked like a *potato*", m="m:smug@300", t="th:heart:pout@760~tremble"),
  dict(d=2.9, m="m:happy@300", t="t:pout@760", cap="(it did)")]),
 ep(10, "waited", (16, 22), [
  dict(d=1.6, cap="he waited for her *all day*", m="-", t="t:stare@760"),
  dict(d=1.4, cap="*all* day", m="-", t="t:sleep:loaf@760", fx=["zzz@t"]),
  dict(d=1.5, cap="then she came home", m="m:happy@300", t="t:shock@760~jump", fx=["bang@t"]),
  dict(d=2.9, m="m:love@420~lean", t="t:sparkle@700~hop", fx=["hearts@t"])], mx0=-260),
 ep(11, "milk", (22, 26), [
  dict(d=1.6, cap="he made her *warm milk*", m="m:dot@300", t="th:mug:happy@780"),
  dict(d=1.5, cap="she drank *all* of it", m="mh:mug:happy@300", t="t:stare@760"),
  dict(d=1.4, cap="every drop", m="mh:mug:love@300~hop", t="t:happy@760", fx=["hearts@m"]),
  dict(d=2.9, m="m:love@300", t="t:sparkle@760~hop", fx=["sparkles@t"])]),
 ep(12, "mysterious", (26, 25), [
  dict(d=1.6, cap="he tried to be *mysterious*", m="m:dot@300", t="t:smug@760"),
  dict(d=1.4, cap="...", m="m:dot@300", t="t:stare@760"),
  dict(d=1.4, cap="he couldn't stop *smiling*", m="m:squint@300", t="t:happy@760~shake"),
  dict(d=2.9, m="m:squint@300", t="t:happy@760~hop", fx=["hearts@t"])]),
 ep(13, "texts", (25, 31), [
  dict(d=1.6, cap="he texted her \"hi\"", m="m:dot@300", t="tp:happy@820"),
  dict(d=1.4, cap="*40* times", m="m:dot@300", t="tp:stare@820~tremble", fx=["sweat@t"]),
  dict(d=1.5, cap="she replied \"hi\"", m="mp:happy@340", t="tp:shock@820~jump", fx=["bang@t"]),
  dict(d=2.9, m="mp:happy@340", t="t:love@760~faint", fx=["hearts@t"])]),
 ep(14, "bug", (31, 33), [
  dict(d=1.6, cap="he promised to *protect* her", m="m:dot@300", t="t:smug:stand@760", fx=["sparkles@t"]),
  dict(d=1.3, cap="then he saw a *bug*", m="m:dot@300", t="t:shock@760~jump", fx=["bang@t"]),
  dict(d=1.5, cap="she protected *him*", m="m:stare:stand@500", t="t:cry@820~tremble"),
  dict(d=2.9, m="m:smug@430", t="t:cry@800~tremble")]),
 ep(15, "snowflake", (33, 38), [
  dict(d=1.6, cap="the first *snow*", m="m:sparkle@300~hop", t="t:sparkle@780~hop", fx=["snow"]),
  dict(d=1.5, cap="he caught her a *snowflake*", m="m:dot@300", t="th:snow:happy@700", fx=["snow"]),
  dict(d=1.5, cap="she kept it", m="mh:snow:love@300", t="t:happy@760", fx=["snow", "hearts@m"]),
  dict(d=2.9, m="mh:snow:love@300", t="t:sparkle@760~hop", fx=["snow"])]),
 ep(16, "last_cookie", (38, 45), [
  dict(d=1.6, cap="the *last* cookie", m="m:dot@300", t="th:cookie:squint@780~tremble"),
  dict(d=1.4, cap="he *really* wanted it", m="m:dot@300", t="th:cookie:pout@760~tremble", fx=["sweat@t"]),
  dict(d=1.5, cap="he gave it to *her*", m="m:shock@300", t="th:cookie:happy@580"),
  dict(d=2.9, m="mh:cookie:love@300~hop", t="t:cry@760~tremble", fx=["hearts@m"])]),
 ep(17, "fell_asleep", (45, 52), [
  dict(d=1.6, cap="he waited up with a *gift*", m="-", t="th:gift:happy@760"),
  dict(d=1.5, cap="he fell asleep", m="-", t="ts@760", fx=["zzz@t"]),
  dict(d=1.5, cap="she found him like *this*", m="m:shock@300", t="ts@760", fx=["zzz@t"]),
  dict(d=2.9, m="m:love@430~lean", t="ts@760", fx=["hearts@m", "zzz@t"])], mx0=-260),
 ep(18, "bad_day", (52, 60), [
  dict(d=1.6, cap="mochi had a *bad day*", m="m:cry@300~tremble", t="t:shock@780"),
  dict(d=1.5, cap="he didn't say anything", m="m:cry@300~tremble", t="t:pout@600"),
  dict(d=1.5, cap="he just *stayed*", m="hug:cry,love@540", t="-"),
  dict(d=2.9, m="hug:love,love@540", t="-", fx=["hearts@m"])]),
 ep(19, "jealous", (60, 58), [
  dict(d=1.6, cap="mochi has a new favorite *box*", m="mbox:love@300", t="t:dot@780"),
  dict(d=1.4, cap="toast is *jealous*", m="mbox:love@300", t="t:pout@780~shake", fx=["bang@t"]),
  dict(d=1.5, cap="so he found a *bigger* box", m="mbox:squint@300", t="tbox:smug@780~hop"),
  dict(d=2.9, m="mbox:pout@300", t="tbox:sparkle@780", fx=["sparkles@t"])]),
 ep(20, "practice", (58, 61), [
  dict(d=1.6, cap="he practiced saying it", m="-", t="t:stare@760", fx=["say@t:i l-like..."]),
  dict(d=1.4, cap="then she walked in", m="m:dot@300", t="t:shock@760~jump", fx=["bang@t"]),
  dict(d=1.5, cap="he panicked", m="m:q@300" if False else "m:squint@300", t="t:shock@760~faint", fx=["q@m"]),
  dict(d=2.9, m="m:happy@300", t="t:pout@760~faint")], mx0=-260),
 ep(21, "finals", (61, 66), [
  dict(d=1.6, cap="she was studying *so* hard", m="mp:squint@340", t="t:stare@780"),
  dict(d=1.4, cap="he brought snacks", m="mp:squint@340", t="th:cookie:happy@700"),
  dict(d=1.5, cap="and *tea*", m="mp:happy@340", t="th:mug:happy@700~hop"),
  dict(d=2.9, m="m:love@300", t="t:happy@700~hop", fx=["hearts@m"])]),
 ep(22, "her_turn", (66, 72), [
  dict(d=1.6, cap="this time *she* brought something", m="mh:cookie:happy@300", t="t:dot@780"),
  dict(d=1.4, cap="for *him*", m="mh:cookie:love@460", t="t:shock@780~jump", fx=["bang@t"]),
  dict(d=1.5, cap="he cried", m="m:happy@460", t="th:cookie:cry@780~tremble"),
  dict(d=2.9, m="m:love@460", t="th:cookie:cry@780~tremble", fx=["hearts@t"])]),
 ep(23, "hats", (72, 75), [
  dict(d=1.6, cap="he got *matching* hats", m="m:dot@300", t="t:happy+santa@780~hop"),
  dict(d=1.4, cap="for both of them", m="m:shock+santa@300~jump", t="t:happy+santa@760", fx=["bang@m"]),
  dict(d=1.5, cap="she *kept* it on", m="m:sparkle+santa@300~hop", t="t:love+santa@760", fx=["sparkles@m"]),
  dict(d=2.9, m="m:happy+santa@300", t="t:sparkle+santa@760~hop", fx=["hearts@t"])]),
 ep(24, "nap", (75, 80), [
  dict(d=1.6, cap="nap time", m="ms@300", t="t:stare@800", fx=["zzz@m"]),
  dict(d=1.4, cap="he asked if he could join", m="ms@300", t="t:pout@760~tremble"),
  dict(d=1.5, cap="she *scooted over*", m="ss@540", t="-", fx=["hearts@m"]),
  dict(d=2.9, m="ss@540", t="-", fx=["zzz@m", "hearts@m"])]),
 ep(25, "sick", (80, 84), [
  dict(d=1.6, cap="toast caught a *cold*", m="m:dot@300", t="t:cry@780~tremble"),
  dict(d=1.5, cap="she made him *tea*", m="mh:mug:happy@300", t="t:cry@780~tremble"),
  dict(d=1.5, cap="and stayed *all* night", m="mh:mug:happy@520", t="t:love@780"),
  dict(d=2.9, m="m:love@500~lean", t="t:love@780", fx=["hearts@t"])]),
 ep(26, "gift", (84, 88), [
  dict(d=1.6, cap="he wrapped himself as a *gift*", m="m:dot+santa@300", t="tbox:sparkle+santa@780"),
  dict(d=1.4, cap="...", m="m:squint+santa@300", t="tbox:happy+santa@780~hop"),
  dict(d=1.5, cap="she said she'll *keep* him", m="m:happy+santa@300~hop", t="tbox:love+santa@780", fx=["hearts@m"]),
  dict(d=2.9, m="m:love+santa@300", t="tbox:love+santa@780", fx=["hearts@t"])]),
 ep(27, "almost", (88, 91), [
  dict(d=1.6, cap="they watched the *snow*", m="mt:love,love@540", t="-", fx=["snow"]),
  dict(d=1.5, cap="he *almost* said it", m="mt:dot,stare@540", t="-", fx=["snow"]),
  dict(d=1.4, cap="almost", m="mt:dot,pout@540", t="-", fx=["snow"]),
  dict(d=2.9, m="mt:happy,love@540", t="-", fx=["snow", "hearts@m"])]),
 ep(28, "said_it", (91, 91), [
  dict(d=1.6, cap="he finally said it", m="m:dot@300", t="t:love@720", fx=["say@t:i like you"]),
  dict(d=1.3, cap="she froze", m="m:shock@300~shake", t="t:love@720", fx=["bang@m"]),
  dict(d=1.5, cap="then she *ran away*", m="m:shock@-300", t="t:shock@720"),
  dict(d=2.9, m="-", t="t:cry@720~tremble")], foot="day 29 tomorrow · follow to find out why"),
 ep(29, "came_back", (91, 95), [
  dict(d=1.6, cap="she came back", m="mh:letter:happy@300", t="t:cry@760~tremble"),
  dict(d=1.4, cap="with a *letter*", m="mh:letter:love@460", t="t:shock@760~jump", fx=["bang@t"]),
  dict(d=1.5, cap="it said: *tomorrow*", m="m:love@460", t="th:letter:sparkle@760~hop", fx=["sparkles@t"]),
  dict(d=2.9, m="m:love@460", t="th:letter:love@760", fx=["hearts@t"])], mx0=-260),
 ep(30, "me_too", (95, 99), [
  dict(d=1.6, cap="the next day...", m="m:love@300", t="t:stare@760"),
  dict(d=1.5, cap="she said it *back*", m="m:love@340", t="t:stare@760", fx=["say@m:me too"]),
  dict(d=1.4, cap="he fainted", m="m:shock@340~shake", t="t:love@760~faint", fx=["hearts@t"]),
  dict(d=2.9, m="m:happy@340~hop", t="t:love@760~faint", fx=["hearts@m"])], foot="the last day is tomorrow · follow so you don't miss it"),
 ep(31, "christmas_eve", (99, 100), [
  dict(d=1.6, cap="christmas eve", m="m:dot+santa@300", t="th:gift:happy+santa@780", fx=["snow"]),
  dict(d=1.5, cap="no tricks this time", m="m:sparkle+santa@300~hop", t="th:gift:love+santa@700", fx=["snow", "sparkles@m"]),
  dict(d=1.5, cap="just *them*", m="hug:love,love+santa@540", t="-", fx=["snow", "hearts@m"]),
  dict(d=3.2, m="hug:love,love+santa@540", t="-", fx=["snow", "hearts@m"])], foot="thank you for watching · follow for season 2"),
]

def sk(slug, cap, steps, **kw):
    d = dict(slug=f"k_{slug}", header=(None, cap), meter=None, foot=kw.pop("foot", None), seed=200+len(slug), steps=steps)
    d.update(kw); return d

SKITS = [
 sk("hungry", "him when i say\ni'm *hungry*", [
  dict(d=1.2, m="m:pout@300", t="t:dot@780"),
  dict(d=1.0, m="m:pout@300", t="t:shock@780~jump", fx=["bang@t"]),
  dict(d=1.4, m="m:shock@300", t="th:cookie:happy@560"),
  dict(d=2.4, m="mh:cookie:love@300~hop", t="t:smug@760", fx=["hearts@m"])], foot="tag the one who feeds you"),
 sk("home", "us when one of us\ngets *home*", [
  dict(d=1.3, m="-", t="t:stare@780"),
  dict(d=1.1, m="m:happy@300", t="t:shock@780~jump", fx=["bang@t"]),
  dict(d=1.3, m="hug:love,love@540", t="-", fx=["hearts@m"]),
  dict(d=2.2, m="hug:love,love@540", t="-", fx=["hearts@m"])], mx0=-260, foot="send this to your person"),
 sk("mad", "when they're *mad*\nat you", [
  dict(d=1.2, m="m:pout@300~shake", t="t:stare@780", fx=["bang@m"]),
  dict(d=1.3, m="m:pout@300", t="th:flower:happy@600"),
  dict(d=1.2, m="m:squint@300", t="t:love@560~lean"),
  dict(d=2.3, m="m:happy@300~hop", t="t:love@560~lean", fx=["hearts@m"])], foot="send this to someone you owe a flower"),
 sk("waiting_text", "me pretending i'm not\nwaiting for their *text*", [
  dict(d=1.4, m="mp:stare@440", t="-"),
  dict(d=1.0, m="mp:stare@440~tremble", t="-", fx=["sweat@m"]),
  dict(d=1.1, m="mp:shock@440~jump", t="-", fx=["bang@m"]),
  dict(d=2.4, m="mp:sparkle@440~hop", t="-", fx=["hearts@m"])], foot="send this to the one you wait for"),
 sk("blanket_thief", "when they steal\nthe *blanket*", [
  dict(d=1.3, m="ms@300", t="t:smug@800", fx=["zzz@m"]),
  dict(d=1.2, m="m:shock@300~shake", t="ts@780", fx=["bang@m"]),
  dict(d=1.3, m="m:pout@300~tremble", t="ts@780", fx=["zzz@t"]),
  dict(d=2.2, m="ss@540", t="-", fx=["hearts@m"])], foot="tag the blanket thief"),
 sk("romantic", "him trying to be\n*romantic*", [
  dict(d=1.3, m="m:dot@300", t="th:flower:sparkle@780", fx=["sparkles@t"]),
  dict(d=1.0, m="m:dot@300", t="th:flower:sparkle@620~hop"),
  dict(d=1.1, m="m:shock@300", t="t:shock@620~faint", fx=["bang@m"]),
  dict(d=2.4, m="m:happy@300~hop", t="t:pout@620~faint", fx=["hearts@m"])], foot="tag him"),
 sk("see_you", "when you see\nyour *person*", [
  dict(d=1.3, m="m:dot@300", t="t:sparkle@780~hop"),
  dict(d=1.0, m="m:shock@300~jump", t="t:sparkle@700~hop", fx=["bang@m"]),
  dict(d=1.3, m="hug:love,love@540", t="-", fx=["hearts@m"]),
  dict(d=2.2, m="hug:love,love@540", t="-", fx=["hearts@m"])], foot="send this to your person"),
 sk("cold", "when they say\n\"i'm *cold*\"", [
  dict(d=1.3, m="m:dot@300", t="t:cry@780~tremble", fx=["snow"]),
  dict(d=1.0, m="m:shock@300~jump", t="t:cry@780~tremble", fx=["snow", "bang@m"]),
  dict(d=1.3, m="ss@540", t="-", fx=["snow", "hearts@m"]),
  dict(d=2.2, m="ss@540", t="-", fx=["snow", "zzz@m"])], foot="send this to someone who's always cold"),
]
