# v4 duo reels. idx 300+i -> files 3NN_d_<name>.mp4
import sys
import mreel as M
from content_v4 import DUO_REELS
if __name__ == "__main__":
    sel = sys.argv[1:]
    for i, (name, cap, beats) in enumerate(DUO_REELS):
        if sel and str(i) not in sel: continue
        p, d = M.build(300+i, "d_"+name, beats, preview=False); print("dreel", i, name, round(d, 1), flush=True)
