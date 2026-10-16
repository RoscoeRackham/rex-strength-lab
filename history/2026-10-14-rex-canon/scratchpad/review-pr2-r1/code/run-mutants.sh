#!/bin/bash
S=/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr2-r1/code
cd $S
for m in "$@"; do
  node mutate.js $m > /dev/null || { echo "$m: MAKE FAILED"; continue; }
  out=$S/mut/$m/powers.txt
  (cd $S/mut/$m/rex-strength-lab && timeout 600 node test/powers.js --skip-off > $out 2>&1)
  nf=$(grep -c '^FAIL' $out); last=$(tail -1 $out)
  echo "$m: $nf FAIL; $last; $(grep '^FAIL' $out | cut -c1-110 | head -3 | tr '\n' '|')"
done
