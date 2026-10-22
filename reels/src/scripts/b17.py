"""Batch 17: rewrites. Dialogue-first mini sketches: people say the joke, the screen doesn't explain it. Same file names as the originals, so they overwrite."""
from arch import *

def meta(r, title, caption, story): r.title, r.caption, r.story = title, caption, story; return r

def talk(*ls, t0=.35, voices=None):
    """auto-times a back-and-forth. each item: (who, text[, gap_after[, sfx]])"""
    out, t = [], t0
    for l in ls:
        who, text = l[0], l[1]; gap = min(l[2], .5) * .5 if len(l) > 2 else .12
        d = max(.85, .22 * len(text.split()) + .42); kw = dict(sfx=l[3]) if len(l) > 3 else {}
        if voices:
            import voice
            if voice.speakable(text):
                kw["voice"] = voices[who]; sec = voice.seconds(text, voices[who])
                if sec: d = max(.85, sec + .1)
        out.append(S(text, who, t, d, **kw)); t += d + gap
    return out, round(t + .35, 2)

def sc(K, label, bg, who, ls, props=(), sub=None, hl=(), **kw):
    import voice
    vs = [voice.voice_for(a["c"]) for a in who] if voice.enabled() else None
    say, dur = talk(*ls, voices=vs)
    return beat(label, sub, hl, bg, who, props, say, dur=max(dur, kw.pop("min", 3.2)), cast=K, **kw)

# ------------------------------------------------------------------ 147 sharmaji's son
def desi_doctor_pressure():
    K = dict(mom=person("c0392b", "brown", "black", style="bun"), dad=person("8a6a45", "brown", "grey", extra="vest"), kid=person("2a6fdb", "brown", "black", extra="hoodie"),
             aunt=person("3aa655", "brown", "black", style="long"), sh=person("5a4a6a", "brown", "grey", glasses="round"), kidk=person("f4a300", "brown", "black"))
    sh = [lineup("desi kids who got compared", ["mom", "dad", "kid", "aunt", "sh"], K, "living", dur=3.0)]
    sh.append(sc(K, "AGE 9", "kitchen", [A("mom", .26, "smile", "point", 2.1), A("kidk", .76, "worried", "idle", 1.9, flip=True)],
        [(0, "sharmaji's son did the math in his head"), (0, "in the car", .5), (1, "is he okay"), (0, "he's a doctor"), (1, "he's nine", .2), (0, "fast learner", .1, "pop")], hud=[(0, "AGE 9")]))
    sh.append(sc(K, "AGE 16", "living", [A("dad", .26, "dead", "idle", 2.1), A("kid", .76, "smile", "cheer", 2.0, flip=True)], 
        [(1, "i got a 98!", .6), (0, "where's the other 2", .9), (1, "...there is no other 2"), (0, "sharmaji's son got 103", .4), (1, "out of 100??"), (0, "he's special", .2, "womp")], props=[P("note", .5, .56, 240, text="98%")], hud=[(0, "AGE 16")]))
    sh.append(sc(K, "AGE 24", "wedding", [A("aunt", .26, "smile", "talk", 2.1), A("kid", .76, "cool", "flex", 2.0, flip=True)],
        [(1, "i got into med school!", .5), (0, "wow! and sharmaji's son?", .5), (1, "...", .6), (0, "heart surgeon. he's 24"), (1, "that's not legal"), (0, "he's a fast learner", .2, "womp")], hud=[(0, "AGE 24")]))
    sh.append(sc(K, "AGE 30", "kitchen", [A("mom", .26, "smile", "cheer", 2.1), A("kid", .76, "worried", "idle", 2.0, flip=True)],
        [(0, "beta. sharmaji's son got divorced", .5), (1, "...ok?"), (0, "i'm so proud of you", .4, "sparkle"), (1, "i didn't do anything"), (0, "exactly", .2)], hud=[(0, "AGE 30")]))
    sh.append(sc(K, "THAT NIGHT", "kitchen", [A("dad", .26, "worried", "talk", 2.1), A("mom", .76, "smirk", "idle", 2.1, flip=True)],
        [(0, "sharmaji doesn't have a son", .6), (1, "i know", .8), (0, "you made him up?", .6), (1, "2003"), (1, "he's a very good motivator", .3, "womp")], props=[P("tea", .5, .8, 200)]))
    return meta(Reel("147_desi_doctor_pressure", sh, "cine", 147), "desi kids who got compared", "sharmaji's son is a composite. your mom made him up in 2003. tag a desi kid who got compared to him", "Sharmaji's son follows a desi kid from age 9 to 30 (math in his head, a 103 out of 100, a heart surgeon at 24). At 30 the kid's mom is proud only because Sharmaji's son got divorced. Twist: dad learns Sharmaji has no son; mom invented him in 2003 as a motivator.")

