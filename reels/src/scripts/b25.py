"""Batch 25: more narrated motion-graphics explainers."""
import math, os, json
import numpy as np
from PIL import Image, ImageDraw
from scripts.common import *
from motion import *
import motion, voice, assets
from scripts.b24 import photo, PH

_J = None
FALLBACK = {"Cristiano Ronaldo": [("777a62b64c174ced.jpg", ""), ("24daecc778cda0d0.jpg", "")], "Elon Musk": [("302eb83db4b747e6.jpg", "")], "Statue of Liberty": [("b24ff474a6b86dbe.jpg", "")], "Burj Khalifa": [("7e4531a507366735.jpg", "")], "Blue whale": [("6523252f04e1107c.jpg", "")]}
def wimg(title, k=0):
    global _J
    if title in FALLBACK and (_J is None or title not in _J): return FALLBACK[title][k][0]
    if _J is None:
        _J = json.load(open("/tmp/claude-0/-home-user-sorry-posts/aeda3cd8-6be4-5731-8b3d-d9639f60d4f0/scratchpad/assets_b2.json")) if os.path.exists("/tmp/claude-0/-home-user-sorry-posts/aeda3cd8-6be4-5731-8b3d-d9639f60d4f0/scratchpad/assets_b2.json") else {}
        for f, c in json.load(open(os.path.join(PH, "credits.json"))).items(): pass
    return _J[title][k][0]

def credit_of(fname): return json.load(open(os.path.join(PH, "credits.json"))).get(fname, {}).get("credit", "")

def sky_color(alt_m):
    k = clamp(alt_m / 90000.0); return mix((120, 190, 255), (4, 6, 20), eio(k) ** .8)

def bill(img, cx, cy, w, h, rot=0, a=1.0):
    L = Image.new("RGBA", (w + 10, h + 10), (0, 0, 0, 0)); d = ImageDraw.Draw(L)
    d.rounded_rectangle([5, 5, w + 5, h + 5], 10, fill=(176, 205, 160, 255), outline=(60, 100, 70, 255), width=5)
    d.rounded_rectangle([5 + w * .04, 5 + h * .08, 5 + w * .96, 5 + h * .92], 6, outline=(70, 115, 80, 255), width=3)
    d.ellipse([5 + w * .34, 5 + h * .14, 5 + w * .66, 5 + h * .86], fill=(150, 185, 140, 255), outline=(70, 115, 80, 255), width=4)
    f = font("black", int(h * .5)); s = "1"; tw = f.getlength(s); d.text((5 + w / 2 - tw / 2, 5 + h * .22), s, font=f, fill=(60, 100, 70, 255))
    fs = font("black", int(h * .22))
    for x, y in ((.1, .14), (.78, .14), (.1, .66), (.78, .66)): d.text((5 + w * x, 5 + h * y), "1", font=fs, fill=(60, 100, 70, 255))
    paste(img, L, cx, cy, rot=rot, alpha=a)

def stage_scene(img, lt, b, H, span, unit, refs, hud_money, top_alt=0, cards=(), ground=1330, topy=430, col_x=330, label=None):
    """Vertical stack growing to height H (m) in a view of `span` metres."""
    img.paste(Image.new("RGB", (CW, CH), sky_color(0)))
    # gradient sky to altitude `span`
    arr = np.zeros((CH, 1, 3), dtype=np.uint8)
    for y in range(CH):
        alt = max(0, (ground - y) / (ground - topy) * span); arr[y, 0] = sky_color(alt + top_alt)
    sk = Image.fromarray(np.repeat(arr, CW, axis=1)); img.paste(sk)
    if span > 20000: starfield(img, lt, 6)
    d = ImageDraw.Draw(img); d.rectangle([0, ground, CW, CH], fill=(24, 40, 30)); d.line([(0, ground), (CW, ground)], fill=(255, 255, 255), width=3)
    g = eio(seg(lt, .3, 2.4)); hh = H * g; ytop = ground - (ground - topy) * (hh / span)
    # ruler
    step = 10 ** math.floor(math.log10(span / 4)); 
    for k in range(0, int(span / step) + 1):
        y = ground - (ground - topy) * (k * step / span)
        if y < 160: break
        d.line([(60, y), (110, y)], fill=WHITE, width=3); v = k * step; txt = f"{v:g} {unit}" if v < 1000 or unit != "m" else f"{v / 1000:g} km"
        tx(img, txt, 60, y - 26, 28, "bold", (235, 240, 255), shadow=False, maxw=300, align="left") if False else tx(img, txt, 150, y, 28, "bold", (235, 240, 255), shadow=False)
    # stack column
    x0 = col_x - 60; x1 = col_x + 60; box(img, x0, ytop, x1, ground, 10, (84, 160, 96), 1.0, outline=(40, 100, 60), ow=3)
    for yy in range(int(ytop) + 6, ground, 12): d.line([(x0 + 4, yy), (x1 - 4, yy)], fill=(70, 140, 84), width=1)
    glow(img, col_x, ytop, 90, (255, 255, 160), .5 * (1 if g < 1 else .6))
    for name, alt, color in refs:
        y = ground - (ground - topy) * (alt / span)
        if y < 150: continue
        on = hh >= alt * .99; u = clamp((lt - 2.0) / .4) if on else .35
        for xx in range(x1 + 10, CW - 40, 34): d.line([(xx, y), (xx + 18, y)], fill=color, width=4)
        tx(img, name, 760, y - 34, 34, "black", color, a=u)
    for name, w_, h_, x, y, zc in cards:
        a = clamp((lt - 1.2) / .5); crop, m = photo(name, w_, h_, lt, b.dur, 1.0, 1.1); 
        if a > 0:
            m = m.point(lambda v: int(v * a)); img.paste(crop, (int(x - w_ / 2), int(y - h_ / 2)), m)
    # HUD
    tx(img, hud_money, 540, 250, 118, "black", (255, 255, 255)); tx(img, label(hh) if label else f"{hh:,.0f} {unit}", 540, 360, 74, "black", (255, 214, 0))

