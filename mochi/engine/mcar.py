import sys, os, re
from soft import *
import scenes as S
from content import CAROUSELS, TAGS
ROOT = "/tmp/claude-0/cats/mochi/carousels"
GREY = (150, 140, 170)
def hl(t): return re.sub(r"\*([^*]+)\*", lambda m: " ".join("*"+w+"*" for w in m.group(1).split(" ")), t)
def render(name, slides):
    d = f"{ROOT}/{name}"; os.makedirs(d, exist_ok=True)
    for i, (title, spec, sub) in enumerate(slides):
        cv = canvas()
        n = title.count("\n")+1
        text(cv, hl(title), 260 if n < 3 else 220, 92 if n < 3 else 80)
        fx = S.draw(cv, spec, 1000, 165)
        S.static_fx(cv, fx, 1000, 165, seed=i)
        if sub: text(cv, sub, 1280, 48, fname="patrick", col=GREY)
        save(cv, f"{d}/{i+1:02d}.jpg")
if __name__ == "__main__":
    only = sys.argv[1:]
    for idx, (name, cap, slides) in enumerate(CAROUSELS):
        if only and name not in only and str(idx) not in only: continue
        render(name, slides); print("car", name, flush=True)
