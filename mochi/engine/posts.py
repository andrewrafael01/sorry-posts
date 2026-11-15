import sys, os, random, math
from soft import *
import bg as BG
OUT = "/tmp/claude-0/cats/soft"; os.makedirs(OUT, exist_ok=True)
WHITE = (255, 255, 255)
POSTS = {}
def post(name):
    def deco(fn): POSTS[name] = fn; return fn
    return deco

def wob_rect(cv, x0, y0, x1, y1, w=7, seed=0, col=(42, 34, 50), fill=None):
    r = random.Random(seed); pts = []
    for (a, b) in [((x0, y0), (x1, y0)), ((x1, y0), (x1, y1)), ((x1, y1), (x0, y1)), ((x0, y1), (x0, y0))]:
        n = 14
        for i in range(n):
            t = i/n; pts.append((a[0]+(b[0]-a[0])*t+r.uniform(-2, 2), a[1]+(b[1]-a[1])*t+r.uniform(-2, 2)))
    d = ImageDraw.Draw(cv)
    if fill: d.polygon(pts, fill=fill)
    d.line(pts+[pts[0], pts[1]], fill=col, width=w, joint="curve")

def zzz(cv, x, y, col=(42, 34, 50), s=60):
    for i, k in enumerate((1.0, 0.75, 0.55)):
        text(cv, "z", y-i*s*0.9, int(s*k), col=col, x=x+i*s*0.7)

def marks(cv, x, y, col=(42, 34, 50)):
    text(cv, "!!", y, 80, col=col, x=x, rot=-10)

# ------------------------------------------------------------ singles
@post("01_hi")
def _():
    cv = canvas(); text(cv, "hi", 360, 170)
    put_cat(cv, 540, 930, "mochi", "stand", "happy", 200, seed=2, arms="wave")
    put(cv, sparkle(56), 250, 520); put(cv, sparkle(34), 320, 450, 10)
    return cv

@post("02_enough")
def _():
    cv = canvas(); text(cv, "you did enough\ntoday", 290, 96)
    put_cat(cv, 520, 930, "toast", "loaf", "sleep", 175, seed=5)
    put(cv, rect_prop(560, 200, (206, 226, 255), 3, stripes=(176, 204, 248)), 470, 1060)
    zzz(cv, 820, 700)
    text(cv, "rest now. i'll watch the door", 1270, 52, fname="patrick", col=(150, 140, 170))
    return cv

@post("03_warmspot")
def _():
    cv = canvas(); text(cv, "i saved you\nthe *warm* spot", 290, 96)
    put_cat(cv, 380, 940, "mochi", "loaf", "happy", 150, seed=7)
    put(cv, rect_prop(300, 170, (255, 222, 230), 4, stripes=(255, 200, 214)), 800, 1030)
    put(cv, heart(70), 800, 1010)
    put(cv, sparkle(40), 700, 880); put(cv, sparkle(28), 900, 900)
    return cv

@post("04_thinking")
def _():
    cv = canvas(); text(cv, "thinking of you rn", 220, 92)
    put(cv, cloud(560, 380, 2), 640, 560)
    put_cat(cv, 640, 600, "toast", "sit", "happy", 72, seed=3)
    put(cv, heart(40), 800, 470); put(cv, heart(28), 480, 500)
    put(cv, cloud(80, 66, 4), 430, 830); put(cv, cloud(50, 42, 5), 380, 905)
    put_cat(cv, 320, 1110, "mochi", "sit", "love", 140, seed=8, hatch=True)
    return cv

@post("05_napstack")
def _():
    cv = canvas(); text(cv, "nap time with my\n*favorite* person", 250, 92)
    put_cat(cv, 540, 1080, "toast", "loaf", "sleep", 165, seed=4)
    put_cat(cv, 500, 820, "mochi", "loaf", "sleep", 110, seed=9)
    zzz(cv, 800, 640)
    return cv

@post("06_guard")
def _():
    cv = canvas(); text(cv, "guarding my\nfavorite person", 250, 96)
    put_cat(cv, 660, 900, "toast", "sit", "happy", 150, seed=6, flip=True)
    put_cat(cv, 400, 1010, "mochi", "sit", "pout", 160, seed=11)
    marks(cv, 200, 700)
    put(cv, heart(44), 860, 560); put(cv, heart(30), 920, 640, -15)
    return cv

