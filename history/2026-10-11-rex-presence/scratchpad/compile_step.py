import json, os, copy, sys

SP = '/tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad'
src = json.load(open(f'{SP}/wfout/research_step.json'))
facts = {f['key']: f for f in src['facts']}
order = [f['key'] for f in src['facts']]

GH = 'https://github.com/RoscoeRackham/rex-strength-lab/blob/main/'
PANA = 'https://www.ebi.ac.uk/europepmc/webservices/rest/PMC5098964/fullTextXML'
HUTCH = 'https://journals.biologists.com/jeb/article/209/19/3812/16362/The-locomotor-kinematics-of-Asian-and-African'

O = {}  # overrides per key

O['step_keller1996_walking_grf'] = dict(
    notes="Abstract: 'GRF-time histories were recorded for 13 male and 10 female recreational athletes during walking and slow jogging at speeds between 1.5 and 3.0 m s(-1), and running at speeds between 3.5 and 6.0 m s(-1).' 'F(z) increased linearly during walking and running from 1.2 BW to approximately 2.5 BW at 6.0 m s(-1) ... F(z) was linearly correlated to G(z), the latter ranging from 8 to 30 BW s(-1)'. 1.2 BW is the value at 1.5 m/s, the slowest walk tested. Slow jogging gave '>50% higher F(z) and G(z)' than walking. Agrees with walking_running_peak_vertical_force (Nilsson & Thorstensson 1989: 1.0 to 1.5 BW walking); supports W8.WALK_LOAD = 1.2. Verifier: quotes match; G(z) is undefined in the abstract but, being far below instantaneous rates (42-113 BW/s), is almost certainly an average rate. Our inference only: at 8 BW/s, 1.2 BW is reached in about 0.15 s.",
)

O['step_bohannon2011_normal_walking_speed'] = dict(
    label="Normal (comfortable) human walking speed, meta-analysis: range of group means by age and sex",
    value_si=None, low_si=0.943, high_si=1.434,
    display="Group means from 0.94 m/s (women aged 80–99) to 1.43 m/s (men aged 40–49); 23,111 people. The top figure is the fastest group, not a typical speed",
    notes="Abstract: 'Forty-one articles contributed data to the analysis. Combined, they provided data from 23111 subjects. The gait speed was homogeneous within strata and ranged from a mean of 143.4 cm/second for men aged 40 to 49 years to a mean of 94.3 cm/second for women aged 80 to 99 years.' Walks were 3 to 30 m long at a normal pace. The per-decade table is paywalled and was not read. Verifier: value_si was 1.43, the highest stratum mean, which overstates a 'normal' speed; set to null so the page shows the range. For young adults see step_fukuchi2018_preferred_froude (1.24 m/s, overground).",
)

O['step_tudorlocke2019_cadence_vs_speed'] = dict(
    notes="Table 'Sample sizes, cadences, VO2, and METs for treadmill bouts': '3.0 | 74 | 113.6 ± 6.1 | 101–127'; 2.0 mph 96.1 ± 6.5 (n 76); 4.0 mph 129.0 ± 7.6 (n 62). 76 healthy adults (38 men, 38 women), 5-minute treadmill bouts, cadence counted by hand. Leg length was standing minus seated height ('Leg length was then calculated by subtracting the seated height from standing height'), about 0.47 of stature; not hip-joint height. Treadmill, not overground. Verifier: bouts ended when people chose to run, or at more than 75% of predicted maximum heart rate, or at an RPE above 13, so the falling n at higher speeds is not purely walk-to-run selection.",
)

O['step_fukuchi2018_preferred_froude'] = dict(
    notes="Computed from the dataset's metadata file (script fukuchi_fr.py), 'Young' group, overground comfortable-speed trials (n = 24): speed 1.24 ± 0.14 m/s; leg 0.877 m; stature 1.711 m. Fr = v²/(9.81 L) per person: mean 0.182, sd 0.040, min 0.100, max 0.290; leg/stature 0.513 ± 0.015. Paper: 'Leg length was measured by assessing the distance from the anterior superior iliac spine (ASIS) to the ipsilateral medial malleolus while the participant lay in a supine position.' That is not hip-joint height. The paper's own dimensionless speed is v/√(g l0); we used Alexander's v²/(gL). Barefoot, lab. Verifier: recomputed, all match. Caveat: speed was timed over a 10 m walkway starting and ending at rest, and the paper warns speeds 'might have been slightly underestimated', so 0.18 is at the low end (CADENCE's 1.34 m/s gives 0.21; Bohannon's ~1.4 m/s about 0.22).",
)

O['step_alexander2004_dynamic_similarity'] = dict(
    label="Dynamic similarity: Froude number on hip height; human walking duty factor 0.55–0.7",
    value_si=None,
    display="Duty factor about 0.7 in very slow walking, falling to 0.55 in fast walking; use hip height as the length; step 0.8–1.2 hip heights. (Our working value 0.6 is an estimate, not from the paper)",
    notes="Quotes: 'dynamic similarity is possible only between systems moving at equal Froude numbers, (speed)2/(length × gravitational acceleration).' 'similar animals of different sizes, travelling over land at equal Froude numbers, would tend to move in dynamically similar fashion. Strict dynamic similarity would not be possible, because animals of different sizes are generally not geometrically similar'. 'For our characteristic length, we used the height of the hip joint from the ground in normal standing'. 'Humans use duty factors of about 0.7 in very slow walking, falling to about 0.55 in fast walking'. Step lengths 'in the range 0.8–1.2(hip height)' (distance travelled while one foot is down). Verifier: value_si 0.6 was our chosen midpoint inside a verified fact; set to null, only 0.55–0.7 is verified. The paper gives no walk-to-run Froude number (see Kram 1997).",
)

