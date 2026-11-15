"""Shared scene vocabulary for Mochi & Toast carousels (static) and reels (animated).
spec string: "<scene>[+hat][|fx]"
  m:MOOD[:pose] / t:MOOD[:pose]   solo (pose sit|loaf|stand)
  mt:M1,M2                        duo (mochi left, toast right)
  hug:M1,M2                       hug
  mh:PROP:MOOD / th:PROP:MOOD     hold a prop
  give:WHO:PROP:M_HOLDER:M_OTHER  holder holds prop, other sits beside
  ms / ts / ss                    sleep on blanket (mochi / toast / both)
  mp:MOOD / tp:MOOD               cat with phone      mpl / tpl: phone lit up with a heart
  mb:MOOD:TEXT / tb:...           speech bubble
  mbox:MOOD / tbox:MOOD           cat in a cardboard box
  mdoor:MOOD / tdoor:MOOD         cat waiting by the door
  seat:MOOD                       mochi next to an empty cushion (saved for you)
  tseat:TMOOD:MMOOD               toast sitting on the cushion, mochi beside
  mthink:MOOD:PROP / tthink       thought cloud with a prop inside
  mwin:MOOD:SKY / twin            cat in front of a window (day|night|snow|rain|sunset)
  tbowl:MOOD:empty|full / mbowl   cat next to a food bowl
hats: +cap (nightcap) +santa (santa hat) applied to every visible cat
fx: hearts sparkles snow rain bang (!! marks)
"""
import random
from soft import *
import carousels as C
import props2 as P

WHO = {"m": "mochi", "t": "toast"}
SEEDS = {"mochi": 1, "toast": 2}
INK = (42, 34, 50)


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
        "snow": lambda: P.snowflake(s(110), 4),
        "phone": lambda: P.lit_phone(),
    }[name]()


def parse(spec):
    sc, _, fx = spec.partition("|")
    sc, _, hatk = sc.partition("+")
    return sc.split(":"), fx


def hatkind(spec):
    sc = spec.partition("|")[0]
    return sc.partition("+")[2] or None


def is_sleep(spec):
    return parse(spec)[0][0] in ("ms", "ts", "ss")


def put_hat(cv, f, u, kind, flip=False, loaf=False):
    if not kind or not f: return
    k = u/160
    fx, fy = f["face"]; top = f["topY"]
    sz = 135*k; x = fx+(-1 if flip else 1)*(22*k)
    img = P.hat(int(sz), kind, 3)
    if flip: img = ImageOps.mirror(img)
    put(cv, img, x, top-0.3*sz*1.1+(6*k if loaf else 0), (-10 if not flip else 10))


def cat_at(cv, X, Y, who, mood, u, pose="sit", flip=None, **kw):
    flip = (who == "toast") if flip is None else flip
    return put_cat(cv, X, Y, who, pose, mood, u, seed=SEEDS[who], flip=flip, **kw), flip


