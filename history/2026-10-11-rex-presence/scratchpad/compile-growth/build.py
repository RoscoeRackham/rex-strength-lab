#!/usr/bin/env python3
"""Compile the growth topic: research facts + verifier corrections -> compiled/growth.json."""
import json
import os

SP = '/tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad'
OUT = os.path.join(SP, 'compiled', 'growth.json')

# ---------- sources ----------
NIST_C = {"title": "NIST CODATA 2022: speed of light in vacuum", "url": "https://physics.nist.gov/cgi-bin/cuu/Value?c"}
NIST_G = {"title": "NIST CODATA 2022: Newtonian constant of gravitation (existing key gravitational_constant)", "url": "https://physics.nist.gov/cgi-bin/cuu/Value?bg"}
CANON = {"title": "Project canon: CLAUDE.md in this repository (3,007 kg; 3.048 m; 1,060 kg/m³)", "url": "https://github.com/RoscoeRackham/rex-strength-lab/blob/main/CLAUDE.md"}
BRIEF = {"title": "rex-strength-lab/BRIEF-presence.md in this repository (the worked examples being checked)", "url": "https://github.com/RoscoeRackham/rex-strength-lab/blob/main/rex-strength-lab/BRIEF-presence.md"}
DENSITY_JSON = {"title": "Existing key deep_rock_strength_assumption (rock strength 0.1–4.1 GPa, an estimate) in rex-strength-lab/research/final-density.json", "url": "https://github.com/RoscoeRackham/rex-strength-lab/blob/main/rex-strength-lab/research/final-density.json"}
HP_REC = {"title": "Harkrider & Press (1967) The Krakatoa air-sea waves: an example of pulse propagation in coupled systems, Geophys. J. R. astr. Soc. 13:149-159; Caltech Authors record with abstract", "url": "https://authors.library.caltech.edu/records/r42n3-t2639"}
HP_PDF = {"title": "Harkrider & Press (1967), full text PDF on the Caltech Authors record (p. 159)", "url": "https://authors.library.caltech.edu/records/r42n3-t2639/files/Geophys._J._Int.-1967-Harkrider-149-59.pdf"}
HP_DOI = {"title": "Harkrider & Press (1967), DOI record", "url": "https://doi.org/10.1111/j.1365-246X.1967.tb02150.x"}
LOB = {"title": "Lobanovsky (2013) Acoustic Methods for Evaluation of High Energy Explosions, arXiv:1311.6565 (preprint, not peer reviewed), Annex IV", "url": "https://arxiv.org/pdf/1311.6565"}
MORGAN = {"title": "Morgan, Bralower, Brugger & Wünnemann (2022) The Chicxulub impact and its environmental consequences, Nature Reviews Earth & Environment 3:338-354; accepted manuscript at NSF PAR", "url": "https://par.nsf.gov/servlets/purl/10349743"}
MORGAN_DOI = {"title": "Morgan et al. (2022), DOI record", "url": "https://doi.org/10.1038/s43017-022-00283-y"}
IAU = {"title": "Prša et al. (2016) Nominal values for selected solar and planetary quantities: IAU 2015 Resolution B2 and B3, arXiv:1510.07674 (PDF)", "url": "https://arxiv.org/pdf/1510.07674"}
RH = {"title": "Rienstra & Hirschberg, An Introduction to Acoustics (Eindhoven University of Technology lecture text, PDF version dated 6 Sep 2026)", "url": "https://www.win.tue.nl/~sjoerdr/papers/boek.pdf"}
USBM = {"title": "Siskind, Stachura, Stagg & Kopp (1980) Structure Response and Damage Produced by Airblast from Surface Mining, US Bureau of Mines Report of Investigations 8485 (copy hosted by the Resolution Copper Mine EIS)", "url": "https://www.resolutionmineeis.us/sites/default/files/references/siskind-et-al-1980.pdf"}
OSHA = {"title": "OSHA Technical Manual, Section IV Chapter 4: Industrial Robot Systems and Industrial Robot System Safety", "url": "https://www.osha.gov/otm/section-4-safety-hazards/chapter-4"}
BOH = {"title": "Bohannon (1997) Comfortable and maximum walking speed of adults aged 20-79 years: reference values and determinants, Age and Ageing 26:15-19 (abstract read through the Europe PMC API)", "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:9143432%20AND%20SRC:MED&resultType=core&format=json"}
BOH_PM = {"title": "Bohannon (1997), PubMed 9143432", "url": "https://pubmed.ncbi.nlm.nih.gov/9143432/"}
LIEU = {"title": "Lieu (2025) Ultrasound fundamentals and their clinical implications for interventional cytopathologists, Cytopathology (PMC12150002; full text read through the Europe PMC API)", "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC12150002/fullTextXML"}
MOYANO = {"title": "Moyano, Paraiso & González-Lezcano (2022) Possible Effects on Health of Ultrasound Exposure..., Healthcare 10:423, Table 3 (PMC8954895; full text read through the Europe PMC API)", "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC8954895/fullTextXML"}
NASA_NS = {"title": "NASA Glenn Research Center, Beginner's Guide to Aeronautics: Normal Shock Wave", "url": "https://www.grc.nasa.gov/www/k-12/airplane/normal.html"}
COLLINS = {"title": "Collins, Melosh & Marcus (2005) Earth Impact Effects Program, Eq. 59* (existing key blast_collins_peak_wind_speed): the same relation written for γ = 1.4", "url": "https://impact.ese.ic.ac.uk/static/effects.pdf"}
CF = {"title": "Courant & Friedrichs (1948) Supersonic Flow and Shock Waves, Interscience; scan at the Internet Archive (dli.ernet.177550), sections 158 and 162, pp. 416-428, Fig. 12", "url": "https://archive.org/download/dli.ernet.177550/177550-Supersonic%20Flow%20And%20Shock%20Waves.pdf"}
CF_OCR = {"title": "Courant & Friedrichs (1948), Internet Archive OCR text of the same scan (the quotes were read here; the scan PDF has no text layer)", "url": "https://archive.org/download/dli.ernet.177550/177550-Supersonic%20Flow%20And%20Shock%20Waves_djvu.txt"}
TAYLOR = {"title": "Taylor, G. I. (1946) The air wave surrounding an expanding sphere, Proc. R. Soc. A 186:273-292 (bibliographic record only; full text not readable)", "url": "https://doi.org/10.1098/rspa.1946.0044"}
BAKER = {"title": "Baker, Kulesz, Ricker, Bessey, Westine, Parr & Oldham (1977) Workbook for Predicting Pressure Wave and Fragment Effects of Exploding Propellant Tanks and Gas Storage Vessels, NASA CR-134906 (Southwest Research Institute)", "url": "https://ntrs.nasa.gov/api/citations/19760012208/downloads/19760012208.pdf"}
LP = {"title": "Lattimer & Prakash (2001) Neutron Star Structure and the Equation of State, ApJ 550:426; arXiv:astro-ph/0002232, section 6, eqs. (33)-(35)", "url": "https://arxiv.org/pdf/astro-ph/0002232"}
SCHW = {"title": "Existing key schwarzschild_radius (r_s = 2GM/c²; cites Wikipedia only)", "url": "https://en.wikipedia.org/wiki/Schwarzschild_radius"}
EDGAR = {"title": "Existing key bondi_radius_and_rate (Edgar 2004, arXiv:astro-ph/0406166)", "url": "https://arxiv.org/abs/astro-ph/0406166"}
TRACH = {"title": "Existing key collide_sound_speed_upper_bound (Trachenko et al. 2020, arXiv:2004.04818: about 36.1 km/s)", "url": "https://arxiv.org/abs/2004.04818"}

SCRIPTS = "Our scripts: growth_calc.py, taylor_sphere.py, piston_hydro.py, hydro_check.py (session scratchpad research/growth/scripts/); verifier's independent check_all.py, taylor_mine.py, gr_check.py, anchor_check.py (research/growth-check/scripts/)."

F = []


def fact(key, label, status, value_si, unit_si, display, sources, notes, who_when, low_si=None, high_si=None, values_json=None):
    f = {
        "key": key, "category": "presence_growth", "label": label, "status": status,
        "value_si": value_si, "unit_si": unit_si, "low_si": low_si, "high_si": high_si,
        "display": display, "sources": sources, "notes": notes, "who_when": who_when,
    }
    if values_json is not None:
        f["values_json"] = json.dumps(values_json, ensure_ascii=False)
    F.append(f)