@post("07_yourday")
def _():
    cv = canvas()
    text(cv, "you, telling me\nabout your day", 200, 52, x=285, maxw=520)
    text(cv, "me, *very*\n*invested*", 200, 52, x=800, maxw=480)
    put(cv, bubble(330, 220, "bl", 3), 330, 520)
    text(cv, "and THEN-", 505, 42, x=330, fname="patrick")
    put_cat(cv, 270, 950, "toast", "stand", "happy", 130, seed=2, arms="wave")
    put_cat(cv, 800, 1000, "mochi", "sit", "sparkle", 140, seed=12)
    put(cv, heart(40), 930, 700); put(cv, sparkle(36), 660, 720)
    return cv

@post("08_miss")
def _():
    cv = canvas(); text(cv, "i mi u", 330, 150)
    put_cat(cv, 540, 950, "toast", "sit", "cry", 200, seed=13)
    text(cv, "that's it. that's the post", 1290, 52, fname="patrick", col=(150, 140, 170))
    return cv

@post("09_water")
def _():
    cv = canvas(); text(cv, "drink some water.\ni'm watching", 250, 96)
    put_cat(cv, 540, 1390, "mochi", "sit", "stare", 330, seed=14, tail=False)
    return cv

@post("10_us")
def _():
    cv = canvas(); text(cv, "us :3", 330, 150)
    put_cat(cv, 410, 920, "mochi", "sit", "happy", 165, seed=15, hatch=True)
    put_cat(cv, 670, 930, "toast", "sit", "happy", 165, seed=16, flip=True, hatch=True)
    put(cv, heart(56), 540, 560); put(cv, heart(34), 440, 520, 15); put(cv, heart(34), 650, 510, -15)
    return cv

@post("11_reminder")
def _():
    cv = canvas(BG.meadow(3))
    text(cv, "small reminder:\nyou're doing better\nthan you think", 270, 92, col=WHITE, shadow=True)
    f = put_cat(cv, 760, 1120, "mochi", "stand", "happy", 120, seed=17, arms="hold")
    put(cv, flower(80), (f["paws"][0][0]+f["paws"][1][0])/2, f["paws"][0][1]-25)
    for p in f["paws"]: paw(cv, p[0], p[1], "mochi", 36)
    return cv

@post("12_nightnight")
def _():
    cv = canvas(BG.night(4))
    text(cv, "night night.\nsleep well, ok?", 300, 100, col=WHITE, shadow=True)
    put_cat(cv, 470, 1080, "toast", "loaf", "sleep", 135, seed=18)
    zzz(cv, 700, 900, col=WHITE)
    return cv

@post("13_rain")
def _():
    cv = canvas(BG.rain(5))
    text(cv, "rainy days are\nfor *cuddles*", 280, 104, col=WHITE, shadow=True, accent=(255, 196, 220))
    put_cat(cv, 640, 1080, "toast", "loaf", "sleep", 130, seed=19, flip=True)
    put_cat(cv, 440, 1050, "mochi", "sit", "sleep", 120, seed=20)
    put(cv, heart(40), 540, 830)
    return cv

@post("14_sunset")
def _():
    cv = canvas(BG.sunset(6))
    text(cv, "i'd watch every\nsunset with you", 260, 100, col=WHITE, shadow=True)
    put_cat(cv, 440, 1110, "mochi", "sit", "happy", 110, seed=21)
    put_cat(cv, 640, 1115, "toast", "sit", "happy", 110, seed=22, flip=True)
    put(cv, heart(40), 540, 900)
    return cv

@post("15_compliment")
def _():
    cv = canvas(); text(cv, "me after one (1)\ncompliment", 250, 96)
    put_cat(cv, 540, 900, "mochi", "sit", "love", 185, seed=23, rot=170, hatch=True)
    for (x, y, s, r) in [(250, 640, 56, 15), (830, 660, 48, -10), (300, 1180, 36, -20), (800, 1170, 42, 12), (900, 900, 30, 0)]:
        put(cv, heart(s), x, y, r)
    return cv

