import json, math, os

BASE = "/tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad"
SRC = BASE + "/wfout/research_thresholds.json"
OUT = BASE + "/compiled/thresholds.json"
CAT = "presence_thresholds"

research = json.load(open(SRC, encoding="utf-8"))
facts = [dict(f) for f in research["facts"]]
by = {f["key"]: f for f in facts}

ORDER = ["key", "category", "label", "status", "value_si", "unit_si", "low_si", "high_si",
         "display", "sources", "notes", "who_when", "values_json"]

# ---- sources ----
S_BS5228 = {"title": "BS 5228-2:2009 Code of practice for noise and vibration control on construction and open sites, Part 2: Vibration (licensed copy posted by Nottinghamshire County Council), Annex B",
            "url": "https://www.nottinghamshire.gov.uk/media/110052/british-standard-bs5228-2009.pdf"}
S_PLEANALA = {"title": "MetroLink EIAR Vol. 5 Appendix A14.1 'Relevant guidance and standards' (Jacobs IDOM), hosted by An Bord Pleanala (Irish planning board); reproduces BS 5228-2:2009+A1:2014, BS 7385-2, DIN 4150-3:2016, HS2 tables and Irish EPA guidance",
              "url": "https://www.pleanala.ie/publicaccess/EIAR-NIS/314724/5_EIAR/Volume%205%20Appendices/Chapter%2014%20Ground-borne%20Noise%20and%20Vibration/A14.1%20Relevant%20guidance%20and%20standards.pdf"}
S_RI8507 = {"title": "Siskind, Stagg, Kopp & Dowding (1980) US Bureau of Mines Report of Investigations 8507, Structure Response and Damage Produced by Ground Vibration from Surface Mine Blasting (Pennsylvania DEP copy; scanned, read by OCR and page images)",
            "url": "https://files.dep.state.pa.us/Mining/BureauOfMiningPrograms/BMPPortalFiles/Blasting_Research_Papers/1980%20Siskind%20RI%208507%20Structure%20Response%20and%20Damage%20Produced%20by%20Ground%20Vibration%20from%20Surface%20Mine%20Blasting%20(No.%2018).pdf"}
S_WATERCARE = {"title": "Watercare Services (Auckland) evidence, P. Millar, Appendix B 'Review of vibration standards' (reproduces DIN 4150-3:1999 Table 1 and Siskind et al. 1980)",
               "url": "https://assets.watercare.co.nz/media/peter_millar_appendix_b_9d042ff732.pdf"}
S_TM12 = {"title": "Wald et al., ShakeMap Manual, USGS Techniques and Methods 12-A1 (version 1.0, 2006), section 2.5 and Figure 2.5 (reproduces Wald, Quitoriano, Heaton & Kanamori 1999, Earthquake Spectra 15(3):557-564)",
          "url": "https://pubs.usgs.gov/tm/2005/12A01/pdf/508TM12-A1.pdf"}
S_CALTRANS = {"title": "Caltrans (2020) Transportation and Construction Vibration Guidance Manual, CT-HWANP-RT-20-365.01.01 (April 2020)",
              "url": "https://dot.ca.gov/-/media/dot-media/programs/environmental-analysis/documents/env/tcvgm-apr2020-a11y.pdf"}

changes, dropped = [], []

def upd(key, why, **kw):
    f = by[key]
    for k, v in kw.items():
        if k == "values_json" and not isinstance(v, str):
            v = json.dumps(v, ensure_ascii=False)
        f[k] = v
    changes.append(f"{key}: {why}")

def add_source(key, src):
    if all(s["url"] != src["url"] for s in by[key]["sources"]):
        by[key]["sources"].append(src)

# ---------------------------------------------------------------- people feel it
upd("thr_whiffin_leonard_1971_lr418_people", "notes say Caltrans misspells the author 'Whiffen' (verifier)",
    notes="As reproduced in Caltrans Technical Advisory TAV-04-01-R0201 (R. Hendriks, 23 January 2004), Table 2 'Reaction of People and Damage to Buildings at Various Continuous Vibration Amplitudes', printed in the appendix of Caltrans 2020 (PDF p. 143). It cites 'Whiffen and Leonard', TRRL Report LR418, 1971; Caltrans misspells the author, who is Whiffin. Footnote: 'The vibration amplitudes are based on peak particle velocity in the vertical direction. Where human reactions are concerned, the value is at the point at which the person is situated. For buildings, the value refers to the ground motion.' The mm/s and in/s columns do not match exactly (0.006-0.019 in/s is 0.15-0.48 mm/s); the mm/s column is kept. Continuous traffic vibration; no frequency range given. The original LR 418 was not opened.")

def murray(tau):  # in/s -> mm/s
    return 0.415 * tau ** -1.29 * 25.4

vj15 = json.loads(by["thr_ri8507_duration_dependence_table15"]["values_json"])
vj15["acceptable_Murray"] = ("V <= 0.415 tau^-1.29 in/s, peak FLOOR velocity of damped concrete floors, tau = time from peak to -20 dB (10%% of peak), 0.2-4 s; "
                             "Table 15 misprints the exponent as +1.29 (tau 0.2 s -> %.0f mm/s; 1 s -> %.1f mm/s; 4 s -> %.1f mm/s)" % (murray(0.2), murray(1), murray(4)))
vj15["durations_0.5_1_s"] = "derived by RI 8507 from the damping of Wiss & Parmelee's 5 s damped pulses, not separate tests"
upd("thr_ri8507_duration_dependence_table15",
    "fixed the misprinted Murray exponent in values_json (tau^+1.29 -> tau^-1.29, peak floor velocity); notes now say the 0.5-1 s rows are derived from damping of W&P's standing, open-platform, vertical pulses; label clarified (verifier)",
    label="Perception thresholds rise steeply as the event gets shorter (USBM RI 8507 Table 15)",
    values_json=vj15,
    notes="RI 8507 Table 15 'Subjective responses of humans to vibrations of various durations' (report p. 67), read from a 300 dpi page image. The 0.5 s and 1 s rows were not separate tests: RI 8507 derived them from the damping of Wiss & Parmelee's 5 s damped sine pulses (p. 63: 40 people standing on an open platform, vertical vibration, 2.5-25 Hz), the closest set-up here to a person standing outdoors. Text (p. 65): for short events 'levels of over 0.5 in/sec could be tolerated'; 'The barely perceptible levels are still below 0.1 in/sec'. The tests had none of the 'damage fear, startle, house rattle' of real homes, which 'lowers the thresholds at which people react'. Verifier: Table 15 misprints Murray's exponent as +1.29; the p. 65 text gives V <= 0.415 tau^-1.29 for peak floor velocity (thr_murray_floor_acceptability), now used in values_json.")

