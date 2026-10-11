"""METHOD B - segment solids for Rex and Ollie from the reference picture.
Hand-measured segment geometry lives in segdefs.py; silhouette mask from seg3.py (method_b/mask.npy).
Run: python3 method_b.py  -> results_method_b.json"""
import sys, json, math
D='/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/mass/method_b'
sys.path.insert(0,D)
import numpy as np, geom, segdefs as S
OUT=D+'/results_method_b.json'

# ---------------- scale (owner's ruling: Rex = 3.048 m soles -> crest tip) ----------------
REX_H_M=3.048
rex_h_px=S.REX_GROUND-S.REX_TOP_CREST
MPP=REX_H_M/rex_h_px
PX3=MPP**3; PX2=MPP**2

# ---------------- assumed ratios: (central, low, high) ~ 90% interval ----------------
K=dict(
  chest=(0.66,0.58,0.80), waist=(0.80,0.70,0.88), pelvis_top=(0.84,0.74,0.92), crotch=(0.66,0.58,0.76),
  thigh=(1.00,0.88,1.12), shank=(0.95,0.85,1.08), upper_arm=(0.90,0.75,1.05), forearm=(0.85,0.70,1.00),
  neck=(1.00,0.85,1.10),
  rex_head_len=(1.40,1.20,1.60), ollie_head_len=(1.32,1.20,1.45),
  rex_hand_thick=(0.50,0.38,0.65), ollie_fist_depth=(0.85,0.70,1.00),
  rex_foot_len=(1.30,1.00,1.70), rex_foot_fill=(0.48,0.40,0.56),
  boot_len=(2.30,1.90,2.70), boot_fill=(0.45,0.38,0.52),
  tail_ratio=(0.90,0.75,1.05), tail_root_m=(0.58,0.48,0.70), tail_hidden_m=(1.45,1.20,1.75), tail_persp=(1.00,0.955,1.06),
)
DEPTH_KEYS=['chest','waist','pelvis_top','crotch','thigh','shank','upper_arm','forearm','neck']
DENS=(1060.0,1010.0,1085.0)   # kg/m^3 central, low, high (whole body incl. lung/gut gas)
def P(mode):
    i=dict(c=0,l=1,h=2)[mode]; return {k:v[i] for k,v in K.items()}

# ---------------- precomputed geometry (independent of assumed ratios) ----------------
def trunk_base(edges,zones):
    ys=np.array([e[0] for e in edges],float); w=np.array([e[2]-e[1] for e in edges],float)
    y=np.arange(ys[0],ys[-1]+0.5,1.0); return dict(y=y,w=np.interp(y,ys,w),zones=zones)
def trunk_vol(b,p):
    y,w,z=b['y'],b['w'],b['zones']; c0,c1=z['chest']; w0,w1=z['waist']; p0,p1=z['pelvis']
    ky=np.interp(y,[c0,c0+0.8*(c1-c0),w1,p0+(p1-p0)/3,p1],[p['chest'],p['chest'],p['waist'],p['pelvis_top'],p['crotch']])
    return {nm:geom.stack_volume(y[(y>=a)&(y<=bb)],w[(y>=a)&(y<=bb)],ky[(y>=a)&(y<=bb)])*PX3 for nm,(a,bb) in z.items()}
def leg_base(st):
    ys=np.array([s[0] for s in st],float); y=np.arange(ys[0],ys[-1]+0.5,1.0)
    return [geom.stack_volume(y,np.interp(y,ys,np.array([s[i] for s in st],float)),1.0)*PX3 for i in (1,2)]
def arm_base(fig,arm,shrink=0.0):
    out={}; prof={}
    for part in ('upper','fore'):
        if part not in arm: continue
        m=fig&geom.poly_mask(arm[part]['poly']); s,w=geom.axis_widths(m,*arm[part]['axis'],shrink=shrink)
        out[part]=geom.stack_volume(s,w,1.0)*PX3
        idx=np.linspace(0,len(s)-1,6).astype(int)
        prof[part]=dict(axis_px=arm[part]['axis'],length_px=round(float(s[-1]),1),length_m=round(float(s[-1])*MPP,3),
                        widths_px_0_20_40_60_80_100pct=[round(float(w[i]),1) for i in idx],
                        mean_width_px=round(float(w[w>0].mean()),1),mean_width_m=round(float(w[w>0].mean())*MPP,3))
    if 'hand' in arm:
        m=fig&geom.poly_mask(arm['hand']['poly']); s,w=geom.axis_widths(m,*arm['hand']['axis'])
        area=float(m.sum()); wm=float(w[w>0].mean())
        out['hand_unit']=area*wm*0.75*PX3     # x thickness/width ratio
        prof['hand']=dict(silhouette_px2=area,mean_width_px=round(wm,1),length_px=round(float(s[-1]),1),fill=0.75)
    return out,prof

