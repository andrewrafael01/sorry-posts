"""Voice-over. speak(text) -> mono float32 at 44.1 kHz, or None if no voice is available.
Default: ElevenLabs when ELEVENLABS_API_KEY is set (ELEVENLABS_VOICE_ID picks the voice), otherwise silent. VOICE=piper opts in to the in-house offline Piper voice (voices/en_US-ryan-high.onnx).
Set VOICE=off to force silent renders, VOICE=piper or VOICE=eleven to force one engine. Clips are cached in .voice_cache so a re-render does not pay for the same line twice."""
import os, hashlib, json, subprocess, wave, io
import numpy as np
from scipy.signal import resample_poly

SR = 44100
HERE = os.path.dirname(__file__)
CACHE = os.path.join(HERE, ".voice_cache")
PIPER_MODEL = os.path.join(HERE, "voices", "en_US-ryan-high.onnx")
ELEVEN_MODEL = os.environ.get("ELEVENLABS_MODEL", "eleven_multilingual_v2")

def _engine():
    v = os.environ.get("VOICE", "").lower()
    if v == "off": return None
    if v in ("eleven", "elevenlabs") or (not v and os.environ.get("ELEVENLABS_API_KEY")): return "eleven" if os.environ.get("ELEVENLABS_API_KEY") else None
    if v == "piper":
        try:
            import piper  # noqa
            return "piper" if os.path.exists(PIPER_MODEL) else None
        except Exception: return None
    return None

def _eleven(text, vid=None):
    import urllib.request
    key = os.environ["ELEVENLABS_API_KEY"]; vid = vid or os.environ.get("ELEVENLABS_VOICE_ID", "pNInz6obpgDQGcFmaJgB")
    body = json.dumps({"text": text, "model_id": ELEVEN_MODEL, "voice_settings": {"stability": .4, "similarity_boost": .8, "style": .35, "use_speaker_boost": True}}).encode()
    req = urllib.request.Request(f"https://api.elevenlabs.io/v1/text-to-speech/{vid}?output_format=pcm_24000", data=body, headers={"xi-api-key": key, "Content-Type": "application/json", "Accept": "audio/pcm"})
    raw = urllib.request.urlopen(req, timeout=120).read()
    return np.frombuffer(raw, dtype="<i2").astype(np.float32) / 32768.0, 24000

def _piper(text):
    from piper import PiperVoice
    global _PV
    try: _PV
    except NameError: _PV = PiperVoice.load(PIPER_MODEL)
    buf = io.BytesIO()
    with wave.open(buf, "wb") as w: _PV.synthesize_wav(text, w)
    buf.seek(0)
    with wave.open(buf, "rb") as w: sr = w.getframerate(); raw = w.readframes(w.getnframes())
    return np.frombuffer(raw, dtype="<i2").astype(np.float32) / 32768.0, sr

SCRIPTS = {}   # reel name -> [(shot_index, text)] narration, registered by the script modules
FEMALE = ["21m00Tcm4TlvDq8ikWAM", "EXAVITQu4vr4xnSDxMaL"]   # ElevenLabs premade: Rachel, Bella
MALE = ["pNInz6obpgDQGcFmaJgB", "ErXwobaYiN019PkySvjV", "TxGEqnHWrfWFTfGW9XjX"]   # Adam, Antoni, Josh
_FEM_KEYS = ("mom", "aunt", "nani", "abu", "nonna", "gm", "tia", "gf", "cat", "hammam", "salon", "clean", "dolma", "olive", "filter", "temple", "silk", "sweet", "nai", "bag", "zaffe", "cof", "hop", "tea", "kehwa", "saffron", "yal", "sunita", "gram", "grand")
def enabled(): return _engine() is not None
def voice_for(key):
    """Pick a stable voice id for a cast key (female-ish names get a female voice, everyone else male). ELEVENLABS_VOICE_ID overrides everything."""
    if os.environ.get("ELEVENLABS_VOICE_ID"): return os.environ["ELEVENLABS_VOICE_ID"]
    k = str(key).lower(); pool = FEMALE if any(f in k for f in _FEM_KEYS) else MALE
    return pool[sum(map(ord, k)) % len(pool)]
def speakable(text):
    t = text.strip()
    import re
    return bool(re.search(r"[A-Za-z0-9]", t)) and not t.startswith("(") and not t.startswith("*")
def seconds(text, voice_id=None):
    if not speakable(text): return None
    x = speak(text, voice_id); return None if x is None else len(x) / SR

def speak(text, voice_id=None):
    eng = _engine()
    if eng is None: return None
    os.makedirs(CACHE, exist_ok=True)
    f = os.path.join(CACHE, hashlib.sha1((eng + str(voice_id) + text).encode()).hexdigest() + ".npy")
    if os.path.exists(f): return np.load(f)
    try: x, sr = _eleven(text, voice_id) if eng == "eleven" else _piper(text)
    except Exception as e: print("voice: skipped", repr(text)[:40], repr(e)[:60]); return None
    if sr != SR: x = resample_poly(x, SR, sr).astype(np.float32)
    x = x / max(1e-6, np.abs(x).max()) * .9
    np.save(f, x); return x
