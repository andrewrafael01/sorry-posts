"""Batch 18: second round of dialogue-first rewrites."""
from arch import *
from scripts.b17 import talk, sc, meta

def immigrant_moms():
    K = dict(mom=person("c0392b", "brown", "black", style="bun"), kid=person("2a6fdb", "brown", "black", extra="hoodie"), aunt=person("3aa655", "brown", "black", style="long"), dad=person("8a6a45", "brown", "grey", extra="vest"), nbr=person("f4a300", "brown", "black"))
    sh = [lineup("immigrant moms in the kitchen", ["mom", "aunt", "kid", "nbr", "dad"], K, "kitchen", dur=3.0)]
    sh.append(sc(K, "JUST SOMETHING SMALL", "kitchen", [A("kid", .26, "worried", "idle", 2.1), A("mom", .76, "smile", "flex", 2.0, flip=True)],
        [(0, "mom what are you making", .3), (1, "something small", .5), (0, "who's coming", .3), (1, "nobody", .4), (0, "then why are there 40 samosas", .4), (1, "in case", .2, "womp")], props=[P("pot", .5, .66, 320, kw=dict(steam=True)), P("dish", .52, .88, 260)]))
    sh.append(sc(K, "THE RECIPE", "kitchen", [A("kid", .26, "smile", "talk", 2.1), A("mom", .76, "smile", "talk", 2.0, flip=True)],
        [(0, "how much salt", .3), (1, "enough", .4), (0, "how long do i cook it", .3), (1, "until it's ready", .4), (0, "what temperature", .3), (1, "hot", .5), (0, "mom i can't make this", .3), (1, "you don't need to. i'll make it", .2, "sparkle")]))
    sh.append(sc(K, "I'LL HELP", "kitchen", [A("kid", .26, "smile", "flex", 2.1), A("mom", .76, "angry", "point", 2.0, flip=True)],
        [(0, "let me help", .3), (1, "no no sit", .5), (0, "(starts chopping)", .5), (1, "you're doing it wrong", .5), (0, "(stops)", .6), (1, "why aren't you helping", .2, "boom")]))
    sh.append(sc(K, "LEFTOVERS", "kitchen", [A("kid", .26, "worried", "idle", 2.1), A("mom", .76, "smile", "point", 2.0, flip=True)],
        [(0, "i'm still eating", .3), (1, "(wraps your plate)", .6), (0, "mom", .3), (1, "you're done", .2, "boom")], props=[P("tupper", .5, .8, 300, n_=3)]))
    sh.append(sc(K, "AGE 31, YOUR KITCHEN", "kitchen", [A("kid", .26, "cool", "cheer", 2.1), A("mom", .76, "smile", "talk", 2.0, flip=True)],
        [(0, "mom i made your dish. it tastes exactly the same", .4), (1, "of course", .5), (1, "i forgot to tell you the secret", .4), (0, "what is it", .3), (1, "love", .5, "sparkle"), (1, "and two sticks of butter", .2, "womp")], props=[P("pot", .5, .66, 300, kw=dict(steam=True))]))
    return meta(Reel("113_immigrant_moms", sh, "lofi", 113), "immigrant moms in the kitchen", "the secret ingredient is love and two sticks of butter. tag your mom", "Immigrant mom in the kitchen: 'something small' with 40 samosas 'in case', a recipe made of 'enough', 'until it's ready' and 'hot', refusing help then asking why you're not helping, wrapping your plate while you're eating, and the secret to the dish being love and two sticks of butter.")

