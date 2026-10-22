"""Voice-over. speak(text) -> mono float32 at 44.1 kHz, or None if no voice is available.
Default engine: ElevenLabs if ELEVENLABS_API_KEY is set, otherwise Kokoro (in-house, offline, voices/kokoro-v1.0.onnx + voices-v1.0.bin). VOICE=off renders silent, VOICE=piper the older Piper voice.
Set VOICE=off to force silent renders, VOICE=piper or VOICE=eleven to force one engine. Clips are cached in .voice_cache so a re-render does not pay for the same line twice."""
import os, hashlib, json, subprocess, wave, io
import numpy as np
from scipy.signal import resample_poly

SR = 44100
V2 = "expressive-v2d"   # cache salt: bump when delivery changes
HERE = os.path.dirname(__file__)
CACHE = os.path.join(HERE, ".voice_cache")
PIPER_MODEL = os.path.join(HERE, "voices", "en_US-ryan-high.onnx")
ELEVEN_MODEL = os.environ.get("ELEVENLABS_MODEL", "eleven_multilingual_v2")

KOKORO_MODEL = os.path.join(HERE, "voices", "kokoro-v1.0.onnx"); KOKORO_VOICES = os.path.join(HERE, "voices", "voices-v1.0.bin")
def _have_kokoro():
    try:
        import kokoro_onnx  # noqa
        return os.path.exists(KOKORO_MODEL) and os.path.exists(KOKORO_VOICES)
    except Exception: return False

def _engine():
    v = os.environ.get("VOICE", "").lower()
    if v == "off": return None
    if v == "kokoro": return "kokoro" if _have_kokoro() else None
    if not v and not os.environ.get("ELEVENLABS_API_KEY"): return "kokoro" if _have_kokoro() else None
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


# Respellings so the in-house voice says foreign names and loanwords right. Only the TTS sees these; on-screen text is untouched.
LEXICON = {
 "cryptobiosis": "krip-toh-by-oh-sis", "chimborazo": "chim-bo-rah-zo", "mauna kea": "mau-na kay-ah", "manpo-kei": "mahn-poh-kay", "sagittarius": "sadge-ih-tair-ee-us", "tardigrade": "tar-di-grade", "tardigrades": "tar-di-grades", "hemocyanin": "hee-mo-sy-ah-nin", "microsieverts": "my-kro-see-verts", "potassium-40": "potassium forty", "unvigintillion": "un-vigin-tillion", "hilsa": "hil-sah",
 "tenochtitlan": "teh-notch-teet-lahn", "qahwa": "kah-wah", "suffa": "soo-fah", "sukkar": "soo-kar", "makhazin": "mah-kah-zeen", "safar": "sah-far", "sifr": "sif-er", "qutn": "koo-tn", "laymun": "lay-moon",
 "al-jabr": "al jabr", "al-kuhl": "al kool", "bandhna": "bund-nah", "khat": "kut", "champo": "chum-poh", "jangal": "jun-gul", "pae jama": "pie jah-mah", "bangla": "bung-lah", "lut": "loot", "avatara": "ah-vuh-tah-rah", "thag": "tug", "urdu": "oor-doo",
 "mbappe": "em-bah-pay", "mbappé": "em-bah-pay", "klose": "kloh-zuh", "fontaine": "fon-tain", "muller": "mew-ler", "müller": "mew-ler", "nowitzki": "noh-vit-skee", "ohtani": "oh-tah-nee", "benzema": "ben-zeh-mah", "rahm": "rahm", "canelo": "kah-neh-lo", "alvarez": "al-vah-rez",
 "bezos": "bay-zos", "arnault": "ar-no", "huang": "hwahng", "zuckerberg": "zuck-er-berg", "amancio": "ah-mahn-see-oh", "ortega": "or-teh-gah", "sergey": "sir-gay", "buffett": "buff-it", "karman": "kar-mahn", "kármán": "kar-mahn",
 "cleopatra": "klee-oh-pat-ra", "nintendo": "nin-ten-doh", "wombat": "wom-bat", "peregrine": "pair-uh-grin", "pronghorn": "prong-horn", "sharmaji": "shar-mah-jee", "taarof": "tah-rof", "dabba": "dub-bah", "achaar": "ah-char", "inshallah": "in-shah-lah", "wallah": "wah-lah",
 "habibi": "hah-bee-bee", "abuela": "ah-bweh-lah", "nonna": "non-nah", "chancla": "chahn-klah", "samosas": "sah-mo-sahs", "paneer": "pah-neer", "mishti": "mish-tee", "puja": "poo-jah", "ahorita": "ah-oh-ree-tah", "tita": "tee-tah", "mijo": "mee-hoh",
}
def respell(text):
    import re
    for k in sorted(LEXICON, key=len, reverse=True):
        text = re.sub(r"(?<![\w-])" + re.escape(k) + r"(?![\w-])", LEXICON[k], text, flags=re.I)
    return text

