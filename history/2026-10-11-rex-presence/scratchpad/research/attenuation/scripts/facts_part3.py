add(key='vib_gec1_chart_digitised',
 label='FHWA GEC 1 chart read off: PPV at the marked point of each soil line, and at a scaled energy factor of 1',
 status='derived', value_si=None, unit_si='m/s',
 display='At √(E[kJ]/9.8)/d = 1: roughly 13 mm/s (decomposed garbage, loose sand fill) to 80 mm/s (very stiff silty clay); a factor of about 6 between ground types',
 sources=[sGEC], who_when='Lukas 1995 figure, read by us 2026',
 notes=("Marker points read off GEC 1 Fig. 7 (x = scaled energy factor in √(t·m)/m, y = PPV in mm/s), reading error about ±25%: (1) very stiff silty clay x 0.58, 42; (2) medium dense micaceous sand x 1.2, 57; (3) clayey mine spoil x 3.9, 154; (4) building rubble x 0.14, 4.6; (5) collapsible silt x 0.46, 22; (6) loose sand x 0.65, 15; (7) loose sand fill x 1.2, 20; (8) loose decomposed garbage x 0.44, 4.7. Line slopes read as about 1.0–1.4 on log-log axes. Values at x = 1 extrapolated by us with slope 1.2: (1) ~80, (2) ~46, (3) ~30, (4) ~49, (5) ~56, (6) ~25, (7) ~16, (8) ~13 mm/s. For comparison the BS 5228 / Mayne (1985) upper bound gives 91 mm/s and Mayne (1984) 70 mm/s at x = 1. Stiffer, denser ground gives more PPV per unit scaled energy in this dynamic-compaction data (loose fills absorb energy in the crater), which is the opposite of the elastic small-load trend (softer ground shakes more for the same force); keep the two regimes apart."),
 values_json=json.dumps({'units':'x = sqrt(E[kJ]/9.8)/d[m]; PPV mm/s','points':{'very stiff silty clay':[0.58,42],'medium dense micaceous sand':[1.2,57],'clayey mine spoil':[3.9,154],'building rubble':[0.14,4.6],'collapsible silt':[0.46,22],'loose sand':[0.65,15],'loose sand fill':[1.2,20],'loose decomposed garbage':[0.44,4.7]},'at_x_1_slope_1p2':{'very stiff silty clay':80,'medium dense micaceous sand':46,'clayey mine spoil':30,'building rubble':49,'collapsible silt':56,'loose sand':25,'loose sand fill':16,'loose decomposed garbage':13}}))

add(key='vib_dynamic_compaction_frequency',
 label='Dominant frequency of ground vibration from dropped weights (dynamic compaction, rapid impact compaction)',
 status='verified', value_si=None, unit_si='Hz', low_si=3, high_si=50,
 display='Crane dynamic compaction 3–10 Hz (FHWA) or 5–10 Hz / 25–35 Hz (two Canadian sites); rapid impact compaction (9 t hammer on a plate) 20–30 Hz and 40–50 Hz',
 sources=[sLUK, sLAU], who_when='Lukas 1986; Lauzon et al. c. 2011',
 notes=("Lukas 1986 p. 101: 'Most of the dynamic compaction vibrations produce frequencies in the range of 3 to 10 Hertz'. Lauzon et al., Trois-Rivières (loose to compact fine sand, water table 1.7 m): 'Vibration frequencies for the DC rig are generally between 5 and 10 Hz. For the RIC rig, frequencies are generally between 20 and 30 Hz.' Québec City (crushed-stone fill 2–6 m on bedrock; 11 t tamper from 18 m): 'For DC tampers dropped from full height, frequencies are typically in the range of 25 to 35 Hz with similar values when the drop height has been reduced to half. For ironing using DC methods and for RIC, the frequencies typically are in the range between 40 and 50 Hz.' Frequency depends on the ground (stiffer, thinner deposits give higher frequency) and on the impact (smaller, quicker impacts give higher frequency)."))

add(key='vib_repeat_drops_raise_ppv',
 label='PPV from the same drop rises as the ground under it is compacted (2–8× over repeated drops)',
 status='verified', value_si=None, unit_si='ratio', low_si=2, high_si=8,
 display='18.1 t from 30 m: 4 → 13 mm/s at 20 m over 21 drops; 11 t from 18 m: 1–2 → ~8 mm/s at 10 m over 6 drops',
 sources=[sLUK, sLAU], who_when='Dumas & Beaton via Lukas 1986; Lauzon et al. c. 2011',
 notes=("Lukas 1986 p. 100: 'Dumas and Beaton (25) present information showing how the peak particle velocity increases from .16 to .51 in/sec (4 to 13 mm/sec) as the number of drops increases from 1 to 21. These readings were obtained at a point located 66 ft (20 m) from the imprint where a 20 ton (18.1 t) tamper was being dropped over a height of 98 ft (30 m) onto a silty rock fill.' Lauzon et al.: 'For the first blow, the vibration level was measured between 1 and 2 mm/s. After 6 blows the vibration level reached close to 8 mm/s at a distance of 10 m from the point of impact.' Relevance: the first drop onto soft ground loses energy to cratering; a footstep on firm ground behaves more like the later, stiffer drops. This is part of why one energy law cannot fit all drops to better than a factor of a few. Interesting cross-check (ours): 18.1 t × 30 m = 5.3 MJ gives 119 mm/s at 20 m from BS 5228's upper bound, versus 4–13 measured: an upper bound 9–30 times above these readings."))

