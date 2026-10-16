# usage: python3 rep.py file  (reads pairs from a python file given as argv[2])
import sys
p = sys.argv[1]
pairs = {}
exec(open(sys.argv[2], encoding='utf-8').read(), pairs)
s = open(p, encoding='utf-8').read()
for old, new in pairs['R']:
    c = s.count(old)
    if c != 1:
        print('COUNT', c, 'for', old[:120]); sys.exit(1)
    s = s.replace(old, new)
open(p, 'w', encoding='utf-8').write(s)
print('ok', len(pairs['R']), 'replacements')