SCRIPTS = {}   # reel name -> [(shot_index, text)] narration, registered by the script modules
FEMALE = ["21m00Tcm4TlvDq8ikWAM", "EXAVITQu4vr4xnSDxMaL"]   # ElevenLabs premade: Rachel, Bella
MALE = ["pNInz6obpgDQGcFmaJgB", "ErXwobaYiN019PkySvjV", "TxGEqnHWrfWFTfGW9XjX"]   # Adam, Antoni, Josh
_FEM_KEYS = ("hala", "neha", "priya", "anju", "maman", "mummy", "mama", "sunita", "meena", "dani", "mom", "aunt", "nani", "abu", "nonna", "gm", "tia", "gf", "cat", "hammam", "salon", "clean", "dolma", "olive", "filter", "temple", "silk", "sweet", "nai", "bag", "zaffe", "cof", "hop", "tea", "kehwa", "saffron", "yal", "sunita", "gram", "grand")
def enabled(): return _engine() is not None
K_FEMALE = ["af_bella", "af_heart", "af_nicole", "af_sarah", "af_nova", "af_river", "bf_emma", "af_sky"]
K_MALE = ["am_michael", "am_adam", "am_fenrir", "am_liam", "am_eric", "am_onyx", "bm_george", "bm_lewis"]
K_KID = ["am_puck"]
NARRATOR = "am_fenrir"
def voice_for(key):
    """Match a cast key to a voice: role keywords first (so every mom sounds like a mom), then a stable hash. ELEVENLABS_VOICE_ID overrides when ElevenLabs is the engine."""
    k = str(key).lower()
    if _engine() == "kokoro":
        table = [
          (("nonna", "nani", "abu", "grandma", "gm", "taita", "nai"), "af_heart"), (("teach",), "bf_emma"), (("tia", "salon", "clean"), "af_nova"), (("mom", "mama", "mummy", "maman", "bone", "fish", "dolma", "olive", "filter", "temple", "silk", "sweet", "kibbe", "lavash", "palao", "hop", "yal"), "af_bella"),
          (("aunt", "aunty", "auntie", "meena", "sunita", "anju", "hala"), "af_sarah"), (("gf", "cat", "dog", "cuz", "group", "fwd", "vn", "ph", "neha", "priya"), "af_sky"), (("doc", "bank", "cashier", "wait", "clerk", "mech", "dealer"), "bm_lewis"),
          (("grandpa", "appa", "baba", "sh", "taita", "pherin", "ian"), "am_onyx"), (("unc", "uncle", "raj", "khalid", "sal", "vin", "gaz", "mas", "shop", "adda"), "bm_george"), (("dad", "maps", "shortcut", "horn", "gas", "tow", "prayer", "wallah"), "am_adam"),
          (("kid", "me", "young", "kidk", "kid2", "boy", "abcd", "fob", "mid", "old"), "am_puck"), (("bmw", "tesla", "dave", "car", "truck", "jeep", "audi", "civic", "friend", "chai", "cart", "tio", "dance"), "am_michael"), (("boss", "law", "pat"), "am_eric"),
        ]
        for keys, vid in table:
            if any(x == k or (len(x) > 2 and x in k) for x in keys): return vid
        pool = K_FEMALE if any(f in k for f in _FEM_KEYS) else [x for x in K_MALE if x != NARRATOR]
        return pool[sum(map(ord, k)) % len(pool)]
    if os.environ.get("ELEVENLABS_VOICE_ID"): return os.environ["ELEVENLABS_VOICE_ID"]
    pool = FEMALE if any(f in k for f in _FEM_KEYS) else MALE
    return pool[sum(map(ord, k)) % len(pool)]
