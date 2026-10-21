"""Archetype reels: '<group>, but you know exactly who i mean' + 'a day in the life of ...'. Short constructors for beats."""
from reel import *
from props import prop

def person(shirt, skin="light", hair="brown", style="short", pants="2b3040", glasses=None, extra=None, cap=None):
    spec = C(shirt, pants=pants, skin=skin, hair=hair, style=style, glasses=glasses, extra=extra)
    if cap: spec["cap"] = rgb(cap)
    return spec

def A(c, x, expr="smile", pose="idle", s=2.2, **kw): return dict(c=c, x=x, expr=expr, pose=pose, s=s, **kw)
def P(n, x, y, size=300, **kw):
    kwd = dict(kw.pop("kw", {}))
    kwd.update({k: kw.pop(k) for k in list(kw) if k in ("text", "n_", "color", "open_", "kind", "dark", "sub", "lines", "total", "plates", "hour", "minute", "steam", "food", "garnish", "screen")})
    if "n_" in kwd: kwd["n"] = kwd.pop("n_")
    return dict(n=n, x=x, y=y, size=size, kw=kwd, **kw)
def S(text, who=0, at=.5, dur=1.7, **kw): return dict(who=who, text=text, at=at, dur=dur, **kw)

def beat(title, sub=None, hl=(), bg="street", who=(), props=(), say=(), pop=None, pops=None, card=None, dur=3.0, tint=None, cues=(), cut="cut", shake=None, amb=None, cast=None, hud=None, push=.04, dip=None, caps=None):
    cap = dict(text=title, sub=sub, style="title", hl=list(hl)) if title else None
    return SceneShot(bg, dur, cast=cast, actors=list(who), props=list(props), lines=list(say), cap=cap, caps=caps, pop=pop, pops=pops, card=card, tint=tint, cues=list(cues), cut=cut, shake=shake, amb=amb, hud=hud, push=push, music_dip=dip)

def lineup(group, chars, K, bg="street", props=(), dur=3.2, extra=None, who_pose=None):
    """Hook shot: five archetypes walk in. group = e.g. 'bmw guys'."""
    xs = [.12, .31, .5, .69, .88]; who = []
    for i, c in enumerate(chars[:5]):
        who.append(A(c, xs[i], expr="smile", pose=(who_pose or ["idle", "wave", "idle", "idle", "wave"])[i], s=1.55, enter="left", at=i * .12, enter_dur=.7))
    return SceneShot(bg, dur, cast=K, actors=who, props=list(props), caps=[dict(text=f"{group}, but you know exactly who i mean", style="hook", hl=["know", "exactly"], y=330)], cues=[(0, "whoosh", .5)] + list(extra or []), push=.03)

def P_smoke(x, y, size=260, at=0): return dict(n="pot", x=x, y=y, size=size, kw=dict(steam=True, color="3a3d48"), at=at)


def dayhook(text, K, name, bg="street", props=(), expr="cool", dur=3.0, hl=("day", "life")):
    return SceneShot(bg, dur, cast=K, actors=[A(name, .5, expr, "flex", 2.4, enter="left", enter_dur=.7)], props=list(props),
                     caps=[dict(text=text, style="hook", hl=list(hl), y=330)], cues=[(0, "whoosh", .5)], push=.03)

def carp(c, x=.5, y=.72, size=520, **k): return P("car", x, y, size, kw=dict(color=c), **k)
