import sys, os, re, math, random, subprocess, wave
import numpy as np, cv2
import reel as R
from reel import Spr, ease_out_back, ease_io, clamp, RW, RH, FPS
from soft import *
import scenes as S
from content import REELS
OUT = "/tmp/claude-0/cats/mochi/reels"; os.makedirs(OUT, exist_ok=True)
INKC = (42, 34, 50); GREYC = (150, 140, 170)
GY, U = 1220, 230; K = U/160

def hl(t): return re.sub(r"\*([^*]+)\*", lambda m: " ".join("*"+w+"*" for w in m.group(1).split(" ")), t)

def mk(arr, a):
    s = Spr.__new__(Spr); s.arr = arr; s.a = a; return s

def crop_spr(cv, anchor):
    bb = cv.getbbox(); im = cv.crop(bb)
    arr = np.asarray(im).astype(np.float32)/255.0; arr[..., :3] *= arr[..., 3:4]
    return mk(arr, (anchor[0]-bb[0], anchor[1]-bb[1])), bb

def blit(fr, s, X, Y, sx=1, sy=None, rot=0, alpha=1.0):
    if sy is None: sy = sx
    if alpha <= 0.003: return
    if abs(sx-1) < 1e-4 and abs(sy-1) < 1e-4 and abs(rot) < 1e-3:
        x0 = int(round(X-s.a[0])); y0 = int(round(Y-s.a[1])); h, w = s.arr.shape[:2]
        xa, ya, xb, yb = max(0, x0), max(0, y0), min(RW, x0+w), min(RH, y0+h)
        if xb <= xa or yb <= ya: return
        reg = s.arr[ya-y0:yb-y0, xa-x0:xb-x0]
        if alpha < 1: reg = reg*alpha
        d = fr[ya:yb, xa:xb]; d[:] = reg[..., :3]*255.0+d*(1-reg[..., 3:4]); return
    R.blit(fr, s, X, Y, sx, sy, rot, alpha)

def tlayer(t, y, size=96, sub=False):
    lay = Image.new("RGBA", (RW, RH), (0, 0, 0, 0))
    if sub: yb = text(lay, t, y, size, fname="patrick", col=GREYC)
    else: yb = text(lay, hl(t), y, size, col=INKC)
    s, bb = crop_spr(lay, (RW/2, y)); s.ay = y; return s, yb

def scene_spr(spec, blink=False):
    cv = Image.new("RGBA", (RW, RH), (0, 0, 0, 0))
    S.draw(cv, spec, GY, U, zz=False, blink=blink)
    return crop_spr(cv, (540, GY))[0]

