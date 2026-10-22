"""Batch 79: 200 balls = 200 days with your parents. Real collision physics; the opening in the ring widens and the balls leave one by one. When the last one goes, the ring is empty."""
import sys, os
from scripts.common import *
import reel, sim

def mom_balls():
    gapf = lambda t: .28 + .03 * t
    s = sim.RingSim("EACH BALL IS ONE DAY", shape="ring", dur=34.0, sub="LEFT WITH YOUR PARENTS · ABOUT 200", gapf=gapf, spin=1.0, g=1400.0, ra0=4.71, boost=1.0, ball_r=13, n0=200, spawn=0, pile=True, quiet=True, unit="days left", seed=4,
        speech=[(.6, "Each ball is one day left with your parents. About two hundred.", None), (21.5, "They leave one at a time. You don't get to choose which day is the last.", None)], final="CALL THEM")
    return reel.Reel("421_parents_balls", [s], style="cine", seed=421, gain_music=.5, loop=True, snap=False, grid=0, safe_zone=False, title="each ball is a day left with your parents", caption="x",
        story="Illustrative: 200 days (10 days a year x 20 years). Elastic ball-ball and wall collisions; the opening in the ring widens over time and balls can only leave through it.")
REELS = dict(mom_balls=mom_balls)

def xmas_balls():
    s = sim.RingSim("EACH BALL IS A CHRISTMAS", shape="ring", dur=34.0, sub="LEFT WITH YOUR PARENTS IF THEY'RE 60 · ABOUT 20", gapf=lambda t: .26 + .016 * t, spin=.8, g=1400.0, boost=1.0, ball_r=34, n0=20, spawn=0, pile=True, quiet=True, unit="Christmases left", seed=7, ra0=4.71,
        speech=[(.6, "Each ball is a Christmas you have left with your parents. If they're sixty, about twenty.", None), (21.0, "They leave one at a time. Nobody tells you which one is the last.", None)], final="SHOW UP")
    return reel.Reel("422_christmas_balls", [s], style="cine", seed=422, gain_music=.5, loop=True, snap=False, grid=0, safe_zone=False, title="each ball is a Christmas left with your parents", caption="x",
        story="Illustrative: parents aged 60, about 20 Christmases if you see them every year. Elastic collisions; balls can only leave through the widening opening.")

def dinner_balls():
    s = sim.RingSim("EACH BALL IS A DINNER", shape="ring", dur=38.0, sub="LEFT WITH A GRANDMA WHO IS 80 · ABOUT 108", gapf=lambda t: .28 + .03 * t, spin=1.0, g=1400.0, boost=1.0, ball_r=16, n0=108, spawn=0, pile=True, quiet=True, unit="dinners left", seed=9, ra0=4.71,
        speech=[(.6, "Each ball is a monthly dinner with a grandma who is eighty. About a hundred and eight.", None), (19.0, "They leave one at a time. Nobody knows which dinner is the last.", None)], final="CALL HER")
    return reel.Reel("423_dinner_balls", [s], style="cine", seed=423, gain_music=.5, loop=True, snap=False, grid=0, safe_zone=False, title="each ball is a dinner left with grandma", caption="x",
        story="Illustrative: 12 visits a year x 9 years (SSA life table at 80) = 108. Elastic collisions; balls can only leave through the widening opening.")
REELS.update(xmas_balls=xmas_balls, dinner_balls=dinner_balls)

def kid_summers():
    s = sim.RingSim("EACH BALL IS A SUMMER", shape="square", dur=34.0, sub="LEFT WITH YOUR KID IF THEY'RE 8 · TEN", gapf=lambda t: .30 + .024 * t, spin=.8, g=1400.0, boost=1.0, ball_r=40, n0=10, spawn=0, pile=True, quiet=True, unit="summers left", seed=4, ra0=4.71,
        speech=[(.6, "If your kid is eight, you have about ten summers left before they're eighteen. Each ball is one.", None), (15.0, "They leave one at a time. Comment how old yours is, and send this to another parent.", None)], final="THIS SUMMER")
    return reel.Reel("424_kid_summers", [s], style="cine", seed=424, gain_music=.5, loop=True, snap=False, grid=0, safe_zone=False, title="each ball is a summer left with your kid", caption="x",
        story="Illustrative: a child aged 8 has about 10 summers at home before 18. Elastic collisions; balls can only leave through the widening opening in the rotating square.")
REELS.update(kid_summers=kid_summers)
