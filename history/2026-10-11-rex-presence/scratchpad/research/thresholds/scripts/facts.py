import json, math, sys

CALTRANS = {"title": "Caltrans (2020) Transportation and Construction Vibration Guidance Manual, CT-HWANP-RT-20-365.01.01 (April 2020)", "url": "https://dot.ca.gov/-/media/dot-media/programs/environmental-analysis/documents/env/tcvgm-apr2020-a11y.pdf"}
FTA = {"title": "FTA (2018) Transit Noise and Vibration Impact Assessment Manual, FTA Report No. 0123 (Volpe Center), ROSA P copy of the official PDF", "url": "https://rosap.ntl.bts.gov/view/dot/37056/dot_37056_DS1.pdf"}
BS5228 = {"title": "BS 5228-2:2009 Code of practice for noise and vibration control on construction and open sites, Part 2: Vibration (licensed copy posted by Nottinghamshire County Council), Annex B", "url": "https://www.nottinghamshire.gov.uk/media/110052/british-standard-bs5228-2009.pdf"}
PLEANALA = {"title": "MetroLink EIAR Vol. 5 Appendix A14.1 'Relevant guidance and standards' (Jacobs IDOM), hosted by An Bord Pleanala (Irish planning board); reproduces BS 5228-2:2009+A1:2014, BS 7385-2, DIN 4150-3:2016, HS2 tables", "url": "https://www.pleanala.ie/publicaccess/EIAR-NIS/314724/5_EIAR/Volume%205%20Appendices/Chapter%2014%20Ground-borne%20Noise%20and%20Vibration/A14.1%20Relevant%20guidance%20and%20standards.pdf"}
WATERCARE = {"title": "Watercare Services (Auckland) evidence, P. Millar, Appendix B 'Review of vibration standards' (reproduces DIN 4150-3:1999 Table 1)", "url": "https://assets.watercare.co.nz/media/peter_millar_appendix_b_9d042ff732.pdf"}
RI8507 = {"title": "Siskind, Stagg, Kopp & Dowding (1980) US Bureau of Mines Report of Investigations 8507, Structure Response and Damage Produced by Ground Vibration from Surface Mine Blasting (Pennsylvania DEP copy; scanned, read by OCR and page images)", "url": "https://files.dep.state.pa.us/Mining/BureauOfMiningPrograms/BMPPortalFiles/Blasting_Research_Papers/1980%20Siskind%20RI%208507%20Structure%20Response%20and%20Damage%20Produced%20by%20Ground%20Vibration%20from%20Surface%20Mine%20Blasting%20(No.%2018).pdf"}
EMS98 = {"title": "Grunthal (ed.) (1998) European Macroseismic Scale 1998 (EMS-98), Cahiers du Centre Europeen de Geodynamique et de Seismologie vol. 15 (doi:10.2312/EMS-98); copy hosted by Masaryk University", "url": "https://sid.ipe.muni.cz/ems-98_eng.pdf"}
USGS_SEV = {"title": "USGS, The Severity of an Earthquake (General Interest Publication), abbreviated Modified Mercalli Intensity scale", "url": "https://pubs.usgs.gov/gip/earthq4/severitygip.html"}
SHAKEMAP = {"title": "Wald et al., ShakeMap Manual, USGS Techniques and Methods 12-A1 (version 1.0, 2006), section 2.5 and Figure 2.5 (reproduces Wald, Quitoriano, Heaton & Kanamori 1999, Earthquake Spectra 15(3):557-564)", "url": "https://pubs.usgs.gov/tm/2005/12A01/pdf/508TM12-A1.pdf"}
JMA = {"title": "Japan Meteorological Agency, Tables explaining the JMA Seismic Intensity Scale", "url": "https://www.jma.go.jp/jma/en/Activities/inttable.html"}
TAKA = {"title": "Takahashi, Saito, Azuhata & Ohtomo (2004) Shaking table test on indoor human response and evacuation action limit in strong ground motion, 13th World Conference on Earthquake Engineering, Paper 1320", "url": "https://www.iitk.ac.in/nicee/wcee/article/13_1320.pdf"}

IN = 0.0254  # m per inch
MM = 1e-3

def F(**k):
    k.setdefault("category", "thresholds")
    return k

facts = []

# ---------------- (a) perception ----------------
facts.append(F(
 key="thr_bs5228_2_table_b1_effects",
 label="BS 5228-2 Table B.1: effects of vibration levels on people (construction vibration, PPV)",
 status="verified", value_si=0.3*MM, unit_si="m/s", low_si=0.14*MM, high_si=10*MM,
 display="0.14 mm/s just perceptible (most sensitive); 0.3 mm/s just perceptible in homes; 1.0 mm/s likely complaint; 10 mm/s intolerable beyond a very brief exposure",
 values_json=json.dumps({"units": "PPV, mm/s", "0.14": "Vibration might be just perceptible in the most sensitive situations for most vibration frequencies associated with construction. At lower frequencies, people are less sensitive to vibration.", "0.3": "Vibration might be just perceptible in residential environments.", "1.0": "It is likely that vibration of this level in residential environments will cause complaint, but can be tolerated if prior warning and explanation has been given to residents.", "10": "Vibration is likely to be intolerable for any more than a very brief exposure to this level (A1:2014 adds: in most building environments).", "footnote_A_2014": "The magnitudes of the values presented apply to a measurement position that is representative of the point of entry into the recipient.", "footnote_C_2014": "Single or infrequent occurrences of these levels do not necessarily correspond to the stated effect in every case."}),
 sources=[BS5228, PLEANALA],
 notes="BS 5228-2:2009 Annex B, Table B.1 'Guidance on effects of vibration levels' (p. 36 of the standard). Rows quoted in values_json. The A1:2014 amendment (seen only as reproduced in the An Bord Pleanala appendix, Table 14.12) keeps the four values and adds footnotes A-C: values apply at 'the point of entry into the recipient'; 'A transfer function ... needs to be applied if only external measurements are available'; 'Single or infrequent occurrences of these levels do not necessarily correspond to the stated effect in every case.' Frequency: written for 'most vibration frequencies associated with construction'; 'At lower frequencies, people are less sensitive'. Duration: not stated for each row; the 10 mm/s row refers to exposure time. value_si is the 0.3 mm/s residential row.",
 who_when="BSI 2008 (BS 5228-2:2009, amended A1:2014)"))

facts.append(F(
 key="thr_bs5228_2_perception_range",
 label="BS 5228-2 B.2: human threshold of perception, PPV",
 status="verified", value_si=0.3*MM, unit_si="m/s", low_si=0.14*MM, high_si=0.3*MM,
 display="Threshold of perception typically 0.14-0.3 mm/s PPV",
 sources=[BS5228],
 notes="BS 5228-2:2009 clause B.2 (p. 35): 'Human beings are known to be very sensitive to vibration, the threshold of perception being typically in the PPV range of 0.14 mm/s to 0.3 mm/s. Vibrations above these values can disturb, startle, cause annoyance or interfere with work activities.' Also: 'generally, vertical vibrations are more perceptible than horizontal vibrations, although at very low frequencies this tendency is reversed.' and 'Loose fittings are prone to rattle and movement.' Context is people in buildings exposed to construction vibration.",
 who_when="BSI 2008"))

facts.append(F(
 key="thr_caltrans2020_table20_human_transient_continuous",
 label="Caltrans 2020 Table 20: human response to vibration, transient vs continuous (PPV)",
 status="verified", value_si=0.04*IN, unit_si="m/s", low_si=0.01*IN, high_si=0.04*IN,
 display="Barely perceptible: 0.04 in/s (1.0 mm/s) transient, 0.01 in/s (0.25 mm/s) continuous; distinctly 0.25/0.04 in/s; strongly 0.9/0.10 in/s; severe 2.0/0.4 in/s",
 values_json=json.dumps({"units": "max PPV, in/s (mm/s)", "Barely perceptible": {"transient": "0.04 (1.0)", "continuous_or_frequent_intermittent": "0.01 (0.25)"}, "Distinctly perceptible": {"transient": "0.25 (6.4)", "continuous_or_frequent_intermittent": "0.04 (1.0)"}, "Strongly perceptible": {"transient": "0.9 (22.9)", "continuous_or_frequent_intermittent": "0.10 (2.5)"}, "Severe": {"transient": "2.0 (50.8)", "continuous_or_frequent_intermittent": "0.4 (10.2)"}}),
 sources=[CALTRANS],
 notes="Caltrans 2020, Table 20 'Guideline Vibration Annoyance Potential Criteria' (manual p. 38, PDF p. 62). Note under the table: 'Transient sources create a single isolated vibration event, such as blasting or drop balls. Continuous/frequent intermittent sources include impact pile drivers, pogo-stick compactors, crack-and-seat equipment, vibratory pile drivers, and vibratory compaction equipment.' Caltrans calls it 'a synthesis of criteria' from its Chapter 6 (Reiher 1931, Whiffen 1971, Wiss 1974, ISO 2631). Caltrans states it is 'not an official policy, standard, specification, or regulation'. No frequency range given for Table 20; Caltrans elsewhere assumes 10-30 Hz for construction and traffic sources. value_si = barely perceptible, transient (1.016 mm/s); low_si = barely perceptible, continuous (0.254 mm/s). mm/s = in/s x 25.4.",
 who_when="Caltrans 2020 (Andrews, Buehler, Gill, Bender)"))

