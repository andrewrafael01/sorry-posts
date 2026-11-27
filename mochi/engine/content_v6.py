# v6 (Nov 25): built from the first 25 reels. Sends per 1k reach correlate 0.91 with reach.
# Top 3 (49-59 sends/1k): proud_of_you, if_sent_proud, text_back. All three are a message the viewer
# forwards to ONE specific person, and all three open by talking to the viewer in frame 0.
# Lists ("real friends...") swing 4-37; skits loop well but get ~12 sends/1k; the series got 0-5.
# Rules: frame-0 direct address, both cats on screen, one concrete little joke from toast, send line names a person.
# (name, caption first line, beats)
MSG_REELS = [
 ("if_sent_thankful", "happy thanksgiving to whoever sent you this", [
  ("if someone sent\nyou *this* today...", "mt:stare,stare", None),
  ("you're on their\n*thankful* list", "mt:happy,happy|sparkles", None),
  ("right at the *top*", "give:t:heart:happy:sparkle", "(toast put you above naps. that's huge)"),
  ("they're *so* glad\nyou exist", "hug:cry,love", None),
  ("happy *thanksgiving*", "hug:love,love|hearts", "send this to someone you're thankful for")]),
 ("if_sent_sorry", "if someone sent you this, they're sorry", [
  ("if someone sent\nyou *this*...", "mt:stare,stare", None),
  ("they're *sorry*", "mt:pout,pout", None),
  ("they've been thinking\nabout it *all* day", "mthink:pout:heart", None),
  ("toast wrote the\n*apology* for them", "th:letter:pout", "(it says sorry 40 times)"),
  ("can we be *ok*?", "hug:love,love|hearts", "send this to someone you owe a sorry")]),
 ("if_sent_hug", "if someone sent you this, they owe you a hug", [
  ("if someone sent\nyou *this*...", "mt:stare,stare", None),
  ("they owe you\na *hug*", "mt:happy,happy", None),
  ("a *long* one", "hug:love,love", None),
  ("toast is holding it\nfor them *until then*", "th:heart:happy", "(he's very serious about it)"),
  ("come *get* it", "hug:love,love|hearts", "send this to someone who needs a hug")]),
 ("if_sent_quiet", "if someone sent you this, they noticed", [
  ("if someone sent\nyou *this*...", "mt:stare,stare", None),
  ("they noticed you've\nbeen *quiet*", "mp:pout", None),
  ("they're not *mad*", "mt:happy,happy", None),
  ("they just miss\nyour *texts*", "tp:cry", "(toast misses them too)"),
  ("text them *back*", "hug:love,love|hearts", "send this to someone who's been quiet lately")]),
 ("if_sent_food", "if someone sent you this, they want to get food", [
  ("if someone sent\nyou *this*...", "mt:stare,stare", None),
  ("they want to get\n*food* with you", "give:t:cookie:happy:sparkle", None),
  ("they're just too\n*shy* to ask", "mt:pout,pout", None),
  ("toast is already\n*hungry*", "tbowl:squint:empty", "(he's always hungry)"),
  ("say *yes*", "hug:love,love|hearts", "send this to your food person")]),
 ("read_your_ok", "how i read your \"ok.\"", [
  ("how i read your\n\"*ok.*\"", "mp:stare", None),
  ("ok?", "mp:squint", None),
  ("ok *period*?", "mp:shock|bang", None),
  ("are we *ok*??", "mp:cry", "(toast is also worried)"),
  ("\"sorry i was driving\"", "mt:love,love|hearts", "send this to someone who texts \"ok.\"")]),
 ("toast_waiting", "toast checked his phone 41 times", [
  ("toast waiting for\nyou to *text back*", "tp:stare", None),
  ("checking his\n*phone*", "tp:squint", None),
  ("checking *again*", "tp:pout", None),
  ("pretending he's\nnot *checking*", "t:smug", "(he is checking)"),
  ("YOU *TEXTED*", "t:sparkle:stand|hearts", "send this to someone who makes you wait")]),
 ("we_need_to_talk", "when you text \"we need to talk\"", [
  ("when you text\n\"we need to *talk*\"", "mp:shock|bang", None),
  ("toast started\n*packing*", "tbox:shock", None),
  ("mochi said her\n*goodbyes*", "mt:cry,cry", None),
  ("it was about\n*dinner*", "mt:shock,shock|bang", "(pizza. it was pizza)"),
  ("never do that *again*", "hug:love,love|hearts", "send this to someone who texts like this")]),
 ("if_sent_lucky", "if someone sent you this, they feel lucky", [
  ("if someone sent\nyou *this*...", "mt:stare,stare", None),
  ("they feel *lucky*\nto know you", "mt:sparkle,sparkle|sparkles", None),
  ("like, *actually* lucky", "m:love", None),
  ("toast says *he's*\nthe lucky one", "t:smug", "(they're arguing about it)"),
  ("you're *so* loved", "hug:love,love|hearts", "send this to someone you're lucky to have")]),
 ("if_sent_jacket", "if someone sent you this, wear a jacket", [
  ("if someone sent\nyou *this*...", "mwin:stare:snow|snow", None),
  ("it's *cold* out", "mt:shock,shock|snow", None),
  ("they want you to\nwear a *jacket*", "mt:pout,pout", None),
  ("toast is wearing\n*two* blankets", "ts", "(he can't move)"),
  ("stay *warm*", "hug:love,love|hearts", "send this to someone who never wears a jacket")]),
 ("if_sent_finals", "if someone sent you this, you've got this", [
  ("if someone sent\nyou *this*...", "mt:stare,stare", None),
  ("they know you're\n*stressed*", "m:cry", None),
  ("they think you'll\ndo *great*", "mt:sparkle,sparkle|sparkles", None),
  ("toast made you\na study *snack*", "give:t:cookie:happy:sparkle", "(he ate half for quality control)"),
  ("you *got* this", "hug:love,love|hearts", "send this to someone with finals")]),
 ("if_sent_break", "if someone sent you this, they want to see you", [
  ("if someone sent\nyou *this*...", "mt:stare,stare", None),
  ("they want to see\nyou over *break*", "mt:happy,happy|sparkles", None),
  ("they've been\ncounting the *days*", "mwin:pout:snow|snow", None),
  ("toast already saved\nyou a *seat*", "tseat:happy:sparkle", "(he's guarding it)"),
  ("come *home* soon", "hug:love,love|hearts", "send this to someone you'll see over break")]),
]

