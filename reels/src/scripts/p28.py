"""Premium 28: more cute spinners (cat, mushroom, cloud, bunny); same pillow-of-dots engine as p27. No text, no voice."""
import math
import numpy as np
import reel
from scripts import p27
from scripts.p27 import eyes, smile

def cat_body(d, s):
    d.ellipse([95 * s, 190 * s, 545 * s, 585 * s], fill=255)
    d.polygon([(105 * s, 330 * s), (135 * s, 70 * s), (300 * s, 235 * s)], fill=255); d.polygon([(535 * s, 330 * s), (505 * s, 70 * s), (340 * s, 235 * s)], fill=255)
def mush_body(d, s):
    d.pieslice([50 * s, 30 * s, 590 * s, 530 * s], 180, 360, fill=255); d.rectangle([215 * s, 270 * s, 425 * s, 540 * s], fill=255); d.ellipse([205 * s, 470 * s, 435 * s, 600 * s], fill=255)
def cloud_body(d, s):
    for (x, y, r) in ((190, 380, 125), (320, 290, 160), (455, 370, 130), (320, 420, 150)): d.ellipse([(x - r) * s, (y - r) * s, (x + r) * s, (y + r) * s], fill=255)
def bunny_body(d, s):
    d.ellipse([130, 230, 510, 610] if False else [130 * s, 230 * s, 510 * s, 610 * s], fill=255)
    d.ellipse([160 * s, 20 * s, 285 * s, 340 * s], fill=255); d.ellipse([355 * s, 20 * s, 480 * s, 340 * s], fill=255)
def mush_face(d, s):
    eyes(d, s, 320, 425, 16, 26, 46); smile(d, s, 320, 462, 36, 26, 11)
    for (x, y, r) in ((170, 190, 42), (320, 110, 48), (465, 200, 40)): d.ellipse([(x - r) * s, (y - r) * s, (x + r) * s, (y + r) * s], fill=255)
p27.SHAPES.update({
 "cat": dict(amp=1.7, body=cat_body, blur=4, face=lambda d, s: (eyes(d, s, 320, 400, 28, 40, 92), smile(d, s, 320, 440, 44, 30, 12)), hue=(.09, .05), th=.34, sc=420),
 "mushroom": dict(amp=1.45, body=mush_body, blur=4, face=mush_face, hue=(.99, .93), th=.34, sc=400),
 "cloud": dict(amp=1.45, body=cloud_body, blur=5, face=lambda d, s: (eyes(d, s, 320, 345, 24, 36, 76), smile(d, s, 320, 385, 56, 42, 14)), hue=(.56, .50), th=.36, sc=420),
 "bunny": dict(amp=1.4, body=bunny_body, blur=4, face=lambda d, s: (eyes(d, s, 320, 430, 24, 34, 72), smile(d, s, 320, 470, 40, 30, 12)), hue=(.88, .80), th=.34, sc=410),
})
def mk(name, num, seed):
    def f(): return reel.Reel(f"{num}_cute_{name}", [p27.Cute(name, 26.0, seed)], style="cine", seed=num, gain_music=.85, loop=True, snap=False, grid=0, safe_zone=False, title="reverse the spin", caption="x", story=f"Cute {name}: pillow-thick dot cloud with a white-dot face on both sides, orthographic and occlusion-free so the spin direction is bistable.")
    return f
REELS = dict(cat=mk("cat", 537, 21), mushroom=mk("mushroom", 538, 22), cloud=mk("cloud", 539, 23), bunny=mk("bunny", 540, 24))