facts.append(F(
 key="thr_caltrans2020_source_classes",
 label="Caltrans 2020: which sources count as transient and which as continuous",
 status="verified", value_si=None, unit_si="",
 display="Transient = a single isolated event (blasting, drop balls); continuous/frequent intermittent = repeated impacts or vibratory plant (impact pile drivers, compactors)",
 sources=[CALTRANS],
 notes="Caltrans 2020 section 7.3 (p. 37): 'it is apparent that damage thresholds for continuous sources are less than those for single-event or transient sources ... many types of construction activities fall between a single event and a continuous source. An impact pile driver, for example, continuously generates single transient events. As a practical matter ... the criteria can only be reasonably separated into two categories: continuous and transient.' And: 'This synthesis of criteria essentially assumes that the threshold for continuous sources is about half of the threshold for transient sources.' Relevance: a single stomp is like a drop ball (transient); a walk past is a train of impacts, closer to an impact pile driver (continuous/frequent intermittent). That mapping is my reading, not Caltrans's.",
 who_when="Caltrans 2020"))

facts.append(F(
 key="thr_whiffin_leonard_1971_lr418_people",
 label="Whiffin & Leonard (1971) TRRL LR 418: human reaction to continuous (traffic) vibration, PPV",
 status="verified", value_si=0.3*MM, unit_si="m/s", low_si=0.15*MM, high_si=0.3*MM,
 display="Threshold of perception 0.15-0.30 mm/s (0.006-0.019 in/s); readily perceptible 2.0 mm/s; begins to annoy 2.5 mm/s; annoying 5 mm/s; unpleasant 10-15 mm/s",
 values_json=json.dumps({"units": "PPV vertical, mm/s (in/s)", "0.15-0.30 (0.006-0.019)": "Threshold of perception; possibility of intrusion", "2.0 (0.08)": "Vibrations readily perceptible", "2.5 (0.10)": "Amplitude at which continuous vibrations begin to annoy people", "5.0 (0.20)": "Vibrations annoying to people in buildings", "10-15 (0.4-0.6)": "Vibrations considered unpleasant by people subjected to continuous vibrations and unacceptable to some people walking on bridges"}),
 sources=[CALTRANS],
 notes="As reproduced in Caltrans Technical Advisory TAV-04-01-R0201 (R. Hendriks, 23 January 2004), Table 2 'Reaction of People and Damage to Buildings at Various Continuous Vibration Amplitudes', printed in the appendix of Caltrans 2020 (PDF p. 143), citing 'A Survey of Traffic-induced Vibrations by Whiffen and Leonard, Transport and Road Research Laboratory, RRL Report LR418, Crowthorne, 1971'. Footnote: 'The vibration amplitudes are based on peak particle velocity in the vertical direction. Where human reactions are concerned, the value is at the point at which the person is situated. For buildings, the value refers to the ground motion.' Note the mm/s and in/s columns do not match exactly (0.006-0.019 in/s is 0.15-0.48 mm/s); I keep the mm/s column. Continuous traffic vibration; no frequency range given. The original LR 418 was not opened.",
 who_when="Whiffin & Leonard 1971, via Caltrans TAV-04-01-R0201 (Hendriks 2004) in Caltrans 2020"))

facts.append(F(
 key="thr_wiss1974_transient_people",
 label="Wiss (1974): human response to transient vibration, PPV",
 status="verified", value_si=0.035*IN, unit_si="m/s", low_si=0.035*IN, high_si=2.0*IN,
 display="Barely perceptible 0.035 in/s (0.9 mm/s); distinctly 0.24 in/s (6.1 mm/s); strongly 0.9 in/s (22.9 mm/s); severe 2.0 in/s (50.8 mm/s)",
 sources=[CALTRANS],
 notes="As reproduced in Caltrans 2020 Table 6 'Human Response to Transient Vibration' (p. 22): 2.0 Severe; 0.9 Strongly perceptible; 0.24 Distinctly perceptible; 0.035 Barely perceptible (in/s). Caltrans: 'The results in Tables 4-6 suggest that the thresholds for perception and annoyance are higher for transient vibration than for continuous vibration.' For comparison Caltrans Table 4 (Reiher 1931, steady state): slightly perceptible 0.012 in/s (0.30 mm/s), distinctly 0.035 (0.89), strongly 0.10 (2.5). Original papers not opened.",
 who_when="Wiss 1974; Reiher 1931 (via Caltrans 2020)"))

facts.append(F(
 key="thr_ri8507_duration_dependence_table15",
 label="Human perception rises steeply as the event gets shorter (USBM RI 8507 Table 15)",
 status="verified", value_si=0.130*IN, unit_si="m/s", low_si=0.011*IN, high_si=0.130*IN,
 display="Barely perceptible (mean): 0.130 in/s (3.3 mm/s) for a 0.5 s event, 0.095 (2.4) at 1 s, 0.033 (0.84) at 5 s, 0.020 (0.51) at 300 s; most-sensitive threshold 0.011 in/s (0.28 mm/s)",
 values_json=json.dumps({"units": "PPV in/s (mm/s); duration s", "barely_perceptible": {"mean_0.5s": "0.130 (3.3) W&P", "mean_1s": "0.095 (2.4) W&P", "mean_5s": "0.033 (0.84) W&P", "mean_300s": "0.020 (0.51) R&M", "threshold_5s": "0.011 (0.28) W&P", "threshold_300s": "0.011 (0.28) R&M"}, "distinctly_perceptible": {"mean_0.5s": "0.700 (17.8)", "mean_1s": "0.500 (12.7)", "mean_5s": "0.280 (7.1)", "mean_300s": "0.060 (1.5)", "threshold_0.5s": "0.300 (7.6)", "threshold_1s": "0.230 (5.8)", "threshold_5s": "0.100 (2.5)", "threshold_300s": "0.033 (0.84)"}, "strongly_perceptible": {"mean_0.5s": "1.400 (35.6)", "mean_1s": "1.150 (29.2)", "mean_5s": "0.630 (16.0)", "mean_300s": "0.170 (4.3) at 9 Hz", "threshold_0.5s": "0.910 (23.1)", "threshold_1s": "0.810 (20.6)", "threshold_5s": "0.390 (9.9)", "threshold_300s": "0.102 (2.6)"}, "severe": {"mean_300s": "0.550 (14.0) at 9 Hz", "threshold_5s": "1.13 (28.7)", "threshold_300s": "0.301 (7.6)"}, "acceptable_Murray": "<= 0.415 tau^1.29 in/s for durations 0.2-4 s", "sources": "W&P = Wiss and Parmelee (1974); R&M = Reiher and Meister (1931)"}),
 sources=[RI8507],
 notes="RI 8507 Table 15 'Subjective responses of humans to vibrations of various durations' (report p. 67, PDF p. 71), read from a 300 dpi page image; all digits checked by eye. Text (p. 65): 'In cases where distinctly perceptible applies (i.e., infrequent and short-duration events), these results suggest that levels of over 0.5 in/sec could be tolerated. The barely perceptible levels are still below 0.1 in/sec ... The studies just discussed all involve people in a test situation rather than in their own homes. None of the problems of damage fear, startle, house rattle, and other secondary effects were present. Undoubtedly, the addition of such effects lowers the thresholds at which people react.' Earlier (p. 62): Reiher and Meister's 'slightly perceptible' 0.010-0.033 in/s and 'strongly perceptible' 0.10 in/s were 'essentially independent of frequency over the range 4 to 25 Hz'. Relevance: a single footstep is a short event, so the mean barely-perceptible level for 0.5-1 s events (2.4-3.3 mm/s) is far above the 0.3 mm/s quoted for continuous vibration, but the most sensitive people still notice about 0.28 mm/s.",
 who_when="Siskind et al. 1980, citing Wiss & Parmelee 1974 and Reiher & Meister 1931"))

facts.append(F(
 key="thr_iso2631_1989_building_criteria",
 label="ISO 2631 (1989) building vibration criteria (8-80 Hz), rms velocity",
 status="verified", value_si=0.008*IN, unit_si="m/s", low_si=0.004*IN, high_si=0.032*IN,
 display="Residence 78 VdB day / 75 night = 0.008 in/s rms (0.20 mm/s rms); operating room 72 VdB = 0.004 in/s rms (0.10 mm/s rms); office 0.016 in/s; workshop 0.032 in/s",
 values_json=json.dumps({"units": "rms velocity in/s (mm/s); VdB re 1 micro-in/s", "Workshop": "90 VdB, 0.032 (0.81)", "Office": "84 VdB, 0.016 (0.41)", "Residence": "78 VdB day / 75 night, 0.008 (0.20)", "Hospital operating room": "72 VdB, 0.004 (0.10)"}),
 sources=[CALTRANS],
 notes="As reproduced in Caltrans 2020 Table 7 'ISO 2631 Vibration Criteria' (p. 22). Caltrans: ISO 2631 'suggested that humans are sensitive to particle velocity in the range of 8-80 Hz ... Below 8 Hz, the body is less sensitive to vibration, and therefore responds more uniformly to acceleration (i.e., higher velocities are needed to elicit the same response). Table 7 summarizes the vibration criteria in ISO 2631 for vibration sources with predominant frequencies in the range of 8-80 Hz.' These are rms values, not PPV; for a sine wave PPV = 1.41 x rms, for impulsive signals much more (see thr_fta2018_crest_factor). The ISO standard itself (paywalled) was not opened. The 2003 revision of ISO 2631-2 is reported to contain no limit values (thr_iso2631_2_2003_no_limits).",
 who_when="ISO 2631-2:1989 via Caltrans 2020"))

facts.append(F(
 key="thr_iso2631_2_2003_no_limits",
 label="ISO 2631-2: 1989 edition limits in PPV terms, and the 2003 edition's lack of limits",
 status="reported", value_si=0.3*MM, unit_si="m/s", low_si=0.14*MM, high_si=10*MM,
 display="1989 edition: about 0.3 mm/s PPV for continuous vibration by day, 0.14 mm/s at night, 5-10 mm/s for transient events; 2003 edition has no vibration limits",
 sources=[WATERCARE],
 notes="Expert evidence for Watercare (Auckland), Appendix B para 1-2: 'The 1989 Standard recommends a ppV limit of about 0.3 mm/s for continuous vibrations during the day, which is at perception levels, while a ppV limit of 5-10 mm/s is recommended for transient (short time frame) events. A considerably lower limit of 0.14 mm/s is recommended at night.' and 'superseded in 2003 by an informative standard which contains no vibration limits'. Secondary source (a consultant's evidence), hence 'reported'. Consistent with FTA 2018 (p. 118): the 2003 ISO 2631-2 'acknowledges that human response to vibration in buildings is very complex' and 'the degree of annoyance cannot always be explained by the magnitude of the vibration alone'. ISO text not opened (paywalled).",
 who_when="P. Millar for Watercare (undated evidence, c. 2010s)"))

