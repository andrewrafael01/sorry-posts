"""soft hand-drawn cat engine: Mochi (lavender) + Toast (butter, tabby marks + cowlick)"""
import math, random, os
import numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps

SS = 3
W, H = 1080, 1350
INK = np.array([42, 34, 50], float)
FD = "/tmp/claude-0/fonts/gf/ofl/"
FONTS = {"gaegu": FD+"gaegu/Gaegu-Bold.ttf", "gaegu_r": FD+"gaegu/Gaegu-Regular.ttf",
         "patrick": FD+"patrickhand/PatrickHand-Regular.ttf", "stack": FD+"shortstack/ShortStack-Regular.ttf",
         "gloria": FD+"gloriahallelujah/GloriaHallelujah.ttf", "sniglet": FD+"sniglet/Sniglet-ExtraBold.ttf"}
PAL = {
    "mochi": dict(top=(210, 202, 255), mid=(210, 202, 255), bot=(210, 202, 255), blush=(255, 160, 205), mark=None),
    "toast": dict(top=(255, 226, 170), mid=(255, 226, 170), bot=(255, 226, 170), blush=(255, 146, 150), mark=(232, 168, 100)),
}
PINK = (255, 128, 170)
SH, FX = 4, 16


def _p(p): return (int(round(p[0]*FX)), int(round(p[1]*FX)))


def dot(img, c, r, v=255): cv2.circle(img, _p(c), max(1, int(round(r*FX))), v, -1, cv2.LINE_AA, SH)


def resample(pts, step, closed=True):
    P = np.vstack([pts, pts[:1]]) if closed else np.asarray(pts, float)
    d = np.sqrt((np.diff(P, axis=0)**2).sum(1)); L = np.concatenate([[0], np.cumsum(d)])
    n = max(3, int(L[-1]/step))
    s = np.linspace(0, L[-1], n, endpoint=not closed)
    return np.stack([np.interp(s, L, P[:, 0]), np.interp(s, L, P[:, 1])], 1)


def stroke(img, pts, w, seed=0, closed=True, var=0.28, taper=True, jit=0.0):
    q = resample(np.asarray(pts, float), max(1.0, w*0.18), closed)
    n = len(q); tt = np.linspace(0, 1, n, endpoint=not closed)
    r = random.Random(seed)
    nz = sum(a*np.sin(2*np.pi*f*tt+r.uniform(0, 6.3)) for f, a in ((2, 1), (5, .6), (11, .3)))/1.9
    ww = w*(1+var*nz)
    if jit:
        tg = np.gradient(q, axis=0); nrm = np.stack([-tg[:, 1], tg[:, 0]], 1)
        nrm /= (np.linalg.norm(nrm, axis=1, keepdims=True)+1e-6)
        nz2 = sum(a*np.sin(2*np.pi*f*tt+r.uniform(0, 6.3)) for f, a in ((4, 1), (9, .5), (17, .3)))/1.8
        q = q+nrm*(jit*nz2)[:, None]
    if not closed and taper:
        ww *= np.clip(np.minimum(tt, 1-tt)*7, 0.45, 1)
    for p, wi in zip(q, ww):
        dot(img, p, wi/2)


def contour(mask):
    cs, _ = cv2.findContours(mask, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_NONE)
    out = []
    for c in cs:
        if cv2.contourArea(c) < 50: continue
        c = c[:, 0, :].astype(float)
        k = 9
        if len(c) > 3*k:
            pad = np.vstack([c[-k:], c, c[:k]])
            ker = np.ones(k)/k
            c = np.stack([np.convolve(pad[:, 0], ker, 'same'), np.convolve(pad[:, 1], ker, 'same')], 1)[k:-k]
        out.append(c)
    return out


def smooth(mask, sig):
    m = cv2.GaussianBlur(mask, (0, 0), sig)
    return ((m > 127)*255).astype(np.uint8)


def bez(p0, p1, p2, n=40):
    t = np.linspace(0, 1, n)[:, None]
    return (1-t)**2*np.array(p0)+2*(1-t)*t*np.array(p1)+t**2*np.array(p2)


def cap_line(m, pts, th):
    pts = np.asarray(pts)
    cv2.polylines(m, [np.round(pts*FX).astype(np.int32)], False, 255, int(th), cv2.LINE_AA, SH)
    for p in (pts[0], pts[-1]):
        dot(m, p, th/2)


