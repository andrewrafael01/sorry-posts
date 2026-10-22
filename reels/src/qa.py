"""Layout QA for the narrated reels: samples frames across every beat and reports text that overlaps other text, the caption strip, or runs off the safe area.  python3 qa.py b24 everyone_jumps"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
os.environ.setdefault("VOICE", "off")
import build, motion
def check(r, step=.35, verbose=True):
    bad = []
    for i, s in enumerate(r.shots):
        if not hasattr(s, "narr"): continue
        t = .2
        while t < s.dur - .1:
            s.render(t); B = [b for b in s.boxes if b[4] != "<caption>" or True]
            for a in range(len(B)):
                x0, y0, x1, y1, tx_, al = B[a]
                if x0 < 40 or x1 > 1040 or y0 < 110: bad.append((i, round(t, 1), "outside safe area", tx_[:30]))
                for c in range(a + 1, len(B)):
                    X0, Y0, X1, Y1, t2, a2 = B[c]
                    if t2 == tx_: continue
                    ox = min(x1, X1) - max(x0, X0); oy = min(y1, Y1) - max(y0, Y0)
                    if ox > 6 and oy > 6: bad.append((i, round(t, 1), "overlap", tx_[:24] + " | " + t2[:24]))
            t += step
    seen = set(); out = []
    for b in bad:
        k = (b[0], b[2], b[3])
        if k not in seen: seen.add(k); out.append(b)
    return out
if __name__ == "__main__":
    mod, name = sys.argv[1], sys.argv[2]; r = build.load(mod).REELS[name]()
    res = check(r); print(name, round(r.dur, 1), "s;", len(res), "issues")
    for x in res: print("  beat", x[0], "t=", x[1], x[2], "|", x[3])
