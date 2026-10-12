#!/usr/bin/env python3
"""Compile the elephant topic: researcher facts + verifier corrections -> compiled/elephant.json."""
import json
import os
import sys

BASE = '/tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad'
R = json.load(open(os.path.join(BASE, 'wfout/research_elephant.json'), encoding='utf-8'))
FIELDS = ['key', 'category', 'label', 'status', 'value_si', 'unit_si', 'low_si', 'high_si', 'display', 'sources', 'notes', 'who_when']

ST_URL = 'https://gfzpublic.gfz.de/pubman/item/item_5034960_2/component/file_5034988/5034960.pdf'
WIJ24 = 'https://arxiv.org/pdf/2406.05140'
MORT = 'https://discovery.ucl.ac.uk/id/eprint/10063309/1/1-s2.0-S0960982218304202-main.pdf'
MORT_S = 'https://ars.els-cdn.com/content/image/1-s2.0-S0960982218304202-mmc1.pdf'
OC06 = 'https://bec.ucla.edu/wp-content/uploads/sites/108/archive/papers/OConnellRodwell_4.16.07.pdf'

facts = {f['key']: dict(f) for f in R['facts']}
order = [f['key'] for f in R['facts']]


def upd(key, **kw):
    facts[key].update(kw)


# 1 Steinmann displacement
upd('elephant_steinmann2025_walk_20m_displacement',
    sources=facts['elephant_steinmann2025_walk_20m_displacement']['sources'] + [
        {'title': 'Wijayaraja et al. (2024) arXiv 2406.05140 (IEEE Access 12:72210-72223), secondary statement of the instrument used by Szenicer et al.', 'url': WIJ24}],
    notes="Read from Fig. 3f 'elephant, NWP05, 20 m' (y-axis 'Displacement [m]', ×1e-8, dashed gridlines at ±2.5): page rendered at 400 dpi, trace measured in pixels against the gridlines. Largest peak +4.0e-8 m (minimum −3.1e-8); median of the 12 largest peaks 1.9e-8 m; reading error about ±0.1e-8. Station NWP05 'is located on sandy dry ground'; data 'at 200 Hz ... high-pass filtered with a 5 Hz corner frequency'. The 20 m is a camera-trap estimate. One 10 s record of one wild animal, vertical component, Mpala Research Centre, Kenya, Feb–Mar 2019; mass not reported. The paper says only 'broadband seismometers' and does not describe instrument correction. Reported (secondary): Wijayaraja et al. 2024 say Szenicer et al., whose SeisSavanna data these are, used a Guralp 6TD seismometer. Verifier: own reading 3.9e-8 m max, 1.85e-8 m typical.")

# 2 Steinmann PPV: vector caveat corrected
upd('elephant_steinmann2025_walk_20m_ppv',
    notes="Formula: peak velocity ≈ 2πf × peak displacement, treating each footfall as a narrow-band wavelet at its dominant frequency. Inputs: 4.0e-8 m (largest step) and 1.9e-8 m (typical) from elephant_steinmann2025_walk_20m_displacement; f = 18.7 Hz from elephant_steinmann2025_footfall_frequency. Largest step 2π × 18.7 × 4.0e-8 = 4.7e-6 m/s; typical 2.2e-6; over the 13.8–24.3 Hz quartiles the largest step gives 3.5e-6 to 6.1e-6. Expect ±30–50% from the conversion. Vertical component only. Verifier: own reading gives 4.5e-6 m/s (3.3–5.8e-6). Verifier corrected the vector caveat: for an ideal Rayleigh wave the true vector peak equals the vertical peak; only a pseudo-vector sum of separate component peaks is about 1.2×. Real horizontal/vertical ratios on soft ground were not measured. Best single anchor: the only peer-reviewed record in physical units of a walking elephant at a stated distance. Still one animal, one site, one record.")

# 3 frequency
upd('elephant_steinmann2025_footfall_frequency',
    notes="Brightness-weighted frequency of the printed scalogram (log axis 10–100 Hz, ticks located in pixels): brightest row 20.4 Hz, weighted median 18.7 Hz, quartiles 13.8 and 24.3 Hz. Verifier: inverting the colours through the figure's colorbar gives 18.3 Hz (quartiles 13.5–23.7). Agrees with the other studies: Wood et al. 2005, 'All species have a peak around 25 Hz', most energy 10–40 Hz; O'Connell-Rodwell et al. 2000 abstract, 'predominant frequencies in the range of 20 Hz'; Wijayaraja et al. 2024, power-spectrum peaks 26–29 Hz; Mortimer et al. 2018 Table S1, dominant ranges 5–10 to 20–25 Hz for walks. Ground changes it: Steinmann says giraffe footfalls on muddy ground near the waterhole 'exhibit almost no energy above 30 Hz', and on rocky ground show 'little energy below 20 Hz'.")

