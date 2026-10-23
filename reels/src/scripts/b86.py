"""Batch 86: the group chat that went quiet. Animated chat: loud, then dates, then silence. No numbers, no asks."""
from scripts.common import *
from motion import *
import math
import motion, voice

NAVY1, NAVY2 = (12, 14, 28), (30, 24, 52)
AV = {"dev": (255, 150, 90), "mia": (255, 110, 170), "jake": (90, 200, 255), "sam": (160, 130, 255), "me": (74, 120, 255)}
def A(b, w, d=None, occ=0): return b.at(w, occ, d)
def bg(img): img.paste(vgrad(NAVY1, NAVY2, key="chatbg"))

def bubble(img, y, who, text, a=1.0, dim=1.0, dx=0):
    me = who == "me"; L = text_layer(text, 40, "bold", WHITE, maxw=560, shadow=False) if False else text_layer(text, 40, "bold", WHITE, maxw=560)
    w, h = L.width - 8, max(84, L.height - 6); x0 = (1010 - w if me else 170) + dx
    base = (74, 120, 255) if me else (54, 58, 88); col = tuple(int(c * dim + 14 * (1 - dim)) for c in base)
    box(img, x0, y, x0 + w, y + h, 38, col, a=a)
    tx(img, text, x0 + w / 2 + 2, y + h / 2, 40, "bold", tuple(int(255 * dim + 80 * (1 - dim)) for _ in range(3)), a=a, maxw=560, shadow=False)
    if not me:
        ac = tuple(int(c * dim + 40 * (1 - dim)) for c in AV[who]); disc(img, 104 + dx, y + h - 38, 36, ac, a=a)
        tx(img, who[0].upper(), 104 + dx, y + h - 38, 34, "black", (20, 20, 30), a=a, shadow=False)
    return h

def stack(img, lt, items, times, bottom=1290, dim=1.0, gap=26):
    """items: (who, text) or ('sep', label). Newest at the bottom; the column scrolls up as messages arrive."""
    y = bottom; shown = [(i, it) for i, it in enumerate(items) if lt >= times[i]]
    for i, it in reversed(shown):
        a = eio(seg(lt, times[i], times[i] + .22)); rise = (1 - a) * 36
        if it[0] == "sep":
            tx(img, it[1], 540, y - 26 + rise, 30, "bold", (150, 156, 196), a=a * dim, shadow=False); y -= 78
        else:
            L = text_layer(it[1], 40, "bold", WHITE, maxw=560); h = max(84, L.height - 6); y -= h; bubble(img, y + rise, it[0], it[1], a=a, dim=dim); y -= gap
        if y < 380: break

def header(img, name, sub, dim=1.0):
    box(img, 0, 0, 1080, 330, 0, (20, 22, 42))
    for k, c in enumerate(AV.values()): disc(img, 380 + k * 70, 150, 32, tuple(int(x * dim) for x in c))
    tx(img, name, 540, 235, 52, "black", tuple(int(255 * dim) for _ in range(3)), shadow=False); tx(img, sub, 540, 292, 28, "bold", (150, 156, 196), shadow=False)

LOUD = [("dev", "bro. BRO."), ("mia", "send the video"), ("jake", "friday?? say yes"), ("me", "i'm in"), ("sam", "who's driving"), ("dev", "not it"), ("mia", "lmaooo i can't"), ("jake", "2am diner again")]

