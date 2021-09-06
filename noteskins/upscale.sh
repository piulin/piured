#!/bin/bash


for d in */ ; do
    cd $d
    echo "$d"
    mkdir UHD
    waifu2x-converter-cpp --scale-ratio 2 --noise-level 0 -i HD -o UHD/ -a 0
    cd UHD
    find . -type f -name '*.png' -exec sh -c 'x="{}"; mv "$x" "${x%.*}.PNG"' \;
    cd ../..
done
