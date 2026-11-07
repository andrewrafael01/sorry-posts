#!/bin/bash
# sequential render queue with a quality gate: renders each reel, cuts a contact sheet for review, does NOT ship (shipping is done after a human-quality look)
cd /home/user/sorry-posts/reels/w3d
S=/tmp/claude-0/-home-user-sorry-posts/aeda3cd8-6be4-5731-8b3d-d9639f60d4f0/scratchpad
while pgrep -f "queue2.sh|queue3.sh|render.js" >/dev/null; do sleep 20; done
mkdir -p $S/review
for pair in "$@"; do r=${pair%%:*}; k=${pair##*:}
  [ -f $S/out_v/$k.mp4 ] && continue
  node render.js $r $S/t3/$k.json $S/out_v/$k.mp4 30 3 2>&1 | tail -2
  D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 $S/out_v/$k.mp4)
  ffmpeg -loglevel error -y -i $S/out_v/$k.mp4 -vf "fps=10/$D,scale=270:-1,tile=5x2" -frames:v 1 $S/review/$k.png
  touch $S/review/$k.ready
done
echo QUEUE_DONE
