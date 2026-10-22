"""Satisfying physics sims: balls bouncing in a rotating shape with one gap, every hit plays a note, escapes spawn more balls.
RingSim(title, shape) is a reel Shot; the physics is precomputed once (deterministic), frames are rendered from the stored states."""
import math, colorsys, bisect
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageChops
import reel as _reel
from engine import W, H, clamp
from motion import glow, tx

CX, CY, R = 540, 900, 440
PENTA = [60, 62, 64, 67, 69, 72, 74, 76, 79, 81, 84]
ODE = [64,64,65,67,67,65,64,62,60,60,62,64,64,62,62, 64,64,65,67,67,65,64,62,60,60,62,64,62,60,60, 62,62,64,60,62,64,65,64,60,62,64,65,64,62,60,62,55, 64,64,65,67,67,65,64,62,60,60,62,64,62,60,60]
MOUNTAIN_KING = [64,66,67,69,71,67,71, 70,66,70,66,70, 64,66,67,69,71,67,71,76, 74,71,67,71,74, 64,66,67,69,71,67,71, 70,66,70,66,70, 64,66,67,69,71,67,71,76, 74,71,67,71,74,71,67,64]
ELISE = [76,75,76,75,76,71,74,72,69, 60,64,69,71, 64,68,71,72, 64, 76,75,76,75,76,71,74,72,69, 60,64,69,71, 64,72,71,69]
CANON = [78,76,74,73,71,69,71,73, 78,76,74,73,71,69,71,73, 74,73,71,74,73,71,69,67,66,67,69,71,73,74,73,71]
SONG = [0, 2, 4, 2, 5, 4, 2, 0, 1, 3, 5, 3, 6, 5, 3, 1, 2, 4, 6, 4, 7, 6, 4, 2, 4, 5, 7, 9, 7, 5, 4, 2]

def hue(h, s=.85, v=1.0): r, g, b = colorsys.hsv_to_rgb(h % 1, s, max(0, min(1, v))); return (int(r * 255), int(g * 255), int(b * 255))

