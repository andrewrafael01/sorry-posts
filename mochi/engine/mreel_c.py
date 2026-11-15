# Render carousel scripts as reels (second daily slot). idx 100+i, files 1NN_c_<name>.mp4
import sys
import mreel as M
from content import CAROUSELS, CAR_DATES
SKIP = set(CAR_DATES)
if __name__ == "__main__":
    sel = sys.argv[1:]
    for i, (name, cap, slides) in enumerate(CAROUSELS):
        if name in SKIP: continue
        if sel and str(i) not in sel: continue
        beats = list(slides)
        t, spec, sub = beats[-1]
        if not sub or ("send" not in sub and "tag" not in sub and "comment" not in sub): beats[-1] = (t, spec, "send this to your favorite person" if not sub else sub+"\nsend this to your favorite person")
        p, d = M.build(100+i, "c_"+name, beats, preview=False); print("creel", i, name, round(d, 1), flush=True)
