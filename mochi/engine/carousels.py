import sys, os, random
from soft import *
import bg as BG
from posts import wob_rect, zzz, marks
ROOT = "/tmp/claude-0/cats/carousels"
WHITE = (255, 255, 255); GREY = (150, 140, 170)
CAR = {}
def car(name, caption):
    def deco(fn): CAR[name] = (fn, caption); return fn
    return deco

def slide(title, bgname=None, size=92, y=260, seed=0, accent=PINK):
    if bgname:
        cv = canvas(getattr(BG, bgname)(seed))
        if title: text(cv, title, y, size, col=WHITE, shadow=True, accent=(255, 200, 222))
    else:
        cv = canvas()
        if title: text(cv, title, y, size, accent=accent)
    return cv

def sub(cv, t, y=1280, size=48):
    text(cv, t, y, size, fname="patrick", col=GREY)

def hold(cv, who, prop, X=540, Y=1000, u=160, mood="happy", seed=1, dy=-30, ps=44, flip=False):
    f = put_cat(cv, X, Y, who, "stand", mood, u, seed=seed, arms="hold", flip=flip)
    put(cv, prop, (f["paws"][0][0]+f["paws"][1][0])/2, f["paws"][0][1]+dy)
    for p in f["paws"]: paw(cv, p[0], p[1], who, ps, seed)
    return f

def duo(cv, y=960, u=160, m=("happy", "happy"), gap=135, seed=0, hatch=False):
    put_cat(cv, 540-gap, y, "mochi", "sit", m[0], u, seed=seed+1, hatch=hatch)
    put_cat(cv, 540+gap, y+6, "toast", "sit", m[1], u, seed=seed+2, flip=True, hatch=hatch)

def hug(cv, y=980, u=160, m=("happy", "happy"), seed=0):
    put_cat(cv, 640, y-20, "toast", "sit", m[1], u, seed=seed+2, flip=True, hatch=True)
    put_cat(cv, 420, y, "mochi", "sit", m[0], u, seed=seed+1, hatch=True)
    paw(cv, 615, y-60*u/160, "mochi", int(52*u/160), 1)

def say(cv, t, X, Y, w=420, h=260, tail="bl", size=48, seed=0):
    from soft import _wrap
    put(cv, bubble(w, h, tail, seed), X, Y)
    d = ImageDraw.Draw(cv); sz = int(size*1.25); mw = w*0.72
    while True:
        lines = _wrap(d, [t], font("gaegu", sz), mw)
        if len(lines)*sz*1.02 <= h*0.48 or sz < 26: break
        sz -= 3
    y0 = Y-0.08*h-len(lines)*sz*1.02/2+sz*0.78
    text(cv, t, y0, sz/1.25, x=X, maxw=mw, lh=1.02, fit=False)

def think(cv, X, Y, w=520, h=360, seed=0):
    put(cv, cloud(w, h, seed), X, Y)
    put(cv, cloud(int(w*0.15), int(w*0.12), seed+1), X-w*0.38, Y+h*0.62)
    put(cv, cloud(int(w*0.09), int(w*0.075), seed+2), X-w*0.47, Y+h*0.8)

def phone(cv, X, Y, rot=-8): put(cv, rect_prop(140, 240, (60, 56, 76), 2, screen=(226, 232, 255)), X, Y, rot)
def blanket(cv, X, Y, w=560, col=(206, 226, 255), st=(176, 204, 248)): put(cv, rect_prop(w, 200, col, 3, stripes=st), X, Y)
def hearts(cv, pts):
    for x, y, s, *r in pts: put(cv, heart(s), x, y, r[0] if r else 0)
def sparks(cv, pts):
    for x, y, s in pts: put(cv, sparkle(s), x, y)

def window(cv, x0, y0, x1, y1):
    wob_rect(cv, x0, y0, x1, y1, 8, 7, fill=(196, 222, 255))
    d = ImageDraw.Draw(cv); mx, my = (x0+x1)//2, (y0+y1)//2
    d.line([(mx, y0), (mx+2, y1)], fill=(42, 34, 50), width=7); d.line([(x0, my), (x1, my+2)], fill=(42, 34, 50), width=7)
    for cx, cy in [(x0+70, y0+60), (x1-80, my+60)]:
        d.ellipse((cx-40, cy-16, cx+40, cy+16), fill=(255, 255, 255))

