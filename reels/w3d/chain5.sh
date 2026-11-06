#!/bin/bash
cd /home/user/sorry-posts/reels/w3d
S=/tmp/claude-0/-home-user-sorry-posts/aeda3cd8-6be4-5731-8b3d-d9639f60d4f0/scratchpad
until grep -q CHAIN4_DONE $S/chain4.log; do sleep 30; done
for pair in fartdb:597_whatif_fart_doubling held:598_whatif_hold_in_farts turd:599_whatif_giant_turd; do
  r=${pair%%:*}; k=${pair##*:}_v3
  node render.js $r $S/t3/$k.json $S/out_v/$k.mp4 30 3 2>&1 | tail -2
  ../shipfast.sh $S/out_v 6 14 24 $k 2>&1 | tail -2
done
echo CHAIN5_DONE
