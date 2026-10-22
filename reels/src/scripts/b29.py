"""Batch 29: satisfying physics explainers (simulated, narrated)."""
import math, os
import numpy as np
from PIL import Image, ImageDraw
from scripts.common import *
from motion import *
import motion, voice

G = 9.81
def ballspr(img, x, y, r, col=(255, 90, 100), squash=1.0, a=1.0):
    ry = r * squash; rx = r / math.sqrt(max(.5, squash))
    glow(img, x, y, r * 2.2, col, .35 * a)
    p, ss = motion._patch(2 * rx + 8, 2 * ry + 8, 3); d = ImageDraw.Draw(p); cx, cy = (rx + 4) * ss, (ry + 4) * ss
    d.ellipse([cx - rx * ss, cy - ry * ss, cx + rx * ss, cy + ry * ss], fill=motion.ink(col) + (int(255 * a),))
    d.ellipse([cx - rx * .62 * ss, cy - ry * .72 * ss, cx - rx * .05 * ss, cy - ry * .2 * ss], fill=(255, 255, 255, int(110 * a)))
    p = p.resize((int(2 * rx + 8), int(2 * ry + 8)), Image.LANCZOS); img.paste(p, (int(x - rx - 4), int(y - ry - 4)), p)

def floor(img, y, col=(40, 44, 90), refl=True):
    d = ImageDraw.Draw(img); d.rectangle([0, y, CW, CH], fill=col); d.line([(0, y), (CW, y)], fill=(160, 170, 255), width=4)
    for k in range(1, 12): d.line([(CW / 2 + (k - 6) * 40, y), (CW / 2 + (k - 6) * 190, CH)], fill=mix(col, (120, 130, 220), .25), width=2)
    for k in range(1, 7): yy = y + k * k * 14; d.line([(0, yy), (CW, yy)], fill=mix(col, (120, 130, 220), .2), width=2)

def bounce_series(e, t0):
    """list of (start, duration, v0) flights after the first fall."""
    out = []; t = t0
    for n in range(1, 60):
        f = 2 * t0 * e ** n; out.append((t, f, G * t0 * e ** n)); t += f
    return out

def height_at(tt, e, t0, h0=1.0):
    if tt < t0: return h0 - .5 * G * tt * tt
    for st, f, v0 in bounce_series(e, t0):
        if st <= tt < st + f: u = tt - st; return v0 * u - .5 * G * u * u
    return 0.0

