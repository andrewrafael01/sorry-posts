"""Batch 87: the friend you stopped texting. A draft is typed and deleted letter by letter. No numbers, no asks to tag/share."""
import math
from scripts.common import *
from motion import *
import motion, voice
from scripts import b86
from scripts.b86 import bg, bubble, stack, AV, A

AV["alex"] = (255, 170, 90)

def header1(img, dim=1.0, sub="last seen a while ago"):
    box(img, 0, 0, 1080, 330, 0, (20, 22, 42)); disc(img, 540, 140, 54, tuple(int(c * dim) for c in AV["alex"]))
    tx(img, "A", 540, 140, 56, "black", (20, 20, 30), shadow=False)
    tx(img, "Alex", 540, 235, 52, "black", tuple(int(255 * dim) for _ in range(3)), shadow=False); tx(img, sub, 540, 292, 28, "bold", (150, 156, 196), shadow=False)

def compose(img, txt, caret=True, lt=0.0, y=1200):
    box(img, 70, y, 1010, y + 90, 44, (36, 40, 70))
    if txt: tx(img, txt + ("|" if caret and int(lt * 14) % 28 < 16 else ""), 540, y + 45, 38, "bold", (225, 230, 250), shadow=False, maxw=860)
    else: tx(img, "Message" + ("|" if caret and int(lt * 14) % 28 < 16 else ""), 540, y + 45, 36, "bold", (110, 116, 156), shadow=False, maxw=860)

def typed(s, t0, t1, lt):
    """letters of s revealed linearly between t0 and t1"""
    n = int(len(s) * clamp((lt - t0) / max(.01, t1 - t0))); return s[:n]

OLD = [("alex", "lol did you see this"), ("me", "dead"), ("sep", "March"), ("alex", "we need to catch up soon!"), ("me", "yes!! this week")]

def friend():
    def hook(img, lt, p, b):
        bg(img); header1(img); stack(img, lt, OLD, [0, .25, .5, .8, 1.1], bottom=1160); compose(img, "", lt=lt)
    def nofight(img, lt, p, b):
        bg(img); header1(img); items = OLD + [("sep", "a busy week"), ("sep", "a month"), ("sep", "now")]; stack(img, lt, items, [0] * 5 + [A(b, "week", 1.0), A(b, "month", 2.0), A(b, "Then", 3.0)], bottom=1160); compose(img, "", lt=lt)
    def weird(img, lt, p, b):
        bg(img); header1(img); items = OLD + [("sep", "now")]; stack(img, lt, items, [0] * 6, bottom=1160)
        s = "hey, it's been so long, sorry"; td = b.dur - 1.3
        txt = typed(s, .4, 2.6, lt) if lt < td else s[: int(len(s) * (1 - clamp((lt - td) / 1.0)))]
        compose(img, txt, lt=lt)
    def theytoo(img, lt, p, b):
        bg(img); header1(img, sub="typing..."); items = OLD + [("sep", "now")]; stack(img, lt, items, [0] * 6, bottom=1160); compose(img, "", lt=lt)
        t0 = A(b, "typed", 1.2); t1 = A(b, "deleted", b.dur - .8)
        if t0 <= lt < t1 + .6:
            a = eio(seg(lt, t0, t0 + .2)) * (1 - eio(seg(lt, t1 + .2, t1 + .6)))
            box(img, 170, 1050, 380, 1134, 38, (54, 58, 88), a=a); disc(img, 104, 1092, 36, AV["alex"], a=a)
            for k in range(3): disc(img, 222 + k * 46, 1088 - 10 * max(0, math.sin(lt * 7 - k * .9)), 9, (200, 206, 235), a=a)
    def enough(img, lt, p, b):
        bg(img); header1(img); items = OLD + [("sep", "now")]; stack(img, lt, items, [0] * 6, bottom=1160)
        compose(img, typed("saw this and thought of you", .5, b.dur - .8, lt), lt=lt)
    def end(img, lt, p, b):
        bg(img); header1(img, sub="active now"); ts = A(b, "Send", .3) + .7
        items = OLD + [("sep", "now"), ("me", "saw this and thought of you")]; stack(img, lt, items, [0] * 6 + [ts], bottom=1160)
        compose(img, "saw this and thought of you" if lt < ts else "", lt=lt)
    N = [
     ("There's someone you stopped texting. Nothing happened. You just stopped.", hook),
     ("No fight. No reason. Just a busy week. Then a month. Then it felt strange to say hey.", nofight),
     ("So you typed something once. Then you deleted it.", weird),
     ("They've probably typed one to you too. And deleted it.", theytoo),
     ("Keep it small. Saw this and thought of you is enough.", enough),
     ("Send it before the weird gets bigger.", end),
    ]
    beats = [Clean(n, d, 3.0, cut="cut", push=0) for n, d in N]
    return Reel("431_friend_stopped", beats, style="lofi", seed=431, gain_music=.5, snap=False, grid=0, safe_zone=False, vo=[(i, n) for i, (n, d) in enumerate(N)],
        title="the friend you stopped texting", caption="x",
        story="Original relatable concept, no statistics: drifting from a friend without a reason; a typed-then-deleted draft; the ending is a personal action, not a tag/comment/share ask.")
REELS = dict(friend=friend)
