"""Procedural music: 8 genre presets, seeded so every reel gets its own track.
Everything is synthesized with numpy/scipy, so there is nothing to license."""
import random
import numpy as np
from scipy import signal

SR = 44100
def mtof(m): return 440.0 * 2 ** ((m - 69) / 12)
_rs = np.random.RandomState(11)
NOISE = _rs.uniform(-1, 1, SR * 4)

def T(dur): return np.arange(int(dur * SR)) / SR
def lp(x, fc, order=2): return signal.sosfilt(signal.butter(order, fc, "low", fs=SR, output="sos"), x)
def hp(x, fc, order=2): return signal.sosfilt(signal.butter(order, fc, "high", fs=SR, output="sos"), x)
def bp(x, lo, hi): return signal.sosfilt(signal.butter(2, [lo, hi], "band", fs=SR, output="sos"), x)
def adsr(n, a=.005, d=.1, s=.7, r=.1):
    e = np.ones(n); na, nd, nr = int(a * SR), int(d * SR), int(r * SR)
    na = min(na, n); e[:na] = np.linspace(0, 1, max(na, 1))
    nd = min(nd, n - na); e[na:na + nd] = np.linspace(1, s, max(nd, 1)); e[na + nd:] = s
    nr = min(nr, n); e[n - nr:] *= np.linspace(1, 0, max(nr, 1))
    return e
def saw(ph): return 2 * ((ph / (2 * np.pi)) % 1) - 1
def tri(ph): return 2 / np.pi * np.arcsin(np.sin(ph))

# ------------------------------------------------------------ drums
def kick(v=1.0):
    t = T(.32); f = 45 + 110 * np.exp(-t * 38)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 11)
    x += .35 * NOISE[:len(t)] * np.exp(-t * 300)
    return np.tanh(x * 1.6) * v * .95
def kick808(v=1.0, dur=.7):
    t = T(dur); f = 38 + 90 * np.exp(-t * 45)
    return np.tanh(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 4.2) * 1.8) * v
def snare(v=1.0):
    t = T(.22); n = hp(NOISE[:len(t)], 1500) * np.exp(-t * 20)
    tone = np.sin(2 * np.pi * 190 * t) * np.exp(-t * 28)
    return (n * .8 + tone * .6) * v
def clap(v=1.0):
    out = np.zeros(int(.3 * SR))
    for off in (0, .011, .023):
        i = int(off * SR); seg = bp(NOISE[i:i + int(.2 * SR)], 900, 3500) * np.exp(-T(.2)[:len(NOISE[i:i + int(.2 * SR)])] * (30 if off < .02 else 14))
        out[i:i + len(seg)] += seg
    return out * v * 1.3
def hat(v=1.0, open_=False):
    d = .22 if open_ else .05
    t = T(d); x = hp(NOISE[1000:1000 + len(t)], 7000) * np.exp(-t * (14 if open_ else 80))
    return x * v * .55
def rim(v=1.0):
    t = T(.05); return (np.sin(2 * np.pi * 1700 * t) + .6 * hp(NOISE[:len(t)], 2000)) * np.exp(-t * 90) * v * .5
def shaker(v=1.0):
    t = T(.07); return bp(NOISE[3000:3000 + len(t)], 5000, 11000) * np.sin(np.linspace(0, np.pi, len(t))) * v * .5
def ride(v=1.0):
    t = T(.5); x = sum(np.sin(2 * np.pi * f * t) for f in (3100, 4200, 5300, 6900)) * .12
    return (hp(x + NOISE[:len(t)] * .15, 5000)) * np.exp(-t * 7) * v * .5
def crash(v=1.0):
    t = T(1.6); return hp(NOISE[:len(t)], 4000) * np.exp(-t * 2.6) * v * .55

