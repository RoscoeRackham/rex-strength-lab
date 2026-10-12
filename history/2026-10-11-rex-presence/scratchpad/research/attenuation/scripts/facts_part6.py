add(key='vib_nehrp_site_classes_vs30',
 label='NEHRP site classes by average shear-wave speed in the top 30 m',
 status='verified', value_si=None, unit_si='m/s',
 display='A hard rock > 1,500; B rock 760–1,500; C very dense soil and soft rock 360–760; D stiff soil 180–360; E < 180 m/s',
 sources=[sUSGS], who_when='USGS OFR 97-501 (NEHRP 1994 provisions)',
 notes=("Table: 'A Vs30 > 1500 m/s, hard rock; B 760 m/s < Vs30 < 1500 m/s, rock; C 360 m/s < Vs30 < 760 m/s, very dense soil and soft rock; D 180 m/s < Vs30 < 360 m/s, stiff soil; E Vs30 < 180 m/s'. These are 30 m averages; the top few metres that carry footstep-frequency surface waves are usually slower than the average."),
 values_json=json.dumps({'A':'>1500 hard rock','B':'760-1500 rock','C':'360-760 very dense soil and soft rock','D':'180-360 stiff soil','E':'<180'}))

add(key='vib_soil_shear_speed_by_type',
 label='Shear-wave speed by soil type and density (national seismic code table)',
 status='verified', value_si=None, unit_si='m/s',
 display='Loose sand < 200; medium dense sand and gravel 200–400; dense sand and gravel 400–700; soft clay < 200; stiff clay 200–300; very stiff clay 300–700; hard clay > 700 m/s',
 sources=[sTURK], who_when='Turkish Ministry of Public Works and Settlement seismic code, Table 12.1 (IISEE copy)',
 notes=("Table 12.1 'Soil Groups' (shear wave velocity column): (A) 1 massive volcanic/unweathered metamorphic/stiff cemented sedimentary rock > 1000; 2 'Very dense sand and gravel' (N > 50, Dr 85–100%) > 700; 3 'Hard clay, silty clay' > 700. (B) 1 soft volcanic rock, weathered sedimentary rock 700–1000; 2 'Dense sand and gravel' (N 30–50, Dr 65–85%) 400–700; 3 'Very stiff clay, silty clay' 300–700. (C) 1 highly weathered rock 400–700; 2 'Medium dense sand and grovel' [sic] (N 10–30, Dr 35–65%) 200–400; 3 'Stiff clay, silty clay' (qu 100–200 kPa) 200–300. (D) 1 'Soft, deep alluvial layers with high water table' < 200; 2 'Loose sand' (N 0–10, Dr < 35%) < 200; 3 'Soft clay, silty clay' (qu < 100 kPa) < 200. Code values describe soil layers, not the loose top metre; see vib_ground_wave_params_by_surface for the values we pick."),
 values_json=json.dumps({'loose sand':'<200','medium dense sand and gravel':'200-400','dense sand and gravel':'400-700','very dense sand and gravel':'>700','soft clay':'<200','stiff clay':'200-300','very stiff clay':'300-700','hard clay':'>700','soft alluvium, high water table':'<200','rock':'>700 to >1000'}))

add(key='vib_ice_seismic_speeds',
 label='Seismic wave speeds in ice (polar ice sheets)',
 status='verified', value_si=1940, unit_si='m/s (shear, −16 to −29 °C)', low_si=1934, high_si=1960,
 display='Shear waves 1,934–1,960 m/s; P waves 3,795 − 2.30·T m/s (T in °C); Poisson ratio about 0.33',
 sources=[sKOH], who_when='Kohnen 1974',
 notes=("Kohnen eq. (1): 'Vp = −(2·30 ± 0.17) T + 3795 m/s'. Table II lists measured Vs of 1934–1960 m/s at −16.5 to −29 °C and Poisson's ratio 0.327–0.332; 'Assuming a constant Poisson's ratio of 0.329'. dVs/dT = −1.2 m/s per degree, so near 0 °C about 1,915–1,920 m/s (our extrapolation). Glacier ice; lake ice is similar material but forms a thin floating plate, so these bulk speeds do not by themselves give the vibration from a step on lake ice (vib_plate_surfaces_not_modelled)."))

add(key='vib_granite_shear_speed',
 label='Granite: shear-wave speed near the surface',
 status='derived', value_si=3000, unit_si='m/s', low_si=2100, high_si=3500,
 display='About 3,000 m/s (2,100–3,500), from near-surface P speeds of 3.7–6.1 km/s divided by about √3',
 sources=[sUSGS], who_when='our derivation 2026 from existing key collide_rock_wave_speed_estimate',
 notes=("Relies on the existing lab fact collide_rock_wave_speed_estimate (granite P waves near the surface 3.7–6.1 km/s, Birch 1960; bar-wave speed 3.71 km/s, Padmanabha et al. 2021). For ν ≈ 0.25, c_s = c_p/√3: 2.1–3.5 km/s. NEHRP class A (hard rock) is > 1,500 m/s (USGS OFR 97-501). On granite the model gives about 1,000 times less shaking than on loose sand for the same step, because near-field PPV ∝ 1/(ρ c_s²)."))

