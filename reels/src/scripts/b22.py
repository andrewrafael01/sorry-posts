"""Batch 22: facts, lists and 'what if' math reels 185-197. Numbers are worked out in the story field so they can be checked."""
from scripts.common import *
from scripts.b20 import PAL

DARK = ((12, 14, 26), (26, 30, 56))

def title_slide(text, hl=(), dur=2.6):
    return KineticShot([dict(text=text, at=0, size=92, weight="black", anim="pop", y=.4, hl=list(hl), maxw=900)], dur=dur, bg=(16, 16, 20), bg2=(40, 40, 52), cues=[(0, "whoosh", .5)])

def text_slide(big, small=None, color=YELLOW, pal=0, dur=2.8, size=100, counter=None, sfx="hit"):
    c, b1, b2 = PAL[pal % len(PAL)]
    items = [dict(text=big, at=0, size=size, weight="black", color=color or c, anim="slam", y=.38 if small else .45, maxw=900, sfx=sfx)]
    if small: items.append(dict(text=small, at=.5, size=60, weight="xbold", color=WHITE, anim="rise", y=.6, maxw=900))
    return KineticShot(items, dur=dur, bg=b1, bg2=b2, fx=("rays",), fx_y=.4, counter=counter)

def num_slide(label, a, b, fmt, unit, pal=0, dur=3.4, size=190, sub=None):
    c, b1, b2 = PAL[pal % len(PAL)]
    items = [dict(text=label, at=0, size=58, weight="xbold", color=WHITE, anim="rise", y=.27, maxw=900),
             dict(text=fmt.format(a), at=.2, size=size, weight="black", color=c, anim="pop", y=.44, count=(a, b, 1.7), fmt=fmt, maxw=980),
             dict(text=unit, at=1.9, size=64, weight="xbold", color=WHITE, anim="rise", y=.6, maxw=900, sfx="hit")]
    if sub: items.append(dict(text=sub, at=2.3, size=46, weight="bold", color=(210, 216, 240), anim="rise", y=.72, maxw=860))
    return KineticShot(items, dur=dur, bg=b1, bg2=b2, fx=("dots",))

def facts(num, name, hook, hl, rows, title, caption, story, style="cine", last=None):
    """rows: [(headline, detail)] shown one per slide with a counter."""
    n = len(rows); shots = [title_slide(hook, hl)]
    for i, (h, d) in enumerate(rows):
        c, b1, b2 = PAL[i % len(PAL)]
        shots.append(KineticShot([dict(text=h, at=0, size=130 if len(h) < 12 else 100, weight="black", color=c, anim="slam", y=.38, maxw=900, sfx="hit"), dict(text=d, at=.5, size=56, weight="xbold", color=WHITE, anim="rise", y=.6, maxw=880)],
                                 dur=min(3.6, 2.0 + .045 * len(d)), bg=b1, bg2=b2, fx=("rays",), fx_y=.38, counter=f"{i + 1} / {n}"))
    if last: shots.append(text_slide(*last, pal=n, dur=3.2))
    return Reel(f"{num}_{name}", shots, style=style, seed=num, title=title, caption=caption, story=story)

def everyone_jumps():
    s = [title_slide("what if every human on earth jumped at the same time", ["jumped"], 3.0),
         num_slide("people jumping", 0, 8_000_000_000, "{:,.0f}", "about 50 kg each, about 20 cm high", 0, 3.4),
         text_slide("they push on the ground", "total push: 800,000,000,000 kg·m/s", None, 1, 3.0, 96),
         num_slide("the earth weighs", 0, 6, "{:,.0f}", "x 10^24 kg (a 6 with 24 zeros)", 2, 3.2, 220),
         text_slide("earth gets pushed back", "at 0.00000000000013 meters per second", None, 3, 3.2, 90),
         text_slide("for 0.4 seconds in the air", "that's 0.00000000000005 meters", None, 4, 3.0, 96),
         text_slide("a hydrogen atom is 2,000x wider", "the planet moves less than that", None, 5, 3.4, 90),
         text_slide("8 billion people jump", "and the earth doesn't notice", None, 0, 3.4, 96)]
    return Reel("185_everyone_jumps", s, style="cine", seed=185, title="what if everyone on earth jumped at once", caption="8 billion people jump and the earth moves less than one atom. which one of you is the one who didn't jump?", story="Math: 8e9 people x 50 kg x about 2 m/s jump speed (20 cm jump: v = sqrt(2 x 9.8 x 0.2) = 1.98) = about 8e11 kg m/s of momentum. Earth is 6e24 kg, so recoil = 8e11 / 6e24 = 1.3e-13 m/s. Airtime = 2v/g = 0.4 s, so displacement = about 5e-14 m. A hydrogen atom is about 1e-10 m across, so about 2,000x wider.")