# ------------------------------------------------------------------ 032 mexican families
def mexican_families():
    K = dict(abu=person("c0392b", "tan", "grey", style="bob"), tio=person("2a6fdb", "tan", "black", style="cap", cap="2a2a3a"), mom=person("e8a0b8", "tan", "black", style="long"), kid=person("3aa655", "tan", "black", extra="hoodie"),
             tia=person("f4a300", "tan", "black", style="bun"), prim=person("8a6a45", "tan", "black"))
    sh = [lineup("mexican families", ["abu", "tio", "mom", "tia", "prim"], K, "kitchen", dur=3.0)]
    sh.append(sc(K, "YOU JUST ARRIVED", "kitchen", [A("abu", .26, "smile", "point", 2.1), A("kid", .76, "worried", "idle", 2.0, flip=True)],
        [(0, "ya comiste?", .4), (1, "yeah, i ate on the way"), (0, "siéntate", .6), (1, "abuela, i literally just", .3), (0, "(a full plate has appeared)", .3, "pop")], props=[P("dish", .5, .86, 300)]))
    sh.append(sc(K, "THE GRILL", "park", [A("tio", .26, "cool", "flex", 2.1), A("kid", .76, "smile", "idle", 2.0, flip=True)],
        [(0, "try the carne asada", .3), (1, "i'm so full tío"), (0, "that's not food", .4), (0, "that's a test of character", .2, "boom")], props=[P("grill", .52, .78, 360)]))
    sh.append(sc(K, "THE CHANCLA", "living", [A("mom", .26, "angry", "point", 2.1), A("kid", .76, "scream", "idle", 2.0, flip=True)],
        [(0, "ven acá", .3), (1, "what did i do??"), (0, "no sé todavía", .5), (0, "but you're going to tell me", .2, "boom")], props=[P("slipper", .5, .84, 200)], shake=[(2.4, 6, .3)]))
    sh.append(sc(K, "TIA'S PHONE CALL", "living", [A("tia", .26, "smile", "talk", 2.1), A("kid", .76, "dead", "idle", 2.0, flip=True)],
        [(0, "mijo! you got fat!", .4, "pop"), (1, "..."), (0, "it's good! you look happy", .5), (1, "i'm not happy"), (0, "you look happy", .2)]))
    sh.append(sc(K, "LEAVING", "hallway", [A("abu", .26, "smile", "idle", 2.1), A("kid", .76, "sad", "idle", 2.0, flip=True)],
        [(1, "ok we're leaving now", .4), (0, "ya? wait one second", .8), (0, "(it is now 40 minutes later)", .2, "tick"), (0, "take these", .4), (1, "that's 11 tupperwares"), (0, "for the car", .2)], props=[P("tupper", .5, .78, 320, n_=3)], hud=[(0, "9:00 PM"), (2.8, "9:40 PM")]))
    sh.append(sc(K, "3 AM", "bedroom_night", [A("kid", .3, "sleepy", "idle", 2.2), A("mom", .76, "smile", "talk", 2.0, flip=True)],
        [(1, "(calling) are you eating?", .3), (0, "it's 3 am mom"), (1, "so no", .5), (1, "come over. i made soup", .2, "womp")], props=[P("phone", .52, .62, 240)], hud=[(0, "3:04 AM")]))
    return meta(Reel("032_mexican_families", sh, "bounce", 32), "mexican families", "the plate shows up before you answer the question. tag the family member who feeds you on arrival", "Mexican family sketch: abuela asks if you've eaten while the plate is already served, tío's carne asada as a character test, mom with the chancla punishing a crime she hasn't identified yet, tía says you got fat as a compliment, a 40-minute goodbye with 11 tupperwares, and mom calling at 3am to ask if you're eating then inviting you over for soup.")

# ------------------------------------------------------------------ 031 italian families
def italian_families():
    K = dict(nonna=person("2a2a3a", "light", "grey", style="bob"), sal=person("c0392b", "light", "black", extra="vest"), vin=person("2a6fdb", "light", "black", style="cap", cap="f4f6f8"), mom=person("e8a0b8", "light", "black", style="long"), kid=person("3aa655", "light", "brown", extra="hoodie"), kim=person("f4a300", "light", "black", style="bun"))
    sh = [lineup("italian families", ["nonna", "sal", "vin", "mom", "kid"], K, "kitchen", dur=3.0)]
    sh.append(sc(K, "SUNDAY, 9 AM", "kitchen", [A("nonna", .26, "smile", "flex", 2.1), A("kid", .76, "worried", "idle", 2.0, flip=True)],
        [(1, "nonna how long has the sauce been on", .4), (0, "since thursday", .6), (1, "it's sunday"), (0, "it's almost ready", .2, "pop")], props=[P("pot", .52, .66, 380, kw=dict(steam=True))], hud=[(0, "SUNDAY 9:00 AM")]))
    sh.append(sc(K, "SOMEONE SAID IT", "living", [A("vin", .22, "smirk", "talk", 2.0), A("sal", .5, "angry", "point", 2.0), A("nonna", .78, "dead", "idle", 2.0, flip=True)],
        [(0, "pass the gravy", .6), (1, "(puts down fork)", .8, "boom"), (1, "the WHAT", .5), (2, "it's red", .5), (1, "(sits down)", .1)], props=[P("table", .5, .86, 520, pop=False)], shake=[(1.8, 8, .3)]))
    sh.append(sc(K, "AT THE TABLE, 2 PM", "kitchen", [A("kid", .26, "scream", "idle", 2.1), A("sal", .76, "smile", "point", 2.0, flip=True)],
        [(0, "that was great. i'm done", .4), (1, "that was the antipasto", .6), (0, "i've had five plates"), (1, "pace yourself", .4), (1, "there's a second dinner", .2, "womp")], props=[P("dish", .5, .86, 300)], hud=[(0, "2:00 PM")]))
    sh.append(sc(K, "COUSIN'S NEWS", "living", [A("kim", .24, "smile", "wave", 2.0), A("nonna", .76, "worried", "talk", 2.0, flip=True)],
        [(0, "nonna this is kim", .3), (1, "kim-o?", .5), (0, "just kim. her family is korean"), (1, "do they eat?", .6), (0, "yes?"), (1, "good. sit.", .2, "sparkle")]))
    sh.append(sc(K, "LEAVING", "hallway", [A("nonna", .26, "smile", "point", 2.1), A("kid", .76, "worried", "idle", 2.0, flip=True)],
        [(0, "take this", .3), (1, "i'll eat it tomorrow"), (0, "it's not for you", .5), (0, "it's for the neighbor", .5), (0, "don't tell him it's from me", .3), (0, "he's a snake", .2, "boom")], props=[P("tupper", .5, .8, 300, n_=2)]))
    return meta(Reel("031_italian_families", sh, "funk", 31), "italian families", "sauce or gravy, and nonna ends the war with one word. send this to the italian in your life", "Italian family sketch: sauce on since Thursday, 'gravy' causes a standoff until nonna says 'it's red', five plates in and it's just the antipasto, not eating means you're sick, nonna accepts a Korean fiancée once she learns they eat, and sends food for the neighbor she calls a snake.")

