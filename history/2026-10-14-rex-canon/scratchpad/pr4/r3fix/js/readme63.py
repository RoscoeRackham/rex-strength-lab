# Copy check (review round 3, copy-readme-63200-wrong-distance): README 'What moved' gives the real-ground jump's old ceiling at
# the section's 5 m (108 t, where the ground breaks, as pull request 3's page gives it: probe-page.js), and 63,200 kg-force only
# as the 3 m figure; the preset's 112 t -> 2,570 kg-force.  python3 readme63.py <README.md>
import re, sys
s = open(sys.argv[1], encoding='utf-8').read()
c = s[s.index('## Contests and the two Never knocked back switches'):]
line = [l for l in c.split('\n') if '10^6.25 kg dial' in l][0]
m = line[line.index('10^6.25 kg dial'):]
ok = 'with people 5 m away it was 108 t, where the ground breaks' in m and 'with them 3 m away, 63,200 kg-force' in m and 'from 112 t to 2,570 kg-force' in m and 'it was 63,200 kg-force, from the hit' not in m
print(m[:400]); print('OK' if ok else 'WRONG'); sys.exit(0 if ok else 1)
