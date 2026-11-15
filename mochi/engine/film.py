import math, random, subprocess, os
import numpy as np, cv2
import mreel as MR
from mreel import blit, tlayer, crop_spr, music, ease_io, ease_out_back, clamp, RW, RH, FPS, Spr
from soft import *
import scenes as S, carousels as C
OUT = "/tmp/claude-0/cats/mochi/films"; os.makedirs(OUT, exist_ok=True)
FLOOR = 1190

SKY = {"morning": ((176, 214, 250), "sun"), "noon": ((150, 200, 250), "sun"), "sunset": ((255, 178, 150), "sunset"), "night": ((58, 64, 120), "moon")}

def room(sky):
    col, body = SKY[sky]
    cv = Image.new("RGBA", (RW, RH), (255, 244, 232, 255))
    d = ImageDraw.Draw(cv)
    d.rectangle((0, FLOOR, RW, RH), fill=(236, 216, 204))
    for y in (FLOOR+90, FLOOR+230, FLOOR+420): d.line((0, y, RW, y), fill=(226, 202, 190), width=4)
    d.line((0, FLOOR, RW, FLOOR), fill=(42, 34, 50), width=7)
    # window
    put(cv, rect_prop(400, 470, (255, 255, 255), 7, screen=col), 290, 660)
    wx, wy = 290, 660
    if body == "sun": d.ellipse((wx+30, wy-120, wx+100, wy-50), fill=(255, 226, 120))
    if body == "sunset": d.ellipse((wx-40, wy+20, wx+60, wy+120), fill=(255, 220, 150))
    if body == "moon":
        d.ellipse((wx+20, wy-130, wx+100, wy-50), fill=(255, 246, 210)); d.ellipse((wx+46, wy-146, wx+120, wy-70), fill=col)
        r = random.Random(1)
        for _ in range(9):
            x, y = r.uniform(wx-120, wx+120), r.uniform(wy-150, wy+150); d.ellipse((x-3, y-3, x+3, y+3), fill=(255, 250, 230))
    d.line((wx, wy-170, wx, wy+170), fill=(255, 255, 255), width=12); d.line((wx-130, wy, wx+130, wy), fill=(255, 255, 255), width=12)
    # door
    put(cv, rect_prop(300, 640, (214, 182, 160), 8), 860, FLOOR-300)
    d.ellipse((760, FLOOR-320, 786, FLOOR-294), fill=(42, 34, 50))
    # little plant + frame
    put(cv, rect_prop(150, 120, (255, 214, 226), 9, screen=(255, 236, 242)), 620, 470)
    put(cv, heart(44, PINK, seed=5), 620, 470)
    put(cv, rect_prop(560, 90, (206, 196, 255), 4, stripes=(190, 180, 250)), 560, FLOOR+170)
    arr = np.asarray(cv.convert("RGB")).astype(np.float32)
    return arr

def spr(spec, u=180, blink=False):
    cv = Image.new("RGBA", (RW, RH), (0, 0, 0, 0))
    S.draw(cv, spec, FLOOR-10, u, zz=False, blink=blink)
    return crop_spr(cv, (540, FLOOR-10))[0]

def cam(fr, z, cx=540, cy=1100, sx=0, sy=0):
    if abs(z-1) < 1e-3 and not sx and not sy: return fr
    M = np.float32([[z, 0, (1-z)*cx+sx], [0, z, (1-z)*cy+sy]])
    return cv2.warpAffine(fr, M, (RW, RH), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)