def clean(text):
    """What actually gets read: no emoji, no brackets, no dots-only fillers."""
    import re
    t = re.sub(r"[\U0001F000-\U0001FFFF\u2600-\u27BF\u2190-\u21FF\uFE0F]", "", text)
    t = t.replace("(", "").replace(")", "").replace("\u00b7", " ").replace("*", "")
    return re.sub(r"\s+", " ", t).strip()
def speakable(text):
    t = text.strip()
    import re
    return bool(re.search(r"[A-Za-z0-9]", t)) and not t.startswith("(") and not t.startswith("*")
def seconds(text, voice_id=None):
    if not speakable(text): return None
    x = speak(text, voice_id); return None if x is None else len(x) / SR

_KK = None
def _kokoro(text, voice_id=None, speed=1.06):
    global _KK
    if _KK is None:
        from kokoro_onnx import Kokoro
        _KK = Kokoro(KOKORO_MODEL, KOKORO_VOICES)
    vid = voice_id if (voice_id or "").startswith(("af_", "am_", "bf_", "bm_")) else NARRATOR
    if "+" in vid:    # blend two voices' style vectors into a new one
        a_, b_ = vid.split("+"); vid = (_KK.get_voice_style(a_) + _KK.get_voice_style(b_)) / 2
    x, sr = _KK.create(text, voice=vid, speed=speed, lang="en-us")
    return np.asarray(x, dtype=np.float32), sr

import re as _re
_BIG = _re.compile(r"\b(million|billion|trillion|thousand|hundred|percent|years?|days?|never|last|only|all|every|nobody|gone|left|zero|none|first|one)\b", _re.I)
def _delivery(sentence, first, last):
    """Pick speed, pause after and gain for one sentence so the read has shape: a deliberate hook, punchy short lines, a lift on questions, weight on the reveal."""
    words = sentence.split(); n = len(words); end = sentence.rstrip()[-1:]
    speed, pause, gain = .87, .32, 1.0
    if first: speed, pause = .83, .52
    if n <= 3: speed, pause, gain = .80, .48, 1.12          # punch line: "Not years. Days."
    elif end == "?": speed, pause = .85, .55
    elif end == "!": speed, pause, gain = .90, .38, 1.12
    elif n >= 16: speed = .85
    if _BIG.search(sentence) and n > 3: speed -= .03; gain *= 1.06     # slow slightly into the reveal
    if end == "\u2026" or sentence.rstrip().endswith("..."): pause = .65
    if last: pause = 0.0; speed = min(speed, .85)
    return speed, pause, gain

def _kokoro_expressive(text, voice_id=None):
    """Synthesise sentence by sentence with their own pace, then place real silences between them. Long sentences are split at commas with a short breath."""
    parts = [p.strip() for p in _re.split(r"(?<=[.!?\u2026])\s+", text) if p.strip()]
    chunks = []; sr_out = 24000
    for i, sent in enumerate(parts):
        speed, pause, gain = _delivery(sent, i == 0, i == len(parts) - 1)
        clauses = [sent]
        if len(sent.split()) > 14 and "," in sent:      # breath at the middle comma
            idx = [m.start() for m in _re.finditer(",", sent)]; mid = min(idx, key=lambda k: abs(k - len(sent) / 2)); clauses = [sent[:mid + 1], sent[mid + 1:].strip()]
        for j, cl in enumerate(clauses):
            x, sr = _kokoro(cl, voice_id, speed=speed); sr_out = sr
            x = _master(x, sr, studio=False) * gain
            chunks.append(x)
            if j < len(clauses) - 1: chunks.append(np.zeros(int(.16 * sr), np.float32))
        if pause > 0: chunks.append(np.zeros(int(pause * sr_out), np.float32))
    return np.concatenate(chunks).astype(np.float32), sr_out