add(key='vib_pisa_drop_test_ppv',
 label='Low-energy drop test: 130 kg dropped about 3 m onto soil at Pisa, PPV at 2.5–60 m',
 status='verified', value_si=0.009, unit_si='m/s (PPV at 2.5 m)', low_si=0.0002, high_si=0.009,
 display='9 mm/s at 2.5 m falling to 0.2 mm/s at 60 m; fitted fall-off ∝ r^-1.28; central frequency about 25 Hz (≈3.8 kJ, momentum 997 kg·m/s)',
 sources=[sCOL], who_when='Colombero, Kontoe, Foti & Potts 2015 (field data of Foti 2000/2003)',
 notes=("'The drop load test configuration consisted of a 130 kg weight dropped from a height of approximately 3 m, hitting the ground directly in order to avoid mass rebound and to reach lower frequencies. The vibrations at the surface were recorded by 24 in-line geophones at 2.5m spacing.' 'The magnitude of the peak particle velocities recorded in Pisa decreases from 9 mm/s at a distance of 2.5 m from the source to 0.2 mm/s at a distance of 60 m (Figure 6, white circles).' Power law fit 'slope q = 1.282' (field) and 1.272 (their finite-element model). Source pulse fitted with 'TS = 0.04s' and momentum 'Cb = 997.4 kg·m/s'; synthetic source 'based on a single central frequency (25 Hz)'. From the plotted time histories (our reading, ±30%): about 5 mm/s at 5 m and 0.4–0.5 mm/s at 35 m. Site: Piazza dei Miracoli, layered sands and soft clays, Vs 150–245 m/s in the top 40 m (see vib_pisa_soil_profile). Energy 130 × 9.80665 × 3 ≈ 3.8 kJ: this is the one verified measurement found inside the footstep energy range (10 J–10 kJ). Velocities appear to be vertical-geophone readings (SASW set-up)."),
 values_json=json.dumps({'distance_m':[2.5,5,35,60],'ppv_mm_s':[9,5,0.5,0.2],'quality':['quoted','read from Fig. 5','read from Fig. 5','quoted'],'fit_exponent_q':1.282,'drop':'130 kg from ~3 m, directly on ground','central_frequency_Hz':25}))

add(key='vib_pisa_soil_profile',
 label='Pisa test site: shear-wave speed, unit weight and damping of the layers',
 status='verified', value_si=170, unit_si='m/s (typical Vs, top 10 m)', low_si=150, high_si=380,
 display='Vs 150–245 m/s in the upper layers (380 m/s deep sand), unit weight 16.75–20 kN/m³, damping ratio 2–7%',
 sources=[sCOL], who_when='Colombero et al. 2015 (Table 1, after Foti 2003)',
 notes=("Table 1 'Soil properties used in the finite element analysis': MG Vs 155 m/s, γ 19.00 kN/m³, ξ* 7.0%; A1 180, 18.50, 5.4%; A2 170, 18.00, 2.5%; BI 150, 16.75, 3.1%; BII 235, 19.50, 2.0%; BIII 245, 18.75, 2.0%; BIV 215, 18.00, 2.0%; C 380, 20.00, 2.0%; Poisson's ratio 0.33 for all. Water table taken at 1.3 m. Unit weights 16.75–20 kN/m³ correspond to densities 1,710–2,040 kg/m³. These are the inputs we used to test the elastic model against the Pisa drop (vib_model_check_pisa)."),
 values_json=json.dumps({'layer':['MG','A1','A2','BI','BII','BIII','BIV','C'],'Vs_m_s':[155,180,170,150,235,245,215,380],'unit_weight_kN_m3':[19.0,18.5,18.0,16.75,19.5,18.75,18.0,20.0],'damping_ratio_pct':[7.0,5.4,2.5,3.1,2.0,2.0,2.0,2.0],'poisson':0.33}))

add(key='vib_drop_test_exponent_by_soil',
 label='Measured fall-off exponent q (PPV ∝ r^-q) for drop-weight tests: about 1.0 on sand, 1.6 on clay',
 status='verified', value_si=1.3, unit_si='1', low_si=1.0, high_si=1.6,
 display='q ≈ 1.0 (sandy soils) to 1.6 (clayey soils) for drop load tests; Pisa field fit 1.28',
 sources=[sCOL, sTRID], who_when='Auersch 2010 via Colombero et al. 2015; Auersch & Said 2010',
 notes=("Colombero et al. section 2.2: 'The experimental exponent q has been found varying between values of 1.0 and 1.6 for drop load tests carried out on sandy and clayey soils respectively (Auersch 2010).' Auersch & Said 2010 abstract (TRID): 'Nineteen measurements of ground vibrations induced by eight different technical sources including road and rail traffic' ... power-law exponents between 0.5 and 2.0 depending on the source; higher than geometric theory predicts, mainly from material (and scattering) damping; soil layering (dispersion) adds roughly 0.5 to the exponent for impulsive loads. Theory for a surface point load: 0.5 for Rayleigh waves alone (vib_geometric_spreading_exponents). The empirical 1.0–1.6 is what spreading plus damping plus layering gives over 2.5–60 m."))

