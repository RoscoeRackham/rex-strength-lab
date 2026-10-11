"""Assemble Method A results from final_raw.pkl into segments, uncertainty factors and results JSON."""
import json, math, pickle
import numpy as np
exec(open('run_all.py').read().split('results={}')[0])   # params, S, regions, helpers
from final import ANG                                       # (re-runs final.py's computation; cheap enough)
R=pickle.load(open('final_raw.pkl','rb'))
RHO=(1030.0,980.0,1065.0)
SCALE_ERR=math.hypot(REX_GROUND_ERR,2.0)/rex_hpx

def arms(v,fig):
    if fig=='rex': L=v['arm_L_upper']+v['arm_L_fore']+v['arm_L_hand']; Rr=v['arm_R_upper']+v['arm_R_fore']+v['arm_R_hand']
    else: L=v['arm_L_upper']+v['arm_L_fore']+v['arm_L_fist']; Rr=v['arm_R_upper']+v['arm_R_fore']+v['arm_R_fist']
    return L,Rr

def total(fig, v, k='c', arm='mean', feet='c', extra='c', persp=1.0):
    """k: which depth-ratio set v was computed with (fullness follows it); arm: mean|gm|max;
    feet/extra: c|l|h for foot model and tail extras."""
    ik={'c':0,'l':1,'h':2}[k]; iF={'c':0,'l':1,'h':2}[feet]; iE={'c':0,'l':1,'h':2}[extra]
    seg={}
    L,Rr=arms(v,fig)
    a={'mean':0.5*(L+Rr),'gm':math.sqrt(L*Rr),'max':max(L,Rr)}[arm]
    seg['arm_L']=a; seg['arm_R']=a; seg['arm_views']=(L,Rr)
    seg['torso']=v['torso']*FULLNESS[ik]+(v['pouch_L']+v['pouch_R'] if fig=='rex' else 0.0)
    seg['leg_L']=v['leg_L']; seg['leg_R']=v['leg_R']
    if fig=='rex':
        seg['head_neck']=v['head_neck']+v['crest']
        W=[REX_FOOT['W_px'],REX_FOOT['W_px_lo'],REX_FOOT['W_px_hi']][iF]*S
        Lf=W*REX_FOOT['LW'][iF]; Hf=REX_FOOT['H_px']*S; fill=REX_FOOT['fill'][iF]; c=REX_FOOT['sole_c'][iF]
        seg['tail_visible']=v['tail']*REX_TAIL_FORESHORTEN[iE]; seg['tail_hidden']=REX_HIDDEN_TAIL_M3[iE]
    else:
        seg['head_neck']=v['head']+v['neck']+v['horn_L']+v['horn_R']+v['ear_L']+v['ear_R']
        Lf=OL_BOOT['L_m'][iF]; W=OL_BOOT['W_m'][iF]; Hf=OL_BOOT['H_px']*S; fill=OL_BOOT['fill'][iF]; c=OL_BOOT['sole_c'][iF]
        seg['tail_visible']=v['tail_core']+v['tail_tuft']*TUFT_PACKING[iE]; seg['tail_hidden']=OL_HIDDEN_TAIL_M3[iE]
    seg['foot_each']=fill*Lf*W*Hf; seg['feet']=2*seg['foot_each']
    seg['foot_dims']=dict(W_m=round(W,3),L_m=round(Lf,3),H_m=round(Hf,3),fill=fill,sole_fill=c)
    seg['sole_m2']=c*Lf*W
    seg['tail']=seg['tail_visible']+seg['tail_hidden']
    seg['total']=persp**3*sum(seg[x] for x in ('head_neck','torso','arm_L','arm_R','leg_L','leg_R','feet','tail'))
    return seg

def dims(mask, angle):
    m,_=rotate_to_vertical(mask,angle); w=m.sum(1); w=w[w>0]
    return dict(len_m=round(len(w)*S,3), max_w_m=round(w.max()*S,3), mean_w_m=round(w.mean()*S,3))

