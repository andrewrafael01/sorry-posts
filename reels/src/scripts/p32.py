"""Premium 32: What if you jumped into a hole through the middle of the Earth. Uniform-density gravity train: r(t) = R cos(wt), exactly 42 min 12 s to the far side, 7.9 km/s at the centre. Live counters from the real formula, time-lapsed x66."""
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
import reel, whatif
from engine import W, H
from premium import bloom, vignette, sphere

R = 6371.0; G = 9.81e-3; OM = math.sqrt(G / R); TS = 66.6; PX = 440.0; CXE, CYE = W / 2, 930.0
LAYERS = [(1221, (255, 246, 205), (255, 226, 150)), (3480, (255, 176, 60), (255, 120, 30)), (6336, (190, 70, 40), (120, 38, 28)), (6371, (96, 120, 70), (80, 100, 60))]
TEMP = [(0, 15), (35, 500), (100, 1300), (410, 1500), (660, 1700), (2891, 3700), (5150, 5400), (6371, 5500)]
def temp(depth): return float(np.interp(depth, [a for a, b in TEMP], [b for a, b in TEMP]))
def layer_name(depth):
    r = R - depth
    return "INNER CORE" if r < 1221 else ("OUTER CORE" if r < 3480 else ("MANTLE" if r < 6336 else "CRUST"))
def state(lt):
    t = lt * TS; ph = OM * t; r = R * math.cos(ph); v = R * OM * abs(math.sin(ph)) * 3600; return t, r, v   # r signed: negative beyond the centre
def tv(depth_km): return math.acos(1 - depth_km / R) / OM / TS
T_END = math.pi / OM / TS            # reaches the far side (about 38 s of video)
CAPS = [(4.2, 8.2, "1,500°C. Technically you died about 100 km ago."), (8.8, 11.3, "Don't worry. It gets worse."), (11.6, 15.2, "Outer core. Liquid iron. You are soup."),
        (15.9, 18.9, "5,400°C. Hotter than the surface of the Sun. Holy shit."), (19.2, 22.8, "7.9 km/s. 28,400 km/h. Fastest you'll ever go."), (24.0, 27.6, "Now you're going up. Still falling, technically."),
        (37.2, 44.0, "You reach the top at exactly zero. Grab the edge, or you fall right back down. Forever.")]
_bg = {}
def earth_base():
    if "e" in _bg: return _bg["e"]
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32); rr = np.hypot(xx - CXE, yy - CYE) / PX * R; img = np.zeros((H, W, 3), np.float32)
    d = np.hypot((xx - W / 2) / W, (yy - H / 2) / H); img += (np.array([10, 12, 24], np.float32)[None, None] / 255.0 * (1.2 - d * 1.4)[..., None]).clip(0)
    inner = 0.0
    for i, (rad, c0, c1) in enumerate(LAYERS):
        lo = 0 if i == 0 else LAYERS[i - 1][0]; m = ((rr >= lo) & (rr < rad)).astype(np.float32); f = np.clip((rr - lo) / (rad - lo + 1e-6), 0, 1)[..., None]
        col = (np.array(c0, np.float32) * (1 - f) + np.array(c1, np.float32) * f) / 255.0
        img = img * (1 - m[..., None]) + col * m[..., None]
    shade = (1 - .25 * ((xx - CXE) / PX) ** 2 * .5)[..., None]; img = img * np.clip(shade, .6, 1.1)
    out = rr >= R; glow = np.exp(-np.clip(rr - R, 0, None) / 90.0) * out * .55
    img = img + glow[..., None] * np.array([.25, .5, 1.0], np.float32)[None, None]
    edge = np.exp(-np.abs(rr - R) / 18.0) * .3; img += edge[..., None] * np.array([.5, .7, 1.0], np.float32)
    for rad in (1221, 3480, 6336):    # thin layer boundaries
        img += (np.exp(-np.abs(rr - rad) / 14.0) * .10)[..., None]
    _bg["e"] = np.clip(img, 0, 1); return _bg["e"]
