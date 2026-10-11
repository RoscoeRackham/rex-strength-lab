import json, pickle, math
O=pickle.load(open('report.pkl','rb'))
S=3.048/790
def r(x,n=4): return round(float(x),n)
res={'method':'A: pixel silhouette slices (see compute.py, run_all.py, final.py, report.py)',
     'image':'/root/.claude/uploads/6435a7db-fe21-5f3b-bca9-e49ba2609387/89c1d7ad-image.jpg',
     'scale':{'rex_ground_row':798,'rex_crest_top_row':8,'rex_skull_top_row':40,'rex_height_px':790,'m_per_px':S,
              'ollie_ground_row':807,'ollie_horn_top_row':11,'ollie_hair_top_row':24,'ollie_skull_top_row':34},
     'density_kg_m3':{'central':1030,'low':980,'high':1065}}
for fig,o in O.items():
    seg=o['seg']
    d={'volume_m3':{'central':r(o['Vc'],3),'low':r(o['V_lo'],3),'high':r(o['V_hi'],3),'low_all_extremes':r(o['V_lo_stack'],3),'high_all_extremes':r(o['V_hi_stack'],3)},
       'mass_kg':{'central':round(o['M_c']),'low':round(o['M_lo']),'high':round(o['M_hi']),'low_all_extremes':round(o['M_lo_stack']),'high_all_extremes':round(o['M_hi_stack'])},
       'segments_m3':{k:r(seg[k]) for k in ('head_neck','torso','arm_L','arm_R','leg_L','leg_R','feet','tail_visible','tail_hidden','tail','total')},
       'arm_views_m3_imageleft_imageright':[r(x) for x in seg['arm_views']],
       'foot_model':seg['foot_dims'],'foot_sole_m2':{'central':r(seg['sole_m2'],3),'low':r(o['sole_lo'],3),'high':r(o['sole_hi'],3)},
       'frontal_area_m2':r(o['front_m2'],3),
       'uncertainty_factors_on_volume':{k:[r(a,3),r(b,3)] for k,(a,b) in o['factors'].items()},
       'regions':{k:{kk:(float(vv) if not isinstance(vv,str) else vv) for kk,vv in v.items()} for k,v in o['regdims'].items()}}
    res[fig]=d
res['rex']['height']={'px':790,'m':3.048,'skull_px':758,'skull_m':r(758*S,3)}
res['ollie']['height']={'px':796,'m':r(796*S,3),'hair_top_px':783,'hair_top_m':r(783*S,3),'skull_px':773,'skull_m':r(773*S,3),
                        'note':'in boots; ~7 cm lug sole. Floor-row perspective correction (Ollie ~2% nearer camera) would give ~3.01 m'}
json.dump(res,open('results_methodA.json','w'),indent=1)
print(json.dumps({f:{'V':res[f]['volume_m3'],'M':res[f]['mass_kg'],'seg':res[f]['segments_m3'],'sole':res[f]['foot_sole_m2'],'front':res[f]['frontal_area_m2'],'h':res[f]['height']} for f in ('rex','ollie')},indent=1))
