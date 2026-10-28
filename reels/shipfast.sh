#!/bin/bash
# usage: ./shipfast.sh <out_dir> <t1> <t2> <t3> key [key...]
# Copies each lean-rendered <out_dir>/<key>.mp4 to reels/<key>_f1.mp4, cuts covers A/B/C from frames at t1/t2/t3, commits, pushes, and waits until the raw URLs answer 206.
set -e; cd "$(dirname "$0")"; O=$1; shift; T1=$1; T2=$2; T3=$3; shift 3
B=https://raw.githubusercontent.com/andrewrafael01/sorry-posts/claude/100-credits-usage-9ysxsh/reels
for k in "$@"; do
  cp "$O/$k.mp4" "${k}_f1.mp4"; i=A
  for t in $T1 $T2 $T3; do nice ffmpeg -y -loglevel error -ss $t -i "${k}_f1.mp4" -frames:v 1 -q:v 2 "covers/${k}_$i.jpg"; i=$(echo $i | tr ABC BCD); done
  ls -l "${k}_f1.mp4" | awk '{printf "%s MB %s\n", int($5/1048576), $9}'
done
git add -A . && git commit -qm "Ship: $*" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01WwchNcrRGa913zNUDNyJ1A" && git push -q -u origin claude/100-credits-usage-9ysxsh 2>&1 | tail -1
for k in "$@"; do for n in $(seq 1 9); do a=$(curl -s -o /dev/null -w "%{http_code}" -r 0-10 $B/${k}_f1.mp4); b=$(curl -s -o /dev/null -w "%{http_code}" -r 0-10 $B/covers/${k}_C.jpg); [ "$a$b" = "206206" ] && break; sleep 15; done; echo "$k $a $b"; done