def immigrant_dads():
    K = dict(dad=person("8a6a45", "brown", "grey", extra="vest"), kid=person("2a6fdb", "brown", "black", extra="hoodie"), cash=person("f4f1ea", "light", "brown", extra="tie"), wait=person("3aa655", "tan", "black"), kid2=person("f4a300", "brown", "black"))
    sh = [lineup("immigrant dads", ["dad", "kid", "cash", "wait", "kid2"], K, "store", dur=3.0)]
    sh.append(sc(K, "THE COUPON", "store", [A("dad", .26, "smirk", "flex", 2.1), A("cash", .76, "dead", "idle", 2.0, flip=True)],
        [(0, "i have a coupon", .3), (1, "sir, this expired in 2019", .5), (0, "try", .4), (1, "(tries)", .5), (1, "it's declined", .3), (0, "try again", .2, "womp")], props=[P("receipt", .5, .62, 220)]))
    sh.append(sc(K, "I CAN FIX IT", "kitchen", [A("dad", .26, "cool", "flex", 2.1), A("kid", .76, "worried", "idle", 2.0, flip=True)],
        [(1, "dad call a plumber", .3), (0, "i am a plumber", .5), (1, "since when", .3), (0, "since 20 minutes ago", .3, "pop"), (0, "(watches 3 youtube videos)", .5), (0, "(water everywhere)", .2, "crash")], props=[P("mop", .5, .8, 320)]))
    sh.append(sc(K, "THE RESTAURANT", "cafe", [A("dad", .26, "smile", "talk", 2.1), A("kid", .76, "smile", "idle", 2.0, flip=True)],
        [(0, "order whatever you want", .4), (1, "(orders the steak)", .6), (0, "not that", .4, "boom"), (1, "you said whatever", .3), (0, "not THAT whatever", .2, "womp")], props=[P("receipt", .5, .62, 200)]))
    sh.append(sc(K, "THE AIRPORT", "airport", [A("dad", .26, "dead", "idle", 2.1), A("kid", .76, "sad", "idle", 2.0, flip=True)],
        [(0, "(hands you a bag of oranges)", .6), (1, "dad i'm flying", .4), (0, "eat", .4), (1, "i love you", .4), (0, "don't forget to eat", .2, "womp")], props=[P("backpack", .5, .84, 260)]))
    sh.append(sc(K, "AGE 35, THE STORE", "store", [A("kid2", .26, "smirk", "flex", 2.1), A("cash", .76, "dead", "idle", 2.0, flip=True)],
        [(0, "i have a coupon", .3), (1, "sir, it expired in 2019", .5), (0, "try it", .4), (0, "...", .6), (0, "oh no. i'm him", .2, "womp")], hud=[(0, "AGE 35")]))
    return meta(Reel("114_immigrant_dads", sh, "synth", 114), "immigrant dads", "'oh no. i'm him.' tag your dad and yourself", "Immigrant dad sketch: an expired coupon, becoming a plumber via YouTube, 'not THAT whatever' at the restaurant, bag of oranges at the airport as i love you, and the kid at 35 repeating 'try it' at the register and realizing he's become his dad.")

def desi_aunties():
    K = dict(aunt=person("c0392b", "brown", "black", style="bun"), kid=person("2a6fdb", "brown", "black", extra="hoodie"), aunt2=person("3aa655", "brown", "black", style="long"), aunt3=person("f4a300", "brown", "black", style="bob"), mom=person("e8a0b8", "brown", "black", style="long"))
    sh = [lineup("desi aunties", ["aunt", "aunt2", "mom", "aunt3", "kid"], K, "living", dur=3.0)]
    sh.append(sc(K, "THE ENTRANCE", "hallway", [A("aunt", .26, "smile", "wave", 2.1), A("mom", .76, "smile", "wave", 2.0, flip=True)],
        [(0, "i brought nothing!", .4), (0, "(hands over 4 containers)", .6), (1, "you didn't have to", .4), (0, "it's nothing, only 11 kilos", .2, "pop")], props=[P("tupper", .5, .82, 340, n_=3)]))
    sh.append(sc(K, "THE COMPLIMENT", "living", [A("aunt", .26, "smile", "talk", 2.1), A("kid", .76, "dead", "idle", 2.0, flip=True)],
        [(0, "you look so healthy", .4), (1, "thank you", .3), (0, "you've gotten dark", .4, "boom"), (1, "i was in the sun", .3), (0, "use fair and lovely", .4), (1, "aunty i'm 31", .2, "womp")]))
    sh.append(sc(K, "THE SECRET", "living", [A("aunt", .22, "worried", "talk", 2.0), A("aunt2", .5, "shock", "talk", 2.0), A("aunt3", .78, "shock", "idle", 2.0, flip=True)],
        [(0, "don't tell anyone, but sharma's daughter", .4), (1, "WHAT", .3), (0, "i only told you", .4), (1, "(calls the next aunty)", .5, "buzz"), (2, "who told you", .3), (1, "your friend. only me", .2, "womp")]))
    sh.append(sc(K, "THE FOOD PHOTO", "kitchen", [A("aunt", .26, "cool", "point", 2.1), A("kid", .76, "worried", "idle", 2.0, flip=True)],
        [(1, "can we eat", .3), (0, "wait. the light", .4), (0, "(40 photos)", .5, "camera"), (1, "it's cold", .3), (0, "it's for the family group", .2, "womp")], props=[P("dish", .5, .84, 300), P("phone", .84, .5, 180)]))
    sh.append(sc(K, "THE VISIT", "hallway", [A("aunt", .26, "smile", "talk", 2.1), A("mom", .76, "worried", "idle", 2.0, flip=True)],
        [(0, "i'm only staying one night", .4), (1, "of course", .3), (0, "(day 9)", .3, "tick"), (1, "...", .5), (0, "this bed is so comfortable", .2, "womp")], hud=[(0, "DAY 1"), (1.6, "DAY 9")]))
    return meta(Reel("109_desi_aunties", sh, "pop", 109), "desi aunties", "'i only told you.' tag the aunty who started it", "Desi auntie sketch: arriving with 'nothing' (11 kilos of food), a backhanded compliment about skin, a secret passed to the entire network ('i only told you'), 40 photos of the food while it gets cold, and one night that becomes nine.")

