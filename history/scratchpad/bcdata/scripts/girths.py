import math, json
S=3.048/790.0  # checker scale m/px
def ram(w,d):
    a,b=w/2,d/2; h=((a-b)/(a+b))**2
    return math.pi*(a+b)*(1+3*h/(10+math.sqrt(4-3*h)))
spec={
 'rex':{'chest':(278,(274,282),1.05,(0.90,1.25)),'waist':(237,(229,245),0.80,(0.70,0.90)),
        'arm_flexed':(165,(160,168),0.90,(0.80,1.00)),'forearm':(145,(143,155),0.85,(0.75,0.95)),
        'thigh':(158,(150,165),1.0,(0.85,1.10)),'calf':(165,(156,174),1.0,(0.85,1.10)),'neck':(128,(120,135),1.05,(0.95,1.15))},
 'ollie':{'chest':(297,(290,307),1.05,(0.90,1.25)),'waist':(320,(300,330),0.80,(0.70,0.90)),
        'arm_flexed':(148,(115,160),0.95,(0.85,1.05)),'forearm':(108,(90,114),0.85,(0.75,0.95)),
        'thigh':(164,(155,172),1.0,(0.85,1.10)),'calf':(172,(165,178),1.0,(0.85,1.10)),'neck':(122,(120,125),1.0,(0.90,1.10))}}
out={}
for f,d in spec.items():
    out[f]={}
    for g,(w,(wl,wh),k,(kl,kh)) in d.items():
        c=ram(w*S,k*w*S); lo=ram(wl*S,kl*wl*S); hi=ram(wh*S,kh*wh*S)
        out[f][g]=dict(width_px=w,width_m=round(w*S,4),k=k,girth_m=round(c,3),range_m=[round(lo,3),round(hi,3)],girth_in=round(c/0.0254,1))
        print(f,g,'w %d px = %.3f m, k %.2f -> %.3f m (%.1f in) range %.3f-%.3f'%(w,w*S,k,c,c/0.0254,lo,hi))
# ANSUR method check
for name,B,D,C,k in (('chest',0.289,0.253,1.056,1.05),('waist',0.325,0.234,0.937,0.80)):
    e=ram(B,k*B); e2=ram(B,D)
    print('ANSUR p50',name,'tape %.3f; ellipse(breadth,k=%.2f) %.3f ratio %.3f; ellipse(breadth,depth) %.3f ratio %.3f'%(C,k,e,e/C,e2,e2/C))
json.dump(out,open('rexollie_girths.json','w'),indent=1)
