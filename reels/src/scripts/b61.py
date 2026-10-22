"""Batch 61: premium scale explainers drawn as real scenes. The domino that knocks over the Moon: a log-zoom camera follows the toppling chain from 5 mm to 400,000 km."""
import math, colorsys
import numpy as np
from PIL import Image, ImageDraw
from scripts.common import *
from motion import *
import motion, voice

GY = 1330; FOC = 440; FOC_BIG = 760; KNOCK_K = 63.55; TC = math.radians(30); TMAX = math.radians(80)
def h_of(k): return 0.005 * 1.5 ** (k - 1)
def x_of(k): return 0.007 * (1.5 ** (k - 1) - 1)
def theta(phi):
    if phi <= 0: return 0.0
    if phi <= 1: return TC * phi * phi
    if phi <= 2: u = phi - 1; return TC + 2 * TC * u + (TMAX - 3 * TC) * u * u
    return TMAX
def fmt(h):
    if h < .1: return f"{h * 1000:.1f} mm" if h < .01 else f"{h * 1000:.0f} mm"
    if h < 1: return f"{h * 100:.0f} cm"
    if h < 1000: return f"{h:.1f} m" if h < 100 else f"{h:.0f} m"
    km = h / 1000
    return f"{km:.1f} km" if km < 100 else f"{km:,.0f} km"
def dcol(j, l=1.0): r, g, b = colorsys.hsv_to_rgb((.58 + .017 * j) % 1, .38, l); return (int(r * 255), int(g * 255), int(b * 255))

SKY = [(0, (74, 62, 138)), (3e3, (30, 58, 140)), (25e3, (12, 20, 72)), (100e3, (4, 5, 14))]
_xp = np.sqrt([a for a, _ in SKY]); _stars2 = np.random.RandomState(5).rand(260, 3)
def sky(s):
    ys = np.arange(H); alt = np.maximum(0, (GY - ys) / s); xs = np.sqrt(alt)
    arr = np.stack([np.interp(xs, _xp, [c[i] for _, c in SKY]) for i in range(3)], 1); arr[ys > GY] = (12, 11, 26)
    img = Image.fromarray(np.repeat(arr[:, None, :], W, 1).astype(np.uint8)); d = ImageDraw.Draw(img)
    for x, y, b in _stars2:
        yy = y * GY; a = (GY - yy) / s; k = clamp((a - 15e3) / 60e3)
        if k > 0.02: c = int(230 * k * (.4 + .6 * b)); d.ellipse([x * W - 1.5, yy - 1.5, x * W + 1.5, yy + 1.5], fill=(c, c, min(255, c + 20)))
    d.rectangle([0, GY, W, GY + 3], fill=(150, 140, 200))
    return img

def poly(img, pts, fill, a=1.0):
    xs = [p[0] for p in pts]; ys = [p[1] for p in pts]; x0 = int(min(xs)) - 2; y0 = int(min(ys)) - 2; w = int(max(xs)) - x0 + 3; h = int(max(ys)) - y0 + 3
    if w <= 0 or h <= 0 or w > 4000 or h > 4000: return
    ss = 2 if max(w, h) < 900 else 1; p = Image.new("RGBA", (w * ss, h * ss), (0, 0, 0, 0)); ImageDraw.Draw(p).polygon([((x - x0) * ss, (y - y0) * ss) for x, y in pts], fill=ink(fill) + (int(255 * a),))
    if ss > 1: p = p.resize((w, h), Image.LANCZOS)
    img.paste(p, (x0, y0), p)

def rot(pt, th, px, py): x, y = pt; return (px + x * math.cos(th) - y * math.sin(th), py + x * math.sin(th) + y * math.cos(th))

