"""Phone UI renderers (messages thread, lock-screen notifications, voice memo, call, search, stat chart).
Each UI is drawn onto a 1080x1500 canvas by an object with .draw(t) -> RGB image and .cues (list of (t, sfx))."""
import math
from engine import *

UW, UH = 1080, 1500
BLUE = (11, 132, 255); GREY_L = (233, 233, 235); GREY_D = (38, 38, 41)
PALETTE = [(255, 149, 0), (175, 82, 222), (52, 199, 89), (255, 45, 85), (90, 200, 250), (255, 204, 0)]

def status_bar(img, dark, clock="11:48", batt=.7):
    d = ImageDraw.Draw(img); fg = WHITE if dark else (0, 0, 0)
    draw_line(img, 70, 28, clock, "bold", 38, fg)
    # signal + battery
    for i in range(4): d.rectangle([800 + i * 14, 58 - i * 6, 808 + i * 14, 66], fill=fg)
    bx = 930; d.rounded_rectangle([bx, 32, bx + 70, 66], 9, outline=fg, width=3); d.rounded_rectangle([bx + 5, 37, bx + 5 + int(60 * batt), 61], 5, fill=fg)
    d.rectangle([bx + 72, 43, bx + 76, 55], fill=fg)

def avatar(img, cx, cy, r, color, initial, size=None):
    d = ImageDraw.Draw(img); d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=color)
    f = font("bold", size or int(r * 1.0)); w = f.getlength(initial)
    d.text((cx - w / 2, cy - (size or r) * .62), initial, font=f, fill=WHITE)

