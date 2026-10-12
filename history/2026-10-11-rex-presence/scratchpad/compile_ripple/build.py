import json, os
OUT = "/tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/compiled/ripple.json"
CAT = "presence_ripple"

S_SHAO_EF = {"title": "Shao, Gabbard, Bostwick & Saylor (2021), On the role of meniscus geometry in capillary wave generation, Experiments in Fluids 62:59, doi:10.1007/s00348-021-03161-3 (NSF public-access copy)", "url": "https://par.nsf.gov/servlets/purl/10311610"}
S_SHAO_JFM = {"title": "Shao, Wilson, Saylor & Bostwick (2021), Surface wave pattern formation in a cylindrical container, J. Fluid Mech. 915, A19, doi:10.1017/jfm.2021.97 (NSF public-access copy)", "url": "https://par.nsf.gov/servlets/purl/10311615"}
S_TB = {"title": "Terwagne & Bush (2011), Tibetan singing bowls, arXiv:1106.6348, section 3.3 'Surface waves' and Fig. 7", "url": "https://arxiv.org/pdf/1106.6348"}
S_IAPWS = {"title": "IAPWS R1-76(2014), Revised Release on Surface Tension of Ordinary Water Substance, Table 1", "url": "https://iapws.org/technical-guidance/release/Surf-H2O.download"}
S_WILSON = {"title": "Wilson, Shao, Saylor & Bostwick (2022), Role of edge effects and fluid depth in azimuthal Faraday waves, Phys. Rev. Fluids 7, 014803, eq. (21) and Table I (NSF public-access copy)", "url": "https://par.nsf.gov/servlets/purl/10391457"}
S_KARJ = {"title": "Karjanto (2010), First- and second-order wave generation theory, Appl. Math. Comput. Sci. 1(2) 181-197 (arXiv:1704.08416)", "url": "https://arxiv.org/pdf/1704.08416"}
S_DENNER = {"title": "Denner, Pare & Zaleski (2017), Dispersion and viscous attenuation of capillary waves with finite amplitude, Eur. Phys. J. Special Topics (arXiv:1701.07613)", "url": "https://arxiv.org/pdf/1701.07613"}
S_DELON = {"title": "Delon, Fermigier, Snoeijer & Andreotti, Relaxation of a dewetting contact line. Part 2: Experiments, J. Fluid Mech. (arXiv:0705.3583), eq. (4.1)", "url": "https://arxiv.org/pdf/0705.3583"}
S_ACUITY = {"title": "Kalloniatis & Luu, Visual Acuity, Webvision (University of Utah)", "url": "https://webvision.med.utah.edu/book/part-viii-psychophysics-of-vision/visual-acuity/"}
S_TEMPORAL = {"title": "Kalloniatis & Luu, Temporal Resolution, Webvision (University of Utah)", "url": "https://webvision.med.utah.edu/book/part-viii-psychophysics-of-vision/temporal-resolution/"}
S_NRCAN = {"title": "Natural Resources Canada, Earthquakes Canada: The Modified Mercalli (MM) Intensity Scale (1931 version, after Wood & Neumann 1931, BSSA 21, 277-283)", "url": "https://earthquakescanada.nrcan.gc.ca/info-gen/scales-echelles/mercalli-en.php"}
S_SHAKEMAP = {"title": "USGS ShakeMap, Macroseismic Intensity Map, 16 km SW of Ludlow CA (M7.1, 1999), legend 'Scale based on Worden et al. (2012)'", "url": "https://earthquake.usgs.gov/product/shakemap/ci9108652/atlas/1594160205748/download/intensity.pdf"}
S_ACCU = {"title": "Diversified Enterprises (Accu Dyne Test), Critical Surface Tension and Contact Angle with Water for Various Polymers (vendor compilation)", "url": "https://www.accudynetest.com/polytable_03_print.html"}
S_KOIMOI = {"title": "Koimoi (Heena Singh, 29 Oct 2024): Did you know the iconic water ripple scene in Jurassic Park was created with a guitar string?", "url": "https://www.koimoi.com/hollywood-news/did-you-know-the-iconic-water-ripple-scene-in-jurassic-park-was-created-with-a-guitar-string-heres-how-they-did-it/"}
S_FILMSTORIES = {"title": "Film Stories (Simon Brew, 27 Sep 2022): Jurassic Park: the simple genius behind its lowest tech, most effective effects shot", "url": "https://filmstories.co.uk/features/jurassic-park-the-simple-genius-behind-its-lowest-tech-most-effective-effects-shot/"}

def F(key, label, status, value, unit, low, high, display, sources, notes, who, vj=None):
    d = {"key": key, "category": CAT, "label": label, "status": status, "value_si": value, "unit_si": unit,
         "low_si": low, "high_si": high, "display": display, "sources": sources, "notes": notes, "who_when": who}
    if vj is not None:
        d["values_json"] = json.dumps(vj, ensure_ascii=False)
    return d

facts = []