def domino(img, j, k, kc, s, X0):
    hh = h_of(j) * s
    if hh < 3: return
    th = theta(k - j); t = hh / 5; px = X0 + (x_of(j) + h_of(j) / 5 - x_of(kc)) * s
    if px < -hh - 50 or px > W + hh + 50: return
    R_ = lambda pt: rot(pt, th, px, GY)
    body = [R_((-t, 0)), R_((0, 0)), R_((0, -hh)), R_((-t, -hh))]; c = dcol(j)
    if 0 < th < TMAX and hh > 40: glow(img, *R_((-t / 2, -hh / 2)), hh * .75, c, .22)
    poly(img, body, c)
    if hh > 30:
        poly(img, [R_((-t * .14, 0)), R_((0, 0)), R_((0, -hh)), R_((-t * .14, -hh))], dcol(j, .62))   # shaded trailing face
        poly(img, [R_((-t, -hh)), R_((0, -hh)), R_((0, -hh * .93)), R_((-t, -hh * .93))], dcol(j, 1.0) if False else (255, 255, 255))   # bright top cap
        poly(img, [R_((-t, 0)), R_((-t * .82, 0)), R_((-t * .82, -hh)), R_((-t, -hh))], dcol(j, .8))   # shaded leading face
        poly(img, [R_((-t, -hh * .5 - 1.5)), R_((0, -hh * .5 - 1.5)), R_((0, -hh * .5 + 1.5)), R_((-t, -hh * .5 + 1.5))], (40, 40, 70), .75)   # centre divider

def sparks(img, j, k, kc, s, X0):
    tau = k - (j + 1)
    if not (0 < tau < .7): return
    hj = h_of(j) * s
    if hj < 20: return
    px = X0 + (x_of(j) + h_of(j) / 5 - x_of(kc)) * s; cx, cy = rot((0, -hj), TC, px, GY); r = np.random.RandomState(j * 7 + 1)
    for q in range(12):
        a = -math.pi / 2 + (r.rand() - .5) * 2.6; d = tau * hj * (.5 + r.rand()) * 1.1; x = cx + math.cos(a) * d; y = cy + math.sin(a) * d + 160 * tau * tau * hj / 400
        disc(img, x, y, max(1.5, 7 * (1 - tau / .7)), (255, 226, 120), 1 - tau / .7)

# ---- reference silhouettes (true to world scale)
def r_person(img, cx, hpx, a): person(img, cx, GY, hpx, (150, 160, 215), a)
def r_house(img, cx, hpx, a):
    w = hpx * 1.25; c = (110, 118, 175)
    box(img, cx - w / 2, GY - hpx * .62, cx + w / 2, GY, 0, c, a); poly(img, [(cx - w * .58, GY - hpx * .6), (cx, GY - hpx), (cx + w * .58, GY - hpx * .6)], (90, 96, 150), a)
    box(img, cx - w * .08, GY - hpx * .3, cx + w * .08, GY, 0, (60, 64, 110), a)
def r_tower(img, cx, hpx, a):
    c = (120, 128, 190)
    for y0, y1, hw in ((0, .20, .115), (.20, .62, .08), (.62, .75, .055), (.75, .86, .032), (.86, .90, .018)):
        box(img, cx - hw * hpx, GY - y1 * hpx, cx + hw * hpx, GY - y0 * hpx, 0, c, a)
    poly(img, [(cx - .004 * hpx, GY - .9 * hpx), (cx + .004 * hpx, GY - .9 * hpx), (cx, GY - hpx)], c, a)
def r_mount(img, cx, hpx, a):
    pts = [(-1.5, 0), (-.8, .38), (-.5, .3), (-.2, .72), (0, 1.0), (.18, .8), (.35, .9), (.6, .45), (.85, .5), (1.6, 0)]
    poly(img, [(cx + x * hpx, GY - y * hpx) for x, y in pts], (92, 100, 160), a); poly(img, [(cx - .09 * hpx, GY - .8 * hpx), (cx, GY - hpx), (cx + .1 * hpx, GY - .82 * hpx), (cx + .03 * hpx, GY - .86 * hpx)], (235, 238, 255), a * .9)
REFS = [("YOU", 1.75, r_person, 120), ("HOUSE", 8.0, r_house, 200), ("EMPIRE STATE", 443.0, r_tower, 170), ("MOUNT EVEREST", 8849.0, r_mount, 300)]

def moon(img, x, y, r, a=1.0):
    glow(img, x, y, r * 2.4, (190, 205, 255), .4 * a); disc(img, x, y, r, (228, 228, 238), a)
    for dx, dy, rr in ((-.3, -.2, .22), (.25, .15, .3), (-.05, .5, .15), (.42, -.42, .12), (-.5, .3, .1)): disc(img, x + dx * r, y + dy * r, rr * r, (198, 198, 214), a)
def iss(img, x, y, a=1.0):
    box(img, x - 14, y - 10, x + 14, y + 10, 4, (210, 214, 230), a)
    for sx in (-1, 1):
        box(img, x + sx * 30 - 26, y - 22, x + sx * 30 + 26, y + 22, 2, (80, 130, 230), a); box(img, x + sx * 90 - 26, y - 22, x + sx * 90 + 26, y + 22, 2, (80, 130, 230), a)
    line(img, [(x - 110, y), (x + 110, y)], 4, (190, 195, 215), a)