# ---------- 1. Worked examples ----------
fact("growth_c_exact", "Speed of light in vacuum (exact by definition)", "verified", 299792458, "m/s",
     "299,792,458 m/s, exact (c² = 8.988 × 10¹⁶ m²/s²)", [NIST_C],
     "NIST page: \"Numerical value 299 792 458 m s-1\", \"Standard uncertainty (exact)\", \"Source: 2022 CODATA\". Exact because the metre is defined from it. The engine already uses K.c = 299792458. Mass added = E / c² = E / 8.987551787e16 kg per joule. Verifier: re-fetched, correct.",
     "CODATA 2022 (NIST)")

fact("growth_krakatoa_airwave_harkrider_press", "Krakatoa 1883: surface-burst explosion size that reproduces its air pressure wave", "verified",
     5.23e17, "J",
     "100–150 Mt of TNT (4.2–6.3 × 10¹⁷ J), as a nuclear surface-burst equivalent for the air wave only; as mass it adds 4.7–7.0 kg",
     [HP_REC, HP_PDF, HP_DOI],
     "Abstract (Caltech record): \"An explosion of 100–150 megatons is required to produce the equivalent of the Krakatoa pressure disturbance.\" Full text, p. 159: \"Using the scaling methods of Harkrider (1964) and data from nuclear explosions, we estimate that a surface explosion amounting to about 100-150 megatons would produce pressure pulses equivalent to those observed\". So this is a nuclear surface-burst yield equivalent for the air wave, not the eruption's total energy. Converted at 4.184e15 J per Mt (existing key energy_tnt_equivalent_per_tonne); value_si is the midpoint (125 Mt). A better primary source than the existing energy_krakatoa_1883 (status claimed: 200 Mt via Wikipedia and a popular book), which sits above this range. Verifier: added the p. 159 basis and the full-text URL; the earlier wording 'fitted to the barograph records' was too general.",
     "Harkrider & Press 1967", low_si=4.184e17, high_si=6.276e17)

fact("growth_krakatoa_energy_spread", "Krakatoa 1883: spread of published energy estimates", "disputed", None, "J",
     "Quoted estimates run from about 10¹⁷ J (24 Mt) to 6.3 × 10¹⁸ J (1.5 Gt); the compiler's own inferred extreme is about 5 × 10¹⁹ J (12 Gt). The popular 200 Mt (8.4 × 10¹⁷ J) is inside. As mass: 1–70 kg (about 560 kg at the extreme)",
     [LOB],
     "Lobanovsky, Annex IV: Wikipedia \"said that the explosion energy of volcano Krakatoa was, ostensibly, 200 Mt (0.2 Gt)\"; \"another encyclopedic resource argues that the energy explosion of Krakatoa was 1.5 Gt\"; a book published by the American Geological Society: \"estimated to be 10^24 erg [38], that is 10^17 joules, or 24 Mt\"; his own acoustic estimate \"Ee = 1.09 ± 0.05 Gt\". From Tambora estimates he infers 5–6 Gt, \"doubled up to 10-12 Gt\", and says extreme estimates \"differ by almost 500 times\". An unrefereed preprint by an outlier author: only the quoted spread is useful. As mass (E/c²): 1e17 J is 1.1 kg; 6.3e18 J is 70 kg (+2.3%); 12 Gt is 560 kg (+19%). Verifier: high end raised from 4.6e18 J (1.09 Gt) to the quoted 1.5 Gt, the 12 Gt extreme noted, and 'Institute' corrected to 'Society'.",
     "compiled by Lobanovsky 2013", low_si=1e17, high_si=6.276e18)

fact("growth_chicxulub_energy_morgan2022", "Chicxulub impact energy (2022 review)", "verified", 5e23, "J",
     "About 5 × 10²³ J, estimated from the 80–100 km transient crater; the abstract rounds this to \"about 10²³ joules\"",
     [MORGAN, MORGAN_DOI],
     "Main text: \"the apparent diameter of the transient crater ... is estimated to be between 80 km and 100 km ... and the impact energy is estimated to be about 5 × 10^23 J\"; \"For an asteroid speed of around 18 km s–1 and impact angles of between 45° and 60°, impactor diameters of around 12.2–14.4 km are required\". Abstract: \"an impact energy of about 10^23 joules\". These are one estimate quoted two ways, not a range: 10^23 is its order of magnitude. Check: rocky impactors of 12.2–14.4 km (about 2,600 kg/m³, our assumption) at 18 km/s carry about 4–7 × 10^23 J. The brief's 4.2 × 10^23 J (100 teratonnes of TNT) is within 20% of the review's figure. The existing energy_chicxulub_impact (disputed, via Wikipedia) could cite this review. Verifier: quotes confirmed; removed the '1e23–5e23 J range' (low_si dropped).",
     "Morgan et al. 2022")

fact("growth_sun_luminosity_check", "Nominal solar luminosity (check of the existing fact)", "verified", 3.828e26, "W",
     "3.828 × 10²⁶ W (IAU 2015 nominal); best estimate 3.8275 ± 0.0014 × 10²⁶ W", [IAU],
     "PDF: \"1 L N⊙ = 3.828 × 10^26 W\"; and \"Sun's mean radiative luminosity of L⊙ = 4π(1 au)² S⊙ = 3.8275 (± 0.0014) × 10^26 W\". Confirms the existing key energy_sun_luminosity unchanged; rely on it. One second of output, 3.828e26 J, is 4.259e9 kg as mass. Verifier: re-fetched, correct.",
     "IAU 2015 Resolution B3")

fact("growth_body_baseline", "Canon body used for growth: volume and equivalent ball radius", "derived", 2.8368, "m^3",
     "2.84 m³; a ball of that volume has a radius of 0.878 m (0.288 of his 3.048 m height)", [CANON],
     "V0 = 3,007 / 1,060 = 2.8368 m³. Equivalent radius R = (3V/4π)^(1/3) = 0.8782 m, the same convention as the engine's eqRadius(). R/H = 0.2881. Growth forms with mass ratio k = m/m0: volume V = V0·k^a with a = 1 (pure size), 1/2 (mix), 0 (pure density); height and R scale as k^(a/3), i.e. k^(1/3), k^(1/6) or 1; density = 1,060·k^(1−a). Verifier: reproduced.",
     "derived from canon")

fact("growth_worked_krakatoa", "Worked example: absorbing Krakatoa's energy as growth", "derived", 9.346, "kg",
     "About 9 kg at the brief's 8.4 × 10¹⁷ J (+0.3%): height +1.6 mm (mix) or +3.2 mm (pure size); 1,063 kg/m³ if pure density. Across the quoted estimates 1–70 kg; about 560 kg at the highest inferred one",
     [NIST_C, CANON, BRIEF, HP_REC, LOB],
     "Δm = E/c². E = 8.4e17 J (brief; existing claimed key energy_krakatoa_1883): Δm = 9.346 kg, k = 1.00311. Mix: H = 3.048·k^(1/6) = 3.0496 m, ρ = 1,061.6 kg/m³. Pure size: H = 3.0512 m. Pure density: 1,063.3 kg/m³. The Harkrider & Press 100–150 Mt air-wave equivalent gives 4.7–7.0 kg. Across the quoted spread (1e17 to 6.3e18 J): 1–70 kg, under 3% of his mass and at most 2.3 cm taller (pure size), so the brief's 'unnoticeable in any form' holds. At Lobanovsky's inferred 12 Gt extreme it is about 560 kg (+19% mass; pure size +18 cm, mix +9 cm): noticeable. low_si/high_si are the quoted spread. Verifier: the earlier '1–51 kg across the whole spread' was wrong; widened.",
     "derived", low_si=1.11, high_si=70,
     values_json={"8.4e17 J (brief)": {"dm_kg": 9.35, "k": 1.0031, "mix_H_m": 3.0496, "mix_rho": 1061.6, "size_H_m": 3.0512, "density_rho": 1063.3},
                  "4.18e17-6.28e17 J (Harkrider & Press)": {"dm_kg": "4.7-7.0"},
                  "1e17 J (lowest quoted)": {"dm_kg": 1.1},
                  "6.3e18 J (1.5 Gt, highest quoted)": {"dm_kg": 70, "mass_pct": 2.3, "size_dH_cm": 2.3, "mix_dH_cm": 1.2},
                  "5.0e19 J (12 Gt, Lobanovsky's inferred extreme)": {"dm_kg": 560, "mass_pct": 18.6, "size_dH_cm": 17.8, "mix_dH_cm": 8.8}})

