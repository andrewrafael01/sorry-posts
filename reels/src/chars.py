"""Blocky 3D-ish characters and flat scene backgrounds."""
import math
from PIL import Image, ImageDraw
from engine import *

SKINS = {"light": rgb("f2c9a0"), "tan": rgb("d9a273"), "brown": rgb("a8683f"), "dark": rgb("6e4228"), "pale": rgb("f7dcc0")}
HAIRS = {"black": rgb("221510"), "brown": rgb("4a2c1a"), "blond": rgb("d9b25c"), "red": rgb("b5502a"),
         "grey": rgb("9a9aa0"), "white": rgb("e8e8e8"), "pink": rgb("e87aa8"), "blue": rgb("3f6fd0")}

def C(shirt, pants="283050", skin="light", hair="brown", style="short", glasses=None, extra=None):
    return dict(shirt=rgb(shirt), pants=rgb(pants), skin=SKINS[skin], hair=HAIRS[hair], style=style,
                glasses=glasses, extra=extra)

DEP = 14
def cube(d, x, y, w, h, col, dep=DEP, top=True, side=True):
    if top: d.polygon([(x, y), (x + dep, y - dep), (x + w + dep, y - dep), (x + w, y)], fill=shade(col, 1.18))
    if side: d.polygon([(x + w, y), (x + w + dep, y - dep), (x + w + dep, y + h - dep), (x + w, y + h)], fill=shade(col, .78))
    d.rectangle([x, y, x + w, y + h], fill=col)

def limb(d, px, py, ang, length, width, col, hand=None, hl=30, left=False):
    a = math.radians(ang)
    dx, dy = (-math.sin(a), math.cos(a)) if left else (math.sin(a), math.cos(a))
    nx, ny = -dy, dx
    def quad(l0, l1, c):
        pts = [(px + dx * l0 + nx * width / 2, py + dy * l0 + ny * width / 2), (px + dx * l1 + nx * width / 2, py + dy * l1 + ny * width / 2),
               (px + dx * l1 - nx * width / 2, py + dy * l1 - ny * width / 2), (px + dx * l0 - nx * width / 2, py + dy * l0 - ny * width / 2)]
        d.polygon(pts, fill=c)
    quad(0, length - (hl if hand else 0), col)
    if hand: quad(length - hl, length, hand)

