import json, os, copy

BASE = '/tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad'
R = json.load(open(BASE + '/wfout/research_attenuation.json'))
OUT_DIR = BASE + '/compiled'
OUT = OUT_DIR + '/attenuation.json'

src = {f['key']: f for f in R['facts']}
order = [f['key'] for f in R['facts']]

TRL = {"title": "Hiller & Crabb (2000) TRL Report 429, Groundborne vibration caused by mechanised construction works (Transport Research Laboratory for the Highways Agency)",
       "url": "https://www.trl.co.uk/uploads/trl/documents/TRL429.pdf"}

O = {}  # overrides per key

O['vib_bs5228_dynamic_compaction_predictor'] = dict(
    notes="Table E.1 row 'Dynamic compaction': 'νres ≤ 0.037 [√Wh / x]^1.7', range '5 ≤ x ≤ 100 m' and '1.0 ≤ Wh ≤ 12 MJ'. Key: 'νres resultant PPV, in millimetres per second (mm·s−1)'; 'Wh potential energy of a raised tamper, in joules (J)'; 'x distance measured along the ground surface, in metres (m)'. No scaling factor is given: it is an upper-bound predictor (TRL 429 calls Mayne's law a 'conservative upper limit'). Same law as Mayne (1985) to within 1%: 0.037 × 9,806.65^0.85 = 91.4, against 92 with M in t and H in m. Footsteps (our assumed 10 J–10 kJ) are 100 to 100,000 times below the 1 MJ floor, and 1–5 m is inside the 5 m floor. W_h is in joules: the York Potash sheet's 85 kJ percussive case (0.3 mm/s at 19.0 m) only works with W in kJ. Verifier: re-fetched; row, ranges and key confirmed.",
)

O['vib_bs5228_percussive_piling_kp'] = dict(
    notes="Table E.2 'Values of kp for use in predictions of vibration from percussive piling'. The BS copy prints the 1.5 row as 'Pile toe not being driven through: Stiff cohesive soils ...'; TRL 429 Table 9 (the origin) reads 'Pile toe being driven through'. TRL eq. 19: W is 'the hammer energy per blow (J)' and r 'the distance from the toe of the pile to the point of interest (m)'. k_p values were 'calculated such that the value of vres at a distance (r) of 10m equates to the less conservative of the values' of Whyley & Sarsby (1992) and CEN (1998). The energy is released at the pile toe, at depth, so this is not a surface-impact law. It is listed only as the one BS predictor with a ground-type factor (soft or loose 1, very stiff or dense 3). Verifier: values, wording conflict and quotes confirmed.",
)

O['vib_mayne1985_upper_bound_trl'] = dict(
    notes="TRL 429 section 6.2 (p. 62): 'Mayne et al (1984) ... suggested a predictor which could be used to determine a conservative upper limit of vibration. The predictor was subsequently revised (Mayne, 1985) and presented as: v_res ≤ 92 [√(MH)/x]^1.7', with M 'the tamper weight (tonnes)', H 'the drop height (m)' and x 'the distance from impact (m)'. TRL's Coventry check (8.5 t from 10 and 12 m, 0.8–1.0 MJ, measured at 5–120 m) found 'a reasonable upper bound to the data', but 'an over prediction close to the source and an underestimate of vibration levels at distances in excess of 60m from the impact'. Same law as the BS 5228-2 dynamic compaction row to within 1% (0.037 × 9,806.65^0.85 = 91.4 vs 92). Original Mayne papers not fetched (ASCE). Verifier: 'identical to the BS row' corrected to 'within 1%'.",
)

O['vib_mayne_law_low_energy_failure'] = dict(
    low_si=1.4, high_si=10,
    display="7 t weight dropped 1.2 m (82 kJ): measured PPV was 1.4–5× the Mayne (1985) prediction within 30 m and 2.5–10× at 50–100 m (TRL: 'up to an order of magnitude')",
    notes="TRL 429 pp. 62–63 on the high-speed dynamic compactor ('a 7 tonne weight dropped from a height of up to 1.2m onto a metal plate, which remains in contact with the ground'): 'The predictor appears to be unreliable for this compaction process, under estimating the vibration level by up to an order of magnitude. It is possible that Mayne’s predictor is less reliable for low energy dynamic compaction than for more energetic compaction.' Also: 'the predictor becomes less conservative as the potential energy of the raised tamper decreases.' The 10 is TRL's wording; the 1.4–5 and 2.5–10 ranges are our reading of Fig. 44 (vib_trl429_hsdc_digitised). 82 kJ is 12 times below BS 5228's 1 MJ floor. Verifier: Fig. 44 distance axis was misread; low bound corrected from 2 to 1.4. Compiler: the verifier's '1.4–4× within 30 m' is given as 1.4–5× because its own table shows 2.3–4.9 at 30 m.",
)

O['vib_trl429_hsdc_digitised'] = dict(
    display="Measured about 120–145 mm/s at 5 m, 21–30 at 10 m, 8–10 at 15 m, 6–10 at 20 m, 4–8 at 30 m, 2–4 at 50 m, 3–4 at 70 m and 1.2–1.5 mm/s at 100 m (three sites); Mayne (1985) predicts 36, 11, 5.6, 3.4, 1.7, 0.73, 0.41 and 0.22 mm/s",
    notes="Read by eye from the log-log plot in TRL 429 Fig. 44, PDF p. 68 ('Vibration data from the high speed dynamic compactor reported by Allen (1996) compared with ppv predicted for the 7t tamper dropped from 1.2m using Mayne’s equation (1985)'; sites Weston, Waterbeach, Ipswich). Reading error about ±20%. Predictions are ours: 92 (√(7 × 1.2)/x)^1.7, W = 82.4 kJ. Measured/predicted: 3.3–4.0 at 5 m, 1.4–2.8 at 10–20 m, 2.3–5.6 at 30–50 m, 5.5–10 at 70–100 m. Measured fall-off is about x^-1.35 over 5–100 m (x^-1.1 over 10–100 m), slower than the law's x^-1.7. The weight lands on a steel plate already on the ground. Verifier: the plot's right edge is 100 m, not 120 m (the Mayne line reads 36 mm/s at 5 m and 0.22 at 100 m, matching the formula). Distances, predictions and ratios replaced; the earlier 5.6–120 m reading and 2–12× ratios are withdrawn.",
    values_json=json.dumps({
        "distance_m": [5, 10, 15, 20, 30, 50, 70, 100],
        "measured_mm_s": [[120, 145], [21, 30], [8, 10], [6.4, 9.5], [3.9, 8.4], [1.8, 4.1], [2.6, 4.3], [1.2, 1.5]],
        "mayne1985_mm_s": [36.4, 11.2, 5.6, 3.4, 1.7, 0.73, 0.41, 0.22],
        "ratio_measured_over_mayne": [[3.3, 4.0], [1.9, 2.7], [1.4, 1.8], [1.9, 2.8], [2.3, 4.9], [2.5, 5.6], [6, 10], [5.5, 6.6]],
        "measured_fall_off": "about x^-1.35 over 5-100 m; x^-1.1 over 10-100 m",
        "note": "measured values read from TRL 429 Fig. 44 (PDF p. 68), about +/-20%; distance axis corrected by the verifier (right edge = 100 m)"}, ensure_ascii=False),
)

