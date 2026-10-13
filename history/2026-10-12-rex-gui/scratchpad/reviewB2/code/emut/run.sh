#!/bin/sh
# run powers.js --skip-off against a mutant engine: copy lab test dir structure with engine replaced
S=/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/reviewB2/code
m=$1; d=$S/emut/w_$m; rm -rf $d; mkdir -p $d/src $d/test; cp $S/lab/src/data.js $d/src/; cp $S/emut/$m.js $d/src/engine.js; cp -r $S/lab/test/powers.js $S/lab/test/powers-off-cases.js $S/lab/test/fixtures $d/test/
out=$(cd $d && node test/powers.js --skip-off 2>&1)
fails=$(echo "$out" | grep -c '^FAIL')
echo "$m fails=$fails $(echo "$out" | grep '^FAIL' | cut -c1-160 | tr '\n' ' ')"
