import sys
import mreel as M
from content_v6 import MSG_REELS
if __name__ == "__main__":
    sel = sys.argv[1:]
    for i, (name, cap, beats) in enumerate(MSG_REELS):
        if sel and str(i) not in sel and name not in sel: continue
        p, d = M.build(400+i, "m_"+name, beats, preview=False); print("mreel", i, name, round(d, 1), flush=True)
