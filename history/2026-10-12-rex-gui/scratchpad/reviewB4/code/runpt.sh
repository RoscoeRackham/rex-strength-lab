#!/bin/bash
cd /tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/reviewB4/code
: > pt/results.txt
for id in $(cat pt/list.txt); do
  out=$(cd pt/$id && node test/powers.js --skip-off 2>&1)
  fails=$(echo "$out" | grep -c '^FAIL')
  tail=$(echo "$out" | tail -1)
  echo "$id fails=$fails $tail :: $(echo "$out" | grep '^FAIL' | cut -c1-160 | tr '\n' '|')" >> pt/results.txt
done
echo done >> pt/results.txt