REXB=dict(trunk=trunk_base(S.REX_TRUNK,S.REX_ZONES),thigh=leg_base(S.REX_THIGH),shank=leg_base(S.REX_SHANK))
REXB['RA'],REXB['RA_prof']=arm_base(geom.REX,S.REX_RA); REXB['LA'],REXB['LA_prof']=arm_base(geom.REX,S.REX_LA)
OLB=dict(trunk=trunk_base(S.OLLIE_TRUNK,S.OLLIE_ZONES),thigh=leg_base(S.OLLIE_THIGH),shank=leg_base(S.OLLIE_SHANK))
FUR=3.0
OLB['LA'],OLB['LA_prof']=arm_base(geom.OLLIE,S.OLLIE_LA,FUR); OLB['RA'],OLB['RA_prof']=arm_base(geom.OLLIE,S.OLLIE_RA,FUR)

def rex_tail(p):
    pf=p['tail_persp']; diams=[c*math.cos(math.radians(sl))*MPP*pp*pf for (_,c,sl,pp) in S.REX_TAIL_STATIONS]
    lens=[a*MPP*sc*pf for a,sc in zip(S.REX_TAIL_ARCS,[1.10]+[1.13]*7)]
    hid=p['tail_hidden_m']-lens[0]
    Vh=geom.frustum_chain([hid],[p['tail_root_m'],diams[0]],p['tail_ratio']); Vv=geom.frustum_chain(lens,diams,p['tail_ratio'])
    return Vh+Vv, dict(root_diam_m=p['tail_root_m'],hidden_len_root_to_x1060_m=round(hid,3),
                       visible_diams_m_at_x1060_1100_1140_1180_1210_curl1_curl2_curl3_tip=[round(d,3) for d in diams],
                       visible_arcs_m=[round(l,3) for l in lens],total_len_m=round(hid+sum(lens),2),width_over_height=p['tail_ratio'],
                       V_hidden_m3=round(Vh,4),V_visible_m3=round(Vv,4))

def rex_vol(p,arms='mirror',scale=1.0):
    seg={}; hd=S.REX_HEAD
    seg['head']=geom.ellipsoid(hd['height'],hd['breadth'],hd['breadth']*p['rex_head_len'])*PX3
    c=S.REX_CREST; seg['crest']=c['arc']*c['height']*c['thick']*c['fill']*PX3
    n=S.REX_NECK; seg['neck']=math.pi/4*n['diam']**2*p['neck']*n['length']*PX3
    for k,v in trunk_vol(REXB['trunk'],p).items(): seg['torso_'+k]=v
    # Rex faces the camera: image-right arm = his LEFT arm (fully visible); image-left = his RIGHT (partly behind Ollie)
    src_r=REXB['RA'] if arms=='mirror' else REXB['LA']
    for side,src in (('armL',REXB['RA']),('armR',src_r)):
        seg[side+'_upper']=src['upper']*p['upper_arm']; seg[side+'_fore']=src['fore']*p['forearm']; seg[side+'_hand']=src['hand_unit']*p['rex_hand_thick']
    seg['legR_thigh'],seg['legL_thigh']=[v*p['thigh'] for v in REXB['thigh']]   # image-left leg = his right
    seg['legR_shank'],seg['legL_shank']=[v*p['shank'] for v in REXB['shank']]
    f=S.REX_FOOT; vf=f['breadth']*f['breadth']*p['rex_foot_len']*f['height']*p['rex_foot_fill']*PX3
    seg['footL']=vf; seg['footR']=vf
    seg['tail']=rex_tail(p)[0]
    return {k:v*scale**3 for k,v in seg.items()}