# v6b (Nov 26): 303_d_if_sent_proud hit 6,005 views and 94.6 sends/1k. Its device: "it means they ___" ->
# one concrete detail -> "they just didn't know how to say it" (toast's sub-joke) -> "so we said it for them".
MSG_REELS += [
 ("if_sent_amazing", "if someone sent you this, they think you're doing amazing", [
  ("if someone sent\nyou *this*...", "mt:stare,stare", None),
  ("they think you're\ndoing *amazing*", "mt:sparkle,sparkle|sparkles", None),
  ("even on the days\nyou *don't*", "m:cry", None),
  ("they just didn't\nknow how to *say* it", "tb:pout:...", "(toast practiced in the mirror)"),
  ("so we said it\n*for* them", "hug:love,love|hearts", "send this to someone doing better than they think")]),
 ("if_sent_safe", "if someone sent you this, you're their safe person", [
  ("if someone sent\nyou *this*...", "mt:stare,stare", None),
  ("it means you're\ntheir *safe* person", "hug:love,love", None),
  ("the one they can\nbe *quiet* with", "mt:dot,dot", None),
  ("they just didn't\nknow how to *say* it", "tb:pout:...", "(toast wrote it on a napkin. then ate it)"),
  ("so we said it\n*for* them", "hug:love,love|hearts", "send this to your safe person")]),
 ("if_sent_fight", "if someone sent you this, they'd fight someone for you", [
  ("if someone sent\nyou *this*...", "mt:stare,stare", None),
  ("they'd *fight*\nsomeone for you", "mt:shock,shock|bang", None),
  ("toast would *also*\nfight someone", "t:smug", "(he has never won a fight)"),
  ("they just didn't\nknow how to *say* it", "tb:pout:...", None),
  ("so we said it\n*for* them", "hug:love,love|hearts", "send this to someone you'd fight for")]),
 ("if_sent_call", "if someone sent you this, you're their first call", [
  ("if someone sent\nyou *this*...", "mt:stare,stare", None),
  ("you're their\nfirst *call*", "mp:happy", None),
  ("good news *or* bad", "mt:sparkle,cry", None),
  ("they just didn't\nknow how to *say* it", "tp:pout", "(toast tried. he sent a sticker)"),
  ("so we said it\n*for* them", "hug:love,love|hearts", "send this to your first call")]),
 ("if_sent_rest", "if someone sent you this, they want you to rest", [
  ("if someone sent\nyou *this*...", "mt:stare,stare", None),
  ("it means they want\nyou to *rest*", "mt:pout,pout", None),
  ("you've been doing\n*so* much", "m:cry", None),
  ("they just didn't\nknow how to *say* it", "tb:pout:...", "(toast is already resting. for you)"),
  ("so we said it: *rest*", "ss|hearts", "send this to someone who never rests")]),
 ("if_sent_thinking", "if someone sent you this, they're thinking about you", [
  ("if someone sent\nyou *this*...", "mt:stare,stare", None),
  ("they're thinking\nabout you *now*", "mthink:love:heart", None),
  ("like, *right* now", "m:love", None),
  ("they just didn't\nknow how to *say* it", "tb:pout:...", "(toast thinks about you too. between snacks)"),
  ("so we said it\n*for* them", "hug:love,love|hearts", "send this to who you're thinking about")]),
]