upd("thr_iso2631_1989_building_criteria",
    "label and who_when no longer call the criteria 1989: Caltrans dates its ISO 2631 guide 1981 (verifier); key kept for stability",
    label="ISO 2631 building vibration criteria (8-80 Hz), rms velocity, as reproduced in Caltrans 2020 Table 7 (Caltrans dates the ISO guide 1981)",
    who_when="ISO 2631 (Caltrans: 1981) via Caltrans 2020",
    notes="As reproduced in Caltrans 2020 Table 7 'ISO 2631 Vibration Criteria' (p. 22). Caltrans: 'In 1981, the International Standards Organization (ISO) published Guide to the Evaluation of Human Exposure to Vibration and Shock in Buildings (1 Hz to 80 Hz) (ISO 2631)'; humans are 'sensitive to particle velocity in the range of 8-80 Hz ... Below 8 Hz ... higher velocities are needed to elicit the same response'. These are rms values, not PPV: for a sine wave PPV = 1.41 x rms, for impulsive signals much more (thr_fta2018_crest_factor). Watercare's evidence gives matching PPV values (about 0.3 mm/s by day, 0.14 mm/s at night) for NZS/ISO 2631-2:1989 (thr_iso2631_2_2003_no_limits). The ISO text (paywalled) was not opened. Verifier: the researcher's '1989' date is not what Caltrans says; relabelled.")

upd("thr_iso_base_curve_link_to_bs5228", "added the Irish EPA 8-80 Hz perception wording as support (verifier suggestion, text confirmed)",
    notes="Inference, not stated by either source. Caltrans Table 7 gives the ISO 2631 operating-theatre criterion (the base curve) as 0.004 in/s rms = 0.10 mm/s rms. For a sine wave, peak = rms x sqrt(2) = 0.144 mm/s, which matches BS 5228-2's 'just perceptible in the most sensitive situations' 0.14 mm/s. The residential day criterion (0.008 in/s rms = 0.20 mm/s rms) gives 0.29 mm/s peak, matching BS 5228-2's residential 0.3 mm/s. So both BS numbers read as the ISO base curve and its residential multiple, valid at 8-80 Hz. The Irish EPA wording reproduced by An Bord Pleanala (A14.1 p. 2), perception '0.15mm/s - 0.3mm/s, at frequencies between 8Hz and 80Hz for continuous vibrations', fits the same reading. Verifier recomputed all three conversions.")
add_source("thr_iso_base_curve_link_to_bs5228", S_PLEANALA)

upd("thr_fta2018_human_response_vdb", "notes shortened to the length limit; content unchanged",
    notes="FTA 2018 p. 113: 'The background vibration velocity level in residential areas is usually 50 VdB or lower, and the threshold of perception for humans is approximately 65 VdB. A vibration level of 85 VdB in a residence can result in strong annoyance.' Table 5-5 (p. 120) gives the 65/75/85 VdB rows. p. 118: annoyance is 'well below the damage risk threshold for typical buildings (100 VdB)'. VdB = 20 log10(v_rms / 1e-6 in/s) (Eq. 5-1). Our conversions: 65 VdB = 1.78e-3 in/s rms = 0.045 mm/s rms; PPV = crest factor x rms, 4 (FTA's own, Table 7-5) to 5 (trains). Criteria are for repeated transit events measured inside buildings. Table 6-2: frequent means more than 70 events a day, occasional 30-70, infrequent fewer than 30 (Caltrans 2020 Table 8's note misprints 'fewer than 70').")

# ---------------------------------------------------------------- rattling
upd("thr_rattle_below_perception_caltrans", "notes shortened to the length limit; content unchanged",
    notes="Caltrans 2020 Chapter 5 (p. 19): 'secondary effects, such as the rattling of a china cabinet, can also occur, even when vibration levels are well below perception.' TA V-04-01 (appendix, PDF pp. 143-144): low-amplitude traffic vibration 'can cause irritating secondary vibrations, such as a slight rattling of doors, windows, stacked dishes, etc. These objects are often in a state of neutral equilibrium and readily respond to very low amplitudes of vibrations. The rattling sound gives rise to exaggerated vibration complaints, even though there is very little risk of damage.' Same TA (PDF p. 149): 'The threshold of perception, or roughly 0.25 mm/s (0.01 in/sec) may be considered annoying by those people. Low amplitude vibrations may also cause secondary vibrations and audible effects such as a slight rattling of doors, windows and dishes'. None of these gives a numeric rattling threshold.")

upd("thr_rattle_ri8507_midwall", "notes shortened to the length limit (dropped the abstract's secondary 'aggravated by wall rattling' sentence)",
    notes="RI 8507 abstract: resonances at 4-12 Hz for whole structures and 10-25 Hz for midwalls; amplification 'typical values were 1.5 for structures as a whole (racking) and 4 for midwalls, at their respective resonance frequencies. For blast vibrations above 40 Hz, all amplification factors for frame residential structures were less than unity.' p. 18: 'Midwall motions ... are primarily responsible for window sashes rattling, picture frames tilting, dishes jiggling, and knick-knacks falling.' p. 6: 'continual complaints about severe rattling at levels below 0.5 in/sec [12.7 mm/s] are attributable to the low frequencies.' p. 62: people indoors 'hear and feel the predominantly 5- to 25-Hz structure midwall and midfloor response vibrations'. No rattle threshold is given. value_si = midwall factor.")

upd("thr_rattle_ems98", "notes cite the USGS manual's 'more or less equivalent to the MMI' instead of an unchecked assumption; shortened (verifier)",
    notes="EMS-98 core scale (PDF p. 19): 'IV. Largely observed: a) The earthquake is felt indoors by many and felt outdoors only by very few. ... b) China, glasses, windows and doors rattle. Hanging objects swing. Light furniture shakes visibly in a few cases. Woodwork creaks in a few cases. c) No damage.' 'V. Strong: ... b) Hanging objects swing considerably. China and glasses clatter together. Small, top-heavy and/or precariously supported objects may be shifted or fall down. ... Liquids oscillate and may spill from well-filled containers.' EMS-98 gives no ground-motion values. For numbers see thr_wald1999_shakemap_intensity_table; the USGS ShakeMap manual (p. 57) calls EMS-98 'more or less equivalent to the MMI'.")
add_source("thr_rattle_ems98", S_TM12)

upd("thr_usgs_mmi_abridged", "notes add that MMI IV says 'disturbed', not 'rattle' (verifier)",
    notes="USGS 'The Severity of an Earthquake', abbreviated MMI (Wood & Neumann 1931): II 'Felt only by a few persons at rest, especially on upper floors of buildings. Delicately suspended objects may swing.' III 'Felt quite noticeably by persons indoors ... Vibration similar to the passing of a truck.' IV 'Felt indoors by many, outdoors by few during the day. At night, some awakened. Dishes, windows, doors disturbed; walls make cracking sound. Sensation like heavy truck striking building. Standing motor cars rocked noticeably.' V 'Felt by nearly everyone; many awakened. some dishes, windows broken. Unstable objects overturned.' VI 'Felt by all, many frightened. Some heavy furniture moved; a few instances of fallen plaster. Damage slight.' IV says 'disturbed', not 'rattle'. This abbreviated version has no 'difficult to stand' wording; EMS-98 and JMA do.")

