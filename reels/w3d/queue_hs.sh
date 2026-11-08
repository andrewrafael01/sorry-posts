#!/bin/bash
# local re-render of the short re-voiced reels into out_hs (does not touch out_v)
cd /home/user/sorry-posts/reels/w3d
S=/tmp/claude-0/-home-user-sorry-posts/aeda3cd8-6be4-5731-8b3d-d9639f60d4f0/scratchpad
mkdir -p $S/out_hs $S/review_hs
for pair in "$@"; do r=${pair%%:*}; k=${pair##*:}
  [ -f $S/out_hs/$k.mp4 ] && continue
  node render.js $r tl/$k.json $S/out_hs/$k.mp4 30 3 2>&1 | tail -1
  D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 $S/out_hs/$k.mp4)
  ffmpeg -loglevel error -y -i $S/out_hs/$k.mp4 -vf "fps=10/$D,scale=270:-1,tile=5x2" -frames:v 1 $S/review_hs/$k.png
done
echo DONE_HS
