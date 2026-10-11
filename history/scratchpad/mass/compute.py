"""Method A: silhouette slices -> elliptical cross-sections -> volume. Rex scaled to 3.048 m."""
import json, math, pickle
import numpy as np
from scipy import ndimage as ndi
from scipy.signal import fftconvolve

rex_r, ol_r = pickle.load(open('regions.pkl','rb'))
rex_body=np.load('rex_body.npy'); ol_body=np.load('ol_body.npy')

# ---------------------------------------------------------------- scale
# Ground rows (image y of the floor directly under the body), read from 4x zooms:
#  Rex  left foot (image-left, set further back): heel bottom ~787-790, toe pads ~795-798, claw tips 800-803
#       right foot (points at camera): toe pads ~815-818, claw tips ~822. Pants hems: L ~722, R ~735 (13 px lower
#       => right ankle is nearer the camera). Floor under left ankle ~791, under right ankle ~804 -> mean ~798.
#  Ollie left boot: toe 814-815, heel 806 -> under ankle ~809; right boot: toe 813, heel 801 -> ~805 -> mean ~807.
REX_GROUND=798.0; REX_GROUND_ERR=6.0
OL_GROUND=807.0;  OL_GROUND_ERR=5.0
def top_row(mask): return int(np.nonzero(mask.any(1))[0][0])
rex_top=top_row(rex_body)             # crest spike tip
ol_top=top_row(ol_body)               # horn tip
REX_SKULL_TOP=40.0   # top of scaly skull dome under the crest spikes (4x zoom), +-4
OL_HAIR_TOP=float(top_row(ol_r['head']))  # top of hair tuft (head region excludes horns)
OL_SKULL_TOP=34.0    # estimated skull under ~10 px (~4 cm) of hair, +-4
rex_hpx=REX_GROUND-rex_top
S=3.048/rex_hpx      # m per px
print('rex top',rex_top,'H px',rex_hpx,'m/px',S)

# ---------------------------------------------------------------- helpers
def runs_1d(row):
    """lengths of runs of True in a 1-D bool array after closing gaps <=3 px"""
    r=ndi.binary_closing(row,structure=np.ones(4)) & (np.convolve(row,np.ones(9),'same')>0) if row.any() else row
    lab,n=ndi.label(r)
    return ndi.sum(r,lab,range(1,n+1)) if n else np.array([])

def principal_angle(mask):
    ys,xs=np.nonzero(mask); X=np.stack([xs-xs.mean(),ys-ys.mean()])
    w,v=np.linalg.eigh(np.cov(X)); a=v[:,np.argmax(w)]   # major axis (x,y)
    if a[1]<0: a=-a
    return math.degrees(math.atan2(a[0],a[1]))           # degrees from vertical

def rotate_to_vertical(mask, angle):
    """rotate so a limb whose axis is `angle` deg from vertical becomes vertical. Returns mask and
    original row index map (approximate, via rotated coordinate grid)."""
    if abs(angle)<1e-6: return mask, np.arange(mask.shape[0])[:,None]*np.ones((1,mask.shape[1]))
    ys,xs=np.nonzero(mask); pad=10
    y0,y1,x0,x1=ys.min()-pad,ys.max()+pad,xs.min()-pad,xs.max()+pad
    sub=mask[max(y0,0):y1,max(x0,0):x1].astype(float)
    yy=np.mgrid[max(y0,0):y1,max(x0,0):x1][0].astype(float)
    # scipy rotate angle is counter-clockwise in array display coords; a limb tilted with its lower end
    # to the right (+angle) needs a counter-clockwise turn by -angle... verified numerically below
    r=ndi.rotate(sub,-angle,reshape=True,order=1)>0.5
    ry=ndi.rotate(yy,-angle,reshape=True,order=1,cval=np.nan)
    return r, ry

def slice_volume(mask, kfun, angle=0.0):
    """Sum over 1-px slices perpendicular to the axis of pi/4*k*w^2 per run. kfun(y_img)->k."""
    m, ymap = rotate_to_vertical(mask, angle)
    vol=0.0; rows=np.nonzero(m.any(1))[0]
    for i in rows:
        ws=runs_1d(m[i])
        yv=np.nanmean(np.where(m[i],ymap[i] if ymap.ndim==2 else i,np.nan)) if ymap.ndim==2 else i
        vol+=math.pi/4*kfun(yv)*float((ws**2).sum())
    return vol   # px^3

def local_thickness(mask):
    """per-pixel diameter of the largest inscribed disc containing the pixel"""
    ys,xs=np.nonzero(mask); pad=4
    y0,x0=max(ys.min()-pad,0),max(xs.min()-pad,0)
    sub=mask[y0:ys.max()+pad+1, x0:xs.max()+pad+1]
    dt=ndi.distance_transform_edt(sub)
    t=np.zeros(sub.shape)
    for r in range(int(dt.max()),0,-1):
        c=(dt>=r).astype(float)
        if not c.any(): continue
        yy,xx=np.mgrid[-r:r+1,-r:r+1]; disc=((yy**2+xx**2)<=r*r+0.5).astype(float)
        cov=fftconvolve(c,disc,mode='same')>0.5
        sel=cov&sub&(t==0); t[sel]=2*r
    out=np.zeros(mask.shape); out[y0:y0+sub.shape[0], x0:x0+sub.shape[1]]=t
    return out

def lt_volume(mask,k):
    t=local_thickness(mask); return math.pi/4*k*float(t[mask].sum())

# sanity test of the slicer on synthetic shapes
def _test():
    yy,xx=np.mgrid[0:400,0:400]
    disc=((yy-200)**2+(xx-200)**2)<=100**2
    sph=4/3*math.pi*100**3
    print('test sphere: slices %.3f  LT %.3f (ratio to true)'%(slice_volume(disc,lambda y:1.0)/sph, lt_volume(disc,1.0)/sph))
    # tilted cylinder of diameter 40, length ~250 at 40 deg
    a=math.radians(40); u=(xx-200)*math.sin(a)+(yy-200)*math.cos(a); v=(xx-200)*math.cos(a)-(yy-200)*math.sin(a)
    cyl=(np.abs(v)<=20)&(np.abs(u)<=125); true=math.pi*20**2*250
    print('test tilted cyl: rows %.3f  rotated %.3f (angle est %.1f)  LT %.3f'%(slice_volume(cyl,lambda y:1.0)/true,
          slice_volume(cyl,lambda y:1.0,principal_angle(cyl))/true, principal_angle(cyl), lt_volume(cyl,1.0)/true))
_test()