# ------------------------------------------------------------ pitched
def keys(f, dur, v=1.0):
    n = int(dur * SR); t = np.arange(n) / SR
    x = np.sin(2 * np.pi * f * t) + .42 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t * 5) + .16 * np.sin(2 * np.pi * 3.01 * f * t) * np.exp(-t * 9)
    x += .06 * np.sin(2 * np.pi * 7 * f * t) * np.exp(-t * 40)
    x *= (1 + .08 * np.sin(2 * np.pi * 5 * t))
    return x * np.exp(-t * 2.2) * adsr(n, .004, .01, 1, .12) * v * .5
def pluck(f, dur, v=1.0):
    n = int(dur * SR); t = np.arange(n) / SR
    x = np.sin(2 * np.pi * f * t) + .5 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t * 12) + .25 * np.sin(2 * np.pi * 4 * f * t) * np.exp(-t * 28)
    return x * np.exp(-t * 6.5) * adsr(n, .002, .01, 1, .05) * v * .55
def marimba(f, dur, v=1.0):
    n = int(dur * SR); t = np.arange(n) / SR
    x = np.sin(2 * np.pi * f * t) + .45 * np.sin(2 * np.pi * 4 * f * t) * np.exp(-t * 30) + .15 * np.sin(2 * np.pi * 9.2 * f * t) * np.exp(-t * 60)
    return x * np.exp(-t * 9) * adsr(n, .001, .01, 1, .04) * v * .6
def bell(f, dur, v=1.0):
    n = int(dur * SR); t = np.arange(n) / SR
    x = sum(a * np.sin(2 * np.pi * f * r * t) * np.exp(-t * d) for r, a, d in [(1, 1, 3), (2.76, .5, 5), (5.4, .3, 9), (8.9, .15, 14)])
    return x * adsr(n, .001, .01, 1, .05) * v * .35
def bass(f, dur, v=1.0, drive=1.8):
    n = int(dur * SR); t = np.arange(n) / SR
    ph = 2 * np.pi * f * t
    x = np.sin(ph) + .3 * tri(ph) + .15 * np.sin(2 * ph)
    return np.tanh(x * drive) * adsr(n, .004, .08, .75, .06) * v * .6
def slapbass(f, dur, v=1.0):
    n = int(dur * SR); t = np.arange(n) / SR
    ph = 2 * np.pi * f * t
    x = saw(ph) * .5 + np.sin(ph) * .8
    x = lp(x, 1800)
    return np.tanh(x * 1.8) * np.exp(-t * 5) * adsr(n, .002, .02, 1, .04) * v * .6
def sub(f, dur, v=1.0):
    n = int(dur * SR); t = np.arange(n) / SR
    fr = f * (1 + 1.2 * np.exp(-t * 60))
    x = np.sin(2 * np.pi * np.cumsum(fr) / SR)
    return np.tanh(x * 2.0) * adsr(n, .003, .1, .85, .08) * v * .8
def pad(f, dur, v=1.0, bright=1400):
    n = int(dur * SR); t = np.arange(n) / SR; x = np.zeros(n)
    for det in (-9, 0, 8):
        ph = 2 * np.pi * f * 2 ** (det / 1200) * t + det
        x += saw(ph)
    x = lp(x / 3, bright)
    return x * adsr(n, min(.35, dur * .4), .1, .9, min(.5, dur * .4)) * v * .35
def lead(f, dur, v=1.0, shape="saw", vib=5.0):
    n = int(dur * SR); t = np.arange(n) / SR
    fr = f * (1 + .006 * np.sin(2 * np.pi * vib * t) * np.minimum(1, t * 4))
    ph = 2 * np.pi * np.cumsum(fr) / SR
    x = saw(ph) if shape == "saw" else np.sign(np.sin(ph)) * .6 if shape == "sq" else tri(ph)
    x = lp(x, 3200)
    return x * adsr(n, .01, .06, .8, .1) * v * .4
def stab(fs, dur, v=1.0):
    n = int(dur * SR); t = np.arange(n) / SR; x = np.zeros(n)
    for f in fs: x += saw(2 * np.pi * f * t)
    x = lp(x / max(1, len(fs)), 1800)
    return x * np.exp(-t * 7) * adsr(n, .002, .02, 1, .03) * v * .9

