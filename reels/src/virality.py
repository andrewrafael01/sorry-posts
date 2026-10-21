"""Virality model. Score = 10 * (.30 reach + .35 send + .20 hook + .15 debate), each factor 1-10.
reach  = how many people on IG instantly see themselves (audience size, breadth of recognition)
send   = how badly a viewer wants to DM it to one specific person ("this is you" / "this is dad"). Sends per reach is IG's top non-follower signal.
hook   = does the title/first 3 seconds stop a scroll on its own
debate = does it start a comment fight / "ACTUALLY we're..." / tag-war (comments + replays + rewatches)
Scores are my own judgement from the research in README (IG ranking signals; identity/recognition humor), not measured data."""
W = dict(reach=.30, send=.35, hook=.20, debate=.15)
_ = """
001 9 10 9 7|002 9 10 8 6|003 9 10 8 7|004 8 9 8 6|005 7 8 7 6|006 9 9 8 9|007 9 10 9 6|008 10 10 9 7|009 8 9 8 6|010 8 8 7 5
011 9 9 9 10|012 7 8 7 8|013 9 9 8 8|014 9 10 8 6|015 9 10 8 6|016 9 10 8 6|017 6 9 8 7|018 9 10 9 8|019 7 10 8 7|020 8 10 9 8
021 7 8 7 8|022 9 9 9 10|023 8 9 8 8|024 9 9 8 9|025 7 8 8 7|026 8 8 8 8|027 7 8 7 8|028 8 9 7 7|029 8 8 7 6|030 7 7 6 6
031 9 10 9 9|032 10 10 9 8|033 9 10 9 8|034 6 10 8 7|035 7 10 8 7|036 6 9 8 7|037 7 8 7 7|038 6 9 8 7|039 6 9 8 7|040 7 8 7 7
041 8 10 8 6|042 9 10 8 6|043 8 8 8 8|044 7 9 8 8|045 7 8 7 6|046 8 9 8 7|047 7 8 7 6|048 6 7 7 6|049 7 8 7 6|050 8 9 8 6
051 7 8 8 8|052 6 7 6 5|053 6 7 7 7|054 6 7 6 6|055 7 8 7 7|056 7 8 8 7|057 6 6 6 5|058 6 8 6 5|059 8 8 7 7|060 10 9 8 10
061 8 9 8 8|062 8 9 8 9|063 8 8 8 8|064 7 9 9 8|065 6 8 7 7|066 7 8 7 6|067 6 8 8 7|068 6 7 6 6|069 6 7 6 6|070 7 8 7 7
071 8 8 7 6|072 8 9 8 7|073 8 9 8 6|074 7 9 7 5|075 7 8 8 9|076 8 10 9 9|077 8 10 9 9|078 8 10 9 9|079 8 9 8 6|080 7 8 7 6
081 9 9 8 6|082 9 8 8 7|083 8 8 7 6|084 9 9 8 7|085 8 8 7 6|086 10 10 9 7|087 7 7 6 5|088 7 7 7 6|089 7 7 7 6|090 7 8 7 5
091 7 8 8 8|092 7 8 8 7|093 6 7 7 5|094 6 7 7 5|095 7 8 8 8|096 6 7 7 7|097 7 8 8 7|098 6 7 7 5|099 7 9 9 8|100 8 8 8 6
101 6 10 8 7|102 7 10 8 7|103 6 10 8 8|104 6 10 8 7|105 6 10 8 7|106 4 9 7 6|107 8 10 9 7|108 7 10 9 8|109 8 10 9 8|110 8 10 9 8
111 9 10 9 7|112 9 10 9 8|113 9 10 9 7|114 9 10 9 7|115 8 10 9 8|116 8 10 8 6|117 8 9 9 7|118 8 10 8 6|119 7 9 8 6|120 7 9 8 6
121 5 9 7 6|122 5 9 7 6|123 5 9 7 6|124 6 10 8 7|125 6 10 8 7|126 6 10 8 7|127 6 10 8 7|128 5 9 7 7|129 4 9 7 6|130 5 9 7 6
"""
FACT = {int(c.split()[0]): tuple(map(int, c.split()[1:])) for c in _.replace("\n", "|").split("|") if c.strip()}
def score(n):
    r, s, h, d = FACT[n]
    return round(10 * (W["reach"]*r + W["send"]*s + W["hook"]*h + W["debate"]*d), 1)