class Art:
    def __init__(self, w, h):
        self.w, self.h = int(w), int(h)
        self.col = np.full((self.h, self.w, 3), 255.0)
        self.fa = np.zeros((self.h, self.w))
        self.ink = np.zeros((self.h, self.w), np.uint8)

    def fill(self, mask, top, mid, bot, y0, y1):
        yy = np.linspace(0, 1, self.h)[:, None]
        yy = np.clip((np.arange(self.h)[:, None]-y0)/max(1, y1-y0), 0, 1)
        top, mid, bot = (np.array(c, float) for c in (top, mid, bot))
        g = np.where(yy[..., None] < 0.5, top+(mid-top)*(yy[..., None]*2), mid+(bot-mid)*((yy[..., None]-0.5)*2))
        g = np.broadcast_to(g, (self.h, 1, 3))
        a = cv2.GaussianBlur(mask, (0, 0), 1.2).astype(float)/255
        self.col = self.col*(1-a[..., None])+g*a[..., None]
        self.fa = np.maximum(self.fa, a)

    def tint(self, amap, color, clip=True):
        a = amap*(self.fa if clip else 1)
        self.col = self.col*(1-a[..., None])+np.array(color, float)*a[..., None]

    def outline(self, mask, w, seed, var=0.36, jit=None):
        for c in contour(mask):
            stroke(self.ink, c, w, seed, True, var, jit=(w*0.38 if jit is None else jit))

    def image(self):
        ink = self.ink.astype(float)/255
        rgb = self.col*(1-ink[..., None])+INK*ink[..., None]
        a = np.maximum(self.fa, ink)
        out = np.dstack([rgb, a*255]).clip(0, 255).astype(np.uint8)
        return Image.fromarray(out, "RGBA")


def squircle(cx, cy, rx, ry, n=2.4, flare=0.08, N=400, seed=None):
    t = np.linspace(0, 2*np.pi, N, endpoint=False)
    c, s = np.cos(t), np.sin(t)
    x = np.sign(c)*np.abs(c)**(2/n); y = np.sign(s)*np.abs(s)**(2/n)
    x = x*(1+flare*np.clip(y, 0, 1))
    if seed is not None:
        r = random.Random(seed)
        k = 1+0.028*sum(a*np.sin(f*t+r.uniform(0, 6.3)) for f, a in ((2, 1), (3, .8), (5, .5)))
        x, y = x*k, y*k
    return np.stack([cx+rx*x, cy+ry*y], 1)


def blob(cx, cy, rx, ry, seed, amp=0.03, N=400):
    r = random.Random(seed); t = np.linspace(0, 2*np.pi, N, endpoint=False)
    k = 1+amp*sum(a*np.sin(f*t+r.uniform(0, 6.3)) for f, a in ((2, 1), (3, .7), (5, .4)))
    return np.stack([cx+rx*k*np.cos(t), cy+ry*k*np.sin(t)], 1)


def poly(m, pts): cv2.fillPoly(m, [np.round(np.asarray(pts)*FX).astype(np.int32)], 255, cv2.LINE_AA, SH)


def ell(m, c, ax, ay, ang=0, v=255):
    cv2.ellipse(m, _p(c), (int(ax*FX), int(ay*FX)), ang, 0, 360, v, -1, cv2.LINE_AA, SH)


def arc(img, c, ax, ay, a0, a1, th, ang=0):
    cv2.ellipse(img, _p(c), (max(1, int(ax*FX)), max(1, int(ay*FX))), ang, a0, a1, 255, max(1, int(round(th))), cv2.LINE_AA, SH)