fact("growth_worked_chicxulub", "Worked example: absorbing Chicxulub's energy as growth", "derived", 4673000, "kg",
     "4.2 × 10²³ J adds about 4,700 t (1,560 times his mass): mix 10 m tall at 42,000 kg/m³; pure size 35 m; pure density 1.6 × 10⁶ kg/m³. At the review's 5 × 10²³ J: 5,600 t; mix 11 m; pure size 37 m",
     [NIST_C, CANON, BRIEF, MORGAN],
     "E = 4.2e23 J: Δm = 4.673e6 kg, k = 1,555. Mix: H = 3.048·k^(1/6) = 10.38 m, ρ = 1,060·k^(1/2) = 41,800 kg/m³, R_eq = 2.99 m. Pure size: H = 35.3 m, R_eq = 10.2 m. Pure density: 1,060·k = 1.65e6 kg/m³, which is 1.6e6 to 2 figures; the brief's 1.7e6 is a rounding slip. At 5e23 J (Morgan 2022): Δm 5,560 t, mix 10.7 m and 45,600 kg/m³, pure size 37.4 m, pure density 2.0e6 kg/m³. The abstract's 'about 10^23 J' is the order of magnitude of the same estimate, not a lower bound; it would give 1,110 t, mix 8.2 m, pure size 22 m. low_si/high_si: the brief's 4.2e23 J and the review's 5e23 J. Verifier: reproduced (k 1,555.1); the 10^23 row relabelled.",
     "derived", low_si=4673000, high_si=5563000,
     values_json={"4.2e23 J (brief)": {"dm_t": 4673, "k": 1555, "mix_H_m": 10.4, "mix_rho": 41800, "size_H_m": 35.3, "density_rho": 1650000.0},
                  "5e23 J (Morgan 2022 estimate)": {"dm_t": 5563, "k": 1851, "mix_H_m": 10.7, "mix_rho": 45600, "size_H_m": 37.4, "density_rho": 1960000.0},
                  "1e23 J (abstract's order-of-magnitude rounding, not a lower bound)": {"dm_t": 1113, "k": 371, "mix_H_m": 8.17, "mix_rho": 20400, "size_H_m": 21.9, "density_rho": 393000.0}})

fact("growth_worked_sun_second", "Worked example: absorbing one second of the Sun's output as growth", "derived", 4259000000, "kg",
     "Adds 4.3 × 10⁶ t (1.4 × 10⁶ times his mass): mix 32 m tall at 1.3 × 10⁶ kg/m³; pure size 340 m; pure density 1.5 × 10⁹ kg/m³ (about half Sirius B's average density)",
     [NIST_C, CANON, BRIEF, IAU],
     "E = 3.828e26 J (IAU nominal luminosity × 1 s): Δm = 4.259e9 kg, k = 1.416e6. Mix: H = 32.3 m, ρ = 1.26e6 kg/m³, R_eq = 9.31 m. Pure size: H = 342 m, R_eq = 98.6 m. Pure density: 1.50e9 kg/m³. All brief figures check out. 'White-dwarf matter' is fair: the existing estimate density_white_dwarf_sirius_b_mean is 2.8e9 kg/m³, so this is about half Sirius B's average. Verifier: reproduced.",
     "derived",
     values_json={"dm_kg": 4259000000.0, "k": 1416000.0, "mix_H_m": 32.3, "mix_rho": 1260000.0, "size_H_m": 342, "density_rho": 1500000000.0})

fact("growth_brief_number_check", "Check of every growth number in the brief", "derived", None, "",
     "All correct to 2 figures except Chicxulub pure density: 1.6 × 10⁶ kg/m³, not 1.7 × 10⁶. Krakatoa's 8.4 × 10¹⁷ J is weakly sourced: 'unnoticeable' holds for every quoted estimate up to 1.5 Gt (70 kg), but not for the highest inferred one (12 Gt, 560 kg)",
     [BRIEF, NIST_C, CANON],
     "Recomputed with c exact, 3,007 kg, 1,060 kg/m³, 3.048 m. Krakatoa 9 kg OK. Chicxulub: 4,700 t OK; ×1,560 OK (1,555); mix ≈10 m OK (10.4); ≈42,000 OK (41,800); pure size ≈35 m OK (35.3); pure density 1.65e6, which is 1.6e6 to 2 figures (brief 1.7e6: wrong in the second figure). Sun: 4.3e6 t, ×1.4e6, mix 32 m, 1.3e6 (1.26e6), 340 m (342) and 1.5e9 all OK. Runaway: 'about 10^-15' for shoving the surroundings is right for pure size (1.06e-15 slow, 3–5e-15 instant); mix is 5e-16 for small growth, falling to 10^-17–10^-18 for big growth; pure density is 0. 'A real runaway needs their own gravity near black-hole density' is right; the loop reaches 1 only at the event horizon (growth_loop_gravity_gr). Scripts: research/growth/scripts/ (ours) and research/growth-check/scripts/ (verifier's) in the session scratchpad. Verifier: reproduced independently.",
     "derived")

# ---------- 2. Gradual growth ----------
fact("growth_monopole_compact_body", "Sound from a body whose volume changes (acoustic monopole)", "verified", None, "Pa",
     "p(r, t) = ρ₀ V̈(t − r/c₀) / (4πr), from R&H eq. 2.61: the pressure is set by the second time-derivative of the body's volume; steady expansion makes no sound in this approximation",
     [RH],
     "R&H p. 24, eq. (2.61): \"mass injection is a source of sound, primarily because of the displacement of a volume fraction β of the original fluid\". Section 6.2, p. 150 (pulsating sphere): \"If (∂a/∂t)/c0 ≪ 1, we can use linear acoustics\"; for a compact sphere \"the second derivative to time of the volume of the sphere is the source of sound. A steady expansion of the sphere (∂a/∂t = constant) does not (in this approximation) generate sound.\" For large radii the wall acts as \"a piston which generates plane waves.\" Curle's theorem (6.85, p. 170) extends this to any compact pulsating body. The explicit 4πr form is our standard step with the free-field Green's function (6.37). Valid when c0 × growth time ≫ body size and surface speed ≪ c0. Verifier: quotes confirmed; formula labelled 'from eq. 2.61'; a line-source check shows r = R_eq + d is mildly conservative for his tall shape.",
     "Rienstra & Hirschberg (TU Eindhoven), after Lighthill and Curle")

fact("growth_monopole_ground_doubling", "A volume source on the ground: pressure doubled", "verified", 2, "1",
     "Next to a rigid wall or ground a monopole's pressure is 2 times its free-field value: p = ρ₀ V̈ / (2πr)", [RH],
     "Rienstra & Hirschberg, exercises to chapter 6, p. 172 (PDF p. 181), item f: \"The acoustic pressure p′ generated by a monopole close to a wall increases by a factor 2 in comparison with free field conditions.\" Applied to Rex standing on the ground. Real ground is not perfectly rigid, so 2 is the conservative (upper) factor. Verifier: quote confirmed.",
     "Rienstra & Hirschberg")

fact("growth_slow_pressure_peak", "Gradual growth: peak air pressure at a bystander, and the shortest duration that keeps it harmless", "derived", None, "Pa",
     "p_peak = ρ₀ k_V ΔV / (2π r T²); for pure size with a smooth start and stop, p_peak = ρ₀ ΔV / (r T²), so T_min = √(ρ₀ ΔV / (r p_safe))",
     [RH],
     "Inputs: monopole on rigid ground, p = ρ0 V̈/(2πr) (growth_monopole_compact_body, growth_monopole_ground_doubling); ρ0 = 1.225 kg/m³ (atm_isa_sea_level_density). Profile (our choice): fraction of mass added s(t) = t/T − sin(2πt/T)/(2π), so the rate ∝ 1 − cos(2πt/T) starts and ends at zero. Pure size: k_V = max|V̈|·T²/ΔV = 2π exactly. Mix grows fastest early: k_V = 14.3 (k = 371), 17.9 (1,555), 54.7 (1.4e6). Pure density: no pulse. r = R_eq(final) + d. Valid while c0·T ≫ his height and surface speed ≪ 340 m/s. Longer than 0.05 s, the pulse is infrasound: felt, not heard. Ignores terrain and buildings. Verifier: k_V reproduced. The wind term is not always negligible: at the 100 Pa duration, displaced air blows about 3 m/s (½ρu² ≈ 6 Pa) for Chicxulub pure size and 5.4 m/s (18 Pa) for one solar second pure size; negligible at the longer shove-limited durations.",
     "derived")

