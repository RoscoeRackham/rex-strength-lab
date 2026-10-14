#!/bin/sh
# Reproduces srclow-1 and srclow-2. Run from anywhere; downloads go to ../dl
D=/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/reviewC1/verify-srclow/dl
echo '== srclow-1: page row'; git -C /home/user/rex-strength-lab show claude/rex-gui-c:rex-strength-lab/dist/index.html | grep -A1 '"label": "Energy: A lightning flash: total energy"'
echo '== Salinas et al. 2021 JAS 78:3909 (open access)'; sed -n 557,562p $D/jas2021.txt | cut -c80-
echo '== arXiv 2404.10020'; grep -n 'order of 109 to 1010 J\|bearing 109 to 1010' $D/arxiv.txt
echo '== srclow-2: toyota.com embedded spec'
python3 -I - "$D/toyota.html" <<'PY'
import re,bisect,sys
s=open(sys.argv[1],encoding='utf-8',errors='replace').read()
codes=[(m.start(),m.group(1)) for m in re.finditer(r'"(\d{4})"\s*:\s*\{', s)]; pos=[c[0] for c in codes]
grade={c:g for g,c in re.findall(r'"(corolla_[a-z_]+)":\{"image":"[^"]*","trims":\{"(\d{4})"', s)}
for m in re.finditer(r'Fuel tank \(gal\.\)":\{[^}]*?"value":"([^"]*)"', s):
    c=codes[bisect.bisect_left(pos,m.start())-1][1]; print(c, grade.get(c), m.group(1))
PY
