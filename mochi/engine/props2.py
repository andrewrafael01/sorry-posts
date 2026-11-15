"""Extra props for Mochi & Toast: box, door, cushion, bowl, window, snowflake, nightcap/santa hat, lit phone."""
from soft import *
from soft import _shape

BOX = (236, 198, 148); BOX_D = (214, 170, 118)


def box_front(w, h, seed=0):
    def d(m, s):
        poly(m, squircle(w*s/2, h*s*0.6, w*s*0.47, h*s*0.38, n=6, flare=0))
        # flaps
        poly(m, [(w*s*0.05, h*s*0.26), (w*s*0.0, h*s*0.02), (w*s*0.3, h*s*0.12), (w*s*0.34, h*s*0.26)])
        poly(m, [(w*s*0.95, h*s*0.26), (w*s*1.0, h*s*0.02), (w*s*0.7, h*s*0.12), (w*s*0.66, h*s*0.26)])

    def ex(A, s):
        sm = np.zeros((A.h, A.w), np.uint8)
        cap_line(sm, [(w*s*0.06, h*s*0.3), (w*s*0.94, h*s*0.3)], h*s*0.03)
        A.tint(sm/255.0*0.6, BOX_D)
    return _shape(w, h, d, BOX, BOX, BOX, 6, seed, ex)


def door(w, h, seed=0):
    def ex(A, s):
        sm = np.zeros((A.h, A.w), np.uint8)
        poly(sm, squircle(w*s*0.5, h*s*0.28, w*s*0.3, h*s*0.17, n=5, flare=0))
        poly(sm, squircle(w*s*0.5, h*s*0.7, w*s*0.3, h*s*0.17, n=5, flare=0))
        A.tint(sm/255.0*0.35, (190, 150, 124))
        km = np.zeros((A.h, A.w), np.uint8); dot(km, (w*s*0.82, h*s*0.5), w*s*0.05)
        A.tint(km/255.0, (255, 214, 120))
    return rect_prop(w, h, (222, 190, 166), seed) if False else _shape(w, h, lambda m, s: poly(m, squircle(w*s/2, h*s/2, w*s*0.47, h*s*0.48, n=7, flare=0)), (222, 190, 166), (222, 190, 166), (222, 190, 166), 6, seed, ex)


def cushion(w, h, col=(255, 206, 222), seed=0):
    def d(m, s): poly(m, squircle(w*s/2, h*s/2, w*s*0.47, h*s*0.42, n=2.4, flare=0.08))

    def ex(A, s):
        sm = np.zeros((A.h, A.w), np.uint8); dot(sm, (w*s*0.5, h*s*0.5), h*s*0.06)
        A.tint(sm/255.0, (255, 170, 196))
    return _shape(w, h, d, col, col, col, 6, seed, ex)


def bowl(w, full=False, seed=0):
    h = int(w*0.5)

    def d(m, s):
        poly(m, [(w*s*0.04, h*s*0.3), (w*s*0.96, h*s*0.3), (w*s*0.82, h*s*0.95), (w*s*0.18, h*s*0.95)])
        ell(m, (w*s*0.5, h*s*0.3), w*s*0.46, h*s*0.12)

    def ex(A, s):
        sm = np.zeros((A.h, A.w), np.uint8)
        ell(sm, (w*s*0.5, h*s*0.3), w*s*0.38, h*s*0.07)
        A.tint(sm/255.0, (150, 112, 86) if full else (226, 236, 255))
        fm = np.zeros((A.h, A.w), np.uint8)
        cx, cy = w*s*0.5, h*s*0.64
        ell(fm, (cx, cy), w*s*0.09, h*s*0.1); poly(fm, [(cx+w*s*0.06, cy), (cx+w*s*0.16, cy-h*s*0.1), (cx+w*s*0.16, cy+h*s*0.1)])
        A.tint(fm/255.0, (255, 160, 190))
    return _shape(w, h, d, (176, 206, 250), (176, 206, 250), (176, 206, 250), 6, seed, ex)


