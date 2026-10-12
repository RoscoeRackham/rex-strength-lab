#!/bin/bash
# usage: mutate.sh name 'perl substitution'
name=$1; sub=$2
cp engine.orig.js src/engine.js
perl -0pi -e "$sub" src/engine.js
if cmp -s engine.orig.js src/engine.js; then echo "$name: SUBSTITUTION DID NOT APPLY"; exit; fi
node test/presence.js > out_$name.txt 2>&1
echo "$name: $(tail -1 out_$name.txt)"