def bounce_forever():
    E = math.sqrt(.5); T0 = math.sqrt(2 / G); TOTAL = T0 + sum(f for _, f, _ in bounce_series(E, T0))
    FY = 1260; SC = 700          # floor y, pixels per metre
    BT = [T0] + [st + f for st, f, v in bounce_series(E, T0)]     # moments of impact
    def scene(img, lt, tt, b, trail=True, show_time=True, show_n=True, ball_col=(255, 90, 100)):
        img.paste(vgrad((14, 12, 40), (40, 24, 80), key="bnc")); floor(img, FY)
        d = ImageDraw.Draw(img)
        for hm, lab in ((1.0, "1 m"), (.5, "½ m"), (.25, "¼ m")):
            y_ = FY - SC * hm - 54; 
            for xx in range(60, 1000, 40): d.line([(xx, y_), (xx + 18, y_)], fill=(90, 100, 170), width=2)
            tx(img, lab, 110, y_ - 24, 30, "bold", (150, 160, 230), shadow=False)
        h = height_at(tt, E, T0); y = FY - SC * h - 64; sq = 1.0
        for k in range(1, 8):
            hh = height_at(max(0, tt - k * .02), E, T0)
            if trail: ballspr(img, 540, FY - SC * hh - 64, 64, ball_col, 1.0, .10 * (8 - k) / 7)
        for tb in BT:                    # impact shock rings
            u = (tt - tb) / .45
            if 0 <= u < 1: ring(img, 540, FY + 14, 60 + u * 340, 5, (160, 190, 255), (1 - u) * .8); glow(img, 540, FY, 130, (160, 190, 255), (1 - u) * .45)
        if h < .025: sq = .7
        sh = 1 - min(1, h) * .55; box(img, 540 - 64 * sh, FY + 8, 540 + 64 * sh, FY + 26, 9, (8, 6, 22), .9)
        ballspr(img, 540, y, 64, ball_col, sq)
        if show_time: tx(img, f"{min(tt, TOTAL):.2f} s", 540, 300, 130, "black", (255, 214, 0))
        if show_n:
            n = sum(1 for tb in BT[1:] if tt >= tb); tx(img, f"bounce {n}", 540, 430, 54, "bold", WHITE)
    def hook(img, lt, p, b):
        scene(img, lt, (lt % 2.2) * .9, b, show_time=False, show_n=False); tx(img, "HOW LONG UNTIL", 540, 300, 76, "black", WHITE, scale=pop(lt / .4)); tx(img, "IT STOPS?", 540, 410, 110, "black", (255, 214, 0), scale=pop((lt - .2) / .4))
    def setup(img, lt, p, b):
        img.paste(vgrad((14, 12, 40), (40, 24, 80), key="bnc")); floor(img, FY); ballspr(img, 540, FY - SC - 54, 54)
        d = ImageDraw.Draw(img); a = clamp(lt / .5); line(img, [(700, FY - 54), (700, FY - SC - 54)], 5, (255, 214, 0), a); tx(img, "1 meter", 840, FY - SC / 2 - 54, 54, "black", (255, 214, 0), a=a)
        tt = b.at("half", default=2.0); u = clamp((lt - tt) / .5); ballspr(img, 540, FY - SC * .5 - 54, 54, (255, 90, 100), 1.0, .5 * u); line(img, [(380, FY - SC * .5 - 54), (700, FY - SC * .5 - 54)], 4, (140, 220, 255), u); tx(img, "half as high", 270, FY - SC * .5 - 100, 40, "black", (140, 220, 255), a=u, maxw=300)
    def first_fall(img, lt, p, b):
        tt = min(T0 - .001, lt * (T0 / max(.8, b.at("seconds", default=2.4)))) if False else lt * .5
        scene(img, lt, min(lt * .5, T0 + .6), b, show_n=False); tx(img, "first fall: 0.45 s", 540, 520, 56, "black", (140, 220, 255), a=clamp((lt - .5) / .3))
    def second(img, lt, p, b):
        scene(img, lt, T0 + lt * .45, b); tx(img, "up and down: 0.64 s", 540, 520, 56, "black", (140, 220, 255), a=clamp((lt - .4) / .3))
    def third(img, lt, p, b):
        scene(img, lt, T0 + 2 * T0 * E + lt * .5, b); 
        for i, (txt, t_) in enumerate((("0.45 s", "Then"), ("0.32 s", "Then"))): tx(img, txt, 360 + i * 360, 560, 70, "black", (140, 220, 255), a=clamp((lt - .5 - i * .9) / .3))
        tx(img, "each bounce ≈ 70% of the last", 540, 660, 46, "bold", WHITE, a=clamp((lt - 2.2) / .3))
    def blur(img, lt, p, b):
        rate = 1 + 9 * eio(p); scene(img, lt, T0 + 1.4 + lt * rate * .6, b); tx(img, "faster... and faster...", 540, 540, 60, "black", (255, 110, 150), a=clamp(lt / .4))
    def zeno(img, lt, p, b):
        img.paste(vgrad((14, 12, 40), (40, 24, 80), key="bnc2")); tx(img, "infinitely many bounces", 540, 300, 68, "black", WHITE, scale=pop(lt / .4), maxw=980); tx(img, "…in finite time", 540, 440, 78, "black", (255, 214, 0), a=clamp((lt - 1.6) / .3), scale=pop((lt - 1.6) / .4))
        fl = bounce_series(E, T0); x0, x1 = 80, 1000; scale = (x1 - x0) / (TOTAL * 1.0)
        bt = b.at("infinite", default=0); k = int(clamp((lt - .6) / .12, 0, 22))
        ImageDraw.Draw(img).rectangle([x0, 800, x1, 860], outline=(120, 130, 200), width=3)
        segs = [(0, T0)] + [(st, f) for st, f, v in fl[:22]]
        for i, (st, f) in enumerate(segs[:k + 1]): box(img, x0 + st * scale, 802, max(x0 + st * scale + 2, x0 + (st + f) * scale - 2), 858, 2, mix((255, 110, 150), (255, 214, 0), i / 22), 1.0)
        tx(img, "each block = one bounce", 540, 940, 42, "bold", (200, 210, 255), a=clamp((lt - .8) / .3))
    def total(img, lt, p, b):
        img.paste(vgrad((14, 12, 40), (40, 24, 80), key="bnc3")); v = TOTAL * eio(seg(lt, .2, b.dur - .8)); tx(img, f"{v:.2f}", 540, 700, 300, "black", (255, 214, 0)); tx(img, "seconds. then it stops.", 540, 920, 70, "black", WHITE, a=clamp((lt - 1.2) / .3))
        x = 80 + 920 * min(1, v / TOTAL); line(img, [(80, 1100), (x, 1100)], 18, (255, 214, 0)); disc(img, x, 1100, 22, WHITE)
    def formula(img, lt, p, b):
        img.paste(vgrad((14, 12, 40), (40, 24, 80), key="bnc4")); tx(img, "1 + ½ + ¼ + ⅛ + …", 540, 520, 90, "black", WHITE, scale=pop(lt / .4), maxw=1000); tx(img, "= 2", 540, 700, 200, "black", (255, 214, 0), a=clamp((lt - 1.2) / .3), scale=pop((lt - 1.2) / .4))
        tx(img, "Zeno's paradox, solved by math", 540, 960, 52, "bold", (200, 220, 255), a=clamp((lt - 2.2) / .3))
    N = [
     ("Drop a ball, and it bounces. And bounces. And bounces. So how long until it stops?", hook, "whip"),
     ("Say it's a one meter drop, and every bounce reaches half the height of the last.", setup, "flash"),
     ("The first fall takes about point four five seconds.", first_fall, "zoom"),
     ("The next bounce, up and back down, takes about point six four.", second, "whip"),
     ("Then point four five. Then point three two. Each bounce lasts about seventy percent of the one before.", third, "flash"),
     ("The bounces get shorter, and faster, and faster, until they blur into a buzz.", blur, "zoom"),
     ("Mathematically, the ball bounces infinitely many times. But every bounce is shorter than the one before, so all of them fit inside a finite time.", zeno, "whip"),
     ("Add up every bounce, and the ball is completely still after two point six three seconds. From the first drop, to lying flat on the floor.", total, "flash"),
     ("It's the same math as one plus a half, plus a quarter, plus an eighth. It never passes two.", formula, "zoom"),
     ("Infinite bounces, in under three seconds. That's Zeno's paradox, and math solves it.", None, "dip"),
    ]
    def ending(img, lt, p, b):
        scene(img, lt, (lt * .5) % 2.0 + .3, b, show_time=False, show_n=False); tx(img, "infinite bounces", 540, 330, 84, "black", WHITE); tx(img, "2.63 seconds", 540, 450, 100, "black", (255, 214, 0), scale=pop(lt / .4))
    N[-1] = (N[-1][0], ending, "dip")
    beats = [Beat(n, d, 3.0, cut=c, cues=[(0, "whoosh", .5)]) for n, d, c in N]
    # sound: a bounce click on every real bounce while the scenes play in real time
    r = Reel("187_bounce_forever", beats, style="synth", seed=187, snap=False, grid=4, safe_zone=False, vo=[(i, n) for i, (n, d, c) in enumerate(N)], title="how long does a bouncing ball take to stop",
        caption="a ball that bounces forever stops in 2.63 seconds. send this to the friend who says 'infinite means forever'", story="Drop from 1 m, each bounce reaches half the previous height (restitution sqrt(1/2)). First fall t0 = sqrt(2h/g) = 0.452 s; bounce n lasts 2 t0 e^n. Total = t0 (1+e)/(1-e) = 2.63 s. Infinitely many bounces, finite time (Zeno).")
    maps = {0: lambda lt: (lt % 2.2) * .9, 2: lambda lt: min(lt * .5, T0 + .6), 3: lambda lt: T0 + lt * .45, 4: lambda lt: T0 + 2 * T0 * E + lt * .5, 5: lambda lt: T0 + 1.4 + lt * (1 + 9 * eio(clamp(lt / beats[5].dur))) * .6}
    for bi, fn in maps.items():
        bt_ = beats[bi]; prev = fn(0); k = 0
        while k < int(bt_.dur * 100):
            lt_ = k / 100; cur = fn(lt_)
            for tb in BT:
                if prev < tb <= cur and (bi != 5 or tb < TOTAL - .15): bt_.cues.append((lt_, "tick" if tb > .9 else "thud", .55))
            prev = cur; k += 1
    return r