@post("16_loading")
def _():
    cv = canvas(); text(cv, "loading love\nfor you...", 260, 100)
    d = ImageDraw.Draw(cv)
    wob_rect(cv, 140, 470, 760, 560, 8, 3, fill=(255, 255, 255))
    wob_rect(cv, 150, 480, 940, 550, 0, 4, col=(255, 160, 190), fill=(255, 160, 190))
    wob_rect(cv, 140, 470, 760, 560, 8, 3)
    text(cv, "247%", 660, 90, col=PINK, x=880)
    text(cv, "error: too much love", 740, 52, fname="patrick", col=(150, 140, 170))
    f = put_cat(cv, 540, 1080, "toast", "stand", "sparkle", 135, seed=24, arms="hold")
    put(cv, heart(110), (f["paws"][0][0]+f["paws"][1][0])/2, f["paws"][0][1]-35)
    for p in f["paws"]: paw(cv, p[0], p[1], "toast", 40)
    return cv

@post("17_levels")
def _():
    cv = canvas(); text(cv, "how much i\nlike you:", 250, 100, x=540)
    rows = [("a little", False), ("a lot", False), ("a lot a lot", False), ("more than snacks", True)]
    for i, (t, ck) in enumerate(rows):
        y = 540+i*125
        wob_rect(cv, 150, y-58, 220, y+12, 7, i)
        if ck: text(cv, "x", y+5, 110, col=PINK, x=188)
        text(cv, t, y, 72, x=260, align="left", col=(PINK if ck else (42, 34, 50)))
    put_cat(cv, 790, 1110, "mochi", "sit", "sparkle", 135, seed=25)
    put(cv, sparkle(36), 640, 980)
    return cv

@post("18_distracting")
def _():
    cv = canvas(); text(cv, "stop being cute\nit's distracting", 260, 100)
    put_cat(cv, 540, 950, "toast", "sit", "squint", 195, seed=26, hatch=True, blush=1.4)
    put(cv, heart(46), 230, 720, 15); put(cv, heart(36), 860, 700, -12); put(cv, heart(28), 820, 1150)
    return cv

@post("19_favorite")
def _():
    cv = canvas(); text(cv, "if you're reading this\nyou're my favorite", 250, 88)
    f = put_cat(cv, 540, 980, "mochi", "stand", "sparkle", 165, seed=27, arms="hold")
    put(cv, heart(150), (f["paws"][0][0]+f["paws"][1][0])/2, f["paws"][0][1]-40)
    for p in f["paws"]: paw(cv, p[0], p[1], "mochi", 46)
    put(cv, sparkle(44), 230, 700); put(cv, sparkle(30), 860, 650)
    return cv

@post("20_cookie")
def _():
    cv = canvas(); text(cv, "i'd share my last\ncookie with you", 250, 96)
    f = put_cat(cv, 540, 1000, "toast", "stand", "smug", 160, seed=28, arms="hold")
    put(cv, cookie(110), (f["paws"][0][0]+f["paws"][1][0])/2, f["paws"][0][1]-25)
    for p in f["paws"]: paw(cv, p[0], p[1], "toast", 44)
    text(cv, "(after thinking about it for a while)", 1290, 48, fname="patrick", col=(150, 140, 170))
    return cv

@post("21_blep")
def _():
    cv = canvas(); text(cv, "blep", 360, 170, col=PINK)
    put_cat(cv, 540, 960, "mochi", "sit", "blep", 210, seed=29)
    return cv

@post("22_mean")
def _():
    cv = canvas(); text(cv, "me when someone\nis mean to you", 250, 96)
    put_cat(cv, 540, 980, "toast", "stand", "pout", 165, seed=30, arms="up")
    marks(cv, 850, 620); text(cv, "#@!", 700, 60, col=PINK, x=230, rot=12)
    return cv

@post("23_coffee")
def _():
    cv = canvas(); text(cv, "coffee date?\n(it's mostly milk)", 250, 96)
    f = put_cat(cv, 540, 1000, "mochi", "stand", "happy", 160, seed=31, arms="hold")
    put(cv, mug(120), (f["paws"][0][0]+f["paws"][1][0])/2+8, f["paws"][0][1]-35)
    for p in f["paws"]: paw(cv, p[0], p[1], "mochi", 44)
    return cv

@post("24_hug")
def _():
    cv = canvas(); text(cv, "send this to someone\nwho deserves a hug", 250, 88)
    put_cat(cv, 640, 960, "toast", "sit", "happy", 160, seed=32, flip=True, hatch=True)
    put_cat(cv, 420, 990, "mochi", "sit", "happy", 160, seed=33, hatch=True)
    paw(cv, 560, 820, "mochi", 50, 1); paw(cv, 520, 1000, "toast", 50, 2)
    put(cv, heart(50), 540, 600); put(cv, sparkle(36), 250, 620); put(cv, sparkle(30), 840, 640)
    return cv

