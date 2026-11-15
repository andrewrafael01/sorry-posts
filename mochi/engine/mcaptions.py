import json
from content import REELS, CAROUSELS, CAR_DATES
BASE_TAGS = ["#cutecats", "#catcomic", "#wholesome", "#mochiandtoast", "#kawaii"]
TOPIC = [("xmas", "#christmas"), ("christmas", "#christmas"), ("thank", "#thanksgiving"), ("finals", "#finals"), ("study", "#finals"),
         ("snow", "#winter"), ("winter", "#winter"), ("cold", "#winter"), ("2026", "#newyear"), ("nye", "#newyear"), ("resolution", "#newyear"),
         ("bed", "#bedtime"), ("love", "#relationships"), ("date", "#relationships"), ("friend", "#bestfriend")]
def tags(name):
    t = BASE_TAGS[:]
    for key, tag in TOPIC:
        if key in name and tag not in t: t[-1] = tag; break
    return " ".join(t)
def cta(beats):
    sub = beats[-1][2] or ""
    lines = [l for l in sub.split("\n") if any(w in l for w in ("send", "tag", "comment", "save"))]
    return lines[-1] if lines else "send this to someone who needs it"
def cap(first, name, beats):
    return f"{first} 🤍\n\n{cta(beats)}\n\nmochi and toast: a cute cat comic about love, comfort and cozy days.\n\n{tags(name)}"
out = {}
for i, (n, c, b) in enumerate(REELS): out[f"mochi reel: {i+1:02d}_{n}"] = cap(c, n, b)
for i, (n, c, s) in enumerate(CAROUSELS):
    out[f"mochi carousel: {n}"] = cap(c, n, s)
    if n not in CAR_DATES:
        bb = list(s); t, sp, sub = bb[-1]
        if not sub or ("send" not in sub and "tag" not in sub and "comment" not in sub):
            bb[-1] = (t, sp, "send this to your favorite person" if not sub else sub+"\nsend this to your favorite person")
        out[f"mochi reel B: {100+i+1}_c_{n}"] = cap(c, n, bb)
json.dump(out, open("/tmp/claude-0/cats/mochi/captions.json", "w"), ensure_ascii=False)
print(len(out)); print(out["mochi reel: 24_xmas_eve"]); print("---"); print(out["mochi carousel: rate_your_mood"])
