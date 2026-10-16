#!/bin/sh
cd "$1" || exit 1
for t in "python3 build-data.py" "node build.js" "node test/calibration.js" "node test/presence.js" "node test/shots.js" "node test/powers.js" "node test/ladder.js" "node test/sweep.js"; do
  s=$(date +%s); sh -c "$t" > "$2/$(echo $t | tr ' /' '__').log" 2>&1; rc=$?; e=$(date +%s)
  echo "$t: exit $rc, $((e-s)) s, load $(cut -d' ' -f1-3 /proc/loadavg) | $(tail -2 "$2/$(echo $t | tr ' /' '__').log" | tr '\n' ' ' | cut -c1-200)" >> "$2/summary.txt"
done
echo DONE >> "$2/summary.txt"