# ----------------------------------------------------------------- cat
def cat(who="mochi", pose="sit", mood="dot", u=170, seed=1, arms="none", mouth=None, blush=1.0, tail=True, hatch=False):
    """returns (RGBA image at SS scale, anchor (cx,cy), feats dict) all in SS px"""
    U = u*SS; pal = PAL[who]
    C = int(U*4.4)
    A = Art(C, C)
    cx, cy = C/2, C/2+U*0.25
    m = np.zeros((C, C), np.uint8)
    f = {}
    if pose == "loaf":
        rx, ry = U*1.38, U*0.68
    elif pose == "stand":
        rx, ry = U*0.8, U*1.08
    else:
        rx, ry = U*1.0, U*0.9
    top = cy-ry
    body = squircle(cx, cy, rx, ry, n=2.3 if pose != "loaf" else 2.6, flare=0.07, seed=seed)
    poly(m, body)
    # face anchor
    fcx = cx
    fy = top+(0.58*U if pose != "loaf" else 0.5*U)
    esp = 0.36*U
    # ears
    eb = rx if pose != "loaf" else U*0.95
    for s in (-1, 1):
        tip = (fcx+s*eb*0.64, top-0.5*U)
        inner = (fcx+s*eb*0.1, top+0.12*U)
        outer = (fcx+s*eb*1.0, top+0.5*U)
        poly(m, [inner, tip, outer])
    # feet
    feet = []
    if pose in ("sit", "stand"):
        for s in (-1, 1):
            fp = (cx+s*rx*0.46, cy+ry*0.93); feet.append(fp)
            ell(m, fp, 0.27*U, 0.17*U)
    else:
        for s in (-1, 1):
            fp = (fcx+s*0.36*U, cy+ry*0.9); feet.append(fp)
            ell(m, fp, 0.2*U, 0.13*U)
    # tail
    tailpts = None
    if tail:
        if pose == "loaf":
            tailpts = bez((cx+rx*0.85, cy+ry*0.55), (cx+rx*1.35, cy+ry*0.9), (cx+rx*1.32, cy+ry*0.05))
        else:
            if pose == "stand":
                tailpts = bez((cx+rx*0.8, cy+ry*0.8), (cx+rx*1.55, cy+ry*1.0), (cx+rx*1.55, cy+ry*0.25))
            else:
                tailpts = bez((cx+rx*0.78, cy+ry*0.62), (cx+rx*1.5, cy+ry*0.85), (cx+rx*1.38, cy-ry*0.08))
        cap_line(m, tailpts, 0.21*U)
    # arms
    paws = []
    if pose == "stand":
        sh = [(cx-rx*0.78, cy-ry*0.05), (cx+rx*0.78, cy-ry*0.05)]
        for i, s in enumerate((-1, 1)):
            a = arms if arms != "wave" else ("up" if s == -1 else "down")
            if a == "up":
                cap_line(m, bez(sh[i], (sh[i][0]+s*0.35*U, sh[i][1]-0.15*U), (sh[i][0]+s*0.45*U, sh[i][1]-0.7*U)), 0.26*U)
            elif a == "down":
                cap_line(m, bez(sh[i], (sh[i][0]+s*0.2*U, sh[i][1]+0.2*U), (sh[i][0]+s*0.22*U, sh[i][1]+0.45*U)), 0.26*U)
            elif a == "hold":
                paws.append((cx+s*0.3*U, cy+ry*0.22))
    m = smooth(m, 0.07*U)
    A.fill(m, pal["top"], pal["mid"], pal["bot"], top-0.5*U, cy+ry)
    # tabby marks + cowlick (toast)
    if pal["mark"]:
        mk = np.zeros_like(m)
        for dx in (-0.14, 0, 0.14):
            cap_line(mk, bez((fcx+dx*U, top+0.02*U), (fcx+dx*U*1.15, top+0.14*U), (fcx+dx*U*0.9, top+0.26*U), 12), 0.06*U)
        mk = cv2.GaussianBlur(mk, (0, 0), 0.01*U).astype(float)/255
        A.tint(mk*0.9, pal["mark"])
    # blush
    bl = np.zeros_like(m)
    for s in (-1, 1):
        ell(bl, (fcx+s*esp*1.05, fy+0.15*U), 0.2*U, 0.11*U)
    ell(bl, (fcx, fy+0.1*U), 0.42*U, 0.1*U, v=110)
    bl = cv2.GaussianBlur(bl, (0, 0), 0.07*U).astype(float)/255
    A.tint(np.clip(bl*0.85*blush, 0, 1), pal["blush"])
    # outline
    lw = 0.08*U
    A.outline(m, lw, seed)
    # foot toe lines
    for fp in feet:
        arc(A.ink, (fp[0], fp[1]-0.02*U), 0.16*U, 0.11*U, 205, 335, lw*0.7)
    # cowlick
    if who == "toast":
        stroke(A.ink, bez((fcx+0.02*U, top+0.04*U), (fcx+0.12*U, top-0.22*U), (fcx-0.1*U, top-0.18*U), 30), lw*0.8, seed+3, False)
    face(A, mood, fcx, fy, U, lw, seed, mouth, hatch)
    f.update(cx=cx, cy=cy, top=top, face=(fcx, fy), rx=rx, ry=ry, paws=paws, U=U)
    return A.image(), (cx, cy), f


