#!/bin/bash
# usage: pagemut.sh <name> "<blocks>" <hunk-file-to-reverse | js-transform-file>
# copies the branch's rex-strength-lab, reverses a hunk (or runs a JS transform on src files), rebuilds, runs blocks
set -u
BASE=/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr2-r3/code
name=$1; blocks=$2; patch=$3
D=$BASE/mut/$name
rm -rf $D; mkdir -p $D; cp -r $BASE/repo/rex-strength-lab $D/
cd $D
if [[ $patch == *.diff ]]; then
  sed 's#a/rex-strength-lab/#a/#; s#b/rex-strength-lab/#b/#' $patch > p.diff
  (cd rex-strength-lab && git apply -R --unidiff-zero ../p.diff 2>&1 || patch -R -p1 < ../p.diff) || { echo "APPLY FAILED $name"; exit 2; }
else
  node $patch $D/rex-strength-lab || { echo "TRANSFORM FAILED $name"; exit 2; }
fi
cd rex-strength-lab && python3 build-data.py >/dev/null && node build.js >/dev/null || { echo "BUILD FAILED $name"; exit 2; }
if cmp -s dist/index.html $BASE/repo/rex-strength-lab/dist/index.html; then echo "$name: NO CHANGE TO PAGE"; fi
node $BASE/work/runblock.js $D/rex-strength-lab/dist/index.html $BASE/repo/rex-strength-lab/test/shots.js $blocks > $BASE/mut/$name.log 2>&1
rc=$?
echo "$name: rc=$rc $(grep -c PROBLEM $BASE/mut/$name.log) problems"
grep PROBLEM $BASE/mut/$name.log | cut -c1-250