upd("thr_jma_intensity_descriptions", "notes add the USGS manual's 'old JMA 4 = MMI VI', so JMA 3-4 does not pin MMI IV; added that source (verifier)",
    notes="JMA table, human perception and indoor situation: '3 Felt by most people in buildings. ... Dishes in cupboards may rattle.' '4 Most people are startled ... dishes in cupboards rattle. Unstable ornaments may fall.' '5 Upper ... walking is difficult without holding onto something stable.' '6 Lower It is difficult to remain standing.' '6 Upper It is impossible to remain standing or move without crawling. People may be thrown through the air.' The page gives no ground-motion values (JMA intensity is computed from filtered acceleration). Verifier: the USGS ShakeMap manual (p. 57) says that on the old 7-point Japanese scale 'intensity 4 is equivalent to MMI VI', so 'dishes rattle' at JMA 3-4 spans roughly MMI IV-VI and does not pin intensity IV.")
add_source("thr_jma_intensity_descriptions", S_TM12)

upd("thr_wald1999_shakemap_intensity_table",
    "display no longer says MMI IV 'rattle' (the scale says 'disturbed'); notes correct the claim that every band edge was reproduced from the equations and add the larger-horizontal-component convention (verifier)",
    display="MMI IV (light; dishes, windows, doors disturbed): PGV 1.1-3.4 cm/s (11-34 mm/s), PGA 1.4-3.9 %g; VI 8.1-16 cm/s; VII 16-31 cm/s; VIII 31-60 cm/s",
    notes="USGS TM 12-A1 Figure 2.5 'ShakeMap Instrumental Intensity Scale Legend' (p. 56), read from a page image; it reproduces the Wald et al. (1999) regressions. Values are 'the maximum value observed on the two horizontal components' (manual pp. 30, 64), free-field records from eight California earthquakes lasting many seconds. The manual warns these are 'instrumental intensities ... not based on observations of the earthquake effects on people or structures'. Verifier: the PGV edges from V up recompute from Imm = 3.47 log PGV + 2.35 (8.09, 15.7, 30.5, 59.2, 115 cm/s); the IV/V edge from the low-intensity relation is 3.34 cm/s (printed 3.4); the PGA edges above V do not follow the manual's equation (17.3, 32.4, 60.9, 114 %g against the printed 18, 34, 65, 124). The page uses only the low PGA bands and the VI-VIII PGV bands. The paper (paywalled) was not opened. value_si/low/high = MMI IV PGV band.")

upd("thr_wald1999_low_intensity_caveat", "notes shortened to the length limit; verifier's recomputation noted",
    notes="USGS TM 12-A1 p. 55: 'our current collection of data from historical earthquakes does not provide constraints for lower intensity, we have imposed the following relationship between PGA and Imm: Imm = 2.20 log (PGA) + 1.00 ... the boundary between not felt and felt (Imm I and II, respectively) regions corresponds to approximately 1 to 2 cm/s/s, at least for this range of magnitudes [M 3.5-5.0] ... The corresponding equation for PGV and Imm is: Imm = 2.10 log (PGV) + 3.40'. And: lower intensities 'are assigned based on felt accounts, and people are more sensitive to ground acceleration than velocity.' So the MMI IV velocity band (11-34 mm/s) is weakly constrained; its acceleration band (0.14-0.38 m/s^2) is the better guide. Verifier recomputed: the PGA relation at I = 1.5 gives 1.69 cm/s^2.")

upd("thr_earthquake_frequency_vs_intensity", "notes add that the equivalent sine frequency is only indicative (verifier)",
    notes="USGS TM 12-A1 p. 55: 'seismic intensities correlate well for rather narrow ranges of Fourier amplitude spectra of ground acceleration, with 0.7-1.0 Hz being most representative of Imm > VIII, whereas the 3-6 Hz range best represents Imm V to VII, and the 7-8 Hz range best correlates with the lowest Imm range.' Our arithmetic: dividing each Wald band's PGA by 2 pi x its PGV gives an equivalent sine frequency of 2.0-2.7 Hz for II-III and 1.7-2.0 Hz for IV-VIII. Verifier: PGA and PGV peaks come from different parts of the spectrum, so this equivalent frequency is only indicative. Footstep vibration is expected to be higher in frequency and much shorter; its dominant frequency should come from the attenuation research.")

upd("thr_rattle_mmi4_accel_at_footstep_frequency",
    "status derived -> estimate (two inputs are assumptions); removed the 'supports the method' check, now called coincidental; JMA no longer equated with MMI IV (verifier)",
    status="estimate",
    label="Rattling level carried to footstep frequencies by acceleration (our estimate)",
    notes="Formula: PPV = a / (2 pi f) for a sinusoid, with a = the MMI IV PGA band (Wald 1999: 1.4-3.9 %g = 0.137-0.383 m/s^2) and f the step's dominant frequency. At 20 Hz: 1.09-3.04 mm/s. Assumptions: f, pending the attenuation research; and that rattling follows a fixed acceleration, carried from horizontal, indoor, building-amplified earthquake shaking at about 2 Hz to a short vertical footstep pulse. Wald et al. say low intensities follow acceleration; ISO 2631 (via Caltrans) says people respond to velocity at 8-80 Hz. Ignores duration, building resonance (midwalls up to 4x at 10-25 Hz, RI 8507) and ground versus indoor floor. Verifier: downgraded from derived; the match of the felt/not-felt edge with BS 5228-2's 0.14 mm/s at 20 Hz is coincidental, not a validation (at 40 Hz the method gives 0.07 mm/s); JMA 3-4 is not equivalent to MMI IV.",
    who_when="Estimated here from Wald et al. 1999 (via USGS 2006)")

upd("thr_one_g_vertical", "notes add that 1 g vertical also unloads a standing person's feet, so it is a footing marker too (verifier missing item 9)",
    notes="Physics, not a published threshold: for sinusoidal vertical motion of velocity amplitude v, peak acceleration is 2 pi f v; when the downward acceleration exceeds g = 9.80665 m/s^2, an unattached object, or a standing person's feet, briefly loses contact with the ground. v = 9.80665 / (2 pi f). So it is a marker for footing as well as for objects; no source here tests people under vertical motion above 1 g. A fixed PPV cannot cover both earthquakes (about 2 Hz, where 1 g needs 780 mm/s) and footsteps (higher). Objects slide sideways at lower acceleration (friction coefficient times g). The USGS source is listed only for the frequency context; the formula is standard kinematics. Verifier recomputed all values.")

