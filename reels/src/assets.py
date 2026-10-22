"""Fetch real, reusable media. Sources that need no key: Wikipedia/Wikimedia (images, license read per file), NASA image and video library (public domain), Internet Archive.
Everything is cached in assets/ with a credits.json so captions can credit the photographers."""
import os, json, re, time, hashlib, urllib.request, urllib.parse

HERE = os.path.dirname(__file__); DIR = os.path.join(HERE, "assets"); os.makedirs(DIR, exist_ok=True)
UA = "SorryPostsBot/1.0 (andrewrafaelsaid01@gmail.com)"
CRED = os.path.join(DIR, "credits.json")
OK_LIC = re.compile(r"^(public domain|cc0|cc[- ]by(-sa)?[- ]\d|cc[- ]by(-sa)?|pd|attribution|gfdl)", re.I)
_last = [0.0]

def _get(url, binary=False, tries=6):
    for k in range(tries):
        wait = .6 - (time.time() - _last[0])
        if wait > 0: time.sleep(wait)
        _last[0] = time.time()
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            data = urllib.request.urlopen(req, timeout=90).read()
            return data if binary else data.decode("utf-8", "replace")
        except Exception as e:
            if k == tries - 1: raise
            time.sleep(25 + 35 * k if '429' in str(e) else 4 + 6 * k)

def _credits():
    return json.load(open(CRED)) if os.path.exists(CRED) else {}
def _save_credit(path, info):
    c = _credits(); c[os.path.basename(path)] = info; json.dump(c, open(CRED, "w"), indent=1)

def _dl(url, ext):
    path = os.path.join(DIR, hashlib.sha1(url.encode()).hexdigest()[:16] + ext)
    if not os.path.exists(path):
        time.sleep(3.0); open(path, "wb").write(_get(url, binary=True))
    return path

def wiki_images(title, n=4, min_w=800, skip=("icon", "logo", "flag", "map", "symbol", "commons-logo", "wiki", "signature", "stub", "question", "ambox", "edit-", "padlock", "disambig", ".svg", "diagram", "chart")):
    """Lead and article images of a Wikipedia page, license-checked. Returns [(local path, credit string)]."""
    q = "https://en.wikipedia.org/w/api.php?" + urllib.parse.urlencode(dict(action="query", titles=title, prop="images", imlimit=60, format="json", redirects=1))
    pg = list(json.loads(_get(q))["query"]["pages"].values())[0]
    files = [i["title"] for i in pg.get("images", []) if i["title"].lower().endswith((".jpg", ".jpeg", ".png"))
             and not any(s in i["title"].lower() for s in skip)]
    # lead image first
    lead = json.loads(_get("https://en.wikipedia.org/w/api.php?" + urllib.parse.urlencode(dict(action="query", titles=title, prop="pageimages", piprop="name", format="json", redirects=1))))
    ln = list(lead["query"]["pages"].values())[0].get("pageimage")
    if ln and ("File:" + ln.replace("_", " ")) in files: files.remove("File:" + ln.replace("_", " ")); files.insert(0, "File:" + ln.replace("_", " "))
    elif ln: files.insert(0, "File:" + ln.replace("_", " "))
    out = []
    for i in range(0, len(files), 8):
        if len(out) >= n: break
        q = "https://en.wikipedia.org/w/api.php?" + urllib.parse.urlencode(dict(action="query", titles="|".join(files[i:i + 8]), prop="imageinfo", iiprop="url|extmetadata|size", iiurlwidth=1280, format="json"))
        for p in json.loads(_get(q))["query"]["pages"].values():
            ii = (p.get("imageinfo") or [{}])[0]; md = ii.get("extmetadata", {}); lic = (md.get("LicenseShortName", {}) or {}).get("value", "")
            if not ii or not OK_LIC.match(lic.strip()) or ii.get("width", 0) < min_w: continue
            art = re.sub(r"<[^>]+>", "", (md.get("Artist", {}) or {}).get("value", "") or "").strip()[:60] or "Wikimedia Commons"
            path = _dl(ii.get("thumburl") or ii["url"], ".jpg"); cr = f"{art} / {lic}"
            _save_credit(path, dict(source="wikimedia", title=p["title"], credit=cr)); out.append((path, cr))
            if len(out) >= n: break
    return out

def nasa(query, kind="video", n=2, pick=None):
    """NASA image/video library (public domain). Returns [(local path, credit)]."""
    q = "https://images-api.nasa.gov/search?" + urllib.parse.urlencode(dict(q=query, media_type=kind))
    items = json.loads(_get(q))["collection"]["items"][:12]; out = []
    for it in items:
        nid = it["data"][0]["nasa_id"]
        try: assets = json.loads(_get("https://images-api.nasa.gov/asset/" + urllib.parse.quote(nid)))["collection"]["items"]
        except Exception: continue
        urls = [a["href"] for a in assets]
        if kind == "video":
            cand = [u for u in urls if u.endswith(".mp4") and ("medium" in u or "mobile" in u or "small" in u)] or [u for u in urls if u.endswith(".mp4")]
            if not cand: continue
            u = sorted(cand, key=lambda x: ("medium" not in x, "small" not in x))[0]; ext = ".mp4"
        else:
            cand = [u for u in urls if u.lower().endswith((".jpg", ".jpeg"))]
            if not cand: continue
            u = [x for x in cand if "large" in x or "medium" in x][0] if any(("large" in x or "medium" in x) for x in cand) else cand[0]; ext = ".jpg"
        path = _dl(u.replace(" ", "%20"), ext); cr = "NASA / public domain"
        _save_credit(path, dict(source="nasa", title=it["data"][0].get("title", nid), credit=cr)); out.append((path, cr))
        if len(out) >= n: break
    return out
