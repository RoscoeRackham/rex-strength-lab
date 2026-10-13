#!/bin/bash
# usage: make.sh id file 'from' 'to'
set -e
S=$(dirname $(realpath $0))
id=$1; f=$2
rm -rf $S/$id; mkdir -p $S/$id; cp -r $S/../repo/rex-strength-lab $S/$id/
cd $S/$id/rex-strength-lab
node -e "const fs=require('fs');const f=process.argv[1],a=process.argv[2],b=process.argv[3];const s=fs.readFileSync(f,'utf8');if(s.split(a).length!==2){console.error('pattern count',s.split(a).length-1);process.exit(1)}fs.writeFileSync(f,s.replace(a,b));" "$f" "$3" "$4"
python3 build-data.py >/dev/null && node build.js >/dev/null
cmp -s dist/index.html $S/../repo/rex-strength-lab/dist/index.html && echo "$id: BUILD UNCHANGED" || echo "$id: built"
