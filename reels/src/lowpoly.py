"""Tiny low-poly 3D renderer (painter's algorithm, flat shading, fog) for 'what if' scenes: boxes, flat quads, billboard discs, blocky people, cars, buildings.
Everything is drawn with PIL polygons at 1.5x and downsampled. Right-handed world, y up."""
import math
import numpy as np
from PIL import Image, ImageDraw
from engine import W, H

SS = 1.5
_FACES = [((1, 0, 0), [(1, -1, -1), (1, -1, 1), (1, 1, 1), (1, 1, -1)]), ((-1, 0, 0), [(-1, -1, 1), (-1, -1, -1), (-1, 1, -1), (-1, 1, 1)]),
          ((0, 1, 0), [(-1, 1, -1), (1, 1, -1), (1, 1, 1), (-1, 1, 1)]), ((0, -1, 0), [(-1, -1, 1), (1, -1, 1), (1, -1, -1), (-1, -1, -1)]),
          ((0, 0, 1), [(1, -1, 1), (-1, -1, 1), (-1, 1, 1), (1, 1, 1)]), ((0, 0, -1), [(-1, -1, -1), (1, -1, -1), (1, 1, -1), (-1, 1, -1)])]
FN = np.array([f[0] for f in _FACES], np.float32); FC = np.array([f[1] for f in _FACES], np.float32)
LIGHT = np.array([-.45, .8, -.4], np.float32); LIGHT /= np.linalg.norm(LIGHT)

class Cam:
    def __init__(self, pos, target, fov=55.0, up=(0, 1, 0)):
        self.p = np.array(pos, np.float32); f = np.array(target, np.float32) - self.p; self.f = f / np.linalg.norm(f)
        r = np.cross(self.f, np.array(up, np.float32)); self.r = r / np.linalg.norm(r); self.u = np.cross(self.r, self.f)
        self.F = (H * SS / 2) / math.tan(math.radians(fov) / 2)
    def project(self, P):
        d = P - self.p; z = d @ self.f; x = d @ self.r; y = d @ self.u
        zz = np.maximum(z, 1e-3); return W * SS / 2 + x / zz * self.F, H * SS / 2 - y / zz * self.F, z
    def camspace(self, P):
        d = P - self.p; return d @ self.r, d @ self.u, d @ self.f
    def to_screen(self, poly):
        return [(W * SS / 2 + x / z * self.F, H * SS / 2 - y / z * self.F) for x, y, z in poly]

def _clip_near(poly, near):
    out = []
    for i in range(len(poly)):
        a, b = poly[i], poly[(i + 1) % len(poly)]; ina, inb = a[2] >= near, b[2] >= near
        if ina: out.append(a)
        if ina != inb:
            t = (near - a[2]) / (b[2] - a[2]); out.append((a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, near))
    return out

