#!/bin/bash
# The full Rex lab test line, one test at a time, each timed.
S=/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/pr4/r3fix
cd /home/user/rex-strength-lab/rex-strength-lab
: > $S/line/status.log
run() { name=$1; shift; t0=$(date +%s); "$@" > $S/line/$name.log 2>&1; e=$?; t1=$(date +%s); echo "$name exit $e elapsed $((t1-t0)) s" >> $S/line/status.log; }
run 0-data python3 build-data.py
run 0-build node build.js
run 1-calibration node test/calibration.js
run 2-presence node test/presence.js
run 3-shots node test/shots.js
run 4-powers node test/powers.js
run 5-ladder node test/ladder.js
run 6-sweep node test/sweep.js
echo line-done >> $S/line/status.log
