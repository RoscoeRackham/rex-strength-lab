# split git diff f25f9b4..ad1aa9c of a file into hunks; list them, or write a patch of the chosen hunks
import sys, subprocess
REPO = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr4-r3-recheck/fixes/repo'
def hunks(path):
    d = subprocess.run(['git', 'diff', '-U1', 'f25f9b4', 'ad1aa9c', '--', path], cwd=REPO, capture_output=True, text=True).stdout.split('\n')
    head, hs, cur = [], [], None
    for l in d:
        if l.startswith('@@'):
            cur = [l]; hs.append(cur)
        elif cur is None: head.append(l)
        else: cur.append(l)
    return head, hs
if __name__ == '__main__':
    path = sys.argv[1]
    head, hs = hunks(path)
    if len(sys.argv) == 2:
        for i, h in enumerate(hs):
            plus = [x for x in h if x.startswith('+')]
            print(i, h[0][:60], '|', (plus[0][:150] if plus else ''))
    else:
        sel = [int(x) for x in sys.argv[2].split(',')]
        out = head + sum([hs[i] for i in sel], [])
        open(sys.argv[3], 'w').write('\n'.join(out) + '\n')
