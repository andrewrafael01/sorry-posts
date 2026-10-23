"""python3 ship.py <out_dir> key1 key2 ...  -> copy renders to reels/<key>_f1.mp4 and build 3 typographic covers each (reels/covers/<key>_{A,B,C}.jpg)."""
import sys, os, shutil, math
sys.path.insert(0, os.path.dirname(__file__))
from PIL import Image
import facts, factmeta
from facts import *

R = os.path.join(os.path.dirname(__file__), "..")
def cover(key, variant):
    col, A1, A2, B1, B2, BH, C, fr = factmeta.M[key]
    base = tuple(int(c * .22) for c in col); bg = (base[0] + 6, base[1] + 6, base[2] + 12, 0)
    img = Image.new("RGB", (1080, 1920)); bgfill(img, bg, 3.0 + {"A": 0, "B": 1.7, "C": 3.1}[variant])
    glow(img, 540, 900, 600, col, .22)
    if variant == "A":
        tx(img, "DID YOU KNOW?", 540, 560, 44, "black", (170, 178, 215), shadow=False)
        tx(img, A1, 540, 820, 150 if len(A1) < 9 else (118 if len(A1) < 13 else 92), "black", col, maxw=980)
        tx(img, A2, 540, 1090, 78 if len(A2) < 17 else 62, "black", WHITE, maxw=960)
    elif variant == "B":
        L = text_layer(B1 + "\n" + B2, 104, "black", WHITE, maxw=980, hl=[BH], hl_color=col); paste(img, L, 540, 900)
        tx(img, "?", 540, 1280, 160, "black", col, a=.9, shadow=False) if B1.lower().startswith(("how", "when", "what", "why")) else tx(img, "WAIT, WHAT?", 540, 1280, 54, "black", col, shadow=False)
    else:
        tx(img, C, 540, 900, 128 if len(C) < 14 else (100 if len(C) < 22 else 82), "black", col, maxw=980)
        ring(img, 540, 900, 470, 8, col, a=.35); ring(img, 540, 900, 540, 4, col, a=.2)
    img.save(os.path.join(R, "covers", f"{key}_{variant}.jpg"), quality=92)

if __name__ == "__main__":
    out = sys.argv[1]
    for key in sys.argv[2:]:
        shutil.copy(os.path.join(out, key + ".mp4"), os.path.join(R, key + "_f1.mp4"))
        for v in "ABC": cover(key, v)
        print("ok", key, flush=True)