def face(A, mood, x, y, U, lw, seed, mouth=None, hatch=False):
    ink = A.ink; e = 0.36*U; r = 0.065*U; th = lw*0.62
    my = y+0.15*U
    mouth = mouth or {"cry": "wobble", "shock": "o", "stare": "w", "pout": "frown", "blep": "blep", "smug": "w"}.get(mood, "w")
    for s in (-1, 1):
        ex = x+s*e
        if mood in ("dot", "love", "blep", "pout"):
            dot(ink, (ex, y), r)
        elif mood == "cry":
            dot(ink, (ex, y), r*1.7)
            dot(ink, (ex-0.035*U, y-0.04*U), r*0.6, 0); dot(ink, (ex+0.04*U, y+0.045*U), r*0.3, 0)
        elif mood == "sparkle":
            dot(ink, (ex, y), r*1.9)
            dot(ink, (ex-0.04*U, y-0.045*U), r*0.75, 0); dot(ink, (ex+0.045*U, y+0.05*U), r*0.35, 0)
        elif mood == "happy":
            arc(ink, (ex, y+0.03*U), 0.075*U, 0.065*U, 190, 350, th*1.15)
        elif mood == "sleep":
            arc(ink, (ex, y-0.02*U), 0.08*U, 0.05*U, 15, 165, th*1.15)
        elif mood == "squint":
            cv2.line(ink, _p((ex-s*0.07*U, y-0.06*U)), _p((ex+s*0.06*U, y)), 255, int(th*1.2), cv2.LINE_AA, SH)
            cv2.line(ink, _p((ex+s*0.06*U, y)), _p((ex-s*0.07*U, y+0.06*U)), 255, int(th*1.2), cv2.LINE_AA, SH)
        elif mood in ("stare", "shock"):
            # big glossy eyes with a shine (cute, not startled)
            k = 1.75 if mood == "stare" else 1.55
            dot(ink, (ex, y), r*k)
            dot(ink, (ex-0.032*U, y-0.038*U), r*0.68, 0); dot(ink, (ex+0.038*U, y+0.042*U), r*0.3, 0)
        elif mood == "smug":
            cv2.ellipse(ink, _p((ex, y-0.01*U)), (int(0.08*U*FX), int(0.06*U*FX)), 0, 0, 180, 255, -1, cv2.LINE_AA, SH)
            cv2.line(ink, _p((ex-0.1*U, y-0.01*U)), _p((ex+0.1*U, y-0.01*U)), 255, int(th), cv2.LINE_AA, SH)
        if mood == "pout":
            cv2.line(ink, _p((ex-s*0.1*U, y-0.15*U)), _p((ex+s*0.07*U, y-0.09*U)), 255, int(th), cv2.LINE_AA, SH)
    # white-out inside stare eyes must not leave holes in col: paint col white there
    if mood == "cry":
        tm = np.zeros(ink.shape, np.uint8)
        for s in (-1, 1):
            ex = x+s*e
            pts = [(ex+0.03*U*math.sin(k*0.9), y+0.1*U+k*0.05*U) for k in range(12)]
            cap_line(tm, pts, 0.085*U)
            ell(tm, (ex+0.03*U*math.sin(11*0.9), y+0.66*U), 0.075*U, 0.05*U)
        tm = smooth(tm, 0.01*U)
        A.tint(tm.astype(float)/255*0.95, (160, 214, 255))
        for c in contour(tm): stroke(ink, c, th*0.6, seed+5, True, 0.2)
    # mouth
    if mouth == "w":
        for s in (-1, 1):
            arc(ink, (x+s*0.055*U, my), 0.055*U, 0.05*U, 10, 170, th)
    elif mouth == "o":
        dot(ink, (x, my+0.02*U), 0.045*U+th*0.5); dot(ink, (x, my+0.02*U), 0.045*U-th*0.4, 0)
        wm = np.zeros(ink.shape, np.uint8); dot(wm, (x, my+0.02*U), 0.045*U); A.tint(wm/255.0, (120, 60, 80))
    elif mouth == "smile":
        arc(ink, (x, my-0.02*U), 0.08*U, 0.06*U, 15, 165, th)
    elif mouth == "frown":
        arc(ink, (x, my+0.05*U), 0.06*U, 0.04*U, 200, 340, th)
    elif mouth == "wobble":
        pts = [(x-0.09*U+i*0.0225*U, my+0.02*U+(0.018*U if i % 2 else -0.0)) for i in range(9)]
        stroke(ink, pts, th, seed, False, 0.1)
    elif mouth == "blep":
        tm = np.zeros(ink.shape, np.uint8)
        ell(tm, (x, my+0.07*U), 0.05*U, 0.07*U); poly(tm, [(x-0.05*U, my+0.02*U), (x+0.05*U, my+0.02*U), (x+0.05*U, my+0.07*U), (x-0.05*U, my+0.07*U)])
        tm = smooth(tm, 0.006*U)
        A.tint(tm/255.0, (255, 130, 160))
        for c in contour(tm): stroke(ink, c, th*0.75, seed+9, True, 0.15)
        for s in (-1, 1): arc(ink, (x+s*0.055*U, my), 0.055*U, 0.05*U, 10, 170, th)
    if hatch:
        for s in (-1, 1):
            for k in range(3):
                bx = x+s*e*1.05+(k-1)*0.07*U
                cv2.line(ink, _p((bx+0.03*U, my-0.06*U)), _p((bx-0.02*U, my+0.04*U)), 255, max(1, int(th*0.6)), cv2.LINE_AA, SH)