fact("growth_airblast_usbm_ri8485", "Airblast levels that rattle houses but do no damage (US Bureau of Mines)", "verified", 100, "Pa",
     "Safe limit for houses: 134 dB on a 0.1 Hz high-pass meter (0.0145 psi, 100 Pa). Rattling complaints begin above about 120 dB on a 6 Hz meter, roughly 36 Pa unfiltered; some homes still rattle below the safe limit",
     [USBM],
     "Abstract: \"Safe levels of airblast were found to be 134 dBL (0.1 Hz), 133 dBL (2Hz), 129 dBL (6Hz), and 105 dB C-slow.\" Rattling \"will not entirely be precluded by the recommended levels\". p. 66: \"Levels exceeding 120 dB will produce some annoyance from rattling and fright, with as much as 5 to 10 pct of homes exhibiting such disturbances at the maximum level of 134 dBL (0.1-Hz high-pass).\" Text: \"complaints about rattling occur at airblast levels exceeding about 120 dB (6Hz)\". Table 13 (annoyance) lists 0.0145 psi beside 134 dBL. p = 20 µPa × 10^(L/20): 134 dB = 100 Pa. As 129 dB (6 Hz) matches 134 dBL (0.1 Hz), 120 dB (6 Hz) is about 125 dB unfiltered, 36 Pa (our conversion). The 2 s limit is stated for C-slow only. Verifier: rattle onset corrected from 20 Pa; it is on the 6 Hz basis, which a seconds-long pulse barely registers on.",
     "Siskind et al. 1980 (USBM RI 8485)", low_si=36, high_si=100,
     values_json={"134 dBL (0.1 Hz high-pass)": "safe maximum for houses; 0.0145 psi = 100 Pa (Table 13)",
                  "133 dBL (2 Hz)": "equivalent safe level",
                  "129 dBL (6 Hz)": "equivalent safe level",
                  "105 dB C-slow": "equivalent safe level, for events of 2 s or less (the duration limit is stated for this criterion only)",
                  "above about 120 dB (6 Hz)": "rattling complaints begin; about 125 dB, 36 Pa, on the 0.1 Hz basis (our conversion); not validated for slow pulses",
                  "at 134 dBL": "5-10% of homes rattle"})

fact("growth_contact_speed_osha", "A pushing speed borrowed from robot safety: slow enough for a person to avoid hazardous contact", "verified", 0.25, "m/s",
     "250 mm/s (10 in/s): the reduced robot speed described in OSHA's Technical Manual", [OSHA],
     "OSHA Technical Manual IV-4, section VIII.1: \"In this mode, the robot system operates at a reduced speed, slow enough for a person to avoid hazardous contact,\" ... \"but not greater than 10 inches/second (250mm/second)\". Section VI.4: \"robot speeds should be placed at a reduced speed of 10 inches per second (250 mm/second) or less\". The manual describes teach mode, where the person also holds an enabling (stop) device; it does not name the standard behind the figure (ANSI/RIA R15.06 and ISO 10218 are paywalled, not opened). Used as the speed his growing surface may push someone; walking pace is about 5 times faster, so they can step away. Someone pinned between him and a wall is crushed at any speed. Page label: 'borrowed from robot safety; not tested for this case'. Verifier: quotes confirmed; 'OSHA allows' reworded to 'the Technical Manual describes'.",
     "OSHA (US Dept of Labor), current web edition")

fact("growth_walking_speed_bohannon1997", "Comfortable walking speed of adults", "verified", 1.4, "m/s",
     "Comfortable 1.27–1.46 m/s (group means, ages 20–79); fastest 1.75–2.53 m/s", [BOH, BOH_PM],
     "Abstract: 230 healthy volunteers timed over 7.62 m. \"mean comfortable gait speed ranged from 127.2 cm/s for women in their seventies to 146.2 cm/s for men in their forties. Mean maximum gait speed ranged from 174.9 cm/s for women in their seventies to 253.3 cm/s for men in their twenties.\" value_si 1.4 m/s is our round middle value; low_si/high_si are the paper's group means. Used as a second, less cautious shove speed (being pushed at walking pace), and to show that at 0.25 m/s anyone can step away. Verifier: abstract re-fetched, correct.",
     "Bohannon 1997", low_si=1.272, high_si=1.462)

fact("growth_slow_tmin_shove", "Gradual growth: shortest duration so his surface never pushes faster than a safe speed", "derived", None, "s",
     "T_min = k_H ΔH / u_safe, with ΔH the growth in height (the top of his head moves fastest); k_H = 2 for small growth, about 1.9 for large pure-size growth, 2.6–7 for mix. Beside him, a point moves at (its distance from his soles ÷ height) × head speed: 0.29 for an equivalent ball (an assumption), perhaps 0.5–0.8 at tail, snout or arms",
     [OSHA],
     "Same profile s(t) as growth_slow_pressure_peak. Height H(t) = H0·(V(t)/V0)^(1/3); peak dH/dt = k_H·ΔH/T. k_H, found numerically: pure size 2.00 (k ≈ 1), 1.94 (k = 371), 1.93 (1,555), 1.88 (1.4e6); mix 2.57, 2.94, 7.22, since with V ∝ m^(1/2) height grows fastest early. k_V and k_H do not depend on T; compute once per form and mass ratio. Assumes his soles stay put and he grows up and out. The 0.29 side factor is the equivalent-ball radius ÷ height, not his shape: a same-volume column has a half-width of 0.18 H, while the tail tip, snout or outstretched arms may move outward at 0.5–0.8 of head speed at ground and hip level. Measure his largest reach from the soles on the turnarounds. " + "Verifier: k_H reproduced; the 0.29 side factor was unsupported for his real shape and is now labelled an assumption.",
     "derived")

fact("growth_slow_tmin_examples", "Gradual growth: shortest harmless durations for the worked examples", "derived", None, "s",
     "The shove sets the limit, not the air: Chicxulub about 1½ min (mix) or 4 min (pure size); one second of sunlight about 14 min (mix) or 43 min (pure size); Krakatoa a few hundredths of a second. Pure density has no air or shove limit",
     [USBM, OSHA, BOH],
     "Bystander 5 m from his final surface, on rigid ground; p_safe 100 Pa (USBM safe level) or 36 Pa (rattle onset on the 0.1 Hz basis); u_safe 0.25 m/s (OSHA TM) or 1.4 m/s (walking). Head speed unless marked side. At the shove-limited duration the air pulse is tiny: Chicxulub pure size at 250 s gives 100 Pa × (1.9/250)² ≈ 0.006 Pa. Side values use the equivalent-ball factor 0.29 (an assumption); at a reach factor of 0.8 the Chicxulub pure-size side figure would be about 200 s, still under the head limit, so the shortest safe duration does not change. The window (3.4 kPa) and eardrum (34.5 kPa) levels are fast-blast thresholds, not tested for smooth pulses lasting seconds. Pure density changes no volume; its hazards are the Weight tab's. Verifier: every entry reproduced; the 20 Pa column was replaced with 36 Pa and the side column flagged.",
     "derived",
     values_json={"columns": "T_pressure at 100 Pa / 36 Pa; T_shove at 0.25 m/s (head / side, equivalent-ball factor 0.29); T_shove at 1.4 m/s (head); all seconds",
                  "Krakatoa 8.4e17 J, mix": [0.003, 0.005, 0.013, 0.0036, 0.0023],
                  "Krakatoa 8.4e17 J, pure size": [0.0043, 0.0072, 0.025, 0.0073, 0.0045],
                  "Chicxulub 1e23 J, mix": [0.44, 0.74, 53, 15, 9.4],
                  "Chicxulub 1e23 J, pure size": [1.1, 1.8, 146, 42, 26],
                  "Chicxulub 4.2e23 J, mix": [0.69, 1.2, 86, 25, 15],
                  "Chicxulub 4.2e23 J, pure size": [1.9, 3.2, 250, 72, 44],
                  "Sun 1 s (3.8e26 J), mix": [5.0, 8.4, 850, 240, 150],
                  "Sun 1 s (3.8e26 J), pure size": [22, 37, 2600, 740, 460],
                  "any, pure density": "no volume change: no pressure pulse, no shove"})

# ---------- 3. Instant growth ----------
fact("growth_tissue_sound_speed", "Speed of sound in soft tissue", "verified", 1540, "m/s",
     "1,540 m/s (the soft-tissue value ultrasound scanners assume); muscle 1,585 m/s; fat 1,450–1,465 m/s", [LIEU, MOYANO],
     "Lieu 2025: \"sound travels about 330 m/s through air, 1540 m/s through human soft tissue and 4500 m/s through bone\"; \"Ultrasound machines assume that sound transmitted in the human body travels 1540 m/s through soft tissue\". Moyano 2022 Table 3, \"Speed of sound in different substances or organs\": human soft tissue 1540; muscle 1585; fat 1450/1465; blood 1570/1584; cortical bone 3635. Both are peer-reviewed reviews, not the IEC/ICRU originals behind the 1,540 convention (paywalled, not fetched). Canon does not say what Rex is made of inside; a muscular body at 1,060 kg/m³ sits between soft tissue and muscle, so 1,540 is used (muscle would shorten the time by 3%). Verifier: both full texts re-fetched; quotes and table confirmed.",
     "Lieu 2025; Moyano et al. 2022", low_si=1450, high_si=1585)

