add(key='vib_bs5228_dynamic_compaction_predictor',
 label='BS 5228-2 Table E.1: ground vibration from dynamic compaction (weight dropped on the ground)',
 status='verified', value_si=3.7e-5, unit_si='m/s (coefficient k in PPV = k (sqrt(W_h)/x)^1.7, W_h in J, x in m)',
 display='PPV ≤ 0.037 (√W_h / x)^1.7 mm/s; W_h = potential energy of the raised tamper (J), x = distance along the ground (m); valid 5–100 m and 1–12 MJ',
 sources=[sBS], who_when='BSI 2014, reproducing Hiller & Crabb (TRL) 2000',
 notes=("Table E.1 row 'Dynamic compaction': 'νres ≤ 0.037 [√Wh / x]^1.7', parameter range '5 ≤ x ≤ 100 m' and '1.0 ≤ Wh ≤ 12 MJ'. Key: 'νres resultant PPV, in millimetres per second (mm·s−1)'; 'Wh potential energy of a raised tamper, in joules (J)'; 'x distance measured along the ground surface, in metres (m)'. Annex E.1: 'Hiller and Crabb [11] have derived empirical formulae relating resultant PPV with a number of other parameters ... from field measurements.' No scaling factor or probability is given for this row: it is an upper-bound style predictor (TRL 429 calls it Mayne's 'conservative upper limit'). It is the same law as Mayne (1985) in other units: 0.037 × (9,806.65)^0.85 = 91.4, i.e. 92 (√(M[t]·H[m]) / x)^1.7. PPV here is the resultant (vector) peak particle velocity. A footstep (10 J–10 kJ) is 100 to 100,000 times below the 1 MJ floor of the stated range, and 1–5 m is below its 5 m floor. Caution for implementers: W_h is in joules; one published calculation sheet (York Potash ES appendix 14.1) appears to apply the piling formula with energy in kJ."),
 values_json=json.dumps({'table':'BS 5228-2:2009+A1:2014 Table E.1 (resultant PPV in mm/s)','rows':[
  {'operation':'Vibratory compaction (steady state)','equation':'v_res = k_s sqrt(n_d) [A/(x+L_d)]^1.5','scaling':'k_s = 75 (50%), 143 (33.3%), 276 (5%)','range':'1 ≤ n_d ≤ 2; 0.4 ≤ A ≤ 1.72 mm; 2 ≤ x ≤ 110 m; 0.75 ≤ L_d ≤ 2.2 m'},
  {'operation':'Vibratory compaction (start up and run down)','equation':'v_res = k_t sqrt(n_d) [A^1.5/(x+L_d)^1.3]','scaling':'k_t = 65 (50%), 106 (33.3%), 177 (5%)','range':'as above'},
  {'operation':'Percussive piling','equation':'v_res ≤ k_p [sqrt(W)/r^1.3]','scaling':'piles at refusal k_p = 5; not at refusal 1 ≤ k_p ≤ 3 by soil (Table E.2)','range':'1 ≤ L ≤ 27 m; 1 ≤ x ≤ 111 m (r² = L² + x²); 1.5 ≤ W ≤ 85 kJ; W nominal hammer energy in J'},
  {'operation':'Vibratory piling','equation':'v_res = k_v / x^delta','scaling':'k_v = 60 (50%), 126 (33.3%), 266 (5%)','range':'1 ≤ x ≤ 100 m; 1.2 ≤ W ≤ 10.7 kJ; delta = 1.3 all, 1.2 start/stop, 1.4 steady'},
  {'operation':'Dynamic compaction','equation':'v_res ≤ 0.037 [sqrt(W_h)/x]^1.7','scaling':'none (upper bound)','range':'5 ≤ x ≤ 100 m; 1.0 ≤ W_h ≤ 12 MJ; W_h in J'},
  {'operation':'Vibrated stone columns','equation':'v_res = k_c / x^1.4','scaling':'k_c = 33 (50%), 44 (33.3%), 95 (5%)','range':'8 ≤ x ≤ 100 m'},
  {'operation':'Tunnelling (groundborne vibration)','equation':'v_res ≤ 180 / x^1.3','scaling':'none','range':'10 ≤ r ≤ 100 m'}]}))