facts.append(F("ripple_no_measured_threshold",
  "Measured naked-eye threshold for visible ripples in a glass at footstep frequencies",
  "not_quantified", None, "m/s", None, None,
  "Unknown: no measured value found",
  [S_SHAO_EF, S_TB],
  "A recorded negative result, not a number. The researcher searched physics-education journals (AJP, Physics Education, The Physics Teacher), seismoscope and Mercalli sources, liquid-mirror telescope vibration papers (qualitative only), construction, railway and blasting vibration tables (no liquid-surface criterion) and smartphone or phyphox experiments; the verifier ran two further web searches (October 2026). None gives a measured vibration level at which ripples in a drinking glass become visible. Exact query strings were not logged. The closest lab work (Shao et al. 2021) states 'Our apparatus was not capable of measuring the actual wave height'. So the page must present the threshold as derived (ripple_threshold_shimmer, ripple_threshold_rings). Verifier: the Leicester Physics Special Topics search page was dropped as evidence; it returns 'No Results' for every query, even 'physics'.",
  "This research and its verification, October 2026"))

facts.append(F("ripple_lighting_naked_eye",
  "Small wall-driven ripples: almost invisible to the naked eye, but easy to see with the right lighting",
  "verified", None, "", None, None,
  "'Almost invisible to the naked eye', 'readily detected by appropriate lighting' (water in a singing bowl, 188 Hz)",
  [S_TB],
  "Quote: 'The vibration of the water surface is forced by the horizontal oscillation of the rim. When the amplitude of the rim oscillation is small, axisymmetric progressive capillary waves with frequency commensurate with the excitation frequency appear on the liquid surface. Though almost invisible to the naked eye, they can be readily detected by appropriate lighting of the liquid surface (Fig. 7a).' Fig. 7a: bowl 'Tibet 1' filled with water, f = 188 Hz, mode (2,0), Γ = 1.8, where Γ is 'the maximal acceleration of the rim normalized by the gravitational acceleration'. Our arithmetic: rim displacement about 13 µm, peak rim velocity about 15 mm/s. 188 Hz is far above the eye's flicker cut-off (about 60 Hz), so this does not transfer to 10-40 Hz steps; it shows lighting dominates visibility. The waves were ring-shaped although the rim moved sideways in a four-lobed mode. From the verifier's list; quote confirmed in the PDF.",
  "Terwagne & Bush 2011",
  {"frequency_Hz": 188, "mode": "(2,0)", "Gamma_rim_accel_over_g": 1.8, "rim_displacement_um_ours": 13, "rim_peak_velocity_mm_s_ours": 15}))

facts.append(F("ripple_mmi1931_liquids",
  "Modified Mercalli scale (1931): what earthquakes do to liquids in open vessels",
  "verified", None, "", None, None,
  "MM I-II: liquids 'may sway'; MM IV: 'Disturbed liquids in open vessels slightly'; MM V: small spills from well-filled containers",
  [S_NRCAN],
  "As reproduced by NRCan. Exact text: MM I '...sometimes trees, structures, liquids, bodies of water, may sway - doors may swing, very slowly'; MM II repeats it 'often more noticeably'. MM IV 'Felt indoors by many, outdoors by few. ... Disturbed liquids in open vessels slightly.' MM V 'Spilled liquids in small amounts from well-filled open containers.' MM VI 'Liquid set in strong motion.' MM VII 'Waves on ponds, lakes, and running water.' These are reported observations in earthquakes, where shaking is mostly low-frequency, so liquids mostly slosh and tilt as a whole rather than show the short ripples footsteps would make. Context only. Verifier: added that liquids appear from MM I, not only at IV.",
  "Wood & Neumann 1931, reproduced by NRCan",
  {"MM I": "sometimes ... liquids, bodies of water, may sway", "MM II": "as in grade I, but often more noticeably", "MM IV": "Disturbed liquids in open vessels slightly", "MM V": "Spilled liquids in small amounts from well-filled open containers", "MM VI": "Liquid set in strong motion", "MM VII": "Waves on ponds, lakes, and running water"}))

facts.append(F("ripple_shakemap_mmi_iv_pgv",
  "USGS ShakeMap legend: peak ground velocity listed for Mercalli intensity IV (earthquakes; context only)",
  "verified", 0.0141, "m/s", None, None,
  "Intensity IV (Light): PGV 1.41 cm/s, PGA 2.76% of g (earthquake sloshing, not a ripple threshold)",
  [S_SHAKEMAP],
  "Legend row 'PGV(cm/s): <0.0215 | 0.135 | 1.41 | 4.65 | 9.64 ...' under 'INTENSITY: I | II-III | IV | V | VI'; PGA row '<0.0464 | 0.297 | 2.76 | 6.2 | 11.5' (%g). Shaking 'Light', damage 'None' at IV. Verifier: 1.41 cm/s is the Worden et al. (2012) conversion value at MMI exactly 4.0, not a threshold; the intensity IV band (MMI 3.5-4.5) spans about 0.65-3.1 cm/s, and the conversion scatter is large (about 0.6 MMI units). That band uses coefficients the verifier recalled, not fetched (reproduced here: 0.64-3.1 cm/s); Worden et al. was not fetched. Not transferable to 10-40 Hz footsteps: at 1-2 Hz, 1.41 cm/s tilts a glass's surface by about 0.5-1 degree, which is sloshing. Verifier: removed the claim that people notice disturbed liquids only around 'felt by many'; the scale lists swaying liquids from MM I.",
  "USGS ShakeMap, scale after Worden et al. 2012",
  {"II-III": {"PGV_cm_s": 0.135, "PGA_pct_g": 0.297}, "IV": {"PGV_cm_s": 1.41, "PGA_pct_g": 2.76}, "V": {"PGV_cm_s": 4.65, "PGA_pct_g": 6.2}, "IV_band_PGV_cm_s_unfetched_coefficients": [0.65, 3.1]}))