# ---------------------------------------------------------------- damage
upd("thr_bs7385_2_multipliers_and_continuous", "display keeps the sources' 'possible' and 'can occur' wording; notes shortened and note the A1:2014 damage-definition reference (verifier)",
    display="Minor damage is possible above 2x the Table B.2 values; major damage can occur above 4x; for continuous vibration that causes resonance, the guide values might need to be reduced by up to 50%",
    notes="BS 5228-2:2009 p. 38: 'Minor damage is possible at vibration magnitudes which are greater than twice those given in Table B.2, and major damage to a building structure can occur at values greater than four times the tabulated values.' And: 'Where the dynamic loading caused by continuous vibration is such as to give rise to dynamic magnification due to resonance, especially at the lower frequencies where lower guide values apply, then the guide values in Table B.2 might need to be reduced by up to 50%.' BS 7385-2 note quoted by An Bord Pleanala: 'There are insufficient cases where continuous vibration has caused damage to buildings to substantiate these guide values, but they are based on common practice'. For homes: minor damage possible from about 30-100 mm/s, major from about 60-200 mm/s (2x and 4x of 15-50 mm/s). Verifier: A1:2014 points the damage definitions to BS ISO 4866:2010, 12.6.")

upd("thr_din4150_3_1999_table1", "removed the unsourced 'intended to avoid even minor damage'; added DIN 4150-3:1999's 5 mm/s long-term limit at the uppermost storey (Watercare para 10; verifier)",
    notes="As reproduced in Watercare evidence Appendix B, 'Table 2: Guideline values of vibration velocity, for evaluating the effects of short-term vibration, DIN4150-3:1999'. Para 10: 'DIN 4150-3:1999 also includes a limit for continuous (steady state) vibration. DIN 4150-3:1999 recommends a constant limit of 5mm/s (as measured in the plane of the uppermost storey) be applied to all category 1 and 2 buildings.' DIN is stricter than BS 7385-2 at low frequencies (5 mm/s against 15 mm/s for homes below 10 Hz). DIN's own definition of 'short-term' was not confirmed. DIN 4150-3 itself (paywalled) was not opened. value_si = dwellings below 10 Hz. Verifier: removed the unsourced phrase 'intended to avoid even minor damage'; added the long-term limit.")

upd("thr_usbm_ri8507_safe_levels", "label: safe levels chosen so cracking is unlikely, not a 'cosmetic cracking threshold'; notes shortened (verifier)",
    label="USBM RI 8507: practical safe blasting vibration levels for houses (chosen so that cosmetic cracking is unlikely)",
    notes="RI 8507 Conclusion 6 (p. 68): 'Practical safe criteria for blasts that generate low-frequency ground vibrations are 0.75 in/sec for modern gypsumboard houses and 0.50 in/sec for plaster on lath interiors. For frequencies above 40 Hz, a safe particle velocity maximum of 2.0 in/sec is recommended for all houses.' Abstract: 'Threshold damage was defined as the occurrence of cosmetic damage; that is, the most superficial interior cracking of the type that develops in all homes independent of blasting.' Conclusion 8: below 0.5 in/sec the chance of damage 'is not only small (5 pct for worst cases) but decreases more rapidly than the mean prediction'. Conclusion 7: there may be 'no absolute minimum vibration damage threshold'. Restated in Caltrans 2020 section 11.4.3.1. Data: 219 blasts at 76 homes plus nine earlier studies. Verifier: these are safe levels, not where cracking begins.")

upd("thr_siskind_damage_probabilities", "added Watercare's reproduction as a second source and the 90% vs 100% column-heading conflict (verifier)",
    notes="As reproduced in Caltrans 2020 Table 13 'Siskind Vibration Damage Thresholds' (p. 25), for probabilities of 5, 10, 50 and 90%. The damage-class wording matches RI 8507 Table 10 'Damage classification'. Watercare Appendix B Table 1 gives the same numbers in mm/s (13/18/64/228, 46/56/127/406, 64/76/152/430) but heads the last column '100' where Caltrans has 90%. Neither reproduction was checked against RI 8507's probability plots (figs. 55-59). Blasting, mostly low-frequency, residential houses. value_si = 5% threshold damage.")
add_source("thr_siskind_damage_probabilities", S_WATERCARE)

upd("thr_whiffin_leonard_1971_buildings", "notes shortened to the length limit; quotes abridged, no numbers changed",
    notes="As reproduced in Caltrans TAV-04-01-R0201 (Hendriks 2004) Table 2 (Caltrans 2020 appendix, PDF p. 143): '2.0 mm/s: Recommended upper amplitude of the vibration to which ruins and ancient monuments should be subjected'; '2.5: Virtually no risk of architectural damage to normal buildings'; '5.0: Threshold at which there is a risk of architectural damage to normal dwelling - houses with plastered walls and ceilings'; '10-15: ... architectural damage and possibly minor structural damage'. 'For buildings, the value refers to the ground motion. No allowance is included for the amplifying effect, if any, of structural components.' The TA calls 5 mm/s 'one tenth of the maximum safe amplitude ... for single events' and 'conservative even for sustained pile driving', and says pile-driving peaks near dwellings 'should probably not be allowed to exceed 7.5 mm/s'. Continuous (traffic) vibration.")

upd("thr_everyday_household_equivalents", "notes point to the RI 8507 primary (Tables 5-6); added RI 8507 as a source (verifier)",
    notes="Caltrans 2020 Table 22 (pp. 76-77), rows credited to Stagg et al. 1980: walking on floor 0.03; jumping on floor 0.3; door slam 0.5; normal daily family activity 0.1-0.5; nail driving 0.9; daily environmental changes 1.2-3.0 (in/s). Caltrans: 'In some instances equivalent velocity levels were derived from strain measurements' and the table 'is not intended to be used to establish specific limits.' These are ground PPVs that would strain a house as much as the household event does, not floor vibration levels. The primary is RI 8507 pp. 41-42 (thr_ri8507_everyday_activity_house_response), which also shows indoor floor velocities far above these ground values. Useful for plain comparisons ('about as hard on the house as a slammed door').")
add_source("thr_everyday_household_equivalents", S_RI8507)

upd("thr_measurement_point_conventions", "notes add that earthquake values are the larger horizontal component and Whiffin's are vertical; shortened (verifier)",
    notes="BS 5228-2 Table B.2 Note 1: 'Values referred to are at the base of the building'; values are 'peak component particle velocity' (the largest of three components, not the vector sum). Whiffin & Leonard (Caltrans TA): vertical PPV; 'Where human reactions are concerned, the value is at the point at which the person is situated. For buildings, the value refers to the ground motion.' BS 5228-2+A1:2014 Table B.1 footnotes (via An Bord Pleanala): values apply at 'the point of entry into the recipient', with a transfer function if only external measurements exist. FTA criteria are indoor rms levels. Earthquake values (Wald 1999) are the larger horizontal component. The Walk tab predicts free-field ground PPV, which matches the damage criteria and an outdoor listener; indoors, walls and floors can amplify (RI 8507: about 4x for midwalls at 10-25 Hz). Verifier: added the horizontal and vertical conventions.")
add_source("thr_measurement_point_conventions", S_TM12)

