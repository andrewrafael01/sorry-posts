"""Premium 01: Saturn floats. Shaded planet, physically placed waterline (density 0.69 -> 69% submerged), density chart, razor-thin rings, pull-back to the giant tub."""
import math
import numpy as np
from premium import *

def space(img, lt, tint=(4, 5, 16)):
    img.paste(vgrad((tint[0] + 8, tint[1] + 8, tint[2] + 22), tint, key=("sp", tint))); depth_stars(img, lt, vx=-6, vy=-14)

def saturn(img, cx, cy, r, lt, rot=0.0, ring=True):
    rx, ry = r * 1.62, r * .36
    if ring: planet_ring(img, cx, cy, rx, ry, r * .13, (228, 208, 170), tilt=-.22, behind=True)
    sphere(img, cx, cy, r, (234, 208, 152), tex="bands", bands=7, band_col=(186, 146, 96), atmo=(255, 232, 172), rot=rot + lt * .12)
    if ring: planet_ring(img, cx, cy, rx, ry, r * .13, (228, 208, 170), tilt=-.22, behind=False)

def finish(img, k=.6): bloom(img, 150, .55); vignette(img, k)

def hook(img, lt, p, b):
    space(img, lt); z = 1 + .10 * eio(seg(lt, 0, b.dur)); saturn(img, 540, 900, 300, lt)
    kword(img, "SATURN", 540, 330, 150, GOLD, lt, .15, .07); a = eio(seg(lt, .9, 1.5)); tx(img, "WOULD FLOAT IN WATER", 540, 470, 56, "black", WHITE, a=a, shadow=False, maxw=980)
    finish(img); camera(img, z, 540, 900)

def tub(img, lt, scale, cy_planet=980, show_tub=True, big_rim=False):
    """bathtub + water + Saturn floating at its true waterline; scale shrinks everything for the pull-back"""
    img.paste(vgrad((40, 60, 96), (16, 22, 44), key="tubbg"))
    r = 230 * scale; cy = cy_planet; cx = 540; wl = cy - .255 * r
    tw = 1500 * scale; th = 700 * scale
    x0, x1 = int(540 - tw / 2), int(540 + tw / 2); ytop = int(wl - 120 * scale); ybot = int(wl + th)
    if show_tub:
        box(img, x0 - 30 * scale, ytop, x1 + 30 * scale, ybot + 30 * scale, 120 * scale, (236, 240, 248)); box(img, x0, ytop + 10 * scale, x1, ybot, 100 * scale, (126, 150, 190), a=1.0)
    bob = 7 * scale * math.sin(lt * 2.0)
    saturn(img, cx, cy + bob, r, lt)
    water(img, wl + 0 * scale, amp=9 * scale + 1, lt=lt, k=.012 / max(scale, .25), top=(90, 170, 255), bot=(14, 60, 150), alpha=.62, x0=max(0, x0), x1=min(1080, x1), y1=min(1920, ybot))

def inwater(img, lt, p, b):
    s = 1.0; tub(img, lt, s); hud(img, "LESS DENSE THAN WATER", "THE ONLY PLANET THAT FLOATS", GOLD); finish(img, .5)

