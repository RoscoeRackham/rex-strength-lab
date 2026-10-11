"""Checker: independent slicer on Method A's (visually verified) region masks.
Re-derives A's region volumes with A's k values (arithmetic check), then applies the checker's assumptions."""
import pickle, math, json, sys
import numpy as np
from scipy import ndimage as ndi
D='/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/mass/'
rex_r, ol_r = pickle.load(open(D+'regions.pkl','rb'))
rex_body=np.load(D+'rex_body.npy'); ol_body=np.load(D+'ol_body.npy')

def rows_profile(mask, angle_deg=0.0):
    """rotate so the limb axis (angle from vertical, + = lower end to the right) is vertical, then return per-row
    list of run widths and mean original y of each row"""
    ys,xs=np.nonzero(mask)
    if angle_deg!=0:
        a=math.radians(angle_deg)
        # axis direction (sin a, cos a) in (x,y); perpendicular (cos a, -sin a)
        u=xs*math.sin(a)+ys*math.cos(a)        # along-axis coordinate
        v=xs*math.cos(a)-ys*math.sin(a)        # across-axis coordinate
        # rasterise into a supersampled grid (0.5 px) to avoid holes
        pts=[]
        for dx in (-0.25,0.25):
            for dy in (-0.25,0.25):
                pts.append(((xs+dx)*math.sin(a)+(ys+dy)*math.cos(a),(xs+dx)*math.cos(a)-(ys+dy)*math.sin(a)))
        U=np.concatenate([p[0] for p in pts]); V=np.concatenate([p[1] for p in pts])
        Ui=np.floor(U*2).astype(int); Vi=np.floor(V*2).astype(int)
        Ui-=Ui.min(); Vi-=Vi.min()
        g=np.zeros((Ui.max()+1,Vi.max()+1),bool); g[Ui,Vi]=True
        g=ndi.binary_closing(g,iterations=1)
        prof=[]
        for i in range(g.shape[0]):
            lab,n=ndi.label(g[i])
            if n: prof.append(np.array(ndi.sum(g[i],lab,range(1,n+1)))/2.0)
            else: prof.append(np.array([]))
        return prof, 0.5     # row pitch 0.5 px
    prof=[];yv=[]
    for y in range(mask.shape[0]):
        r=mask[y]
        if not r.any(): continue
        lab,n=ndi.label(r); prof.append((y,np.array(ndi.sum(r,lab,range(1,n+1)))))
    return prof, 1.0

def vol_rows(mask, kfun):
    prof,_=rows_profile(mask,0)
    return sum(math.pi/4*kfun(y)*float((w**2).sum()) for y,w in prof)
def vol_rot(mask, k, ang):
    if ang==0: return vol_rows(mask,lambda y:k)
    prof,p=rows_profile(mask,ang)
    return sum(math.pi/4*k*float((w**2).sum())*p for w in prof)

# --------------------------------------------------------------- scale (checker's own readings)
REX_TOP=8.5;  REX_GROUND=798.5      # crest tip; floor under ankles (far heel ~792, near ankle ~805)
OL_HORN=13.0; OL_HAIR=24.0; OL_SKULL=34.0; OL_GROUND=807.0
REX_SKULL=41.0
S=3.048/(REX_GROUND-REX_TOP); S3=S**3
print('S m/px %.6f'%S)
H=dict(rex_px=REX_GROUND-REX_TOP, rex_skull_px=REX_GROUND-REX_SKULL,
       ol_px=OL_GROUND-OL_HORN, ol_hair_px=OL_GROUND-OL_HAIR, ol_skull_px=OL_GROUND-OL_SKULL)
H.update({k.replace('_px','_m'):round(v*S,3) for k,v in H.items()})
print(H)

# --------------------------------------------------------------- 1. arithmetic check of A's region volumes
ANG={'rex':{'arm_L_upper':-6,'arm_L_fore':-16,'arm_L_hand':0,'arm_R_upper':16,'arm_R_fore':8,'arm_R_hand':0,'leg_L':-3,'leg_R':13},
     'ollie':{'arm_L_upper':-45,'arm_L_fore':60,'arm_L_fist':0,'arm_R_upper':16,'arm_R_fore':-35,'arm_R_fist':0,'leg_L':-22,'leg_R':6}}