add(key='vib_steel_shear_speed',
 label='Steel: shear-wave speed (for reference only; a deck is a plate)',
 status='estimate', value_si=3200, unit_si='m/s', low_si=3100, high_si=3250,
 display='About 3.2 km/s (from G ≈ 79 GPa and ρ = 7,850 kg/m³)',
 sources=[sCAL], who_when='our estimate 2026',
 notes=("c_s = √(G/ρ) with a typical structural-steel shear modulus of 77–80 GPa (not fetched in this run) and the lab's verified steel density 7,850 kg/m³ (existing key density_structural_steel): 3,130–3,190 m/s; textbook tables give about 3.2 km/s. Listed only for completeness: a steel deck vibrates as a plate on supports, and the half-space model does not apply (vib_plate_surfaces_not_modelled). Caltrans is cited only for the general wave-type framework."))

add(key='vib_small_strain_damping_ratio',
 label='Material damping ratio of soils and rock at small (footstep) strains',
 status='estimate', value_si=0.03, unit_si='1', low_si=0.005, high_si=0.07,
 display='Soils about 2–5% (Pisa site: 2–7%); rock about 0.5–2%',
 sources=[sCOL, sCAL], who_when='our estimate 2026, anchored on Colombero et al. 2015 Table 1',
 notes=("Pisa site layers: 2.0–7.0% (verified, vib_pisa_soil_profile); Colombero et al. fitted k = 2πξ = 0.302 for the measured drop data (ξ ≈ 4.8%). Caltrans α values (vib_material_damping_coefficients) convert to ξ = α c_R/(2π f) and, for 20 Hz and c_R 150 m/s, 0.02–0.26 m⁻¹ gives 2–30%: the high end (dune sand) is unusually lossy. Our picks: loose sand 4%, dense sand and gravel 3%, soft clay 5%, stiff clay 3%, road or slab subgrade 3%, granite 1%. Damping matters little within about 10 m and controls the result beyond about 30 m."))

add(key='vib_ground_wave_params_by_surface',
 label="Ground-wave parameters for the lab's nine surfaces (what the Walk tab should use)",
 status='estimate', value_si=None, unit_si='m/s, kg/m³, 1',
 display='c_s: loose sand 120, dense sand/gravel 300, soft clay 120, stiff clay 250, asphalt or concrete on grade 250 (subgrade), granite 3,000 m/s; lake ice and steel deck not modelled as ground',
 sources=[sTURK, sUSGS, sCOL, sKOH, sCAL], who_when='our picks 2026 from the verified tables',
 notes=("Densities are the lab's existing surface values (data.js), except road and slab where the subgrade (about 2,000 kg/m³) carries the waves. Shear speeds are near-surface picks inside the verified class ranges (loose sand and soft clay < 200, stiff clay 200–300, dense sand and gravel 400–700 at depth but lower near the surface; Pisa's soft layers 150–180). At 10–50 Hz the surface wave samples the top 2–10 m, so near-surface values are the right ones and the code values are upper guides. Asphalt (0.1–0.3 m) and a 10 cm slab are much thinner than the 5–25 m wavelengths, so the subgrade sets the shaking; the stiff layer spreads the footprint load and lowers PPV within about a metre (not modelled). Poisson ratio 0.25 assumed throughout; saturated soft clay is nearer 0.45–0.5, which lowers PPV by about a third. Uncertainty on c_s is about ±40% for soils; near-field PPV scales as 1/c_s², far-field as 1/c_s^2.5, so c_s alone gives a factor of about 2 either way."),
 values_json=json.dumps({'sand':{'rho':1600,'cs':120,'cs_range':[80,180],'xi':0.04,'model':'half-space'},
  'gravel':{'rho':2000,'cs':300,'cs_range':[200,450],'xi':0.03,'model':'half-space'},
  'softclay':{'rho':1700,'cs':120,'cs_range':[80,170],'xi':0.05,'model':'half-space (nu may be ~0.45 if saturated)'},
  'stiffclay':{'rho':1900,'cs':250,'cs_range':[200,350],'xi':0.03,'model':'half-space'},
  'asphalt':{'rho':2000,'cs':250,'cs_range':[180,400],'xi':0.03,'model':'half-space of the subgrade; pavement layers ignored'},
  'concrete':{'rho':2000,'cs':250,'cs_range':[180,400],'xi':0.03,'model':'half-space of the subgrade; 10 cm slab ignored'},
  'ice':{'rho':917,'cs':1920,'xi':None,'model':'not modelled: floating plate (flexural-gravity waves)'},
  'steel':{'rho':7850,'cs':3200,'xi':None,'model':'not modelled: plate on supports'},
  'granite':{'rho':2700,'cs':3000,'cs_range':[2100,3500],'xi':0.01,'model':'half-space'}}))

