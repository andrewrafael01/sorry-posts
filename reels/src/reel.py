"""Shot composer: scene / phone / kinetic shots, transitions, camera, grain, audio assembly, lint, render."""
import math, os, re, subprocess, wave, random
import numpy as np
from engine import *
from chars import *
import music, sfx
from phone import UW, UH
from guys import bubble_layer, card_layer, text_layer
from props import prop

# --------------------------------------------------------------- post / camera
from PIL import ImageChops
_rs = np.random.RandomState(1)
_GRAIN_IMG = Image.fromarray(np.clip(128 + _rs.randn(H + 64, W + 64) * 5.5, 0, 255).astype(np.uint8)).convert("RGB")
_yy, _xx = np.mgrid[0:H, 0:W]
_v = 255 - np.clip(((((_xx - W / 2) / (W / 2)) ** 2 + ((_yy - H / 2) / (H / 2)) ** 2) - .35) * 55, 0, 70)
_VIG_IMG = Image.fromarray(_v.astype(np.uint8)).convert("RGB")

def camera(img, zoom=1.0, dx=0.0, dy=0.0, rot=0.0):
    if zoom == 1.0 and not dx and not dy and not rot: return img
    cw, ch = W / zoom, H / zoom
    x0 = (W - cw) / 2 + dx; y0 = (H - ch) / 2 + dy
    x0 = clamp(x0, 0, W - cw); y0 = clamp(y0, 0, H - ch)
    out = img.crop((int(x0), int(y0), int(x0 + cw), int(y0 + ch))).resize((W, H), Image.BILINEAR)
    return out.rotate(rot, resample=Image.BILINEAR) if rot else out

def finish(img, t, grain=True):
    img = ImageChops.multiply(img, _VIG_IMG)
    if grain:
        ox, oy = int((t * 997) % 64), int((t * 577) % 64)
        img = ImageChops.add(img, _GRAIN_IMG.crop((ox, oy, ox + W, oy + H)), 1.0, -128)
    return img