OUT={}
for fig in ('rex','ollie'):
    d=R[fig]; regs=rex_r if fig=='rex' else ol_r; P=REXP if fig=='rex' else OLP
    C=total(fig,d['c'])
    Vc=C['total']
    fac={}
    fac['depth_ratios+fullness']=(total(fig,d['l'],k='l')['total']/Vc, total(fig,d['h'],k='h')['total']/Vc)
    fac['arm_view_asymmetry']=(total(fig,d['c'],arm='gm')['total']/Vc, total(fig,d['c'],arm='max')['total']/Vc)
    fac['feet_model']=(total(fig,d['c'],feet='l')['total']/Vc, total(fig,d['c'],feet='h')['total']/Vc)
    fac['tail_extras']=(total(fig,d['c'],extra='l')['total']/Vc, total(fig,d['c'],extra='h')['total']/Vc)
    lo_mask=d['erode2'] if fig=='ollie' else d['erode1']
    fac['mask_edge']=(total(fig,lo_mask)['total']/Vc, total(fig,d['dilate1'])['total']/Vc)
    fac['pixel_scale']=((1-SCALE_ERR)**3,(1+SCALE_ERR)**3)
    fac['perspective_same_distance']=(0.94,1.0) if fig=='ollie' else (1.0,1.0)
    lo=math.sqrt(sum(math.log(a)**2 for a,b in fac.values())); hi=math.sqrt(sum(math.log(b)**2 for a,b in fac.values()))
    rl=math.log(RHO[1]/RHO[0]); rh=math.log(RHO[2]/RHO[0])
    stack_lo=np.prod([a for a,b in fac.values()]); stack_hi=np.prod([b for a,b in fac.values()])
    regdims={}
    for name,spec in P.items():
        ang=ANG[fig].get(name,0.0)
        regdims[name]=dict(V_m3=round(d['c'][name],4),method=spec[0],angle_deg=ang,**dims(regs[name],ang))
    OUT[fig]=dict(seg=C,Vc=Vc,V_lo=Vc*math.exp(-lo),V_hi=Vc*math.exp(hi),V_lo_stack=Vc*stack_lo,V_hi_stack=Vc*stack_hi,
                  M_c=Vc*RHO[0],M_lo=Vc*RHO[0]*math.exp(-math.sqrt(lo**2+rl**2)),M_hi=Vc*RHO[0]*math.exp(math.sqrt(hi**2+rh**2)),
                  M_lo_stack=Vc*stack_lo*RHO[1],M_hi_stack=Vc*stack_hi*RHO[2],factors=fac,
                  front_m2=float((rex_body if fig=='rex' else ol_body).sum())*S*S,regdims=regdims,
                  sole_lo=total(fig,d['c'],feet='l')['sole_m2'],sole_hi=total(fig,d['c'],feet='h')['sole_m2'])
pickle.dump(OUT,open('report.pkl','wb'))
for fig,o in OUT.items():
    print('=====',fig,'V %.3f (%.3f-%.3f; stacked %.3f-%.3f)  M %.0f (%.0f-%.0f; stacked %.0f-%.0f)  front %.3f m2'%(
        o['Vc'],o['V_lo'],o['V_hi'],o['V_lo_stack'],o['V_hi_stack'],o['M_c'],o['M_lo'],o['M_hi'],o['M_lo_stack'],o['M_hi_stack'],o['front_m2']))
    for k,v in o['factors'].items(): print('   factor %-28s %.3f %.3f'%(k,v[0],v[1]))
    for k in ('head_neck','torso','arm_L','arm_R','arm_views','leg_L','leg_R','feet','foot_dims','sole_m2','tail_visible','tail_hidden','tail'):
        print('   %-13s'%k, o['seg'][k])
    print('   sole range',o['sole_lo'],o['sole_hi'])
    for k,v in o['regdims'].items(): print('     ',k,v)
