"""Batch 24: motion-graphics explainers (50-59 s, narrated). Every beat is a drawn animation, not a text card."""
import math, os, random
import numpy as np
from PIL import Image, ImageDraw
from scripts.common import *
from motion import *
import motion, voice, assets

PH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "assets")
def photo(name, w, h, lt, dur, z0=1.0, z1=1.18, pan=(0, 0), rad=36, img=None, a=1.0, x=540, y=800):
    """A photo card with a Ken Burns move and rounded corners."""
    key = ("ph", name, w, h)
    if key not in motion._bg_cache:
        im = Image.open(os.path.join(PH, name) if not name.startswith("/") else name).convert("RGB"); s = max(w * 1.4 / im.width, h * 1.4 / im.height)
        motion._bg_cache[key] = im.resize((int(im.width * s), int(im.height * s)), Image.LANCZOS)
    big = motion._bg_cache[key]; k = lerp(z0, z1, clamp(lt / dur)); cw, ch = w / k * (big.width / (w * 1.4)) * 1.4 / 1.4, h / k * (big.height / (h * 1.4)) * 1.4 / 1.4
    cw, ch = big.width / 1.4 / k, big.height / 1.4 / k
    cx = big.width / 2 + pan[0] * (lt / dur - .5) * 80; cy = big.height / 2 + pan[1] * (lt / dur - .5) * 80
    crop = big.crop((int(cx - cw / 2), int(cy - ch / 2), int(cx + cw / 2), int(cy + ch / 2))).resize((w, h), Image.BILINEAR)
    m = Image.new("L", (w, h), 0); ImageDraw.Draw(m).rounded_rectangle([0, 0, w - 1, h - 1], rad, fill=int(255 * a))
    return crop, m

def dots_grid(img, cx, cy, gw, gh, cols, rows, t, spread=1.0, rad=5, wave=1.4, hue=0):
    c0 = (cx, cy); n = 0
    for j in range(rows):
        for i in range(cols):
            fx, fy = (i - (cols - 1) / 2) / cols, (j - (rows - 1) / 2) / rows
            d = math.hypot(fx, fy * .8); u = t - d * wave
            if u <= 0: continue
            sc = pop(u / .4); x = cx + fx * gw * spread; y = cy + fy * gh * spread
            col = mix((255, 190, 70), (255, 110, 110), (fx + .5)) if hue == 0 else mix((120, 200, 255), (160, 120, 255), (fy + .5))
            rr = rad * sc * (.6 + .4 * spread); ImageDraw.Draw(img).ellipse([x - rr, y - rr, x + rr, y + rr], fill=ink(col))

