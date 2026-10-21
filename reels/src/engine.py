"""Core helpers for the reel renderer: text, easing, synthesized audio, video writer."""
import math, os, subprocess, wave, random
import numpy as np
from PIL import Image, ImageDraw, ImageFont

W, H, FPS = 1080, 1920, 30
SR = 44100
FONT_DIR = "/usr/share/fonts/opentype/inter/"
WEIGHTS = {"reg": "Inter-Regular.otf", "med": "Inter-Medium.otf", "semi": "Inter-SemiBold.otf",
           "bold": "Inter-Bold.otf", "xbold": "Inter-ExtraBold.otf", "black": "Inter-Black.otf"}
EMOJI_FONT = "/usr/share/fonts/truetype/noto/NotoColorEmoji.ttf"

YELLOW = (255, 212, 0)
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)

# ---------------------------------------------------------------- easing
def clamp(x, a=0.0, b=1.0): return max(a, min(b, x))
def lerp(a, b, t): return a + (b - a) * t
def out_cubic(t): t = clamp(t); return 1 - (1 - t) ** 3
def in_cubic(t): t = clamp(t); return t ** 3
def in_out(t): t = clamp(t); return t * t * (3 - 2 * t)
def out_back(t, k=1.9):
    t = clamp(t) - 1
    return 1 + (k + 1) * t ** 3 + k * t ** 2
def out_elastic(t):
    t = clamp(t)
    if t in (0, 1): return t
    return 2 ** (-9 * t) * math.sin((t * 10 - 0.75) * (2 * math.pi) / 3) + 1
def rgb(h):
    h = h.lstrip("#")
    if len(h) == 3: h = "".join(c * 2 for c in h)
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))
def shade(c, f): return tuple(int(clamp(v * f, 0, 255)) for v in c)

# ---------------------------------------------------------------- fonts / text
_fonts, _emoji_cache, _emoji_font = {}, {}, None
def font(weight, size):
    k = (weight, int(size))
    if k not in _fonts: _fonts[k] = ImageFont.truetype(FONT_DIR + WEIGHTS[weight], int(size))
    return _fonts[k]

def is_emoji(ch): return ord(ch) >= 0x1F000 or ch in "❤✨☕✅❌⭐⚡☠♥✌☺✔✖⏰⌛⚠☀☁✈"

def emoji_img(ch, size):
    global _emoji_font
    k = (ch, int(size))
    if k not in _emoji_cache:
        if _emoji_font is None: _emoji_font = ImageFont.truetype(EMOJI_FONT, 109)
        t = Image.new("RGBA", (136, 128), (0, 0, 0, 0))
        ImageDraw.Draw(t).text((0, 0), ch, font=_emoji_font, embedded_color=True)
        t = t.crop(t.getbbox() or (0, 0, 136, 128))
        sc = size / 128 * 1.0
        _emoji_cache[k] = t.resize((max(1, int(t.width * sc)), max(1, int(t.height * sc))), Image.LANCZOS)
    return _emoji_cache[k]

def text_width(s, f, size):
    w = 0
    for ch in s:
        if ch == "️": continue
        w += size * 1.05 if is_emoji(ch) else f.getlength(ch) if len(s) < 2 else 0
    if not any(is_emoji(c) for c in s): return f.getlength(s)
    # mixed: measure runs
    w, run = 0, ""
    for ch in s:
        if ch == "️": continue
        if is_emoji(ch):
            w += f.getlength(run) + size * 1.05; run = ""
        else: run += ch
    return w + f.getlength(run)

def draw_line(img, x, y, s, weight, size, fill, stroke=0, stroke_fill=BLACK):
    """Draw one line (emoji aware) with its left edge at x and top at y. Returns width."""
    d = ImageDraw.Draw(img)
    f = font(weight, size)
    run, cx = "", x
    def flush():
        nonlocal run, cx
        if run:
            d.text((cx, y), run, font=f, fill=fill, stroke_width=stroke, stroke_fill=stroke_fill)
            cx += f.getlength(run); run = ""
    for ch in s:
        if ch == "️": continue
        if is_emoji(ch):
            flush()
            e = emoji_img(ch, size * 0.95)
            img.paste(e, (int(cx), int(y + size * 0.12)), e); cx += size * 1.05
        else: run += ch
    flush()
    return cx - x