# 4 running
upd('elephant_steinmann2025_running_38m',
    notes="Pixel reading of Fig. 3g (y-axis ×1e-8 m, gridline at +2.5): largest peak +2.5e-8 m, minimum −1.9e-8 m, median of the 12 largest peaks 1.3e-8 m. Scalogram weighted median 27.8 Hz (quartiles 19.2–36.8). v = 2π × 27.8 × 2.5e-8 = 4.4e-6 m/s (3.0e-6 to 5.8e-6 over the quartiles). Running gives 'smaller time intervals between individual footfalls'. NTA02 is near the waterhole; the paper says those stations share 'similar site conditions due to the presence of water'. Scaled to 20 m with 1/D this is 0.006–0.011 mm/s (verifier's arithmetic). Verifier: own reading 2.45e-8 m, 26.5 Hz, 4.1e-6 m/s.")

# 5 group: 8x -> 6-7x (verifier ok=false)
upd('elephant_steinmann2025_group_20m',
    display="Displacement about 5 × 10⁻⁹ m; about 0.0008 mm/s, about 6–7× weaker than the single elephant",
    notes="Pixel reading of Fig. 3h (y-axis ×1e-9 m, gridlines ±5): largest peak 5.3e-9 m, median of the 12 largest 3.0e-9 m. Weighted frequency 22.5 Hz, so v = 2π × 22.5 × 5.3e-9 = 7.5e-7 m/s. The paper: 'Figure 3h shows a group of four elephants in locomotion, resulting in a tremor-like signal.' Same station and same labelled distance as the single elephant (Fig. 3f), yet weaker, so individual steps and estimated distances vary a lot. The camera-trap distance may refer to the nearest animal, or the group may have walked more softly. Use it to widen the uncertainty band, not as a separate anchor. Verifier: corrected '8× weaker' to 6–7× (velocity ratio 4.7e-6 / 7.5e-7 = 6.3; displacement ratio 7.5); own reading 5.2e-9 m at 22.3 Hz.")

# 6 other animals: trim only
upd('elephant_steinmann2025_other_animals',
    notes="Same method as the elephant facts: pixel readings of the printed seismograms and scalograms, then v = 2πf × u. For Fig. 4, f = 20 Hz is assumed because the scalograms were not measured. No masses reported; the human's mass and gait are unknown. Authors' ranking: 'The giraffe produces the footfall signals with the largest amplitudes for individual animals, followed by the elephant, zebra and human.' Distances are camera-trap estimates. Single 10 s records: each is one example, not an average. Verifier: spot-checked panels 3a–3e and 4a–c; peaks match to about 10% (some are negative peaks) and the conversions recompute.")

# 7 site spread: relabel (verifier ok=false)
upd('elephant_steinmann2025_site_spread',
    label="Spread between single walking-giraffe records at three stations (20–34 m): about ×70–110 in peak displacement; site, animal and distance error mixed together, not a measured ground effect",
    display="About ×70–110 between single giraffe records at three stations (not corrected for distance; not a measured ground effect); ×16 drop from 26 m to 103 m at one station",
    notes="Peak displacements (pixel readings): NWP05 (sandy dry ground) at 20 m, 2.5e-7 m; ETA00 at 26 m, 3.5e-9 m; NNL62 (rocky ground) at 34 m, 2.3e-9 m. Ratios 71 and 109. Each is one record of a different giraffe at a camera-trap distance, possibly on different sensors. The paper discusses the site in terms of frequency content ('illustrating the impact of the site on the signal's frequency content'), with a general remark that the muddy station's ground (named ETB00 in the text, ETA00 in the figure) 'attenuates high-frequency seismic waves, but amplifies ground motion amplitudes at low frequencies'; it does not quantify an amplitude difference between stations. At ETA00, 26 m → 103 m drops 3.5e-9 → 2.2e-10 m (×16); the paper says the 103 m record has 'a worse SNR overall due to low signal amplitudes', so that decay may be overstated. Verifier: the old label 'How much the ground changes the signal' was unsupported; relabelled.")

# 8 soft feet: relabel (verifier ok=false)
upd('elephant_steinmann2025_soft_feet_finding',
    label="Elephant footfalls lack the sharp impulses of hoofed animals (authors link this to soft cushion-like feet); separately, the elephant gave smaller amplitudes than a giraffe, which the authors call surprising",
    display="No sharp impulses, which the authors link to 'soft cushion-like feet'; smaller amplitudes than a giraffe and similar to a more distant zebra, which they call 'surprising' and do not explain",
    notes="Quotes: 'While hoofed animals such as giraffes, zebras and warthogs produce clear and sharp impulses (Figure 3a,b,e), elephant with its soft cushion-like feet and hyena with its paws do not show these clear impulses (Figure 3d,f).' 'It is surprising to see that the elephant, having the largest average weight compared to the other animals, produces smaller amplitudes than the giraffe and similar amplitudes to the zebra, which is even more distant.' The authors link the feet only to the impulse shape. That the cushioned feet also explain the weaker amplitude is our inference, not theirs; if it holds, seismic output depends on how sharply the foot lands, not only on mass. Verifier: the earlier label and summary had attributed the weaker signal to the feet; relabelled.")