def altline(img, y, label, a=1.0):
    for x in range(0, W, 44): line(img, [(x, y), (x + 24, y)], 3, (255, 214, 0), a * .8)
    tx(img, label, 540, y - 28, 30, "bold", (255, 224, 90), a=a, shadow=False, maxw=900)

def draw_world(img, k, kc, s, lt, X0=400, moon_knock=0.0, labels=True):
    img.paste(sky(s))
    for name, hm, fn, cx in REFS:
        hpx = hm * s
        if 14 < hpx < 1500:
            a = .42 * clamp((1500 - hpx) / 500) * clamp((hpx - 14) / 30); fn(img, cx, hpx, a)
            if labels and hpx > 110 and GY - hpx > 400: tx(img, f"{name} · {fmt(hm)}", min(830, max(270, cx + (60 if name == "MOUNT EVEREST" else 0))), GY - hpx - 36, 30, "bold", (215, 222, 255), a=min(1, a * 3), shadow=False, maxw=560)
    y100 = GY - 100e3 * s
    if 40 < y100 < GY - 20: altline(img, y100, "EDGE OF SPACE · 100 km") if abs(y100 - 300) > 120 else None
    yi = GY - 420e3 * s
    if 40 < yi < GY - 20: iss(img, 560, yi); tx(img, "SPACE STATION · 420 km", 600, yi + 52, 28, "bold", (200, 210, 255), shadow=False, maxw=700)
    ym = GY - 384.4e6 * s
    if -80 < ym < GY - 20:
        kn = eio(moon_knock); mx = 400 + FOC_BIG * .35 + 900 * kn; my = ym - 160 * kn; moon(img, mx, my, 62, clamp(1 - kn * 1.1))
        if kn < .05 and abs(ym - 300) > 120: altline(img, ym, "THE MOON · 384,400 km")
        if 0 < moon_knock < .5: glow(img, 400 + FOC_BIG * .35, ym, 300 * (1 - moon_knock * 2), (255, 240, 200), .9 * (1 - moon_knock * 2)); ring(img, 400 + FOC_BIG * .35, ym, 40 + 700 * moon_knock, 8, (255, 255, 255), 1 - moon_knock * 2)
    j0 = int(k) - 17
    for j in range(max(1, j0), min(63, int(k) + 3) + 1): domino(img, j, k, kc, s, X0)
    for j in range(max(1, int(k) - 1), min(62, int(k) + 1) + 1): sparks(img, j, k, kc, s, X0)