# ------------------------------------------------------------------ 060 dog vs cat
def dog_cat_people():
    K = dict(dog=person("f4a300", "light", "brown", style="cap", cap="2a6fdb"), cat=person("a678de", "light", "black", style="bun", glasses="round"), vet=person("f4f1ea", "tan", "black", extra="tie"), guest=person("3aa655", "tan", "black"), thief=person("2a2a3a", "light", "black", style="beanie"), kid=person("c0392b", "light", "brown"))
    sh = [lineup("dog people and cat people", ["dog", "cat", "vet", "guest", "thief"], K, "living", dur=3.0)]
    sh.append(sc(K, "3 AM", "bedroom_night", [A("dog", .26, "smile", "talk", 2.1), A("cat", .76, "dead", "idle", 2.1, flip=True)],
        [(0, "who's a good boy", .3), (0, "did you have a big poop??", .5), (0, "yes you did!! i'm so proud", .6, "pop"), (1, "(cat is staring at me)", .6), (1, "(pushes glass off table, eye contact)", .3, "crash")], hud=[(0, "3:00 AM")]))
    sh.append(sc(K, "CAMERA ROLL", "living", [A("dog", .26, "smile", "flex", 2.1), A("cat", .76, "worried", "idle", 2.1, flip=True)],
        [(0, "11,000 photos of biscuit", .5), (1, "where's your wedding", .4), (0, "somewhere under biscuit's birthday", .2, "womp")], props=[P("phone", .52, .6, 260)]))
    sh.append(sc(K, "THE VET, CAT EDITION", "hospital", [A("cat", .26, "smile", "talk", 2.1), A("vet", .76, "dead", "idle", 2.1, flip=True)],
        [(0, "she's just shy", .4), (1, "her chart says 'bit me twice'", .6), (0, "she's affectionate", .5), (1, "i'm bleeding", .5), (0, "that means she trusts you", .2, "womp")]))
    sh.append(sc(K, "THE BURGLAR", "living", [A("thief", .26, "smirk", "flex", 2.1), A("dog", .76, "cool", "flex", 2.1, flip=True)],
        [(1, "my dog would protect me", .6), (0, "(enters)", .3), (0, "(dog gets belly rubs)", .8, "pop"), (1, "...he's a good boy", .2)], hud=[(0, "11:48 PM")]))
    sh.append(sc(K, "THE BURGLAR, CAT EDITION", "living", [A("thief", .26, "worried", "point", 2.1), A("cat", .76, "dead", "idle", 2.1, flip=True)],
        [(1, "my cat doesn't care about anything", .5), (0, "(looking for the safe)", .6), (0, "(cat knocks a vase off the shelf. the safe is behind it)", .3, "crash"), (1, "she's never done that before", .3)], hud=[(0, "11:49 PM")]))
    return meta(Reel("060_dog_cat_people", sh, "bounce", 60), "dog people and cat people", "the dog gets belly rubs from the burglar and the cat shows him where the safe is. tag your pet's owner", "Dog person narrates a poop with pride; cat knocks a glass off the table at 3am with eye contact. 11,000 dog photos and no wedding photos. Vet visits: the dog's fourth sock; the cat's chart says bit me twice. Burglar: dog gets belly rubs, cat reveals the safe.")

# ------------------------------------------------------------------ 112 first-gen
def first_gen_kids():
    K = dict(kid=person("2a6fdb", "brown", "black", extra="hoodie"), mom=person("c0392b", "brown", "black", style="bun"), dad=person("8a6a45", "brown", "grey", extra="vest"), bank=person("f4f1ea", "light", "brown", extra="tie"), teach=person("a678de", "light", "brown", glasses="round"), boss=person("2a2a3a", "light", "grey", extra="tie"))
    sh = [lineup("first-gen kids", ["kid", "mom", "dad", "bank", "teach"], K, "street", dur=3.0)]
    sh.append(sc(K, "AGE 8. THE BANK.", "office", [A("bank", .26, "smile", "talk", 2.0), A("kid", .55, "worried", "idle", 1.7), A("mom", .8, "angry", "point", 2.1, flip=True)],
        [(0, "can she verify her account number", .4), (1, "(to mom) cuenta... number... the money place", .6), (2, "(says something long, angry)", .6), (1, "she says hello"), (0, "that seemed longer", .3), (1, "she's very polite", .2, "womp")], hud=[(0, "AGE 8")]))
    sh.append(sc(K, "THE DOCTOR", "hospital", [A("bank", .26, "dead", "talk", 2.0), A("kid", .55, "scream", "idle", 1.7), A("dad", .8, "worried", "point", 2.1, flip=True)],
        [(0, "describe the symptoms", .3), (2, "(describes in detail)", .6), (1, "his...", .5), (1, "stomach is sad", .4), (0, "how sad", .3), (1, "very sad", .2, "womp")], hud=[(0, "AGE 9")]))
    sh.append(sc(K, "CUSTOMER SERVICE", "living", [A("dad", .26, "angry", "point", 2.1), A("kid", .76, "sad", "idle", 2.0, flip=True)],
        [(0, "tell him i will not pay", .5), (1, "(on phone) he's a little unhappy", .5), (0, "tell him i go to the news", .5), (1, "he says thank you for your help", .3, "pop")], props=[P("phone", .52, .62, 240)]))
    sh.append(sc(K, "AGE 31. THE BOARDROOM.", "office", [A("boss", .26, "smile", "talk", 2.1), A("kid", .76, "cool", "flex", 2.0, flip=True)],
        [(0, "ok let's close out the quarter", .4), (1, "(phone buzzes)", .4, "buzz"), (0, "do you need to take that?", .5), (1, "it's urgent", .3), (1, "(mom: what is 'adjustable rate')", .3, "womp")], props=[P("phone", .52, .66, 240, anim="shake")], hud=[(0, "AGE 31")]))
    return meta(Reel("112_first_gen_kids", sh, "cine", 112), "first-gen kids", "'she says hello' was a four-minute speech. tag a first gen kid who translated for their parents", "A first-gen kid translates for immigrant parents: softening an angry bank speech to 'she says hello', telling dad 'the teacher says i'm the best', describing diarrhea as 'stomach is sad', turning a threat to go to the news into 'thank you for your help'. At 31 in a board meeting mom texts 'what is adjustable rate'.")