facts.append(F("ripple_shao2021_edge_wave_anchor",
  "Lab example: a clear ring pattern in a 70 mm tank shaken up and down at a resonance (not a threshold)",
  "verified", 0.5, "m/s^2", 0.25, 0.5,
  "'On the order of 0.5 m/s²' vertical at 11.2 Hz (peak velocity about 4-7 mm/s); 70 mm wide water tank at a resonance",
  [S_SHAO_EF],
  "Quotes: 'a circular acrylic tank having a radius R = 35 mm and depth H = 22 mm'; vertical shaker; 'Herein we studied the resonant condition which existed at a driving frequency of 11.2 Hz. For the results presented here, the amplitude of tank acceleration was on the order of 0.5 m/s2.'; 'Our apparatus was not capable of measuring the actual wave height'. Imaged by wave slope with collimated light and 1 s exposures, not by eye. Peak velocity A/(2πf) = 7.1 mm/s, displacement 0.1 mm. Verifier: the companion paper defines amplitude as 'the average min–max of a', which may be peak-to-peak; then peak is about 0.25 m/s² and 3.6 mm/s (low_si). A clearly imaged resonant pattern; not a threshold and not a calibration of the model (resonant standing wave, meniscus pinned at the rim and set by fill level, slope imaging). Verifier: the claimed 20-40 arcmin model agreement was miscomputed and is removed.",
  "Shao, Gabbard, Bostwick & Saylor 2021"))

facts.append(F("ripple_meniscus_mechanism",
  "Why up-and-down shaking makes ring waves: the meniscus (a flat surface makes none)",
  "verified", None, "", None, None,
  "Edge waves need a meniscus; vertical shaking varies effective g, so the meniscus shape oscillates and sends out waves",
  [S_SHAO_EF],
  "Quotes: 'such a meniscus is needed to form capillary waves, that the lack of a meniscus (a flat interface at the wall) prevents the formation of these waves, and that a meniscus of either positive or negative curvature serves equally well'; 'When a tank is vibrated, g effectively becomes a time-varying value and the meniscus geometry must vary to accommodate the new value. ... For the flat interface, the effective variation in g has no effect'; more under- or overfilling gives a larger standing wave for the same shaking. The paper's menisci were pinned at the rim and set by fill volume, not by the wall's contact angle. Inference (not tested in the paper): a cup whose contact angle is near 90° (polystyrene, meniscus about 0.1 mm) should ring weakly; a polypropylene cup's depressed meniscus should still make rings. Verifier: inference labelled; plastic statement corrected.",
  "Shao et al. 2021"))

facts.append(F("ripple_edge_waves_below_faraday",
  "Edge (meniscus) waves appear far below the Faraday threshold, at the drive frequency, and are concentric",
  "verified", None, "", None, None,
  "Edge waves: at the drive frequency, always ring-shaped, at amplitudes 'much smaller than the Faraday wave threshold'",
  [S_SHAO_JFM],
  "Quotes (PDF text letter-spaced; reconstructed): edge waves 'typically appear for driving amplitudes much lower than the Faraday wave threshold'; 'Harmonic edge waves can be excited by under-filling the container such that α < 90° wherein edge waves occur for driving amplitudes much smaller than the Faraday wave threshold. Edge waves are always axisymmetric ℓ = 0 and the radial mode number n increases with frequency.' Fig. 6 shows six sharp edge-wave peaks (n = 1-6) at about 6-22 Hz in the R = 35 mm underfilled tank pinned at the rim; 'The first peak corresponds to the (1,0) mode'. No forcing amplitude is given. Our inference from wall geometry, not from this paper: a rigid glass shaken sideways pushes the water as cos φ around its wall, giving a two-lobed pattern rather than uniform rings. Verifier: Fig. 6 range corrected from 8-23 Hz to about 6-22 Hz.",
  "Shao, Wilson, Saylor & Bostwick 2021"))