O['step_kram1997_walk_run_froude'] = dict(
    notes="Abstract: 'The ratio of the centripetal and gravitational forces (mv2/L)/(mg) reduces to the dimensionless Froude number (v2/gL). Applying this model to a walking human, m is body mass, v is forward velocity, L is leg length and g is gravity. In normal gravity, humans and other bipeds with different leg lengths all choose to switch from a walk to a run at different absolute speeds but at approximately the same Froude number (0.5).' The inverted-pendulum walk becomes impossible at Fr = 1; people switch earlier, at 0.5. Verifier: quote matches; L is 'leg length', not explicitly hip height, which is close enough for this use.",
)

O['step_baines2018_heel_strike'] = dict(
    notes="Table 1: 12 healthy adults (4 men, 8 women), 76.7 ± 15 kg, barefoot, preferred speed, force plate synchronised with Optotrak. 'on average ŻH(t0) = −0.57 m/s and ŻH(tp) = −0.52 m/s'. 'The mechanical energy loss of heel strike is around 3.8 J for preferred walking speeds (≈ 1.3 m/s)'. 'foot mass Me = 11 ± 3% of bodyweight'. Impact-peak size in body weights is only in a figure; heights and leg lengths not reported. Conflicts with Winter 1992. Verifier: Table 1 matches exactly. (a) The 'heel point' is a virtual point fixed to two tibia markers, located from the centre of pressure; no marker on the foot. (b) W is work done by the ground force on the foot and ankle, i.e. energy dissipated or stored in the heel pad, foot and ankle. On a rigid plate essentially none of it enters the ground: it is not energy delivered to the ground.",
)

O['step_chi_schmitt2005_effective_mass'] = dict(
    notes="Abstract: 'The magnitude of Meff as a percentage of body mass (M(B)) varies with knee angle at impact and significantly differs among gaits: 6.3%M(B) in walking, 5.3%M(B) in running, and 3.7%M(B) in crouched walking.' and 'At the instant prior to heel strike, Etot ranges from 0.24 to 3.99 J.' Baines et al. 2018 show that this method's assumption (heel speed zero at the impact peak) is not met; with synchronised data they get 11% (to the end of heel strike). Treat 6.3% as a low estimate. Verifier: corrected 'published estimates span 4–18%' to 'Baines et al. 2018 get 4–18% depending on method' (4.1% with this method to 17.6% to the impact peak).",
)

O['step_winter1992_heel_contact_velocity'] = dict(
    notes="Abstract: 'Heel-contact velocity was negligible vertically and small (0.87 m/s) horizontally.' 11 subjects, 10 walking trials each. Disputed: Baines et al. 2018 measured 0.57 m/s downward at contact with synchronised high-rate force and motion data. Use Baines for the impact calculation. Why they differ is not established. Verifier: a likely cause is the definitions: Winter tracked a heel marker, while Baines used a tibia-fixed virtual point under the centre of pressure. Our earlier idea that Winter's marker data were smoothed through contact is speculation (full text paywalled, not read).",
)

O['step_yoon2025_quiet_walking'] = dict(
    display="Walking quietly cuts the impact loading rate by 45% (heel-first, while walking 29% slower) to 69% (toe- or flat-footed, 23% slower); 49% when asked to keep normal speed",
    notes="Abstract: 'participants who struck the ground with the rearfoot reduced the impact loading rate by 44.6% with 29.3% slower walking speed than normal walking. Those who struck with the fore- or mid-foot reduced the impact loading by 69.2% with a 23.4% decrease in speed. Quiet walking with the non-rearfoot strike pattern reduced the impact loading by 48.7%, even when asked to walk as fast as normal walking.' 26 young participants. No peak-force change is given; the weight must still be carried. Verifier: quotes match. Part of the 45% and 69% cuts comes from walking slower, so 48.7% at normal speed is the cleaner technique figure. Only loading rate was measured: applying this factor to impact energy (as the recommendation and engine SOFT = 0.4 do) is an estimate, not supported by this study.",
)

O['step_carden2015_drill_peak_force'] = dict(
    label="Peak force of army drill stamps (deliberate straight-leg heel stamp), group means",
    display="Drill stamps, group means: 3.1–6.6 × body weight (trained men 5.9–6.6, untrained men 3.7–4.6, trained women 3.1–4.1); marching 1.1–1.3. Individuals vary (SD up to 1.7 ×). Rigid floor, army boots",
    notes="Table 3. 24 trained soldiers (12 men, 81.5 kg, 180 cm; 12 women, 66.6 kg) and 12 untrained men (70.6 kg), all in Combat Assault Boots, on Kistler plates at 1,000 Hz; peak = 'highest instantaneous vertical ground reaction force'. Technique: 'an exaggerated stamping of one foot into the ground from 90° hip flexion'; 'stamp the heel in to the ground as hard as possible in an attempt to make a ‘loud noise’'; 'all participants impacted the ground with a straight leg'. Contact duration and foot speed not reported. Verifier: tables match. 3.1–6.6 BW is the range of group means, not of individuals: trained men's SD is 1.5–1.7 BW (upper 95% confidence limit about 7.7), so some individuals likely exceeded 8 BW (inferred; individual maxima not reported). Measured on rigid force plates; on soil the peak and loading rate would be lower.",
)

