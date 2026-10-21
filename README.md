# sorry-posts

Content for @sorryjustseeingthis.

- `tweet_*.jpg` – the 1080x1350 tweet-style image posts.
- `reels/NNN_*.mp4` – Reels (1080x1920, 30fps, with music + sound effects baked in). `001`–`100` are the newer set; the older files without numbers (`r_gym.mp4`, `carguys_sfx.mp4`, …) are the first batch.
- `reels/INDEX.md` – one entry per numbered reel: length, music style, a suggested caption, and a one-line summary of what happens.
- `reels/src/` – the code that makes the numbered reels. Nothing is recorded or sampled: characters, props, phone screens, music and sound effects are all drawn/synthesized in Python, so a reel can be edited and re-rendered.

## Re-render or edit a reel

```
pip install pillow numpy scipy      # also needs ffmpeg on PATH
cd reels/src
python3 build.py b03 bmw_guys --out ..      # render one reel
python3 build.py b03 --preview              # contact sheet of every reel in a batch -> scratch folder
python3 -c "import build; build.make_index()"   # rebuild reels/INDEX.md
```

Each batch lives in `reels/src/scripts/bNN.py`. A reel is a list of shots (`beat(...)` for a scene, `PhoneShot` for a phone screen, `KineticShot` for big text). Change the text, timing, props or music style in the script and re-render.
