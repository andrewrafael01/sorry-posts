"""Viral-style Instagram captions: hook line, blank line, 2-3 short lines, blank line, one call to action, blank line, hashtags.
cap(name) -> the finished caption text (with real line breaks) for the post queue."""
TAGS_CORE = "#fyp #reels #viral #explorepage"
C = {
 "401_domino_moon": ("one domino can knock over the Moon 🌕", ["63 dominoes. each one 1.5x bigger than the last.", "the final one is taller than the distance to the Moon.", "(on paper. friction ruins it in real life.)"], "send this to someone who thinks small things don't matter 👇", "#physics #science #mindblown #didyouknow #space #moon #math"),
 "402_full_moons": ("you will only see about 990 full moons in your whole life 🌕", ["that's the entire supply.", "if you're 25, over 300 are already gone.", "and your parents? maybe 250 left."], "send this to your parents and tell them to go look outside tonight 🌙", "#fullmoon #moon #perspective #lifelessons #deep #mindblown #parents"),
 "405_sleep_drunk": ("24 hours without sleep = legally drunk 😳", ["after 17 hours awake you perform like a blood alcohol of 0.05.", "after 24 hours it's 0.10. over the legal limit.", "and you won't feel that impaired."], "send this to the friend who pulls all-nighters 👇", "#sleep #sleepdeprivation #health #didyouknow #facts #study #driving"),
 "406_phone_ten_years": ("you will spend about 10 YEARS of your life on your phone 📱", ["4 hours a day = 61 days a year.", "from age 18 to 78 that's 3,650 days.", "ten years. exactly."], "what's your screen time? comment your number 👇 and send this to someone whose number scares you", "#screentime #phoneaddiction #perspective #mindblown #lifehack #productivity #math"),
 "407_heartbeats": ("you only get about 3 billion heartbeats ❤️", ["this video just spent around 60 of them.", "a million heartbeats is about 9 and a half days.", "(not a literal limit. but it makes you think.)"], "what are you spending your next million on? send this to someone you want to spend them with 👇", "#heart #heartbeat #perspective #lifelessons #deep #mindblown #science"),
 "408_117_billion": ("for every person alive right now, about 14 have already died 🌌", ["117 billion humans have ever lived.", "8 billion are alive today.", "give everyone a star and the sky is 93% dark."], "tag someone on the bright edge with you ✨", "#universe #humanity #perspective #mindblown #deep #facts #space"),
 "409_parents_days": ("you have about 200 days left with your parents", ["10 days a year x 20 years.", "that's less than a single year.", "and it comes as a weekend here, a holiday there."], "call them tonight 📞 and send this to someone who should call their mom", "#parents #family #lifelessons #perspective #deep #love #mom"),
}
def cap(name):
    hook, lines, cta, tags = C[name]
    return hook + "\n\n" + "\n".join(lines) + "\n\n" + cta + "\n\n" + tags + " " + TAGS_CORE
if __name__ == "__main__":
    for k in C: print(cap(k)); print("-----")
