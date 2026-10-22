# How a reel gets made and queued (keep this up to date)

1. **Pick the idea and grade it first.** Factors 0-10 in `src/grades.json` with a one-line reason: hook, button (comment bait), send (a specific person to forward it to), orig, reach. Score = 10 x (.20 hook + .20 button + .25 send + .15 orig + .20 reach) - 4, minus 15 if hook < 8, minus 10 if send < 8. Under 85 is not built and not queued.
2. **Check it is not a repeat.** Query the posted titles in `ig_reels` (status posted) and skip anything on the same fact within a few days.
3. **Build** a script in `src/scripts/bNN.py` with a `REELS = {name: fn}` dict. Engines already written: `motion.py` (Beat/Clean scenes), `sim.py` (ball physics with elastic ball-ball and wall collisions, `validate()`), `b61.py` (log-zoom world), `b69.py/b75.py` (days as a dot-shaped silhouette), `b70.py` (sky that runs a day), `b72.py` (candlelit table), `b73.py` (tree of lights), `b77.py` (flip counter), `b78.py` (compounding trees), `b79.py` (balls that are days).
4. **Preflight** (seconds, no render): `python3 src/preflight.py bNN name`. Checks length, layout overlap, physics, grade gate and writes a contact sheet. Fix everything it flags before rendering.
5. **Render** in the background: `python3 src/build.py bNN name --out <scratchpad>/out_prem`, then look at 4-6 frames of the finished mp4 and run `ffmpeg -af volumedetect` to confirm audio.
6. **Queue**: copy the mp4 into `reels/`, commit and push, check the raw URL returns 206, then insert a row in Supabase `ig_reels` (title, video_path, caption from `src/captions.py`, scheduled_at as ET converted to UTC, status queued). Captions have line breaks, one call to action and a hashtag block.
7. Slots: best first, about two hours apart so the feed is not one topic in a row.
