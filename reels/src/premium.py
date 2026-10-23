"""Premium visual toolkit for hand-built fact reels: shaded spheres (planets, suns, stars), bloom, warp star tunnels,
camera moves, particle streams, per-letter kinetic type. Everything is numpy/Pillow on 1080x1920 frames."""
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageChops
from facts import *

_sph = {}
def _grid(S):
    if S not in _sph:
        yy, xx = np.mgrid[0:S, 0:S].astype(np.float32); _sph[S] = ((xx - S / 2 + .5), (yy - S / 2 + .5))
    return _sph[S]

def sphere(img, cx, cy, r, col, light=(-.55, -.6), rot=0.0, bands=0, band_col=None, spots=0, seed=1, atmo=None, ambient=.18, tex="bands", rough=0.0, emissive=0.0, pole_tilt=0.0):
    """Lit sphere. tex: 'bands' (gas giant stripes), 'noise' (sun / rock), 'plain'. rot scrolls the texture in longitude."""
    r = max(3, r); S = int(2 * r + 6); xx, yy = _grid(S); u = xx / r; v = yy / r; d2 = u * u + v * v; inside = d2 <= 1.0
    z = np.sqrt(np.clip(1 - d2, 0, 1)); lx, ly = light; lz = math.sqrt(max(.05, 1 - lx * lx - ly * ly)); ln = math.sqrt(lx * lx + ly * ly + lz * lz)
    lam = np.clip((u * lx + v * ly + z * lz) / ln, 0, 1)
    lat = np.arcsin(np.clip(v, -1, 1)); lon = np.arcsin(np.clip(u / np.maximum(np.cos(lat), 1e-3), -1, 1)) + rot
    base = np.array(col, np.float32)[None, None, :] * np.ones((S, S, 1), np.float32)
    if tex == "bands":
        k = bands or 9; st = np.sin(lat * k * 2 + np.sin(lon * 3 + lat * 5) * .35); tone = .82 + .18 * st
        bc = np.array(band_col or col, np.float32); w = (st * .5 + .5)[..., None]; base = base * (1 - w * .55) + bc[None, None, :] * (w * .55); base = base * tone[..., None]
    elif tex == "noise":
        rs = np.random.RandomState(seed); ph = rs.rand(6) * 6.28
        n = (np.sin(lon * 5 + ph[0]) * np.sin(lat * 6 + ph[1]) + np.sin(lon * 9 + ph[2] + lat * 4) * .6 + np.sin(lat * 13 + ph[3] + lon * 3) * .4) / 2.0
        base = base * (1 + .28 * n[..., None]) if not emissive else base * (1 + .35 * n[..., None])
    shade = ambient + (1 - ambient) * lam
    out = base * (shade[..., None] if not emissive else (emissive + (1 - emissive) * shade[..., None]))
    rim = np.clip(1 - z, 0, 1) ** 3
    if atmo is not None: out = out + np.array(atmo, np.float32)[None, None, :] * (rim * (.35 + .65 * lam))[..., None]
    alpha = np.clip((1 - np.sqrt(d2)) * r, 0, 1) * 255
    rgba = np.dstack([np.clip(out, 0, 255), alpha]).astype(np.uint8); im = Image.fromarray(rgba, "RGBA")
    if pole_tilt: im = im.rotate(pole_tilt, resample=Image.BICUBIC)
    img.paste(im, (int(cx - S / 2), int(cy - S / 2)), im)