# ---------------------------------------------------------------- footing
upd("thr_footing_earthquake_pgv", "cites the USGS manual's EMS-98 ~ MMI equivalence instead of 'assumption, not checked'; VII wording now 'especially on upper floors', not 'indoors' (verifier)",
    display="A few lose balance (VI): 81-160 mm/s; many find standing hard, especially on upper floors (VII): 160-310 mm/s; even outdoors (VIII): 310-600 mm/s",
    notes="Joins EMS-98's balance wording (thr_footing_ems98) to the Wald et al. (1999) PGV bands for the same Roman numerals (thr_wald1999_shakemap_intensity_table). The USGS ShakeMap manual (p. 57) supports the join: EMS-98 is 'more or less equivalent to the MMI'. The VI-VIII PGV bands lie within the V-IX range that Wald's PGV relation was fitted to. The JMA scale (6 Lower: 'difficult to remain standing') gives no PGV. Conditions: earthquake ground motion of about 1-6 Hz lasting many seconds, larger horizontal component, displacements of centimetres. value_si = 310 mm/s, the VII/VIII boundary (standing hard even outdoors). Verifier: cited the USGS equivalence, replacing 'assumption, not checked'.")

vjt = json.loads(by["thr_footing_takahashi2004_shake_table"]["values_json"])
vjt.pop("read from Figure 8 (standing)", None)
vjt["read from Figure 8 (standing)"] = ("no subject unbalanced at 0.159 m/s (1 Hz) or 0.127 m/s (2.5 Hz); first non-zero ratios at 0.318 m/s at 1-2.5 Hz; "
                                        "0.3 and 0.6 Hz were never tested below 0.265 m/s, and some subjects were already unbalanced there (female, 0.3 Hz: 0.33); "
                                        "5.0 Hz stays at 0 up to 0.477 m/s")
vjt["read from Figure 10b (walking, right and left)"] = "5.0 Hz, male: 0.5 at 0.477 m/s; at 1 Hz some walking subjects unbalanced from 0.159 m/s"
upd("thr_footing_takahashi2004_shake_table",
    "label, display, range and values_json corrected: the onset is set by the test grid (0.3-0.6 Hz never tested below 0.265 m/s); 'nobody at 5 Hz' holds only for standing, walking males lost balance at 0.48 m/s (verifier, checked on Table 1 and the figure images)",
    label="Shake-table test (horizontal sine shaking): standing people first lost balance at the lowest velocities tested near 0.3 m/s (0.3-2.5 Hz)",
    low_si=0.13, high_si=0.32,
    display="Standing subjects: some lost balance at the lowest velocity tested at 0.3-0.6 Hz (0.265 m/s) and at 0.32 m/s at 1-2.5 Hz, where 0.13-0.16 m/s caused none. So the onset is set by the test grid: between about 0.13-0.16 and 0.32 m/s at 1-2.5 Hz, at or below 0.265 m/s at 0.3-0.6 Hz. At 5 Hz no standing subject lost balance up to 0.48 m/s, but half the male walking subjects did under side-to-side shaking at 0.48 m/s",
    values_json=vjt,
    notes="Takahashi et al. 2004, Table 1 (horizontal input sine waves, front-rear and right-left) and Figure 8 'Unbalanced ratio in standing', read from page images (about +-0.05 m/s). Balance was judged by the authors from motion-capture records. Text: 'high frequency motion causes strong anxiousness and low frequency motion causes stagger even if anxiousness is small.' Conclusion: 'additional tests might be need to clarify its limit value' and 'The authors have not find clear limit value for evacuation limit ... because of limitation of number of subjects.' Walking subjects lost balance at lower velocities than standing ones. 30 young adults (7 female) wearing protectors; sinusoids lasting several seconds; conference paper. low_si/high_si bracket the onset at 1-2.5 Hz; at 0.3-0.6 Hz no lower bound was tested. Verifier: corrected the onset description and the 5 Hz claim.")

# ---------------------------------------------------------------- recommendations
upd("thr_rec_feel", "notes add the outdoor and impulsive evidence (Wiss & Parmelee's standing open-platform subjects; Irish EPA 0.5-1.5 mm/s) and drop the '1989' ISO label; display adds the single-step line (verifier)",
    display="0.3 mm/s PPV for a walk past (range 0.14-1 mm/s). For one isolated step: the most sensitive notice from about 0.3 mm/s, most people from about 1 mm/s, the average person 2-3 mm/s",
    notes="Set by BS 5228-2 Table B.1 ('might be just perceptible in residential environments', 0.3 mm/s), for construction vibration of roughly 8-80 Hz felt by people in buildings. Agrees with Whiffin & Leonard (0.15-0.3 mm/s, continuous), Caltrans Table 20 continuous (0.25 mm/s), the ISO 2631 residential criterion via Caltrans (about 0.3 mm/s peak) and FTA's 65 VdB (about 0.2 mm/s PPV). Low end 0.14 mm/s: the most sensitive people. High end 1.0 mm/s: Caltrans 'barely perceptible' for a single transient. For one step outdoors the closer evidence is higher: Wiss & Parmelee's subjects stood on an open platform under vertical pulses, and the average needed 2.4-3.3 mm/s for a 0.5-1 s event (RI 8507 Table 15); the Irish EPA gives 0.5-1.5 mm/s for impulsive blasting (thr_irish_epa_perception). Below about 8 Hz a higher PPV is needed. Verifier: added the outdoor and impulsive evidence.")
add_source("thr_rec_feel", S_PLEANALA)

upd("thr_rec_rattle", "display and notes now state plainly that the 1 mm/s default sits above the sources' 'at or below perception'; removed the JMA = MMI IV link and the inherited 'check'; noted the horizontal/2 Hz vs footstep mismatch (verifier)",
    display="About 1 mm/s PPV (range 0.3-3 mm/s). Our estimate: no standard sets it, and the sources that mention rattling say it can start at or below the level people feel",
    values_json={"option_with_frequency": "v_rattle = max(0.3 mm/s, 0.137 m/s^2 / (2 pi f))", "at_5_Hz_mm_s": 4.4, "at_20_Hz_mm_s": 1.1, "basis": "lower edge of Wald 1999 MMI IV PGA band (1.4 %g); estimate"},
    notes="No construction or vibration standard gives a rattling threshold. Caltrans, its 2004 TA and FTA say dishes, windows and doors can rattle at or below perception (about 0.25-0.3 mm/s; Caltrans: 'well below perception'). The 1 mm/s default is higher than that: it is the lower edge of intensity IV acceleration (1.4-3.9 %g, Wald 1999) converted at an assumed 20 Hz (1.1-3.0 mm/s; thr_rattle_mmi4_accel_at_footstep_frequency, itself an estimate). The page must state this conflict. The earthquake values are larger-horizontal free-field motion at about 2 Hz; the component ppvAt predicts is unstated. Indoors, midwalls amplify up to 4x (RI 8507), so rattling starts at lower ground PPV. Verifier: removed the JMA-equals-IV link and the 'check'; stated the conflict.")

