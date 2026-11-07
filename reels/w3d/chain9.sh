#!/bin/bash
cd /home/user/sorry-posts/reels/w3d
S=/tmp/claude-0/-home-user-sorry-posts/aeda3cd8-6be4-5731-8b3d-d9639f60d4f0/scratchpad
while pgrep -f chain8.sh >/dev/null; do sleep 20; done
k=593_whatif_jerk_doubling_v4
[ -f $S/out_v/${k}_done ] || { node render.js jerk $S/t3/$k.json $S/out_v/$k.mp4 30 3 2>&1 | tail -2; ../shipfast.sh $S/out_v 6 14 24 $k 2>&1 | tail -2 && touch $S/out_v/${k}_done; }
echo CHAIN9_DONE