O['vib_trl429_validity_100m'] = dict(
    display="Valid up to about 100 m from the source; extrapolating much further is not recommended (TRL: it 'will generally provide a conservative estimate')",
    notes="TRL 429 p. 73: 'The predictors are valid up to a distance of about 100m from the vibration source. ... Extrapolation much beyond this distance is not recommended although it will generally provide a conservative estimate.' Material damping was left out 'because in nearly all cases the fit of the model to the data was not significantly improved by its inclusion. The slopes of the attenuation curves are, however, steeper than those expected theoretically from geometric attenuation of body waves in a homogeneous medium (slope of 1/r). Since the majority of the energy from sources of vibration at the ground surface radiates as surface waves ..., it may be inferred that attenuative mechanisms other than geometric spreading are also effective.' Verifier: the earlier quote stopped at 'geometric attenuation', changing its meaning; now restored.",
)

O['vib_mayne1984_upper_bound'] = dict(
    notes="Not seen in the original (J. Geotech. Eng. ASCE 110(6):757-774, paywalled). Lauzon et al. eq. [2]: 'For preliminary estimates, Mayne et al (1984) proposed the following formula as a conservative upper limit to the ground vibration levels: PPV (mm/s) ≤ 70 (√(W H)/d)^1.4 ... Where W is in tonnes and H and d are in metres.' TRL 429 says this predictor 'was subsequently revised (Mayne, 1985)' to 92 and 1.7. The data range of the 1984 paper (energies, distances, soils) is unknown. At the Pisa drop (3.8 kJ) it gives 10.0 mm/s at 2.5 m (measured 9) and 0.117 mm/s at 60 m (measured 0.2). Verifier: eq. [2] confirmed from a page image; 'reported' is the right status.",
)

O['vib_mayne1985_normalised_law'] = dict(
    notes=src['vib_mayne1985_normalised_law']['notes'] + " Verifier: eq. [4], '12 different sites' and 'consistent units' confirmed from a page image.",
)

O['vib_lukas_scaled_energy_chart'] = dict(
    display="PPV grows with √(energy)/distance; separate lines for 8 ground types. The plotted lines span a scaled energy factor of about 0.07–6 √(t·m)/m and PPV of about 1–250 mm/s (our reading of the chart)",
    notes="FHWA/RD-86/133 p. 99: 'The magnitude of ground vibration increases with the square root of the energy applied and decreases as the distance from the point of impact. This figure can be used for planning purposes.' Fig. 35: particle velocity (in/s) against 'scaled energy factor (√energy – foot pounds / distance – feet)'. GEC 1 (1995) Fig. 7 is the SI version: x 'SCALED ENERGY FACTOR, (√(ENERGY (kJ)/9.8) / DISTANCE (m))', y mm/s, eight soils (listed in vib_gec1_chart_digitised). GEC 1 p. 12: 'This chart is based on records taken from many sites and provides a good estimation of ground vibration levels for planning purposes.' The axis itself runs 0.001–100; the 0.07–6 and 1–250 mm/s spans are read off the figure (derived, not stated). A footstep of our assumed 10 J–10 kJ at 1–200 m has a factor of about 0.0002–1, mostly left of the data. Verifier: quotes and axes confirmed.",
)

O['vib_gec1_chart_digitised'] = dict(
    notes="Marker points read off GEC 1 Fig. 7 (x = scaled energy factor in √(t·m)/m, y = PPV in mm/s), reading error about ±25%; listed in values_json. Line slopes read as about 1.0–1.4 on log-log axes. Values at x = 1 are our extrapolation with slope 1.2: about 13 mm/s (loose decomposed garbage) to 80 mm/s (very stiff silty clay). For comparison, the BS 5228 / Mayne (1985) upper bound gives 91 mm/s and Mayne (1984) 70 mm/s at x = 1. In this dynamic-compaction data stiffer, denser ground gives more PPV per unit scaled energy (loose fills absorb energy in the crater). That is the opposite of the elastic small-load trend, where softer ground shakes more for the same force; keep the two regimes apart. Verifier: re-read all eight points independently; all agree within about 5%.",
)

O['vib_dynamic_compaction_frequency'] = dict(
    notes=src['vib_dynamic_compaction_frequency']['notes'] + " Verifier: quotes confirmed.",
)

O['vib_repeat_drops_raise_ppv'] = dict(
    label="PPV from the same drop rises as the ground under it is compacted (about 3–8× over repeated drops)",
    low_si=3, high_si=8,
    notes="Lukas 1986 p. 100: 'Dumas and Beaton (25) present information showing how the peak particle velocity increases from .16 to .51 in/sec (4 to 13 mm/sec) as the number of drops increases from 1 to 21. These readings were obtained at a point located 66 ft (20 m) from the imprint where a 20 ton (18.1 t) tamper was being dropped over a height of 98 ft (30 m) onto a silty rock fill.' Lauzon et al.: 'For the first blow, the vibration level was measured between 1 and 2 mm/s. After 6 blows the vibration level reached close to 8 mm/s at a distance of 10 m from the point of impact.' The first drop onto soft ground loses energy to cratering. Our cross-check: 18.1 t × 30 m = 5.3 MJ gives 119 mm/s at 20 m from BS 5228's upper bound, 9–30 times the 4–13 measured. Compiler: low bound changed from 2 to 3 (0.51/0.16 = 3.2; 8/2 = 4). Verifier: quotes and cross-check confirmed.",
)