def planet_ring(img, cx, cy, rx, ry, w, col, tilt=-.3, a=.9, behind=None, inner=.74, bands=16):
    """Saturn-style ring band (many thin concentric ellipses, gaps included). behind True/False draws only the back/front half."""
    pad = 10; Wd = int(2 * rx + 2 * pad); Hd = int(2 * ry + 2 * pad); S = 3
    p = Image.new("RGBA", (Wd * S, Hd * S), (0, 0, 0, 0)); d = ImageDraw.Draw(p); c = (Wd * S / 2, Hd * S / 2)
    t0, t1 = (math.pi, 2 * math.pi) if behind else ((0, math.pi) if behind is False else (0, 2 * math.pi))
    rs = np.random.RandomState(5)
    for k in range(bands):
        f = inner + (1 - inner) * k / (bands - 1); gap = (k in (5, 6, 11)); al = (.25 if gap else .55 + .45 * rs.rand()) * a; shade = .75 + .25 * rs.rand()
        pts = [(c[0] + rx * S * f * math.cos(t), c[1] + ry * S * f * math.sin(t)) for t in np.linspace(t0, t1, 200)]
        d.line(pts, fill=tuple(int(x * shade) for x in col) + (int(255 * al),), width=max(2, int(w * S / bands * 1.6)), joint="curve")
    p = p.resize((Wd, Hd), Image.LANCZOS)
    if tilt: p = p.rotate(math.degrees(tilt), resample=Image.BICUBIC, expand=True)
    img.paste(p, (int(cx - p.width / 2), int(cy - p.height / 2)), p)

