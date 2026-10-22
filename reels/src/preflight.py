"""Cheap gate to run BEFORE any render (seconds, not 10 minutes).
python3 preflight.py b61 domino_moon           -> predicted length, layout QA, sim validation, contact sheet, grade gate
Exit code 1 (and 'BLOCKED') if the reel would be outside 50-59 s, has layout problems, leaks physics, or its graded score is under 85."""
import sys, os, json
sys.path.insert(0, os.path.dirname(__file__))
import build
S = "/tmp/claude-0/-home-user-sorry-posts/aeda3cd8-6be4-5731-8b3d-d9639f60d4f0/scratchpad/"
GRADES = os.path.join(os.path.dirname(__file__), "grades.json")   # {"401_domino_moon": {"hook":9,"button":9,"send":9,"orig":8,"reach":9, "why": "..."}}
def score(g):
    base = 10 * (.20 * g["hook"] + .20 * g["button"] + .25 * g["send"] + .15 * g["orig"] + .20 * g["reach"]) - 4
    pen = (15 if g["hook"] < 8 else 0) + (10 if g["send"] < 8 else 0)   # a weak hook or no reason to share kills a reel regardless of the average
    return round(max(0.0, base - pen), 1)

def run(mod, name, sheet=True):
    r = build.load(mod).REELS[name](); problems = []; info = {}
    info["predicted_s"] = round(r.dur, 1); info["beats"] = [round(s.dur, 1) for s in r.shots]
    if not 50 <= r.dur <= 59: problems.append(f"length {r.dur:.1f}s is outside 50-59 s")
    import qa
    os.environ["VOICE"] = os.environ.get("VOICE", "on")
    res = qa.check(r, step=.5); info["layout_issues"] = len(res)
    for x in res[:8]: problems.append(f"layout beat {x[0]} t={x[1]} {x[2]} {x[3]}")
    for s in r.shots:
        if hasattr(s, "validate"):
            v = s.validate(); info["physics"] = v
            if v["wall_leaks"]: problems.append(f"{v['wall_leaks']} wall leaks")
            if v["max_overlap_px"] > 12: problems.append(f"balls overlap by {v['max_overlap_px']} px")
    g = json.load(open(GRADES)).get(r.name) if os.path.exists(GRADES) else None
    if not g: problems.append("no graded factors in grades.json (grade it harshly first)")
    else:
        info["score"] = score(g)
        if info["score"] < 85: problems.append(f"graded {info['score']} < 85")
    if sheet:
        from PIL import Image
        n = 12; sh = Image.new("RGB", (6 * 270, 2 * 480))
        for i in range(n):
            t = r.dur * (i + .5) / n; sh.paste(r.frame(t).resize((270, 480)), ((i % 6) * 270, (i // 6) * 480))
        p = S + f"pre_{r.name}.png"; sh.save(p); info["sheet"] = p
    return r.name, info, problems

if __name__ == "__main__":
    name, info, problems = run(sys.argv[1], sys.argv[2], sheet="--nosheet" not in sys.argv)
    print(name, json.dumps(info, indent=1))
    if problems: print("BLOCKED:"); [print("  -", p) for p in problems]; sys.exit(1)
    print("PASS: safe to render")