def middle_children():
    K = dict(mid=person("3aa655", "light", "brown", style="long"), old=person("2a6fdb", "light", "brown", extra="hoodie"), young=person("f4a300", "light", "brown"), mom=person("c0392b", "light", "black", style="bun"), dad=person("8a6a45", "light", "grey", extra="vest"))
    sh = [lineup("middle children", ["old", "mid", "young", "mom", "dad"], K, "living", dur=3.0)]
    sh.append(sc(K, "THE PIZZA", "kitchen", [A("old", .22, "smirk", "flex", 2.0), A("mid", .5, "dead", "idle", 2.0), A("young", .78, "smile", "cheer", 2.0, flip=True)],
        [(0, "oldest gets the first slice", .4), (1, "youngest gets the biggest", .4), (2, "(slides the crust over)", .6), (2, "middle gets the crust", .2, "womp")], props=[P("dish", .5, .86, 260, food="e8a030")]))
    sh.append(sc(K, "THE PHOTO", "living", [A("mom", .26, "smile", "talk", 2.1), A("mid", .76, "dead", "idle", 2.0, flip=True)],
        [(0, "family photo!", .4), (0, "oldest in the front", .4), (0, "baby in my arms", .4), (1, "where do i go", .4), (0, "just stand behind someone", .2, "womp")]))
    sh.append(sc(K, "THE RULES", "living", [A("mid", .26, "worried", "idle", 2.1), A("dad", .76, "dead", "idle", 2.0, flip=True)],
        [(0, "oldest got a phone at 16. youngest got one at 6", .4), (0, "when do i get a phone", .4), (1, "you're so independent, you don't need one", .3, "boom"), (0, "that's not a reason", .2)]))
    sh.append(sc(K, "THE FAVORITE", "kitchen", [A("mom", .26, "smile", "talk", 2.1), A("mid", .76, "dead", "idle", 2.0, flip=True)],
        [(0, "i love you all equally", .4), (1, "who's your favorite", .4), (0, "...", .8), (1, "mom", .3), (0, "i'm thinking", .2, "boom")]))
    sh.append(sc(K, "AGE 30, THE GROUP CHAT", "living", [A("mid", .3, "cool", "idle", 2.2)],
        [(0, "(planning mom's party, buying the gift, booking the venue)", .4), (0, "(the card reads: from oldest and youngest)", .5, "womp"), (0, "(and me, in smaller font)", .2)], hud=[(0, "AGE 30")]))
    return meta(Reel("078_middle_children", sh, "jazz", 78), "middle children", "'just stand behind someone.' tag a middle child", "Middle-child sketch: the crust of the pizza, 'stand behind someone' in the family photo, no phone because they're 'independent', mom thinking too long when asked about her favorite, and doing all the planning for mom's birthday only to be signed in a smaller font.")

