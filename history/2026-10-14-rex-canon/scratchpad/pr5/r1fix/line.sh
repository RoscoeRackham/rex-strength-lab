#!/bin/bash
# the full Rex lab test line, one test at a time, each timed (review round 1 of pull request 5)
cd /home/user/rex-strength-lab/rex-strength-lab || exit 1
OUT=/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/pr5/r1fix/line
mkdir -p $OUT
run() { local name=$1; shift; local s=$(date +%s); "$@" > $OUT/$name.log 2>&1; local e=$?; echo "$name exit=$e $(( $(date +%s) - s )) s" >> $OUT/times.txt; return $e; }
: > $OUT/times.txt
run build-data python3 build-data.py && run build node build.js && run calibration node test/calibration.js && run presence node test/presence.js && run shots node test/shots.js && run powers node test/powers.js && run ladder node test/ladder.js && run sweep node test/sweep.js
echo "LINE exit=$?" >> $OUT/times.txt
