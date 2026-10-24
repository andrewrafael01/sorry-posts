"""Mini ray tracer for the illusion reels. Static lighting is baked once into a floor texture (soft area-light shadows + contact AO);
every frame casts primary rays, intersects the floor plane and an analytic cylinder, shades with Blinn-Phong + rim, then tone-maps."""
import math
import numpy as np
from scipy.ndimage import map_coordinates, gaussian_filter
from PIL import Image

def norm(v): return v / np.maximum(np.linalg.norm(v, axis=-1, keepdims=True), 1e-9)

class Camera:
    def __init__(self, pos, target, fov, W, H, up=(0, 1, 0), shift=(0.0, 0.0)):
        self.pos = np.array(pos, np.float32); f = norm(np.array(target, np.float32) - self.pos); r = norm(np.cross(np.array(up, np.float32), f)); u = np.cross(f, r)
        self.f, self.r, self.u, self.W, self.H, self.t = f, r, u, W, H, math.tan(math.radians(fov) / 2); self.shift = shift
    def rays(self, ss=1):
        W, H = self.W * ss, self.H * ss; xs = (np.arange(W, dtype=np.float32) + .5) / W * 2 - 1; ys = 1 - (np.arange(H, dtype=np.float32) + .5) / H * 2
        X, Y = np.meshgrid(xs * self.t * (self.W / self.H) + self.shift[0], ys * self.t + self.shift[1])
        return norm(self.f[None, None] + X[..., None] * self.r[None, None] + Y[..., None] * self.u[None, None])
    def project(self, p):
        d = np.array(p, np.float32) - self.pos; z = d @ self.f; x = (d @ self.r) / z; y = (d @ self.u) / z
        return ((x - self.shift[0]) / (self.t * self.W / self.H) + 1) / 2 * self.W, (1 - (y - self.shift[1]) / self.t) / 2 * self.H

