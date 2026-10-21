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

def _eleven(text):
    import urllib.request
    key = os.environ["ELEVENLABS_API_KEY"]; vid = os.environ.get("ELEVENLABS_VOICE_ID", "pNInz6obpgDQGcFmaJgB")
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

def speak(text):
    eng = _engine()
    if eng is None: return None
    os.makedirs(CACHE, exist_ok=True)
    f = os.path.join(CACHE, hashlib.sha1((eng + os.environ.get("ELEVENLABS_VOICE_ID", "") + text).encode()).hexdigest() + ".npy")
    if os.path.exists(f): return np.load(f)
    x, sr = _eleven(text) if eng == "eleven" else _piper(text)
    if sr != SR: x = resample_poly(x, SR, sr).astype(np.float32)
    x = x / max(1e-6, np.abs(x).max()) * .9
    np.save(f, x); return x
