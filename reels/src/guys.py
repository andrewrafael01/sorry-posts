"""'___ guys, but you know exactly who i mean' format: blocky characters, caption, bubbles, props."""
from engine import *
from chars import *

def bubble_layer(text, size=42, maxw=520):
    key = ("bub", text, size)
    if key in _cache: return _cache[key]
    tl = text_layer(text, size, "bold", rgb("1a1a1a"), maxw=maxw, align="center", pad=0)
    pw, ph = 34, 24
    w, h = tl.width + pw * 2, tl.height + ph * 2
    L = Image.new("RGBA", (w, h + 36), (0, 0, 0, 0)); d = ImageDraw.Draw(L)
    d.rounded_rectangle([0, 0, w, h], 34, fill=WHITE, outline=rgb("2a2a2a"), width=4)
    d.polygon([(w / 2 - 22, h - 2), (w / 2 + 22, h - 2), (w / 2, h + 34)], fill=WHITE)
    d.line([(w / 2 - 22, h - 1), (w / 2, h + 33), (w / 2 + 22, h - 1)], fill=rgb("2a2a2a"), width=4)
    L.paste(tl, (pw, ph), tl)
    _cache[key] = L
    return L
_cache = {}

def card_layer(title, sub=None, size=76):
    key = ("card", title, sub, size)
    if key in _cache: return _cache[key]
    a = text_layer(title, size, "black", rgb("111111"), maxw=720, pad=0)
    b = text_layer(sub, 34, "med", rgb("6b7280"), maxw=720, pad=0) if sub else None
    w = max(a.width, b.width if b else 0) + 90; h = a.height + (b.height + 14 if b else 0) + 70
    L = Image.new("RGBA", (w + 24, h + 24), (0, 0, 0, 0)); d = ImageDraw.Draw(L)
    d.rounded_rectangle([12, 20, w + 12, h + 20], 40, fill=(0, 0, 0, 70))
    d.rounded_rectangle([12, 12, w + 12, h + 12], 40, fill=WHITE, outline=rgb("2a2a2a"), width=4)
    L.paste(a, (12 + (w - a.width) // 2, 12 + 35), a)
    if b: L.paste(b, (12 + (w - b.width) // 2, 12 + 35 + a.height + 14), b)
    _cache[key] = L
    return L

def caption(img, t, title, sub, hl, hook=False):
    k = out_back(t / .28)
    if hook:
        L = text_layer(title, 88, "black", WHITE, stroke=9, maxw=900, align="left", hl=hl, spacing=1.12)
        paste(img, L, 40 + L.width / 2, 330, scale=.5 + .5 * k, alpha=clamp(t / .1))
        return
    T = text_layer(title, 64, "black", YELLOW, stroke=8, maxw=980)
    paste(img, T, W / 2, 285, scale=.55 + .45 * k, alpha=clamp(t / .08))
    if sub:
        S = text_layer(sub, 46, "xbold", WHITE, stroke=7, maxw=900, hl=hl)
        paste(img, S, W / 2, 285 + T.height / 2 + S.height / 2 - 6, scale=.7 + .3 * out_back((t - .08) / .25), alpha=clamp((t - .06) / .1))

def build(reel):
    cast, beats = reel["cast"], reel["beats"]
    starts, tt = [], 0.0
    for b in beats: starts.append(tt); tt += b["dur"]
    dur = tt
    events = []
    for b, s0 in zip(beats, starts):
        events.append((s0, "whoosh", .55))
        for c in b.get("cast", []):
            if c.get("say"): events.append((s0 + c.get("say_at", .55), "pop", .8))
        if b.get("pop"): events.append((s0 + b["pop"].get("at", 1.0), b["pop"].get("sfx", "pop"), 1.0))
        if b.get("card"): events.append((s0 + b["card"].get("at", 1.0), b["card"].get("sfx", "pop"), .9))
        for o, n, *g in b.get("sfx", []): events.append((s0 + o, n, *(g or [1.0])))
        for p in b.get("props", []):
            if p.get("sfx"): events.append((s0 + p.get("at", .2), p["sfx"], .9))

    def frame(t):
        i = max(j for j, s in enumerate(starts) if s <= min(t, dur - 1e-3))
        b, lt = beats[i], t - starts[i]
        img = background(b.get("bg", "plain")).copy()
        # props behind characters
        for p in b.get("props", []):
            if p.get("front"): continue
            draw_prop(img, p, lt)
        for ci, c in enumerate(b.get("cast", [])):
            spec = cast[c["c"]] if isinstance(c["c"], str) else c["c"]
            x = c["x"] * W; yoff = c.get("y", 0)
            pose = c.get("pose", "idle"); enter = c.get("enter")
            if enter:
                dd = c.get("enter_dur", .55); p = out_cubic(lt / dd)
                x0 = -250 if enter == "left" else W + 250
                if lt < dd: pose = "walk"; x = lerp(x0, x, p)
            if c.get("exit") and lt > b["dur"] - .5:
                pose = "walk"; x = lerp(x, (-300 if c["exit"] == "left" else W + 300), in_cubic((lt - (b["dur"] - .5)) / .5))
            jump = 0
            if c.get("hop") is not None and lt > c["hop"]:
                u = (lt - c["hop"]) / .45
                if u < 1: jump = math.sin(u * math.pi) * 70
            place_char(img, spec, x, GROUND + yoff, t, pose=pose, expr=c.get("expr", "smile"), s=c.get("s", 2.2),
                       flip=c.get("flip", False), jump=jump, talk=bool(c.get("say")) and lt > c.get("say_at", .55), seed=ci * 1.7)
        for p in b.get("props", []):
            if p.get("front"): draw_prop(img, p, lt)
        for c in b.get("cast", []):
            if c.get("say"):
                u = lt - c.get("say_at", .55)
                if u >= 0:
                    L = bubble_layer(c["say"], c.get("say_size", 42))
                    s_ = c.get("s", 2.2)
                    cx = c["x"] * W + c.get("bx", 0)
                    tip_y = GROUND + c.get("y", 0) - 330 * s_ - 50 + c.get("by", 0)
                    sc = out_back(u / .22)
                    paste(img, L, clamp(cx, L.width * .5 + 20, W - L.width * .5 - 20), tip_y - L.height / 2, scale=sc)
        if b.get("pop"):
            p = b["pop"]; u = lt - p.get("at", 1.0)
            if u >= 0:
                L = text_layer(p["text"], p.get("size", 130), "black", p.get("color", YELLOW), stroke=p.get("stroke", 10), maxw=980)
                sc = out_back(u / .3)
                paste(img, L, p.get("x", .5) * W, p.get("y", .5) * H + math.sin(u * 7) * 5, scale=sc, rot=p.get("rot", -4))
        if b.get("card"):
            c = b["card"]; u = lt - c.get("at", 1.0)
            if u >= 0:
                L = card_layer(c["title"], c.get("sub"), c.get("size", 76))
                paste(img, L, c.get("x", .5) * W, c.get("y", .5) * H, scale=out_back(u / .3))
        caption(img, lt, b.get("title", ""), b.get("sub"), b.get("hl"), hook=b.get("hook", False))
        return img
    return frame, dur, events

def draw_prop(img, p, lt):
    at = p.get("at", 0.0)
    if lt < at: return
    u = lt - at
    sc = out_back(u / .3) if p.get("pop", True) else 1.0
    x, y = p["x"] * W, p["y"] * H
    anim = p.get("anim")
    if anim == "bounce": y -= abs(math.sin(u * 6)) * 36
    elif anim == "shake": x += math.sin(u * 40) * 7
    elif anim == "float": y += math.sin(u * 3) * 14
    elif anim == "slide": x = lerp(p.get("from", -.3) * W, x, out_cubic(u / .6))
    elif anim == "fall": y = lerp(p.get("from", -.1) * H, y, out_cubic(u / .5)); 
    elif anim == "spin": pass
    e = emoji_img(p["e"], p.get("size", 220) * 1.0)
    if sc != 1.0: e = e.resize((max(1, int(e.width * sc)), max(1, int(e.height * sc))), Image.BILINEAR)
    if anim == "spin": e = e.rotate(u * 360 % 360, expand=True, resample=Image.BILINEAR)
    if p.get("rot"): e = e.rotate(p["rot"], expand=True, resample=Image.BILINEAR)
    if p.get("flip"): e = e.transpose(Image.FLIP_LEFT_RIGHT)
    img.paste(e, (int(x - e.width / 2), int(y - e.height / 2)), e)
