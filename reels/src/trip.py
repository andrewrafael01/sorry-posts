"""Trippy point-cloud engine. Orthographic projection, equal-size/equal-brightness dots, no occlusion: the rotation direction is genuinely ambiguous (kinetic depth effect),
so the viewer can flip it at will. Additive splatting + glow, sparkle, optional orbiting orb and rim rings."""
import math
import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter
from engine import W, H

def hsv(h, s=.8, v=1.0):
    h = np.asarray(h) % 1.0; i = np.floor(h * 6).astype(int); f = h * 6 - i; p = v * (1 - s); q = v * (1 - f * s); t = v * (1 - (1 - f) * s); i = i % 6
    r = np.choose(i, [v + 0 * h, q, p, p, t, v + 0 * h]); g = np.choose(i, [t, v + 0 * h, v + 0 * h, q, p, p]); b = np.choose(i, [p, p, t, v + 0 * h, v + 0 * h, q])
    return np.stack([r, g, b], -1).astype(np.float32)

def rot_y(P, a):
    c, s = math.cos(a), math.sin(a); x = P[:, 0] * c + P[:, 2] * s; z = -P[:, 0] * s + P[:, 2] * c; return np.stack([x, P[:, 1], z], -1)
def tilt_x(P, e):
    c, s = math.cos(e), math.sin(e); y = P[:, 1] * c - P[:, 2] * s; z = P[:, 1] * s + P[:, 2] * c; return np.stack([P[:, 0], y, z], -1)
def project(P, elev, scale, cx=W / 2, cy=H / 2):
    Q = tilt_x(P, elev); return Q[:, 0] * scale + cx, -Q[:, 1] * scale + cy

def splat(buf, x, y, col, amp=1.0):
    """bilinear additive splat of N points into buf (H,W,3)"""
    ok = (x >= 0) & (x < W - 1) & (y >= 0) & (y < H - 1); x, y, col = x[ok], y[ok], col[ok]; ix = x.astype(np.int32); iy = y.astype(np.int32); fx = (x - ix).astype(np.float32); fy = (y - iy).astype(np.float32)
    for dx, dy, w in ((0, 0, (1 - fx) * (1 - fy)), (1, 0, fx * (1 - fy)), (0, 1, (1 - fx) * fy), (1, 1, fx * fy)):
        idx = (iy + dy) * W + (ix + dx)
        for k in range(3): buf[..., k] += np.bincount(idx, weights=col[:, k] * w * amp, minlength=H * W).reshape(H, W).astype(np.float32)

def finish(buf, glow1=2.2, glow2=10.0, g1=.9, g2=.55, exposure=1.0, size=.9):
    base = gaussian_filter(buf, (size, size, 0)); a = gaussian_filter(buf, (glow1, glow1, 0)); b = gaussian_filter(buf, (glow2, glow2, 0))
    out = base * 1.6 + a * g1 * 3.0 + b * g2 * 4.0; out = out * exposure; out = 1 - np.exp(-out * 1.3)       # soft filmic roll-off
    return (np.clip(out, 0, 1) ** (1 / 1.05) * 255).astype(np.uint8)

def ring(n, R, y=0.0):
    a = np.linspace(0, 2 * math.pi, n, endpoint=False); return np.stack([R * np.cos(a), np.full(n, y), R * np.sin(a)], -1).astype(np.float32)

def cylinder_pts(n, R=1.0, h=1.0, rs=None):
    rs = rs or np.random.RandomState(1); a = rs.rand(n) * 2 * math.pi; y = (rs.rand(n) - .5) * h; return np.stack([R * np.cos(a), y, R * np.sin(a)], -1).astype(np.float32), a, y
def hemisphere_pts(n, R=1.0, rs=None):
    rs = rs or np.random.RandomState(2); v = rs.rand(n); u = rs.rand(n) * 2 * math.pi; z = -v; r = np.sqrt(1 - z * z)    # lower hemisphere, uniform in area
    return np.stack([R * r * np.cos(u), R * z, R * r * np.sin(u)], -1).astype(np.float32), u, z
def sphere_pts(n, R=1.0, rs=None):
    rs = rs or np.random.RandomState(3); z = rs.rand(n) * 2 - 1; u = rs.rand(n) * 2 * math.pi; r = np.sqrt(1 - z * z); return np.stack([R * r * np.cos(u), R * z, R * r * np.sin(u)], -1).astype(np.float32), u, z
def torus_pts(n, R=1.0, r=.42, rs=None):
    rs = rs or np.random.RandomState(4); u = rs.rand(n) * 2 * math.pi; v = rs.rand(n) * 2 * math.pi; return np.stack([(R + r * np.cos(v)) * np.cos(u), r * np.sin(v), (R + r * np.cos(v)) * np.sin(u)], -1).astype(np.float32), u, v
