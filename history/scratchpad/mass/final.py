import json, math, pickle
import numpy as np
from scipy import ndimage as ndi
exec(open('run_all.py').read().split('results={}')[0])   # helpers, params, scale S, regions

# Limb axis angles (deg from vertical, + = lower end to the right), read from the zoomed grids; PCA is
# unreliable on fat blobs (it gave e.g. 83 deg for Rex's hand), so these are set by hand.
ANG={'rex':{'arm_L_upper':-6,'arm_L_fore':-16,'arm_L_hand':0,'arm_R_upper':16,'arm_R_fore':8,'arm_R_hand':0,
            'leg_L':-3,'leg_R':13},
     'ollie':{'arm_L_upper':-45,'arm_L_fore':60,'arm_L_fist':0,'arm_R_upper':16,'arm_R_fore':-35,'arm_R_fist':0,
              'leg_L':-22,'leg_R':6}}

def vols(fig, which, edge=0):
    regs=rex_r if fig=='rex' else ol_r; P=REXP if fig=='rex' else OLP
    out={}
    for name,spec in P.items():
        m=morph(regs[name],edge)
        out[name]=region_px3(m,spec,which,ANG[fig].get(name,0.0))*S**3
    return out

def assemble(fig, v, which, scale=1.0):
    """group region volumes into segments, apply fullness / packing / foreshortening, add feet and hidden parts"""
    i={'c':0,'l':1,'h':2}[which]; s3=scale**3
    seg={}
    if fig=='rex':
        seg['head_neck']=(v['head_neck']+v['crest'])*s3
        seg['torso']=v['torso']*FULLNESS[i]*s3
        L=v['arm_L_upper']+v['arm_L_fore']+v['arm_L_hand']; R=v['arm_R_upper']+v['arm_R_fore']+v['arm_R_hand']
        arm=(math.sqrt(L*R) if which=='l' else 0.5*(L+R))*s3
        seg['arm_each_visible_L_R']=(L*s3,R*s3)
        seg['arm_L']=arm; seg['arm_R']=arm
        seg['leg_L']=v['leg_L']*s3; seg['leg_R']=v['leg_R']*s3
        W=(REX_FOOT['W_px'] if which=='c' else REX_FOOT['W_px_lo'] if which=='l' else REX_FOOT['W_px_hi'])*S*scale
        Lf=W*REX_FOOT['LW'][i]; Hf=REX_FOOT['H_px']*S*scale
        foot=REX_FOOT['fill'][i]*Lf*W*Hf
        seg['feet']=2*foot; seg['foot_dims']=dict(W_m=W,L_m=Lf,H_m=Hf,fill=REX_FOOT['fill'][i])
        seg['sole_m2']=REX_FOOT['sole_c'][i]*Lf*W
        seg['tail_visible']=v['tail']*REX_TAIL_FORESHORTEN[i]*s3
        seg['tail_hidden']=REX_HIDDEN_TAIL_M3[i]*s3
        seg['tail']=seg['tail_visible']+seg['tail_hidden']
    else:
        seg['head_neck']=(v['head']+v['neck']+v['horn_L']+v['horn_R']+v['ear_L']+v['ear_R'])*s3
        seg['torso']=v['torso']*FULLNESS[i]*s3
        L=v['arm_L_upper']+v['arm_L_fore']+v['arm_L_fist']; R=v['arm_R_upper']+v['arm_R_fore']+v['arm_R_fist']
        arm=(math.sqrt(L*R) if which=='l' else 0.5*(L+R))*s3
        seg['arm_each_visible_L_R']=(L*s3,R*s3)
        seg['arm_L']=arm; seg['arm_R']=arm
        seg['leg_L']=v['leg_L']*s3; seg['leg_R']=v['leg_R']*s3
        Lf=OL_BOOT['L_m'][i]*scale; W=OL_BOOT['W_m'][i]*scale; Hf=OL_BOOT['H_px']*S*scale
        foot=OL_BOOT['fill'][i]*Lf*W*Hf
        seg['feet']=2*foot; seg['foot_dims']=dict(W_m=W,L_m=Lf,H_m=Hf,fill=OL_BOOT['fill'][i])
        seg['sole_m2']=OL_BOOT['sole_c'][i]*Lf*W
        seg['tail_visible']=(v['tail_core']+v['tail_tuft']*TUFT_PACKING[i])*s3
        seg['tail_hidden']=OL_HIDDEN_TAIL_M3[i]*s3
        seg['tail']=seg['tail_visible']+seg['tail_hidden']
    seg['total']=sum(seg[k] for k in ('head_neck','torso','arm_L','arm_R','leg_L','leg_R','feet','tail'))
    return seg