def film_long_day():
    rooms = {k: room(k) for k in SKY}
    cream = np.full((RH, RW, 3), (255, 244, 232), np.float32)
    sp = {s: spr(s) for s in ["mt:happy,happy", "m:stare", "m:dot", "m:pout", "m:cry", "ts", "hug:cry,happy", "mt:shock,shock", "mt:sparkle,sparkle"]}
    sp_bl = {s: spr(s, blink=True) for s in ["mt:happy,happy", "m:stare", "m:dot"]}
    big_hug = spr("hug:love,love", 230)
    hearts = [Spr(heart(60+10*i, PINK, seed=i)) for i in range(3)]
    zl = [tlayer("z", 0, s)[0] for s in (54, 44, 34)]
    def sub(t):
        if t == "click!": return tlayer(t, 470, 150)[0]
        if t.startswith('YOU'): return tlayer(t, 440, 140)[0]
        return tlayer(t, 1500, 74)[0]
    def stamp(t): return tlayer(t, 300, 56, sub=True)[0]
    # scenes: (t0, t1, room, [(spec, x)], stamp, subtitle, cam(z0,z1,cx,cy))
    SC = [
        (3.4, 8.0, "morning", [("mt:happy,happy", 500)], "8:00 am", "bye! come back soon!", (1.0, 1.08, 500, 1150)),
        (8.0, 11.6, "noon", [("m:stare", 690)], "10:00 am", "mochi waited by the door", (1.0, 1.06, 690, 1150)),
        (11.6, 15.0, "noon", [("ts", 330), ("m:dot", 700)], "1:00 pm", "toast took a nap (his third)", (1.02, 1.0, 540, 1150)),
        (15.0, 18.6, "sunset", [("m:pout", 700)], "5:00 pm", "you're usually home by now", (1.0, 1.1, 700, 1150)),
        (18.6, 23.0, "night", [("m:cry", 700)], "9:00 pm", "maybe they forgot about us...", (1.05, 1.28, 700, 1120)),
        (23.0, 27.0, "night", [("hug:cry,happy", 640)], None, "toast: they'd never forget us", (1.15, 1.22, 640, 1120)),
        (27.0, 28.8, "night", [("mt:shock,shock", 580)], None, "click!", (1.0, 1.0, 540, 1100)),
        (28.8, 32.2, "night", [("mt:sparkle,sparkle", 580)], None, "YOU'RE *HOME*", (1.0, 1.0, 540, 1100)),
    ]
    SC = [s+(sub(s[5]), stamp(s[4]) if s[4] else None) for s in SC]
    title = [tlayer("mochi & toast in", 680, 60, sub=True)[0], tlayer("the *long* day", 860, 130)[0]]
    end = [tlayer("the end", 380, 110)[0], tlayer("send this to the one who\nalways waits for you", 1560, 56, sub=True)[0]]
    DUR = 37.0
    music(f"{OUT}/_a.wav", DUR, 11)
    path = f"{OUT}/film01_the_long_day.mp4"
    cmds = ["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{RW}x{RH}", "-r", str(FPS), "-i", "-",
            "-i", f"{OUT}/_a.wav", "-c:v", "libx264", "-preset", "veryfast", "-crf", "18", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "160k", "-shortest", "-movflags", "+faststart", path]
    pr = subprocess.Popen(cmds, stdin=subprocess.PIPE)
    prev = set(int(x*FPS) for x in (2.0, 6, 10, 13.5, 17, 21, 25, 28, 30.5, 34.5))
    for fi in range(int(DUR*FPS)):
        t = fi/FPS
        if t < 3.4:
            fr = cream.copy()
            for i, L in enumerate(title):
                blit(fr, L, RW/2, L.ay+int(12*(1-ease_io((t-0.3-i*0.5)/0.5))), alpha=ease_io((t-0.3-i*0.5)/0.5)*ease_io((3.4-t)/0.4))
        elif t < 32.2:
            s = next(s for s in SC if s[0] <= t < s[1]); t0, t1, rk, cast, st, subt, (z0, z1, cx, cy), SL, STL = s
            a = t-t0; fr = rooms[rk].copy()
            for spec, x in cast:
                br = 1+0.014*math.sin(t*2.6); dy = 0; rot = 1.2*math.sin(t*1.3)
                if spec == "ts": br = 1+0.02*math.sin(t*1.6); rot = 0
                if "shock" in spec: dy = math.sin(clamp(a/0.45)*math.pi)*70
                if "sparkle" in spec:  # run toward camera
                    p = ease_io(a/1.6); dy = abs(math.sin(a*math.pi*2.2))*40*(1-p)
                    sc = 1+0.75*p
                    blit(fr, sp[spec], x+(540-x)*p, FLOOR-10+330*p-dy, sc*br, sc*(2-br), 0); continue
                blink = spec in sp_bl and ((t+x/300) % 3.2) > 3.04
                img = (sp_bl if blink else sp)[spec]
                pop = 0.92+0.08*ease_out_back(a/0.4) if "hug" in spec else 1
                blit(fr, img, x, FLOOR-10-dy, pop*br, pop*(2-br), rot if "hug" not in spec else 2*math.sin(a*2))
                if spec == "ts":
                    for j in range(3):
                        c = (t*0.6+j/3) % 1
                        blit(fr, zl[j], x+170+50*c, FLOOR-230-120*c, alpha=math.sin(math.pi*c))
            if "sparkle" in cast[0][0]:
                for j in range(18):
                    c = a-0.6-j*0.1
                    if 0 <= c <= 2.4:
                        yy = 1050-160*c; al = clamp(c/0.25)*clamp((2.4-c)/0.7)
                        blit(fr, hearts[j % 3], 540+((j*151) % 640-320)+20*math.sin(c*2+j), yy, 0.9, rot=10*math.sin(c*2+j), alpha=al)
            z = z0+(z1-z0)*ease_io(a/(t1-t0))
            shx = shy = 0
            if subt == "click!" and a < 0.5: shx = 14*math.sin(a*70)*(1-a/0.5)
            fr = cam(fr, z, cx, cy, shx, shy)
            if rk == 'night': fr = fr*np.array((0.88, 0.89, 0.98), np.float32)
            elif rk == 'sunset': fr = fr*np.array((1.0, 0.94, 0.9), np.float32)
            # dip to cream on cuts
            fade = min(clamp(a/0.3), clamp((t1-t)/0.25)) if t0 > 3.4 else clamp(a/0.5)
            if subt in ("click!", "YOU'RE *HOME*") or (t0 == 23.0): fade = 1 if subt != "click!" else clamp((t1-t)/0.05+1)
            if fade < 1: fr = fr*fade+np.array((255, 244, 232), np.float32)*(1-fade)
            if STL: blit(fr, STL, 120+ STL.arr.shape[1]/2-0, STL.ay, alpha=ease_io((a-0.2)/0.4))
            big = subt in ("click!",)
            blit(fr, SL, RW/2, SL.ay, sx=1, alpha=ease_io((a-0.35)/0.35)*clamp((t1-t)/0.2+0.0001 if t1 < 32.2 else 1))
        else:
            a = t-32.2; fr = cream.copy()
            blit(fr, big_hug, 540, 1220, 0.9+0.1*ease_out_back(a/0.5), rot=2*math.sin(a*2))
            for j in range(14):
                c = a-0.3-j*0.18
                if 0 <= c <= 3:
                    yy = 820-110*c; blit(fr, hearts[j % 3], 540+((j*137) % 560-280), yy, 0.8, alpha=clamp(c/0.3)*clamp((3-c)/0.8)*clamp((yy-520)/100))
            blit(fr, end[0], RW/2, end[0].ay, alpha=ease_io((a-0.6)/0.5))
            blit(fr, end[1], RW/2, end[1].ay, alpha=ease_io((a-1.4)/0.5))
            fr = fr*clamp(a/0.4)+cream*(1-clamp(a/0.4))
        out = np.clip(fr, 0, 255).astype(np.uint8)
        if fi in prev: Image.fromarray(out).save(f"{OUT}/_f{fi:04d}.jpg", quality=85)
        pr.stdin.write(out.tobytes())
    pr.stdin.close(); pr.wait(); os.remove(f"{OUT}/_a.wav")
    return path

if __name__ == "__main__":
    print(film_long_day())
