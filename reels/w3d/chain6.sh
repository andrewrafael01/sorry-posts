#!/bin/bash
cd /home/user/sorry-posts/reels/w3d
S=/tmp/claude-0/-home-user-sorry-posts/aeda3cd8-6be4-5731-8b3d-d9639f60d4f0/scratchpad
until grep -q CHAIN5_DONE $S/chain5.log; do sleep 30; done
for pair in lies:602_whatif_fart_when_you_lie sex:600_whatif_everyone_has_sex drinks:601_whatif_drinks_double; do
  r=${pair%%:*}; k=${pair##*:}_v3
  node render.js $r $S/t3/$k.json $S/out_v/$k.mp4 30 3 2>&1 | tail -2
  ../shipfast.sh $S/out_v 6 14 24 $k 2>&1 | tail -2
done
echo CHAIN6_DONE