def door(cv, x0, y0, x1, y1):
    wob_rect(cv, x0, y0, x1, y1, 8, 9, fill=(222, 186, 150))
    ImageDraw.Draw(cv).ellipse((x1-60, (y0+y1)//2-14, x1-32, (y0+y1)//2+14), fill=(255, 214, 90), outline=(42, 34, 50), width=5)

# ============================================================ 1
@car("01_when_youre_not_home", "things mochi does when you're not home (the last one is real) 🥺 #cutecat #catmemes #wholesome #fyp")
def c1():
    s = []
    cv = slide("things mochi does\nwhen *you're not home*"); put_cat(cv, 540, 960, "mochi", "sit", "dot", 190, seed=1); s.append(cv)
    cv = slide("1. sits by the door"); door(cv, 620, 520, 900, 1180); put_cat(cv, 400, 1030, "mochi", "loaf", "stare", 130, seed=2); sub(cv, "for 4 hours"); s.append(cv)
    cv = slide("2. naps on your hoodie"); blanket(cv, 540, 1060, 640, (200, 200, 214), (180, 180, 198)); put_cat(cv, 520, 960, "mochi", "loaf", "sleep", 150, seed=3); zzz(cv, 820, 720); sub(cv, "it smells like you"); s.append(cv)
    cv = slide("3. checks the window\nevery 5 minutes", size=86); window(cv, 160, 480, 640, 900); put_cat(cv, 760, 1060, "mochi", "stand", "stare", 140, seed=4, arms="down"); s.append(cv)
    cv = slide("4. practices being\nmad at you"); put_cat(cv, 540, 980, "mochi", "sit", "pout", 185, seed=5); marks(cv, 860, 640); sub(cv, "(very mad. so mad.)"); s.append(cv)
    cv = slide("5. you come home"); door(cv, 160, 480, 440, 1150); put_cat(cv, 720, 1000, "mochi", "stand", "sparkle", 165, seed=6, arms="up"); sparks(cv, [(560, 560, 46), (930, 600, 36), (900, 1200, 30)]); sub(cv, "forgot to be mad"); s.append(cv)
    cv = slide("i missed you\n*so* much", size=100); hug(cv, 990, 165, seed=7); hearts(cv, [(540, 600, 56), (420, 560, 34, 15), (660, 550, 34, -15)]); s.append(cv)
    return s

# ============================================================ 2
@car("02_types_of_hugs", "which hug do you need today? 🫂 send this to them #cutecat #wholesome #couplegoals #fyp")
def c2():
    s = []
    cv = slide("types of hugs", size=120); put_cat(cv, 540, 960, "toast", "stand", "happy", 175, seed=10, arms="up"); hearts(cv, [(300, 620, 40, 12), (800, 640, 36, -10)]); s.append(cv)
    cv = slide("the quick hug"); duo(cv, 980, 155, ("happy", "dot"), 125, 11); sub(cv, "hi bye ok love you"); s.append(cv)
    cv = slide("the long hug"); hug(cv, 990, 165, ("sleep", "sleep"), 12); sub(cv, "nobody let go. ever."); s.append(cv)
    cv = slide("the 'i missed you'\nhug", size=90); hug(cv, 990, 165, ("cry", "happy"), 13); s.append(cv)
    cv = slide("the hug where you\nfall asleep", "night", 92, 280, 3); put_cat(cv, 640, 1100, "toast", "loaf", "sleep", 125, seed=14, flip=True); put_cat(cv, 430, 1070, "mochi", "loaf", "sleep", 110, seed=15); zzz(cv, 820, 860, WHITE); s.append(cv)
    cv = slide("the hug i need\nright now", size=96); hold(cv, "mochi", heart(140), 540, 990, 170, "sparkle", 16, -40, 46); sub(cv, "(from you. specifically.)"); s.append(cv)
    return s

# ============================================================ 3
@car("03_your_texts", "how i react to your texts 📱 the last one... #catmemes #relatable #couplememes #fyp")
def c3():
    s = []
    cv = slide("how i react to\n*your* texts", size=100); put_cat(cv, 470, 1020, "toast", "loaf", "stare", 150, seed=20); phone(cv, 860, 1030); s.append(cv)
    for i, (t, who, mood, extra) in enumerate([
        ("hey", "mochi", "happy", "smile so big it hurts"),
        ("good morning", "toast", "sparkle", "best morning of my life"),
        ("are you awake?", "mochi", "stare", "i am now. forever."),
        ("we need to talk", "toast", "cry", "packing my things"),
        ("jk i love you", "mochi", "love", "ok i'm unpacking")]):
        night = t == "are you awake?"
        cv = slide(None, "night" if night else None, seed=i)
        say(cv, f"\"{t}\"", 540, 330, 620, 280, "bl", 64, i)
        put_cat(cv, 540, 980, who, "sit", mood, 175, seed=21+i, hatch=(mood == "love"))
        if mood == "love": hearts(cv, [(260, 760, 46, 12), (820, 740, 40, -10), (870, 1150, 30)])
        if mood == "sparkle": sparks(cv, [(250, 760, 44), (830, 740, 36)])
        sub(cv, extra, 1280) if not night else text(cv, extra, 1280, 48, fname="patrick", col=WHITE, shadow=True)
        s.append(cv)
    return s

# ============================================================ 4
@car("04_day_in_the_life_toast", "a day in the life of toast 🍞 (6pm is the most important part) #cutecat #dayinthelife #catmemes #fyp")
def c4():
    s = []
    cv = slide("a day in the life\nof *toast*", size=100); put_cat(cv, 540, 980, "toast", "sit", "dot", 190, seed=30); s.append(cv)
    cv = slide("7am: refuses\nto wake up"); put_cat(cv, 520, 950, "toast", "loaf", "sleep", 170, seed=31); blanket(cv, 480, 1070); zzz(cv, 820, 700); s.append(cv)
    cv = slide("9am: healthy\nbreakfast"); hold(cv, "toast", cookie(110), 540, 1000, 160, "smug", 32, -25); text(cv, "(3 cookies)", 1270, 52, fname="patrick", col=GREY); s.append(cv)
    cv = slide("12pm: thinks\nabout you"); think(cv, 640, 560, 520, 360, 3); put_cat(cv, 640, 600, "mochi", "sit", "happy", 70, seed=33); put_cat(cv, 330, 1110, "toast", "sit", "love", 140, seed=34, hatch=True); s.append(cv)
    cv = slide("3pm: nap #2", "meadow", 104, 280, 4); put_cat(cv, 540, 1090, "toast", "loaf", "sleep", 130, seed=35); zzz(cv, 760, 900, WHITE); s.append(cv)
    cv = slide("6pm: waits for you\nto get home", size=90); door(cv, 640, 520, 920, 1180); put_cat(cv, 380, 1030, "toast", "loaf", "stare", 130, seed=36); s.append(cv)
    cv = slide("9pm: cuddles", size=104); hug(cv, 990, 165, ("sleep", "happy"), 37); hearts(cv, [(540, 600, 50)]); s.append(cv)
    cv = slide("11pm: says goodnight\nthinks about you again", "night", 82, 270, 5); put_cat(cv, 470, 1080, "toast", "loaf", "love", 130, seed=38); hearts(cv, [(700, 880, 40)]); s.append(cv)
    return s

# ============================================================ 5
@car("05_love_languages", "love languages but make it cats 💌 which one is yours? #lovelanguage #cutecat #wholesome #fyp")
def c5():
    s = []
    cv = slide("love languages\nbut it's us", size=104); duo(cv, 980, 160, ("happy", "happy"), 135, 40, True); hearts(cv, [(540, 640, 50)]); s.append(cv)
    cv = slide("words of\naffirmation"); say(cv, "you're so cute it's illegal", 600, 560, 560, 300, "bl", 50, 1); put_cat(cv, 380, 1060, "mochi", "sit", "happy", 150, seed=41); put_cat(cv, 820, 1080, "toast", "sit", "squint", 120, seed=42, flip=True, hatch=True); s.append(cv)
    cv = slide("quality time"); put_cat(cv, 430, 1050, "mochi", "loaf", "sleep", 120, seed=43); put_cat(cv, 680, 1060, "toast", "loaf", "sleep", 120, seed=44, flip=True); sub(cv, "doing nothing. together."); s.append(cv)
    cv = slide("gifts"); hold(cv, "toast", flower(110), 540, 1000, 165, "sparkle", 45, -30); sub(cv, "found it outside. it's yours now"); s.append(cv)
    cv = slide("physical touch"); hug(cv, 990, 165, ("happy", "love"), 46); s.append(cv)
    cv = slide("acts of service"); hold(cv, "mochi", mug(120), 540, 1000, 165, "happy", 47, -35); sub(cv, "made you coffee (it's mostly milk)"); s.append(cv)
    cv = slide("mine is all of them\nwith you", size=94); duo(cv, 990, 165, ("love", "love"), 130, 48, True); hearts(cv, [(540, 620, 56), (420, 580, 34, 15), (660, 570, 34, -15)]); s.append(cv)
    return s

# ============================================================ 6
@car("06_bad_day", "if you're having a bad day, this is for you 🌸 save this for later #wholesome #selfcare #cutecat #fyp")
def c6():
    s = []
    cv = slide("if you're having\na bad day..."); put_cat(cv, 540, 980, "mochi", "sit", "dot", 190, seed=50); s.append(cv)
    cv = slide("here's a hug"); hug(cv, 990, 165, seed=51); s.append(cv)
    cv = slide("here's a cookie"); hold(cv, "toast", cookie(120), 540, 1000, 165, "happy", 52, -25); sub(cv, "i only took one bite"); s.append(cv)
    cv = slide("here's a flower"); hold(cv, "mochi", flower(120, (255, 236, 150)), 540, 1000, 165, "sparkle", 53, -30); s.append(cv)
    cv = slide("here's a nap"); put_cat(cv, 520, 950, "toast", "loaf", "sleep", 170, seed=54); blanket(cv, 480, 1070, 560, (255, 222, 230), (255, 200, 214)); zzz(cv, 820, 700); s.append(cv)
    cv = slide("and a reminder:\nyou're *so* loved", "meadow", 100, 280, 9); put_cat(cv, 440, 1110, "mochi", "sit", "happy", 110, seed=55); put_cat(cv, 650, 1115, "toast", "sit", "happy", 110, seed=56, flip=True); hearts(cv, [(545, 900, 44)]); s.append(cv)
    return s

# ============================================================ 7
PICK = [("sleepy", "toast", "loaf", "sleep"), ("dramatic", "mochi", "sit", "cry"), ("clingy", "toast", "sit", "love"),
        ("chaotic", "mochi", "stand", "stare"), ("blep", "toast", "sit", "blep"), ("shy", "mochi", "sit", "squint")]
@car("07_pick_your_cat", "which one are you today? comment your number 👇 #whichoneareyou #cutecat #catmemes #fyp")
def c7():
    s = []
    cv = canvas(); text(cv, "which one are\nyou today?", 210, 92)
    for i, (n, who, pose, mood) in enumerate(PICK):
        x = 200+(i % 3)*340; y = 660+(i//3)*390
        put_cat(cv, x, y, who, pose, mood, 100 if pose != "loaf" else 85, seed=60+i, hatch=(mood == "squint"), arms="down")
        text(cv, f"{i+1}. {n}", y+205, 46, x=x)
    s.append(cv)
    subs = ["just 5 more minutes (6 hours)", "someone looked at me wrong", "don't leave. ever.", "AAAAAAA", "blep", "please don't look at me (look at me)"]
    for i, (n, who, pose, mood) in enumerate(PICK):
        cv = slide(f"{i+1}. {n}", size=110)
        put_cat(cv, 540, 980 if pose != "loaf" else 1000, who, pose, mood, 185 if pose != "loaf" else 160, seed=70+i, hatch=(mood in ("squint", "love")), arms="up")
        if mood == "love": hearts(cv, [(250, 720, 44, 12), (840, 700, 38, -10)])
        if mood == "stare": marks(cv, 880, 600)
        if pose == "loaf": zzz(cv, 830, 760)
        sub(cv, subs[i]); s.append(cv)
    cv = slide("comment your\nnumber", size=110); duo(cv, 990, 160, ("sparkle", "sparkle"), 135, 80); text(cv, "i'm a 3 for you", 1280, 52, fname="patrick", col=PINK); s.append(cv)
    return s

# ============================================================ 8
@car("08_mochi_tries_to_be_scary", "mochi tries to be scary 😼 (fails) #cutecat #catmemes #funny #fyp")
def c8():
    s = []
    cv = slide("mochi tries\nto be scary", size=104); put_cat(cv, 540, 980, "mochi", "sit", "pout", 190, seed=90); s.append(cv)
    cv = slide("rawr", size=110); put_cat(cv, 540, 990, "mochi", "stand", "pout", 160, seed=91, arms="up"); s.append(cv)
    cv = slide("RAWR!!!", size=150); put_cat(cv, 540, 990, "mochi", "stand", "pout", 185, seed=92, arms="up"); marks(cv, 860, 600); text(cv, "#@!", 650, 60, col=PINK, x=220, rot=12); s.append(cv)
    cv = slide("toast:"); put_cat(cv, 540, 980, "toast", "sit", "sparkle", 185, seed=93); say(cv, "omg so scary", 760, 560, 420, 230, "bl", 50, 2); s.append(cv)
    cv = slide("mochi:"); put_cat(cv, 540, 980, "mochi", "sit", "squint", 190, seed=94, hatch=True, blush=1.5); hearts(cv, [(260, 740, 40, 15), (820, 720, 36, -10)]); sub(cv, "...thank you"); s.append(cv)
    return s

# ============================================================ 9
@car("09_getting_ready_to_see_you", "getting ready to see you be like 🥹 #crush #cutecat #relatable #fyp")
def c9():
    s = []
    cv = slide("getting ready\nto see you", size=100); put_cat(cv, 540, 990, "toast", "stand", "happy", 175, seed=100, arms="wave"); s.append(cv)
    cv = slide("picked you\na flower"); hold(cv, "toast", flower(110), 540, 1000, 165, "happy", 101, -30); s.append(cv)
    cv = slide("practiced saying hi"); put_cat(cv, 540, 1000, "toast", "stand", "dot", 165, seed=102, arms="wave"); say(cv, "hi. hi! hiii. hey. hi", 600, 540, 560, 250, "bl", 46, 3); s.append(cv)
    cv = slide("got too nervous"); put_cat(cv, 540, 980, "toast", "sit", "cry", 185, seed=103); sub(cv, "what if i say hi wrong"); s.append(cv)
    cv = slide("you said hi first", size=96); put_cat(cv, 540, 990, "toast", "stand", "sparkle", 175, seed=104, arms="up"); sparks(cv, [(220, 640, 50), (870, 620, 40), (880, 1200, 30), (200, 1150, 34)]); s.append(cv)
    cv = slide("best day ever", "sunset", 104, 280, 11); put_cat(cv, 440, 1110, "mochi", "sit", "happy", 110, seed=105); put_cat(cv, 640, 1115, "toast", "sit", "love", 110, seed=106, flip=True, hatch=True); hearts(cv, [(540, 900, 44)]); s.append(cv)
    return s

# ============================================================ 10
@car("10_texts_im_too_shy_to_send", "texts i'm too shy to send 🙈 (send them for me) #crush #relatable #cutecat #fyp")
def c10():
    s = []
    cv = slide("texts i'm too shy\nto send", size=100); put_cat(cv, 470, 1020, "mochi", "loaf", "squint", 150, seed=110, hatch=True); phone(cv, 860, 1030); s.append(cv)
    for i, t in enumerate(["i miss you", "you looked really cute today", "i saved a meme for you (it's 47 memes)", "can we talk all night"]):
        cv = slide(None); say(cv, t, 540, 360, 680, 330, "bl", 60, i+5)
        put_cat(cv, 540, 1000, "mochi" if i % 2 == 0 else "toast", "sit", ["cry", "squint", "smug", "sparkle"][i], 175, seed=111+i, hatch=(i == 1))
        s.append(cv)
    cv = slide("what i actually sent:", size=88); say(cv, "lol", 540, 560, 320, 220, "bl", 80, 9); put_cat(cv, 540, 1060, "mochi", "loaf", "squint", 150, seed=116, hatch=True); s.append(cv)
    return s

# ============================================================ 11
@car("11_my_sleep_schedule", "my sleep schedule ever since i met you 🌙 #relatable #cutecat #3am #fyp")
def c11():
    s = []
    cv = slide("my sleep schedule\nsince i met you", size=96); put_cat(cv, 540, 990, "mochi", "sit", "sleep", 185, seed=120); s.append(cv)
    cv = slide("10pm: going to\nbed early", "night", 96, 280, 12); put_cat(cv, 520, 1050, "mochi", "loaf", "happy", 140, seed=121); blanket(cv, 480, 1150, 520, (206, 226, 255), (176, 204, 248)); s.append(cv)
    cv = slide("11pm: one more\nvideo", "night", 96, 280, 13); put_cat(cv, 450, 1060, "mochi", "loaf", "stare", 135, seed=122); phone(cv, 820, 1060); s.append(cv)
    cv = slide("1am: thinking\nabout you", "night", 96, 280, 14); think(cv, 640, 640, 480, 330, 4); put_cat(cv, 640, 680, "toast", "sit", "happy", 66, seed=123); put_cat(cv, 330, 1130, "mochi", "sit", "love", 120, seed=124, hatch=True); s.append(cv)
    cv = slide("3am: still thinking\nabout you", "night", 92, 280, 15); put_cat(cv, 540, 1060, "mochi", "sit", "stare", 160, seed=125); s.append(cv)
    cv = slide("7am: why am\ni so tired", size=100); put_cat(cv, 540, 990, "mochi", "sit", "cry", 185, seed=126); sub(cv, "(it's your fault. keep doing it)"); s.append(cv)
    return s

# ============================================================ 12
@car("12_reasons_i_like_you", "reasons i like you 💗 tag them #wholesome #couplememes #cutecat #fyp")
def c12():
    s = []
    cv = slide("reasons i\nlike you:", size=110); put_cat(cv, 540, 990, "toast", "sit", "love", 185, seed=130, hatch=True); hearts(cv, [(260, 720, 40, 12), (820, 700, 36, -10)]); s.append(cv)
    R = [("1. you're funny", "mochi", "happy", None), ("2. you're kind", "toast", "sparkle", None), ("3. you share snacks", "mochi", "smug", "cookie"),
         ("4. you always say\ngoodnight", "toast", "sleep", None), ("5. you're you", "mochi", "love", "heart")]
    for i, (t, who, mood, prop) in enumerate(R):
        cv = slide(t, size=96)
        if prop: hold(cv, who, cookie(110) if prop == "cookie" else heart(130), 540, 1000, 165, mood, 131+i, -30)
        else: put_cat(cv, 540, 990, who, "sit", mood, 185, seed=131+i, hatch=(mood == "love"))
        if mood == "sparkle": sparks(cv, [(240, 720, 44), (840, 700, 36)])
        if mood == "sleep": zzz(cv, 820, 700)
        s.append(cv)
    cv = slide("that's the whole list.\nit's more than enough", size=86); duo(cv, 990, 165, ("happy", "happy"), 135, 140, True); hearts(cv, [(540, 620, 56), (420, 580, 34, 15), (660, 570, 34, -15)]); s.append(cv)
    return s

if __name__ == "__main__":
    only = sys.argv[1:]
    for name, (fn, cap) in CAR.items():
        if only and not any(name.startswith(o) for o in only): continue
        d = f"{ROOT}/{name}"; os.makedirs(d, exist_ok=True)
        for f in os.listdir(d): os.remove(f"{d}/{f}")
        for i, cv in enumerate(fn()):
            save(cv, f"{d}/{i+1:02d}.jpg")
        open(f"{d}/caption.txt", "w").write(cap+"\n")
        print(name, flush=True)
