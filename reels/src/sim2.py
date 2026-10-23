"""Sim2: the satisfying ball sim, rebuilt. Pure black background, supersampled neon wall, glossy sprite balls with motion trails and bloom,
exact live ball count (no cap), grid-accelerated collisions in C, and plain tones (pitch follows where the ball hits, no melody)."""
import ctypes, math, os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageChops
import sim as _s
from sim import RingSim, hue, CX, CY
from engine import W, H
from motion import tx, glow
from premium import bloom

_lib = ctypes.CDLL(os.path.join(os.path.dirname(__file__), "cext", "libcollide.so"))
_lib.collide.argtypes = [ctypes.c_void_p, ctypes.c_void_p, ctypes.c_int, ctypes.c_double, ctypes.c_int]
PENTA_NOTES = [60, 62, 64, 67, 69, 72, 74, 76, 79, 81, 84, 86, 88, 91]

_spr = {}
def sprite(h, r, a=1.0):
    k = (int(h * 48) % 48, int(r * 2), int(a * 12))
    if k not in _spr:
        S = int(r * 2 + 6) * 4; yy, xx = np.mgrid[0:S, 0:S].astype(np.float32); c = S / 2; d = np.sqrt((xx - c) ** 2 + (yy - c) ** 2) / (r * 4)
        base = np.array(hue(k[0] / 48, .72, 1.0), np.float32); lx, ly = -.35, -.4
        z = np.sqrt(np.clip(1 - d * d, 0, 1)); lam = np.clip(((xx - c) / (r * 4) * lx + (yy - c) / (r * 4) * ly + z * .85), 0, 1)
        col = base[None, None, :] * (.55 + .55 * lam[..., None]) + 255 * (np.clip((lam - .82) * 5, 0, 1) ** 2 * .6)[..., None]
        alpha = np.clip((1 - d) * r * 4, 0, 1) * a * 255
        im = Image.fromarray(np.dstack([np.clip(col, 0, 255), alpha]).astype(np.uint8), "RGBA").resize((S // 4, S // 4), Image.LANCZOS); _spr[k] = im
    return _spr[k]

class BallSim(RingSim):
    def __init__(self, title, shape="ring", dur=45.0, scale="penta", **kw):
        self.scale = scale; kw.setdefault("cap", 1500); kw.setdefault("ball_r", 8); kw.setdefault("sub", None); kw.setdefault("n0", 3)
        super().__init__(title, shape=shape, dur=dur, **kw)
        self._tones(); self.final_n = int(self.frames[-1][5])
    def _collide(self, p, v):
        n = len(p)
        if n < 2: return
        assert p.flags["C_CONTIGUOUS"] and v.flags["C_CONTIGUOUS"] and p.dtype == np.float64 and v.dtype == np.float64 and p.shape == (n, 2) and v.shape == (n, 2), (p.flags, v.flags, p.dtype, v.dtype, p.shape, v.shape)
        if not np.isfinite(p).all() or np.abs(p).max() > 1e5: raise RuntimeError(f"bad positions n={n} max={np.abs(p).max()}")
        _lib.collide(p.ctypes.data, v.ctypes.data, n, float(self.br), 1)
    def _tones(self):
        """one plain tone per bounce: pitch rises with how high on the wall the ball hit; at most 2 per 60 ms; quieter as the swarm grows"""
        self.cues = []; GRID = .06; slots = {}
        for (t, ang, c) in sorted(self.hits):
            k = int(t / GRID)
            if slots.get(k, 0) >= 2: continue
            slots[k] = slots.get(k, 0) + 1
            h = (-math.sin(ang) + 1) / 2; idx = int(round(h * (len(PENTA_NOTES) - 1))); nb = self.frames[min(len(self.frames) - 1, int(t * self.fps))][5]
            self.cues.append((t, "n%d" % PENTA_NOTES[idx], .34 * (1 / (1 + nb / 220.0)) ** .5 + .10))
        for (t, pos, c) in self.escapes[:400]:
            k = int(t / GRID)
            if slots.get(k, 0) >= 3: continue
            slots[k] = slots.get(k, 0) + 1; self.cues.append((t, "n%d" % (PENTA_NOTES[2] + 24), .18))
    def render(self, lt):
        R = self.R; fi = min(len(self.frames) - 1, int(lt * self.fps)); ids, p, col, ra, esc, n = self.frames[fi]
        img = Image.new("RGB", (W, H), (0, 0, 0)); ss = 2; S = int(2 * R + 140); ox, oy = CX - S / 2, CY - S / 2
        lay = Image.new("RGB", (S * ss, S * ss), (0, 0, 0)); d = ImageDraw.Draw(lay)
        self._cur_gap = self.gaps[fi] if self.gaps else self.gap; self._cur_pg = self.pgaps[fi] if self.pgaps else self.pgap; self._ring(d, ra, lt, ss, S)
        lay = lay.resize((S, S), Image.LANCZOS); img.paste(lay, (int(ox), int(oy)))
        # trails: four previous frames, shrinking and dimming
        idl = ids.tolist()
        for back in (4, 3, 2, 1):
            f2 = self.frames[max(0, fi - back)]; m2 = {i: j for j, i in enumerate(f2[0].tolist())}; fade = 1 - back / 5.0
            if n > 700 and back in (4, 2): continue
            for k, i in enumerate(idl):
                j = m2.get(i)
                if j is None: continue
                s_ = sprite(col[k], max(2.0, self.br * (.45 + .45 * fade)), .22 * fade * fade + .05); img.paste(s_, (int(f2[1][j][0] - s_.width / 2), int(f2[1][j][1] - s_.height / 2)), s_)
        for k in range(len(idl)):
            s_ = sprite(col[k], self.br); img.paste(s_, (int(p[k][0] - s_.width / 2), int(p[k][1] - s_.height / 2)), s_)
        bloom(img, 120, .85, 9)
        tx(img, self.title, 540, 240, 66, "black", (255, 255, 255), maxw=940, shadow=False)
        tx(img, f"{n:,}", 540, 1560, 150 if n < 10000 else 120, "black", (255, 255, 255), maxw=800, shadow=False); tx(img, self.unit, 540, 1690, 40, "bold", (150, 158, 200), shadow=False)
        ImageDraw.Draw(img).rectangle([0, 0, int(W * min(1, lt / self.dur)), 7], fill=(255, 255, 255))
        return img
