# Print the stat block for an entry heading: find heading line (exact regex), then the next lines up to N containing HEIGHT/WEIGHT
import re,sys
fn,name=sys.argv[1],sys.argv[2]; N=int(sys.argv[3]) if len(sys.argv)>3 else 40
L=open(fn,encoding='utf-8',errors='ignore').read().split('\n')
for i,l in enumerate(L):
    if re.search(name,l.strip()):
        blk=[f'{j}: '+L[j].strip()[:170] for j in range(i,min(len(L),i+N)) if re.search(r'HEIGHT|WEIGHT|REAL NAME|DEBUT',L[j])]
        if any('HEIGHT' in b or 'WEIGHT' in b for b in blk):
            print(f'## {i}: {l.strip()[:90]}'); print('\n'.join(blk[:6]))