O['vib_pisa_drop_test_ppv'] = dict(
    display="9 mm/s at 2.5 m falling to 0.2 mm/s at 60 m (quoted); fitted fall-off ∝ r^-1.28. Drop: 130 kg from about 3 m (about 3.8 kJ)",
    notes="'The drop load test configuration consisted of a 130 kg weight dropped from a height of approximately 3 m, hitting the ground directly in order to avoid mass rebound'; '24 in-line geophones at 2.5m spacing'. 'The magnitude of the peak particle velocities recorded in Pisa decreases from 9 mm/s at a distance of 2.5 m from the source to 0.2 mm/s at a distance of 60 m (Figure 6, white circles).' Field power-law slope 'q = 1.282'. Probably vertical geophones. Verifier: values_json holds its Fig. 6 readings (±10%); the earlier 5 and 0.5 mm/s at 5 and 35 m are now 4.7 and 0.4. '25 Hz' is the central frequency of the authors' synthetic source pulse, not a measurement. T_S = 0.04 s is 'the period of the function' of a modified Gabor wavelet 'obtained with a calibration on the signal at the first geophone', not a contact time. C_b = 997.4 kg·m/s equals the drop momentum (130 × 7.67 m/s).",
    values_json=json.dumps({
        "distance_m": [2.5, 5, 10, 15, 20, 30, 35, 60],
        "ppv_mm_s": [8.7, 4.7, 1.8, 1.1, 0.77, 0.45, 0.4, 0.19],
        "quoted_in_text_mm_s": {"2.5": 9, "60": 0.2},
        "quality": "read from Colombero et al. Fig. 6 field circles by the verifier, about +/-10%",
        "fit_exponent_q": 1.282,
        "drop": "130 kg from ~3 m, directly on ground",
        "synthetic_source": {"central_frequency_Hz": 25, "T_S_s": 0.04, "C_b_kg_m_s": 997.4, "note": "model input fitted to the first geophone, not measured"}}, ensure_ascii=False),
)

O['vib_pisa_soil_profile'] = dict(
    notes=src['vib_pisa_soil_profile']['notes'] + " value_si 170 m/s is our pick: the layer depths appear only in Fig. 3. Verifier: Table 1 and the 1.3 m water table confirmed.",
)

O['vib_drop_test_exponent_by_soil'] = dict(
    notes="Colombero et al. section 2.2: 'The experimental exponent q has been found varying between values of 1.0 and 1.6 for drop load tests carried out on sandy and clayey soils respectively (Auersch 2010).' Auersch & Said 2010 abstract (TRID): 'the technically induced ground vibrations exhibit a power-law attenuation v ∼ r −q where the exponents q are in the range of 0.5 to 2.0 and depend on the source types'; the main extra effect is 'material or scattering damping'; 'the sum of the exponential laws also yields a power law but with a higher exponent'; Rayleigh dispersion from layering 'yields an additional exponent of 0.5 in cases of impulsive loading'. Theory for a surface point load: 0.5 for Rayleigh waves alone (vib_geometric_spreading_exponents). Verifier: quotes confirmed. Caveats: Auersch 2010's 1.0/1.6 is seen only through Colombero; value_si 1.3 is our midpoint, not a source number.",
)

O['vib_pisa_vs_empirical_laws'] = dict(
    notes=src['vib_pisa_vs_empirical_laws']['notes'] + " Verifier: recomputed (8.65 and 0.039; 10.0 and 0.117 mm/s). With its Fig. 6 reading of 0.19 mm/s at 60 m the ratios (about 5× and 1.6×) still hold.",
)

O['vib_caltrans_impact_pile_driver'] = dict(
    notes=src['vib_caltrans_impact_pile_driver']['notes'] + " Verifier: confirmed.",
)

O['vib_woods_jedele_n_by_soil_class'] = dict(
    notes="Caltrans Table 17 (p. 32) 'Measured and Suggested “n” Values Based on Soil Class': I 'Weak or soft soils: loose soils, ... loose beach sand, and dune sand, recently plowed ground, ... top soil. (shovel penetrates easily)' — 'Data not available', suggested 1.4. II 'Competent soils: most sands, sandy clays, silty clays, gravel, silts, weathered rock. (can dig with shovel)' — 1.5, suggested 1.3. III 'Hard soils: dense compacted sand, dry consolidated clay, consolidated glacial till, some exposed rock. (cannot dig with shovel, need pick to break up)' — 1.1, 1.1. IV 'Hard, competent rock: bedrock, freshly exposed hard rock' — 'Data not available', 1.0. Caltrans: n 'is a composite value or pseudo-attenuation coefficient that accounts for both geometric and material damping'. Verifier: table confirmed word for word; Caltrans Table 3 (p. 17) is the measured-only version, 'Source: Wood 1997'.",
)

O['vib_footstep_frequency_band'] = dict(
    who_when="Earlier research as summarised in Ekimov & Sabatier 2006",
    notes="Abstract: 'Early research showed the maximum value for the force of multiple footsteps to be in the frequency band of 1-4 Hz.' 'The seismic particle velocity response to footsteps was shown to be site specific and the characteristic frequency band was 20-90 Hz.' 'Different walking styles result in different vibration signatures in the low-frequency range.' Both bands are earlier findings that the abstract summarises; the paper itself studies building floors and the band above 500 Hz, so cite them 'as summarised in Ekimov & Sabatier 2006'. The gap between 1–4 Hz force and 20–90 Hz ground velocity fits vib_physics_rayleigh_farfield: for the same force amplitude, ground velocity grows as frequency^1.5, so the quick parts of a footfall dominate. No footstep PPV against distance was found in a primary source. Verifier: abstract confirmed; citation caveat added.",
)

