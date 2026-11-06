#!/bin/bash
cd /home/user/sorry-posts/reels/w3d
S=/tmp/claude-0/-home-user-sorry-posts/aeda3cd8-6be4-5731-8b3d-d9639f60d4f0/scratchpad
for pair in flush:587_whatif_everyone_flushes_v2 pool:592_whatif_piss_a_pool_v2 treadmill:588_whatif_treadmill_v2 scream:589_whatif_everyone_screams_v2 shits:591_whatif_everyone_shits_v3 hippos:594_whatif_keep_every_shit_v2 blink:595_whatif_fart_every_blink_v2 puke:596_whatif_everyone_pukes_v2 punches:590_whatif_everyone_punches_you_v2; do
  r=${pair%%:*}; k=${pair##*:}
  node render.js $r $S/t3/$k.json $S/out_v/$k.mp4 30 3 2>&1 | tail -2
  ../shipfast.sh $S/out_v 6 14 24 $k 2>&1 | tail -2
done
echo CHAIN3_DONE