def desi_kids():
    K = dict(kid=person("2a6fdb", "brown", "black", extra="hoodie"), mom=person("c0392b", "brown", "black", style="bun"), dad=person("8a6a45", "brown", "grey", extra="vest"), friend=person("3aa655", "light", "brown"), teach=person("a678de", "light", "brown", glasses="round"))
    sh = [lineup("kids of desi parents", ["kid", "mom", "dad", "friend", "teach"], K, "living", dur=3.0)]
    sh.append(sc(K, "THE SLEEPOVER", "living", [A("kid", .26, "smile", "talk", 2.1), A("mom", .76, "dead", "idle", 2.0, flip=True)],
        [(0, "can i go to a sleepover", .3), (1, "no", .4), (0, "everyone is going", .3), (1, "everyone is not our child", .2, "boom")]))
    sh.append(sc(K, "THE PARTY INTERROGATION", "living", [A("dad", .26, "dead", "idle", 2.1), A("kid", .76, "worried", "idle", 2.0, flip=True)],
        [(1, "i'm going to a party", .3), (0, "whose party", .3), (1, "a friend's", .3), (0, "name, address, parents' names", .4), (0, "what do the parents do", .4), (1, "dad it's a birthday", .3), (0, "what is their caste", .2, "womp")]))
    sh.append(sc(K, "THE SCIENCE PROJECT", "bedroom_night", [A("dad", .26, "cool", "flex", 2.1), A("kid", .76, "sleepy", "slump", 2.0, flip=True)],
        [(0, "move. i'll show you", .4), (0, "(3 hours later, he's built a working turbine)", .6, "sparkle"), (1, "dad it's due tomorrow", .3), (0, "it's done", .2)], hud=[(0, "11:40 PM"), (2.4, "2:55 AM")]))
    sh.append(sc(K, "THE NEXT DAY", "class", [A("teach", .26, "dead", "talk", 2.1), A("kid", .76, "worried", "idle", 2.0, flip=True)],
        [(0, "this looks like an adult made it", .5), (1, "my dad", .3), (0, "it has a patent number", .4), (1, "he got excited", .2, "womp")]))
    sh.append(sc(K, "THE FRIEND'S MOM", "living", [A("friend", .26, "smile", "talk", 2.1), A("kid", .76, "worried", "idle", 2.0, flip=True)],
        [(0, "my mom said you can come over", .4), (1, "...she said that?", .4), (0, "yes. i'm not allowed over yours", .3), (1, "nobody is", .2, "womp")]))
    return meta(Reel("110_desi_kids", sh, "bounce", 110), "kids of desi parents", "'everyone is not our child.' tag a desi kid", "Desi kid sketch: sleepover denied with 'everyone is not our child', a party interrogation that ends with 'what is their caste', dad builds a working turbine for the science project with a patent number, and nobody's allowed over to your house.")

def home_remedies():
    K = dict(nani=person("c0392b", "brown", "grey", style="bob"), kid=person("2a6fdb", "brown", "black", extra="hoodie"), doc=person("f4f1ea", "light", "brown", extra="tie"), mom=person("3aa655", "brown", "black", style="bun"))
    sh = [lineup("home remedy believers", ["nani", "mom", "kid", "doc"], K, "living", dur=3.0)]
    sh.append(sc(K, "ANY PROBLEM", "living", [A("kid", .26, "worried", "idle", 2.1), A("nani", .76, "worried", "point", 2.0, flip=True)],
        [(0, "my head hurts", .3), (1, "oil", .5), (0, "my knee hurts", .3), (1, "oil", .5), (0, "my girlfriend dumped me", .3), (1, "did you oil your head?", .2, "womp")], props=[P("jar", .5, .8, 220, kw=dict(color="e8c07a"))]))
    sh.append(sc(K, "THE EVIL EYE", "kitchen", [A("nani", .26, "cool", "flex", 2.1), A("kid", .76, "scream", "idle", 2.0, flip=True)],
        [(0, "(burns chilies and salt, circles your head)", .6, "alarm"), (1, "i can't breathe", .4), (0, "that's the eye leaving", .2, "womp")], props=[P("smoke", .5, .6, 300)]))
    sh.append(sc(K, "THE DOCTOR", "hospital", [A("doc", .26, "dead", "talk", 2.1), A("kid", .76, "worried", "idle", 2.0, flip=True)],
        [(0, "take two of these a day", .4), (1, "my grandma says onions in my socks", .5), (0, "does it work", .3), (1, "no", .3), (1, "but she believes", .2, "womp")]))
    sh.append(sc(K, "THE TWIG", "living", [A("nani", .26, "smile", "point", 2.1), A("kid", .76, "dead", "idle", 2.0, flip=True)],
        [(0, "pills are chemicals. take this", .4), (1, "that's a twig", .3), (0, "from a very old tree", .2, "womp")]))
    sh.append(sc(K, "NANI GETS SICK", "bedroom_night", [A("nani", .26, "sleepy", "slump", 2.1), A("kid", .76, "worried", "idle", 2.0, flip=True)],
        [(0, "(takes 3 pills)", .5), (1, "nani? those are chemicals", .5), (0, "don't tell anyone", .5), (0, "the doctor said these ones are different", .2, "womp")]))
    return meta(Reel("115_home_remedies", sh, "lofi", 115), "home remedy believers", "'did you oil your head?' for heartbreak too. tag your nani", "Home-remedy sketch: oil for everything including a breakup, burnt chilies for the evil eye ('that's the eye leaving'), onions in socks that 'she believes in', a twig from a very old tree, and nani secretly taking three pills.")