@post("25_late")
def _():
    cv = canvas(); text(cv, "sorry i'm late\ni was busy *missing you*", 250, 88)
    put_cat(cv, 540, 960, "mochi", "sit", "cry", 185, seed=34)
    put(cv, heart(40), 820, 620, -10)
    return cv

# ------------------------------------------------------------ comic grid
@post("26_comic_flowers")
def _():
    cv = canvas()
    pw, ph = 495, 600; xs = [30, 555]; ys = [60, 690]
    caps = ["i got you a flower", "and another one", "i couldn't stop", "anyway. i love you"]
    for i in range(4):
        x0, y0 = xs[i % 2], ys[i//2]
        wob_rect(cv, x0, y0, x0+pw, y0+ph, 7, i)
        cx = x0+pw/2
        text(cv, caps[i], y0+85, 46, x=cx, maxw=pw-40)
        if i < 3:
            f = put_cat(cv, cx, y0+400, "mochi", "stand", "happy" if i < 2 else "squint", 80, seed=40+i, arms="hold")
            mx = (f["paws"][0][0]+f["paws"][1][0])/2
            n = [1, 2, 7][i]
            for k in range(n):
                put(cv, flower(48 if i < 2 else 46, [(255, 182, 206), (255, 236, 150), (206, 196, 255)][k % 3], seed=k),
                    mx+(k-(n-1)/2)*(46 if i < 2 else 30), f["paws"][0][1]-28-(abs(k-(n-1)/2)*-6 if i == 2 else 0)-(30 if i == 2 and k % 2 else 0))
            for p in f["paws"]: paw(cv, p[0], p[1], "mochi", 24)
        else:
            put_cat(cv, cx-80, y0+420, "mochi", "sit", "happy", 70, seed=50, hatch=True)
            put_cat(cv, cx+90, y0+420, "toast", "sit", "sparkle", 70, seed=51, flip=True)
            put(cv, heart(40), cx, y0+260)
    return cv

# ------------------------------------------------------------ carousels
@post("C1_met_1")
def _():
    cv = canvas(); text(cv, "this is mochi", 300, 110)
    put_cat(cv, 540, 940, "mochi", "sit", "dot", 190, seed=60); return cv
@post("C1_met_2")
def _():
    cv = canvas(BG.rain(7)); text(cv, "mochi was a little\nlonely", 280, 100, col=WHITE, shadow=True)
    put_cat(cv, 540, 1060, "mochi", "loaf", "cry", 150, seed=61); return cv
@post("C1_met_3")
def _():
    cv = canvas(); text(cv, "then toast sat down\nright next to mochi", 260, 78)
    put_cat(cv, 380, 960, "mochi", "sit", "shock", 160, seed=62)
    put_cat(cv, 690, 960, "toast", "sit", "happy", 160, seed=63, flip=True)
    put(cv, sparkle(50), 540, 640); return cv
@post("C1_met_4")
def _():
    cv = canvas(BG.meadow(8)); text(cv, "they've been sitting\nthere ever since", 270, 100, col=WHITE, shadow=True)
    put_cat(cv, 430, 1090, "mochi", "loaf", "sleep", 120, seed=64)
    put_cat(cv, 680, 1090, "toast", "loaf", "sleep", 120, seed=65, flip=True)
    put(cv, heart(46), 555, 900); return cv

@post("C2_text_1")
def _():
    cv = canvas(); text(cv, "waiting for you\nto text back", 260, 100)
    put_cat(cv, 470, 1000, "toast", "loaf", "stare", 150, seed=70)
    put(cv, rect_prop(140, 240, (60, 56, 76), 2, screen=(226, 232, 255)), 860, 1020, -8)
    return cv
@post("C2_text_2")
def _():
    cv = canvas(); text(cv, "YOU TEXTED BACK", 280, 110, col=PINK)
    put_cat(cv, 540, 980, "toast", "stand", "sparkle", 175, seed=71, arms="up")
    for (x, y, s) in [(200, 560, 50), (880, 560, 44), (170, 1000, 36), (900, 980, 40), (300, 1250, 30)]:
        put(cv, sparkle(s), x, y)
    put(cv, heart(44), 760, 1220); return cv

if __name__ == "__main__":
    only = sys.argv[1:]
    for k, fn in POSTS.items():
        if only and not any(k.startswith(o) for o in only): continue
        save(fn(), f"{OUT}/{k}.jpg"); print(k, flush=True)
