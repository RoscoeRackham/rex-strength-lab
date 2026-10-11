# print HEIGHT/WEIGHT lines that occur within N lines after a line matching the name regex
import re,sys
fn,name=sys.argv[1],sys.argv[2]; N=int(sys.argv[3]) if len(sys.argv)>3 else 80
L=open(fn,encoding='utf-8',errors='ignore').read().split('\n')
for i,l in enumerate(L):
    if re.search(name,l):
        for j in range(max(0,i-N),min(len(L),i+N)):
            if re.search(r'HEIGHT|WEIGHT',L[j]):
                print(f'{i}:{l.strip()[:80]!r}  ->  {j}: {L[j].strip()[:160]!r}')