add(key='vib_plate_surfaces_not_modelled',
 label='Lake ice and steel deck: the ground-wave model does not apply',
 status='estimate', value_si=None, unit_si='',
 display='Not modelled: on floating ice or a supported steel deck the step excites plate bending waves, not ground waves',
 sources=[sKOH, sCAL], who_when='our assessment 2026',
 notes=("The model assumes a deep solid half-space. Thick lake ice floats on water: a step makes the sheet bend and sends flexural-gravity waves through it, with spreading, dispersion and damping set by ice thickness and water depth. A steel deck plate rests on beams: the response is the deck's own resonances. Neither was researched in this run. Recommended page wording: 'Ground shaking is not modelled on lake ice or a steel deck (they flex as plates).' The bulk speeds (ice c_s about 1.9 km/s, Kohnen 1974; steel about 3.2 km/s) are listed for reference only."))

add(key='vib_extrapolation_to_footsteps',
 label='How far the dynamic-compaction laws are being stretched for footsteps',
 status='derived', value_si=1e5, unit_si='ratio (BS 5228 lower energy limit / smallest footstep energy)', low_si=100, high_si=1e5,
 display='Footsteps (10 J–10 kJ) sit 100–100,000× below BS 5228\'s 1 MJ floor; at 82 kJ the law already under-predicts 2–10×, at 3.8 kJ about 5× at 60 m. Walking is a slow load, not a drop, so an energy law has no clear input at all',
 sources=[sBS, sTRL, sCOL, sGEC], who_when='our assessment 2026',
 notes=("Ranges: BS 5228-2 dynamic compaction 1–12 MJ and 5–100 m; GEC 1 chart data at scaled energy factor ≈ 0.07–6 √(t·m)/m; a 10 J–10 kJ footstep at 1–200 m has a factor of 0.0002–1. Evidence below the range: 82 kJ (TRL 429, Allen 1996): measured 2–10× above Mayne (1985), worst at long range; 3.8 kJ (Pisa): agrees at 2.5 m, 5× low at 60 m; 10 J–1 kJ: no measured drop data found. Pattern: at low energy the near field roughly follows the law but the fall-off is slower (r^-1.0 to r^-1.3 measured vs r^-1.7), so errors grow with distance, to roughly 10× by 100 m. More basically, the laws' input is the energy of a free-falling weight that craters the ground; a walking step loads the ground over 0.1–0.3 s with no free fall, and its shaking depends on force and loading rate (vib_physics_pulse_ppv_model). Recommendation: use the elastic model; show BS 5228 only as an out-of-range comparison for stamps that are true drops."))