# 9 classification distance: 150 m is a cut-off (verifier ok=false)
upd('elephant_steinmann2025_classification_distance',
    label="Classification accuracy for savanna footfalls (elephant, giraffe, hyena, zebra) by maximum animal–sensor distance; 150 m is the dataset's cut-off",
    display="87% balanced accuracy up to 50 m; 77% up to 150 m (150 m is where the dataset stops, not a detection limit)",
    notes="Quote: 'The machine learning model achieves a balanced accuracy of 87% with a maximum animal-sensor distance of 50 m and 77% with a maximum animal-sensor distance of 150 m'. The authors put the drop down to 'decreasing signal and label quality'. Seismograms 'were extracted from seismic stations that are not further away than 150 m from the localized animals', so 150 m is the maximum distance chosen when building the dataset, not a measured detection or noise limit. SeisSavanna: 70,637 three-component 10 s seismograms from 11 wildlife categories. Classification by a broadband seismometer, not a range at which people could feel anything. Verifier: corrected the note that had called 150 m a detection range.")

# 10 Szenicer: instrument (reported)
upd('elephant_szenicer2022_detection_100m',
    sources=facts['elephant_szenicer2022_detection_100m']['sources'] + [
        {'title': 'Wijayaraja et al. (2024) arXiv 2406.05140, secondary statement of Szenicer et al.\'s instrument', 'url': WIJ24}],
    notes="Abstract quote: 'Our classifiers ... achieved 80%–90% balanced accuracy in detecting elephants up to 100 m away, and over 90% balanced accuracy in recognising running and rumbling behaviours'. Data: '8000 h seismic recordings and 250 k camera trap pictures'. Full text blocked (publisher bot check), so no amplitudes. Same Mpala experiment as Steinmann et al. 2025 (SeisSavanna). Reported (secondary, from the verifier's list): Wijayaraja et al. 2024 write that Szenicer et al. 'utilized a Guralp 6TD seismometer to detect elephants'. A machine-learning detection range for a broadband seismometer, not a range at which people could feel anything.")

# 11 Mortimer fast walk: calibration wording
upd('elephant_mortimer2018_fastwalk_velocity',
    notes="Fig. 1D 'Fast walk', y-axis 'Velocity (m s-1)', ticks ±4×10^-4; caption: 'recorded vertical ground velocity'. 600 dpi pixel reading: positive peaks 3.6e-4, 3.4e-4, 2.1e-4 m/s; negative 2.6e-4, 2.6e-4, 2.1e-4. Linked to the 946 N source force. Supplement: 'One geophone (RTC-4.5Hz-395 vertical, USA)'; 'Sampling frequency was 600 Hz'; geophone 'close (range of 2 to 30 m) to a focal individual'; 'elephants were mostly on river sands' (three consolidation levels), some on gneiss. Samburu and Buffalo Springs, Kenya; masses not given. Voltage was 'converted to velocity by multiplying by a calibration factor (set by hardware) of 23.4 V m-1 s-1'; the units imply division. These values are 40–80× the Steinmann value at 20 m. Verifier: the half-space check (at this walk's 5–10 Hz band) is consistent within a factor of a few only if the elephant was within about 2–5 m; it does not confirm the calibration.")

# 12 Mortimer forces: label, 2546 note
upd('elephant_mortimer2018_source_forces',
    label="Seismic source force of elephant behaviours (peak of the deconvolved source function; geophone band ≥4.5 Hz; propagation modelled 4.5–25 Hz)",
    notes="Table S1 'Max. force (N)'. A source function is 'the force strength and pattern generated by the elephant at the source', found by deconvolution against on-site weight drops: 'We calibrated the force generated through the weight dropping by using high-speed camera footage and force-motion equations'. 'Walks were chosen as they included the maximum, minimum and median maximum forces during that recording.' Reading it as the dynamic force in the seismic band, not the full ground reaction force, is our interpretation, not the paper's words. For comparison, walking_running_peak_vertical_force puts walking at 1.0–1.5× body weight (30–45 kN for 3 t). Verifier: the main text pairs 'maximum seismological force 2546 N' with a cow rumble (6.4 km), but Table S1 gives 2546 N to Bull 1 rumble 2; the 6.4 km is Cow 2 rumble 2 on sand. This is the paper's own inconsistency.")

# 13 force vs weight: 30-300x, adult walks only
upd('elephant_mortimer2018_source_force_vs_weight',
    display="Adult walks about 0.4–4% of body weight; a climbing step 3.5–5% (if the elephants weighed 2.5–3.5 t)",
    notes="Formula: F_seis / (m g). The Kenyan elephants were not weighed; we assumed 2,500–3,500 kg (as elephant_ren2008_masses). The assumption fits only the adult walks: Walks 2 and 5 were young animals and are left out. Adult walks: 125 N → 0.36–0.51%; 279 N → 0.8–1.1%; 946 N (fast walk) → 2.8–3.9%. Climbing step 1,190 N → 3.5–4.9%. Heavier adult bulls would give smaller shares. Use: an elephant-like soft step puts only a few percent of body weight into the band that makes ground vibration. Feeding the full ground reaction force (1.2 × body weight, W8.WALK_LOAD) into a seismic formula would overstate it by about 30–300×. Verifier: arithmetic confirmed; corrected 30–200× to 30–300× and restricted the mass assumption to the adult walks.")