SA=3.048/790
def zone(z):
    def f(y):
        for ymax,k in z:
            if y<ymax: return k
        return z[-1][1]
    return f
chk={}
for fig,regs,kA in (('rex',rex_r,{'arm_L_upper':1.0,'arm_L_fore':0.9,'arm_L_hand':0.6,'arm_R_upper':1.0,'arm_R_fore':0.9,'arm_R_hand':0.6,'leg_L':1,'leg_R':1}),
                    ('ollie',ol_r,{'arm_L_upper':1.0,'arm_L_fore':0.9,'arm_L_fist':0.75,'arm_R_upper':1.0,'arm_R_fore':0.9,'arm_R_fist':0.75,'leg_L':1,'leg_R':1})):
    c={}
    for n,k in kA.items(): c[n]=vol_rot(regs[n],k,ANG[fig][n])*SA**3
    if fig=='rex':
        c['torso_k_A']=vol_rows(regs['torso'],zone([(290,0.90),(400,0.75),(9999,0.72)]))*SA**3
        c['head_neck_kA']=vol_rows(regs['head_neck'],lambda y:1.05)*SA**3
    else:
        c['torso_k_A']=vol_rows(regs['torso'],zone([(270,0.90),(390,0.72),(9999,0.72)]))*SA**3
        c['head_kA']=vol_rows(regs['head'],lambda y:1.25)*SA**3
        c['neck_kA']=vol_rows(regs['neck'],lambda y:1.0)*SA**3
    chk[fig]={k:round(v,4) for k,v in c.items()}
print('A arithmetic re-check (independent slicer, A scale):'); print(json.dumps(chk,indent=0))
json.dump(chk,open(D+'checker/A_recheck.json','w'),indent=1)

# --------------------------------------------------------------- 2. checker's model on the same regions, checker scale S
def lin(y0,k0,y1,k1):
    return lambda y: k0 if y<=y0 else (k1 if y>=y1 else k0+(k1-k0)*(y-y0)/(y1-y0))
def prof_k(chest, waist, crotch, y_chest_end, y_waist_start, y_pelvis_taper, y_crotch):
    c=lin(y_chest_end,chest,y_waist_start,waist); p=lin(y_pelvis_taper,waist,y_crotch,crotch)
    return lambda y: c(y) if y<y_waist_start else p(y)
Z={'rex':dict(y_chest_end=300,y_waist_start=345,y_pelvis_taper=470,y_crotch=525),
   'ollie':dict(y_chest_end=280,y_waist_start=330,y_pelvis_taper=470,y_crotch=540)}
KSET={'c':(1.10,0.80,0.60),'l':(0.90,0.70,0.50),'h':(1.25,0.90,0.70)}
torso={}
for fig,regs in (('rex',rex_r),('ollie',ol_r)):
    t={w:vol_rows(regs['torso'],prof_k(*KSET[w],**Z[fig]))*S3 for w in 'clh'}
    # zone split at central k for the breakdown
    zc=prof_k(*KSET['c'],**Z[fig]); prof,_=rows_profile(regs['torso'],0)
    t['chest_zone']=sum(math.pi/4*zc(y)*float((w**2).sum()) for y,w in prof if y<Z[fig]['y_waist_start'])*S3
    t['waist_pelvis_zone']=t['c']-t['chest_zone']
    # what B's chest k (0.66 to y330, 0.80 waist, 0.84->0.66 pelvis) and A's profile give on the same pixels
    t['B_profile']=vol_rows(regs['torso'],prof_k(0.66,0.80,0.66,**Z[fig]))*S3
    t['A_profile']=vol_rows(regs['torso'],zone([(290 if fig=='rex' else 270,0.90*1.07),(400 if fig=='rex' else 390,(0.75 if fig=='rex' else 0.72)*1.07),(9999,0.72*1.07)]))*S3
    torso[fig]={k:round(v,4) for k,v in t.items()}
print('torso',json.dumps(torso))

