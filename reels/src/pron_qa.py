"""Pronunciation QA: speak every narration line with the in-house voice, transcribe it back, and list words that do not come back (numbers are normalised).  python3 pron_qa.py"""
import os, re, sys, json
sys.path.insert(0, os.path.dirname(__file__))
import numpy as np
from num2words import num2words
from scipy.signal import resample_poly
os.environ["VOICE"] = "off"
import build
lines = set()
for mod in ("b22", "b23", "b24", "b25", "b26", "b27", "b28"):
    try: m = build.load(mod)
    except Exception as e: continue
    for n, f in m.REELS.items():
        try: r = f()
        except Exception as e: continue
        for s in r.shots:
            if getattr(s, "narr", None): lines.add(s.narr)
        for _, t in getattr(r, "vo", []): lines.add(t)
import scripts.vo_scripts as vs
for k, v in vs.SCRIPTS.items():
    for _, t in v: lines.add(t)
del os.environ["VOICE"]
import voice
from faster_whisper import WhisperModel
wm = WhisperModel("base.en", device="cpu", compute_type="int8")
def words(s):
    s = re.sub(r"\$(\d[\d,\.]*)", lambda m: m.group(1) + " dollars", s)
    s = re.sub(r"(\d[\d,]*)", lambda m: num2words(int(m.group(1).replace(",", "")), to="year" if 1100 < int(m.group(1).replace(",", "")) < 2100 and "," not in m.group(1) else "cardinal") if m.group(1).replace(",", "").isdigit() else m.group(1), s)
    return re.sub(r"[^a-z ]", " ", s.lower().replace("-", " ")).split()
bad = {}
for t in sorted(lines):
    x = voice.speak(t, voice.NARRATOR)
    if x is None: continue
    y = resample_poly(x, 160, 441).astype(np.float32); segs, _ = wm.transcribe(y, language="en", beam_size=1); out = " ".join(s.text for s in segs)
    A, B = words(t), words(out)
    import difflib
    sm = difflib.SequenceMatcher(None, A, B, autojunk=False)
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag != "equal": bad.setdefault(" ".join(A[i1:i2]), set()).add(" ".join(B[j1:j2]))
print(len(lines), "lines checked")
for k in sorted(bad): print(f"{k!r:34} heard as {sorted(bad[k])}")
