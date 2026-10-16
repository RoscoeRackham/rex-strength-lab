#!/bin/bash
# build each revert and run pull request 3's shots block against it; for engine reverts also powers.js --skip-off, and
# for the build's mutants presence.js too. One line per revert: name, then each test's result.
cd "$(dirname "$0")"
run() {
  n=$1
  d=$(python3 revert.py $n 2>/dev/null) || { echo "$n: BUILD FAILED"; return; }
  node ../block.js $d/test/shots.js $d > $n.block.log 2>&1
  res="block: $(tail -1 $n.block.log)"
  if grep -q "src/engine.js" <(python3 -c "import revert; print([f for f,_,_ in revert.REV['$n']])"); then
    (cd $d && node test/powers.js --skip-off > ../../$n.powers.log 2>&1; echo "exit $?" >> ../../$n.powers.log)
    res="$res; powers: $(grep -c '^FAIL' $n.powers.log) FAIL, $(tail -1 $n.powers.log)"
  fi
  case $n in m-*) (cd $d && node test/presence.js > ../../$n.presence.log 2>&1; echo "exit $?" >> ../../$n.presence.log); res="$res; presence: $(tail -1 $n.presence.log)";; esac
  echo "$n: $res"
}
export -f run
printf "%s\n" "$@" | xargs -P 4 -I{} bash -c 'run {}'