# arms
arms={}
r=rex_r
armR=dict(upper=vol_rot(r['arm_R_upper'],0.90,16)*S3, fore=vol_rot(r['arm_R_fore'],0.85,8)*S3, hand=vol_rot(r['arm_R_hand'],0.6,0)*S3)
armL=dict(upper=vol_rot(r['arm_L_upper'],0.90,-6)*S3, fore=vol_rot(r['arm_L_fore'],0.85,-16)*S3, hand=vol_rot(r['arm_L_hand'],0.6,0)*S3)
arms['rex']=dict(imgR=armR,imgL=armL,each_mirror=sum(armR.values()),each_mean=(sum(armR.values())+sum(armL.values()))/2)
o=ol_r
# Ollie: fur fringe ~3 px each side on the akimbo arm -> erode 2 px (mask halo + fur)
ero=lambda m,d=2: ndi.binary_erosion(m,iterations=d)
olL=dict(upper=vol_rot(ero(o['arm_L_upper']),0.95,-45)*S3, fore=vol_rot(ero(o['arm_L_fore']),0.85,60)*S3, fist=vol_rot(ero(o['arm_L_fist']),0.75,0)*S3)
olL_raw=dict(upper=vol_rot(o['arm_L_upper'],1.0,-45)*S3, fore=vol_rot(o['arm_L_fore'],0.9,60)*S3, fist=vol_rot(o['arm_L_fist'],0.75,0)*S3)
olR=dict(upper=vol_rot(o['arm_R_upper'],0.95,16)*S3, fore=vol_rot(o['arm_R_fore'],0.85,-35)*S3, fist=vol_rot(o['arm_R_fist'],0.75,0)*S3)
arms['ollie']=dict(imgL=olL,imgL_noerode_Ak=olL_raw,imgR=olR,each_mirror=sum(olL.values()),each_mean=(sum(olL.values())+sum(olR.values()))/2)
print('arms',json.dumps({f:{k:(round(v,4) if isinstance(v,float) else {a:round(b,4) for a,b in v.items()}) for k,v in d.items()} for f,d in arms.items()}))

# legs (k 1.0 thigh/knee; pants counted as body per brief), heads
legs={'rex':(vol_rot(r['leg_L'],1.0,-3)+vol_rot(r['leg_R'],1.0,13))*S3,
      'ollie':(vol_rot(o['leg_L'],1.0,-22)+vol_rot(o['leg_R'],1.0,6))*S3}
legs_ollie_eroded=(vol_rot(ero(o['leg_L'],1),1.0,-22)+vol_rot(ero(o['leg_R'],1),1.0,6))*S3
head={'rex':vol_rows(r['head_neck'],lambda y:1.05)*S3+0.0018,
      'ollie_A':(vol_rows(o['head'],lambda y:1.25)+vol_rows(o['neck'],lambda y:1.0))*S3+0.0027,
      'ollie_k11_below110':None}
# Ollie head: A's polygon includes the vest collar at y 105-125; use k 1.1 and cut rows >=110 to the chin width
oh=o['head'].copy(); 
head['ollie_k11']=(vol_rows(oh,lambda y:1.1)+vol_rows(o['neck'],lambda y:1.0))*S3+0.0027
print('legs',{k:round(v,4) for k,v in legs.items()},'ollie legs eroded 1px',round(legs_ollie_eroded,4))
print('head',{k:(round(v,4) if v else v) for k,v in head.items()})

# tail visible: A's local-thickness value (0.0998 at A scale, k0.8) rescaled; distance factor for floor-lying tail
tail_vis_lt=0.0998*(S/SA)**3
print('tail visible LT (k0.8) at checker scale',round(tail_vis_lt,4))
# frontal areas
fa={'rex':float(rex_body.sum())*S*S,'ollie':float(ol_body.sum())*S*S,
    'rex_tail':float(rex_r['tail'].sum())*S*S,'ollie_tuft':float(ol_r['tail'].sum())*S*S}
print('frontal',{k:round(v,3) for k,v in fa.items()}, 'px',int(rex_body.sum()),int(ol_body.sum()))
pickle.dump(dict(S=S,H=H,torso=torso,arms=arms,legs=legs,head=head,tail_vis_lt=tail_vis_lt,fa=fa),open(D+'checker/check_parts.pkl','wb'))
