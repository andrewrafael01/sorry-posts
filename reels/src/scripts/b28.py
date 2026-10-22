"""Batch 28: rankings with real photos (narrated motion graphics)."""
import math, os, json
from PIL import Image, ImageDraw
from scripts.common import *
from motion import *
import motion, voice
from scripts.b24 import photo, PH
from scripts.b25 import wimg, credit_of

_B3 = None
def aimg(title):
    global _B3
    p = "/tmp/claude-0/-home-user-sorry-posts/aeda3cd8-6be4-5731-8b3d-d9639f60d4f0/scratchpad/assets_b3.json"
    if _B3 is None and os.path.exists(p): _B3 = json.load(open(p))
    try: return _B3[title][0][0]
    except Exception: return None

ROWS = [  # rank 10 -> 1: (name, sport, $M, photo title, spoken line)
 ("Lewis Hamilton", "FORMULA 1", 100, "Lewis Hamilton", "Number ten. Formula One champion, Lewis Hamilton. One hundred million dollars a year."),
 ("Kevin Durant", "BASKETBALL", 103.8, "Kevin Durant", "Number nine, Kevin Durant. One hundred four million."),
 ("Karim Benzema", "SOCCER", 104, "Karim Benzema", "Number eight, soccer star Karim Benzema. Also one hundred four million."),
 ("Jon Rahm", "GOLF", 107, "Jon Rahm", "Number seven, golfer Jon Rahm. One hundred seven million."),
 ("Stephen Curry", "BASKETBALL", 124.7, "Stephen Curry", "Number six, Stephen Curry. One hundred twenty five million."),
 ("Shohei Ohtani", "BASEBALL", 127.6, "Shohei Ohtani", "Number five, baseball's Shohei Ohtani. One hundred twenty eight million."),
 ("LeBron James", "BASKETBALL", 137.8, "LeBron James", "Number four, LeBron James. One hundred thirty eight million."),
 ("Lionel Messi", "SOCCER", 140, "Lionel Messi", "Number three, Lionel Messi. One hundred forty million."),
 ("Canelo Alvarez", "BOXING", 170, "Canelo Álvarez", "Number two, boxer Canelo Alvarez. One hundred seventy million."),
 ("Cristiano Ronaldo", "SOCCER", 300, "Cristiano Ronaldo", "And number one, by a mile. Cristiano Ronaldo. Three hundred million dollars."),
]
ACC = [(90, 170, 255), (255, 140, 90), (120, 230, 160), (255, 214, 0), (190, 140, 255), (255, 110, 150), (90, 220, 255), (255, 180, 70), (150, 255, 120), (255, 214, 0)]

def monogram(img, name, x, y, w, h, col):
    box(img, x, y, x + w, y + h, 44, mix((20, 24, 60), col, .35), 1.0, outline=col, ow=5); ini = "".join(p[0] for p in name.split()[:2]); tx(img, ini, x + w / 2, y + h / 2, 280, "black", col)

