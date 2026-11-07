"""Humor linter for what-if scripts. Usage: python3 humor.py <timeline.json> [...]  (scores 0-100 per script, flags weak lines)."""
import json, re, sys
BANNED = ["imagine", "in a world", "it's like", "ultimately", "journey", "game-changer", "buckle up", "get ready", "you won't believe", "let's dive", "fun fact", "spoiler", "plot twist", "literally", "basically", "delve", "tapestry", "not only", "crazy", "right?"]
VAGUE = ["a guy", "a man", "a woman", "someone", "something", "people", "everyone", "a lot", "so many", "very", "really"]
SLANG = ["no cap", "skibidi", "sigma", "rizz", "gyatt", "ohio", "six seven", "fanum", "mewing", "aura", "bro", "npc", "fr fr", "crashout"]
STOP = set("the a an and or to of in on is it that this you your he she they we i for with as at by from be are was were will can then now".split())
def words(s): return re.findall(r"[a-z0-9']+", s.lower())
def score_line(s, i, n, first_words):
    pts, flags = 100, []
    w = words(s); L = len(w)
    for b in BANNED:
        if b in s.lower(): pts -= 25; flags.append(f"banned '{b}'")
    if "!" in s: pts -= 10; flags.append("exclamation (not deadpan)")
    if L > 22: pts -= 15; flags.append(f"long ({L} words)")
    if L < 3 and i > 0: pts -= 5; flags.append("too short")
    sp = sum(1 for v in VAGUE if re.search(r"\b" + re.escape(v) + r"\b", s.lower()))
    nums = len(re.findall(r"\d", s)); names = len(re.findall(r"(?<![.!?] )(?<!^)\b[A-Z][a-z]+", s))
    if sp and not (nums or names): pts -= 15; flags.append("vague, no number or name")
    if i > 0 and not (nums or names or any(x in s.lower() for x in SLANG)): pts -= 10; flags.append("no specific (number/name/slang)")
    last = w[-1] if w else ""
    if last in STOP: pts -= 8; flags.append(f"ends on weak word '{last}' (punch word last)")
    return max(0, pts), flags
def score_script(tl):
    narr = [b["narr"] for b in tl["beats"]]; res = []; tot = 0
    first = set(words(narr[0])) - STOP
    for i, s in enumerate(narr):
        p, f = score_line(s, i, len(narr), first); res.append((p, f, s)); tot += p
    bonus = 0; notes = []
    if len(narr) > 2 and any(first & (set(words(s)) - STOP) for s in narr[-2:]): bonus += 5
    else: notes.append("no callback to the opening in the last beats")
    slang = sum(1 for s in narr for k in SLANG if k in s.lower())
    if slang == 0: notes.append("no brainrot texture at all")
    elif slang > 6: bonus -= 10; notes.append("slang overload (>6): narrator should not talk like the meme")
    nums = [int(x.replace(",", "")) for s in narr for x in re.findall(r"\d[\d,]*", s) if x.replace(",", "").isdigit()]
    if len(nums) >= 3 and sorted(nums) != nums and nums != sorted(nums, reverse=True): notes.append("numbers do not escalate monotonically")
    avg = tot / len(narr) + bonus
    return round(min(100, avg)), res, notes
if __name__ == "__main__":
    for p in sys.argv[1:]:
        tl = json.load(open(p)); sc, res, notes = score_script(tl); print(f"\n== {tl.get('key', p)}  score {sc}")
        for pts, f, s in res:
            if f: print(f"  {pts:3d}  {s}\n        -> " + "; ".join(f))
        for n in notes: print("  NOTE:", n)
