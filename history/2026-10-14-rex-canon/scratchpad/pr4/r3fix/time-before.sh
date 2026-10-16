#!/bin/bash
# Times shots.js on the f25f9b4 copy, one run at a time: --pr4, then the full file.
S=/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/pr4/r3fix
cd $S/before/rex-strength-lab
t0=$(date +%s); node test/shots.js --pr4 > $S/logs/before-pr4.log 2>&1; e=$?; t1=$(date +%s)
echo "before --pr4 exit $e elapsed $((t1-t0)) s" >> $S/logs/times.log
t0=$(date +%s); node test/shots.js > $S/logs/before-full.log 2>&1; e=$?; t1=$(date +%s)
echo "before full exit $e elapsed $((t1-t0)) s" >> $S/logs/times.log
