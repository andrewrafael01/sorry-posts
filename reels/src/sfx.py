"""Sound-effect library: every cue is synthesized, designed to match an on-screen action."""
import numpy as np
from music import SR, T, NOISE, lp, hp, bp, adsr, saw, tri

def _n(i, d): return NOISE[i:i + int(d * SR)]
def sweep(f0, f1, d, shape="sin", curve="lin"):
    t = T(d); u = t / d
    f = f0 * (f1 / f0) ** u if curve == "exp" else np.linspace(f0, f1, len(t))
    ph = 2 * np.pi * np.cumsum(f) / SR
    return {"sin": np.sin(ph), "saw": saw(ph), "sq": np.sign(np.sin(ph)) * .6, "tri": tri(ph)}[shape]

def make(name):
    if name.startswith("clk") and name[3:].isdigit():   # wooden domino click, clk<pitch Hz>
        f = int(name[3:]); t = T(.14)
        return (np.sin(2 * np.pi * f * t) * np.exp(-t * 45) * .7 + np.sin(2 * np.pi * f * 2.3 * t) * np.exp(-t * 90) * .25 + bp(_n(300, .14), 1500, 6000) * np.exp(-t * 160) * 1.2) * 1.1
    if name.startswith("n") and name[1:].isdigit():   # pitched glass/marimba note, n<midi>
        f = 440 * 2 ** ((int(name[1:]) - 69) / 12); t = T(.7)
        return (np.sin(2 * np.pi * f * t) + .30 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t * 16) + .12 * np.sin(2 * np.pi * 3.01 * f * t) * np.exp(-t * 30)) * np.exp(-t * 6.5) * (1 - np.exp(-t * 900)) * .55
    if name == "pop": return sweep(450, 1000, .09, "sin", "exp") * adsr(int(.09 * SR), .002, .01, 1, .05) * .8
    if name == "tick": return _n(0, .012) * np.linspace(1, 0, int(.012 * SR)) * .6
    if name == "key":  # keyboard / typing click
        x = bp(_n(200, .03), 1500, 6000) * np.exp(-T(.03) * 110); return x * 1.4
    if name == "whoosh":
        d = .38; x = bp(_n(500, d), 300, 3500); x = lp(x, 2200) * np.sin(np.linspace(0, np.pi, len(x))) ** 2
        return x * 3.2
    if name == "swipe":
        d = .2; x = bp(_n(900, d), 500, 5000) * np.sin(np.linspace(0, np.pi, int(d * SR))) ** 1.5; return x * 2.4
    if name == "sent":      # outgoing message
        a = sweep(900, 1500, .09, "sin") * adsr(int(.09 * SR), .002, .01, 1, .05)
        air = bp(_n(1200, .2), 1500, 7000) * np.sin(np.linspace(0, np.pi, int(.2 * SR)))
        x = np.zeros(len(air)); x[:len(a)] += a * .7; x += air * .3
        return x
    if name == "recv":      # incoming message tone
        t = T(.34); x = (np.sin(2 * np.pi * 988 * t) + .6 * np.sin(2 * np.pi * 1480 * t) * (t > .08)) * np.exp(-t * 11); return x * .6
    if name == "ding":
        t = T(.9); x = (np.sin(2 * np.pi * 1318 * t) + .4 * np.sin(2 * np.pi * 2637 * t) + .3 * np.sin(2 * np.pi * 3951 * t)) * np.exp(-t * 5.5); return x * .55
    if name == "buzz":      # phone vibrating on a table
        t = T(.55); x = np.sign(np.sin(2 * np.pi * 165 * t)) * (np.sin(2 * np.pi * 22 * t) > -.2) * .5
        return lp(x + _n(300, .55) * .12, 900) * adsr(len(t), .01, .02, 1, .06) * 1.5
    if name == "boom":      # big low impact for slams / punchlines
        t = T(1.1); f = 34 + 120 * np.exp(-t * 22)
        x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 3.4)
        x += lp(_n(2000, 1.1), 400) * np.exp(-t * 6) * 1.2
        return np.tanh(x * 2.2) * .95
    if name == "hit":       # shorter impact
        t = T(.45); f = 60 + 160 * np.exp(-t * 35)
        return np.tanh(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 8) * 2 + _n(2500, .45) * np.exp(-t * 40) * .6) * .9
    if name == "thud":
        t = T(.28); f = 130 * np.exp(-t * 9) + 40
        return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 14) * 1.1
    if name == "scratch":   # record scratch: awkward stop
        d = .55; a = sweep(900, 140, .28, "saw", "exp") * np.exp(-T(.28) * 4)
        b = sweep(180, 1100, .22, "saw", "exp") * np.exp(-T(.22) * 5)
        x = np.concatenate([a, b]); x = x + bp(_n(4000, len(x) / SR), 800, 5000)[:len(x)] * .5
        return lp(x, 4500) * adsr(len(x), .005, .02, 1, .08) * 1.0
    if name == "fail":      # sad trombone
        parts = []
        for f0, f1, d in [(311, 311, .35), (294, 294, .35), (277, 277, .35), (262, 233, .8)]:
            x = sweep(f0, f1, d, "saw") * (1 + .06 * np.sin(2 * np.pi * 5.5 * T(d)))
            parts.append(lp(x, 1400) * adsr(len(x), .03, .05, .8, .12))
        return np.concatenate(parts) * .5
    if name == "slide_down": return lp(sweep(1400, 220, .55, "tri", "exp"), 3000) * adsr(int(.55 * SR), .01, .02, 1, .1) * .5
    if name == "slide_up": return lp(sweep(220, 1500, .5, "tri", "exp"), 3500) * adsr(int(.5 * SR), .01, .02, 1, .08) * .5
    if name == "boing":
        t = T(.45); f = 330 + 260 * np.sin(2 * np.pi * 12 * t) * np.exp(-t * 7)
        return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 5.5) * .7
    if name == "crickets":
        out = np.zeros(int(1.6 * SR))
        for k in range(3):
            for j in range(3):
                t0 = int((k * .5 + j * .05) * SR); seg = np.sin(2 * np.pi * 4300 * T(.03)) * np.hanning(int(.03 * SR))
                out[t0:t0 + len(seg)] += seg * .35
        return out
    if name == "clock":     # ticking clock (6 ticks)
        out = np.zeros(int(3.0 * SR))
        for k in range(6):
            t0 = int(k * .5 * SR); tk = (bp(_n(5000 + k * 77, .02), 1800, 5500) * np.exp(-T(.02) * 150)) * 1.8
            out[t0:t0 + len(tk)] += tk * (1 if k % 2 == 0 else .75)
        return out
    if name == "alarm":
        out = np.zeros(int(1.2 * SR))
        for k in range(4):
            t0 = int(k * .3 * SR); seg = np.sign(np.sin(2 * np.pi * 1000 * T(.14))) * .3 * adsr(int(.14 * SR), .003, .01, 1, .01)
            out[t0:t0 + len(seg)] += seg
        return out
    if name == "cash":
        t = T(.6); x = (np.sin(2 * np.pi * 2093 * t) + np.sin(2 * np.pi * 3136 * t) * .7) * np.exp(-t * 6)
        x += bp(_n(7000, .6), 4000, 9000) * np.exp(-t * 14) * .6; return x * .5
    if name == "doorbell":
        a = np.sin(2 * np.pi * 659 * T(.5)) * np.exp(-T(.5) * 6); b = np.sin(2 * np.pi * 523 * T(.8)) * np.exp(-T(.8) * 5)
        return np.concatenate([a, b]) * .5
    if name == "knock":
        out = np.zeros(int(.9 * SR))
        for k in range(3):
            t0 = int(k * .22 * SR); t = T(.1); seg = (np.sin(2 * np.pi * 150 * t) + .5 * lp(_n(9000, .1), 700)) * np.exp(-t * 35)
            out[t0:t0 + len(seg)] += seg * 1.1
        return out
    if name == "horn":
        t = T(.5); x = (saw(2 * np.pi * 440 * t) + saw(2 * np.pi * 554 * t)) * .3; return lp(x, 2500) * adsr(len(t), .01, .02, 1, .08)
    if name == "microwave":
        out = np.zeros(int(1.2 * SR))
        for k in range(3):
            t0 = int(k * .38 * SR); seg = np.sin(2 * np.pi * 2000 * T(.2)) * .3 * adsr(int(.2 * SR), .004, .01, 1, .03); out[t0:t0 + len(seg)] += seg
        return out
    if name == "riser":
        t = T(1.3); x = bp(_n(1000, 1.3), 300, 6000) * (t / 1.3) ** 2.2 + sweep(120, 900, 1.3, "saw") * (t / 1.3) ** 3 * .35
        return lp(x, 5000) * 1.4
    if name == "sparkle":
        out = np.zeros(int(.9 * SR))
        for k, f in enumerate([1568, 2093, 2637, 3136, 3951]):
            t0 = int(k * .06 * SR); seg = np.sin(2 * np.pi * f * T(.4)) * np.exp(-T(.4) * 9) * .3; out[t0:t0 + len(seg)] += seg
        return out
    if name == "gasp":      # breathy intake
        d = .35; x = bp(_n(6000, d), 500, 3000) * np.sin(np.linspace(0, np.pi, int(d * SR))) ** 1.5; return x * 1.6
    if name == "wow":
        x = np.concatenate([sweep(400, 600, .15, "tri"), sweep(600, 950, .28, "tri")]); return x * adsr(len(x), .01, .02, 1, .15) * .5
    if name == "camera":
        a = bp(_n(8000, .03), 1000, 8000) * np.exp(-T(.03) * 120); b = bp(_n(8100, .05), 600, 6000) * np.exp(-T(.05) * 80)
        return np.concatenate([a, np.zeros(int(.05 * SR)), b]) * 2.0
    if name == "coin":
        t = T(.45); x = (np.sin(2 * np.pi * 1760 * t) * (t < .08) + np.sin(2 * np.pi * 2349 * t) * (t >= .08)) * np.exp(-t * 7); return x * .5
    if name == "womp": return make("fail")
    if name == "clang":
        t = T(.7); x = sum(np.sin(2 * np.pi * f * t) * a for f, a in [(523, 1), (1170, .7), (1790, .5), (2650, .3)])
        return x * np.exp(-t * 6) * .4
    if name == "crash":     # glass/ceramic breaking: noise burst plus falling shards
        out = np.zeros(int(.9 * SR)); out[:int(.25 * SR)] += bp(_n(20000, .25), 1500, 9000) * np.exp(-T(.25) * 14) * 2.4
        rr = np.random.RandomState(7)
        for k in range(14):
            t0 = int((.05 + rr.rand() * .7) * SR); seg = np.sin(2 * np.pi * (1800 + rr.rand() * 3200) * T(.12)) * np.exp(-T(.12) * 40) * .3; out[t0:t0 + len(seg)] += seg
        return out
    if name == "crunch":
        out = np.zeros(int(.5 * SR))
        for k in range(4):
            t0 = int(k * .11 * SR); seg = lp(_n(11000 + k * 300, .09), 1800) * np.exp(-T(.09) * 40) * 2.2; out[t0:t0 + len(seg)] += seg
        return out
    if name == "crinkle":
        out = np.zeros(int(1.4 * SR)); rr = np.random.RandomState(4)
        for k in range(60):
            t0 = int(rr.rand() * 1.25 * SR); d = .02 + rr.rand() * .03; seg = bp(_n(int(rr.rand() * 60000), d), 2500, 9000) * np.exp(-T(d) * 60) * (.6 + rr.rand())
            out[t0:t0 + len(seg)] += seg * 1.5
        return out * np.hanning(len(out)) ** .3
    raise KeyError(name)

_cache = {}
def get(name):
    if name not in _cache: _cache[name] = make(name)
    return _cache[name]