facts.append(F(
 key="thr_iso_base_curve_link_to_bs5228",
 label="Why BS 5228-2 says 0.14 mm/s: the ISO 2631 base curve as a peak (my inference)",
 status="derived", value_si=0.1*MM*math.sqrt(2), unit_si="m/s",
 display="ISO base curve 0.10 mm/s rms x 1.41 = 0.14 mm/s peak; residence x2-4 = 0.28-0.57 mm/s peak",
 sources=[CALTRANS, BS5228],
 notes="Inference, not stated by either source. Caltrans Table 7 gives the ISO 2631 operating-theatre criterion (the base curve) as 0.004 in/s rms = 0.10 mm/s rms. For a sine wave, peak = rms x sqrt(2) = 0.144 mm/s, which matches BS 5228-2's 'just perceptible in the most sensitive situations' 0.14 mm/s. The residential day criterion (0.008 in/s rms = 0.20 mm/s rms) gives 0.29 mm/s peak, matching BS 5228-2's residential 0.3 mm/s. This supports reading both BS numbers as the ISO base curve and its residential multiple, valid in the 8-80 Hz band.",
 who_when="Derived here from Caltrans 2020 Table 7 and BS 5228-2:2009"))

facts.append(F(
 key="thr_fta2018_human_response_vdb",
 label="FTA 2018: human response to ground-borne vibration in buildings (rms velocity level)",
 status="verified", value_si=None, unit_si="dB re 1 micro-in/s (rms)",
 display="65 VdB approximate threshold of perception (about 0.045 mm/s rms, about 0.2 mm/s PPV); 75 VdB barely-to-distinctly perceptible boundary; 85 VdB tolerable only if infrequent; 100 VdB damage threshold for typical buildings",
 values_json=json.dumps({"units": "VdB re 1e-6 in/s rms; mm/s rms; PPV via crest factor 4-5 (derived)", "50 VdB": "typical background in residential areas (0.008 mm/s rms)", "65 VdB": "Approximate threshold of perception for many humans (0.045 mm/s rms; PPV about 0.18-0.23 mm/s)", "75 VdB": "Approximate dividing line between barely perceptible and distinctly perceptible. Many people find transit vibration at this level annoying (0.14 mm/s rms; PPV about 0.57-0.71)", "85 VdB": "Vibration tolerable only if there are an infrequent number of events per day (0.45 mm/s rms; PPV about 1.8-2.3)", "100 VdB": "threshold of potential damage for typical buildings (2.5 mm/s rms; PPV about 10-13)"}),
 sources=[FTA],
 notes="FTA 2018 section 5.1-5.5: 'The background vibration velocity level in residential areas is usually 50 VdB or lower, and the threshold of perception for humans is approximately 65 VdB. A vibration level of 85 VdB in a residence can result in strong annoyance.' (p. 113). Table 5-5 'Human Response to Different Levels of Ground-Borne Vibration and Noise' (p. 120) gives the 65/75/85 VdB rows quoted. 'A vibration level that causes annoyance is well below the damage risk threshold for typical buildings (100 VdB).' (p. 118). VdB = 20 log10(v_rms / 1e-6 in/s) (Eq. 5-1, p. 111). Conversions (mine): 65 VdB = 1.78e-3 in/s rms = 0.045 mm/s rms; PPV = crest factor x rms, with FTA's own crest factor of 4 (used for its Table 7-5) to 5 (trains). These criteria are for repeated transit events measured inside buildings; Table 6-2 defines frequent events as more than 70 per day, occasional 30-70, infrequent fewer than 30 (Caltrans 2020 Table 8's note misprints 'fewer than 70').",
 who_when="FTA 2018 (Quagliata, Ahearn, Boeker, Roof, Meister, Singleton)"))

facts.append(F(
 key="thr_fta2018_crest_factor",
 label="Crest factor: peak (PPV) to rms ratio of a vibration signal",
 status="verified", value_si=4, unit_si="1", low_si=1.41, high_si=8,
 display="Typically above 1.41; 4-5 for train vibration; 8 or more is not unusual for impulsive signals; FTA uses 4 to convert PPV limits to rms",
 sources=[FTA],
 notes="FTA 2018 footnote viii (p. 111): 'The ratio of PPV to maximum rms amplitude is defined as the crest factor for the signal. The crest factor is typically greater than 1.41, although a crest factor of 8 or more is not unusual for impulsive signals. For ground-borne vibration from trains, the crest factor is usually 4 to 5.' Section 7.2 (p. 185): 'The approximate rms vibration velocity levels were calculated from the PPV limits using a crest factor of 4.' Also: rms 'is typically calculated over a one-second period' (p. 111). Relevance: a footstep is impulsive, so an rms-based perception criterion (ISO, FTA) corresponds to a higher PPV than for steady vibration.",
 who_when="FTA 2018"))

facts.append(F(
 key="thr_fta2018_outdoors",
 label="FTA 2018: ground vibration is felt differently outdoors",
 status="verified", value_si=None, unit_si="",
 display="'Ground-borne vibration is almost never a problem outdoors' (no number)",
 sources=[FTA],
 notes="FTA 2018 section 5.5 (p. 118): 'Ground-borne vibration is almost never a problem outdoors. Although the motion of the ground may be perceived, without the effects associated with the shaking of a building, the motion does not provoke the same adverse human reaction.' Also (p. 117): 'The effects of ground-borne vibration can include perceptible movement of floors in buildings, rattling of windows, shaking of items on shelves or hanging on walls, and low-frequency noise'. Relevance: the Walk tab's listener may stand outdoors; all the perception criteria here were set for people inside buildings.",
 who_when="FTA 2018"))

facts.append(F(
 key="thr_bs6472_1_vdv_hs2",
 label="BS 6472-1 vibration dose value (VDV) criteria as used by HS2 (homes)",
 status="verified", value_si=0.2, unit_si="m/s^1.75", low_si=0.1, high_si=0.8,
 display="Lowest observed adverse effect: VDV 0.2 m/s^1.75 by day, 0.1 at night; significant adverse effect: 0.8 by day, 0.4 at night",
 sources=[PLEANALA],
 notes="As reproduced in An Bord Pleanala Appendix A14.1 Table 14.13, 'table from HS2 Information Paper E21, based on the VDV method of BS 6472-1:2008': LOAEL VDVday 0.2, VDVnight 0.1; SOAEL VDVday 0.8, VDVnight 0.4 m/s^1.75. VDV = (integral of frequency-weighted acceleration^4 dt)^(1/4) over the day or night, so it depends on how many steps and for how long; it does not convert to a single PPV. BS 5228-2 (B.2) chooses PPV instead for construction: 'for construction it is considered more appropriate to provide guidance in terms of the PPV'. BS 6472-1 itself (paywalled) not opened. Not recommended for the page beyond a mention.",
 who_when="HS2 Information Paper E21, based on BS 6472-1:2008 (via Jacobs IDOM EIAR)"))

# ---------------- (b) rattling ----------------
facts.append(F(
 key="thr_rattle_below_perception_caltrans",
 label="Caltrans: rattling of dishes, windows and doors can happen below the level people feel",
 status="verified", value_si=None, unit_si="",
 display="Rattling of a china cabinet 'can also occur, even when vibration levels are well below perception' (no number)",
 sources=[CALTRANS],
 notes="Caltrans 2020 Chapter 5 (p. 19): 'secondary effects, such as the rattling of a china cabinet, can also occur, even when vibration levels are well below perception.' Caltrans TA V-04-01 (appendix, PDF p. 143-144): 'Frequently, low amplitude traffic vibrations can cause irritating secondary vibrations, such as a slight rattling of doors, windows, stacked dishes, etc. These objects are often in a state of neutral equilibrium and readily respond to very low amplitudes of vibrations. The rattling sound gives rise to exaggerated vibration complaints, even though there is very little risk of damage.' Same TA (PDF p. 149): 'The threshold of perception, or roughly 0.25 mm/s (0.01 in/sec) may be considered annoying by those people. Low amplitude vibrations may also cause secondary vibrations and audible effects such as a slight rattling of doors, windows and dishes'. No source here gives a numeric rattling threshold.",
 who_when="Caltrans 2020; Caltrans TAV-04-01-R0201 (Hendriks 2004)"))

facts.append(F(
 key="thr_rattle_ri8507_midwall",
 label="USBM RI 8507: wall motion rattles windows and dishes; walls amplify ground motion",
 status="verified", value_si=4, unit_si="1", low_si=1.5, high_si=4,
 display="Midwall motion causes 'window sashes rattling, picture frames tilting, dishes jiggling, and knick-knacks falling'; typical amplification 1.5 (whole house, 4-12 Hz) and 4 (midwalls, 10-25 Hz) at resonance; below 1 above 40 Hz",
 sources=[RI8507],
 notes="RI 8507 abstract (p. 1): 'These vibrations produce not only structure resonances (4 to 12 Hz for whole structures and 10 to 25 Hz for midwalls) ... Structure response amplification factors were measured; typical values were 1.5 for structures as a whole (racking) and 4 for midwalls, at their respective resonance frequencies. For blast vibrations above 40 Hz, all amplification factors for frame residential structures were less than unity.' p. 18: 'Midwall motions (normal to the wall surface) were also measured and are primarily responsible for window sashes rattling, picture frames tilting, dishes jiggling, and knick-knacks falling.' p. 6: 'Many examples of continual complaints about severe rattling at levels below 0.5 in/sec [12.7 mm/s] are attributable to the low frequencies.' p. 62: human response is complicated by 'the many secondary effects of wall-produced window, dish, and bric-a-brac rattling. Persons inside buildings will hear and feel the predominantly 5- to 25-Hz structure midwall and midfloor response vibrations.' Abstract: 'The human response and annoyance problem from ground vibration is aggravated by wall rattling, secondary noises, and the presence of airblast.' No rattle threshold is given. value_si = midwall factor.",
 who_when="Siskind et al. 1980"))