# ------------------------------------------------------------ theory
CHORDS = {"maj": [0, 4, 7], "min": [0, 3, 7], "maj7": [0, 4, 7, 11], "min7": [0, 3, 7, 10], "dom7": [0, 4, 7, 10], "min9": [0, 3, 7, 10, 14], "maj9": [0, 4, 7, 11, 14], "sus": [0, 5, 7], "dim": [0, 3, 6]}
# progressions as (semitone-from-root, chord quality)
PROGS = {
    "lofi":   [[(0, "maj7"), (9, "min7"), (5, "maj7"), (7, "dom7")], [(2, "min7"), (7, "dom7"), (0, "maj7"), (9, "min7")], [(0, "maj9"), (5, "maj7"), (4, "min7"), (9, "min7")]],
    "bounce": [[(0, "maj"), (5, "maj"), (7, "maj"), (0, "maj")], [(0, "maj"), (9, "min"), (5, "maj"), (7, "maj")], [(0, "maj"), (7, "maj"), (9, "min"), (5, "maj")]],
    "trap":   [[(0, "min"), (8, "maj"), (3, "maj"), (10, "maj")], [(0, "min"), (5, "min"), (8, "maj"), (7, "maj")], [(0, "min"), (0, "min"), (8, "maj"), (10, "maj")]],
    "funk":   [[(0, "min9"), (5, "dom7"), (0, "min9"), (7, "dom7")], [(0, "min7"), (0, "min7"), (5, "dom7"), (5, "dom7")], [(2, "min7"), (7, "dom7"), (0, "min9"), (0, "min9")]],
    "synth":  [[(0, "min"), (8, "maj"), (3, "maj"), (10, "maj")], [(9, "min"), (5, "maj"), (0, "maj"), (7, "maj")], [(0, "min"), (3, "maj"), (8, "maj"), (7, "maj")]],
    "cine":   [[(0, "min"), (0, "min"), (8, "maj"), (7, "maj")], [(0, "min"), (6, "dim"), (0, "min"), (7, "maj")]],
    "pop":    [[(0, "maj"), (7, "maj"), (9, "min"), (5, "maj")], [(9, "min"), (5, "maj"), (0, "maj"), (7, "maj")], [(0, "maj"), (9, "min"), (5, "maj"), (7, "maj")]],
    "jazz":   [[(2, "min7"), (7, "dom7"), (0, "maj7"), (0, "maj7")], [(0, "maj7"), (9, "min7"), (2, "min7"), (7, "dom7")]],
}
PENT = {"maj": [0, 2, 4, 7, 9], "min": [0, 3, 5, 7, 10]}
def mode_of(style): return "min" if style in ("trap", "funk", "synth", "cine") else "maj"

STYLES = {
    "lofi":   dict(bpm=(76, 88), swing=.14, rev=.35, mel="keys", mix=dict(drums=.8, bass=.8, harm=.9, mel=.7)),
    "bounce": dict(bpm=(108, 120), swing=.04, rev=.15, mel="marimba", mix=dict(drums=.8, bass=.85, harm=.7, mel=.95)),
    "trap":   dict(bpm=(132, 144), swing=0, rev=.25, mel="bell", mix=dict(drums=.9, bass=1.0, harm=.6, mel=.8)),
    "funk":   dict(bpm=(98, 108), swing=.08, rev=.12, mel="pluck", mix=dict(drums=.85, bass=.95, harm=.85, mel=.7)),
    "synth":  dict(bpm=(100, 116), swing=0, rev=.3, mel="lead", mix=dict(drums=.85, bass=.9, harm=.7, mel=.75)),
    "cine":   dict(bpm=(78, 90), swing=0, rev=.5, mel="bell", mix=dict(drums=.6, bass=.9, harm=1.0, mel=.55)),
    "pop":    dict(bpm=(116, 124), swing=0, rev=.2, mel="lead", mix=dict(drums=.9, bass=.85, harm=.85, mel=.8)),
    "jazz":   dict(bpm=(88, 100), swing=.2, rev=.3, mel="keys", mix=dict(drums=.6, bass=.85, harm=.85, mel=.75)),
}
MELS = dict(keys=keys, marimba=marimba, bell=bell, pluck=pluck, lead=lead)