add(key='vib_rex_step_examples',
 label="Example output: vertical PPV from one of Rex's (or Ollie's) steps, by ground and distance (placeholder step forces)",
 status='derived', value_si=None, unit_si='m/s',
 display='Normal walk (1.2 × weight, 0.1 s rise) on loose sand: about 3 mm/s at 1 m, 1 at 3 m, 0.3 at 10 m, 0.03 at 100 m; on stiff clay about 5× less; on granite about 1,000× less',
 sources=[sCOL, sSS], who_when='our calculation 2026',
 notes=("Computed with vib_physics_pulse_ppv_model, vib_physics_damping_factor and vib_ground_wave_params_by_surface; weight 3,007 kg (canon). The step force histories are placeholders: 1.2 × body weight is the lab's W8.WALK_LOAD (existing key walking_running_peak_vertical_force, 1.0–1.5 × in human walking), but the rise times (0.1 and 0.2 s) and the 'heavy step' (3 ×, 0.05 s) and 'stamp' (10 ×, 0.03 s) inputs are illustrations until the step-force research supplies them. Ollie gives the same numbers (same mass and force; his 0.15 m² boot sole vs Rex's 0.31 m² paw does not matter while the footprint is small compared with the wavelength). Values within 1–3 m of a stamp on soft soil (tens of mm/s and up) imply ground strain above 10⁻⁴ and are over-estimates (vib_linear_strain_limit)."),
 values_json=json.dumps({"distance_m": [1, 3, 10, 30, 100, 200], "units": "vertical PPV mm/s", "walk_1.2BW_ramp_0.1s": {"sand": [2.9, 0.96, 0.28, 0.12, 0.026, 0.0075], "gravel": [0.37, 0.12, 0.037, 0.012, 0.0054, 0.0025], "softclay": [2.7, 0.9, 0.26, 0.1, 0.019, 0.0052], "stiffclay": [0.56, 0.19, 0.056, 0.019, 0.0083, 0.0036], "asphalt_or_concrete_subgrade": [0.53, 0.18, 0.053, 0.018, 0.0079, 0.0034], "granite": [0.0027, 0.00091, 0.00027, 9.1e-05, 2.7e-05, 1.4e-05]}, "walk_1.2BW_ramp_0.2s": {"sand": [1.4, 0.48, 0.14, 0.049, 0.018, 0.0066], "gravel": [0.18, 0.061, 0.018, 0.0061, 0.0022, 0.0013], "softclay": [1.4, 0.45, 0.13, 0.045, 0.014, 0.0047], "stiffclay": [0.28, 0.093, 0.028, 0.0093, 0.0035, 0.0021], "asphalt_or_concrete_subgrade": [0.27, 0.088, 0.027, 0.0088, 0.0034, 0.002], "granite": [0.0014, 0.00046, 0.00014, 4.6e-05, 1.4e-05, 6.8e-06]}, "heavy_3BW_hann_0.05s": {"sand": [28.0, 10.0, 4.4, 1.1, 0.075, 0.011], "gravel": [3.7, 1.2, 0.47, 0.21, 0.047, 0.012], "softclay": [27.0, 9.6, 3.7, 0.75, 0.044, 0.0063], "stiffclay": [5.6, 1.8, 0.76, 0.33, 0.062, 0.014], "asphalt_or_concrete_subgrade": [5.3, 1.7, 0.72, 0.31, 0.059, 0.013], "granite": [0.027, 0.0091, 0.0027, 0.00091, 0.00036, 0.00025]}, "stamp_10BW_hann_0.03s": {"sand": [160.0, 70.0, 24.0, 3.7, 0.18, 0.024], "gravel": [20.0, 6.7, 3.1, 1.2, 0.16, 0.031], "softclay": [140.0, 63.0, 18.0, 2.3, 0.099, 0.013], "stiffclay": [31.0, 10.0, 5.0, 1.7, 0.2, 0.035], "asphalt_or_concrete_subgrade": [29.0, 9.9, 4.7, 1.6, 0.19, 0.033], "granite": [0.15, 0.051, 0.015, 0.005, 0.0026, 0.0017]}, "note": "step forces are placeholders pending the step-force topic"}))

add(key='vib_linear_strain_limit',
 label='Where the elastic model stops: ground strain near a heavy step',
 status='estimate', value_si=1e-4, unit_si='1 (shear strain ≈ PPV / c_s)', low_si=1e-5, high_si=1e-3,
 display='Trust the model while PPV/c_s < about 10⁻⁴ (e.g. below 12 mm/s on loose sand, 25 mm/s on stiff clay); closer in, soil softens and damps more, so the model over-estimates',
 sources=[sCOL], who_when='our estimate 2026',
 notes=("Shear strain in a passing wave is about particle velocity / wave speed. Soil stiffness starts to fall and damping to rise somewhere around 10⁻⁵–10⁻⁴ strain and soils yield near 10⁻³ (typical soil-dynamics ranges; no source fetched in this run). Pisa: 9 mm/s at 2.5 m on 150 m/s ground is 6 × 10⁻⁵ strain and the elastic model still matched. A stamp giving 70–160 mm/s at 1–3 m on loose sand (10⁻³) is outside the linear range: cap or flag those values. Inside the footprint the ground yields (footprint depth is a separate bearing-capacity result)."))

add(key='vib_walking_two_feet_caveat',
 label='Walking: the other foot unloading partly cancels the far-field shaking',
 status='estimate', value_si=0.5, unit_si='factor (possible reduction, far field, walking only)', low_si=0.5, high_si=1.0,
 display='While one foot loads, the other unloads; at distances and wavelengths much larger than the stride, the net force changes less, so walking PPV far away may be up to about 2× lower than a single-foot calculation',
 sources=[sEKI], who_when='our estimate 2026',
 notes=("The ground sees the sum of both feet's forces. In human walking the summed vertical force swings only modestly around body weight (Ekimov & Sabatier: force of multiple footsteps concentrated at 1–4 Hz), while each foot alone goes from zero to 1.0–1.5 × body weight. For wavelengths long compared with Rex's stride (1–2 m) the loading and unloading feet act partly as one varying source, which lowers the far-field PPV; near either foot (r of a few metres or less) the nearer foot dominates and the single-foot result holds. Fast transients (foot slap at touchdown) do not cancel. Not quantified with data; treat the single-foot model as an upper estimate for walking."))