fact("growth_instant_timescale", "Instant growth: the time it takes (sound crossing his final body)", "estimate", 0.0229, "s",
     "t = final height ÷ 1,540 m/s: 2 ms (Krakatoa), 7 ms (Chicxulub, mix), 23 ms (Chicxulub, pure size), 0.22 s (one solar second, pure size)",
     [LIEU],
     "Our choice, per the brief's suggestion. Reason: no part of a body can respond before a stress wave reaches it, and the far end of the final body is H_final away. Then the top of his head moves at ΔH/t = 1,540·(1 − H0/H1) m/s, up to 1,540 m/s (Mach 4.5 in air); his sides (equivalent-ball radius) at 0.288 of that, at most 444 m/s (Mach 1.3). Side speeds: Krakatoa 0.46 m/s; Chicxulub mix 313 m/s (Mach 0.92); Chicxulub pure size 405 m/s (1.19); Sun-second mix 402 m/s (1.18); Sun-second pure size 440 m/s (1.29). So big instant growth is supersonic and drives a shock. Speeds are constant through the growth (sudden start and stop). value_si is Chicxulub pure size. Verifier: all times and speeds reproduced; correctly an estimate.",
     "estimate (our choice)", low_si=0.00198, high_si=0.222,
     values_json={"Krakatoa 8.4e17, pure size": {"t_ms": 2.0, "head_m_s": 1.6, "side_m_s": 0.46},
                  "Chicxulub 4.2e23, mix": {"t_ms": 6.7, "head_m_s": 1090, "side_m_s": 313, "side_Mach": 0.92},
                  "Chicxulub 4.2e23, pure size": {"t_ms": 22.9, "head_m_s": 1410, "side_m_s": 405, "side_Mach": 1.19},
                  "Sun 1 s, mix": {"t_ms": 21, "head_m_s": 1395, "side_m_s": 402, "side_Mach": 1.18},
                  "Sun 1 s, pure size": {"t_ms": 222, "head_m_s": 1530, "side_m_s": 440, "side_Mach": 1.29}})

fact("growth_normal_shock_nasa", "Normal-shock pressure and density jumps (Rankine–Hugoniot)", "verified", None, "1",
     "p₂/p₁ = [2γM² − (γ − 1)]/(γ + 1);  ρ₂/ρ₁ = (γ + 1)M²/[(γ − 1)M² + 2]", [NASA_NS],
     "NASA page: \"p1 / p0 = [2* gam * M^2 - (gam - 1)] / (gam + 1)\" and \"r1 / r0 = [(gam + 1) * M^2 ] / [(gam -1 ) * M^2 + 2]\" (M = upstream Mach number in the shock frame). γ = 1.4 (existing atm_ratio_specific_heats_air). Verifier: equations confirmed verbatim.",
     "NASA GRC")

fact("growth_piston_shock_planar", "Air pressure in front of a flat surface pushed suddenly at speed u (piston shock)", "derived", None, "Pa",
     "Δp = p₀·(2γ/(γ+1))·(M² − 1), M = (γ+1)u/(4c₀) + √[((γ+1)u/(4c₀))² + 1]. Slow: Δp ≈ ρ₀c₀u. Fast: Δp ≈ 1.2 ρ₀u². At 405 m/s: 330 kPa",
     [NASA_NS, COLLINS],
     "From the normal-shock relations: gas behind a shock moving at M·c0 into still air moves at u = (2c0/(γ+1))(M − 1/M); invert for M and use the pressure jump. Weak limit (u ≪ c0): Δp → ρ0 c0 u (the acoustic piston). Strong limit: Δp → ((γ+1)/2) ρ0 u² = 1.2 ρ0 u². For γ = 1.4 this is algebraically identical to the existing verified Collins/Glasstone wind relation u = (5p/7P0)c0/√(1 + 6p/7P0). Table (ISA air): u = 10 m/s gives 4.2 kPa; 100 gives 50 kPa; 340 gives 250 kPa; 405 gives 330 kPa; 1,000 gives 1.58 MPa; 1,540 gives 3.6 MPa. Use: the pressure on a large body's surface just after it suddenly starts moving (R&H: a large, fast sphere acts as a plane piston), and an upper bound afterwards, since a sphere lets air escape sideways. Verifier: inversion, table and the Collins identity reproduced; dropped a reference to a 'strong-shock form' that the brief does not contain.",
     "derived",
     values_json={"u_m_s": [1, 10, 100, 340.3, 405, 1000, 1540], "shock_Mach": [1.002, 1.018, 1.192, 1.766, 1.943, 3.79, 5.61], "dp_kPa": [0.42, 4.2, 50, 250, 330, 1580, 3600]})

fact("growth_taylor1946_courant_friedrichs", "Taylor's expanding sphere (1946), as described by Courant & Friedrichs", "verified", None, "",
     "A sphere expanding at constant speed drives a constant-speed shock; the air behind it keeps compressing up to the surface; the shock is much weaker than a flat piston's at the same speed",
     [CF, CF_OCR, TAYLOR],
     "C&F p. 417: \"an energy supply at an increasing rate is required to maintain constant speed of the piston.\" Section 162, p. 427: \"the shock speed Ξ can be determined as function of the prescribed velocity ξ0 of the surface of the sphere. The solution of the problem, first worked out by G. I. Taylor, is thus established\"; the gas \"suffers a further compression\" behind the shock. p. 428: Taylor found sound theory gave \"too high a value\" for the pressure near the sphere at 0.2c0. Fig. 12 plots sphere and gas speed against shock speed Ξ: ξ0 = c0 at Ξ ≈ 1.3 c0, 2c0 at Ξ ≈ 2.2 c0. Taylor's paper and tables were not readable. Verifier: quotes confirmed in the OCR text (source added); Crossref confirms Taylor 1946. Digitising Fig. 12: printed ξ0 reads 0.04–0.06 c0 above an exact solution, the gas-speed curve 0.01–0.02 above exact Rankine–Hugoniot, so the real gap is about 0.03–0.04 c0.",
     "Taylor 1946 via Courant & Friedrichs 1948")

fact("growth_taylor_sphere_surface_pressure", "Surface pressure on a sphere expanding at constant speed (our solution of Taylor's problem)", "derived", None, "Pa",
     "Δp at the surface ≈ ρ₀u², within 2% from 0.8 to 9 times the speed of sound; 1.15 ρ₀u² at 0.3 c₀, rising toward 1.5 ρ₀u² for slow growth. At u = c₀: 1.4 atm, against 2.5 atm for a flat piston. Holds only when his final size is much larger than his starting size",
     [CF, NASA_NS],
     "Self-similar isentropic flow behind a constant-speed shock, integrated from the Rankine–Hugoniot state in to the sphere surface. Checked with a 1-D spherical Lagrangian hydro code: u = c0 gives shock 1.328 c0 and Δp 1.41 p0 (similarity 1.329, 1.417); 2c0 gives 2.263 c0, 5.60 p0 (2.264, 5.66). Δp/(ρ0u²): 1.08 (0.45 c0), 1.04 (0.6), 1.02 (0.8), 1.01 (1.0), 1.00 (1.5 and above); 1.15–1.16 at 0.3 c0 (hydro code). Our sphere-speed curve lies 0.04–0.05 c0 below the printed Fig. 12. Verifier: reproduced with an independent RK4 solver within 1%. The shock-fitted solution cannot go below about 0.31 c0; as u → 0 the factor tends to the incompressible 1.5 (verifier's derivation, not sourced). The solution starts from zero size, so it applies only when R_final ≫ R0 (growth much longer than R0/c0 = 2.6 ms); otherwise use the flat-piston onset ρ0c0u (growth_piston_shock_planar). Ideal gas, γ = 1.4.",
     "derived (this research, 2026)",
     values_json={"u_over_c0": [0.3, 0.45, 0.6, 0.8, 0.98, 1.22, 1.45, 1.95, 2.73, 3.7, 5.61, 9.4],
                  "shock_Mach": [None, 1.005, 1.05, 1.17, 1.31, 1.52, 1.73, 2.21, 3.0, 4.0, 6.0, 10.0],
                  "surface_dp_over_p0": [0.146, 0.307, 0.522, 0.914, 1.36, 2.1, 2.95, 5.33, 10.4, 19.1, 44.0, 124],
                  "flat_piston_dp_over_p0": [0.5, 0.82, 1.19, 1.78, 2.4, 3.37, 4.45, 7.4, 13.6, 24.1, 54.0, 150],
                  "surface_factor_k = dp/(rho0 u^2)": {"0.3": 1.16, "0.45": 1.08, "0.6": 1.04, "0.8": 1.02, "1.0": 1.01, ">=1.5": 1.0, "u -> 0 (incompressible limit, verifier)": 1.5}})