O['step_rawcliffe2020_drill_time_to_peak'] = dict(
    label="Time from contact to peak force in drill stamps (the abstract's unit corrected by inference)",
    notes="Abstract: 'the mean of 8 trials from 15 recreationally active men were collected from 4 foot drills' and 'Foot drill produced peak vGRF and peak vertical rate of force development in excess of 5 bw, and 350 bw·s, respectively. Time to peak vGRF ranged from 0.016 to 0.036 ms across foot drills'. The printed 'ms' must be seconds: 0.016 ms would need about 300,000 BW/s, while 5 BW in 0.016–0.036 s averages 140–310 BW/s, which fits. Likewise '350 bw·s' must be bw/s. Three footwear types; the abstract gives no numbers for the difference. value_si is the midpoint of the range (our choice). Verifier: quotes match; status verified with both units corrected by inference. Subjects were recreationally active men, not soldiers.",
)

O['step_rex_ollie_hip_height_estimate'] = dict(
    sources=[
        {"title": "Owner's turnaround art, front views, measured here: build-comparison/assets/rex-turnaround.png", "url": GH + "build-comparison/assets/rex-turnaround.png"},
        {"title": "Owner's turnaround art, front views, measured here: build-comparison/assets/ollie-turnaround.png", "url": GH + "build-comparison/assets/ollie-turnaround.png"},
        {"title": "ANSUR II men (crotch-to-hip gap, step_ansur_leg_proportions), as stored in this repo", "url": GH + "build-calculator/data/ansur2/ANSUR_II_MALE_Public.csv"},
    ],
    notes="Our own measurement, not published. Rex front view: crest tip y≈13 px, soles y≈750, crotch (lowest point of the briefs between the thighs) y≈445, so the crotch is at 0.414 H. Ollie: horn tips y≈18, soles y≈775, crotch y≈462, so 0.413 H. Adding the human crotch-to-hip gap (0.031 H, ANSUR II) gives 0.445 H for both; 0.45 H × 3.048 m = 1.37 m. The range 0.42–0.48 H covers reading error (±5 px ≈ ±0.007 H) and the hidden hip-joint position inside such massive thighs. The engine already uses Lleg = 0.45 H. Canon heights: Rex 3.048 m to his crest tip; Ollie 3.06 m to his horn tips (corrected from '3.048 m for both'; the 0.4% difference is far inside the range). Verifier: re-measured independently, Rex 0.414 H, Ollie 0.416 H (soles ~778 px). Whether they walk heel-first like people is not canon.",
)

O['step_rex_ollie_preferred_walk_speed'] = dict(
    status="estimate",
    display="About 1.6–1.7 m/s (about 6 km/h) as a default; 1.2 m/s at Froude 0.1 (slow); 2.0 m/s brisk",
    notes="Computed: v = √(Fr g h), h = 1.37 m (1.28–1.46). Fr 0.18 gives 1.56 m/s (1.50–1.61 across h); Fr 0.10 gives 1.16; Fr 0.29 gives 1.98. Matching CADENCE's 1.34 m/s human (Fr 0.209 on hip height 0.875 m) gives 1.68 m/s. Status estimate (was derived): the hip height is our estimate and human-like gait is assumed, ignoring their bulk, wide stance, boots and personal choice. Verifier: recomputed; it inherits Fukuchi's start-from-rest underestimate, so 1.6–1.7 m/s is a fair default. Keeper-guided elephants walked at Fr 0.05–0.08 (step_elephant_walk_froude_measured); 'elephants self-select Fr about 0.1' is only reported (step_elephant_preferred_froude).",
)

O['step_rex_ollie_walk_run_speed'] = dict(
    status="estimate",
    notes="Computed: v = √(0.5 × 9.81 × h): 2.59 m/s at h = 1.37 m (2.51–2.68 for h = 1.28–1.46). Kram used leg length; the engine should use the same hip height throughout. Status estimate (was derived) because the hip height is our estimate and human-like gait is assumed. Above this, the walking step model (about 1.2 BW) no longer applies; running loads are 2–3 BW (walking_running_peak_vertical_force). Verifier: recomputed, 2.59 m/s (2.51–2.68).",
)

vj = json.loads(facts['step_rex_ollie_step_frequency']['values_json'])
vj['fit_valid_Fr'] = [0.093, 0.372]
vj['Rex_Ollie_h_1.37m']['extrapolated_beyond_fit'] = [True, False, False, False, True]
O['step_rex_ollie_step_frequency'] = dict(
    status="estimate",
    values_json=json.dumps(vj, ensure_ascii=False),
    notes="Computed. Dimensionless step rate f̂ = f √(h/g). CADENCE cohort stature 1.707 m, so hip ≈ 0.875 m (ANSUR ratio). At 3.0 mph f̂ = 1.893 × √(0.875/9.81) = 0.566 at Fr 0.209. A power fit over 2.0–4.0 mph gives f̂ = 0.789 Fr^0.211. For h = 1.37 m: Fr 0.209 (1.68 m/s) gives 1.51 Hz (91/min), step 1.11 m; Fr 0.18 (1.56 m/s) gives 1.47 Hz (88/min), step 1.06 m. Equal-Froude scaling makes every time 1.25× the human's (√(1.37/0.875)). Status estimate (was derived): hip height is our estimate and human-like gait is assumed; treadmill data. Verifier: refit reproduces (67, 78, 88, 95, 109 per min), but the fit spans only Fr 0.093–0.372, so the Fr 0.05 and 0.5 rows are extrapolations and must be flagged.",
)