facts.append(F("ripple_faraday_onset_small_tank",
  "Faraday (parametric) wave onset for water in a 70 mm tank shaken up and down at 10-20 Hz",
  "verified", 0.4, "m/s^2", 0.3, 0.8,
  "Onset about 0.3-0.8 m/s² at the mode resonances (3-8% of g), about 3-7 mm/s peak velocity at 11-20 Hz; may be peak-to-peak",
  [S_SHAO_JFM],
  "Read off Fig. 4 ('Acceleration A against driving frequency fd showing the Faraday wave tongues'). Verifier: the tongue minima, which are the onset at each resonance, are about 0.3 (1,2), 0.4 (1,0), 0.45 (1,3), 0.45 (2,1), 0.6 (2,2), 0.4 (2,0), 0.8 (1,5), 0.4 (2,3) m/s²; the plotted flanks reach about 2.5 m/s² off resonance, which is not an onset value. Text: 'the onset acceleration at resonance is relatively constant for all modes'. Threshold bracket 0.2 m/s². Amplitude defined as 'the average min–max of a', possibly peak-to-peak. Peak velocity A/(2πf) at the minima (frequencies read off by us, about 11-20 Hz): about 3-7 mm/s. Conditions: brimful, pinned contact line, flat interface (α = 90°). An ordinary part-filled glass was not measured. Faraday waves sit at half the drive frequency and grow over many cycles, so single steps are unlikely to set them off.",
  "Shao, Wilson, Saylor & Bostwick 2021",
  {"tongue_minima_m_s2": {"(1,2)": 0.3, "(1,0)": 0.4, "(1,3)": 0.45, "(2,1)": 0.45, "(2,2)": 0.6, "(2,0)": 0.4, "(1,5)": 0.8, "(2,3)": 0.4}, "flank_max_m_s2": 2.5}))

facts.append(F("ripple_water_surface_tension_20c",
  "Surface tension of water at 20 °C",
  "verified", 0.07274, "N/m", 0.07198, 0.07274,
  "72.74 mN/m at 20 °C (71.98 at 25 °C)",
  [S_IAPWS],
  "Table 1 rows: '20 | 72.74 | 0.36 | 72.74 | 0.00' and '25 | 71.98 | 0.36 | 71.97 | 0.01' (t in °C; experimental, uncertainty, calculated, difference; mN/m). Uncertainty 0.36 mN/m. Tap water with surfactants or a surface film can be lower; not modelled. Water density 998 kg/m³ at 20 °C used alongside (consistent with existing key density_water_4c).",
  "IAPWS 2014"))

facts.append(F("ripple_capillary_gravity_dispersion",
  "Dispersion relation for ripples (capillary-gravity waves) on water",
  "verified", None, "", None, None,
  "ω² = (g k + σ k³/ρ) tanh(k h)",
  [S_WILSON, S_KARJ],
  "Wilson et al. eq. (21), dimensionless: 'λn = i Oh kn² ± sqrt[(Bo kn + kn³) tanh(kn h) + 2kn² Ec − Oh² kn⁴]', lengths scaled by the cylinder radius R and time by sqrt(ρR³/σ), Bo = ρgR²/σ. For a liquid (Ec = 0) with weak viscosity (Oh → 0) this is the dimensional form shown; the conversion is ours and the verifier reproduced it. Karjanto gives the gravity-only limit 'ω² = gk tanh kh. (5)'. For a glass (water 5-10 cm deep) tanh(kh) ≈ 1 at 10-40 Hz.",
  "Wilson et al. 2022; Karjanto 2010"))

facts.append(F("ripple_viscous_damping_rate",
  "Viscous damping rate of small ripples",
  "verified", None, "1/s", None, None,
  "Γ = 2νk² (amplitude decay rate, weak damping)",
  [S_DENNER, S_WILSON],
  "Denner et al.: 'The damping rate based on Eq. (3) is Γ = 2νk², applicable for k ≪ ω0/ν'. Γ is an amplitude decay rate; energy decays at 4νk². Water properties from Wilson et al. Table I (water:glycerol 1:0): 71.6 mN/m, 0.96 mPa s, 997 kg/m³, so ν ≈ 0.96 × 10⁻⁶ m²/s. Ignores the extra damping at the container wall and contact line, which dominates in small containers. Verifier aside: Wilson et al. eq. (21) implies νk², half of Denner's value; this does not change any conclusion here, since bulk damping is negligible across a glass.",
  "Denner, Paré & Zaleski 2017"))