# 14 modelled range
upd('elephant_mortimer2018_modelled_range',
    notes="Main text: 'Maximum propagation range estimates were 6.4 km for cow rumble versus 3.6 km for fast elephant walk'; ranges were '84 ± 16% lower under higher noise on average'. Fig. 1 caption: 'Only fast walk at 1000 m is not detectable over background noise'; the Fig. 1 case was modelled 'with high noise on sandy terrain'. Detection used STA/LTA (threshold 1.6) on modelled waveforms for a sensitive geophone: instrument detectability, not human feeling. The 3,600 m is Walk 4 (the fast walk) on sand, low noise, 10–15 Hz band; Table S1 walk ranges run from 0 to 3,600 m with ground, noise and band, in 200 m steps (verifier).")

# 15 O'Connell stomp p-p: trim
upd('elephant_oconnell2000_stomp_pp_velocity',
    notes="Secondary quote of O'Connell-Rodwell, Arnason & Hart (2000) J. Acoust. Soc. Am. 108:3066-3072: 'According to [44], the RMS velocity of elephant rumbles is 0.437 µm/s at a distance of 3-12 m and is 0.264 µm/s at a distance of 40 m. For the corresponding distances, experimental peak-to-peak velocities for stomps were 48.7 µm/s and 17.0 µm/s, respectively.' Also: 'The footfall signature of the elephant (i.e., stomp) has a mean frequency of 24.03 Hz (±2.98)'. Its Table 1 lists the 2000 study's geophone as 10 Hz vertical, 8000 samples/s. The primary paper was paywalled, so these are not confirmed against it: 'reported'. Captive Asian elephants; masses and ground unknown. Verifier: quote verbatim; Table 2 cross-check 48.7 µm/s × 85.8 V/(m/s) = 4178.46 µV.")

# 16 O'Connell stomp ppv: derived from reported inputs -> reported
upd('elephant_oconnell2000_stomp_ppv',
    status='reported',
    notes="Formula: zero-to-peak ≈ peak-to-peak / 2, assuming a waveform symmetric about zero; the true peak lies between p-p/2 and p-p. 48.7/2 = 24.4 µm/s (up to 48.7) at 3–12 m; 17.0/2 = 8.5 µm/s at 40 m. Status stays 'reported', not 'derived', because the inputs are a secondary quote (elephant_oconnell2000_stomp_pp_velocity). These are deliberate stomps, possibly from a mock charge (our inference; see elephant_oconnell_stomp_mock_charge), so they likely overstate an ordinary walking step. Decay between the two distances gives n = 0.41–0.87 (elephant_decay_exponent_from_data). Verifier: halving and exponents recomputed.")

# 17 mock charge: relabel; quote verified, link is inference (verifier ok=false)
upd('elephant_oconnell_stomp_mock_charge',
    label="Authors' SICB abstract: foot stomps from a mock charge modelled to travel up to 32 km (instrument detectability)",
    notes="Verified for the quote only. SICB: 'Using seismic modeling, we estimated that the elephant rumbles that we recorded could potentially travel up to 16.7 km in the ground and foot stomps from a mock charge could possibly travel up to 32 kilometers.' JASA 2000 abstract: 'up to 16 km' for vocalizations and 'up to 32 km for locomotion generated signals'. That the JASA 2000 stomp amplitudes (elephant_oconnell2000_stomp_pp_velocity) came from mock charges is our inference from the matching 32 km; treat that link as an estimate. The SICB page shows no meeting year (archive entry migrated in 2021). 32 km is a model of instrument detectability, not a measurement. Verifier: the old label stated the mock-charge link as verified fact; relabelled.")

# 18 abstract measurements: trim
upd('elephant_oconnell2000_abstract_measurements',
    notes="Abstract: 'elephant generated signals associated with rumbles and \"foot stomps\" propagated at different velocities in the two media, the acoustic signals traveling at 309 m/s and the seismic signals at 248-264 m/s. Both types of signals had predominant frequencies in the range of 20 Hz. Seismic signal amplitudes considerably above background noise were recorded at 40 m from the generating elephants for both the rumble and the stomp.' A 1998 JASA meeting abstract (doi:10.1121/1.423611, via OpenAlex) describes four geophones at about 30 m intervals out to 120 m. Full paper not available. Verifier: quotes verbatim; 1998 abstract confirmed.")

# 19 rumble: display and unit (verifier ok=false)
upd('elephant_oconnell_rumble_ground_velocity',
    unit_si='m/s (40–60 Hz band; RMS by context)',
    display="Mean 0.276 µm/s at 10 m (40–60 Hz band; RMS by context); not directly comparable with stomp peak values",
    notes="Quote: playback was raised 'to peak presentation velocities ranging from 0.44 to 1.1 μm/s root mean square (RMS) at 10 m from the elephants, approximating the velocity of a naturally occurring seismic elephant rumble (40–60 Hz) at this distance (mean 0.276 μm/s; O'Connell-Rodwell et al. 2000a)'. The paper does not explicitly call the 0.276 mean RMS; the sentence implies it. The 2024 secondary quote gives 0.437 µm/s RMS at 3–12 m and 0.264 at 40 m for rumbles. Band-limited RMS values are not peak values. Mortimer 2018 found large rumble source forces (up to 2,546 N), so the studies differ on rumbles. Verifier: removed the earlier '100× weaker than a stomp' comparison, which set an RMS value against a peak value.")

