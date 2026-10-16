#!/bin/bash
LAB=/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr3-r2/code/mut/rex-strength-lab
cd $LAB
for m in $@; do
  python3 /tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr3-r2/code/tools/mutate.py $LAB $m > /dev/null || { echo "$m APPLYFAIL"; continue; }
  p=$(node test/powers.js --skip-off 2>&1); pf=$(echo "$p" | grep -E "^(FAIL|not ok|✗)|FAIL" | cut -c1-150 | tr '\n' '|'); pl=$(echo "$p" | tail -1)
  q=$(node test/presence.js 2>&1); qf=$(echo "$q" | grep -iE "^FAIL|fail " | cut -c1-150 | tr '\n' '|'); ql=$(echo "$q" | tail -1)
  echo "$m | powers: $pl $pf | presence: $ql $qf"
done
git checkout -q -- src
