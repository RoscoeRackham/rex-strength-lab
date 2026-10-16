#!/bin/bash
# build each revert and run pull request 3's shots block (and powers.js for the engine one) against it
cd "$(dirname "$0")"
run() {
  n=$1
  d=$(python3 revert.py $n) || { echo "$n: BUILD FAILED"; return; }
  node ../block.js $d/test/shots.js $d > $n.block.log 2>&1
  if [ "$n" = bear-engine ]; then (cd $d && node test/powers.js --skip-off > ../../$n.powers.log 2>&1; echo "powers exit $?" >> ../../$n.powers.log); fi
  echo "$n: $(tail -1 $n.block.log)"
}
export -f run
printf "%s\n" "$@" | xargs -P 4 -I{} bash -c 'run {}'