def _biquad(x, sr, kind, f0, gain_db, q=.7):
    """RBJ cookbook shelf / peaking filters."""
    from scipy.signal import lfilter
    A = 10 ** (gain_db / 40); w0 = 2 * np.pi * f0 / sr; al = np.sin(w0) / (2 * q); c = np.cos(w0)
    if kind == "peak": b = [1 + al * A, -2 * c, 1 - al * A]; a = [1 + al / A, -2 * c, 1 - al / A]
    elif kind == "low": s = 2 * np.sqrt(A) * al; b = [A * ((A + 1) - (A - 1) * c + s), 2 * A * ((A - 1) - (A + 1) * c), A * ((A + 1) - (A - 1) * c - s)]; a = [(A + 1) + (A - 1) * c + s, -2 * ((A - 1) + (A + 1) * c), (A + 1) + (A - 1) * c - s]
    else: s = 2 * np.sqrt(A) * al; b = [A * ((A + 1) + (A - 1) * c + s), -2 * A * ((A - 1) + (A + 1) * c), A * ((A + 1) + (A - 1) * c - s)]; a = [(A + 1) - (A - 1) * c + s, 2 * ((A - 1) - (A + 1) * c), (A + 1) - (A - 1) * c - s]
    return lfilter(np.array(b) / a[0], np.array(a) / a[0], x)

def _master(x, sr, studio=True):
    """Voice-over production chain: trim, high-pass, warmth, presence, air, de-ess, compress, tiny room, level."""
    from scipy.signal import butter, sosfilt, fftconvolve
    a = np.abs(x); idx = np.where(a > .012)[0]
    if len(idx): x = x[max(0, idx[0] - int(.03 * sr)): idx[-1] + int(.12 * sr)]
    x = sosfilt(butter(2, 85, "hp", fs=sr, output="sos"), x)
    if studio:
        x = _biquad(x, sr, "low", 160, 2.5); x = _biquad(x, sr, "peak", 3200, 2.5, 1.0); x = _biquad(x, sr, "high", 9500, 1.5)
        sib = sosfilt(butter(2, [5500, 9000], "bp", fs=sr, output="sos"), x); env = np.convolve(np.abs(sib), np.ones(int(.004 * sr)) / int(.004 * sr), "same")
        red = np.where(env > .06, (.06 / np.maximum(env, 1e-6)) ** .6, 1.0); x = x - sib * (1 - np.convolve(red, np.ones(int(.004 * sr)) / int(.004 * sr), "same"))   # de-esser
    env = np.convolve(np.abs(x), np.ones(int(.025 * sr)) / int(.025 * sr), "same")
    gain = np.where(env > .16, (.16 / np.maximum(env, 1e-6)) ** .62, 1.0)
    x = x * np.convolve(gain, np.ones(int(.012 * sr)) / int(.012 * sr), "same")
    if studio:
        n = int(.22 * sr); ir = np.random.RandomState(2).randn(n) * np.exp(-np.arange(n) / (.055 * sr)); ir[0] = 0; wet = fftconvolve(x, ir / np.abs(ir).sum() * 2.2)[: len(x)]; x = x + .07 * wet
    f = int(.01 * sr); x[:f] *= np.linspace(0, 1, f); x[-f:] *= np.linspace(1, 0, f)
    return x.astype(np.float32)

def speak(text, voice_id=None):
    eng = _engine()
    if eng is None: return None
    text = respell(clean(text))
    if not text: return None
    os.makedirs(CACHE, exist_ok=True)
    f = os.path.join(CACHE, hashlib.sha1((eng + (V2 if eng == "kokoro" else "") + str(voice_id) + text).encode()).hexdigest() + ".npy")
    if os.path.exists(f): return np.load(f)
    try:
        if eng == "eleven": x, sr = _eleven(text, voice_id)
        elif eng == "kokoro": x, sr = _kokoro_expressive(text, voice_id); x = _master(x, sr)
        else: x, sr = _piper(text)
    except Exception as e: print("voice: skipped", repr(text)[:40], repr(e)[:60]); return None
    if sr != SR: x = resample_poly(x, SR, sr).astype(np.float32)
    x = x / max(1e-6, np.abs(x).max()) * .9
    np.save(f, x); return x


# ---------------------------------------------------------------- word timing (so captions and animations land exactly on the spoken words)
_WH = None
def _whisper():
    global _WH
    if _WH is None:
        from faster_whisper import WhisperModel
        _WH = WhisperModel("base.en", device="cpu", compute_type="int8")
    return _WH