fact("growth_vessel_burst_he_equivalence", "A pressure-driven blast is no worse, far out, than high explosive of the same energy", "verified", 2, "1",
     "Beyond a Sachs-scaled distance R̄ = R·(p_a/E)^(1/3) of about 2, the high-explosive (pentolite) curve for the same energy is an upper limit for a gas-vessel burst",
     [BAKER],
     "Baker et al. 1977, p. 58 (PDF p. 71): \"For R greater than about 2, Figure 2-19, Ps versus R for pentolite (a high explosive) can be used as an upper limit for Ps.\" Appendix 2A (PDF p. 82): R̄ = r·p_a^(1/3)/E^(1/3) (eq. 2A-3). PDF p. 86, for impulse: \"For R greater than about 0.5, all of the curves lie within about 25% of the high explosive (pentolite) curve.\" Their burst curves came from a 1-D spherical Lagrangian finite-difference code with artificial viscosity, the method we used to check growth_taylor_sphere_surface_pressure. Use: convert the energy his growth pushes into the air to a TNT mass (energy_tnt_equivalent_per_tonne) and feed the engine's Kinney–Graham curve as an upper limit beyond R̄ ≈ 2; nearer, use the surface pressure. Verifier: confirmed.",
     "Baker et al. 1977 (NASA CR-134906)")

fact("growth_ground_reflection_2E", "Blast source on the ground: double the energy for free-air curves", "verified", 2, "1",
     "On perfectly rigid ground the equivalent free-air energy is 2E; on a perfect absorber, E", [BAKER],
     "Baker et al. 1977, section 1-1.2, pp. 8-9 (PDF p. 21): \"If the ground were a perfectly rigid surface, then the equivalent free-air energy driving the air blast wave would be E' = 2E. The other extreme case is that of a perfect absorber, for which E' = E. All actual tests will have equivalent free-air energies lying between these limits.\" Section 2A.6 (PDF p. 86): for a vessel burst on the ground \"assume that twice as much energy is released\". Fills the gap noted in blast_kinney_graham_peak_overpressure (surface-burst reflection factor not verified). His growth happens above the ground, so the factor 2 applies in full on hard ground. Verifier: confirmed.",
     "Baker et al. 1977", low_si=1, high_si=2)

fact("growth_instant_blast_examples", "Instant growth: the blast from shoving the air aside", "estimate", 893000000, "J",
     "Chicxulub, pure size: 2–3 atm at his sides and 0.9–1.5 × 10⁹ J into the air (210–350 kg of TNT) if he grew about his centre; windows shatter out to 100–220 m. Anchored at his soles, the top of his head pushes about 24–30 atm and the total is 2–4 times larger (up to 6 × 10⁹ J, 1.5 t of TNT; windows to about 360 m). Mix: 3–6 kg of TNT, windows to 25–57 m (up to about 90 m anchored)",
     [BAKER, CF],
     "Ball model: equivalent ball growing about its centre at side speed u = ΔR/t (growth_instant_timescale). Surface Δp between Taylor's sphere value ≈ ρ0u² and the flat piston (upper bound). Energy into the air beyond the quasi-static push: E_x ≈ Δp·ΔV; p0·ΔV only pushes the atmosphere back. TNT W = E_x/4.184e6 J/kg, doubled on hard ground (growth_ground_reflection_2E), then Kinney–Graham, an upper limit beyond R̄ ≈ 2. Windows: the 3.4–6.9 kPa band (blast_window_breakage). Zero duration needs infinite energy (Δp ∝ u²). Verifier: arithmetic reproduced; reach widened from the 6.9 kPa end alone. With soles fixed, upward surfaces sweep 1/3 of added volume at up to the head speed (Mach 4), so E_x is 2× (ball on its base) to 4.3× (same-volume column) the ball value and reach 1.3–1.6× farther; 'the head sweeps little volume' was false. Ignores momentum and ground load (growth_ground_push_estimate).",
     "estimate (this research)", low_si=893000000, high_si=6.2e9,
     values_json={"Krakatoa 8.4e17 J, pure size": {"surface_dp_kPa": "≤ 0.19 (≈ ρ0 c0 u)", "E_x_J": "< 2", "p0_dV_J": 890, "note": "a thump, no blast"},
                  "Chicxulub 4.2e23 J, mix (ball)": {"surface_dp_kPa": "120-220", "E_x_J": "1.3e7-2.4e7", "TNT_kg": "3.2-5.8", "W_free_kg": "6.4-12", "windows_6.9kPa_m": "25-30", "windows_3.4kPa_m": "46-57"},
                  "Chicxulub 4.2e23 J, mix (anchored at soles, x2 to x4.3)": {"E_x_J": "2.7e7-1.0e8", "TNT_kg": "6.4-25", "windows_m": "31-92"},
                  "Chicxulub 1e23 J, pure size (ball)": {"surface_dp_kPa": "180-300", "E_x_J": "1.9e8-3.1e8", "TNT_kg": "45-75", "W_free_kg": "90-150", "windows_6.9kPa_m": "60-72", "windows_3.4kPa_m": "110-130"},
                  "Chicxulub 4.2e23 J, pure size (ball)": {"surface_dp_kPa": "200-330", "E_x_J": "8.9e8-1.45e9", "TNT_kg": "210-350", "W_free_kg": "430-690", "windows_6.9kPa_m": "100-120", "windows_3.4kPa_m": "190-220"},
                  "Chicxulub 4.2e23 J, pure size (anchored at soles, x2 to x4.3)": {"head_dp_MPa": "2.4-3.0", "E_x_J": "1.8e9-6.2e9", "TNT_kg": "430-1500", "W_free_kg": "850-3000", "windows_6.9kPa_m": "130-190", "windows_3.4kPa_m": "240-360"},
                  "Sun 1 s, mix (ball)": {"surface_dp_kPa": "200-320", "E_x_J": "6.7e8-1.1e9", "TNT_kg": "160-260", "W_free_kg": "320-520", "windows_6.9kPa_m": "90-110", "windows_3.4kPa_m": "170-200"},
                  "Sun 1 s, pure size (ball)": {"surface_dp_kPa": "240-370", "E_x_J": "9.6e11-1.5e12", "TNT_t": "230-360", "W_free_t": "460-720", "windows_6.9kPa_m": "1000-1200", "windows_3.4kPa_m": "1900-2200"},
                  "Sun 1 s, pure size (anchored at soles, x2 to x4.3)": {"E_x_J": "1.9e12-6.4e12", "TNT_t": "460-1500", "windows_m": "1300-3600"},
                  "any, pure density": "no volume change, no air blast"})

fact("growth_ground_push_estimate", "Ground: pushed aside, and loaded by lifting his centre of mass", "estimate", 4.3e-11, "1",
     "Anchored at the soles, nothing is pushed aside, but instant growth still loads the ground with the force that lifts his centre of mass: GPa-level for Chicxulub-sized growth, more than rock can bear. Growing about his middle instead, the work on the ground is at most about 4 × 10⁻¹¹ of the absorbed energy (pure size)",
     [DENSITY_JSON],
     "Pushing ground of strength q aside by V_g takes W ≈ q·V_g. Centred pure-size growth: W/E ≤ q/(ρ_body c²) = 4.1e9/(1,060 × 8.99e16) = 4.3e-11 (strongest rock; instant, dynamic: 3.4e-11). Negligible for the loop. Verifier: soles fixed avoids pushing ground aside, not loading it. For instant Chicxulub pure size the centre of mass rises at about 700 m/s (momentum 3.3e9 kg·m/s); the ground force at the end is about 3.9e11 N on about 83 m² of grown soles (0.31 m² per paw, rex_ollie_picture_build, scaled with height²): 4.7 GPa, above any rock strength in the data, about twice that under Ollie's 0.15 m² boots. Unless held down he is thrown about 25 km up (no drag). Anchoring at the centre of mass instead drives his feet ΔH/2 into the ground at 700 m/s. Gradual growth lifts off unless T ≥ about √(πΔH/g): 3 s (Chicxulub) or 10 s (Sun-second), pure size; never binding beside the shove limit.",
     "estimate")