def wrap(s, weight, size, maxw):
    f = font(weight, size)
    out = []
    for para in s.split("\n"):
        line = ""
        for w in para.split(" "):
            t = (line + " " + w).strip()
            if text_width(t, f, size) <= maxw or not line: line = t
            else: out.append(line); line = w
        out.append(line)
    return out

def _hl_set(tokens, phrases):
    norm = lambda w: "".join(c for c in w.lower() if c.isalnum() or c in "$%.:")
    nt = [norm(t) for t in tokens]
    hit = set()
    for p in phrases or []:
        pt = [norm(x) for x in p.split()]
        for i in range(len(nt) - len(pt) + 1):
            if nt[i:i + len(pt)] == pt: hit.update(range(i, i + len(pt)))
    return hit

_layer_cache = {}
def text_layer(s, size=48, weight="xbold", fill=WHITE, stroke=0, stroke_fill=BLACK, maxw=900,
               align="center", hl=None, hl_color=YELLOW, spacing=1.18, pad=None):
    key = (s, size, weight, fill, stroke, stroke_fill, maxw, align, tuple(hl or []), hl_color, spacing)
    if key in _layer_cache: return _layer_cache[key]
    pad = pad if pad is not None else stroke + 8
    lines = wrap(s, weight, size, maxw)
    f = font(weight, size)
    lh = int(size * spacing)
    widths = [text_width(l, f, size) for l in lines]
    lw, lhh = int(max(widths) + pad * 2 + 4), lh * len(lines) + pad * 2
    L = Image.new("RGBA", (lw, lhh), (0, 0, 0, 0))
    # tokens run across lines in order, so highlight indexes are global
    all_tokens = [t for l in lines for t in l.split(" ")]
    hit = _hl_set(all_tokens, hl)
    idx = 0
    for li, line in enumerate(lines):
        toks = line.split(" ")
        x0 = pad + {"left": 0, "center": (lw - pad * 2 - widths[li]) / 2, "right": lw - pad * 2 - widths[li]}[align]
        x = x0
        for ti, t in enumerate(toks):
            col = hl_color if idx in hit else fill
            w = draw_line(L, x, pad + li * lh, t, weight, size, col, stroke, stroke_fill)
            x += w + f.getlength(" ")
            idx += 1
    if len(_layer_cache) > 600: _layer_cache.clear()
    _layer_cache[key] = L
    return L

def paste(img, layer, cx, cy, scale=1.0, alpha=1.0, rot=0.0, anchor="c"):
    """Paste an RGBA layer centered at (cx, cy) (anchor 'c') or with top-center at (cx, cy) ('t')."""
    if scale <= 0.01 or alpha <= 0.01: return
    if scale != 1.0:
        layer = layer.resize((max(1, int(layer.width * scale)), max(1, int(layer.height * scale))), Image.BILINEAR)
    if rot: layer = layer.rotate(rot, resample=Image.BILINEAR, expand=True)
    if alpha < 1.0:
        a = layer.getchannel("A").point(lambda v: int(v * alpha)); layer = layer.copy(); layer.putalpha(a)
    x = int(cx - layer.width / 2); y = int(cy - (layer.height / 2 if anchor == "c" else 0))
    img.paste(layer, (x, y), layer)

def rrect(d, box, r, fill, outline=None, width=0):
    d.rounded_rectangle(box, r, fill=fill, outline=outline, width=width)

# ---------------------------------------------------------------- audio synth
def _env(n, a=0.005, r=0.1):
    e = np.ones(n); na, nr = int(a * SR), int(r * SR)
    if na: e[:na] = np.linspace(0, 1, na)
    if nr: e[-nr:] = np.minimum(e[-nr:], np.linspace(1, 0, nr))
    return e
