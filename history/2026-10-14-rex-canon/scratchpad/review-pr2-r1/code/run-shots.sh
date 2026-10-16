#!/bin/bash
# run-shots.sh <mutant>... : build each mutant's page and run the full test/shots.js on it
S=/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr2-r1/code
for m in "$@"; do
  d=$S/mut/$m/rex-strength-lab
  [ -d $d ] || (cd $S && node mutate.js $m > /dev/null)
  (cd $d && node build.js > /dev/null && timeout 1500 node test/shots.js > $S/mut/$m/shots.txt 2>&1); rc=$?
  echo "$m: shots exit $rc; $(grep -c '^PROBLEM' $S/mut/$m/shots.txt) PROBLEM; $(grep '^PROBLEM' $S/mut/$m/shots.txt | cut -c1-160 | head -3 | tr '\n' '|')"
done
