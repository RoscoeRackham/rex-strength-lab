"""Collect Method C outputs into method_c_results.json (+ proportion table and sanity checks)."""
import json, math
raw = json.load(open('method_c_raw.json'))
area = json.load(open('area_px.json'))
cen, mc, dlo, dhi = raw['central'], raw['mc'], raw['depth_low'], raw['depth_high']
rho_c = raw['rho_central']
s = 3.048 / (800.5 - 8.5)
r3 = lambda x: round(x, 3)
r4 = lambda x: round(x, 4)

def tot(d):
    return sum(v for k, v in d.items() if not k.startswith('_'))

def block(fig, extra):
    c = cen[fig]; m = mc[fig]
    V = tot(c)
    segs = {k: r4(v) for k, v in c.items() if not k.startswith('_')}
    b = dict(volume_m3=dict(central=r3(V), mc_median=r3(m['V'][1]), p5=r3(m['V'][0]), p95=r3(m['V'][2]),
                            p2_5=r3(m['V2575'][0]), p97_5=r3(m['V2575'][1]),
                            depth_only_low=r3(tot(dlo[fig])), depth_only_high=r3(tot(dhi[fig]))),
             mass_kg=dict(central=round(V * rho_c), mc_median=round(m['M'][1]), p5=round(m['M'][0]), p95=round(m['M'][2]),
                          p2_5=round(m['M2575'][0]), p97_5=round(m['M2575'][1])),
             segments_m3=segs, segments_mc_p5_p50_p95={k: [r4(x) for x in v] for k, v in m['seg'].items() if not k.startswith('_')},
             foot_sole_m2=dict(central=r3(c['_foot_sole']), p5=r3(m['seg']['_foot_sole'][0]), p95=r3(m['seg']['_foot_sole'][2])))
    b.update(extra)
    return b

rex = block('rex', dict(height_px_crest=792.0, height_px_skull=758.5, m_per_px=s, height_m_crest=3.048,
                        height_m_skull=r3(758.5 * s), frontal_area_m2=r3(area['rex_px'] * s * s), frontal_area_px=area['rex_px']))
ol = block('ollie', dict(height_px_horns=794.0, height_px_hair=783.0, height_px_skull=773.0,
                         height_m_horns=r3(794 * s), height_m_hair=r3(783 * s), height_m_skull=r3(773 * s),
                         height_m_horns_barefoot_est=r3(794 * s - 0.10),
                         frontal_area_m2=r3(area['ollie_px'] * s * s + 0.03), frontal_area_px=area['ollie_px']))

# ---------------- proportions (width / skull-top height) vs ANSUR II mean man and bodybuilders
ANSUR = dict(bideltoid=510.4, chest=289.4, waist=326.4, hip=345.7, upper_arm=358.1 / math.pi, forearm=310.1 / math.pi,
             thigh=625.1 / math.pi, calf=392.3 / math.pi)
ANSUR = {k: v / 1756.2 for k, v in ANSUR.items()}
BB = dict(upper_arm=42.4 / math.pi / 173, forearm=33.0 / math.pi / 173, thigh=64.3 / math.pi / 173, calf=40.6 / math.pi / 173)
PRO = dict(upper_arm=56 / math.pi / 188, thigh=72 / math.pi / 188, calf=51 / math.pi / 188)
REXW = dict(bideltoid=476, chest=295, waist=237, hip=315, upper_arm=math.sqrt(105 * 165), forearm=math.sqrt(129 * 150), thigh=150, calf=165)
OLW = dict(bideltoid=455, chest=290, waist=320, hip=370, upper_arm=115, forearm=90, thigh=164, calf=172)
prop = {}
for k in ANSUR:
    rr = REXW[k] / 758.5; oo = OLW[k] / 773.0
    prop[k] = dict(rex=r3(rr), ollie=r3(oo), ansur=r3(ANSUR[k]), rex_x_ansur=round(rr / ANSUR[k], 2), ollie_x_ansur=round(oo / ANSUR[k], 2))
    if k in BB:
        prop[k].update(bb=r3(BB[k]), rex_x_bb=round(rr / BB[k], 2), ollie_x_bb=round(oo / BB[k], 2))
    if k in PRO:
        prop[k].update(pro=r3(PRO[k]), rex_x_pro=round(rr / PRO[k], 2), ollie_x_pro=round(oo / PRO[k], 2))
lengths = dict(crotch_height=dict(rex=r3((800.5 - 545) / 758.5), ollie=r3((807.5 - 547) / 773), ansur=r3(845.9 / 1756.2)),
               trunk_C7_to_hip=dict(rex=r3((510 - 140) / 758.5), ollie=r3((505 - 120) / 773), ansur=r3((1517.3 - 900.9) / 1756.2)))

sc = lambda m, h: m * (3.048 / h) ** 3
sanity = dict(avg_man_75kg_1p75m_at_3048=round(sc(75, 1.75)), avg_man_at_skull_2919=round(75 * (758.5 * s / 1.75) ** 3),
              ansur_mean_85p5kg_at_3048=round(sc(85.52, 1.7562)),
              competitive_bb_80kg_1p73m_at_3048=round(sc(80, 1.73)),
              large_bb_115kg_1p80m_FFMI32_at_3048=round(sc(115, 1.80)),
              schwarzenegger_contest_107kg_1p88m_at_3048=round(sc(107, 1.88)),
              mass_monster_140kg_1p80m_at_3048=round(sc(140, 1.80)),
              rex_mean_depth_m=r3(tot(cen['rex']) / rex['frontal_area_m2']),
              ollie_mean_depth_m=r3(tot(cen['ollie']) / ol['frontal_area_m2']))
res = dict(method='C: anthropometric segment scaling (ANSUR II mean man x de Leva/Dempster segment volumes x length ratio x width ratio x depth ratio) + tapered elliptical-cone tail',
           image='/root/.claude/uploads/6435a7db-fe21-5f3b-bca9-e49ba2609387/89c1d7ad-image.jpg',
           density_kg_m3=dict(central=round(rho_c), p5=round(raw['rho_pct'][0]), p95=round(raw['rho_pct'][2]), extreme_low=1026, extreme_high=1080),
           rex=rex, ollie=ol, proportions_width_over_skull_height=prop, length_proportions=lengths, sanity_kg=sanity,
           human_reference=raw['human'])
json.dump(res, open('method_c_results.json', 'w'), indent=1)
print(json.dumps(dict(rex={k: rex[k] for k in ('volume_m3', 'mass_kg', 'foot_sole_m2', 'frontal_area_m2', 'height_m_skull')},
                      ollie={k: ol[k] for k in ('volume_m3', 'mass_kg', 'foot_sole_m2', 'frontal_area_m2', 'height_m_horns', 'height_m_hair', 'height_m_skull')},
                      prop=prop, lengths=lengths, sanity=sanity, rho=res['density_kg_m3']), indent=1))