add(key='vib_pisa_vs_empirical_laws',
 label='How the dynamic-compaction laws do at 3.8 kJ (Pisa drop)',
 status='derived', value_si=5, unit_si='ratio (measured / BS 5228 predicted at 60 m)',
 display='BS 5228/Mayne 1985: 8.7 mm/s at 2.5 m (measured 9) but 0.04 mm/s at 60 m (measured 0.2, 5× low). Mayne 1984: 10 and 0.12 mm/s (1.7× low at 60 m)',
 sources=[sCOL, sBS, sLAU], who_when='our calculation 2026',
 notes=("W_h = 130 × 9.80665 × 3 = 3,825 J. BS 5228: 0.037 × (√3825/x)^1.7 → 8.65 mm/s at 2.5 m, 0.039 mm/s at 60 m. Mayne 1984 (reported): M·H = 0.39 t·m, 70 × (0.625/x)^1.4 → 10.0 mm/s at 2.5 m, 0.117 mm/s at 60 m. Measured 9 and 0.2 mm/s. So at footstep-scale energy the near field happens to agree, while the far field is under-predicted because real low-energy attenuation (r^-1.0 to r^-1.3) is slower than the law's r^-1.7 (or r^-1.4). Both 2.5 m and 3.8 kJ lie outside BS 5228's stated range (5–100 m, 1–12 MJ). One site only: treat as an indication, not a calibration."))

add(key='vib_caltrans_impact_pile_driver',
 label='Caltrans screening law for impact pile drivers (energy-scaled, with distance exponent n)',
 status='verified', value_si=0.01651, unit_si='m/s (PPV_ref = 0.65 in/s at 25 ft for 36,000 ft·lb)',
 display='PPV = 0.65 in/s × (25/D[ft])^1.1 × (E/36,000 ft·lb)^0.5',
 sources=[sCAL], who_when='Caltrans 2020 (Eq. 9)',
 notes=("Caltrans 2020 section 7.1.1: 'PPV Impact Pile Driver = PPVRef (25/D)^n x (Eequip/ERef)^0.5 (in/sec) (Eq. 9) Where: PPVRef = 0.65 in/sec for a reference pile driver at 25 ft. D = distance from pile driver to the receiver in ft. n = 1.1 ... ERef = 36,000 ft-lb (rated energy of reference pile driver)'. 'Literature indicates that the value of “n” in the above equation is generally 1 to 1.5. The suggested value for n is 1.1.' Rated energies of drivers: 'about 20,000–300,000 foot-pounds' (27–410 kJ); 'Smaller drivers have rated energies as low as 300 ft-lbs' (0.4 kJ). Caltrans Eq. 8: 'if the energy of the driving force changes from E1 to E2, the vibration amplitude changes from V1 to V2 according to ... V2 = V1(E2/E1)^0.5'. Pile energy enters at depth; listed as a second empirical comparison only."))

add(key='vib_woods_jedele_n_by_soil_class',
 label='Woods & Jedele (1985) distance exponent n by soil class (PPV = k D^-n), as given by Caltrans',
 status='verified', value_si=1.1, unit_si='1', low_si=1.0, high_si=1.5,
 display='Class I weak/soft soils: suggested 1.4 (no data); II competent soils: measured 1.5, suggested 1.3; III hard soils: 1.1; IV hard rock: suggested 1.0 (no data)',
 sources=[sCAL], who_when='Woods & Jedele 1985 via Woods 1997 (NCHRP Synthesis 253) and Caltrans 2020 Table 17',
 notes=("Caltrans Table 17 'Measured and Suggested “n” Values Based on Soil Class': I 'Weak or soft soils: loose soils, dry or partially saturated peat and muck, mud, loose beach sand, and dune sand, recently plowed ground, soft spongy forest or jungle floor, organic soils, top soil. (shovel penetrates easily)' — 'Data not available', suggested 1.4. II 'Competent soils: most sands, sandy clays, silty clays, gravel, silts, weathered rock. (can dig with shovel)' — 1.5, suggested 1.3. III 'Hard soils: dense compacted sand, dry consolidated clay, consolidated glacial till, some exposed rock. (cannot dig with shovel, need pick to break up)' — 1.1, 1.1. IV 'Hard, competent rock: bedrock, freshly exposed hard rock. (difficult to break with hammer)' — 'Data not available', 1.0. Caltrans: the n value 'is a composite value or pseudo-attenuation coefficient that accounts for both geometric and material damping'. Woods & Jedele's frequency-dependent α table was not found in an accessible source."),
 values_json=json.dumps({'class':['I weak/soft','II competent','III hard','IV hard rock'],'n_measured':[None,1.5,1.1,None],'n_suggested':[1.4,1.3,1.1,1.0]}))