# ------------------------------------------------------------------ double pendulum (chaos)
def _dp_sim(th1, th2, T=62.0, dt=1 / 400.0):
    L1 = L2 = 1.0; m1 = m2 = 1.0; w1 = w2 = 0.0; out = []
    def f(s):
        a1, a2, v1, v2 = s; d = a1 - a2; den = 2 * m1 + m2 - m2 * math.cos(2 * d)
        A1 = (-G * (2 * m1 + m2) * math.sin(a1) - m2 * G * math.sin(a1 - 2 * a2) - 2 * math.sin(d) * m2 * (v2 * v2 * L2 + v1 * v1 * L1 * math.cos(d))) / (L1 * den)
        A2 = (2 * math.sin(d) * (v1 * v1 * L1 * (m1 + m2) + G * (m1 + m2) * math.cos(a1) + v2 * v2 * L2 * m2 * math.cos(d))) / (L2 * den)
        return (v1, v2, A1, A2)
    s = (th1, th2, w1, w2)
    for i in range(int(T / dt)):
        if i % 13 == 0: out.append((s[0], s[1]))
        k1 = f(s); k2 = f(tuple(s[j] + .5 * dt * k1[j] for j in range(4))); k3 = f(tuple(s[j] + .5 * dt * k2[j] for j in range(4))); k4 = f(tuple(s[j] + dt * k3[j] for j in range(4)))
        s = tuple(s[j] + dt / 6 * (k1[j] + 2 * k2[j] + 2 * k3[j] + k4[j]) for j in range(4))
    return out, dt * 13