def bs_line2(f):
    if f < 4: return 2 * math.pi * f * 0.6
    if f < 15: return 15 * (f / 4) ** 0.2177
    if f < 40: return 20 * (f / 15) ** 0.934
    return 50.0

upd("thr_rec_cosmetic_damage", "label: a safe limit below which cracks are very unlikely, not where damage 'starts'; display adds Siskind's 50% point (64 mm/s); notes keep 'possible/can' for presets and call the walk-as-continuous reading cautious (verifier)",
    label="Recommended page value: cosmetic-damage safe limit (below this, cracks are very unlikely)",
    display="One step or stomp: 12.7 mm/s (0.5 in/s) at the house; a walk past (repeated steps): 7.6 mm/s (0.3 in/s); range 5-50 mm/s by building and frequency. These are safe limits: the 50% chance of cosmetic cracks is about 64 mm/s (Siskind, blasting)",
    values_json={"single_step_transient_mm_s": 12.7, "walk_past_continuous_mm_s": 7.6, "siskind_50pct_mm_s": {"cosmetic": 64, "minor": 127, "major": 152},
                 "bs7385_2_line2_option": "f<4 Hz: v = 2 pi f x 0.6 mm; 4-15 Hz: 15 x (f/4)^0.2177 mm/s; 15-40 Hz: 20 x (f/15)^0.934; >=40 Hz: 50. Straight lines on the standard's log-log Figure B.1; the interpolation is our assumption (%.1f mm/s at 10 Hz, %.1f at 20 Hz)" % (bs_line2(10), bs_line2(20)),
                 "presets": "minor damage is possible above 2x and major damage can occur above 4x the BS 7385-2 values"},
    notes="Single step (transient): 12.7 mm/s, the USBM RI 8507 'practical safe' level for plaster-on-lath houses below 40 Hz (at most a 5% chance of threshold damage in worst cases), and Caltrans Table 19 (older homes, transient); BS 7385-2 says damage probability 'tends towards zero at 12.5 mm/s'. Repeated steps: 7.6 mm/s, Caltrans Table 19 older homes, continuous/frequent intermittent (impact pile drivers). Treating a walk as continuous is a cautious reading: BS 7385-2's 'up to 50%' cut is for vibration that causes resonance. Range: 5 mm/s (DIN 4150-3 dwellings below 10 Hz; FTA wood-frame; Whiffin & Leonard continuous) to 50 mm/s (BS 7385-2 and USBM at 40 Hz and above). Presets keep the sources' wording (values_json). Verifier: relabelled from 'damage starts' to a safe limit; added Siskind's 50% point.")

upd("thr_rec_footing", "display replaced: dropped the unsupported 'likely cautious'; says the direction of error for vertical footstep pulses is unknown and adds the 1 g lift-off marker g/(2 pi f); notes note the censored Takahashi onset and that EMS VI is not indoors-only (verifier)",
    display="About 300 mm/s (range 80-600 mm/s) from horizontal earthquake shaking and one shake-table study. For a short vertical footstep pulse it is unknown whether people lose their footing sooner or later. Above 1 g vertical (g/(2 pi f): 78 mm/s at 20 Hz) the ground briefly lifts people and objects",
    values_json={"engine_option": "footing = min(0.3 m/s, g/(2 pi f)) once f is known, or show both",
                 "one_g_mm_s": {str(f) + " Hz": round(9.80665 / (2 * math.pi * f) * 1000) for f in (5, 10, 20, 40)},
                 "at_20_Hz_0.3_m_s": "3.8 g vertical, 2.4 mm displacement"},
    notes="No standard covers losing footing from ground vibration. 300 mm/s is where EMS-98 VIII ('Many people find it difficult to stand, even outdoors') begins on Wald's PGV scale (310 mm/s) and near where standing subjects on a shake table first lost balance (0.265-0.32 m/s at 0.3-2.5 Hz, an onset set by the test grid; Takahashi et al. 2004). Low end 80 mm/s: EMS-98 VI, 'A few persons lose their balance' (Wald VI from 81 mm/s). High end 600 mm/s: top of VIII. Every anchor is horizontal shaking at 0.3-6 Hz with centimetre displacements. A step's ground motion is mostly vertical and higher in frequency: at 20 Hz, 0.3 m/s means 3.8 g and 2.4 mm. Vertical motion above 1 g briefly unloads the feet, and g/(2 pi f) is below 0.3 m/s for any f above 5.2 Hz. So the direction of the error is unknown. Verifier: dropped 'likely cautious'; added the 1 g marker.")

# ---------------------------------------------------------------- new facts (verifier's missing items, confirmed in its downloaded copies)
def new(key, label, status, value, unit, low, high, display, sources, notes, who, vj=None, why=""):
    d = {"key": key, "category": CAT, "label": label, "status": status, "value_si": value, "unit_si": unit,
         "low_si": low, "high_si": high, "display": display, "sources": sources, "notes": notes, "who_when": who}
    if vj is not None:
        d["values_json"] = json.dumps(vj, ensure_ascii=False)
    facts.append(d); by[key] = d
    changes.append(f"{key}: NEW, {why}")

new("thr_irish_epa_perception",
    "Irish EPA, as summarised in an Irish planning appendix: perception 0.15-0.3 mm/s for continuous vibration, 0.5-1.5 mm/s for impulsive blasting",
    "reported", 0.0005, "m/s", 0.0005, 0.0015,
    "Continuous vibration at 8-80 Hz: 0.15-0.3 mm/s PPV; impulsive vibration from blasting: 0.5-1.5 mm/s PPV",
    [S_PLEANALA],
    "MetroLink EIAR Appendix A14.1, section 14.1.1.1 'Effects on Human Beings' (p. 2): 'The EPA notes that human beings are known to be very sensitive to vibration, the threshold of perception being typically in the PPV range of 0.15mm/s - 0.3mm/s, at frequencies between 8Hz and 80Hz for continuous vibrations, and 0.5mm/s - 1.5mm/s in the case of impulsive vibrations from blasting operations.' This is the EIAR authors' summary, attributed to the Irish EPA; the EPA guidance itself was not opened, hence 'reported'. It supports a higher perception level for a single impulsive event (one step) than for continuous vibration. value_si/low/high = the impulsive range. From the verifier's missing items; text confirmed in the verifier's copy of the PDF.",
    "Irish EPA, via Jacobs IDOM MetroLink EIAR (An Bord Pleanala)",
    {"continuous_8_80_Hz_mm_s": "0.15-0.3", "impulsive_blasting_mm_s": "0.5-1.5"},
    why="Irish EPA perception range for continuous vs impulsive vibration (verifier item 4), status reported because it is a paraphrase")