# ------------------------------------------------------------------ 146 desi mom whatsapp
def desi_moms_whatsapp():
    K = dict(mom=person("c0392b", "brown", "black", style="bun"), kid=person("2a6fdb", "brown", "black", extra="hoodie"), aunt=person("3aa655", "brown", "black", style="long"), dad=person("8a6a45", "brown", "grey", extra="vest"))
    sh = [dayhook("a day in the life of a desi mom on whatsapp", K, "mom", "living", props=[P("phone", .72, .6, 300)], dur=3.0)]
    sh.append(sc(K, "6:02 AM", "bedroom_night", [A("mom", .3, "smile", "flex", 2.2)], [(0, "GOOD MORNING 🌻🙏 (to 9 groups)", .3, "buzz"), (0, "(replies: 'good morning 🌻🙏')", .4), (0, "(x 400)", .2, "buzz")], props=[P("phone", .72, .6, 300, anim="shake")], hud=[(0, "6:02 AM")]))
    sh.append(sc(K, "8:40 AM", "living", [A("mom", .26, "worried", "point", 2.1), A("kid", .76, "dead", "idle", 2.0, flip=True)],
        [(0, "do NOT drink water from the fridge", .4), (1, "why", .3), (0, "doctors in germany", .5), (1, "mom this is from 2011"), (0, "i know", .4), (0, "but what if", .2, "womp")]))
    sh.append(sc(K, "11:15 AM", "living", [A("aunt", .26, "smile", "talk", 2.1), A("mom", .76, "worried", "idle", 2.1, flip=True)],
        [(0, "uncle ramesh passed away", .5), (1, "(👍)", .6, "boom"), (0, "why did you thumbs up", .5), (1, "it means i saw it", .2, "womp")], props=[P("phone", .52, .6, 240)], hud=[(0, "11:15 AM")]))
    sh.append(sc(K, "1:30 PM", "living", [A("kid", .3, "dead", "idle", 2.2), A("mom", .76, "smile", "talk", 2.0, flip=True)],
        [(1, "(video call. it's just the ceiling)", .6), (0, "mom i can only see the fan", .5), (1, "yes it's on", .4), (1, "can you see it", .3), (0, "i'm looking at it", .2)], props=[P("phone", .52, .62, 240)], hud=[(0, "1:30 PM")]))
    sh.append(sc(K, "4:00 PM", "kitchen", [A("mom", .26, "smile", "talk", 2.1), A("kid", .76, "dead", "idle", 2.0, flip=True)],
        [(0, "(voice note) hello? is it recording?", .4), (0, "...", .5), (0, "(7 minutes later) anyway ok bye", .3), (1, "(transcript: a recipe, sharma aunty's knee, 'ok bye')", .4, "womp")], props=[P("phone", .52, .6, 240)], hud=[(0, "0:00"), (2.2, "7:12")]))
    sh.append(sc(K, "10:00 PM", "bedroom_night", [A("kid", .3, "worried", "idle", 2.2), A("mom", .76, "smile", "talk", 2.0, flip=True)],
        [(1, "(texts) call me. urgent.", .3, "buzz"), (0, "MOM WHAT HAPPENED", .4), (1, "nothing", .4), (1, "how do i make the font bigger", .2, "womp")], props=[P("phone", .52, .62, 240)], hud=[(0, "10:00 PM")]))
    return meta(Reel("146_desi_moms_whatsapp", sh, "pop", 146), "a day in the life of a desi mom on whatsapp", "'it means i saw it.' send this to your mom's good morning text", "A desi mom's WhatsApp day: 6am good-morning flowers to 9 groups, a 2011 'doctors in germany' forward, a thumbs-up on a death announcement ('it means i saw it'), a video call of the ceiling fan, a 7-minute voice note, and a 10pm 'urgent' text that's about font size.")

# ------------------------------------------------------------------ 018 indian families
def indian_families():
    K = dict(aunt=person("c0392b", "brown", "black", style="bun"), unc=person("8a6a45", "brown", "grey", extra="vest"), kid=person("2a6fdb", "brown", "black", extra="hoodie"), mom=person("3aa655", "brown", "black", style="long"), cuz=person("f4a300", "brown", "black"))
    sh = [lineup("indian families", ["aunt", "unc", "mom", "cuz", "kid"], K, "living", dur=3.0)]
    sh.append(sc(K, "THE DOOR", "hallway", [A("aunt", .26, "angry", "point", 2.1), A("kid", .76, "worried", "idle", 2.0, flip=True)],
        [(0, "shoes!", .4), (1, "they're off", .3), (0, "(looks at your socks)", .6), (0, "those also", .3, "boom"), (1, "...", .2)], props=[P("slipper", .5, .88, 160), P("slipper", .6, .88, 160, at=.2), P("slipper", .4, .88, 160, at=.3)]))
    sh.append(sc(K, "ONE QUICK CHAI", "living", [A("unc", .26, "smile", "talk", 2.1), A("kid", .76, "sleepy", "idle", 2.0, flip=True)],
        [(0, "just one quick chai", .4), (1, "(2 hours later) i'm good", .5, "tick"), (0, "biscuit?", .3), (1, "no thank you"), (0, "(puts out 12 biscuits)", .2, "pop")], props=[P("tea", .5, .8, 200), P("tea", .62, .8, 200, at=.4)], hud=[(0, "5:00 PM"), (2.2, "7:30 PM")]))
    sh.append(sc(K, "THE DABBA", "kitchen", [A("aunt", .26, "smile", "point", 2.1), A("kid", .76, "worried", "idle", 2.0, flip=True)],
        [(0, "take this", .3), (1, "no it's okay"), (0, "not for you", .5), (0, "bring it back", .3), (1, "ok"), (0, "FULL", .2, "boom")], props=[P("tupper", .5, .78, 280)]))
    sh.append(sc(K, "THE MATCH", "living", [A("aunt", .26, "smile", "talk", 2.1), A("kid", .76, "dead", "idle", 2.0, flip=True)],
        [(0, "so, anyone special?", .4), (1, "no aunty"), (0, "good. i know a girl", .4), (0, "doctor. very nice family", .4), (1, "aunty that's my cousin", .6), (0, "second cousin", .5), (1, "...", .3), (0, "only second", .2, "womp")]))
    sh.append(sc(K, "A WEEK LATER", "kitchen", [A("kid", .26, "smile", "flex", 2.1), A("aunt", .76, "worried", "idle", 2.1, flip=True)],
        [(0, "i brought the dabba back. i filled it", .4), (1, "(opens it)", .5), (1, "what is this", .4), (0, "pasta", .5), (1, "(tastes)", .8), (1, "needs salt", .3), (1, "(adds pickle, hands it back)", .2, "womp")], props=[P("tupper", .5, .78, 300)]))
    return meta(Reel("018_indian_families", sh, "bounce", 18), "indian families", "you can't return a dabba empty. tag the aunty who feeds you", "Indian family sketch: remove your socks too, one quick chai that lasts 2.5 hours, a dabba must be returned full (you return pasta; she adds pickle and sends it back), a match who is your second cousin ('only second'), and a goodbye that takes three hours.")

