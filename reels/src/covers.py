"""Cover engineering for trial reels: three covers per reel, each built to win a different kind of thumb.
A = STAT   (a huge number and what it counts)         B = QUESTION (curiosity gap, one word highlighted)      C = SHOCK (two or three words over the most dramatic frame)
All text sits inside the middle 1080x1350 so the 4:5 and 3:4 profile-grid crops keep it. Frames come from the finished mp4.
python3 covers.py 414_grandma_dinners   -> ../covers/414_grandma_dinners_{A,B,C}.jpg"""
import sys, os, subprocess, json
sys.path.insert(0, os.path.dirname(__file__))
os.environ.setdefault("VOICE", "off")
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageChops
import motion
from motion import tx
from engine import W, H

HERE = os.path.dirname(__file__); OUT = os.path.join(HERE, "..", "covers"); MP4 = os.path.join(HERE, "..")
Y = (255, 214, 0); WHT = (255, 255, 255)
# name: dict(col=accent, A=(big, small, frame_frac), B=(line1, line2, highlight word, frame_frac), C=(text, frame_frac))
CONF = {
 "431_friend_stopped": dict(col=(255, 170, 90), A=("YOU STOPPED", "TEXTING THAT FRIEND", .50), B=("When did you two", "stop texting?", "stop", .50), C=("NOTHING HAPPENED", .50)),
 "430_group_chat": dict(col=(255, 190, 120), A=("THE GROUP CHAT", "THAT WENT QUIET", .56), B=("When did the group chat", "get so quiet?", "quiet", .60), C=("NOBODY LEFT IT", .72)),
 "428_tri_canon": dict(col=(120, 220, 255), A=("YOU KNOW THIS SONG", "EVERY BOUNCE IS A NOTE", .70), B=("Can you name the song", "the ball is playing?", "song", .55), C=("IT'S PLAYING A SONG", .90)),
 "400_ring_ode": dict(col=(255, 214, 0), A=("WHICH SONG?", "EVERY BOUNCE IS A NOTE", .70), B=("Can you name the song", "the ball is playing?", "song", .55), C=("IT'S PLAYING A SONG", .90)),
 "403_hex_king": dict(col=(255, 120, 150), A=("WHICH SONG?", "EVERY BOUNCE IS A NOTE", .70), B=("Do you know the song", "this ball is playing?", "song", .55), C=("WATCH THEM MULTIPLY", .90)),
 "404_square_elise": dict(col=(120, 220, 255), A=("WHICH SONG?", "EVERY BOUNCE IS A NOTE", .70), B=("Which famous song is", "this square playing?", "song", .55), C=("3 NEW BALLS EACH TIME", .90)),
 "407_heartbeats": dict(col=(255, 80, 110), A=("3 BILLION", "HEARTBEATS. THAT'S YOUR WHOLE LIFE.", .20), B=("This video just spent", "60 of them. Know how many you have?", "60", .45), C=("YOUR HEARTBEATS", .15)),
 "411_dog_days": dict(col=(255, 190, 90), A=("4,380", "DAYS. THAT'S A WHOLE DOG LIFE.", .10), B=("How many days does", "your dog have left?", "days", .55), C=("2,555 GONE", .60)),
 "409_parents_days": dict(col=(255, 190, 90), A=("200", "DAYS LEFT WITH YOUR PARENTS", .12), B=("You'll see your parents", "about 200 more days. Not years.", "200", .45), C=("LESS THAN ONE YEAR", .58)),
 "413_coffee_bathtubs": dict(col=(255, 190, 90), A=("35", "BATHTUBS OF COFFEE IN YOUR LIFE", .12), B=("One cup a day", "is how many bathtubs?", "bathtubs", .55), C=("105 BATHTUBS", .90)),
 "402_full_moons": dict(col=(190, 210, 255), A=("990", "FULL MOONS. THAT'S YOUR WHOLE LIFE.", .15), B=("How many full moons", "will you ever see?", "moons", .25), C=("MOST ARE GONE", .70)),
 "408_117_billion": dict(col=(255, 214, 90), A=("14 : 1", "DEAD FOR EVERY PERSON ALIVE", .10), B=("For every person alive", "how many have died?", "died", .45), C=("THE GLOWING EDGE", .55)),
 "406_phone_ten_years": dict(col=(255, 110, 130), A=("10 YEARS", "OF YOUR LIFE ON YOUR PHONE", .06), B=("What's your", "screen time?", "screen time", .50), C=("12.5 YEARS", .70)),
 "412_life_one_day": dict(col=(255, 190, 110), A=("5:24 AM", "THAT'S 18 YEARS OLD", .55), B=("If your life was one day", "what time is it for you?", "what time", .20), C=("WHAT TIME IS IT?", .90)),
 "414_grandma_dinners": dict(col=(255, 190, 120), A=("108", "DINNERS LEFT WITH GRANDMA", .10), B=("How many dinners do you", "have left with grandma?", "dinners", .40), C=("THE LAST ONE", .85)),
 "415_christmases_left": dict(col=(255, 120, 120), A=("20", "CHRISTMASES LEFT WITH YOUR PARENTS", .20), B=("How many Christmases", "do you have left?", "Christmases", .12), C=("ONE LIGHT PER YEAR", .75)),
 "416_sleep_together": dict(col=(255, 150, 170), A=("16.7", "YEARS ASLEEP NEXT TO THEM", .15), B=("Tag the person you'll", "sleep next to for 16 years", "16 years", .50), C=("SIDE BY SIDE", .60)),
 "417_cat_days": dict(col=(255, 190, 90), A=("5,475", "DAYS. THAT'S A WHOLE CAT LIFE.", .10), B=("How many days does", "your cat have?", "days", .55), C=("2,555 GONE", .60)),
 "419_dad_sundays": dict(col=(255, 190, 110), A=("1,144", "SUNDAYS LEFT WITH DAD", .05), B=("If your dad is 60", "how many Sundays are left?", "Sundays", .40), C=("0000", .96)),
 "420_two_trees": dict(col=(120, 230, 150), A=("-$421K", "THE COST OF WAITING 10 YEARS", .06), B=("Same $300 a month.", "Why is one tree twice the size?", "twice", .85), C=("$787K VS $366K", .72)),
 "421_parents_balls": dict(col=(255, 214, 90), A=("200", "BALLS. EACH ONE IS A DAY.", .05), B=("Each ball is one", "day left with your parents", "day", .30), C=("CALL THEM", .95)),
 "422_christmas_balls": dict(col=(255, 120, 120), A=("20", "BALLS. EACH ONE IS A CHRISTMAS.", .05), B=("Each ball is a", "Christmas you have left", "Christmas", .30), C=("SHOW UP", .95)),
 "423_dinner_balls": dict(col=(255, 190, 120), A=("108", "BALLS. EACH ONE IS A DINNER.", .05), B=("Each ball is a dinner", "left with grandma", "dinner", .30), C=("CALL HER", .96)),
 "424_kid_summers": dict(col=(255, 214, 90), A=("10", "SUMMERS LEFT IF YOUR KID IS 8", .05), B=("How many summers", "do you have left with your kid?", "summers", .30), C=("THIS SUMMER", .96)),
 "425_happiness_spreads": dict(col=(255, 150, 190), A=("3 STEPS", "YOUR HAPPINESS TRAVELS THAT FAR", .85), B=("A stranger you'll", "never meet is happier because of you", "stranger", .60), C=("TAG THEM", .95)),
}