O['step_rex_ollie_stance_time'] = dict(
    status="estimate",
    notes="Computed: stance = duty factor × 2 / f. At f = 1.47–1.51 Hz the stride is 1.32–1.36 s; duty 0.55–0.7 gives 0.73–0.93 s; 0.6 gives 0.79–0.82 s (the human 0.63 s × 1.25). Status estimate (was derived): hip height is our estimate, human-like gait is assumed, and 0.6 is our chosen duty factor. Verifier: recomputed; stance length 1.56 × 0.82 = 1.28 m = 0.93 hip heights, inside Alexander's 0.8–1.2. Note: the recommendation's linear duty-factor rule (0.7 at Fr 0.05 to 0.55 at Fr 0.4) gives 0.64 and 0.88 s at Fr 0.18, not 0.6 and 0.82 s; pick one. Compare an elephant: 1.5 s for an African elephant's hind foot at 1.2 m/s (step_hutchinson2006_elephant_timing).",
)

O['step_rex_ollie_walking_foot_load'] = dict(
    notes="1.2 × 3,007 kg × 9.81 = 35.4 kN; range 1.0–1.5 BW (29.5–44.2 kN). Pressure = force / sole area (rex_ollie_picture_build, an estimate from the picture: Rex 0.31 m², Ollie 0.15 m²): Rex 95 / 114 / 143 kPa; Ollie 197 / 236 / 295 kPa at 1.0 / 1.2 / 1.5 BW. These are sole averages; real soles load unevenly (an elephant's local peaks are about twice its average). A walking biped carries its whole weight on one foot at a time. Floor: averaged over its stance, each foot carries 1/(2 × duty factor) of body weight, 0.71–0.91 BW for duty 0.55–0.7 (0.83 at 0.6); the peak must exceed that, so even soft-footed walking cannot drop the peak much below about 0.9–1.0 BW (estimate). Verifier: recomputed; corrected the floor range (the recommendation's '0.85–1.0' was wrong).",
)

O['step_rex_ollie_heel_strike_estimate'] = dict(
    label="Heel strike of one of Rex's or Ollie's normal steps: energy absorbed by the foot (a proxy for impact severity, scaled from people)",
    value_si=160, low_si=30, high_si=410,
    display="About 80–230 J at each heel strike, over about 20–40 ms (rough; 30–410 J across methods and subjects). Energy absorbed in the foot, not energy sent into the ground",
    values_json=json.dumps({
        "absorbed_by_foot_total_J": [228, 84, 413],
        "absorbed_by_foot_vertical_J": 162,
        "arrested_mass_kinetic_energy_J_half_me_v2": [83, 31, 131],
        "_format": "[central, low, high]",
        "heel_speed_m_s": [0.70, 0.48, 0.96],
        "effective_mass_fraction": [0.11, 0.04, 0.18],
        "for_vibration_laws_use": "arrested_mass_kinetic_energy_J_half_me_v2, labelled estimate and extrapolated",
    }),
    notes="Scaled at equal Froude number, energy goes as M g h. Baines: 3.8 J total, 2.7 J vertical for 76.7 kg; we assumed a 0.90 m hip (not reported), so E/(M g h) = 5.6e-3 total, 4.0e-3 vertical. Rex/Ollie (3,007 kg, h 1.37 m): 228 J total (84–413), 162 J vertical. Second method, ½ m_e v²: heel 0.57 × √(1.37/0.90) = 0.70 m/s (0.48–0.96), m_e 4–18% of M: 31–131 J (83 J at 11%). Timing (peak ~22 ms, end ~37 ms) is uncertain: heel-pad stiffness does not scale. Assumes heel-first walking; boots unquantified. Verifier: arithmetic reproduces; display fixed (was '100–250 J' against an 80–410 J range). W is energy absorbed in the walker's own heel pad, foot and ankle, not energy into the ground; the two proxies differ about threefold. If a vibration law needs an impact energy, use ½ m_e v² (about 80 J, 30–130 J) and say so.",
)

O['step_stamp_contact_speed_estimate'] = dict(
    notes="No measured drill-stamp foot speed was found. Thigh horizontal and shin vertical raise the foot about one thigh length (0.233 H): 0.42 m for a 1.80 m man, so 2.9 m/s falling freely; a driven stamp is faster, 3–5 m/s (our guess). For a 3.048 m body: 0.71 m, so 3.7 m/s by gravity, 3.9–6.5 m/s if driven speeds scale by √1.70. Impulse check (assumes a half-sine pulse): peak 6.5 BW over 2 × (16–36 ms) delivers 0.13–0.30 BW·s, i.e. M × (1.0–2.2 m/s) less the body-weight share. A leg alone (16% of mass, segment_mass_fraction_whole_leg) at 3–5 m/s supplies only M × 0.5–0.8 m/s, so a stamp also arrests part of the body's fall: effective mass perhaps a third to a half of M. ½ m_e v²: 1.3 kJ (engine legEff 183 kg at 3.7 m/s); 3.3 kJ (whole leg); 10 kJ (half the body); up to 32 kJ (half the body at 6.5 m/s). Verifier: recomputed; the pulse shape is itself an assumption.",
)

