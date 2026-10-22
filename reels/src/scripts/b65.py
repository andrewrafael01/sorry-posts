"""Batch 65: the heartbeat budget. A live counter that ticks on every thump of the soundtrack: this video spends about 66 of your ~3 billion beats."""
import math
import numpy as np
from PIL import Image, ImageDraw
from scripts.common import *
from motion import *
from scripts.b61 import poly
import motion, voice

RED = (255, 70, 100); GOLD = (255, 214, 0); WHITE = (255, 255, 255); SOFT = (190, 198, 235)
BPM = 72; P = 60.0 / BPM
def A(b, w, d=None, occ=0): return b.at(w, occ, d)

def heart(img, cx, cy, size, pulse=0.0, col=RED):
    pts = []
    for k in range(120):
        t = 2 * math.pi * k / 120; x = 16 * math.sin(t) ** 3; y = 13 * math.cos(t) - 5 * math.cos(2 * t) - 2 * math.cos(3 * t) - math.cos(4 * t)
        pts.append((cx + x * size, cy - y * size))
    glow(img, cx, cy, size * 30 * (1 + .25 * pulse), col, .45 + .3 * pulse)
    poly(img, pts, mix(col, (255, 255, 255), .0))
    poly(img, [(cx + (x - cx) * .55, cy - 4 * size + (y - cy) * .5) for x, y in pts[:60]] if False else pts[3:10] + [pts[3]], mix(col, WHITE, .5), .0)

def beat_pulse(tg):
    ph = (tg % P); lub = math.exp(-ph * 14); dub = .6 * math.exp(-max(0, ph - .22) * 14) if ph > .22 else 0
    return max(lub, dub)

def ecg(ph):
    g = lambda c, w, a: a * math.exp(-((ph - c) / w) ** 2)
    return g(.12, .035, .18) + g(.2, .012, -.15) + g(.225, .014, 1.0) + g(.25, .014, -.28) + g(.42, .05, .3)

def trace(img, tg, y=1130, amp=130, win=3.2):
    pts = []
    for x in range(40, 1041, 5):
        t = tg - (1040 - x) / 1000 * win; pts.append((x, y - amp * ecg((t % P) / P)))
    for i in range(len(pts) - 1):
        a = .15 + .85 * (i / len(pts)); line(img, [pts[i], pts[i + 1]], 5, mix((20, 24, 40), (255, 90, 120), a), 1.0)
    glow(img, pts[-1][0], pts[-1][1], 40, RED, .9)

def life_bar(img, y, frac_used, label_used, a=1.0, video=False):
    x0, x1 = 80, 1000; box(img, x0, y - 22, x1, y + 22, 22, (30, 34, 58), a)
    w = (x1 - x0) * frac_used
    if w > 4: box(img, x0, y - 22, x0 + max(24, w), y + 22, 22, RED, a)
    tx(img, "0", x0, y + 52, 26, "bold", SOFT, a=a, shadow=False); tx(img, "3,000,000,000", x1 - 90, y + 52, 26, "bold", SOFT, a=a, shadow=False, maxw=400)
    if label_used: tx(img, label_used, min(760, max(260, x0 + max(24, w))), y - 52, 30, "black", WHITE, a=a, shadow=False, maxw=500)

def base(img, b, lt, counter=True):
    tg = getattr(b, "t0", 0.0) + lt; pulse = beat_pulse(tg)
    img.paste(vgrad((8, 6, 22), (26, 10, 40), key="heartbg"))
    if counter: tx(img, f"this video: {int(tg / P)} heartbeats", 540, 150, 32, "black", SOFT, shadow=False, maxw=900)
    return tg, pulse