def _norm(w):
    import re
    return re.sub(r"[^a-z0-9]", "", w.lower())

def word_times(text, voice_id=None):
    """[(script word, start s, end s)] for the clip speak(text, voice_id) returns, aligned by speech recognition. None if no voice engine."""
    import difflib, json, re
    x = speak(text, voice_id)
    if x is None: return None
    f = os.path.join(CACHE, hashlib.sha1(("wt" + _engine() + V2 + str(voice_id) + text).encode()).hexdigest() + ".json")
    if os.path.exists(f): return [tuple(t) for t in json.load(open(f))]
    from scipy.signal import resample_poly
    y = resample_poly(x, 160, 441).astype(np.float32)
    segs, _ = _whisper().transcribe(y, language="en", beam_size=1, word_timestamps=True)
    asr = [(_norm(w.word), w.start, w.end) for s in segs for w in s.words if _norm(w.word)]
    L = len(x) / SR; script = re.sub(r"\s+", " ", clean(text)).split(" "); A = [_norm(w) for w in script]; B = [a[0] for a in asr]
    times = [None] * len(script)
    for ia, ib, n in difflib.SequenceMatcher(None, A, B, autojunk=False).get_matching_blocks():
        for k in range(n): times[ia + k] = (asr[ib + k][1], asr[ib + k][2])
    # fill gaps by interpolating between known neighbours, weighted by word length
    i = 0
    while i < len(script):
        if times[i] is not None: i += 1; continue
        j = i
        while j < len(script) and times[j] is None: j += 1
        t0 = times[i - 1][1] if i > 0 else 0.0; t1 = times[j][0] if j < len(script) else L
        t1 = max(t1, t0 + .05 * (j - i)); wts = [max(2, len(script[k])) for k in range(i, j)]; tot = sum(wts); t = t0
        for k, wgt in zip(range(i, j), wts): times[k] = (t, t + (t1 - t0) * wgt / tot); t += (t1 - t0) * wgt / tot
        i = j
    out = [(script[k], float(times[k][0]), float(times[k][1])) for k in range(len(script))]
    json.dump(out, open(f, "w")); return out


# ---------------------------------------------------------------- intelligibility check (is it mumbled?)
def _wer(ref, hyp):
    r, h = ref, hyp; d = [[0] * (len(h) + 1) for _ in range(len(r) + 1)]
    for i in range(len(r) + 1): d[i][0] = i
    for j in range(len(h) + 1): d[0][j] = j
    for i in range(1, len(r) + 1):
        for j in range(1, len(h) + 1): d[i][j] = min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (r[i - 1] != h[j - 1]))
    return d[-1][-1] / max(1, len(r))

NUM = {"0": "zero", "1": "one"}
def intelligibility(text, voice_id=None):
    """Transcribe the generated line with speech recognition and compare to the script. Returns {wer, words_per_s, longest_pause}. A clear read comes back near 0 wer."""
    x = speak(text, voice_id)
    if x is None: return None
    from scipy.signal import resample_poly
    y = resample_poly(x, 160, 441).astype(np.float32)
    segs, _ = _whisper().transcribe(y, language="en", beam_size=5, word_timestamps=True)
    words = [w for s in segs for w in s.words]; hyp = [_norm(w.word) for w in words if _norm(w.word)]
    ref = [_norm(w) for w in clean(text).split() if _norm(w)]
    # compare as spoken: numerals in the script are written out already; drop punctuation-only tokens
    NW = set("zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty thirty forty fifty sixty seventy eighty ninety hundred thousand million billion trillion and point".split())
    isnum = lambda w: w.isdigit() or w in NW or any(c.isdigit() for c in w)
    nref = len(ref); ref = [w for w in ref if not isnum(w)]; hyp = [w for w in hyp if not isnum(w)]
    wer = _wer(ref, hyp); L = len(x) / SR
    gaps = [words[i + 1].start - words[i].end for i in range(len(words) - 1)] or [0]
    return {"wer": round(wer, 3), "words_per_s": round(nref / L, 2), "longest_pause": round(max(gaps), 2), "asr": " ".join(hyp)}