O['vib_elephant_seismic_speed_frequency'] = dict(
    notes="Abstract: 'the acoustic signals traveling at 309 m/s and the seismic signals at 248-264 m/s. Both types of signals had predominant frequencies in the range of 20 Hz. Seismic signal amplitudes considerably above background noise were recorded at 40 m from the generating elephants for both the rumble and the stomp. Seismic propagation models suggest that seismic waveforms from vocalizations are potentially detectable by instruments at distances of up to 16 km, and up to 32 km for locomotion generated signals.' The 16–32 km figures are model estimates of instrument detection, not felt vibration. Our interpretation, not stated in the abstract: the 248–264 m/s is a Rayleigh-type surface-wave speed, implying a shear-wave speed of about 270–290 m/s (c_R ≈ 0.92 c_s). The elephant comparison as a whole belongs to the elephant topic. Verifier: abstract confirmed; the Rayleigh reading is ours.",
)

O['vib_elephant_stomp_ppv'] = dict(
    notes="Secondary quote; only the original's abstract was fetched: 'According to [44], the RMS velocity of elephant rumbles is 0.437 µm/s at a distance of 3-12 m and is 0.264 µm/s at a distance of 40 m. For the corresponding distances, experimental peak-to-peak velocities for stomps were 48.7 µm/s and 17.0 µm/s, respectively.' Ref. [44] is the JASA 108(6):3066 paper; vertical geophone. Peak (zero-to-peak) is about half of peak-to-peak. The elephants' masses and stomp forces are not in what we fetched, so this is an order-of-magnitude anchor: a few hundredths of a mm/s at about 10 m, about 6–12 times below BS 5228-2 Table B.1's 'might be just perceptible' guide values (0.14 mm/s 'in the most sensitive situations', 0.3 mm/s 'in residential environments'). Ratio 3–12 m to 40 m ≈ 2.9. Verifier: quote, reference and Table B.1 values confirmed.",
)

O['vib_wave_energy_partition_miller_pursey'] = dict(
    notes="Sanchez-Sesma et al.: 'they found that the total power radiated by a vertical harmonic load Pe^{iωt} is given by Π=1.209ω²P²/πρα³, where ω = circular frequency, ρ = mass density, and α = propagation velocity of P waves. Such an amount is partitioned among P, SV and Rayleigh waves in 6.89, 25.76 and 67.35 per cent, respectively. They assumed a Poisson ratio ν =1/4'. Caltrans p. 13: 'About 67% of energy is transmitted in the R-wave, 26% in the S-wave, and 7% in the P-wave (Richart 1970).' TRL 429 p. 5: 'approximately two thirds of the energy from a source located at the ground surface is radiated as Rayleigh waves.' The 1955 paper was not fetched. Valid for a source small compared with the wavelength. Our Rayleigh amplitude (vib_physics_rayleigh_farfield) matches the 1.209 and 67.35% values to 0.02%. Verifier: all three quotes confirmed.",
)

O['vib_bornitz_damping_form'] = dict(
    notes="TRL 429 eq. (5): 'A1 = A0 (r0/r1)^β e^{-α(r1 - r0)} where A1 is the amplitude at distance r1 from the source; A0 is the amplitude at distance r0 from the source; α is the absorption coefficient; and ß is the geometric spreading term. Mintrop (1911) presented this equation with ß having a value of 0.5'. 'Greenwood and Farmer (1971) and Heckman and Hagerty (1978) assumed α to have a value of 0.03ft-1 (0.10m-1). However, these authors considered that this value is applicable to all cases and is not dependent upon the geology.' Massarsch (1992) example with α = 0.05 m⁻¹. Caltrans Eq. 6 (Richart 1970) is the same form. α depends on frequency (α = 2π f ξ / c_R), so one α applied to a whole pulse over-damps it at long range; our pulse treatment is vib_physics_damping_factor. Verifier: confirmed.",
)

O['vib_material_damping_coefficients'] = dict(
    notes="Caltrans Table 2 'Summary of Material-Damping Coefficients (Applies to Both P- and S-Waves)', compiled from Amick 2000 and Hendriks 2002; each row in values_json as α per metre (per foot). Three printed metric lower bounds are decimal slips: Dalmatov sand and silt 0.079 ft⁻¹ printed 0.026 m⁻¹ (should be 0.26); dune sand 0.076 ft⁻¹ printed 0.025 (0.25); soft Bangkok clay 0.079 ft⁻¹ printed 0.026 (0.26). values_json gives the corrected values and notes the printed ones. Measurement frequencies are not given, so these α cannot be moved to another frequency without assuming one (α = 2π f ξ / c_R). value_si 0.1 m⁻¹ is our typical pick (as for marly chalk and loess, and the Greenwood & Farmer value), not a table average. Verifier: table and investigator column confirmed; the three slips are real.",
)

O['vib_soil_p_to_s_speed_ratio'] = dict(
    notes=src['vib_soil_p_to_s_speed_ratio']['notes'] + " Verifier: quote confirmed; ν = 0.235 for 1.7 exactly; at ν = 0.45–0.49 the far coefficient drops 35–40% and the near 27–32%.",
)

O['vib_physics_nearfield_boussinesq'] = dict(
    notes="Static vertical surface displacement at distance r from a vertical point force F on an elastic half-space: u = (1 − ν) F / (2π μ r), μ = ρ c_s² (Boussinesq). When the force changes slowly compared with the wave transit time, the ground follows quasi-statically: v = (1 − ν) Ḟ / (2π μ r). Checks: the low-frequency limit of the full wavenumber integral gives −(1 − ν)/(2π) = −0.1194; the exact time-domain solution gives PPV·r → 0.375 F/(ρ c_s² T) for a Hann pulse and 0.1875 F/(ρ c_s² τ) for a raised-cosine ramp. Valid for r below about 0.4 c_s T (Hann) or 1.1 c_s τ (ramp), and for r more than about twice the footprint radius. Colombero et al. is cited only for listing Pekeris (1955) and Lamb (1904) as the classical point-load solutions; the formula is textbook elasticity. Verifier: limit and both constants reproduced independently; near-to-far crossovers at x = 0.37 (Hann) and 1.07 (ramp).",
)

