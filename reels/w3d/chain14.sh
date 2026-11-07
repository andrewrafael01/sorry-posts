#!/bin/bash
# generic: ./chain11.sh reel key   (waits for other chains, renders, ships)
cd /home/user/sorry-posts/reels/w3d
S=/tmp/claude-0/-home-user-sorry-posts/aeda3cd8-6be4-5731-8b3d-d9639f60d4f0/scratchpad
while pgrep -f "chain9.sh|chain10.sh|chain8.sh|render.js|chain11.sh|chain12.sh|chain13.sh" >/dev/null; do sleep 30; done
for pair in "$@"; do r=${pair%%:*}; k=${pair##*:}
  [ -f $S/out_v/${k}_done ] && continue
  node render.js $r $S/t3/$k.json $S/out_v/$k.mp4 30 3 2>&1 | tail -2
  ../shipfast.sh $S/out_v 6 14 24 $k 2>&1 | tail -2 && touch $S/out_v/${k}_done
done
echo CHAIN11_DONE
