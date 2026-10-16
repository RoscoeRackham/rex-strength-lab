# make a trimmed shots.js: helpers of the pull request 4 block + the chosen sub-blocks (build, r1, r2, r3)
import sys
src, dst, keep = sys.argv[1], sys.argv[2], set(sys.argv[3].split(','))
L = open(src, encoding='utf-8').read().split('\n')
def find(s, start=0):
    for i in range(start, len(L)):
        if s in L[i]: return i
    raise SystemExit('marker not found: ' + s)
b0 = find("const COL = { duoOpen: true, duoAction: 'collide' };") + 1
r1 = find('// ---- review round 1 of pull request 4 (research', b0)
r2 = find('// ---- review round 2 of pull request 4 (research', r1)
r3 = find('// ---- review round 3 of pull request 4 (research', r2)
end = find("if (errs.length) r4.push('page errors", r3)
parts = {'build': (b0, r1), 'r1': (r1, r2), 'r2': (r2, r3), 'r3': (r3, end)}
out = L[:b0]
for k in ['build', 'r1', 'r2', 'r3']:
    if k in keep: out += L[parts[k][0]:parts[k][1]]
out += L[end:]
open(dst, 'w', encoding='utf-8').write('\n'.join(out))
print('kept', sorted(keep), 'lines', len(out))