add(key='vib_bs5228_percussive_piling_kp',
 label='BS 5228-2 Table E.2: ground factor k_p for percussive piling (PPV ≤ k_p √W / r^1.3)',
 status='verified', value_si=None, unit_si='mm/s per (J^0.5 m^-1.3)',
 display='k_p = 5 (piles at refusal), 3 (very stiff clay, dense granular), 1.5 (stiff clay, medium dense granular, compacted fill), 1 (soft clay, loose granular, loose fill, organic)',
 sources=[sBS, sTRL], who_when='BSI 2014; Hiller & Crabb 2000 (TRL 429 Table 9)',
 notes=("Table E.2 'Values of kp for use in predictions of vibration from percussive piling'. The BS copy prints the 1.5 row as 'Pile toe not being driven through: Stiff cohesive soils ...' while TRL 429 Table 9 (the origin) reads 'Pile toe being driven through: Stiff cohesive soils; Medium dense granular soils; Compacted fill. 1.5'. TRL 429 eq. 19 defines W as 'the hammer energy per blow (J)' and r as 'the distance from the toe of the pile to the point of interest (m)'. TRL: k_p values were 'calculated such that the value of vres at a distance (r) of 10m equates to the less conservative of the values' of Whyley & Sarsby (1992) and CEN (1998). The energy is released at the pile toe at depth, so this is not a surface-impact law; it is listed only because it is the one BS predictor with a ground-type factor (soft/loose ground 1 vs very stiff/dense 3: a factor of 3 between ground classes)."),
 values_json=json.dumps({'refusal':5,'very stiff cohesive / dense granular / fill with large obstructions':3,'stiff cohesive / medium dense granular / compacted fill':1.5,'soft cohesive / loose granular / loose fill / organic':1,'units':'v_res mm/s, W in J, r in m'}))

add(key='vib_mayne1985_upper_bound_trl',
 label='Mayne (1985) upper-bound law for dynamic compaction vibration, as printed in TRL 429',
 status='verified', value_si=0.092, unit_si='m/s (coefficient; M in tonnes, H in m, x in m, exponent 1.7)',
 display='v_res ≤ 92 (√(M·H) / x)^1.7 mm/s (M tamper mass in t, H drop height in m, x distance in m)',
 sources=[sTRL], who_when='Mayne 1985, as reproduced by Hiller & Crabb 2000',
 notes=("TRL 429 section 6.2 (p. 62): 'Mayne et al (1984) presented data from a number of dynamic compaction case histories and suggested a predictor which could be used to determine a conservative upper limit of vibration. The predictor was subsequently revised (Mayne, 1985) and presented as: v_res ≤ 92 [√(MH)/x]^1.7 (21) where v_res is the peak particle velocity (mm/s); M is the tamper weight (tonnes); H is the drop height (m); x is the distance from impact (m).' TRL's own Coventry check (8.5 t from 10 m and 12 m, i.e. 0.8 and 1.0 MJ, measured at 5–120 m) 'verified the predictor ... which provided a reasonable upper bound to the data (Figure 43). However, the attenuation rate on the site monitored by TRL was lower than that proposed by Mayne, which resulted in an over prediction close to the source and an underestimate of vibration levels at distances in excess of 60m from the impact.' Identical to the BS 5228-2 dynamic compaction row (0.037 with energy in J). The original Mayne papers were not fetched (ASCE paywall)."))