class Scene:
    def __init__(self): self.boxes = []; self.flat = []; self.quads = []; self.discs = []
    def box(self, c, s, col, yaw=0.0): self.boxes.append((c, s, col, yaw))
    def floor(self, c, s, col): self.flat.append((c, s, col, 0.0))      # thin slab drawn before everything upright
    def quad(self, pts, col, bias=0.0): self.quads.append((np.array(pts, np.float32), col, bias))
    def disc(self, c, r, col, a=1.0): self.discs.append((c, r, col, a))
    # ---- composites
    def person(self, x, z, yaw, t, shirt=(220, 60, 50), pants=(50, 60, 110), skin=(236, 190, 150), anim="walk", s=1.0, hair=(60, 40, 30)):
        c, sn = math.cos(yaw), math.sin(yaw)
        def put(lx, ly, lz, size, col):
            wx = x + (lx * c + lz * sn) * s; wz = z + (-lx * sn + lz * c) * s; self.box((wx, ly * s, wz), (size[0] * s, size[1] * s, size[2] * s), col, yaw)
        w = math.sin(t * 9.0); bob = abs(math.sin(t * 9.0)) * .06 if anim in ("walk", "run") else (abs(math.sin(t * 14.0)) * .1 if anim == "panic" else 0)
        sw = .22 if anim == "walk" else (.34 if anim == "run" else 0.0)
        if anim == "squat":
            put(-.11, .24, .18, (.17, .46, .19), pants); put(.11, .24, .18, (.17, .46, .19), pants); put(0, .78, 0, (.5, .56, .26), shirt)
            put(-.33, .72, .06, (.14, .5, .14), shirt); put(.33, .72, .06, (.14, .5, .14), shirt); put(0, 1.2, .04, (.3, .3, .3), skin); put(0, 1.36, .02, (.32, .1, .32), hair); return
        put(-.11, .4 + bob, w * sw, (.17, .8, .19), pants); put(.11, .4 + bob, -w * sw, (.17, .8, .19), pants)
        put(0, 1.1 + bob, 0, (.5, .6, .26), shirt)
        if anim == "panic": put(-.33, 1.35 + bob, 0, (.14, .6, .14), shirt); put(.33, 1.35 + bob, 0, (.14, .6, .14), shirt)
        else: put(-.33, 1.1 + bob, -w * sw * .8, (.14, .6, .14), shirt); put(.33, 1.1 + bob, w * sw * .8, (.14, .6, .14), shirt)
        put(0, 1.58 + bob, 0, (.3, .3, .3), skin); put(0, 1.74 + bob, -.02, (.32, .1, .32), hair)
    def car(self, x, z, yaw, col):
        c, sn = math.cos(yaw), math.sin(yaw)
        def put(lx, ly, lz, size, cl):
            self.box((x + lx * c + lz * sn, ly, z - lx * sn + lz * c), size, cl, yaw)
        put(0, .55, 0, (1.8, .7, 4.2), col); put(0, 1.1, -.2, (1.6, .55, 2.2), tuple(min(255, int(v * .8)) for v in col))
        for sx in (-.95, .95):
            for sz in (-1.3, 1.3): put(sx, .32, sz, (.25, .64, .64), (25, 25, 30))
    def building(self, x, z, w, h, d, col, win=(40, 70, 110), yaw=0.0, rows=None, cols=None):
        self.box((x, h / 2, z), (w, h, d), col, yaw)
        rows = rows or max(1, int(h // 3.2)); cols = cols or max(1, int(w // 3.0))
        for face, (nx, nz, span) in (("front", (0, -1, w)), ("side", (1, 0, d))):
            for i in range(rows):
                for j in range(cols if face == "front" else max(1, int(d // 3.0))):
                    u = (j + .5) / (cols if face == "front" else max(1, int(d // 3.0))) - .5; y0 = 1.2 + i * 3.2
                    if face == "front":
                        zz = z - d / 2 - .02; self.quad([(x + u * w - .8, y0, zz), (x + u * w + .8, y0, zz), (x + u * w + .8, y0 + 1.6, zz), (x + u * w - .8, y0 + 1.6, zz)], win, bias=-.05)
                    else:
                        xx = x + w / 2 + .02; self.quad([(xx, y0, z + u * d - .8), (xx, y0, z + u * d + .8), (xx, y0 + 1.6, z + u * d + .8), (xx, y0 + 1.6, z + u * d - .8)], tuple(int(v * .85) for v in win), bias=-.05)
    def tree(self, x, z, s=1.0):
        self.box((x, 1.0 * s, z), (.4 * s, 2.0 * s, .4 * s), (110, 78, 45)); self.box((x, 2.9 * s, z), (1.8 * s, 1.6 * s, 1.8 * s), (62, 150, 70)); self.box((x, 4.0 * s, z), (1.1 * s, 1.0 * s, 1.1 * s), (76, 168, 82))

def _mix(col, k): return (col * k)
def render(sc, cam, sky=((120, 170, 235), (205, 225, 245)), fog=((205, 225, 245), 60.0, 260.0), ground=None, near=.4):
    Wi, Hi = int(W * SS), int(H * SS)
    img = Image.new("RGB", (Wi, Hi)); d = ImageDraw.Draw(img)
    top, bot = np.array(sky[0], np.float32), np.array(sky[1], np.float32)
    # sky gradient (cheap vertical lerp)
    col_strip = (top[None, :] * (1 - np.linspace(0, 1, Hi)[:, None]) + bot[None, :] * np.linspace(0, 1, Hi)[:, None]).astype(np.uint8)
    img = Image.fromarray(np.repeat(col_strip[:, None, :], Wi, axis=1), "RGB"); d = ImageDraw.Draw(img)
    fogc, z0, z1 = np.array(fog[0], np.float32), fog[1], fog[2]
    def fogged(c, z): t = max(0.0, min(1.0, (z - z0) / (z1 - z0))); return tuple(int(v) for v in (np.array(c, np.float32) * (1 - t) + fogc * t))
    items = []
    def add_boxes(lst, store):
        if not lst: return
        C = np.array([b[0] for b in lst], np.float32); S = np.array([b[1] for b in lst], np.float32); COL = np.array([b[2] for b in lst], np.float32); Y = np.array([b[3] for b in lst], np.float32)
        cs, sn = np.cos(Y), np.sin(Y); R = np.zeros((len(lst), 3, 3), np.float32); R[:, 0, 0] = cs; R[:, 0, 2] = sn; R[:, 1, 1] = 1; R[:, 2, 0] = -sn; R[:, 2, 2] = cs
        corners = FC[None, :, :, :] * (S[:, None, None, :] * .5)                         # (n,6,4,3)
        V = C[:, None, None, :] + np.einsum("nij,nfcj->nfci", R, corners)                # world verts
        N = np.einsum("nij,fj->nfi", R, FN)                                              # world normals
        FCtr = V.mean(2); vis = (N * (cam.p[None, None, :] - FCtr)).sum(-1) > 0
        dif = np.clip((N * LIGHT[None, None, :]).sum(-1), 0, 1); shade = .66 + .40 * dif
        xc, yc, z = cam.camspace(V.reshape(-1, 3)); xc = xc.reshape(V.shape[:3]); yc = yc.reshape(V.shape[:3]); z = z.reshape(V.shape[:3])
        ok = vis & (z.max(-1) > near)
        for n in np.nonzero(ok.any(1))[0]:
            for f in np.nonzero(ok[n])[0]:
                poly = [(float(xc[n, f, k]), float(yc[n, f, k]), float(z[n, f, k])) for k in range(4)]
                if min(p[2] for p in poly) < near:
                    poly = _clip_near(poly, near)
                    if len(poly) < 3: continue
                zm = float(np.mean([p[2] for p in poly]))
                items.append((zm if store == "up" else zm + 1e4, 0, cam.to_screen(poly), tuple(COL[n] * shade[n, f]), zm))
    add_boxes(sc.flat, "flat"); add_boxes(sc.boxes, "up")
    for pts, col, bias in sc.quads:
        xc, yc, z = cam.camspace(pts); poly = [(float(xc[k]), float(yc[k]), float(z[k])) for k in range(len(pts))]
        if max(p[2] for p in poly) < near: continue
        if min(p[2] for p in poly) < near:
            poly = _clip_near(poly, near)
            if len(poly) < 3: continue
        zm = float(np.mean([p[2] for p in poly])); items.append((zm + bias, 0, cam.to_screen(poly), col, zm))
    for c, r, col, a in sc.discs:
        x, y, z = cam.project(np.array([c], np.float32))
        if z[0] > near:
            rp = min(r * cam.F / z[0], 46.0); items.append((float(z[0]), 1, (float(x[0]), float(y[0]), float(rp)), col, float(z[0])))
    # flat slabs have key z+1e4 so they sort as "farthest", i.e. drawn first
    items.sort(key=lambda it: -it[0])
    for key, kind, geo, col, zm in items:
        c = fogged(col, zm)
        if kind == 0: d.polygon(geo, fill=c)
        else: x, y, r = geo; d.ellipse([x - r, y - r, x + r, y + r], fill=c)
    return img.resize((W, H), Image.LANCZOS)