def desi_weddings():
    K = dict(unc=person("8a6a45", "brown", "grey", extra="vest"), aunt=person("c0392b", "brown", "black", style="bun"), kid=person("2a6fdb", "brown", "black", extra="hoodie"), dad=person("f4a300", "brown", "grey"), groom=person("3aa655", "brown", "black"))
    sh = [lineup("desi wedding guests", ["unc", "aunt", "kid", "dad", "groom"], K, "wedding", dur=3.0)]
    sh.append(sc(K, "THE GUESTS", "wedding", [A("kid", .26, "worried", "idle", 2.1), A("unc", .76, "smile", "talk", 2.0, flip=True)],
        [(0, "who is that man", .3), (1, "i don't know", .4), (0, "why are we talking to him", .3), (1, "he's family", .4), (0, "how", .3), (1, "he gave us a gift in 2004", .2, "womp")]))
    sh.append(sc(K, "THE GOLD", "wedding", [A("aunt", .26, "smirk", "flex", 2.1), A("kid", .76, "dead", "idle", 2.0, flip=True)],
        [(0, "my necklace is 24 karat", .3), (1, "(another aunty) mine is 25", .4), (0, "that's not a number", .3), (1, "it's a family number", .2, "womp")]))
    sh.append(sc(K, "THE DJ", "wedding", [A("unc", .26, "cool", "cheer", 2.1), A("kid", .76, "sleepy", "slump", 2.0, flip=True)],
        [(0, "(dj plays the same song 9 times)", .5, "boom"), (1, "uncle it's the same song", .4), (0, "this song is great", .3), (0, "(dances with a scarf)", .2)], shake=[(.4, 4, 2.5)]))
    sh.append(sc(K, "THE BUFFET LINE", "wedding", [A("aunt", .26, "smile", "talk", 2.1), A("kid", .76, "angry", "point", 2.0, flip=True)],
        [(0, "just checking the paneer", .4), (1, "that's your third time", .3), (0, "the second plate is for my husband", .4), (1, "he's right there", .3), (0, "the third is for his mother", .2, "womp")], props=[P("dish", .5, .86, 260)]))
    sh.append(sc(K, "THE VIDAI", "wedding", [A("dad", .26, "sad", "idle", 2.1), A("groom", .76, "dead", "idle", 2.0, flip=True)],
        [(0, "(crying, as his daughter leaves)", .6), (1, "(groom's father, eating)", .5), (1, "is there more paneer", .2, "womp")]))
    return meta(Reel("107_desi_weddings", sh, "pop", 107), "desi wedding guests", "'he gave us a gift in 2004.' tag your wedding aunty", "Desi wedding sketch: the unknown guest who's family because of a 2004 gift, aunties competing on karat, the DJ playing one song 9 times, the third plate 'for his mother', and a bride's father crying at vidai while the groom's father asks if there's more paneer.")

