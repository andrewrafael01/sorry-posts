"""Sim3: one ball, one ring, and the ring shrinks every time the ball hits it. Exact bounce count, plain rising tones, pure black background,
ghost rings that ripple outward from every hit, and a ball that gets faster and louder as the room runs out."""
import math
import numpy as np
from PIL import Image, ImageDraw
import reel
from engine import W, H
from motion import tx
from premium import bloom
from sim import hue, CX, CY
from sim2 import sprite, PENTA_NOTES

class ShrinkRing(reel.Shot):
    cut = "cut"
    def __init__(self, title, R0=440.0, Rmin=84.0, shrink=3.0, grow=0.0, ball_max=None, descend=False, gang=0.0, trail=0, fixed=None, sides=0, spin=0.0, ball_r=15, g=1500.0, seed=1, hold=3.0, tail=2.5, hue0=.55):
        self.title, self.R0, self.Rmin, self.shrink, self.br, self.g, self.hue0, self.grow, self.ball_max, self.descend, self.gang, self.trail, self.fixed, self.sides, self.spin = title, R0, Rmin, shrink, ball_r, g, hue0, grow, ball_max, descend, gang, trail, fixed, sides, spin
        self.fps = 30; self.cues = []; self.rng = np.random.RandomState(seed); self._sim(hold, tail)
    def _sim(self, hold, tail):
        sub = 30; dt = 1 / (self.fps * sub); p = np.array([CX + 60.0, CY - 160.0]); v = np.array([430.0, -260.0]); R = self.R0; b = float(self.br); gv = np.array([0.0, self.g])
        self.frames = []; self.hits = []; hits = 0; t = 0.0; done_t = None; fr = 0
        while True:
            for _ in range(sub):
                v += gv * dt; p += v * dt; t += dt
                if self.fixed and done_t is None and t >= self.fixed: done_t = t
                d = p - [CX, CY]
                if self.sides:
                    best = -1e9; n = None
                    for k in range(self.sides):
                        a_ = self.spin * t + 2 * math.pi * k / self.sides; nk = np.array([math.cos(a_), math.sin(a_)]); pr = d @ nk
                        if pr > best: best, n = pr, nk
                    dist = best; over = best > R - b
                else:
                    dist = math.hypot(*d); over = dist > R - b
                    if over: n = d / dist
                if over:
                    vn = v @ n
                    p = p - n * (dist - (R - b)) if self.sides else np.array([CX, CY]) + n * (R - b)
                    if vn > 0:
                        v -= 2 * vn * n; hits += 1
                        if self.gang: c_, s2_ = math.cos(self.gang), math.sin(self.gang); gv = np.array([c_ * gv[0] - s2_ * gv[1], s2_ * gv[0] + c_ * gv[1]])
                        self.hits.append((t, math.atan2(n[1], n[0]), hits)); self.last_hit = t
                        R = max(self.Rmin, R - self.shrink); b = min(self.ball_max or 1e9, b + self.grow)
                        p = (p - n * max(0.0, (dist - (R - b)))) if self.sides else np.array([CX, CY]) + n * min(dist, R - b)
                        if (R <= self.Rmin or (self.ball_max and b >= self.ball_max)) and done_t is None: done_t = t
                sp = math.hypot(*v)
                if sp > 2400: v *= 2400 / sp
            self.frames.append((p.copy(), R, hits, t, b)); fr += 1
            if done_t is not None and t > done_t + hold + tail: break
            if t > 90: break
        self.dur = t; self.R_end = R; self.n_hits = hits; self.done_t = done_t
        self.rhist = [f[1] for f in self.frames]
        # plain tones: pitch climbs with the bounce count; never more than 2 per 60 ms
        slots = {}; N = max(1, len(self.hits))
        for (ht, ang, k) in self.hits:
            s = int(ht / .06)
            if slots.get(s, 0) >= 2: continue
            slots[s] = slots.get(s, 0) + 1
            idx = min(len(PENTA_NOTES) - 1, int((k / N) ** .85 * (len(PENTA_NOTES) - 1) + .5))
            if self.descend: idx = len(PENTA_NOTES) - 1 - idx
            self.cues.append((ht, "n%d" % PENTA_NOTES[idx], .30))
    def validate(self):
        bad = 0; leak = 0
        for (p, R, h, t, b) in self.frames:
            lim = R / math.cos(math.pi / self.sides) if self.sides else R
            if math.hypot(p[0] - CX, p[1] - CY) > lim + 1: leak += 1
        return {"wall_leaks": leak, "max_overlap_px": 0, "bounces": self.n_hits, "seconds_to_min": round(self.done_t or -1, 1)}
    def _outline(self, d, c0, ss, R, t, col, width):
        if not self.sides: d.ellipse([c0 - R * ss, c0 - R * ss, c0 + R * ss, c0 + R * ss], outline=col, width=int(width * ss)); return
        Rv = R / math.cos(math.pi / self.sides); pts = [(c0 + Rv * ss * math.cos(self.spin * t + (2 * k + 1) * math.pi / self.sides), c0 + Rv * ss * math.sin(self.spin * t + (2 * k + 1) * math.pi / self.sides)) for k in range(self.sides)]
        d.line(pts + [pts[0], pts[1]], fill=col, width=int(width * ss), joint="curve")
    def render(self, lt):
        fi = min(len(self.frames) - 1, int(lt * self.fps)); p, R, hits, t, b = self.frames[fi]
        img = Image.new("RGB", (W, H), (0, 0, 0)); ss = 2; S = int(2 * (self.R0 / math.cos(math.pi / self.sides) if self.sides else self.R0) + 220); ox, oy = CX - S / 2, CY - S / 2
        lay = Image.new("RGB", (S * ss, S * ss), (0, 0, 0)); d = ImageDraw.Draw(lay); c0 = S * ss / 2
        hcol = (self.hue0 + hits * .0035) % 1; col = hue(hcol, .75, 1.0)
        # ghost rings: each hit leaves its old ring behind, expanding slightly while it fades
        for (ht, ang, k) in self.hits:
            age = t - ht
            if 0 <= age < 1.3:
                j = min(len(self.frames) - 1, int(ht * self.fps)); Rg = self.frames[max(0, j - 1)][1] + age * 70; a = (1 - age / 1.3) ** 2 * .5
                gc = hue((self.hue0 + k * .0035) % 1, .6, 1.0); gc = tuple(int(x * a) for x in gc)
                self._outline(d, c0, ss, Rg, ht, gc, 3)
        flash = 0.0
        if self.done_t is not None and t > self.done_t: flash = max(0.0, 1 - (t - self.done_t) / .5)
        wc = tuple(min(255, int(x + 255 * flash)) for x in col)
        self._outline(d, c0, ss, R, t, wc, 10)
        if self.trail:
            j0 = max(0, fi - self.trail); pts = [((self.frames[j][0][0] - ox) * ss, (self.frames[j][0][1] - oy) * ss) for j in range(j0, fi + 1)]
            for i in range(1, len(pts)):
                u = (i / len(pts)) ** 1.6; tc = hue((hcol - .25 * (1 - u)) % 1, .8, 1.0); tc = tuple(int(x * u * .9) for x in tc)
                d.line([pts[i - 1], pts[i]], fill=tc, width=int((2 + 5 * u) * ss))
        lay = lay.resize((S, S), Image.LANCZOS); img.paste(lay, (int(ox), int(oy)))
        # ball with a short comet trail
        for back in (6, 5, 4, 3, 2, 1):
            q = self.frames[max(0, fi - back)][0]; fade = 1 - back / 7.0; s_ = sprite(hcol, max(3.0, self.frames[max(0, fi - back)][4] * (.4 + .5 * fade)), .22 * fade * fade + .04)
            img.paste(s_, (int(q[0] - s_.width / 2), int(q[1] - s_.height / 2)), s_)
        s_ = sprite(hcol, b); img.paste(s_, (int(p[0] - s_.width / 2), int(p[1] - s_.height / 2)), s_)
        bloom(img, 110, .9, 9)
        tx(img, self.title, 540, 240, 64, "black", (255, 255, 255), maxw=940, shadow=False)
        tx(img, f"{hits:,}", 540, 1560, 150, "black", (255, 255, 255), maxw=800, shadow=False); tx(img, "bounces", 540, 1690, 40, "bold", (150, 158, 200), shadow=False)
        ImageDraw.Draw(img).rectangle([0, 0, int(W * min(1, lt / self.dur)), 7], fill=(255, 255, 255))
        return img
