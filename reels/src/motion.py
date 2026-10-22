"""Motion-graphics toolkit for the long-form explainer reels. Everything draws with Pillow at 1080x1920; Beat is a Reel-compatible shot whose draw() animates one narrated idea."""
import math, os, random
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageChops
from engine import *
import reel as _reel

HERE = os.path.dirname(__file__)
CW, CH = W, H
ink = lambda c: tuple(int(x) for x in c)
def mix(a, b, t): return tuple(int(lerp(a[i], b[i], t)) for i in range(3))
def eio(t): return in_out(clamp(t))
def seg(t, a, b): return clamp((t - a) / max(1e-6, b - a))

# ------------------------------------------------------------------ primitives (anti-aliased through small supersampled patches)
_glow_cache = {}
def glow(img, cx, cy, r, color, a=.6):
    r = int(max(4, r)); key = (r // 4)
    if key not in _glow_cache:
        n = key * 8 + 2; yy, xx = np.mgrid[-n:n + 1, -n:n + 1]; d = np.sqrt(xx * xx + yy * yy) / n
        _glow_cache[key] = Image.fromarray((np.clip(1 - d, 0, 1) ** 2.2 * 255).astype(np.uint8)).resize((2 * r + 1, 2 * r + 1), Image.BILINEAR)
    m = _glow_cache[key].point(lambda v: int(v * a)); img.paste(Image.new("RGB", m.size, color), (int(cx - r), int(cy - r)), m)

def _patch(w, h, ss=3): return Image.new("RGBA", (int(w * ss), int(h * ss)), (0, 0, 0, 0)), ss

def disc(img, cx, cy, r, fill, a=1.0, outline=None, ow=0):
    r = max(.5, r); pad = ow + 3; p, ss = _patch(2 * r + 2 * pad, 2 * r + 2 * pad); d = ImageDraw.Draw(p)
    c = (r + pad) * ss; d.ellipse([c - r * ss, c - r * ss, c + r * ss, c + r * ss], fill=ink(fill) + (int(255 * a),), outline=(ink(outline) + (255,)) if outline else None, width=int(ow * ss))
    p = p.resize((int(2 * r + 2 * pad), int(2 * r + 2 * pad)), Image.LANCZOS); img.paste(p, (int(cx - r - pad), int(cy - r - pad)), p)

def ring(img, cx, cy, r, w, color, a=1.0):
    r = max(1, r); pad = 3; p, ss = _patch(2 * r + 2 * pad + w, 2 * r + 2 * pad + w); d = ImageDraw.Draw(p); c = (r + pad + w / 2) * ss
    d.ellipse([c - r * ss, c - r * ss, c + r * ss, c + r * ss], outline=ink(color) + (int(255 * a),), width=max(1, int(w * ss)))
    p = p.resize((p.width // ss, p.height // ss), Image.LANCZOS); img.paste(p, (int(cx - p.width / 2), int(cy - p.height / 2)), p)

def box(img, x0, y0, x1, y1, rad, fill, a=1.0, outline=None, ow=0):
    w, h = x1 - x0, y1 - y0; pad = ow + 2; p, ss = _patch(w + 2 * pad, h + 2 * pad, 2); d = ImageDraw.Draw(p)
    d.rounded_rectangle([pad * ss, pad * ss, (pad + w) * ss, (pad + h) * ss], rad * ss, fill=(ink(fill) + (int(255 * a),)) if fill else None, outline=(ink(outline) + (255,)) if outline else None, width=int(ow * ss))
    p = p.resize((int(w + 2 * pad), int(h + 2 * pad)), Image.LANCZOS); img.paste(p, (int(x0 - pad), int(y0 - pad)), p)

def line(img, pts, w, color, a=1.0):
    xs, ys = [p[0] for p in pts], [p[1] for p in pts]; pad = w + 3; x0, y0 = min(xs) - pad, min(ys) - pad; ww, hh = max(xs) - min(xs) + 2 * pad, max(ys) - min(ys) + 2 * pad
    p, ss = _patch(ww, hh, 3); d = ImageDraw.Draw(p); q = [((x - x0) * ss, (y - y0) * ss) for x, y in pts]
    d.line(q, fill=ink(color) + (int(255 * a),), width=int(w * ss), joint="curve")
    for x, y in (q[0], q[-1]): d.ellipse([x - w * ss / 2, y - w * ss / 2, x + w * ss / 2, y + w * ss / 2], fill=ink(color) + (int(255 * a),))
    p = p.resize((int(ww), int(hh)), Image.LANCZOS); img.paste(p, (int(x0), int(y0)), p)

BOXES = []   # (x0, y0, x1, y1, text, alpha) of every text drawn this frame, used by qa.py
def tx(img, s, x, y, size=64, weight="black", color=WHITE, a=1.0, scale=1.0, maxw=900, stroke=0, rot=0, align="center", hl=None, shadow=True):
    L = text_layer(s, size, weight, color, stroke=stroke, maxw=maxw, align=align, hl=hl)
    if a > .5 and scale > .85: BOXES.append((x - L.width * scale / 2 + 8, y - L.height * scale / 2 + 12, x + L.width * scale / 2 - 8, y + L.height * scale / 2 - 12, s, a))
    if shadow:
        sh = _shadow_cache.get(id(L))
        if sh is None:
            sh = Image.new("RGBA", L.size, (0, 0, 0, 0)); sh.putalpha(L.getchannel("A").point(lambda v: int(v * .55))); sh = sh.filter(ImageFilter.GaussianBlur(6))
            if len(_shadow_cache) > 400: _shadow_cache.clear()
            _shadow_cache[id(L)] = sh; _keep.append(L)
            if len(_keep) > 400: _keep.clear()
        paste(img, sh, x + 3, y + 7, scale=scale, alpha=a)
    paste(img, L, x, y, scale=scale, alpha=a, rot=rot)

_shadow_cache = {}; _keep = []
def pop(t): return out_back(clamp(t), 1.7)

# ------------------------------------------------------------------ backgrounds
_stars = None
def starfield(img, t, drift=18, tint=(255, 255, 255)):
    global _stars
    if _stars is None:
        r = np.random.RandomState(3); _stars = [(r.rand() * CW, r.rand() * CH, .4 + r.rand() * 1.4, r.rand() * 6.28, .3 + r.rand() * .7) for _ in range(260)]
    d = ImageDraw.Draw(img)
    for x, y, s, ph, dep in _stars:
        xx = (x - t * drift * dep) % CW; tw = .55 + .45 * math.sin(t * 2.2 + ph); c = int(200 * tw * dep + 40)
        d.ellipse([xx - s, y - s, xx + s, y + s], fill=(c, c, min(255, c + 25)))

_bg_cache = {}
def vgrad(c1, c2, key=None):
    k = key or (c1, c2)
    if k not in _bg_cache:
        a = np.linspace(0, 1, CH)[:, None, None]; arr = (np.array(c1)[None, None] * (1 - a) + np.array(c2)[None, None] * a) * np.ones((1, CW, 1)); _bg_cache[k] = Image.fromarray(arr.astype(np.uint8))
    return _bg_cache[k].copy()

def space(t, c1=(5, 8, 22), c2=(14, 20, 50), drift=18):
    img = vgrad(c1, c2); starfield(img, t, drift); return img

def vignette(img, k=.55):
    return ImageChops.multiply(img, _reel._VIG_IMG) if k else img

# ------------------------------------------------------------------ sprites
_earth_src = None
def earth(img, cx, cy, r, a=1.0, glow_a=.55, tilt=0):
    global _earth_src
    if _earth_src is None:
        p = os.path.join(HERE, "assets", "db74d4dbb1e872d3.jpg"); im = Image.open(p).convert("RGB"); s = int(min(im.size) * .9); im = im.crop(((im.width - s) // 2, (im.height - s) // 2, (im.width + s) // 2, (im.height + s) // 2)); _earth_src = im.resize((900, 900), Image.LANCZOS)
    r = int(r) // 4 * 4
    if r < 3: return
    glow(img, cx, cy, r * 1.35, (80, 150, 255), glow_a * a)
    k = ("earth", r)
    if k not in _bg_cache:
        sp = _earth_src.resize((2 * r, 2 * r), Image.LANCZOS)
        yy, xx = np.mgrid[-r:r, -r:r]; d = np.sqrt(xx * xx + yy * yy) / r
        shade = np.clip(1.15 - .5 * d ** 2.2 - .22 * ((xx + yy) / r), .25, 1.2)[..., None]
        arr = np.clip(np.asarray(sp, dtype=np.float32) * shade, 0, 255).astype(np.uint8)
        m = Image.fromarray((np.clip((1 - d) * r, 0, 1) * 255).astype(np.uint8)); sp = Image.fromarray(arr); sp.putalpha(m)
        _bg_cache[k] = sp
    sp = _bg_cache[k]
    if a < 1: sp = sp.copy(); sp.putalpha(sp.getchannel("A").point(lambda v: int(v * a)))
    img.paste(sp, (int(cx - r), int(cy - r)), sp)

_person_cache = {}
def person(img, cx, feet, h, color=(255, 214, 90), a=1.0, squash=1.0, lean=0, jump=0):
    """Stylised standing figure; squash >1 stretches tall (jump), <1 squats."""
    key = (int(h), color)
    if key not in _person_cache:
        hh = int(h); ww = int(h * .5); p, ss = _patch(ww, hh, 4); d = ImageDraw.Draw(p)
        hr = hh * .13; c = ink(color); dark = tuple(int(v * .72) for v in c)
        d.rounded_rectangle([ww * .22 * ss, hh * .34 * ss, ww * .78 * ss, hh * .70 * ss], hh * .07 * ss, fill=c + (255,))
        d.rounded_rectangle([ww * .26 * ss, hh * .64 * ss, ww * .47 * ss, hh * .97 * ss], hh * .05 * ss, fill=dark + (255,)); d.rounded_rectangle([ww * .53 * ss, hh * .64 * ss, ww * .74 * ss, hh * .97 * ss], hh * .05 * ss, fill=dark + (255,))
        d.rounded_rectangle([ww * .08 * ss, hh * .36 * ss, ww * .25 * ss, hh * .62 * ss], hh * .05 * ss, fill=c + (255,)); d.rounded_rectangle([ww * .75 * ss, hh * .36 * ss, ww * .92 * ss, hh * .62 * ss], hh * .05 * ss, fill=c + (255,))
        d.ellipse([(ww / 2 - hr) * ss, hh * .08 * ss, (ww / 2 + hr) * ss, (hh * .08 + 2 * hr) * ss], fill=(255, 224, 190, 255))
        _person_cache[key] = p.resize((ww, hh), Image.LANCZOS)
    sp = _person_cache[key]; sw, sh = int(sp.width / math.sqrt(squash)), int(sp.height * squash); sp = sp.resize((max(2, sw), max(2, sh)), Image.BILINEAR)
    if lean: sp = sp.rotate(lean, resample=Image.BILINEAR, expand=True)
    if a < 1: sp = sp.copy(); sp.putalpha(sp.getchannel("A").point(lambda v: int(v * a)))
    img.paste(sp, (int(cx - sp.width / 2), int(feet - sp.height - jump)), sp)

# ------------------------------------------------------------------ captions
def _word_times_real(narr):
    import voice
    wt = voice.word_times(narr) if voice.enabled() else None
    return [(a + .12, b + .12) for _, a, b in wt] if wt else None

def _word_times(words, L):
    wts = [max(2, len(w)) + (4 if w[-1:] in ".,!?;:" else 0) for w in words]; tot = sum(wts); out = []; t = .12
    for w, k in zip(words, wts): out.append((t, t + L * k / tot)); t += L * k / tot
    return out

def caption(img, text, lt, L, y=.74, real=None):
    words = text.replace("\n", " ").split()
    if not words: return
    wt = real if (real and len(real) == len(words)) else _word_times(words, L); idx = 0
    for i, (a, b) in enumerate(wt):
        if lt >= a: idx = i
    # chunk into lines of ~3 words showing the chunk that contains the active word
    chunks = []; cur = []
    for w in words:
        cur.append(w)
        if len(cur) >= 3 or w[-1:] in ".!?": chunks.append(cur); cur = []
    if cur: chunks.append(cur)
    c0 = 0
    for ch in chunks:
        if idx < c0 + len(ch): break
        c0 += len(ch)
    ch = chunks[[sum(len(x) for x in chunks[:i]) <= idx for i in range(len(chunks))].count(True) - 1]
    start = sum(len(x) for x in chunks[:chunks.index(ch)])
    size = 72; widths = [text_width(w, font("black", size), size) for w in ch]; gap = 30; total = sum(widths) + gap * (len(ch) - 1); x = CW / 2 - total / 2; yy = CH * y
    box(img, x - 34, yy - 58, x + total + 34, yy + 58, 34, (8, 10, 22), .62)
    for k, w in enumerate(ch):
        act = (start + k) == idx; u = lt - wt[start + k][0]
        col = (255, 214, 0) if act else ((255, 255, 255) if (start + k) < idx else (178, 184, 206))
        sc = (1 + .08 * math.sin(clamp(u / .18) * math.pi)) if act else 1.0
        L_ = text_layer(w, size, "black", col, stroke=0, maxw=900, pad=4); paste(img, L_, x + widths[k] / 2, yy, scale=sc); x += widths[k] + gap

BLOBS = [((90, 60, 255), 700, .22, .21, .13), ((255, 80, 140), 640, .17, .17, .09), ((40, 200, 255), 760, .15, .11, .17)]
def blobs(img, lt):
    for k, (col, r, a, fx, fy) in enumerate(BLOBS):
        glow(img, CW / 2 + math.sin(lt * fx + k * 2) * 420, CH * (.3 + .4 * k / 2) + math.cos(lt * fy + k) * 380, r, col, a)
_dust = None
def dust(img, lt, n=34, a=.22):
    global _dust
    if _dust is None:
        r = np.random.RandomState(11); _dust = [(r.rand() * CW, r.rand() * CH, 3 + r.rand() * 9, .4 + r.rand() * .9, r.rand() * 6.28) for _ in range(n)]
    for x, y, rad, sp, ph in _dust:
        yy = (y - lt * 38 * sp) % CH; xx = x + math.sin(lt * .6 * sp + ph) * 26; glow(img, xx, yy, rad * 3, (255, 255, 255), a * (.55 + .45 * math.sin(lt * 1.4 + ph)))

# ------------------------------------------------------------------ the shot
def _norm_w(w): return "".join(c for c in w.lower() if c.isalnum())

class Beat(_reel.Shot):
    """One narrated idea. draw(img, lt, p, beat) paints the animation; captions are added on top."""
    def __init__(self, narr, draw, dur=3.0, bg=None, cut="whip", cues=(), shake=None, cap=True, push=.05, segs=None):
        self.segs = segs
        if segs: narr = " ".join(t for _, t in segs); self.speech = [(o + .12, t, None) for o, t in segs]
        self.narr, self.draw, self.dur, self.bgf, self.cut, self.cap, self.push_ = narr, draw, dur, bg, cut, cap, push
        self.cues = list(cues); self.shake = shake; self._L = None; self.fit_speech = True; self.pad = .35
    def real_times(self):
        if not hasattr(self, "_rt"):
            import voice
            if self.segs:
                out = []
                for o, t in self.segs:
                    wt = voice.word_times(t) if voice.enabled() else None
                    if not wt: out = None; break
                    out += [(o + .12 + a, o + .12 + b) for _, a, b in wt]
                self._rt = out
            else: self._rt = _word_times_real(self.narr) if self.narr else None
        return self._rt
    def at(self, word, occ=0, default=None):
        """Time (s from the start of this beat) at which `word` is spoken, so an animation can fire exactly on it. Falls back to a proportional guess."""
        words = self.narr.split(); idx = [i for i, w in enumerate(words) if _norm_w(w) == _norm_w(word)]
        if not idx: return default if default is not None else 0.0
        i = idx[min(occ, len(idx) - 1)]; rt = self.real_times()
        if rt and len(rt) == len(words): return rt[i][0]
        return _word_times(words, self.speech_len())[i][0]
    def speech_len(self):
        if self._L is None:
            import voice
            if self.segs: L = max((o + (voice.seconds(t) or 0)) for o, t in self.segs) or None
            else: L = voice.seconds(self.narr) if self.narr else None
            self._L = L or max(1.2, .36 * len(self.narr.split()))
        return self._L
    def render(self, lt):
        p = clamp(lt / self.dur); img = self.bgf(lt) if self.bgf else space(lt)
        BOXES.clear()
        self.draw(img, lt, p, self)
        blobs(img, lt); dust(img, lt)
        if self.push_:
            z = 1 + self.push_ * p
            if z > 1.001:
                w, h = int(CW / z), int(CH / z); x0, y0 = (CW - w) // 2, (CH - h) // 2; img = img.crop((x0, y0, x0 + w, y0 + h)).resize((CW, CH), Image.BILINEAR)
        if self.cap and self.narr:
            BOXES.append((150, CH * .74 - 58, CW - 150, CH * .74 + 58, '<caption>', 1.0)); caption(img, self.narr, lt, self.speech_len(), real=self.real_times())
        self.boxes = list(BOXES)
        ImageDraw.Draw(img).rectangle([0, 0, int(CW * clamp(lt / self.dur)), 7], fill=(255, 214, 0))
        return img

class Clean(Beat):
    """Beat without the ambient colour blobs and dust, for scenes that paint their own whole background (sims, scale worlds)."""
    def render(self, lt):
        p = clamp(lt / self.dur); img = Image.new("RGB", (CW, CH), (6, 6, 14)); BOXES.clear(); self.draw(img, lt, p, self)
        if self.cap and self.narr:
            BOXES.append((150, CH * .74 - 58, CW - 150, CH * .74 + 58, '<caption>', 1.0)); caption(img, self.narr, lt, self.speech_len(), real=self.real_times())
        self.boxes = list(BOXES); ImageDraw.Draw(img).rectangle([0, 0, int(CW * clamp(lt / self.dur)), 7], fill=(255, 214, 0)); return img
