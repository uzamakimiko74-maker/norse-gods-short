#!/bin/sh
# Builds hindu-gods-toon.mp4 from source: events → picture (30 fps) → score/effects/voice mix → master (−14 LUFS).
# Mastering uses plain ffmpeg: the library's mux.sh needs ffmpeg 7+, and this works on 6.x too.
set -e
LIB=${LIB:-/root/lemo-opuscar}
export LIB
HERE=$(cd "$(dirname "$0")" && pwd)
[ -f "$LIB/core/render/video.mjs" ] || { echo "set LIB to the Lemo-Opuscar library folder"; exit 1; }
cd "$LIB"
node core/render/events.mjs "$HERE" --size 1080x1920
node core/render/video.mjs "$HERE" --fps 30 --workers 4 --size 1080x1920 --out "$HERE/out/video.mp4"
"$LIB/.venv/bin/python" "$HERE/mix.py"
cd "$HERE/out"
J=$(ffmpeg -hide_banner -i mix.wav -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
g() { echo "$J" | python3 -c "import json,sys;print(json.load(sys.stdin)['$1'])"; }
ffmpeg -v error -y -i mix.wav -af "loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true,aresample=48000" -c:a pcm_s24le mix_norm.wav
ffmpeg -v error -y -i video.mp4 -i mix_norm.wav -map 0:v -map 1:a -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest -movflags +faststart "$HERE/hindu-gods-toon.mp4"
ffmpeg -v error -y -ss 41.2 -i "$HERE/hindu-gods-toon.mp4" -frames:v 1 "$HERE/poster.jpg"
ffmpeg -hide_banner -i "$HERE/hindu-gods-toon.mp4" -af ebur128 -f null - 2>&1 | grep -E "^\s+I:"