add(key='vib_mayne_law_low_energy_failure',
 label='Mayne/BS 5228 dynamic-compaction law at low drop energy: TRL finds it under-predicts by up to 10×',
 status='verified', value_si=10, unit_si='ratio (measured / predicted, worst case)',
 low_si=2, high_si=10,
 display='For a 7 t weight dropped 1.2 m (82 kJ), measured PPV exceeded the Mayne (1985) prediction by up to an order of magnitude',
 sources=[sTRL], who_when='Hiller & Crabb 2000, data of Allen 1996',
 notes=("TRL 429 p. 62–63 on the high-speed dynamic compactor ('a 7 tonne weight dropped from a height of up to 1.2m onto a metal plate, which remains in contact with the ground'): 'The predictor appears to be unreliable for this compaction process, under estimating the vibration level by up to an order of magnitude. It is possible that Mayne’s predictor is less reliable for low energy dynamic compaction than for more energetic compaction. Most of the data from which Mayne’s predictor was derived were from higher energy compaction than the energy of the high speed dynamic compaction apparatus. Furthermore, inspection of Mayne’s field data shows that the predictor becomes less conservative as the potential energy of the raised tamper decreases.' 82 kJ is already 12 times below the 1 MJ floor of BS 5228's range; footsteps (10 J–10 kJ) are lower still, so the law cannot be trusted at Rex's scale without correction. See vib_trl429_hsdc_digitised for the numbers read off the figure."))

add(key='vib_trl429_hsdc_digitised',
 label='High-speed dynamic compactor (7 t from 1.2 m, 82 kJ): measured PPV vs distance, read from TRL 429 Fig. 44',
 status='derived', value_si=None, unit_si='m/s',
 display='About 120–150 mm/s at 5.6 m, 22–30 at 10.5 m, 8–10 at 16 m, 4–8 at 35 m, 2–4 at 57–75 m, 1.3–1.5 mm/s at 120 m (three sites); Mayne (1985) predicts 30, 10, 5, 1.3, 0.4–0.6 and 0.16 mm/s',
 sources=[sTRL], who_when='Allen 1996 data as plotted by Hiller & Crabb 2000; read off the figure by us 2026',
 notes=("Values read by eye from the log-log plot in TRL 429 Figure 44 ('Vibration data from the high speed dynamic compactor reported by Allen (1996) compared with ppv predicted for the 7t tamper dropped from 1.2m using Mayne’s equation (1985)'; sites Weston, Waterbeach, Ipswich): reading error about ±20%. Predictions computed by us from 92 (√(7×1.2)/x)^1.7 (W = 7,000 × 9.80665 × 1.2 = 82.4 kJ). Ratio measured/predicted: 4–5 at 5.6 m, 2–3 at 10–20 m, 3–7 at 35–57 m, 8–12 at 75–120 m. The measured fall-off is about x^-1.1 to x^-1.3, slower than the law's x^-1.7. The weight lands on a steel plate already in contact with the ground, so this is a cleaner, stiffer impact than a crane drop."),
 values_json=json.dumps({'distance_m':[5.6,10.5,16,21,35,57,75,120],'measured_mm_s':[[120,150],[22,30],[8,10],[7,10],[4,8],[1.8,4],[2.8,4.3],[1.3,1.5]],'mayne1985_mm_s':[29.8,10.2,5.0,3.2,1.3,0.58,0.36,0.16],'note':'measured values read from TRL 429 Fig. 44, ±20%'}))

add(key='vib_trl429_validity_100m',
 label='TRL 429: empirical construction-vibration predictors hold to about 100 m',
 status='verified', value_si=100, unit_si='m',
 display='Valid up to about 100 m from the source; extrapolating much further is not recommended (usually conservative)',
 sources=[sTRL], who_when='Hiller & Crabb 2000',
 notes=("TRL 429 p. 73: 'The predictors are valid up to a distance of about 100m from the vibration source. ... Extrapolation much beyond this distance is not recommended although it will generally provide a conservative estimate.' Also: 'the effects of material damping on attenuation have not been included in the predictors because in nearly all cases the fit of the model to the data was not significantly improved by its inclusion. The slopes of the attenuation curves are, however, steeper than those expected theoretically from geometric attenuation'. 'For the other activities predictors presented as upper bounds to the data and therefore are expected to be generally conservative.'"))