def heartbeat():
    def hook(img, lt, p, b):
        tg, pu = base(img, b, lt, counter=False); heart(img, 540, 720, 15 * (1 + .09 * pu), pulse=pu)
        n = int(3.0e9 * eio(seg(lt, .3, A(b, "total", 3.0)))); tx(img, f"{n:,}", 540, 300, 96 if n >= 1e9 else 110, "black", WHITE, maxw=980); tx(img, "HEARTBEATS. YOUR WHOLE LIFE.", 540, 410, 34, "bold", SOFT, shadow=False)
        trace(img, tg)
    def video(img, lt, p, b):
        tg, pu = base(img, b, lt, counter=False); heart(img, 540, 760, 13 * (1 + .09 * pu), pulse=pu)
        tx(img, f"{int(tg / P)}", 540, 330, 190, "black", WHITE, maxw=700); tx(img, "HEARTBEATS SINCE THIS VIDEO STARTED", 540, 470, 30, "bold", SOFT, shadow=False, maxw=980); trace(img, tg)
    def day(img, lt, p, b):
        tg, pu = base(img, b, lt); heart(img, 540, 700, 11 * (1 + .09 * pu), pulse=pu)
        tx(img, "72 / min", 330, 330, 70, "black", GOLD, maxw=500); n = int(103680 * eio(seg(lt, .8, b.dur - 1.0))); tx(img, f"{n:,} a day", 700, 330, 64, "black", WHITE, maxw=560); trace(img, tg)
    def athlete(img, lt, p, b):
        tg, pu = base(img, b, lt); heart(img, 540, 700, 11 * (1 + .09 * pu), pulse=pu)
        tx(img, "55 / min", 330, 330, 70, "black", GOLD, maxw=500); tx(img, "79,200 a day", 700, 330, 56, "black", WHITE, maxw=560)
        a = clamp((lt - A(b, "twenty", 4.0)) / .3); tx(img, "-24,480 a day", 540, 430, 60, "black", (120, 255, 170), a=a, scale=pop(a), maxw=980); trace(img, tg)
    def year(img, lt, p, b):
        tg, pu = base(img, b, lt); heart(img, 540, 700, 11 * (1 + .09 * pu), pulse=pu)
        n = 37.8e6 * eio(seg(lt, .4, A(b, "year", 2.5) + .5)); tx(img, f"{n / 1e6:.0f} million a year", 540, 330, 70, "black", GOLD, maxw=980)
        m = 3.02e9 * eio(seg(lt, A(b, "three", 3.0), b.dur - .4)); tx(img, f"{m / 1e9:.2f} billion at 80", 540, 430, 54, "black", WHITE, maxw=980, a=clamp((lt - A(b, "three", 3.0) + .3) / .3)); trace(img, tg)
    def age25(img, lt, p, b):
        tg, pu = base(img, b, lt); frac = 946e6 / 3.02e9; heart(img, 540, 640, 10 * (1 + .09 * pu), pulse=pu)
        tx(img, "AGE 25", 540, 300, 60, "black", GOLD, shadow=False); life_bar(img, 1000, frac * eio(seg(lt, .4, 2.0)), "~946 million used", 1.0)
        tx(img, "this video = a hair", 540, 1130, 36, "bold", SOFT, a=clamp((lt - 3.0) / .4), shadow=False)
    def caveat(img, lt, p, b):
        tg, pu = base(img, b, lt); heart(img, 540, 700, 10 * (1 + .09 * pu), pulse=pu)
        tx(img, "NOT A LITERAL LIMIT", 540, 320, 64, "black", WHITE, maxw=980, scale=pop(lt / .4)); tx(img, "people outlive the rule that holds for other mammals", 540, 410, 30, "bold", SOFT, shadow=False, maxw=980); trace(img, tg)
    def million(img, lt, p, b):
        tg, pu = base(img, b, lt); heart(img, 540, 700, 11 * (1 + .09 * pu), pulse=pu)
        tx(img, "1,000,000 beats", 540, 310, 64, "black", GOLD, maxw=980); tx(img, "= 9.6 days", 540, 410, 70, "black", WHITE, a=clamp((lt - A(b, "nine", 1.5)) / .3), scale=pop((lt - A(b, "nine", 1.5)) / .4), maxw=980); trace(img, tg)
    def end(img, lt, p, b):
        tg, pu = base(img, b, lt); heart(img, 540, 700, 12 * (1 + .09 * pu), pulse=pu)
        tx(img, "SPEND THEM ON PEOPLE", 540, 320, 60, "black", GOLD, maxw=980, scale=pop(lt / .4)); trace(img, tg)
    N = [
     ("You have about three billion heartbeats. Total. Not a year. Your whole life. And you are spending them right now.", hook),
     ("This video lasts less than a minute. By the end, around sixty of them are gone. Spent on this.", video),
     ("A heart at seventy two beats a minute does about a hundred thousand a day. Asleep, at work, scrolling. It never stops.", day),
     ("Athletes often rest around fifty five beats a minute. That's about eighty thousand a day. Twenty thousand fewer, every day, for the same life.", athlete),
     ("That's thirty eight million a year. Around three billion by the time you're eighty.", year),
     ("If you're twenty five, nearly a billion are already behind you.", age25),
     ("It's not a literal limit. People outlive the rule that holds for other mammals. But it shows how fast it's running.", caveat),
     ("A million heartbeats is about nine and a half days. So what are you spending the next million on?", million),
     ("Send this to someone you want to spend a million with. Not scroll past.", end),
    ]
    beats = [Clean(n, d, 3.0, cut="cut", push=0) for n, d in N]
    r = Reel("407_heartbeats", beats, style="cine", seed=407, gain_music=.35, snap=False, grid=0, safe_zone=False, vo=[(i, n) for i, (n, d) in enumerate(N)],
        title="you only get about 3 billion heartbeats", caption="you have about 3 billion heartbeats and this video just spent 66 of them. what are you spending the next million on? send this to someone you want to spend them with",
        story="72 bpm x 1,440 min = 103,680/day; x 365 = 37.8 million/yr; x 80 = 3.02 billion. Age 25 = 946 million. 1 million beats = 9.65 days. Not a literal limit: the fixed-heartbeat rule holds across mammal species but humans live far longer than it predicts. Counter and soundtrack tick together at 72 bpm.")
    for s, t0 in zip(r.shots, r.starts): s.t0 = t0
    tmax = r.dur; k = 0
    while k * P < tmax:
        t = k * P
        for s, t0 in zip(r.shots, r.starts):
            if t0 <= t < t0 + s.dur: s.cues = list(s.cues) + [(t - t0, "lub", 1.0), (t - t0 + .22, "dub", .8)]
        k += 1
    return r
REELS = dict(heartbeats=heartbeat)