def billion_stack():
    s = [title_slide("what if you stacked $1 billion in one dollar bills", ["$1", "billion"], 3.0),
         text_slide("one bill is 0.11 mm thick", "so 1,000,000,000 bills is...", None, 1, 2.8, 90),
         num_slide("the stack is", 0, 109, "{:,.0f}", "kilometers tall", 2, 3.4, 230),
         BarsShot([("Everest", 8.8, (90, 160, 255), "8.8 km"), ("airplane", 11, (130, 220, 160), "11 km"), ("edge of space", 100, (255, 190, 80), "100 km"), ("$1 billion", 109, (255, 80, 110), "109 km")], dur=6.0, title="how tall is that", line=(100, "edge of space")),
         text_slide("it weighs 1,000 tons", "about 7 blue whales of paper", None, 4, 3.2, 96),
         text_slide("you'd need a rocket", "to deposit your $1 billion", None, 5, 3.4, 96)]
    return Reel("186_billion_stack", s, style="synth", seed=186, title="what if you stacked $1 billion in ones", caption="a billion dollars in singles reaches past the edge of space. tag the guy who says 'it's just a billion'", story="Math: a US bill is 0.0043 in = 0.109 mm thick. 1e9 x 0.109 mm = 1.09e8 mm = 109 km. The Karman line (edge of space) is 100 km. A bill weighs about 1 g, so 1e9 g = 1,000 metric tons; a blue whale is about 150 t, so about 7 whales.")

def count_billion():
    s = [title_slide("how long does it take to count out loud", ["count"], 2.6),
         num_slide("to a million (1 per second)", 0, 11.6, "{:,.1f}", "days", 0, 3.2, 220),
         num_slide("to a billion", 0, 31.7, "{:,.1f}", "years, without sleeping", 1, 3.4, 220),
         num_slide("to a trillion", 0, 31_700, "{:,.0f}", "years", 2, 3.4, 220),
         text_slide("31,700 years ago", "people were just starting to paint caves", None, 3, 3.4, 96),
         text_slide("a million is a vacation", "a billion is a life. a trillion is the whole history of art", None, 4, 3.8, 80)]
    return Reel("187_count_billion", s, style="cine", seed=187, title="how long to count to a billion", caption="a million seconds is 11 days. a billion is 31 years. send this to someone who says 'it's just a few zeros'", story="Math: 1e6 s / 86,400 = 11.6 days. 1e9 s = 11,574 days = 31.7 years. 1e12 s = 31,688 years. The earliest known cave paintings (Chauvet) are around 30,000+ years old.")

def all_in_la():
    s = [title_slide("what if all 8 billion people stood in one place", ["8", "billion"], 2.8),
         text_slide("packed shoulder to shoulder", "6 people in every square meter", None, 1, 3.0, 90),
         num_slide("area needed", 0, 1333, "{:,.0f}", "square kilometers", 2, 3.2, 220),
         text_slide("that's about the size of", "the city of los angeles", None, 3, 3.2, 96),
         text_slide("the whole human race", "fits in one city. all of it", None, 4, 3.0, 96),
         text_slide("and one of you", "is still asking where the bathroom is", None, 5, 3.2, 90)]
    return Reel("188_all_in_la", s, style="pop", seed=188, title="what if all humans stood in one city", caption="all 8 billion people alive today would fit in LA. tag the person who needs 'space'", story="Math: 8e9 / 6 per m2 = 1.33e9 m2 = 1,333 km2. The city of Los Angeles is about 1,300 km2 including water (about 1,215 km2 land).")