class DBeat(Beat):
    """A narrated shot that rides the domino chain: kf(b) -> [(t, k)] says which domino is toppling at which time."""
    def __init__(self, narr, kf, title=None, extra=None, ease=False, knock=False, hud=True, cutname="cut"):
        self.kf, self.extra, self.ease, self.knock, self.hud, self.title = kf, extra, ease, knock, hud, title; self._pts = None; self._auto = None; self._cues = []
        super().__init__(narr, self._d, 3.0, push=0, cut=cutname)
    cues = property(lambda self: list(self._cues) + (self._auto_cues() if hasattr(self, "kf") else []), lambda self, v: setattr(self, "_cues", list(v)))
    def K(self, lt):
        if self._pts is None: self._pts = sorted(self.kf(self))
        P = self._pts
        if lt <= P[0][0]: return P[0][1]
        for (t0, k0), (t1, k1) in zip(P, P[1:]):
            if lt <= t1: u = (lt - t0) / max(1e-6, t1 - t0); return k0 + (k1 - k0) * (eio(u) if self.ease else u)
        return P[-1][1]
    def knock_u(self, lt):
        k = self.K(lt); return clamp((k - 63.55) / .5) if self.knock else 0.0
    def _auto_cues(self):
        if self._auto is None:
            out = []; prev = self.K(0); t = 0.0
            while t < self.dur:
                t += 1 / 120; k = self.K(t)
                for m in range(int(prev) + 1, int(k) + 1):
                    if k > prev and m >= 2: out.append((t, "clk%d" % max(120, int(1500 * .93 ** m)), .9 if m < 40 else .6))
                if self.knock and prev < 63.55 <= k: out += [(t, "hit", 1.0), (t, "whoosh", .8)]
                prev = k
            self._auto = out
        return self._auto
    def render(self, lt):
        p = clamp(lt / self.dur); img = Image.new("RGB", (W, H)); BOXES.clear(); self.draw(img, lt, p, self)
        if self.cap and self.narr:
            BOXES.append((150, CH * .74 - 58, CW - 150, CH * .74 + 58, '<caption>', 1.0)); caption(img, self.narr, lt, self.speech_len(), real=self.real_times())
        self.boxes = list(BOXES); ImageDraw.Draw(img).rectangle([0, 0, int(CW * clamp(lt / self.dur)), 7], fill=(255, 214, 0)); return img
    def _d(self, img, lt, p, b):
        k = self.K(lt); kc = min(k, 63.0); s = (FOC + (FOC_BIG - FOC) * clamp((kc - 58) / 4)) / h_of(kc); draw_world(img, k, kc, s, lt, moon_knock=self.knock_u(lt) if self.knock else (clamp((k - 63.55) / .5) if k > 63.6 else 0))
        if self.hud:
            j = min(63, max(1, int(k))); hh = h_of(j)
            tx(img, f"#{j}", 250, 300, 130, "black", (255, 214, 0), maxw=420); tx(img, "DOMINO", 250, 400, 30, "bold", (190, 198, 235), shadow=False)
            tx(img, fmt(hh), 760, 300, 104 if len(fmt(hh)) <= 8 else 78, "black", (255, 255, 255), maxw=560); tx(img, "TALL", 760, 400, 30, "bold", (190, 198, 235), shadow=False)
        if self.title: self.title(img, lt, b)
        if self.extra: self.extra(img, lt, b, k, s)

def A(b, w, d=None, occ=0): return b.at(w, occ, d)

def finger(img, lt, b, k, s):
    t_tip = A(b, "tip", 1.6); phi = k - 1; hh = h_of(1) * s; t = hh / 5; th = theta(phi)
    tip = rot((-t, -hh * .86), th, 400 + (h_of(1) / 5) * s, GY)
    dx = -340 * (1 - eio((lt - (t_tip - .9)) / .85)); a = 1 - clamp((phi - .5) / .5)
    if a <= 0: return
    x1 = tip[0] - 4 + dx; y = tip[1]
    box(img, x1 - 560, y - 44, x1, y + 44, 44, (236, 196, 166), a); box(img, x1 - 70, y - 30, x1 - 6, y + 4, 18, (250, 222, 205), a * .8)
def ev_dim(img, lt, b, k, s):
    a = clamp((lt - A(b, "five", .3)) / .3); hh = h_of(1) * s
    if k < 1.5 and a > 0:
        x = 330; line(img, [(x, GY), (x, GY - hh)], 5, (255, 214, 0), a); line(img, [(x - 14, GY), (x + 14, GY)], 5, (255, 214, 0), a); line(img, [(x - 14, GY - hh), (x + 14, GY - hh)], 5, (255, 214, 0), a)
        tx(img, "5 mm", x - 90, GY - hh / 2, 46, "black", (255, 214, 0), a=a, maxw=220)
    ax = clamp((lt - A(b, "bigger", 5)) / .4)
    if ax > 0 and k < 4: tx(img, "×1.5", 760, 540, 96, "black", (255, 226, 120), a=ax, scale=pop(ax))
def ev_x15(img, lt, b, k, s):
    tau = k - int(k)
    tx(img, "each one ×1.5", 540, 560, 56, "black", (255, 226, 120), a=.9, maxw=900)
    ya = clamp((lt - A(b, "nineteen", 99)) / .4)
def t_hook(img, lt, b):
    tx(img, "ONE DOMINO", 540, 215, 108, "black", (255, 255, 255), scale=pop(lt / .35), maxw=1000)
    tx(img, "CAN KNOCK OVER", 540, 345, 76, "black", (255, 255, 255), a=clamp((lt - .25) / .15), scale=pop((lt - .25) / .35), maxw=1000)
    tx(img, "THE MOON", 540, 470, 120, "black", (255, 214, 0), a=clamp((lt - .55) / .15), scale=pop((lt - .55) / .35), maxw=1000)
