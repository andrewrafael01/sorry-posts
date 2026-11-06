"""Premium 33: What if the Sun just disappeared. Real numbers: light (and gravity) need 499 s to cover 149.6 million km, so for 8 min 19 s nothing happens; then the light goes out and Earth leaves in a straight line at 29.8 km/s (107,000 km/h)."""
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
import reel, whatif
from engine import W, H
from premium import bloom, vignette, sphere, depth_stars

SX, SY, EX, EY = 190.0, 930.0, 890.0, 930.0; T_GONE = 5.0; T_ARR = 17.0; TLIGHT = 499.0
def smooth(u): u = max(0.0, min(1.0, u)); return u * u * (3 - 2 * u)
CAPS = [(5.4, 9.6, "It's gone. Right now. Look outside. You can't tell."), (10.0, 15.8, "Gravity travels at the speed of light too. Earth has no idea."), (17.4, 20.4, "And then the lights go out."),
        (21.2, 25.4, "Earth leaves in a straight line. 107,000 km/h. Nobody's steering."), (27.0, 31.4, "Below freezing within a week. Plants go first. Then, uh, the rest."), (33.0, 38.0, "Sunscreen sales: through the floor.")]
class Sun(reel.Shot):
    cut = "cut"
    def __init__(self, dur=39.0): self.dur = dur; self.cues = []
    def render(self, lt):
        img = Image.new("RGB", (W, H), (3, 4, 10)); depth_stars(img, lt, vx=0, vy=0, n=140, seed=5)
        lit = lt < T_ARR; off = 0.0
        if lt >= T_ARR: off = (lt - T_ARR) * 17.0       # Earth drifts off along its tangent
        ex, ey = EX, EY - off
        if lt < T_GONE + .5:
            k = 1.0 if lt < T_GONE else 1 - smooth((lt - T_GONE) / .5)
            sphere(img, SX, SY, 150, (255, 196, 70), tex="noise", emissive=.85, seed=3, ambient=.5)
            if k < 1:
                dark = Image.new("RGB", (W, H), (3, 4, 10)); img = Image.blend(dark, img, k) if False else img
        # the light front travelling out from where the Sun was
        ov = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(ov)
        if T_GONE <= lt <= T_ARR:
            u = (lt - T_GONE) / (T_ARR - T_GONE); rad = 150 + (EX - SX - 150 - 38) * u
            for w_, a_ in ((16, 40), (7, 90), (3, 200)): d.ellipse([SX - rad, SY - rad, SX + rad, SY + rad], outline=(255, 214, 130, a_), width=w_)
        # Earth: lit from the left until the light stops reaching it
        light = (-.9, -.1) if lit else (-.9, -.1)
        sphere(img, ex, ey, 40, (70, 130, 235), light=light, tex="noise", atmo=(80, 150, 255) if lit else (40, 70, 130), seed=7, ambient=.16 if lit else .05)
        if not lit: ov2 = Image.new("RGBA", (W, H), (0, 0, 0, 0)); ImageDraw.Draw(ov2).ellipse([ex - 44, ey - 44, ex + 44, ey + 44], fill=(2, 3, 8, int(150 * smooth((lt - T_ARR) / .6)))); ov = Image.alpha_composite(ov, ov2)
        img.paste(ov, (0, 0), ov); bloom(img, 150, .9, 10)
        if lt < T_GONE + .6:
            pass
        else:
            pass
        # HUD
        if lt < T_GONE: whatif.title(img, "What if the Sun just disappeared?", whatif.cap_alpha(lt, .1, T_GONE - .3, .5, .5), y=330, size=62)
        if lt >= T_GONE and lt < T_ARR:
            left = max(0.0, TLIGHT * (1 - (lt - T_GONE) / (T_ARR - T_GONE))); m, s = int(left // 60), int(left % 60)
            whatif.hud(img, "Until Earth notices", f"{m}:{s:02d}", "light needs 8 min 19 s to get here", y=84)
        elif lt >= T_ARR:
            sp = 29.8 * smooth((lt - T_ARR) / 3.0)
            whatif.hud(img, "Earth's speed, straight out", f"{sp * 3600:,.0f} km/h", "no sun. no orbit. no steering", y=84)
        for (a0, a1, text) in CAPS:
            al = whatif.cap_alpha(lt, a0, a1)
            if al > 0: whatif.caption(img, text, al, y=1500)
        vignette(img, .5); fade = min(1.0, lt / .6, (self.dur - lt) / .6); return Image.eval(img, lambda p: int(p * fade))
def mk():
    return reel.Reel("585_whatif_sun_disappears", [Sun()], style="cine", seed=585, gain_music=.85, loop=False, snap=False, grid=0, safe_zone=False, title="what if the sun disappeared", caption="x",
                     story="Sun vanishes: 499 s light/gravity delay, then dark, then Earth leaves tangentially at 29.8 km/s.")
REELS = dict(sun=mk)