# ----------------------------------------------------------------- props
def _shape(w, h, draw, top, mid, bot, lw=None, seed=0, extra=None, var=0.25):
    A = Art(w*SS, h*SS)
    m = np.zeros((A.h, A.w), np.uint8)
    draw(m, SS)
    m = smooth(m, 1.2*SS)
    A.fill(m, top, mid, bot, 0, A.h)
    if extra: extra(A, SS)
    A.outline(m, (lw or max(4, min(w, h)*0.06))*SS, seed, var)
    return A.image()


def heart(size, col=PINK, seed=0, lw=None):
    def d(m, s):
        w = size*s; c = (w*0.5+w*0.06, w*0.5+w*0.06)
        r = w*0.24
        dot(m, (c[0]-r*0.95, c[1]-r*0.55), r); dot(m, (c[0]+r*0.95, c[1]-r*0.55), r)
        poly(m, [(c[0]-r*1.9, c[1]-r*0.35), (c[0]+r*1.9, c[1]-r*0.35), (c[0], c[1]+r*1.75)])
    lt = col

    def shine(A, s):
        sm = np.zeros((A.h, A.w), np.uint8); ell(sm, (size*s*0.33, size*s*0.33), size*s*0.07, size*s*0.045, -35)
        A.tint(cv2.GaussianBlur(sm, (0, 0), 2)/255.0*0.9, (255, 255, 255))
    return _shape(int(size*1.12), int(size*1.12), d, col, col, col, lw, seed)


def sparkle(size, col=(255, 214, 90), seed=0):
    def d(m, s):
        c = size*s*0.6; r = size*s*0.5
        pts = []
        for i in range(16):
            a = i*math.pi/8; rr = r if i % 4 == 0 else (r*0.42 if i % 2 == 0 else r*0.2)
            pts.append((c+rr*math.sin(a), c-rr*math.cos(a)))
        poly(m, pts)
    return _shape(int(size*1.2), int(size*1.2), d, col, col, col, max(3, size*0.07), seed)


def cloud(w, h, seed=0, col=(255, 255, 255)):
    def d(m, s):
        r = random.Random(seed); cx, cy = w*s/2, h*s/2
        ell(m, (cx, cy), w*s*0.36, h*s*0.3)
        n = 9
        for i in range(n):
            a = 2*math.pi*i/n
            dot(m, (cx+w*s*0.36*math.cos(a), cy+h*s*0.3*math.sin(a)), min(w, h)*s*r.uniform(0.15, 0.2))
    return _shape(w, h, d, col, col, col, 6, seed)


def bubble(w, h, tail="bl", seed=0):
    def d(m, s):
        p = 0.08
        b = squircle(w*s/2, h*s*0.42, w*s*(0.5-p), h*s*0.32, n=3.2, flare=0)
        poly(m, b)
        tx = w*s*0.3 if tail == "bl" else w*s*0.7
        poly(m, [(tx-w*s*0.06, h*s*0.65), (tx+w*s*0.06, h*s*0.65), (tx+(-1 if tail == "bl" else 1)*w*s*0.08, h*s*0.92)])
    return _shape(w, h, d, (255, 255, 255), (255, 255, 255), (255, 255, 255), 6, seed)


