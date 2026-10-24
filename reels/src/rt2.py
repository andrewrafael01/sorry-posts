"""rt2: general lit-floor renderer. A textured plane (RGB albedo texture, any pattern) under a soft key light with baked falloff, optional matte
backdrop, per-frame albedo swap (rotating or tinted patterns). Reuses rt.Camera and rt.tonemap."""
import math
import numpy as np
from scipy.ndimage import map_coordinates, gaussian_filter
from rt import Camera, norm, tonemap

class Floor:
    def __init__(self, ext=6.5, res=2048, key=(-6.0, 7.0, -2.0), amb=.32, dif=1.0, spot=(0.0, 0.0, 7.0)):
        self.ext = ext; self.res = res; e = ext; lin = np.linspace(-e, e, res, dtype=np.float32); X, Z = np.meshgrid(lin, lin); self.X, self.Z = X, Z
        P = np.stack([X, np.zeros_like(X), Z], -1); L = np.array(key, np.float32); d = norm(L[None, None] - P); ndl = np.clip(d[..., 1], 0, 1)
        dist = np.linalg.norm(L[None, None] - P, axis=-1); fall = np.clip(1.15 - (np.hypot(X - spot[0], Z - spot[1])) / spot[2] * .55, .25, 1.0)
        self.light = ((amb + dif * ndl * (1.0 / (1 + .012 * dist ** 2)) * 1.6) * fall).astype(np.float32)
    def tex(self, T, X, Z):
        R = self.res; e = self.ext; c = [((Z + e) / (2 * e) * (R - 1)).ravel(), ((X + e) / (2 * e) * (R - 1)).ravel()]
        if T.ndim == 2: return map_coordinates(T, c, order=1, mode="nearest").reshape(X.shape)
        return np.stack([map_coordinates(T[..., k], c, order=1, mode="nearest").reshape(X.shape) for k in range(3)], -1)
    def render(self, cam, albedo, ss=1, bg=(.004, .005, .010), table=(.03, .03, .035), rim=None):
        """albedo: (res,res,3) float32 texture over [-ext,ext]^2; pixels outside it show the table; rim=(radius, width) adds a bright metal ring"""
        D = cam.rays(ss); H, W = D.shape[:2]; o = cam.pos; yy = np.linspace(0, 1, H, dtype=np.float32)[:, None]; g = (1 - yy) * np.ones((H, W), np.float32)
        img = np.dstack([bg[0] + .010 * g, bg[1] + .012 * g, bg[2] + .024 * g]).astype(np.float32)
        m = D[..., 1] < -1e-4; t = np.full((H, W), 1e9, np.float32); t[m] = -o[1] / D[..., 1][m]
        fx = o[0] + t * D[..., 0]; fz = o[2] + t * D[..., 2]; ok = m & (np.abs(fx) < self.ext - .05) & (np.abs(fz) < self.ext - .05)
        fxx, fzz = np.where(ok, fx, 0), np.where(ok, fz, 0); L = self.tex(self.light, fxx, fzz); A = self.tex(albedo, fxx, fzz)
        rgb = A * L[..., None]
        if rim is not None:
            rr = np.hypot(fxx, fzz); r0, w = rim; ring = np.exp(-((rr - r0) / w) ** 2) * 1.3; rgb = rgb + ring[..., None] * np.array([.70, .72, .78], np.float32) * (.5 + .5 * np.clip(-fxx / 6 + .5, 0, 1)[..., None])
            sh = np.exp(-np.clip(rr - r0 - w, 0, None) / .55) * (rr > r0) * .85; rgb = rgb * (1 - sh[..., None] * .8)
        fade = np.clip(1 - (np.hypot(fx, fz) - 7.6) / 2.0, 0, 1)[..., None]
        img = np.where(ok[..., None], rgb * fade + (1 - fade) * img, img)
        if ss > 1: img = img.reshape(H // ss, ss, W // ss, ss, 3).mean((1, 3))
        return img.astype(np.float32)