facts.append(F("ripple_wave_scales_derived",
  "Ripple size and speed in a glass at 10, 20 and 40 Hz (computed)",
  "derived", 0.0119, "m", 0.0069, 0.0237,
  "Wavelength 24 / 12 / 7 mm at 10 / 20 / 40 Hz; speed about 24-28 cm/s",
  [S_IAPWS, S_WILSON, S_DENNER],
  "Solve ω² = (gk + σk³/ρ) tanh(kh) for k with σ = 0.07274 N/m, ρ = 998 kg/m³, g = 9.80665 m/s², h = 0.08 m. Then wavelength 2π/k, phase speed ω/k, group speed (g + 3σk²/ρ)/(2ω), decay rate 2νk² (ν = 0.96e-6 m²/s), decay length c_group/Γ. value_si is the 20 Hz wavelength. Viscous decay lengths (about 1.5, 0.5, 0.24 m) are far larger than a glass, so bulk viscosity does not stop ripples crossing it; wall and contact-line damping are not included. Ripples cross a 35 mm radius in about 0.09-0.18 s, comparable to one footstep. Capillary length l_c = sqrt(σ/ρg) = 2.73 mm. Verifier recomputed every value.",
  "This research, 2026",
  {"10 Hz": {"k_per_m": 265, "wavelength_mm": 23.7, "phase_speed_cm_s": 23.7, "group_speed_cm_s": 20.0, "viscous_decay_length_m": 1.5}, "20 Hz": {"k_per_m": 526, "wavelength_mm": 11.9, "phase_speed_cm_s": 23.9, "group_speed_cm_s": 28.0, "viscous_decay_length_m": 0.5}, "40 Hz": {"k_per_m": 906, "wavelength_mm": 6.9, "phase_speed_cm_s": 27.7, "group_speed_cm_s": 37.7, "viscous_decay_length_m": 0.24}}))

facts.append(F("ripple_wavemaker_deep_water_ratio",
  "Gravity waves made by a moving wall in deep water: wave amplitude vs wall displacement (no surface tension)",
  "verified", 2, "ratio", None, None,
  "Wave amplitude → 2 × wall displacement amplitude as kh → ∞ (linear gravity-wave wavemaker theory)",
  [S_KARJ],
  "Quotes: 'the first-order transfer function Tn is defined as the ratio between the surface wave amplitude of the propagating mode Cn0 as output and the maximum stroke |Sn| as input'; '...approaching the asymptotic limit of Tn(1) = 2 for kn0 h → ∞.'; 'This first-order theory can also be found in Dean and Dalrymple'. Derived for a hinged flap; in deep water only near-surface motion matters, so a translating wall gives the same limit (our argument). Scope: gravity waves with no surface tension (eq. 5). Verifier: at 20-40 Hz glass ripples are capillary-dominated (k·l_c = 1.4-2.5), outside this derivation, so the 1-3 range for real ripples is moved to the estimate ripple_wavemaker_ratio_capillary; low_si and high_si removed here.",
  "Karjanto 2010, after Dean & Dalrymple 1991"))

facts.append(F("ripple_wavemaker_ratio_capillary",
  "Ripples made by a glass wall shaken sideways: wave amplitude vs wall displacement (our estimate)",
  "estimate", 2, "ratio", 1, 3,
  "About 2 × the wall's displacement (range 1-3); no capillary-wave source found",
  [S_KARJ],
  "Starts from the verified deep-water gravity-wave value of 2 (ripple_wavemaker_deep_water_ratio) and widens it, because at 20-40 Hz the ripples are capillary-dominated (k·l_c = 1.4-2.5) and the wall carries a meniscus. Verifier's estimate: tilting the effective gravity by the wall's acceleration changes the wall meniscus height by about 3.6X at 20 Hz (contact angle 20°, assumed); its radiated part is about 0.9X with unknown phase, so the true ratio is plausibly 1 to 3. Cocciaro, Faetti & Nobili (1991, JFM 231; abstract only) report 'unusual' amplitude and phase from the wetting boundary condition in a horizontally shaken cylinder. Hocking & Mahdmina (1991, JFM 224) treat capillary wavemakers; not fetched. Used for the shimmer threshold (ripple_threshold_shimmer).",
  "Verifier's estimate, this research, 2026"))

facts.append(F("ripple_meniscus_height",
  "Height of the water meniscus on a glass wall (formula verified; contact angle assumed)",
  "estimate", 0.00313, "m", 0.00186, 0.00386,
  "About 2-4 mm for water on glass, depending on the unsourced contact angle (0-50°)",
  [S_DELON, S_ACCU],
  "Quote: 'the liquid rises above the bath up to a height zcl ... according to the classical relation (Landau & Lifschitz 1959), zcl = lγ sqrt(2(1 − sin θ)), where θ is the equilibrium contact angle ... a perfectly wetting liquid can achieve a maximum rise of √2 times the capillary length lγ.' With l_c = 2.73 mm: θ = 0° gives 3.86 mm; 20° gives 3.13 mm (value_si, assumed angle); 50° gives 1.86 mm. Plastics (reported angles): polystyrene 87.4° gives 0.12 mm; polypropylene 102.1° gives a 0.57 mm depression. The contact angle of water on household glass is not sourced. Flat-wall formula, fine for a glass much wider than l_c; the small-slope exponential profile used downstream is crude at 20°. Verifier: status lowered from verified (only the formula is verified); set to estimate, not derived, because the angle input is assumed; plastic values removed from the range.",
  "Delon et al. (after Landau & Lifshitz 1959); angle assumed, 2026",
  {"theta_deg_to_height_mm": {"0": 3.86, "20": 3.13, "50": 1.86, "87.4 (polystyrene)": 0.12, "102.1 (polypropylene)": -0.57}}))

