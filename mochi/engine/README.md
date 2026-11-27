# Mochi & Toast engine

Original art engine for @mochaandtoastworld (Mochi = lavender cat, Toast = butter tabby with cowlick).
Flat colors, hand-drawn ink outlines, Gaegu handwriting font, white backgrounds.

## Setup (fresh session)
Fonts are expected at /tmp/claude-0/fonts/gf/ofl/ (see FONTS in soft.py):

    mkdir -p /tmp/claude-0/fonts && cd /tmp/claude-0/fonts
    git clone --depth 1 --filter=blob:none --sparse https://github.com/google/fonts gf
    cd gf && git sparse-checkout set ofl/gaegu ofl/patrickhand ofl/shortstack ofl/gloriahallelujah ofl/sniglet

Python deps: pillow, numpy, opencv-python. Video: ffmpeg.

## Files
- soft.py      core drawing: cat(who,pose,mood,...), props (heart, cookie, mug, flower, sparkle, cloud, bubble, rect_prop), text()
- scenes.py    scene spec language shared by carousels and reels (see docstring), e.g. "hug:love,love|hearts"
- content.py   REELS and CAROUSELS scripts (text, scene spec, sub) + holiday date pins
- mcar.py      render carousels  -> /tmp/claude-0/cats/mochi/carousels/<name>/NN.jpg
- mreel.py     render reels      -> /tmp/claude-0/cats/mochi/reels/NN_<name>.mp4 (+ covers/)
- film.py / film2.py  mini-movie episodes (room/outdoor sets, timestamps, camera moves)
- mqueue.py    builds the queue SQL (older; schedule was later moved to 1pm ET reels / 7:30pm ET carousels)

## Posting pipeline
Supabase project ig-poster, table public.ig_carousels (kind carousel|reel, image_urls / video_url / cover_url,
caption, scheduled_at, status draft|queued|processing|posted|failed, stats jsonb).
Edge function post-carousel posts as IG_ACCESS_TOKEN_MOCHI, 3h min gap, retries IG blocks +6h.
Edge function mochi-insights (daily cron) fills stats (views, reach, shares, saved, sends_per_1k_reach).
Media is served from raw.githubusercontent.com/andrewrafael01/sorry-posts/main/mochi/...

## v2 (Nov 15)
- props2.py: box, door, cushion, bowl, window, snowflake, nightcap/santa hat, lit phone
- scenes.py: new kinds mbox/tbox, mdoor/tdoor, seat/tseat, mthink/tthink, mwin/twin, tbowl, mpl/tpl; '+cap' / '+santa' hats; '|bang' (!!)
- content_v2.py: v2 reel scripts (every beat acts out its line) + CAR_PATCH for carousel slides
- mreel.py auto-fits tall scenes below the text; cry trembles, love bounces, last beat slow push-in
- normalize.sh: loudness to -14 LUFS after rendering (run on every new mp4)
- audit.py A|B: contact sheets of every beat for visual QA

## Style rules that work
- Speak to the viewer ("you"), one feeling per beat, small joke in a grey sub line ("(he ate it)")
- First frame: text + cats fully visible (hook in <0.5s); reels ~12-16s
- End every reel with a "send this to ..." line (sends per reach is a top ranking signal)
- Max 5 hashtags; keyword-led caption

## v6 additions (Nov 26)
- `content_v6.py` + `mreel_m.py`: message Reels (files `4NN_m_<name>.mp4`, NN = index + 1). `python3 mreel_m.py <index or name>`.
- `endcard.py`: overlays "follow for a new one every day" above the headline for the last 1.6 s. No added length.
  Run it on every new non-series, non-film Reel before pushing: `cd mochi/reels && python3 ../engine/endcard.py <files>`.
  It records finished files in `endcard_done.txt` next to the script and skips them on later runs.
- `stickers.py`: 40 transparent looping GIF stickers + PNGs (480x480, white die-cut outline) in `mochi/stickers/`, for GIPHY and messaging apps.
- Posting: 6 a day from Dec 1 (9:30, 12:00, 14:30, 17:00, 19:30, 22:00 ET), poster minimum gap 2 h.
