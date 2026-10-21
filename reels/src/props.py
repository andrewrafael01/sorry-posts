"""Hand-drawn blocky props in the same cube style as the characters. prop(name, size, **kw) -> RGBA layer."""
import math
from PIL import Image, ImageDraw
from engine import *
from chars import cube

_pc = {}
def _canvas(w, h, ss=2): return Image.new("RGBA", (w * ss, h * ss), (0, 0, 0, 0))
def _fin(L, ss=2): return L.resize((L.width // ss, L.height // ss), Image.LANCZOS)
D = rgb("1d1d22")

def prop(name, size=300, **kw):
    key = (name, size, repr(sorted(kw.items())))
    if key not in _pc:
        if len(_pc) > 400: _pc.clear()
        _pc[key] = globals()["p_" + name](size, **kw)
    return _pc[key]

def p_phone(s, text="", dark=False, color="2b2f3a", sub="", glow=True, app=None):
    w, h = int(s * .5), s; L = _canvas(w + 20, h + 20); d = ImageDraw.Draw(L); k = 2
    d.rounded_rectangle([10 * k, 10 * k, (w + 10) * k, (h + 10) * k], 26 * k, fill=rgb(color))
    sc = (255, 255, 255) if not dark else (20, 20, 24)
    d.rounded_rectangle([18 * k, 20 * k, (w + 2) * k, (h) * k], 18 * k, fill=sc)
    if text:
        tl = text_layer(text, int(w * .16), "bold", (20, 20, 24) if not dark else WHITE, maxw=int(w * .78), align="left", pad=0)
        L.paste(tl.resize((tl.width * k // 1, tl.height * k // 1)) if False else tl.resize((int(tl.width * k), int(tl.height * k))), (int(28 * k), int(60 * k)), tl.resize((int(tl.width * k), int(tl.height * k))))
    d.rounded_rectangle([(w / 2 - 12) * k, 14 * k, (w / 2 + 28) * k, 22 * k], 4 * k, fill=rgb(color))
    return _fin(L)

def p_laptop(s, screen=None, color="9aa3b5"):
    w, h = s, int(s * .72); L = _canvas(w + 30, h + 30); d = ImageDraw.Draw(L); k = 2
    d.rounded_rectangle([int(w * .1) * k, 10 * k, int(w * .9) * k, int(h * .72) * k], 12 * k, fill=rgb("22252d"))
    d.rectangle([int(w * .13) * k, 24 * k, int(w * .87) * k, int(h * .67) * k], fill=rgb(screen or "dbe7ff"))
    d.polygon([(int(w * .02) * k, int(h * .75) * k), (int(w * .98) * k, int(h * .75) * k), (w * k, int(h * .82) * k), (0, int(h * .82) * k)], fill=rgb(color))
    return _fin(L)

def p_mug(s, color="f2f0ea", steam=True):
    w, h = int(s * .8), s; L = _canvas(w + 40, h + 20); d = ImageDraw.Draw(L); k = 2
    d.rounded_rectangle([10 * k, int(h * .25) * k, int(w * .78) * k, h * k], 14 * k, fill=rgb(color))
    d.ellipse([int(w * .62) * k, int(h * .38) * k, (w + 20) * k, int(h * .8) * k], outline=rgb(color), width=int(w * .11) * k)
    d.rounded_rectangle([20 * k, int(h * .3) * k, int(w * .7) * k, int(h * .42) * k], 8 * k, fill=rgb("5a3a28"))
    return _fin(L)

def p_pizza_box(s, open_=False):
    w, h = s, int(s * .5); L = _canvas(w + 30, h + 80); d = ImageDraw.Draw(L); k = 2
    if open_:
        d.polygon([(30 * k, 10 * k), ((w - 20) * k, 10 * k), ((w - 40) * k, int(h * .5) * k), (50 * k, int(h * .5) * k)], fill=rgb("c9a46a"))
        cube(d, 20 * k, int(h * .55) * k + 20 * k, (w - 40) * k, int(h * .5) * k, rgb("d9b57a"), 14 * k)
        d.ellipse([int(w * .22) * k, int(h * .7) * k + 20 * k, int(w * .8) * k, int(h * 1.35) * k], fill=rgb("f4c542"))
        for px, py in [(.35, .85), (.5, 1.0), (.62, .82), (.45, 1.15)]: d.ellipse([int(w * px) * k, int(h * py) * k + 10 * k, int(w * px + 36) * k, int(h * py + 36) * k + 10 * k], fill=rgb("c0392b"))
    else:
        cube(d, 10 * k, 40 * k, w * k, h * k, rgb("d9b57a"), 16 * k); d.rectangle([int(w * .3) * k, 52 * k, int(w * .7) * k, 62 * k], fill=rgb("b08850"))
    return _fin(L)

def p_clock(s, hour=11, minute=0, face="ffffff", rim="2b2f3a"):
    L = _canvas(s + 10, s + 10); d = ImageDraw.Draw(L); k = 2; c = (s / 2 + 5) * k; r = s / 2 * k
    d.ellipse([c - r, c - r, c + r, c + r], fill=rgb(rim)); r2 = r * .9; d.ellipse([c - r2, c - r2, c + r2, c + r2], fill=rgb(face))
    for i in range(12):
        a = i / 12 * 2 * math.pi; x1, y1 = c + math.sin(a) * r2 * .82, c - math.cos(a) * r2 * .82; x2, y2 = c + math.sin(a) * r2 * .95, c - math.cos(a) * r2 * .95
        d.line([x1, y1, x2, y2], fill=rgb(rim), width=3 * k)
    ma = minute / 60 * 2 * math.pi; ha = ((hour % 12) + minute / 60) / 12 * 2 * math.pi
    d.line([c, c, c + math.sin(ha) * r2 * .5, c - math.cos(ha) * r2 * .5], fill=rgb(rim), width=7 * k)
    d.line([c, c, c + math.sin(ma) * r2 * .78, c - math.cos(ma) * r2 * .78], fill=rgb(rim), width=5 * k)
    d.ellipse([c - 7 * k, c - 7 * k, c + 7 * k, c + 7 * k], fill=rgb("e63946"))
    return _fin(L)

def p_sign(s, text="", color="ffffff", fg="d62828", border="2a2a2a", size=None):
    tl = text_layer(text, size or int(s * .22), "black", rgb(fg), maxw=int(s * 1.1), pad=0)
    w, h = tl.width + 60, tl.height + 50; L = _canvas(w + 10, h + 10); d = ImageDraw.Draw(L); k = 2
    d.rounded_rectangle([5 * k, 5 * k, (w + 5) * k, (h + 5) * k], 14 * k, fill=rgb(color), outline=rgb(border), width=5 * k)
    tl2 = tl.resize((tl.width * k, tl.height * k)); L.paste(tl2, (35 * k, 30 * k), tl2)
    return _fin(L)

def p_note(s, text="", color="ffe66d", rot=0):
    tl = text_layer(text, int(s * .13), "bold", rgb("3a3a2a"), maxw=int(s * .8), align="left", pad=0, spacing=1.25)
    w = max(s, tl.width + 50); h = max(int(s * .9), tl.height + 70); L = _canvas(w + 20, h + 20); d = ImageDraw.Draw(L); k = 2
    d.rectangle([14 * k, 14 * k, (w + 10) * k, (h + 10) * k], fill=(0, 0, 0, 60)); d.rectangle([10 * k, 10 * k, (w + 6) * k, (h + 6) * k], fill=rgb(color))
    d.rectangle([10 * k, 10 * k, (w + 6) * k, 34 * k], fill=shade(rgb(color), .93))
    t2 = tl.resize((tl.width * k, tl.height * k)); L.paste(t2, (28 * k, 48 * k), t2)
    L = _fin(L); return L.rotate(rot, expand=True, resample=Image.BILINEAR) if rot else L

def p_receipt(s, lines=(), total=""):
    rows = [(a, b) for a, b in lines]; w = max(s, 300); h = 120 + 46 * len(rows) + 90; L = _canvas(w + 20, h + 20); d = ImageDraw.Draw(L); k = 2
    pts = [(10 * k, 10 * k)]; 
    d.rectangle([10 * k, 10 * k, (w + 10) * k, (h + 10) * k], fill=rgb("fbfaf5"))
    for i in range(0, w, 24): d.polygon([((10 + i) * k, (h + 10) * k), ((22 + i) * k, (h + 26) * k), ((34 + i) * k, (h + 10) * k)], fill=rgb("fbfaf5"))
    f = font("med", 30 * k)
    d.text((30 * k, 30 * k), "RECEIPT", font=font("black", 34 * k), fill=rgb("222"))
    for i, (a, b) in enumerate(rows):
        y = (96 + i * 46) * k; d.text((30 * k, y), a, font=f, fill=rgb("333")); bw = f.getlength(b); d.text(((w - 10) * k - bw, y), b, font=f, fill=rgb("333"))
    if total:
        y = (110 + len(rows) * 46) * k; d.line([30 * k, y, (w - 10) * k, y], fill=rgb("333"), width=3 * k)
        d.text((30 * k, y + 14 * k), "TOTAL", font=font("black", 34 * k), fill=rgb("111")); bw = font("black", 34 * k).getlength(total); d.text(((w - 10) * k - bw, y + 14 * k), total, font=font("black", 34 * k), fill=rgb("111"))
    return _fin(L)

def p_car(s, color="3a6fd8", windows="a9d4f7", roof=True):
    w, h = s, int(s * .5); L = _canvas(w + 30, h + 30); d = ImageDraw.Draw(L); k = 2; c = rgb(color)
    d.rounded_rectangle([10 * k, int(h * .42) * k, (w - 10) * k, int(h * .85) * k], 22 * k, fill=c)
    d.polygon([(int(w * .2) * k, int(h * .45) * k), (int(w * .3) * k, int(h * .08) * k), (int(w * .68) * k, int(h * .08) * k), (int(w * .8) * k, int(h * .45) * k)], fill=c)
    d.polygon([(int(w * .26) * k, int(h * .42) * k), (int(w * .33) * k, int(h * .14) * k), (int(w * .47) * k, int(h * .14) * k), (int(w * .47) * k, int(h * .42) * k)], fill=rgb(windows))
    d.polygon([(int(w * .5) * k, int(h * .42) * k), (int(w * .5) * k, int(h * .14) * k), (int(w * .65) * k, int(h * .14) * k), (int(w * .73) * k, int(h * .42) * k)], fill=rgb(windows))
    d.rectangle([10 * k, int(h * .68) * k, (w - 10) * k, int(h * .74) * k], fill=shade(c, .8))
    d.rounded_rectangle([(w - 34) * k, int(h * .5) * k, (w - 6) * k, int(h * .6) * k], 6 * k, fill=rgb("ffe08a"))
    for cx in (int(w * .24), int(w * .76)):
        d.ellipse([(cx - 30) * k, int(h * .66) * k, (cx + 30) * k, int(h * .66 + 60) * k], fill=rgb("22252d")); d.ellipse([(cx - 14) * k, int(h * .66 + 16) * k, (cx + 14) * k, int(h * .66 + 44) * k], fill=rgb("b7bcc9"))
    return _fin(L)

def p_couch(s, color="6f8fd8"):
    w, h = s, int(s * .45); L = _canvas(w + 30, h + 30); d = ImageDraw.Draw(L); k = 2; c = rgb(color)
    d.rounded_rectangle([20 * k, 10 * k, (w - 10) * k, int(h * .6) * k], 24 * k, fill=shade(c, .85))
    d.rounded_rectangle([0, int(h * .32) * k, int(w * .14) * k, int(h * .92) * k], 22 * k, fill=shade(c, .95)); d.rounded_rectangle([int(w * .86) * k, int(h * .32) * k, w * k, int(h * .92) * k], 22 * k, fill=shade(c, .95))
    d.rounded_rectangle([int(w * .1) * k, int(h * .45) * k, int(w * .9) * k, int(h * .88) * k], 18 * k, fill=c)
    d.line([int(w * .5) * k, int(h * .5) * k, int(w * .5) * k, int(h * .86) * k], fill=shade(c, .8), width=4 * k)
    d.rectangle([int(w * .12) * k, int(h * .88) * k, int(w * .18) * k, h * k], fill=rgb("3a2a22")); d.rectangle([int(w * .82) * k, int(h * .88) * k, int(w * .88) * k, h * k], fill=rgb("3a2a22"))
    return _fin(L)

def p_bed(s, color="9ec1ff"):
    w, h = s, int(s * .42); L = _canvas(w + 30, h + 30); d = ImageDraw.Draw(L); k = 2
    d.rounded_rectangle([0, 0, 24 * k, h * k], 10 * k, fill=rgb("6b4a35")); d.rounded_rectangle([14 * k, int(h * .45) * k, w * k, int(h * .95) * k], 16 * k, fill=rgb("8a6244"))
    d.rounded_rectangle([20 * k, int(h * .22) * k, w * k, int(h * .72) * k], 20 * k, fill=rgb(color)); d.rounded_rectangle([34 * k, int(h * .08) * k, int(w * .26) * k, int(h * .42) * k], 16 * k, fill=rgb("ffffff"))
    d.line([int(w * .3) * k, int(h * .25) * k, int(w * .3) * k, int(h * .7) * k], fill=shade(rgb(color), .85), width=5 * k)
    return _fin(L)

def p_door(s, color="8a5a3a", knob=True, open_=False):
    w, h = int(s * .55), s; L = _canvas(w + 40, h + 20); d = ImageDraw.Draw(L); k = 2
    d.rectangle([5 * k, 5 * k, (w + 25) * k, (h + 10) * k], fill=rgb("e9e2d4"))
    if open_: d.polygon([(15 * k, 15 * k), (int(w * .3) * k, 5 * k), (int(w * .3) * k, (h + 5) * k), (15 * k, h * k)], fill=shade(rgb(color), .8)); d.rectangle([int(w * .3) * k, 15 * k, (w + 15) * k, h * k], fill=rgb("1d1b26"))
    else:
        d.rectangle([15 * k, 15 * k, (w + 15) * k, h * k], fill=rgb(color))
        for yy in (.1, .55): d.rectangle([int(w * .15) * k, int(h * yy) * k + 15 * k, int(w * .85) * k, int(h * (yy + .35)) * k + 15 * k], outline=shade(rgb(color), .75), width=4 * k)
        if knob: d.ellipse([int(w * .78) * k, int(h * .52) * k, int(w * .78 + 26) * k, int(h * .52 + 26) * k], fill=rgb("e6c35c"))
    return _fin(L)

def p_table(s, color="a8774c"):
    w, h = s, int(s * .32); L = _canvas(w + 30, h + 30); d = ImageDraw.Draw(L); k = 2
    cube(d, 10 * k, int(h * .2) * k + 12 * k, (w - 10) * k, int(h * .16) * k, rgb(color), 14 * k)
    for x in (.06, .88): d.rectangle([int(w * x) * k + 10 * k, int(h * .38) * k + 12 * k, int(w * x + 20) * k + 10 * k, h * k + 12 * k], fill=shade(rgb(color), .7))
    return _fin(L)

def p_tv(s, color="1b1d24", screen="3a7bd5", text=""):
    w, h = s, int(s * .6); L = _canvas(w + 30, h + 50); d = ImageDraw.Draw(L); k = 2
    d.rounded_rectangle([10 * k, 10 * k, (w + 10) * k, (h + 10) * k], 12 * k, fill=rgb(color)); d.rectangle([24 * k, 24 * k, (w - 4) * k, (h - 4) * k], fill=rgb(screen))
    d.rectangle([int(w * .4) * k, (h + 10) * k, int(w * .6) * k, (h + 28) * k], fill=rgb(color)); d.rectangle([int(w * .3) * k, (h + 26) * k, int(w * .7) * k, (h + 34) * k], fill=rgb(color))
    L = _fin(L)
    if text:
        tl = text_layer(text, int(s * .09), "bold", WHITE, maxw=int(w * .8), pad=0); L.paste(tl, (int((w + 30 - tl.width) / 2), int(h / 2 - tl.height / 2)), tl)
    return L

def p_fridge(s, color="e8ecf2"):
    w, h = int(s * .55), s; L = _canvas(w + 40, h + 30); d = ImageDraw.Draw(L); k = 2
    cube(d, 10 * k, 20 * k, w * k, h * k, rgb(color), 16 * k); d.line([10 * k, int(h * .36) * k + 20 * k, (w + 10) * k, int(h * .36) * k + 20 * k], fill=rgb("b6bcc8"), width=4 * k)
    d.rounded_rectangle([int(w * .8) * k, int(h * .12) * k + 20 * k, int(w * .85) * k, int(h * .3) * k + 20 * k], 4 * k, fill=rgb("9097a8")); d.rounded_rectangle([int(w * .8) * k, int(h * .42) * k + 20 * k, int(w * .85) * k, int(h * .62) * k + 20 * k], 4 * k, fill=rgb("9097a8"))
    return _fin(L)

def p_chair(s, color="c0392b"):
    w, h = int(s * .6), s; L = _canvas(w + 30, h + 20); d = ImageDraw.Draw(L); k = 2
    d.rounded_rectangle([10 * k, 5 * k, (w - 6) * k, int(h * .5) * k], 10 * k, fill=rgb(color)); d.rounded_rectangle([0, int(h * .46) * k, w * k, int(h * .58) * k], 8 * k, fill=shade(rgb(color), .85))
    for x in (.06, .84): d.rectangle([int(w * x) * k, int(h * .58) * k, int(w * x + 14) * k, h * k], fill=rgb("3a2a22"))
    return _fin(L)

def p_bag(s, color="d9a273", handle=True):
    w, h = s, int(s * 1.1); L = _canvas(w + 20, h + 20); d = ImageDraw.Draw(L); k = 2
    if handle: d.arc([int(w * .22) * k, 6 * k, int(w * .78) * k, int(h * .45) * k], 180, 360, fill=shade(rgb(color), .7), width=7 * k)
    cube(d, 10 * k, int(h * .22) * k, (w - 20) * k, int(h * .75) * k, rgb(color), 12 * k)
    return _fin(L)

def p_suitcase(s, color="2a9d8f"):
    w, h = s, int(s * .75); L = _canvas(w + 30, h + 40); d = ImageDraw.Draw(L); k = 2
    d.rounded_rectangle([int(w * .35) * k, 4 * k, int(w * .65) * k, 40 * k], 8 * k, outline=rgb("2a2a2a"), width=7 * k)
    cube(d, 10 * k, 40 * k, (w - 10) * k, int(h * .85) * k, rgb(color), 14 * k)
    for x in (.25, .5, .75): d.line([int(w * x) * k, 60 * k, int(w * x) * k, int(h * .85) * k + 20 * k], fill=shade(rgb(color), .78), width=4 * k)
    return _fin(L)

def p_barbell(s, plates=3):
    w, h = s, int(s * .34); L = _canvas(w + 20, h + 20); d = ImageDraw.Draw(L); k = 2; cy = h // 2 + 10
    d.rectangle([0, (cy - 6) * k, w * k, (cy + 6) * k], fill=rgb("b7bcc9"))
    cols = ["e63946", "2a6fdb", "f4a300", "3aa655"]
    for side in (0, 1):
        for i in range(plates):
            x = int(w * .08 + i * 20) if side == 0 else int(w * .92 - i * 20 - 14); hh = int(h * (.9 - i * .17))
            d.rounded_rectangle([x * k, (cy - hh // 2) * k, (x + 14) * k, (cy + hh // 2) * k], 4 * k, fill=rgb(cols[i % 4]))
    return _fin(L)

def p_cake(s, candles=3):
    w, h = s, int(s * .75); L = _canvas(w + 20, h + 20); d = ImageDraw.Draw(L); k = 2
    cube(d, 10 * k, int(h * .45) * k + 20 * k, (w - 20) * k, int(h * .5) * k, rgb("f6c1d0"), 14 * k); cube(d, int(w * .1) * k, int(h * .22) * k + 20 * k, int(w * .75) * k, int(h * .3) * k, rgb("fff0f4"), 12 * k)
    for i in range(candles):
        x = int(w * (.28 + i * .22)); d.rectangle([x * k, 8 * k + 20 * k, (x + 8) * k, int(h * .24) * k + 20 * k], fill=rgb("5aa9e6")); d.ellipse([(x - 3) * k, 0, (x + 11) * k, 18 * k + 8 * k], fill=rgb("ffb400"))
    return _fin(L)

def p_money(s, color="3a9d5d"):
    w, h = s, int(s * .45); L = _canvas(w + 10, h + 10); d = ImageDraw.Draw(L); k = 2
    d.rounded_rectangle([5 * k, 5 * k, (w + 5) * k, (h + 5) * k], 8 * k, fill=rgb(color), outline=shade(rgb(color), .7), width=4 * k)
    d.ellipse([int(w * .36) * k, int(h * .22) * k, int(w * .64) * k, int(h * .8) * k], outline=shade(rgb(color), 1.4), width=4 * k)
    d.text((int(w * .44) * k, int(h * .28) * k), "$", font=font("black", int(h * .45) * k), fill=shade(rgb(color), 1.5))
    return _fin(L)

def p_card(s, color="2b2f3a", text="VISA"):
    w, h = s, int(s * .63); L = _canvas(w + 10, h + 10); d = ImageDraw.Draw(L); k = 2
    d.rounded_rectangle([5 * k, 5 * k, (w + 5) * k, (h + 5) * k], 18 * k, fill=rgb(color)); d.rectangle([5 * k, int(h * .22) * k, (w + 5) * k, int(h * .38) * k], fill=rgb("0f1117"))
    d.rounded_rectangle([24 * k, int(h * .5) * k, int(w * .22) * k + 24 * k, int(h * .68) * k], 6 * k, fill=rgb("e6c35c")); d.text((int(w * .6) * k, int(h * .72) * k), text, font=font("black", int(h * .2) * k), fill=WHITE)
    return _fin(L)

def p_trophy(s, color="f4c20d"):
    w, h = int(s * .75), s; L = _canvas(w + 20, h + 20); d = ImageDraw.Draw(L); k = 2; c = rgb(color)
    d.polygon([(int(w * .15) * k, 10 * k), (int(w * .85) * k, 10 * k), (int(w * .7) * k, int(h * .5) * k), (int(w * .3) * k, int(h * .5) * k)], fill=c)
    d.arc([(-10) * k, 14 * k, int(w * .3) * k, int(h * .36) * k], 90, 270, fill=c, width=8 * k); d.arc([int(w * .7) * k, 14 * k, (w + 10) * k, int(h * .36) * k], 270, 90, fill=c, width=8 * k)
    d.rectangle([int(w * .42) * k, int(h * .5) * k, int(w * .58) * k, int(h * .75) * k], fill=shade(c, .85)); d.rectangle([int(w * .22) * k, int(h * .75) * k, int(w * .78) * k, int(h * .92) * k], fill=shade(c, .7))
    return _fin(L)

def p_plant(s, pot="c2693a"):
    w, h = int(s * .7), s; L = _canvas(w + 20, h + 20); d = ImageDraw.Draw(L); k = 2
    for ang, ln in [(-50, .5), (-20, .62), (0, .7), (22, .6), (52, .48)]:
        a = math.radians(ang); cx, cy = w / 2 + 10, h * .62; ex, ey = cx + math.sin(a) * h * ln * .6, cy - math.cos(a) * h * ln
        d.polygon([(cx * k, cy * k), ((cx + ex) / 2 * k - 16 * k, (cy + ey) / 2 * k), (ex * k, ey * k), ((cx + ex) / 2 * k + 16 * k, (cy + ey) / 2 * k)], fill=rgb("3f9b4e"))
    d.polygon([(int(w * .2) * k, int(h * .62) * k + 20), (int(w * .8) * k, int(h * .62) * k + 20), (int(w * .7) * k, h * k), (int(w * .3) * k, h * k)], fill=rgb(pot))
    return _fin(L)

def p_lamp(s, on=True):
    w, h = int(s * .5), s; L = _canvas(w + 30, h + 20); d = ImageDraw.Draw(L); k = 2
    d.polygon([(int(w * .1) * k, int(h * .35) * k), (int(w * .9) * k, int(h * .35) * k), (int(w * .7) * k, 10 * k), (int(w * .3) * k, 10 * k)], fill=rgb("ffe08a") if on else rgb("c9b783"))
    d.rectangle([int(w * .47) * k, int(h * .35) * k, int(w * .53) * k, int(h * .9) * k], fill=rgb("4a4a52")); d.ellipse([int(w * .25) * k, int(h * .88) * k, int(w * .75) * k, h * k], fill=rgb("4a4a52"))
    return _fin(L)

def p_dog(s, color="c8955a"):
    w, h = s, int(s * .7); L = _canvas(w + 30, h + 20); d = ImageDraw.Draw(L); k = 2; c = rgb(color)
    cube(d, 10 * k, int(h * .25) * k + 14 * k, int(w * .6) * k, int(h * .4) * k, c, 12 * k)
    cube(d, int(w * .52) * k, 14 * k, int(w * .38) * k, int(h * .42) * k, c, 12 * k); cube(d, int(w * .8) * k, int(h * .22) * k + 8 * k, int(w * .16) * k, int(h * .2) * k, shade(c, 1.1), 8 * k)
    d.rectangle([int(w * .56) * k, int(h * .15) * k, int(w * .64) * k, int(h * .26) * k + 14 * k], fill=shade(c, .6)); d.rectangle([int(w * .7) * k, int(h * .18) * k, int(w * .78) * k, int(h * .3) * k], fill=D)
    for x in (.12, .26, .46, .56): d.rectangle([int(w * x) * k, int(h * .62) * k + 14 * k, int(w * x + 20) * k, int(h * .98) * k], fill=shade(c, .8))
    d.polygon([(10 * k, int(h * .3) * k + 14 * k), (-12 * k, int(h * .1) * k), (20 * k, int(h * .24) * k + 14 * k)], fill=c)
    return _fin(L)

def p_cart(s):
    w, h = s, int(s * .8); L = _canvas(w + 20, h + 20); d = ImageDraw.Draw(L); k = 2
    d.line([0, 14 * k, int(w * .16) * k, 14 * k, int(w * .26) * k, int(h * .62) * k, int(w * .9) * k, int(h * .62) * k], fill=rgb("8f97a8"), width=7 * k)
    d.polygon([(int(w * .18) * k, 26 * k), (w * k, 26 * k), (int(w * .9) * k, int(h * .6) * k), (int(w * .27) * k, int(h * .6) * k)], outline=rgb("8f97a8"), fill=rgb("dfe3ec"), width=6 * k)
    for x in (.34, .8): d.ellipse([int(w * x) * k, int(h * .76) * k, int(w * x + 36) * k, int(h * .76 + 36) * k], fill=rgb("3a3f4c"))
    return _fin(L)

def p_speech(s, text="", color="ffffff"):  # simple word balloon prop
    return p_sign(s, text, color=color, fg="111111")

def p_window(s, night=False, rain=False):
    w, h = s, int(s * 1.1); L = _canvas(w + 20, h + 20); d = ImageDraw.Draw(L); k = 2
    d.rectangle([5 * k, 5 * k, (w + 5) * k, (h + 5) * k], fill=rgb("f2f0ff")); d.rectangle([20 * k, 20 * k, (w - 10) * k, (h - 10) * k], fill=rgb("1b1740") if night else rgb("8fd0ff"))
    d.line([int(w * .5) * k, 20 * k, int(w * .5) * k, (h - 10) * k], fill=rgb("f2f0ff"), width=8 * k); d.line([20 * k, int(h * .5) * k, (w - 10) * k, int(h * .5) * k], fill=rgb("f2f0ff"), width=8 * k)
    return _fin(L)

def p_arrow(s, color="ff3b3b", ang=0):
    L = _canvas(s, s); d = ImageDraw.Draw(L); k = 2
    d.polygon([(s * .1 * k, s * .38 * k), (s * .6 * k, s * .38 * k), (s * .6 * k, s * .15 * k), (s * .95 * k, s * .5 * k), (s * .6 * k, s * .85 * k), (s * .6 * k, s * .62 * k), (s * .1 * k, s * .62 * k)], fill=rgb(color), outline=D)
    L = _fin(L); return L.rotate(ang, expand=True, resample=Image.BILINEAR) if ang else L

def p_basket(s, n=1):
    w, h = s, int(s * .6) + 14 * n; L = _canvas(w + 20, h + 20); d = ImageDraw.Draw(L); k = 2
    base = h - 10
    for i in range(n):
        y0 = base - int(s * .34) - i * 14
        d.rounded_rectangle([10 * k, y0 * k, (w - 6) * k, (y0 + int(s * .3)) * k], 14 * k, fill=rgb("c58b4e"), outline=rgb("9a6a36"), width=3 * k)
        for x in range(26, w - 20, 22): d.line([x * k, (y0 + 8) * k, (x - 6) * k, (y0 + int(s * .28)) * k], fill=rgb("a8743c"), width=3 * k)
    top = base - int(s * .34) - (n - 1) * 14
    d.ellipse([int(w * .1) * k, (top - 30) * k, int(w * .52) * k, (top + 22) * k], fill=rgb("e8b46a")); d.ellipse([int(w * .45) * k, (top - 38) * k, int(w * .9) * k, (top + 18) * k], fill=rgb("dba15a"))
    return _fin(L)

def p_glass(s, n=0):
    w, h = int(s * .5), s; L = _canvas(w + 20, h + 20); d = ImageDraw.Draw(L); k = 2
    d.polygon([(10 * k, 10 * k), ((w + 10) * k, 10 * k), (int(w * .85) * k, h * k), (int(w * .15) * k + 10 * k, h * k)], fill=(205, 232, 255, 150), outline=(150, 190, 225, 255))
    d.polygon([(int(w * .06) * k + 10 * k, int(h * .45) * k), (int(w * .94) * k, int(h * .45) * k), (int(w * .82) * k, (h - 4) * k), (int(w * .18) * k + 10 * k, (h - 4) * k)], fill=(150, 205, 250, 190))
    return _fin(L)

def p_mop(s):
    L = _canvas(s // 2 + 20, s + 20); d = ImageDraw.Draw(L); k = 2
    d.line([int(s * .22) * k, 10 * k, int(s * .22) * k, int(s * .78) * k], fill=rgb("8a6a45"), width=9 * k)
    d.rounded_rectangle([5 * k, int(s * .76) * k, int(s * .42) * k, int(s * .98) * k], 8 * k, fill=rgb("dfe3ec"), outline=rgb("aab0c0"), width=3 * k)
    return _fin(L)


def p_bowl(s, color="3a7bd5"):
    w, h = s, int(s * .5); L = _canvas(w + 20, h + 20); d = ImageDraw.Draw(L); k = 2
    d.pieslice([10 * k, -int(h * .4) * k + 20 * k, (w - 10) * k, int(h * 1.6) * k], 0, 180, fill=rgb(color))
    d.ellipse([10 * k, 10 * k + 20 * k - int(h * .1) * k, (w - 10) * k, int(h * .42) * k + 20 * k], fill=shade(rgb(color), .7))
    d.ellipse([int(w * .3) * k, int(h * .85) * k + 8 * k, int(w * .7) * k, int(h * .98) * k + 8 * k], fill=shade(rgb(color), .8))
    return _fin(L)

def p_shelf(s, items=("c0392b", "f4a300", "3aa655", "2a6fdb")):
    w, h = s, int(s * .7); L = _canvas(w + 20, h + 20); d = ImageDraw.Draw(L); k = 2
    d.rectangle([10 * k, 10 * k, (w + 10) * k, (h + 10) * k], fill=rgb("b6bccb"))
    for r in range(3):
        y = 20 + r * int(h * .32)
        d.rectangle([10 * k, (y + int(h * .26)) * k, (w + 10) * k, (y + int(h * .3)) * k], fill=rgb("7a8296"))
        x = 24
        while x < w - 30:
            bw = 30 + (x * 7 + r * 13) % 22; bh = 40 + (x * 3 + r * 5) % 40; c = rgb(items[(x // 30 + r) % len(items)])
            d.rectangle([x * k, (y + int(h * .26) - bh) * k, (x + bw) * k, (y + int(h * .26)) * k], fill=c); x += bw + 6
    return _fin(L)

def p_bubbleclock(s): return p_clock(s)


# ---------------------------------------------------------------- generic comedy props
def p_tea(s):
    w, h = s, int(s * .8); L = _canvas(w + 20, h + 20); d = ImageDraw.Draw(L); k = 2
    d.ellipse([5 * k, int(h * .84) * k, (w - 5) * k, int(h * 1.0) * k], fill=rgb("e8e2d6"), outline=rgb("b7ad98"), width=3 * k)
    d.polygon([(int(w * .2) * k, int(h * .22) * k), (int(w * .8) * k, int(h * .22) * k), (int(w * .72) * k, int(h * .86) * k), (int(w * .28) * k, int(h * .86) * k)], fill=(210, 120, 40, 235), outline=rgb("f4efe6"))
    d.rectangle([int(w * .2) * k, int(h * .22) * k, int(w * .8) * k, int(h * .3) * k], fill=(255, 255, 255, 120))
    for i, x in enumerate((.38, .52, .64)): d.arc([int(w * x) * k, (-12 + i * 3) * k, int(w * (x + .1)) * k, int(h * .2) * k], 90, 270, fill=(255, 255, 255, 160), width=4 * k)
    return _fin(L)

def p_tupper(s, text="", n=3):
    w, h = s, int(s * .22 * n) + 30; L = _canvas(w + 20, h + 20); d = ImageDraw.Draw(L); k = 2
    cols = ["e63946", "2a9d8f", "f4a300", "6c8ebf"]
    for i in range(n):
        y = h - (i + 1) * int(s * .2) - 4
        d.rounded_rectangle([10 * k, y * k, (w - 10) * k, (y + int(s * .19)) * k], 8 * k, fill=(236, 240, 248, 235), outline=rgb("a9b3c6"), width=3 * k)
        d.rounded_rectangle([6 * k, y * k, (w - 6) * k, (y + int(s * .06)) * k], 6 * k, fill=rgb(cols[i % 4]))
    if text:
        tl = text_layer(text, int(s * .1), "black", rgb("222"), maxw=int(w * .8), pad=0); tl = tl.resize((tl.width * k, tl.height * k)); L.paste(tl, (int((w + 20) * k / 2 - tl.width / 2), int((h - s * .12) * k)), tl)
    return _fin(L)

def p_slipper(s, color="3a9bd9"):
    w, h = s, int(s * .5); L = _canvas(w + 20, h + 20); d = ImageDraw.Draw(L); k = 2
    d.rounded_rectangle([10 * k, int(h * .3) * k, int(w * .98) * k, int(h * .85) * k], int(h * .3) * k, fill=rgb("f4f4f4"), outline=D, width=4 * k)
    d.rounded_rectangle([14 * k, int(h * .52) * k, int(w * .94) * k, int(h * .85) * k], int(h * .25) * k, fill=shade(rgb(color), .9))
    d.polygon([(int(w * .38) * k, int(h * .35) * k), (int(w * .7) * k, int(h * .35) * k), (int(w * .55) * k, int(h * .05) * k)], fill=rgb(color), outline=D)
    return _fin(L)

def p_pot(s, steam=True, color="b7bcc9"):
    w, h = s, int(s * .7); L = _canvas(w + 40, h + 60); d = ImageDraw.Draw(L); k = 2
    d.rounded_rectangle([10 * k, int(h * .45) * k + 40 * k, (w - 10) * k, h * k + 40 * k], 18 * k, fill=rgb(color)); d.rounded_rectangle([0, int(h * .38) * k + 40 * k, w * k, int(h * .55) * k + 40 * k], 10 * k, fill=shade(rgb(color), .85))
    d.rounded_rectangle([int(w * .4) * k, int(h * .22) * k + 40 * k, int(w * .6) * k, int(h * .4) * k + 40 * k], 8 * k, fill=rgb("5a5f6e"))
    if steam:
        for i, x in enumerate((.3, .5, .7)): d.arc([int(w * x) * k, (4 + i * 6) * k, int(w * x + 40) * k, 60 * k], 90, 270, fill=(255, 255, 255, 190), width=5 * k)
    return _fin(L)

def p_dish(s, food="f4e3b0", garnish="c0392b"):
    w, h = s, int(s * .4); L = _canvas(w + 20, h + 20); d = ImageDraw.Draw(L); k = 2
    d.ellipse([5 * k, int(h * .3) * k, (w + 5) * k, int(h * 1.0) * k], fill=rgb("f5f3ee"), outline=rgb("c9c2b2"), width=3 * k)
    d.pieslice([int(w * .15) * k, 0, int(w * .85) * k, int(h * .9) * k], 180, 360, fill=rgb(food))
    for x, y in [(.3, .5), (.5, .42), (.66, .55)]: d.ellipse([int(w * x) * k, int(h * y) * k, int(w * x + 22) * k, int(h * y + 22) * k], fill=rgb(garnish))
    return _fin(L)

def p_mic(s):
    w, h = int(s * .4), s; L = _canvas(w + 20, h + 20); d = ImageDraw.Draw(L); k = 2
    d.rounded_rectangle([int(w * .4) * k, int(h * .4) * k, int(w * .65) * k, h * k], 10 * k, fill=rgb("2b2f3a")); d.ellipse([int(w * .15) * k, 4 * k, int(w * .9) * k, int(h * .5) * k], fill=rgb("9aa3b5"), outline=rgb("2b2f3a"), width=5 * k)
    d.line([int(w * .2) * k, int(h * .2) * k, int(w * .85) * k, int(h * .2) * k], fill=rgb("2b2f3a"), width=3 * k)
    return _fin(L)

def p_ball(s, kind="soccer"):
    L = _canvas(s + 10, s + 10); d = ImageDraw.Draw(L); k = 2; c = (s / 2 + 5) * k; r = s / 2 * k
    if kind == "soccer":
        d.ellipse([c - r, c - r, c + r, c + r], fill=rgb("f6f6f6"), outline=D, width=4 * k)
        for a in range(5):
            ang = a / 5 * 2 * math.pi - math.pi / 2; x, y = c + math.cos(ang) * r * .6, c + math.sin(ang) * r * .6; d.ellipse([x - r * .16, y - r * .16, x + r * .16, y + r * .16], fill=D)
        d.regular_polygon((c, c, r * .22), 5, fill=D)
    elif kind == "basket":
        d.ellipse([c - r, c - r, c + r, c + r], fill=rgb("e07a2f"), outline=D, width=4 * k); d.line([c - r, c, c + r, c], fill=D, width=3 * k); d.line([c, c - r, c, c + r], fill=D, width=3 * k)
    else:
        d.ellipse([c - r, c - r, c + r, c + r], fill=rgb("f4f6f0"), outline=D, width=3 * k)
    return _fin(L)

def p_golfclub(s):
    w, h = int(s * .5), s; L = _canvas(w + 20, h + 20); d = ImageDraw.Draw(L); k = 2
    d.line([int(w * .8) * k, 10 * k, int(w * .35) * k, int(h * .92) * k], fill=rgb("9aa3b5"), width=7 * k); d.polygon([(int(w * .2) * k, int(h * .9) * k), (int(w * .6) * k, int(h * .88) * k), (int(w * .65) * k, int(h * .98) * k), (int(w * .15) * k, int(h * .99) * k)], fill=rgb("5a5f6e"))
    return _fin(L)

def p_bike(s, color="e63946"):
    w, h = s, int(s * .62); L = _canvas(w + 20, h + 20); d = ImageDraw.Draw(L); k = 2
    for cx in (int(w * .2), int(w * .8)): d.ellipse([(cx - int(h * .38)) * k, int(h * .24) * k, (cx + int(h * .38)) * k, int(h * .98) * k], outline=D, width=7 * k)
    pts = [(int(w * .2), int(h * .62)), (int(w * .45), int(h * .62)), (int(w * .36), int(h * .3)), (int(w * .62), int(h * .3)), (int(w * .8), int(h * .62)), (int(w * .45), int(h * .62))]
    d.line([(x * k, y * k) for x, y in pts], fill=rgb(color), width=7 * k); d.line([int(w * .62) * k, int(h * .3) * k, int(w * .6) * k, int(h * .1) * k, int(w * .72) * k, int(h * .1) * k], fill=D, width=6 * k)
    d.rectangle([int(w * .3) * k, int(h * .22) * k, int(w * .42) * k, int(h * .28) * k], fill=D)
    return _fin(L)

def p_surfboard(s, color="2ec4b6"):
    w, h = int(s * .32), s; L = _canvas(w + 20, h + 20); d = ImageDraw.Draw(L); k = 2
    d.ellipse([10 * k, 10 * k, (w + 10) * k, (h + 10) * k], fill=rgb(color), outline=D, width=4 * k); d.line([(w // 2 + 10) * k, 20 * k, (w // 2 + 10) * k, h * k], fill=rgb("f6f6f6"), width=5 * k)
    return _fin(L)

def p_helmet(s, color="f4a300"):
    w, h = s, int(s * .7); L = _canvas(w + 20, h + 20); d = ImageDraw.Draw(L); k = 2
    d.pieslice([10 * k, 10 * k, (w + 10) * k, int(h * 1.5) * k], 180, 360, fill=rgb(color), outline=D, width=4 * k); d.rectangle([5 * k, int(h * .72) * k, (w + 15) * k, int(h * .85) * k], fill=shade(rgb(color), .8))
    return _fin(L)

def p_backpack(s, color="2a6fdb"):
    w, h = int(s * .8), s; L = _canvas(w + 30, h + 20); d = ImageDraw.Draw(L); k = 2
    cube(d, 10 * k, int(h * .12) * k + 10 * k, w * k, int(h * .85) * k, rgb(color), 14 * k); d.rounded_rectangle([int(w * .2) * k, int(h * .56) * k, int(w * .8) * k, int(h * .9) * k], 10 * k, fill=shade(rgb(color), .8))
    d.arc([int(w * .3) * k, 4 * k, int(w * .7) * k, int(h * .3) * k], 180, 360, fill=D, width=6 * k)
    return _fin(L)

def p_tumbler(s, color="2a9d8f"):
    w, h = int(s * .6), s; L = _canvas(w + 50, h + 20); d = ImageDraw.Draw(L); k = 2
    d.polygon([(int(w * .08) * k, int(h * .12) * k), (int(w * .92) * k, int(h * .12) * k), (int(w * .78) * k, h * k), (int(w * .22) * k, h * k)], fill=rgb(color)); d.rectangle([int(w * .02) * k, 8 * k, int(w * .98) * k, int(h * .14) * k], fill=shade(rgb(color), .8))
    d.arc([int(w * .72) * k, int(h * .2) * k, (w + 40) * k, int(h * .62) * k], 270, 90, fill=shade(rgb(color), .8), width=9 * k); d.line([int(w * .55) * k, 8 * k, int(w * .78) * k, -4 * k], fill=D, width=5 * k)
    return _fin(L)

def p_coffee(s):
    w, h = int(s * .6), s; L = _canvas(w + 20, h + 20); d = ImageDraw.Draw(L); k = 2
    d.polygon([(int(w * .05) * k, int(h * .15) * k), (int(w * .95) * k, int(h * .15) * k), (int(w * .8) * k, h * k), (int(w * .2) * k, h * k)], fill=rgb("f6f2ea")); d.rectangle([int(w * .04) * k, 6 * k, int(w * .96) * k, int(h * .18) * k], fill=rgb("3a2a22"))
    d.rectangle([int(w * .1) * k, int(h * .42) * k, int(w * .9) * k, int(h * .66) * k], fill=rgb("b0703c"))
    return _fin(L)

def p_clipboard(s, text=""):
    w, h = int(s * .7), s; L = _canvas(w + 20, h + 20); d = ImageDraw.Draw(L); k = 2
    d.rounded_rectangle([10 * k, 10 * k, (w + 10) * k, (h + 10) * k], 12 * k, fill=rgb("a8774c")); d.rectangle([int(w * .1) * k + 10 * k, int(h * .1) * k + 10 * k, int(w * .9) * k, int(h * .94) * k], fill=rgb("fbfaf5"))
    d.rounded_rectangle([int(w * .3) * k, 4 * k, int(w * .7) * k + 10 * k, 36 * k], 8 * k, fill=rgb("8a8f9e"))
    if text:
        tl = text_layer(text, int(w * .11), "bold", rgb("222"), maxw=int(w * .72), align="left", pad=0); tl = tl.resize((tl.width * k, tl.height * k)); L.paste(tl, (int(w * .16 * k + 10 * k), int(h * .17 * k)), tl)
    return _fin(L)

def p_hardhat(s):
    return p_helmet(s, "f4c20d")

def p_hammer(s):
    w, h = s, int(s * .6); L = _canvas(w + 20, h + 20); d = ImageDraw.Draw(L); k = 2
    d.line([int(w * .3) * k, int(h * .95) * k, int(w * .62) * k, int(h * .3) * k], fill=rgb("8a5a3a"), width=11 * k); d.rounded_rectangle([int(w * .4) * k, 8 * k, int(w * .95) * k, int(h * .3) * k], 6 * k, fill=rgb("8f97a8"), outline=D, width=3 * k)
    return _fin(L)

def p_apple(s):
    L = _canvas(s + 10, s + 10); d = ImageDraw.Draw(L); k = 2
    d.ellipse([5 * k, int(s * .18) * k, (s + 5) * k, (s + 3) * k], fill=rgb("d62828")); d.rectangle([int(s * .5) * k, 6 * k, int(s * .56) * k, int(s * .26) * k], fill=rgb("5a3a28")); d.ellipse([int(s * .56) * k, 4 * k, int(s * .86) * k, int(s * .2) * k], fill=rgb("3f9b4e"))
    return _fin(L)

def p_book(s, color="2a6fdb", text=""):
    w, h = int(s * .75), s; L = _canvas(w + 30, h + 20); d = ImageDraw.Draw(L); k = 2
    cube(d, 10 * k, 14 * k, w * k, (h - 4) * k, rgb(color), 14 * k); d.rectangle([10 * k, 14 * k, 26 * k, (h + 10) * k], fill=shade(rgb(color), .75))
    if text:
        tl = text_layer(text, int(w * .14), "black", WHITE, maxw=int(w * .7), pad=0); tl = tl.resize((tl.width * k, tl.height * k)); L.paste(tl, (int(36 * k), int(h * .3 * k)), tl)
    return _fin(L)

def p_forsale(s, text="SOLD"):
    w, h = int(s * .9), s; L = _canvas(w + 20, h + 20); d = ImageDraw.Draw(L); k = 2
    d.rectangle([int(w * .08) * k, 10 * k, int(w * .14) * k, (h + 10) * k], fill=rgb("8a6a45")); d.rectangle([int(w * .08) * k, 20 * k, (w - 10) * k, 30 * k], fill=rgb("8a6a45"))
    d.rounded_rectangle([int(w * .14) * k, 28 * k, (w + 5) * k, int(h * .5) * k], 8 * k, fill=rgb("ffffff"), outline=rgb("d62828"), width=5 * k)
    tl = text_layer(text, int(w * .2), "black", rgb("d62828"), maxw=int(w * .8), pad=0); tl = tl.resize((tl.width * k, tl.height * k)); L.paste(tl, (int(w * .18 * k), int(40 * k)), tl)
    return _fin(L)

def p_cone(s):
    w, h = int(s * .7), s; L = _canvas(w + 20, h + 20); d = ImageDraw.Draw(L); k = 2
    d.polygon([(int(w * .5) * k + 10 * k, 6 * k), (int(w * .85) * k, int(h * .9) * k), (int(w * .15) * k, int(h * .9) * k)], fill=rgb("f27b21")); d.polygon([(int(w * .4) * k, int(h * .38) * k), (int(w * .6) * k + 20 * k, int(h * .38) * k), (int(w * .66) * k + 20 * k, int(h * .52) * k), (int(w * .36) * k, int(h * .52) * k)], fill=WHITE)
    d.rectangle([5 * k, int(h * .88) * k, (w + 15) * k, h * k], fill=rgb("f27b21"))
    return _fin(L)

def p_speaker(s):
    w, h = s, int(s * .65); L = _canvas(w + 20, h + 20); d = ImageDraw.Draw(L); k = 2
    cube(d, 10 * k, 18 * k, w * k, h * k, rgb("2b2f3a"), 12 * k)
    for cx in (.28, .72): d.ellipse([int(w * cx - w * .14) * k + 10 * k, int(h * .22) * k + 18 * k, int(w * cx + w * .14) * k + 10 * k, int(h * .22 + w * .28) * k + 18 * k], fill=rgb("12141a"), outline=rgb("5a5f6e"), width=4 * k)
    return _fin(L)

def p_whiteboard(s, text=""):
    w, h = s, int(s * .62); L = _canvas(w + 20, h + 20); d = ImageDraw.Draw(L); k = 2
    d.rectangle([10 * k, 10 * k, (w + 10) * k, (h + 10) * k], fill=rgb("f8fafc"), outline=rgb("8a8f9e"), width=8 * k)
    if text:
        tl = text_layer(text, int(s * .085), "bold", rgb("1d4ed8"), maxw=int(w * .84), align="left", pad=0, spacing=1.3); tl = tl.resize((tl.width * k, tl.height * k)); L.paste(tl, (int(36 * k), int(34 * k)), tl)
    return _fin(L)

def p_cooler(s):
    w, h = s, int(s * .6); L = _canvas(w + 20, h + 20); d = ImageDraw.Draw(L); k = 2
    cube(d, 10 * k, int(h * .2) * k + 10 * k, w * k, int(h * .7) * k, rgb("2a6fdb"), 12 * k); d.rectangle([10 * k, int(h * .2) * k + 10 * k, (w + 10) * k, int(h * .36) * k + 10 * k], fill=rgb("f4f6f8"))
    return _fin(L)

def p_grill(s):
    w, h = s, int(s * .9); L = _canvas(w + 20, h + 60); d = ImageDraw.Draw(L); k = 2
    d.pieslice([10 * k, 40 * k, (w + 10) * k, int(h * .9) * k + 40 * k], 180, 360, fill=rgb("2b2f3a")); d.rectangle([10 * k, int(h * .44) * k + 40 * k, (w + 10) * k, int(h * .52) * k + 40 * k], fill=rgb("5a5f6e"))
    for x in (.2, .8): d.line([int(w * x) * k, int(h * .52) * k + 40 * k, int(w * x - 20) * k, (h + 40) * k], fill=rgb("2b2f3a"), width=7 * k)
    for i, x in enumerate((.3, .5, .7)): d.arc([int(w * x) * k, (0 + i * 4) * k, int(w * x + 36) * k, 40 * k], 90, 270, fill=(220, 220, 225, 170), width=5 * k)
    return _fin(L)

def p_envelope(s, color="d62828"):
    w, h = s, int(s * .6); L = _canvas(w + 10, h + 10); d = ImageDraw.Draw(L); k = 2
    d.rounded_rectangle([5 * k, 5 * k, (w + 5) * k, (h + 5) * k], 8 * k, fill=rgb(color)); d.polygon([(5 * k, 5 * k), ((w // 2 + 5) * k, int(h * .55) * k), ((w + 5) * k, 5 * k)], fill=shade(rgb(color), .85))
    d.ellipse([int(w * .42) * k, int(h * .4) * k, int(w * .58) * k, int(h * .66) * k], fill=rgb("f2c94c"))
    return _fin(L)

def p_balloon(s, color="e63946"):
    w, h = int(s * .7), s; L = _canvas(w + 10, h + 10); d = ImageDraw.Draw(L); k = 2
    d.ellipse([5 * k, 5 * k, (w + 5) * k, int(h * .75) * k], fill=rgb(color)); d.polygon([(int(w * .5) * k + 5 * k, int(h * .74) * k), (int(w * .4) * k + 5 * k, int(h * .8) * k), (int(w * .6) * k + 5 * k, int(h * .8) * k)], fill=shade(rgb(color), .8))
    d.line([(w // 2 + 5) * k, int(h * .8) * k, (w // 2 + 5) * k, h * k], fill=rgb("9aa3b5"), width=2 * k)
    return _fin(L)

def p_gift(s, color="d62828"):
    w, h = s, int(s * .8); L = _canvas(w + 20, h + 20); d = ImageDraw.Draw(L); k = 2
    cube(d, 10 * k, int(h * .25) * k + 10 * k, w * k, int(h * .7) * k, rgb(color), 12 * k); d.rectangle([int(w * .45) * k + 10 * k, int(h * .25) * k + 10 * k, int(w * .58) * k + 10 * k, (h + 10) * k], fill=rgb("f2c94c")); d.rectangle([10 * k, int(h * .55) * k, (w + 10) * k, int(h * .66) * k], fill=rgb("f2c94c"))
    d.ellipse([int(w * .3) * k, 4 * k, int(w * .5) * k + 10 * k, int(h * .3) * k], outline=rgb("f2c94c"), width=5 * k); d.ellipse([int(w * .5) * k, 4 * k, int(w * .72) * k + 10 * k, int(h * .3) * k], outline=rgb("f2c94c"), width=5 * k)
    return _fin(L)

def p_lanyard(s, text="STAFF"):
    w, h = int(s * .6), s; L = _canvas(w + 20, h + 20); d = ImageDraw.Draw(L); k = 2
    d.line([int(w * .2) * k, 6 * k, int(w * .5) * k + 10 * k, int(h * .5) * k, int(w * .85) * k, 6 * k], fill=rgb("2a6fdb"), width=6 * k); d.rounded_rectangle([int(w * .15) * k, int(h * .5) * k, int(w * .85) * k + 10 * k, int(h * .98) * k], 10 * k, fill=WHITE, outline=D, width=4 * k)
    tl = text_layer(text, int(w * .16), "black", rgb("222"), pad=0); tl = tl.resize((tl.width * k, tl.height * k)); L.paste(tl, (int(w * .22 * k), int(h * .64 * k)), tl)
    return _fin(L)

def p_notepad(s, text=""):
    return p_note(s, text, "f8f8f4")

def p_bubbletea(s):
    w, h = int(s * .6), s; L = _canvas(w + 20, h + 20); d = ImageDraw.Draw(L); k = 2
    d.polygon([(int(w * .1) * k, int(h * .2) * k), (int(w * .9) * k, int(h * .2) * k), (int(w * .78) * k, h * k), (int(w * .22) * k, h * k)], fill=(235, 200, 150, 235), outline=rgb("f4efe6")); d.rectangle([int(w * .04) * k, 10 * k, int(w * .96) * k, int(h * .22) * k], fill=rgb("f4efe6"))
    d.line([int(w * .55) * k, 10 * k, int(w * .7) * k, -6 * k], fill=rgb("d62828"), width=7 * k)
    for x, y in [(.3, .85), (.45, .88), (.6, .84), (.38, .78), (.52, .8)]: d.ellipse([int(w * x) * k, int(h * y) * k - 12 * k, int(w * x + 14) * k, int(h * y) * k + 12 * k], fill=rgb("2a1a14"))
    return _fin(L)


def p_smoke(s):
    L = _canvas(s, s); d = ImageDraw.Draw(L); k = 2
    for cx, cy, r in [(.3, .7, .2), (.5, .5, .26), (.72, .62, .22), (.45, .3, .2), (.62, .25, .15)]:
        d.ellipse([int(s * (cx - r)) * k, int(s * (cy - r)) * k, int(s * (cx + r)) * k, int(s * (cy + r)) * k], fill=(70, 70, 78, 215))
    return _fin(L)