facts.append(F("ripple_plastic_contact_angles",
  "Water contact angle on common cup plastics",
  "reported", None, "deg", None, None,
  "Polypropylene 102°, polystyrene 87°, polycarbonate 82°",
  [S_ACCU],
  "Table rows: 'Polypropylene (PP) | 30.5 | 102.1'; 'Polystyrene (PS) | 9003-53-6 | 34 | 87.4'; 'Polycarbonate (PC) | 24936-68-3 | 44 | 82' (critical surface tension mN/m, water contact angle degrees). Vendor compilation of literature values, so 'reported'. Relevance: angles near 90° give almost no meniscus and so weak ring (edge) waves under up-and-down shaking; side-to-side wall-driven ripples still form.",
  "Diversified Enterprises compilation (accessed 2026)",
  {"polypropylene_deg": 102.1, "polystyrene_deg": 87.4, "polycarbonate_deg": 82}))

facts.append(F("ripple_visual_acuity_1arcmin",
  "Normal visual acuity: minimum angle of resolution",
  "verified", 0.000291, "rad", None, None,
  "1 minute of arc (6/6, 20/20)",
  [S_ACUITY],
  "Quote: 'For a visual acuity of 6/6 (20/20), one of the strokes of the letter subtends one minute of arc at the eye. Therefore, the minimum angle of resolution (MAR) is one minute of arc and the logMAR is 0'. 1 arcmin = 2.91e-4 rad. Using it as the limit for seeing a reflection move is our assumption (see ripple_threshold_ideal_eye). A surface tilt s turns a reflected ray by 2s, so 1 arcmin of reflection needs a 0.5 arcmin slope. Motion and vernier (hyperacuity) tasks can go below 1 arcmin.",
  "Kalloniatis & Luu, Webvision"))

facts.append(F("ripple_eye_temporal_resolution",
  "Eye's flicker sensitivity (bears on 10-40 Hz ripples)",
  "verified", 60, "Hz", 15, 60,
  "Most sensitive at 15-20 Hz in bright light; cut-off about 60 Hz (bright), about 15 Hz (dim)",
  [S_TEMPORAL],
  "Quote: 'The eye appears to be most sensitive to a frequency of 15 to 20 Hz at high luminances (photopic vision). At photopic light levels, less than 1% contrast is required to detect the stimulus and the high temporal frequency cut off is close to 60 Hz. At low light levels the maximum contrast is about 20% and the high temporal frequency cut off is approximately 15 Hz.' Full-field flicker figures at maximum contrast. Implication: in daylight, 10-40 Hz ripple flicker is visible. In dim light, travelling ripples may blur away; only standing patterns stay visible (compare Shao et al.: away from resonance 'travelling waves are observed and are blurred in the imagery due to the long exposure time'). Verifier: implication softened.",
  "Kalloniatis & Luu, Webvision"))

facts.append(F("ripple_threshold_ideal_eye",
  "Water-glass ripples: illustrative best case (1-arcmin reflected-light criterion)",
  "estimate", 2e-05, "m/s", 1.7e-05, 4e-05,
  "About 0.02 mm/s (0.017-0.04 mm/s); illustrative best case, not a hard floor; ripples under 1 µm high",
  [S_ACUITY, S_KARJ, S_WILSON, S_DELON, S_IAPWS],
  "Assumption: a ripple is just visible when it turns a reflection by 1 arcmin (surface slope s = 0.5 arcmin); wave amplitude a = s/k. Side-to-side: PPV = (s × phase speed)/r with r = 2 (1-2 here), giving 0.017-0.04 mm/s; this sets the minimum at all three frequencies. Up-and-down (rings), verifier's corrected meniscus model, free contact line, glass contact angle 20-50° (assumed): 0.074-0.12, 0.053-0.088, 0.056-0.093 mm/s at 10, 20, 40 Hz. Needs a crisp reflection, close and attentive viewing, steady shaking and a table that moves with the ground. Motion and vernier hyperacuity can go below 1 arcmin, so it is not a true floor. Verifier: status lowered from derived (the criterion is assumed); the up-and-down column replaced (the earlier source factor overstated ring waves 1.1-5×); 40 Hz minimum is 0.020, not 0.011.",
  "This research and verification, 2026",
  {"criterion": "reflected-image deflection 1 arcmin", "10 Hz": {"wave_amp_um": 0.55, "side_to_side_mm_s": "0.017-0.035", "up_down_rings_mm_s_free_contact_line": "0.074-0.12", "threshold_mm_s": 0.017}, "20 Hz": {"wave_amp_um": 0.28, "side_to_side_mm_s": "0.017-0.035", "up_down_rings_mm_s_free_contact_line": "0.053-0.088", "threshold_mm_s": 0.017}, "40 Hz": {"wave_amp_um": 0.16, "side_to_side_mm_s": "0.020-0.040", "up_down_rings_mm_s_free_contact_line": "0.056-0.093", "threshold_mm_s": 0.020}}))