# ------------------------------------------------------------------ 148 desi dads driving
def desi_dads_driving():
    K = dict(dad=person("8a6a45", "brown", "grey", extra="vest"), kid=person("2a6fdb", "brown", "black", extra="hoodie"), pat=person("c0392b", "brown", "black", style="cap", cap="2a2a3a"), mom=person("3aa655", "brown", "black", style="long"), sh=person("f4a300", "brown", "grey"))
    sh = [lineup("desi dads driving", ["dad", "pat", "sh", "kid", "mom"], K, "highway", dur=3.0)]
    sh.append(sc(K, "THE SHORTCUT", "car", [A("dad", .26, "cool", "flex", 2.1), A("kid", .76, "worried", "idle", 2.0, flip=True)],
        [(1, "maps says 18 minutes", .3), (0, "maps is a suggestion", .5), (1, "it says 41 now"), (0, "i know a shortcut", .4, "pop"), (1, "now it's 63", .2)], hud=[(0, "ETA 18 MIN"), (1.6, "ETA 41 MIN"), (3.6, "ETA 63 MIN")]))
    sh.append(sc(K, "THE GAS", "car", [A("dad", .26, "smirk", "flex", 2.1), A("kid", .76, "dead", "idle", 2.0, flip=True)],
        [(0, "4 cents cheaper here", .3), (1, "we drove 15 minutes", .4), (1, "that cost us $3 in gas", .6), (0, "but we saved 4 cents", .5), (1, "we lost", .3), (0, "it's the principle", .2, "womp")]))
    sh.append(sc(K, "THE HONK", "street", [A("dad", .26, "angry", "point", 2.1), A("pat", .76, "dead", "idle", 2.0, flip=True)],
        [(0, "(honks, hard)", .4, "horn"), (0, "(sees who it is)", .5), (0, "PATEL! HELLO!", .4, "pop"), (1, "you just honked at me", .5), (0, "that's how we say hello", .2)]))
    sh.append(sc(K, "THE PARKING LOT", "parking", [A("dad", .26, "smirk", "flex", 2.1), A("kid", .76, "dead", "idle", 2.0, flip=True)],
        [(1, "there's a spot right there", .4), (0, "$3", .4, "boom"), (1, "dad", .3), (0, "(circles 20 min)", .5, "tick"), (0, "i found one on the street", .3), (1, "it's a mile away", .2)], hud=[(0, "0:00"), (2.4, "20:00")]))
    sh.append(sc(K, "ARRIVAL", "street", [A("dad", .26, "cool", "cheer", 2.1), A("mom", .76, "angry", "point", 2.1, flip=True)],
        [(0, "see? fast", .5), (1, "we're an hour late", .5), (0, "the driving was fast", .6), (0, "the route was long", .2, "womp")]))
    return meta(Reel("148_desi_dads_driving", sh, "funk", 148), "desi dads driving", "'the driving was fast. the route was long.' send this to your dad", "Desi dad driving sketch: a shortcut that takes ETA from 18 to 63 minutes, 15 minutes of driving to save 4 cents, the seatbelt chime is 'lying', honking at an old friend as a hello, circling 20 minutes to avoid $3 parking, arriving an hour late saying it was fast.")

# ------------------------------------------------------------------ 033 chinese families
def chinese_families():
    K = dict(mom=person("c0392b", "light", "black", style="bun"), uncle=person("2a6fdb", "light", "black", extra="vest"), uncle2=person("8a6a45", "light", "grey", extra="vest"), nai=person("2a2a3a", "light", "grey", style="bob"), kid=person("3aa655", "light", "black", extra="hoodie"), wait=person("f4f1ea", "tan", "black", extra="tie"))
    sh = [lineup("chinese families", ["mom", "uncle", "nai", "uncle2", "kid"], K, "kitchen", dur=3.0)]
    sh.append(sc(K, "ANY ILLNESS", "kitchen", [A("mom", .26, "worried", "point", 2.1), A("kid", .76, "dead", "idle", 2.0, flip=True)],
        [(0, "you look cold", .4), (1, "it's 80 degrees"), (0, "wear socks", .4), (1, "i'm not sick"), (0, "yet", .3, "boom"), (0, "drink hot water", .2)], props=[P("tea", .5, .82, 220)]))
    sh.append(sc(K, "THE BILL", "cafe", [A("uncle", .22, "angry", "point", 2.0), A("uncle2", .5, "angry", "point", 2.0), A("wait", .8, "worried", "idle", 2.0, flip=True)],
        [(0, "i pay!", .2, "boom"), (1, "no, i pay!", .3), (0, "you insult me", .3), (1, "(gets on the floor)", .6), (2, "sir it's already paid", .4), (0, "who??", .2), (1, "WHO", .6)], hud=[(0, "8:00 PM")]))
    sh.append(sc(K, "THE REVEAL", "cafe", [A("nai", .3, "cool", "idle", 2.0), A("uncle", .62, "dead", "idle", 2.0), A("uncle2", .86, "dead", "idle", 2.0, flip=True)],
        [(0, "(finishes tea. she paid before we sat)", .8, "sparkle"), (0, "sit down", .3, "boom")]))
    sh.append(sc(K, "THE COMPLIMENT", "living", [A("mom", .26, "smile", "talk", 2.1), A("kid", .76, "dead", "idle", 2.0, flip=True)],
        [(0, "you look so healthy!", .5), (1, "thank you?"), (0, "you got fat", .4, "pop"), (1, "what"), (0, "it's a good thing! you're eating", .2)]))
    sh.append(sc(K, "REPORT CARD", "living", [A("mom", .26, "dead", "idle", 2.1), A("kid", .76, "cool", "cheer", 2.0, flip=True)],
        [(1, "i got a 96!", .4), (0, "who got 100?", .5), (1, "nobody. 96 was the highest"), (0, "so you were the best of the second place", .3, "womp")]))
    sh.append(sc(K, "MIDNIGHT", "bedroom_night", [A("kid", .3, "sleepy", "slump", 2.2)],
        [(0, "(a plate of cut apples appears, no one says anything)", 1.0), (0, "i love you too", .2, "sparkle")], props=[P("dish", .7, .82, 260, food="e8d7b0")], hud=[(0, "12:10 AM")]))
    return meta(Reel("033_chinese_families", sh, "lofi", 33), "chinese families", "the apple plate is 'i love you.' tag your chinese friend", "Chinese family sketch: hot water and socks for any illness, two uncles fighting over a bill that grandma already paid before they sat, 'you got fat' as a compliment, 'best of the second place' for a 96, and silent cut fruit at midnight as an 'i love you'.")

