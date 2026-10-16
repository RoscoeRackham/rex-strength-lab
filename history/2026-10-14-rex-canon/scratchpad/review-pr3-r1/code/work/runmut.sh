#!/bin/bash
W=/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr3-r1/code/work
cd $W
for m in "$@"; do
  node mutate.js $m > /dev/null || { echo "$m: mutate failed"; continue; }
  echo "=== $m"
  case $m in
    skipMig|mark2choice|catchDrag|oldChip|noCredit|defaultOff|catchMissOld|noBurnGuard) ;;
    *)
      (cd mut/rex-strength-lab && node test/powers.js --skip-off > $W/out-$m-powers.txt 2>&1; echo "powers exit $?"; grep -c '^FAIL' $W/out-$m-powers.txt; grep '^FAIL' $W/out-$m-powers.txt | cut -c1-200 | head -5)
      (cd mut/rex-strength-lab && node test/presence.js > $W/out-$m-presence.txt 2>&1; echo "presence exit $?"; grep -ic 'FAIL' $W/out-$m-presence.txt; grep -i 'FAIL' $W/out-$m-presence.txt | cut -c1-200 | head -5)
      ;;
  esac
  node pr3check.js mut/rex-strength-lab/dist/index.html > $W/out-$m-page.txt 2>&1; echo "page exit $?"; grep PROBLEM $W/out-$m-page.txt | cut -c1-200 | head -6
done
node mutate.js orig > /dev/null
echo ALLDONE
