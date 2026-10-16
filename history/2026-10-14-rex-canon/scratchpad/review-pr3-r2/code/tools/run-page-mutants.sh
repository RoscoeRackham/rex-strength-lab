#!/bin/bash
LAB=/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr3-r2/code/mut/rex-strength-lab
cd $LAB
for m in $@; do
  python3 /tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr3-r2/code/tools/mutate.py $LAB $m > /dev/null || { echo "$m APPLYFAIL"; continue; }
  python3 build-data.py > /dev/null 2>&1 && node build.js > /dev/null 2>&1 || { echo "$m BUILDFAIL"; continue; }
  out=$(node /tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr3-r2/code/tools/pr3harness.js $LAB 2>&1)
  if echo "$out" | grep -q "HARNESS ALL OK"; then echo "$m SURVIVES-PAGE"; else echo "$m KILLED-PAGE: $(echo "$out" | grep PROBLEM | cut -c1-160 | tr '\n' '|')"; fi
done
git checkout -q -- src dist; python3 build-data.py >/dev/null 2>&1; git status --short