def words_arabic():
    return facts(189, "words_arabic", "10 english words that are secretly arabic", ["arabic"], [("algebra", "al-jabr: 'the reunion of broken parts'"), ("alcohol", "al-kuhl: a fine powder for eyeliner"), ("coffee", "qahwa"), ("sofa", "suffa: a bench"), ("sugar", "sukkar"), ("magazine", "makhazin: storehouses"), ("safari", "safar: a journey"), ("zero", "sifr: 'empty'"), ("cotton", "qutn"), ("lemon", "laymun")],
        "10 english words that are arabic", "you say these every day. send this to your arab friend", "Verified etymologies: algebra (al-jabr), alcohol (al-kuhl), coffee (qahwa, via Turkish/Italian), sofa (suffa), sugar (sukkar), magazine (makhazin, via Italian/French), safari (safar), zero (sifr), cotton (qutn), lemon (laymun, via Persian/Italian).", style="jazz")

def words_hindi():
    return facts(190, "words_hindi", "10 english words that are secretly hindi and urdu", ["hindi", "urdu"], [("shampoo", "champo: 'press' (as in a head massage)"), ("jungle", "jangal: wild land"), ("pajamas", "pae jama: leg clothing"), ("bungalow", "bangla: 'of bengal'"), ("loot", "lut"), ("bandana", "bandhna: to tie"), ("cot", "khat: a bed"), ("khaki", "khaki: 'dust-colored'"), ("avatar", "avatara: 'descent' of a god"), ("thug", "thag: a swindler")],
        "10 english words that are hindi", "you've been speaking a little hindi this whole time. send this to a desi friend", "Verified etymologies: shampoo (champo), jungle (jangal), pajamas (pae jama), bungalow (bangla), loot (lut), bandana (bandhna), cot (khat), khaki (khaki, Persian-Urdu), avatar (avatara, Sanskrit), thug (thag).", style="bounce")

def sound_fake():
    return facts(191, "sound_fake", "10 facts that sound fake but are true", ["fake", "true"], [("bananas are berries", "strawberries aren't"), ("oxford is older than the aztec empire", "teaching began around 1096. tenochtitlan: 1325"), ("cleopatra", "lived closer to the moon landing than to the building of the pyramids"), ("wombat poop is a cube", "so it doesn't roll off rocks"), ("octopuses have 3 hearts", "and blue blood"), ("a day on venus is longer than its year", "243 earth days vs 225"), ("sharks are older than trees", "about 450 vs 350 million years"), ("more trees than stars", "3 trillion trees. about 100-400 billion stars in the milky way"), ("nintendo was founded in 1889", "they sold playing cards"), ("more chess games than atoms", "10^120 possible games. 10^80 atoms")],
        "10 facts that sound fake", "the venus one broke my brain. send this to your smartest friend", "Checks: bananas are botanical berries; Oxford teaching ~1096 vs Tenochtitlan 1325; Cleopatra (69-30 BC) vs Great Pyramid (~2560 BC) vs Apollo 11 (1969 AD); wombats produce cubic scat; octopuses have 3 hearts; Venus rotates once in 243 Earth days, orbits in 225; sharks ~450M yrs, trees ~350M; ~3.04 trillion trees; Nintendo founded 1889 as a playing card company; Shannon number ~10^120 vs ~10^80 atoms.", style="cine")

def phone_apollo():
    s = [title_slide("the computer that landed us on the moon vs your phone", ["moon", "phone"], 3.0),
         text_slide("apollo guidance computer, 1969", "about 40,000 instructions per second", None, 1, 3.2, 84),
         text_slide("your phone", "about 10,000,000,000 per second or more", None, 2, 3.2, 90),
         num_slide("your phone is faster by", 0, 250000, "{:,.0f}", "times. roughly. at least", 3, 3.4, 190),
         text_slide("and you use it", "to look at a video of a cat", None, 4, 3.0, 96)]
    return Reel("192_phone_apollo", s, style="synth", seed=192, title="your phone vs the apollo computer", caption="your phone is about 250,000x more powerful than the computer that landed on the moon. you used it to watch a cat", story="The Apollo Guidance Computer ran about 40,000 instructions/second; a modern phone CPU does on the order of 10^10 per second (and more with its GPU), so roughly 250,000x or more. Rough figure.")

