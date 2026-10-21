"""Batch 19: group chat / text-thread sketches 151-159. People in the thread say the joke; the last message is the button."""
from scripts.common import *
from phone import Messages, LockScreen, VoiceMemo

def chat(num, name, contact, msgs, hook, hl, title, caption, story, group=True, dark=False, clock="9:41", style="pop", bg=(52, 120, 246), color=PINK):
    ev, t = [], .5
    for m in msgs:
        if m[0] == "stamp": ev.append(dict(at=t - .1, stamp=m[1])); t += .35; continue
        who, sender, text = m[0], m[1], m[2]; gap = m[3] if len(m) > 3 else .45 + .05 * len(text)
        e = dict(at=t, who=who, text=text, sender=sender)
        if who == "me": e["type_time"] = min(1.0, .03 * len(text) + .2); e["at"] = t + e["type_time"]; t += e["type_time"]
        elif not group: e["typing"] = .5
        ev.append(e); t += max(.6, gap)
    last = ev[-1]["at"]
    ui = Messages(contact, ev, group=group or None, dark=dark, clock=clock, avatar_color=color)
    shot = PhoneShot(ui, dur=last + 2.6, caps=[dict(text=hook, style="hook", hl=hl, y=290)], bg=bg, zoom=[(last - .3, last + .6, 1.28, 600, 900)],
                     music_dip=(last - .5, last + 1.2, .25), cues=[(last, "boom", .6), (last + .7, "womp", .4)])
    return Reel(f"{num}_{name}", [shot], style=style, seed=num, title=title, caption=caption, story=story)

def desi_diwali_chat():
    m = [("them", "Raj Uncle", "Good morning 🌻🙏"), ("them", "Raj Uncle", "Diwali plan?"), ("them", "Meena Aunty", "at my house as always"), ("them", "Neha", "who's bringing what"),
         ("them", "Meena Aunty", "no need to bring anything"), ("them", "Meena Aunty", "just 4 dishes each"), ("them", "Raj Uncle", "who is this"), ("them", "Neha", "uncle it's me. new number"),
         ("them", "Raj Uncle", "which neha"), ("them", "Neha", "your niece. i've been at your house every diwali of my life"), ("them", "Raj Uncle", "ok 👍"), ("them", "Raj Uncle", "you are 26 correct? i have a boy"),
         ("them", "Neha", "uncle i'm in the group chat with the whole family"), ("them", "Raj Uncle", "ok i will add him to the group"), ("them", "Neha", "NO"), ("them", "Meena Aunty", "welcome prakash 🌻🙏"), ("stamp", "Neha left the conversation"), ("them", "Meena Aunty", "she is shy")]
    return chat(151, "desi_diwali_chat", "FAMILY 🪔 (47)", m, "the family group chat, diwali planning", ["diwali"], "the family group chat, diwali planning", "uncle added the boy to the group chat. neha left. tag the cousin who always gets set up", "A desi family group chat plans Diwali: Meena Aunty says bring nothing but four dishes, Raj Uncle asks 'which Neha', offers a boy, then adds him to the group; Neha leaves the chat.", dark=False, style="funk")

def arab_dinner_chat():
    m = [("them", "Hala", "dinner at 7 inshallah"), ("them", "Omar", "inshallah"), ("them", "Omar", "so is it 7 or is it inshallah 7"), ("them", "Hala", "7"), ("them", "Hala", "inshallah 7"), ("stamp", "5:12 PM"),
         ("them", "Khalid", "leaving now"), ("stamp", "7:40 PM"), ("them", "Khalid", "5 minutes"), ("them", "Hala", "where are you"), ("them", "Khalid", "5 minutes"), ("stamp", "9:15 PM"), ("them", "Khalid", "we are downstairs"),
         ("them", "Hala", "we already ate"), ("them", "Hala", "there is food for you"), ("them", "Khalid", "we are not hungry"), ("them", "Hala", "📷 (40 dishes)"), ("them", "Khalid", "we are coming up"), ("them", "Omar", "khalid you live 4 minutes away")]
    return chat(152, "arab_dinner_chat", "العيلة 🌙", m, "arab family chat, dinner at 7", ["dinner", "7"], "arab family chat, dinner at 7", "inshallah 7 is a different time than 7. tag the relative who says 5 minutes", "An Arab family chat sets dinner at '7 inshallah', one uncle says 'leaving now' at 5pm, '5 minutes' at 7:40 and 'downstairs' at 9:15, after dinner is over; he says he's not hungry then comes up for the 40 dishes. He lives four minutes away.", style="jazz")