# ---------- 4. Runaway loop ----------
fact("growth_loop_air_ratio", "Runaway loop, surroundings: energy pushed into the air per energy absorbed", "derived", 1.06e-15, "1",
     "Pure size: 1 × 10⁻¹⁵ slow, 3–5 × 10⁻¹⁵ instant. Mix: about 5 × 10⁻¹⁶ for small growth, falling to 10⁻¹⁷–10⁻¹⁸ for large growth. Pure density: 0. Pushing rock aside: below 10⁻¹⁰",
     [TRACH],
     "Ratio = (p0 + Δp_s)·ΔV/(Δm c²). Pure size: ΔV = Δm/ρ_body, so 101,325/(1,060 × 8.99e16) = 1.06e-15 slow; 3–5e-15 instant. Mix: ΔV/Δm = 1/(ρ_body(√k + 1)): 5.3e-16 for small growth; Chicxulub 2.6e-17 slow, 5.8–8.4e-17 instant; Sun-second 9e-19 slow, 2.6–3.8e-18 instant. Pure density: 0. Ordinary matter: pushing it aside costs at most its stiffness ρ_m c_s², with c_s ≤ 36.1 km/s, so the ratio is at most (ρ_m/ρ_body)(36.1 km/s ÷ c)²: 1.5e-8 for matter as dense as he is, 4e-8 for rock (2,700 kg/m³). Whether 1/(1 − ratio) applies is a canon question for the owners: if the shove is paid from the absorbed energy, re-absorbing it only returns what was spent; if from the endless store, it adds a factor 1 + 10^-15. Verifier: reproduced; added the mix small-growth value and the rock-density bound.",
     "derived", low_si=0, high_si=5e-15,
     values_json={"Krakatoa, pure size": {"slow": 1.06e-15, "instant": 1.06e-15},
                  "mix, small growth": {"slow": 5.3e-16},
                  "Chicxulub 4.2e23, mix": {"slow": 2.6e-17, "instant": "5.8e-17 to 8.4e-17"},
                  "Chicxulub 4.2e23, pure size": {"slow": 1.06e-15, "instant": "3.2e-15 to 4.5e-15"},
                  "Sun 1 s, mix": {"slow": 8.9e-19, "instant": "2.6e-18 to 3.8e-18"},
                  "Sun 1 s, pure size": {"slow": 1.06e-15, "instant": "3.6e-15 to 5.0e-15"},
                  "pure density": 0, "rock, upper bound": 4.3e-11,
                  "ordinary matter as dense as him, bound": 1.5e-08, "rock-density matter, bound": 3.7e-08})

fact("growth_binding_energy_uniform_sphere", "Gravitational binding energy of a uniform ball (Newtonian and general-relativistic)", "verified", None, "J",
     "Newtonian: 3GM²/(5R). Exact for a uniform ball in general relativity: BE/M = (3/4β)[sin⁻¹√(2β)/√(2β) − √(1 − 2β)] − 1 ≈ 3β/5 + 9β²/14 + …, with β = GM/(Rc²)",
     [LP],
     "Lattimer & Prakash section 6: \"The binding energy formally represents the energy gained by assembling N baryons ... BE = N m_b − M in mass units.\" \"In the cases of the incompressible fluid and the Buchdahl solution, analytic results for the binding energy can be found\", eq. (34): BE_Inc/M = (3/4β)[sin⁻¹√(2β)/√(2β) − √(1 − 2β)] − 1 ≈ 3β/5 + 9β²/14 + 5β³/6 + ···, with β ≡ GM/Rc². The leading term 3β/5 × Mc² is the Newtonian 3GM²/(5R); the series at β = 0.01 gives 0.0060651. A primary citation for the 3/5 formula that energy_earth_gravitational_binding takes from Wikipedia. For Rex at canon: 3GM²/(5R) = 4.1e-4 J; β = 2.5e-24. Verifier: eq. (34) confirmed, and independently checked that it equals the proper-mass integral for uniform density, so the M_p = M(1 + g) use is correct.",
     "Lattimer & Prakash 2001")

fact("growth_binding_energy_fit_lp2001", "Binding energy of real neutron stars (fit)", "verified", None, "1",
     "BE/M ≈ 0.6β/(1 − 0.5β)", [LP],
     "Eq. (33): \"Here, we propose a more accurate representation of the binding energy: BE/M ≃ 0.6β/(1 − 0.5β)\". Fitted to neutron-star models with realistic equations of state; the older Lattimer & Yahil form \"BE ≈ 1.5·10^51 (M/M⊙)² ergs\" is \"accurate at best to about ±20%\". Context only: real compact stars release 10–20% of their mass as binding energy, the regime where the gravitational loop stops being negligible. Verifier: confirmed.",
     "Lattimer & Prakash 2001")

fact("growth_loop_gravity_newtonian", "Runaway loop, own gravity (Newtonian): binding energy released per energy absorbed", "derived", 3.05e-24, "1",
     "d(3GM²/5R)/d(Mc²) = 0.6 r_s/R (pure density), 0.55 r_s/R (mix), 0.5 r_s/R (pure size). It would reach 1 only at R = 0.6, 0.55 or 0.5 r_s: inside the event horizon. At canon it is about 3 × 10⁻²⁴",
     [LP, SCHW, NIST_G],
     "U = 3GM²/(5R) with R ∝ M^α (α = 0 pure density, 1/6 mix, 1/3 pure size). U ∝ M^(2−α), so dU/dM = (2−α)(3/5)GM/R; divide by c² and use r_s = 2GM/c²: ratio = (3/10)(2−α)·r_s/R. At R = r_s it is only 0.6, 0.55 or 0.5; at Buchdahl's 9/8 r_s (buchdahl_bound) 0.53, 0.49, 0.44. At canon (β = 2.54e-24): 3.05e-24, 2.79e-24, 2.54e-24. After a Chicxulub in pure density: about 5e-21; after a Sun-second in pure density (white-dwarf matter): 4.3e-18. Newtonian gravity fails near r_s; see growth_loop_gravity_gr. r_s = 2GM/c² is textbook; the existing key cites Wikipedia only. Verifier: reproduced.",
     "derived")

fact("growth_loop_gravity_gr", "Runaway loop, own gravity (general relativity, uniform ball): reaches 1 exactly at the event horizon", "derived", None, "1",
     "Share of each absorbed joule released again by deeper binding: 1% at R = 50 r_s, 12% at 5 r_s, 73% at Buchdahl's limit (1.125 r_s), and 1 only as R → r_s",
     [LP],
     "Rest (proper) mass M_p = M(1 + g(β)), g from Lattimer & Prakash eq. (34). Adding rest mass dM_p raises the gravitational mass by dM; the rest is released: f = 1 − dM/dM_p, with dM_p/dM = 1 + g + (1−α)βg′(β). g′ diverges only as β → 1/2 (R → r_s), through the √(1 − 2β) term, so f → 1 exactly at the horizon for every growth form. Small β matches the Newtonian 1.2β, 1.1β, β. Caveat: a static uniform perfect fluid cannot exist beyond β = 4/9; an indestructible body with arbitrary stresses can go further (buchdahl_bound). Seen from outside, absorbing E always raises his gravitational mass by exactly E/c²; the loop only turns released binding energy into more rest mass. This rest-mass reading is our own reasoning, not sourced. Verifier: whole table reproduced (e.g. β = 4/9: 0.728, 0.701, 0.667).",
     "derived",
     values_json={"beta": [0.01, 0.1, 0.2, 0.3, 0.4444, 0.49, 0.499, 0.4999], "R_over_rs": [50, 5, 2.5, 1.667, 1.125, 1.02, 1.002, 1.0002],
                  "f_density": [0.012, 0.125, 0.264, 0.423, 0.728, 0.896, 0.969, 0.99], "f_mix": [0.011, 0.116, 0.245, 0.396, 0.701, 0.88, 0.964, 0.989],
                  "f_size": [0.01, 0.106, 0.225, 0.368, 0.667, 0.859, 0.955, 0.986], "BE_over_M": [0.0061, 0.067, 0.155, 0.279, 0.641, 0.993, 1.229, 1.314]})

fact("growth_black_hole_thresholds", "How much absorbed energy would make him a black hole, for each growth form", "derived", 5.31e43, "J",
     "Pure density: 5.9 × 10²⁶ kg at 2.1 × 10²⁶ kg/m³, needing 5.3 × 10⁴³ J (the Sun's output for 4.4 billion years). Mix: 2.7 × 10³¹ kg (14 Suns), 139 km tall. Pure size: 1.3 × 10⁸ Suns, 2.6 au in radius. Horizon taken at his equivalent-ball radius (the engine's convention)",
     [NIST_C, NIST_G, CANON, SCHW],
     "Horizon when r_s = 2GM/c² equals the equivalent-ball radius R (the engine's convention; a 3 m tall body would plausibly need more mass to sit inside its own horizon, by hoop-conjecture reasoning, not verified). Pure density (R = 0.8782 m): M = Rc²/(2G) = 5.91e26 kg, ρ = 2.08e26 kg/m³; energy (M − m0)c² = 5.31e43 J = 1.39e17 s of solar output = 4.4e9 years. Mix: R = R0(M/m0)^(1/6) = 2GM/c² gives M = 2.69e31 kg, R = 40 km, H = 139 km, ρ = 1.0e17 kg/m³; E = 2.4e48 J (2e14 years of sunlight). Pure size at 1,060 kg/m³: M = √(3c⁶/(32πG³ρ)) = 2.62e38 kg (1.3e8 solar masses), R = 3.9e11 m. The existing estimate density_black_hole_rex_2m (2.24e26 kg/m³, 5.7e26 kg) uses the old 2.54 m³ volume; with the canon 2.84 m³ it is 2.08e26 kg/m³ and 5.9e26 kg. Verifier: reproduced; convention label added.",
     "derived")