def korean_moms():
    K = dict(mom=person("c0392b", "light", "black", style="bun"), kid=person("2a6fdb", "light", "black", extra="hoodie"), aunt=person("e8a0b8", "light", "black", style="bob"), dad=person("8a6a45", "light", "grey", extra="vest"))
    sh = [lineup("korean moms", ["mom", "aunt", "kid", "dad"], K, "kitchen", dur=3.0)]
    sh.append(sc(K, "THE COMPLIMENT", "living", [A("mom", .26, "smile", "talk", 2.1), A("kid", .76, "dead", "idle", 2.0, flip=True)],
        [(0, "that outfit is so pretty", .3), (1, "thanks", .3), (0, "it would look better on your sister", .2, "boom")]))
    sh.append(sc(K, "THE GRADUATION GIFT", "living", [A("mom", .26, "smile", "talk", 2.1), A("kid", .76, "worried", "idle", 2.0, flip=True)],
        [(0, "i got you a gift for graduating", .3), (1, "what is it", .3), (0, "(brochure)", .5), (0, "new nose", .3, "pop"), (1, "mom i like my nose", .3), (0, "you will like it more", .2, "womp")]))
    sh.append(sc(K, "EAT", "kitchen", [A("mom", .26, "angry", "point", 2.1), A("kid", .76, "scream", "idle", 2.0, flip=True)],
        [(0, "eat", .3), (1, "i'm full", .3), (0, "eat more", .3), (1, "i'm going to throw up", .4), (0, "then you can eat more", .2, "boom")], props=[P("dish", .5, .86, 320)]))
    sh.append(sc(K, "THE FRUIT", "bedroom_night", [A("kid", .3, "sleepy", "slump", 2.2)],
        [(0, "(a plate of cut peaches appears. no one speaks)", .8, "sparkle"), (0, "(the door closes)", .2)], props=[P("dish", .7, .82, 260, food="f4b07a")], hud=[(0, "1:00 AM")]))
    sh.append(sc(K, "THE AIRPORT", "airport", [A("mom", .26, "angry", "point", 2.1), A("kid", .76, "sad", "idle", 2.0, flip=True)],
        [(0, "(crying)", .5), (1, "mom why are you crying", .3), (0, "i'm not. go", .4), (0, "(puts $400 in your pocket)", .5), (1, "mom i take the train", .3), (0, "train gas", .2, "womp")]))
    return meta(Reel("020_korean_moms", sh, "lofi", 20), "korean moms", "'train gas.' tag your korean friend's mom", "Korean mom sketch: 'it would look better on your sister', a nose job as a graduation gift, 'then you can eat more', silent peeled fruit at 1am, and crying at the airport while stuffing $400 'for train gas'.")

def truck_guys():
    K = dict(truck=person("8a6a45", "light", "brown", style="cap", cap="2a2a3a"), friend=person("2a6fdb", "light", "brown"), gf=person("e8a0b8", "light", "black", style="long"), kid=person("3aa655", "light", "brown"), clerk=person("f4a300", "tan", "black"))
    sh = [lineup("truck guys", ["truck", "friend", "gf", "clerk", "kid"], K, "parking", dur=3.0)]
    sh.append(sc(K, "WHAT DO YOU HAUL", "parking", [A("friend", .26, "smirk", "talk", 2.1), A("truck", .76, "cool", "flex", 2.0, flip=True)],
        [(0, "what do you haul", .3), (1, "nothing", .5), (0, "then why a truck", .3), (1, "in case", .3, "womp")], props=[carp("8a6a45", .5, .84, 360)]))
    sh.append(sc(K, "THE LIFT", "parking", [A("gf", .26, "worried", "point", 2.1), A("truck", .76, "cool", "flex", 2.0, flip=True)],
        [(0, "how do i get in", .3), (1, "it's six inches lifted", .4), (0, "i need a ladder", .3), (1, "that's the feeling of power", .2, "womp")]))
    sh.append(sc(K, "THE PARKING SPOT", "parking", [A("clerk", .26, "dead", "talk", 2.1), A("truck", .76, "cool", "flex", 2.0, flip=True)],
        [(0, "sir that's a compact spot", .3), (1, "it's fine", .3), (0, "you're in three", .3), (1, "i'm in a truck", .2, "boom")], props=[carp("8a6a45", .5, .84, 380)]))
    sh.append(sc(K, "GAS", "highway", [A("truck", .26, "dead", "idle", 2.1), A("friend", .76, "shock", "idle", 2.0, flip=True)],
        [(0, "(pumping gas. the number keeps going)", .5), (1, "that's $140", .3), (0, "it's a lifestyle", .2, "cash")], card=dict(title="$141.80", sub="\"lifestyle\"", y=.4, at=1.6)))
    sh.append(sc(K, "HELP ME MOVE", "street", [A("friend", .26, "smile", "talk", 2.1), A("truck", .76, "cool", "flex", 2.0, flip=True)],
        [(0, "can you help me move a couch", .4), (1, "i'd love to", .4), (1, "but the bed has my cooler in it", .4), (0, "...", .6), (1, "and i don't want to scratch it", .2, "womp")], props=[carp("8a6a45", .5, .84, 320)]))
    return meta(Reel("024_truck_guys", sh, "trap", 24), "truck guys", "'the bed has my cooler in it.' tag a truck guy", "Truck guy sketch: hauls nothing 'in case', six-inch lift needing a ladder, three compact spots, $141 of gas called a lifestyle, and can't help move a couch because the bed has his cooler and he doesn't want to scratch it.")

