# v4 (Nov 22): follow-ups built from week-1 data (14 reels).
# Top sends per 1k reach: proud_of_you 59.9, friends_are 35.5, did_you_eat 32.3, being_in_love 29.4.
# All four are things the viewer would say TO someone ("proud of you", "did you eat", "this is us"),
# and three of four keep BOTH cats on screen, so the duo reads as "me and my person".
# Solo-Mochi self-help reels averaged ~15 sends/1k; cat jokes ~3-7.
# Rules: duo on screen most beats, a list of small relational moments or a care message,
# no "part 2" framing (proud_part2 got 12.1: new viewers lack the context).
# (name, caption first line, beats)
DUO_REELS = [
 ("best_friend_is", "a best friend is", [
  ("a best *friend* is...", "mt:happy,happy", None),
  ("someone who knows\nyour *snack* order", "give:t:cookie:happy:sparkle", None),
  ("and your\n*bad* days", "hug:cry,love", None),
  ("and naps through\nyour movie *anyway*", "ss", "(toast picked the movie)"),
  ("*this* one", "hug:love,love|hearts", "tag your best friend")]),
 ("loving_you_is", "loving you is", [
  ("loving *you* is...", "mt:love,love|hearts", None),
  ("sharing the\nlast *bite*", "give:t:cookie:happy:sparkle", None),
  ("warm feet on\ncold *nights*", "ss|snow", None),
  ("laughing at\n*nothing*", "mt:happy,happy|sparkles", None),
  ("missing you in\nthe next *room*", "mdoor:pout", None),
  ("*easy*", "hug:love,love|hearts", "send this to your person")]),
 ("if_sent_proud", "if someone sent you this", [
  ("if someone sent\nyou *this*...", "mt:stare,stare", None),
  ("it means they're\n*proud* of you", "mt:happy,happy|sparkles", None),
  ("they see how\nhard you *try*", "m:love", None),
  ("they just didn't\nknow how to *say* it", "tb:pout:...", "(toast doesn't either)"),
  ("so we said it\n*for* them", "hug:love,love|hearts", "send this to someone you're proud of")]),
 ("text_me_home", "text me when you get home", [
  ("*text me* when\nyou get home", "mp:stare", None),
  ("not because\ni'm *worried*", "mp:squint", None),
  ("ok i'm a little\n*worried*", "mwin:pout:night", None),
  ("toast is waiting\nby the *door*", "tdoor:stare", "(he won't sleep until you're back)"),
  ("home safe? *good*.\nlove you", "hug:love,love|hearts", "send this to someone heading home")]),
 ("your_person_is", "your person is", [
  ("your *person* is...", "mt:happy,happy", None),
  ("who you text first\nwith *news*", "mp:sparkle|sparkles", None),
  ("who knows when\nyou're *not* fine", "hug:cry,love", None),
  ("who you can be\n*weird* with", "mt:shock,sparkle|bang", None),
  ("*them*", "hug:love,love|hearts", "send this to your person")]),
 ("if_sent_miss", "if someone sent you this, they miss you", [
  ("if someone sent\nyou *this*...", "mt:stare,stare", None),
  ("they *miss* you", "mwin:pout:night", None),
  ("like, *a lot*", "m:cry", None),
  ("toast misses\nyou *too*", "tp:pout", "(he checks his phone every 5 minutes)"),
  ("text them *back*", "hug:love,love|hearts", "send this to someone you miss")]),
 ("little_ways", "little ways they say i love you", [
  ("little ways they\nsay *i love you*", "mt:love,love|hearts", None),
  ("\"did you *eat*?\"", "tbowl:squint:empty", None),
  ("\"text me when\nyou're *home*\"", "mp:happy", None),
  ("\"i saved you\nthe last *one*\"", "give:t:cookie:happy:sparkle", None),
  ("\"come *here*\"", "hug:love,love|hearts", "send this to someone who says it like this")]),
 ("us_at_2am", "us at 2am", [
  ("us at *2am*", "mt:stare,stare", None),
  ("should we\n*sleep*?", "mwin:squint:night", None),
  ("no. *snacks*", "give:t:cookie:sparkle:sparkle", None),
  ("deep talks about\n*everything*", "mt:love,happy", None),
  ("best part\nof my *day*", "hug:love,love|hearts", "tag your 2am person")]),
 ("did_you_sleep", "did you sleep?", [
  ("toast is\nchecking *again*", "t:stare", None),
  ("did you *sleep*\nlast night?", "twin:squint:night", None),
  ("like actually sleep.\nnot *scroll*", "tp:pout", None),
  ("here. we made\nyou a *bed*", "ss", "(it's our bed. we're in it)"),
  ("rest *tonight*.\nplease", "mt:love,love|hearts", "send this to someone who doesn't sleep enough")]),
 ("home_is", "home is a person", [
  ("home isn't\na *place*", "mwin:stare:night", None),
  ("it's who\nwaits for *you*", "tdoor:happy", None),
  ("who saves\nyou a *seat*", "seat:happy", None),
  ("who makes\nyou *tea*", "th:mug:happy", "(toast made it. it's cold)"),
  ("home is *you*", "hug:love,love|hearts", "send this to your home person")]),
 ("if_sent_love", "if someone sent you this, you're their favorite", [
  ("if someone sent\nyou *this*...", "mt:stare,stare", None),
  ("you're their\n*favorite* person", "mt:sparkle,sparkle|sparkles", None),
  ("they think about\nyou *all* the time", "mthink:love:heart", None),
  ("toast wrote it down\nso it's *official*", "th:letter:happy", "(it's signed with a paw)"),
  ("you're so *loved*", "hug:love,love|hearts", "send this to your favorite person")]),
 ("friendship_is", "friendship is", [
  ("friendship is...", "mt:happy,happy", None),
  ("not talking\nfor *weeks*", "mp:dot", None),
  ("then picking up like\n*no* time passed", "mt:sparkle,sparkle|sparkles", None),
  ("toast calls\nevery *day*", "tp:happy", "(it's a lot)"),
  ("you're *stuck* with us", "hug:love,love|hearts", "send this to your forever friend")]),
 ("how_we_say_sorry", "how we say sorry", [
  ("how *we* say sorry", "mt:pout,pout", None),
  ("a *snack*", "give:t:cookie:pout:pout", None),
  ("a *flower*\nfrom outside", "th:flower:pout", None),
  ("sitting close\nuntil it's *ok*", "mt:dot,dot", None),
  ("*ok*", "hug:love,love|hearts", "send this to someone you owe an apology")]),
 ("winter_with_you", "winter with you is", [
  ("winter with\n*you* is...", "mwin:happy:snow|snow", None),
  ("stealing your\n*blanket*", "t:dot:loaf", None),
  ("two *cocoas*", "th:mug:happy", None),
  ("cold *noses*", "hug:shock,happy|snow", None),
  ("the *warmest*", "ss|hearts", "send this to your winter person")]),
 ("no_words", "you don't need words with your person", [
  ("you don't need words\nwith *your* person", "mt:happy,happy", None),
  ("a *look*", "mt:squint,squint", None),
  ("a *snack*", "give:t:cookie:happy:sparkle", None),
  ("a nap *nearby*", "ss", None),
  ("they just *know*", "hug:love,love|hearts", "send this to someone who just knows")]),
 ("christmas_with_you", "christmas with your person", [
  ("christmas with\nyour *person*", "mt:happy,happy+santa", None),
  ("wrapping gifts\n*badly*", "mbox:squint+santa", None),
  ("cookies\nfor *two*", "give:t:cookie:happy:sparkle+santa", None),
  ("matching *hats*", "mt:sparkle,sparkle+santa|sparkles", None),
  ("the best gift\nis *them*", "hug:love,love+santa|hearts", "send this to your christmas person")]),
 # Nov 22 weekly review: standalone variants of the 2x-median winners
 # (proud_of_you 59.9, friends_are 36.7, did_you_eat 32.3 sends/1k; median 15.7)
 ("so_proud", "we're so proud of you", [
  ("mochi and toast\nhave *news*", "mt:stare,stare", None),
  ("we're *proud*\nof you", "mt:happy,happy|sparkles", None),
  ("for the days you\nkept *going*", "hug:cry,love", None),
  ("even the *tiny* wins", "give:t:cookie:happy:sparkle", "(toast baked you a cookie. it's burnt)"),
  ("*so* proud", "hug:love,love|hearts", "send this to someone who needs to hear it")]),
 ("real_friends", "real friends", [
  ("real *friends*...", "mt:happy,happy", None),
  ("share the\nlast *cookie*", "give:t:cookie:happy:sparkle", None),
  ("show up\nwith *snacks*", "tdoor:happy", None),
  ("sit with you\nin the *quiet*", "mt:dot,dot", None),
  ("stay *forever*", "hug:love,love|hearts", "send this to your real one")]),
 ("drink_water", "did you drink water today?", [
  ("toast wants to\n*check* on you", "mt:stare,stare", None),
  ("did you drink\n*water* today?", "th:mug:squint", None),
  ("a real *meal*?\nnot just snacks", "tbowl:squint:empty", "(toast is one to talk)"),
  ("we'll *wait*", "mt:pout,pout", None),
  ("take care of\n*you* today", "hug:love,love|hearts", "send this to someone who forgets to eat")]),
]