class Fall(reel.Shot):
    cut = "cut"
    def __init__(self, dur=44.5): self.dur = dur; self.cues = []
    def render(self, lt):
        base = earth_base(); t, r, v = state(min(lt, T_END)); depth = R - abs(r) if r >= 0 else R - r * -1 * 1
        # signed position along the vertical tunnel: +R at the top, -R at the bottom
        y = CYE - r / R * PX; depth_shown = R - r if r >= 0 else R + abs(r)    # depth below the START surface until the far side
        d_here = R - abs(r) if False else (R - r)                                  # distance fallen from the start
        d_surface = R - abs(r)                                                     # depth below the nearest surface (what the temperature follows)
        T = temp(d_surface)
        hot = min(1.0, T / 5400.0); img = base.copy(); img[..., 0] += hot * .10; img = np.clip(img, 0, 1)
        im = Image.fromarray((img * 255).astype(np.uint8), "RGB"); dr = ImageDraw.Draw(im)
        dr.line([(CXE, CYE - PX), (CXE, CYE + PX)], fill=(14, 10, 18), width=6)
        # faller: glow orb with a short trail
        lay = Image.new("RGBA", (W, H), (0, 0, 0, 0)); ld = ImageDraw.Draw(lay)
        for k in range(14, 0, -1):
            tt = max(0.0, min(lt, T_END) - k * .05); _, rk, _ = state(tt); yk = CYE - rk / R * PX; ld.ellipse([CXE - 9 + k * 0, yk - 9, CXE + 9, yk + 9], fill=(120, 220, 255, int(40 * (1 - k / 15))))
        ld.ellipse([CXE - 15, y - 15, CXE + 15, y + 15], fill=(170, 235, 255, 255)); lay = lay.filter(ImageFilter.GaussianBlur(1.2)); im.paste(lay, (0, 0), lay)
        bloom(im, 170, .9, 9); vignette(im, .5)
        shake = max(0.0, 1 - abs(lt - math.pi / 2 / OM / TS) / 3.0) * 4.0
        if shake > .2:
            ox, oy = int(math.sin(lt * 61) * shake), int(math.cos(lt * 53) * shake); im = im.transform(im.size, Image.AFFINE, (1, 0, ox, 0, 1, oy))
        # HUD
        elapsed = t; mm, ss = int(elapsed // 60), int(elapsed % 60)
        if lt < 4.0: whatif.title(im, "What if you jumped into a hole through the middle of the Earth?", whatif.cap_alpha(lt, .1, 3.9, .5, .6), y=330)
        fallen = d_here if lt <= T_END else 2 * R
        whatif.hud(im, "Distance fallen", f"{min(fallen, 2 * R):,.0f} km", f"{v:,.0f} km/h  ·  ≈{T:,.0f} °C  ·  {mm}:{ss:02d} elapsed" if lt > 4.0 else None, y=84)
        whatif.spaced(im, (56, 288), layer_name(d_surface), whatif.font(whatif.SANS_B, 30), (255, 214, 140), .95, 4.5) if lt > 4.0 else None
        for (a0, a1, text) in CAPS:
            al = whatif.cap_alpha(lt, a0, a1)
            if al > 0: whatif.caption(im, text, al, y=1500)
        fade = min(1.0, lt / .6, (self.dur - lt) / .6); return Image.eval(im, lambda p: int(p * fade))
def mk():
    return reel.Reel("584_whatif_hole_through_earth", [Fall()], style="cine", seed=584, gain_music=.85, loop=False, snap=False, grid=0, safe_zone=False, title="what if you jumped through the earth", caption="x",
                     story="Uniform-density gravity-train fall through the Earth: r(t)=R cos(wt); 42 min 12 s to the far side; 7.9 km/s at the centre; live distance, speed, temperature and elapsed time; deadpan captions timed to depth.")
REELS = dict(hole=mk)
