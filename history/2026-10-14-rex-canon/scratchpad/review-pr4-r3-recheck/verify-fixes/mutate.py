import sys
p, which = sys.argv[1], sys.argv[2]
s = open(p, encoding='utf-8').read()
if which == 'M1':
    old = "(tornOf(sideW) ? capital(tornLine(sideW)) + ', less than ' + L + '’s press, so ' + W + '’s feet slide too.' : L + '’s press is more than '"
    new = "(false ? '' : L + '’s press is more than '"
elif which == 'M2':
    old = "(fCn.judged ? ' Even all-out, ' + judgedDo(fCn) + ' no harm"
    new = "(fCn.judged ? ' Even all-out, those do no harm"
assert s.count(old) == 1, s.count(old)
s = s.replace(old, new)
open(p, 'w', encoding='utf-8').write(s)
print('ok', which)