O['vib_physics_rayleigh_farfield'] = dict(
    notes="Surface vertical displacement for a vertical harmonic point force: u_z = (F/2πμ) ∫ k_s² ν_α k J0(kr) / R(k) dk, with R(k) the Rayleigh function. The Rayleigh pole gives |u_z| = (F/μ) C1 √(k_s / (2π ξ_R r)), ξ_R = c_s/c_R. For ν = 1/4: ξ_R = 1.08766 (c_R = 0.9194 c_s), C1 = 0.19957; velocity = ω u gives 0.19957/√(2π·1.08766) = 0.0763. Checks: (1) the Rayleigh power from this amplitude is 0.04989 ω²F²/(ρ c_s³), against Miller & Pursey's 67.35% × 1.209/(π·3^1.5) = 0.04988; (2) C1 equals √(3√3 + 5)/16, the Rayleigh coefficient in Pekeris's closed form; (3) horizontal/vertical comes out 0.681, the textbook value for ν = 1/4. The ω^1.5 growth is why the quick parts of a footfall dominate far away. Other Poisson ratios in values_json. Verifier: reproduced by its own pole residue and a separate energy-flux integral (0.04989 vs 0.04988); the ν = 0.45 row matches.",
)

O['vib_physics_pekeris_step_response'] = dict(
    label="Exact surface motion from a suddenly applied vertical point force (Pekeris 1955 closed form, ν = 1/4): derived and numerically verified, original not fetched",
    notes="Step load P·H(t), Poisson solid, γ_R² = (3 + √3)/4. τ < 1/√3: W = 0. 1/√3 < τ < 1: W = (1/32π)[6 − √3/√(τ² − 1/4) − √(3√3 + 5)/√(γ_R² − τ²) + √(3√3 − 5)/√(τ² − (3 − √3)/4)]. 1 < τ < γ_R: W = (1/16π)[6 − √(3√3 + 5)/√(γ_R² − τ²)]. τ > γ_R: W = 3/(8π). Rebuilt from memory: Pekeris (1955, PNAS 41:469) and Kausel (2012) could not be fetched. Our check: convolved with a smooth pulse it matches an independent numerical wavenumber integration to 0.5–1.3% RMS of peak at r = 1–10 c_s T. Velocity for any force history: v(r,t) = d/dt ∫ Ḟ(t − s) w_step(r, s) ds. Scripts: research/attenuation/scripts/lamb_check2.py and ppv_table.py. Verifier: W is continuous at the P arrival and at τ = 1, the static value is (1−ν)/2π, and the singular coefficient matches its own C1.",
)

pulse_vj = json.loads(src['vib_physics_pulse_ppv_model']['values_json'])
i = pulse_vj['x_r_over_csT'].index(43.843)
pulse_vj['Pi_hann'][i] = 0.094
pulse_vj['Pi_ramp'][i] = 0.027
pulse_vj['table_noise'] = "up to about 7% (verifier recomputation; x = 43.8 entries corrected from 0.100 and 0.0287)"
O['vib_physics_pulse_ppv_model'] = dict(
    notes="Vertical surface PPV at distance r from a vertical force on an elastic half-space (ρ, c_s, ν = 1/4). Hann: F·½(1 − cos 2πt/T), 0 ≤ t ≤ T (stamp). Ramp: F·½(1 − cos πt/τ) to τ, then held (footstep; toe-off mirrors it). Exact PPV = F/(ρ c_s³ T²)·Π(x), x = r/(c_s T), with τ for T for the ramp; Π in values_json. max(near, far) is within about 17% of it. D: vib_physics_damping_factor. Assumes uniform ground, footprint radius below 0.2 c_s T, linear ground (vib_linear_strain_limit), vertical force. Verifier: all constants reproduced; table error up to 7%. Checked against data only to 60 m, at one drop site (within about 2×). Beyond about 60 m the damped Hann pulse falls as r^-2 to r^-3, steeper than any measured trend (r^-1.0 to -1.6), so stamps are probably under-predicted there. PPV rises with F at fixed T and falls with r; it is not monotone in T (a longer Hann pulse gives more PPV at 100 m and beyond).",
    values_json=json.dumps(pulse_vj, ensure_ascii=False),
)

O['vib_physics_damping_factor'] = dict(
    notes="Each frequency ω decays as exp(−ω ξ r / c_R) (constant-Q damping; Colombero et al. use the same exp(−2πξ r/λ_R) form, eq. 2). Applied to the far-field Rayleigh pulse spectrum, taking the new peak gives D(ζ), ζ = ξ r/(c_R T). The fits are within a factor of 1.08 (Hann) and 1.20 (ramp) of the computed D over ζ = 0.001–100. At large ζ, D falls as ζ^-2.5 (Hann) or ζ^-1.5 (ramp). One fixed α (Bornitz) applied to the peak over-damps a pulse at long range. D is applied to both near and far terms. Pisa example (ξ 0.03, r 60 m, c_R 138 m/s, T 0.03 s): ζ = 0.43, D = 0.12. Verifier: reproduced by FFT. Caveat: with constant ξ, Hann-pulse PPV on soft ground falls as about r^-2 to r^-3 beyond 30 m (local slope 2.1 at 35–60 m and 2.7 at 100–200 m for Pisa inputs), while measured impact trends are r^-1.0 to -1.6. The ramp is less affected (slope 1.3–1.5).",
)

O['vib_physics_seismic_energy_from_force'] = dict(
    notes="From Π = 1.209 ω² P²/(π ρ c_p³) for P cos ωt, the real part of the ground's point admittance is 2.418 ω²/(π ρ c_p³). For a transient force, Parseval gives E = 2.418/(π ρ c_p³) · ∫ Ḟ² dt; with c_p = √3 c_s this is 0.148 ∫Ḟ² dt/(ρ c_s³). Valid for ν = 1/4 only. Examples (ours): Pisa drop as a 0.025–0.04 s Hann pulse of momentum 997 kg·m/s on c_s = 160 m/s: 6–25 J, 0.2–0.6% of the 3.8 kJ drop energy, above the 10⁻⁴ seismic efficiency the lab uses for large impacts (seismic_efficiency_impact). Rex walking with placeholder inputs (1.2 × body weight, 0.1 s raised-cosine rise and fall): about 1.7 J per step on loose sand, 0.15 J on stiff clay, 6 × 10⁻⁵ J on granite. The energy depends on how fast the force changes, not on body energy, so a seismic-efficiency factor is the wrong tool for footsteps. Verifier: derivation and all examples recomputed.",
)

