"""Mochi & Toast mini-movies: data-driven episodes (room / outdoor sets, time stamps, camera moves, subtitles)."""
import math, random, subprocess, os, sys
import numpy as np, cv2
import mreel as MR
from mreel import blit, tlayer, crop_spr, music, ease_io, ease_out_back, clamp, RW, RH, FPS, Spr
from soft import *
import scenes as S, carousels as C
import film as F
OUT = F.OUT; FLOOR = F.FLOOR
CREAM = (255, 244, 232)

def outdoor(kind):
    sky, ground, extra = {
        "snowday": ((206, 224, 246), (250, 252, 255), "snow"),
        "spring": ((190, 222, 252), (186, 224, 170), "flowers"),
        "summer": ((160, 210, 255), (170, 214, 150), "sun"),
        "autumn": ((255, 222, 196), (232, 196, 150), "leaves"),
    }[kind]
    cv = Image.new("RGBA", (RW, RH), sky+(255,)); d = ImageDraw.Draw(cv)
    put(cv, cloud(360, 150, 1), 260, 420); put(cv, cloud(280, 120, 2), 820, 560)
    d.rectangle((0, FLOOR, RW, RH), fill=ground); d.line((0, FLOOR, RW, FLOOR), fill=(42, 34, 50), width=7)
    r = random.Random(3)
    if extra == "sun": d.ellipse((780, 180, 940, 340), fill=(255, 220, 110))
    if extra == "flowers":
        for i in range(9): put(cv, flower(54, [(255, 182, 206), (255, 236, 150), (206, 196, 255)][i % 3], seed=i), r.uniform(60, 1020), r.uniform(FLOOR+60, FLOOR+520))
    if extra == "leaves":
        for i in range(14):
            x, y = r.uniform(40, 1040), r.uniform(FLOOR+40, FLOOR+560); c = [(236, 140, 90), (246, 186, 96), (214, 110, 90)][i % 3]
            d.ellipse((x-16, y-9, x+16, y+9), fill=c)
    if extra == "snow":
        for i in range(5):
            x = r.uniform(0, RW); d.ellipse((x-140, FLOOR-34, x+140, FLOOR+40), fill=(250, 252, 255))
        d.line((0, FLOOR+40, RW, FLOOR+40), fill=(250, 252, 255), width=2)
    return np.asarray(cv.convert("RGB")).astype(np.float32)

BGS = {}
def bg(k):
    if k not in BGS:
        if k in F.SKY: BGS[k] = F.room(k)
        elif k == "storm": BGS[k] = F.room("night")
        elif k == "snowroom": BGS[k] = F.room("noon")
        else: BGS[k] = outdoor(k)
    return BGS[k]

SPR = {}
def sp(spec, u=180, blink=False):
    k = (spec, u, blink)
    if k not in SPR: SPR[k] = F.spr(spec, u, blink)
    return SPR[k]

WIN = (110, 445, 470, 875)  # window glass area