facts.append(F(
 key="thr_rattle_ems98",
 label="EMS-98 intensity IV-V: china, glasses, windows and doors rattle",
 status="verified", value_si=None, unit_si="",
 display="IV 'Largely observed': china, glasses, windows and doors rattle; V 'Strong': china and glasses clatter, small top-heavy objects may fall, liquids oscillate",
 sources=[EMS98],
 notes="EMS-98 core scale (PDF p. 19): 'IV. Largely observed: a) The earthquake is felt indoors by many and felt outdoors only by very few. A few people are awakened. The level of vibration is not frightening ... b) China, glasses, windows and doors rattle. Hanging objects swing. Light furniture shakes visibly in a few cases. Woodwork creaks in a few cases. c) No damage.' 'V. Strong: ... b) Hanging objects swing considerably. China and glasses clatter together. Small, top-heavy and/or precariously supported objects may be shifted or fall down. Doors and windows swing open or shut. In a few cases window panes break. Liquids oscillate and may spill from well-filled containers.' 'III. Weak: ... Hanging objects swing slightly.' EMS-98 is a descriptive scale with no ground-motion values; for numbers see thr_wald1999_shakemap_intensity_table (California MMI, assumed roughly equal to EMS at these levels).",
 who_when="Grunthal (ed.) 1998"))

facts.append(F(
 key="thr_usgs_mmi_abridged",
 label="USGS abbreviated Modified Mercalli Intensity: II to VI",
 status="verified", value_si=None, unit_si="",
 display="IV: 'Dishes, windows, doors disturbed; walls make cracking sound. Sensation like heavy truck striking building.' V: 'some dishes, windows broken. Unstable objects overturned.'",
 sources=[USGS_SEV],
 notes="USGS 'The Severity of an Earthquake', abbreviated MMI (Wood & Neumann 1931): II 'Felt only by a few persons at rest, especially on upper floors of buildings. Delicately suspended objects may swing.' III 'Felt quite noticeably by persons indoors ... Vibration similar to the passing of a truck.' IV 'Felt indoors by many, outdoors by few during the day. At night, some awakened. Dishes, windows, doors disturbed; walls make cracking sound. Sensation like heavy truck striking building. Standing motor cars rocked noticeably.' V 'Felt by nearly everyone; many awakened. some dishes, windows broken. Unstable objects overturned.' VI 'Felt by all, many frightened. Some heavy furniture moved; a few instances of fallen plaster. Damage slight.' This abbreviated version has no 'difficult to stand' wording; EMS-98 and JMA do.",
 who_when="USGS (Wood & Neumann 1931 scale)"))

facts.append(F(
 key="thr_jma_intensity_descriptions",
 label="JMA seismic intensity scale: dishes rattle (3-4), walking hard (5 Upper), standing hard (6 Lower)",
 status="verified", value_si=None, unit_si="",
 display="3: dishes in cupboards may rattle; 4: dishes rattle, unstable ornaments may fall; 5 Upper: walking difficult without holding on; 6 Lower: difficult to remain standing; 6 Upper: impossible to remain standing",
 sources=[JMA],
 notes="JMA table, human perception and indoor situation: '3 Felt by most people in buildings. Felt by some people walking ... Dishes in cupboards may rattle.' '4 Most people are startled ... dishes in cupboards rattle. Unstable ornaments may fall.' '5 Lower Many people are frightened and feel the need to hold onto something stable ... Many unstable ornaments fall.' '5 Upper Many people find it hard to move; walking is difficult without holding onto something stable.' '6 Lower It is difficult to remain standing.' '6 Upper It is impossible to remain standing or move without crawling. People may be thrown through the air.' The page gives no ground-motion values (JMA intensity is computed from filtered acceleration); no PGV is attached here.",
 who_when="Japan Meteorological Agency (current table)"))

facts.append(F(
 key="thr_wald1999_shakemap_intensity_table",
 label="Peak ground velocity and acceleration for each Modified Mercalli intensity (Wald et al. 1999, California)",
 status="verified", value_si=0.011, unit_si="m/s", low_si=0.011, high_si=0.034,
 display="MMI IV (dishes, windows rattle): PGV 1.1-3.4 cm/s (11-34 mm/s), PGA 1.4-3.9 %g; VI 8.1-16 cm/s; VII 16-31 cm/s; VIII 31-60 cm/s",
 values_json=json.dumps({"units": "PGV cm/s (mm/s); PGA %g (m/s^2)", "I Not felt": {"PGV": "<0.1 (<1)", "PGA": "<0.17 (<0.017)", "damage": "none"}, "II-III Weak": {"PGV": "0.1-1.1 (1-11)", "PGA": "0.17-1.4 (0.017-0.14)", "damage": "none"}, "IV Light": {"PGV": "1.1-3.4 (11-34)", "PGA": "1.4-3.9 (0.14-0.38)", "damage": "none"}, "V Moderate": {"PGV": "3.4-8.1 (34-81)", "PGA": "3.9-9.2 (0.38-0.90)", "damage": "very light"}, "VI Strong": {"PGV": "8.1-16 (81-160)", "PGA": "9.2-18 (0.90-1.8)", "damage": "light"}, "VII Very strong": {"PGV": "16-31 (160-310)", "PGA": "18-34 (1.8-3.3)", "damage": "moderate"}, "VIII Severe": {"PGV": "31-60 (310-600)", "PGA": "34-65 (3.3-6.4)", "damage": "moderate/heavy"}, "IX Violent": {"PGV": "60-116 (600-1160)", "PGA": "65-124 (6.4-12.2)", "damage": "heavy"}, "X+ Extreme": {"PGV": ">116 (>1160)", "PGA": ">124 (>12.2)", "damage": "very heavy"}}),
 sources=[SHAKEMAP],
 notes="USGS TM 12-A1, Figure 2.5 'ShakeMap Instrumental Intensity Scale Legend' (p. 56), read from a 300 dpi page image; reproduces the Wald et al. (1999) regressions. I reproduced each band edge from the manual's equations (rounding convention 'values between 5.50 and 6.49 round to intensity VI'): PGV edges from Imm = 2.10 log PGV + 3.40 below V and Imm = 3.47 log PGV + 2.35 from V up (PGV in cm/s); PGA edges below V from Imm = 2.20 log PGA + 1.00 (PGA in cm/s^2). The manual warns these are 'instrumental intensities ... not based on observations of the earthquake effects on people or structures'. Ground motions are free-field station records (largest horizontal component) from eight California earthquakes; durations are many seconds. The original paper (Earthquake Spectra 15(3):557-564, doi:10.1193/1.1586058) was not opened (paywalled). ShakeMap now uses Worden et al. (2012) instead, with different ranges; not fetched. value_si/low/high = MMI IV PGV band.",
 who_when="Wald, Quitoriano, Heaton & Kanamori 1999 (via USGS ShakeMap manual, Wald et al. 2006)"))

facts.append(F(
 key="thr_wald1999_low_intensity_caveat",
 label="Wald 1999: below intensity V the velocity values are imposed, not fitted, and low intensities follow acceleration",
 status="verified", value_si=None, unit_si="m/s^2", low_si=0.01, high_si=0.02,
 display="Felt/not-felt boundary about 1-2 cm/s^2 peak acceleration; the low-intensity PGV relation was imposed to join it",
 sources=[SHAKEMAP],
 notes="USGS TM 12-A1 p. 55: 'Because we are also interested in estimating intensity at lower values, and our current collection of data from historical earthquakes does not provide constraints for lower intensity, we have imposed the following relationship between PGA and Imm: Imm = 2.20 log (PGA) + 1.00 ... We determined that the boundary between not felt and felt (Imm I and II, respectively) regions corresponds to approximately 1 to 2 cm/s/s, at least for this range of magnitudes [M 3.5-5.0] ... The corresponding equation for PGV and Imm is: Imm = 2.10 log (PGV) + 3.40'. And: 'Using peak acceleration to estimate low intensities is intuitively consistent with the notion that lower (<VI) intensities are assigned based on felt accounts, and people are more sensitive to ground acceleration than velocity.' So the MMI IV velocity band (11-34 mm/s) is weakly constrained; its acceleration band (0.14-0.38 m/s^2) is the better guide.",
 who_when="Wald et al. 1999 via USGS TM 12-A1"))

facts.append(F(
 key="thr_earthquake_frequency_vs_intensity",
 label="Earthquake shaking that sets intensity is low in frequency (Sokolov 1998, via USGS)",
 status="verified", value_si=None, unit_si="Hz",
 display="Intensity V-VII best matches 3-6 Hz shaking; the lowest intensities 7-8 Hz; above VIII 0.7-1.0 Hz. The Wald 1999 PGA/PGV bands imply about 1.7-2.7 Hz",
 sources=[SHAKEMAP],
 notes="USGS TM 12-A1 p. 55: 'seismic intensities correlate well for rather narrow ranges of Fourier amplitude spectra of ground acceleration, with 0.7-1.0 Hz being most representative of Imm > VIII, whereas the 3-6 Hz range best represents Imm V to VII, and the 7-8 Hz range best correlates with the lowest Imm range.' Derived (mine): dividing each Wald band's PGA by 2 pi x its PGV gives an equivalent sine frequency of 2.0-2.7 Hz for II-III and 1.7-2.0 Hz for IV-VIII. Footstep vibration is expected to be higher in frequency and much shorter (one pulse per step); its dominant frequency should come from the attenuation research.",
 who_when="Sokolov 1998 via Wald et al. 2006"))