# 20 attenuation: fitted range caveat
upd('elephant_oconnell2006_surface_wave_attenuation',
    notes="Quotes: 'we used the standard surface wave attenuation rate model (White 1965)'; Eq. (1) 'relates the velocity level L (m/s) at distance r based on a source signal level L0 and propagation constant α'. Fits: 'α=0.05/m and L0=25.5×10−6 m3/2/s ... for shaker-induced motions'; background 'α=0.018/m and L0=4×10−7 m3/2/s'. Table 1 noise α per trial 0.007–0.023 (mean 0.016). Ground: 'relatively homogeneous calcrete' (Etosha). Fitted at 40–60 Hz (45 Hz shakers) from two geophones (10 m and 90 m). Verifier: recomputed Eq. 1 (13.8 dB at 10 m, −30.5 dB at 90 m, as printed). Do not carry α to footstep frequencies near 20 Hz without scaling: at constant Q, α scales with f, giving roughly 0.008–0.022 per m at 20 Hz (verifier's scaling, an estimate). Using 0.05 per m at 20 Hz would cut 100 m amplitudes by e^−5 (about 150-fold) on top of spreading.")

# 21 Wood detection radius
upd('elephant_wood2005_detection_radius',
    notes="Quote: 'Given that the duration of the recording in which footfalls are visible is 166 s, the radius of detection is roughly 100 m.' Speed: 'we estimated its speed at 1·2 m s−1'. Discussion: 'the detection radius for an elephant footfall is roughly 100 m in Etosha National Park. This will vary depending on the soil type'. Setup: 'a single 4·5 Hz vertical geophone ... buried 1 m from a major path leading to the waterhole, at a depth of 15 cm'; 31 bull and 12 herd recordings at Mushara waterhole, June 2002. Amplitudes normalized only. Wild African elephants, masses not given. The only measured detection radius among these studies; it is site-specific (the other long ranges are dataset cut-offs, space limits or models).")

# 22 Wood overhead vs 20 m
upd('elephant_wood2005_overhead_vs_20m',
    notes="Quote: 'we can use Fig. 4 to estimate the maximum amplitude for an elephant that passed 20 m from the geophone. As indicated on the figure, this is considerably lower (∼20 dB) than when the elephant passed directly over the geophone.' 20 dB = ×10 in amplitude. The geophone was buried 1 m from the path, so 'directly over' is about 1 m, giving a decay exponent n = ln 10 / ln(20/1) ≈ 0.77; n = 1.0 would need r0 = 2 m (verifier). The authors' estimate from a time-to-distance conversion of one bull's envelope, not a calibrated pair of measurements.")

# 23 Wood spectrum
upd('elephant_wood2005_spectrum_and_gait',
    notes="Quotes: 'All species have a peak around 25 Hz but the shape of the spectra are different, with the elephant spectrum having the most pronounced low-frequency component'. 'A25Hz /A50Hz ∼ 1000 for elephants, but ≤ 100 for the other measured species.' Band-pass 10–40 Hz was used 'as most of the energy of the footfalls fell within this band pass range'. 'a large amplitude event (a front foot striking the ground) every ∼1·5 s, preceded by a smaller amplitude event (a rear foot striking the ground)'. Speed 1.2 m/s for the bull in Fig. 4. Species: elephant, gemsbok, giraffe, human, kudu, lion. Amplitudes normalized only. Verifier: A25/A50 comes from power-spectrum plots, so it is probably a power ratio; quoted as printed.")

# 24 Wijayaraja masses: S1 0-100 m, mahout, space-limited
upd('elephant_wijayaraja2024_detection_and_masses',
    display="Elephants of 2,700–3,500 kg; a 2,700 kg elephant detected walking 155.6 m away (limited by the space available, not by noise)",
    notes="Table 5 (Pinnawala Elephant Orphanage, partly tamed): E1 56 y, 3,500 kg, 233 cm; E2 25 y, 3,100 kg, 237 cm; E3 16 y, 2,700 kg, 222 cm. 'The maximum distance was reported when the gain setting was S2: Av(total) = 25,911, and the reported maximum distance was 155.6 m. The detection range was limited only by the available physical space'. Table 6: gain 580 (S0) detected 0–50 m; gain 940 (S1) detected 0–100 m; S2 saturated within 100 m and detected 100–160 m. Geophone 'RGI-HS 10', vertical, 10 Hz, 'sensitivity of 85.8 V/m/s'. Power-spectrum peaks for E3 walking: 28.4, 29.3, 26.28 Hz. E3 carried a mahout ('the mahout was riding on top of the elephant'). Figures are ADC counts only. Verifier: corrected S1 to 0–100 m; added the mahout.")

