#!/bin/sh
# normalize audio of every mp4 to -14 LUFS / -1.5 dBTP, 48 kHz AAC; video stream copied
for f in "$@"; do
  ffmpeg -v error -y -i "$f" -c:v copy -af loudnorm=I=-14:TP=-1.5:LRA=11 -ar 48000 -c:a aac -b:a 192k -movflags +faststart "${f%.mp4}.norm.mp4" && mv "${f%.mp4}.norm.mp4" "$f"
done