facts.append(F(
 key="thr_rattle_mmi4_accel_at_footstep_frequency",
 label="Rattling level converted to footstep frequencies via acceleration (my derivation)",
 status="derived", value_si=1.1*MM, unit_si="m/s", low_si=0.73*MM, high_si=6.1*MM,
 display="MMI IV acceleration (1.4-3.9 %g = 0.14-0.38 m/s^2) equals PPV 1.1-3.0 mm/s at 20 Hz, 2.2-6.1 mm/s at 10 Hz, 0.7-2.0 mm/s at 30 Hz",
 sources=[SHAKEMAP, CALTRANS, BS5228],
 notes="Formula: PPV = a / (2 pi f) for a sinusoid, with a = MMI IV PGA band (Wald 1999) and f the footstep vibration's dominant frequency. 0.137 m/s^2 / (2 pi x 20 Hz) = 1.09 mm/s; 0.383 / (2 pi x 20) = 3.04 mm/s. Rationale: Wald et al. say low intensities follow acceleration, and ISO 2631 (via Caltrans) says people respond to acceleration below 8 Hz but to velocity at 8-80 Hz, so neither PGV nor PGA transfers exactly; acceleration is the better fit for loose objects, which rattle when their supports accelerate. Check: the felt/not-felt boundary (0.17 %g = 0.017 m/s^2) gives 0.13 mm/s at 20 Hz, close to BS 5228-2's 'just perceptible in the most sensitive situations' 0.14 mm/s, which supports the method. Ignores: duration (earthquakes last seconds to minutes; a footstep is one short pulse), building resonance (midwalls amplify up to 4 times at 10-25 Hz, RI 8507), and the outdoor ground versus indoor floor difference. Treat as an estimate band, not a measured threshold.",
 who_when="Derived here from Wald et al. 1999 (via USGS 2006)"))

facts.append(F(
 key="thr_one_g_vertical",
 label="Ground velocity at which a vertical shake exceeds 1 g (loose objects hop) (my derivation)",
 status="derived", value_si=0.078, unit_si="m/s", low_si=0.039, high_si=0.156,
 display="PPV = g / (2 pi f): 156 mm/s at 10 Hz, 78 mm/s at 20 Hz, 52 mm/s at 30 Hz, 39 mm/s at 40 Hz",
 sources=[SHAKEMAP],
 notes="Physics, not a published threshold: for sinusoidal vertical motion of amplitude v (velocity), peak acceleration is 2 pi f v; when that exceeds g = 9.80665 m/s^2 an unattached object on the ground momentarily loses contact. v = 9.80665 / (2 pi f). Shows why a fixed PPV threshold cannot cover both earthquakes (about 2 Hz) and footsteps (higher): at 2 Hz the same 1 g would need 780 mm/s. Objects slide sideways at lower acceleration (friction coefficient times g). The USGS source is listed only for the frequency context; the formula is standard kinematics.",
 who_when="Derived here"))

# ---------------- (c) cosmetic damage ----------------
facts.append(F(
 key="thr_bs7385_2_table1_cosmetic",
 label="BS 7385-2 Table 1: transient vibration guide values for cosmetic damage (frequency-dependent)",
 status="verified", value_si=15*MM, unit_si="m/s", low_si=15*MM, high_si=50*MM,
 display="Homes and light commercial (line 2): 15 mm/s at 4 Hz rising to 20 mm/s at 15 Hz and 50 mm/s at 40 Hz and above; below 4 Hz, 0.6 mm displacement. Framed and industrial (line 1): 50 mm/s at 4 Hz and above",
 values_json=json.dumps({"units": "peak component particle velocity, mm/s, at the base of the building; transient vibration", "line 1 Reinforced or framed structures; industrial and heavy commercial buildings": {"4-15 Hz": "50 at 4 Hz and above", "15 Hz and above": "50 at 4 Hz and above"}, "line 2 Unreinforced or light framed structures; residential or light commercial buildings": {"4-15 Hz": "15 at 4 Hz increasing to 20 at 15 Hz", "15 Hz and above": "20 at 15 Hz increasing to 50 at 40 Hz and above"}, "note 2": "For line 2, at frequencies below 4 Hz, a maximum displacement of 0.6 mm (zero to peak) is not to be exceeded (15.1 mm/s at 4 Hz)."}),
 sources=[BS5228, PLEANALA],
 notes="BS 7385-2:1993 Table 1 as reproduced in BS 5228-2:2009 Table B.2 and Figure B.1 (p. 38), and again in An Bord Pleanala Table 14.1 (citing BS 7385-2:1993 and BS 5228-2:2009+A1:2014). Notes: 'Values referred to are at the base of the building.' BS 5228-2 B.3.2: 'Strains imposed in a building by ground motion will tend to be greater if lower frequencies predominate ... The dominant frequency to use for the assessment is that associated with the greatest amplitude.' 'Limits for transient vibration, above which cosmetic damage could occur'. Figure B.1 draws the lines on logarithmic axes (4-250 Hz, 10-100 mm/s); the text does not say how to interpolate. BS 7385-2 itself (paywalled) not opened. value_si = line 2 at 4 Hz.",
 who_when="BSI 1993 (BS 7385-2), as reproduced in BS 5228-2:2009"))

facts.append(F(
 key="thr_bs7385_2_multipliers_and_continuous",
 label="BS 7385-2 via BS 5228-2: minor damage at 2x, major at 4x the guide values; up to 50% lower for continuous vibration",
 status="verified", value_si=2, unit_si="1", low_si=0.5, high_si=4,
 display="Minor damage possible above 2x Table B.2; major damage above 4x; for continuous vibration with resonance, reduce guide values by up to 50%",
 sources=[BS5228, PLEANALA],
 notes="BS 5228-2:2009 p. 38: 'Minor damage is possible at vibration magnitudes which are greater than twice those given in Table B.2, and major damage to a building structure can occur at values greater than four times the tabulated values. ... The guide values in Table B.2 relate predominantly to transient vibration which does not give rise to resonant responses in structures, and to low-rise buildings. Where the dynamic loading caused by continuous vibration is such as to give rise to dynamic magnification due to resonance, especially at the lower frequencies where lower guide values apply, then the guide values in Table B.2 might need to be reduced by up to 50%.' BS 7385-2 note quoted by An Bord Pleanala: 'There are insufficient cases where continuous vibration has caused damage to buildings to substantiate these guide values, but they are based on common practice'. Useful for the not-so-heroic presets: minor damage to homes from about 30-100 mm/s and major from about 60-200 mm/s, depending on frequency (2x and 4x of 15-50 mm/s).",
 who_when="BSI 1993/2008"))

facts.append(F(
 key="thr_bs7385_2_damage_probability_zero",
 label="BS 7385-2: probability of damage tends to zero at 12.5 mm/s",
 status="verified", value_si=12.5*MM, unit_si="m/s",
 display="12.5 mm/s peak component particle velocity",
 sources=[BS5228, PLEANALA],
 notes="BS 5228-2:2009 p. 39: 'BS 7385-2 notes that the probability of damage tends towards zero at 12.5 mm/s peak component particle velocity.' Same sentence in An Bord Pleanala A14.1 p. 2. Also: 'A building of historical value should not (unless it is structurally unsound) be assumed to be more sensitive.' Matches the USBM 0.5 in/s (12.7 mm/s) plaster safe level.",
 who_when="BSI 1993 via BS 5228-2:2009"))

facts.append(F(
 key="thr_din4150_3_1999_table1",
 label="DIN 4150-3:1999 Table 1: short-term vibration guideline values for buildings, by frequency",
 status="verified", value_si=5*MM, unit_si="m/s", low_si=3*MM, high_si=50*MM,
 display="Dwellings: 5 mm/s below 10 Hz, 5-15 mm/s at 10-50 Hz, 15-20 mm/s at 50-100 Hz (foundation); 15 mm/s top floor. Sensitive or listed: 3, 3-8, 8-10, 8. Commercial: 20, 20-40, 40-50, 40",
 values_json=json.dumps({"units": "peak particle velocity, mm/s; foundation by frequency band, plus plane of uppermost floor (all frequencies)", "line 1 commercial, industrial and similar": {"<10 Hz": "20", "10-50 Hz": "20 to 40", "50-100 Hz": "40 to 50", "uppermost floor": "40"}, "line 2 dwellings and similar": {"<10 Hz": "5", "10-50 Hz": "5 to 15", "50-100 Hz": "15 to 20", "uppermost floor": "15"}, "line 3 sensitive, of great intrinsic value (e.g. preservation order)": {"<10 Hz": "3", "10-50 Hz": "3 to 8", "50-100 Hz": "8 to 10", "uppermost floor": "8"}, "footnote": "For frequencies above 100 Hz, at least the values specified in this column shall be applied"}),
 sources=[WATERCARE],
 notes="As reproduced in Watercare evidence Appendix B, 'Table 2: Guideline values of vibration velocity, for evaluating the effects of short-term vibration, DIN4150-3:1999'. Short-term vibration means vibration that does not occur often enough to cause fatigue or resonance (standard's definition, seen only in search snippets, not confirmed). DIN is stricter than BS 7385-2 at low frequencies (5 mm/s vs 15 mm/s for homes below 10 Hz). Values are guideline values intended to avoid even minor damage. DIN 4150-3 itself (paywalled) not opened. value_si = dwellings below 10 Hz.",
 who_when="DIN 1999, via Watercare (Auckland)"))

