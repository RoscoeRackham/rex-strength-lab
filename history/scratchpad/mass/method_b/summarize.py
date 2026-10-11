import json
D='/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/mass/method_b/'
r=json.load(open(D+'results_method_b.json'))
dc,dl,dh=r['density']
out=dict(method='B (segment solids, hand-measured, elliptic-section stacks/ellipsoids/frustums)',mPerPx=r['mPerPx'],density=dict(central=dc,low=dl,high=dh))
for f in ('rex','ollie'):
    x=r[f]; h=r['heights'][f]
    out[f]=dict(heights=h,volumeM3=x['c']['total'],volumeLowM3_p5=x['mc']['V_p5'],volumeHighM3_p95=x['mc']['V_p95'],
                volume_all_low_extreme=x['l']['total'],volume_all_high_extreme=x['h']['total'],
                massKg=x['c']['total']*dc,massLowKg_p5=x['mc']['M_p5'],massHighKg_p95=x['mc']['M_p95'],
                mass_extreme_low=x['l']['total']*dl,mass_extreme_high=x['h']['total']*dh,
                groups_central=x['c']['groups'],groups_low=x['l']['groups'],groups_high=x['h']['groups'],segments_central=x['c']['segments'],
                visible_arms_alternative=dict(volumeM3=x['visible_arms_central_total'],mass_p5_p50_p95=[x['mc_visible_arms']['M_p5'],x['mc_visible_arms']['M_p50'],x['mc_visible_arms']['M_p95']]),
                frontal=r['frontal'][f],footSoleM2=r['soles'][f])
    if f=='rex': out[f]['tail_detail']=x['tail_detail']
out['sanity']=dict(avg_man_scaled_kg=75*(3.048/1.75)**3,bodybuilder_135kg_1p78m_scaled_kg=135*(3.048/1.78)**3,
                   heavyweight_100kg_1p75m_scaled_kg=100*(3.048/1.75)**3)
json.dump(out,open(D+'results.json','w'),indent=1)
print(json.dumps({f:{k:(round(v,3) if isinstance(v,float) else v) for k,v in out[f].items() if k in('volumeM3','volumeLowM3_p5','volumeHighM3_p95','massKg','massLowKg_p5','massHighKg_p95','mass_extreme_low','mass_extreme_high','footSoleM2')} for f in ('rex','ollie')},indent=1))
print(out['sanity'])
