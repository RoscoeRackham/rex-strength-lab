import sys
from PIL import Image
import numpy as np
f=sys.argv[1]
# args: page img, plot x0 x1, plot y0 y1, y_10, y_100, cb_x, cb_y0(bottom, value 0) , cb_ytick1 (row of value 1 unit), cb_ytop
x0,x1,y0,y1=map(int,sys.argv[2:6]); y10,y100=map(float,sys.argv[6:8]); cbx,cby0,cby1,cbtop=map(float,sys.argv[8:12])
im=np.asarray(Image.open(f).convert('RGB')).astype(float)
# colorbar lookup
rows=np.arange(int(cbtop)+2,int(cby0)-1)
lut=im[rows,int(cbx)]; vals=(cby0-rows)/(cby0-cby1)
P=im[y0:y1,x0:x1].reshape(-1,3)
d=((P[:,None,:]-lut[None,:,:])**2).sum(-1)
dm=d.min(1); amp=vals[d.argmin(1)]; amp[dm>900]=0; print('masked px',(dm>900).sum()); amp=amp.reshape(y1-y0,x1-x0)
amp[amp<0]=0
ys=np.arange(y0,y1)
freq=10**(1+(y10-ys)/(y10-y100))
print('freq range rows: %.1f - %.1f Hz'%(freq[-1],freq[0]))
for name,w in (('amplitude',amp),('energy',amp**2)):
    wr=w.sum(1); c=np.cumsum(wr[::-1])/wr.sum(); fr=freq[::-1]
    q=lambda p: fr[np.searchsorted(c,p)]
    print(name,'weighted: q25 %.1f median %.1f q75 %.1f'%(q(.25),q(.5),q(.75)))
row=amp.max(1).argmax(); print('row of max amp: %.1f Hz, max amp %.2f'%(freq[row],amp.max()))
# per-column: frequency of the max amplitude at the strongest columns
cm=amp.max(0); top=np.argsort(-cm)[:200]
fm=freq[amp[:,top].argmax(0)]
print('freq at max amplitude in 200 brightest columns: median %.1f, q25 %.1f q75 %.1f'%(np.median(fm),np.percentile(fm,25),np.percentile(fm,75)))