O['step_rex_ollie_stamp_load'] = dict(
    label="Force of a deliberate drill-style stamp by Rex or Ollie (soldiers' measured multiples, scaled)",
    display="At trained soldiers' average drill stamp (6.5 × body weight): about 190 kN; untrained men's average (4.4 ×): 130 kN. Rex's paw 420–620 kPa, Ollie's boot 870–1,280 kPa. Individuals likely reach 8 × or more (about 240 kN). Rigid-floor values; soft ground lowers them",
    notes="Multiples × 29.5 kN: 3.4 BW (drop landing, reported) 100 kN; 4.4 BW (untrained men's mean) 130 kN; 6.5 BW (trained men's mean at the halt) 192 kN; 6.6 BW (highest group mean) 195 kN; 8 BW 236 kN. Pressure on Rex's 0.31 m² paw: 324 / 419 / 619 kPa (761 at 8 BW); on Ollie's 0.15 m² boot: 669 / 865 / 1,278 kPa (1,573 at 8 BW). Loading rates of 300–1,000 BW/s give 9–29 MN/s. Time to peak 16–36 ms in people, about 20–45 ms if scaled by 1.25 (uncertain). Assumes they stamp like soldiers at human effort, and that contact stiffness scales with body size (a heel pad or boot does not). Above that, the Stomp model takes over. low_si and high_si span the 3.4–6.6 BW means. Verifier: numbers reproduce; 6.5 BW is a group mean (SD 1.5), not 'the human-effort ceiling'; forces are rigid-plate values that soft ground would reduce.",
)

O['step_elephant_body_mass_larramendi2016'] = dict(
    notes="Quotes (pp. 550–551): 'the average shoulder height in good conditions for this species is 260 cm for females and 320 cm for males'. 'the body mass of an average-sized African male bush elephant at 320 cm in good condition is expected to be around 6000 kg'. 'at 260 cm shoulder height a body mass of 3000 kg (non-pregnant) is expected in good conditions'. 'An average-sized male E. maximus (275 cm), in optimal conditions, is about 4000 kg and an average fully grown female elephant (non-pregnant) is around 2700 kg'. 'an average African forest elephant male of 220 cm at the shoulders should be around 2000 kg'. Older captive weights came from 'clearly obese animals', some '60–85% heavier'. Verifier: quotes match; these are 'good condition' averages, and 220 cm is what a forest bull could reach. Dropped an unsupported claim about Hutchinson 2006's heaviest animal.",
)

O['step_ren2010_elephant_limb_forces'] = dict(
    display="Walking Asian elephants (juveniles, about 2.3 t): about 0.55 × body weight on a forefoot, 0.36 × on a hind foot (read from a figure); never above 1 × (fore) or 0.7 × (hind) at the speeds measured (up to 4.8 m/s); 60% of weight on the forelimbs",
    notes="Quotes: 'peak vertical GRFs were ~50% higher for the forelimbs than for the hindlimbs (corresponding to a weight distribution of ~60% on the forelimbs)'. 'Maximal vertical GRFs were <1 body weight (BW) for each forelimb and <0.7 BW for each hindlimb.' 'Six juvenile Asian elephants (mean age, 8.5 ± 3.0 years; mean mass, 2,291 ± 669 kg; mean hip height, 1.52 ± 0.19 m'. Figure 1A: 'normal walking ... at dimensionless speeds ... of 0.30–0.35 ... and velocities of ~1.2'. Read from the figure: forelimb peak about 0.55 BW, hindlimb about 0.36 BW (±0.03; small image). 'compliant limbs dampen impact accelerations and keep peak GRFs low'. Verifier: re-read the figure (0.56 and 0.36). The '<1 BW' holds only over the speeds tested (0.64–4.83 m/s); Ren projects about 1.1 BW per forelimb near 7 m/s. Walking trials are at û 0.30–0.35 (Fr about 0.09–0.12). Juveniles, not 3-tonne adults.",
)

O['step_hutchinson2006_elephant_timing'] = dict(
    display="Elephant foot down 1.5 s at 1.2 m/s; duty factor 0.66 at 1.6 m/s (an Asian elephant, Froude 0.18, Christian et al. 1999 as cited); 0.44–0.85 across speeds",
    notes="Fig. 2 caption: 'Right hind foot of an African elephant shown in lateral view during slow walking (1.2 m s-1; tst=1.5 s).' Results, citing Christian et al. 1999, for 'an Asian elephant moving at 1.6 m s-1' '(Fr=0.18; β=0.66)'. Abstract: 'over 2400 strides from 14 African and 48 Asian elephant individuals (body mass 116-4632 kg)'; an aerial phase 'occurs at a Froude number of around 1'. Tables 2 and 3 read from the journal page via WebFetch (the PDF was behind a Cloudflare challenge); quotes re-confirmed. The stance regression pools all sizes in seconds, so it is size-blind; use with caution. Verifier: all confirmed; log base of the duty-factor regression not stated. Speeds were elicited by trainers, so they are not self-selected.",
)

