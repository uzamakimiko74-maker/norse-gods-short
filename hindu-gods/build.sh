#!/bin/sh
# Builds hindu-gods.mp4 from source: events → picture → score/foley/voice mix → master.
# Mastering is done here with plain ffmpeg (the library's mux.sh needs ffmpeg 7+): two-pass loudnorm to −14 LUFS,
# a 1.6 s hold on the last plate so the closing question can be read, then a two-pass ~3.8 Mbit/s encode (< 100 MB for GitHub).
set -e
LIB=${LIB:-/root/lemo-opuscar}
export LIB
HERE=$(cd "$(dirname "$0")" && pwd)
[ -f "$LIB/core/render/video.mjs" ] || { echo "set LIB to the Lemo-Opuscar library folder"; exit 1; }
cd "$LIB"
node core/render/events.mjs "$HERE" --size 1080x1920
node core/render/video.mjs "$HERE" --fps 24 --workers 4 --size 1080x1920 --out "$HERE/out/video.mp4"
"$LIB/.venv/bin/python" "$HERE/mix.py"
cd "$HERE/out"
HOLD=1.6
ffmpeg -v error -y -i mix.wav -af "apad=pad_dur=$HOLD" mix_hold.wav
J=$(ffmpeg -hide_banner -i mix_hold.wav -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
g() { echo "$J" | python3 -c "import json,sys;print(json.load(sys.stdin)['$1'])"; }
ffmpeg -v error -y -i mix_hold.wav -af "loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true,aresample=48000" -c:a pcm_s24le mix_norm.wav
VF="tpad=stop_mode=clone:stop_duration=$HOLD"
ffmpeg -v error -y -i video.mp4 -vf "$VF" -c:v libx264 -preset slow -b:v 3800k -tune grain -pass 1 -passlogfile x264 -an -f null /dev/null
ffmpeg -v error -y -i video.mp4 -i mix_norm.wav -map 0:v -map 1:a -vf "$VF" -c:v libx264 -preset slow -b:v 3800k -tune grain -pass 2 -passlogfile x264 \
  -pix_fmt yuv420p -c:a aac -b:a 192k -shortest -movflags +faststart "$HERE/hindu-gods.mp4"
ffmpeg -v error -y -ss 64 -i "$HERE/hindu-gods.mp4" -frames:v 1 "$HERE/poster.jpg"
ffmpeg -hide_banner -i "$HERE/hindu-gods.mp4" -af ebur128 -f null - 2>&1 | grep -E "^\s+I:"