def ollie_vol(p,arms='mirror',scale=1.0):
    seg={}; hd=S.OLLIE_HEAD
    seg['head']=geom.ellipsoid(hd['height'],hd['breadth'],hd['breadth']*p['ollie_head_len'])*PX3
    seg['horns_ears']=(sum(math.pi/12*h['base']**2*h['len'] for h in S.OLLIE_HORN)+S.OLLIE_EARS['n']*S.OLLIE_EARS['l']*S.OLLIE_EARS['w']*S.OLLIE_EARS['t']*S.OLLIE_EARS['fill'])*PX3
    n=S.OLLIE_NECK; seg['neck']=math.pi/4*n['diam']**2*p['neck']*n['length']*PX3
    for k,v in trunk_vol(OLB['trunk'],p).items(): seg['torso_'+k]=v
    fistL=geom.ellipsoid(S.OLLIE_LA_FIST['w'],S.OLLIE_LA_FIST['h'],p['ollie_fist_depth']*S.OLLIE_LA_FIST['w'])*1.1*PX3
    fistR=geom.ellipsoid(S.OLLIE_RA_FIST['w'],S.OLLIE_RA_FIST['h'],p['ollie_fist_depth']*S.OLLIE_RA_FIST['w'])*1.1*PX3
    srcR,fR=(OLB['LA'],fistL) if arms=='mirror' else (OLB['RA'],fistR)
    for side,src,fist in (('armR',OLB['LA'],fistL),('armL',srcR,fR)):   # Ollie's right arm = image-left arm
        seg[side+'_upper']=src['upper']*p['upper_arm']; seg[side+'_fore']=src['fore']*p['forearm']; seg[side+'_hand']=fist
    seg['legR_thigh'],seg['legL_thigh']=[v*p['thigh'] for v in OLB['thigh']]
    seg['legR_shank'],seg['legL_shank']=[v*p['shank'] for v in OLB['shank']]
    b=S.OLLIE_BOOT; vb=b['breadth']*b['breadth']*p['boot_len']*b['height']*p['boot_fill']*PX3
    seg['footL']=vb; seg['footR']=vb
    seg['tail']=(math.pi/4*22**2*(150+128)+geom.ellipsoid(95,175,60)*0.10)*PX3
    return {k:v*scale**3 for k,v in seg.items()}

def group(seg):
    g={'head+neck':0,'torso':0,'arm_right':0,'arm_left':0,'leg_right':0,'leg_left':0,'feet':0,'tail':0}
    for k,v in seg.items():
        if k in('head','crest','neck','horns_ears'): g['head+neck']+=v
        elif k.startswith('torso'): g['torso']+=v
        elif k.startswith('armR'): g['arm_right']+=v
        elif k.startswith('armL'): g['arm_left']+=v
        elif k.startswith('legR'): g['leg_right']+=v
        elif k.startswith('legL'): g['leg_left']+=v
        elif k.startswith('foot'): g['feet']+=v
        else: g['tail']+=v
    return g

# ---------------- Monte Carlo ----------------
def mc(fn,N=40000,seed=1,rho=0.85,meas_sd=0.03,scale_sd=0.006,model_sd=0.05,dens=DENS):
    rng=np.random.default_rng(seed)
    keys=list(K.keys())
    shared=rng.standard_normal(N)
    vols=np.empty(N); mass=np.empty(N)
    dens_s=rng.triangular(dens[1],dens[0],dens[2],N)
    Z={}
    for k in keys:
        e=rng.standard_normal(N)
        Z[k]=rho*shared+math.sqrt(1-rho*rho)*e if k in DEPTH_KEYS else e
    for i in range(N):
        p={}
        for k in keys:
            c,l,h=K[k]; z=Z[k][i]
            p[k]=c+z*((h-c) if z>0 else (c-l))/1.645
        sc=1+scale_sd*rng.standard_normal()
        seg=fn(p,scale=sc)
        g=group(seg)
        # independent width-measurement error per group: area ~ width^2
        v=sum(val*(1+meas_sd*rng.standard_normal())**2 for val in g.values())
        v*=(1+model_sd*rng.standard_normal())   # shape/model-form error (ellipse idealisation, occlusion)
        vols[i]=v; mass[i]=v*dens_s[i]
    q=lambda a,pc: float(np.percentile(a,pc))
    return dict(V_p5=q(vols,5),V_p50=q(vols,50),V_p95=q(vols,95),M_p5=q(mass,5),M_p50=q(mass,50),M_p95=q(mass,95),
                V_mean=float(vols.mean()),M_mean=float(mass.mean()))

# ---------------- frontal & sole areas ----------------
def frontal():
    out={}
    vis=float(geom.REX.sum())
    ra=sum(float((geom.REX&geom.poly_mask(S.REX_RA[q]['poly'])).sum()) for q in S.REX_RA)
    la=sum(float((geom.REX&geom.poly_mask(S.REX_LA[q]['poly'])).sum()) for q in S.REX_LA)
    out['rex']=dict(visible_px2=vis,visible_m2=vis*PX2,occluded_arm_added_px2=max(ra-la,0),frontAreaM2=(vis+max(ra-la,0))*PX2,
                    tail_px2=float((geom.REX&geom.poly_mask([(1046,470),(1262,470),(1262,770),(1046,770)])).sum()))
    vis=float(geom.OLLIE.sum())
    fist=lambda f: f['w']*f['h']*0.8
    la=sum(float((geom.OLLIE&geom.poly_mask(S.OLLIE_LA[q]['poly'])).sum()) for q in S.OLLIE_LA)+fist(S.OLLIE_LA_FIST)
    ra=sum(float((geom.OLLIE&geom.poly_mask(S.OLLIE_RA[q]['poly'])).sum()) for q in S.OLLIE_RA)+fist(S.OLLIE_RA_FIST)
    tuft=float((geom.OLLIE&geom.poly_mask([(70,490),(175,490),(175,675),(70,675)])).sum())
    out['ollie']=dict(visible_px2=vis,visible_m2=vis*PX2,occluded_arm_added_px2=max(la-ra,0),tuft_px2=tuft,
                      frontAreaM2=(vis+max(la-ra,0)-0.5*tuft)*PX2)
    return out
