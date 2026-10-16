#!/bin/bash
# the build's six mutants on the fixed tree: powers.js --skip-off, presence.js and pull request 3's shots block
cd "$(dirname "$0")"
run() {
  n=$1
  d=$(python3 revert.py $n) || { echo "$n: BUILD FAILED"; return; }
  (cd $d && node test/powers.js --skip-off > /dev/null 2>&1; echo -n "powers exit $? ") > $n.res
  (cd $d && node test/presence.js > /dev/null 2>&1; echo -n "presence exit $? ") >> $n.res
  node ../block.js $d/test/shots.js $d > $n.block.log 2>&1
  echo "$n: $(cat $n.res) block: $(tail -1 $n.block.log)"
}
export -f run
printf "%s\n" "$@" | xargs -P 3 -I{} bash -c 'run {}'