def music(path, dur, seed):
    sr = 44100; n = int(sr*dur); y = np.zeros(n); r = random.Random(seed)
    tr = [0, 2, -3, 5, -5, -1][seed % 6]; bpm = [64, 68, 72, 66, 70][seed % 5]
    F = lambda m: 440*2**((m+tr-69)/12)
    def note(m, t0, d, amp):
        i0 = int(t0*sr)
        if i0 >= n: return
        L = int(d*sr); tt = np.arange(L)/sr; f = F(m)
        env = np.exp(-tt*2.2)*(1-np.exp(-tt*200))
        w = np.sin(2*np.pi*f*tt)+0.25*np.sin(2*np.pi*2*f*tt)*np.exp(-tt*4)+0.08*np.sin(2*np.pi*3*f*tt)*np.exp(-tt*8)
        e = min(n, i0+L); y[i0:e] += (amp*env*w)[:e-i0]
    progs = [[(48, [64, 67, 72]), (45, [64, 69, 72]), (41, [65, 69, 72]), (43, [62, 67, 71])],
             [(41, [65, 69, 72]), (48, [64, 67, 72]), (43, [62, 67, 71]), (45, [64, 69, 72])],
             [(48, [64, 67, 72]), (43, [62, 67, 71]), (45, [64, 69, 72]), (41, [65, 69, 72])]]
    prog = progs[seed % 3]
    scale = [72, 74, 76, 79, 81, 84]
    beat = 60/bpm; t = 0.3; i = 0
    while t < dur:
        root, ch = prog[i % 4]
        note(root, t, beat*5, 0.16)
        for j, c in enumerate(ch): note(c, t+beat*0.5*j, beat*4, 0.06)
        cur = r.randrange(len(scale))
        for j in range(4):
            if j and r.random() < 0.2: continue
            cur = max(0, min(len(scale)-1, cur+r.choice([-1, 0, 1, 1, -2, 2])))
            note(scale[cur] if j else ch[-1]+12 if ch[-1] < 74 else ch[-1], t+j*beat, beat*2.4, 0.12)
        t += beat*4; i += 1
    for d, g in ((0.11, 0.25), (0.23, 0.18), (0.41, 0.12)):
        k = int(d*sr); e = np.zeros_like(y); e[k:] = y[:-k]*g; y = y+e
    idx = np.arange(n); y *= np.clip(np.minimum(idx/(sr*0.4), (n-idx)/(sr*1.5)), 0, 1)
    y = y/np.max(np.abs(y))*0.5
    with wave.open(path, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes((y*32767).astype(np.int16).tobytes())

OPEN = ("m", "t", "mt", "mp", "tp", "mb", "tb", "mh", "th", "give")

def build(idx, name, beats, preview=False):
    path = f"{OUT}/{idx+1:02d}_{name}.mp4"
    # timing
    T = []; t = 0.0
    for i, (txt, spec, sub) in enumerate(beats):
        n = txt.count("\n")+1
        d = 2.25+0.3*(n-1)+(0.5 if sub else 0)
        if i == len(beats)-1: d = max(d, 3.2)+0.3
        T.append((t, t+d)); t += d
    DUR = t+0.2
    cache = {}
    def scn(spec, blink=False):
        key = (spec, blink)
        if key not in cache: cache[key] = scene_spr(spec, blink)
        return cache[key]
    B = []
    for i, (txt, spec, sub) in enumerate(beats):
        n = txt.count("\n")+1
        ty = 430 if n < 3 else 360
        tl, yb = tlayer(txt, ty, 96 if n < 3 else 84)
        sl = tlayer(sub, yb+10, 50, sub=True)[0] if sub else None
        kind = S.parse(spec)[0][0]
        B.append(dict(t0=T[i][0], t1=T[i][1], tl=tl, sl=sl, spec=spec, kind=kind, fx=S.parse(spec)[1], txt=txt,
                      pop=(i == 0 or beats[i-1][1] != spec), blinky=kind in OPEN, sleep=S.is_sleep(spec)))
        scn(spec)
        if kind in OPEN: scn(spec, True)
    rr = random.Random(idx)
    hearts = [Spr(heart(56+8*i, PINK, seed=i)) for i in range(3)]
    spk = [Spr(sparkle(40+12*i, (255, 214, 90), i)) for i in range(3)]
    zl = [tlayer("z", 0, s)[0] for s in (60, 48, 38)]
    snow = [(rr.uniform(0, RW), rr.uniform(0, RH), rr.uniform(5, 11), rr.uniform(50, 110), rr.uniform(0, 6)) for _ in range(70)]
    rain = [(rr.uniform(0, RW), rr.uniform(0, RH), rr.uniform(700, 1000)) for _ in range(60)]
    music(f"{OUT}/_a{idx}.wav", DUR, idx)
    cmds = ["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{RW}x{RH}", "-r", str(FPS), "-i", "-",
            "-i", f"{OUT}/_a{idx}.wav", "-c:v", "libx264", "-preset", "veryfast", "-crf", "18", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "160k", "-shortest", "-movflags", "+faststart", path]
    pr = subprocess.Popen(cmds, stdin=subprocess.PIPE)
    white = np.full((RH, RW, 3), 255, np.float32)
    NF = int(DUR*FPS)
    prev_frames = {int(T[i][0]*FPS)+40 for i in range(len(T))}
    for fi in range(NF):
        t = fi/FPS; fr = white.copy()
        bi = max(0, max(i for i in range(len(B)) if B[i]["t0"] <= t or i == 0))
        b = B[bi]; a = t-b["t0"]
        # ambient fx behind cats
        if b["fx"] == "snow":
            for x, y, r_, v, ph in snow:
                yy = (y+v*t) % (RH+40)-20; xx = x+18*math.sin(t*0.8+ph)
                cv2.circle(fr, (int(xx), int(yy)), int(r_), (196, 214, 244), -1, cv2.LINE_AA)
        if b["fx"] == "rain":
            for x, y, v in rain:
                yy = (y+v*t) % (RH+60)-30
                cv2.line(fr, (int(x), int(yy)), (int(x-5), int(yy+30)), (150, 186, 236), 5, cv2.LINE_AA)
        # cats
        br = 1+0.014*math.sin(t*2.6)
        sc = 1.0; dy = 0; rot = 0
        if b["pop"] and bi > 0: sc = 0.88+0.12*ease_out_back(a/0.4, 1.6)
        al = clamp(a/0.12) if (b["pop"] and bi > 0) else 1
        txt = b["txt"].lower()
        if txt.startswith("in") or "\nin" in txt: br = 1+0.07*ease_io(a/2.4)
        elif "out..." in txt: br = 1.07-0.07*ease_io(a/2.4)
        if ":stand" in b["spec"] and ("sparkle" in b["spec"] or "happy" in b["spec"]): dy = abs(math.sin(a*math.pi*1.25))*45
        elif "shock" in b["spec"] and a < 0.5: dy = math.sin(a/0.5*math.pi)*60
        if b["kind"] == "hug": rot = 2.0*math.sin(a*2.0)
        elif b["kind"] in ("m", "t", "mh", "th", "mp", "mb", "tb"): rot = 1.6*math.sin(t*1.3)
        if b["sleep"]: br = 1+0.02*math.sin(t*1.6)
        blink = b["blinky"] and ((t+bi*0.7) % 3.3) > 3.12 and a > 0.5
        spr = scn(b["spec"], blink)
        blit(fr, spr, 540, GY-dy, sc*br, sc*(2-br), rot, al)
        # fx in front
        if b["fx"] == "hearts":
            for j in range(16):
                t0 = 0.35+j*0.22; c = a-t0
                if c < 0 or c > 3.0: continue
                x0 = 540+((j*137) % 520-260); yy = GY-330-90*c
                al2 = clamp(c/0.3)*clamp((3.0-c)/0.8)*clamp((yy-760)/120)
                blit(fr, hearts[j % 3], x0+20*math.sin(c*2+j), yy, 0.75+0.25*clamp(c/0.3), rot=10*math.sin(c*2+j), alpha=al2)
        if b["fx"] == "sparkles":
            for j, (px, py) in enumerate([(-260, -260), (270, -200), (190, -380), (-170, -420), (300, 20)]):
                ph = t*2.4+j*1.7
                blit(fr, spk[j % 3], 540+px*K/1.4, GY+py*K/1.4, 0.7+0.25*math.sin(ph), rot=t*25+j*40, alpha=(0.55+0.45*math.sin(ph))*clamp(a/0.3))
        if b["sleep"]:
            for j in range(3):
                c = (t*0.6+j/3) % 1
                blit(fr, zl[j], 540+250*K+60*c*K, GY-260*K-150*c*K, alpha=math.sin(math.pi*c))
        # text
        for bb in B:
            a2, b2 = t-bb["t0"], bb["t1"]-t
            if a2 < 0 or b2 < -0.01: continue
            last = bb is B[-1]
            first = bb is B[0]
            alt = (1 if first else ease_io(a2/0.25))*(1 if last else ease_io(b2/0.25))
            blit(fr, bb["tl"], RW/2, bb["tl"].ay+(0 if first else int(14*(1-ease_io(a2/0.25)))), alpha=alt)
            if bb["sl"] is not None:
                c = a2-0.35
                if c > 0: blit(fr, bb["sl"], RW/2, bb["sl"].ay, alpha=ease_io(c/0.4)*(1 if last else ease_io(b2/0.3)))
        out = np.clip(fr, 0, 255).astype(np.uint8)
        if fi == 12: os.makedirs(f"{OUT}/covers", exist_ok=True); Image.fromarray(out).save(f"{OUT}/covers/{idx+1:02d}_{name}.jpg", quality=92)
        if preview and fi in prev_frames: Image.fromarray(out).save(f"{OUT}/_p{idx:02d}_{fi:03d}.jpg", quality=88)
        pr.stdin.write(out.tobytes())
    pr.stdin.close(); pr.wait(); os.remove(f"{OUT}/_a{idx}.wav")
    return path, DUR

if __name__ == "__main__":
    sel = sys.argv[1:]
    for idx, (name, cap, beats) in enumerate(REELS):
        if sel and str(idx) not in sel and name not in sel: continue
        p, d = build(idx, name, beats, preview=True); print("reel", idx, name, round(d, 1), flush=True)