def draw_char(spec, t, pose="idle", expr="smile", s=2.0, flip=False, jump=0.0, talk=False, seed=0, look=0.0, squash=0.0):
    """Returns (RGBA layer, anchor) with feet-centre at anchor."""
    k = s * 1.4
    LW, LH, AX, AY = 420, 470, 210, 450
    L = Image.new("RGBA", (int(LW * k), int(LH * k)), (0, 0, 0, 0))
    d = ImageDraw.Draw(L)
    X = lambda v: (AX + v) * k
    Y = lambda v: (AY + v) * k
    ph = t * 2 * math.pi
    bob = math.sin(ph * 0.9 + seed) * 3
    lang = rang = 4 + math.sin(ph * .8 + seed) * 3
    lleg = rleg = 0
    hy = 0
    if pose == "walk":
        sw = math.sin(ph * 1.6) * 26; lleg, rleg = sw, -sw; lang, rang = -sw * .8, sw * .8; bob = abs(math.sin(ph * 1.6)) * -8
    elif pose == "wave": rang = 150 + math.sin(ph * 2.5) * 22
    elif pose == "point": rang = 92
    elif pose == "shock": lang = rang = 140 + math.sin(ph * 4) * 5; bob = math.sin(ph * 6) * 2
    elif pose == "flex": lang = rang = 70 + math.sin(ph * 1.5) * 10
    elif pose == "cheer": lang = rang = 160 + math.sin(ph * 3) * 14; bob = -abs(math.sin(ph * 1.5)) * 10
    elif pose == "talk":
        lang = 8 + math.sin(ph * 1.7 + 1) * 10; rang = 20 + abs(math.sin(ph * 2.2)) * 55
    elif pose == "shrug": lang = rang = 55 + math.sin(ph * 1.2) * 4
    elif pose == "hands_up": lang = rang = 110
    elif pose == "slump": lang = rang = 2; hy = 8; bob = 6
    elif pose == "run":
        sw = math.sin(ph * 3) * 40; lleg, rleg = sw, -sw; lang, rang = -sw * 1.1, sw * 1.1; bob = abs(math.sin(ph * 3)) * -14
    bob -= jump
    sh, pa, sk = spec["shirt"], spec["pants"], spec["skin"]
    hair = spec["hair"]
    # --- hair behind head (long styles)
    if spec["style"] in ("long", "bob"):
        ln = 120 if spec["style"] == "long" else 70
        d.rectangle([X(-54), Y(-318 + bob + hy), X(54), Y(-318 + ln + bob + hy)], fill=shade(hair, .85))
    # --- legs (hip pivot)
    hipy = -100 + bob
    limb(d, X(-24), Y(hipy), lleg, 100 * k, 40 * k, pa, None, left=True)
    limb(d, X(24), Y(hipy), rleg, 100 * k, 40 * k, pa, None)
    # shoes
    for sx, ang in ((-24, lleg), (24, rleg)):
        a = math.radians(ang); ex = sx + (-math.sin(a) if sx < 0 else math.sin(a)) * 100; ey = hipy + math.cos(a) * 100
        d.rectangle([X(ex - 21), Y(ey - 14), X(ex + 21), Y(ey)], fill=rgb("f2f2f2"))
    # --- torso
    cube(d, X(-56), Y(-222 + bob), 112 * k, 124 * k, sh)
    ex = spec.get("extra")
    if ex == "stripe": d.rectangle([X(-56), Y(-170 + bob), X(56), Y(-150 + bob)], fill=shade(sh, 1.45))
    elif ex == "vest": d.rectangle([X(-56), Y(-222 + bob), X(-18), Y(-98 + bob)], fill=shade(sh, .7)); d.rectangle([X(18), Y(-222 + bob), X(56), Y(-98 + bob)], fill=shade(sh, .7))
    elif ex == "tie": d.polygon([(X(-8), Y(-222 + bob)), (X(8), Y(-222 + bob)), (X(12), Y(-150 + bob)), (X(0), Y(-130 + bob)), (X(-12), Y(-150 + bob))], fill=rgb("c0392b"))
    elif ex == "hoodie": d.rectangle([X(-50), Y(-222 + bob), X(50), Y(-212 + bob)], fill=shade(sh, .75)); d.rectangle([X(-26), Y(-150 + bob), X(26), Y(-110 + bob)], outline=shade(sh, .75), width=int(3 * k))
    # --- arms
    limb(d, X(-62), Y(-210 + bob), lang, 104 * k, 34 * k, sh, sk, 30 * k, left=True)
    limb(d, X(62), Y(-210 + bob), rang, 104 * k, 34 * k, sh, sk, 30 * k)
    # --- head
    hx, hyy = -48, -318 + bob + hy
    cube(d, X(hx), Y(hyy), 96 * k, 98 * k, sk)
    st = spec["style"]
    d.polygon([(X(hx), Y(hyy)), (X(hx + DEP), Y(hyy - DEP)), (X(hx + 96 + DEP), Y(hyy - DEP)), (X(hx + 96), Y(hyy))], fill=shade(hair, 1.12))
    if st != "bald":
        d.rectangle([X(hx), Y(hyy), X(hx + 96), Y(hyy + (30 if st != "cap" else 22))], fill=hair)
        d.polygon([(X(hx + 96), Y(hyy)), (X(hx + 96 + DEP), Y(hyy - DEP)), (X(hx + 96 + DEP), Y(hyy + 24 - DEP)), (X(hx + 96), Y(hyy + 30))], fill=shade(hair, .75))
    if st == "bun": d.ellipse([X(-22), Y(hyy - 40), X(22), Y(hyy - 2)], fill=hair)
    if st == "cap":
        capc = spec.get("cap", rgb("c0392b"))
        d.rectangle([X(hx - 2), Y(hyy - 6), X(hx + 98), Y(hyy + 24)], fill=capc)
        d.polygon([(X(hx - 14), Y(hyy + 22)), (X(hx + 110), Y(hyy + 22)), (X(hx + 118), Y(hyy + 36)), (X(hx - 22), Y(hyy + 36))], fill=shade(capc, .8))
    if st == "beanie":
        capc = spec.get("cap", rgb("2d6a4f"))
        d.rectangle([X(hx - 3), Y(hyy - 8), X(hx + 99), Y(hyy + 34)], fill=capc); d.rectangle([X(hx - 3), Y(hyy + 26), X(hx + 99), Y(hyy + 36)], fill=shade(capc, .8))
    # --- face
    ey = hyy + 56
    blink = (t * 0.7 + seed) % 3.4 < .1
    dark = rgb("1a1412")
    if spec["glasses"] == "sun" or expr == "cool":
        d.rectangle([X(-38), Y(ey - 12), X(38), Y(ey + 8)], fill=dark)
    else:
        if expr in ("shock", "sweat", "worried"):
            for sx in (-22, 22):
                d.ellipse([X(sx - 13), Y(ey - 14), X(sx + 13), Y(ey + 12)], fill=WHITE, outline=dark, width=int(2 * k))
                d.ellipse([X(sx - 5 + look * 7), Y(ey - 6), X(sx + 5 + look * 7), Y(ey + 4)], fill=dark)
        elif expr == "sleepy" or blink:
            for sx in (-22, 22): d.rectangle([X(sx - 10), Y(ey), X(sx + 10), Y(ey + 4)], fill=dark)
        else:
            for sx in (-22, 22):
                d.rectangle([X(sx - 7 + look * 6), Y(ey - 9), X(sx + 7 + look * 6), Y(ey + 9)], fill=dark)
        if spec["glasses"] == "round":
            for sx in (-22, 22): d.ellipse([X(sx - 18), Y(ey - 17), X(sx + 18), Y(ey + 17)], outline=rgb("2a2a2a"), width=int(4 * k))
            d.line([X(-4), Y(ey), X(4), Y(ey)], fill=rgb("2a2a2a"), width=int(4 * k))
    if expr == "angry":
        d.line([X(-36), Y(ey - 22), X(-10), Y(ey - 12)], fill=dark, width=int(7 * k)); d.line([X(36), Y(ey - 22), X(10), Y(ey - 12)], fill=dark, width=int(7 * k))
    if expr == "worried" or expr == "sad":
        d.line([X(-36), Y(ey - 12), X(-10), Y(ey - 24)], fill=dark, width=int(6 * k)); d.line([X(36), Y(ey - 12), X(10), Y(ey - 24)], fill=dark, width=int(6 * k))
    my = ey + 24
    mouth_open = talk and (math.sin(t * 14 + seed) > -.2)
    if expr in ("shock", "scream"):
        d.ellipse([X(-11), Y(my - 4), X(11), Y(my + 22)], fill=dark)
    elif mouth_open or expr == "talk":
        d.rounded_rectangle([X(-16), Y(my - 2), X(16), Y(my + 14 + (6 if mouth_open else 0))], int(6 * k), fill=dark)
        d.rectangle([X(-12), Y(my - 2), X(12), Y(my + 4)], fill=WHITE)
    elif expr in ("sad", "worried"):
        d.arc([X(-18), Y(my), X(18), Y(my + 24)], 200, 340, fill=dark, width=int(5 * k))
    elif expr == "smirk":
        d.line([X(-14), Y(my + 8), X(18), Y(my + 2)], fill=dark, width=int(5 * k))
    elif expr == "angry":
        d.line([X(-16), Y(my + 8), X(16), Y(my + 8)], fill=dark, width=int(6 * k))
    else:
        d.pieslice([X(-18), Y(my - 8), X(18), Y(my + 18)], 0, 180, fill=dark)
        d.rectangle([X(-13), Y(my - 2), X(13), Y(my + 2)], fill=WHITE)
    if expr in ("sweat", "worried"):
        sx, sy = 56, hyy + 22 + (t * 40 % 30)
        d.polygon([(X(sx), Y(sy - 14)), (X(sx + 8), Y(sy)), (X(sx - 8), Y(sy))], fill=rgb("63b3ed")); d.ellipse([X(sx - 8), Y(sy - 6), X(sx + 8), Y(sy + 10)], fill=rgb("63b3ed"))
    if expr == "blush":
        for sx in (-30, 30): d.ellipse([X(sx - 10), Y(ey + 12), X(sx + 10), Y(ey + 24)], fill=(240, 130, 130, 160))
    # downsample
    Ls = L.resize((int(LW * s * (1 + squash * .5)), int(LH * s * (1 - squash))), Image.BILINEAR, reducing_gap=2.0) if squash else L.resize((int(LW * s), int(LH * s)), Image.BILINEAR, reducing_gap=2.0)
    if flip: Ls = Ls.transpose(Image.FLIP_LEFT_RIGHT)
    return Ls, (int(AX * s * (1 + squash * .5)), int(AY * s * (1 - squash)))