def bloom(img, thr=150, strength=.7, radius=7):
    """bright-pass glow, makes every light source look like it is emitting"""
    small = img.resize((img.width // 4, img.height // 4), Image.BILINEAR); m = small.point(lambda v: max(0, v - thr) * 3)
    m = m.filter(ImageFilter.GaussianBlur(radius)).resize(img.size, Image.BILINEAR); m = m.point(lambda v: int(v * strength))
    img.paste(ImageChops.add(img, m))

def vignette(img, k=.55):
    key = ("vig", img.size, k)
    if key not in _sph:
        w, h = img.size; yy, xx = np.mgrid[0:h:8, 0:w:8].astype(np.float32); d = np.sqrt(((xx - w / 2) / (w / 2)) ** 2 + ((yy - h / 2) / (h / 2)) ** 2); m = np.clip(1 - k * np.clip(d - .55, 0, 1) ** 1.4, 0, 1)
        _sph[key] = Image.fromarray((m * 255).astype(np.uint8)).resize((w, h), Image.BILINEAR)
    img.paste(ImageChops.multiply(img, Image.merge("RGB", [_sph[key]] * 3)))

_warp = {}
def warp(img, lt, speed=1.0, col=(200, 220, 255), n=190, cx=540, cy=900, streak=.5):
    """stars rushing past the camera"""
    if n not in _warp:
        r = np.random.RandomState(11); _warp[n] = (r.rand(n) * 6.283, r.rand(n), .4 + r.rand(n) * .6)
    ang, ph, br = _warp[n]; d = ImageDraw.Draw(img)
    for a, p0, b in zip(ang, ph, br):
        p = (p0 + lt * .35 * speed) % 1.0; r0 = p ** 2.2 * 1500; r1 = (p ** 2.2 + streak * .08 * speed * (.3 + p)) ** 1 * 1500
        x0, y0, x1, y1 = cx + r0 * math.cos(a), cy + r0 * math.sin(a), cx + r1 * math.cos(a), cy + r1 * math.sin(a); c = int(255 * min(1, p * 1.6) * b)
        d.line([(x0, y0), (x1, y1)], fill=(int(col[0] * c / 255), int(col[1] * c / 255), int(col[2] * c / 255)), width=1 + int(p * 3))

_depth = {}
def depth_stars(img, lt, vx=0.0, vy=-40.0, n=150, seed=3, col=(255, 255, 255)):
    """parallax star layers: three depths drifting at different speeds"""
    key = (n, seed)
    if key not in _depth:
        r = np.random.RandomState(seed); _depth[key] = [(r.rand() * 1080, r.rand() * 1920, .5 + r.rand() * 1.6, r.rand()) for _ in range(n)]
    d = ImageDraw.Draw(img)
    for x, y, s, z in _depth[key]:
        xx = (x + vx * lt * (.2 + z)) % 1080; yy = (y + vy * lt * (.2 + z)) % 1920; c = int(90 + 165 * z * (.6 + .4 * math.sin(lt * 2 + x)))
        d.ellipse([xx - s * z - .5, yy - s * z - .5, xx + s * z + .5, yy + s * z + .5], fill=(min(255, int(col[0] * c / 255)), min(255, int(col[1] * c / 255)), min(255, int(col[2] * c / 255))))

def camera(img, zoom=1.0, cx=540, cy=960, rot=0.0):
    """punch in / pan / roll the finished frame (in place)"""
    if abs(zoom - 1) < 1e-3 and abs(rot) < 1e-4 and cx == 540 and cy == 960: return
    w, h = img.size; bw, bh = w / zoom, h / zoom; x0 = min(max(cx - bw / 2, 0), w - bw); y0 = min(max(cy - bh / 2, 0), h - bh)
    out = img.crop((int(x0), int(y0), int(x0 + bw), int(y0 + bh))).resize((w, h), Image.BICUBIC)
    if rot: out = out.rotate(math.degrees(rot), resample=Image.BICUBIC)
    img.paste(out)

def kword(img, s, cx, cy, size, col, t, delay=0.0, per=.05, maxw=1000, shadow=True):
    """letters drop in one after another with an overshoot; each letter keeps its own advance so it reads as one word"""
    chars = list(s); widths = [max(10, text_layer(c if c != " " else "i", size, "black", col, maxw=2000).width - 4) if c != " " else size * .32 for c in chars]
    tot = sum(widths); sc = min(1.0, maxw / max(tot, 1)); x = cx - tot * sc / 2
    for ch, w in zip(chars, widths):
        u = pop(clamp((t - delay) / .32)); delay += per
        if ch != " " and u > 0.01: tx(img, ch, x + w * sc / 2, cy + (1 - clamp(u, 0, 1)) * -60, int(size * sc), "black", col, a=clamp(u * 3), scale=clamp(u, 0, 1.12), shadow=shadow)
        x += w * sc

def ease_out(t): return 1 - (1 - clamp(t)) ** 3
def count_text(n, digits=0): return f"{n:,.{digits}f}"

def odometer(img, value, cx, cy, size, col, digits=9):
    s = f"{int(value):,}"; tx(img, s, cx, cy, size, "black", col, maxw=980)

def water(img, y0, amp=10.0, lt=0.0, k=.012, speed=1.6, top=(70, 150, 255), bot=(8, 40, 120), alpha=.88, x0=0, x1=1080, y1=1920, sub=None):
    """animated water body with a lit surface line; drawn over whatever is already in the frame so objects look submerged"""
    W = x1 - x0; H = y1 - int(y0 - amp - 4); ys = np.arange(H, dtype=np.float32)[:, None] + (y0 - amp - 4); xs = np.arange(W, dtype=np.float32)[None, :] + x0
    surf = y0 + amp * np.sin(xs * k + lt * speed) + amp * .5 * np.sin(xs * k * 2.3 - lt * speed * 1.3) + (sub(xs, lt) if sub else 0)
    m = np.clip(ys - surf + .5, 0, 1); depth = np.clip((ys - surf) / max(1, (y1 - y0)), 0, 1)
    col = np.array(top, np.float32)[None, None, :] * (1 - depth[..., None]) + np.array(bot, np.float32)[None, None, :] * depth[..., None]
    edge = np.exp(-np.abs(ys - surf) / 3.0) * .9; col = col + 255 * edge[..., None] * np.array([.55, .6, .65], np.float32)[None, None, :]
    rgba = np.dstack([np.clip(col, 0, 255), m * 255 * alpha]).astype(np.uint8)
    im = Image.fromarray(rgba, "RGBA"); img.paste(im, (x0, int(y0 - amp - 4)), im)