def group_chat():
    def hook(img, lt, p, b):
        bg(img); header(img, "the group chat", "5 people"); stack(img, lt, LOUD, [0, 0, 0] + [.35 + .5 * (i - 3) for i in range(3, len(LOUD))])
    def loud(img, lt, p, b):
        bg(img); header(img, "the group chat", "5 people"); items = LOUD + [("sam", "this is the best group chat"), ("dev", "no notes")]; stack(img, lt, items, [0] * len(LOUD) + [.4, 1.1])
    def march(img, lt, p, b):
        bg(img); t = A(b, "March", 1.2); items = [("dev", "no notes"), ("sep", "Jun 2"), ("sep", "Aug 19"), ("sep", "Oct 4"), ("me", "we should do this again")]
        header(img, "the group chat", "5 people"); stack(img, lt, items, [0, t, t + .5, t + 1.0, t + 1.6], dim=1.0)
        if lt > t + 2.6: tx(img, "Delivered", 960, 1318, 26, "bold", (150, 156, 196), a=eio(seg(lt, t + 2.6, t + 3.0)), shadow=False)
    def typing(img, lt, p, b):
        bg(img); header(img, "the group chat", "5 people"); items = [("dev", "no notes"), ("sep", "Oct 4"), ("me", "we should do this again")]; stack(img, lt, items, [0, 0, 0], bottom=1160)
        t0 = A(b, "typing", 1.0); t1 = A(b, "stopped", b.dur - .6)
        if t0 <= lt < t1 + .1:
            a = eio(seg(lt, t0, t0 + .2)) * (1 - eio(seg(lt, t1, t1 + .15)))
            box(img, 170, 1190, 380, 1274, 38, (54, 58, 88), a=a); disc(img, 104, 1236, 36, AV["sam"], a=a)
            for k in range(3): disc(img, 222 + k * 46, 1232 - 10 * max(0, math.sin(lt * 7 - k * .9)), 9, (200, 206, 235), a=a)
    def quiet(img, lt, p, b):
        bg(img); d = 1 - .65 * eio(seg(lt, .3, b.dur - .3)); header(img, "the group chat", "5 people", dim=d)
        items = [("dev", "no notes"), ("sep", "Jun 2"), ("sep", "Aug 19"), ("sep", "Oct 4"), ("me", "we should do this again")]; stack(img, lt, items, [0] * 5, dim=d)
    def gaps(img, lt, p, b):
        bg(img); header(img, "the group chat", "5 people", dim=.35)
        tx(img, "BETWEEN THE MESSAGES", 540, 760, 74, "black", (255, 255, 255), a=eio(seg(lt, .2, .8)), maxw=900)
        tx(img, "is where it goes", 540, 940, 58, "black", (255, 190, 120), a=eio(seg(lt, A(b, "gaps", .9), A(b, "gaps", .9) + .5)), maxw=900)
    def end(img, lt, p, b):
        bg(img); header(img, "the group chat", "5 people"); items = [("sep", "Oct 4"), ("me", "we should do this again"), ("me", "ok that was dumb to wait")]
        stack(img, lt, items, [0, 0, A(b, "dumb", 1.4)], bottom=1160)
        box(img, 70, 1200, 1010, 1290, 44, (36, 40, 70)); n = int(lt * 14) % 28
        tx(img, "say something dumb" + ("|" if n < 16 else ""), 540, 1245, 36, "bold", (190, 196, 230), shadow=False, maxw=880)
    N = [
     ("Your group chat used to be the loudest thing in your life.", hook),
     ("Memes at two in the morning. Plans for every weekend. Somebody was always typing.", loud),
     ("Now the last message is from March. We should do this again.", march),
     ("Somebody started typing once. Then stopped.", typing),
     ("Nobody left. Nobody planned it. It just got quieter, one busy week at a time.", quiet),
     ("You don't lose people all at once. You lose them in the gaps between messages.", gaps),
     ("So open it. Say something dumb.", end),
    ]
    beats = [Clean(n, d, 3.0, cut="cut", push=0) for n, d in N]
    return Reel("430_group_chat", beats, style="lofi", seed=430, gain_music=.5, snap=False, grid=0, safe_zone=False, vo=[(i, n) for i, (n, d) in enumerate(N)],
        title="the group chat that went quiet", caption="x",
        story="Original relatable concept, no statistics: an animated group chat goes from constant to silent. The ending is an action, not a tag/comment/share ask.")
REELS = dict(group_chat=group_chat)