R={}
for fig in ('rex','ollie'):
    d={}
    for which in 'clh': d[which]=vols(fig,which)
    d['erode1']=vols(fig,'c',-1); d['dilate1']=vols(fig,'c',+1)
    if fig=='ollie': d['erode2']=vols(fig,'c',-2)
    R[fig]=d
pickle.dump(R,open('final_raw.pkl','wb'))

# ---------------------------------------------------------------- assemble + uncertainty
RHO=(1035.0,985.0,1070.0)
SCALE_ERR=math.hypot(REX_GROUND_ERR,2.0)/rex_hpx     # fractional linear scale error from Rex's px height
out={}
for fig in ('rex','ollie'):
    d=R[fig]
    c=assemble(fig,d['c'],'c'); l=assemble(fig,d['l'],'l'); h=assemble(fig,d['h'],'h')
    e1=assemble(fig,d['erode1'],'c'); d1=assemble(fig,d['dilate1'],'c')
    Vc=c['total']
    f_depth_lo=l['total']/Vc; f_depth_hi=h['total']/Vc          # depth ratios + fullness + feet + hidden + tail factors + arm-view
    f_mask_lo=(assemble(fig,d['erode2'],'c')['total'] if fig=='ollie' else e1['total'])/Vc
    f_mask_hi=d1['total']/Vc
    f_scale_lo=(1-SCALE_ERR)**3; f_scale_hi=(1+SCALE_ERR)**3
    f_persp_lo=0.94 if fig=='ollie' else 1.0                  # Ollie ~2% nearer the camera (floor rows 807 vs 798)
    lo_terms=[math.log(x) for x in (f_depth_lo,f_mask_lo,f_scale_lo,f_persp_lo)]
    hi_terms=[math.log(x) for x in (f_depth_hi,f_mask_hi,f_scale_hi)]
    V_lo=Vc*math.exp(-math.sqrt(sum(t*t for t in lo_terms))); V_hi=Vc*math.exp(math.sqrt(sum(t*t for t in hi_terms)))
    V_lo_stack=Vc*f_depth_lo*f_mask_lo*f_scale_lo*f_persp_lo; V_hi_stack=Vc*f_depth_hi*f_mask_hi*f_scale_hi
    r_lo=math.log(RHO[1]/RHO[0]); r_hi=math.log(RHO[2]/RHO[0])
    M_c=Vc*RHO[0]
    M_lo=Vc*RHO[0]*math.exp(-math.sqrt(sum(t*t for t in lo_terms)+r_lo**2))
    M_hi=Vc*RHO[0]*math.exp(math.sqrt(sum(t*t for t in hi_terms)+r_hi**2))
    body=rex_body if fig=='rex' else ol_body
    front=float(body.sum())*S*S
    out[fig]=dict(central=c,low=l,high=h,Vc=Vc,V_lo=V_lo,V_hi=V_hi,V_lo_stack=V_lo_stack,V_hi_stack=V_hi_stack,
                  factors=dict(depth=(f_depth_lo,f_depth_hi),mask=(f_mask_lo,f_mask_hi),scale=(f_scale_lo,f_scale_hi),persp_lo=f_persp_lo),
                  M_c=M_c,M_lo=M_lo,M_hi=M_hi,M_lo_stack=V_lo_stack*RHO[1],M_hi_stack=V_hi_stack*RHO[2],front_m2=front,
                  regions_c=d['c'])
pickle.dump(out,open('final_out.pkl','wb'))
for fig,o in out.items():
    print('=====',fig)
    for k,v in o['central'].items():
        if isinstance(v,float): print('  %-14s c %.4f  l %.4f  h %.4f'%(k,v,o['low'][k],o['high'][k]))
        else: print('  ',k,v)
    print('  V c %.3f  range(quad) %.3f-%.3f  stacked %.3f-%.3f'%(o['Vc'],o['V_lo'],o['V_hi'],o['V_lo_stack'],o['V_hi_stack']))
    print('  factors',{k:tuple(round(x,3) for x in (v if isinstance(v,tuple) else (v,))) for k,v in o['factors'].items()})
    print('  M c %.0f  range %.0f-%.0f  stacked %.0f-%.0f'%(o['M_c'],o['M_lo'],o['M_hi'],o['M_lo_stack'],o['M_hi_stack']))
    print('  frontal area m2 %.3f'%o['front_m2'])
print('S m/px',S,'scale err',SCALE_ERR)