SOLE=dict(rex=dict(c=0.65,l=0.55,h=0.75),boot=dict(c=0.72,l=0.62,h=0.82))
def soles():
    f=S.REX_FOOT; b=S.OLLIE_BOOT
    rb=f['breadth']*0.95  # sole breadth slightly under the toe spread
    rex={m:rb*f['breadth']*K['rex_foot_len'][i]*SOLE['rex'][m]*PX2 for i,m in enumerate('clh')}
    ob=b['breadth']*0.95
    ol={m:ob*b['breadth']*K['boot_len'][i]*SOLE['boot'][m]*PX2 for i,m in enumerate('clh')}
    return dict(rex=rex,ollie=ol)

if __name__=='__main__':
    res=dict(mPerPx=MPP,ratios=K,density=DENS)
    res['heights']=dict(
      rex=dict(heightPx=rex_h_px,heightM=REX_H_M,heightPxSkull=S.REX_GROUND-S.REX_TOP_SKULL,heightSkullM=(S.REX_GROUND-S.REX_TOP_SKULL)*MPP),
      ollie=dict(heightPx=S.OLLIE_GROUND-S.OLLIE_TOP_HORN,heightM=(S.OLLIE_GROUND-S.OLLIE_TOP_HORN)*MPP,
                 heightPxSkull=S.OLLIE_GROUND-S.OLLIE_TOP_SKULL,heightSkullM=(S.OLLIE_GROUND-S.OLLIE_TOP_SKULL)*MPP,
                 heightPxHair=S.OLLIE_GROUND-S.OLLIE_TOP_HAIR,heightHairM=(S.OLLIE_GROUND-S.OLLIE_TOP_HAIR)*MPP))
    res['frontal']=frontal(); res['soles']=soles()
    for name,fn,B in (('rex',rex_vol,REXB),('ollie',ollie_vol,OLB)):
        r={}
        for mode in 'clh':
            seg=fn(P(mode)); r[mode]=dict(total=sum(seg.values()),groups=group(seg),segments=seg)
        r['visible_arms_central_total']=sum(fn(P('c'),arms='visible').values())
        r['arm_profiles']=dict(fully_visible=B['RA_prof'] if name=='rex' else B['LA_prof'],
                               partly_hidden=B['LA_prof'] if name=='rex' else B['RA_prof'])
        r['mc']=mc(fn)
        r['mc_visible_arms']=mc(lambda p,scale=1.0: fn(p,arms='visible',scale=scale),N=20000,seed=2)
        if name=='rex': r['tail_detail']=rex_tail(P('c'))[1]
        res[name]=r
    json.dump(res,open(OUT,'w'),indent=1,default=lambda o: o.tolist() if hasattr(o,'tolist') else float(o))
    for name in ('rex','ollie'):
        r=res[name]
        print(f"{name.upper()}  V: central {r['c']['total']:.3f}  all-low {r['l']['total']:.3f}  all-high {r['h']['total']:.3f} | visible-arms {r['visible_arms_central_total']:.3f}")
        print('   MC V p5/p50/p95 %.3f %.3f %.3f   M p5/p50/p95 %.0f %.0f %.0f'%(r['mc']['V_p5'],r['mc']['V_p50'],r['mc']['V_p95'],r['mc']['M_p5'],r['mc']['M_p50'],r['mc']['M_p95']))
        print('   MC(visible arms) M p5/p50/p95 %.0f %.0f %.0f'%(r['mc_visible_arms']['M_p5'],r['mc_visible_arms']['M_p50'],r['mc_visible_arms']['M_p95']))
        for g,v in r['c']['groups'].items(): print('     %-10s %.4f  (low %.4f high %.4f)'%(g,v,r['l']['groups'][g],r['h']['groups'][g]))
    print(json.dumps(res['heights'],indent=1)); print(json.dumps(res['frontal'],indent=1)); print(json.dumps(res['soles'],indent=1))
