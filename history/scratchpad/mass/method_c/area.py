"""Frontal silhouette area from the figure masks (reused from ../rex_fig.npy, ../ol_fig.npy,
checked on ov_masks.png), with floor-shadow pixels clipped below each foot's lowest real point."""
import numpy as np, json
R=np.load('../rex_fig.npy').copy(); O=np.load('../ol_fig.npy').copy()
H,W=R.shape; yy,xx=np.mgrid[0:H,0:W]
# Rex: image-left foot claws reach y~801, image-right foot claws y~821, tail belly bottom y~757
R[(xx<880)&(yy>801)]=False
R[(xx>=880)&(xx<1100)&(yy>821)]=False
R[(xx>=1060)&(yy>757)&~((xx<1100)&(yy<=821))]=False
# Ollie: left boot outsole bottom ~818, right boot ~816; drop shadow specks left of boots
O[(xx<330)&(yy>818)]=False
O[(xx>=330)&(yy>816)]=False
O[(yy>730)&(xx>290)&(xx<420)]=False
out={'rex_px':int(R.sum()),'ollie_px':int(O.sum())}
json.dump(out,open('area_px.json','w'),indent=1); print(out)