# split of step_elephant_preferred_froude
NEW_ELEPHANT_MEASURED = {
    "key": "step_elephant_walk_froude_measured",
    "category": "presence_step",
    "label": "Speed of keeper-guided walking African elephants, as a Froude number",
    "status": "verified",
    "value_si": 0.07,
    "unit_si": "Froude number (as computed by the authors)",
    "low_si": 0.05,
    "high_si": 0.08,
    "display": "Five keeper-guided African elephants walked 1.1–1.3 m/s, Froude number 0.05–0.08 (0.07 on average)",
    "sources": [
        {"title": "Panagiotopoulou et al. (2016), Foot pressure distributions during walking in African elephants, R Soc Open Sci 3:160203 (PMC5098964), Table 1, full text via Europe PMC", "url": PANA},
    ],
    "notes": "Quote: 'The mean walking speed of all African elephants was 1.2 ms−1 (table 1). This corresponded to a Froude number ... of 0.07 for all subjects'. Table 1: speeds 1.24, 1.11, 1.24, 1.24, 1.34 m/s; mean Froude 0.07, 0.05, 0.07, 0.08, 0.08. Keepers guided the elephants, so these speeds were not self-selected. The length used for the Froude number is not given in Table 1; 1.2 m/s at 0.07 implies about 2.1 m (their shoulder heights are 2.12–2.50 m). At the same Froude number, Rex's and Ollie's 1.37 m hips give about 0.97 m/s at 0.07. Verifier: split from step_elephant_preferred_froude; this measured part is verified (Table 1 matches exactly).",
    "who_when": "Panagiotopoulou, Pataky, Day, Hensman, Hensman, Hutchinson & Clemente 2016",
}

O['step_elephant_preferred_froude'] = dict(
    label="Claim that elephants choose to walk at a Froude number of about 0.1 (secondary citation)",
    status="reported",
    value_si=0.1, low_si=None, high_si=None,
    unit_si="Froude number (v²/(g·hip height))",
    display="Elephants 'often self-selected' Froude about 0.1: a citation in Panagiotopoulou et al. 2016, not found in the paper it cites (Hutchinson et al. 2006)",
    sources=[
        {"title": "Panagiotopoulou et al. (2016), R Soc Open Sci 3:160203 (PMC5098964), Discussion, citing Hutchinson et al. 2006 as ref. 21", "url": PANA},
        {"title": "Hutchinson et al. (2006), J Exp Biol 209:3812, journal page (checked by the verifier; the statement was not found)", "url": HUTCH},
    ],
    notes="Panagiotopoulou et al. 2016: 'Hutchinson et al. [21] found that elephants often self-selected similar speeds (Fr ∼ 0.1), which may seem slow but larger animals tend to choose relatively slower speeds'. Status reported (was verified). Verifier: two WebFetch passes over the full Hutchinson 2006 page found no statement that elephants self-select any Froude number; that study used trainer-elicited speeds. Its only nearby figure is a citation of Langman et al. 1995: minimum cost of transport at 1.0 m/s in three mid-sized African elephants (primary not read). The measured keeper-guided Fr 0.05–0.08 is in step_elephant_walk_froude_measured. At Fr 0.1, Rex's and Ollie's 1.37 m hips give 1.16 m/s.",
    who_when="Panagiotopoulou et al. 2016, citing Hutchinson et al. 2006 (not confirmed there)",
)

O['step_panagiotopoulou2016_elephant_feet'] = dict(
    notes="'all body masses were thus based on approximations by the park keepers'. Zebris plates at 100 Hz, about 0.55 sensors/cm², under 0.5 mm rubber matting. 'the forefeet showed significantly higher mean peak foot pressures ... (fore 264 ± 5.31, hind 246 ± 5.09'. The text also says 'The mean peak pressures during the whole stance phase among all ROIs, feet and subjects in the African elephants were 946 kPa' (Asian 567 kPa). That does not match the per-foot table (224–318 kPa) and could not be reconciled; use the table. Verifier: Table 1 matches exactly; the inconsistency is real. Table values are means of each foot's per-step maximum pressure; the coarse sensors and matting may smooth local peaks. These are local peaks; the sole's average pressure is lower.",
)

O['step_elephant_forefoot_area'] = dict(
    notes="Treating a circumference C as a circle gives area C²/(4π): 1.06 m gives 0.089 m²; 1.21 gives 0.117; 1.27 gives 0.128 m² (the ~3,000 kg bull). Schanz's 2,530 kg cow left 0.32 × 0.30 m prints: as an ellipse, 0.075 m². Larramendi 2016 notes the conventional rule of 'multiplying the forefoot circumference by two' to get shoulder height. Verifier: recomputed; Schanz's own finite-element model used a 0.32 m circle (0.080 m²).",
)

O['step_elephant_vs_rex_footfall'] = dict(
    display="Each walking step puts about 2.2 × the force of a 3-tonne elephant's forefoot into the ground (35 kN against 16 kN). Rex's average sole pressure is lower (0.5–0.9 × the elephant's); Ollie's is 1.1–1.9 ×",
    notes="Elephant: 0.55 × 3,000 kg × 9.81 = 16.2 kN per forefoot at a walk; average pressure over 0.128–0.075 m² is 126–216 kPa. Rex and Ollie: 35.4 kN at 1.2 BW; 114 kPa (Rex) and 236 kPa (Ollie), using the picture-measured sole areas (estimates). Ratios: force 2.18; Rex's pressure 0.53–0.90, Ollie's 1.09–1.87. Timing at equal speed: at 1.2 m/s (Fr 0.1 for Rex) Rex's stance is about 0.9–1.1 s (duty factor 0.6–0.7) against the elephant's 1.5 s. Vibration comparisons need the measured elephant seismic data from the vibration topic; this fact compares only forces. Verifier: corrected 'similar pressure for Rex' (it is 0.5–0.9 ×) and moved the stance comparison to equal speed.",
)