def draw(cv, spec, Y, u=165, zz=True, blink=False):
    p, fx = parse(spec)
    hk = hatkind(spec)
    k = u/160; kind = p[0]
    B = (lambda md: "happy" if blink and md in ("dot", "stare", "sparkle", "shock") else md)
    hats = []  # (feat, flip, loaf)
    if kind in ("m", "t"):
        who = WHO[kind]; pose = p[2] if len(p) > 2 else "sit"
        f, fl = cat_at(cv, 540, Y, who, B(p[1]), u, pose); hats.append((f, fl, pose == "loaf"))
    elif kind == "mt":
        m1, m2 = p[1].split(",")
        g = int(140*k)
        f1, _ = cat_at(cv, 540-g, Y, "mochi", B(m1), u)
        f2, _ = cat_at(cv, 540+g, Y+6, "toast", B(m2), u)
        hats += [(f1, False, False), (f2, True, False)]
    elif kind == "hug":
        m1, m2 = p[1].split(",")
        f2 = put_cat(cv, 540+100*k, Y-20*k, "toast", "sit", m2, u, seed=2, flip=True, hatch=True)
        if hk: put_hat(cv, f2, u, hk, True)
        f1 = put_cat(cv, 540-120*k, Y, "mochi", "sit", m1, u, seed=1, hatch=True)
        paw(cv, 540+75*k, Y-60*k, "mochi", int(52*k), 1)
        hats.append((f1, False, False))
    elif kind in ("mh", "th"):
        who = WHO[kind[0]]
        f = C.hold(cv, who, prop(p[1], k), 540, Y, u, B(p[2]), SEEDS[who], dy=-30*k, ps=int(44*k), flip=(who == "toast"))
        hats.append((f, who == "toast", False))
    elif kind == "give":
        who = WHO[p[1]]; other = "toast" if who == "mochi" else "mochi"
        hx, ox = (540+150*k, 540-150*k) if who == "toast" else (540-150*k, 540+150*k)
        fo, flo = cat_at(cv, ox, Y, other, B(p[4]), u*0.95)
        fh = C.hold(cv, who, prop(p[2], k*0.9), hx, Y, u*0.95, B(p[3]), SEEDS[who], dy=-30*k, ps=int(42*k), flip=(who == "toast"))
        hats += [(fo, flo, False), (fh, who == "toast", False)]
    elif kind in ("ms", "ts"):
        who = WHO[kind[0]]
        C.blanket(cv, 520, Y+70*k, int(600*k), *(((255, 222, 230), (255, 200, 214)) if who == "mochi" else ((206, 226, 255), (176, 204, 248))))
        f, fl = cat_at(cv, 540, Y-40*k, who, "sleep", u*1.05, "loaf")
        hats.append((f, fl, True))
        if zz: C.zzz(cv, 540+260*k, Y-300*k, s=int(60*k))
    elif kind == "ss":
        C.blanket(cv, 540, Y+70*k, int(720*k), (232, 222, 255), (214, 202, 250))
        f2, _ = cat_at(cv, 540+120*k, Y-40*k, "toast", "sleep", u*0.9, "loaf")
        if hk: put_hat(cv, f2, u*0.9, hk, True, True)
        f1, _ = cat_at(cv, 540-120*k, Y-34*k, "mochi", "sleep", u*0.85, "loaf")
        hats.append((f1, False, True))
        if zz: C.zzz(cv, 540+300*k, Y-280*k, s=int(56*k))
    elif kind in ("mp", "tp", "mpl", "tpl"):
        who = WHO[kind[0]]
        f, fl = cat_at(cv, 480, Y, who, B(p[1]), u, flip=False); hats.append((f, False, False))
        if kind.endswith("l"):
            put(cv, P.lit_phone(), 480+230*k, Y-10*k, -8)
            put(cv, heart(int(44*k), PINK, seed=7), 480+230*k, Y-14*k)
            C.sparks(cv, [(480+330*k, Y-170*k, int(30*k)), (480+150*k, Y-200*k, int(22*k))])
        else:
            C.phone(cv, 480+230*k, Y-10*k)
    elif kind in ("mb", "tb"):
        who = WHO[kind[0]]
        f, fl = cat_at(cv, 400, Y, who, B(p[1]), u*0.92); hats.append((f, fl, False))
        C.say(cv, p[2], 700, Y-330*k, int(400*k), int(250*k), "bl", int(50*k))
    elif kind in ("mbox", "tbox"):
        who = WHO[kind[0]]
        f, fl = cat_at(cv, 540, Y-50*k, who, B(p[1]), u)
        hats.append((f, fl, False))
        put(cv, P.box_front(int(380*k), int(260*k)), 540, Y+40*k)
    elif kind in ("mdoor", "tdoor"):
        who = WHO[kind[0]]
        put(cv, P.door(int(250*k), int(560*k)), 780, Y-170*k)
        f, fl = cat_at(cv, 400, Y, who, B(p[1]), u, flip=False); hats.append((f, False, False))
    elif kind == "seat":
        put(cv, P.cushion(int(300*k), int(150*k)), 770, Y+20*k)
        text(cv, "yours", Y-150*k, int(44*k), col=PINK, x=770)
        C.sparks(cv, [(660, Y-140*k, int(30*k)), (880, Y-120*k, int(24*k))])
        f, fl = cat_at(cv, 380, Y, "mochi", B(p[1]), u); hats.append((f, fl, False))
    elif kind == "tseat":
        f2, _ = cat_at(cv, 700, Y-40*k, "toast", B(p[1]), u*0.9)
        put(cv, P.cushion(int(340*k), int(150*k)), 700, Y+45*k)
        f1, _ = cat_at(cv, 330, Y, "mochi", B(p[2]), u*0.95)
        hats += [(f2, True, False), (f1, False, False)]
    elif kind in ("mthink", "tthink"):
        who = WHO[kind[0]]
        f, fl = cat_at(cv, 400, Y, who, B(p[1]), u*0.95, flip=False); hats.append((f, False, False))
        C.think(cv, 720, Y-360*k, int(400*k), int(290*k), 2)
        put(cv, prop(p[2], k*0.85), 735, Y-385*k)
    elif kind in ("mwin", "twin"):
        who = WHO[kind[0]]
        put(cv, P.window(int(420*k), int(470*k), p[2] if len(p) > 2 else "day", 5), 540, Y-300*k)
        f, fl = cat_at(cv, 540, Y+20*k, who, B(p[1]), u); hats.append((f, fl, False))
    elif kind in ("tbowl", "mbowl"):
        who = WHO[kind[0]]
        put(cv, P.bowl(int(230*k), (p[2] if len(p) > 2 else "empty") == "full"), 760, Y+20*k)
        f, fl = cat_at(cv, 400, Y, who, B(p[1]), u, flip=False); hats.append((f, False, False))
    else:
        raise ValueError(spec)
    if hk:
        for f, fl, lf in hats: put_hat(cv, f, u, hk, fl, lf)
    if fx == "bang" and hats:
        f = hats[0][0]
        text(cv, "!!", f["topY"]-30*k, int(70*k), col=INK, x=f["face"][0]+150*k, rot=-12)
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
