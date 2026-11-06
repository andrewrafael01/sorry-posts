"""What-if format: a live simulated counter HUD (label, big number, sub line), a serif title, and deadpan italic captions timed to real events in the simulation.
Layout follows the owner's reference reel: small-caps label top-left with a large live number, serif question near the top for the first seconds, italic captions low."""
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from engine import W, H

_F = {}
def font(path, size):
    k = (path, size)
    if k not in _F: _F[k] = ImageFont.truetype(path, size)
    return _F[k]
SERIF_I = "/usr/share/fonts/truetype/liberation/LiberationSerif-Italic.ttf"
SERIF = "/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf"
SANS_B = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"
SANS = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"

def wrap(d, text, f, maxw):
    words, lines, cur = text.split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if d.textlength(t, font=f) <= maxw: cur = t
        else: lines.append(cur); cur = w
    lines.append(cur); return lines
def shadowed(img, xy, text, f, fill, a=1.0, shadow=3, anchor="la", spacing=0):
    lay = Image.new("RGBA", img.size, (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
    d.text((xy[0] + shadow, xy[1] + shadow), text, font=f, fill=(0, 0, 0, int(190 * a)), anchor=anchor)
    d.text(xy, text, font=f, fill=tuple(fill) + (int(255 * a),), anchor=anchor)
    img.paste(lay, (0, 0), lay)
def spaced(img, xy, text, f, fill, a=1.0, track=3):
    x, y = xy; lay = Image.new("RGBA", img.size, (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
    for ch in text: d.text((x + 2, y + 2), ch, font=f, fill=(0, 0, 0, int(160 * a))); d.text((x, y), ch, font=f, fill=tuple(fill) + (int(255 * a),)); x += d.textlength(ch, font=f) + track
    img.paste(lay, (0, 0), lay)
def hud(img, label, value, sub=None, y=84, x=56, big=92):
    spaced(img, (x, y), label.upper(), font(SANS_B, 28), (225, 228, 235), .9, 3.6)
    shadowed(img, (x, y + 34), value, font(SANS_B, big), (255, 255, 255), 1.0, 3)
    if sub: spaced(img, (x, y + 34 + big + 14), sub.upper(), font(SANS_B, 27), (230, 233, 240), .9, 2.4)
def title(img, text, a=1.0, y=380, size=60, maxw=920):
    d = ImageDraw.Draw(img); f = font(SERIF, size); lines = wrap(d, text, f, maxw)
    for i, ln in enumerate(lines): shadowed(img, (W / 2, y + i * int(size * 1.18)), ln, f, (255, 255, 255), a, 3, anchor="ma")
def caption(img, text, a=1.0, y=1500, size=50, maxw=900):
    d = ImageDraw.Draw(img); f = font(SERIF_I, size); lines = wrap(d, text, f, maxw)
    for i, ln in enumerate(lines): shadowed(img, (W / 2, y + i * int(size * 1.2)), ln, f, (255, 255, 255), a, 3, anchor="ma")
def cap_alpha(lt, t0, t1, fin=.35, fout=.35): return max(0.0, min(1.0, (lt - t0) / fin, (t1 - lt) / fout))
