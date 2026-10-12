import json
BS='https://www.omegawestdocuments.com/media/documents/43/CD43.12%20-%204%20Code%20of%20practice%20for%20noise%20and%20vibration%20control%20on%20construction%20and%20open%20sites%20part%202%20vibration;.pdf'
TRL='https://www.trl.co.uk/uploads/trl/documents/TRL429.pdf'
LUKAS='https://rosap.ntl.bts.gov/view/dot/68405/dot_68405_DS1.pdf'
GEC1='https://rosap.ntl.bts.gov/view/dot/40768/dot_40768_DS1.pdf'
LAUZON='https://www.issmge.org/uploads/publications/84/52/GEO11Paper581.pdf'
CALT='https://dot.ca.gov/-/media/dot-media/programs/environmental-analysis/documents/env/tcvgm-apr2020-a11y.pdf'
SS='https://www.isterre.fr/IMG/pdf/Sanchez_Sema_BSSA.pdf'
COL='https://iris.polito.it/bitstream/11583/2882762/1/Colombero_et_al_2015_sub.pdf'
TRID='https://trid.trb.org/View/1101903'
OCR='https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=11144599&rettype=abstract&retmode=text'
EKI='https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=16938964&rettype=abstract&retmode=text'
ARXEL='https://arxiv.org/pdf/2406.05140'
USGS='https://pubs.usgs.gov/of/1997/0501/report.pdf'
TURK='https://iisee.kenken.go.jp/net/seismic_design_code/turkey/table-turkey3.htm'
KOH='https://www.cambridge.org/core/services/aop-cambridge-core/content/view/0DAA1D118D8BC16DA025F8B300C442EA/S0022143000023467a.pdf/the-temperature-dependence-of-seismic-waves-in-ice.pdf'
YORK='https://northeastfc.uk/Infrastructure/projects/north-east/york-potash-harbour-facilities-order/TR030002-000493-Section%2014%20App%2014.1%20Construction%20vibration%20calculations.pdf'
S=lambda t,u:{'title':t,'url':u}
sBS=S('BS 5228-2:2009+A1:2014 Annex E, Tables E.1 and E.2 (licensed copy filed as public-inquiry core document CD43.12, Omega West)',BS)
sTRL=S('Hiller & Crabb (2000) TRL Report 429, Groundborne vibration caused by mechanised construction works (Transport Research Laboratory for the Highways Agency)',TRL)
sLUK=S('Lukas (1986) Dynamic Compaction for Highway Construction, Vol. 1: Design and Construction Guidelines, FHWA/RD-86/133 (USDOT ROSAP scan)',LUKAS)
sGEC=S('Lukas (1995) Geotechnical Engineering Circular No. 1: Dynamic Compaction, FHWA-SA-95-037 (USDOT ROSAP scan)',GEC1)
sLAU=S('Lauzon, Morel, Briet & Beaton (c. 2011) Ground Vibrations Induced by Dynamic Compaction and Rapid Impact Compaction (ISSMGE online library, GEO11 paper 581)',LAUZON)
sCAL=S('Caltrans (2020) Transportation and Construction Vibration Guidance Manual, April 2020 (Andrews, Buehler, Gill & Bender)',CALT)
sSS=S('Sanchez-Sesma, Weaver, Kawase, Matsushima, Luzon & Campillo (2011) Energy partitions among elastic waves for dynamic surface loads in a semi-infinite solid, BSSA (accepted manuscript)',SS)
sCOL=S('Colombero, Kontoe, Foti & Potts (2015) Numerical modelling of wave attenuation through soil, XVI ECSMGE Edinburgh, pp. 3959-3964 (Politecnico di Torino repository)',COL)
sTRID=S('Auersch & Said (2010) Attenuation of ground vibrations due to different technical sources, Earthquake Engineering and Engineering Vibration 9(3):337-344 (TRID abstract)',TRID)
sOCR=S("O'Connell-Rodwell, Arnason & Hart (2000) Seismic properties of Asian elephant vocalizations and locomotion, J Acoust Soc Am 108(6):3066-72 (PubMed abstract, PMID 11144599, via NCBI E-utilities)",OCR)
sEKI=S('Ekimov & Sabatier (2006) Vibration and sound signatures of human footsteps in buildings, J Acoust Soc Am 120(2):762-8 (PubMed abstract, PMID 16938964, via NCBI E-utilities)',EKI)
sARX=S('Towards Long Range Detection of Elephants Using Seismic Signals; A Geophone-Sensor Interface for Embedded Systems (arXiv:2406.05140, 2024), Section III, citing O\'Connell-Rodwell et al. 2000',ARXEL)
sUSGS=S('USGS Open-File Report 97-501 (NEHRP soil profile types by Vs30)',USGS)
sTURK=S('Turkish seismic code (Ministry of Public Works and Settlement, Specification for Structures to be Built in Disaster Areas), Table 12.1 Soil Groups, as hosted by IISEE/BRI Japan',TURK)
sKOH=S('Kohnen (1974) The temperature dependence of seismic waves in ice, Journal of Glaciology 13(67):144-147',KOH)
F=[]
def add(**k):
    k.setdefault('category','attenuation'); F.append(k)

