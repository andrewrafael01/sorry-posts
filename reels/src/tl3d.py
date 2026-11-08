"""Timeline exporter for the three.js what-if renderer: builds the voiced Reel with empty visuals only to get the audio mix, beat start times and word timings, and writes
<out>/<key>.json (beats with narration, start, dur, word times) and <out>/<key>.wav. Usage: python3 tl3d.py <key> <number> <style> <gain> <out_dir> <narration> [<narration> ...]"""
import sys, os, json, wave
import numpy as np
sys.path.insert(0, os.path.dirname(__file__))
os.environ.setdefault("VOICE", "kokoro")
import reel
from motion import Clean
SR = reel.SR
def export(key, num, narrs, out, style="cine", gain=.35):
    shots = [Clean(n, lambda *a: None, 3.0, cut="cut", push=0, cap=False) for n in narrs]
    mins = json.loads(os.environ.get('MIN_DURS', '[]'))
    for i, m in enumerate(mins[:len(shots)]):
        shots[i].min_dur = float(m); shots[i].fit_speech = True; shots[i].pad = .35
    r = reel.Reel(key, shots, style=style, seed=num, gain_music=gain, snap=False, grid=0, safe_zone=False, vo=[(i, n) for i, n in enumerate(narrs)], title=key, caption="x", story="3d")
    beats = []
    for s, t0 in zip(r.shots, r.starts):
        rt = s.real_times(); words = s.narr.split()
        if not rt or len(rt) != len(words): L = s.speech_len(); rt = [(i * L / len(words), (i + 1) * L / len(words)) for i in range(len(words))]
        beats.append({"narr": s.narr, "start": t0 + 0.0, "dur": s.dur, "words": [[w, float(a), float(b)] for w, (a, b) in zip(words, rt)]})
    a = (r.audio() * 32767).astype(np.int16)
    os.makedirs(out, exist_ok=True)
    with wave.open(os.path.join(out, key + ".wav"), "wb") as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(a.tobytes())
    json.dump({"key": key, "dur": r.dur, "beats": beats}, open(os.path.join(out, key + ".json"), "w"), indent=1)
    return r.dur
if __name__ == "__main__":
    key, num, style, gain, out = sys.argv[1], int(sys.argv[2]), sys.argv[3], float(sys.argv[4]), sys.argv[5]
    print(round(export(key, num, sys.argv[6:], out, style, gain), 2))