# 25 Wijayaraja derived velocity
upd('elephant_wijayaraja2024_derived_velocity',
    notes="Formula: v = counts × ADC step / (gain × geophone sensitivity). Inputs stated in the paper: 10-bit ADC 'with a resolution of 4.88 mV'; gain 580 (S0); sensitivity 85.8 V/(m/s). Fig. 21 (E3, 2,700 kg plus a riding mahout, location 2, S0; the same record as Fig. 18a) peaks at about 35–50 counts from the mean (read by eye). 35–50 × 4.88e-3 / (580 × 85.8) = 3.4e-6 to 4.9e-6 m/s. Distance within the 0–50 m S0 range unknown. Filter and amplifier response near 25 Hz assumed flat. Low confidence, but the same size as the Steinmann 20 m value. Verifier: read at 300 dpi, peaks +38, +43, −45, −40 counts, giving 3.7–4.4e-6 m/s.")

# 27 wild range
upd('elephant_wijayaraja2025_wild_range',
    notes="Abstract: 'the maximum validated detection range was 155.6 m in controlled conditions and 140 m in natural environments'. Text: footfalls recorded 'from wild elephants at distances ranging from 66.9 meters to 140 meters' (Kawudulla; Minneriya 85.3–106 m). Acquiring footfall signals 'was challenging, particularly over long distances, due to their very low amplitudes and high susceptibility to noise'. Same 85.8 V/(m/s) 10 Hz geophone with a high-gain amplifier: an instrument range. The 2024 paper says the controlled-test range was limited by space and higher gain would extend it, so these are not noise limits.")

# 28 Ren masses: cross-reference adult averages
upd('elephant_ren2008_masses',
    notes="Table 1: Chandrika, Asian F, 14 y, 3,000 kg; Damini, Asian F, 12 y, 2,840 kg; Five, African F, 14 y, 2,780 kg; Jack, African M, 13 y, 3,230 kg; Latabe, African F, 13 y, 2,550 kg. Methods: 'All elephants had known body masses (mb) from placing all four limbs on a truck scale (±2 kg).' Read on the PMC page. Rex and Ollie at 3,007 kg each sit inside this range. Adult averages are in the step topic (step_elephant_body_mass_larramendi2016: African bush cow about 3.0 t, bull about 6.0 t). None of the seismic studies weighed their elephants except Wijayaraja et al. 2024 (2,700–3,500 kg).")

# 29 decay exponent: estimate (n = 1 is a judgement), verifier additions
upd('elephant_decay_exponent_from_data',
    status='estimate',
    notes="Formula: n = ln(A1/A2) / ln(D2/D1). (1) O'Connell-Rodwell stomps (reported, secondary): 24.4 → 8.5 µm/s from '3–12 m' to 40 m gives n = 0.41 (D1 = 3), 0.55 (6), 0.87 (12). (2) Wood: ×10 from 'directly over' (about 1 m) to 20 m gives n ≈ 0.77 (1.0 if 2 m). (3) Steinmann giraffes at ETA00, 26 → 103 m: n = 2.0, probably steepened by the far trace sitting near the noise floor, possibly different animals. Verifier: O'Connell 2006's fitted law gives effective n of 1.2 (background) to 2.3 (shakers) between 10 and 90 m at 40–60 Hz, about 0.8–1.3 if scaled to 20 Hz; Mortimer's model suggests a shallower decay (near 0.5) for low-frequency, high-force steps on sand (elephant_mortimer2018_modelled_200m). n = 1 for 5–100 m is our judgement over mixed-quality inputs, so the status is 'estimate', not 'derived'.")

# 30 half-space check: near-field range trimmed, Mortimer wording
upd('elephant_halfspace_check',
    unit_si='m/s (at 20 m)',
    low_si=1.2e-06,
    high_si=8.5e-05,
    display="With Mortimer's 125–946 N forces at 20 Hz, at 20 m: about 0.002–0.01 mm/s on firmer soil, 0.01–0.09 mm/s on loose sand, about 0.001 mm/s on soft rock for 946 N (simple elastic-ground model; not valid within about one wavelength)",
    notes="Lamb's problem, Rayleigh-wave far field of a vertical harmonic point force F on a Poisson half-space (ν = 0.25): u_z(r) = (F k_s / (2μ)) × 0.1996 × sqrt(2 / (π k_R r)), k_s = 2πf/Vs, μ = ρVs², k_R = k_s/0.9194; v = 2πf u_z. Static limit checks against Boussinesq. At 20 Hz and 20 m: loose sand (ρ 1,700, Vs 120 m/s) 946 N → 0.085 mm/s, 125 N → 0.011; firmer soil (ρ 1,900, Vs 250) 0.012 and 0.0016; soft rock (Vs 600) 946 N → 0.0012. Soil values are assumed, not sourced. Ignores damping, layering, foot size and the near field: invalid within about one wavelength (6 m at Vs 120, 12.5 m at Vs 250, 30 m at Vs 600). Verifier: formula and all values reproduce; high_si cut from the 2 m sand value (0.27 mm/s, inside one wavelength) to 20 m. At the fast walk's 5–10 Hz band the model gives 0.06–0.09 mm/s at 2 m, so it matches Mortimer's 0.2–0.36 mm/s only within a factor of a few.")

