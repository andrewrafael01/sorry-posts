"""Mochi & Toast skit engine (v5, Nov 22).
Two independent actors with motion from frame 0, sticker-style pose pops, fx, synthesized sfx,
a persistent header (series 'day N' or a POV caption), narration lines, and an optional heart meter.

Episode = dict(slug, header=(small, big), steps=[...], meter=(prev, new) or None, foot=str, seed=int)
step = dict(d=seconds, cap="narration" or None, m="SPEC@X~MOTION", t="SPEC@X~MOTION", fx=["hearts@m", ...])
  SPEC: any single-cat scene spec (m:happy, th:flower:happy, ts, mbox:love ...). '-' hides the actor.
  X: horizontal position (default keeps previous). MOTION: idle hop jump shake tremble squash faint spin sway lean bounce
fx: hearts@a sparkles@a bang@a q@a sweat@a notes@a zzz@a say@a:TEXT snow rain  (a = m|t)
"""
import math, random, subprocess, os, wave, sys
import numpy as np, cv2
from PIL import Image, ImageDraw
import mreel as MR
from mreel import blit, tlayer, crop_spr, clamp, ease_io, ease_out_back, RW, RH, FPS, Spr
from soft import *
import scenes as S, carousels as C

OUT = "/tmp/claude-0/cats/mochi/reels"; os.makedirs(OUT, exist_ok=True)
GY, U = 1080, 178
INKC = (42, 34, 50); GREYC = (150, 140, 170)
SR = 44100

_spr = {}
def actor_spr(spec, blink=False):
    k = (spec, blink)
    if k not in _spr:
        cv = Image.new("RGBA", (RW, RH), (0, 0, 0, 0))
        S.draw(cv, spec, GY, U, zz=False, blink=blink)
        _spr[k] = crop_spr(cv, (540, GY))[0]
    return _spr[k]

def bubble_spr(txt, w=470, h=270):
    cv = Image.new("RGBA", (RW, RH), (0, 0, 0, 0))
    C.say(cv, txt, 540, 600, w, h, "bl", 60)
    return crop_spr(cv, (540, 600))[0]