new("thr_irish_epa_blasting_limits",
    "Irish EPA limits on quarry and mine blasting vibration for people nearby: 12 mm/s for blasting once a week or less, 8 mm/s more often or below 10 Hz",
    "verified", 0.012, "m/s", 0.008, 0.012,
    "12 mm/s PPV for blasting once a week or less; 8 mm/s for more frequent blasting, or when the frequency is below 10 Hz (levels for vibration below 40 Hz)",
    [S_PLEANALA],
    "Quoted in MetroLink EIAR Appendix A14.1, section 14.1.1.1 'Effects on Human Beings' (p. 2), from the EPA's 'Guidance Note for Noise: in Relation to Scheduled Activities 2nd Edition': 'At quarries or mines where blasting occurs once per week or less the vibration levels from blasting should not exceed a peak particle velocity (PPV) of 12mm/s, measured in any three mutually orthogonal directions at a receiving location. For more frequent blasting the peak particle velocity should not exceed 8mm/s. These levels are for low frequency vibration, i.e., less than 40Hz. However, when the frequency of vibration is less than 10Hz the peak particle velocity should not exceed 8mm/s.' Limits for people's tolerance of quarry blasting. The EPA note itself was not opened. From the verifier's missing items; text confirmed in the verifier's copy.",
    "Irish EPA Guidance Note for Noise, 2nd edition, as quoted in the MetroLink EIAR",
    why="Irish EPA blasting limits 12 and 8 mm/s, a direct quote (verifier item 4)")

new("thr_atherton_floor_impact",
    "Atherton (via USBM RI 8507): floor impacts of about 0.2 s at 19 Hz judged 'disturbing' at a mean of 3.5-4.4 in/s floor velocity",
    "verified", 3.5 * 0.0254, "m/s", 3.5 * 0.0254, 4.4 * 0.0254,
    "'Disturbing' at a mean of 3.5-4.4 in/s (89-112 mm/s) peak floor velocity, for impacts of 3-5 cycles at 19 Hz (about 200 ms); over 5 times Goldman's steady-state 'intolerable' 0.77 in/s (20 mm/s) at 20 Hz",
    [S_RI8507],
    "RI 8507 report pp. 62-63: 'Atherton studied impact- and walking-produced floor motions. His impact tests consisted of 3 to 5 cycles of motion at 19 Hz (the floor resonance), or events of approximately 200-msec duration. His \"disturbing\" level mean was 3.5 to 4.4 in/sec, or over 5 times Goldman's steady-state \"intolerable\" level of 0.77 in/sec at 20 Hz.' These are velocities of the floor under the person, not ground PPV, and the response is disturbance, not perception. It is the closest study here to a single footstep in frequency and duration. Atherton's own report was not opened. From the verifier's missing items; text confirmed in the verifier's OCR of RI 8507.",
    "Atherton, via Siskind et al. 1980",
    why="Atherton's footstep-like floor-impact study (verifier item 2)")

new("thr_murray_floor_acceptability",
    "Acceptable floor vibration after a heel-drop impact falls with how long it rings: V <= 0.415 tau^-1.29 in/s (USBM RI 8507 fit to Murray's concrete-floor data)",
    "verified", murray(1) / 1000, "m/s", murray(4) / 1000, murray(0.2) / 1000,
    "Acceptable peak floor velocity: %.0f mm/s if it dies away in 0.2 s, %.0f mm/s in 0.5 s, %.1f mm/s in 1 s, %.1f mm/s in 4 s (tau = time from the peak to 10%% of it)" % (murray(0.2), murray(0.5), murray(1), murray(4)),
    [S_RI8507],
    "RI 8507 report p. 65: Murray's 91 observations of acceptable and unacceptable concrete floors, with amplitude 'from a heel-drop impact', were 'converted into duration-amplitude form', and 'a separation of cases was derived by visual means': V <= 0.415 tau^-1.29, 'where V is the peak floor vibration (in/sec) and tau is the time (sec) from the peak to the minus 20-dB level (or 10 pct of peak amplitude)'. Table 15 lists it for 0.2-4 s but misprints the exponent as +1.29; the sign was checked on the p. 65 page image. 'Murray suggests that his acceptability criteria for concrete floors may be conservative compared with that for wooden floors'. Floor velocity indoors, not ground PPV. The values at each tau are our arithmetic. From the verifier's missing items.",
    "Murray, as refitted by Siskind et al. 1980",
    {"formula": "V <= 0.415 tau^-1.29 (V in/s, tau s), 0.2 <= tau <= 4 s", "mm_s_at_tau": {str(t): round(murray(t), 1) for t in (0.2, 0.5, 1, 2, 4)}},
    why="Murray's heel-drop floor criterion with the correct exponent (verifier items 2 and 5)")

new("thr_ri8507_everyday_activity_house_response",
    "USBM RI 8507: people moving about a house shake its floors far more than the ground thresholds",
    "verified", 0.0127, "m/s", None, None,
    "House strains from everyday activity equal ground vibration of up to 0.50 in/s (12.7 mm/s). Peak midfloor velocity: walking up to 1.49 in/s (38 mm/s), heel drops 5.84 (148 mm/s), jumps 10.1 (257 mm/s); a mine blast with 0.47 in/s (12 mm/s) ground PPV gave 1.18 in/s (30 mm/s)",
    [S_RI8507],
    "RI 8507 'Structure responses from everyday activities' (report pp. 41-42): 'Surprisingly high levels of strain and vibration were generated by the human activities. Comparisons between the blast- and human-produced effects suggests that house superstructures are continuously subjected to transients producing localized strains equivalent to ground vibrations of up to 0.50 in/sec.' Table 6 (read from the page image), two midfloor locations: walking 1.49 and 0.286 in/s; heel drops 4.08 and 5.84; jumps 5.58 and 10.1; mine blasts 1.18 and 0.85 in/s at the living-room midfloor from ground PPV of 0.47 and 0.32 in/s. These are floor velocities inside one test house, not ground PPV. This is the primary behind Caltrans's 'Stagg et al. 1980' equivalents (thr_everyday_household_equivalents). value_si = the ground-equivalent strain level. From the verifier's missing items.",
    "Siskind, Stagg, Kopp & Dowding 1980",
    {"units": "peak structure velocity, in/s (mm/s)", "midfloor_walking": "1.49 (37.8); 0.286 (7.3)", "midfloor_heel_drops": "4.08 (104); 5.84 (148)", "midfloor_jumps": "5.58 (142); 10.1 (257)",
     "midfloor_living_room_mine_blasts": "1.18 (30) from 0.47 in/s ground; 0.85 (21.6) from 0.32 in/s ground"},
    why="primary source for the household equivalents, with indoor floor velocities (verifier item 3)")

