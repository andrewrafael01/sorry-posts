import sys, math, random, subprocess, wave
import numpy as np, cv2
import soft
soft.H = 1920
from soft import *
import bg as BG
RW, RH = 1080, 1920
FPS = 30
OUT = "/tmp/claude-0/cats/reels"

def small(img, k=1.0):
    return img.resize((max(1, int(img.width*k/SS)), max(1, int(img.height*k/SS))), Image.LANCZOS)

class Spr:
    def __init__(self, img, anchor=None, k=1.0):
        if anchor is None: anchor = (img.width/2, img.height/2)
        self.im = small(img, k); self.a = (anchor[0]*k/SS, anchor[1]*k/SS)
        arr = np.asarray(self.im).astype(np.float32)/255.0
        arr[..., :3] *= arr[..., 3:4]
        self.arr = arr
    @staticmethod
    def cat(who, mood, u=210, pose="sit", flip=False, k=1.0, **kw):
        img, anc, f = cat(who, pose, mood, u, 1 if who == "mochi" else 2, **kw)
        if flip:
            img = ImageOps.mirror(img); anc = (img.width-anc[0], anc[1])
        return Spr(img, anc, k)

def blit(fr, s, X, Y, sx=1, sy=None, rot=0, alpha=1.0):
    if sy is None: sy = sx
    if alpha <= 0.001: return
    th = math.radians(rot); c, sn = math.cos(th), math.sin(th)
    A = np.array([[c*sx, -sn*sy], [sn*sx, c*sy]])
    h, w = s.arr.shape[:2]
    corners = np.array([[0, 0], [w, 0], [w, h], [0, h]], float)-np.array(s.a)
    pts = corners@A.T+np.array([X, Y])
    x0, y0 = np.floor(pts.min(0)).astype(int)-2; x1, y1 = np.ceil(pts.max(0)).astype(int)+2
    x0c, y0c, x1c, y1c = max(0, x0), max(0, y0), min(RW, x1), min(RH, y1)
    if x1c <= x0c or y1c <= y0c: return
    t = np.array([X-x0c, Y-y0c]) - A@np.array(s.a)
    M = np.hstack([A, t[:, None]]).astype(np.float32)
    reg = cv2.warpAffine(s.arr, M, (x1c-x0c, y1c-y0c), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_CONSTANT, borderValue=(0, 0, 0, 0))
    reg = np.clip(reg, 0, 1)*alpha
    d = fr[y0c:y1c, x0c:x1c]
    d[:] = reg[..., :3]*255.0 + d*(1-reg[..., 3:4])

def ease_out_back(t, s=1.9):
    t = min(max(t, 0), 1)-1
    return t*t*((s+1)*t+s)+1
def ease_io(t):
    t = min(max(t, 0), 1); return t*t*(3-2*t)
def clamp(x, a=0, b=1): return max(a, min(b, x))

def make_bg():
    m = BG.sunset(3).convert("RGB")
    base = np.zeros((RH, RW, 3), np.float32)
    top = np.asarray(m)[0].astype(np.float32)
    off = RH-m.height
    base[off:] = np.asarray(m)
    # extend sky upward with a soft vertical gradient from deeper blue
    for y in range(off):
        t = y/off
        base[y] = (np.array([255, 205, 196])*(1-t)+top*t)
    return base

def text_layer(t, y, size=132, **kw):
    lay = Image.new("RGBA", (RW, RH), (0, 0, 0, 0))
    text(lay, t, y, size, col=(255, 255, 255), shadow=True, accent=(255, 200, 222), **kw)
    arr = np.asarray(lay).astype(np.float32)/255.0
    arr[..., :3] *= arr[..., 3:4]
    s = Spr.__new__(Spr); s.arr = arr; s.a = (RW/2, y+size*0.6); s.im = lay
    return s

