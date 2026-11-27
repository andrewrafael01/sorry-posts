"""Mochi & Toast sticker pack (Nov 26). Transparent looping GIFs (480x480) with a white die-cut outline, for GIPHY
and messaging sticker packs, plus a static PNG of each. Same art as the Reels (scenes.draw + static_fx).
usage: python3 stickers.py [slug ...]   -> /tmp/claude-0/cats/mochi/stickers/<slug>.gif and .png"""
import sys, os, math, subprocess, shutil
import numpy as np, cv2
from PIL import Image
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import soft
import scenes as S

OUT = "/tmp/claude-0/cats/mochi/stickers"
STICKERS = [  # (slug, scene spec, word or "")
 ("love_u", "mt:love,love|hearts", "love u"), ("hug", "hug:love,love|hearts", ""), ("its_ok", "hug:cry,love", "it's ok"),
 ("hi_mochi", "m:happy", "hi!"), ("hi_toast", "t:happy", "hiii"), ("miss_u", "m:cry", "miss u"), ("sorry", "t:cry", "sorry"),
 ("proud_of_u", "mt:sparkle,sparkle|sparkles", "proud of u"), ("ok", "mp:squint", "ok."), ("text_me", "tp:sparkle", "text me"),
 ("hungry", "tbowl:squint:empty", "hungry"), ("for_u", "give:t:cookie:happy:sparkle", "for u"), ("good_night", "ss", "good night"),
 ("nap_time", "t:dot:loaf", "nap time"), ("wait_what", "m:shock|bang", "wait what"), ("heh", "t:smug", "heh"),
 ("omg", "mt:shock,shock|bang", "omg"), ("hmph", "m:pout", "hmph"), ("pls", "t:pout", "pls"), ("thinking_of_u", "mthink:love:heart", "thinking of u"),
 ("a_flower", "th:flower:happy", "for you"), ("coffee", "th:mug:happy", "coffee?"), ("where_r_u", "mwin:pout:night", "where r u"),
 ("home", "tdoor:happy", "home!"), ("merry_xmas", "mt:happy,happy+santa", "merry xmas"), ("happy_holidays", "hug:love,love+santa|hearts", "happy holidays"),
 ("snow_day", "mwin:happy:snow|snow", "snow day"), ("new_year", "mt:sparkle,sparkle|sparkles", "happy new year"), ("yay", "m:sparkle:stand|sparkles", "yay"),
 ("lets_go", "t:sparkle:stand|sparkles", "let's go"), ("hmm", "mt:squint,squint", "hmm"), ("dots", "mt:dot,dot", "..."), ("ty", "m:love", "ty"),
 ("ily", "t:love", "ily"), ("mine", "tbox:happy", "mine"), ("busy", "mbox:squint", "busy"), ("toast_thinking", "tb:pout:...", ""),
 ("same", "mt:cry,cry", "same"), ("sweet_dreams", "ss|hearts", "sweet dreams"), ("my_heart", "th:heart:happy", "my heart"),
]
NF, FPS, SIZE = 12, 12, 480


def frame(spec, word, f):
    cv = Image.new("RGBA", (soft.W, soft.H), (0, 0, 0, 0))
    ph = f / NF
    hop = 34 * math.sin(math.pi * min(1, ph * 2)) if ph < 0.5 else 0  # hop, then rest
    Y = 820 - hop
    fx = S.draw(cv, spec, Y, u=165)
    if fx and fx != "bang":
        S.static_fx(cv, fx, Y, 165, seed=0)
    if word:
        soft.text(cv, word, 1085, size=92)
    return cv


def outline(frames, pad=16):
    a = np.maximum.reduce([np.array(im)[:, :, 3] for im in frames])
    ys, xs = np.where(a > 8)
    y0, y1, x0, x1 = ys.min(), ys.max(), xs.min(), xs.max()
    side = max(y1 - y0, x1 - x0) + 2 * (pad + 24)
    cx, cy = (x0 + x1) // 2, (y0 + y1) // 2
    box = (cx - side // 2, cy - side // 2, cx - side // 2 + side, cy - side // 2 + side)
    k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * pad + 1, 2 * pad + 1))
    out = []
    for im in frames:
        big = Image.new("RGBA", (soft.W + 2 * side, soft.H + 2 * side), (0, 0, 0, 0)); big.paste(im, (side, side))
        crop = big.crop((box[0] + side, box[1] + side, box[2] + side, box[3] + side))
        al = np.array(crop)[:, :, 3]
        m = cv2.dilate((al > 8).astype(np.uint8) * 255, k)
        m = cv2.GaussianBlur(m, (0, 0), 1.2)
        white = Image.new("RGBA", crop.size, (255, 255, 255, 0)); white.putalpha(Image.fromarray(m))
        white.alpha_composite(crop)
        out.append(white.resize((SIZE, SIZE), Image.LANCZOS))
    return out


def build(slug, spec, word):
    tmp = os.path.join(OUT, "_" + slug); os.makedirs(tmp, exist_ok=True)
    frames = outline([frame(spec, word, f) for f in range(NF)])
    for i, im in enumerate(frames): im.save(f"{tmp}/{i:02d}.png")
    frames[NF // 2 + 2].save(f"{OUT}/{slug}.png")
    pal = f"{tmp}/pal.png"
    subprocess.check_call(["ffmpeg", "-loglevel", "error", "-y", "-framerate", str(FPS), "-i", f"{tmp}/%02d.png",
                           "-vf", "palettegen=reserve_transparent=1:stats_mode=full", pal])
    subprocess.check_call(["ffmpeg", "-loglevel", "error", "-y", "-framerate", str(FPS), "-i", f"{tmp}/%02d.png", "-i", pal,
                           "-lavfi", "paletteuse=alpha_threshold=128:dither=none", "-loop", "0", "-gifflags", "-offsetting", f"{OUT}/{slug}.gif"])
    shutil.rmtree(tmp)


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    sel = sys.argv[1:]
    for slug, spec, word in STICKERS:
        if sel and slug not in sel: continue
        build(slug, spec, word); print("sticker", slug, flush=True)