def _t(dur): return np.arange(int(dur * SR)) / SR
def _lp(x, k):  # crude one-pole lowpass
    out = np.empty_like(x); a = 0.0
    for i in range(0, len(x)): a += k * (x[i] - a); out[i] = a
    return out
_noise = np.random.RandomState(7).uniform(-1, 1, SR * 2)
def _tone(f0, f1, dur, shape="sin"):
    t = _t(dur); f = np.linspace(f0, f1, len(t)); ph = 2 * np.pi * np.cumsum(f) / SR
    if shape == "tri": return 2 / np.pi * np.arcsin(np.sin(ph))
    if shape == "saw": return 2 * ((ph / (2 * np.pi)) % 1) - 1
    if shape == "sq": return np.sign(np.sin(ph)) * 0.6
    return np.sin(ph)

def sfx(name):
    if name == "pop":
        x = _tone(500, 1100, 0.09) * _env(int(.09 * SR), .002, .06); return x * .8
    if name == "whoosh":
        n = _noise[:int(.35 * SR)]; x = np.convolve(n, np.ones(40) / 40, "same")
        env = np.sin(np.linspace(0, np.pi, len(x))) ** 2
        return x * env * 1.6
    if name == "swipe":
        n = _noise[:int(.18 * SR)]; x = np.convolve(n, np.ones(14) / 14, "same")
        return x * np.sin(np.linspace(0, np.pi, len(x))) * 1.4
    if name == "ding":
        t = _t(.55); x = (np.sin(2 * np.pi * 1318 * t) + .5 * np.sin(2 * np.pi * 1760 * t)) * np.exp(-6 * t)
        return x * .55
    if name == "sent":
        x = _tone(700, 1500, .12) * _env(int(.12 * SR), .002, .08); return x * .55
    if name == "recv":
        t = _t(.3); x = (np.sin(2 * np.pi * 880 * t) + np.sin(2 * np.pi * 1175 * t)) * np.exp(-9 * t); return x * .45
    if name == "thud":
        t = _t(.3); x = np.sin(2 * np.pi * np.cumsum(np.linspace(140, 45, len(t))) / SR) * np.exp(-12 * t)
        return (x + .25 * _noise[:len(t)] * np.exp(-40 * t)) * 1.1
    if name == "clang":
        t = _t(.7); x = sum(np.sin(2 * np.pi * f * t) * a for f, a in [(523, 1), (1170, .7), (1790, .5), (2650, .3)])
        return x * np.exp(-6 * t) * .35
    if name == "womp":
        a = _tone(300, 250, .22, "saw"); b = _tone(250, 200, .22, "saw"); c = _tone(210, 90, .5, "saw")
        x = np.concatenate([a * _env(len(a), .01, .03), b * _env(len(b), .01, .03), c * _env(len(c), .01, .3)])
        return _lp(x, .08) * 1.5
    if name == "cash":
        t = _t(.5); x = (np.sin(2 * np.pi * 2093 * t) + np.sin(2 * np.pi * 2637 * t)) * np.exp(-7 * t)
        return x * .4
    if name == "boing":
        t = _t(.4); f = 300 + 250 * np.sin(2 * np.pi * 14 * t) * np.exp(-6 * t)
        x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-5 * t); return x * .7
    if name == "tick":
        return _noise[:int(.012 * SR)] * np.linspace(1, 0, int(.012 * SR)) * .7
    if name == "riser":
        t = _t(1.0); x = _tone(200, 1400, 1.0, "saw") * np.linspace(0, 1, len(t)) ** 2
        return _lp(x, .15) * .6
    if name == "bruh":
        x = _tone(180, 90, .5, "sq") * _env(int(.5 * SR), .01, .25); return _lp(x, .06) * 1.6
    if name == "wow":
        x = np.concatenate([_tone(400, 600, .15, "tri"), _tone(600, 900, .25, "tri")]); return x * _env(len(x), .01, .15) * .5
    if name == "alarm":
        x = np.concatenate([_tone(900, 900, .12, "sq"), np.zeros(int(.06 * SR)), _tone(900, 900, .12, "sq")])
        return x * .35
    raise KeyError(name)