def fall_earth():
    s = [title_slide("what if you jumped in a hole that goes through the whole earth", ["hole"], 3.0),
         text_slide("(no air, no lava, no mercy)", "just gravity", None, 1, 2.6, 90),
         num_slide("top speed in the middle", 0, 28400, "{:,.0f}", "km/h. about 8 km per second", 2, 3.4, 200),
         num_slide("time to reach the other side", 0, 42, "{:,.0f}", "minutes", 3, 3.2, 230),
         text_slide("then you stop", "right at the opening. you can climb out", None, 4, 3.2, 90),
         text_slide("and do it again", "forever. it's a very long elevator ride", None, 5, 3.2, 90)]
    return Reel("193_fall_earth", s, style="cine", seed=193, title="what if you fell through the earth", caption="42 minutes to the other side of the planet. tag the person who'd go back for their phone", story="Uniform-density model: gravity inside is linear in r, so motion is simple harmonic with period 84.4 min; one way is half: about 42 min. Max speed at center = sqrt(g R) = sqrt(9.8 x 6.37e6) = 7.9 km/s = 28,400 km/h. Ignores air, heat and a non-uniform Earth.")

def sun_vanishes():
    s = [title_slide("what if the sun just disappeared", ["sun"], 2.6),
         num_slide("we'd keep seeing it for", 0, 8.3, "{:,.1f}", "minutes", 0, 3.2, 230),
         text_slide("gravity travels at light speed too", "so earth keeps orbiting an empty spot for 8 minutes", None, 1, 3.6, 84),
         text_slide("then", "everything goes straight, in the dark", None, 2, 3.0, 96),
         text_slide("it gets cold, slowly", "not instantly. the planet holds its heat for a while", None, 3, 3.4, 84),
         text_slide("for 8 minutes", "you'd be completely fine. enjoy it", None, 4, 3.2, 96)]
    return Reel("194_sun_vanishes", s, style="cine", seed=194, title="what if the sun disappeared", caption="for exactly 8 minutes and 20 seconds nothing would change. send this to the friend who procrastinates", story="Light and gravity both propagate at c; the Sun is 1.496e8 km away; 1.496e8 / 299,792 = 499 s = 8 min 19 s.")

def heartbeats():
    s = [title_slide("how many times your heart will beat in your life", ["heart"], 2.6),
         num_slide("per day", 0, 100_800, "{:,.0f}", "beats (at 70 a minute)", 0, 3.2, 200),
         num_slide("per year", 0, 36_800_000, "{:,.0f}", "beats", 1, 3.2, 170),
         num_slide("by age 80", 0, 2_900_000_000, "{:,.0f}", "beats", 2, 3.4, 150),
         text_slide("and it started before you were born", "it has never taken a day off", None, 3, 3.2, 90)]
    return Reel("195_heartbeats", s, style="pop", seed=195, title="how many times your heart beats in a life", caption="your heart has beaten about 2.9 billion times by 80 and it has never asked for a day off. tag your mom", story="70 bpm x 60 x 24 = 100,800/day; x 365 = 36.8 million/yr; x 80 = 2.94 billion.")