def billion_stack():
    def hook(img, lt, p, b):
        img.paste(vgrad((8, 40, 24), (4, 14, 10), key="hookg")); 
        for k in range(40):
            u = (lt * .35 + k * .173) % 1; x = (k * 97) % CW; y = -150 + u * (CH + 300); bill(img, x, y, 220, 100, rot=math.sin(k + lt) * 30, a=.85)
        tx(img, "$1,000,000,000", 540, 640, 96, "black", (255, 255, 255), scale=pop(lt / .5), maxw=1000); tx(img, "in one dollar bills", 540, 800, 64, "bold", (255, 214, 0), a=clamp((lt - .5) / .3))
        tx(img, "stacked on top of each other", 540, 900, 50, "bold", WHITE, a=clamp((lt - .9) / .3))
    def thin(img, lt, p, b):
        img.paste(vgrad((10, 40, 28), (4, 18, 12), key="thin")); k = eio(seg(lt, 0, 1.2)); z = lerp(1, 5, k)
        bill(img, 540, 900, int(620), int(280), 0); 
        d = ImageDraw.Draw(img); 
        e = eio(seg(lt, 1.0, 2.2)); w = int(lerp(620, 900, e)); h = max(6, int(lerp(280, 12, e)))
        if e > 0: img.paste(vgrad((10, 40, 28), (4, 18, 12), key="thin").crop((0, 0, CW, CH)))
        bx0 = 540 - w // 2; d = ImageDraw.Draw(img)
        if e < 1: bill(img, 540, 900, w if False else 620, int(lerp(280, 40, e)), 0)
        else: d.rounded_rectangle([540 - 310, 900 - 8, 540 + 310, 900 + 8], 6, fill=(176, 205, 160), outline=(60, 100, 70), width=3)
        if e > .9:
            d.line([(540 + 330, 892), (540 + 330, 908)], fill=(255, 214, 0), width=5); tx(img, "0.11 mm", 540, 1040, 110, "black", (255, 214, 0), scale=pop((lt - 2.2) / .4))
            tx(img, "thinner than a fingernail", 540, 1140, 46, "bold", WHITE, a=clamp((lt - 2.8) / .3))
    def mk(H, span, unit, refs, money, cards, label=None, top_alt=0):
        return lambda img, lt, p, b: stage_scene(img, lt, b, H, span, unit, refs, money, top_alt, cards, label=label)
    W1 = wimg("Statue of Liberty"); W2 = wimg("Burj Khalifa"); W3 = wimg("Mount Everest"); W4 = wimg("Boeing 747")
    s100 = lambda img, lt, p, b: stage_scene(img, lt, b, 1.1, 2.0, "cm", [], "$100", label=lambda h: f"{h:.1f} cm")
    sM = mk(109, 130, "m", [("Statue of Liberty: 93 m", 93, (255, 214, 0))], "$1 million", [(W1, 340, 380, 800, 1060, 0)], label=lambda h: f"{h:,.0f} m")
    s10M = mk(1090, 1300, "m", [("Burj Khalifa: 828 m", 828, (255, 214, 0))], "$10 million", [(W2, 340, 380, 800, 1060, 0)], label=lambda h: f"{h / 1000:.2f} km")
    s100M = mk(10900, 13000, "m", [("Mount Everest: 8.8 km", 8849, (255, 214, 0)), ("airliners cruise: ~11 km", 10900, (255, 140, 120))], "$100 million", [(W3, 340, 340, 800, 1070, 0)], label=lambda h: f"{h / 1000:.1f} km")
    s1B = mk(109000, 130000, "m", [("edge of space: 100 km", 100000, (255, 214, 0))], "$1 billion", [], label=lambda h: f"{h / 1000:.0f} km")
    def whale(img, lt, p, b):
        img.paste(vgrad((10, 30, 70), (4, 14, 40), key="whale")); crop, m = photo(wimg("Blue whale") if False else "6523252f04e1107c.jpg", 940, 520, lt, b.dur, 1.0, 1.15); img.paste(crop, (70, 240), m)
        v = 1000 * eio(seg(lt, .2, 1.6)); tx(img, f"{v:,.0f} tons", 540, 880, 130, "black", (255, 214, 0)); tx(img, "≈ 7 blue whales of paper", 540, 1000, 56, "bold", WHITE, a=clamp((lt - 1.6) / .3))
    def spend(img, lt, p, b):
        img.paste(vgrad((14, 30, 24), (6, 12, 14), key="spend")); tx(img, "spend $1 every second", 540, 300, 70, "black", WHITE, maxw=1000)
        y_ = 31.7 * eio(seg(lt, .4, b.dur - .8)); tx(img, f"{y_:.1f}", 540, 640, 260, "black", (255, 214, 0)); tx(img, "years to spend one billion", 540, 840, 54, "bold", WHITE, a=clamp((lt - 1.0) / .3))
        for k in range(32): disc(img, 90 + (k % 16) * 58, 1000 + (k // 16) * 62, 20, (255, 214, 0) if k < y_ else (70, 90, 80))
    def elon(img, lt, p, b):
        img.paste(vgrad((14, 10, 30), (6, 8, 22), key="elon")); starfield(img, lt)
        crop, m = photo(wimg("Elon Musk"), 520, 520, lt, b.dur, 1.0, 1.15); img.paste(crop, (80, 240), m); 
        tx(img, "$839 billion", 790, 420, 70, "black", (255, 214, 0), maxw=420); tx(img, "= 839 of these stacks", 790, 560, 44, "bold", WHITE, maxw=420, a=clamp((lt - .8) / .3))
        v = 839 * eio(seg(lt, .5, 2.0)); tx(img, f"{v:,.0f}", 540, 1000, 190, "black", WHITE); tx(img, "billion-dollar stacks", 540, 1130, 54, "bold", (255, 214, 0), a=clamp((lt - 1.6) / .3))
    def moon(img, lt, p, b):
        img.paste(space(lt)); u = eio(seg(lt, .4, 3.4)); earth(img, 200, 1000, 110); mx = 880; disc(img, mx, 1000, 52, (210, 210, 220), 1.0); glow(img, mx, 1000, 120, (200, 210, 255), .35)
        x2 = 200 + 110 + (mx - 200 - 110) * .238 * u * 4.2 / 4.2; line(img, [(310, 1000), (310 + (mx - 52 - 310) * .238 * u, 1000)], 10, (255, 214, 0)); 
        tx(img, f"{91000 * u:,.0f} km", 540, 640, 130, "black", (255, 214, 0)); tx(img, "24% of the way to the Moon", 540, 760, 54, "bold", WHITE, a=clamp((lt - 2.8) / .3)); tx(img, "or 2 trips around the Earth", 540, 830, 46, "bold", (200, 220, 255), a=clamp((lt - 3.4) / .3))
    N = [
     ("What if you stacked one billion dollars, in one dollar bills?", hook, "whip"),
     ("A single bill is about a tenth of a millimeter thick.", thin, "flash"),
     ("A hundred of them make a stack about one centimeter tall.", s100, "zoom"),
     ("One million dollars is a hundred and nine meters. Taller than the Statue of Liberty.", sM, "whip"),
     ("Ten million, over a kilometer. Taller than the Burj Khalifa.", s10M, "zoom"),
     ("A hundred million is almost eleven kilometers. Higher than Mount Everest, right where airliners cruise.", s100M, "whip"),
     ("And one billion dollars? A hundred and nine kilometers. Past the official edge of space.", s1B, "flash"),
     ("It would also weigh about a thousand tons. Seven blue whales, made of paper.", whale, "whip"),
     ("Spend one dollar every second, and a billion dollars lasts you thirty one years.", spend, "flash"),
     ("Elon Musk is worth about eight hundred thirty nine of those.", elon, "zoom"),
     ("Stacked up, that's ninety one thousand kilometers. Nearly a quarter of the way to the Moon.", moon, "whip"),
    ]
    beats = [Beat(n, d, 3.0, cut=c, cues=[(0, "whoosh", .5)]) for n, d, c in N]
    for i in (3, 4, 5, 6): beats[i].cues += [(2.2, "hit", .8)]
    beats[2].min_dur = 3.2
    return Reel("186_billion_stack", beats, style="synth", seed=186, snap=False, grid=4, safe_zone=False, vo=[(i, n) for i, (n, d, c) in enumerate(N)], title="what if you stacked $1 billion in ones",
        caption="a billion dollars in one dollar bills is 109 km tall. that's past the edge of space. tag the guy who says 'it's just a billion'", story="Math: a US bill is 0.0043 in = 0.109 mm. 100 bills = 1.1 cm; 1e6 = 109 m (Statue of Liberty 93 m); 1e7 = 1.09 km (Burj Khalifa 828 m); 1e8 = 10.9 km (Everest 8.85 km; airliners cruise ~10-12 km); 1e9 = 109 km (Karman line 100 km). A bill weighs about 1 g so 1e9 g = 1,000 t (blue whale ~150 t). Musk $839B (Forbes 2026) = 839 stacks = 91,500 km = 2.3 Earth circumferences = 24% of Earth-Moon distance (384,400 km).")

REELS = dict(billion_stack=billion_stack)
