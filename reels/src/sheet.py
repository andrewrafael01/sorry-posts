"""Contact sheet of a narrated reel: three frames per beat.  python3 sheet.py b27 ronaldo_vs_elon out.png"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
import build
from PIL import Image
mod, name, out = sys.argv[1:4]; r = build.load(mod).REELS[name]()
n = len(r.shots); cols = 6; fr = []
for i, s in enumerate(r.shots):
    for k in (.25, .6, .92): fr.append(r.frame(r.starts[i] + s.dur * k).resize((216, 384)))
rows = (len(fr) + cols - 1) // cols; sh = Image.new("RGB", (cols * 216, rows * 384))
for j, f in enumerate(fr): sh.paste(f, ((j % cols) * 216, (j // cols) * 384))
sh.save(out); print(name, round(r.dur, 1), "s", n, "beats")
