"""Fact-reel engine. Each factory returns a draw(img, lt, p, b) for a Clean beat; a reel is a list of (narration, scene).
Layout contract: HUD in y 150-400, visual in y 450-1300, the caption band (y ~1360-1480) is left free."""
import math
import numpy as np
from PIL import Image, ImageDraw
from scripts.common import *
from motion import *
import motion, voice

GOLD = (255, 214, 0); WHITE = (255, 255, 255); SOFT = (190, 198, 235); RED = (255, 105, 120); GREEN = (110, 230, 160)
BLUE = (110, 170, 255); ORANGE = (255, 170, 90); PINKC = (255, 130, 190); VIOLET = (170, 140, 255); CYAN = (90, 220, 240); DIM = (52, 58, 92)
def T(b, w, d=None, occ=0): return b.at(w, occ, d)

def bgfill(img, bg, lt=0.0):
    """bg = (r, g, b, stars_flag): a vertical gradient around that colour."""
    key = ("f", tuple(bg[:3]))
    if key not in motion._bg_cache if hasattr(motion, "_bg_cache") else True:
        pass
    c = np.array(bg[:3], float); c1 = tuple(int(min(255, v * 1.7 + 6)) for v in c); c2 = tuple(int(v * .55) for v in c)
    img.paste(vgrad(c1, c2, key=("f", tuple(bg[:3]))))
    if len(bg) > 3 and bg[3]: starfield(img, lt, 8)
    ambient(img, lt, bg)

_amb = {}
def ambient(img, lt, bg):
    """slow drifting light motes + a faint breathing glow, tinted by the background colour; keeps text-only beats alive"""
    k = tuple(bg[:3])
    if k not in _amb:
        r = np.random.RandomState(sum(k) + 7); _amb[k] = [(r.rand() * 1080, r.rand() * 1920, 2 + r.rand() * 5, 14 + r.rand() * 36, r.rand() * 6.28) for _ in range(34)]
    tint = tuple(int(min(255, v * 2.2 + 70)) for v in bg[:3])
    for x, y, sz, sp, ph in _amb[k]:
        yy = (y - lt * sp) % 1920; xx = x + 18 * math.sin(lt * .6 + ph); a = .25 + .2 * math.sin(lt * 1.3 + ph)
        disc(img, xx, yy, sz, tint, a=max(.05, a))
    glow(img, 540, 900, 520 + 40 * math.sin(lt * .8), tint, .10)

def hud(img, big, sub=None, col=WHITE):
    big = str(big); tx(img, big, 540, 235, 126 if len(big) < 9 else (92 if len(big) < 15 else 70), "black", col, maxw=1000)
    if sub: tx(img, sub, 540, 345, 34, "bold", SOFT, shadow=False, maxw=980)

def txl(img, s, x, y, size, weight, color, a=1.0, maxw=900, anchor="l", shadow=False):
    """text anchored by its left or right edge (tx itself centres, and the layout QA reads the centre)"""
    L = text_layer(s, size, weight, color, maxw=maxw); w = L.width - 16
    tx(img, s, x + w / 2 if anchor == "l" else x - w / 2, y, size, weight, color, a=a, maxw=maxw, shadow=shadow)