def beat_len(style, seed):
    rnd = random.Random(seed); lo, hi = STYLES[style]["bpm"]
    bpm = rnd.randrange(lo, hi + 1, 2)
    return bpm, 60.0 / bpm

def make_melody(rnd, style, root, bars):
    pent = PENT[mode_of(style)]; scale = [p + 12 * o for o in (1, 2) for p in pent]
    # 2-bar motif on 16 steps/bar
    rhy = rnd.choice([[0, 3, 6, 8, 10, 12], [0, 2, 4, 8, 11, 14], [0, 4, 6, 8, 12, 14], [2, 4, 8, 10, 12, 15], [0, 3, 8, 10]])
    idx = rnd.randrange(3, 7); motif = []
    for k, st in enumerate(rhy * 2 if len(rhy) < 6 else rhy):
        idx = int(np.clip(idx + rnd.choice([-2, -1, -1, 0, 1, 1, 2]), 0, len(scale) - 1)); motif.append((st % 16 + 16 * (k >= len(rhy)), idx))
    out = {}
    for b in range(bars):
        if b % 4 == 0 and b == 0: continue
        for st, i in motif:
            bar = b - (b % 2) if True else b
            if st // 16 == b % 2: out.setdefault(b, []).append((st % 16, root + 12 + scale[i]))
        if b % 4 == 3 and b in out: out[b] = out[b][:-1] + [(out[b][-1][0], root + 12 + scale[rnd.choice([0, 2, 4])])]
    return out

