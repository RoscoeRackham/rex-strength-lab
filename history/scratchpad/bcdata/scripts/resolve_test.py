import json, math, sys
d=json.load(open(sys.argv[1])); B={b['id']:b for b in d['builds']}; F=d['facts']
SITES=['chest','waist','arm_flexed','forearm','thigh','calf','neck']
PMAP={'chest':'chest','waist':'waist_omphalion','arm_flexed':'biceps_flexed','forearm':'forearm_flexed','thigh':'thigh_upper','calf':'calf','neck':'neck'}
def pred(sex,s,W,H):
    v=F['ansur2_girth_predictor_%s'%('male' if sex=='M' else 'female')]['values']; k=PMAP[s]
    return v[k+'_A']*W**v[k+'_p_weight']*H**v[k+'_q_height']/100
def girth(bid,s,W=None,H=None,depth=0):
    b=B[bid]; H=H or b['height_m']['value']; W=W or (b.get('girth_basis_weight_kg') or b['weight_kg']['value'])
    g=b['girths'][s]
    if g['value_m'] is not None:
        # scale own girth geometrically if W/H differ
        W0=b.get('girth_basis_weight_kg') or b['weight_kg']['value']; H0=b['height_m']['value']
        return g['value_m']*math.sqrt((W/H)/(W0/H0)), 'own' if depth==0 else 'derived'
    t=b['template']; assert t, (bid,s); assert depth<4
    T=B[t['build_id']]
    if t['method']=='ansur_predictor': return pred(b['sex'],s,W,H),'derived'
    if t['method']=='isometric':
        gt,_=girth(T['id'],s,depth=depth+1); return gt*H/T['height_m']['value'],'derived'
    Wt=T.get('girth_basis_weight_kg') or T['weight_kg']['value']; Ht=T['height_m']['value']
    gt,_=girth(T['id'],s,depth=depth+1)
    return gt*math.sqrt((W/H)/(Wt/Ht)),'derived'
for b in d['builds']:
    row=[]
    for s in SITES:
        v,src=girth(b['id'],s); row.append(('%5.1f'%(v/0.0254))+('*' if src!='own' else ' '))
    print('%-26s %s'%(b['id'],' '.join(row)))
print('inches; * = derived from template')