def flower(size, col=(255, 182, 206), seed=0):
    def d(m, s):
        c = size*s*0.6; r = size*s*0.2
        for i in range(5):
            a = 2*math.pi*i/5
            dot(m, (c+r*1.15*math.cos(a), c+r*1.15*math.sin(a)), r)

    def ctr(A, s):
        cm = np.zeros((A.h, A.w), np.uint8); dot(cm, (size*s*0.6, size*s*0.6), size*s*0.16)
        A.tint(cm/255.0, (255, 220, 110), clip=False)
        A.fa = np.maximum(A.fa, cm/255.0)
        stroke(A.ink, contour(cm)[0], 3*s, seed, True)
    return _shape(int(size*1.2), int(size*1.2), d, col, col, col, 5, seed, ctr)


def rect_prop(w, h, col, seed=0, radius=0.2, stripes=None, screen=None):
    def d(m, s):
        poly(m, squircle(w*s/2, h*s/2, w*s*0.47, h*s*0.45, n=6, flare=0))

    def ex(A, s):
        if stripes:
            sm = np.zeros((A.h, A.w), np.uint8)
            for i in range(1, 6):
                yy = h*s*i/6
                cap_line(sm, [(w*s*0.06, yy), (w*s*0.94, yy)], h*s*0.035)
            A.tint(sm/255.0*0.8, stripes)
        if screen:
            sm = np.zeros((A.h, A.w), np.uint8)
            poly(sm, squircle(w*s/2, h*s/2, w*s*0.38, h*s*0.4, n=6, flare=0))
            A.tint(sm/255.0, screen)
    return _shape(w, h, d, col, col, col, 6, seed, ex)


def cookie(size, seed=0):
    def d(m, s): poly(m, blob(size*s*0.6, size*s*0.6, size*s*0.5, size*s*0.5, seed, 0.04))

    def chips(A, s):
        r = random.Random(seed)
        cm = np.zeros((A.h, A.w), np.uint8)
        for _ in range(6):
            dot(cm, (size*s*r.uniform(0.3, 0.9), size*s*r.uniform(0.3, 0.9)), size*s*0.06)
        A.tint(cm/255.0, (120, 74, 52))
    return _shape(int(size*1.2), int(size*1.2), d, (236, 192, 128), (236, 192, 128), (236, 192, 128), 5, seed, chips)


def mug(size, col=(255, 255, 255), seed=0):
    def d(m, s):
        poly(m, squircle(size*s*0.5, size*s*0.62, size*s*0.32, size*s*0.3, n=5, flare=0))
        cap_line(m, bez((size*s*0.8, size*s*0.48), (size*s*1.02, size*s*0.6), (size*s*0.8, size*s*0.76)), size*s*0.09)

    def ex(A, s):
        hm = np.zeros((A.h, A.w), np.uint8)
        cx, cy, hs = size*s*0.5, size*s*0.62, size*s*0.1
        dot(hm, (cx-hs*0.5, cy-hs*0.2), hs*0.5); dot(hm, (cx+hs*0.5, cy-hs*0.2), hs*0.5)
        poly(hm, [(cx-hs, cy-hs*0.1), (cx+hs, cy-hs*0.1), (cx, cy+hs*0.85)])
        A.tint(hm/255.0, PINK)
        for k in (-1, 0, 1):
            stroke(A.ink, bez((size*s*(0.5+k*0.12), size*s*0.26), (size*s*(0.56+k*0.12), size*s*0.16), (size*s*(0.5+k*0.12), size*s*0.05), 20), 3*s, seed+k, False)
    return _shape(int(size*1.1), int(size), d, col, col, col, 5, seed, ex)


# ----------------------------------------------------------------- canvas
def canvas(bg="white"):
    if isinstance(bg, Image.Image):
        return bg.convert("RGBA").copy()
    if bg == "white":
        return Image.new("RGBA", (W, H), (255, 255, 255, 255))
    return Image.new("RGBA", (W, H), bg+(255,))


