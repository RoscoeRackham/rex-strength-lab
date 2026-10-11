"""Checker's reconciled estimate. Geometry = Method A's verified region masks re-sliced by check_vol.py's independent
slicer; corrections: arms mirrored from the fully visible arm, chest k from ANSUR circumference evidence, pelvis
tapered to the crotch, tail distance/hidden-root model, density from Fry 1987 + lung-gas scaling."""
import pickle, math, json
import numpy as np
from scipy import ndimage as ndi
exec(open('/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/mass/checker/check_vol.py').read().split('# --------------------------------------------------------------- 1.')[0])
P=pickle.load(open(D+'checker/check_parts.pkl','rb'))
def lin(y0,k0,y1,k1):
    return lambda y: k0 if y<=y0 else (k1 if y>=y1 else k0+(k1-k0)*(y-y0)/(y1-y0))
def prof_k(chest, waist, crotch, y_chest_end, y_waist_start, y_pelvis_taper, y_crotch):
    c=lin(y_chest_end,chest,y_waist_start,waist); p=lin(y_pelvis_taper,waist,y_crotch,crotch)
    return lambda y: c(y) if y<y_waist_start else p(y)
Z={'rex':dict(y_chest_end=300,y_waist_start=345,y_pelvis_taper=470,y_crotch=525),
   'ollie':dict(y_chest_end=280,y_waist_start=330,y_pelvis_taper=470,y_crotch=540)}
rng=np.random.default_rng(7); N=60000
def tri(lo,c,hi,u=None):
    u=rng.random(N) if u is None else u
    F=(c-lo)/(hi-lo)
    return np.where(u<F, lo+np.sqrt(u*(hi-lo)*(c-lo)), hi-np.sqrt((1-u)*(hi-lo)*(hi-c)))
def corr_u(u0,rho=0.8):
    from scipy.stats import norm
    z=rho*norm.ppf(u0)+math.sqrt(1-rho**2)*rng.standard_normal(N); return norm.cdf(z)

# torso basis integrals (linear in chest, waist, crotch k)
def basis(fig,regs):
    z=Z[fig]; out=[]
    for kk in ((1,0,0),(0,1,0),(0,0,1)):
        out.append(vol_rows(regs['torso'],prof_k(*kk,**z))*S3)
    return np.array(out)
Bt={'rex':basis('rex',rex_r),'ollie':basis('ollie',ol_r)}
CENT=dict(chest=1.05,waist=0.80,crotch=0.60)
res={}
for fig in ('rex','ollie'):
    u_depth=rng.random(N)
    kc=tri(0.90,1.05,1.25,u_depth); kw=tri(0.70,0.80,0.90,corr_u(u_depth)); kx=tri(0.50,0.60,0.70,corr_u(u_depth))
    torso=Bt[fig][0]*kc+Bt[fig][1]*kw+Bt[fig][2]*kx
    torso_c=float(Bt[fig]@np.array([CENT['chest'],CENT['waist'],CENT['crotch']]))
    kleg=tri(0.85,1.0,1.10,corr_u(u_depth))
    if fig=='rex':
        head=tri(0.06,0.09,0.105); head_c=0.09
        pouch=tri(0.004,0.009,0.013); pouch_c=0.009
        arm_each_c=P['arms']['rex']['each_mirror']            # 0.254 (k .90/.85/.6 on the fully visible arm)
        arms=2*arm_each_c*tri(0.71,1.0,1.10)                   # low end = mean of the two views (0.180 each)
        legs_c=P['legs']['rex']; legs=legs_c*kleg
        feet=tri(0.10,0.15,0.20); feet_c=0.15
        wh=tri(0.65,0.85,1.0)
        vis=0.0998/0.8*wh*tri(1.0,1.20,1.40)                  # LT volume at k=1 x w/h x (distance+foreshortening)
        root=tri(0.45,0.55,0.65); em=tri(0.42,0.46,0.50); L=tri(0.70,0.95,1.25)
        hid=math.pi/4*wh*L*(root**2+root*em+em**2)/3
        vis_c=0.0998/0.8*0.85*1.20; hid_c=math.pi/4*0.85*0.95*(0.55**2+0.55*0.46+0.46**2)/3
        tail=vis+hid; tail_c=vis_c+hid_c
        persp=np.ones(N); edge=tri(0.97,1.0,1.03)
        parts_c=dict(head_neck=head_c,torso=torso_c+pouch_c,arm_L=arm_each_c,arm_R=arm_each_c,legs=legs_c,feet=feet_c,
                     tail=tail_c,tail_visible=vis_c,tail_hidden=hid_c)
        V=head+torso+pouch+arms+legs+feet+tail
    else:
        head=tri(0.055,0.075,0.09); head_c=0.075
        arm_each_c=P['arms']['ollie']['each_mirror']          # 0.188 (akimbo arm, 2 px fur/halo erosion)
        arms=2*arm_each_c*tri(0.80,1.0,1.15)
        legs_c=P['legs']['ollie']; legs=legs_c*kleg
        feet=tri(0.05,0.07,0.09); feet_c=0.07
        tail=tri(0.006,0.010,0.016); tail_c=0.010
        persp=tri(0.95,1.0,1.0)                                 # Ollie's floor is 8.5 px lower: maybe ~1.6% nearer
        edge=tri(0.96,1.0,1.03)
        parts_c=dict(head_neck=head_c,torso=torso_c,arm_L=arm_each_c,arm_R=arm_each_c,legs=legs_c,feet=feet_c,tail=tail_c)
        V=head+torso+arms+legs+feet+tail
    scale=tri(0.992,1.0,1.008)**3
    mform=tri(0.92,1.0,1.08)        # elliptical-section model form / AI-render inconsistency
    V=V*scale*edge*persp*mform
    rho=tri(1020,1060,1080)
    M=V*rho
    Vc=sum(v for k,v in parts_c.items() if k not in ('tail_visible','tail_hidden'))
    q=lambda x,p:float(np.percentile(x,p))
    res[fig]=dict(parts_central=parts_c,V_central=Vc,M_central=Vc*1060,
                  V_p5=q(V,5),V_p50=q(V,50),V_p95=q(V,95),M_p5=q(M,5),M_p50=q(M,50),M_p95=q(M,95),
                  torso_basis=Bt[fig].tolist())
for f,r in res.items():
    print(f, {k:round(v,4) for k,v in r['parts_central'].items()})
    print('   V c %.3f  p5 %.3f p50 %.3f p95 %.3f | M c %.0f p5 %.0f p50 %.0f p95 %.0f'%(r['V_central'],r['V_p5'],r['V_p50'],r['V_p95'],r['M_central'],r['M_p5'],r['M_p50'],r['M_p95']))
json.dump(res,open(D+'checker/reconcile_raw.json','w'),indent=1)
