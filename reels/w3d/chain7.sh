#!/bin/bash
cd /home/user/sorry-posts/reels/w3d
S=/tmp/claude-0/-home-user-sorry-posts/aeda3cd8-6be4-5731-8b3d-d9639f60d4f0/scratchpad
for pair in jerk:593_whatif_jerk_doubling shits:591_whatif_everyone_shits fartdb:597_whatif_fart_doubling turd:599_whatif_giant_turd held:598_whatif_hold_in_farts sex:600_whatif_everyone_has_sex drinks:601_whatif_drinks_double lies:602_whatif_fart_when_you_lie flush:587_whatif_everyone_flushes pool:592_whatif_piss_a_pool treadmill:588_whatif_treadmill scream:589_whatif_everyone_screams hippos:594_whatif_keep_every_shit blink:595_whatif_fart_every_blink puke:596_whatif_everyone_pukes punches:590_whatif_everyone_punches_you; do
  r=${pair%%:*}; k=${pair##*:}_v3
  if [ -f $S/out_v/${k}_done ]; then continue; fi
  node render.js $r $S/t3/$k.json $S/out_v/$k.mp4 30 3 2>&1 | tail -2
  ../shipfast.sh $S/out_v 6 14 24 $k 2>&1 | tail -2 && touch $S/out_v/${k}_done
done
echo CHAIN7_DONE