fact("growth_bondi_infall_loop", "Runaway loop, air falling onto a dense body", "derived", None, "1",
     "Each kilogram of infalling air releases GM/R = (r_s/2R)c² (Newtonian; 1 − √(1 − r_s/R) of c² in relativity): below 1 outside the horizon. Infall only starts when the Bondi radius exceeds his size, at about 5 × 10¹⁴ kg/m³, and is capped by the atmosphere's mass",
     [EDGAR, LP],
     "Engine: heatPerKg = GM/R; Bondi rate Ṁ = 4πλG²M²ρ/c_s³ with λ = 0.625, only when r_B = GM/c_s² > R. Turning infall energy into mass gives dM/dt = Ṁ·β. Onset for R = 0.878 m: M = R c_s²/G = 1.5e15 kg (5.4e14 kg/m³); there Ṁ = 2.5e3 kg/s, infall power 2.9e8 W, mass growth from it 3e-9 kg/s, e-folding time 5e23 s: negligible. Near the horizon (pure density, half the black-hole mass) Ṁ ≈ 1e26 kg/s would take the whole atmosphere (5.1e18 kg, atm_total_mass) in about 5e-8 s, so the total infall energy is capped at M_atm·βc² ≤ 2.3e35 J. The relativistic factor 1 − √(1 − 2β) is the standard redshifted energy release for matter at rest on a static surface, not separately sourced. Verifier: reproduced; cap tightened from '< 5e35 J'.",
     "derived")

fact("growth_runaway_verdict", "Can the growth loop run away outside a black hole?", "derived", None, "",
     "No. Shoving the air returns about 10⁻¹⁵ of the energy (less for mix, none for pure density); pushing rock aside at most about 4 × 10⁻¹¹; any ordinary matter at most a few × 10⁻⁸. Their own gravity returns a share that reaches 1 only at the event horizon, so the half-life only matters once he is already a black hole. This covers energy feedback only, not the momentum of instant growth",
     [LP],
     "Summary of growth_loop_air_ratio, growth_ground_push_estimate, growth_loop_gravity_newtonian, growth_loop_gravity_gr and growth_bondi_infall_loop. With a constant ratio f < 1 the loop is a geometric series, total = E/(1 − f): 1 + 10^-15 for any everyday case, if the loop applies at all (an open canon question, growth_loop_air_ratio). The gravitational ratio is 1 or more only when R ≤ r_s (relativistic) or R ≤ 0.5–0.6 r_s (Newtonian), i.e. after the Weight tab has already declared a black hole. Seen from outside, his gravitational mass rises by exactly E/c²; the loop can only add rest mass bound ever more tightly. Verifier: supported by the checked component facts; the verdict is about energy feedback only and does not cover the momentum and ground load of instant growth (growth_ground_push_estimate). Matter bound restated for rock-density matter.",
     "derived")

GAPS = (
    "Not read, or only partly verified: (1) Taylor (1946) itself: publisher page behind a bot check, no PubMed abstract. Its content comes from Courant & Friedrichs (OCR text and Fig. 12) plus our own similarity solution, checked with a hydro code; the printed sphere-speed curve sits about 0.03–0.05 c0 above our solution, and Taylor's tables were not seen. Page: 'Taylor's result as reproduced by Courant & Friedrichs; surface pressures from our own calculation.' "
    "(2) Kinsler et al. and Pierce not opened (Springer blocked); the monopole formula rests on Rienstra & Hirschberg eq. 2.61. "
    "(3) 250 mm/s: ANSI/RIA R15.06 and ISO 10218 are paywalled; the value comes from the OSHA Technical Manual's teach-mode description, where the person also holds a stop device. No source gives a harmless speed for a person pushed by a massive moving surface. Page: 'borrowed from robot safety; not tested for this case.' "
    "(4) 1,540 m/s in soft tissue: review-level PMC sources; IEC/ICRU originals not fetched. Canon does not say what Rex is made of inside. "
    "(5) Krakatoa's total energy: no primary source. Only Harkrider & Press's air-wave equivalent (100–150 Mt) is primary. Quoted estimates run 1e17–6.3e18 J (1–70 kg); one preprint infers up to 12 Gt (560 kg). Page: 'estimates differ a lot'. "
    "(6) Long, smooth pressure pulses: no threshold found for pulses lasting seconds. USBM's levels are for blast pulses; its 120 dB rattle onset is on a 6 Hz meter (about 36 Pa unfiltered, our conversion) and does not transfer to slow pulses. The 3.4 kPa window and 34.5 kPa eardrum presets are fast-blast thresholds, not tested for smooth pulses. "
    "(7) Energy-to-TNT equivalence for a piston-driven blast is sourced only as an upper limit beyond R̄ ≈ 2 (Baker 1977, gas-vessel bursts); nearer, the surface pressure is used. "
    "(8) Relativistic loop: uniform-density result, valid for a perfect fluid only up to β = 4/9 (Buchdahl); beyond that only because he is indestructible. The rest-mass versus gravitational-mass reading is our reasoning, not sourced. The 1 − √(1 − 2β) infall factor is standard but not separately sourced. "
    "(9) The incompressible 1.5 ρ0u² limit for slow sphere expansion is the verifier's derivation, not sourced. "
    "Raised by the verifier but not added as facts (computed, not fetched): "
    "(a) Momentum in instant growth: with soles fixed, his centre of mass rises at about half the head speed (about 700 m/s, momentum 3.3e9 kg·m/s, for Chicxulub pure size); the ground force reaches about 4.7 GPa under his grown soles (twice under Ollie's boots), and he would be thrown about 25 km up unless held down. Anchoring at the centre of mass instead drives his feet into the ground. The engine needs a momentum and lift-off check for both instant and gradual growth (lift-off T ≥ about √(πΔH/g), about 3 s for Chicxulub pure size). Folded into growth_ground_push_estimate. "
    "(b) Clear-space precondition for gradual growth: buildings, vehicles or trees inside his final footprint (equivalent radius 10 m for Chicxulub pure size, 99 m for a Sun-second) are pushed over or crushed at any speed; only people who can step away are protected. "
    "(c) Shape factors for the canon bodies (centre-of-mass height fraction; largest horizontal reach of tail, snout and arms from the soles) should be measured from the turnarounds; the 0.29 equivalent-ball side factor is an assumption. "
    "(d) Ollie inputs: 3.06 m tall and 0.15 m² boot soles (existing estimate rex_ollie_picture_build; Rex's paw 0.31 m²), so his ground stresses are about twice Rex's. "
    "(e) Black-hole threshold uses the engine's equivalent-ball radius; a tall body would plausibly need more mass (hoop conjecture, not verified). "
    "Canon questions for the owners: whether work done shoving the surroundings is paid from the absorbed energy or from the endless store (decides whether the loop multiplier 1/(1 − f) applies at all); and whether growth is anchored at the soles (and, if so, whether he is held to the ground). "
    "Choices that are ours, to be labelled on the page: the instant time scale (final height ÷ 1,540 m/s); the 1 − cos rate profile; anchoring at the soles; measuring a bystander's distance from his final surface; the top of the head as the fastest shove point; the equivalent-ball side factor. "
    "Existing data needing fixes (outside this topic): density_black_hole_rex_2m uses the old 2.54 m³ volume (canon 2.84 m³ gives 2.08e26 kg/m³ and 5.9e26 kg); energy_chicxulub_impact can cite Morgan et al. 2022 (about 5e23 J, abstract 'about 10^23 J'); energy_krakatoa_1883 should note Harkrider & Press's 100–150 Mt air-wave equivalent; blast_kinney_graham_peak_overpressure's ground-reflection question is answered by Baker 1977 (E' = 2E on rigid ground); schwarzschild_radius still cites Wikipedia only."
)

os.makedirs(os.path.dirname(OUT), exist_ok=True)
with open(OUT, 'w', encoding='utf-8', newline='\n') as fh:
    json.dump({"facts": F, "gaps": GAPS}, fh, ensure_ascii=False, indent=1)
print(len(F), 'facts written to', OUT)