add(key='vib_bs5228_dynamic_compaction_predictor',
 label='BS 5228-2 Table E.1: ground vibration from dynamic compaction (weight dropped on the ground)',
 status='verified', value_si=3.7e-5, unit_si='m/s (coefficient k in PPV = k (sqrt(W_h)/x)^1.7, W_h in J, x in m)',
 display='PPV ≤ 0.037 (√W_h / x)^1.7 mm/s; W_h = potential energy of the raised tamper (J), x = distance along the ground (m); valid 5–100 m and 1–12 MJ',
 sources=[sBS, S('York Potash Harbour Facilities Order, ES Appendix 14.1 Construction vibration calculations (2014), used only for the units caution',YORK)], who_when='BSI 2014, reproducing Hiller & Crabb (TRL) 2000',
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

add(key='vib_construction_frequency_range',
 label='Typical frequency of ground vibration from construction and traffic; wave speeds and wavelengths',
 status='verified', value_si=15, unit_si='Hz', low_si=10, high_si=30,
 display='Usually 10–30 Hz, centred near 15 Hz; pile driving 4–30 Hz; ground wave speeds 61–610 m/s, wavelengths 3–152 m',
 sources=[sCAL], who_when='Caltrans 2020 citing Hendriks 2002',
 notes=("Caltrans p. 17: 'Typical vibration from transportation and construction sources typically falls in the range of 10–30 Hz and usually centers around 15 Hz (Hendriks 2002).' p. 17: 'damage levels in terms of velocity in the frequency range of 1–80 Hz tend to be independent of frequency. This is also true for complaint levels in a frequency range of 8–80 Hz.' Chapter on wave barriers: 'Pile driving typically generates ground vibration with frequencies in the range of 4–30 Hz. With common wave velocities in the range of 61–610 m/s, typical wavelengths can be in the range of 3–152 m.'"))

add(key='vib_footstep_frequency_band',
 label='Human footsteps: force mostly at 1–4 Hz; ground particle velocity mostly at 20–90 Hz',
 status='verified', value_si=None, unit_si='Hz', low_si=20, high_si=90,
 display='Footstep force peaks at 1–4 Hz (walking rhythm); the seismic particle-velocity response is site-specific, characteristic band 20–90 Hz',
 sources=[sEKI], who_when='Ekimov & Sabatier 2006',
 notes=("Abstract: 'Early research showed the maximum value for the force of multiple footsteps to be in the frequency band of 1-4 Hz.' 'the low-frequency band (below 500 Hz) is well known in the literature, and generated by the force normal to the ground/floor. The seismic particle velocity response to footsteps was shown to be site specific and the characteristic frequency band was 20-90 Hz.' 'Different walking styles result in different vibration signatures in the low-frequency range.' The gap between 1–4 Hz force and 20–90 Hz velocity is the physics in vib_physics_rayleigh_farfield: ground velocity grows as frequency^1.5 for the same force amplitude, so the fast parts of the footfall (heel strike, foot slap) dominate what a sensor feels. No absolute footstep PPV values with distance were found in a primary source."))

add(key='vib_elephant_seismic_speed_frequency',
 label='Asian elephant footfalls and rumbles: ground-wave speed, frequency and range of measurement',
 status='verified', value_si=256, unit_si='m/s (seismic propagation speed at the site)', low_si=248, high_si=264,
 display='Seismic signals travelled at 248–264 m/s, predominant frequency about 20 Hz, well above background at 40 m',
 sources=[sOCR], who_when="O'Connell-Rodwell, Arnason & Hart 2000",
 notes=("Abstract: 'elephant generated signals associated with rumbles and \"foot stomps\" propagated at different velocities in the two media, the acoustic signals traveling at 309 m/s and the seismic signals at 248-264 m/s. Both types of signals had predominant frequencies in the range of 20 Hz. Seismic signal amplitudes considerably above background noise were recorded at 40 m from the generating elephants for both the rumble and the stomp. Seismic propagation models suggest that seismic waveforms from vocalizations are potentially detectable by instruments at distances of up to 16 km, and up to 32 km for locomotion generated signals.' The 248–264 m/s is a Rayleigh-type surface-wave speed, implying a shear-wave speed of about 270–290 m/s at that site (c_R ≈ 0.92 c_s). The 16–32 km figures are model estimates of instrumental detectability, not felt vibration. The elephant comparison as a whole belongs to the elephant research topic; it is listed here because it anchors frequency and wave speed."))

add(key='vib_elephant_stomp_ppv',
 label='Asian elephant foot stomps: ground velocity at 3–12 m and at 40 m (peak-to-peak)',
 status='reported', value_si=4.87e-5, unit_si='m/s peak-to-peak (at 3–12 m)', low_si=1.7e-5, high_si=4.87e-5,
 display='About 48.7 µm/s peak-to-peak at 3–12 m and 17.0 µm/s at 40 m (roughly 0.024 and 0.009 mm/s peak)',
 sources=[sARX, sOCR, sBS], who_when="O'Connell-Rodwell et al. 2000, as quoted in arXiv:2406.05140 (2024)",
 notes=("Secondary quote, not seen in the original paper (only its abstract was fetched): 'According to [44], the RMS velocity of elephant rumbles is 0.437 µm/s at a distance of 3-12 m and is 0.264 µm/s at a distance of 40 m. For the corresponding distances, experimental peak-to-peak velocities for stomps were 48.7 µm/s and 17.0 µm/s, respectively.' Peak (zero-to-peak) is about half of peak-to-peak. The elephants' masses and the force of a 'stomp' are not given in what we fetched, so this is an order-of-magnitude anchor: an elephant (weight not stated in what we fetched) produced ground velocity of a few hundredths of a mm/s at about 10 m, about 6–12 times below the BS 5228-2 Table B.1 guide values for vibration that 'might be just perceptible' (0.14 mm/s 'in the most sensitive situations', 0.3 mm/s 'in residential environments'); thresholds proper belong to the thresholds topic. Ratio 3–12 m to 40 m ≈ 2.9."))

add(key='vib_wave_energy_partition_miller_pursey',
 label='Energy radiated by a vertical force on the ground surface, and its split among wave types (Miller & Pursey 1955)',
 status='verified', value_si=0.6735, unit_si='1 (Rayleigh-wave share)', low_si=0.67, high_si=0.6735,
 display='Mean power Π = 1.209 ω² P² / (π ρ c_p³) for a harmonic force P cos ωt (Poisson ratio 1/4); 67.35% Rayleigh, 25.76% shear, 6.89% compressional',
 sources=[sSS, sCAL, sTRL], who_when='Miller & Pursey 1955, as reproduced by Sanchez-Sesma et al. 2011; Caltrans 2020; TRL 2000',
 notes=("Sanchez-Sesma et al.: 'they found that the total power radiated by a vertical harmonic load Pe^{iωt} is given by Π=1.209ω²P²/πρα³, where ω = circular frequency, ρ = mass density, and α = propagation velocity of P waves. Such an amount is partitioned among P, SV and Rayleigh waves in 6.89, 25.76 and 67.35 per cent, respectively. They assumed a Poisson ratio ν =1/4'. Caltrans p. 13: 'About 67% of energy is transmitted in the R-wave, 26% in the S-wave, and 7% in the P-wave (Richart 1970).' TRL 429 p. 5: 'Miller and Pursey (1955) showed that approximately two thirds of the energy from a source located at the ground surface is radiated as Rayleigh waves.' The 1955 paper itself (Proc. R. Soc. A 233:55-69) was not fetched. Valid for a source small compared with the wavelength. We used the 1.209 and 67.35% values to check our own Rayleigh-wave amplitude (vib_physics_rayleigh_farfield); they agree to 0.02%."))

add(key='vib_geometric_spreading_exponents',
 label='Geometric spreading: how amplitude falls with distance for each wave type from a surface point source',
 status='verified', value_si=0.5, unit_si='1 (Rayleigh-wave exponent, surface source and receiver)',
 display='Surface source, surface receiver: Rayleigh waves ∝ r^-0.5, body waves ∝ r^-2; buried source: body waves ∝ r^-1',
 sources=[sCAL, sTRL], who_when='Amick 2000 via Caltrans 2020 (Table 1); TRL 2000',
 notes=("Caltrans Table 1 'Geometric Attenuation Coefficients' (source: Amick 2000): point on surface, R wave, measured at surface, γ = 0.5; point on surface, body (P or S), surface, 2; point at depth, body, surface, 1; point at depth, body, depth, 1. Eq. 5: 'vb = va (ra/rb)^γ'. Caltrans: 'The amplitude of R-waves decreases in direct proportion to the square root of the distance from the source.' TRL 429 p. 5: 'the particle velocity attenuates according to 1/r and 1/r^0.5 for body and surface waves, respectively.' Near the source (within about a third of a wavelength) the quasi-static field, which falls as 1/r, dominates instead (vib_physics_nearfield_boussinesq)."),
 values_json=json.dumps({'surface source, R wave, surface':0.5,'surface source, body wave, surface':2,'depth source, body wave, surface':1,'depth source, body wave, depth':1}))

add(key='vib_bornitz_damping_form',
 label='Bornitz/Mintrop attenuation form: geometric spreading times exponential material damping',
 status='verified', value_si=0.10, unit_si='1/m (α used by Greenwood & Farmer 1971 and Heckman & Hagerty 1978)', low_si=0.05, high_si=0.10,
 display='A₁ = A₀ (r₀/r₁)^β e^{-α(r₁ - r₀)}, β = 0.5 for surface waves; α ≈ 0.03 ft⁻¹ (0.10 m⁻¹) has been used for all soils',
 sources=[sTRL, sCAL], who_when='Mintrop 1911 / Bornitz 1931 via TRL 2000; Richart 1970 via Caltrans 2020',
 notes=("TRL 429 eq. (5) 'A1 = A0 (r0/r1)^β e^{-α(r1 - r0)} where A1 is the amplitude at distance r1 from the source; A0 is the amplitude at distance r0 from the source; α is the absorption coefficient; and ß is the geometric spreading term. Mintrop (1911) presented this equation with ß having a value of 0.5'. 'Greenwood and Farmer (1971) and Heckman and Hagerty (1978) assumed α to have a value of 0.03ft-1 (0.10m-1). However, these authors considered that this value is applicable to all cases and is not dependent upon the geology.' Massarsch (1992) example: amplitude at 50 m 'more than an order of magnitude higher without damping than when a coefficient of attenuation (α) of 0.05m-1 is assumed'. Caltrans Eq. 6 (Richart 1970): 'vb = va (ra/rb)^0.5 e^{α(ra – rb)}'. α depends on frequency (α = 2π f ξ / c_R for damping ratio ξ), so a single α applied to a pulse over-damps it at long range; our pulse treatment is vib_physics_damping_factor."))

add(key='vib_material_damping_coefficients',
 label='Measured material-damping coefficients α for soils (Amick 2000 compilation, Caltrans Table 2)',
 status='verified', value_si=0.1, unit_si='1/m (typical)', low_si=0.01, high_si=0.65,
 display='α from 0.01 m⁻¹ (saturated fine sand) to about 0.65 m⁻¹ (dune sand); 0.02 m⁻¹ for a 4-inch concrete slab on compact granular fill',
 sources=[sCAL], who_when='Amick 2000 and Hendriks 2002 via Caltrans 2020',
 notes=("Caltrans Table 2 'Summary of Material-Damping Coefficients (Applies to Both P- and S-Waves)', α ft⁻¹ / m⁻¹: Forssblad silty gravelly sand 0.04 / 0.13; Richart 4-in. concrete slab over compact granular fill 0.006 / 0.02; Woods silty fine sand 0.079 / 0.26; Barkan saturated fine grain sand 0.003 / 0.010; frozen 0.018 / 0.06; saturated sand with peat and organic silt 0.012 / 0.04; clayey sand, clay with some sand, and silt above water level 0.012 / 0.04; marly chalk 0.03 / 0.1; loess 0.03 / 0.1; saturated clay with sand and silt 0.0–0.037 / 0.0–0.12; Dalmatov sand and silt 0.079–0.11 / printed 0.026–0.36; Clough & Chameau sand fill over bay mud 0.015–0.061 / 0.05–0.2; dune sand 0.076–0.2 / printed 0.025–0.65; Peng soft Bangkok clay 0.079–0.13 / printed 0.026–0.44; Hendriks sand-silt, clayey silt, silty sand 0.006 / 0.021. The three 'printed' metric lower bounds are inconsistent with their ft⁻¹ values (0.079 ft⁻¹ = 0.26 m⁻¹, 0.076 ft⁻¹ = 0.25 m⁻¹): apparent decimal slips in the table. Frequencies of measurement are not given, so these α values cannot be transferred to a different frequency without assuming one."),
 values_json=json.dumps({'units':'alpha per metre (per foot in brackets)','silty gravelly sand (Forssblad)':'0.13 (0.04)','4-in concrete slab over compact granular fill (Richart)':'0.02 (0.006)','silty fine sand (Woods)':'0.26 (0.079)','saturated fine sand (Barkan)':'0.010 (0.003)','saturated fine sand, frozen':'0.06 (0.018)','saturated sand with peat/organic silt':'0.04 (0.012)','clayey sand, clay, silt above water':'0.04 (0.012)','marly chalk':'0.1 (0.03)','loess':'0.1 (0.03)','saturated clay with sand and silt':'0.0-0.12 (0.0-0.037)','sand and silt (Dalmatov)':'0.26-0.36 (0.079-0.11); printed 0.026-0.36','sand fill over bay mud':'0.05-0.2 (0.015-0.061)','dune sand':'0.25-0.65 (0.076-0.2); printed 0.025-0.65','soft Bangkok clay':'0.26-0.44 (0.079-0.13); printed 0.026-0.44','sand-silt, clayey silt, silty sand (Hendriks)':'0.021 (0.006)'}))

add(key='vib_soil_p_to_s_speed_ratio',
 label='Soils: compressional-wave speed is about 1.7 times the shear-wave speed (Poisson ratio about 0.24)',
 status='verified', value_si=1.7, unit_si='ratio c_p / c_s',
 display='c_p ≈ 1.7 c_s for (unsaturated) soils, close to the ν = 1/4 "Poisson solid" (√3 = 1.73) that the exact formulas assume',
 sources=[sTRL], who_when='Hiller & Crabb 2000',
 notes=("TRL 429 p. 5: 'For soils, the compressional wave velocity is typically about 1.7 times the shear wave velocity.' c_p/c_s = 1.7 corresponds to ν = 0.24 (our conversion: ν = (r² − 2)/(2(r² − 1))). Saturated soils are different: below the water table c_p is set by the pore water (about 1,500 m/s) while c_s stays low, so ν approaches 0.5 (Pisa model used 0.33). Our model constants are for ν = 1/4; at ν = 0.45–0.49 the far-field coefficient falls by about 35–40% and the near-field one by about 27–32% (vib_physics_rayleigh_farfield)."))

add(key='vib_physics_nearfield_boussinesq',
 label='Near the step: quasi-static ground velocity from a changing vertical force (Boussinesq)',
 status='derived', value_si=0.1194, unit_si='1 (coefficient (1-ν)/2π at ν = 1/4)',
 display='PPV_near = (1 − ν) · (dF/dt)_max / (2π ρ c_s² r) ≈ 0.119 (dF/dt)_max / (ρ c_s² r)',
 sources=[sCOL], who_when='our derivation 2026 (Boussinesq static surface displacement, differentiated in time)',
 notes=("Static vertical surface displacement at distance r from a vertical point force F on an elastic half-space: u = (1 − ν) F / (2π μ r), μ = ρ c_s² (Boussinesq). When the force changes slowly compared with the wave transit time, the ground follows quasi-statically, so v = (1 − ν) Ḟ / (2π μ r). Checks we ran: (1) the low-frequency limit of the full wavenumber integral for the surface Green's function reproduced −(1 − ν)/(2π) = −0.11937 to within 0.03% (computed −0.11940); (2) the exact time-domain solution (vib_physics_pekeris_step_response) gives PPV·r → 0.375 F_p/(ρ c_s² T) for a Hann pulse and 0.1875 F_p/(ρ c_s² τ) for a raised-cosine ramp, exactly (1 − ν)·max(df/dt)/(2π) for those shapes. Valid for r below about 0.4 c_s T (Hann) or 1.1 c_s τ (ramp), and for r larger than about twice the footprint radius. Colombero et al. is cited only because they list Pekeris (1955) and Lamb (1904) as the classical point-load solutions; the formula is textbook elasticity, not taken from them."))

add(key='vib_physics_rayleigh_farfield',
 label='Far from the step: Rayleigh-wave amplitude from a vertical surface force (Lamb 1904, pole residue)',
 status='derived', value_si=0.0763, unit_si='1 (coefficient C1/√(2π ξ_R) at ν = 1/4)',
 display='Harmonic force F cos ωt: Rayleigh vertical velocity amplitude = 0.0763 F ω^1.5 / (ρ c_s^2.5 √r) (ν = 1/4); c_R = 0.919 c_s',
 sources=[sSS], who_when='our derivation 2026, checked against Miller & Pursey 1955 (via Sanchez-Sesma et al. 2011)',
 notes=("Surface vertical displacement for a vertical harmonic point force: u_z = (F/2πμ) ∫ k_s² ν_α k J0(kr) / R(k) dk, with R(k) = (2k² − k_s²)² − 4k² ν_α ν_β (Rayleigh function), ν_α = √(k² − k_p²), ν_β = √(k² − k_s²). The Rayleigh pole gives |u_z| = (F/μ) C1 √(k_s / (2π ξ_R r)), where ξ_R = c_s/c_R and C1 = |ξ_R √(ξ_R² − γ²) / D'(ξ_R)| with D(ξ) = (2ξ² − 1)² − 4ξ² √(ξ² − γ²) √(ξ² − 1), γ = c_s/c_p. For ν = 1/4: ξ_R = 1.08766 (c_R = 0.9194 c_s), C1 = 0.19957. Velocity = ω u: 0.19957/√(2π·1.08766) = 0.0763. Independent checks: (1) the Rayleigh power implied by this amplitude and the Rayleigh eigenfunctions is 0.04989 ω²F²/(ρ c_s³); Miller & Pursey's 67.35% × 1.209/(π·3^1.5) = 0.04988, agreement 0.02%; (2) C1 equals √(3√3 + 5)/16 = 0.19957, the Rayleigh singularity coefficient in Pekeris's closed form, to 9 digits; (3) the Rayleigh horizontal/vertical ratio comes out 0.681, the textbook value for ν = 1/4. The ω^1.5 growth is why the quick parts of a footfall dominate the far field. Constants for other Poisson ratios in values_json (computed the same way)."),
 values_json=json.dumps({'nu':[0.15,0.2,0.25,0.3,0.35,0.4,0.45,0.49],'cR_over_cs':[0.9022,0.9110,0.9194,0.9274,0.9350,0.9422,0.9490,0.9541],'C1':[0.2449,0.2214,0.1996,0.1794,0.1608,0.1438,0.1282,0.1167],'far_coef_C1_over_sqrt_2pi_xiR':[0.0928,0.0843,0.0763,0.0689,0.0620,0.0557,0.0498,0.0455],'rayleigh_H_over_V':[0.727,0.705,0.681,0.656,0.630,0.602,0.574,0.550],'near_coef_(1-nu)/2pi':[0.1353,0.1273,0.1194,0.1114,0.1035,0.0955,0.0875,0.0812]}))

add(key='vib_physics_pekeris_step_response',
 label='Exact surface motion from a suddenly applied vertical point force (Pekeris 1955 closed form, ν = 1/4), numerically checked',
 status='derived', value_si=None, unit_si='m (displacement)',
 display='w(r,t) = (P/μr)·W(τ), τ = c_s t / r: zero before the P wave (τ < 1/√3); singular at the Rayleigh arrival τ_R = 1.0877; static 3P/(8πμr) afterwards',
 sources=[sCOL], who_when='Pekeris 1955 (formula reconstructed by us and verified numerically, 2026)',
 notes=("Step load P·H(t), Poisson solid, displacement in the load direction, γ_R² = (3 + √3)/4: τ < 1/√3: W = 0. 1/√3 < τ < 1: W = (1/32π)[6 − √3/√(τ² − 1/4) − √(3√3 + 5)/√(γ_R² − τ²) + √(3√3 − 5)/√(τ² − (3 − √3)/4)]. 1 < τ < γ_R: W = (1/16π)[6 − √(3√3 + 5)/√(γ_R² − τ²)]. τ > γ_R: W = 6/(16π) = 3/(8π). We could not fetch Pekeris (1955), PNAS 41:469 (PMC behind a browser check) or Kausel (2012), so we checked the formula ourselves: convolved with a smooth force pulse it matches an independent numerical wavenumber integration of the frequency-domain Green's function to 0.5% (r = c_s T), 0.6% (3 c_s T) and 1.3% (10 c_s T) RMS of peak, with peak velocities within 3–11% (the numerical version carries 0.2% damping, which explains the larger gap at long range). Its Rayleigh singularity coefficient also matches the independent residue calculation exactly. Velocity for any force history: v(r,t) = d/dt ∫ Ḟ(t − s) w_step(r, s) ds. Scripts: scratchpad research/attenuation/scripts/lamb_check2.py and ppv_table.py."))

add(key='vib_physics_pulse_ppv_model',
 label='Recommended PPV model for one footfall: exact elastic result for a smooth force pulse, in closed form',
 status='derived', value_si=None, unit_si='m/s',
 display='PPV = max(near, far) × D; Hann pulse of peak F, length T: near = 0.375 F/(ρ c_s² T r), far = 0.620 F/(ρ c_s^2.5 T^1.5 √r); ramp of rise time τ: near = 0.1875 F/(ρ c_s² τ r), far = 0.181 F/(ρ c_s^2.5 τ^1.5 √r)',
 sources=[sSS, sCOL], who_when='our derivation 2026 (Lamb/Pekeris elastic half-space, ν = 1/4)',
 notes=("Vertical PPV at the surface, distance r, from a vertical force on an elastic half-space (density ρ, shear-wave speed c_s, Poisson ratio 1/4). Two smooth force shapes: 'Hann' F(t) = F·½(1 − cos 2πt/T), 0 ≤ t ≤ T (a stamp or impact that rises and falls); 'ramp' F(t) = F·½(1 − cos πt/τ) for t ≤ τ, then held (a footstep loading up; unloading at toe-off is a second, mirror event). Exact elastic PPV (Pekeris kernel convolved numerically) is PPV = F/(ρ c_s³ T²)·Π(x), x = r/(c_s T), tabulated in values_json. Asymptotes: Π → 0.375/x (Hann) and 0.1875/x (ramp) near the source; Π → 0.620/√x and 0.181/√x far away (the far constants also follow analytically from vib_physics_rayleigh_farfield: 0.6198 and 0.1808). max(near, far) is within 17% (Hann, worst at x ≈ 1.3) and 13% (ramp, x ≈ 0.9) of the exact elastic value; the power mean (near^3.75 + far^3.75)^(1/3.75) is within 5% for the ramp. D is the damping factor in vib_physics_damping_factor (≈1 within a few wavelengths). Half-sine pulses (kinks at start and end) give unbounded elastic PPV and are not used; real onsets are smooth. Assumes: homogeneous half-space (no layering, water table or slab), point source (footprint radius ≲ 0.2 c_s T), linear ground (shear strain PPV/c_s below about 10⁻⁴), vertical force only."),
 values_json=json.dumps({'x_r_over_csT':[0.02,0.038,0.072,0.137,0.26,0.493,0.936,1.778,3.375,6.407,12.164,23.094,43.843,83.236,158.021,300.0],'Pi_hann':[18.8,9.88,5.22,2.79,1.51,0.885,0.566,0.426,0.312,0.239,0.175,0.132,0.1,0.0686,0.05,0.0348],'Pi_ramp':[9.38,4.94,2.6,1.38,0.73,0.398,0.227,0.145,0.0977,0.0707,0.0515,0.0383,0.0287,0.02,0.0145,0.0102],'PPV':'F/(rho cs^3 T^2) * Pi(x); T = pulse length (Hann) or rise time tau (ramp)','asymptotes':{'hann_near':'0.375/x','hann_far':'0.620/sqrt(x)','ramp_near':'0.1875/x','ramp_far':'0.181/sqrt(x)'},'nu':0.25,'table_noise':'about 3% from sampling the Rayleigh singularity'}))

add(key='vib_physics_damping_factor',
 label='Material damping of a footfall pulse with distance (constant damping ratio ξ applied to every frequency)',
 status='derived', value_si=None, unit_si='1',
 display='D = (1 + (ζ/0.224)^1.4)^(−2.5/1.4) for a Hann pulse, D = (1 + (ζ/0.195)^2.05)^(−1.5/2.05) for a ramp; ζ = ξ r / (c_R T)',
 sources=[sCOL, sCAL], who_when='our derivation 2026',
 notes=("Each frequency ω decays as exp(−ω ξ r / c_R) (constant-Q damping; Colombero et al. use the same exp(−2πξ r/λ_R) form, eq. 2). Applied to the far-field Rayleigh pulse spectrum (F̂(ω)·ω^1.5) and taking the new peak gives D(ζ), ζ = ξ r/(c_R T). Fits within a factor 1.10 (Hann) and 1.21 (ramp) of the computed D over ζ = 0.001–100. At long range D falls as ζ^-2.5 (Hann) or ζ^-1.5 (ramp): the pulse stretches as high frequencies die, so PPV decays as a power of distance, not exponentially. A single fixed α (Bornitz) applied to the peak over-damps a pulse at long range (it gave 10⁻⁴–10⁻⁶ of the elastic value at 200 m for soft soil, which no data support). We apply D to both near and far terms (harmless near the source, where ζ is small, and it stops the 1/r term from dominating at long range). Example: Pisa drop (ξ = 0.03, r = 60 m, c_R = 138 m/s, T = 0.03 s): ζ = 0.43, D = 0.12."),
 values_json=json.dumps({'zeta':[0.0,0.001,0.00316,0.01,0.0316,0.1,0.316,1.0,3.16,10.0,31.6,100.0],'D_hann':[1.0,0.994,0.981,0.943,0.83,0.562,0.188,0.021,0.00132,7.53e-05,4.23e-06,2.24e-07],'D_ramp':[1.0,0.996,0.989,0.965,0.894,0.707,0.365,0.0975,0.0185,0.00328,0.000553,7.2e-05],'fit_hann':'(1+(zeta/0.224)^1.4)^(-2.5/1.4)','fit_ramp':'(1+(zeta/0.195)^2.05)^(-1.5/2.05)'}))

add(key='vib_physics_seismic_energy_from_force',
 label='Seismic energy radiated by a changing vertical force on the ground',
 status='derived', value_si=0.1481, unit_si='1 (coefficient in E = k ∫(dF/dt)² dt / (ρ c_s³), ν = 1/4)',
 display='E_seismic = 2.418/(π ρ c_p³) ∫ (dF/dt)² dt = 0.148 ∫ (dF/dt)² dt / (ρ c_s³); two-thirds of it in Rayleigh waves',
 sources=[sSS], who_when='our derivation 2026 from Miller & Pursey 1955',
 notes=("From Π = 1.209 ω² P²/(π ρ c_p³) for P cos ωt, the real part of the ground's point admittance is Re Y = 2Π/P² = 2.418 ω²/(π ρ c_p³). For a transient force, E = (1/π) ∫₀^∞ |F̂(ω)|² Re Y dω = 2.418/(π ρ c_p³) · ∫ Ḟ² dt (Parseval). With c_p = √3 c_s: 0.148 ∫Ḟ² dt/(ρ c_s³). Our own Rayleigh flux gives the same 0.1482. Examples (ours): Pisa drop as a 0.025–0.04 s Hann pulse of momentum 997 kg·m/s on c_s = 160 m/s: 6–25 J, i.e. 0.2–0.6% of the 3.8 kJ drop energy, above the 10⁻⁴ (range 10⁻⁵–10⁻³) seismic efficiency the lab uses for large impacts (existing key seismic_efficiency_impact, Collins et al. 2005). Rex walking (1.2 × body weight, 0.1 s raised-cosine rise and fall) on loose sand (ρ 1,600, c_s 120): about 1.7 J per step; stiff clay 0.15 J; granite 6 × 10⁻⁵ J. The energy depends on how fast the force changes, not on body energy, so a seismic-efficiency factor is the wrong tool for footsteps."))

add(key='vib_model_check_pisa',
 label='Check: the elastic pulse model against the Pisa drop test (130 kg from 3 m)',
 status='derived', value_si=1.3, unit_si='ratio (worst model/measured, best-guess inputs)',
 display='Inputs c_s 150 m/s, ρ 1,850 kg/m³, ξ 0.03, Hann pulse 0.03 s carrying the drop momentum (997 N·s): 9.3, 6.1, 0.65, 0.21 mm/s at 2.5, 5, 35, 60 m vs measured 9, 5, 0.5, 0.2',
 sources=[sCOL], who_when='our calculation 2026',
 notes=("Pulse: Hann with F·T/2 = 997.4 N·s (momentum of 130 kg at √(2g·3) = 7.67 m/s, no rebound, as the test intended), T = 0.03 s (the measured central frequency is about 25 Hz; T = 1/f gives 0.04 s, so 0.025–0.04 s was tried). Soil from the site table (vib_pisa_soil_profile). Spread over the plausible inputs (T 0.025–0.04 s, c_s 150–170 m/s, ξ 0.03): 3.4–14.5 mm/s at 2.5 m, 2.3–9.3 at 5 m, 0.38–0.79 at 35 m, 0.15–0.24 at 60 m. So with the force history roughly known the model is good to about a factor of 1.5, and the main error comes from the contact time (near-field PPV ∝ 1/T). The test's contact time was not measured; one site only."))

add(key='vib_model_check_elephant',
 label='Check: the elastic pulse model against elephant stomps (weak test: force unknown)',
 status='derived', value_si=None, unit_si='m/s',
 display='A 10 kN footfall with a 0.05–0.1 s ramp on ground with c_s 280 m/s gives 11–35 µm/s at 7.5–12 m and 4–9 µm/s at 40 m; reported about 24 and 8.5 µm/s (peak)',
 sources=[sARX, sOCR], who_when='our calculation 2026',
 notes=("Ground from the measured 248–264 m/s surface-wave speed (c_s ≈ 280 m/s), ρ = 1,800 kg/m³ and ξ = 0.03 assumed. Force per foot and rise time are guesses (about a quarter to a half of a 3–4 t animal's weight; 20 Hz signal content suggests 0.025–0.1 s); a 10–20 kN Hann pulse of 0.05 s instead gives 82–163 µm/s at 7.5 m and 23–47 µm/s at 40 m. The model brackets the reported values within about a factor of 2–3 for plausible inputs and reproduces the near/far ratio (model 2–4, reported 2.9). This tests the distance trend more than the absolute level."))

add(key='vib_rayleigh_horizontal_and_resultant',
 label='Vertical vs resultant PPV for a footfall',
 status='derived', value_si=1.1, unit_si='ratio resultant/vertical', low_si=1.0, high_si=1.2,
 display='Resultant (vector) PPV ≈ 1.0–1.2 × the vertical PPV the model gives',
 sources=[sBS], who_when='our calculation 2026',
 notes=("Rayleigh wave at ν = 1/4: horizontal/vertical amplitude 0.68, a quarter cycle apart, so the resultant peak is close to the vertical peak. Quasi-static near field: radial/vertical surface displacement = (1 − 2ν)/(2(1 − ν)) = 1/3 at ν = 1/4, resultant 1.05 × vertical. BS 5228-2 Table E.1 predicts the resultant ('νres resultant PPV'); some damage standards use the largest single component. Treat model PPV × 1.1 as resultant."))

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
 sources=[], who_when='our estimate 2026',
 notes=("c_s = √(G/ρ) with a typical structural-steel shear modulus of 77–80 GPa (not fetched in this run) and the lab's verified steel density 7,850 kg/m³ (existing key density_structural_steel): 3,130–3,190 m/s; textbook tables give about 3.2 km/s. Listed only for completeness: a steel deck vibrates as a plate on supports, and the half-space model does not apply (vib_plate_surfaces_not_modelled)."))

