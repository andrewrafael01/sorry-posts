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
    def __init__(self, title, R0=440.0, Rmin=84.0, shrink=3.0, grow=0.0, ball_max=None, descend=False, ball_r=15, g=1500.0, seed=1, hold=3.0, tail=2.5, hue0=.55):
        self.title, self.R0, self.Rmin, self.shrink, self.br, self.g, self.hue0, self.grow, self.ball_max, self.descend = title, R0, Rmin, shrink, ball_r, g, hue0, grow, ball_max, descend
        self.fps = 30; self.cues = []; self.rng = np.random.RandomState(seed); self._sim(hold, tail)
    def _sim(self, hold, tail):
        sub = 30; dt = 1 / (self.fps * sub); p = np.array([CX + 60.0, CY - 160.0]); v = np.array([430.0, -260.0]); R = self.R0; b = float(self.br)
        self.frames = []; self.hits = []; hits = 0; t = 0.0; done_t = None; fr = 0
        while True:
            for _ in range(sub):
                v[1] += self.g * dt; p += v * dt; t += dt
                d = p - [CX, CY]; dist = math.hypot(*d)
                if dist > R - b:
                    n = d / dist; vn = v @ n
                    p = np.array([CX, CY]) + n * (R - b)
                    if vn > 0:
                        v -= 2 * vn * n; hits += 1; self.hits.append((t, math.atan2(n[1], n[0]), hits)); self.last_hit = t
                        R = max(self.Rmin, R - self.shrink); b = min(self.ball_max or 1e9, b + self.grow); p = np.array([CX, CY]) + n * min(dist, R - b)
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
            if math.hypot(p[0] - CX, p[1] - CY) > R + 1: leak += 1
        return {"wall_leaks": leak, "max_overlap_px": 0, "bounces": self.n_hits, "seconds_to_min": round(self.done_t or -1, 1)}
    def render(self, lt):
        fi = min(len(self.frames) - 1, int(lt * self.fps)); p, R, hits, t, b = self.frames[fi]
        img = Image.new("RGB", (W, H), (0, 0, 0)); ss = 2; S = int(2 * self.R0 + 220); ox, oy = CX - S / 2, CY - S / 2
        lay = Image.new("RGB", (S * ss, S * ss), (0, 0, 0)); d = ImageDraw.Draw(lay); c0 = S * ss / 2
        hcol = (self.hue0 + hits * .0035) % 1; col = hue(hcol, .75, 1.0)
        # ghost rings: each hit leaves its old ring behind, expanding slightly while it fades
        for (ht, ang, k) in self.hits:
            age = t - ht
            if 0 <= age < 1.3:
                j = min(len(self.frames) - 1, int(ht * self.fps)); Rg = self.frames[max(0, j - 1)][1] + age * 70; a = (1 - age / 1.3) ** 2 * .5
                gc = hue((self.hue0 + k * .0035) % 1, .6, 1.0); gc = tuple(int(x * a) for x in gc)
                d.ellipse([c0 - Rg * ss, c0 - Rg * ss, c0 + Rg * ss, c0 + Rg * ss], outline=gc, width=int(3 * ss))
        flash = 0.0
        if self.done_t is not None and t > self.done_t: flash = max(0.0, 1 - (t - self.done_t) / .5)
        wc = tuple(min(255, int(x + 255 * flash)) for x in col)
        d.ellipse([c0 - R * ss, c0 - R * ss, c0 + R * ss, c0 + R * ss], outline=wc, width=int(10 * ss))
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
