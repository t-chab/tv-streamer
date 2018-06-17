#!/usr/bin/env sh

if [ -z "$1" ]; 
then
    echo "Pass a file or an url as first argument !"
    exit 1
fi

url="${1}"

user_agent="VLC/2.2.2 LibVLC/2.2.2"
idr_interval="60"
resolution="1280x720"
fps="30"
bitrate="1.5M"
profile="high"
scale_alg="lanczos"
hls_list_size="6"

ffmpeg -re -user_agent "${user_agent}" -i "${url}" -c:v libx264 -x264opts keyint="${idr_interval}":no-scenecut -s "${resolution}" -r "${fps}" -b:v "${bitrate}" -profile:v "${profile}" -c:a aac -sws_flags "${scale_alg}" -hls_list_size "${hls_list_size}" stream.m3u8