new("thr_ri8507_blast_annoyance",
    "USBM RI 8507: share of neighbours annoyed by blast vibration around 0.5 in/s",
    "verified", 0.0127, "m/s", 0.0127, 0.01905,
    "At 0.5-0.75 in/s (13-19 mm/s), about 5-10% of neighbours judge blast vibration unacceptable; a community mean of 0.5 in/s gives 15-30% 'very annoyed' without a public-relations effort; complaints can reach 30% at 0.5 in/s",
    [S_RI8507],
    "RI 8507 abstract: 'Approximately 5 to 10 pct of the neighbors will judge peak particle velocity levels of 0.5 to 0.75 in/sec as \"less than acceptable\" (i.e., unacceptable) based on direct reactions to the vibration.' Report p. 67: 'In the absence of a public relations program, it is expected that a mean ground vibration level of 0.50 in/sec in a community will produce 15 to 30 pct \"very annoyed\" neighbors.' Conclusion 9: 0.5 in/sec from typical 1-s blasting 'should be tolerable to about 95 pct of the people perceiving it as \"distinctly perceptible\"'; the worst problems at home are 'house rattling, fright (fear of damage or injury), being startled'; 'Complaints from these causes can be as high as 30 pct at 0.5 in/sec'. Blasting (with airblast) near homes. From the verifier's missing items; text confirmed in the verifier's OCR.",
    "Siskind, Stagg, Kopp & Dowding 1980",
    why="annoyance shares for the not-so-heroic presets (verifier item 7)")

# ---------------------------------------------------------------- labels in the lab's voice
upd("thr_iso_base_curve_link_to_bs5228", "label says 'our inference', not 'my inference'",
    label="Why BS 5228-2 says 0.14 mm/s: the ISO 2631 base curve as a peak (our inference)")
upd("thr_one_g_vertical", "label says 'our derivation' and names people as well as objects",
    label="Ground velocity at which a vertical shake exceeds 1 g, so loose objects hop and feet are unloaded (our derivation)")

# ---------------------------------------------------------------- finish
for f in facts:
    f["category"] = CAT
    f.setdefault("low_si", None)
    f.setdefault("high_si", None)
    for k in ("value_si", "low_si", "high_si"):
        x = f[k]
        if isinstance(x, float) and len(repr(x).lstrip("0.").replace(".", "")) > 6:
            f[k] = float(f"{x:.4g}")  # tidy computed floats such as 3.5 * 0.0254
changes.append("all facts: category 'thresholds' -> 'presence_thresholds'; missing low_si/high_si set to null")

gaps = """What is still missing or unverified, and what the page should do about it:
- Footstep frequency and duration: the dominant frequency and length of a step's ground vibration are not part of this topic, and the engine's ppvAt has no frequency. The rattle option, the BS 7385-2 curve, the 1 g marker and the footing option all swing with f (rattle 4.4 mm/s at 5 Hz against 1.1 at 20 Hz; 1 g at 312 against 78 mm/s). Until the attenuation research gives f, show frequency-dependent values at a stated assumed frequency and call it an assumption. Caltrans assumes 10-30 Hz for construction and traffic. The verifier thinks the engine's law (k = 0.070 m/s, n = 1.4, E0 = 1 t m) looks like a heavy-tamper dynamic-compaction law, which may be low in frequency; not verified.
- Rattling: no standard, agency guide or measurement gives a ground PPV at which windows or crockery rattle. Caltrans, its TA, FTA and USBM say only that rattling happens at or below perception. The 1 mm/s default comes from earthquake intensity IV acceleration converted at an assumed 20 Hz; it is an estimate and sits above the sources' own statements.
- Losing footing: nothing covers loss of footing under vertical or short impulsive ground motion. The 300 mm/s value rests on horizontal earthquake shaking (EMS-98 wording on Wald 1999 PGV bands) and one small shake-table study whose onset is set by its test grid (Takahashi 2004: 30 young subjects, horizontal sinusoids, 'have not find clear limit value'). Whether footsteps make people lose footing sooner or later is unknown; 1 g vertical, g/(2 pi f), is a physics marker for lift-off.
- Components: Wald/ShakeMap values are the larger horizontal component, Whiffin & Leonard's are vertical, BS 5228-2/7385-2 use the peak component. Which component ppvAt predicts is unstated.
- Paywalled standards not opened: BS 7385-2 (seen via BS 5228-2 and An Bord Pleanala), DIN 4150-3 (1999 via Watercare; 2016 via An Bord Pleanala, whose dwellings 50-100 Hz cell '40 to 50' conflicts with 1999's '15 to 20', so disputed), ISO 2631 (via Caltrans, which dates its guide 1981, and Watercare, which cites the 1989 edition; the 2003 edition's lack of limits is a consultant's statement), BS 6472-1 (only HS2's VDV criteria). The BS 5228-2 A1:2014 footnotes and the Irish EPA guidance were seen only in An Bord Pleanala's reproduction.
- Wald 1999 itself is paywalled; the USGS manual's reproduction was used. Below intensity V its PGV relation was imposed, not fitted; some printed PGA edges above V do not follow the manual's equation. ShakeMap now uses Worden et al. (2012), not fetched.
- Siskind's damage probabilities come from two reproductions (Caltrans, Watercare) that disagree on the last column's heading (90% against 100%); neither was checked against RI 8507's probability plots (figs. 55-59).
- Seen only as reproduced: Whiffin & Leonard (LR 418), Wiss (1974), Wiss & Parmelee (1974), Reiher & Meister (1931), Atherton, Murray, Stagg et al., Chae, Konan, Dowding, AASHTO and the Swiss standard. The FTA manual's official URL returned 403; the identical ROSA P copy was used.
- Indoor response: indoor amplification is sourced only as typical USBM factors (1.5 whole house, 4 midwalls, below 1 above 40 Hz) and the RI 8507 test-house floor velocities. Human criteria are set for people indoors; FTA says ground vibration is 'almost never a problem outdoors'."""

json.dump({"facts": [{k: f[k] for k in ORDER if k in f} for f in facts], "gaps": gaps},
          open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)

# ---------------------------------------------------------------- checks
keys = [f["key"] for f in facts]
assert len(keys) == len(set(keys))
for f in facts:
    assert f["status"] in ("verified", "derived", "estimate", "reported", "disputed"), f["key"]
    for k in ("value_si", "low_si", "high_si"):
        assert f[k] is None or (isinstance(f[k], (int, float)) and math.isfinite(f[k])), (f["key"], k)
    if None not in (f["value_si"], f["low_si"], f["high_si"]):
        assert f["low_si"] <= f["value_si"] <= f["high_si"], f["key"]
    assert f["sources"] and all(s["url"].startswith("https://") for s in f["sources"]), f["key"]
    if "values_json" in f:
        json.loads(f["values_json"])
    if len(f["notes"]) > 920:
        print("LONG NOTES", f["key"], len(f["notes"]))
# status never upgraded
orig = {f["key"]: f["status"] for f in research["facts"]}
rank = {"verified": 3, "derived": 2, "reported": 1, "estimate": 1, "disputed": 0}
for k, s in orig.items():
    assert rank[by[k]["status"]] <= rank[s], k
print("facts", len(facts))
print("\n".join(changes))
json.dump({"changes": changes, "dropped": dropped}, open(BASE + "/compile_thresholds/changes.json", "w"), indent=1)
