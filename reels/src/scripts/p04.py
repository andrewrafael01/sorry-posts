"""Premium 04: the checker-shadow illusion. Squares A and B are the identical gray; proof by connecting bar, then masking everything else."""
import math
import numpy as np
from ill import *

GA = 94                      # the shared gray of A and B
LIGHT = 170; SHADOW_K = GA / LIGHT
BX, BY, CELL = 0, 0, 100
A_SQ = (6, 3); B_SQ = (4, 4)  # (col,row) in the 8x8 board: A dark and lit, B light and in shadow
QUAD = [(190, 720), (890, 720), (1010, 1340), (70, 1340)]      # board corners on screen: TL, TR, BR, BL

def flat_board(shadow=True, mark=False):
    img = Image.new("RGB", (800, 800)); d = ImageDraw.Draw(img)
    for r in range(8):
        for c in range(8):
            d.rectangle([c * CELL, r * CELL, c * CELL + CELL, r * CELL + CELL], fill=((GA,) * 3 if (c + r) % 2 else (LIGHT,) * 3))
    if shadow:
        m = soft_ellipse_mask((800, 800), 440, 460, 190, 120, rot=.55, blur=20)
        sh = ImageChops.multiply(img, Image.merge("RGB", [Image.eval(m, lambda v: int(255 - (255 - 255 * SHADOW_K) * v / 255))] * 3))
        img = sh
    return img

BOARD = None
def board(): 
    global BOARD
    if BOARD is None:
        flat = flat_board(); BOARD = warp_to(flat, QUAD, (1080, 1920))
    return BOARD

def sq_center(c, r):
    f = board()[1]; return f(c * CELL + CELL / 2, r * CELL + CELL / 2)

def sq_poly(c, r):
    f = board()[1]; return [f(c * CELL, r * CELL), f((c + 1) * CELL, r * CELL), f((c + 1) * CELL, (r + 1) * CELL), f(c * CELL, (r + 1) * CELL)]

def poly(img, pts, col, a=1.0):
    xs = [p[0] for p in pts]; ys = [p[1] for p in pts]; x0, y0 = int(min(xs)) - 2, int(min(ys)) - 2
    m = Image.new("L", (int(max(xs)) - x0 + 4, int(max(ys)) - y0 + 4), 0); ImageDraw.Draw(m).polygon([(px - x0, py - y0) for px, py in pts], fill=int(255 * a))
    img.paste(Image.new("RGB", m.size, col), (x0, y0), m)

def cylinder(img, a=1.0):
    f = board()[1]; bx, by = f(300, 330)                      # base centre, up-left of the shadow
    h = 300; rw = 82; rh = 28
    ov = Image.new("RGBA", (400, 560), (0, 0, 0, 0)); d = ImageDraw.Draw(ov); cx = 200; base = 470
    for i in range(-rw, rw):
        t = (i + rw) / (2 * rw); sh = .55 + .45 * math.sin(t * math.pi) ** .8; col = (int(214 * sh), int(214 * sh), int(222 * sh), int(255 * a))
        d.line([(cx + i, base - h), (cx + i, base)], fill=col)
    d.ellipse([cx - rw, base - rh, cx + rw, base + rh], fill=(int(214 * .55), int(214 * .55), int(222 * .55), int(255 * a)))
    d.rectangle([cx - rw, base - h, cx + rw, base], fill=None)
    for i in range(-rw, rw + 1):
        t = (i + rw) / (2 * rw); sh = .55 + .45 * math.sin(t * math.pi) ** .8; d.line([(cx + i, base - h), (cx + i, base)], fill=(int(214 * sh), int(214 * sh), int(222 * sh), int(255 * a)))
    d.ellipse([cx - rw, base - h - rh, cx + rw, base - h + rh], fill=(int(236), int(236), int(244), int(255 * a)))
    d.arc([cx - rw, base - rh, cx + rw, base + rh], 0, 180, fill=(int(214 * .55), int(214 * .55), int(222 * .55), int(255 * a)), width=2)
    img.paste(ov, (int(bx - 200), int(by - 470)), ov)