def chart(img, lt, p, b):
    space(img, lt, (6, 8, 24)); hud(img, "DENSITY", "GRAMS PER CUBIC CENTIMETER", WHITE)
    data = [("Mercury", 5.43, (170, 165, 160), 'rock'), ("Venus", 5.24, (232, 190, 120), 'rock'), ("Earth", 5.51, (90, 150, 255), 'rock'), ("Mars", 3.93, (210, 110, 80), 'rock'), ("Jupiter", 1.33, (214, 170, 130), 'gas'), ("Saturn", .69, (234, 208, 152), 'sat'), ("Uranus", 1.27, (140, 220, 232), 'gas'), ("Neptune", 1.64, (80, 120, 255), 'gas')]
    X0, Y0, H = 120, 1260, 760; sx = 112; yv = lambda d: Y0 - d / 6.0 * H
    water_y = yv(1.0); line(img, [(60, water_y), (1020, water_y)], 4, (110, 190, 255), a=.9); tx(img, "WATER = 1.0", 190, water_y - 36, 34, "black", (140, 205, 255), shadow=False)
    for k in range(0, 7, 1): tx(img, str(k), 78, yv(k), 26, "bold", (120, 130, 170), shadow=False)
    for i, (name, d, col, kind) in enumerate(data):
        t0 = .4 + i * .42; u = ease_out(seg(lt, t0, t0 + .9)); cx = X0 + 40 + i * sx; cy = Y0 - (Y0 - yv(d)) * u; rr = 40
        if name == "Saturn":
            pulse = 1 + .08 * math.sin(lt * 5) * u; glow(img, cx, cy, 110 * pulse, (255, 230, 150), .55 * u); planet_ring(img, cx, cy, rr * 1.7, rr * .4, rr * .16, (228, 208, 170), tilt=-.22, behind=True, bands=8)
            sphere(img, cx, cy, rr * pulse, col, tex="bands", bands=5, band_col=(186, 146, 96), atmo=(255, 232, 172)); planet_ring(img, cx, cy, rr * 1.7, rr * .4, rr * .16, (228, 208, 170), tilt=-.22, behind=False, bands=8)
        else: sphere(img, cx, cy, rr, col, tex="bands" if kind == 'gas' else "noise", bands=5, atmo=tuple(min(255, c + 40) for c in col), seed=i)
        if u > .7: tx(img, name, cx, Y0 + 52, 24, "bold", WHITE if name == "Saturn" else (190, 198, 235), a=clamp((u - .7) * 4), shadow=False)
        if u > .85: tx(img, f"{d:.2f}", cx, cy - rr - 28, 28, "black", GOLD if name == "Saturn" else WHITE, a=clamp((u - .85) * 6), shadow=False)
    finish(img, .5)

def rings(img, lt, p, b):
    space(img, lt, (6, 8, 24)); hud(img, "280,000 KM WIDE", "THE RINGS, SEEN EDGE-ON", GOLD)
    u = ease_out(seg(lt, .3, 1.6)); cy = 900; sphere(img, 540, cy, 120, (234, 208, 152), tex="bands", bands=6, band_col=(186, 146, 96), atmo=(255, 232, 172), rot=lt * .1)
    L = 470 * u; line(img, [(540 - L, cy), (540 + L, cy)], 3, (240, 224, 190)); glow(img, 540 - L, cy, 40, (255, 240, 200), .5); glow(img, 540 + L, cy, 40, (255, 240, 200), .5)
    z = ease_out(seg(lt, 2.4, 4.4))
    if z > 0:
        R = 170 * z; cxm, cym = 300, 1150; disc(img, cxm, cym, R + 8, (230, 236, 255), a=z); disc(img, cxm, cym, R, (10, 12, 30), a=z)
        line(img, [(cxm - R * .9, cym), (cxm + R * .9, cym)], 3, (240, 224, 190), a=z); line(img, [(cxm - R, cym - 5), (cxm - R, cym + 5)], 2, WHITE, a=z)
        line(img, [(cxm + 60, cym - 34), (cxm + 60, cym + 34)], 3, GOLD, a=z); tx(img, "~10 METERS", 760, cym - 20, 54, "black", GOLD, a=z, shadow=False); tx(img, "THICK, IN PLACES", 760, cym + 40, 32, "bold", SOFT, a=z, shadow=False)
        line(img, [(540 + L * .55, cy + 6), (cxm - R * .55, cym - R * .55)], 2, (140, 150, 200), a=.6 * z)
    finish(img, .5)

def pullback(img, lt, p, b):
    s = 1.0 - .8 * ease_out(seg(lt, .3, b.dur - .8)); tub(img, lt, max(.2, s), cy_planet=int(980 + (1 - s) * 280)); a = eio(seg(lt, 1.5, 2.3))
    hud(img, "A TUB 120,000 KM WIDE", "AND IT WOULD FLOAT", GOLD) if a > .02 else None; finish(img, .5)

N = [
 ("Saturn is so light it would float in water.", hook),
 ("It is the only planet less dense than water.", inwater),
 ("Its average density is less than one gram per cubic centimeter, lower than water.", chart),
 ("The rings span more than two hundred thousand kilometers, but in places they are only about ten meters thick.", rings),
 ("You would just need a bathtub a hundred and twenty thousand kilometers wide.", pullback),
]
def saturn_reel():
    return make_reel(436, "saturn_premium", "saturn would float in water", N, style="cine", story="Saturn mean density 0.687 g/cm3 (water 1.0); 69% submerged floats with waterline 0.255 R above the centre; rings about 282,000 km across, about 10 m thick in places; diameter 116,460 km.")
REELS = dict(saturn=saturn_reel)
