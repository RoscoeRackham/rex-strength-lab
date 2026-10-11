# Legs-vertical stance: gap between the two thighs just above the knee (ANSUR lower thigh circumference site).
import csv, sys, math
rows = list(csv.DictReader(open(sys.argv[1], encoding='latin-1')))
def g(r,k): return float(r[k])/1000
def pct(v,p):
    s=sorted(v); k=(len(s)-1)*p; f=math.floor(k); c=math.ceil(k); return s[f]+(s[c]-s[f])*(k-f)
gaps=[]; kb=[]; hjc=[]
for r in rows:
    LL = g(r,'iliocristaleheight') - 0.06 - (g(r,'lateralmalleolusheight') + 0.01)   # estimate of ASIS-to-medial-malleolus leg length
    y = (8 + 0.086*LL*1000)/1000          # Hara et al. 2016: HJC medial-lateral offset (mm) = 8 + 0.086*LL
    hjc.append(2*y)
    half = g(r,'lowerthighcircumference')/(2*math.pi)  # circular cross-section assumption
    gaps.append(2*(y-half)); kb.append(y/half)
print("inter-HJC (m): p5 %.3f p50 %.3f p95 %.3f" % (pct(hjc,.05),pct(hjc,.5),pct(hjc,.95)))
print("gap above knee, legs vertical (m): p5 %.3f p50 %.3f p95 %.3f min %.3f" % (pct(gaps,.05),pct(gaps,.5),pct(gaps,.95),min(gaps)))
print("men with zero gap:", sum(1 for x in gaps if x<=0), "of", len(gaps))
print("width factor k_b to close the gap: p5 %.2f p50 %.2f p95 %.2f min %.2f" % (pct(kb,.05),pct(kb,.5),pct(kb,.95),min(kb)))
# same with feet 'shoulder width' (ankle centres biacromial breadth apart) -- for comparison only
kb2=[]
for r in rows:
    LL = g(r,'iliocristaleheight') - 0.06 - (g(r,'lateralmalleolusheight') + 0.01)
    y = (8 + 0.086*LL*1000)/1000
    hip_h = g(r,'trochanterionheight'); ank = g(r,'lateralmalleolusheight'); knee = g(r,'kneeheightmidpatella') + 0.04
    xa = g(r,'biacromialbreadth')/2
    xk = y + (xa - y)*(hip_h-knee)/(hip_h-ank)
    kb2.append(xk/(g(r,'lowerthighcircumference')/(2*math.pi)))
print("feet shoulder-width apart: k_b p50 %.2f min %.2f" % (pct(kb2,.5),min(kb2)))
# heels together: knee centres roughly a knee-breadth apart -> knees touch; report only qualitatively