# 33 anchor (verifier ok=false)
upd('elephant_anchor_ppv_vs_distance',
    display="About 0.005 mm/s at 20 m (band 0.0007–0.04, ×0.15 to ×8); about 0.01 mm/s at 10 m; about 0.02 mm/s at 5 m. Order of magnitude only",
    notes="PPV_elephant(D) = 0.005 mm/s × (20 m / D), 5 ≤ D ≤ 100 m, vertical component; band ×0.15 to ×8 (about 50-fold wide; do not call it '3× either way'). Centre: Steinmann walk at 20 m (0.0047). n = 1 from elephant_decay_exponent_from_data. Low end: Steinmann typical step (0.0022) and the four-elephant group (0.00075). High end: O'Connell-Rodwell stomps scaled to 20 m (0.004–0.019, reported) and Steinmann running (0.006–0.011). Wijayaraja: 0.004 mm/s at 0–50 m; 0.0008 mm/s at 100–160 m fits 1/D. Mortimer's 0.21–0.36 mm/s lies outside the formula's range; it fits only if the elephant was within about 2–3 m (unverified). Do not extrapolate past 100 m: Mortimer's model gives about 0.01 mm/s at 200 m for a fast walk on sand. A 'below background noise' distance is sourced only for Etosha (Wood, about 100 m). Verifier: corrected the running range, the noise-limit claim and the band label.")

# ---- new facts from the verifier's missing list (fetched and confirmed by the verifier) ----
new = []
new.append(('elephant_wijayaraja2024_derived_velocity', {
    'key': 'elephant_wijayaraja2024_more_records',
    'label': "More Wijayaraja et al. 2024 records converted from ADC counts: peak vertical velocity of weighed Sri Lankan elephants walking past (low confidence)",
    'status': 'derived',
    'value_si': None,
    'unit_si': 'm/s',
    'low_si': None,
    'high_si': None,
    'display': "About 0.017 mm/s (2,700 kg E3, somewhere within 0–100 m); 0.011 mm/s (3,500 kg E1, distance unknown); 0.0008 mm/s (E3, 100–160 m). Low confidence",
    'sources': [{'title': 'Wijayaraja, Wijekoon, Wijesundara & Wickramasinghe (2024) arXiv 2406.05140 (published IEEE Access 12:72210-72223), Figs 18b, 18c and 20, Tables 5 and 6', 'url': WIJ24}],
    'notes': "From the verifier's list; peaks read from the figures by the verifier and checked by eye here. Formula: v = counts × 4.88 mV / (gain × 85.8 V/(m/s)). Fig. 18(b), gain S1 = 940, E3: peaks about 280 counts (some touch the plot frame) → 1.7e-5 m/s; Table 6 puts S1 detections within 0–100 m. Fig. 20, 'Walking pattern of elephant E1 synced with video (location 1, gain setting S1)': about 190 counts → 1.1e-5 m/s; location 1 is a 100 m path. Fig. 18(c), S2 = 25,911: about 380 counts → 8.3e-7 m/s; S2 saturated within 100 m, and the paper notes 'a slight clipping at the peak point' even at the maximum tested distance, so this may be an underestimate. E3 carried a mahout. Shows about ×4 between passes of the same animal. Filter response assumed flat; distances not known precisely.",
    'who_when': "Derived here (2026) from Wijayaraja et al., 2024",
    'values_json': json.dumps({"formula": "v = counts x 4.88e-3 V / (gain x 85.8 V per m/s)", "rows": [
        {"figure": "18(b)", "elephant": "E3, 2,700 kg (with mahout)", "gain": 940, "distance_m": "0-100", "peak_counts": 280, "v_m_s": 1.7e-5},
        {"figure": "20", "elephant": "E1, 3,500 kg", "gain": 940, "distance_m": "unknown (100 m path)", "peak_counts": 190, "v_m_s": 1.1e-5},
        {"figure": "18(c)", "elephant": "E3, 2,700 kg (with mahout)", "gain": 25911, "distance_m": "100-160", "peak_counts": 380, "v_m_s": 8.3e-7},
        {"figure": "21 / 18(a)", "elephant": "E3, 2,700 kg (with mahout)", "gain": 580, "distance_m": "0-50", "peak_counts": "35-50", "v_m_s": "3.4e-6 to 4.9e-6"}]}, ensure_ascii=False),
}))
new.append(('elephant_mortimer2018_modelled_range', {
    'key': 'elephant_mortimer2018_modelled_200m',
    'label': "Mortimer et al. 2018 model: displacement 200 m from an elephant fast walk and a bull rumble on sandy ground, with converted velocity",
    'status': 'derived',
    'value_si': 9.4e-06,
    'unit_si': 'm/s',
    'low_si': 6.3e-06,
    'high_si': 1.26e-05,
    'display': "Modelled, not measured: fast walk about 2 × 10⁻⁷ m at 200 m, about 0.01 mm/s (0.006–0.013); bull rumble about 5 × 10⁻⁷ m at 200 m",
    'sources': [
        {'title': 'Mortimer, Rees, Koelemeijer & Nissen-Meyer (2018) Classifying elephant behaviour through seismic vibrations. Curr. Biol. 28(9):R547-R548, Fig. 1C and 1F (UCL repository)', 'url': MORT},
        {'title': 'Mortimer et al. (2018) Supplemental Table S1 (dominant source band of Walk 4)', 'url': MORT_S}],
    'notes': "From the verifier's list (Fig. 1F read at 600 dpi; checked by eye here). Fig. 1 caption: 'modelled propagation sampled at 200 m and 1000 m from the source (modelled with high noise on sandy terrain; C, F)'; C is a bull rumble, F the fast walk (946 N). Fig. 1F (axis ±3×10^-7 m): largest 200 m peak about 2e-7 m. Fig. 1C (axis ±6×10^-7 m): about 5e-7 m. Conversion v = 2πf × u at the walk's dominant 5–10 Hz source band (Table S1): 6.3e-6 to 1.26e-5 m/s. The paper's own forward model (top 25 m sand or gneiss), not a field measurement. It is about 20× the 1/D anchor extrapolated to 200 m (0.0005 mm/s), so a high-force, low-frequency step on sand decays much more slowly than 1/D. A reason not to extend the anchor past 100 m.",
    'who_when': "Derived here (2026) from Mortimer et al., 2018 (model)",
}))
new.append(('elephant_oconnell2006_surface_wave_attenuation', {
    'key': 'elephant_oconnell2006_waterhole_background',
    'label': "Seismic background near a busy elephant waterhole (Etosha, 40–60 Hz band): measured at two geophones and modelled at the elephants",
    'status': 'verified',
    'value_si': 2.5e-07,
    'unit_si': 'm/s (40–60 Hz band level)',
    'low_si': None,
    'high_si': None,
    'display': "−12 dB re 1 µm/s (about 0.25 µm/s) at the elephants, 5 m from the waterhole; −20 dB (0.1 µm/s) and −42 dB (0.008 µm/s) at the geophones 10 m and 90 m from the shakers. Band levels, not footfall peaks",
    'sources': [{'title': "O'Connell-Rodwell et al. (2006) Behav. Ecol. Sociobiol. 59:842-850, Table 1 and Results (author PDF, UCLA)", 'url': OC06}],
    'notes': "From the verifier's list. Results: 'the mean background activity level is −12 dB re 1 μm/s for an overall SNR at the location of the elephants of −1.6 dB'. Table 1 means over eight trials: noise level −20.1 dB (SD 4.7) at the 10 m geophone and −42.1 dB (SD 5.1) at the 90 m geophone; −12.0 dB (SD 5.0) at the elephants, calculated with Eq. (1) at 'body length or 5 m from the water hole'. Conversion 10^(dB/20) µm/s: 0.25, 0.099 and 0.0079 µm/s (verifier confirmed −12 dB = 0.251). The authors assumed the noise came from the elephants at the waterhole, 'as their footfalls create seismic noise'. These are 40–60 Hz band levels (RMS by context), not single-step peaks, so they cannot be set directly against peak footfall values. One site (calcrete).",
    'who_when': "O'Connell-Rodwell et al., 2006",
}))