SAFE = .80     # phone UIs and tall screens crop the edges of a 9:16 frame, so the picture is shrunk into a safe zone over a soft backdrop
def safe(img, s=SAFE, dy=-30):
    from PIL import Image as _I
    bg = img.resize((54, 96), _I.BILINEAR).resize((W, H), _I.BICUBIC)
    bg = _I.eval(bg, lambda v: int(v * .55))
    fw, fh = int(W * s), int(H * s)
    bg.paste(img.resize((fw, fh), _I.LANCZOS), ((W - fw) // 2, (H - fh) // 2 + dy))
    return bg

def hand(t, amp=1.0):
    return (math.sin(t * 1.9) * 3.2 + math.sin(t * 4.3 + 1) * 1.6) * amp, (math.cos(t * 1.4) * 3.0 + math.sin(t * 3.7) * 1.4) * amp

def shake_at(lt, events):
    dx = dy = 0.0; zp = 0.0
    for e in events or []:
        t0, amp = e[0], e[1]; dur = e[2] if len(e) > 2 else .35
        u = lt - t0
        if 0 <= u < dur:
            k = (1 - u / dur) ** 2
            dx += math.sin(u * 70) * amp * k; dy += math.cos(u * 83) * amp * k; zp += .035 * k * (amp / 22)
    return dx, dy, zp

# --------------------------------------------------------------- shots
class Shot:
    dur = 3.0; cues = None; music_dip = None; amb = None; cut = "cut"; shake = None
    def render(self, lt): raise NotImplementedError

def _pt(p, W_=W, H_=H): return p[0] * W_, p[1] * H_

def draw_prop(img, p, lt):
    at = p.get("at", 0.0)
    if lt < at: return
    if p.get("until") is not None and lt > p["until"]: return
    u = lt - at
    sc = out_back(u / .28, 1.6) if p.get("pop", True) else 1.0
    x, y = p["x"] * W, p["y"] * H
    an = p.get("anim")
    if an == "bounce": y -= abs(math.sin(u * 6)) * 34
    elif an == "shake": x += math.sin(u * 45) * 8
    elif an == "float": y += math.sin(u * 2.6) * 14
    elif an == "slide": x = lerp(p.get("from", -.3) * W, x, out_cubic(u / p.get("sd", .6)))
    elif an == "slidey": y = lerp(p.get("from", 1.2) * H, y, out_cubic(u / p.get("sd", .6)))
    elif an == "fall": y = lerp(p.get("from", -.1) * H, y, out_cubic(u / .45))
    elif an == "pulse": sc *= 1 + .06 * math.sin(u * 9)
    elif an == "move": x = lerp(p["x"] * W, p["tx"] * W, in_out(u / p.get("md", 1.0))); y = lerp(p["y"] * H, p.get("ty", p["y"]) * H, in_out(u / p.get("md", 1.0)))
    if "e" in p: e = emoji_img(p["e"], p.get("size", 200))
    else:
        kw = dict(p.get("kw", {}))
        if p["n"] == "clock" and "minutes_per_s" in p:   # animated clock
            tot = p.get("start", 0) + u * p["minutes_per_s"]; kw["hour"] = int(tot // 60) % 12; kw["minute"] = int(tot % 60)
        e = prop(p["n"], p.get("size", 300), **kw)
    if sc != 1.0: e = e.resize((max(1, int(e.width * sc)), max(1, int(e.height * sc))), Image.BILINEAR)
    if p.get("rot") or an == "spin" or an == "swing":
        r = p.get("rot", 0) + (u * 360 if an == "spin" else math.sin(u * 4) * 8 if an == "swing" else 0); e = e.rotate(r, expand=True, resample=Image.BILINEAR)
    if p.get("flip"): e = e.transpose(Image.FLIP_LEFT_RIGHT)
    if p.get("shadow") and "n" in p:
        pass
    a = p.get("alpha", 1.0)
    if a < 1: e = e.copy(); e.putalpha(e.getchannel("A").point(lambda v: int(v * a)))
    img.paste(e, (int(x - e.width / 2), int(y - e.height / 2)), e)

def draw_caption(img, lt, cap):
    if not cap: return
    c = cap if isinstance(cap, dict) else dict(text=cap)
    at = c.get("at", 0.0)
    if lt < at: return
    if c.get("until") is not None and lt > c["until"]: return
    u = lt - at; st = c.get("style", "sub")
    k = out_back(u / .22, 1.7)
    hl = c.get("hl")
    if st == "hook":
        L = text_layer(c["text"], c.get("size", 84), "black", WHITE, stroke=9, maxw=960, align=c.get("align", "left"), hl=hl, spacing=1.06)
        paste(img, L, 36 + L.width / 2 if c.get("align", "left") == "left" else W / 2, c.get("y", 330), scale=.6 + .4 * k, alpha=clamp(u / .08))
    elif st == "title":
        T_ = text_layer(c["text"], c.get("size", 76), "black", YELLOW, stroke=9, maxw=1000)
        paste(img, T_, W / 2, c.get("y", 270), scale=.55 + .45 * k, alpha=clamp(u / .08))
        if c.get("sub"):
            S_ = text_layer(c["sub"], 52, "xbold", WHITE, stroke=8, maxw=920, hl=hl)
            paste(img, S_, W / 2, c.get("y", 270) + T_.height / 2 + S_.height / 2 - 4, scale=.7 + .3 * out_back((u - .08) / .25), alpha=clamp((u - .06) / .1))
    else:   # sub: white bold w/ outline, centered
        L = text_layer(c["text"], c.get("size", 62), "black", c.get("color", WHITE), stroke=9, maxw=960, hl=hl, spacing=1.12)
        paste(img, L, W / 2, c.get("y", 300), scale=.65 + .35 * k, alpha=clamp(u / .08))

class SceneShot(Shot):
    def __init__(self, bg="plain", dur=3.0, actors=(), props=(), lines=(), cap=None, hud=None, pop=None, pops=None,
                 card=None, cues=None, shake=None, amb=None, tint=None, push=.04, cut="cut", music_dip=None, cast=None, flash=None, caps=None):
        self.bg, self.dur, self.actors, self.props, self.lines = bg, dur, list(actors), list(props), list(lines)
        self.caps = caps if caps else ([cap] if cap else [])
        self.hud, self.pops = hud, (pops if pops else ([pop] if pop else [])); self.card = card
        self.cues = list(cues or []); self.shake = shake; self.amb, self.tint, self.push, self.cut = amb, tint, push, cut
        self.music_dip, self.flash = music_dip, flash; self.cast = cast or {}
        for ln in self.lines:
            if not (0 <= ln["who"] < len(self.actors)):
                raise ValueError(f"line {ln['text']!r} refers to actor {ln['who']} but the shot has {len(self.actors)} actors")
            self.cues.append((ln["at"], ln.get("sfx", "pop"), .6))
        for p in self.pops: self.cues.append((p.get("at", 1.0), p.get("sfx", "hit"), p.get("sg", .9)))
        if card: self.cues.append((card.get("at", 1.0), card.get("sfx", "pop"), .8))

    def spec(self, a): return a["c"] if isinstance(a["c"], dict) else self.cast[a["c"]]

    def render(self, lt):
        img = background(self.bg).copy()
        for p in self.props:
            if not p.get("front"): draw_prop(img, p, lt)
        for i, a in enumerate(self.actors):
            x = a["x"] * W; pose = a.get("pose", "idle"); yoff = a.get("y", 0)
            at0 = a.get("at", 0.0)
            if lt < at0: continue
            if a.get("until") is not None and lt > a["until"]: continue
            if a.get("enter"):
                dd = a.get("enter_dur", .6); p = out_cubic((lt - at0) / dd); x0 = -260 if a["enter"] == "left" else W + 260
                if lt - at0 < dd: pose = "walk"; x = lerp(x0, x, p)
            if a.get("exit_at") is not None and lt > a["exit_at"]:
                dd = a.get("exit_dur", .6); pose = "walk"; x = lerp(x, -300 if a.get("exit", "left") == "left" else W + 300, in_cubic((lt - a["exit_at"]) / dd))
            if a.get("slide_to") is not None and lt > a.get("slide_at", 0):
                x = lerp(x, a["slide_to"] * W, in_out((lt - a.get("slide_at", 0)) / a.get("slide_dur", .8)))
                if lt - a.get("slide_at", 0) < a.get("slide_dur", .8): pose = a.get("slide_pose", "walk")
            if a.get("pose_at"):
                for tp, pz in a["pose_at"]:
                    if lt >= tp: pose = pz
            expr = a.get("expr", "smile")
            if a.get("expr_at"):
                for te, ez in a["expr_at"]:
                    if lt >= te: expr = ez
            jump = 0; squash = 0
            for hp_ in ([a["hop"]] if isinstance(a.get("hop"), (int, float)) else a.get("hop", [])):
                u = (lt - hp_) / .45
                if 0 <= u < 1: jump = math.sin(u * math.pi) * 90; squash = .06 * (1 - u) if u < .15 else 0
            talking = any(ln["at"] <= lt < ln["at"] + ln.get("dur", 1.5) and ln.get("who") == i for ln in self.lines)
            place_char(img, self.spec(a), x, GROUND + yoff, t=lt + i * .37, pose=pose, expr=expr, s=a.get("s", 2.2), flip=a.get("flip", False), jump=jump,
                       talk=talking, seed=i * 1.7, look=a.get("look", 0.0), squash=squash)
        for p in self.props:
            if p.get("front"): draw_prop(img, p, lt)
        if self.tint: 
            ov = Image.new("RGB", (W, H), self.tint[:3]); img = Image.blend(img, ov, self.tint[3])
        for ln in self.lines:
            u = lt - ln["at"]
            if 0 <= u < ln.get("dur", 1.8):
                a = self.actors[ln["who"]]; s_ = a.get("s", 2.2)
                L = bubble_layer(ln["text"], ln.get("size", 44))
                cx = clamp(a["x"] * W + ln.get("bx", 0), L.width / 2 + 24, W - L.width / 2 - 24)
                tip_y = GROUND + a.get("y", 0) - 335 * s_ - 40 + ln.get("by", 0)
                out = clamp((ln.get("dur", 1.8) - u) / .12)
                paste(img, L, cx, tip_y - L.height / 2, scale=out_back(u / .2, 1.5) * (.9 + .1 * out), alpha=out)
        for p in self.pops:
            u = lt - p.get("at", 1.0)
            if u >= 0 and (p.get("until") is None or lt < p["until"]):
                L = text_layer(p["text"], p.get("size", 140), "black", p.get("color", YELLOW), stroke=p.get("stroke", 11), maxw=1000)
                paste(img, L, p.get("x", .5) * W, p.get("y", .45) * H + math.sin(u * 8) * 4, scale=out_back(u / .26, 2.0), rot=p.get("rot", -4))
        if self.card:
            c = self.card; u = lt - c.get("at", 1.0)
            if u >= 0: paste(img, card_layer(c["title"], c.get("sub"), c.get("size", 80)), c.get("x", .5) * W, c.get("y", .48) * H, scale=out_back(u / .28))
        if self.hud:
            txt = None
            for ta, tx in self.hud:
                if lt >= ta: txt = tx
            if txt:
                L = text_layer(txt, 46, "black", WHITE, maxw=500, pad=0)
                w, h = L.width + 56, L.height + 30; chip = Image.new("RGBA", (w, h), (0, 0, 0, 0)); ImageDraw.Draw(chip).rounded_rectangle([0, 0, w - 1, h - 1], 22, fill=(20, 20, 26, 235))
                chip.paste(L, (28, 15), L); img.paste(chip, (int(W - w - 50), 470), chip)
        for c in self.caps: draw_caption(img, lt, c)
        return img

class PhoneShot(Shot):
    def __init__(self, ui, dur=None, cap=None, bg=(238, 82, 83), zoom=None, hold=1.2, cues=None, shake=None, cut="cut", music_dip=None, caps=None, bg2=None, card_y=480):
        self.ui, self.cap, self.bg, self.zoom, self.shake, self.cut, self.music_dip = ui, cap, bg, zoom or [], shake, cut, music_dip
        self.caps = caps if caps else ([cap] if cap else [])
        last = max([e["at"] for e in getattr(ui, "items", [])] + [0])
        self.dur = dur or (last + hold)
        self.cues = list(ui.cues) + list(cues or []); self.bg2 = bg2 or tuple(int(c * .82) for c in bg); self.card_y = card_y
        self._bgimg = None
        m = Image.new("L", (864, 1350), 0); ImageDraw.Draw(m).rounded_rectangle([0, 0, 863, 1349], 64, fill=255); self.mask = m
    def _backdrop(self):
        if self._bgimg is None:
            im = Image.new("RGB", (W, H), self.bg); d = ImageDraw.Draw(im)
            for y in range(H): d.line([(0, y), (W, y)], fill=tuple(int(lerp(self.bg[i], self.bg2[i], y / H)) for i in range(3)))
            for gx in range(0, W + 120, 120):
                for gy in range(0, H + 120, 120): d.ellipse([gx - 4, gy - 4, gx + 4, gy + 4], fill=tuple(min(255, c + 14) for c in self.bg))
            self._bgimg = im
        return self._bgimg
    def render(self, lt):
        img = self._backdrop().copy()
        ui = self.ui.draw(lt)
        z, fx, fy = 1.0, UW / 2, UH / 2
        for (t0, t1, zz, px, py) in self.zoom:
            if lt >= t0:
                k = in_out((lt - t0) / max(.01, t1 - t0)); z, fx, fy = lerp(z, zz, k), lerp(fx, px, k), lerp(fy, py, k)
        if z != 1.0:
            cw, chh = UW / z, UH / z; x0 = clamp(fx - cw / 2, 0, UW - cw); y0 = clamp(fy - chh / 2, 0, UH - chh)
            ui = ui.crop((int(x0), int(y0), int(x0 + cw), int(y0 + chh)))
        ui = ui.resize((864, 1350), Image.BILINEAR)
        sh = Image.new("RGBA", (900, 1386), (0, 0, 0, 0)); ImageDraw.Draw(sh).rounded_rectangle([18, 28, 882, 1378], 64, fill=(0, 0, 0, 90)); img.paste(sh, (84, self.card_y - 10), sh)
        img.paste(ui, (108, self.card_y), self.mask)
        for c in self.caps: draw_caption(img, lt, c)
        return img

class KineticShot(Shot):
    def __init__(self, items, dur=3.0, bg=(20, 20, 24), bg2=None, cues=None, shake=None, cut="cut", music_dip=None, burst=None, amb=None, fx=None, fx_y=.45, counter=None):
        self.items, self.dur, self.bg, self.shake, self.cut, self.music_dip, self.amb = items, dur, bg, shake, cut, music_dip, amb
        self.fx, self.fx_y, self.counter = fx, fx_y, counter
        self.bg2 = bg2 or bg; self.cues = list(cues or []); self.burst = burst
        for it in items:
            if it.get("sfx"): self.cues.append((it.get("at", 0), it["sfx"], it.get("sg", .9)))
        self._b = None
    def render(self, lt):
        if self._b is None:
            im = Image.new("RGB", (W, H)); d = ImageDraw.Draw(im)
            for y in range(H): d.line([(0, y), (W, y)], fill=tuple(int(lerp(self.bg[i], self.bg2[i], y / H)) for i in range(3)))
            self._b = im
        img = self._b.copy()
        if self.fx:
            ov = Image.new("RGBA", (W, H), (0, 0, 0, 0)); od = ImageDraw.Draw(ov); cx, cy = W / 2, H * self.fx_y
            lite = tuple(min(255, int(c * 1.9 + 30)) for c in self.bg)
            if "rays" in self.fx:
                for i in range(14):
                    a0 = lt * .35 + i * (2 * math.pi / 14); a1 = a0 + .12; R = 2400
                    od.polygon([(cx, cy), (cx + math.cos(a0) * R, cy + math.sin(a0) * R), (cx + math.cos(a1) * R, cy + math.sin(a1) * R)], fill=lite + (34,))
            if "dots" in self.fx:
                r_ = np.random.RandomState(5)
                for i in range(26):
                    x = r_.rand() * W; sp = 60 + r_.rand() * 140; y = (H + 100 - ((lt * sp + r_.rand() * H) % (H + 200))); rad = 14 + r_.rand() * 44
                    od.ellipse([x - rad, y - rad, x + rad, y + rad], fill=lite + (46,))
            if "confetti" in self.fx and lt > self.fx_start if hasattr(self, "fx_start") else "confetti" in self.fx:
                r_ = np.random.RandomState(9)
                for i in range(46):
                    x = r_.rand() * W + math.sin(lt * 3 + i) * 30; y = ((lt * (320 + r_.rand() * 380) + r_.rand() * H) % (H + 100)) - 50; a = lt * 6 + i
                    col = [(255, 212, 0), (255, 90, 120), (90, 200, 255), (130, 255, 160)][i % 4]
                    pts = [(x + math.cos(a + k * 1.57) * 18, y + math.sin(a + k * 1.57) * 9) for k in range(4)]; od.polygon(pts, fill=col + (230,))
            img = img.convert("RGBA"); img.alpha_composite(ov); img = img.convert("RGB")
        for it in self.items:
            u = lt - it.get("at", 0)
            if u < 0 or (it.get("until") is not None and lt > it["until"]): continue
            an = it.get("anim", "pop"); txt = it["text"]
            if it.get("count"):
                a, b, dd = it["count"]; v = lerp(a, b, in_out(u / dd)); txt = it.get("fmt", "{:,.0f}").format(v)
            L = text_layer(txt, it.get("size", 120), it.get("weight", "black"), it.get("color", WHITE), stroke=it.get("stroke", 0), stroke_fill=it.get("stroke_fill", BLACK), maxw=it.get("maxw", 960), hl=it.get("hl"), hl_color=it.get("hl_color", YELLOW), align=it.get("align", "center"), spacing=it.get("spacing", 1.08))
            x, y = it.get("x", .5) * W, it.get("y", .5) * H
            if an == "slam": sc = 1 + 1.4 * (1 - out_cubic(u / .14)); al = clamp(u / .05); paste(img, L, x + math.sin(u * 60) * 6 * (u < .3), y, scale=sc, alpha=al, rot=it.get("rot", 0))
            elif an == "slide": paste(img, L, lerp(-.4 * W, x, out_cubic(u / .4)), y, rot=it.get("rot", 0))
            elif an == "rise": paste(img, L, x, y + 120 * (1 - out_cubic(u / .35)), alpha=clamp(u / .2), rot=it.get("rot", 0))
            elif an == "shake": paste(img, L, x + math.sin(u * 55) * 7, y + math.cos(u * 61) * 5, scale=out_back(u / .2), rot=it.get("rot", 0))
            elif an == "wobble": paste(img, L, x, y, scale=out_back(u / .25) * (1 + .03 * math.sin(u * 8)), rot=it.get("rot", 0) + math.sin(u * 5) * 2.5)
            else: paste(img, L, x, y, scale=out_back(u / .25, 1.8), alpha=clamp(u / .08), rot=it.get("rot", 0))
        if self.counter:
            txt = self.counter; L = text_layer(txt, 40, "bold", (255, 255, 255), pad=0); paste(img, L, W / 2, H * .9, alpha=.55)
        return img

class BarsShot(Shot):
    """Vertical bars that grow one after another. items: (label, value, color, shown_text). The last bar gets the spotlight."""
    def __init__(self, items, dur=6.0, title=None, bg=(14, 16, 28), bg2=(30, 34, 60), line=None, stagger=.7, cues=None, unit=""):
        self.items, self.dur, self.title, self.bg, self.bg2, self.line, self.stagger, self.unit = items, dur, title, bg, bg2, line, stagger, unit
        self.cues = list(cues or []) + [(.4 + i * stagger, "hit" if i == len(items) - 1 else "pop", .8) for i in range(len(items))]
        self._b = None
    def render(self, lt):
        if self._b is None:
            im = Image.new("RGB", (W, H)); d = ImageDraw.Draw(im)
            for y in range(H): d.line([(0, y), (W, y)], fill=tuple(int(lerp(self.bg[i], self.bg2[i], y / H)) for i in range(3)))
            self._b = im
        img = self._b.copy(); d = ImageDraw.Draw(img)
        if self.title:
            L = text_layer(self.title, 74, "black", WHITE, maxw=900); paste(img, L, W / 2, H * .2, scale=out_back(lt / .3), alpha=clamp(lt / .1))
        base, top = int(H * .76), int(H * .32); mx = max(v for _, v, _, _ in self.items); n = len(self.items)
        bw = min(230, int(860 / n) - 24); gap = (880 - bw * n) / max(1, n - 1) if n > 1 else 0; x0 = 100
        d.line([(60, base), (W - 60, base)], fill=(90, 96, 130), width=4)
        if self.line is not None:
            ly = base - (base - top) * self.line[0] / mx
            for xx in range(60, W - 60, 36): d.line([(xx, ly), (xx + 20, ly)], fill=(255, 255, 255), width=4)
            L = text_layer(self.line[1], 36, "bold", (255, 255, 255), maxw=500); paste(img, L, 250, ly - 34, alpha=.9)
        for i, (lab, val, col, shown) in enumerate(self.items):
            u = lt - (.4 + i * self.stagger)
            if u < 0: continue
            g = out_cubic(u / .8); hh = (base - top) * val / mx * g; x = x0 + i * (bw + gap)
            d.rounded_rectangle([x, base - hh, x + bw, base], 16, fill=col)
            if g > .6:
                a = clamp((g - .6) / .4); L = text_layer(shown, 52 if len(shown) < 9 else 40, "black", WHITE, maxw=bw + 60); paste(img, L, x + bw / 2, base - hh - 46, alpha=a)
            L = text_layer(lab, 34, "bold", (210, 216, 240), maxw=bw + 40); paste(img, L, x + bw / 2, base + 62)
        return img

class RankingShot(Shot):
    """Countdown list with horizontal bars. items listed rank 1..N as (label, value, shown_text); they reveal from the bottom up and #1 lands last.
    cols = (bar color, #1 color). source = small credit line."""
    def __init__(self, items, title, source=None, dur=None, bg=(14, 16, 28), bg2=(30, 34, 60), cols=((70, 120, 230), (255, 200, 40)), step=.55, cues=None, crown="#1", say=None):
        self.items, self.title, self.source, self.bg, self.bg2, self.cols, self.step = items, title, source, bg, bg2, cols, step
        n = len(items); self.n = n; self.speech = []
        self.t_of = {}; t = .8
        import voice
        for i in range(n - 1, -1, -1):     # reveal bottom-up; when narrated, each row waits for its sentence so the words land with the bar
            self.t_of[i] = t; gap = step
            if say and voice.enabled():
                sec = voice.seconds(say[i], voice.NARRATOR if voice._engine() == "kokoro" else None)
                if sec: self.speech.append((t, say[i], voice.NARRATOR if voice._engine() == "kokoro" else None)); gap = max(step, sec + .25)
            t += gap
        self.dur = max(dur or 0, t + 2.6) if self.speech else (dur or (.9 + n * step + 3.0))
        self.cues = list(cues or []) + [(self.t_of[i], "pop", .6) for i in range(1, n)] + [(self.t_of[0], "hit", .95), (self.t_of[0] + .1, "sparkle", .6)]
        self._b = None
    def render(self, lt):
        if self._b is None:
            im = Image.new("RGB", (W, H)); d = ImageDraw.Draw(im)
            for y in range(H): d.line([(0, y), (W, y)], fill=tuple(int(lerp(self.bg[i], self.bg2[i], y / H)) for i in range(3)))
            self._b = im
        img = self._b.copy(); d = ImageDraw.Draw(img)
        L = text_layer(self.title, 62, "black", WHITE, maxw=880); paste(img, L, W / 2, 250, scale=out_back(lt / .3), alpha=clamp(lt / .1))
        n = self.n; mx = max(v for _, v, _ in self.items); y0 = 430; rh = min(124, int(1240 / n)); x0 = 70; bmax = 560
        for i, (lab, val, shown) in enumerate(self.items):
            u = lt - self.t_of[i]
            if u < 0: continue
            g = out_cubic(u / .45); y = y0 + i * rh; top = i == 0
            col = self.cols[1] if top else self.cols[0]; bw = max(40, int(bmax * val / mx * g))
            if top: d.rounded_rectangle([x0 - 14, y - 6, W - 60, y + rh - 14], 22, outline=self.cols[1], width=5)
            rk = text_layer(f"{i + 1}", 46, "black", self.cols[1] if top else (150, 160, 200), maxw=80); paste(img, rk, x0 + 20, y + rh / 2 - 8, alpha=g)
            d.rounded_rectangle([x0 + 70, y + 12, x0 + 70 + bw, y + rh - 26], 14, fill=col)
            nm = text_layer(lab, 38, "xbold", (10, 12, 24) if top else WHITE, maxw=bmax - 20, align="left", pad=0); 
            if nm.width < bw - 30: img.paste(nm, (x0 + 90, int(y + rh / 2 - 8 - nm.height / 2)), nm)
            else:
                paste(img, nm, x0 + 70 + bw + 20 + nm.width / 2, y + rh / 2 - 8, alpha=g)
            vt = text_layer(shown, 40, "black", WHITE, maxw=300)
            vx = x0 + 70 + bw + 16 + vt.width / 2 if nm.width < bw - 30 else min(W - 60 - vt.width / 2, x0 + 70 + bw + 40 + nm.width + vt.width / 2)
            if nm.width >= bw - 30: vx = min(W - 80 - vt.width / 2, x0 + 70 + bw + 20 + nm.width + 20 + vt.width / 2)
            paste(img, vt, vx, y + rh / 2 - 8, alpha=g)
        if self.source:
            Ls = text_layer(self.source, 30, "bold", (170, 180, 215), maxw=900); paste(img, Ls, W / 2, H * .9, alpha=.8)
        return img

class VersusShot(Shot):
    """Head to head. rows: (label, left_text, right_text, 'l'|'r'|None for the winner). Rows pop in one by one; the tally shows at the end."""
    def __init__(self, left, right, rows, title=None, dur=None, step=1.0, bg=(18, 14, 34), bg2=(40, 24, 70), cols=((90, 170, 255), (255, 110, 130)), source=None, say=None):
        self.left, self.right, self.rows, self.title, self.bg, self.bg2, self.cols, self.source = left, right, rows, title, bg, bg2, cols, source
        import voice
        self.speech = []; self.t_row = []; t = 1.0; vid = voice.NARRATOR if voice._engine() == "kokoro" else None
        for i in range(len(rows)):
            self.t_row.append(t); gap = step
            if say and voice.enabled():
                sec = voice.seconds(say[i], vid)
                if sec: self.speech.append((t, say[i], vid)); gap = max(step, sec + .3)
            t += gap
        self.t_end = t; self.dur = max(dur or 0, t + 2.6) if self.speech else (dur or (1.0 + len(rows) * step + 2.6)); self.step = step
        self.cues = [(self.t_row[i], "pop", .7) for i in range(len(rows))] + [(self.t_end, "hit", .9)]
        self._b = None
    def render(self, lt):
        if self._b is None:
            im = Image.new("RGB", (W, H)); d = ImageDraw.Draw(im)
            for y in range(H): d.line([(0, y), (W, y)], fill=tuple(int(lerp(self.bg[i], self.bg2[i], y / H)) for i in range(3)))
            self._b = im
        img = self._b.copy(); d = ImageDraw.Draw(img)
        if self.title:
            L = text_layer(self.title, 54, "black", WHITE, maxw=880); paste(img, L, W / 2, 230, alpha=clamp(lt / .2))
        a = out_back(lt / .35)
        for side, nm, cx in (("l", self.left, W * .27), ("r", self.right, W * .73)):
            col = self.cols[0] if side == "l" else self.cols[1]
            L = text_layer(nm, 64, "black", col, maxw=420); paste(img, L, cx, 380, scale=a)
        d.line([(W / 2, 330), (W / 2, 1360)], fill=(80, 70, 120), width=4)
        tl = tr = 0
        for i, (lab, lt_, rt_, win) in enumerate(self.rows):
            u = lt - self.t_row[i]
            if u < 0: continue
            y = 520 + i * 200; al = clamp(u / .2); s = out_back(u / .3)
            Ll = text_layer(lab, 34, "bold", (190, 180, 230), maxw=700); paste(img, Ll, W / 2, y - 40, alpha=al)
            for side, txt, cx in (("l", lt_, W * .27), ("r", rt_, W * .73)):
                won = win == side; col = (120, 255, 160) if won else ((170, 170, 190) if win else WHITE)
                T = text_layer(txt, 62 if len(txt) < 9 else 46, "black", col, maxw=420); paste(img, T, cx, y + 40, scale=s * (1.08 if won else 1), alpha=al)
                if won: d.rounded_rectangle([cx - 200, y + 4, cx + 200, y + 84], 24, outline=(120, 255, 160), width=4)
            if win == "l": tl += 1
            elif win == "r": tr += 1
        end = self.t_end
        if lt > end:
            u = lt - end; T = text_layer(f"{tl}  -  {tr}", 120, "black", (255, 212, 0), maxw=700); paste(img, T, W / 2, 1560, scale=out_back(u / .35), alpha=clamp(u / .1))
        if self.source:
            Ls = text_layer(self.source, 30, "bold", (170, 160, 210), maxw=900); paste(img, Ls, W / 2, H * .9, alpha=.8)
        return img

# --------------------------------------------------------------- audio assembly
def ambience(kind, dur, seed=0):
    n = int(dur * SR); r = np.random.RandomState(abs(hash(kind)) % 9999 + seed)
    x = r.randn(n)
    if kind == "room": y = music.lp(x, 280) * .05
    elif kind == "crowd":
        am = 1 + .5 * np.sin(np.linspace(0, dur * 2.3, n)) + .3 * np.sin(np.linspace(0, dur * 5.7, n) + 1); y = music.bp(x, 220, 1800) * am * .035
    elif kind == "street": y = (music.lp(x, 450) * .06 + music.bp(r.randn(n), 800, 3000) * (np.sin(np.linspace(0, dur * 1.7, n)) > .6) * .012)
    elif kind == "car": y = music.lp(x, 220) * .08
    elif kind == "night": y = music.lp(x, 300) * .03 + (np.sin(2 * np.pi * 4300 * np.arange(n) / SR) * (np.sin(np.arange(n) / SR * 2 * np.pi * 7) > .85) * .012)
    elif kind == "gym": y = music.bp(x, 150, 1200) * .03 * (1 + .6 * (np.sin(np.linspace(0, dur * 3.1, n)) > .8))
    else: y = x * 0
    return y

def _autovoice_scene(s, nar):
    """Sketch beats with no voice yet: the narrator reads the caption, then each character says its own line in the character's voice, one after the other (lines are pushed back so nothing overlaps; the beat grows to fit)."""
    import voice
    if not isinstance(s, SceneShot) or getattr(s, "speech", None) or any(ln.get("voice") for ln in s.lines): return
    cur = .15; spoke = False
    for c in s.caps:
        t = " ".join(x for x in (c.get("text"), c.get("sub")) if x).lower()
        L = voice.seconds(t, nar)
        if L: s.speech = [(cur, t, nar)]; cur += L + .12; spoke = True; break
    for ln in sorted(s.lines, key=lambda l: l["at"]):
        key = s.actors[ln["who"]].get("c"); key = key if isinstance(key, str) else "kid"
        vid = voice.voice_for(key); L = voice.seconds(ln["text"], vid)
        if not L: continue
        old = ln["at"]; ln["at"] = max(old, cur); ln["voice"] = vid; ln["dur"] = max(ln.get("dur", 1.5), L + .15)
        s.cues = [(ln["at"] if (c_[0] == old and c_[1] == ln.get("sfx", "pop")) else c_[0], c_[1], c_[2]) for c_ in s.cues]
        cur = ln["at"] + L + .15; spoke = True
    if spoke: s.dur = max(s.dur, cur + .45)


class Reel:
    def __init__(self, name, shots, style="lofi", seed=0, loop=True, gain_music=.62, bpm=None, caption="", story="", title="", vo=None, snap=True, safe_zone=True, grid=0):
        self.snap, self.safe_zone, self.grid = snap, safe_zone, grid
        import voice
        self.vo = vo or voice.SCRIPTS.get(name, [])   # [(shot_index, text)] narration read at the start of that shot when a voice engine is on (see voice.py)
        self.vo = [(i, t) for i, t in self.vo if not getattr(shots[i], 'segs', None)]
        if voice.enabled() and not self.vo and voice._engine() == "kokoro":
            for _s in shots: _autovoice_scene(_s, voice.NARRATOR)
        for idx, text in self.vo:   # fit the picture to the speech so the words land on the right slide
            L = voice.seconds(text)
            if L: shots[idx].dur = max(L + getattr(shots[idx], 'pad', .35), getattr(shots[idx], 'min_dur', 0)) if getattr(shots[idx], 'fit_speech', False) else max(shots[idx].dur, L + .6)
        for s in shots:
            for sp in getattr(s, "speech", []) or []:
                L = voice.seconds(sp[1], sp[2])
                if L: s.dur = max(s.dur, sp[0] + L + (getattr(s, 'pad', .35) if getattr(s, 'fit_speech', False) else .5)) if getattr(s, 'fit_speech', False) is False or True else s.dur
            for ln in getattr(s, "lines", []) or []:
                if ln.get("voice"):
                    L = voice.seconds(ln["text"], ln["voice"])
                    if L: ln["dur"] = max(ln.get("dur", 1.0), L + .1)
        self.name, self.shots, self.style, self.seed, self.loop, self.gm = name, shots, style, seed, loop, gain_music
        self.caption, self.story, self.title = caption, story, title
        bpm_, self.bl = music.beat_len(style, seed)
        if bpm: bpm_, self.bl = bpm, 60.0 / bpm
        self.bpm = bpm_
        self.starts = []; t = 0.0
        for s in shots:
            if self.grid and not self.snap:
                q = self.bl / self.grid; s.dur = math.ceil((t + s.dur) / q - 1e-6) * q - t
            if self.snap:
                nb = max(2, round(s.dur / self.bl))
                if nb * self.bl < s.dur - .25: nb += 1
                s.dur = nb * self.bl
            self.starts.append(t); t += s.dur
        self.dur = t
        self._prev = None

    def frame(self, t):
        t = min(t, self.dur - 1e-3)
        i = max(j for j, s in enumerate(self.starts) if s <= t)
        s, lt = self.shots[i], t - self.starts[i]
        img = s.render(lt)
        # camera
        z = 1.012 + (getattr(s, "push", 0) * (lt / s.dur) if isinstance(s, SceneShot) else 0)
        hx, hy = hand(t, .5 if isinstance(s, PhoneShot) else 1.0)
        sx, sy, zp = shake_at(lt, s.shake)
        img = camera(img, z + zp, hx + sx, hy + sy)
        # transitions
        cut = s.cut
        if cut != "cut" and lt < .3:
            if cut == "flash":
                a = max(0, 1 - lt / .14) * .85; img = Image.blend(img, Image.new("RGB", (W, H), WHITE), a) if a > 0 else img
            elif cut == "dip":
                a = max(0, 1 - lt / .16); img = Image.blend(img, Image.new("RGB", (W, H), BLACK), a) if a > 0 else img
            elif cut == "zoom" and lt < .22:
                k = 1 - lt / .22; img = camera(img, 1 + .35 * k * k)
            elif cut == "whip" and lt < .24 and i > 0:
                k = out_cubic(lt / .24); prev = self.shots[i - 1].render(self.shots[i - 1].dur - .04)
                off = int(W * k); canvas = Image.new("RGB", (W, H)); canvas.paste(prev, (-off, 0)); canvas.paste(img, (W - off, 0))
                from PIL import ImageFilter
                img = canvas.filter(ImageFilter.BoxBlur(int(14 * (1 - abs(2 * k - 1)))) ) if 0 < k < 1 else canvas
            elif cut == "glitch" and lt < .18:
                r, g, b = img.split(); o = int(18 * (1 - lt / .18))
                img = Image.merge("RGB", (ImageChops_offset(r, o), g, ImageChops_offset(b, -o)))
        return finish(img, t)

    def events(self):
        ev = []
        for s, t0 in zip(self.shots, self.starts):
            for c in s.cues or []: ev.append((t0 + c[0], c[1], c[2] if len(c) > 2 else 1.0))
            if s.cut == "whip": ev.append((t0, "whoosh", .8))
            if s.cut == "flash": ev.append((t0, "hit", .7))
            if s.cut == "glitch": ev.append((t0, "tick", 1.2))
        return ev

    def audio(self):
        mus, _, _ = music.render_music(self.dur, self.style, self.seed, bpm=self.bpm)
        n = len(mus)
        gain = np.ones(n)
        for s, t0 in zip(self.shots, self.starts):
            if s.music_dip:
                a, b, g = s.music_dip; i0, i1 = int((t0 + a) * SR), int((t0 + b) * SR); r = int(.05 * SR)
                gain[max(0, i0 - r):i0] = np.minimum(gain[max(0, i0 - r):i0], np.linspace(1, g, len(gain[max(0, i0 - r):i0])))
                gain[i0:i1] = np.minimum(gain[i0:i1], g)
                gain[i1:i1 + int(.12 * SR)] = np.minimum(gain[i1:i1 + int(.12 * SR)], np.linspace(g, 1, len(gain[i1:i1 + int(.12 * SR)])))
        clips = []
        if self.vo:
            import voice
            for idx, text in self.vo:
                x = voice.speak(text, None)
                if x is not None: clips.append((int((self.starts[idx] + .12) * SR), x))
        if self.vo is not None or True:
            import voice as _vc
            for s, t0 in zip(self.shots, self.starts):
                for at, text, vid in getattr(s, "speech", []) or []:
                    if _vc.speakable(text):
                        x = _vc.speak(text, vid)
                        if x is not None: clips.append((int((t0 + at) * SR), x))
                for ln in getattr(s, "lines", []) or []:
                    if ln.get("voice") and _vc.speakable(ln["text"]):
                        x = _vc.speak(ln["text"], ln["voice"])
                        if x is not None: clips.append((int((t0 + ln["at"]) * SR), x))
        for i0, x in clips:
            i1 = min(n, i0 + len(x)); gain[max(0, i0 - 2000):i1 + 4000] = np.minimum(gain[max(0, i0 - 2000):i1 + 4000], .38)
        out = mus * gain[:, None] * self.gm
        for i0, x in clips:
            y = x[:max(0, n - i0)]; out[i0:i0 + len(y)] += (y * 1.25)[:, None]
        for s, t0 in zip(self.shots, self.starts):
            if s.amb:
                y = ambience(s.amb, s.dur); i = int(t0 * SR); y = y[:n - i]; out[i:i + len(y)] += y[:, None]
        for t, name, g in self.events():
            x = sfx.get(name); i = int(t * SR)
            if i < 0 or i >= n: continue
            x = x[:n - i]; out[i:i + len(x)] += (x * g * .85)[:, None]
        if not self.loop:
            f = int(.5 * SR); out[-f:] *= np.linspace(1, 0, f)[:, None]
        else:
            f = int(.06 * SR); out[-f:] *= np.linspace(1, 0, f)[:, None]
        out = np.tanh(out * 1.5)
        return out / max(1e-6, np.abs(out).max()) * .76

    def render(self, out_dir, crf=27, preview=False):
        path = os.path.join(out_dir, self.name + ".mp4")
        wav = path + ".wav"; a = (self.audio() * 32767).astype(np.int16)
        with wave.open(wav, "wb") as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(a.tobytes())
        cmd = ["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-", "-i", wav,
               "-c:v", "libx264", "-preset", "veryfast", "-crf", str(crf), "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "160k", "-shortest", "-movflags", "+faststart", path]
        p = subprocess.Popen(cmd, stdin=subprocess.PIPE)
        for i in range(int(self.dur * FPS)): p.stdin.write((safe(self.frame(i / FPS)) if self.safe_zone else self.frame(i / FPS)).tobytes())
        p.stdin.close(); p.wait(); os.remove(wav)
        return path

def ImageChops_offset(ch, o):
    from PIL import ImageChops
    return ImageChops.offset(ch, o, 0)

# --------------------------------------------------------------- AI-tell linter
BAN = r"\b(delve|tapestry|realm|robust|seamless|elevate|foster|underscore|showcase|testament|vibrant|crucial|pivotal|leverage|holistic|multifaceted|moreover|furthermore|game[- ]changer|unleash|journey)\b"
def lint(texts):
    """texts: list of strings that appear on screen. Returns a list of warnings."""
    w = []
    for t in texts:
        if re.search(BAN, t, re.I): w.append(f"banned word: {t!r}")
        if "—" in t or " – " in t: w.append(f"em dash: {t!r}")
        if re.search(r"\bnot (just|only)\b.*\bbut\b", t, re.I) or re.search(r"it'?s not .{1,40}, it'?s", t, re.I): w.append(f"'not X, it's Y' pattern: {t!r}")
        if re.search(r"\w+, \w+,? and \w+", t) and len(t) < 70 and re.search(r"\b(\w+)s?, (\w+)s?, and (\w+)", t): w.append(f"possible tricolon: {t!r}")
        if re.search(r"#\w+", t): w.append(f"hashtag on screen: {t!r}")
        if sum(1 for c in t if ord(c) > 0x1F000) > 2: w.append(f"emoji pile: {t!r}")
    lens = [len(t.split()) for t in texts if len(t.split()) > 2]
    run = 1
    for a, b in zip(lens, lens[1:]):
        run = run + 1 if abs(a - b) <= 1 else 1
        if run >= 5: w.append("metronome: 5+ consecutive lines of near-identical length"); break
    return w