def episode(slug, title, scenes, cta, seed):
    """scenes: list of dicts d, bg, cast[(spec,x)], stamp, sub, cam(z0,z1,cx,cy), fx, big"""
    cream = np.full((RH, RW, 3), CREAM, np.float32)
    hearts = [Spr(heart(60+10*i, PINK, seed=i)) for i in range(3)]
    zl = [tlayer("z", 0, s)[0] for s in (54, 44, 34)]
    rr = random.Random(seed)
    snow = [(rr.uniform(0, RW), rr.uniform(0, RH), rr.uniform(5, 11), rr.uniform(50, 110), rr.uniform(0, 6)) for _ in range(80)]
    rain = [(rr.uniform(WIN[0], WIN[2]), rr.uniform(WIN[1], WIN[3]), rr.uniform(700, 1000)) for _ in range(26)]
    T0 = 3.2; t = T0; SC = []
    for s in scenes:
        s = dict(s); s["t0"] = t; s["t1"] = t+s["d"]; t += s["d"]
        s["SL"] = tlayer(s["sub"], 440 if s.get("big") else 1500, 140 if s.get("big") else 72)[0] if s.get("sub") else None
        s["STL"] = tlayer(s["stamp"], 300, 56, sub=True)[0] if s.get("stamp") else None
        for spec, x in s["cast"]: sp(spec, s.get("u", 180)); sp(spec, s.get("u", 180), True)
        bg(s["bg"]); SC.append(s)
    TEND = t; DUR = TEND+4.2
    big_hug = sp("hug:love,love", 230)
    tparts = title.split("|")
    tl = [tlayer("mochi & toast in", 680, 60, sub=True)[0], tlayer(tparts[0], 860, 120)[0]]
    end = [tlayer("the end", 380, 110)[0], tlayer(cta, 1560, 56, sub=True)[0]]
    music(f"{OUT}/_a{seed}.wav", DUR, seed)
    path = f"{OUT}/{slug}.mp4"
    cmds = ["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{RW}x{RH}", "-r", str(FPS), "-i", "-",
            "-i", f"{OUT}/_a{seed}.wav", "-c:v", "libx264", "-preset", "veryfast", "-crf", "18", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "160k", "-shortest", "-movflags", "+faststart", path]
    pr = subprocess.Popen(cmds, stdin=subprocess.PIPE)
    prevs = {int((s["t0"]+s["d"]*0.6)*FPS) for s in SC} | {int(1.5*FPS), int((TEND+2.5)*FPS)}
    os.makedirs(f"{OUT}/covers", exist_ok=True)
    for fi in range(int(DUR*FPS)):
        t = fi/FPS
        if t < T0:
            fr = cream.copy()
            for i, L in enumerate(tl):
                aa = ease_io((t-0.15-i*0.4)/0.45) if fi > 0 else 1
                if i == 1 and fi < 6: aa = 1
                blit(fr, L, RW/2, L.ay, alpha=(1 if t < 0.6 else aa)*ease_io((T0-t)/0.35))
        elif t < TEND:
            s = next(s for s in SC if s["t0"] <= t < s["t1"]); a = t-s["t0"]; dd = s["d"]
            fr = bg(s["bg"]).copy()
            if s.get("fx") == "rain" or s["bg"] == "storm":
                for x, y, v in rain:
                    yy = WIN[1]+((y-WIN[1])+v*t) % (WIN[3]-WIN[1])
                    cv2.line(fr, (int(x), int(yy)), (int(x-5), int(min(WIN[3], yy+30))), (150, 186, 236), 5, cv2.LINE_AA)
            if s["bg"] == "snowroom":
                for x, y, r_, v, ph in snow[:30]:
                    xx = WIN[0]+(x % (WIN[2]-WIN[0])); yy = WIN[1]+((y+v*t) % (WIN[3]-WIN[1]))
                    cv2.circle(fr, (int(xx), int(yy)), int(r_*0.7), (255, 255, 255), -1, cv2.LINE_AA)
            u = s.get("u", 180)
            for spec, x in s["cast"]:
                br = 1+0.014*math.sin(t*2.6); dy = 0; rot = 1.2*math.sin(t*1.3)
                if S.is_sleep(spec): br = 1+0.02*math.sin(t*1.6); rot = 0
                if "shock" in spec: dy = math.sin(clamp(a/0.45)*math.pi)*70
                if s.get("motion") == "run":
                    p = ease_io(a/1.6); dy = abs(math.sin(a*math.pi*2.2))*40*(1-p); sc = 1+0.75*p
                    blit(fr, sp(spec, u), x+(540-x)*p, FLOOR-10+330*p-dy, sc*br, sc*(2-br), 0); continue
                if s.get("motion") == "hop": dy = abs(math.sin(a*math.pi*1.4))*50
                if s.get("motion") == "walk":
                    x = x+s.get("dx", 0)*ease_io(a/dd); dy = abs(math.sin(a*math.pi*2.4))*14; rot = 3*math.sin(a*math.pi*2.4)
                blink = ((t+x/300) % 3.2) > 3.04
                img = sp(spec, u, blink)
                hugging = spec.startswith("hug")
                pop = 0.92+0.08*ease_out_back(a/0.4) if hugging else 1
                blit(fr, img, x, FLOOR-10-dy, pop*br, pop*(2-br), 2*math.sin(a*2) if hugging else rot)
                if S.is_sleep(spec):
                    for j in range(3):
                        c = (t*0.6+j/3) % 1
                        blit(fr, zl[j], x+170+50*c, FLOOR-230-120*c, alpha=math.sin(math.pi*c))
            if s.get("fx") == "snow" or s["bg"] == "snowday":
                for x, y, r_, v, ph in snow:
                    yy = (y+v*t) % (RH+40)-20; xx = x+18*math.sin(t*0.8+ph)
                    cv2.circle(fr, (int(xx), int(yy)), int(r_), (255, 255, 255), -1, cv2.LINE_AA)
                    cv2.circle(fr, (int(xx), int(yy)), int(r_), (200, 214, 240), 2, cv2.LINE_AA)
            if s.get("fx") == "hearts":
                for j in range(16):
                    c = a-0.5-j*0.12
                    if 0 <= c <= 2.4:
                        yy = 1000-160*c; al = clamp(c/0.25)*clamp((2.4-c)/0.7)
                        blit(fr, hearts[j % 3], 540+((j*151) % 640-320)+20*math.sin(c*2+j), yy, 0.9, rot=10*math.sin(c*2+j), alpha=al)
            z0, z1, cx, cy = s.get("cam", (1.0, 1.06, 540, 1150))
            z = z0+(z1-z0)*ease_io(a/dd); shx = 0
            if s.get("shake") and a < 0.5: shx = 14*math.sin(a*70)*(1-a/0.5)
            fr = F.cam(fr, z, cx, cy, shx, 0)
            if s["bg"] in ("night", "storm"): fr = fr*np.array((0.88, 0.89, 0.98), np.float32)
            elif s["bg"] == "sunset": fr = fr*np.array((1.0, 0.94, 0.9), np.float32)
            if s["bg"] == "storm" and s.get("flash") is not None and 0 <= a-s["flash"] < 0.35:
                k = 1-(a-s["flash"])/0.35; fr = fr*(1-0.7*k)+255*0.7*k
            cut_in = s.get("cut", True)
            fade = clamp(a/0.3) if cut_in else 1
            fade = min(fade, clamp((s["t1"]-t)/0.25) if s.get("cut_out", True) and s is not SC[-1] else 1)
            if s is SC[0]: fade = clamp(a/0.45)
            if fade < 1: fr = fr*fade+np.array(CREAM, np.float32)*(1-fade)
            if s["STL"] is not None: blit(fr, s["STL"], 120+s["STL"].arr.shape[1]/2, s["STL"].ay, alpha=ease_io((a-0.2)/0.4))
            if s["SL"] is not None: blit(fr, s["SL"], RW/2, s["SL"].ay, alpha=ease_io((a-0.3)/0.35)*clamp((s["t1"]-t)/0.2))
        else:
            a = t-TEND; fr = cream.copy()
            blit(fr, big_hug, 540, 1220, 0.9+0.1*ease_out_back(a/0.5), rot=2*math.sin(a*2))
            for j in range(14):
                c = a-0.3-j*0.18
                if 0 <= c <= 3:
                    yy = 820-110*c; blit(fr, hearts[j % 3], 540+((j*137) % 560-280), yy, 0.8, alpha=clamp(c/0.3)*clamp((3-c)/0.8)*clamp((yy-520)/100))
            blit(fr, end[0], RW/2, end[0].ay, alpha=ease_io((a-0.6)/0.5))
            blit(fr, end[1], RW/2, end[1].ay, alpha=ease_io((a-1.4)/0.5))
            fr = fr*clamp(a/0.4)+cream*(1-clamp(a/0.4))
        out = np.clip(fr, 0, 255).astype(np.uint8)
        if fi == 10: Image.fromarray(out).save(f"{OUT}/covers/{slug}.jpg", quality=92)
        if fi in prevs: Image.fromarray(out).save(f"{OUT}/_e{seed:02d}_{fi:04d}.jpg", quality=85)
        pr.stdin.write(out.tobytes())
    pr.stdin.close(); pr.wait(); os.remove(f"{OUT}/_a{seed}.wav")
    return path, DUR

