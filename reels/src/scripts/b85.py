"""Batch 85: relatable rewrite of the parents reel. Most of the time with your parents is already behind you by the day you move out. No arithmetic, no age-60 framing."""
from scripts.common import *
from motion import *
import motion, voice
from scripts.b67 import GOLD, SOFT, WARM, A, grid200, year365, hud

def bgw(img): img.paste(vgrad((24, 12, 34), (58, 26, 44), key="warm"))

def parents_left():
    def hook(img, lt, p, b):
        bgw(img); n = 200 * (1 - .9 * eio(seg(lt, .6, b.dur - .8))); hud(img, "ALREADY GONE", "MOST OF YOUR TIME WITH YOUR PARENTS", GOLD); grid200(img, lt, 200 - n, labels=False)
    def dinners(img, lt, p, b):
        bgw(img); hud(img, "THE ORDINARY STUFF", "DINNERS. CAR RIDES. MORNINGS BEFORE SCHOOL.", WARM); grid200(img, lt, 180, labels=False)
    def pieces(img, lt, p, b):
        bgw(img); hud(img, "NOW IT'S IN PIECES", "A HOLIDAY HERE. A WEEKEND THERE.", WARM); year365(img, lt, True, a=clamp(lt / .5))
    def chapter(img, lt, p, b):
        bgw(img); hud(img, "THE LAST CHAPTER", "NOBODY TELLS YOU WHEN IT STARTS", GOLD); grid200(img, lt, 180, labels=False)
    def end(img, lt, p, b):
        bgw(img); hud(img, "CALL THEM TONIGHT", "NOT FOR ANY REASON", GOLD); grid200(img, lt, 180 - 1 * (lt * 3 % 1), labels=False)
    N = [
     ("By the day you moved out, you'd already used up most of the time you'll ever get with your parents.", hook),
     ("Think about it. Every dinner. Every car ride. Every morning before school. That was the bulk of it.", dinners),
     ("Now it comes in pieces. A holiday here. A long weekend there.", pieces),
     ("You're not out of time. But you are in the last chapter, and nobody tells you that.", chapter),
     ("So call them tonight. Not for any reason. Then send this to someone who should call their mom.", end),
    ]
    beats = [Clean(n, d, 3.0, cut="cut", push=0) for n, d in N]
    return Reel("429_parents_chapter", beats, style="cine", seed=429, gain_music=.5, snap=False, grid=0, safe_zone=False, vo=[(i, n) for i, (n, d) in enumerate(N)],
        title="most of your time with your parents is already gone", caption="x",
        story="Commonly cited estimate (Tim Urban, The Tail End): roughly 90% of in-person time with parents happens before age 18 for people who leave home. Stated once, no arithmetic.")
REELS = dict(parents_chapter=parents_left)