# ------------------------------------------------------------------ 185 everyone jumps
def everyone_jumps():
    la = wiki_la()
    def hook(img, lt, p, b):
        e = eio(seg(lt, 0, 1.4)); cy = lerp(1900, 1020, e); earth(img, 540, cy, 300 + 20 * p)
        for k in range(3):
            u = (lt * .8 + k / 3) % 1; ring(img, 540, cy, 310 + u * 520, 4, (140, 200, 255), (1 - u) * .6)
        for i, (s, y, col) in enumerate((("EVERYONE", 290, WHITE), ("JUMPS", 465, (255, 214, 0)))):
            tx(img, s, 540, y, 150, "black", col, a=clamp((lt - .3 - i * .25) / .15), scale=pop((lt - .3 - i * .25) / .4), stroke=0)
        tx(img, "at the exact same time", 540, 610, 52, "bold", (200, 220, 255), a=clamp((lt - 1.4) / .3))
    def eight(img, lt, p, b):
        v = 8_000_000_000 * eio(seg(lt, .1, 1.3)); tx(img, f"{v:,.0f}", 540, 330, 118, "black", (255, 214, 0), scale=1.0)
        tx(img, "people", 540, 450, 70, "bold", WHITE, a=clamp(lt / .4))
        dots_grid(img, 540, 900, 820, 620, 40, 30, lt, 1.0, 5.5)
        tx(img, "each dot ≈ 6 million people", 540, 1290, 38, "bold", (190, 205, 240), a=clamp((lt - .8) / .4))
    def fitla(img, lt, p, b):
        crop, m = photo(la, 920, 520, lt, b.dur, 1.0, 1.2, (1, 0)); img.paste(crop, (80, 220), m)
        tx(img, "LOS ANGELES", 330, 520, 60, "black", WHITE, a=clamp((lt - b.at("Los", default=.5)) / .3), shadow=True)
        e = eio(seg(lt, .2, 1.8)); box(img, 150, 830, 930, 1210, 28, (20, 30, 70), .85, outline=(255, 214, 0), ow=3)
        dots_grid(img, 540, 1020, 760, 330, 52, 22, 3, spread=lerp(1.0, .22, e) if False else 1.0, rad=4.2)
        tx(img, "ALL of humanity: ~1,300 km²", 540, 1260, 44, "black", (255, 214, 0), a=clamp((lt - b.at("humanity", default=1.4)) / .3))
    def skyline(img, lt, p, b, sky=((255, 150, 90), (60, 30, 110))):
        base = vgrad(sky[1], sky[0], key=("sky", sky)); img.paste(base)
        r = np.random.RandomState(5); x = -20
        while x < 1100:
            w = int(r.randint(70, 150)); h = int(r.randint(260, 760)); d = ImageDraw.Draw(img); d.rectangle([x, 1100 - h, x + w, 1300], fill=(26, 18, 52))
            for yy in range(1100 - h + 20, 1280, 46):
                for xx in range(x + 12, x + w - 12, 28):
                    if r.rand() > .55: d.rectangle([xx, yy, xx + 10, yy + 18], fill=(255, 205, 120))
            x += w + 6
    def crowd(img, lt, p, b, jump_at=None, jump_dur=.45, sink=0):
        rows = [(1230, 130, 15, (255, 214, 90)), (1330, 180, 11, (255, 140, 110)), (1450, 250, 8, (150, 200, 255))]
        for ri, (feet, h, n, col) in enumerate(rows):
            for k in range(n):
                x = (k + .5) * (CW / n) + 30 * math.sin(k * 2.3 + ri); bob = abs(math.sin(lt * 3 + k * .7 + ri)) * 8; jmp = 0; sq = 1.0
                if jump_at is not None:
                    u = lt - jump_at
                    if -.25 < u < 0: sq = lerp(1, .82, eio((u + .25) / .25))
                    elif 0 <= u < jump_dur: jmp = h * .9 * 4 * (u / jump_dur) * (1 - u / jump_dur); sq = 1.12
                person(img, x, feet - bob - 0, h, col, squash=sq, jump=jmp)
    def crowd_beat(img, lt, p, b): skyline(img, lt, p, b); crowd(img, lt, p, b)
    def countjump(img, lt, p, b):
        skyline(img, lt, p, b); T = b.at("Jump", default=2.0)
        crowd(img, lt, p, b, jump_at=T)
        starts_ = [b.at("Three", default=0), b.at("Two", default=.55), b.at("One", default=1.1)]
        for i, s in enumerate(("3", "2", "1")):
            u = lt - starts_[i]
            if 0 <= u < .55: tx(img, s, 540, 520, 420, "black", (255, 255, 255), a=1 - u / .55 * .5, scale=1.3 - .3 * eio(u / .55)); ring(img, 540, 520, 120 + u * 500, 6, (255, 214, 0), (1 - u / .55) * .8)
        if lt >= T: tx(img, "JUMP!", 540, 520, 230, "black", (255, 214, 0), scale=pop((lt - T) / .3), a=1 - clamp((lt - T - 1.2) / .5))
        if T <= lt < T + .12: img.paste(Image.new("RGB", (CW, CH), WHITE), (0, 0), Image.new("L", (CW, CH), int(180 * (1 - (lt - T) / .12))))
    def side(img, lt, p, b):
        img.paste(vgrad((22, 28, 60), (50, 40, 100), key="side"))
        d = ImageDraw.Draw(img); d.rectangle([0, 1300, CW, CH], fill=(30, 24, 60)); d.line([(0, 1300), (CW, 1300)], fill=(255, 214, 0), width=4)
        for i in range(0, 21, 5):
            y = 1300 - i / 20 * 520; d.line([(130, y), (190, y)], fill=WHITE, width=4); tx(img, f"{i} cm", 105, y, 34, "bold", (200, 210, 240), shadow=False)
        d.line([(190, 780), (190, 1300)], fill=WHITE, width=4)
        T = 1.6; u = (lt % T) / T; hgt = 4 * u * (1 - u) if u < 1 else 0; sq = 1 + .1 * hgt
        for g in range(4, 0, -1):
            ug = u - g * .05
            if 0 < ug < 1: person(img, 560, 1300 - 520 * 4 * ug * (1 - ug) * 1.0, 440, (255, 214, 90), a=.14, squash=1.06)
        person(img, 560, 1300, 440, (255, 214, 90), squash=sq, jump=520 * hgt)
        d.line([(190, 780), (900, 780)], fill=(255, 214, 0), width=3); tx(img, "20 cm", 780, 740, 44, "black", (255, 214, 0))
        box(img, 640, 300, 940, 460, 28, (20, 24, 50), .9, outline=(255, 214, 0), ow=3); tx(img, f"{min(.4, u * .4 / .5 if u < .5 else .4):.2f} s".replace("0.", "0."), 790, 380, 80, "black", WHITE); tx(img, "in the air", 790, 435, 30, "bold", (190, 200, 235))
    def momentum(img, lt, p, b):
        img.paste(vgrad((6, 10, 28), (20, 26, 60), key="mom")); starfield(img, lt)
        earth(img, 540, 1750, 980, glow_a=.35)
        t4 = b.at("four", default=.1); v = 400_000_000_000 * eio(seg(lt, t4, t4 + 1.4)); tx(img, f"{v:,.0f}", 540, 360, 96, "black", (255, 214, 0)); tx(img, "kilograms", 540, 470, 56, "bold", WHITE)
        tl_ = b.at("launched", default=1.8); a = eio(seg(lt, tl_, tl_ + .6)); tx(img, "thrown up at 2 m/s", 540, 580, 56, "black", (150, 220, 255), a=a, scale=pop((lt - tl_) / .4))
        for k in range(14):
            x = 100 + k * 70 + (k % 3) * 8; y0 = 1180 - ((lt * 260 + k * 53) % 520); person(img, x, 1180 - (lt * 260 + k * 53) % 520 * .0 + 0, 70, (255, 214, 90), a=.0)
        for k in range(9):
            u = (lt * .9 + k / 9) % 1; x = 90 + k * 112; line(img, [(x, 1130 - u * 360), (x, 1130 - u * 360 - 70)], 10, (255, 214, 0), 1 - u); line(img, [(x - 20, 1130 - u * 360 - 50), (x, 1130 - u * 360 - 80), (x + 20, 1130 - u * 360 - 50)], 10, (255, 214, 0), 1 - u)
    def mass(img, lt, p, b):
        img.paste(space(lt)); earth(img, 540, 560, 230 + 10 * math.sin(lt * 2))
        tx(img, "Earth weighs", 540, 880, 54, "bold", WHITE, a=clamp(lt / .3))
        z0 = b.at("six", 1, default=.6); z1 = max(z0 + 1.6, b.at("zeros", default=3.0)); grp = int(clamp((lt - z0) / ((z1 - z0) / 8), 0, 8)); s = "6" + "".join(",000" for _ in range(grp))
        parts = s.split(","); l1 = ",".join(parts[:5]); l2 = ",".join(parts[5:])
        tx(img, l1, 540, 980, 74, "black", (255, 214, 0), maxw=1000)
        if l2: tx(img, "," + l2, 540, 1070, 74, "black", (255, 214, 0), maxw=1000)
        if grp >= 8: tx(img, "kilograms", 540, 1160, 50, "bold", WHITE, a=clamp((lt - z1) / .3)); tx(img, "a 6 with 24 zeros", 540, 1235, 44, "bold", (200, 220, 255), a=clamp((lt - z1 - .3) / .3))
    def recoil(img, lt, p, b):
        img.paste(space(lt)); cy = 900 + 3 * math.sin(lt * 40) * clamp(1 - lt / 1.0) if False else 900; earth(img, 540, cy, 300)
        for k in range(7):
            u = (lt * .7 + k / 7) % 1; x = 540 + (k - 3) * 85; y = 380 - 0; line(img, [(x, 250 + u * 120), (x, 330 + u * 120)], 12, (255, 90, 90), 1 - u * .6)
        tx(img, "everyone pushes DOWN", 540, 190, 46, "black", (255, 120, 120), a=clamp(lt / .4))
        tx(img, "Earth gets pushed back", 540, 1260, 52, "bold", WHITE, a=clamp((lt - 1.4) / .4)); th = b.at("hundred", default=1.6); v = 130 * eio(seg(lt, th, th + 1.8))
        tx(img, f"{v:,.0f}", 540, 1090, 130, "black", (255, 214, 0), a=clamp((lt - 1.4) / .3)); tx(img, "femtometers per second", 540, 1190, 50, "bold", (200, 220, 255), a=clamp((lt - 1.6) / .3))
    def scales(img, lt, p, b):
        img.paste(space(lt, (4, 6, 18), (20, 12, 50)))
        names = [("1 meter", "a person's step"), ("1 millimeter", "a grain of salt"), ("1 micrometer", "a bacterium"), ("1 nanometer", "a DNA strand's width"), ("1 picometer", "inside an atom"), ("1 femtometer", "a millionth of a billionth of a meter")]
        for i, (nm, sub) in enumerate(names):
            u = lt - .3 - i * .55
            if u < 0: continue
            sz = 700 * (.78 ** i); box(img, 540 - sz / 2, 780 - sz / 2, 540 + sz / 2, 780 + sz / 2, 30 + i * 4, None, 1.0, outline=mix((90, 160, 255), (255, 214, 0), i / 5), ow=4)
        for i, (nm, sub) in enumerate(names):
            if lt - .3 - i * .55 >= 0 and (i == 5 or lt - .3 - (i + 1) * .55 < 0):
                tx(img, nm, 540, 780, 86 if i < 5 else 84, "black", mix((255, 255, 255), (255, 214, 0), i / 5), scale=pop((lt - .3 - i * .55) / .35)); tx(img, sub, 540, 880, 42, "bold", (200, 215, 255), a=clamp((lt - .3 - i * .55 - .2) / .3))
    def fifty(img, lt, p, b):
        img.paste(space(lt, (4, 6, 18), (20, 12, 50)))
        tx(img, "in 0.4 seconds (slowed down)", 540, 300, 46, "bold", (200, 215, 255))
        x0, x1 = 120, 960; d = ImageDraw.Draw(img); d.line([(x0, 900), (x1, 900)], fill=WHITE, width=4)
        for i in range(0, 51, 5):
            x = x0 + (x1 - x0) * i / 50; d.line([(x, 880), (x, 920)], fill=WHITE, width=3); tx(img, str(i), x, 960, 30, "bold", (190, 200, 235), shadow=False)
        tf = b.at("fifty", default=.6); u = eio(seg(lt, tf - .2, tf + 1.8)); xm = x0 + (x1 - x0) * u; glow(img, xm, 900, 90, (255, 214, 0), .8); disc(img, xm, 900, 22, (255, 214, 0)); earth(img, xm, 640, 110)
        tx(img, f"{50 * u:,.0f} fm", 540, 500, 120, "black", (255, 214, 0)); tx(img, "that's how far Earth moves", 540, 1100, 46, "bold", WHITE, a=clamp((lt - 2.4) / .3))
    def hydrogen(img, lt, p, b):
        img.paste(space(lt, (4, 6, 18), (14, 12, 44)))
        cx, cy = 540, 700; R = 300; glow(img, cx, cy, R * 1.25, (90, 130, 255), .55); disc(img, cx, cy, R, (30, 50, 140), .55, outline=(140, 190, 255), ow=3)
        glow(img, cx, cy, 36, (255, 255, 255), .9); disc(img, cx, cy, 6, (255, 140, 120)); a = lt * 3.2; disc(img, cx + math.cos(a) * R * .8, cy + math.sin(a) * R * .8 * .9, 10, (160, 220, 255)); glow(img, cx + math.cos(a) * R * .8, cy + math.sin(a) * R * .9 * .8, 40, (160, 220, 255), .6)
        line(img, [(cx - R, cy + R + 60), (cx + R, cy + R + 60)], 5, WHITE); tx(img, "one hydrogen atom: 100,000 fm", 540, cy + R + 125, 42, "bold", WHITE)
        u = pop((lt - 1.6) / .5); line(img, [(cx - R, cy + R + 60), (cx - R + 6, cy + R + 60)], 9, (255, 214, 0)); tx(img, "Earth's whole move: 50 fm", 540, cy + R + 190, 42, "black", (255, 214, 0), a=clamp((lt - b.at("hydrogen", default=1.6)) / .3))
        tw_ = b.at("thousand", default=2.6); tx(img, "atom is 2,000× wider", 540, 1320, 78, "black", (255, 255, 255), a=clamp((lt - tw_) / .3), scale=pop((lt - tw_) / .4))
    def calm(img, lt, p, b):
        img.paste(space(lt, (4, 6, 18), (16, 20, 52))); earth(img, 540, 560, 290 - 10 * p)
        tn_ = b.at("doesn't", default=.6) - .15; tx(img, "NOTHING", 540, 1000, 150, "black", WHITE, scale=pop((lt - tn_) / .4), a=clamp((lt - tn_) / .1)); tx(img, "HAPPENS", 540, 1170, 150, "black", (255, 214, 0), scale=pop((lt - tn_ - .4) / .4), a=clamp((lt - tn_ - .4) / .1))
    N = [
     ("What if every single person on Earth jumped at the exact same time?", hook, "whip"),
     ("Eight billion people.", eight, "flash"),
     ("Packed shoulder to shoulder, all of humanity fits inside Los Angeles.", fitla, "zoom"),
     ("Now picture all of them, in one place, ready to jump.", crowd_beat, "whip"),
     (None, countjump, "dip"),
     ("Everyone leaps twenty centimeters, and hangs in the air for four tenths of a second.", side, "whip"),
     ("That's four hundred billion kilograms, launched upward at two meters per second.", momentum, "zoom"),
     ("But the Earth weighs six septillion kilograms. A six, with twenty four zeros.", mass, "whip"),
     ("So Earth gets pushed back, at about a hundred and thirty femtometers per second.", recoil, "flash"),
     ("A femtometer is a millionth of a billionth of a meter.", scales, "zoom"),
     ("In four tenths of a second, the whole planet moves about fifty femtometers.", fifty, "whip"),
     ("A single hydrogen atom is two thousand times wider than that.", hydrogen, "zoom"),
     ("Eight billion people jump, and the Earth doesn't feel a thing.", calm, "dip"),
    ]
    beats = [Beat(n, d, 3.0, cut=c, cues=[(0, "whoosh", .5)], segs=([(0, "Three."), (.75, "Two."), (1.5, "One."), (2.35, "Jump!")] if n is None else None)) if n is not None else Beat(None, d, 3.0, cut=c, cues=[(0, "whoosh", .5)], segs=[(0, "Three."), (.75, "Two."), (1.5, "One."), (2.35, "Jump!")]) for n, d, c in N]
    tj = beats[4].at('Jump', default=2.4); beats[4].min_dur = 4.0; beats[1].min_dur = 2.6; beats[4].shake = [(tj, 16, .5)]; beats[4].cues += [(tj, 'boom', .9)] + [(beats[4].at(w, default=0), 'tick', .8) for w in ('Three', 'Two', 'One')]; z0_ = beats[7].at('six', 1, default=.6); z1_ = max(z0_ + 1.6, beats[7].at('zeros', default=3.0)); beats[7].cues += [(z0_ + (z1_ - z0_) / 8 * k, 'tick', .5) for k in range(1, 9)]
    return Reel("185_everyone_jumps", beats, style="cine", seed=185, snap=False, grid=4, safe_zone=False, vo=[(i, n) for i, (n, d, c) in enumerate(N) if n], title="what if everyone on earth jumped at once",
        caption="8 billion people jump and the planet moves 50 femtometers. send this to the person who says they're 'shaking things up'", story="Narrated motion-graphics explainer. Math: 8e9 people x 50 kg = 4e11 kg thrown up at ~2 m/s (20 cm jump) = 8e11 kg m/s; Earth 6e24 kg so recoil 1.3e-13 m/s = 130 fm/s; airtime 0.4 s so displacement ~5e-14 m = 50 fm; hydrogen atom ~1e-10 m = 100,000 fm, about 2,000x wider.")

def wiki_la():
    for f in os.listdir(PH):
        pass
    return "02ced106c7375709.jpg"

REELS = dict(everyone_jumps=everyone_jumps)