add(key='vib_mayne1984_upper_bound',
 label='Mayne, Jones & Dumas (1984) original upper-bound law for dynamic compaction vibration',
 status='reported', value_si=0.070, unit_si='m/s (coefficient; W in tonnes, H in m, d in m, exponent 1.4)',
 display='PPV ≤ 70 (√(W·H) / d)^1.4 mm/s (W tamper in t, H drop in m, d in m)',
 sources=[sLAU], who_when='Mayne, Jones & Dumas 1984, as reproduced by Lauzon et al. c. 2011',
 notes=("Not seen in the original (J. Geotech. Eng. ASCE 110(6):757-774 is paywalled). Lauzon et al. eq. [2]: 'For preliminary estimates, Mayne et al (1984) proposed the following formula as a conservative upper limit to the ground vibration levels: PPV (mm/s) ≤ 70 (√(W H)/d)^1.4 ... Where W is in tonnes and H and d are in metres.' An eng-tips forum post gives the same 70 and 1.4. TRL 429 says this 1984 predictor 'was subsequently revised (Mayne, 1985)' to 92 and 1.7. The data range of the 1984 paper (energies, distances, soils) could not be verified. At the Pisa drop test (3.8 kJ) it does better than the 1985 form: 10 mm/s at 2.5 m (measured 9) and 0.12 mm/s at 60 m (measured 0.2)."))

add(key='vib_mayne1985_normalised_law',
 label='Mayne (1985) normalised form: PPV scaled by impact speed and tamper radius',
 status='reported', value_si=0.2, unit_si='1 (coefficient; PPV in the same units as impact speed)',
 display='PPV = 0.2 √(2gH) (d/r₀)^-1.7 (impact speed √(2gH), tamper radius r₀; based on 12 sites)',
 sources=[sLAU], who_when='Mayne 1985, as reproduced by Lauzon et al. c. 2011',
 notes=("Lauzon et al. eq. [4]: 'Based on vibration monitoring data from 12 different sites, Mayne (1985) proposed the following approximation: PPV = 0.2 √(2 g H) (d/ro)^-1.7 ... Where d is the distance, from the point of impact and ro is the radius of the tamper. PPV, g and H are in consistent units. With this approach, Mayne (1985) could attain a better fit for his set of data.' The source paper (ASCE Soil Dynamics Committee convention, Detroit 1985) was not fetched. Note it is independent of mass: it predicts the same shaking for any weight with the same contact radius and impact speed, which cannot hold for a footstep (a slow load, not a drop)."))

add(key='vib_lukas_scaled_energy_chart',
 label='FHWA chart: PPV against scaled energy factor √E / d, one line per soil type (Lukas 1986, 1995)',
 status='verified', value_si=None, unit_si='m/s',
 display='PPV grows with √(energy)/distance; separate lines for 8 ground types; data span scaled energy factor ≈ 0.07–6 √(t·m)/m and PPV ≈ 1–250 mm/s',
 sources=[sLUK, sGEC], who_when='Lukas 1986 (Fig. 35); Lukas 1995 (GEC 1 Fig. 7)',
 notes=("FHWA/RD-86/133 p. 99: 'Lukas (51, 54, 56) and Steinberg and Lukas (87), have accumulated information regarding the particle velocity measured at ground surface from dynamic compaction operations at varying distances from the point of impact in different soil types. This data is shown in Figure 35. The magnitude of ground vibration increases with the square root of the energy applied and decreases as the distance from the point of impact. This figure can be used for planning purposes.' Fig. 35 axes: particle velocity in in/s against 'scaled energy factor (√energy – foot pounds / distance – feet)'. GEC 1 (1995) Fig. 7 gives the SI version: x axis 'SCALED ENERGY FACTOR, (√(ENERGY (kJ)/9.8) / DISTANCE (m))', y axis particle velocity (mm/sec), soils: 1 very stiff silty clay, 2 medium dense micaceous sand, 3 clayey mine spoil, 4 building rubble, 5 collapsible silt, 6 loose sand, 7 loose sand fill, 8 loose decomposed garbage; GEC 1 p. 12: 'This chart is based on records taken from many sites and provides a good estimation of ground vibration levels for planning purposes.' The plotted lines span roughly 0.07 to 6 on the x axis (our reading). A footstep of 10 J–10 kJ at 1–200 m has a scaled energy factor of about 0.0002–1, mostly to the left of the data."))