add(key='vib_small_strain_damping_ratio',
 label='Material damping ratio of soils and rock at small (footstep) strains',
 status='estimate', value_si=0.03, unit_si='1', low_si=0.005, high_si=0.07,
 display='Soils about 2–5% (Pisa site: 2–7%); rock about 0.5–2%',
 sources=[sCOL, sCAL], who_when='our estimate 2026, anchored on Colombero et al. 2015 Table 1',
 notes=("Pisa site layers: 2.0–7.0% (verified, vib_pisa_soil_profile); Colombero et al. fitted k = 2πξ = 0.302 for the measured drop data (ξ ≈ 4.8%). Caltrans α values (vib_material_damping_coefficients) convert to ξ = α c_R/(2π f): for 20 Hz and c_R 150 m/s, most entries (0.02–0.26 m⁻¹) give 2–30%, and dune sand's 0.65 m⁻¹ would give about 80%, implausible at 20 Hz, so those α were probably measured at higher frequencies. Our picks: loose sand 4%, dense sand and gravel 3%, soft clay 5%, stiff clay 3%, road or slab subgrade 3%, granite 1%. Damping matters little within about 10 m and controls the result beyond about 30 m."))

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
 notes=("The ground sees the sum of both feet's forces. While each foot alone goes from zero to 1.0–1.5 × body weight, the sum of both feet in walking varies much less, because one foot unloads as the other loads (general walking biomechanics, not from the cited abstract; Ekimov & Sabatier only note that the force of multiple footsteps is concentrated at 1–4 Hz). For wavelengths long compared with Rex's stride (1–2 m) the loading and unloading feet act partly as one varying source, which lowers the far-field PPV; near either foot (r of a few metres or less) the nearer foot dominates and the single-foot result holds. Fast transients (foot slap at touchdown) do not cancel. Not quantified with data; treat the single-foot model as an upper estimate for walking."))

json.dump(F,open('../out/facts.json','w'),ensure_ascii=False,indent=1); print(len(F)); import collections; print(collections.Counter(x['status'] for x in F))