def t_paper(img, lt, b, k, s):
    a = clamp((lt - A(b, "paper", .4)) / .3); tx(img, "ON PAPER", 540, 520, 96, "black", (255, 214, 0), a=a, scale=pop(a), maxw=1000)
    c = clamp((lt - A(b, "friction", 2.0)) / .3); tx(img, "real life: a handful", 540, 640, 50, "black", (255, 140, 150), a=c, maxw=1000)
def t_end(img, lt, b, k, s):
    a = clamp((lt - .6) / .4)
    if a > 0: tx(img, "SMALL THINGS COMPOUND", 540, 560, 70, "black", (255, 255, 255), a=a, scale=pop(a), maxw=1000)

def domino_moon():
    N = [
     ("One domino can knock over the Moon.", [lambda b: [(0, 62.0), (A(b, "moon", b.dur - .5) - .1, 63.6), (b.dur, 64.2)], dict(title=t_hook, hud=False, knock=True)]),
     ("Take a domino five millimeters tall. Tip it over, and it can knock down one fifty percent bigger. That one can knock down one bigger still.", [lambda b: [(0, 1.0), (A(b, "tip", 1.6), 1.0), (A(b, "bigger", b.dur - .6), 3.0), (b.dur, 3.3)], dict(extra=lambda i, l, b, k, s: (ev_dim(i, l, b, k, s), finger(i, l, b, k, s)))]),
     ("Physicist Lorne Whitehead proved it in nineteen eighty three. Each domino can topple one one and a half times its size.", [lambda b: [(0, 3.3), (b.dur, 14.4)], dict(extra=lambda i, l, b, k, s: tx(i, "each one ×1.5", 540, 560, 64, "black", (255, 226, 120), maxw=900) if l > A(b, "each", 3) else None)]),
     ("By domino sixteen, you're looking up at it. Over two meters tall, taller than you.", [lambda b: [(0, 14.4), (A(b, "sixteen", .8), 16.0), (b.dur, 17.2)], dict(ease=True)]),
     ("Nineteen is a house. Twenty-nine is the Empire State Building. Thirty-seven is taller than Everest.", [lambda b: [(0, 17.2), (A(b, "nineteen", .3), 19.0), (A(b, "twentynine", 2), 29.0), (A(b, "thirtyseven", 4), 37.0), (b.dur, 38.0)], dict(ease=True)]),
     ("Forty-three, and it's in space. A hundred kilometers up. Forty-six passes the space station.", [lambda b: [(0, 38.0), (A(b, "fortythree", 1), 43.0), (A(b, "fortysix", 2.5), 46.0), (b.dur, 46.8)], dict(ease=True)]),
     ("Keep going. Sixty-three dominoes in all. The last one stands over four hundred thousand kilometers tall. Taller than the distance to the Moon.", [lambda b: [(0, 46.8), (A(b, "tall", b.dur - 2.5), 62.9), (A(b, "moon", b.dur - .5) - .05, 63.55), (b.dur, 64.3)], dict(knock=True)]),
     ("On paper, anyway. Friction kills this in real life, and nobody has built more than a handful. The math doesn't care.", [lambda b: [(0, 64.3), (b.dur - .2, 8.0)], dict(ease=True, extra=t_paper)]),
     ("Sixty-three steps. Small things compound, if something keeps pushing them.", [lambda b: [(0, 8.0), (b.dur - .3, 64.2)], dict(ease=True, knock=True, extra=t_end)]),
    ]
    beats = []
    for n, (kf, kw) in N:
        beats.append(DBeat(n, kf, **kw))
    return Reel("401_domino_moon", beats, style="cine", seed=401, gain_music=.5, snap=False, grid=0, safe_zone=False, vo=[(i, n) for i, (n, _) in enumerate(N)],
        title="one domino can knock over the Moon", caption="63 dominoes, each 1.5x bigger than the last, and the final one is taller than the distance to the Moon. send this to someone who thinks small things don't matter",
        story="Whitehead 1983 (Am. J. Phys. 51:182): a domino can topple one up to about 1.5x its size. Start at 5 mm: h_n = 5 mm x 1.5^(n-1). n=16 -> 2.2 m; n=19 -> 7.4 m; n=29 -> 426 m (Empire State roof 381 m, 443 m with antenna); n=37 -> 10.9 km (Everest 8.85 km); n=43 -> 124 km (past the 100 km Karman line); n=46 -> 420 km (ISS altitude); n=63 -> 413,645 km > 384,400 km (mean Earth-Moon distance). Theory only: friction and strength limit real chains.")

REELS = dict(domino_moon=domino_moon)