_DP = None
def dp():
    global _DP
    if _DP is None:
        eps = math.radians(.001); A, step = _dp_sim(math.radians(120), math.radians(-10)); B, _ = _dp_sim(math.radians(120) + eps, math.radians(-10)); _DP = (A, B, step)
        # time when the two bobs are more than 0.5 m apart
    return _DP

def dp_xy(a, t, step, px=540, py=620, S=240):
    i = min(len(a) - 1, int(t / step)); t1, t2 = a[i]; x1 = px + S * math.sin(t1); y1 = py + S * math.cos(t1); x2 = x1 + S * math.sin(t2); y2 = y1 + S * math.cos(t2); return (x1, y1), (x2, y2)

def double_pendulum():
    A, B, STEP = dp()
    def sep(t): 
        (_, a), (_, b) = dp_xy(A, t, STEP), dp_xy(B, t, STEP); return math.hypot(a[0] - b[0], a[1] - b[1]) / 240.0
    TS = next((k * .05 for k in range(1, 1200) if sep(k * .05) > .5), 30.0)
    def scene(img, lt, tt, b, both=True, show_gap=True, label=True):
        img.paste(vgrad((8, 10, 30), (26, 18, 60), key="dp")); starfield(img, lt, 5)
        px, py = 540, 620
        for name, arr, col in (("A", A, (90, 220, 255)), ("B", B, (255, 90, 170))):
            if name == "B" and not both: continue
            pts = []
            for k in range(0, 70):
                (x1, y1), (x2, y2) = dp_xy(arr, max(0, tt - k * .018), STEP); pts.append((x2, y2))
            for k in range(0, len(pts) - 1, 2): line(img, [pts[k], pts[k + 1]], max(2, 9 - k * .12), col, max(0, .85 - k * .012))
            (x1, y1), (x2, y2) = dp_xy(arr, tt, STEP)
            line(img, [(px, py), (x1, y1), (x2, y2)], 7, mix(col, (255, 255, 255), .3), .9); glow(img, x2, y2, 60, col, .6); disc(img, x1, y1, 16, WHITE); disc(img, x2, y2, 22, col, 1.0, outline=WHITE, ow=3)
        disc(img, px, py, 12, (255, 214, 0))
        if show_gap and both:
            g = min(1.0, sep(tt) / 1.2); box(img, 140, 1262, 940, 1298, 18, (24, 28, 64), 1.0, outline=(110, 120, 200), ow=2); box(img, 142, 1264, 142 + 796 * max(.02, g), 1296, 16, mix((90, 220, 255), (255, 90, 170), g), 1.0)
            tx(img, "how far apart", 540, 1230, 34, "bold", (200, 210, 255), shadow=False); 
        tx(img, f"{tt:4.1f} s", 540, 170, 84, "black", (255, 214, 0))
    def hook(img, lt, p, b): scene(img, lt, lt * .9, b, both=False, show_gap=False); tx(img, "ONE PENDULUM,", 540, 1150, 62, "black", WHITE, a=clamp(lt / .3)); tx(img, "ON ANOTHER PENDULUM", 540, 1230, 62, "black", (255, 214, 0), a=clamp((lt - .3) / .3), maxw=1000)
    def second(img, lt, p, b): scene(img, lt, 3 + lt * .9, b, both=True, show_gap=True); tx(img, "difference: 0.001 degrees", 540, 1150, 58, "black", (255, 90, 170), a=clamp((lt - .6) / .3))
    def together(img, lt, p, b): scene(img, lt, 5 + lt * .8, b); tx(img, "you can't tell them apart", 540, 1150, 56, "black", WHITE, a=clamp((lt - .3) / .3))
    def grows(img, lt, p, b): scene(img, lt, 8 + lt * .8, b); tx(img, "a tiny difference keeps growing", 540, 1150, 52, "black", (255, 214, 0), a=clamp((lt - .3) / .3), maxw=1000)
    def diverge(img, lt, p, b): scene(img, lt, TS - 3 + lt * .9, b); tx(img, f"after {TS:.0f} seconds: totally different", 540, 1150, 50, "black", (255, 90, 170), a=clamp((lt - .8) / .3), maxw=1000)
    def chaos(img, lt, p, b):
        scene(img, lt, TS + 2 + lt * .8, b, show_gap=False); tx(img, "CHAOS", 540, 1170, 120, "black", WHITE, scale=pop(lt / .4)); tx(img, "simple rules. unpredictable future.", 540, 1290, 42, "bold", (200, 210, 255), a=clamp((lt - .6) / .3), maxw=1000)
    def weather(img, lt, p, b):
        img.paste(vgrad((10, 14, 40), (24, 40, 90), key="wx")); starfield(img, lt, 5)
        d = ImageDraw.Draw(img); days = 14 * eio(seg(lt, .3, b.dur - 1.0))
        tx(img, "weather forecasts", 540, 280, 80, "black", WHITE); tx(img, "fall apart after", 540, 390, 60, "bold", (200, 210, 255)); tx(img, f"{days:.0f} days", 540, 660, 220, "black", (255, 214, 0))
        for k in range(14): disc(img, 90 + k * 69, 900, 20, (255, 214, 0) if k < days else (70, 80, 130))
    def end(img, lt, p, b):
        scene(img, lt, TS + 6 + lt * .8, b, show_gap=False); tx(img, "two pendulums.", 540, 1150, 60, "black", WHITE); tx(img, "two completely different futures.", 540, 1235, 54, "black", (255, 214, 0), a=clamp((lt - .6) / .3), maxw=1000)
    N = [
     ("This is a double pendulum, one arm hanging from the end of another. Let go, and watch. Every move follows exact physics, but it looks wild.", hook, "whip"),
     ("Now start a second one, in almost the exact same spot. The difference between them is one thousandth of a degree.", second, "flash"),
     ("At first, they move together. You can't tell them apart, and it looks like nothing will change.", together, "zoom"),
     ("But a tiny difference keeps multiplying, with every single swing.", grows, "whip"),
     (f"After about {TS:.0f} seconds, they've gone completely separate ways.", diverge, "flash"),
     ("This is called chaos. The rules are simple, and perfectly known, but the future is still impossible to predict.", chaos, "zoom"),
     ("Weather works the same way. Tiny errors in today's measurements keep multiplying, which is why forecasts fall apart after about two weeks.", weather, "whip"),
     ("So the pendulum is not random. It is just unpredictable. Two pendulums. One thousandth of a degree. Two completely different futures.", end, "dip"),
    ]
    beats = [Beat(n, d, 3.0, cut=c, cues=[(0, "whoosh", .5)]) for n, d, c in N]
    return Reel("188_double_pendulum", beats, style="cine", seed=188, snap=False, grid=4, safe_zone=False, vo=[(i, n) for i, (n, d, c) in enumerate(N)], title="the double pendulum: chaos in 60 seconds",
        caption="two pendulums that start 0.001 degrees apart end up in completely different places. send this to someone who says 'it's predictable'", story=f"Simulated double pendulum (equal masses and lengths), RK4. Second pendulum starts 0.001 degrees away; the bobs separate by more than half a pendulum length after about {TS:.0f} s. Weather forecasts lose skill after roughly two weeks (Lorenz).")