class Scene:
    def __init__(self, cyl=(-0.9, 1.3, 0.85, 2.3), light=(-9.0, 6.2, 6.5), lrad=1.0, ext=6.5, res=2048, A=(6, 5), Bsq=(5, 3), albedo_light=.74, nsamp=96, seed=3):
        self.cx, self.cz, self.rc, self.hc = cyl; self.L = np.array(light, np.float32); self.lrad = lrad; self.ext = ext; self.res = res; self.A = A; self.B = Bsq; self.al = albedo_light
        self.rng = np.random.RandomState(seed); self.nsamp = nsamp; self.cyl_color = (.40, .56, .50); self._bake()
    def sq_center(self, c, r): return (-4 + c + .5, -4 + r + .5)
    def _shadow(self, X, Z, n):
        """fraction of the area light visible from floor points (soft shadow) via n jittered samples on a disc facing the points"""
        vis = np.zeros(X.shape, np.float32); P = np.stack([X, np.zeros_like(X), Z], -1)
        for i in range(n):
            a = self.rng.rand() * 2 * math.pi; r = math.sqrt(self.rng.rand()) * self.lrad
            Lp = self.L + np.array([r * math.cos(a), r * math.sin(a) * .6, r * math.sin(a)], np.float32)
            d = Lp[None, None] - P; dist = np.linalg.norm(d, axis=-1, keepdims=True); d = d / dist
            ox = P[..., 0] - self.cx; oz = P[..., 2] - self.cz; dx = d[..., 0]; dz = d[..., 2]
            a2 = dx * dx + dz * dz; b = 2 * (ox * dx + oz * dz); c = ox * ox + oz * oz - self.rc ** 2; disc = b * b - 4 * a2 * c
            hit = np.zeros(X.shape, bool); ok = disc > 0
            t1 = np.where(ok, (-b - np.sqrt(np.where(ok, disc, 1))) / (2 * np.maximum(a2, 1e-9)), -1); y1 = t1 * d[..., 1]
            hit |= ok & (t1 > 0) & (y1 >= 0) & (y1 <= self.hc)
            tc = (self.hc) / np.maximum(d[..., 1], 1e-6); xc = ox + tc * dx; zc = oz + tc * dz; hit |= (tc > 0) & (xc * xc + zc * zc <= self.rc ** 2)
            vis += (~hit).astype(np.float32)
        return vis / n
    def _bake(self):
        R = self.res; e = self.ext; lin = np.linspace(-e, e, R, dtype=np.float32); X, Z = np.meshgrid(lin, lin)    # texture row = z, col = x
        vis = self._shadow(X, Z, self.nsamp); vis = gaussian_filter(vis, 1.2)
        n_dot = max(0.0, float(norm((self.L - np.array([0, 0, 0]))[None])[0][1]))
        amb, dif = .30, 1.10 * n_dot; self.amb = amb
        # contact ambient occlusion around the cylinder base and soft occlusion near the board rim
        rr = np.hypot(X - self.cx, Z - self.cz); ao = 1 - .55 * np.exp(-np.clip(rr - self.rc, 0, None) ** 2 / .12); ao = np.where(rr < self.rc, 1.0, ao)
        light = (amb * ao + dif * vis * ao ** .6)
        self.light = light; self.X, self.Z = X, Z
        # numeric calibration: A (dark, lit) and B (light, in shadow) must have identical linear radiance
        def tex_at(x, z): return float(map_coordinates(light, [[(z + e) / (2 * e) * (R - 1)], [(x + e) / (2 * e) * (R - 1)]], order=1)[0])
        ax, az = self.sq_center(*self.A); bx, bz = self.sq_center(*self.B); self.vA = tex_at(ax, az); self.vB = tex_at(bx, bz)
        self.ad = self.al * self.vB / self.vA                                  # albedo of the dark squares
        self.target_radiance = self.al * self.vB
        # albedo texture: checkerboard board + wooden table + frame
        col = np.floor(X + 4).astype(int); row = np.floor(Z + 4).astype(int); inb = (col >= 0) & (col < 8) & (row >= 0) & (row < 8)
        chk = ((col + row) % 2 == 0); alb = np.where(chk, self.al, self.ad)
        frame = (np.abs(X) < 4.55) & (np.abs(Z) < 4.55) & ~inb
        table = np.full(X.shape, .030, np.float32) + .004 * np.sin(X * 3.1 + Z * 1.7)
        a = np.where(inb, alb, np.where(frame, .22, table)).astype(np.float32); self.albedo = a
        self.rad_tex = gaussian_filter((a * light).astype(np.float32), .9)
        light_ns = (amb * ao + dif * 1.0 * ao ** .6); self.rad_tex_ns = gaussian_filter((a * light_ns).astype(np.float32), .9)
        self.tint = np.where(inb, 1.0, 0.0).astype(np.float32)
    def _tex(self, tex, X, Z):
        R = self.res; e = self.ext; return map_coordinates(tex, [((Z + e) / (2 * e) * (R - 1)).ravel(), ((X + e) / (2 * e) * (R - 1)).ravel()], order=1, mode="nearest").reshape(X.shape)
    def render(self, cam, ss=1, shadow=1.0):
        D = cam.rays(ss); H, W = D.shape[:2]; o = cam.pos
        # background studio gradient with soft bokeh blobs
        yy = np.linspace(0, 1, H, dtype=np.float32)[:, None]; g = (1 - yy) * np.ones((H, W), np.float32); bg = np.dstack([.004 + .010 * g, .005 + .012 * g, .009 + .024 * g])
        img = bg.copy(); tfl = np.full((H, W), 1e9, np.float32); dy = D[..., 1]; m = dy < -1e-4; tfl[m] = -o[1] / dy[m]
        fx = o[0] + tfl * D[..., 0]; fz = o[2] + tfl * D[..., 2]; ok = m & (np.abs(fx) < self.ext - .05) & (np.abs(fz) < self.ext - .05)
        fxx, fzz = np.where(ok, fx, 0), np.where(ok, fz, 0); rad = self._tex(self.rad_tex, fxx, fzz)
        if shadow < 1.0: rad = rad * shadow + self._tex(self.rad_tex_ns, fxx, fzz) * (1 - shadow)
        fade = np.clip(1 - (np.hypot(fx - 0, fz - 0) - 7.4) / 2.0, 0, 1)
        floor_rgb = np.dstack([rad * 1.0, rad * 0.98, rad * 0.96]) * (ok * fade)[..., None] ; img = np.where(ok[..., None], floor_rgb + (1 - fade)[..., None] * ok[..., None] * bg, img)
        # cylinder
        ox, oz = o[0] - self.cx, o[2] - self.cz; dx, dz = D[..., 0], D[..., 2]
        a2 = dx * dx + dz * dz; b = 2 * (ox * dx + oz * dz); c = ox * ox + oz * oz - self.rc ** 2; disc = b * b - 4 * a2 * c; okc = disc > 0
        ts = np.where(okc, (-b - np.sqrt(np.where(okc, disc, 1))) / (2 * np.maximum(a2, 1e-9)), 1e9); ys = o[1] + ts * D[..., 1]; side = okc & (ts > 0) & (ys >= 0) & (ys <= self.hc)
        tcap = (self.hc - o[1]) / np.minimum(D[..., 1], -1e-6); xc = ox + tcap * dx; zc = oz + tcap * dz; cap = (tcap > 0) & (xc * xc + zc * zc <= self.rc ** 2)
        tcyl = np.where(side, ts, 1e9); tcyl = np.where(cap & (tcap < tcyl), tcap, tcyl); front = (tcyl < 1e8) & (tcyl < tfl)
        idx = np.nonzero(front)
        if idx[0].size:
            Dm = D[idx]; tm = tcyl[idx]; Pc = o[None] + tm[:, None] * Dm; capm = (cap & (tcap < np.where(side, ts, 1e9)))[idx]
            Nrm = np.where(capm[:, None], np.array([0, 1, 0], np.float32)[None], norm(np.stack([Pc[:, 0] - self.cx, np.zeros_like(Pc[:, 0]), Pc[:, 2] - self.cz], -1)))
            Ld = norm(self.L[None] - Pc); lam = np.clip((Nrm * Ld).sum(-1), 0, 1); V = -Dm; Hh = norm(Ld + V); spec = np.clip((Nrm * Hh).sum(-1), 0, 1) ** 90
            rim = np.clip(1 - (Nrm * V).sum(-1), 0, 1) ** 3; hh = np.clip(Pc[:, 1] / self.hc, 0, 1); occl = .50 + .50 * hh ** .35
            base = np.array(self.cyl_color, np.float32); shade = (self.amb * 1.1 + 1.0 * lam) * occl
            # sky reflection on the sides (fresnel-ish) for a glossy look
            refl = np.clip(Nrm[:, 1] * .5 + .5, 0, 1)[:, None] * np.array([.10, .12, .16], np.float32) * (rim[:, None] * 2.0)
            cyl_rgb = base[None] * shade[:, None] + spec[:, None] * np.array([1, .97, .92], np.float32) * 1.1 + rim[:, None] * np.array([.22, .26, .40], np.float32) * .8 + refl
            img[idx] = cyl_rgb
        # downsample supersampling
        if ss > 1: img = img.reshape(H // ss, ss, W // ss, ss, 3).mean((1, 3))
        return img.astype(np.float32)

def tonemap(img, exposure=1.35):
    x = img * exposure; a, b, c, d, e = 2.51, .03, 2.43, .59, .14; y = np.clip((x * (a * x + b)) / (x * (c * x + d) + e), 0, 1); return y ** (1 / 2.2)

def to_pil(img_lin, exposure=1.35): return Image.fromarray((tonemap(img_lin, exposure) * 255 + .5).astype(np.uint8), "RGB")