vjs = json.loads(facts['step_schanz2013_elephant_footprint']['values_json'])
vjs['FEA_depths_m_listed'] = [0.003, 0.004, 0.007, 0.008, 0.018]
vjs['FEA_depth_m_at_stress_kPa'] = {"99": 0.004, "185": 0.008, "350": 0.018}
vjs['density_class'] = "loose to medium (relative density 0.30-0.47)"
O['step_schanz2013_elephant_footprint'] = dict(
    display="A weighed 2,530 kg African elephant cow left forefoot prints 20–26 mm deep in prepared medium-grained sand of loose-to-medium density (relative density 0.30–0.47)",
    values_json=json.dumps(vjs, ensure_ascii=False),
    notes="Quotes: 'the elephant was standing with all limbs on the scale (m = 2530 kg)'. 'average footprint length is 0.32 m, average width is 0.30 m, and the average depths of the three scanned forefoot impressions is 0.020 m, 0.021 m, and 0.026 m'. 'the relative density of the subsoil was found to be between 0.30 and 0.47'. 'A factor of approximately 3.5 relating [σ_dyn+stat] to [σ_stat] was identified using the DIC technique'. Stresses and depths are inline images, downloaded and read: σ = 93, 99, 166, σ_max = 185 kN/m²; ρ_d = 1.6; u_Exp = 0.022; u_FEA = 0.018. Sand compacted in three layers with a hand roller. One animal, one sand: the only measured large-animal print with known mass and soil found. Verifier: full text and images confirmed; 3.5 × 99 ≈ 350 kPa. Their calibrated model gives 4 / 8 / 18 mm at 99 / 185 / 350 kPa. Dr 0.30–0.47 is loose to medium, not 'firm'.",
)

O['step_fhwa_soil_modulus_table'] = dict(
    notes="Table 8–10, 'Typical values for Es and ν for different soil types (modified from AASHTO, 2014)', as reproduced in FHWA GEC 5 (AASHTO itself not read). Text at Eq. 8.16: 'The general equation for displacement at the center of an applied surface load is (8.16) where q is the applied stress, B is the width of the loaded area, I is a settlement influence factor, Es is the equivalent elastic modulus, and ν is Poisson's ratio for the soil.' The equation is an image; the form s = q·B·I·(1−ν²)/Es is our reading of the listed variables. EM 1110-1-1904 could not be fetched. Verifier: table and conversions confirmed (1 ksi = 6.895 MPa; loose sand 9.6–28.8 MPa; soft sensitive clay 2.4–14.3 MPa). Our settlement check used I = π/4, the rigid-plate centre factor; a flexible load gives I = 1 at the centre (about 27% more; small effect).",
)

O['step_em1110_clay_depth_factor'] = dict(
    notes="Table 4-7 'Influence of Footing Depth D (Department of the Navy 1982)': D/B 0.0 → 1.00, 0.5 → 1.15, 1.0 → 1.24, 2.0 → 1.36, 3.0 → 1.43, 4.0 → 1.46. Deep foundations in saturated clay: 'Ncp = 6 [1 + 0.2 (L/Bb)] ≤ 9' (Reese & O'Neill 1988), and 'Ncp for total stress analysis is assumed 9 for general shear and 7 for local'. Also: 'Local shear is a punching-type failure and it is more likely to occur in loose sands, silty sands, and weak clays' and 'For circular foundations, this critical relative depth is about D/B = 4'. Verifier: all match. The table is given for two-layer clay and wall footings; applying it to a foot sinking into mud is an analogy and must be labelled an estimate. With it, a sinking foot stops where N_c(D) s_u + γD ≥ p, instead of the engine's overburden-only rule.",
)

O['step_footprint_model_check'] = dict(
    notes="Script derive.py. The engine's groundUnderWeight rule, D = (p − q0)/(ρ g Nq) with q0 = 0.5 γ B Nγ × 0.6 (Vesic Nγ, square factor), applied to the elephant: γ = 15.7 kN/m³, B = √0.075 = 0.274 m, Ren's walking peak 0.55 BW (13.6 kN, 181 kPa). φ 30° gives 0.53 m; φ 35° (Schanz's value) 0.23 m; φ 40° 0.04 m. Measured: 0.020–0.026 m. With Schanz's 1.12 BW: 0.59 m at φ 35°. Elastic settlement at 350 kPa gives 2–9 mm (I = π/4; up to about 12 mm with I = 1). So failure-based sinking overpredicts about tenfold unless φ is near 40°, and elasticity underpredicts. On the engine's loose sand (37 kPa at 0.1 m², Nq 18.4) the rule sinks a person 0.21 m per step, Rex 0.17 m, Ollie 0.66 m; no measured human print was fetched to test this. Verifier: reproduced; using local or punching shear factors for this sand would make the overprediction worse.",
)