def desi_uncles():
    K = dict(unc=person("8a6a45", "brown", "grey", extra="vest"), kid=person("2a6fdb", "brown", "black", extra="hoodie"), dealer=person("2a2a3a", "light", "brown", extra="tie"), baby=person("e8a0b8", "brown", "black", style="long"), unc2=person("3aa655", "brown", "grey"))
    sh = [lineup("desi uncles", ["unc", "unc2", "kid", "dealer", "baby"], K, "living", dur=3.0)]
    sh.append(sc(K, "THE MILEAGE", "living", [A("unc", .26, "cool", "point", 2.1), A("kid", .76, "worried", "idle", 2.0, flip=True)],
        [(0, "what's the mileage", .3), (1, "of what", .3), (0, "the car", .3), (1, "i walked here", .3), (0, "what's the mileage", .2, "womp")]))
    sh.append(sc(K, "THE DEALERSHIP", "dealer", [A("unc", .26, "smirk", "flex", 2.1), A("dealer", .76, "dead", "idle", 2.0, flip=True)],
        [(1, "$34,000", .3), (0, "i'll give you $30", .4), (1, "...", .5), (0, "last year i got this for $27", .4), (1, "this model didn't exist last year", .3), (0, "it existed in my mind", .2, "womp")]))
    sh.append(sc(K, "THE ADVICE", "living", [A("unc", .26, "cool", "talk", 2.1), A("kid", .76, "dead", "idle", 2.0, flip=True)],
        [(0, "don't buy a house, invest in gold", .4), (0, "don't invest in gold, invest in real estate", .4), (0, "don't invest in stocks", .3), (0, "invest in my cousin's gas station in ohio", .2, "womp")]))
    sh.append(sc(K, "THE WHATSAPP", "living", [A("unc", .26, "worried", "point", 2.1), A("kid", .76, "dead", "idle", 2.0, flip=True)],
        [(0, "your whatsapp is hacked", .3), (1, "why", .3), (0, "it sent me a message", .3), (1, "that's... that's you texting me", .3), (0, "i didn't send it", .2, "womp")]))
    sh.append(sc(K, "THE BABY", "living", [A("unc", .26, "smile", "point", 2.1), A("baby", .76, "smile", "idle", 2.0, flip=True)],
        [(0, "(looks at your newborn)", .6), (0, "what's the mileage", .4), (1, "he's 3 days old", .4), (0, "good. low mileage", .2, "womp")]))
    return meta(Reel("108_desi_uncles", sh, "funk", 108), "desi uncles", "'good. low mileage.' tag your uncle", "Desi uncle sketch: asking 'mileage' about everything including your walk and a newborn ('good. low mileage'), haggling a dealership with a price from a model that didn't exist, contradictory investing advice ending in a gas station in Ohio, and a 'hacked' WhatsApp that's him.")

def dads_hardware():
    K = dict(dad=person("8a6a45", "light", "grey", extra="vest"), kid=person("2a6fdb", "light", "brown", extra="hoodie"), clerk=person("e8742a", "tan", "black", extra="vest"), mom=person("c0392b", "light", "black", style="bun"))
    sh = [lineup("dads at the hardware store", ["dad", "clerk", "kid", "mom"], K, "store", dur=3.0)]
    sh.append(sc(K, "ONE SCREW", "hallway", [A("dad", .26, "smile", "talk", 2.1), A("mom", .76, "dead", "idle", 2.0, flip=True)],
        [(0, "i'm going to home depot. one screw", .4), (1, "ok", .3, "tick"), (0, "(4 hours later)", .5), (0, "i got a ladder, and a story about gary", .3), (1, "where's the screw", .3), (0, "...", .2, "womp")], hud=[(0, "10:00 AM"), (1.8, "2:12 PM")]))
    sh.append(sc(K, "THE APRON GUY", "store", [A("dad", .26, "smile", "talk", 2.1), A("clerk", .76, "dead", "idle", 2.0, flip=True)],
        [(0, "where are the screws", .3), (1, "aisle 12", .3), (0, "(40 minutes about his deck)", .5, "tick"), (1, "sir i have to go", .3), (0, "you're a good listener", .2, "womp")], hud=[(0, "0:00"), (1.6, "0:40")]))
    sh.append(sc(K, "THE GARAGE", "living", [A("kid", .26, "dead", "idle", 2.1), A("dad", .76, "cool", "flex", 2.0, flip=True)],
        [(0, "dad you have 400 jars of screws", .3), (1, "i know exactly where everything is", .5), (0, "find a 3/8", .3), (1, "(3 hours of silence)", .5, "tick"), (1, "i'll buy one", .2, "womp")], props=[P("jar", .5, .84, 200), P("jar", .62, .84, 200, at=.2)]))
    sh.append(sc(K, "MEASURE TWICE", "living", [A("dad", .26, "worried", "flex", 2.1)],
        [(0, "measure twice. cut once", .4), (0, "(measures 11 times)", .5), (0, "(cuts it)", .5, "boom"), (0, "it's short", .2, "womp")], props=[P("book", .6, .8, 220)]))
    sh.append(sc(K, "THE RECEIPT", "hallway", [A("mom", .26, "angry", "point", 2.1), A("dad", .76, "worried", "idle", 2.0, flip=True)],
        [(0, "why do we have 6 of these", .3), (1, "they're different", .4), (0, "they're the same", .3), (1, "this is a 3/8", .3), (1, "that one's a 7/16", .3), (0, "which one is that", .2), (1, "this one", .2, "womp")]))
    return meta(Reel("014_dads_hardware", sh, "funk", 14), "dads at the hardware store", "'i got a ladder and a story about gary.' tag your dad", "Dad hardware-store sketch: one screw becomes a four-hour trip and a ladder, a 40-minute talk with the apron guy, a garage with 400 jars where he 'knows where everything is', measuring 11 times and cutting it short, and owning six of the same item.")

