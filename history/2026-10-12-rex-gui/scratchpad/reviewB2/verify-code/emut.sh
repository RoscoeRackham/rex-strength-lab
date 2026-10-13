#!/bin/bash
# emut.sh <name> <python-literal search> <python-literal replace> : run powers.js --skip-off on a mutated engine copy
S=/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/reviewB2/verify-code
R=/home/user/rex-strength-lab/rex-strength-lab
D=$S/emut/$1; rm -rf $D; mkdir -p $D/src $D/test
cp $R/src/data.js $D/src/; cp $R/test/powers.js $R/test/powers-off-cases.js $D/test/
python3 - "$R/src/engine.js" "$D/src/engine.js" "$2" "$3" <<'PY'
import sys
s=open(sys.argv[1]).read(); a=sys.argv[3]; b=sys.argv[4]
n=s.count(a)
if n!=1: print('occurs',n); sys.exit(2)
open(sys.argv[2],'w').write(s.replace(a,b))
PY
[ $? -ne 0 ] && exit 2
node $D/test/powers.js --skip-off > $D/out.txt 2>&1
echo "$1: $(grep -c '^FAIL' $D/out.txt) fails; $(tail -1 $D/out.txt)"
grep '^FAIL' $D/out.txt | head -5
