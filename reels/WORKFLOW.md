# How a reel gets made and queued (keep this up to date)

1. **Pick the idea and grade it first.** Factors 0-10 in `src/grades.json` with a one-line reason: hook, button (comment bait), send (a specific person to forward it to), orig, reach. Score = 10 x (.20 hook + .20 button + .25 send + .15 orig + .20 reach) - 4, minus 15 if hook < 8, minus 10 if send < 8. Under 85 is not built and not queued.
2. **Check it is not a repeat.** Query the posted titles in `ig_reels` (status posted) and skip anything on the same fact within a few days.
3. **Build** a script in `src/scripts/bNN.py` with a `REELS = {name: fn}` dict. Engines already written: `motion.py` (Beat/Clean scenes), `sim.py` (ball physics with elastic ball-ball and wall collisions, `validate()`), `b61.py` (log-zoom world), `b69.py/b75.py` (days as a dot-shaped silhouette), `b70.py` (sky that runs a day), `b72.py` (candlelit table), `b73.py` (tree of lights), `b77.py` (flip counter), `b78.py` (compounding trees), `b79.py` (balls that are days).
4. **Preflight** (seconds, no render): `python3 src/preflight.py bNN name`. Checks length, layout overlap, physics, grade gate and writes a contact sheet. Fix everything it flags before rendering.
5. **Render** in the background: `python3 src/build.py bNN name --out <scratchpad>/out_prem`, then look at 4-6 frames of the finished mp4 and run `ffmpeg -af volumedetect` to confirm audio.
6. **Queue**: copy the mp4 into `reels/`, commit and push, check the raw URL returns 206, then insert a row in Supabase `ig_reels` (title, video_path, caption from `src/captions.py`, scheduled_at as ET converted to UTC, status queued). Captions have line breaks, one call to action and a hashtag block.
7. Slots: best first, about two hours apart so the feed is not one topic in a row.

## Added: delivery, beat, trial reels
- **Voice** (`src/voice.py`): sentence-by-sentence delivery with its own pace and real pauses (hook slow, punch lines slower, questions lift, reveals weighted), clause breaths in long sentences. Preflight transcribes every line with speech recognition and blocks a reel when words are lost (wer > 0.12) or the read is faster than 3.2 words/s.
- **Beat** (`src/reel.py`): `ON_BEAT = True`. Every shot is a whole number of beats and musical cues (notes, dings, pops, hits, whooshes) snap to the sixteenth-note grid. Sync cues that must match the picture exactly (clacks, heartbeats) are not snapped, and the heartbeat reel runs the music at 72 bpm so both agree.
- **Trial reels**: every video posts three times as an Instagram Trial Reel (non-followers first, graduated by hand in the app), each with a different cover: A stat, B question, C shock (`src/covers.py`). `ig_reels` has `trial`, `cover_url`, `variant`, `group_key`; the `post-reel` function passes `trial_params={"graduation_strategy":"MANUAL"}` and `cover_url`.

## Content rules (owner, Oct 22): relatable, no homework
- The audience is roughly 16-30. Never frame a reel around being 60 or "if your parent is 60". Open on something they have lived: moving out, a group chat, the last time they did X.
- No arithmetic on screen or in the voice ("10 x 20", "12 x 365 =", "here's the math"). State the number once, plainly, and move on. Do not prove it.
- Stay realistic: use a figure that is defensible, say "about", never stack assumptions.
- Every reel ends on one small thing they can do tonight, and one person to send it to.
- Check: could a 22-year-old say "that's me" in the first 3 seconds? If not, rewrite it.
