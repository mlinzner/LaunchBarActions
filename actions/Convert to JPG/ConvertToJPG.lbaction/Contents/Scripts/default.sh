#!/bin/sh
#
# LaunchBar Action Script
#

for ARG in "$@"; do
    filename=$(basename  "$ARG")
    extension="${filename##*.}"
    output="${ARG/%$extension/jpg}"

    /usr/local/bin/magick convert "$ARG" "$output"
    echo $output
done