facts.append(F("ripple_threshold_noticeable",
  "Water-glass ripples noticeable to an attentive viewer (10-arcmin criterion), by mechanism and frequency",
  "estimate", 0.0002, "m/s", 0.0001, 0.0004,
  "Shimmer (side-to-side): about 0.2 mm/s at 10, 20 and 40 Hz, within a factor of 2-3. Concentric rings (up-and-down): about 0.5-1 mm/s vertical (0.2-1.7 across contact-line assumptions)",
  [S_ACUITY, S_KARJ, S_WILSON, S_DELON, S_IAPWS],
  "Same model as ripple_threshold_ideal_eye, with visibility set at a 10-arcmin swing of the reflection: ten times the acuity limit, a third of the Moon's width. The 10× factor is a guess for 'you notice it without hunting for it'. Side-to-side: PPV = (θv/2)·c_phase/r, flat with frequency because the phase speed sits near its 23-28 cm/s minimum; 0.17-0.35, 0.17-0.35, 0.20-0.40 mm/s at 10, 20, 40 Hz (r = 2 to 1). Rings, verifier's model a = A·z_m·k·l_c/((1+(k·l_c)²)·ω·c_g), checked by the verifier numerically and recomputed here: free contact line 0.74-1.24, 0.53-0.89, 0.56-0.93 mm/s; pinned 1.0-1.7, 0.37-0.62, 0.23-0.38 mm/s. Ignores table and floor amplification, glass resonances, contact-line hysteresis and that a footstep is a short burst. Verifier: ring column corrected; 40 Hz is about 0.2 mm/s, not 0.11; the Shao 'consistency check' removed.",
  "This research and verification, 2026",
  {"criterion": "reflected-image deflection 10 arcmin", "10 Hz": {"wave_amp_um": 5.5, "side_to_side_mm_s": "0.17-0.35", "rings_free_mm_s": "0.74-1.24", "rings_pinned_mm_s": "1.0-1.7", "shimmer_threshold_mm_s": 0.17}, "20 Hz": {"wave_amp_um": 2.8, "side_to_side_mm_s": "0.17-0.35", "rings_free_mm_s": "0.53-0.89", "rings_pinned_mm_s": "0.37-0.62", "shimmer_threshold_mm_s": 0.17}, "40 Hz": {"wave_amp_um": 1.6, "side_to_side_mm_s": "0.20-0.40", "rings_free_mm_s": "0.56-0.93", "rings_pinned_mm_s": "0.23-0.38", "shimmer_threshold_mm_s": 0.20}}))

facts.append(F("ripple_threshold_shimmer",
  "Water in a glass visibly shimmers: value for the Walk tab (horizontal shaking)",
  "estimate", 0.0002, "m/s", 2e-05, 0.001,
  "About 0.2 mm/s horizontal at the table (derived, not measured; range 0.02-1 mm/s)",
  [S_ACUITY, S_KARJ, S_WILSON, S_IAPWS],
  "From ripple_threshold_noticeable: side-to-side shaking makes the glass wall push out ripples, PPV = (θv/2)·c_phase/r with θv = 10 arcmin (assumed), phase speed 24-28 cm/s and r = 2 (1-3, ripple_wavemaker_ratio_capillary): 0.12-0.4 mm/s, about 0.2 at 10-40 Hz. One value for all footstep frequencies. Compare with HORIZONTAL peak velocity at the glass. This makes a two-lobed shimmer, not the film's even rings (see ripple_threshold_rings). Range: 0.02 mm/s (sharp eye on a crisp reflection) to about 1 mm/s (casual glance, dim light). Likely error up to a factor of 10, set by the visibility criterion. Assumes the table moves with the ground and steady shaking (a footstep is a burst of a few cycles). The visibility criterion is assumed; the physical inputs are sourced. Verifier: split from the former ripple_threshold_recommended, which tied 0.2 mm/s to the ring look.",
  "This research and verification, 2026"))

facts.append(F("ripple_threshold_rings",
  "Concentric rings in a glass (the Jurassic Park look): value for the Walk tab (vertical shaking)",
  "estimate", 0.0007, "m/s", 5e-05, 0.003,
  "About 0.5-1 mm/s vertical at the table (derived, not measured; range about 0.05-3 mm/s); bold film-style rings take a few mm/s",
  [S_SHAO_EF, S_SHAO_JFM, S_ACUITY, S_DELON, S_IAPWS],
  "Up-and-down shaking makes the meniscus pump out ring-shaped edge waves, far below the Faraday threshold (Shao et al.). Verifier's radiation model with a 10-arcmin criterion (assumed) and a glass contact angle of 20-50° (assumed): 0.53-1.24 mm/s with a free contact line, 0.23-1.7 pinned, at 10-40 Hz; central 0.7 mm/s. Compare with VERTICAL peak velocity at the glass. Range: about 0.05 mm/s (1-arcmin best case; a pinned line at 40 Hz could reach 0.02) to about 3 mm/s (casual glance). Bold rings: a few mm/s; Shao et al. imaged a clear resonant pattern at about 4-7 mm/s, but that is not a calibration. The model is a small-slope treatment of a steep meniscus, derived by the verifier, not from a paper. Ignores table amplification, glass resonances (a footstep's few cycles cannot build them up) and contact-line hysteresis. Verifier: new value; previously merged into the 0.2 mm/s figure.",
  "This research and verification, 2026"))