O['vib_model_check_pisa'] = dict(
    value_si=2, low_si=1.1, high_si=2.1,
    unit_si="ratio (model / measured, best-guess inputs)",
    display="Model 9.3, 6.1, 3.5, 1.6, 0.65 and 0.21 mm/s against measured about 8.7, 4.7, 1.8, 0.77, 0.4 and 0.19 mm/s at 2.5, 5, 10, 20, 35 and 60 m: within about 2× across 2.5–60 m, with the contact time chosen within 0.025–0.04 s",
    notes="Pulse: Hann with F·T/2 = 997.4 N·s (momentum of 130 kg at √(2g·3) = 7.67 m/s, no rebound), T = 0.03 s; c_s 150 m/s, ρ 1,850 kg/m³, ξ 0.03 from the site table (vib_pisa_soil_profile). The contact time was not measured; T was chosen within 0.025–0.04 s, so this is partly a one-parameter fit. Against all Fig. 6 field points the model is 1.1–2.1× high (about 2× at 10–30 m); T = 0.04 s gives about 0.5–1.4×. The shapes differ: the model goes as 1/r, then 1/√r, then damped, while the data follow a straight r^-1.3. One site, and a drop, not a step. Verifier: the earlier 'worst ratio 1.3' used a misread 35 m value (0.5, now 0.4) and only 4 of about 20 field points; 25 Hz is a model input, not a measurement. The model numbers above stay valid as regression values for tests.",
    values_json=json.dumps({
        "distance_m": [2.5, 5, 10, 20, 35, 60],
        "model_mm_s": [9.3, 6.1, 3.5, 1.6, 0.65, 0.21],
        "measured_mm_s": [8.7, 4.7, 1.8, 0.77, 0.4, 0.19],
        "ratio_model_over_measured": [1.1, 1.3, 2.0, 2.1, 1.6, 1.1],
        "inputs": {"shape": "hann", "F_peak_N": 66493, "T_s": 0.03, "rho_kg_m3": 1850, "cs_m_s": 150, "xi": 0.03},
        "measured_source": "Colombero et al. 2015 Fig. 6 field circles, read by the verifier, about +/-10%"}, ensure_ascii=False),
)

O['vib_model_check_elephant'] = dict(
    status="estimate",
    label="Check: the elastic pulse model against elephant stomps (weak consistency check: force unknown)",
    display="A 10 kN footfall with a 0.05–0.1 s ramp on ground with c_s 280 m/s gives 44–89 µm/s at 3 m, 11–35 µm/s at 7.5–12 m and 4–9 µm/s at 40 m; reported about 24 (3–12 m) and 8.5 µm/s (40 m) peak. Agreement within a factor of about 2–4, for guessed inputs",
    notes="Ground from the measured 248–264 m/s surface-wave speed (c_s ≈ 280 m/s, our reading); ρ = 1,800 kg/m³ and ξ = 0.03 assumed. Force per foot and rise time are guesses (a quarter to a half of a 3–4 t animal's weight; 20 Hz content suggests 0.025–0.1 s). A 10–20 kN Hann pulse of 0.05 s instead gives 82–163 µm/s at 7.5 m and 23–47 µm/s at 40 m. The reported values are half the peak-to-peak figures from a secondary source (vib_elephant_stomp_ppv). The near/far ratio is reproduced (model 2–4, reported 2.9). Verifier: the reported band is 3–12 m and the earlier check used only its far end; at 3 m the model is 2–4× high. With force, rise time and the peak-to-peak conversion all guessed, this is a weak check of the distance trend, not validation. Compiler: status lowered from derived to estimate, as the verifier ruled for vib_rex_step_examples.",
)

O['vib_rayleigh_horizontal_and_resultant'] = dict(
    display="Resultant (vector) PPV ≈ 1.0–1.2 × the vertical PPV the model gives, for uniform ground; in the field the vertical is often not the largest component, so the ratio can be higher",
    sources=src['vib_rayleigh_horizontal_and_resultant']['sources'] + [TRL],
    notes="Rayleigh wave at ν = 1/4: horizontal/vertical amplitude 0.68, a quarter cycle apart, so the resultant peak is close to the vertical peak. Quasi-static near field: radial/vertical surface displacement = (1 − 2ν)/(2(1 − ν)) = 1/3 at ν = 1/4, resultant 1.05 × vertical. BS 5228-2 Table E.1 predicts the resultant ('νres resultant PPV'); some damage standards use the largest single component. Treat model PPV × 1.1 as resultant. Verifier: 0.681 and 1/3 (resultant 1.054) confirmed, but they hold for a uniform half-space. TRL 429 notes from field data that the vertical component 'is often not the largest component', so field resultant/vertical can exceed 1.2.",
)

O['vib_building_amplification'] = dict(
    status="reported",
    notes="Lauzon et al. section 4.1: 'Since the guidelines of RI 8507 accounts indirectly for soil-structure interaction, possible amplification due to resonance structural vibrations is included in the proposed criteria. These amplifications can raise the vibrations at the structure level by a factor ranging from 2 to 4 in low rise residential buildings.' No source is given for the 2–4. BS 5228-2 Table B.1 note A: 'The magnitudes of the values presented apply to a measurement position that is representative of the point of entry into the recipient.' The model gives free-field ground PPV; indoors a suspended floor may see more. Mainly for the thresholds topic. Verifier: quote confirmed, but it is an unsourced generalisation in a ground-improvement contractor's conference paper; status lowered from verified to reported. USBM RI 8507 (Siskind et al. 1980), the likely origin, was not fetched.",
)

