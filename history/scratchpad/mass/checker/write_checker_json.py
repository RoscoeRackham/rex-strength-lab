import json, pickle
D='/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/mass/'
r=json.load(open(D+'checker/reconcile_raw.json')); P=pickle.load(open(D+'checker/check_parts.pkl','rb'))
S=P['S']; H=P['H']
def r2(x): 
    import math; e=math.floor(math.log10(abs(x)))-1; return round(x,-e)
out={'role':'checker / reconciliation of methods A, B, C',
 'scale':{'rex_crest_row':8.5,'rex_ground_row':798.5,'rex_skull_row':41,'m_per_px':S,
          'ollie_horn_row':13,'ollie_hair_row':24,'ollie_skull_row':34,'ollie_ground_row':807},
 'heights':H,
 'density':{'central':1060,'low':1020,'high':1080,
            'basis':'Fry, Cisar & Housh 1987 (J Appl Sport Sci Res 1(4):61-65): 12 competitive male bodybuilders, body density 1.0812 g/mL by underwater weighing corrected for residual lung volume, 8.5% fat. Modlesky et al. 1996 (J Appl Physiol 80:2085): fat-free-mass density 1.089+/-0.005 g/mL in weight trainers. Ward & Lieber 2005 (J Biomech 38:2317): standard muscle density 1.0597 g/cm3. Living gas: ~2% of volume (lungs scaled between stature^3, ~0.8%, and body mass, ~4.5%) -> 1.081 x 0.98 = 1,060. Low 1,020 = tissue -1 SD with human-proportional (mass-scaled) lungs; high 1,080 = tissue +1 SD with stature-scaled lungs.'},
 'rex':{'volume_m3':{'central':round(r['rex']['V_central'],3),'p5':round(r['rex']['V_p5'],3),'p95':round(r['rex']['V_p95'],3)},
        'mass_kg':{'central':r2(r['rex']['V_central']*1060),'low':r2(r['rex']['M_p5']),'high':r2(r['rex']['M_p95']),
                   'unrounded':[r['rex']['V_central']*1060,r['rex']['M_p5'],r['rex']['M_p95']]},
        'segments_m3':r['rex']['parts_central'],'frontal_area_m2':round(P['fa']['rex'],2),'foot_sole_m2':0.31},
 'ollie':{'volume_m3':{'central':round(r['ollie']['V_central'],3),'p5':round(r['ollie']['V_p5'],3),'p95':round(r['ollie']['V_p95'],3)},
        'mass_kg':{'central':r2(r['ollie']['V_central']*1060),'low':r2(r['ollie']['M_p5']),'high':r2(r['ollie']['M_p95']),
                   'unrounded':[r['ollie']['V_central']*1060,r['ollie']['M_p5'],r['ollie']['M_p95']]},
        'segments_m3':r['ollie']['parts_central'],'frontal_area_m2':4.5,'foot_sole_m2':0.15},
}
json.dump(out,open(D+'checker/results_checker.json','w'),indent=1); print(json.dumps(out['rex']['mass_kg']),json.dumps(out['ollie']['mass_kg']))
