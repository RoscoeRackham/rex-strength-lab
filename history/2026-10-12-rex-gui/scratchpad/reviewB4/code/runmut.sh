#!/bin/bash
cd /tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/reviewB4/code
: > mut/results.txt
cat mut/list.txt | xargs -P 4 -I{} sh -c 'r=$(node runoff.js mut/{}.js 2>&1 | tail -1); echo "{} $r" >> mut/results.txt'
echo done >> mut/results.txt
