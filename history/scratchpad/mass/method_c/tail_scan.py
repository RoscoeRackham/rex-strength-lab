import numpy as np
R=np.load('../rex_fig.npy')
# centerline points (x,y) of the visible tail, by eye from c_rextail.png
P=np.array([(1060,600),(1085,640),(1115,675),(1150,700),(1185,712),(1215,708),(1238,690),(1244,665),(1238,640),(1236,622)],float)
def thick(p,n):
    # walk both directions along normal until leaving mask
    out=[]
    for sgn in (1,-1):
        t=0
        while True:
            q=p+sgn*(t+1)*n; x,y=int(round(q[0])),int(round(q[1]))
            if y<0 or y>=R.shape[0] or x<0 or x>=R.shape[1] or not R[y,x]: break
            t+=1
            if t>200: break
        out.append(t)
    return out
L=0
for i,p in enumerate(P):
    a=P[max(i-1,0)]; b=P[min(i+1,len(P)-1)]
    d=(b-a)/np.linalg.norm(b-a); n=np.array([-d[1],d[0]])
    up,dn=thick(p,n)
    if i>0: L+=np.linalg.norm(P[i]-P[i-1])
    print(i,p,'s=%.0f'%L,'normal',n.round(2),'extent',up,dn,'thick',up+dn+1)