# ------------------------------------------------------------------ 011 bmw guys
def bmw_guys():
    K = dict(bmw=person("2a2a3a", "light", "brown", glasses="round"), gf=person("e8a0b8", "light", "black", style="long"), mech=person("8a6a45", "light", "grey", extra="vest"), civic=person("3aa655", "tan", "black", style="cap", cap="f4f6f8"), dad=person("c0392b", "light", "grey", extra="vest"), kid=person("2a6fdb", "light", "brown"))
    sh = [lineup("bmw guys", ["bmw", "gf", "mech", "civic", "dad"], K, "dealer", dur=3.0)]
    sh.append(sc(K, "THE LANE CHANGE", "highway", [A("civic", .26, "scream", "idle", 2.1), A("bmw", .76, "cool", "flex", 2.0, flip=True)],
        [(1, "(3 lanes, no blinker)", .3, "horn"), (0, "SIGNAL!", .4), (1, "the blinker is a subscription", .6), (1, "i don't have it", .2, "womp")], props=[carp("2a2a3a", .5, .76, 360)], shake=[(.2, 6, .3)]))
    sh.append(sc(K, "THE PARKING", "parking", [A("bmw", .26, "smirk", "talk", 2.1), A("gf", .76, "dead", "idle", 2.0, flip=True)],
        [(1, "you're taking two spots", .4), (0, "so nobody dings her", .5), (1, "there's a civic next to us", .4), (0, "that's a civic's problem", .2, "boom")], props=[carp("2a2a3a", .5, .8, 340), carp("3aa655", .86, .8, 260)]))
    sh.append(sc(K, "THE STORE", "cafe", [A("bmw", .26, "cool", "flex", 2.1), A("gf", .76, "dead", "idle", 2.0, flip=True)],
        [(0, "(hazards on) two minutes", .4), (1, "that's 40 minutes", .4), (0, "it's a 3 series. i've earned the hazards", .2, "womp")], hud=[(0, "0:02"), (1.6, "0:41")]))
    sh.append(sc(K, "THE SHOP", "dealer", [A("mech", .26, "dead", "talk", 2.1), A("bmw", .76, "worried", "idle", 2.0, flip=True)],
        [(1, "a light came on", .4), (0, "which one", .3), (1, "...oil?", .4), (0, "that'll be $2,400", .4), (1, "for oil??", .4), (0, "for the looking", .2, "cash")], card=dict(title="$2,400", sub="\"for the looking\"", y=.4, at=2.6)))
    sh.append(sc(K, "THE LEASE", "street", [A("bmw", .26, "cool", "flex", 2.1), A("gf", .76, "worried", "idle", 2.0, flip=True)],
        [(0, "it's not a lease", .3), (0, "it's a long-term rental with equity", .5), (1, "that's a lease", .4), (0, "it's a lease", .2, "womp")]))
    sh.append(sc(K, "DAD'S TAKE", "parking", [A("dad", .26, "dead", "idle", 2.1), A("bmw", .76, "smile", "cheer", 2.0, flip=True)],
        [(1, "dad it's got heated seats", .4), (0, "my camry has a heater", .5), (1, "it's not the same", .4), (0, "it's 6 years of payments cheaper", .2, "boom")], props=[carp("2a2a3a", .5, .8, 340)]))
    return meta(Reel("011_bmw_guys", sh, "trap", 11), "bmw guys", "'the blinker is a subscription.' tag a bmw guy", "BMW guy sketch: no blinker across three lanes, taking two spots next to a Civic, hazards on for a 40-minute 'two minutes', $2,400 'for the looking', a lease called a long-term rental with equity, and dad's Camry has a heater.")

# ------------------------------------------------------------------ 022 tesla guys
def tesla_guys():
    K = dict(dave=person("f4f6f8", "light", "brown", glasses="round"), friend=person("2a6fdb", "tan", "black"), gf=person("e8a0b8", "light", "black", style="long"), cust=person("3aa655", "light", "brown", style="cap", cap="2a2a3a"), dad=person("8a6a45", "light", "grey", extra="vest"), kid=person("c0392b", "light", "black"))
    sh = [lineup("tesla guys", ["dave", "friend", "gf", "cust", "dad"], K, "parking", dur=3.0)]
    sh.append(sc(K, "THE 0-60", "car", [A("dave", .26, "cool", "flex", 2.1), A("friend", .76, "scream", "idle", 2.0, flip=True)],
        [(0, "watch this", .3), (0, "(floors it)", .3, "boom"), (1, "i'm going to throw up", .6), (0, "that's the sound of the future", .5), (1, "there's no sound", .3), (0, "exactly", .2, "womp")], shake=[(.8, 10, .6)]))
    sh.append(sc(K, "CHARGING", "parking", [A("dave", .26, "smirk", "talk", 2.1), A("gf", .76, "dead", "idle", 2.0, flip=True)],
        [(0, "no gas. it's good for the planet", .5), (1, "we're at a wendy's", .4), (1, "it's been 45 minutes", .4), (0, "i'm being productive", .4), (1, "you're holding a frosty", .2, "womp")], props=[carp("f4f6f8", .5, .8, 360)], hud=[(0, "0:45")]))
    sh.append(sc(K, "AUTOPILOT", "car", [A("dave", .26, "cool", "flex", 2.1), A("friend", .76, "dead", "idle", 2.0, flip=True)],
        [(0, "it drives itself", .3), (1, "why are your hands on the wheel", .5), (0, "legal reasons", .4), (1, "and your eyes?", .4), (0, "also legal", .2, "womp")]))
    sh.append(sc(K, "THE FRUNK", "parking", [A("dave", .26, "cool", "point", 2.1), A("cust", .76, "dead", "idle", 2.0, flip=True)],
        [(0, "look. the frunk", .3), (1, "a trunk in the front", .4), (0, "a FRUNK", .3, "pop"), (0, "(puts one grocery bag in)", .6), (1, "...", .3)], props=[carp("f4f6f8", .5, .8, 340)]))
    sh.append(sc(K, "THE WEDDING", "wedding", [A("dave", .26, "cool", "flex", 2.1), A("gf", .76, "dead", "idle", 2.0, flip=True)],
        [(0, "i, dave, take you", .3), (0, "to have and to hold", .4), (0, "and it has 322 miles of range", .5, "boom"), (1, "...i do", .4, "womp")]))
    return meta(Reel("022_tesla_guys", sh, "synth", 22), "tesla guys", "'it's a computer. with seats.' send this to a tesla guy", "Tesla guy sketch: the 0-60 'sound of the future' is silence, charging 45 minutes at a Wendy's while 'productive', hands on the wheel for 'legal reasons', can't open the car at 2% phone, the one-bag frunk, and mentioning range in his wedding vows.")

