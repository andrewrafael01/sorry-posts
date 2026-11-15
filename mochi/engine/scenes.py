"""Shared scene vocabulary for Mochi & Toast carousels (static) and reels (animated).
spec string: "<scene>[|fx]"
  m:MOOD / t:MOOD            solo sit          (m:MOOD:loaf / :stand for pose)
  mt:M1,M2                   duo (mochi left, toast right)
  hug:M1,M2                  hug
  mh:PROP:MOOD / th:PROP:MOOD   hold a prop
  give:WHO:PROP:M_HOLDER:M_OTHER   holder holds prop, other sits beside
  ms / ts / ss               sleep on blanket (mochi / toast / both)
  mp:MOOD / tp:MOOD          cat with phone
  mb:MOOD:TEXT / tb:...      cat with speech bubble
fx: hearts sparkles snow rain
"""
import random
from soft import *
import carousels as C

WHO = {"m": "mochi", "t": "toast"}
SEEDS = {"mochi": 1, "toast": 2}


def prop(name, k=1.0):
    s = lambda v: int(v*k)
    return {
        "heart": lambda: heart(s(110), PINK, seed=3),
        "cookie": lambda: cookie(s(110)),
        "mug": lambda: mug(s(120)),
        "flower": lambda: flower(s(110)),
        "flowery": lambda: flower(s(110), (255, 236, 150)),
        "gift": lambda: rect_prop(s(150), s(130), (255, 206, 220), 5, stripes=(255, 160, 190)),
        "letter": lambda: rect_prop(s(160), s(112), (255, 250, 240), 6, screen=(255, 226, 234)),
        "star": lambda: sparkle(s(110), (255, 214, 90), 2),
    }[name]()


def parse(spec):
    sc, _, fx = spec.partition("|")
    return sc.split(":"), fx


def is_sleep(spec):
    return parse(spec)[0][0] in ("ms", "ts", "ss")


def draw(cv, spec, Y, u=165, zz=True, blink=False):
    p, fx = parse(spec)
    k = u/160; kind = p[0]
    B = (lambda md: "happy" if blink and md in ("dot", "stare", "sparkle", "shock") else md)
    if kind in ("m", "t"):
        who = WHO[kind]; pose = p[2] if len(p) > 2 else "sit"
        put_cat(cv, 540, Y, who, pose, B(p[1]), u, seed=SEEDS[who], flip=(who == "toast"))
    elif kind == "mt":
        m1, m2 = p[1].split(",")
        C.duo(cv, Y, u, (B(m1), B(m2)), int(140*k))
    elif kind == "hug":
        m1, m2 = p[1].split(",")
        C.hug(cv, Y, u, (m1, m2))
    elif kind in ("mh", "th"):
        who = WHO[kind[0]]
        C.hold(cv, who, prop(p[1], k), 540, Y, u, B(p[2]), SEEDS[who], dy=-30*k, ps=int(44*k), flip=(who == "toast"))
    elif kind == "give":
        who = WHO[p[1]]; other = "toast" if who == "mochi" else "mochi"
        hx, ox = (540+150*k, 540-150*k) if who == "toast" else (540-150*k, 540+150*k)
        put_cat(cv, ox, Y, other, "sit", B(p[4]), u*0.95, seed=SEEDS[other], flip=(other == "toast"))
        C.hold(cv, who, prop(p[2], k*0.9), hx, Y, u*0.95, B(p[3]), SEEDS[who], dy=-30*k, ps=int(42*k), flip=(who == "toast"))
    elif kind in ("ms", "ts"):
        who = WHO[kind[0]]
        C.blanket(cv, 520, Y+70*k, int(600*k), *((( 255, 222, 230), (255, 200, 214)) if who == "mochi" else ((206, 226, 255), (176, 204, 248))))
        put_cat(cv, 540, Y-40*k, who, "loaf", "sleep", u*1.05, seed=SEEDS[who], flip=(who == "toast"))
        if zz: C.zzz(cv, 540+260*k, Y-300*k, s=int(60*k))
    elif kind == "ss":
        C.blanket(cv, 540, Y+70*k, int(720*k), (232, 222, 255), (214, 202, 250))
        put_cat(cv, 540+120*k, Y-40*k, "toast", "loaf", "sleep", u*0.9, seed=2, flip=True)
        put_cat(cv, 540-120*k, Y-34*k, "mochi", "loaf", "sleep", u*0.85, seed=1)
        if zz: C.zzz(cv, 540+300*k, Y-280*k, s=int(56*k))
    elif kind in ("mp", "tp"):
        who = WHO[kind[0]]
        put_cat(cv, 480, Y, who, "sit", B(p[1]), u, seed=SEEDS[who])
        C.phone(cv, 480+230*k, Y-10*k)
    elif kind in ("mb", "tb"):
        who = WHO[kind[0]]
        put_cat(cv, 400, Y, who, "sit", B(p[1]), u*0.92, seed=SEEDS[who])
        C.say(cv, p[2], 700, Y-330*k, int(400*k), int(250*k), "bl", int(50*k))
    else:
        raise ValueError(spec)
    return fx


def static_fx(cv, fx, Y, u=165, seed=0):
    k = u/160; r = random.Random(seed)
    if fx == "hearts":
        C.hearts(cv, [(540-210*k, Y-260*k, int(40*k), 15), (540+210*k, Y-280*k, int(34*k), -15), (540, Y-360*k, int(46*k))])
    elif fx == "sparkles":
        C.sparks(cv, [(540-250*k, Y-250*k, int(40*k)), (540+260*k, Y-200*k, int(30*k)), (540+180*k, Y-330*k, int(22*k))])
    elif fx in ("snow", "rain"):
        d = ImageDraw.Draw(cv)
        for _ in range(26):
            x, y = r.uniform(60, 1020), r.uniform(Y-520*k, Y+80*k)
            if fx == "snow":
                rr = r.uniform(6, 12); d.ellipse((x-rr, y-rr, x+rr, y+rr), fill=(196, 214, 244))
            else:
                d.line((x, y, x-6, y+28), fill=(150, 186, 236), width=6)