def ellipse_ring(img, cx, cy, rx, ry, w, color, a=1.0, rot=0.0, arc=None):
    pad = 4; S = 3; W = int(2 * rx + 2 * pad + w) * S; H = int(2 * rx + 2 * pad + w) * S
    p = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(p); c = W / 2
    pts = [(c + rx * S * math.cos(t), c + ry * S * math.sin(t)) for t in np.linspace(0 if arc is None else arc[0], 2 * math.pi if arc is None else arc[1], 120)]
    d.line(pts, fill=tuple(int(x) for x in color) + (int(255 * a),), width=max(1, int(w * S)), joint="curve")
    p = p.resize((W // S, H // S), Image.LANCZOS); paste(img, p, cx, cy, rot=rot)

# ---------------------------------------------------------------------------------------------- number
def num_scene(a, b_, fmt, sub, col, bg, deco=None, t0=.4):
    def draw(img, lt, p, b):
        bgfill(img, bg, lt); n = a + (b_ - a) * eio(seg(lt, t0, b.dur - .5)); hud(img, fmt(n), sub, col)
        for k in range(4):
            u = (lt * .45 + k * .25) % 1; ring(img, 540, 880, 90 + u * 430, 5, col, a=(1 - u) * .45)
        glow(img, 540, 880, 220, col, .35)
        if deco: deco(img, lt, n, b)
    return draw

# ---------------------------------------------------------------------------------------------- bars
def bars_scene(sub, items, bg, big=None, anchors=None, log=False, top=560, gapy=215, hh=96, big_col=GOLD):
    """items: (label, value, color, shown_text). anchors: words in the narration that start each bar."""
    def draw(img, lt, p, b):
        bgfill(img, bg, lt); hud(img, big or "", sub, big_col) if big else (tx(img, sub, 540, 260, 44, "black", WHITE, maxw=980))
        vm = max(v for _, v, _, _ in items); f = (lambda v: math.log10(max(v, 1)) + 1) if log else (lambda v: v)
        for i, (lab, v, col, shown) in enumerate(items):
            t0 = T(b, anchors[i], .5 + i * (b.dur * .75 / len(items))) if anchors else .5 + i * (b.dur * .75 / len(items))
            u = eio(seg(lt, t0, t0 + 1.3)); y = top + i * gapy; w = max(14, 840 * f(v) / f(vm) * u)
            txl(img, lab, 120, y - 48, 36, "bold", (225, 230, 250), a=clamp(u * 3), maxw=860)
            box(img, 120, y, 120 + 840, y + hh, 24, DIM, a=.5); box(img, 120, y, 120 + w, y + hh, 24, col, a=1.0)
            glow(img, 120 + w, y + hh / 2, 70, col, .45 * u)
            if u > .5: txl(img, shown, 120 + min(w, 840) - 18 if w > 330 else 120 + w + 20, y + hh / 2, 44, "black", (20, 22, 40) if w > 330 else WHITE, a=clamp((u - .5) * 3), maxw=600, anchor="r" if w > 330 else "l")
    return draw

# ---------------------------------------------------------------------------------------------- dots
def dots_scene(big, sub, bg, n_hl, total=400, cols=20, col_hl=GOLD, col_rest=DIM, label_hl="", t0=.5, anchor=None, big_fmt=None):
    def draw(img, lt, p, b):
        bgfill(img, bg, lt); ta = T(b, anchor, t0) if anchor else t0; u = eio(seg(lt, ta, b.dur - .5)); k = int(n_hl * u)
        hud(img, big_fmt(k) if big_fmt else big, sub, col_hl); rows = total // cols; pitch = 800 / cols; r = pitch * .36
        for i in range(total):
            x = 140 + (i % cols) * pitch + pitch / 2; y = 520 + (i // cols) * pitch + pitch / 2
            if i < k: disc(img, x, y, r, col_hl)
            else: disc(img, x, y, r * .8, col_rest, a=.9)
        if 0 < k < total: glow(img, 140 + ((k - 1) % cols) * pitch + pitch / 2, 520 + ((k - 1) // cols) * pitch + pitch / 2, 60, col_hl, .6)
        if label_hl and u > .2: tx(img, label_hl, 540, 1340, 34, "bold", SOFT, a=clamp(u * 2), shadow=False, maxw=900)
    return draw

# ---------------------------------------------------------------------------------------------- timeline
def timeline_scene(big, sub, bg, events, t_lo, t_hi, fmt, gaps=(), col=GOLD, y_axis=900):
    """events: (t, label, color, row) rows 0..3 (0,1 above the axis, 2,3 below). gaps: (i, j, text) shows the span between two events."""
    X0, X1 = 100, 980; xf = lambda t: X0 + (X1 - X0) * (t - t_lo) / (t_hi - t_lo)
    def draw(img, lt, p, b):
        bgfill(img, bg, lt); hud(img, big, sub, col); cur = eio(seg(lt, .4, b.dur - .6)); tc = t_lo + (t_hi - t_lo) * cur
        line(img, [(X0, y_axis), (X1, y_axis)], 6, (70, 78, 120)); line(img, [(X0, y_axis), (xf(tc), y_axis)], 6, col)
        glow(img, xf(tc), y_axis, 46, col, .8)
        shown = {}
        for i, (t, lab, c, row) in enumerate(events):
            if tc >= t:
                a = eio(seg(tc, t, t + (t_hi - t_lo) * .03)); shown[i] = a; x = xf(t); up = row < 2; ly = y_axis + (-1 if up else 1) * (150 + 150 * (row % 2))
                line(img, [(x, y_axis), (x, ly + (40 if up else -40))], 3, c, a=a * .8); disc(img, x, y_axis, 13, c, a=a)
                tx(img, lab, min(max(x, 240), 840), ly, 34, "black", c, a=a, maxw=340, shadow=False)
                tx(img, fmt(t), min(max(x, 240), 840), ly + 46 + (34 if len(lab) > 16 else 0), 26, "bold", SOFT, a=a * .9, maxw=340, shadow=False)
        for (i, j, text) in gaps:
            if i in shown and j in shown and shown[j] > .9:
                xa, xb = xf(events[i][0]), xf(events[j][0]); a = eio(seg(tc, events[j][0], events[j][0] + (t_hi - t_lo) * .05)); yy = y_axis + 40
                line(img, [(xa, yy), (xb, yy)], 4, WHITE, a=a * .8); tx(img, text, (xa + xb) / 2, yy + 50, 30, "black", WHITE, a=a, maxw=520, shadow=False)
    return draw

# ---------------------------------------------------------------------------------------------- compare circles
def circles_scene(big, sub, bg, items, area=False, baseline=1010, maxr=300, col=GOLD):
    """items: (label, value, color, shown_text); drawn side by side on one baseline, each grows in at its time."""
    vm = max(v for _, v, _, _ in items); n = len(items)
    def draw(img, lt, p, b):
        bgfill(img, bg, lt); hud(img, big, sub, col)
        rs = [maxr * (math.sqrt(v / vm) if area else v / vm) for _, v, _, _ in items]; tot = sum(2 * r for r in rs) + 40 * (n - 1); sc = min(1.0, 940 / tot); rs = [r * sc for r in rs]; tot = sum(2 * r for r in rs) + 40 * (n - 1); x = 540 - tot / 2
        for i, (lab, v, c, shown) in enumerate(items):
            r = rs[i]; t0 = .5 + i * (b.dur * .55 / n); u = eio(seg(lt, t0, t0 + 1.0)); cx = x + r; x += 2 * r + 40
            disc(img, cx, baseline - r * u, max(2, r * u), c, a=.95); glow(img, cx, baseline - r * u, r * u * 1.3, c, .25)
            tx(img, lab, cx, baseline + 60, 34, "bold", (225, 230, 250), a=clamp(u * 2), maxw=max(220, 2 * r + 20), shadow=False)
            tx(img, shown, cx, baseline - r * u, 40 if r > 70 else 30, "black", (20, 22, 40) if r > 70 else WHITE, a=clamp(u * 2 - .3), maxw=max(120, 2 * r - 20), shadow=False) if r > 40 else tx(img, shown, cx, baseline - 2 * r - 50, 30, "black", WHITE, a=clamp(u * 2), maxw=300, shadow=False)
    return draw

# ---------------------------------------------------------------------------------------------- counter
def counter_scene(rate, fmt, big_sub, bg, col=GOLD, speed=1.0, start=0.0, pulse=True, label2=None):
    """rate per (video) second after speed-up; counter ticks up smoothly with a pulse on every unit."""
    def draw(img, lt, p, b):
        bgfill(img, bg, lt); n = start + rate * speed * lt; hud(img, fmt(n), big_sub, col)
        if pulse:
            fr = (n - int(n));
            for k in range(3):
                u = (lt * .5 + k / 3) % 1; ring(img, 540, 880, 80 + u * 380, 4, col, a=(1 - u) * .35)
            disc(img, 540, 880, 70 + 16 * (1 - fr), col, a=.9); glow(img, 540, 880, 200, col, .4)
        if label2: tx(img, label2, 540, 1200, 40, "bold", SOFT, a=clamp(lt / .8), maxw=900, shadow=False)
    return draw

# ---------------------------------------------------------------------------------------------- thermometers
def thermo_scene(big, sub, bg, items, vmax=None, col=GOLD, anchors=None, bottom=1230, hmax=620):
    """items: (label, value, color, shown_text)."""
    vm = vmax or max(v for _, v, _, _ in items); n = len(items)
    def draw(img, lt, p, b):
        bgfill(img, bg, lt); hud(img, big, sub, col)
        for i, (lab, v, c, shown) in enumerate(items):
            cx = 540 + (i - (n - 1) / 2) * (860 / n if n > 1 else 0); t0 = T(b, anchors[i], .5 + i * 1.5) if anchors else .5 + i * 1.5; u = eio(seg(lt, t0, t0 + 1.4)); h = hmax * v / vm * u
            box(img, cx - 46, bottom - hmax, cx + 46, bottom, 40, DIM, a=.55); box(img, cx - 46, bottom - h - 4, cx + 46, bottom, 40, c); disc(img, cx, bottom, 66, c); glow(img, cx, bottom - h, 90, c, .45 * u)
            tx(img, shown, cx, bottom - h - 70, 42, "black", WHITE, a=clamp(u * 2), maxw=300, shadow=False); tx(img, lab, cx, bottom + 100, 32, "bold", (225, 230, 250), maxw=300, shadow=False)
    return draw

# ---------------------------------------------------------------------------------------------- orbit
def orbit_scene(big, sub, bg, bodies, star=(255, 200, 80), star_r=46, days_per_s=30.0, show_arc=None, cx=540, cy=860):
    """bodies: dict(r, period, color, size, spin(optional period), label)."""
    def draw(img, lt, p, b):
        bgfill(img, bg, lt); hud(img, big, sub, GOLD); disc(img, cx, cy, star_r, star); glow(img, cx, cy, star_r * 4, star, .5)
        for bd in bodies:
            ring(img, cx, cy, bd["r"], 3, (80, 88, 130), a=.7); th = -math.pi / 2 + 2 * math.pi * (lt * days_per_s / bd["period"]) * (1 if not show_arc else 1)
            if show_arc is not None:
                th = -math.pi / 2 + 2 * math.pi * (show_arc[0] + (show_arc[1] - show_arc[0]) * eio(seg(lt, .5, b.dur - .5)))
                ellipse_ring(img, cx, cy, bd["r"], bd["r"], 10, bd["color"], a=.9, arc=(-math.pi / 2 + 2 * math.pi * show_arc[0], th))
            x, y = cx + bd["r"] * math.cos(th), cy + bd["r"] * math.sin(th)
            disc(img, x, y, bd["size"], bd["color"]); glow(img, x, y, bd["size"] * 2.4, bd["color"], .45)
            if bd.get("spin"):
                sa = 2 * math.pi * (lt * days_per_s / bd["spin"]); line(img, [(x, y), (x + bd["size"] * math.cos(sa), y + bd["size"] * math.sin(sa))], 5, (20, 20, 30))
            tx(img, bd["label"], x, y + bd["size"] + 40, 30, "bold", WHITE, maxw=260, shadow=False)
    return draw

# ---------------------------------------------------------------------------------------------- drive up to space
def drive_scene(big_fn, sub, hours=1.0, alt_max=100.0, u0=0.0, u1=1.0):
    def draw(img, lt, p, b):
        u = u0 + (u1 - u0) * eio(seg(lt, .4, b.dur - .6)); top = np.array((4, 4, 16)); low = np.array((70, 150, 255)); c1 = tuple(int(x) for x in low * (1 - u) + top * u); c2 = tuple(int(x) for x in (low * .5 + np.array((200, 220, 255)) * .5) * (1 - u) + np.array((10, 10, 30)) * u)
        img.paste(vgrad(c1, c2, key=("drv", c1, c2)))
        if u > .35: starfield(img, lt, 6)
        hud(img, big_fn(u), sub, WHITE)
        y = 1120 - 80 * u; box(img, 440, y - 70, 640, y, 22, (240, 90, 90)); box(img, 480, y - 110, 600, y - 60, 16, (200, 230, 255)); disc(img, 480, y + 2, 26, (30, 30, 40)); disc(img, 600, y + 2, 26, (30, 30, 40))
        for k in range(6): line(img, [(540 + (k - 2.5) * 30, y + 60 + ((lt * 400 + k * 90) % 540)), (540 + (k - 2.5) * 30, y + 100 + ((lt * 400 + k * 90) % 540))], 6, (255, 255, 255), a=.35 * (1 - u))
        tx(img, f"{alt_max * u:.0f} km up", 150, 520, 40, "black", WHITE, shadow=False); tx(img, f"{int(hours * u)}:{int(60 * (hours * u % 1)):02d} h", 930, 520, 40, "black", GOLD, shadow=False)
    return draw

# ---------------------------------------------------------------------------------------------- converge: a crowd squeezes into a tiny cube
def converge_scene(big, sub, bg, label_end, cols=20, rows=20, anchor=None):
    def draw(img, lt, p, b):
        bgfill(img, bg, lt); hud(img, big, sub, GOLD); ta = T(b, anchor, 1.2) if anchor else 1.2; u = eio(seg(lt, ta, ta + 2.4)); pitch = 40
        for i in range(cols * rows):
            gx = 540 + ((i % cols) - cols / 2 + .5) * pitch; gy = 870 + ((i // cols) - rows / 2 + .5) * pitch
            x = gx + (540 - gx) * u; y = gy + (870 - gy) * u; disc(img, x, y, 13 - 9 * u, GOLD if u < .98 else WHITE, a=.95)
        if u > .96: box(img, 515, 845, 565, 895, 4, WHITE, a=.95); glow(img, 540, 870, 120, WHITE, .5 * clamp((u - .96) * 25))
        if u > .9: tx(img, label_end, 540, 1060, 40, "black", WHITE, a=clamp((u - .9) * 10), maxw=900, shadow=False)
    return draw

# ---------------------------------------------------------------------------------------------- float (planet in a tub)
def float_scene(big, sub, bg, ring_planet=True):
    def draw(img, lt, p, b):
        bgfill(img, bg, lt); hud(img, big, sub, GOLD)
        tx_y = 1180; box(img, 220, 760, 860, tx_y, 70, (210, 218, 235)); w = 720 + 6 * math.sin(lt * 1.6)
        box(img, 240, 800, 840, tx_y - 18, 55, (80, 150, 255), a=.85)
        d = eio(seg(lt, .3, 1.8)); y = 560 + 215 * d + 9 * math.sin(lt * 2.2) * d; cx = 540 + 6 * math.sin(lt * 1.3)
        disc(img, cx, y, 170, (232, 205, 150)); disc(img, cx, y, 170, (255, 235, 190), a=.35)
        for k in range(3): line(img, [(cx - 160, y - 30 + k * 40), (cx + 160, y - 30 + k * 40)], 8, (214, 180, 120), a=.5)
        if ring_planet: ellipse_ring(img, cx, y, 300, 62, 14, (240, 220, 180), a=.9, rot=-.18)
        box(img, 240, 800, 840, tx_y - 18, 55, (80, 150, 255), a=.0)
        if d > .8: tx(img, "WATER LINE", 880, 805, 24, "bold", WHITE, a=clamp((d - .8) * 5), align="right", shadow=False)
    return draw

# ---------------------------------------------------------------------------------------------- word slam (hooks and punchlines)
def words_scene(lines, bg, cols=None, size=110, sub=None):
    def draw(img, lt, p, b):
        bgfill(img, bg, lt); n = len(lines)
        for i, s in enumerate(lines):
            t0 = .3 + i * (b.dur * .62 / n); u = pop(seg(lt, t0, t0 + .35)); c = (cols[i] if cols else WHITE)
            if 0 < lt - t0 < .6: ring(img, 540, 700 + (i - (n - 1) / 2) * 190, 60 + (lt - t0) * 900, 6, c, a=max(0, .5 - (lt - t0) * .9))
            sz = size if len(s) <= 13 else (int(size * .74) if len(s) <= 19 else int(size * .6))
            tx(img, s, 540, 700 + (i - (n - 1) / 2) * 190, sz, "black", c, a=clamp(u * 3), scale=clamp(u, 0, 1.05), maxw=1000)
        if sub: tx(img, sub, 540, 1180, 38, "bold", SOFT, a=clamp((lt - 1.0) / .6), maxw=900, shadow=False)
    return draw

# ---------------------------------------------------------------------------------------------- reel assembly
def make_reel(num, name, title, beats, style="cine", story="", gain=.5):
    bs = [Clean(n, d, 3.0, cut="cut", push=0) for n, d in beats]
    return Reel(f"{num}_{name}", bs, style=style, seed=num, gain_music=gain, snap=False, grid=0, safe_zone=False, vo=[(i, n) for i, (n, d) in enumerate(beats)], title=title, caption="x", story=story)
