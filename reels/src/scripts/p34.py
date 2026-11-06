"""Premium 34: What if you drove to the Moon. 384,400 km at 100 km/h = 160.2 days; a 600 km tank = 641 gas stops; a 30 mpg car would burn about 7,960 gallons. Live odometer."""
import math
import numpy as np
from PIL import Image, ImageDraw
import reel, whatif
from engine import W, H
from premium import bloom, vignette, sphere, depth_stars

DIST = 384400.0; SPEED = 100.0; TANK = 600.0; T_DRIVE0, T_DRIVE1 = 4.5, 36.0
def smooth(u): u = max(0.0, min(1.0, u)); return u * u * (3 - 2 * u)
CAPS = [(5.0, 9.0, "Road trip. 384,400 km. No traffic, at least."), (10.0, 14.6, "Are we there yet? (Day 3.)"), (16.0, 21.0, "You stop for gas every 600 km. That's about 640 stops. In space."),
        (22.0, 27.0, "A normal car burns about 8,000 gallons. At $3.50, that's $28,000 in gas."), (28.0, 33.0, "Day 160. The Moon is not impressed."), (36.6, 42.0, "You arrive. There's no parking.")]
class Drive(reel.Shot):
    cut = "cut"
    def __init__(self, dur=42.5): self.dur = dur; self.cues = []
    def render(self, lt):
        img = Image.new("RGB", (W, H), (3, 4, 10)); depth_stars(img, lt, vx=-10, vy=0, n=150, seed=8)
        u = smooth((lt - T_DRIVE0) / (T_DRIVE1 - T_DRIVE0)) if False else max(0.0, min(1.0, (lt - T_DRIVE0) / (T_DRIVE1 - T_DRIVE0)))
        sphere(img, 160, 1000, 150, (70, 130, 235), light=(.6, -.5), tex="noise", atmo=(80, 150, 255), seed=4, ambient=.16)
        sphere(img, 930, 1000, 70, (190, 190, 195), light=(-.6, -.5), tex="noise", seed=5, ambient=.1)
        d = ImageDraw.Draw(img); d.line([(310, 1000), (850, 1000)], fill=(60, 66, 90), width=3)
        for k in range(0, 14): xx = 310 + k * 40 + (-(u * 600)) % 40; 
        cx = 310 + (850 - 310) * u
        d.rounded_rectangle([cx - 26, 982, cx + 26, 1008], 7, fill=(255, 214, 90)); d.ellipse([cx - 18, 1003, cx - 8, 1013], fill=(40, 40, 40)); d.ellipse([cx + 8, 1003, cx + 18, 1013], fill=(40, 40, 40))
        bloom(img, 160, .6, 8)
        km = DIST * u; days = km / SPEED / 24; stops = int(km // TANK)
        if lt < T_DRIVE0: whatif.title(img, "What if you drove to the Moon?", whatif.cap_alpha(lt, .1, T_DRIVE0 - .3, .5, .5), y=330, size=62)
        else:
            whatif.hud(img, "Odometer", f"{km:,.0f} km", f"day {days:,.1f}  ·  {stops} gas stops  ·  100 km/h", y=84)
        for (a0, a1, text) in CAPS:
            al = whatif.cap_alpha(lt, a0, a1)
            if al > 0: whatif.caption(img, text, al, y=1500)
        vignette(img, .5); fade = min(1.0, lt / .6, (self.dur - lt) / .6); return Image.eval(img, lambda p: int(p * fade))
def mk():
    return reel.Reel("586_whatif_drive_to_the_moon", [Drive()], style="cine", seed=586, gain_music=.85, loop=False, snap=False, grid=0, safe_zone=False, title="what if you drove to the moon", caption="x",
                     story="Drive to the Moon at 100 km/h: 384,400 km, 160.2 days, 641 stops on a 600 km tank, live odometer.")
REELS = dict(moon=mk)