def frame_at(name, frac, src=None):
    mp4 = os.path.join(MP4, (src or name) + ".mp4")
    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", mp4], capture_output=True, text=True).stdout.strip())
    t = max(0.2, min(dur - .3, dur * frac)); tmp = f"/tmp/cover_{name}_{int(frac * 1000)}.png"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{t:.2f}", "-i", mp4, "-frames:v", "1", tmp], check=True)
    return Image.open(tmp).convert("RGB").resize((W, H))

def scrim(img, top=1.0, bot=1.0):
    """The reel's own HUD and caption sit in the top and bottom bands, so those are darkened out and become the text zones; the picture lives in the middle."""
    ys = np.arange(H, dtype=np.float32); a = np.zeros(H, np.float32)
    a = np.where(ys < 440, top, np.where(ys < 640, top * np.clip(1 - (ys - 440) / 200, 0, 1) ** 1.3, 0)); a = np.maximum(a, np.where(ys > 1330, bot, np.where(ys > 1160, bot * np.clip((ys - 1160) / 170, 0, 1) ** 1.3, 0)))
    a = np.maximum(a, .18); k = Image.fromarray((np.repeat(a[:, None], W, 1) * 255).astype(np.uint8)); return Image.composite(Image.new("RGB", (W, H), (4, 4, 10)), img, k)

def hl_lines(img, l1, l2, word, col, y=330, size=84, gap=112):
    """two lines of white text with the key word recoloured"""
    for k, line in enumerate((l1, l2)):
        yy = y + k * gap
        if word.lower() in line.lower():
            i = line.lower().index(word.lower()); pre, mid, post = line[:i], line[i:i + len(word)], line[i + len(word):]
            parts = [(pre, WHT), (mid, col), (post, WHT)]; widths = [motion.text_width(p, motion.font("black", size), size) if p else 0 for p, _ in parts]; total = sum(widths); x = W / 2 - total / 2
            for (p, c), w in zip(parts, widths):
                if p: tx(img, p, x + w / 2, yy, size, "black", c, maxw=1000, shadow=True); x += w
        else: tx(img, line, W / 2, yy, size, "black", WHT, maxw=1000)

def make(name, src=None):
    c = CONF[name]; os.makedirs(OUT, exist_ok=True); col = c["col"]; outs = []
    # A: STAT - the number is the thumbnail
    big, small, f = c["A"]; im = scrim(frame_at(name, f, src))
    tx(im, big, W / 2, 440, 240 if len(big) <= 6 else (160 if len(big) <= 9 else 120), "black", col, maxw=1000); tx(im, small, W / 2, 1330, 52, "black", WHT, maxw=980)
    outs.append(("A", im))
    # B: QUESTION - a curiosity gap with one word picked out
    l1, l2, word, f = c["B"]; im = scrim(frame_at(name, f, src)); hl_lines(im, l1, l2, word, col, 345, 78, 104); tx(im, "WATCH TILL THE END", W / 2, 1330, 44, "black", col, maxw=900); outs.append(("B", im))
    # C: SHOCK - the dramatic frame, almost no text
    text, f = c["C"]; im = scrim(frame_at(name, f, src)); tx(im, text, W / 2, 1330, 104 if len(text) <= 12 else 80, "black", WHT, maxw=980); outs.append(("C", im))
    paths = []
    for v, im in outs:
        p = os.path.join(OUT, f"{name}_{v}.jpg"); im.save(p, quality=90); paths.append(p)
    return paths

if __name__ == "__main__":
    for n in sys.argv[1:] or CONF: print(make(n))