# ------------------------------------------------------------------ 111 immigrant parents
def immigrant_parents():
    K = dict(mom=person("c0392b", "brown", "black", style="bun"), dad=person("8a6a45", "brown", "grey", extra="vest"), kid=person("2a6fdb", "brown", "black", extra="hoodie"), wait=person("f4f1ea", "light", "brown", extra="tie"), neigh=person("3aa655", "light", "brown"))
    sh = [lineup("immigrant parents", ["mom", "dad", "kid", "wait", "neigh"], K, "kitchen", dur=3.0)]
    sh.append(sc(K, "THE DRAWER", "kitchen", [A("kid", .26, "scream", "idle", 2.1), A("mom", .76, "smile", "point", 2.0, flip=True)],
        [(0, "why do we have 400 bags", .4, "pop"), (1, "for when we need bags", .5), (0, "we have 400 bags", .5), (1, "what if we need 401", .2, "womp")], props=[P("basket", .5, .86, 260)]))
    sh.append(sc(K, "THE RESTAURANT", "cafe", [A("dad", .26, "smirk", "talk", 2.1), A("wait", .76, "dead", "idle", 2.0, flip=True)],
        [(0, "four waters. no ice", .4), (0, "bread is free?", .4), (1, "yes sir", .3), (0, "bring all", .4, "pop"), (0, "(pockets the sugar packets)", .6), (0, "for home", .2)], hud=[(0, "7:00 PM")]))
    sh.append(sc(K, "THE THERMOSTAT", "living", [A("dad", .26, "dead", "idle", 2.1), A("kid", .76, "worried", "idle", 2.0, flip=True)],
        [(1, "dad it's freezing", .3), (0, "put on a sweater", .5), (1, "it's july", .3), (0, "put on two", .2, "womp")], props=[P("sign", .5, .4, 220, text="68°", fg="2a6fdb")]))
    sh.append(sc(K, "BIRTHDAY GIFT", "living", [A("dad", .26, "smile", "cheer", 2.1), A("kid", .76, "worried", "idle", 2.0, flip=True)],
        [(0, "happy birthday. i found this", .4), (1, "...where", .4), (0, "outside someone's house", .5), (0, "it works", .3, "sparkle"), (1, "(it's a lamp)", .2)], props=[P("note", .5, .6, 220, text="FREE")]))
    sh.append(sc(K, "THE COUCH", "living", [A("kid", .26, "smile", "flex", 2.1), A("mom", .76, "worried", "idle", 2.0, flip=True)],
        [(0, "i bought you a new couch", .4), (1, "(sits on the edge)", .6), (0, "mom you can lean back", .4), (1, "it has plastic", .4), (0, "it's been two years", .4), (1, "it's for guests", .3), (0, "we are the guests", .2, "womp")], props=[P("couch", .6, .8, 460)]))
    return meta(Reel("111_immigrant_parents", sh, "lofi", 111), "immigrant parents", "'what if we need 401.' tag your parents", "Immigrant parents sketch: 400 plastic bags in a drawer 'for when we need bags', a restaurant order of four waters and pocketed sugar, 'put on two sweaters' in July, a lamp found outside as a birthday gift, and a new couch the parents still keep in plastic 'for guests'.")

# ------------------------------------------------------------------ 134 arab dads
def arab_dads():
    K = dict(dad=person("8a6a45", "tan", "grey", extra="vest"), kid=person("2a6fdb", "tan", "black", extra="hoodie"), mom=person("c0392b", "tan", "black", style="long"), unc=person("3aa655", "tan", "grey"), mech=person("2a2a3a", "tan", "black"))
    sh = [lineup("arab dads", ["dad", "unc", "mech", "kid", "mom"], K, "living", dur=3.0)]
    sh.append(sc(K, "STUDYING", "bedroom_night", [A("dad", .26, "smile", "point", 2.1), A("kid", .76, "worried", "idle", 2.0, flip=True)],
        [(0, "(peels an apple. hands it over)", .6), (1, "i'm studying", .4), (0, "eat", .5), (1, "dad i'm", .2), (0, "eat.", .3, "boom")], props=[P("apple", .5, .8, 240)]))
    sh.append(sc(K, "THE PHONE CALL", "living", [A("dad", .26, "angry", "point", 2.1), A("kid", .76, "worried", "idle", 2.0, flip=True)],
        [(0, "(yelling into the phone at his brother)", .4, "boom"), (1, "is everything okay?!", .5), (0, "yes! we're deciding lunch!", .4), (0, "WALLAH!!", .2, "boom")], shake=[(.4, 6, 2)]))
    sh.append(sc(K, "THE CAMRY", "parking", [A("dad", .26, "cool", "flex", 2.1), A("kid", .76, "dead", "idle", 2.0, flip=True)],
        [(1, "it has 340,000 miles", .3), (0, "it's just getting started", .5), (1, "the check engine light is a lamp now", .4), (0, "it's decoration", .2, "womp")], props=[P("car", .5, .8, 440)]))
    sh.append(sc(K, "THE PRICE", "store", [A("dad", .26, "smirk", "talk", 2.1), A("unc", .76, "dead", "idle", 2.0, flip=True)],
        [(0, "i paid $10. wallah", .4), (1, "your receipt says $3", .4), (0, "wallah. $10", .5), (1, "(shows receipt)", .4), (0, "that's the other store", .2, "womp")], card=dict(title="$3.00", sub="\"wallah $10\"", y=.4, at=2.2)))
    sh.append(sc(K, "THE LOVE", "street", [A("dad", .26, "smile", "flex", 2.1), A("kid", .76, "sad", "idle", 2.0, flip=True)],
        [(1, "dad my tire is flat", .4), (0, "(it's midnight, he's already outside)", .6, "pop"), (0, "(fixing it)", .4), (1, "i love you", .5), (0, "your oil is low", .2, "womp")], props=[P("cone", .5, .86, 160)], hud=[(0, "12:10 AM")]))
    return meta(Reel("134_arab_dads", sh, "synth", 134), "arab dads", "he can't say i love you. he'll fix your tire at midnight. tag your dad", "Arab dad sketch: peeling an apple as an order, yelling at his brother on the phone about lunch, a 340,000-mile Camry with a check-engine lamp as decoration, 'wallah' price claims, and fixing your tire at midnight then answering 'i love you' with 'your oil is low'.")