def note_spr():
    lay = Image.new("RGBA", (200, 200), (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
    d.ellipse((40, 120, 96, 164), fill=PINK, outline=INKC, width=5); d.line((92, 140, 92, 40), fill=INKC, width=7)
    d.line((92, 40, 140, 62), fill=INKC, width=9)
    arr = np.asarray(lay).astype(np.float32)/255.0; arr[..., :3] *= arr[..., 3:4]; return MR.mk(arr, (90, 100))

def drop_spr():
    lay = Image.new("RGBA", (120, 160), (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
    d.polygon([(60, 10), (30, 90), (90, 90)], fill=(170, 206, 246)); d.ellipse((28, 60, 92, 124), fill=(170, 206, 246), outline=None)
    d.line((60, 10, 28, 88), fill=INKC, width=4); d.line((60, 10, 92, 88), fill=INKC, width=4); d.arc((28, 60, 92, 124), 0, 180, fill=INKC, width=4)
    arr = np.asarray(lay).astype(np.float32)/255.0; arr[..., :3] *= arr[..., 3:4]; return MR.mk(arr, (60, 80))

def mark_spr(ch, size=96, col=INKC):
    lay = Image.new("RGBA", (RW, RH), (0, 0, 0, 0))
    text(lay, ch, 400, size, col=col)
    return crop_spr(lay, (540, 400))[0]

def parse_state(s, prev):
    if s is None: return prev
    if s == "-": return dict(prev, spec=None)
    spec, mot = (s.split("~") + ["idle"])[:2]
    spec, _, x = spec.partition("@")
    st = dict(prev); st["spec"] = spec or prev["spec"]; st["mot"] = mot
    if x: st["x"] = float(x)
    return st

# ---------------- audio ----------------
def _env(n, a=0.004, d=0.2):
    t = np.arange(n)/SR; return (1-np.exp(-t/a))*np.exp(-t/d)

def sfx(kind, rng):
    if kind == "pop":
        n = int(0.12*SR); t = np.arange(n)/SR; f = 500+1800*t/0.12
        return 0.35*np.sin(2*np.pi*np.cumsum(f)/SR)*_env(n, 0.002, 0.04)
    if kind == "boing":
        n = int(0.35*SR); t = np.arange(n)/SR; f = 260+180*np.exp(-t*9)*np.cos(t*60)+120*np.exp(-t*6)
        return 0.32*np.sin(2*np.pi*np.cumsum(f)/SR)*_env(n, 0.003, 0.14)
    if kind == "whoosh":
        n = int(0.3*SR); x = np.array([rng.uniform(-1, 1) for _ in range(n)])
        x = np.convolve(x, np.ones(30)/30, "same"); t = np.arange(n)/SR
        return 0.5*x*np.sin(np.pi*t/0.3)**2
    if kind == "ding":
        n = int(0.9*SR); t = np.arange(n)/SR
        return 0.22*(np.sin(2*np.pi*1568*t)+0.5*np.sin(2*np.pi*2349*t))*_env(n, 0.002, 0.35)
    if kind == "chime":
        out = np.zeros(int(0.7*SR))
        for j, f in enumerate((1319, 1568, 1976)):
            i0 = int(j*0.07*SR); n = len(out)-i0; t = np.arange(n)/SR
            out[i0:] += 0.12*np.sin(2*np.pi*f*t)*_env(n, 0.002, 0.18)
        return out
    if kind == "thud":
        n = int(0.3*SR); t = np.arange(n)/SR; f = 120*np.exp(-t*5)+50
        return 0.6*np.sin(2*np.pi*np.cumsum(f)/SR)*_env(n, 0.002, 0.08)
    if kind == "blip":
        n = int(0.09*SR); t = np.arange(n)/SR
        return 0.25*np.sin(2*np.pi*880*t)*_env(n, 0.002, 0.05)
    if kind == "sad":
        n = int(0.6*SR); t = np.arange(n)/SR; f = 520-260*t/0.6
        return 0.18*np.sin(2*np.pi*np.cumsum(f)/SR)*_env(n, 0.01, 0.4)
    raise ValueError(kind)

def soundtrack(path, dur, seed, events):
    MR.music(path, dur, seed)
    with wave.open(path) as w: y = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float64)/32767
    y *= 0.55
    rng = random.Random(seed)
    for t0, kind in events:
        s = sfx(kind, rng); i0 = int(t0*SR)
        if i0 >= len(y): continue
        e = min(len(y), i0+len(s)); y[i0:e] += s[:e-i0]
    y = y/max(1.0, np.max(np.abs(y))/0.9)
    with wave.open(path, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((y*32767).astype(np.int16).tobytes())

# ---------------- meter ----------------
def meter_layer(pct, label="mochi's heart"):
    lay = Image.new("RGBA", (RW, 300), (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
    x0, x1, y0, y1 = 190, 890, 120, 186
    d.rounded_rectangle((x0, y0, x1, y1), 33, fill=(255, 238, 244))
    w = (x1-x0-12)*clamp(pct/100)
    if w > 8: d.rounded_rectangle((x0+6, y0+6, x0+6+w, y1-6), 27, fill=PINK)
    d.rounded_rectangle((x0, y0, x1, y1), 33, outline=INKC, width=6)
    f = font("gaegu", 64)
    t = f"{label}: {int(round(pct))}%"; tw = d.textlength(t, font=f)
    d.text((RW/2-tw/2, 20), t, font=f, fill=INKC)
    put(lay, heart(80, PINK, seed=2), x0-20, (y0+y1)/2)
    arr = np.asarray(lay).astype(np.float32)/255.0; arr[..., :3] *= arr[..., 3:4]
    return MR.mk(arr, (RW/2, 0))

# ---------------- render ----------------
def render(ep):
    global GY
    GY = 925 if ep.get("send") else 1080  # v6: cats sit higher so the caption, meter and send line fit under them
    slug = ep["slug"]; seed = ep.get("seed", 1); steps = ep["steps"]
    path = f"{OUT}/{slug}.mp4"
    # timeline
    T = []; t = 0.0
    for s in steps: T.append((t, t+s["d"])); t += s["d"]
    DUR = t
    st = {"m": dict(spec=None, x=ep.get("mx0", 300), mot="idle"), "t": dict(spec=None, x=ep.get("tx0", 1250), mot="idle")}
    seq = []
    for i, s in enumerate(steps):
        prev = {k: dict(v) for k, v in st.items()}
        for a in "mt": st[a] = parse_state(s.get(a), st[a])
        seq.append(dict(t0=T[i][0], t1=T[i][1], prev=prev, cur={k: dict(v) for k, v in st.items()}, s=s))
    # header
    small, big = ep["header"]
    hs = tlayer(small, 235, 58 if ep.get("send") else 54, sub=True)[0] if small else None
    v6 = bool(ep.get("send"))  # v6 series layout: premise header, captions/meter tucked under the cats, send line in the safe zone
    hb, hb_y = tlayer(big, (330 if v6 else 365) if small else 320, 140 if len(big) < 14 else 88)
    CAPY = 1190 if v6 else 1335; MY = 1145 if v6 else 1325
    caps = {i: tlayer(s["cap"], CAPY, 80 if v6 else 72)[0] for i, s in enumerate(steps) if s.get("cap")}
    foot = tlayer(ep["foot"], 1640 if v6 else 1570, 44 if v6 else 46, sub=True)[0] if ep.get("foot") else None
    sl = ep.get("send") or ""
    if len(sl) > 22:  # wrap long send lines into two balanced lines so they stay big
        ws = sl.split(" "); best = min(range(1, len(ws)), key=lambda k: abs(len(" ".join(ws[:k]))-len(" ".join(ws[k:]))))
        sl = " ".join(ws[:best])+"\n"+" ".join(ws[best:])
    send = tlayer(sl.replace("send this", "*send* this", 1), 1440, 70)[0] if v6 else None
    hearts = [Spr(heart(52+8*i, PINK, seed=i)) for i in range(3)]
    spk = [Spr(sparkle(40+12*i, (255, 214, 90), i)) for i in range(3)]
    marks = {"bang": mark_spr("!!", 100), "q": mark_spr("?", 110), "notes": note_spr(), "sweat": drop_spr()}
    zl = [tlayer("z", 0, s)[0] for s in (60, 48, 38)]
    bubbles = {}
    for s in steps:
        for f in s.get("fx", []):
            if f.startswith("say@"): bubbles[f] = bubble_spr(f.split(":", 1)[1])
    rr = random.Random(seed)
    snow = [(rr.uniform(0, RW), rr.uniform(0, RH), rr.uniform(5, 11), rr.uniform(50, 110), rr.uniform(0, 6)) for _ in range(70)]
    rain = [(rr.uniform(0, RW), rr.uniform(0, RH), rr.uniform(700, 1000)) for _ in range(60)]
    # sfx events
    ev = []
    for q in seq:
        for a in "mt":
            p, c = q["prev"][a], q["cur"][a]
            if c["spec"] and c["spec"] != p["spec"]: ev.append((q["t0"]+0.02, "pop"))
            if c["spec"] and abs(c["x"]-p["x"]) > 60: ev.append((q["t0"], "whoosh"))
            if c["mot"] in ("jump", "bounce"): ev.append((q["t0"]+0.05, "boing"))
            if c["mot"] == "faint": ev.append((q["t0"]+0.45, "thud"))
        for f in q["s"].get("fx", []):
            k = f.split("@")[0]
            ev.append((q["t0"]+0.15, {"hearts": "ding", "sparkles": "chime", "bang": "blip", "q": "blip", "say": "blip", "sad": "sad"}.get(k, "pop")))
    if ep.get("meter"): ev.append((seq[-1]["t0"]+0.4, "chime"))
    wav = f"{OUT}/_s{slug}.wav"; soundtrack(wav, DUR, seed, ev)
    cmds = ["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{RW}x{RH}", "-r", str(FPS), "-i", "-",
            "-i", wav, "-c:v", "libx264", "-preset", "veryfast", "-crf", "18", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "160k", "-shortest", "-movflags", "+faststart", path]
    pr = subprocess.Popen(cmds, stdin=subprocess.PIPE)
    white = np.full((RH, RW, 3), 255, np.float32)
    mlay = {}
    for fi in range(int(DUR*FPS)):
        t = fi/FPS; fr = white.copy()
        qi = max(i for i in range(len(seq)) if seq[i]["t0"] <= t+1e-6); q = seq[qi]; a = t-q["t0"]
        fxs = q["s"].get("fx", [])
        if "snow" in fxs:
            for x, y, r_, v, ph in snow:
                yy = (y+v*t) % (RH+40)-20; xx = x+18*math.sin(t*0.8+ph)
                cv2.circle(fr, (int(xx), int(yy)), int(r_), (196, 214, 244), -1, cv2.LINE_AA)
        if "rain" in fxs:
            for x, y, v in rain:
                yy = (y+v*t) % (RH+60)-30
                cv2.line(fr, (int(x), int(yy)), (int(x-5), int(yy+30)), (150, 186, 236), 5, cv2.LINE_AA)
        pos = {}
        for a_ in "mt":
            p, c = q["prev"][a_], q["cur"][a_]
            if not c["spec"]: continue
            mv = 0.45 if abs(c["x"]-p["x"]) > 1 else 0
            u = ease_io(a/mv) if mv else 1
            x = p["x"]+(c["x"]-p["x"])*u; y = 0.0; sx = sy = 1.0; rot = 0.0
            if mv and a < mv: y += abs(math.sin(a/mv*math.pi*2))*38  # walking hops
            br = 1+0.013*math.sin(t*2.6+(0 if a_ == "m" else 1.3)); sx *= br; sy *= 2-br
            if c["spec"] != p["spec"] and a < 0.22:  # pose pop
                k = ease_out_back(a/0.22, 2.2); sx *= 0.86+0.14*k; sy *= 1.12-0.12*k
            m = c["mot"]; lead = 1 if a_ == "m" else -1
            if m == "idle": rot += 1.4*math.sin(t*1.4+(0 if a_ == "m" else 2))
            elif m == "hop": y += abs(math.sin(a*math.pi*2.4))*46
            elif m == "jump":
                if a < 0.55: y += math.sin(a/0.55*math.pi)*150; sy *= 1+0.08*math.sin(a/0.55*math.pi)
                elif a < 0.75: k = (a-0.55)/0.2; sy *= 1-0.12*math.sin(k*math.pi); sx *= 1+0.1*math.sin(k*math.pi)
            elif m == "bounce": y += abs(math.sin(a*math.pi*1.6))*90*math.exp(-a*0.6)
            elif m == "shake": x += 22*math.sin(a*48)*math.exp(-a*3)
            elif m == "tremble": x += 5*math.sin(a*70); rot += 1.5*math.sin(a*50)
            elif m == "squash":
                k = clamp(a/0.35); sy *= 0.8+0.2*ease_out_back(k, 2.0); sx *= 1.18-0.18*ease_out_back(k, 2.0)
            elif m == "faint": rot += -lead*82*ease_io(clamp(a/0.5)); y -= 0
            elif m == "spin": rot += 360*ease_io(clamp(a/0.7))
            elif m == "sway": rot += 9*math.sin(a*5.2)
            elif m == "lean": rot += -lead*9*ease_io(clamp(a/0.4)); x += lead*20*ease_io(clamp(a/0.4))
            pos[a_] = (x, y)
            blink = c["spec"].split(":")[0] in ("m", "t", "mh", "th", "mp", "tp", "mbox", "tbox") and ((t+(0 if a_ == "m" else 1.1)) % 3.4) > 3.24
            blit(fr, actor_spr(c["spec"], blink), x, GY-y, sx, sy, rot)
        # fx
        for f in fxs:
            key, _, who = f.partition("@"); who = who.split(":")[0]
            if who and who not in pos: continue
            ax, ay = pos.get(who, (540, 0)); top = GY-ay-2.15*U
            if key == "hearts":
                for j in range(9):
                    c = a-0.15-j*0.18
                    if c < 0 or c > 2.4: continue
                    yy = top-30-110*c; x0 = ax+((j*97) % 260-130)
                    blit(fr, hearts[j % 3], x0+16*math.sin(c*2.5+j), yy, 0.7+0.3*clamp(c/0.25), rot=10*math.sin(c*2+j), alpha=clamp(c/0.2)*clamp((2.4-c)/0.6)*clamp((yy-520)/150))
            elif key == "sparkles":
                for j, (px, py) in enumerate([(-150, -40), (150, -80), (90, -220), (-110, -230)]):
                    ph = t*2.6+j*1.7
                    blit(fr, spk[j % 3], ax+px, top+60+py, 0.7+0.25*math.sin(ph), rot=t*30+j*40, alpha=(0.55+0.45*math.sin(ph))*clamp(a/0.2))
            elif key in ("bang", "q"):
                c = clamp((a-0.1)/0.25); blit(fr, marks[key], ax+(110 if who == "m" else -110), top+10, 0.4+0.6*ease_out_back(c, 2.5), rot=-12 if who == "m" else 12, alpha=c)
            elif key == "notes":
                for j in range(4):
                    c = (a*0.7+j/4) % 1
                    blit(fr, marks["notes"], ax+(-1 if who == "t" else 1)*(90+80*c)+30*math.sin(c*6), top+40-200*c, 0.8, rot=15*math.sin(c*5), alpha=math.sin(math.pi*c))
            elif key == "sweat":
                c = (a % 1.2)/1.2
                blit(fr, marks["sweat"], ax+(70 if who == "m" else -70), top+90+60*c, 1.2, alpha=math.sin(math.pi*c))
            elif key == "zzz":
                for j in range(3):
                    c = (t*0.6+j/3) % 1
                    blit(fr, zl[j], ax+120+60*c, top+40-150*c, alpha=math.sin(math.pi*c))
            elif key == "say":
                c = clamp((a-0.1)/0.25); bs = bubbles[f]
                bx = ax+(170 if who == "m" else -40)
                bx = min(max(bx, 230), RW-230)
                blit(fr, bs, bx, top-60, 0.5+0.5*ease_out_back(c, 2.0), alpha=c)
        # header (visible from frame 0)
        if hs is not None: blit(fr, hs, RW/2, hs.ay)
        blit(fr, hb, RW/2, hb.ay, 1+0.03*math.sin(t*3))
        # narration
        for i, s in enumerate(steps):
            if i not in caps: continue
            a2, b2 = t-T[i][0], T[i][1]-t
            if a2 < 0 or b2 < 0: continue
            last = i == len(steps)-1
            al = ease_io(a2/0.2)*(1 if last else ease_io(b2/0.2))
            if ep.get("meter") and last: continue
            blit(fr, caps[i], RW/2, caps[i].ay+int(12*(1-ease_io(a2/0.2))), alpha=al)
        if ep.get("meter"):
            q0 = seq[-1]["t0"]; c = t-q0
            if c >= 0:
                p0, p1 = ep["meter"]; v = p0+(p1-p0)*ease_io(clamp((c-0.3)/1.0))
                kk = round(v, 0)
                if kk not in mlay: mlay[kk] = meter_layer(kk)
                blit(fr, mlay[kk], RW/2, MY+int(20*(1-ease_io(clamp(c/0.25)))), alpha=ease_io(clamp(c/0.25)))
        if send is not None:
            c = t-seq[-1]["t0"]
            if c > 0.3: k = clamp((c-0.3)/0.3); blit(fr, send, RW/2, send.ay+int(16*(1-ease_io(k))), 0.9+0.1*ease_out_back(k, 2.0), alpha=ease_io(k))
        if foot is not None:
            c = t-seq[-1]["t0"]
            if c > 0.5: blit(fr, foot, RW/2, foot.ay, alpha=ease_io(clamp((c-0.5)/0.3)))
        out = np.clip(fr, 0, 255).astype(np.uint8)
        if fi == 14: os.makedirs(f"{OUT}/covers", exist_ok=True); Image.fromarray(out).save(f"{OUT}/covers/{slug}.jpg", quality=92)
        pr.stdin.write(out.tobytes())
    pr.stdin.close(); pr.wait(); os.remove(wav)
    subprocess.run(["sh", "/tmp/claude-0/cats/mochi/normalize.sh", path], check=True)
    return path, DUR

if __name__ == "__main__":
    import content_v5 as CV
    sel = sys.argv[1:]
    for ep in CV.EPISODES + CV.SKITS:
        if sel and ep["slug"] not in sel and not any(ep["slug"].startswith(x) for x in sel): continue
        p, d = render(ep); print("skit", ep["slug"], round(d, 1), flush=True)