def place(cv, img, X, Y, anchor=None, scale=1.0, flip=False, rot=0):
    """img at SS scale; anchor in SS px -> placed at (X,Y) final px"""
    if anchor is None: anchor = (img.width/2, img.height/2)
    if rot:
        img = img.rotate(rot, resample=Image.BICUBIC, center=anchor)
    if flip:
        img = ImageOps.mirror(img); anchor = (img.width-anchor[0], anchor[1])
    k = scale/SS
    sm = img.resize((max(1, int(img.width*k)), max(1, int(img.height*k))), Image.LANCZOS)
    layer = Image.new("RGBA", cv.size, (0, 0, 0, 0))
    layer.paste(sm, (int(round(X-anchor[0]*k)), int(round(Y-anchor[1]*k))), sm)
    cv.alpha_composite(layer)


def put_cat(cv, X, Y, who="mochi", pose="sit", mood="dot", u=170, seed=1, flip=False, rot=0, **kw):
    img, anc, f = cat(who, pose, mood, u, seed, **kw)
    place(cv, img, X, Y, anc, 1.0, flip, rot)
    k = 1/SS
    fx = lambda p: ((img.width-p[0]) if flip else p[0], p[1])
    f2 = dict(f)
    f2["paws"] = [(X+(fx(p)[0]-fx(anc)[0])*k, Y+(p[1]-anc[1])*k) for p in f["paws"]]
    f2["topY"] = Y+(f["top"]-anc[1])*k
    f2["face"] = (X+(fx(f["face"])[0]-fx(anc)[0])*k, Y+(f["face"][1]-anc[1])*k)
    return f2


def put(cv, img, X, Y, rot=0):
    place(cv, img, X, Y, None, 1.0, False, rot)


def paw(cv, X, Y, who, size=46, seed=0):
    p = PAL[who]
    img = _shape(int(size*1.3), int(size*1.1), lambda m, s: ell(m, (size*s*0.65, size*s*0.55), size*s*0.5, size*s*0.38), p["top"], p["mid"], p["mid"], 5.5, seed)
    put(cv, img, X, Y)


# ----------------------------------------------------------------- text
def font(name, size): return ImageFont.truetype(FONTS[name], size)


def text(cv, t, y, size=78, fname="gaegu", col=(42, 34, 50), accent=PINK, maxw=920, x=W//2, lh=1.12, shadow=False, align="center", rot=0, fit=True):
    """*word* -> accent color. returns bottom y"""
    size = int(size*1.25)
    f = font(fname, size)
    d = ImageDraw.Draw(cv)
    paras = t.split("\n")
    while True:
        lines = _wrap(d, paras, f, maxw)
        if not fit or len(lines) <= len(paras) or size < 40: break
        size = int(size*0.94); f = font(fname, size)
    yy = y
    layer = Image.new("RGBA", cv.size, (0, 0, 0, 0)); ld = ImageDraw.Draw(layer)
    for words in lines:
        plain = " ".join(w.strip("*") for w in words)
        lw_ = d.textlength(plain, font=f)
        xx = x-lw_/2 if align == "center" else x
        for w in words:
            hl = w.startswith("*") and w.rstrip(".,!?:)").endswith("*") and len(w) > 1
            ww = w.replace("*", "")
            ld.text((xx, yy), ww, font=f, fill=(accent if hl else col), anchor="ls")
            xx += d.textlength(ww+" ", font=f)
        yy += size*lh
    return _finish(cv, layer, yy, shadow, rot, x, y)


def _wrap(d, paras, f, maxw):
    lines = []
    for para in paras:
        cur = []
        for w in para.split(" "):
            test = " ".join(x_.strip("*") for x_ in cur+[w])
            if cur and d.textlength(test, font=f) > maxw:
                lines.append(cur); cur = [w]
            else:
                cur.append(w)
        lines.append(cur)
    return lines


def _finish(cv, layer, yy, shadow, rot, x, y):
    if shadow:
        sh = Image.new("RGBA", cv.size, (0, 0, 0, 0)); sh.putalpha(layer.getchannel("A").point(lambda v: int(min(255, v*1.6))))
        sh = sh.filter(ImageFilter.GaussianBlur(5))
        blk = Image.new("RGBA", cv.size, (20, 16, 30, 0)); blk.putalpha(sh.getchannel("A"))
        cv.alpha_composite(blk, (0, 3)); cv.alpha_composite(blk, (0, 2))
    if rot:
        layer = layer.rotate(rot, resample=Image.BICUBIC, center=(x, y))
    cv.alpha_composite(layer)
    return yy


def save(cv, path):
    cv.convert("RGB").save(path, quality=94)
