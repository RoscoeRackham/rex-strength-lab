# Copy check (review round 3, copy-owner-confirm-lists-differ): the README's list of decisions for the owner to confirm (pull
# request 4's section, 'What is left') and the pull request description's list hold the same decisions in the same order.
# python3 lists.py <README.md> <pr-body.md>   (exit 1 when they differ)
import re, sys
readme, body = open(sys.argv[1], encoding='utf-8').read(), open(sys.argv[2], encoding='utf-8').read()
c = readme[readme.index('## Contests and the two Never knocked back switches'):]
sec = c[c.index('**What is left.**'):]; sec = sec[:sec.index('\n## ')]
pr = body[body.index('## Decisions for you to confirm'):]; pr = pr[:pr.index('\n## ', 3)]
KEYS = [('reading B', 'arm reading B'), ('paradox', 'paradox'), ('means it', 'blast presets'), ('how long the one hit is carried', 'carry'), ('always shoved apart', 'equal bodies shoved apart'),
        ('fireball', 'fireball split'), ('steady push follow', 'steady push shove-off'), ('steady push’s one driven back', 'steady push shove-off'), ("steady push's one driven back", 'steady push shove-off'), ('walk-out', 'walk-out'),
        ('too weak to stand', 'lying pusher'), ('holding a partner up', 'holding up is weight')]
def items(txt):
    its = re.findall(r'^\d+\. (.*)$', txt, re.M)
    if not its: its = txt.split('overrule:', 1)[1].split(';')   # the old README: one sentence
    out = []
    for x in [y.replace('**', '') for y in its]:
        k = [v for key, v in KEYS if key.lower() in x.lower()]
        out.append(k[0] if k else '?' + x[:30])
    return out
a, b = items(sec), items(pr)
print('README:', a); print('PR:    ', b)
ok = a == b and not any(x.startswith('?') for x in a)
print('SAME' if ok else 'DIFFER'); sys.exit(0 if ok else 1)