class Messages:
    def __init__(self, contact="Dani", events=None, dark=False, group=None, avatar_color=None, stamp=None, input_hint="iMessage", clock="11:48"):
        self.contact, self.dark, self.group = contact, dark, group
        self.avatar_color = avatar_color or (140, 150, 170)
        self.events = sorted(events or [], key=lambda e: e["at"])
        self.stamp0, self.hint, self.clock = stamp, input_hint, clock
        self.cues = []
        self.items = []   # chronological list of dicts with resolved timings
        self._build()
        self._cache = {}

    def _build(self):
        for e in self.events:
            if "text" in e:
                who = e["who"]
                if who == "them" and e.get("typing"): self.cues.append((e["at"] - e["typing"], "tick", .3))
                if who == "them": self.cues.append((e["at"], "recv", .7))
                else:
                    tt = e.get("type_time", 0)
                    for k in range(int(tt * 9)): self.cues.append((e["at"] - tt + k / 9 + .01, "key", .5))
                    self.cues.append((e["at"], "sent", .7))
                self.items.append(dict(kind="msg", **e))
            elif "stamp" in e: self.items.append(dict(kind="stamp", **e))
            elif "status" in e: self.items.append(dict(kind="status", **e))
            elif "react" in e: self.items.append(dict(kind="react", **e)); self.cues.append((e["at"], "pop", .6))
        self.n_msgs = [i for i in self.items if i["kind"] == "msg"]

    # ---- bubble rendering (cached)
    def bubble(self, text, who, sender=None, first=True, last=True, big=False):
        key = (text, who, sender, first, last, self.dark, big)
        if key in self._cache: return self._cache[key]
        size = 54 if not big else 120
        tl = text_layer(text, size, "reg", WHITE if who == "me" or (who == "them" and self.dark) else (0, 0, 0), maxw=700, align="left", pad=0, spacing=1.22)
        if big:
            self._cache[key] = (tl, 0); return self._cache[key]
        px, py = 32, 22
        w, h = tl.width + px * 2, tl.height + py * 2
        extra = 34 if (sender and first) else 0
        L = Image.new("RGBA", (w + 20, h + extra + 4), (0, 0, 0, 0)); d = ImageDraw.Draw(L)
        col = BLUE if who == "me" else (GREY_D if self.dark else GREY_L)
        r = 40
        x0 = 0 if who == "them" else 20
        d.rounded_rectangle([x0, extra, x0 + w, extra + h], r, fill=col)
        if last:   # tail
            if who == "me": d.polygon([(x0 + w - 30, extra + h - 24), (x0 + w + 14, extra + h + 2), (x0 + w - 6, extra + h - 2), (x0 + w - 6, extra + h - 40)], fill=col)
            else: d.polygon([(x0 + 30, extra + h - 24), (x0 - 0, extra + h + 2), (x0 + 6, extra + h - 2), (x0 + 6, extra + h - 40)], fill=col)
        L.paste(tl, (x0 + px, extra + py), tl)
        if sender and first:
            draw_line(L, x0 + 26, 0, sender, "med", 27, (150, 150, 155))
        self._cache[key] = (L, extra)
        return self._cache[key]

    def draw(self, t):
        dark = self.dark
        bg = (0, 0, 0) if dark else (255, 255, 255)
        img = Image.new("RGB", (UW, UH), bg); d = ImageDraw.Draw(img)
        fg = WHITE if dark else (0, 0, 0)
        # ---- thread: lay out items that have appeared
        y = 0; placed = []; prev_who = None
        msgs_seen = [i for i in self.items if i["kind"] == "msg" and i["at"] <= t]
        last_me_idx = None
        for i, it in enumerate(self.items):
            if it["at"] > t and it["kind"] != "msg": continue
            if it["kind"] == "stamp":
                placed.append(("stamp", it, y)); y += 66; prev_who = None
            elif it["kind"] == "msg":
                typing_on = it["who"] == "them" and it.get("typing") and it["at"] - it["typing"] <= t < it["at"]
                if it["at"] > t and not typing_on: continue
                key_prev = prev_who
                first = key_prev != it["who"]
                nxt = None
                for j in self.items[i + 1:]:
                    if j["kind"] == "msg" and j["at"] <= t: nxt = j["who"]; break
                    if j["kind"] == "stamp" and j["at"] <= t: break
                last = nxt != it["who"]
                if typing_on:
                    placed.append(("typing", it, y)); y += 96 + (34 if (self.group and first) else 0) + (16 if last else 6); prev_who = it["who"]; continue
                big = it.get("big", False)
                L, extra = self.bubble(it["text"], it["who"], it.get("sender") if self.group else None, first, last, big)
                gap = 22 if first else 6
                if big: gap = 18
                y += gap if prev_who is not None else 0
                placed.append(("msg", it, y, L)); y += L.height - (4 if not big else 0)
                prev_who = it["who"]; last_me_idx = len(placed) - 1 if it["who"] == "me" else last_me_idx
            elif it["kind"] == "status":
                if it["at"] <= t: placed.append(("status", it, y)); y += 50
        top, bottom = 330, 1290
        avail = bottom - top
        scroll = max(0, y + 40 - avail)
        # smooth scroll: ease toward target using last-change time
        self._scroll_s = getattr(self, "_scroll_s", 0.0)
        # (stateless smoothing) approximate easing via small lookback
        scroll_prev = self._scroll_at(t - .22)
        sc = lerp(scroll_prev, scroll, .75) if scroll > scroll_prev else scroll
        oy = top - sc
        for p in placed:
            kind = p[0]
            if kind == "stamp":
                yy = oy + p[2]; s = p[1]["stamp"]; w = font("med", 28).getlength(s)
                if top - 60 < yy < bottom + 20: draw_line(img, (UW - w) / 2, yy + 12, s, "med", 28, (140, 140, 145))
            elif kind == "typing":
                yy = oy + p[2]; it = p[1]; 
                pad = 34 if (self.group and it.get("sender") and True) else 0
                bx = 40; d.rounded_rectangle([bx, yy + pad, bx + 150, yy + pad + 84], 42, fill=(GREY_D if dark else GREY_L))
                for k in range(3):
                    a = .5 + .5 * math.sin(t * 7 - k * 1.1); c = int(150 - 50 * a)
                    d.ellipse([bx + 36 + k * 36 - 10, yy + pad + 42 - 10 - a * 4, bx + 36 + k * 36 + 10, yy + pad + 42 + 10 - a * 4], fill=(c, c, c + 5))
            elif kind == "msg":
                it, L, yy = p[1], p[3], oy + p[2]
                u = t - it["at"]
                pop = out_back(u / .22, 1.4) if u < .3 else 1
                if it.get("big"):
                    img.paste(L, (int((UW - L.width) / 2 if it["who"] == "me" else 60), int(yy)), L); continue
                x = (UW - L.width - 24) if it["who"] == "me" else 40
                if pop != 1: 
                    L2 = L.resize((max(1, int(L.width * pop)), max(1, int(L.height * pop))), Image.BILINEAR)
                    ax = x + (L.width - L2.width) if it["who"] == "me" else x
                    img.paste(L2, (int(ax), int(yy + (L.height - L2.height))), L2)
                else: img.paste(L, (int(x), int(yy)), L)
                # reactions attached to this message
                for r in self.items:
                    if r["kind"] == "react" and r["at"] <= t and r.get("to") is it.get("_id", None): pass
            elif kind == "status":
                yy = oy + p[2]; s = p[1]["status"]; w = font("med", 27).getlength(s)
                draw_line(img, UW - 28 - w, yy + 6, s, "med", 27, (140, 140, 145))
        # ---- reactions (tapbacks) rendered near their target message
        for r in self.items:
            if r["kind"] == "react" and r["at"] <= t:
                tgt = r["to"]
                for p in placed:
                    if p[0] == "msg" and p[1] is self.items[tgt]:
                        L = p[3]; yy = oy + p[2]; it = p[1]
                        bxx = (UW - L.width - 24 - 20 + 6) if it["who"] == "them" else 40 + 0
                        cx = (40 + L.width - 30) if it["who"] == "them" else (UW - L.width - 24 + 30)
                        u = t - r["at"]; s_ = out_back(u / .25, 1.6)
                        rr = int(34 * s_); cy = yy + 8
                        d.ellipse([cx - rr, cy - rr, cx + rr, cy + rr], fill=(GREY_D if dark else GREY_L) if it["who"] == "them" else (GREY_L if not dark else GREY_D), outline=bg, width=5)
                        em = {"ha": "😂", "love": "❤", "like": "👍", "emph": "‼", "dislike": "👎", "q": "?"}[r["react"]]
                        if em == "?": draw_line(img, cx - 9, cy - 22, "?", "black", 40, BLUE)
                        elif em == "‼": draw_line(img, cx - 14, cy - 24, "!!", "black", 38, BLUE)
                        else:
                            e = emoji_img(em, rr * 1.15); img.paste(e, (int(cx - e.width / 2), int(cy - e.height / 2)), e)
        # ---- cover top/bottom bars on top of thread
        d.rectangle([0, 0, UW, top], fill=bg); d.rectangle([0, bottom, UW, UH], fill=bg)
        status_bar(img, dark, self.clock)
        # header
        d.line([(0, top - 2), (UW, top - 2)], fill=(60, 60, 64) if dark else (222, 222, 226), width=2)
        d.line([(50, 190), (28, 222)], fill=BLUE, width=7); d.line([(28, 222), (50, 254)], fill=BLUE, width=7)
        if self.group:
            for k in range(3): avatar(img, 540 - 40 + k * 40, 185, 36, PALETTE[k % len(PALETTE)], "·", 30)
        else: avatar(img, 540, 180, 54, self.avatar_color, self.contact[:1].upper(), 54)
        nm = self.contact + (" ›" if True else "")
        w = font("semi", 30).getlength(nm); draw_line(img, (UW - w) / 2, 252, nm, "semi", 30, fg)
        # ---- input bar
        typed, hint_a = self._typed(t)
        d.ellipse([34, 1340, 110, 1416], fill=(60, 60, 64) if dark else (232, 232, 236)); d.line([(72, 1362), (72, 1394)], fill=(140, 140, 146), width=6); d.line([(56, 1378), (88, 1378)], fill=(140, 140, 146), width=6)
        d.rounded_rectangle([130, 1334, UW - 34, 1422], 44, outline=(70, 70, 74) if dark else (205, 205, 210), width=3)
        if typed: draw_line(img, 160, 1352, typed[-34:], "reg", 44, fg)
        else: draw_line(img, 160, 1352, self.hint, "reg", 44, (150, 150, 156))
        if typed:
            d.ellipse([UW - 120, 1348, UW - 50, 1408], fill=BLUE); d.polygon([(UW - 85, 1360), (UW - 68, 1378), (UW - 102, 1378)], fill=WHITE)
        else:
            d.ellipse([UW - 108, 1350, UW - 74, 1400], outline=(150, 150, 156), width=4)
        d.rounded_rectangle([UW / 2 - 150, 1470, UW / 2 + 150, 1480], 5, fill=fg)
        return img

    def _scroll_at(self, t):
        # content height at time t (no smoothing), used for easing the scroll
        y = 0; prev = None
        for i, it in enumerate(self.items):
            typing_on = it["kind"] == "msg" and it["who"] == "them" and it.get("typing") and it["at"] - it["typing"] <= t < it["at"]
            if it["kind"] == "stamp" and it["at"] <= t: y += 66; prev = None
            elif it["kind"] == "msg" and (it["at"] <= t or typing_on):
                if typing_on: y += 96 + 22; prev = it["who"]; continue
                big = it.get("big", False); L, _ = self.bubble(it["text"], it["who"], it.get("sender") if self.group else None, prev != it["who"], True, big)
                y += (22 if prev != it["who"] else 6) if prev else 0; y += L.height; prev = it["who"]
            elif it["kind"] == "status" and it["at"] <= t: y += 50
        return max(0, y + 40 - (1290 - 330))

    def _typed(self, t):
        """Text currently being typed into the input field (for 'me' messages with type_time)."""
        for it in self.items:
            if it["kind"] == "msg" and it["who"] == "me" and it.get("type_time"):
                a, b = it["at"] - it["type_time"], it["at"]
                if a <= t < b + .0:
                    n = int(len(it["text"]) * (t - a) / (b - a)); return it["text"][:n], 1
        return "", 0


