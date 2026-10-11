import json, math, pickle, sys
import numpy as np
from scipy import ndimage as ndi
exec(open('compute.py').read().split('# sanity test')[0])   # helpers + scale constants

# ---- heights (px rows); visual half-coverage tops (mask has a 1-2 px antialias halo on top edges)
REX_TOP=8.0     # crest spike tip (mask top row 6 = halo), +-2
OL_HORN_TOP=11.0  # horn tip (mask top row %d)
OL_HAIR_TOP=24.0
rex_hpx=REX_GROUND-REX_TOP; S=3.048/rex_hpx
print('mask tops rex',top_row(rex_body),'ollie',top_row(ol_body))

def zone_k(zones):
    def f(y):
        for ymax,k in zones:
            if y<ymax: return k
        return zones[-1][1]
    return f

# parameter table: (method, k central, k low, k high, extra c/l/h, zones or None)
# k = depth (camera axis) / visible width of the elliptical slice
REXP={
 'crest':      ('lt', 0.5,0.3,0.8),
 'head_neck':  ('rows',1.05,0.85,1.3),
 'arm_L_upper':('rot',1.0,0.85,1.15), 'arm_L_fore':('rot',0.9,0.75,1.05), 'arm_L_hand':('rot',0.6,0.45,0.8),
 'arm_R_upper':('rot',1.0,0.85,1.15), 'arm_R_fore':('rot',0.9,0.75,1.05), 'arm_R_hand':('rot',0.6,0.45,0.8),
 'torso':      ('rows','zones',[(290,(0.90,0.78,1.05)),(400,(0.75,0.65,0.88)),(9999,(0.72,0.65,0.85))]),
 'leg_L':      ('rot',1.0,0.85,1.15), 'leg_R':('rot',1.0,0.85,1.15),
 'tail':       ('lt',0.8,0.6,1.0),
 'pouch_L':('slab',0.15,0.08,0.20),'pouch_R':('slab',0.15,0.08,0.20),
}
OLP={
 'horn_L':('lt',1.0,0.85,1.15),'horn_R':('lt',1.0,0.85,1.15),
 'ear_L':('lt',0.25,0.15,0.4),'ear_R':('lt',0.25,0.15,0.4),
 'head':('rows',1.25,1.05,1.45),'neck':('rows',1.0,0.85,1.15),
 'arm_L_upper':('rot',1.0,0.85,1.15),'arm_L_fore':('rot',0.9,0.75,1.05),'arm_L_fist':('rot',0.75,0.6,0.9),
 'arm_R_upper':('rot',1.0,0.85,1.15),'arm_R_fore':('rot',0.9,0.75,1.05),'arm_R_fist':('rot',0.75,0.6,0.9),
 'torso':('rows','zones',[(270,(0.90,0.78,1.05)),(390,(0.72,0.62,0.85)),(9999,(0.72,0.65,0.85))]),
 'leg_L':('rot',1.0,0.85,1.15),'leg_R':('rot',1.0,0.85,1.15),
 'tail_core':('lt',1.0,0.85,1.15),'tail_tuft':('lt',1.0,0.85,1.15),
}
FULLNESS=(1.07,1.0,1.12)          # torso cross-section area / ellipse area (ANSUR circumference check)
REX_TAIL_FORESHORTEN=(1.12,1.0,1.25)
TUFT_PACKING=(0.15,0.05,0.30)
REX_HIDDEN_TAIL_M3=(0.090,0.040,0.180)
OL_HIDDEN_TAIL_M3=(0.002,0.001,0.004)
# feet: wedge/box  V = fill * L * W * H
REX_FOOT=dict(W_px=170.0, W_px_lo=155.0, W_px_hi=180.0, LW=(1.2,0.95,1.6), H_px=76.0, fill=(0.45,0.35,0.55), sole_c=(0.70,0.60,0.80))
OL_BOOT=dict(L_m=(0.70,0.58,0.82), W_m=(0.30,0.25,0.35), H_px=83.0, fill=(0.50,0.40,0.60), sole_c=(0.70,0.60,0.80))

# split Ollie tail into core and tuft
ol_r['tail_core']=ol_r['tail'].copy(); ol_r['tail_core'][505:]=False
ol_r['tail_tuft']=ol_r['tail'].copy(); ol_r['tail_tuft'][:505]=False

def region_px3(mask, spec, which, angle=None):
    meth=spec[0]
    idx={'c':0,'l':1,'h':2}[which]
    if spec[1]=='zones':
        kf=zone_k([(ymax,ks[idx]) for ymax,ks in spec[2]])
    else:
        kv=spec[1+idx]; kf=lambda y,kv=kv: kv
    if meth=='rows': return slice_volume(mask,kf,0.0)
    if meth=='rot':  return slice_volume(mask,kf,angle)
    if meth=='lt':   return lt_volume(mask,kf(0))
    if meth=='slab': return float(mask.sum())*kf(0)/S   # area px^2 * thickness(m)/S -> px^3

def morph(mask, d):
    if d>0: return ndi.binary_dilation(mask,iterations=d)
    if d<0: return ndi.binary_erosion(mask,iterations=-d)
    return mask

def figure_volumes(regs, params, S, edge=0, which='c'):
    out={}; angles={}
    for name,spec in params.items():
        m=morph(regs[name],edge)
        ang=principal_angle(regs[name]) if spec[0]=='rot' else 0.0
        angles[name]=round(ang,1)
        out[name]=region_px3(m,spec,which,ang)*S**3
    return out,angles

results={}
def run(fig):
    regs=rex_r if fig=='rex' else ol_r; P=REXP if fig=='rex' else OLP
    I={'c':0,'l':1,'h':2}
    res={}
    for which in 'clh':
        v,ang=figure_volumes(regs,P,S,0,which); res[which]=v
    res['angles']=ang
    # mask edge sensitivity at central k
    res['erode1'],_=figure_volumes(regs,P,S,-1,'c')
    res['dilate1'],_=figure_volumes(regs,P,S,+1,'c')
    if fig=='ollie': res['erode2'],_=figure_volumes(regs,P,S,-2,'c')
    # row-slice and LT comparison for limbs/tail (method check)
    comp={}
    for name,spec in P.items():
        if spec[0] in ('rot','lt') and spec[1]!='zones':
            kv=spec[1]
            comp[name]=dict(rows=slice_volume(regs[name],lambda y:kv,0.0)*S**3,
                            rot=slice_volume(regs[name],lambda y:kv,principal_angle(regs[name]))*S**3,
                            lt=lt_volume(regs[name],kv)*S**3)
    res['method_compare']=comp
    return res
for fig in ('rex','ollie'):
    results[fig]=run(fig)
pickle.dump(dict(results=results,S=S),open('raw_results.pkl','wb'))
for fig in results:
    print(fig, {k:round(v,4) for k,v in results[fig]['c'].items()})
    print('  angles',results[fig]['angles'])
    for k,v in results[fig]['method_compare'].items(): print('  ',k,{a:round(b,4) for a,b in v.items()})