def dad_text_chat():
    m = [("them", "Dad", "Did you eat"), ("me", None, "yes"), ("them", "Dad", "What did you eat"), ("me", None, "pasta"), ("them", "Dad", "Pasta is not food"), ("me", None, "dad"),
         ("them", "Dad", "📷 (a single boiled egg on a plate)"), ("them", "Dad", "Look"), ("me", None, "is that your dinner"), ("them", "Dad", "Your mother is at her sister's. I am fine"), ("me", None, "come over. i'll make food"),
         ("them", "Dad", "No no. I'm fine"), ("them", "Dad", "What time"), ("me", None, "7"), ("them", "Dad", "ok"), ("stamp", "4:11 PM"), ("them", "Dad", "I'm outside"), ("me", None, "dad it's 4"), ("them", "Dad", "Traffic was good")]
    return chat(153, "dad_text_chat", "Dad", m, "dad texts", ["dad"], "dad texts", "'traffic was good.' he's been outside for three hours. send this to your dad", "A dad texts 'did you eat', shows a single boiled egg as dinner and says mom is at her sister's. You invite him for 7; he arrives outside at 4 and explains 'traffic was good'.", group=False, color=(120, 150, 200), style="lofi")

def chinese_mom_chat():
    m = [("them", "Mom", "Eat"), ("them", "Mom", "Wear more clothes tomorrow. cold"), ("me", None, "it's 72 degrees"), ("them", "Mom", "You are not weather man"), ("them", "Mom", "Did you take vitamin"), ("me", None, "yes"),
         ("them", "Mom", "Saw news. A man in your city got stabbed"), ("me", None, "mom i live in a different state"), ("them", "Mom", "Come home"), ("them", "Mom", "Also there is a boy. Doctor. 29"), ("me", None, "mom"),
         ("them", "Mom", "He has car"), ("them", "Mom", "Dad says hi"), ("them", "Dad", "👍"), ("me", None, "he sent a thumbs up"), ("them", "Mom", "same thing")]
    return chat(154, "chinese_mom_chat", "Mom", m, "chinese mom texts", ["mom"], "chinese mom texts", "'he sent a thumbs up.' 'same thing.' tag your chinese mom", "A Chinese mom texts: eat, wear more, 'you are not weather man', vitamins, a stabbing in another state, a doctor with a car, and dad says hi with a thumbs up: 'same thing' as i love you.", group=False, color=(235, 120, 130), style="bounce")

def nigerian_mom_chat():
    m = [("them", "Mummy", "WHERE ARE YOU"), ("them", "Mummy", "I HAVE CALLED YOU 7 TIMES"), ("me", None, "i was in a meeting"), ("them", "Mummy", "MEETING WITH WHO"), ("me", None, "work mum"), ("them", "Mummy", "ARE YOU DEAD"),
         ("me", None, "no"), ("them", "Mummy", "THEN PICK"), ("them", "Mummy", "I told your aunty you are not fat in your pictures"), ("me", None, "mum"), ("them", "Mummy", "I said you are 'robust'"), ("me", None, "thanks?"),
         ("them", "Mummy", "come for christmas. bring your friend. bring everybody"), ("them", "Mummy", "i have cooked enough for the whole building"), ("me", None, "how many people"), ("them", "Mummy", "only 60"), ("me", None, "mum"), ("them", "Mummy", "ok 80")]
    return chat(155, "nigerian_mom_chat", "Mummy 🇳🇬", m, "nigerian mom texts", ["nigerian"], "nigerian mom texts", "'i said you are robust.' tag your nigerian friend's mum", "A Nigerian mum in all caps: 7 missed calls, 'are you dead', defending the kid to the aunty as 'robust', then inviting 'only 60' people for Christmas, which becomes 80.", group=False, color=(60, 160, 90), style="funk")