class LockScreen:
    """Lock screen with a stack of notification cards. items: dict(at, app, title, body, when='now', color=(r,g,b), icon='M')."""
    def __init__(self, clock="2:14", date="Tuesday, October 14", items=None, wall=((38, 30, 92), (18, 12, 40)), more=None, vibrate=True):
        self.clock, self.date, self.items, self.wall, self.more = clock, date, sorted(items or [], key=lambda e: e["at"]), wall, more
        self.cues = []
        for it in self.items:
            if it["at"] >= 0: self.cues.append((it["at"], "buzz" if vibrate else "recv", .6))
        self._bg = None; self._cards = {}
    def card(self, it):
        k = (it["app"], it["title"], it["body"], it.get("when", "now"), it.get("color"), it.get("icon"))
        if k in self._cards: return self._cards[k]
        w = 980; body = text_layer(it["body"], 38, "reg", (245, 245, 250), maxw=700, align="left", pad=0, spacing=1.2)
        h = 62 + 52 + body.height + 36
        L = Image.new("RGBA", (w, h), (0, 0, 0, 0)); d = ImageDraw.Draw(L)
        d.rounded_rectangle([0, 0, w - 1, h - 1], 46, fill=(70, 70, 82, 205))
        col = it.get("color", (60, 200, 80)); d.rounded_rectangle([30, 28, 118, 116], 22, fill=col)
        ic = it.get("icon", it["app"][:1]); f = font("black", 52); iw = text_width(ic, f, 52)
        draw_line(L, 74 - iw / 2, 40, ic, "black", 52, WHITE)
        draw_line(L, 142, 30, it["title"], "bold", 40, WHITE)
        draw_line(L, 142, 78, it["app"].upper(), "semi", 24, (190, 190, 200))
        wt = it.get("when", "now"); ww = font("med", 28).getlength(wt); draw_line(L, w - 34 - ww, 32, wt, "med", 28, (200, 200, 210))
        L.paste(body, (142, 120), body)
        self._cards[k] = L; return L
    def draw(self, t):
        if self._bg is None:
            im = Image.new("RGB", (UW, UH)); d = ImageDraw.Draw(im)
            for y in range(UH): d.line([(0, y), (UW, y)], fill=tuple(int(lerp(self.wall[0][i], self.wall[1][i], y / UH)) for i in range(3)))
            for (cx, cy, r, a) in [(240, 420, 380, 40), (860, 900, 460, 30)]:
                ov = Image.new("RGBA", (UW, UH), (0, 0, 0, 0)); ImageDraw.Draw(ov).ellipse([cx - r, cy - r, cx + r, cy + r], fill=(160, 120, 255, a)); im.paste(ov, (0, 0), ov)
            self._bg = im
        img = self._bg.copy(); d = ImageDraw.Draw(img)
        status_bar(img, True, "")
        dw = font("semi", 38).getlength(self.date); draw_line(img, (UW - dw) / 2, 150, self.date, "semi", 38, (225, 225, 235))
        f = font("med", 250); cw = f.getlength(self.clock); d.text(((UW - cw) / 2, 190), self.clock, font=f, fill=(255, 255, 255))
        y = 590; shown = [it for it in self.items if it["at"] <= t]
        for it in reversed(shown):   # newest on top
            L = self.card(it); u = t - it["at"]
            slide = out_cubic(u / .3); yy = y - (1 - slide) * 140
            L2 = L.copy()
            if slide < 1: L2.putalpha(L.getchannel("A").point(lambda v: int(v * slide)))
            img.paste(L2, (50, int(yy)), L2); y += L.height + 20
        if self.more is not None and shown:
            txt = self.more if isinstance(self.more, str) else f"+{self.more} more notifications"
            tw = font("med", 34).getlength(txt); draw_line(img, (UW - tw) / 2, y + 6, txt, "med", 34, (210, 210, 225))
        d.rounded_rectangle([UW / 2 - 150, 1470, UW / 2 + 150, 1480], 5, fill=WHITE)
        return img