# ------------------------------------------------------------------ fall times
def fall_times():
    HEIGHTS = [(1, "1 meter"), (10, "10 meters"), (100, "100 meters"), (1000, "1 kilometer")]
    def tf(h): return math.sqrt(2 * h / G)
    def dropscene(img, lt, h, label, b, color=(255, 214, 0)):
        img.paste(vgrad((10, 14, 44), (24, 40, 96), key="drop")); starfield(img, lt, 4)
        top, bot = 380, 1250; t = tf(h); tt = min(t, lt * (t / 3.2) * 1.0 if False else lt / 3.0 * t)
        d = ImageDraw.Draw(img); d.rectangle([0, bot, CW, CH], fill=(24, 34, 60)); d.line([(0, bot), (CW, bot)], fill=(160, 170, 255), width=4)
        d.line([(300, top), (300, bot)], fill=(90, 100, 170), width=3)
        for k in range(0, 11): y = bot - (bot - top) * k / 10; d.line([(280, y), (320, y)], fill=(130, 140, 210), width=2)
        frac = .5 * G * tt * tt / h; y = top + (bot - top) * min(1, frac)
        for k in range(1, 7):
            fr = .5 * G * max(0, tt - k * .03 * t) ** 2 / h; ballspr(img, 540, top + (bot - top) * min(1, fr), 36, color, 1.0, .08 * (7 - k) / 6)
        ballspr(img, 540, y, 36, color, 1.0)
        tx(img, label, 540, 215, 76, "black", WHITE); tx(img, f"{tt:.2f} s" if tt < t else f"{t:.1f} s", 540, 345, 110, "black", color)
    def f1(img, lt, p, b): dropscene(img, lt, 1, "1 meter", b)
    def f10(img, lt, p, b): dropscene(img, lt, 10, "10 meters", b, (140, 220, 255))
    def f100(img, lt, p, b): dropscene(img, lt, 100, "100 meters", b, (255, 140, 170))
    def f1000(img, lt, p, b): dropscene(img, lt, 1000, "1 kilometer", b, (160, 255, 150))
    def hook(img, lt, p, b):
        img.paste(vgrad((10, 14, 44), (24, 40, 96), key="drop")); starfield(img, lt, 4)
        for k in range(4):
            u = (lt * .5 + k * .25) % 1; ballspr(img, 200 + k * 240, 400 + u * 700, 40, ((255, 214, 0), (140, 220, 255), (255, 140, 170), (160, 255, 150))[k], 1.0, 1 - u * .3)
        tx(img, "HOW LONG", 540, 950, 90, "black", WHITE, scale=pop(lt / .4)); tx(img, "DOES IT TAKE TO FALL?", 540, 1060, 66, "black", (255, 214, 0), scale=pop((lt - .3) / .4), maxw=1000)
    def air(img, lt, p, b):
        img.paste(vgrad((120, 180, 255), (200, 230, 255), key="air")); 
        v = 200 * (1 - math.exp(-lt * 1.3)); tx(img, f"{v:,.0f} km/h", 540, 600, 150, "black", (30, 40, 90), maxw=1000); tx(img, "terminal velocity of a skydiver", 540, 780, 50, "bold", (30, 40, 90), a=clamp((lt - .8) / .3), maxw=1000)
        for k in range(10): xx = 100 + k * 90; yy = (lt * 700 + k * 190) % 1300 + 120; line(img, [(xx, yy), (xx, yy + 90)], 5, WHITE, .6)
        person(img, 540, 1150, 220, (255, 90, 90), a=1.0)
    def moon(img, lt, p, b):
        img.paste(vgrad((4, 4, 10), (20, 20, 34), key="moonb")); starfield(img, lt, 2); d = ImageDraw.Draw(img); d.rectangle([0, 1250, CW, CH], fill=(120, 120, 130)); d.line([(0, 1250), (CW, 1250)], fill=(190, 190, 200), width=4)
        tt = (lt * .7) % 2.0; g = 1.62; y = 380 + (1250 - 380) * min(1, .5 * g * tt * tt / 4.0 * 1.0 / 1.0 * 1.0 * (1 / 1)); 
        y = 380 + (1250 - 380) * min(1, tt * tt / 4.0)
        box(img, 360, y - 26, 400, y + 26, 6, (150, 150, 160), 1.0); box(img, 350, y - 40, 410, y - 22, 6, (90, 90, 100), 1.0)
        box(img, 680, y - 6, 700, y + 6, 4, (255, 255, 255), 1.0); line(img, [(660, y), (720, y + 10)], 4, (240, 240, 250))
        tx(img, "no air: they land together", 540, 300, 64, "black", WHITE, maxw=1000); tx(img, "Apollo 15, 1971", 540, 1400 if False else 1180, 48, "bold", (255, 214, 0), a=clamp((lt - .6) / .3))
    def burj(img, lt, p, b):
        img.paste(vgrad((20, 30, 80), (80, 60, 120), key="burj")); d = ImageDraw.Draw(img)
        d.polygon([(500, 1250), (520, 400), (540, 330), (560, 400), (580, 1250)], fill=(26, 30, 60)); d.rectangle([0, 1250, CW, CH], fill=(18, 20, 40))
        t = tf(828); tt = min(t, lt * t / 2.6); y = 340 + (1250 - 340) * min(1, (.5 * G * tt * tt) / 828); ballspr(img, 620, y, 24, (255, 214, 0))
        tx(img, "Burj Khalifa: 828 m", 540, 240, 64, "black", WHITE, maxw=1000); tx(img, f"{tt:.1f} s", 800, 640, 120, "black", (255, 214, 0))
    def sqrt_(img, lt, p, b):
        img.paste(vgrad((10, 14, 44), (24, 40, 96), key="drop")); tx(img, "4× higher", 540, 480, 120, "black", WHITE, scale=pop(lt / .4)); tx(img, "only 2× longer", 540, 700, 110, "black", (255, 214, 0), scale=pop((lt - .8) / .4), a=clamp((lt - .8) / .1)); tx(img, "time = 0.45 × √height", 540, 900, 56, "bold", (200, 210, 255), a=clamp((lt - 1.8) / .3))
    def endf(img, lt, p, b):
        img.paste(vgrad((10, 14, 44), (24, 40, 96), key="drop")); starfield(img, lt, 4)
        tx(img, "FALL TIME DEPENDS ON", 540, 560, 60, "black", WHITE, maxw=1000); tx(img, "HEIGHT", 540, 720, 150, "black", (255, 214, 0), scale=pop((lt - .3) / .4), a=clamp((lt - .3) / .1)); tx(img, "+", 540, 860, 80, "black", WHITE, a=clamp((lt - 1.0) / .2)); tx(img, "AIR", 540, 1010, 150, "black", (140, 220, 255), scale=pop((lt - 1.4) / .4), a=clamp((lt - 1.4) / .1))
    N = [
     ("Drop a ball. How long until it lands? The answer follows one simple rule.", hook, "whip"),
     ("From one meter, it takes about point four five seconds. Barely a blink.", f1, "flash"),
     ("Go ten times higher, to ten meters. You might expect ten times longer. It's only one point four seconds.", f10, "zoom"),
     ("From a hundred meters, it takes four and a half seconds.", f100, "whip"),
     ("See the pattern? Four times higher is only twice as long. Fall time grows with the square root of the height.", sqrt_, "zoom"),
     ("So drop a rock from the Burj Khalifa, the tallest building on Earth. In a vacuum, it lands in thirteen seconds.", burj, "whip"),
     ("But on Earth we have air. It pushes back until you stop speeding up, at about two hundred kilometers an hour. So a real fall takes longer.", air, "flash"),
     ("Remove the air, and everything falls the same. On the Moon, Apollo fifteen dropped a hammer and a feather. They landed together.", moon, "zoom"),
     ("So how long you fall depends on two things. How high you are, and how much air is in the way.", endf, "dip"),
    ]
    beats = [Beat(n, d, 3.0, cut=c, cues=[(0, "whoosh", .5)]) for n, d, c in N]
    return Reel("189_fall_times", beats, style="synth", seed=189, snap=False, grid=4, safe_zone=False, vo=[(i, n) for i, (n, d, c) in enumerate(N)], title="how long does it take to fall",
        caption="4x higher is only 2x longer. a hammer and a feather fall together on the Moon. send this to the person who 'drops' everything", story="t = sqrt(2h/g), g = 9.81: 1 m 0.45 s; 10 m 1.43 s; 100 m 4.5 s; 1000 m 14.3 s; 828 m 13.0 s (no air). Skydiver terminal speed ~200 km/h belly-down. Apollo 15 hammer and feather drop (David Scott, 1971).")

REELS = dict(bounce_forever=bounce_forever, double_pendulum=double_pendulum, fall_times=fall_times)