facts.append(F(
 key="thr_din4150_3_2016_table1",
 label="DIN 4150-3:2016 Table 1 as reproduced (one cell conflicts with the 1999 edition)",
 status="disputed", value_si=5*MM, unit_si="m/s", low_si=3*MM, high_si=50*MM,
 display="2016 reproduction matches 1999 except dwellings at 50-100 Hz read '40 to 50' (1999: '15 to 20'); adds floor slabs, vertical, 20 mm/s at all frequencies",
 values_json=json.dumps({"units": "v_i,max mm/s", "line 1": {"1-10 Hz": "20", "10-50 Hz": "20 to 40", "50-100 Hz": "40 to 50", "topmost floor horizontal": "40", "floor slabs vertical": "20"}, "line 2": {"1-10 Hz": "5", "10-50 Hz": "5 to 15", "50-100 Hz": "40 to 50 [as printed; 1999 edition 15 to 20]", "topmost floor horizontal": "15", "floor slabs vertical": "20"}, "line 3": {"1-10 Hz": "3", "10-50 Hz": "3 to 8", "50-100 Hz": "8 to 10", "topmost floor horizontal": "8", "floor slabs vertical": "20 (footnote b: may need lowering markedly)"}, "note": "Even if guideline values as in line 1, columns 2 to 5, are complied with, minor damage cannot be excluded."}),
 sources=[PLEANALA, WATERCARE],
 notes="An Bord Pleanala A14.1 Table 14.3 'Guideline Values for Vibration Velocity, vi,max, for Evaluating the Effects of Short-Term Vibration on Structures' (DIN 4150-3:2016-12), read from a page image. The line-2, 50-100 Hz cell reads '40 to 50', which breaks the pattern (higher than the 15 mm/s top-floor value) and contradicts the 1999 table's '15 to 20'; likely a transcription error, but I could not open the 2016 standard to check. Use the 1999 values (thr_din4150_3_1999_table1) for the page.",
 who_when="DIN 2016 via Jacobs IDOM EIAR"))

facts.append(F(
 key="thr_usbm_ri8507_safe_levels",
 label="USBM RI 8507: safe blasting vibration for houses (cosmetic cracking threshold)",
 status="verified", value_si=0.5*IN, unit_si="m/s", low_si=0.5*IN, high_si=2.0*IN,
 display="Below 40 Hz: 0.50 in/s (12.7 mm/s) for plaster-on-lath, 0.75 in/s (19 mm/s) for drywall; above 40 Hz: 2.0 in/s (51 mm/s)",
 sources=[RI8507, CALTRANS],
 notes="RI 8507 Conclusion 6 (p. 68): 'Practical safe criteria for blasts that generate low-frequency ground vibrations are 0.75 in/sec for modern gypsumboard houses and 0.50 in/sec for plaster on lath interiors. For frequencies above 40 Hz, a safe particle velocity maximum of 2.0 in/sec is recommended for all houses.' Abstract: 'Threshold damage was defined as the occurrence of cosmetic damage; that is, the most superficial interior cracking of the type that develops in all homes independent of blasting.' Conclusion 8: 'The chance of damage from a blast generating peak particle velocities below 0.5 in/sec is not only small (5 pct for worst cases) but decreases more rapidly than the mean prediction'. Conclusion 7: 'there may be no absolute minimum vibration damage threshold when the vibration (from any cause, for instance slamming a door) could in some case precipitate a crack about to occur.' Same limits restated in Caltrans 2020 section 11.4.3.1. Blast events last about 1-2 s (Caltrans 11.4.1). Data: 219 blasts at 76 homes plus nine earlier studies.",
 who_when="Siskind, Stagg, Kopp & Dowding 1980"))

facts.append(F(
 key="thr_usbm_ri8507_figure_b1_curve",
 label="USBM RI 8507 Figure B-1: frequency-dependent safe level for houses",
 status="verified", value_si=0.5*IN, unit_si="m/s", low_si=0.5*IN, high_si=2.0*IN,
 display="0.030 in (0.76 mm) displacement below about 2.7-4 Hz; 0.50 in/s plaster or 0.75 in/s drywall up to about 10-15 Hz; then 0.008 in (0.2 mm) displacement to 40 Hz; 2.0 in/s above 40 Hz",
 values_json=json.dumps({"units": "PPV in/s (mm/s); displacement in (mm)", "plaster": {"<2.65 Hz": "0.030 in (0.76 mm) displacement", "2.65-9.95 Hz": "0.50 in/s (12.7)", "9.95-39.8 Hz": "0.008 in (0.20 mm) displacement, i.e. v = 2 pi f x 0.2 mm", ">=40 Hz": "2.0 in/s (50.8)"}, "drywall": {"<3.98 Hz": "0.030 in displacement", "3.98-14.9 Hz": "0.75 in/s (19.1)", "14.9-39.8 Hz": "0.008 in displacement", ">=40 Hz": "2.0 in/s (50.8)"}, "corner_frequencies": "derived: f = v / (2 pi d)"}),
 sources=[RI8507],
 notes="RI 8507 Appendix B (p. 73-74): 'Above 40 Hz, a constant peak particle velocity of 2.0 in/sec is the maximum safe value. Below 40 Hz, the maximum velocity decreases at a rate equivalent to a constant peak displacement of 0.008 in. At frequencies corresponding to 0.75 in/sec for Drywall, and 0.50 in/sec for plaster, constant particle velocities are again appropriate. An ultimate maximum displacement of 0.030 in is recommended, which would only be of concern where very low frequencies are encountered (< 4 Hz).' Corner frequencies are mine, from f = v / (2 pi d): 0.5 in/s at 0.008 in -> 9.95 Hz; 0.75 -> 14.9 Hz; 2.0 -> 39.8 Hz; 0.5 at 0.030 in -> 2.65 Hz; 0.75 -> 3.98 Hz. The report adds: 'This method ... has the disadvantage of possibly underestimating annoyance reactions ... the higher midwall response frequencies will make the 20- to 35-Hz vibrations relatively annoying'.",
 who_when="Siskind et al. 1980"))

facts.append(F(
 key="thr_siskind_damage_probabilities",
 label="Siskind et al. (1980): probability of blast damage to houses by PPV",
 status="verified", value_si=0.5*IN, unit_si="m/s", low_si=0.5*IN, high_si=17*IN,
 display="Threshold (cosmetic) damage: 5% at 0.5 in/s (13 mm/s), 50% at 2.5 in/s (64 mm/s); minor: 5% at 1.8 (46), 50% at 5.0 (127); major: 5% at 2.5 (64), 50% at 6.0 in/s (152 mm/s)",
 values_json=json.dumps({"units": "PPV in/s (mm/s) at 5/10/50/90 % probability", "Threshold damage: loosening of paint, small plaster cracks at joints": "0.5 (12.7) / 0.7 (17.8) / 2.5 (63.5) / 9.0 (229)", "Minor damage: loosening and falling of plaster, cracks in masonry around openings, hairline to 3 mm cracks, fall of loose mortar": "1.8 (45.7) / 2.2 (55.9) / 5.0 (127) / 16.0 (406)", "Major damage: cracks of several mm in walls, rupture of opening vaults, structural weakening, fall of masonry, load support ability affected": "2.5 (63.5) / 3.0 (76.2) / 6.0 (152) / 17.0 (432)"}),
 sources=[CALTRANS, RI8507],
 notes="As reproduced in Caltrans 2020 Table 13 'Siskind Vibration Damage Thresholds' (p. 25): 'Siskind et al. (1980) applied probabilistic methods to vibration damage thresholds for blasting. Three damage thresholds have been identified and are described in Table 13 in terms of PPV for probabilities of 5, 10, 50, and 90%.' The damage-class wording matches RI 8507 Table 10 'Damage classification'. I did not cross-check the probability numbers against RI 8507's probability plots (figs. 55-59). Blasting, mostly low-frequency, residential houses. value_si = 5% threshold damage.",
 who_when="Siskind et al. 1980 via Caltrans 2020"))

facts.append(F(
 key="thr_caltrans2020_table19_damage",
 label="Caltrans 2020 Table 19: building damage potential, transient vs continuous (PPV)",
 status="verified", value_si=0.5*IN, unit_si="m/s", low_si=0.08*IN, high_si=2.0*IN,
 display="Older homes: 0.5 in/s (12.7 mm/s) transient, 0.3 in/s (7.6 mm/s) continuous; new homes 1.0/0.5 in/s; fragile 0.2/0.1 in/s; ruins 0.12/0.08 in/s; modern commercial 2.0/0.5 in/s",
 values_json=json.dumps({"units": "max PPV in/s (mm/s): transient / continuous or frequent intermittent", "Extremely fragile historic buildings, ruins, ancient monuments": "0.12 (3.0) / 0.08 (2.0)", "Fragile buildings": "0.2 (5.1) / 0.1 (2.5)", "Historic and some old buildings": "0.5 (12.7) / 0.25 (6.4)", "Older residential structures": "0.5 (12.7) / 0.3 (7.6)", "New residential structures": "1.0 (25.4) / 0.5 (12.7)", "Modern industrial/commercial buildings": "2.0 (50.8) / 0.5 (12.7)"}),
 sources=[CALTRANS],
 notes="Caltrans 2020 Table 19 'Guideline Vibration Damage Potential Threshold Criteria' (p. 38, PDF p. 62), same transient/continuous note as Table 20 (transient: blasting, drop balls; continuous/frequent intermittent: impact pile drivers, compactors). A synthesis of Chae, Swiss SN 640312, Konan, Whiffen, Siskind, Dowding and AASHTO criteria (Tables 9-15). No frequency dependence. value_si = older residential, transient.",
 who_when="Caltrans 2020"))