def D(d, bg, cast, sub=None, stamp=None, **k): return dict(d=d, bg=bg, cast=cast, sub=sub, stamp=stamp, **k)

EPISODES = [
 ("film02_the_first_snow", "the first *snow*", "send this to your winter person", [
   D(3.6, "snowroom", [("mt:stare,stare", 520)], "mochi: is that... *snow*?", "7:00 am", cam=(1.0, 1.08, 400, 900)),
   D(3.2, "snowday", [("t:sparkle:stand", 540)], "toast ran outside first", motion="hop"),
   D(3.2, "snowday", [("t:happy:stand", 600)], "he tried to catch one"),
   D(3.0, "snowday", [("t:cry", 600)], "it melted...", cam=(1.0, 1.2, 600, 1120)),
   D(3.4, "snowday", [("hug:happy,cry", 560)], "mochi: i'll catch you a new one"),
   D(3.6, "snowroom", [("mh:mug:happy", 330), ("th:mug:happy", 750)], "then they went inside for cocoa", "9:00 am"),
   D(3.4, "snowroom", [("mt:love,love", 540)], "best first snow *ever*", fx="hearts", cam=(1.0, 1.1, 540, 1120)),
 ]),
 ("film03_the_last_cookie", "the last *cookie*", "tag the one who eats your snacks", [
   D(3.2, "noon", [("mh:cookie:sparkle", 540)], "mochi saved the last cookie", "12:00 pm"),
   D(3.0, "noon", [("ms", 420)], "for after her nap"),
   D(3.0, "noon", [("th:cookie:smug", 700)], "toast found it", ),
   D(2.4, "noon", [("t:shock", 700)], "it's gone", cam=(1.0, 1.25, 700, 1100), shake=True),
   D(3.4, "noon", [("m:pout", 420), ("t:cry", 760)], "mochi: ...where's my cookie", cam=(1.0, 1.06, 560, 1150)),
   D(3.4, "sunset", [("th:flower:pout", 600)], "toast tried to make it right", "5:00 pm"),
   D(3.0, "sunset", [("th:letter:pout", 600)], "he wrote a sorry letter", ),
   D(3.4, "sunset", [("give:t:cookie:happy:sparkle", 540)], "and baked her a new one", cam=(1.0, 1.1, 540, 1120)),
   D(3.4, "night", [("hug:love,love", 560)], "(he only ate half)", fx="hearts", stamp="8:00 pm"),
 ]),
 ("film04_the_thunderstorm", "the *storm*", "send this to someone scared of storms", [
   D(3.4, "storm", [("ss+cap", 540)], "a quiet night...", "11:00 pm", cam=(1.0, 1.06, 540, 1150)),
   D(2.4, "storm", [("mt:shock,shock", 560)], "BOOM", big=True, flash=0.0, shake=True),
   D(3.2, "storm", [("m:cry", 600)], "mochi is scared of thunder", cam=(1.0, 1.2, 600, 1120)),
   D(3.2, "storm", [("t:pout", 600)], "toast is scared too", cam=(1.0, 1.15, 600, 1120)),
   D(3.4, "storm", [("t:sparkle:stand", 600)], "but he's being *brave*", flash=1.6),
   D(3.6, "storm", [("hug:cry,happy", 560)], "toast: i'm right here", cam=(1.1, 1.2, 560, 1120)),
   D(3.4, "storm", [("ss+cap", 540)], "they fell asleep like that"),
   D(3.4, "morning", [("mt:happy,happy", 540)], "and the sun came back", "7:00 am", fx="hearts"),
 ]),
 ("film05_the_box", "the *gift*", "tag who you're getting a gift for", [
   D(3.4, "noon", [("m:stare", 540)], "mochi wanted to get toast a gift", "dec 20"),
   D(3.0, "noon", [("mh:letter:stare", 540)], "she made a list"),
   D(3.0, "noon", [("mthink:pout:heart", 540)], "a heart? too small"),
   D(3.0, "noon", [("mthink:pout:star", 540)], "a star? too far away"),
   D(3.2, "sunset", [("mh:gift:sparkle+santa", 540)], "so she wrapped a *box*", "dec 24"),
   D(3.4, "night", [("give:m:gift:happy:sparkle+santa", 540)], "toast opened it", "dec 25", cam=(1.0, 1.1, 540, 1120)),
   D(3.4, "night", [("tbox:love+santa", 540)], "his favorite gift was the box"),
   D(3.4, "night", [("hug:love,love+santa", 560)], "(the real gift was mochi)", fx="hearts"),
 ]),
 ("film06_a_year_with_you", "a year with *you*", "send this to who got you through this year", [
   D(3.4, "spring", [("mt:happy,happy", 540)], "in spring we picked flowers", "spring"),
   D(3.4, "summer", [("ss", 540)], "in summer we napped in the sun", "summer"),
   D(3.4, "autumn", [("th:cookie:love", 540)], "in fall toast ate everything", "fall"),
   D(3.4, "snowday", [("mt:sparkle,sparkle", 540)], "in winter we saw the first snow", "winter"),
   D(3.4, "night", [("m:happy", 460), ("t:happy", 700)], "every season was better", cam=(1.0, 1.08, 560, 1150)),
   D(3.8, "night", [("hug:love,love", 560)], "because of *you*", fx="hearts", cam=(1.05, 1.2, 560, 1120)),
 ]),
]

if __name__ == "__main__":
    sel = sys.argv[1:]
    for i, (slug, title, cta, scenes) in enumerate(EPISODES):
        if sel and slug not in sel and str(i) not in sel: continue
        p, d = episode(slug, title, scenes, cta, 20+i); print("film", slug, round(d, 1), flush=True)