def music(path, dur):
    sr = 44100; n = int(sr*dur); y = np.zeros(n)
    def note(f, t0, d, amp=0.22):
        i0 = int(t0*sr); m = int(d*sr); tt = np.arange(m)/sr
        if i0 >= n: return
        env = np.exp(-tt*3.2)*(1-np.exp(-tt*300))
        w = np.sin(2*np.pi*f*tt)+0.35*np.sin(2*np.pi*2*f*tt)*np.exp(-tt*5)+0.12*np.sin(2*np.pi*3*f*tt)*np.exp(-tt*9)
        seg = amp*env*w
        e = min(n, i0+m); y[i0:e] += seg[:e-i0]
    C = {"C4":261.63,"D4":293.66,"E4":329.63,"G4":392.0,"A4":440.0,"C5":523.25,"D5":587.33,"E5":659.25,"G5":784.0,"A3":220.0,"G3":196.0,"F4":349.23,"F3":174.61,"C3":130.81}
    bar = 60/92*2
    mel = ["E5","G5","A4","C5","D5","E5","G4","A4"]
    prog = [("C3",["E4","G4","C5"]),("A3",["C4","E4","A4"]),("F3",["A4","C5","F4"]),("G3",["G4","D4","D5"])]
    t = 0; bi = 0
    while t < dur-0.5:
        root, ch = prog[bi % 4]
        note(C[root], t, bar*1.6, 0.20)
        for j, c in enumerate(ch): note(C[c], t+j*bar/6, bar, 0.09)
        rr = random.Random(bi)
        for j in range(8):
            if rr.random() < 0.8: note(C[mel[(j+bi*3) % len(mel)]], t+j*bar/4, 0.9, 0.16)
        t += bar; bi += 1
    # light echo
    d = int(0.27*sr); echo = np.zeros_like(y); echo[d:] = y[:-d]*0.35; y = y+echo
    y *= np.clip(np.minimum(np.arange(n)/(sr*0.3), (n-np.arange(n))/(sr*1.0)), 0, 1)
    y = y/np.max(np.abs(y))*0.55
    with wave.open(path, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes((y*32767).astype(np.int16).tobytes())

def sheen(): pass

def build_reel1(path, preview=None):
    DUR = 12.0; N = int(DUR*FPS)
    bgm = make_bg()
    GY = 1150
    BS = 0.82  # ground
    cats = {}
    for who in ("mochi", "toast"):
        for mood in ("dot", "happy", "sparkle", "love"):
            cats[(who, mood)] = Spr.cat(who, mood, 215, flip=(who == "toast"))
    hug = {}
    for who in ():
        for mood in ("love", "happy"):
            hug[(who, mood)] = Spr.cat(who, mood, 215, flip=(who == "toast"), hatch=True)
    hearts = [Spr(heart(70+10*i, PINK, seed=i)) for i in range(4)]
    spark = [Spr(sparkle(60+14*i, (255, 214, 90), seed=i)) for i in range(3)]
    clouds = [Spr(cloud(300+60*i, 120+20*i, seed=i)) for i in range(3)]
    texts = [
        (0.0, 3.4, text_layer("pov: you just\ngot home", 330)),
        (3.4, 6.7, text_layer("they heard\nthe keys", 330)),
        (6.7, 9.6, text_layer("and *ran* to you", 330)),
        (9.6, 12.0, text_layer("best part of\n*my day*", 330)),
    ]
    cta = text_layer("follow for daily\nmochi + toast", 1480, size=72)
    rr = random.Random(7)
    parts = []
    for i in range(46):
        parts.append(dict(t0=8.15+i*0.075+rr.uniform(0, 0.05), x=540+rr.uniform(-150, 150), vx=rr.uniform(-60, 60), v=rr.uniform(160, 300), k=rr.randrange(4), ph=rr.uniform(0, 6.28), sz=rr.uniform(0.7, 1.25)))
    sp = [dict(t0=3.4+rr.uniform(0, 3.0), x=rr.uniform(160, 920), y=rr.uniform(700, 1150), k=rr.randrange(3), life=rr.uniform(0.6, 1.0)) for _ in range(16)]
    cmds = ["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{RW}x{RH}", "-r", str(FPS), "-i", "-",
            "-i", OUT+"/music.wav", "-c:v", "libx264", "-preset", "veryfast", "-crf", "17", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "160k", "-shortest", "-movflags", "+faststart", path]
    pr = subprocess.Popen(cmds, stdin=subprocess.PIPE)
    blink = lambda t, off: ((t+off) % 3.1) < 0.14
    for fi in range(N):
        t = fi/FPS
        fr = bgm.copy()
        for i, (sx_, sy_, ph_) in enumerate([(130,760,0),(930,820,1.5),(210,980,3),(880,1000,4.5),(540,700,2)]):
            blit(fr, spark[i%3], sx_, sy_, 0.55+0.18*math.sin(t*2.4+ph_), rot=t*20+ph_*30, alpha=0.5+0.4*math.sin(t*2.4+ph_))
        # positions
        side = 255
        run = ease_io((t-6.7)/1.6)            # run to centre
        gap = side*(1-run)+158*run
        lx, rx = 540-gap, 540+gap
        # hop
        def hop(t0, t1, n, h):
            if t < t0 or t > t1: return 0.0, 1.0, 1.0
            p = (t-t0)/(t1-t0)*n; f = p % 1
            y = abs(math.sin(math.pi*f))*h
            sq = 1.0
            if f < 0.12: sq = 0.9+0.1*(f/0.12)
            return y, 1/sq*0.0+ (1.0+(1-sq)*0.5), sq
        scene = 1 if t < 3.4 else 2 if t < 6.7 else 3 if t < 9.6 else 4
        if scene == 1:
            hy1 = hy2 = 0; sy1 = sy2 = 1+0.018*math.sin(t*3.0); sx1 = sx2 = 1
            m1 = m2 = "dot"
        elif scene == 2:
            hy1, sx1, sy1 = hop(3.45, 6.6, 4, 70); hy2, sx2, sy2 = hop(3.6, 6.6, 4, 70)
            m1 = m2 = "sparkle"
        elif scene == 3:
            hy1, sx1, sy1 = hop(6.7, 8.3, 4, 90); hy2, sx2, sy2 = hy1, sx1, sy1
            m1 = m2 = "sparkle"
        else:
            hy1 = hy2 = 0; sx1 = sx2 = 1; sy1 = sy2 = 1
            m1 = m2 = "love"
        tilt = 3.0*math.sin(t*1.7) if scene == 1 else 0
        if scene == 1 and blink(t, 0): m1 = "happy"
        if scene == 1 and blink(t, 0.9): m2 = "happy"
        # intro pop
        pop = ease_out_back(t/0.6)
        hugging = t >= 8.3
        if not hugging:
            sM = cats[("mochi", m1)]; sT = cats[("toast", m2)]
            blit(fr, sM, lx, GY-hy1, BS*sx1*pop, BS*sy1*pop, tilt)
            blit(fr, sT, rx, GY-hy2, BS*sx2*pop, BS*sy2*pop, -tilt)
        else:
            rock = 3.2*math.sin((t-8.3)*3.2)
            bob = 5*math.sin((t-8.3)*6.0)
            mo = "love"
            blit(fr, cats[("toast", "love")], 540+158, GY-bob, BS*(1+0.012*math.sin((t-8.3)*6)), BS*(1-0.012*math.sin((t-8.3)*6)), -7+rock*0.5)
            blit(fr, cats[("mochi", "love")], 540-158, GY-bob, BS*(1+0.012*math.sin((t-8.3)*6)), BS*(1-0.012*math.sin((t-8.3)*6)), 7+rock*0.5)
        # shadows are baked in bg hills; skip
        # sparkles
        for s in sp:
            a = (t-s["t0"])/s["life"]
            if 0 <= a <= 1 and scene in (2, 3):
                blit(fr, spark[s["k"]], s["x"], s["y"]-30*a, 0.6+0.6*math.sin(math.pi*a), rot=a*90, alpha=math.sin(math.pi*a))
        # hearts
        for p in parts:
            a = t-p["t0"]
            if 0 <= a <= 3.2:
                y = GY-300-p["v"]*a; x = p["x"]+p["vx"]*a+30*math.sin(a*2.2+p["ph"])
                al = clamp(a/0.25)*clamp((3.2-a)/0.9)*clamp((y-640)/160)
                blit(fr, hearts[p["k"]], x, y, p["sz"]*(0.8+0.2*clamp(a/0.3)), rot=8*math.sin(a*2+p["ph"]), alpha=al)
        # texts
        for t0, t1, lay in texts:
            a = t-t0; b = t1-t
            if a < 0 or b < -0.05: continue
            sc = ease_out_back(a/0.4)*1.0
            al = clamp(a/0.18)*(clamp(b/0.18) if t1 < DUR-0.01 else 1)
            blit(fr, lay, RW/2, lay.a[1], 0.55+0.45*sc if a < 0.4 else 1+0.012*math.sin(t*4), alpha=al)
        if t > 10.4:
            a = t-10.4
            blit(fr, cta, RW/2, cta.a[1], 0.6+0.4*ease_out_back(a/0.4), alpha=clamp(a/0.25))
        if preview and fi in preview:
            Image.fromarray(np.clip(fr, 0, 255).astype(np.uint8)).save(f"{OUT}/prev_{fi:03d}.jpg", quality=92)
        pr.stdin.write(np.clip(fr, 0, 255).astype(np.uint8).tobytes())
    pr.stdin.close(); pr.wait()

if __name__ == "__main__":
    music(OUT+"/music.wav", 12.0)
    build_reel1(OUT+"/reel01_welcome_home.mp4", preview={20, 100, 170, 230, 290, 340})
