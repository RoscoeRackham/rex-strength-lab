import csv, sys, math, statistics as st, json
rows=list(csv.DictReader(open(sys.argv[1], encoding='latin-1')))
print(len(rows), [k for k in rows[0].keys() if 'weight' in k.lower() or 'waist' in k.lower()])
def f(r,k): return float(r[k])
def ell_perim(a,b): # semi-axes
    h=((a-b)/(a+b))**2; return math.pi*(a+b)*(1+3*h/(10+math.sqrt(4-3*h)))
out={}
groups={'all':rows}
w=sorted(rows,key=lambda r:f(r,'weightkg'))
groups['heaviest10pct']=w[int(0.9*len(w)):]
# 'muscular': high chest circ relative to waist circ (V-taper) top 10%
v=sorted(rows,key=lambda r:f(r,'chestcircumference')/f(r,'waistcircumference'))
groups['vtaper_top10pct']=v[int(0.9*len(v)):]
for g,R in groups.items():
    d={}
    def m(fn): 
        vals=[fn(r) for r in R]; return round(st.mean(vals),3), round(st.pstdev(vals),3)
    d['n']=len(R)
    d['stature_mm']=m(lambda r:f(r,'stature'))
    d['weight_kg']=m(lambda r:f(r,'weightkg')/10)
    d['chestdepth/chestbreadth']=m(lambda r:f(r,'chestdepth')/f(r,'chestbreadth'))
    d['chestdepth_mm']=m(lambda r:f(r,'chestdepth')); d['chestbreadth_mm']=m(lambda r:f(r,'chestbreadth'))
    d['waistdepth/waistbreadth']=m(lambda r:f(r,'waistdepth')/f(r,'waistbreadth'))
    d['buttockdepth/hipbreadth']=m(lambda r:f(r,'buttockdepth')/f(r,'hipbreadth'))
    d['chestdepth/bideltoid']=m(lambda r:f(r,'chestdepth')/f(r,'bideltoidbreadth'))
    d['headlength/headbreadth']=m(lambda r:f(r,'headlength')/f(r,'headbreadth'))
    d['footlength/footbreadth']=m(lambda r:f(r,'footlength')/f(r,'footbreadthhorizontal'))
    d['footlength/stature']=m(lambda r:f(r,'footlength')/f(r,'stature'))
    d['chestcirc/ellipse_perim']=m(lambda r:f(r,'chestcircumference')/ell_perim(f(r,'chestbreadth')/2,f(r,'chestdepth')/2))
    d['waistcirc/ellipse_perim']=m(lambda r:f(r,'waistcircumference')/ell_perim(f(r,'waistbreadth')/2,f(r,'waistdepth')/2))
    d['buttockcirc/ellipse_perim']=m(lambda r:f(r,'buttockcircumference')/ell_perim(f(r,'hipbreadth')/2,f(r,'buttockdepth')/2))
    d['bideltoid/stature']=m(lambda r:f(r,'bideltoidbreadth')/f(r,'stature'))
    d['chestbreadth/stature']=m(lambda r:f(r,'chestbreadth')/f(r,'stature'))
    out[g]=d
print(json.dumps(out,indent=1))
json.dump(out,open('ansur_ratios.json','w'),indent=1)