O['vib_soil_shear_speed_by_type'] = dict(
    notes="Table 12.1 'Soil Groups', shear-wave velocity column: (A) 1 massive volcanic, unweathered metamorphic or stiff cemented sedimentary rock > 1000; 2 'Very dense sand and gravel' (N > 50, Dr 85–100%) > 700; 3 'Hard clay, silty clay' > 700. (B) 1 soft volcanic rock, weathered sedimentary rock 700–1000; 2 'Dense sand and gravel' (N 30–50, Dr 65–85%) 400–700; 3 'Very stiff clay, silty clay' 300–700. (C) 1 highly weathered rock 400–700; 2 'Medium dense sand and grovel' [sic] (N 10–30, Dr 35–65%) 200–400; 3 'Stiff clay, silty clay' (qu 100–200 kPa) 200–300. (D) 1 'Soft, deep alluvial layers with high water table' < 200; 2 'Loose sand' (N 0–10, Dr < 35%) < 200; 3 'Soft clay, silty clay' (qu < 100 kPa) < 200. Code values describe soil layers, not the loose top metre. Verifier: confirmed; the page gives no edition year, so none is added.",
)

O['vib_granite_shear_speed'] = dict(
    status="estimate",
    who_when="our estimate 2026 from existing key collide_rock_wave_speed_estimate (itself an estimate)",
    notes="Relies on the existing lab fact collide_rock_wave_speed_estimate (status estimate: granite P waves near the surface 3.7–6.1 km/s, Birch 1960; bar-wave speed 3.71 km/s, Padmanabha et al. 2021). For ν ≈ 0.25, c_s = c_p/√3: 2.1–3.5 km/s. USGS OFR 97-501 gives only NEHRP class A (hard rock) > 1,500 m/s, nothing on granite. Weathered or jointed granite at the surface can be much slower. Near the step the model gives about 1,000 times less shaking on granite than on loose sand for the same step, because near-field PPV ∝ 1/(ρ c_s²); nothing was checked against data on rock. Verifier: status lowered from derived to estimate (its input is an estimate); arithmetic confirmed.",
)

O['vib_steel_shear_speed'] = dict(
    notes=src['vib_steel_shear_speed']['notes'] + " Verifier: honestly labelled estimate; not used by the model.",
)

O['vib_small_strain_damping_ratio'] = dict(
    notes=src['vib_small_strain_damping_ratio']['notes'] + " Verifier: conversions recomputed.",
)

O['vib_ground_wave_params_by_surface'] = dict(
    notes="Densities are the lab's existing surface values (data.js), except road and slab, where the subgrade (about 2,000 kg/m³) carries the waves. Shear speeds are our near-surface picks: loose sand and soft clay 120 (code < 200; Pisa's soft layers 150–180), stiff clay 250 (code 200–300). Gravel 300 m/s: below the code range for dense sand and gravel (400–700 m/s at depth), our near-surface pick. At 10–50 Hz surface waves sample the top 2–10 m, so code values are upper guides. Asphalt and a 10 cm slab are far thinner than the 5–25 m wavelengths, so the subgrade sets the shaking. ν = 0.25 throughout; saturated soft clay is nearer 0.45–0.5 (PPV about a third lower). c_s ±40% alone moves PPV by ×0.5 to ×2.8 (near) and ×0.4 to ×3.6 (far). Verifier: gravel and c_s-uncertainty statements corrected; the old gravel wording is also in src/engine.js VIB.GROUND.",
)

O['vib_extrapolation_to_footsteps'] = dict(
    status="estimate",
    display="Footsteps (our assumed 10 J–10 kJ) sit 100 to 100,000 times below BS 5228's 1 MJ floor. At 82 kJ the law already under-predicts 1.4–5× within 30 m and 2.5–10× at 50–100 m; at 3.8 kJ about 5× at 60 m. Walking is a slow load, not a drop, so an energy law has no clear input",
    notes="Ranges: BS 5228-2 dynamic compaction 1–12 MJ and 5–100 m; GEC 1 chart lines at a scaled energy factor of about 0.07–6 √(t·m)/m (our reading); a 10 J–10 kJ footstep at 1–200 m gives about 0.0002–1. The 10 J–10 kJ footstep energy is our assumed range, not a verified input. Below the range: at 82 kJ (TRL 429, Allen 1996) measured PPV was 1.4–5× the Mayne (1985) value within 30 m and 2.5–10× at 50–100 m; at 3.8 kJ (Pisa) the law agrees at 2.5 m and is about 5× low at 60 m; no drop data found at 10 J–1 kJ. At low energy the measured fall-off (r^-1.1 to r^-1.35) is slower than the law's r^-1.7, so errors grow with distance. A walking step loads the ground over roughly 0.1–0.3 s with no free fall; its shaking depends on force and loading rate (vib_physics_pulse_ppv_model). Verifier: status lowered from derived to estimate; 82 kJ ratios corrected from 2–10×.",
)

O['vib_rex_step_examples'] = dict(
    status="estimate",
    display="Illustration with placeholder step forces. Normal walk (1.2 × weight, 0.1 s rise) on loose sand: about 3 mm/s at 1 m, 1 at 3 m, 0.3 at 10 m, 0.03 at 100 m; on stiff clay about 5× less; on granite about 1,000× less",
    notes="Computed with vib_physics_pulse_ppv_model, vib_physics_damping_factor and the estimated ground values (vib_ground_wave_params_by_surface); mass 3,007 kg (canon). Step forces are placeholders: 1.2 × body weight is the lab's W8.WALK_LOAD (existing key walking_running_peak_vertical_force); the rise times (0.1, 0.2 s), 'heavy step' (3 ×, 0.05 s) and 'stamp' (10 ×, 0.03 s) are illustrations pending the step-force topic. Ollie gives the same numbers. Limits: nothing is checked beyond 60 m, and the stamp values at 100–200 m are probably too low (vib_physics_damping_factor). Within about 1.4 m of a normal step on loose sand the quasi-static strain already passes 10⁻⁴ (1.8 × 10⁻⁴ at 1 m), and stamps within 1–3 m on soft soil are far past it; the error's direction there is unknown (vib_linear_strain_limit). Verifier: every number reproduced; status lowered from derived to estimate (placeholder inputs).",
)