def desi_leaving_math():
    s = [title_slide("the math of leaving a desi house", ["math"], 2.6),
         text_slide("6:00 pm", "you arrive. 'we'll stay one hour'", None, 0, 2.8, 100),
         num_slide("times someone says 'ok we should go'", 0, 9, "{:,.0f}", "", 1, 3.0, 230),
         num_slide("goodbyes at the door", 0, 7, "{:,.0f}", "each one longer than the last", 2, 3.0, 230),
         num_slide("containers of food you received", 0, 11, "{:,.0f}", "for the car", 3, 3.0, 230),
         text_slide("planned: 1 hour", "actual: 5 hours and 40 minutes", None, 4, 3.2, 90),
         text_slide("and the aunty at the gate says", "'you came so late. you're leaving already?'", None, 5, 3.6, 84)]
    return Reel("197_desi_leaving_math", s, style="funk", seed=196, title="the math of leaving a desi house", caption="planned: 1 hour. actual: 5 hours 40 minutes. tag who you can't leave a house with", story="Joke math: 9 'we should go', 7 goodbyes, 11 containers, planned 1 h, actual 5 h 40 min.")

def small_dinner_math():
    s = [title_slide("the math of 'just a small dinner'", ["small", "dinner"], 2.6),
         num_slide("people invited", 0, 6, "{:,.0f}", "", 0, 2.6, 230),
         num_slide("people the food is for", 0, 40, "{:,.0f}", "", 1, 2.8, 230),
         num_slide("dishes on the table", 0, 14, "{:,.0f}", "'it's nothing'", 2, 3.0, 230),
         num_slide("plates you were told to take", 0, 4, "{:,.0f}", "'you didn't eat'", 3, 3.0, 230),
         num_slide("containers you left with", 0, 11, "{:,.0f}", "", 4, 2.8, 230),
         text_slide("portions left in the house", "34. she's already planning lunch", None, 5, 3.4, 90)]
    return Reel("196_small_dinner_math", s, style="lofi", seed=197, title="the math of 'just a small dinner'", caption="6 invited. food for 40. 34 portions left. tag the host who always cooks for 40", story="Joke math: 6 invited, 40 portions cooked, 6 eaten, 34 left; you leave with 11 containers.")

VO = {
 "185_everyone_jumps": [(0, "What if every human on Earth jumped at the same time?"), (1, "Eight billion people. About fifty kilos each. Twenty centimeters up."), (2, "Together they push down with about eight hundred billion kilogram meters per second."), (3, "But the Earth weighs six septillion kilograms."), (4, "So it gets pushed back by about a hundred trillionth of a meter per second."), (5, "For the four tenths of a second they're in the air. That's about five hundred trillionths of a meter."), (6, "A hydrogen atom is two thousand times wider than that."), (7, "Eight billion people jump, and the Earth doesn't even notice.")],
 "186_billion_stack": [(0, "What if you stacked one billion dollars in one dollar bills?"), (1, "One bill is a tenth of a millimeter thick."), (2, "The stack would be a hundred and nine kilometers tall."), (3, "That's taller than Everest, taller than an airplane, and past the edge of space."), (4, "It would also weigh a thousand tons."), (5, "You'd need a rocket to deposit your own money.")],
 "187_count_billion": [(0, "How long does it take to count out loud?"), (1, "To a million, one number a second, is eleven days."), (2, "To a billion is thirty one years, without sleeping."), (3, "To a trillion is thirty one thousand seven hundred years."), (4, "Thirty one thousand years ago, people were just starting to paint on cave walls."), (5, "A million is a vacation. A billion is a life.")],
 "193_fall_earth": [(0, "What if you jumped into a hole through the center of the Earth?"), (2, "You'd hit twenty eight thousand kilometers an hour in the middle."), (3, "And reach the other side in forty two minutes."), (4, "Then you'd stop, right at the opening, and climb out."), (5, "And you could do it all over again.")],
}
import voice as _voice
import scripts.vo_scripts  # noqa: registers the narration for the other fact reels
_voice.SCRIPTS.update(VO)
def _v(fn):
    return fn
REELS = {k: _v(f) for k, f in dict(everyone_jumps=everyone_jumps, billion_stack=billion_stack, count_billion=count_billion, all_in_la=all_in_la, words_arabic=words_arabic, words_hindi=words_hindi, sound_fake=sound_fake, phone_apollo=phone_apollo, fall_earth=fall_earth, sun_vanishes=sun_vanishes, heartbeats=heartbeats, desi_leaving_math=desi_leaving_math, small_dinner_math=small_dinner_math).items()}