def stage(img, lt, labels=1.0, cyl=1.0, rest=1.0, bar=0.0, swatch=0.0, hl_shadow=0.0):
    """draw the scene. rest<1 fades everything except squares A and B to black; bar draws the connecting gray strip."""
    img.paste(vgrad((14, 14, 22), (4, 4, 10), key="ill1"))
    b, f = board(); canvas = Image.new("RGBA", (1080, 1920), (0, 0, 0, 0)); canvas.alpha_composite(b); base = canvas.convert("RGB")
    if rest < 1.0:
        keep = Image.new("L", (1080, 1920), 0); kd = ImageDraw.Draw(keep)
        for sq in (A_SQ, B_SQ): kd.polygon(sq_poly(*sq), fill=255)
        dark = Image.new("RGB", (1080, 1920), (0, 0, 0)); fade = Image.blend(base, dark, 1 - rest); base = Image.composite(base, fade, keep)
    img.paste(base, (0, 0))
    if cyl > 0 and rest >= 1.0: cylinder(img, cyl)
    if hl_shadow > 0:   # outline the shadow edge softly
        m = soft_ellipse_mask((800, 800), 440, 460, 190, 120, rot=.55, blur=1).point(lambda v: 255 if 10 < v < 240 else 0)
        wm, _ = warp_to(m.convert("RGB"), QUAD, (1080, 1920)); edge = wm.convert("L").point(lambda v: int(v * hl_shadow))
        glow_img = Image.new("RGB", (1080, 1920), (255, 214, 0)); img.paste(glow_img, (0, 0), edge)
    ca, cb = sq_center(*A_SQ), sq_center(*B_SQ)
    if bar > 0:
        # gray strip from A to B, the same value as both squares, drawn on top
        u = ease_out(bar); x1 = ca[0] + (cb[0] - ca[0]) * u; y1 = ca[1] + (cb[1] - ca[1]) * u
        line(img, [ca, (x1, y1)], 40, (GA, GA, GA)); disc(img, ca[0], ca[1], 24, (GA, GA, GA))
        if u > .95: disc(img, cb[0], cb[1], 24, (GA, GA, GA))
    if labels > 0:
        for (name, c) in (("A", ca), ("B", cb)):
            tx(img, name, c[0], c[1] - 2, 64, "black", (255, 255, 255), a=labels, stroke=4, shadow=False)
    if swatch > 0:
        for i, (name, x) in enumerate((("A", 300), ("B", 780))):
            box(img, x - 130, 1450, x + 130, 1570, 24, (GA, GA, GA), a=swatch); tx(img, f"{name} = #{GA:02X}{GA:02X}{GA:02X}", x, 1510, 38, "black", (255, 255, 255), a=swatch, shadow=False)

def hook(img, lt, p, b):
    stage(img, lt, labels=1.0); tx(img, "WHICH IS DARKER?", 540, 280, 78, "black", WHITE, shadow=True, maxw=1000); tx(img, "A OR B", 540, 450, 130, "black", GOLD, a=eio(seg(lt, .5, 1.0)), scale=1 + .04 * math.sin(lt * 5))
    bloom(img, 200, .35); vignette(img, .4)
def same(img, lt, p, b):
    stage(img, lt, labels=1.0, swatch=eio(seg(lt, T(b, "same", 2.5), T(b, "same", 2.5) + .5))); tx(img, "A LOOKS DARK. B LOOKS LIGHT.", 540, 340, 56, "black", WHITE, shadow=True)
    tx(img, "THEY'RE THE SAME GRAY", 540, 450, 70, "black", GOLD, a=eio(seg(lt, T(b, "same", 2.5), T(b, "same", 2.5) + .5)), shadow=True); bloom(img, 200, .3); vignette(img, .4)
def bar(img, lt, p, b):
    stage(img, lt, labels=.9, bar=seg(lt, .6, b.dur - .8)); tx(img, "A BAR OF THE SAME GRAY", 540, 340, 62, "black", WHITE, shadow=True); tx(img, "JOINS THEM", 540, 440, 84, "black", GOLD, shadow=True); bloom(img, 200, .3); vignette(img, .4)
def mask(img, lt, p, b):
    k = 1 - eio(seg(lt, .4, 1.6)); stage(img, lt, labels=.9, rest=k, swatch=eio(seg(lt, 1.8, 2.4)), cyl=k); tx(img, "REMOVE EVERYTHING ELSE", 540, 300, 58, "black", WHITE, shadow=True, maxw=1000)
    tx(img, "NOTHING TO ARGUE ABOUT", 540, 440, 62, "black", GOLD, a=eio(seg(lt, 1.8, 2.4)), shadow=True); bloom(img, 200, .3); vignette(img, .4)
def why(img, lt, p, b):
    stage(img, lt, labels=.0, hl_shadow=.9 * (.5 + .5 * math.sin(lt * 4))); tx(img, "THE SHADOW", 540, 340, 84, "black", GOLD, shadow=True); tx(img, "YOUR BRAIN SUBTRACTS IT", 540, 450, 58, "black", WHITE, shadow=True); bloom(img, 200, .3); vignette(img, .4)
def end(img, lt, p, b):
    stage(img, lt, labels=1.0); tx(img, "YOU STILL SEE", 540, 330, 70, "black", WHITE, shadow=True); tx(img, "B AS LIGHTER", 540, 450, 110, "black", GOLD, shadow=True); bloom(img, 200, .3); vignette(img, .4)

N = [
 ("Which one is darker? Square A, or square B?", hook),
 ("A looks dark. B looks light. But they are the exact same shade of gray.", same),
 ("Watch. A bar of that gray joins them, and it never changes color.", bar),
 ("Remove everything else, and there is nothing left to argue about.", mask),
 ("The shadow fools you. Your brain subtracts it, so it lies about the color.", why),
 ("And even now that you know, you still see B as lighter.", end),
]
def checker():
    return make_reel(494, "checker_shadow", "which square is darker", N, style="cine", story="Adelson checker-shadow illusion: A (dark, lit) and B (light, in cylinder shadow) are both RGB(94,94,94).")
REELS = dict(checker=checker)