class VoiceMemo:
    """Voice Memos app. rate = recorded-seconds per real second. lines: dict(at, text) transcript captions that appear below."""
    def __init__(self, title="New Recording 47", rate=24.0, lines=None, end=None, clock="12:31", seed=3):
        self.title, self.rate, self.lines, self.end, self.clock = title, rate, sorted(lines or [], key=lambda e: e["at"]), end, clock
        r = np.random.RandomState(seed); self.amp = np.abs(np.convolve(r.randn(4000), np.ones(7) / 7, "same")) * 3
        self.cues = [(l["at"], "tick", .5) for l in self.lines]
    def draw(self, t):
        img = Image.new("RGB", (UW, UH), (255, 255, 255)); d = ImageDraw.Draw(img)
        status_bar(img, False, self.clock)
        d.line([(50, 170), (28, 202)], fill=BLUE, width=7); d.line([(28, 202), (50, 234)], fill=BLUE, width=7); draw_line(img, 70, 176, "All Recordings", "med", 38, BLUE)
        draw_line(img, 60, 290, self.title, "bold", 62, (0, 0, 0)); draw_line(img, 60, 372, "Today at " + self.clock + " PM", "med", 34, (140, 140, 146))
        # waveform
        cy = 640; d.line([(UW / 2, 520), (UW / 2, 760)], fill=(255, 59, 48), width=4)
        sec = t * self.rate
        for i in range(-40, 41):
            idx = int(sec * 6 + i) % 3990; a = min(1.0, self.amp[idx]) * 95 + 6
            x = UW / 2 + i * 13; col = (255, 59, 48) if i < 0 else (200, 200, 206)
            d.rounded_rectangle([x - 4, cy - a, x + 4, cy + a], 4, fill=col)
        m, s = divmod(int(sec), 60); ts = f"{m}:{s:02d}.{int((sec % 1) * 100):02d}"
        f = font("med", 120); w = f.getlength(ts); d.text(((UW - w) / 2, 800), ts, font=f, fill=(0, 0, 0))
        if self.end is None or t < self.end:
            d.ellipse([UW / 2 - 56, 1130, UW / 2 + 56, 1242], fill=(255, 255, 255), outline=(190, 190, 195), width=6); d.ellipse([UW / 2 - 40, 1146, UW / 2 + 40, 1226], fill=(255, 59, 48))
        else:
            d.ellipse([UW / 2 - 56, 1130, UW / 2 + 56, 1242], fill=(255, 59, 48)); d.rectangle([UW / 2 - 22, 1164, UW / 2 + 22, 1208], fill=WHITE)
        y = 1000
        for l in self.lines:
            if l["at"] <= t:
                L = text_layer(l["text"], 42, "semi", (60, 60, 67), maxw=940, align="left", pad=0)
                u = t - l["at"]; L2 = L.copy(); L2.putalpha(L.getchannel("A").point(lambda v: int(v * clamp(u / .15)))); img.paste(L2, (60, y), L2); y += L.height + 14
        d.rounded_rectangle([UW / 2 - 150, 1470, UW / 2 + 150, 1480], 5, fill=(0, 0, 0))
        return img