def grandmas():
    K = dict(gm=person("c0392b", "light", "grey", style="bob"), kid=person("2a6fdb", "light", "brown", extra="hoodie"), waiter=person("f4f1ea", "tan", "black", extra="tie"), mom=person("3aa655", "light", "black", style="long"))
    sh = [lineup("grandmas", ["gm", "kid", "mom", "waiter"], K, "living", dur=3.0)]
    sh.append(sc(K, "THE $20", "living", [A("gm", .26, "smile", "talk", 2.1), A("kid", .76, "worried", "idle", 2.0, flip=True)],
        [(0, "(slides a $20, folded to the size of a stamp)", .6), (1, "grandma i'm 31", .3), (0, "don't tell your mother", .4), (1, "i have a job", .3), (0, "buy something nice", .2, "cash")]))
    sh.append(sc(K, "THE COMPLIMENT", "living", [A("gm", .26, "worried", "talk", 2.1), A("kid", .76, "dead", "idle", 2.0, flip=True)],
        [(0, "you're so thin", .3), (1, "i've gained weight", .3), (0, "so thin", .4, "boom"), (0, "eat", .2)], props=[P("dish", .5, .84, 260)]))
    sh.append(sc(K, "THE RESTAURANT", "cafe", [A("gm", .26, "smirk", "flex", 2.1), A("waiter", .76, "dead", "idle", 2.0, flip=True)],
        [(0, "(pockets 14 sugar packets)", .5), (1, "ma'am", .3), (0, "(wraps the lemon)", .5), (0, "for later", .2, "womp")]))
    sh.append(sc(K, "THE TABLET", "living", [A("gm", .26, "worried", "point", 2.1), A("kid", .76, "dead", "idle", 2.0, flip=True)],
        [(0, "make the picture go away", .3), (1, "which picture", .3), (0, "(the screen is 100% a photo of a cat)", .5), (0, "this one", .3), (1, "that's your wallpaper", .3), (0, "it's looking at me", .2, "womp")], props=[P("tv", .5, .6, 240)]))
    sh.append(sc(K, "THE RECIPE", "kitchen", [A("gm", .26, "smile", "talk", 2.1), A("kid", .76, "worried", "idle", 2.0, flip=True)],
        [(0, "can you write the recipe", .3), (1, "(hands over a napkin)", .5), (1, "a little of this", .3), (1, "some of that", .3), (1, "cook until it smells right", .3), (0, "grandma that's not a recipe", .3), (1, "i just wrote it", .2, "sparkle")]))
    return meta(Reel("016_grandmas", sh, "lofi", 16), "grandmas", "'cook until it smells right.' send this to your grandma", "Grandma sketch: a $20 folded to stamp-size 'don't tell your mother', 'so thin' to someone who gained weight, pocketing 14 sugar packets and a lemon, a tablet wallpaper cat that 'looks at me', and a recipe that says cook until it smells right.")

REELS = dict(immigrant_moms=immigrant_moms, immigrant_dads=immigrant_dads, desi_aunties=desi_aunties, middle_children=middle_children, desi_kids=desi_kids, home_remedies=home_remedies, desi_weddings=desi_weddings, korean_moms=korean_moms, truck_guys=truck_guys, desi_uncles=desi_uncles, dads_hardware=dads_hardware, grandmas=grandmas)