out_order = list(order)
for after, f in new:
    i = out_order.index(after)
    out_order.insert(i + 1, f['key'])
    facts[f['key']] = f

out = []
for k in out_order:
    f = facts[k]
    o = {}
    for fld in FIELDS:
        o[fld] = f.get(fld)
    o['category'] = 'presence_elephant'
    if f.get('values_json'):
        o['values_json'] = f['values_json']
    out.append(o)

gaps = open(os.path.join(BASE, 'compile_elephant/gaps.txt'), encoding='utf-8').read().strip()

# checks
STATUS = {'verified', 'derived', 'estimate', 'reported', 'disputed', 'not_quantified'}
seen = set()
bad = 0
for f in out:
    assert f['key'] not in seen, f['key']
    seen.add(f['key'])
    assert f['status'] in STATUS, f['key']
    for k in ('value_si', 'low_si', 'high_si'):
        assert f[k] is None or isinstance(f[k], (int, float)), (f['key'], k)
    for k in ('key', 'label', 'status', 'display', 'sources', 'notes', 'unit_si', 'who_when'):
        assert f.get(k) is not None, (f['key'], k)
    for s in f['sources']:
        assert s.get('title') and s.get('url', '').startswith('http'), f['key']
    if f.get('values_json'):
        json.loads(f['values_json'])
    if len(f['notes']) > 950:
        print('LONG', len(f['notes']), f['key'])
        bad += 1
os.makedirs(os.path.join(BASE, 'compiled'), exist_ok=True)
p = os.path.join(BASE, 'compiled/elephant.json')
json.dump({'facts': out, 'gaps': gaps}, open(p, 'w', encoding='utf-8', newline='\n'), ensure_ascii=False, indent=1)
print(len(out), 'facts ->', p, '; long notes:', bad)