facts.append(F(
 key="thr_fta2018_table7_5_damage",
 label="FTA 2018 Table 7-5: construction vibration damage criteria",
 status="verified", value_si=0.2*IN, unit_si="m/s", low_si=0.12*IN, high_si=0.5*IN,
 display="I reinforced concrete/steel/timber 0.5 in/s (12.7 mm/s); II engineered concrete and masonry 0.3 (7.6); III non-engineered timber and masonry 0.2 (5.1); IV extremely susceptible 0.12 (3.0)",
 values_json=json.dumps({"units": "PPV in/s (mm/s); approximate Lv in VdB", "I. Reinforced-concrete, steel or timber (no plaster)": "0.5 (12.7), 102 VdB", "II. Engineered concrete and masonry (no plaster)": "0.3 (7.6), 98 VdB", "III. Non-engineered timber and masonry buildings": "0.2 (5.1), 94 VdB", "IV. Buildings extremely susceptible to vibration damage": "0.12 (3.0), 90 VdB"}),
 sources=[FTA],
 notes="FTA 2018 Table 7-5 'Construction Vibration Damage Criteria' (p. 186): 'The approximate rms vibration velocity levels were calculated from the PPV limits using a crest factor of 4.' Applies to construction equipment, including impact pile drivers (repeated impacts); no transient/continuous split and no frequency dependence. An ordinary wood-frame house is category III (5.1 mm/s), which is stricter than BS 7385-2 or USBM. value_si = category III.",
 who_when="FTA 2018"))

facts.append(F(
 key="thr_whiffin_leonard_1971_buildings",
 label="Whiffin & Leonard (1971): continuous vibration and buildings, PPV",
 status="verified", value_si=5*MM, unit_si="m/s", low_si=2.5*MM, high_si=15*MM,
 display="5 mm/s (0.2 in/s): threshold of risk of 'architectural' damage to plastered houses; 2.5 mm/s virtually no risk; 10-15 mm/s architectural and possibly minor structural damage; 2 mm/s upper limit for ruins",
 sources=[CALTRANS],
 notes="As reproduced in Caltrans TA V-04-01-R0201 Table 2 (Caltrans 2020 appendix, PDF p. 143): '2.0 mm/s: Recommended upper amplitude of the vibration to which ruins and ancient monuments should be subjected'; '2.5: Virtually no risk of architectural damage to normal buildings'; '5.0: Threshold at which there is a risk of architectural damage to normal dwelling - houses with plastered walls and ceilings'; '10-15: Vibrations at a greater amplitude than normally expected from traffic, but would cause architectural damage and possibly minor structural damage'; '0.15-0.30: Vibrations unlikely to cause damage of any type'. 'For buildings, the value refers to the ground motion. No allowance is included for the amplifying effect, if any, of structural components.' The TA notes 5 mm/s 'is one tenth of the maximum safe amplitude of 50 mm/sec (2 in/sec) for single events' and 'appears to be conservative even for sustained pile driving'; it suggests pile-driving peaks near normal dwellings 'should probably not be allowed to exceed 7.5 mm/s (0.3 in/sec)'. Continuous (traffic) vibration.",
 who_when="Whiffin & Leonard 1971, via Caltrans TAV-04-01-R0201 (Hendriks 2004) in Caltrans 2020"))

facts.append(F(
 key="thr_other_damage_criteria_caltrans",
 label="Other building damage criteria summarised by Caltrans (Chae, Swiss, Konan, Dowding, AASHTO)",
 status="verified", value_si=None, unit_si="m/s",
 display="Range 0.1-4 in/s (2.5-102 mm/s) depending on building and whether single or repeated; Swiss criteria assume 10-30 Hz",
 values_json=json.dumps({"units": "PPV in/s", "Chae 1978 (single / repeated blast)": {"substantial construction": "4 / 2", "relatively new residential, sound": "2 / 1", "old residential, poor condition": "1 / 0.5", "old residential, very poor": "0.5 / -"}, "Swiss (Wiss 1981), 10-30 Hz (continuous / single event)": {"I steel or reinforced concrete": "0.5 / 1.2", "II concrete foundation walls and floors, concrete or masonry walls": "0.3 / 0.7", "III as II with wooden ceilings and masonry walls": "0.2 / 0.5", "IV very sensitive, historic": "0.12 / 0.3"}, "Konan 1985 historic and sensitive (transient / steady)": {"1-10 Hz": "0.25 / 0.12", "10-40 Hz": "0.25-0.5 / 0.12-0.25", "40-100 Hz": "0.5 / 0.25"}, "Dowding 1996": {"historic and some old": "0.5", "residential": "0.5", "new residential": "1.0", "industrial": "2.0", "bridges": "2.0"}, "AASHTO 1990": {"historic sites": "0.1", "residential, plastered walls": "0.2-0.3", "residential in good repair, gypsum board": "0.4-0.5", "engineered structures without plaster": "1.0-1.5"}}),
 sources=[CALTRANS],
 notes="Caltrans 2020 Tables 9-15 (pp. 23-26). Caltrans on the Swiss table: 'Assuming that the frequency range of interest for construction and traffic sources is 10-30 Hz, Table 10 shows criteria for 10-30 Hz.' Konan 'recommended that criteria for continuous vibration be about half the amplitude of criteria for transient sources.' Original documents not opened. Context only; the page should not need these individually.",
 who_when="Various, via Caltrans 2020"))

facts.append(F(
 key="thr_everyday_household_equivalents",
 label="Everyday household events expressed as equivalent PPV (Stagg et al. 1980)",
 status="verified", value_si=0.03*IN, unit_si="m/s", low_si=0.03*IN, high_si=3.0*IN,
 display="Walking on the floor 0.03 in/s (0.8 mm/s); normal family activity 0.1-0.5 in/s (2.5-13 mm/s); jumping on the floor 0.3 (7.6); door slam 0.5 (12.7); nail driving 0.9 (23); daily environmental changes 1.2-3.0 in/s (30-76 mm/s)",
 sources=[CALTRANS],
 notes="Caltrans 2020 Table 22 'Effect of Blasting Vibration on Materials and Structures' (pp. 76-77), rows credited to Stagg et al. 1980: 'Residential structure: Equivalent to walking on floor 0.03; Equivalent to jumping on floor 0.3; Equivalent to door slam 0.5; Equates to normal daily family activity 0.1-0.5; Equivalent to nail driving 0.9; Equates to daily environmental changes 1.2-3.0' (in/s). Caltrans: 'In some instances equivalent velocity levels were derived from strain measurements' and the table 'is not intended to be used to establish specific limits.' These are ground-vibration PPVs that would strain a house as much as the household event does, not floor vibration levels. Useful for plain comparisons on the page ('about as hard on the house as a slammed door').",
 who_when="Stagg et al. 1980 via Caltrans 2020"))

facts.append(F(
 key="thr_measurement_point_conventions",
 label="Where each threshold is measured: building base for damage, the person's position for people",
 status="verified", value_si=None, unit_si="",
 display="Damage values: ground or building foundation, peak component PPV; human values: where the person is (inside, often on an amplifying floor)",
 sources=[BS5228, CALTRANS, PLEANALA],
 notes="BS 5228-2 Table B.2 Note 1: 'Values referred to are at the base of the building'; values are 'peak component particle velocity' (largest of three components, not the vector sum). Whiffin & Leonard footnote (Caltrans TA): 'Where human reactions are concerned, the value is at the point at which the person is situated. For buildings, the value refers to the ground motion. No allowance is included for the amplifying effect, if any, of structural components.' BS 5228-2:2009+A1:2014 Table B.1 footnotes (via An Bord Pleanala): values apply at 'the point of entry into the recipient' and 'A transfer function ... needs to be applied if only external measurements are available.' FTA criteria are indoor rms levels. The Walk tab predicts free-field ground PPV, which matches the damage criteria and an outdoor listener; for indoor listeners, floors and walls can amplify (RI 8507: up to about 4 times for midwalls at 10-25 Hz).",
 who_when="BSI; Caltrans; FTA"))

facts.append(F(
 key="thr_blast_event_duration",
 label="Blasting events, behind most damage criteria, last about 1-2 seconds",
 status="verified", value_si=None, unit_si="s", low_si=1, high_si=2,
 display="Millisecond-delayed blasts: 1-2 s; longer and higher-frequency events bother people more",
 sources=[CALTRANS],
 notes="Caltrans 2020 section 11.4.1 (p. 74): 'The duration of the event has an effect on human response, as does the frequency. Events are of short duration, 1-2 seconds, for millisecond-delayed blasts. Typically, the longer the event and the higher the frequency, the more adverse the effect on human response.' Relevance: USBM, BS 7385-2 'transient' and Caltrans 'transient' criteria come from events of this length; a single footstep is probably shorter, and a walk is a train of such pulses.",
 who_when="Caltrans 2020"))

# ---------------- (d) footing ----------------
facts.append(F(
 key="thr_footing_ems98",
 label="EMS-98: when people lose their balance or find it hard to stand",
 status="verified", value_si=None, unit_si="",
 display="VI: 'A few persons lose their balance'; VII: 'Many find it difficult to stand, especially on upper floors'; VIII: 'Many people find it difficult to stand, even outdoors'; IX: 'People may be forcibly thrown to the ground'",
 sources=[EMS98],
 notes="EMS-98 core scale (PDF pp. 19-20): 'VI. Slightly damaging: a) Felt by most indoors and by many outdoors. A few persons lose their balance. Many people are frightened and run outdoors.' 'VII. Damaging: a) Most people are frightened and try to run outdoors. Many find it difficult to stand, especially on upper floors.' 'VIII. Heavily damaging: a) Many people find it difficult to stand, even outdoors.' 'IX. Destructive: a) General panic. People may be forcibly thrown to the ground.' Descriptive only; no ground-motion values in EMS-98.",
 who_when="Grunthal (ed.) 1998"))