class RingSim(_reel.Shot):
    cut = "cut"
    def __init__(self, title, shape="ring", dur=55.0, spawn=3, spin=.9, gap=.62, g=1500.0, cap=420, seed=1, hue0=.0, unit="balls", sub=None, boost=1.012, ball_r=15, n0=1, mel=None, pgap=.34):
        self.title, self.shape, self.dur, self.spawn, self.spin, self.gap, self.g, self.cap, self.hue0, self.unit, self.sub = title, shape, dur, spawn, spin, gap, g, cap, hue0, unit, sub
        self.R = 440 if shape == 'ring' else (380 if shape == 'square' else 400) / math.cos(math.pi / {'tri': 3, 'square': 4, 'hex': 6}[shape]); self.boost, self.br, self.n0, self.pgap = boost, ball_r, n0, pgap; self.mel = mel or ODE; self.rng = np.random.RandomState(seed)
        self.cues = []; self.shake = None; self.fps = 30; self._sim()
    def _collide(self, p, v):
        """Elastic equal-mass collisions between balls (exchange the velocity component along the line of centres, then push the overlap apart)."""
        n = len(p)
        if n < 2: return
        r2 = 2 * self.br; dx = p[:, None, 0] - p[None, :, 0]; dy = p[:, None, 1] - p[None, :, 1]
        ii, jj = np.nonzero(np.triu(dx * dx + dy * dy < r2 * r2, 1))
        for i, j in zip(ii.tolist(), jj.tolist()):
            ex, ey = p[j, 0] - p[i, 0], p[j, 1] - p[i, 1]; dist = math.hypot(ex, ey)
            if dist < 1e-6: ex, ey, dist = 1.0, 0.0, 1.0
            nx, ny = ex / dist, ey / dist; ov = (r2 - dist) / 2
            p[i, 0] -= nx * ov; p[i, 1] -= ny * ov; p[j, 0] += nx * ov; p[j, 1] += ny * ov
            vn = (v[i, 0] - v[j, 0]) * nx + (v[i, 1] - v[j, 1]) * ny
            if vn > 0:
                v[i, 0] -= vn * nx; v[i, 1] -= vn * ny; v[j, 0] += vn * nx; v[j, 1] += vn * ny
    def _sim(self):
        R = self.R
        rng = self.rng; sub = 8; dt = 1 / (self.fps * sub); nfr = int(self.dur * self.fps) + 2
        p = np.array([[CX + 30.0 - 40 * q, CY - 120.0 - 20 * q] for q in range(self.n0)]); v = np.array([[260.0 - 130 * q, -120.0 - 60 * q] for q in range(self.n0)]); col = np.array([(self.hue0 + .08 * q) % 1 for q in range(self.n0)]); ids = np.arange(self.n0); nid = self.n0
        pend = 0; self.frames = []; self.escapes = []; self.hits = []; ra = 1.6; esc = 0
        n = {"ring": 0, "tri": 3, "square": 4, "hex": 6}[self.shape]
        apo = R * math.cos(math.pi / n) if n else R
        for fr in range(nfr):
            t = fr / self.fps
            for _ in range(sub):
                ra += self.spin * dt * (1 + .25 * math.sin(t * .3))
                v[:, 1] += self.g * dt; p += v * dt
                [self._collide(p, v) for _ in range(4)]
                spd = np.hypot(v[:, 0], v[:, 1]); fast = spd > 1700
                if fast.any(): v[fast] *= (1700 / spd[fast])[:, None]
                d = p - [CX, CY]
                if n == 0:
                    dist = np.hypot(d[:, 0], d[:, 1]) + 1e-9; nrm = d / dist[:, None]
                    ang = np.arctan2(d[:, 1], d[:, 0]); rel = (ang - ra + math.pi) % (2 * math.pi) - math.pi; ingap = np.abs(rel) < self.gap / 2; s_ = dist
                else:
                    s_ = np.full(len(p), -1e9); nrm = np.zeros_like(p); kk = np.zeros(len(p), int)
                    for k in range(n):
                        a = ra + 2 * math.pi * (k + .5) / n; nn = np.array([math.cos(a), math.sin(a)]); q = d @ nn; m = q > s_
                        s_ = np.where(m, q, s_); nrm = np.where(m[:, None], nn, nrm); kk = np.where(m, k, kk)
                    a0_ = ra + math.pi / n; u_ = -d[:, 0] * math.sin(a0_) + d[:, 1] * math.cos(a0_)
                    ingap = (kk == 0) & (np.abs(u_) < self.pgap * R * math.sin(math.pi / n))
                hit = (s_ > apo - self.br) & ~ingap & (s_ < apo + 2 * self.br); gone = s_ > apo + 3 * self.br
                if hit.any():
                    vn = (v * nrm).sum(1); m = hit & (vn > 0)
                    p[hit] -= nrm[hit] * (s_[hit] - (apo - self.br))[:, None]   # hard projection: a ball is never allowed past the wall
                    if m.any():
                        v[m] -= (2 * vn[m])[:, None] * nrm[m]; v[m] *= self.boost
                        for j in np.nonzero(m)[0]: self.hits.append((t, float(math.atan2(nrm[j][1], nrm[j][0])), float(col[j])))
                if gone.any():
                    ng = int(gone.sum())
                    for j in np.nonzero(gone)[0]: self.escapes.append((t, p[j].copy(), float(col[j])))
                    esc += ng; keep = ~gone; p, v, col, ids = p[keep], v[keep], col[keep], ids[keep]
                    pend += ng * self.spawn
                if pend > 0:   # newborns appear one at a time, only where there is free space at the centre
                    if len(p) >= self.cap: pend = 0
                    else:
                        for _try in range(30):
                            c_ = np.array([CX + rng.randn() * 90, CY + rng.randn() * 90])
                            if len(p) == 0 or np.hypot(p[:, 0] - c_[0], p[:, 1] - c_[1]).min() > 2.1 * self.br:
                                a = rng.rand() * 6.283; sp = 150 + rng.rand() * 330
                                p = np.vstack([p, [c_]]); v = np.vstack([v, [[math.cos(a) * sp, math.sin(a) * sp]]]); col = np.append(col, (self.hue0 + nid * .031) % 1); ids = np.append(ids, nid); nid += 1; pend -= 1; break
            self.frames.append((ids.copy(), p.copy(), col.copy(), ra, esc, len(p)))
        self.cues = []; GRID = .17; hits = sorted(h[0] for h in self.hits); k = 0; i = 0; t = 0.0; mi = 0
        while t < self.dur and i < len(hits):
            j = i
            while j < len(hits) and hits[j] < t + GRID: j += 1
            if j > i and hits[i] >= t:
                nb = self.frames[min(len(self.frames) - 1, int(t * self.fps))][5]
                self.cues.append((t, "n%d" % self.mel[mi % len(self.mel)], .5 * (1 / (1 + nb / 60.0)) ** .5 + .2)); mi += 1
            i = j if j > i else i
            t += GRID
            while i < len(hits) and hits[i] < t: i += 1 if j <= i else 0; break
        for q, (t, pos, c) in enumerate(self.escapes[:300]): self.cues.append((t, "n%d" % (self.mel[(mi + q) % len(self.mel)] + 12), .3))
        self._hi = sorted(self.hits)
    def render(self, lt):
        R = self.R
        fi = min(len(self.frames) - 1, int(lt * self.fps)); ids, p, col, ra, esc, n = self.frames[fi]
        img = Image.new("RGB", (W, H), (6, 6, 14)); ss = 2; S = int(2 * R + 140); lay = Image.new("RGB", (S * ss, S * ss), (6, 6, 14)); d = ImageDraw.Draw(lay)
        ox, oy = CX - S / 2, CY - S / 2; bg = (6, 6, 14)
        self._ring(d, ra, lt, ss, S)
        idl = ids.tolist(); hist = []
        for back in range(10, 0, -1):
            f2 = self.frames[max(0, fi - back)]; hist.append((back, {i: j for j, i in enumerate(f2[0].tolist())}, f2))
        prev = {}
        for back, idm, f2 in hist:
            fade = 1 - back / 11.0
            for k, i in enumerate(idl):
                j = idm.get(i)
                if j is None: continue
                q = ((f2[1][j][0] - ox) * ss, (f2[1][j][1] - oy) * ss)
                c = tuple(int(bg[m] + (hue(col[k], .75, 1)[m] - bg[m]) * fade * .85) for m in range(3)); r = self.br * (.12 + .88 * fade ** 1.6) * ss
                if i in prev:
                    for u in (.25, .5, .75, 1.0):
                        x = prev[i][0] + (q[0] - prev[i][0]) * u; y = prev[i][1] + (q[1] - prev[i][1]) * u; d.ellipse([x - r, y - r, x + r, y + r], fill=c)
                prev[i] = q
        for k in range(len(idl)):
            x, y = (p[k][0] - ox) * ss, (p[k][1] - oy) * ss; r = self.br * ss; d.ellipse([x - r, y - r, x + r, y + r], fill=hue(col[k], .7, 1))
        lay = lay.resize((S, S), Image.LANCZOS); img.paste(lay, (int(ox), int(oy)))
        tx(img, self.title, 540, 240, 66, "black", (255, 255, 255), maxw=940, shadow=False)
        if self.sub: tx(img, self.sub, 540, 375, 44, "bold", (170, 178, 220), maxw=940, shadow=False)
        tx(img, f"{n}", 540, 1560, 150, "black", (255, 255, 255), maxw=700, shadow=False); tx(img, self.unit, 540, 1690, 40, "bold", (150, 158, 200), shadow=False)
        ImageDraw.Draw(img).rectangle([0, 0, int(W * clamp(lt / self.dur)), 7], fill=(255, 214, 0))
        return img
    def _ring(self, d, ra, lt, ss, S):
        R = self.R
        c0 = S * ss / 2; ts = [h[0] for h in self._hi]; i0 = bisect.bisect_left(ts, lt - .16); i1 = bisect.bisect_right(ts, lt); pulses = self._hi[max(i0, i1 - 8):i1]
        def lit(a):   # brightness bump on the wall right where a ball just hit
            b = 0.0
            for (t, ang, c) in pulses:
                da = abs((a - ang + math.pi) % (2 * math.pi) - math.pi)
                if da < .22: b = max(b, (1 - (lt - t) / .16) * (1 - da / .22))
            return b
        if self.shape == "ring":
            N = 240
            for k in range(N):
                a0 = 2 * math.pi * k / N; a1 = 2 * math.pi * (k + 1.5) / N; rel = (a0 + math.pi / N - ra + math.pi) % (2 * math.pi) - math.pi
                if abs(rel) < self.gap / 2: continue
                b = lit(a0); col = tuple(int(c + (255 - c) * b) for c in hue(a0 / (2 * math.pi) + lt * .06, .7, .9))
                d.line([(c0 + R * ss * math.cos(a), c0 + R * ss * math.sin(a)) for a in (a0, a1)], fill=col, width=int((9 + 5 * b) * ss))
        else:
            n = {"tri": 3, "square": 4, "hex": 6}[self.shape]
            P = lambda a: (c0 + R * ss * math.cos(a), c0 + R * ss * math.sin(a))
            va, vb = P(ra), P(ra + 2 * math.pi / n)
            for f0, f1 in ((0, .5 - self.pgap / 2), (.5 + self.pgap / 2, 1)):
                d.line([(va[0] + (vb[0] - va[0]) * f0, va[1] + (vb[1] - va[1]) * f0), (va[0] + (vb[0] - va[0]) * f1, va[1] + (vb[1] - va[1]) * f1)], fill=hue(lt * .06, .7, .9), width=9 * ss)
            for k in range(1, n):
                a0 = ra + 2 * math.pi * k / n; a1 = a0 + 2 * math.pi / n; mid = ra + 2 * math.pi * (k + .5) / n - math.pi / n + math.pi / n
                b = lit(ra + 2 * math.pi * (k + .5) / n - 0) ; col = tuple(int(c + (255 - c) * b) for c in hue(k / n + lt * .06, .7, .9))
                d.line([(c0 + R * ss * math.cos(a), c0 + R * ss * math.sin(a)) for a in (a0, a1)], fill=col, width=int((9 + 5 * b) * ss), joint="curve")

    def validate(self):
        """Replays the stored states. (1) a ball's centre may only cross the wall line inside the opening; (2) no two balls overlap by more than a sliver."""
        R = self.R; n_ = {"ring": 0, "tri": 3, "square": 4, "hex": 6}[self.shape]; apo = R * math.cos(math.pi / n_) if n_ else R
        ov = 0.0; bad_frames = []; leaks = 0; inside = {}
        for fi, (ids, p, col, ra, esc, n) in enumerate(self.frames):
            d = p - [CX, CY]
            if n_ == 0:
                s_ = np.hypot(d[:, 0], d[:, 1]); ang = np.arctan2(d[:, 1], d[:, 0]); rel = np.abs((ang - ra + math.pi) % (2 * math.pi) - math.pi); ingap = rel < self.gap / 2 + .09
            else:
                s_ = np.full(len(p), -1e9); kk = np.zeros(len(p), int)
                for k in range(n_):
                    a = ra + 2 * math.pi * (k + .5) / n_; q = d @ np.array([math.cos(a), math.sin(a)]); m = q > s_; s_ = np.where(m, q, s_); kk = np.where(m, k, kk)
                a0 = ra + math.pi / n_; u = -d[:, 0] * math.sin(a0) + d[:, 1] * math.cos(a0); ingap = (kk == 0) & (np.abs(u) < self.pgap * R * math.sin(math.pi / n_) + .09 * R)
            for j, i in enumerate(ids.tolist()):
                if s_[j] > apo and inside.get(i, True) and not ingap[j]: leaks += 1
                inside[i] = s_[j] <= apo
            if n > 1:
                D = np.hypot(p[:, None, 0] - p[None, :, 0], p[:, None, 1] - p[None, :, 1]) + np.eye(n) * 99; mo = float((2 * self.br - D).max()); ov = max(ov, mo)
                if mo > 6: bad_frames.append((fi, n, round(mo, 1)))
        return {"wall_leaks": leaks, "max_overlap_px": round(ov, 1), "frames_overlap_gt6": len(bad_frames), "sample": bad_frames[:6]}
