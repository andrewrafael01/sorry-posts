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
