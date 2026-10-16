# Copy checks for review round 1 of pull request 5 on the README and the pull request's description (no page shows these).
# python3 docs1.py <README.md> <pr-body.md> [part]   parts: lists, copy5, copy2, code2 (all by default); exit 1 on a failure
import re, sys
readme, body = open(sys.argv[1], encoding='utf-8').read(), open(sys.argv[2], encoding='utf-8').read()
want = sys.argv[3:] or ['lists', 'copy5', 'copy2', 'code2']
sec = readme[readme.index('## The absorption shimmer (BRIEF-canon.md pull request 5)'):]; sec = sec[:sec.index('\n## ')]
res = {}
# the owner's numbered list: the README's (What is left) and the description's (Decisions for you to confirm), item for item
left = sec[sec.index('**What is left.**'):]
pr = body[body.index('## Decisions for you to confirm'):]; pr = pr[:pr.index('\n## ', 3)]
a = [x.replace('**', '') for x in re.findall(r'^\d+\. (.*)$', left, re.M)]
b = [x.replace('**', '') for x in re.findall(r'^\d+\. (.*)$', pr, re.M)]
res['lists'] = (a == b and len(a) == 11, 'README %d items, description %d; first difference: %s' % (len(a), len(b), next(((x, y) for x, y in zip(a, b) if x != y), None)))
# copy-5: with every power off there is no tile, except the Weight tab's growth what-if (decision 18)
res['copy5'] = ("With every power off there is no tile, except in the Weight tab's growth what-if, which is a what-if, not a power (decision 18)." in sec
                and 'With every power off there is no tile. ' not in sec
                and "None with every power off, except the Weight tab's growth what-if (a what-if, not a power; decision 18)." in body
                and not re.search(r'None with every power off\.', body), 'README What changed / the description\'s tile paragraph')
# copy-2: They take their own recoil's push back carries almost no energy only where they stand still (Known limits)
kl = readme[readme.index('- They take their own recoil covers his throw'):]; kl = kl[:kl.index('\n')]
res['copy2'] = ("and it carries almost no energy, since they don't move" not in kl and 'Where they stand still the push back itself carries almost no energy; but with the power on, what their own moves free goes to the endless ocean too and shows in the shimmer' in kl, kl[:200])
# code-2 and code-3: decision 2's drag rule
d2 = sec[sec.index('2. The parts.'):]; d2 = d2[:d2.index('\n')]
res['code2'] = ('all of its energy where that flight escapes, orbits, never lands or passes 1% of light speed' not in d2 and 'the drag along that flight, which it leaves with the rest of its energy' in d2
                and 'past 1% of light speed, all of its energy, an upper bound' in d2 and 'the energy that leaves his own gravity well' in d2, d2[:200])
bad = [k for k in want if not res[k][0]]
for k in want: print(('ok   ' if res[k][0] else 'FAIL ') + k + ('' if res[k][0] else ': ' + str(res[k][1])))
sys.exit(1 if bad else 0)
