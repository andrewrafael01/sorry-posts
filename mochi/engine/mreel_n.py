# v3 new formula reels. idx 200+i -> files 2NN_n_<name>.mp4
import sys
import mreel as M
from content_v3 import NEW_REELS
if __name__ == "__main__":
    sel = sys.argv[1:]
    for i, (name, cap, beats) in enumerate(NEW_REELS):
        if sel and str(i) not in sel: continue
        p, d = M.build(200+i, "n_"+name, beats, preview=("-p" in sel)); print("nreel", i, name, round(d, 1), flush=True)