def render_music(dur, style="lofi", seed=0, bpm=None):
    rnd = random.Random(seed)
    cfg = STYLES[style]
    bpm_, bl = beat_len(style, seed)
    if bpm: bpm_, bl = bpm, 60.0 / bpm
    sd = bl / 4
    n = int((dur + 1.5) * SR)
    stems = {k: np.zeros(n) for k in ("kick", "drums", "bass", "harm", "mel", "fx")}
    def put(stem, x, t0, g=1.0):
        i = int(t0 * SR)
        if i < 0 or i >= n: return
        x = x[:n - i]; stems[stem][i:i + len(x)] += x * g
    root = rnd.choice([40, 41, 43, 45, 46, 48, 50]) if True else 45
    prog = rnd.choice(PROGS[style])
    bars = int(dur / (bl * 4)) + 2
    mel = make_melody(rnd, style, root + 12, bars)
    melf = MELS[cfg["mel"]]
    def st_t(b, s): return b * bl * 4 + s * sd + (cfg["swing"] * sd if s % 2 == 1 else 0)
    last_bar = int(dur / (bl * 4))
    for b in range(bars):
        off, q = prog[b % len(prog)]; croot = root + off; ch = [croot + i for i in CHORDS[q]]
        t0 = b * bl * 4
        if t0 > dur: break
        v = lambda s, base=1.0, jit=.06: base * (1 - jit + rnd.random() * jit)
        final = b >= last_bar
        # ---------- drums + bass + harmony by style
        if style == "lofi":
            for s, vel in [(0, 1), (10, .8)] + ([(7, .5)] if b % 2 else []): put("kick", kick(vel), st_t(b, s), .9)
            for s in (4, 12): put("drums", snare(v(s, .7)), st_t(b, s))
            for s in range(0, 16, 2): put("drums", hat(v(s, .55 if s % 4 else .8)), st_t(b, s))
            put("drums", hat(.5, True), st_t(b, 14)) if b % 2 else None
            put("bass", bass(mtof(croot - 12), bl * 1.8, .9, 1.2), t0); put("bass", bass(mtof(croot - 12 + (7 if b % 2 else 0)), bl * 1.6, .7, 1.2), t0 + bl * 2.5)
            for k, m in enumerate(ch): put("harm", keys(mtof(m + 12), bl * 3.6, .65), t0 + k * .018)
            if b % 2: [put("harm", keys(mtof(m + 12), bl * 1.2, .45), t0 + bl * 2.75 + k * .015) for k, m in enumerate(ch[:3])]
        elif style == "bounce":
            for s in (0, 8): put("kick", kick(.9), st_t(b, s), .85)
            for s in (4, 12): put("drums", clap(.8), st_t(b, s))
            for s in range(2, 16, 4): put("drums", hat(.7, s == 14), st_t(b, s))
            for s in range(0, 16, 2): put("drums", shaker(v(s, .5)), st_t(b, s))
            for k in range(4):
                put("bass", bass(mtof(croot - 12 + (7 if k % 2 else 0)), bl * .45, .85, 1.0), t0 + k * bl)
                put("harm", pluck(mtof(ch[0] + 12), bl * .3, .55), t0 + k * bl + bl * .5); [put("harm", pluck(mtof(m + 12), bl * .3, .5), t0 + k * bl + bl * .5 + .01) for m in ch[1:3]]
        elif style == "trap":
            for s in ([0, 7, 10] if b % 2 == 0 else [0, 3, 10]): put("kick", kick808(.9, bl * 1.2), st_t(b, s), .9); put("bass", sub(mtof(croot - 12), bl * .9, .9), st_t(b, s))
            put("drums", snare(1.0), st_t(b, 8)); put("drums", clap(.9), st_t(b, 8))
            for s in range(0, 16): 
                if s % 2 == 0 or (b % 4 == 3 and s > 11): put("drums", hat(v(s, .6 if s % 4 else .85)), st_t(b, s))
            if b % 4 == 3: [put("drums", hat(.5), st_t(b, 14) + k * sd / 3) for k in range(3)]
            for k, m in enumerate(ch): put("harm", pad(mtof(m + 12), bl * 4, .55, 900), t0)
        elif style == "funk":
            for s in (0, 3, 6, 10): put("kick", kick(.85), st_t(b, s), .85)
            for s in (4, 12): put("drums", snare(1.0), st_t(b, s))
            for s in range(16): put("drums", hat(v(s, .5 if s % 2 else .75), s in (7, 15)), st_t(b, s))
            for s, o in [(0, 0), (3, 0), (6, 12), (8, 0), (10, 7), (12, 0), (14, 10)]:
                put("bass", slapbass(mtof(croot - 12 + o), sd * 1.6, .85), st_t(b, s))
            for s in (2, 5, 9, 11, 13): put("harm", stab([mtof(m + 12) for m in ch[:4]], sd * 1.3, .5), st_t(b, s))
        elif style == "synth":
            for s in (0, 4, 8, 12): put("kick", kick(.95), st_t(b, s), .9)
            for s in (4, 12): put("drums", snare(.9), st_t(b, s)); put("drums", clap(.5), st_t(b, s))
            for s in range(2, 16, 4): put("drums", hat(.7, True), st_t(b, s))
            for s in range(0, 16, 2): put("bass", bass(mtof(croot - 12), sd * 1.8, .7, 2.2), st_t(b, s))
            for k, m in enumerate(ch): put("harm", pad(mtof(m + 12), bl * 4, .7, 1800), t0)
            for s in range(16): put("harm", lead(mtof(ch[(s // 1) % 3] + 24), sd * .9, .35, "saw", 0), st_t(b, s))
        elif style == "cine":
            put("kick", kick808(.8, 1.0), t0, .8); put("kick", kick808(.55, 1.0), t0 + bl * .5, .6)
            put("kick", kick808(.8, 1.0), t0 + bl * 2, .8); put("kick", kick808(.55, 1.0), t0 + bl * 2.5, .6)
            for s in range(0, 16, 4): put("drums", rim(.5), st_t(b, s + 2))
            put("bass", sub(mtof(croot - 12), bl * 3.8, .8), t0)
            for m in ch: put("harm", pad(mtof(m), bl * 4.2, .9, 1100), t0)
        elif style == "pop":
            for s in (0, 4, 8, 12): put("kick", kick(.95), st_t(b, s), .9)
            for s in (4, 12): put("drums", clap(.95), st_t(b, s))
            for s in (2, 6, 10, 14): put("drums", hat(.75, True), st_t(b, s))
            for s in range(0, 16, 2): put("drums", hat(.35), st_t(b, s))
            for s in range(0, 16, 2): put("bass", bass(mtof(croot - 12), sd * 1.8, .75, 1.6), st_t(b, s + 0)) if s not in (6, 14) else None
            for s in (0, 3, 6, 8, 11, 14): [put("harm", keys(mtof(m + 12), sd * 2.5, .5), st_t(b, s)) for m in ch[:3]]
        elif style == "jazz":
            for k in range(4): put("drums", ride(.8 if k % 2 == 0 else .55), t0 + k * bl); put("drums", ride(.4), t0 + k * bl + bl * (2 / 3 + cfg["swing"]))
            for k in (1, 3): put("drums", hat(.6), t0 + k * bl)
            put("kick", kick(.45), t0, .6)
            walk = [0, 4, 7, 9] if b % 2 == 0 else [0, 7, 5, 4]
            for k, w in enumerate(walk): put("bass", bass(mtof(croot - 12 + w), bl * .9, .85, 1.0), t0 + k * bl)
            for s in (0, 6, 10): [put("harm", keys(mtof(m + 12), bl * 1.2, .5), st_t(b, s) + k * .01) for k, m in enumerate(ch)]
        # ---------- melody (enters bar 1, drops out on last bar)
        if b >= 1 and not final:
            notes = mel.get(b, [])
            for s, m in notes:
                put("mel", melf(mtof(m), bl * (.9 if style != "lofi" else 1.4), .8), st_t(b, s))
    # ---------- sidechain + bus processing
    t_all = np.arange(n) / SR
    kick_t = np.array(sorted([i / SR for i in np.where(np.abs(stems["kick"]) > .6)[0][::1]])) if False else None
    env_k = np.abs(stems["kick"]); env_k = lp(env_k, 18, 1); env_k = env_k / max(1e-6, env_k.max())
    duck = 1 - .55 * np.clip(env_k * 1.6, 0, 1)
    def reverb(x, amt):
        if amt <= 0: return np.zeros_like(x), np.zeros_like(x)
        L = int(1.3 * SR); r = np.random.RandomState(3)
        irl = lp(r.randn(L), 4500) * np.exp(-np.arange(L) / SR * 4.5); irr = lp(r.randn(L), 4500) * np.exp(-np.arange(L) / SR * 4.5)
        irl /= np.abs(irl).sum() ** .5 * 10; irr /= np.abs(irr).sum() ** .5 * 10
        return signal.fftconvolve(x, irl)[:len(x)] * amt, signal.fftconvolve(x, irr)[:len(x)] * amt
    mx = cfg["mix"]
    dry = stems["kick"] * .95 + stems["drums"] * mx["drums"] * .8 + stems["bass"] * mx["bass"] * duck + stems["harm"] * mx["harm"] * (.55 + .45 * duck) + stems["mel"] * mx["mel"]
    send = stems["harm"] * mx["harm"] + stems["mel"] * mx["mel"] + stems["drums"] * .3
    rl, rr = reverb(send, cfg["rev"])
    L_ = dry + rl; R_ = dry + rr
    if style == "lofi":
        crackle = (np.random.RandomState(5).rand(n) > .9993) * np.random.RandomState(6).uniform(-1, 1, n) * .25
        L_ = lp(L_, 7500) + crackle; R_ = lp(R_, 7500) + crackle
    out = np.stack([L_, R_], 1)[:int(dur * SR)]
    out = np.tanh(out * 1.1)
    return out / max(1e-6, np.abs(out).max()) * .9, bpm_, bl