SCALES = {"minor": [0, 3, 5, 7, 10, 12, 15], "major": [0, 2, 4, 7, 9, 12, 14]}
def bed(dur, seed=0, bpm=None, mode=None):
    rnd = random.Random(seed)
    bpm = bpm or rnd.choice([92, 98, 104, 110, 118])
    mode = mode or rnd.choice(["minor", "major"])
    root = rnd.choice([43, 45, 46, 48, 50])
    scale = SCALES[mode]
    n = int((dur + 1) * SR); out = np.zeros(n)
    beat = 60 / bpm
    mtof = lambda m: 440 * 2 ** ((m - 69) / 12)
    def add(x, t0, g):
        i = int(t0 * SR)
        if i >= n: return
        x = x[:n - i]; out[i:i + len(x)] += x * g
    kick = _tone(130, 45, .22) * np.exp(-_t(.22) * 14)
    snare = _noise[:int(.14 * SR)] * np.exp(-_t(.14) * 28)
    hat = _noise[:int(.04 * SR)] * np.exp(-_t(.04) * 90)
    hat = hat - np.concatenate([[0], hat[:-1]])  # highpass-ish
    bar_pat = [rnd.choice([0, 0, 3, 4]) for _ in range(4)]
    arp = [rnd.randrange(len(scale)) for _ in range(8)]
    cache = {}
    def note(m, d, shape):
        k = (m, d, shape)
        if k not in cache: cache[k] = _tone(mtof(m), mtof(m), d, shape) * np.exp(-_t(d) * (6 if shape == "sin" else 3))
        return cache[k]
    b = 0
    while b * beat < dur + 1:
        t0 = b * beat; bi = b % 4
        if bi in (0, 2): add(kick, t0, .55)
        if bi in (1, 3): add(snare, t0, .16)
        add(hat, t0, .09); add(hat, t0 + beat / 2, .06)
        deg = bar_pat[bi]; m = root + scale[deg % len(scale)]
        add(note(m, beat * .9, "tri"), t0, .3)
        for h in range(2):
            a = arp[(b * 2 + h) % 8]
            add(note(root + 24 + scale[a], beat * .5, "sin"), t0 + h * beat / 2, .12)
        b += 1
    return out[:int(dur * SR)]

def mix_audio(path, dur, events, seed=0, bed_gain=.5):
    out = bed(dur, seed) * bed_gain
    out = np.concatenate([out, np.zeros(int(.5 * SR))])
    cache = {}
    for t, name, *g in events:
        gain = g[0] if g else 1.0
        if name not in cache: cache[name] = sfx(name)
        x = cache[name]; i = int(t * SR)
        if i < 0 or i >= len(out): continue
        x = x[:len(out) - i]; out[i:i + len(x)] += x * gain
    out = out[:int(dur * SR)]
    fade = int(.4 * SR); out[-fade:] *= np.linspace(1, 0, fade)
    out = out / max(1e-6, np.abs(out).max()) * .88
    pcm = (out * 32767).astype(np.int16)
    with wave.open(path, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())

# ---------------------------------------------------------------- render
def render(out_path, dur, frame_fn, events, seed=0, bed_gain=.5, crf=25):
    wav = out_path + ".wav"
    mix_audio(wav, dur, events, seed, bed_gain)
    cmd = ["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS),
           "-i", "-", "-i", wav, "-c:v", "libx264", "-preset", "veryfast", "-crf", str(crf), "-pix_fmt", "yuv420p",
           "-c:a", "aac", "-b:a", "128k", "-shortest", "-movflags", "+faststart", out_path]
    p = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    for i in range(int(dur * FPS)):
        p.stdin.write(frame_fn(i / FPS).tobytes())
    p.stdin.close(); p.wait(); os.remove(wav)