# v6c (Nov 26): 6-a-day fill for December. Same recipe; more of Toast's personality (characters get followed).
_H = ("if someone sent\nyou *this*...", "mt:stare,stare", None)
_S = ("they just didn't\nknow how to *say* it", "tb:pout:...", None)
_E = lambda send: ("so we said it\n*for* them", "hug:love,love|hearts", send)
MSG_REELS += [
 # --- if someone sent you this ---
 ("if_sent_voice", "if someone sent you this, they miss your voice", [_H,
  ("they miss your\n*voice*", "mwin:pout:night", None),
  ("texting isn't\n*enough*", "mp:cry", None),
  ("toast already\n*dialed*", "tp:sparkle", "(he's holding the phone upside down)"),
  ("call them\n*tonight*", "hug:love,love|hearts", "send this to someone you need to call")]),
 ("if_sent_brave", "if someone sent you this, they think you're brave", [_H,
  ("they think you're\n*brave*", "mt:sparkle,sparkle|sparkles", None),
  ("even when you're\n*scared*", "m:cry", None),
  ("toast is scared\nof the *vacuum*", "t:shock|bang", "(he's still brave though)"),
  _E("send this to someone being brave right now")]),
 ("if_sent_see_you", "if someone sent you this, they want to see you this week", [_H,
  ("they want to see\nyou *this week*", "mt:happy,happy", None),
  ("no plans\n*needed*", "ss", None),
  ("toast already\npicked a *blanket*", "t:dot:loaf", "(it's the good one)"),
  ("pick a *day*", "hug:love,love|hearts", "send this to someone you haven't seen in too long")]),
 ("if_sent_not_alone", "if someone sent you this, you're not alone", [_H,
  ("you're not *alone*\nin this", "hug:cry,love", None),
  ("they've *got* you", "mt:love,love", None),
  ("toast brought\n*snacks* for the wait", "give:t:cookie:happy:pout", None),
  _E("send this to someone going through it")]),
 ("if_sent_remember", "if someone sent you this, they still laugh about it", [_H,
  ("they still remember\nthat *one* time", "mthink:happy:heart", None),
  ("and they *still*\nlaugh about it", "mt:happy,happy|sparkles", None),
  ("toast was there", "t:smug", "(he laughed the most)"),
  ("you know *which* one", "hug:love,love|hearts", "send this to who you have inside jokes with")]),
 ("if_sent_honest", "if someone sent you this, they want the real answer", [_H,
  ("they want the\n*real* answer", "mt:squint,squint", None),
  ("how are you\n*actually*?", "mt:pout,pout", None),
  ("toast asks the\nfridge this *daily*", "tbowl:squint:empty", None),
  ("you can *tell* them", "hug:love,love|hearts", "send this to someone who always says \"fine\"")]),
 ("if_sent_annoying", "if someone sent you this, you're annoying", [_H,
  ("it means you're\n*annoying*", "mt:squint,squint", None),
  ("their *favorite*\nkind of annoying", "mt:happy,happy|sparkles", None),
  ("toast is annoying\n*professionally*", "t:smug", "(he has a certificate)"),
  ("never *change*", "hug:love,love|hearts", "send this to your favorite annoying person")]),
 ("if_sent_main", "if someone sent you this, you're the main character", [_H,
  ("they think you're the\n*main character*", "mt:sparkle,sparkle|sparkles", None),
  ("toast is the\n*sidekick*", "t:happy", "(he's fine with it)"),
  ("go be *iconic*", "m:sparkle:stand|sparkles", None),
  _E("send this to your main character")]),
 ("if_sent_sibling", "if someone sent you this, you're their sibling now", [_H,
  ("you're their\n*sibling* now", "mt:happy,happy", None),
  ("even if you're\n*not* related", "mt:squint,happy", None),
  ("toast adopted\nthe *mailman*", "t:sparkle", "(the mailman did not agree)"),
  ("*family*", "hug:love,love|hearts", "send this to your chosen sibling")]),
 ("if_kid_sent", "if your kid sent you this, they miss you", [
  ("if your kid sent\nyou *this*...", "mt:stare,stare", None),
  ("they miss your\n*cooking*", "tbowl:pout:empty", None),
  ("and *you*.\nmostly you", "m:cry", None),
  ("toast misses\nhis mom's *tuna*", "t:pout", None),
  ("they're coming\n*home* soon", "hug:love,love|hearts", "send this to your mom")]),
 ("if_sent_far", "if someone sent you this, they wish you were here", [_H,
  ("they *wish* you\nwere here", "mwin:pout:night", None),
  ("the distance\nis *so* dumb", "m:squint", None),
  ("toast tried to\n*mail* himself", "tbox:happy", "(he didn't fit the stamp)"),
  _E("send this to someone far away")]),
 ("if_sent_coffee", "if someone sent you this, they owe you a coffee", [_H,
  ("they owe you\na *coffee*", "th:mug:happy", None),
  ("and a *talk*", "mt:happy,happy", None),
  ("toast drank\nthe *first* one", "t:shock|bang", "(it was for you. sorry)"),
  ("this *week*?", "hug:love,love|hearts", "send this to your coffee person")]),
 ("if_sent_grown", "if someone sent you this, they see how much you've grown", [_H,
  ("they see how much\nyou've *grown*", "mt:sparkle,sparkle|sparkles", None),
  ("this *year* especially", "m:love", None),
  ("toast has grown\n*too*", "t:smug", "(sideways. from snacks)"),
  _E("send this to someone who grew a lot this year")]),
 ("if_sent_good_day", "if someone sent you this, they hope today is good", [_H,
  ("they hope your\nday is *good*", "mt:happy,happy", None),
  ("like, *really* good", "mt:sparkle,sparkle|sparkles", None),
  ("toast says\n*good luck*", "t:happy", "(he doesn't know what for. good luck though)"),
  ("go get it", "hug:love,love|hearts", "send this to someone with a big day")]),
 # --- texting ---
 ("one_word", "when they reply with one word", [
  ("when they reply\nwith *one* word", "mp:squint", None),
  ("\"*k*\"", "mp:shock|bang", None),
  ("mochi wrote\na *paragraph*", "mp:cry", None),
  ("toast only replies\nwith *stickers*", "tp:smug", "(this is worse)"),
  ("just *call* me", "mt:love,love|hearts", "send this to your one-word texter")]),
 ("voice_note", "when they send a 7 minute voice note", [
  ("when you send a\n7 minute *voice note*", "mp:shock|bang", None),
  ("we listen to\n*every* second", "mt:squint,squint", None),
  ("toast listens\nat *2x*", "tp:smug", "(he still loves it)"),
  ("send *another* one", "mt:love,love|hearts", "send this to your voice note person")]),
 ("on_my_way", "when we say \"on my way\"", [
  ("when we say\n\"*on my way*\"", "mp:happy", None),
  ("*still* in bed", "ss", None),
  ("toast can't find\nhis other *sock*", "t:shock|bang", "(he doesn't wear socks)"),
  ("ok *now* on our way", "mt:sparkle,sparkle|sparkles", "send this to someone who's always late")]),
 ("we_should_hang", "\"we should hang out\" (4 months ago)", [
  ("\"we should\n*hang out*\"", "mp:happy", None),
  ("*4 months* ago", "mt:stare,stare", None),
  ("toast made\na *calendar*", "th:letter:happy", "(it's blank)"),
  ("*this* weekend?", "hug:love,love|hearts", "send this to someone you need to finally see")]),
 ("facetime", "us on facetime for 3 hours", [
  ("us on facetime\nfor *3 hours*", "mp:happy", None),
  ("saying *nothing*", "mt:dot,dot", None),
  ("toast fell asleep\non *camera*", "ss", "(we stayed on)"),
  ("best call *ever*", "mt:love,love|hearts", "send this to your facetime person")]),
 ("likes_story", "when they like your story but don't text back", [
  ("when they *like*\nyour story...", "mp:stare", None),
  ("but don't\ntext *back*", "mp:squint", None),
  ("toast liked it\n*3 times*", "tp:sparkle", "(he's subtle)"),
  ("just text *me*", "mt:love,love|hearts", "send this to someone who only likes your stories")]),
 # --- toast, the character ---
 ("toast_clingy", "toast when you leave the room", [
  ("toast when you\n*leave* the room", "t:shock|bang", None),
  ("*panic*", "t:cry", None),
  ("toast when you\ncome *back*", "t:smug", "(acts like nothing happened)"),
  ("he *missed* you", "hug:love,love|hearts", "send this to your clingy person")]),
 ("toast_when_sad", "what toast does when you're sad", [
  ("toast when\nyou're *sad*", "t:pout", None),
  ("brings a *snack*", "give:t:cookie:cry:pout", None),
  ("brings *more* snacks", "give:t:cookie:pout:happy", None),
  ("sits *on* you", "hug:happy,love", None),
  ("it *works*", "hug:love,love|hearts", "send this to your toast")]),
 ("toast_fridge", "toast hearing the fridge open", [
  ("toast hearing the\nfridge *open*", "t:shock|bang", None),
  ("*running*", "t:sparkle", None),
  ("it was mochi\ngetting *water*", "mt:stare,shock", None),
  ("*betrayal*", "t:cry", "(he stayed anyway)"),
  ("send this to who\ncomes for *food*", "mt:happy,happy|hearts", "tag your toast")]),
 ("toast_love_language", "toast's love language", [
  ("toast's love\nlanguage", "t:smug", None),
  ("giving *snacks*", "give:t:cookie:happy:sparkle", None),
  ("stealing *snacks*", "t:smug", None),
  ("sharing the\n*last* one", "give:t:cookie:love:love|hearts", "(this has happened once)"),
  ("he *loves* you", "hug:love,love|hearts", "send this to who shares their last snack")]),
 ("toast_7am", "toast at 7am vs 7pm", [
  ("toast at *7am*", "ss", None),
  ("*do not*", "t:dot:loaf", None),
  ("toast at *7pm*", "t:sparkle|sparkles", None),
  ("ready to *party*", "mt:shock,sparkle|bang", "(the party is snacks)"),
  ("send this to your\n*night* person", "mt:happy,happy|hearts", "tag your 7pm friend")]),
 # --- duo ---
 ("bff_rules", "best friend rules", [
  ("best friend\n*rules*", "mt:happy,happy", None),
  ("1. no *secrets*", "mt:squint,squint", None),
  ("2. share your\n*fries*", "give:t:cookie:happy:sparkle", "(toast negotiated this one)"),
  ("3. answer at\n*3am*", "mp:sparkle", None),
  ("4. *forever*", "hug:love,love|hearts", "send this to your best friend")]),
 ("us_vs_world", "you and me vs the world", [
  ("you and me\nvs the *world*", "mt:sparkle,sparkle|sparkles", None),
  ("the world:", "mt:shock,shock|bang", "(it's a vacuum cleaner)"),
  ("we're *winning*", "mt:smug,smug", None),
  ("*always*", "hug:love,love|hearts", "send this to your partner in crime")]),
 ("apocalypse", "who i'd want in a zombie apocalypse", [
  ("who i'd want in a\n*zombie apocalypse*", "mt:stare,stare", None),
  ("*you*", "mt:love,love|hearts", None),
  ("toast would be\nthe *first* to go", "t:smug", "(he'd go back for snacks)"),
  ("it's *us* till the end", "hug:love,love|hearts", "send this to your apocalypse partner")]),
 ("in_50_years", "us in 50 years", [
  ("us in\n*50 years*", "mt:stare,stare", None),
  ("still sharing\n*snacks*", "give:t:cookie:happy:happy", None),
  ("still laughing\nat *nothing*", "mt:happy,happy|sparkles", None),
  ("toast still can't\nplay it *cool*", "t:smug", None),
  ("*still* us", "hug:love,love|hearts", "send this to who you'll grow old with")]),
 ("things_id_do", "things i'd do for you", [
  ("things i'd do\nfor *you*", "mt:happy,happy", None),
  ("give you my\nlast *cookie*", "give:t:cookie:love:sparkle", None),
  ("watch *your* show", "ss", "(toast fell asleep. still counts)"),
  ("get out of *bed*", "mt:shock,shock|bang", None),
  ("that's *love*", "hug:love,love|hearts", "send this to someone worth getting out of bed for")]),
 # --- december moments ---
 ("wrapped", "your 2026 wrapped", [
  ("your 2026\n*wrapped*", "mt:sparkle,sparkle|sparkles", None),
  ("top person:\n*whoever sent this*", "mt:love,love|hearts", None),
  ("minutes spent\ntexting them: *a lot*", "mp:happy", None),
  ("toast's top\ngenre: *snacks*", "t:smug", None),
  ("see you in *2027*", "hug:love,love|hearts", "send this to your top person of 2026")]),
 ("last_class", "last day of classes", [
  ("last day of\n*classes*", "mt:stare,stare", None),
  ("we *survived*", "mt:sparkle,sparkle|sparkles", None),
  ("toast slept\nthrough *half*", "ss", None),
  ("now just\n*finals*", "mt:shock,shock|bang", "(we'll survive those too)"),
  ("*together*", "hug:love,love|hearts", "send this to your study buddy")]),
 ("santa_rules", "secret santa rules", [
  ("secret santa\n*rules*", "mt:happy,happy+santa", None),
  ("1. no *socks*", "mt:squint,squint+santa", None),
  ("2. snacks *always*\ncount", "give:t:cookie:happy:sparkle+santa", "(toast is getting everyone a cookie)"),
  ("3. the best gift\nis *you*", "hug:love,love+santa|hearts", "send this to your secret santa group")]),
 ("flight_home", "if someone sent you this, they're coming home", [_H,
  ("they're coming\n*home*", "mwin:happy:snow|snow", None),
  ("and they can't *wait*\nto see you", "mt:sparkle,sparkle|sparkles", None),
  ("toast is already\nat the *door*", "tdoor:happy", "(he's been there since tuesday)"),
  ("see you *soon*", "hug:love,love|hearts", "send this to who's waiting for you at home")]),
 ("nye", "if someone sent you this, they want you in their 2027", [_H,
  ("they want you in\ntheir *2027*", "mt:sparkle,sparkle|sparkles", None),
  ("every *single* day", "mt:love,love", None),
  ("toast wants\nsnacks in his *too*", "t:smug", None),
  ("happy new *year*", "hug:love,love|hearts", "send this to who you want in your 2027")]),
]
