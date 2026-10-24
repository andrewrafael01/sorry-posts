"""Optical-illusion toolkit: board/pattern renderers (numpy), perspective warps, measurement overlays and reveal helpers."""
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageChops
from premium import *

def persp_coeffs(src, dst):
    """PIL PERSPECTIVE coefficients mapping dst quad -> src quad (inverse transform)."""
    A = []; B = []
    for (x, y), (u, v) in zip(dst, src):
        A += [[x, y, 1, 0, 0, 0, -u * x, -u * y], [0, 0, 0, x, y, 1, -v * x, -v * y]]; B += [u, v]
    return np.linalg.solve(np.array(A, float), np.array(B, float))

def homography(src, dst):
    c = persp_coeffs(dst, src)    # maps src point -> dst point (forward)
    def f(x, y):
        d = c[6] * x + c[7] * y + 1; return (c[0] * x + c[1] * y + c[2]) / d, (c[3] * x + c[4] * y + c[5]) / d
    return f

def warp_to(flat, quad_dst, size):
    """warp a flat RGB image so its corners land on quad_dst (list of 4 (x,y): TL,TR,BR,BL) inside a canvas of `size`; returns RGBA"""
    w, h = flat.size; src = [(0, 0), (w, 0), (w, h), (0, h)]
    rgba = flat.convert("RGBA"); a = Image.new("L", flat.size, 255); rgba.putalpha(a)
    return rgba.transform(size, Image.PERSPECTIVE, persp_coeffs(src, quad_dst), Image.BICUBIC), homography(src, quad_dst)

def soft_ellipse_mask(size, cx, cy, rx, ry, rot=0.0, blur=18):
    m = Image.new("L", size, 0); d = ImageDraw.Draw(m); pts = []
    for t in np.linspace(0, 2 * math.pi, 120):
        x, y = rx * math.cos(t), ry * math.sin(t); pts.append((cx + x * math.cos(rot) - y * math.sin(rot), cy + x * math.sin(rot) + y * math.cos(rot)))
    d.polygon(pts, fill=255); return m.filter(ImageFilter.GaussianBlur(blur))

def gray_img(size, v): return Image.new("RGB", size, (v, v, v))