def window(w, h, sky="day", seed=0):
    sc = {"day": (176, 214, 250), "night": (70, 76, 140), "snow": (206, 222, 246), "rain": (150, 170, 206), "sunset": (255, 186, 160)}[sky]

    def ex(A, s):
        sm = np.zeros((A.h, A.w), np.uint8)
        poly(sm, squircle(w*s/2, h*s/2, w*s*0.39, h*s*0.4, n=6, flare=0))
        A.tint(sm/255.0, sc)
        pm = np.zeros((A.h, A.w), np.uint8)
        cap_line(pm, [(w*s*0.5, h*s*0.1), (w*s*0.5, h*s*0.9)], w*s*0.03)
        cap_line(pm, [(w*s*0.1, h*s*0.5), (w*s*0.9, h*s*0.5)], w*s*0.03)
        A.tint(pm/255.0, (255, 255, 255))
        if sky == "night":
            mm = np.zeros((A.h, A.w), np.uint8); dot(mm, (w*s*0.7, h*s*0.28), w*s*0.08)
            A.tint(mm/255.0, (255, 246, 210))
        if sky == "day":
            mm = np.zeros((A.h, A.w), np.uint8); dot(mm, (w*s*0.72, h*s*0.27), w*s*0.07)
            A.tint(mm/255.0, (255, 226, 120))
        if sky in ("snow", "rain"):
            r = random.Random(seed); mm = np.zeros((A.h, A.w), np.uint8)
            for _ in range(22):
                x, y = r.uniform(0.16, 0.84)*w*s, r.uniform(0.16, 0.84)*h*s
                if sky == "snow": dot(mm, (x, y), w*s*0.016)
                else: cap_line(mm, [(x, y), (x-w*s*0.01, y+h*s*0.05)], w*s*0.008)
            A.tint(mm/255.0, (255, 255, 255) if sky == "snow" else (226, 236, 255))
    return _shape(w, h, lambda m, s: poly(m, squircle(w*s/2, h*s/2, w*s*0.48, h*s*0.48, n=6, flare=0)), (255, 255, 255), (255, 255, 255), (255, 255, 255), 6, seed, ex)


def snowflake(size, seed=0):
    return sparkle(size, (214, 232, 255), seed)


def hat(size, kind="cap", seed=0):
    """nightcap (blue, striped) or santa (red, white trim). drawn upright, tip to the right."""
    w, h = int(size*1.25), int(size*1.1)
    col = (186, 206, 250) if kind == "cap" else (236, 92, 104)

    def d(m, s):
        pts = [tuple(p) for p in bez((w*s*0.08, h*s*0.86), (w*s*0.3, h*s*0.05), (w*s*0.86, h*s*0.42), 30)]+[(w*s*0.95, h*s*0.6), (w*s*0.92, h*s*0.86)]
        poly(m, pts)
        dot(m, (w*s*0.86, h*s*0.42), w*s*0.11)
        poly(m, squircle(w*s*0.5, h*s*0.86, w*s*0.47, h*s*0.11, n=3, flare=0))

    def ex(A, s):
        sm = np.zeros((A.h, A.w), np.uint8)
        poly(sm, squircle(w*s*0.5, h*s*0.86, w*s*0.47, h*s*0.11, n=3, flare=0))
        dot(sm, (w*s*0.86, h*s*0.42), w*s*0.11)
        A.tint(sm/255.0, (255, 255, 255))
        if kind == "cap":
            st = np.zeros((A.h, A.w), np.uint8)
            for k in (0.38, 0.58):
                cap_line(st, [(w*s*0.18, h*s*k+h*s*0.12), (w*s*0.7, h*s*k-h*s*0.05)], h*s*0.035)
            A.tint(st/255.0*0.7, (150, 176, 240))
    return _shape(w, h, d, col, col, col, 5, seed, ex)


def lit_phone():
    return rect_prop(140, 240, (60, 56, 76), 2, screen=(255, 214, 230))
