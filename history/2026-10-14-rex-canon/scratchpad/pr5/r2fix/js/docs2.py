# Copy checks for review round 2 of pull request 5 on the README and the pull request's description (no page shows these).
# python3 docs2.py <README.md> <pr-body.md> [part]   parts: lists, copy2, copy3, code1 (all by default); exit 1 on a failure
import re, sys
readme, body = open(sys.argv[1], encoding='utf-8').read(), open(sys.argv[2], encoding='utf-8').read()
want = sys.argv[3:] or ['lists', 'copy2', 'copy3', 'code1']
sec = readme[readme.index('## The absorption shimmer (BRIEF-canon.md pull request 5)'):]; sec = sec[:sec.index('\n## ')]
res = {}
# the owner's numbered list: the README's (What is left) and the description's (Decisions for you to confirm), item for item
left = sec[sec.index('**What is left.**'):]
pr = body[body.index('## Decisions for you to confirm'):]; pr = pr[:pr.index('\n## ', 3)]
a = [x.replace('**', '') for x in re.findall(r'^\d+\. (.*)$', left, re.M)]
b = [x.replace('**', '') for x in re.findall(r'^\d+\. (.*)$', pr, re.M)]
res['lists'] = (a == b and len(a) == 12 and any('arm-wrestling' in x for x in a), 'README %d items, description %d; first difference: %s' % (len(a), len(b), next(((x, y) for x, y in zip(a, b) if x != y), None)))
# copy-2: exactly the three parts They take their own recoil is credited with (README Known limits)
kl = readme[readme.index('- They take their own recoil covers his throw'):]; kl = kl[:kl.index('\n')]
res['copy2'] = ('what their own moves free goes to the endless ocean' not in kl and 'three things their own moves free go to the endless ocean too and show in the shimmer' in kl, kl[:300])
# copy-3: the drag counted is the share their power takes back (the description's engine bullet, the README's Known limits)
res['copy3'] = ('- The drag counted is the absorbed share of what real air would have taken from the same throw' in body and '- The drag counted is what real air would have taken' not in body
                and 'The drag the shimmer counts is the share their power takes back of what real air would have taken' in sec and 'The drag the shimmer counts is what real air would have taken' not in sec, 'description / Known limits')
# code-1: arm wrestling's pin counted (decision 25), and no longer among the tabs with nothing taken back (decision 22)
d22 = sec[sec.index('22. Which run drives each glow'):]; d22 = d22[:d22.index('\n')]
res['code1'] = ('25. ' in sec and 'arm-wrestling pin' in sec[sec.index('25. '):] and 'Pull, Arm,' not in d22, d22[:300])
bad = [k for k in want if not res[k][0]]
for k in want: print(('ok   ' if res[k][0] else 'FAIL ') + k + ('' if res[k][0] else ': ' + str(res[k][1])))
sys.exit(1 if bad else 0)