_cc = {}
def place_char(img, spec, cx, feet_y, t, **kw):
    # animate "on threes" (15 fps pose updates) and cache: cheaper, and reads as hand-animated
    tq = round(t * 15) / 15
    key = (id(spec), round(tq, 3), tuple(sorted((k, round(v, 2) if isinstance(v, float) else v) for k, v in kw.items())))
    if key not in _cc:
        if len(_cc) > 30: _cc.pop(next(iter(_cc)))
        _cc[key] = draw_char(spec, tq, **kw)
    layer, (ax, ay) = _cc[key]
    img.paste(layer, (int(cx - ax), int(feet_y - ay)), layer)

# ---------------------------------------------------------------- backgrounds
_bg = {}
def emoji_at(img, e, cx, cy, size, alpha=1.0):
    im = emoji_img(e, size)
    if alpha < 1: im = im.copy(); im.putalpha(im.getchannel("A").point(lambda v: int(v * alpha)))
    img.paste(im, (int(cx - im.width / 2), int(cy - im.height / 2)), im)

def vgrad(img, y0, y1, c0, c1):
    d = ImageDraw.Draw(img)
    for y in range(y0, y1):
        d.line([(0, y), (W, y)], fill=tuple(int(lerp(c0[i], c1[i], (y - y0) / max(1, y1 - y0))) for i in range(3)))