facts.append(F("ripple_film_effect_production",
  "How the Jurassic Park water-glass shot was made (context only)",
  "reported", None, "", None, None,
  "Practical effect: a guitar string set the cup shaking (Michael Lantieri); accounts differ on where the string ran",
  [S_KOIMOI, S_FILMSTORIES],
  "Koimoi quotes Lantieri without naming the interview ('a behind-the-scenes treasure trove'): 'messing around with a guitar one night, I set a glass [on it] and started playing notes on a guitar and got to the right frequency, a right note, and it did exactly what I wanted it to do.' Koimoi says 'He attached a guitar string to the dashboard of the Ford Explorer'. Film Stories (author's narration, no cited interview): 'They simply ran guitar strings through the car ... one lucky recruit got to lie on the floor of the car and be that day's chosen plucker'. The sources conflict (dashboard versus floor), and no primary interview (DVD or Blu-ray extras) was fetched. Our inference, untested: a vibrating string under the cup would shake it mainly up and down, which fits the ring look. Verifier: the dashboard detail is in a cited source, not only in 'other accounts'; conflict recorded.",
  "Lantieri (1993 production), as reported 2022-2024"))

gaps = (
"No measured naked-eye threshold for visible ripples in a glass at footstep frequencies (10-40 Hz) was found, by the researcher or by the verifier's two further searches; exact query strings were not logged. Both page thresholds (ripple_threshold_shimmer, ripple_threshold_rings) are estimates: derived, not measured. "
"Open items, none fetched or confirmed: "
"(1) Visibility criterion: the 10-arcmin 'noticeable' factor is a guess, ten times the sourced 1-arcmin acuity; it is the largest uncertainty (about a factor of 10). Webvision's hyperacuity chapter and motion-detection literature could tighten it. "
"(2) Glass contact angle: water on household soda-lime glass, clean versus used, is unsourced (0-50° assumed); a PMC table with one glass value (45°) was behind a captcha. The ring threshold scales with meniscus height. "
"(3) Ring (meniscus) radiation model: the verifier's own Green's-function derivation, checked numerically but not from a paper; no paper gives edge-wave height against forcing. "
"(4) Capillary wavemaker theory: Hocking & Mahdmina 1991 (JFM 224) and the full text of Cocciaro, Faetti & Nobili 1991 (JFM 231) would replace the gravity-only ratio of 2. "
"(5) Floor and table transfer: no source for amplification from ground to table top; suspended floors and tables often resonate at 10-30 Hz and could amplify several-fold. AISC Design Guide 11 and SCI P354 are candidates. "
"(6) Component convention: shimmer responds to horizontal and rings to vertical motion; the threshold topic's PPV convention and an H/V ratio (about 0.7 for Rayleigh waves in a uniform half-space, textbook, not sourced here) need settling. "
"(7) Pulse versus steady shaking: thresholds are for steady sinusoids; a footstep is a burst of a few cycles, which cannot build up the glass's resonant edge-wave peaks. "
"(8) Faraday onset in an ordinary part-filled glass (moving contact line) was not measured; the Shao figures are for a brimful pinned tank and may be peak-to-peak. "
"(9) Worden et al. (2012) was not fetched; the MMI IV band of 0.65-3.1 cm/s uses recalled coefficients. "
"(10) Film production: no primary Lantieri interview was fetched, and the secondary sources conflict. "
"(11) Human perception thresholds (BS 5228-2, ISO 2631-2) belong to the threshold topic and are not restated here. "
"Fetch failures: the Clemson copy of Shao et al. 2021 JFM returned 503 (NSF PAR copy used); APS DFD abstracts returned 403; the Leicester Physics Special Topics search does not work in a plain fetch."
)

os.makedirs(os.path.dirname(OUT), exist_ok=True)
json.dump({"facts": facts, "gaps": gaps}, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
# checks
keys = [f["key"] for f in facts]
assert len(keys) == len(set(keys))
for f in facts:
    assert f["value_si"] is None or isinstance(f["value_si"], (int, float)), f["key"]
    assert f["status"] in ("verified", "derived", "estimate", "reported", "disputed", "not_quantified"), f["key"]
    if f["low_si"] is not None and f["value_si"] is not None:
        assert f["low_si"] <= f["value_si"] <= f["high_si"], f["key"]
    print(f"{f['key']:40s} {f['status']:15s} notes={len(f['notes'])}")
print(len(facts), "facts; gaps", len(gaps))