def athletes():
    beats = []
    def mk(i, row):
        name, sport, money, ptitle, line = row; rank = 10 - i; col = ACC[i]; ph = aimg(ptitle) if ptitle != "Cristiano Ronaldo" else wimg("Cristiano Ronaldo", 1)
        def draw(img, lt, p, b):
            img.paste(vgrad(mix((8, 10, 28), col, .08), mix((20, 18, 50), col, .3), key=("ath", i)))
            a = clamp(lt / .25); x0, y0, w_, h_ = 60, 200, 960, 880
            if ph:
                crop, m = photo(ph, w_, h_, lt, b.dur, 1.0, 1.16, pan=(1 if i % 2 else -1, 0), rad=48); m = m.point(lambda v: int(v * a)); img.paste(crop, (x0, y0), m)
            else: monogram(img, name, x0, y0, w_, h_, col)
            box(img, x0 - 4, y0 - 4, x0 + w_ + 4, y0 + h_ + 4, 52, None, a, outline=col, ow=6)
            tr = pop(lt / .45); tx(img, f"#{rank}", 250, 310, 180, "black", col, scale=tr, a=a, stroke=0, maxw=360)
            box(img, 60, 1110, 1020, 1330, 36, (8, 10, 28), .9, outline=col, ow=4)
            tx(img, name.upper(), 540, 1170, 64, "black", WHITE, a=clamp((lt - .2) / .25), maxw=900)
            tm = b.at("million" if money < 300 else "dollars", default=1.2) if money < 300 else b.at("Three", default=1.2)
            v = money * eio(seg(lt, max(.3, tm - 1.2), max(.9, tm + .2))); tx(img, f"${v:,.0f}M" if money >= 100 and money != 300 or True else "", 540, 1265, 80, "black", col, maxw=900)
            chip_w = 300; box(img, 540 - chip_w / 2, 1000, 540 + chip_w / 2, 1060, 30, col, a); tx(img, sport, 540, 1030, 30, "black", (10, 12, 24), a=a, shadow=False, maxw=chip_w)
            for k in range(10): disc(img, 130 + k * 91, 150, 12 if k == i else 8, col if k == i else (70, 76, 110))
        return draw
    N = [("Who gets paid the most, in all of sports? The answer might surprise you.", None)] + [(r[4], mk(i, r)) for i, r in enumerate(ROWS)]
    def hook(img, lt, p, b):
        img.paste(vgrad((10, 12, 34), (40, 20, 70), key="athhook")); starfield(img, lt, 8)
        for i, r in enumerate(ROWS[::-1][:6]):
            ph = aimg(r[3]) if r[3] != "Cristiano Ronaldo" else wimg("Cristiano Ronaldo", 1); ang = lt * .25 + i * 1.05; cx = 540 + math.cos(ang) * 300; cy = 1050 + math.sin(ang) * 170
            if ph: crop, m = photo(ph, 240, 300, lt, b.dur, 1.0, 1.0, rad=40); img.paste(crop, (int(cx - 120), int(cy - 150)), m)
        tx(img, "THE 10 HIGHEST", 540, 330, 92, "black", WHITE, scale=pop(lt / .4)); tx(img, "PAID ATHLETES", 540, 450, 92, "black", (255, 214, 0), scale=pop((lt - .2) / .4)); tx(img, "ON EARTH", 540, 570, 92, "black", WHITE, scale=pop((lt - .4) / .4))
    beats.append(Beat(N[0][0], hook, 3.0, cut="whip", cues=[(0, "whoosh", .5)]))
    for i, (line, d) in enumerate(N[1:]): 
        bt = Beat(line, d, 3.0, cut=["whip", "flash", "zoom", "whip"][i % 4], cues=[(0, "whoosh", .5)]); beats.append(bt)
    def end(img, lt, p, b):
        img.paste(vgrad((10, 12, 34), (40, 20, 70), key="athend")); starfield(img, lt, 8); v = 9.51 * lt
        tx(img, f"${v:,.2f}", 540, 700, 190, "black", (120, 255, 160)); tx(img, "Ronaldo earns $9.51 every second", 540, 840, 46, "bold", WHITE, maxw=980); tx(img, "watch it add up", 540, 940, 46, "bold", (255, 214, 0))
    beats.append(Beat("That works out to nine dollars and fifty one cents, every single second, even while he sleeps.", end, 3.0, cut="dip", cues=[(0, "whoosh", .5)]))
    for bt in beats[2:11]: bt.cues += [(.5, "hit", .6)]
    return Reel("198_highest_paid", beats, style="trap", seed=198, snap=False, grid=4, safe_zone=False, vo=[(i, b.narr) for i, b in enumerate(beats)], title="the 10 highest-paid athletes",
        caption="the 10 highest paid athletes on earth (Forbes 2026). Ronaldo makes $9.51 every second. who's your number 1? photos: Wikimedia Commons (CC)", story="Forbes 2026: Ronaldo $300M, Canelo $170M, Messi $140M, LeBron $137.8M, Ohtani $127.6M, Curry $124.7M, Rahm $107M, Benzema $104M, Durant $103.8M, Hamilton $100M (outlets differ slightly). $300M / 31.536M s = $9.51/s.")

REELS = dict(athletes=athletes)