def desi_wedding_chat():
    m = [("them", "Sunita Aunty", "COLORS: sangeet pink, mehndi green, wedding red, reception gold"), ("them", "Priya", "what about the men"), ("them", "Sunita Aunty", "same colour tie"), ("them", "Anju Aunty", "i have already bought the saree. black"),
         ("them", "Sunita Aunty", "black is not auspicious"), ("them", "Anju Aunty", "it's a very nice black"), ("them", "Sunita Aunty", "NO"), ("them", "Anju Aunty", "i will return it"), ("them", "Anju Aunty", "it's already worn"),
         ("me", None, "can we keep the wedding small?"), ("them", "Sunita Aunty", "of course beta"), ("them", "Sunita Aunty", "300 people"), ("me", None, "that's not small"), ("them", "Sunita Aunty", "ok 310")]
    return chat(156, "desi_wedding_chat", "SHADI 💍 (212)", m, "the desi wedding group chat", ["wedding"], "the desi wedding group chat", "'ok 310.' tag the bride who asked for a small wedding", "A desi wedding group chat: a four-color dress code, an aunty who bought the black saree anyway ('it's a very nice black'), and the bride asking for a small wedding gets '300 people', then '310'.", style="pop")

def gym_chat():
    m = [("them", "Mike", "leg day tmrw 5am"), ("them", "Jay", "i'm in"), ("them", "Dre", "locked in"), ("them", "Mike", "no excuses"), ("stamp", "5:02 AM"), ("them", "Mike", "here"), ("stamp", "5:31 AM"), ("them", "Mike", "where is everyone"),
         ("them", "Jay", "bro my alarm didn't go off"), ("them", "Dre", "i think i'm sick"), ("them", "Jay", "i'm sore from yesterday"), ("them", "Mike", "you didn't go yesterday"), ("them", "Jay", "sore emotionally"), ("stamp", "6:15 AM"),
         ("them", "Mike", "gym's closed"), ("them", "Mike", "it's sunday"), ("them", "Dre", "so we didn't miss anything")]
    return chat(157, "gym_chat", "LEG DAY 💪🦵", m, "the gym group chat, leg day", ["leg"], "the gym group chat, leg day", "'sore emotionally.' tag the guy who says leg day then doesn't show", "A gym bros chat swears no excuses for 5am leg day; Mike shows up alone, the others have alarms, sickness and being 'sore emotionally', and the gym is closed because it's Sunday.", dark=True, bg=(30, 36, 60), style="trap")

def taarof_chat():
    m = [("them", "Maman", "please don't bring anything"), ("me", None, "we'll bring dessert"), ("them", "Maman", "no no i insist you don't"), ("me", None, "ok we won't"), ("them", "Maman", "ok good"), ("stamp", "6:40 PM"),
         ("them", "Maman", "where are you"), ("me", None, "you said not to bring anything"), ("them", "Maman", "yes of course"), ("them", "Maman", "but where is the dessert"), ("me", None, "you said no no i insist"), ("them", "Maman", "that is just what you say"), ("them", "Maman", "WHERE IS THE DESSERT")]
    return chat(158, "taarof_chat", "Maman 🇮🇷", m, "persian hosts, 'don't bring anything'", ["don't", "bring"], "persian hosts, 'don't bring anything'", "'that is just what you say.' tag your persian friend who taarofs", "Persian taarof: the host says don't bring anything, insists twice, you obey, and she asks at 6:40 'where is the dessert', explaining 'that is just what you say'.", group=False, color=(120, 90, 180), style="jazz")

def korean_mom_chat():
    m = [("them", "Mom", "Did you eat"), ("me", None, "yes"), ("them", "Mom", "📷 (14 side dishes)"), ("them", "Mom", "come take"), ("me", None, "i'm at work"), ("them", "Mom", "ok i will send"),
         ("stamp", "Next day"), ("them", "Mom", "package is at your door"), ("them", "Mom", "don't open it hot"), ("me", None, "mom what is in it"), ("them", "Mom", "kimchi"), ("me", None, "it weighs 18 pounds"), ("them", "Mom", "is it enough")]
    return chat(159, "korean_mom_chat", "Mom 💚", m, "korean mom texts", ["korean"], "korean mom texts", "'is it enough.' it's 18 pounds. tag your korean friend's mom", "A Korean mom asks if you ate, shows 14 side dishes, mails an 18-pound package of kimchi and asks, 'is it enough'.", group=False, color=(60, 160, 120), style="lofi")

REELS = dict(desi_diwali_chat=desi_diwali_chat, arab_dinner_chat=arab_dinner_chat, dad_text_chat=dad_text_chat, chinese_mom_chat=chinese_mom_chat, nigerian_mom_chat=nigerian_mom_chat, desi_wedding_chat=desi_wedding_chat, gym_chat=gym_chat, taarof_chat=taarof_chat, korean_mom_chat=korean_mom_chat)