facts.append(F(
 key="thr_footing_earthquake_pgv",
 label="Ground velocity at which earthquake shaking makes standing hard (EMS-98 wording on Wald 1999 MMI bands)",
 status="estimate", value_si=0.31, unit_si="m/s", low_si=0.081, high_si=0.60,
 display="A few lose balance (VI): 81-160 mm/s; many find standing hard indoors (VII): 160-310 mm/s; even outdoors (VIII): 310-600 mm/s",
 sources=[EMS98, SHAKEMAP],
 notes="Joins EMS-98's balance wording (thr_footing_ems98) to the Wald et al. (1999) PGV bands for the same Roman numerals (thr_wald1999_shakemap_intensity_table). Assumption, not checked: EMS-98 and California MMI are about equal at VI-VIII. The JMA scale (6 Lower: 'difficult to remain standing') gives no PGV. Conditions: earthquake ground motion of about 1-6 Hz lasting many seconds, mostly horizontal, displacements of centimetres. value_si = 310 mm/s, the VII/VIII boundary (standing hard even outdoors).",
 who_when="Derived here from EMS-98 (1998) and Wald et al. 1999"))

facts.append(F(
 key="thr_footing_takahashi2004_shake_table",
 label="Shake-table test: standing people start losing balance at about 0.3 m/s (0.3-2.5 Hz); none at 5 Hz up to 0.48 m/s",
 status="verified", value_si=0.3, unit_si="m/s", low_si=0.26, high_si=0.31,
 display="Standing subjects first judged unbalanced at about 0.26-0.31 m/s sine shaking (0.3-2.5 Hz); at 5 Hz nobody was, up to 0.48 m/s",
 values_json=json.dumps({"input velocities m/s by frequency (Table 1)": {"0.3 Hz": "0.265-0.796", "0.6 Hz": "0.265-0.796", "1.0 Hz": "0.159-0.796", "2.5 Hz": "0.064-0.624", "5.0 Hz": "0.032-0.477"}, "read from Figure 8 (standing)": "unbalanced ratio 0 up to about 0.16 m/s at all frequencies; first non-zero values at about 0.26-0.31 m/s (0.3-2.5 Hz); 5.0 Hz points stay at 0 up to 0.477 m/s", "subjects": "15 in 2000 and 15 in 2002 (7 female in total), with head, elbow and knee protectors"}),
 sources=[TAKA],
 notes="Takahashi et al. 2004, Table 1 (input sine waves) and Figure 8 'Unbalanced ratio in standing' (front-rear and right-left horizontal shaking), read from a 300 dpi page image, so the onset is approximate (about +-0.05 m/s). Text: 'Figure 4 shows that in high frequency motion, i.e., 5.0 Hz, they felt more anxiousness than low frequency motion, in the same velocity.' 'high frequency motion causes strong anxiousness and low frequency motion causes stagger even if anxiousness is small.' Conclusion: 'Low frequency floor response cause stagger for indoor people, but additional tests might be need to clarify its limit value.' and 'The authors have not find clear limit value for evacuation limit ... because of limitation of number of subjects.' Walking (Figure 10) became unbalanced at lower velocity, from about 0.16-0.2 m/s side to side. Small sample, young adults, horizontal sinusoids lasting several seconds. Conference paper.",
 who_when="Takahashi, Saito, Azuhata & Ohtomo 2004"))

# ---------------- recommendations ----------------
facts.append(F(
 key="thr_rec_feel",
 label="Recommended page value: people feel it",
 status="estimate", value_si=0.3*MM, unit_si="m/s", low_si=0.14*MM, high_si=1.0*MM,
 display="0.3 mm/s PPV (range 0.14-1 mm/s)",
 sources=[BS5228, CALTRANS, RI8507, FTA],
 notes="Set by BS 5228-2 Table B.1 ('might be just perceptible in residential environments', 0.3 mm/s), for construction vibration of roughly 8-80 Hz felt by people in buildings. Agrees with Whiffin & Leonard (0.15-0.3 mm/s, continuous), Caltrans Table 20 continuous (0.25 mm/s), ISO 2631 (1989) residential (about 0.3 mm/s peak) and FTA's 65 VdB (about 0.2 mm/s PPV). Low end 0.14 mm/s: most sensitive people, quiet room. High end 1.0 mm/s: Caltrans 'barely perceptible' for a single isolated transient event; RI 8507 Table 15 shows the average person needs 2.4-3.3 mm/s to notice a 0.5-1 s event. For a walk past (a train of steps) use 0.3 mm/s; for one isolated step, say people sitting still may notice from about 0.3 mm/s, most from about 1 mm/s. Below about 8 Hz people respond to acceleration, so a higher PPV is needed.",
 who_when="Recommendation, this research"))

facts.append(F(
 key="thr_rec_rattle",
 label="Recommended page value: ornaments, crockery and windows rattle",
 status="estimate", value_si=1.0*MM, unit_si="m/s", low_si=0.3*MM, high_si=3.0*MM,
 display="About 1 mm/s PPV (range 0.3-3 mm/s); no standard sets this",
 sources=[CALTRANS, FTA, RI8507, EMS98, SHAKEMAP],
 notes="No construction or vibration standard gives a rattling threshold. Caltrans and FTA say rattling of dishes, windows and doors can happen at or below the perception level (lower bound 0.3 mm/s). Earthquake scales put 'china, glasses, windows and doors rattle' at intensity IV (EMS-98, USGS MMI, JMA 3-4); Wald et al. (1999) tie IV to PGA 1.4-3.9 %g, which equals 1.1-3.0 mm/s PPV at 20 Hz (thr_rattle_mmi4_accel_at_footstep_frequency). Central value 1 mm/s is the lower edge of that band, rounded; it is also where BS 5228-2 expects complaints in homes. If the engine knows the dominant frequency f of a step, compute instead v_rattle = 0.14 m/s^2 / (2 pi f), clamped to at least 0.3 mm/s. Indoors, midwall amplification (up to 4 times, RI 8507) means rattling starts at lower ground PPV.",
 who_when="Recommendation, this research"))

facts.append(F(
 key="thr_rec_cosmetic_damage",
 label="Recommended page value: cosmetic damage to buildings starts",
 status="estimate", value_si=12.7*MM, unit_si="m/s", low_si=5*MM, high_si=50*MM,
 display="One step or stomp: 12.7 mm/s (0.5 in/s) at the house; a walk past (repeated steps): 7.6 mm/s (0.3 in/s); range 5-50 mm/s by building and frequency",
 sources=[RI8507, BS5228, CALTRANS, FTA, WATERCARE],
 notes="Single step (transient): 12.7 mm/s, set by USBM RI 8507 (plaster-on-lath houses, below 40 Hz) and Caltrans Table 19 (older homes, transient); BS 7385-2 says damage probability 'tends towards zero at 12.5 mm/s' and gives 15-20 mm/s for homes at 4-15 Hz. Repeated steps: 7.6 mm/s, Caltrans Table 19 older homes, continuous/frequent intermittent (impact pile drivers are in that class); matches BS 7385-2's 'reduce by up to 50%' and the Caltrans TA's 7.5 mm/s for pile driving near dwellings. Range: 5 mm/s (DIN 4150-3 dwellings below 10 Hz; FTA wood-frame; Whiffin & Leonard continuous) to 50 mm/s (BS 7385-2 at 40 Hz and above; USBM above 40 Hz). Frequency option: BS 7385-2 line 2 (15 mm/s at 4 Hz, 20 at 15 Hz, 50 at 40 Hz). These are minimal-risk guide values for low-rise homes, not the point where cracks are certain. For damage presets: minor damage above 2 times and major above 4 times the BS 7385-2 values; Siskind: 50% chance of cosmetic cracks at 64 mm/s.",
 who_when="Recommendation, this research"))

facts.append(F(
 key="thr_rec_footing",
 label="Recommended page value: people lose their footing",
 status="estimate", value_si=0.3, unit_si="m/s", low_si=0.08, high_si=0.6,
 display="About 300 mm/s PPV (range 80-600 mm/s), from earthquake shaking and one shake-table study; likely cautious for footsteps",
 sources=[EMS98, SHAKEMAP, TAKA],
 notes="No standard covers losing footing from ground vibration. 300 mm/s is where (a) EMS-98 VIII, 'Many people find it difficult to stand, even outdoors', begins on the Wald 1999 PGV scale (310 mm/s) and (b) standing subjects on a shake table first lost balance (about 0.26-0.31 m/s at 0.3-2.5 Hz; Takahashi et al. 2004). Low end 80 mm/s: EMS-98 VI 'a few persons lose their balance' (indoors, Wald VI from 81 mm/s). High end 600 mm/s: top of VIII. Conditions differ from footsteps: earthquakes shake at about 1-6 Hz for many seconds with centimetre displacements; a step is one short, higher-frequency pulse with sub-millimetre displacement. Takahashi found no loss of balance at 5 Hz up to 0.48 m/s, so for footsteps 300 mm/s probably overstates the hazard. Label as an estimate from the earthquake analogy.",
 who_when="Recommendation, this research"))

# ---------------- checks ----------------
keys = set()
for f in facts:
    assert f["key"] not in keys, f["key"]; keys.add(f["key"])
    for req in ["key", "category", "label", "status", "display", "sources", "notes"]:
        assert req in f, (f["key"], req)
    v, lo, hi = f.get("value_si"), f.get("low_si"), f.get("high_si")
    if v is not None and lo is not None: assert lo <= v * (1 + 1e-9), (f["key"], lo, v)
    if v is not None and hi is not None: assert v <= hi * (1 + 1e-9), (f["key"], v, hi)
    if "values_json" in f: json.loads(f["values_json"])
    for s in f["sources"]: assert s["url"].startswith("https://")
    # round floats
    for k in ["value_si", "low_si", "high_si"]:
        if isinstance(f.get(k), float): f[k] = float("%.4g" % f[k])
print(len(facts), "facts OK", file=sys.stderr)
json.dump(facts, open(sys.argv[1], "w"), indent=1, ensure_ascii=False)