# ------------------------------------------------------------------ 076 oldest siblings
def oldest_siblings():
    K = dict(old=person("2a6fdb", "light", "brown", extra="hoodie"), mom=person("c0392b", "light", "black", style="bun"), young=person("f4a300", "light", "brown"), dad=person("8a6a45", "light", "grey", extra="vest"), mid=person("3aa655", "light", "brown", style="long"))
    sh = [lineup("oldest siblings", ["old", "mid", "young", "mom", "dad"], K, "living", dur=3.0)]
    sh.append(sc(K, "MOM LEAVES FOR 10 MIN", "living", [A("mom", .26, "smile", "talk", 2.1), A("old", .76, "worried", "idle", 2.0, flip=True)],
        [(0, "you're in charge", .4), (1, "of what", .3), (0, "everything. if anything happens", .4), (0, "it's your fault", .2, "boom")], hud=[(0, "AGE 10")]))
    sh.append(sc(K, "10 MIN LATER", "living", [A("mom", .26, "angry", "point", 2.1), A("old", .76, "dead", "idle", 2.0, flip=True), A("young", .5, "smile", "idle", 1.6)],
        [(0, "WHY IS THE VASE BROKEN", .3, "crash"), (1, "he did it", .4), (0, "why did you let him", .4), (1, "i was in the bathroom", .5), (0, "you should've held it", .2, "womp")], props=[P("jar", .5, .86, 160)], shake=[(.3, 8, .3)]))
    sh.append(sc(K, "CURFEW", "hallway", [A("old", .26, "sad", "idle", 2.1), A("mom", .76, "dead", "idle", 2.0, flip=True)],
        [(0, "i had a 9pm curfew", .3), (0, "i got grounded 3 weeks for being 4 minutes late", .5), (1, "your brother's home at 2am", .4), (0, "...", .3), (1, "he's tired", .2, "womp")], hud=[(0, "2:04 AM")]))
    sh.append(sc(K, "THE PHONE", "living", [A("old", .26, "smile", "talk", 2.1), A("dad", .76, "dead", "idle", 2.0, flip=True)],
        [(0, "can i get a phone", .3), (1, "when you're 16", .5), (0, "(youngest, age 4, holding an ipad)", .5), (1, "he's the baby", .2, "womp")], props=[P("phone", .66, .66, 200)]))
    sh.append(sc(K, "NOW, AGE 31", "living", [A("old", .3, "dead", "idle", 2.2)],
        [(0, "(mom texts) can you talk to your brother", .4, "buzz"), (0, "(dad texts) can you talk to mom", .4, "buzz"), (0, "(brother texts) can you talk to both", .4, "buzz"), (0, "i am the family's hr department", .3, "womp")], props=[P("phone", .62, .62, 240, anim="shake")], hud=[(0, "AGE 31")]))
    return meta(Reel("076_oldest_siblings", sh, "bounce", 76), "oldest siblings", "you're the family's hr department. send this to your oldest sibling", "Oldest-sibling sketch: left in charge for 10 minutes and blamed for the baby's broken vase, grounded 3 weeks for being 4 minutes late while the youngest comes home at 2am, the youngest gets an iPad at 4, and at 31 you're the family's HR department.")

# ------------------------------------------------------------------ 077 youngest siblings
def youngest_siblings():
    K = dict(young=person("f4a300", "light", "brown"), old=person("2a6fdb", "light", "brown", extra="hoodie"), mom=person("c0392b", "light", "black", style="bun"), dad=person("8a6a45", "light", "grey", extra="vest"), mid=person("3aa655", "light", "brown", style="long"))
    sh = [lineup("youngest siblings", ["young", "mid", "old", "mom", "dad"], K, "living", dur=3.0)]
    sh.append(sc(K, "THE SHIRT", "bedroom_night", [A("young", .26, "worried", "idle", 2.1), A("mom", .76, "smile", "talk", 2.0, flip=True)],
        [(0, "this says 'camp tahoe 2009'", .3), (1, "it's a good shirt", .4), (0, "i was born in 2009", .3), (1, "and now you're wearing it", .2, "womp")]))
    sh.append(sc(K, "THE NAME", "kitchen", [A("mom", .26, "angry", "point", 2.1), A("young", .76, "smile", "idle", 2.0, flip=True)],
        [(0, "BRANDON", .2), (0, "JESSICA", .2), (0, "BISCUIT", .2), (0, "...YOU", .4, "boom"), (1, "i'm literally the baby", .2)]))
    sh.append(sc(K, "THE PHOTOS", "living", [A("young", .26, "sad", "idle", 2.1), A("dad", .76, "smile", "talk", 2.0, flip=True)],
        [(0, "there's 400 photos of the oldest", .3), (0, "and 12 of me", .4), (1, "8 are good", .5), (0, "7 are blurry", .3), (1, "you were moving", .2, "womp")], props=[P("book", .5, .8, 240)]))
    sh.append(sc(K, "THE CRIME", "living", [A("young", .26, "smile", "idle", 2.1), A("mom", .76, "angry", "point", 2.0, flip=True), A("old", .52, "worried", "idle", 2.1)],
        [(1, "WHO BROKE THE LAMP", .3, "crash"), (0, "(cries immediately)", .5), (1, "oh my baby", .3), (1, "(to the oldest) why were you not watching him", .3), (0, "(wipes fake tears. smirks)", .2, "womp")], props=[P("sign", .84, .66, 160, text="lamp")]))
    sh.append(sc(K, "AGE 26", "wedding", [A("young", .26, "dead", "idle", 2.1), A("mom", .76, "smile", "talk", 2.0, flip=True)],
        [(1, "this is my youngest! the baby", .4), (0, "i'm 26", .4), (1, "he's still learning to drive", .5), (0, "i drove here", .3), (1, "(he's still learning)", .2, "womp")], hud=[(0, "AGE 26")]))
    return meta(Reel("077_youngest_siblings", sh, "funk", 77), "youngest siblings", "mom says every name in the house before yours. send this to the baby of the family", "Youngest-sibling sketch: a hand-me-down 'camp tahoe 2009' shirt, mom calling brandon jessica and the dog biscuit before the youngest's name, 400 photos of the oldest and 12 blurry ones of you, instant fake tears so the oldest gets blamed, and at 26 still introduced as the baby.")

REELS = dict(desi_doctor_pressure=desi_doctor_pressure, mexican_families=mexican_families, italian_families=italian_families, dog_cat_people=dog_cat_people, first_gen_kids=first_gen_kids, desi_moms_whatsapp=desi_moms_whatsapp, indian_families=indian_families, desi_dads_driving=desi_dads_driving, chinese_families=chinese_families, bmw_guys=bmw_guys, tesla_guys=tesla_guys, immigrant_parents=immigrant_parents, arab_dads=arab_dads, oldest_siblings=oldest_siblings, youngest_siblings=youngest_siblings)