vjf = {
    "rule": "depth = d0 x (p / 350 kPa)^n x (B / 0.274 m); n = 1.1-1.3 from Schanz's calibrated model (4 / 8 / 18 mm at 99 / 185 / 350 kPa)",
    "anchor_measured_d0_0.022m": {"Rex_m": [0.010, 0.013], "Ollie_m": [0.019, 0.020]},
    "anchor_model_d0_0.018m_n_1.27": {"Rex_m": 0.0088, "Ollie_m": 0.0154},
    "upper_if_print_made_at_181kPa_linear": {"Rex_m": 0.028, "Ollie_m": 0.041},
    "Rex": {"p_kPa": 114, "B_m": 0.557},
    "Ollie": {"p_kPa": 236, "B_m": 0.387},
}
O['step_rex_ollie_footprint_estimate'] = dict(
    label="Rex's and Ollie's walking footprint depth in sand like the elephant's (scaled from one print)",
    value_si=0.012, low_si=0.009, high_si=0.028,
    display="In loose-to-medium sand like the elephant's: Rex about 1–1.5 cm, Ollie about 2 cm per walking step (estimate; up to about 3 and 4 cm if the print was made at the force-plate load of 0.55 × body weight)",
    values_json=json.dumps(vjf, ensure_ascii=False),
    notes="Estimate scaled from the one measured elephant print (Schanz 2013: 22 mm), anchored at Schanz's dynamic stress of 350 kPa and scaled by pressure^n × foot width. Rex: 114 kPa, B = √0.31 = 0.557 m; Ollie: 236 kPa, B = 0.387 m (sole areas are picture estimates). With n = 1.1–1.3: Rex 1.0–1.3 cm, Ollie 1.9–2.0 cm; anchored on the model's 18 mm instead (n 1.27): Rex 0.9 cm, Ollie 1.5 cm. If the print was made at 181 kPa (0.55 BW), linear scaling gives Rex 2.8 cm, Ollie 4.1 cm. Valid only for sand like Schanz's (relative density 0.30–0.47) and pressures near the anchor; not loose dry sand, wet sand, mud or clay; ignores the impact part and foot shape. Verifier: replaced the earlier linear rule (Schanz's own model is superlinear, and its 181 kPa anchor contradicted that model) and the label 'firm-ish' (the sand is loose to medium). Anchor the sand to a loose-to-medium bearing, not dense gravel.",
)

O['step_schanz2013_touchdown_speed'] = dict(
    notes="Their Eq. 1 defines m as 'the weight distributed over the limb considered', v1 as the limb's speed 'on impact', s as 'the path of deceleration (i.e., the deformation of the subsoil)' and A as foot area. The speed they measured (image correlation at 60 frames/s) is not printed. Back-calculation: f_dyn = 3.5 on loading step 2 (99 kPa, limb share 0.32), so σ_dyn = 2.5 × 99 = 248 kPa; m = 0.32 × 2,530 = 810 kg; s = 0.022 m; A = π × 0.16² = 0.080 m²; v1 = √(2 s A σ_dyn / m) = 1.04 m/s. Tension: 3.5 × 0.32 = 1.12 BW on one forefoot, against Ren et al.'s force-plate walking peak of about 0.55 BW and under 1 BW up to 4.8 m/s. Our reading (not the paper's): their energy formula probably overstates the dynamic load. Verifier: Eq. 1 image confirmed; back-calculation reproduced (1.04 m/s).",
)

# ---- assemble ----
out = []
for k in order:
    f = copy.deepcopy(facts[k])
    for kk, vv in O.get(k, {}).items():
        f[kk] = vv
    f['category'] = 'presence_step'
    rec = {
        'key': f['key'], 'category': f['category'], 'label': f['label'], 'status': f['status'],
        'value_si': f.get('value_si'), 'unit_si': f.get('unit_si', ''), 'low_si': f.get('low_si'), 'high_si': f.get('high_si'),
        'display': f['display'], 'sources': f['sources'], 'notes': f['notes'], 'who_when': f['who_when'],
    }
    if f.get('values_json'):
        rec['values_json'] = f['values_json']
    out.append(rec)
    if k == 'step_elephant_preferred_froude':
        out.insert(len(out) - 1, NEW_ELEPHANT_MEASURED)

gaps = open(f'{SP}/step_gaps.txt').read().strip()

# checks
allowed = {'verified', 'derived', 'estimate', 'reported', 'disputed'}
keys = [r['key'] for r in out]
assert len(keys) == len(set(keys)), 'duplicate keys'
for r in out:
    assert r['status'] in allowed, r['key']
    for fld in ('value_si', 'low_si', 'high_si'):
        assert r[fld] is None or isinstance(r[fld], (int, float)), (r['key'], fld)
    if r['low_si'] is not None and r['high_si'] is not None:
        assert r['low_si'] <= r['high_si'], r['key']
        if r['value_si'] is not None:
            assert r['low_si'] <= r['value_si'] <= r['high_si'], (r['key'], r['low_si'], r['value_si'], r['high_si'])
    if 'values_json' in r:
        json.loads(r['values_json'])
    for s in r['sources']:
        assert s['url'].startswith('https://'), r['key']
    if len(r['notes']) > 950:
        print('LONG NOTES', len(r['notes']), r['key'])

os.makedirs(f'{SP}/compiled', exist_ok=True)
with open(f'{SP}/compiled/step.json', 'w', encoding='utf-8') as fh:
    json.dump({'facts': out, 'gaps': gaps}, fh, ensure_ascii=False, indent=1)
print('facts', len(out))
from collections import Counter
print(Counter(r['status'] for r in out))