GROUND = 1800
def background(kind):
    if kind in _bg: return _bg[kind]
    img = Image.new("RGB", (W, H)); d = ImageDraw.Draw(img)
    def floor(y, col, line=None):
        d.rectangle([0, y, W, H], fill=col)
        if line:
            for x in range(-400, W + 400, 160): d.line([(x, y + 6), (x + (x - W / 2) * .6, H)], fill=line, width=3)
    def wall(c0, c1): vgrad(img, 0, 1500, c0, c1)
    if kind == "gym":
        wall(rgb("c9cfe0"), rgb("bcc3d8")); d.rectangle([0, 1180, W, 1260], fill=rgb("a6aec7")); floor(1500, rgb("3f4455"), rgb("4a5064"))
        for x in (140, 900): d.rectangle([x, 520, x + 130, 640], fill=rgb("e9ecf5"), outline=rgb("9aa2bb"), width=4)
    elif kind == "street" or kind == "parking":
        vgrad(img, 0, 1000, rgb("5ea8f0"), rgb("a9d4f7"))
        for i, (x, w, h, c) in enumerate([(0, 180, 480, "8e9ab8"), (170, 150, 640, "a89f95"), (330, 200, 520, "98a4c0"), (560, 170, 700, "b3a89c"), (720, 210, 560, "8e9ab8"), (920, 200, 640, "a89f95")]):
            col = rgb(c); d.rectangle([x, 1230 - h, x + w, 1230], fill=col)
            for wy in range(1230 - h + 30, 1200, 60):
                for wx in range(x + 18, x + w - 24, 44): d.rectangle([wx, wy, wx + 22, wy + 32], fill=shade(col, .78))
        emoji_at(img, "☁", 250, 190, 200, .9); emoji_at(img, "☁", 800, 120, 240, .85)
        floor(1230, rgb("4a4f5e")); d.rectangle([0, 1218, W, 1240], fill=rgb("9ca3b8"))
        if kind == "parking":
            for x in range(40, W, 200): d.line([(x, 1400), (x - 60, H)], fill=rgb("d9dce6"), width=8)
    elif kind in ("room", "bedroom"):
        wall(rgb("c7b8e0"), rgb("b4a4d6")); floor(1450, rgb("8a6d56")); d.rectangle([0, 1440, W, 1462], fill=rgb("6b5240"))
        d.rectangle([700, 360, 1010, 760], fill=rgb("8fd0ff"), outline=rgb("f2f0ff"), width=14); d.line([(855, 360), (855, 760)], fill=rgb("f2f0ff"), width=10); d.line([(700, 560), (1010, 560)], fill=rgb("f2f0ff"), width=10)
    elif kind == "kitchen":
        wall(rgb("f1e3c2"), rgb("e6d3a8")); floor(1450, rgb("c9b48a")); d.rectangle([0, 1100, W, 1450], fill=rgb("d8dde6")); d.rectangle([0, 1090, W, 1120], fill=rgb("b8bfcc"))
        for x in range(60, W, 300): d.rectangle([x, 380, x + 240, 760], fill=rgb("b58a5b"), outline=rgb("8a6540"), width=6)
    elif kind in ("class", "school"):
        wall(rgb("cfe8d8"), rgb("b9d9c6")); floor(1450, rgb("a98f6a")); d.rectangle([90, 420, 990, 880], fill=rgb("2f5d50"), outline=rgb("8a6a45"), width=16)
        d.text((200, 480), "x² + y² = ?", font=font("bold", 70), fill=rgb("e8f0ea"))
    elif kind == "office":
        wall(rgb("dfe6ef"), rgb("cdd6e3")); floor(1450, rgb("7d8697"), rgb("8a93a4"))
        for x in (80, 600): d.rectangle([x, 460, x + 380, 880], fill=rgb("9fd0f5"), outline=rgb("f4f6fa"), width=12)
    elif kind in ("cafe", "restaurant"):
        wall(rgb("e8c9a0"), rgb("d9b488")); floor(1450, rgb("7a4b32"))
        d.rectangle([60, 520, 560, 980], fill=rgb("1c2347"), outline=rgb("6b4630"), width=16); d.line([(310, 520), (310, 980)], fill=rgb("6b4630"), width=10)
        for (bx, by, bw, bh) in [(90, 760, 50, 220), (150, 700, 60, 280), (220, 800, 45, 180), (330, 740, 55, 240), (400, 690, 70, 290), (480, 790, 50, 190)]:
            d.rectangle([bx, by, bx + bw, by + bh], fill=rgb("2a3560"))
            for wy in range(by + 14, by + bh - 10, 28):
                for wx in range(bx + 8, bx + bw - 10, 20):
                    if (wx * 7 + wy * 3) % 5 < 2: d.rectangle([wx, wy, wx + 8, wy + 12], fill=rgb("ffd77a"))
        for x in (160, 540, 900): d.line([(x, 0), (x, 380)], fill=rgb("3a3a3a"), width=4); d.ellipse([x - 34, 380, x + 34, 440], fill=rgb("ffe9a8")); d.rectangle([x - 22, 362, x + 22, 384], fill=rgb("3a3a3a"))
        d.rectangle([650, 560, 1000, 700], fill=rgb("2b2f3a"), outline=rgb("6b4630"), width=10); d.text((684, 590), "TODAY:", font=font("black", 40), fill=rgb("f5f5f5")); d.text((684, 640), "bread", font=font("bold", 40), fill=rgb("f2c94c"))
    elif kind in ("night", "club"):
        vgrad(img, 0, 1500, rgb("1b1740"), rgb("3b2a6b")); floor(1450, rgb("201a3d"))
        for (x, y, r) in [(120, 200, 6), (400, 120, 4), (700, 260, 5), (940, 140, 6), (260, 420, 4), (820, 480, 4)]: d.ellipse([x - r, y - r, x + r, y + r], fill=rgb("fff6c0"))
        emoji_at(img, "🌙", 880, 260, 220)
    elif kind in ("park", "outside"):
        vgrad(img, 0, 1200, rgb("78c3f5"), rgb("c8ecff")); d.rectangle([0, 1200, W, H], fill=rgb("63b25a")); d.rectangle([0, 1450, W, H], fill=rgb("58a24f"))
        emoji_at(img, "🌳", 200, 1050, 380); emoji_at(img, "🌳", 880, 1010, 440); emoji_at(img, "☁", 520, 260, 260, .9); emoji_at(img, "☀", 900, 160, 200)
    elif kind in ("airport", "mall", "store"):
        wall(rgb("e9eef7"), rgb("d3dcec")); floor(1450, rgb("b9c3d6"), rgb("c6cfe0"))
        for x in range(0, W, 270): d.rectangle([x + 20, 420, x + 250, 900], fill=rgb("a9c8ee"), outline=rgb("f3f6fb"), width=10)
    elif kind == "car":
        vgrad(img, 0, 1100, rgb("4a90e2"), rgb("9fd0f8")); floor(1250, rgb("3a3d4a")); d.line([(0, 1560)  , (W, 1560)], fill=rgb("e8e8e8"), width=8)
    elif kind == "sunset":
        vgrad(img, 0, 1400, rgb("ff8a65"), rgb("ffd180")); floor(1450, rgb("5a4a6a")); emoji_at(img, "🌅", 540, 900, 520, .0)
    elif kind == "plain":
        vgrad(img, 0, H, rgb("c9d3e8"), rgb("aeb9d4"))
    else: raise KeyError(kind)
    if kind not in ("street", "parking", "plain", "park", "outside", "night", "club", "car", "sunset"): pass
    _bg[kind] = img
    return img