O['vib_linear_strain_limit'] = dict(
    unit_si="1 (shear strain)",
    display="Flag results where max(PPV/c_s, (1 − ν)F/(2π ρ c_s² r²)) is above about 10⁻⁴. The limit is an unsourced working value (for sands the linear threshold may be nearer 10⁻⁵), and near the foot the model error could go either way",
    notes="Wave strain is about particle velocity / wave speed. Near the foot the strain is quasi-static, (1 − ν)F/(2π μ r²) with μ = ρ c_s², larger than PPV/c_s by about 2 c_s τ/(π r) for a ramp. For a normal step (1.2 × 3,007 kg × g = 35.4 kN) on loose sand it is 1.8 × 10⁻⁴ at 1 m (7.6 × PPV/c_s) and 4.6 × 10⁻⁵ at 2 m, so ordinary walking passes 10⁻⁴ within about 1.4 m. Soil stiffness falls and damping rises from somewhere around 10⁻⁵–10⁻⁴ strain, and soils yield near 10⁻³ (typical soil-dynamics ranges; no source fetched). Where the flag trips, the direction of the model error is unknown: yielding absorbs energy, but softening raises quasi-static motion (u ∝ 1/μ). Pisa: 9 mm/s at 2.5 m on 150 m/s ground is 6 × 10⁻⁵ wave strain. Verifier: the flag now includes the quasi-static strain; the earlier claim that the model over-estimates close in is withdrawn.",
)

# ---------------------------------------------------------------------------
FIELDS = ['key', 'category', 'label', 'status', 'value_si', 'unit_si', 'low_si', 'high_si',
          'display', 'sources', 'notes', 'who_when']
facts = []
for k in order:
    f = copy.deepcopy(src[k])
    f.update(O.get(k, {}))
    f['category'] = 'presence_attenuation'
    out = {}
    for fld in FIELDS:
        out[fld] = f.get(fld, None)
    if f.get('values_json') is not None:
        out['values_json'] = f['values_json']
    facts.append(out)

GAPS = """Not found or not verified (the researcher's gaps and the verifier's missing list). None of these was fetched and confirmed, so none is a fact here.
- Walking regime unchecked: no measured ground PPV against distance for footsteps (people, animals, horses) or for slow quasi-static loads (for example Auersch's train data). The ramp and near-field branch, the Walk tab's main case, has no measured check. A search snippet that footsteps 'did not exceed 3 × 10⁻⁶ m/s at 3 m' could not be traced to its source and is not used.
- Long range: no low-energy (about 1–100 kJ) impact data beyond 60 m, which is needed to choose between the model's steep damped fall-off (r^-2 to r^-3 for stamps on soft ground) and the measured r^-1.0 to r^-1.6. Model results beyond 60 m are untested and probably too low for stamps (verifier: by roughly 3–10× at 200 m if the measured exponents hold).
- Low-energy drops: one site in range (Pisa, 3.8 kJ), plus 82 kJ (TRL Fig. 44) and the 1–12 MJ compaction data. Nothing measured at 10 J–1 kJ on soil.
- The 10 J–10 kJ 'footstep energy' range used in the extrapolation argument has no stated physical basis.
- Small-strain thresholds and damping: no source for the 10⁻⁴ strain flag or for damping ratios by soil type (candidates: Vucetic 1994; Darendeli 2001; Seed & Idriss).
- Building amplification: Lauzon's 2–4 is unsourced; USBM RI 8507 (Siskind et al. 1980), a public report and the likely origin, was not fetched.
- Near-surface shear-wave speeds for the specific surfaces (SASW or MASW profiles of loose sand, road subgrade, soft clay crusts) and the effect of layering or a water table at 1–2 m on surface waves: not researched. The surface values are picks inside 30 m class ranges.
- Primary sources not fetched: Pekeris 1955 and Kausel 2012 (closed form rebuilt and checked numerically), Miller & Pursey 1955 (numbers via Sánchez-Sesma et al. 2011), Mayne et al. 1984 and Mayne 1985 (data ranges unknown), Woods & Jedele 1985, Amick 1999/2000, Gutowski & Dym 1976, Kim & Lee 2000. There is no verified table of soil damping α at a stated frequency.
- Elephant stomps: amplitudes are secondary (arXiv 2024); the elephants' masses and stomp forces were not seen. The elephant topic should fetch O'Connell-Rodwell et al. 2000 in full.
- Lake ice (flexural-gravity waves) and steel deck (plate resonance): not researched; the page should say ground shaking is not modelled on them. The steel shear speed (3.2 km/s) is an unsourced estimate.
- Step-force inputs (footstep rise times, heel-strike transients, stamp contact times) belong to the step-force topic; the examples here use placeholders. The two-foot cancellation in walking (up to 2× lower far away) is unquantified."""

os.makedirs(OUT_DIR, exist_ok=True)
json.dump({"facts": facts, "gaps": GAPS}, open(OUT, 'w'), ensure_ascii=False, indent=1)

# ---- checks
from collections import Counter
rank = {'verified': 3, 'derived': 2, 'reported': 1, 'estimate': 0, 'disputed': 0}
bad = []
for f in facts:
    k = f['key']
    old = src[k]['status']
    if f['status'] != old:
        print('status', k, old, '->', f['status'])
    if f['status'] == 'verified' and old != 'verified':
        bad.append(('upgrade', k))
    if old in ('estimate', 'reported') and f['status'] in ('verified', 'derived'):
        bad.append(('upgrade', k))
    for fld in ('value_si', 'low_si', 'high_si'):
        v = f[fld]
        if v is not None and not isinstance(v, (int, float)):
            bad.append((fld, k))
    if len(f['notes']) > 950:
        bad.append(('notes_len', k, len(f['notes'])))
    if f.get('values_json'):
        json.loads(f['values_json'])
    for s in f['sources']:
        assert s['url'].startswith('http'), k
    if f['low_si'] is not None and f['high_si'] is not None and f['value_si'] is not None:
        if not (f['low_si'] <= f['value_si'] <= f['high_si']):
            bad.append(('range', k, f['low_si'], f['value_si'], f['high_si']))
print('n', len(facts), Counter(f['status'] for f in facts))
print('max notes', max(len(f['notes']) for f in facts))
for f in facts:
    if len(f['notes']) > 880:
        print('  long', len(f['notes']), f['key'])
print('BAD', bad)
