import json, os

OUT = "/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/researchC/compiled/small.json"

FDC_APPLE = {"title": "USDA FoodData Central, SR Legacy FDC 171688 'Apples, raw, with skin' (NDB 09003): portion weights, JSON behind the FDC food page", "url": "https://fdc.nal.usda.gov/portal-data/external/171688"}
NIST_GN = {"title": "NIST CODATA: standard acceleration of gravity, 9.806 65 m/s^2 exact (fact earth_standard_gravity; re-fetched Oct 2026)", "url": "https://physics.nist.gov/cgi-bin/cuu/Value?gn"}
SI1969 = {"title": "The Firearms (Dangerous Air Weapons) Rules 1969, SI 1969/47, rule 2(1) (legislation.gov.uk, as made)", "url": "https://www.legislation.gov.uk/uksi/1969/47/made"}
SP811 = {"title": "NIST SP 811 Appendix B.9 conversion factors (foot pound-force = 1.355 818 J)", "url": "https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b9"}
HOME_OFFICE = {"title": "Home Office, Guide on Firearms Licensing Law (accessible version, last updated 18 Sep 2026), para 2.46", "url": "https://www.gov.uk/government/publications/firearms-law-guidance-to-the-police-2012/guide-on-firearms-licensing-law-accessible-version"}
NI_ORDER = {"title": "Firearms (Northern Ireland) Order 2004, Schedule 1 Part 9 (legislation.gov.uk)", "url": "https://www.legislation.gov.uk/nisi/2004/702/schedule/1/part/9"}
GWR_BADM = {"title": "Guinness World Records: Fastest badminton hit (male)", "url": "https://www.guinnessworldrecords.com/world-records/92507-fastest-badminton-hit-male"}
BWF_PDF = {"title": "BWF Statutes Section 4.1, Laws of Badminton, in force 29/05/2023, Version 2.1 (PDF copy hosted by cob.org)", "url": "https://cob.org/wp-content/uploads/Section-4.1-Laws-of-Badminton-29-May-2023-V2.1.pdf"}
BWF_WB = {"title": "Laws of Badminton (copy on worldbadminton.com)", "url": "https://worldbadminton.com/laws/index.html"}
GWR_PITCH = {"title": "Guinness World Records: Fastest baseball pitch (male), 105.8 mph (fact fastest_baseball_pitch; re-fetched Oct 2026)", "url": "https://www.guinnessworldrecords.com/world-records/fastest-baseball-pitch-male"}
MLB2026 = {"title": "MLB Official Baseball Rules, 2026 Edition, Rule 3.01 The Ball", "url": "https://mktg.mlbstatic.com/mlb/official-information/2026-official-baseball-rules.pdf"}
MLB2025 = {"title": "MLB Official Baseball Rules, 2025 Edition, Rule 3.01 The Ball (same text)", "url": "https://mktg.mlbstatic.com/mlb/official-information/2025-official-baseball-rules.pdf"}
TM = {"title": "US Army TM 43-0001-27, Army Ammunition Data Sheets: Small Caliber Ammunition (Apr 1994, changes to C7 of 14 Jul 2004; Distribution A), third-party PDF copy", "url": "https://bulletpicker.com/pdf/TM-43-0001-27.pdf"}
TM_C8 = {"title": "US Army TM 43-0001-27 with changes 1-8 (to 18 Oct 2005), second third-party PDF copy", "url": "https://ciehub.info/ref/TM/43-0001-27_1994_C1-8.pdf"}
COH2019 = {"title": "Coh M. 2019, Usain Bolt: biomechanical model of sprint technique, Facta Universitatis PES 17(1):1-13 (PDF)", "url": "https://casopisi.junis.ni.ac.rs/index.php/FUPhysEdSport/article/download/4984/3002"}
COH2018 = {"title": "Coh et al. 2018, The kinematics of Usain Bolt's maximal sprint velocity, Kinesiology 50(2):172-180 (abstract page)", "url": "https://ojs.srce.hr/kinesiology/article/view/5579"}
STANTON = {"title": "Stanton (NSWC Crane), Qualification of .50 Caliber Reduced Range Ammunition by U.S. Navy and Marine Corps, NDIA Joint Armaments Conference, May 2012 (approved for public release)", "url": "https://ndia.dtic.mil/wp-content/uploads/2012/armaments/Wednesday13981stanton.pdf"}
FDC_SUGAR = {"title": "USDA FoodData Central, SR Legacy FDC 169655 'Sugars, granulated' (NDB 19335): energy and portion weights, JSON behind the FDC food page", "url": "https://fdc.nal.usda.gov/portal-data/external/169655"}
NIST_SUCROSE = {"title": "NIST Chemistry WebBook, Sucrose (CAS 57-50-1), condensed phase thermochemistry", "url": "https://webbook.nist.gov/cgi/cbook.cgi?ID=C57501&Mask=2"}
KBB = {"title": "Kelley Blue Book 2026 Corolla specs, curb weight 2955 / 3110 / 3150 lb (fact toyota_corolla_curb_mass; re-fetched Oct 2026; secondary source)", "url": "https://www.kbb.com/toyota/corolla/2026/specs"}

def F(key, label, status, value, unit, display, sources, notes, who_when, low=None, high=None, page_short=None):
    f = {"key": key, "category": "energy_reference", "label": label, "status": status, "value_si": value, "unit_si": unit}
    if low is not None: f["low_si"] = low
    if high is not None: f["high_si"] = high
    f.update({"display": display, "sources": sources, "notes": notes, "who_when": who_when})
    if page_short: f["page_short"] = page_short
    return f

facts = [
F("energy_apple_medium_mass", "Medium apple: mass (USDA)", "verified", 0.182, "kg",
  "182 g for a medium apple, 3 in (7.6 cm) across; 101 g extra small to 223 g large",
  [FDC_APPLE],
  "FDC 171688 (SR Legacy, NDB 9003) 'Apples, raw, with skin'; footnote: 'Based on analytical data for red delicious, golden delicious, gala, granny smith, and fuji varieties.' foodMeasures: '1 medium (3\" dia)' 182.0 g (113 data points); 'small (2-3/4\" dia)' 149.0; 'extra small (2-1/2\" dia)' 101.0 (no data-point count); 'large (3-1/4\" dia)' 223.0. low/high are the extra-small and large portion weights, not a statistical range. Read from the JSON the FDC page loads (lastUpdated 4/1/2019). Input to energy_apple_lift_one_metre. Skeptic: confirmed.",
  "USDA SR Legacy, record updated 1 Apr 2019; fetched Oct 2026", low=0.101, high=0.223),
F("energy_apple_extra_small_mass", "Extra-small apple: mass (USDA)", "verified", 0.101, "kg",
  "101 g for an extra-small apple, 2.5 in (6.4 cm) across",
  [FDC_APPLE],
  "Same FDC 171688 record: 'extra small (2-1/2\" dia)' gramWeight 101.0 (no data-point count given, unlike the medium, small and large sizes, which list 113). USDA's footnote: '3 and 5 pound bags of apples typically contain small and extra small sizes.' A portion weight, not a statistical mean. Added at compile, on the skeptic's suggestion, as the input to the bottom rung (energy_apple_small_lift_one_metre); the skeptic read 101.0 g in the JSON.",
  "USDA SR Legacy, record updated 1 Apr 2019; fetched Oct 2026"),
F("energy_apple_lift_one_metre", "Lifting a medium apple one metre (energy it gains)", "derived", 1.785, "J",
  "about 1.8 J (0.182 kg x 9.80665 m/s^2 x 1 m); 1.5-2.2 J for a small to large apple",
  [FDC_APPLE, NIST_GN],
  "E = m g h with m = 0.182 kg (energy_apple_medium_mass), g = 9.80665 m/s^2 (earth_standard_gravity), h = 1 m: 1.785 J. low/high use USDA's small (149 g) and large (223 g) apples. The energy the apple gains, not the food energy the lifter burns. Local gravity differs from standard by under 0.5%. Not a rung: the bottom rung is the 101 g apple (energy_apple_small_lift_one_metre), because ladder.js treats anything below bottom/1.15 as beyond the ladder, and 1.785 J would leave 1-1.55 J uncompared. Skeptic: values confirmed; the researcher's claim that this rung covers shares down to 0.18 J was false and is dropped.",
  "Derived Oct 2026", low=1.461, high=2.187, page_short="lifting an apple one metre"),
F("energy_apple_small_lift_one_metre", "Lifting a 100 g apple one metre (energy it gains)", "derived", 0.9905, "J",
  "about 1 J (0.101 kg x 9.80665 m/s^2 x 1 m)",
  [FDC_APPLE, NIST_GN],
  "E = m g h with m = 0.101 kg (energy_apple_extra_small_mass, USDA 'extra small (2-1/2\" dia)'), g = 9.80665 m/s^2 exact (earth_standard_gravity), h = 1 m: 0.9905 J. The energy the apple gains, not the food energy the lifter burns (muscles turn most of that into heat). A common illustration of one joule (not sourced here). Local gravity differs from standard by under 0.5%. Page says '100 g apple', not 'small apple', because USDA's 'small' is 149 g. Skeptic: recomputed 0.990 J and proposed this as the bottom rung so energies near 1 J stay on the ladder (ladder.js: below 0.86 J is beyond it).",
  "Derived Oct 2026 (compile step)", page_short="lifting a 100 g apple one metre"),
F("energy_air_rifle_england_wales_limit", "Air rifle: most pellet energy allowed without a firearm certificate (England and Wales)", "verified", 16.27, "J",
  "12 ft-lb (16.3 J) at the muzzle; above this an air rifle needs a firearm certificate in England and Wales (air pistols: 6 ft-lb, 8.1 J). Northern Ireland's line is 1 J",
  [SI1969, HOME_OFFICE, NI_ORDER, SP811],
  "SI 1969/47 rule 2(1): 'kinetic energy in excess, in the case of an air pistol, of 6 ft. lb. or, in the case of an air weapon other than an air pistol, of 12 ft. lb.'; rule 3 makes these 'specially dangerous' (firearm certificate needed); rule 1(2): 'shall not extend to Scotland' (Scotland not checked). Home Office guide, para 2.46: 'An air rifle with a muzzle energy in excess of 12 foot-pounds must be held on a firearm certificate.' 12 x 1.355818 J = 16.27 J. A cap: licence-free rifles shoot at or below it. Skeptic: key, label and page phrase changed from 'UK', because Northern Ireland (Firearms (NI) Order 2004, Sch 1 Pt 9 para 9(2)) licenses air guns above 1 J; Home Office guide added to show the 12 ft-lb line is current.",
  "SI 1969/47, in force 1 May 1969; Home Office guide updated 18 Sep 2026; fetched Oct 2026", page_short="an air-rifle pellet at the legal limit in England and Wales"),
F("energy_badminton_fastest_hit_speed", "Fastest badminton hit on record (male): shuttle speed just after impact", "verified", 156.94, "m/s",
  "565 km/h (351 mph; 156.9 m/s)",
  [GWR_BADM],
  "Guinness: 'The fastest badminton hit (male) is 565 km/h (351.07 mph) and was achieved by Satwiksairaj Rankireddy (India) at a gymnasium at Yonex Co., Ltd. Tokyo Factory in Soka, Saitama, Japan, on 14 April 2023.' Measured by 'a NAC Image Technology ultrahigh-speed camera, capable of capturing 40,000 exposures per second, which determined the speed of the shuttlecock immediately following the moment of impact.' A test session at the racket maker's factory (Yonex NANOFLARE 1000 Z racket), not a match. A shuttle slows very fast, so this speed lasts an instant. 565 / 3.6 = 156.94 m/s. Skeptic: confirmed; key renamed from 'smash' to 'hit' to match Guinness.",
  "Satwiksairaj Rankireddy, 14 Apr 2023, Soka, Japan"),
F("energy_badminton_shuttle_mass", "Badminton shuttle: legal mass range (BWF Laws)", "verified", 0.00512, "kg",
  "4.74 to 5.50 g (Law 2.2.6); value used is the midpoint, 5.12 g",
  [BWF_PDF, BWF_WB],
  "Law 2.2.6: 'The shuttle shall weigh from 4.74 to 5.50 grams.' Law 2.3.3 applies the same weights to synthetic shuttles. BWF's own site returned HTTP 403, so the text was read in two copies: a PDF headed 'BWF Statutes, Section 4.1: LAWS OF BADMINTON, In Force: 29/05/2023 Version 2.1' (cob.org), and worldbadminton.com, which carries the text BWF adopted 25 Apr 2026 (effective 4 Jan 2027) with the same figure. value_si is the midpoint; the record shuttle's mass was not published. Skeptic: confirmed.",
  "BWF Laws of Badminton, in force 29 May 2023", low=0.00474, high=0.0055),
F("energy_badminton_fastest_hit", "Fastest badminton hit on record (Guinness; a test session, not a match): shuttle kinetic energy", "derived", 63.06, "J",
  "about 63 J (58-68 J across the legal shuttle masses)",
  [GWR_BADM, BWF_PDF],
  "KE = 1/2 m v^2 with v = 156.94 m/s (energy_badminton_fastest_hit_speed) and m = 5.12 g, the midpoint of the 4.74-5.50 g legal range (energy_badminton_shuttle_mass): 63.1 J; 58.4 J at 4.74 g, 67.7 J at 5.50 g. Energy at the instant after impact; drag removes most of it within metres. About +/-8% from shuttle mass, plus any camera error (not stated). Not a recommended rung: 2.6x below the pitch, so redundant under nearest-rung matching. Skeptic: values confirmed; key, label and page phrase changed from 'smash' to 'hit on record' (Guinness title; factory test, not match play).",
  "Derived Oct 2026", low=58.38, high=67.74, page_short="the fastest badminton hit on record"),
F("energy_fastest_pitch", "Fastest pitch on record: ball kinetic energy (existing rung)", "derived", 162.5, "J",
  "about 162 J (105.8 mph; ball 5 to 5.25 oz)",
  [GWR_PITCH, MLB2026, MLB2025],
  "Backs the existing 'pitch' rung: build-data.py computes 0.5 x 0.1453 x 47.297^2 = 162.5 J. Inputs: fastest_baseball_pitch (105.8 mph = 47.297 m/s, Guinness, Aroldis Chapman, 24 Sep 2010) and baseball_mass. MLB Rule 3.01 (2026 and 2025 editions, same text): 'not less than five nor more than 5 1/4 ounces avoirdupois' (141.7-148.8 g), giving 158.5-166.5 J. low/high cover ball mass only, not speed-measurement error. baseball_mass currently cites a reproduction of the rule (UmpireBible); the MLB PDF can be added to it. Skeptic: confirmed; cite the current (2026) edition.",
  "Aroldis Chapman, 24 Sep 2010; derived Oct 2026", low=158.5, high=166.5, page_short="the fastest pitch on record"),
F("energy_9mm_m882_bullet_mass", "9 mm NATO ball M882: bullet mass", "verified", 0.0072575, "kg",
  "112 grains (7.26 g)",
  [TM, TM_C8],
  "Data sheet 'CARTRIDGE, 9 MM, BALL, NATO, M882', page 12-5: 'Projectile weight ... 112 gr'. Use: 'Pistol, 9 mm, M9.' 1 grain = 64.79891 mg exactly, so 112 gr = 7.2575 g. Both PDFs are third-party copies of the Army manual (Distribution A, public release); the official copy sits behind an Army login. Change 8 (18 Oct 2005) replaces only pages A, B and 14-33/14-34, so this sheet is unchanged. Skeptic: confirmed in both copies; keep the sheet's wording about its targets off the page.",
  "US Army, 1994 (changes to 2005)"),
F("energy_9mm_m882_velocity", "9 mm NATO ball M882: bullet speed", "verified", 384.96, "m/s",
  "1,263 +/- 5 ft/s, 15 ft from the muzzle (385 m/s)",
  [TM, TM_C8],
  "Data sheet M882, page 12-6, Performance: 'Velocity ... 1263 +/- 5 fps, 15 ft from muzzle'. x 0.3048 = 384.96 m/s (383.4-386.5). Measured 15 ft (4.6 m) out, so close to muzzle speed. The test weapon's barrel length is not given. Skeptic: confirmed in both copies.",
  "US Army, 1994 (changes to 2005)", low=383.44, high=386.49),
F("energy_9mm_pistol_bullet", "9 mm pistol bullet (US Army M882): kinetic energy (alternative)", "derived", 537.8, "J",
  "about 540 J (7.26 g at 385 m/s)",
  [TM],
  "KE = 1/2 m v^2 = 0.5 x 0.0072575 kg x (384.96 m/s)^2 = 537.8 J (energy_9mm_m882_bullet_mass, energy_9mm_m882_velocity); low/high from the +/-5 ft/s tolerance only. Other 9 mm loads give somewhat different figures (not checked). Not a recommended rung: the 10.5x step from the pitch to the 5.56 mm bullet already gives at most about 3.2x under nearest-rung matching, and it would add another gun. Skeptic: value confirmed; recommended dropping the rung.",
  "Derived Oct 2026", low=533.5, high=542.0, page_short="a 9 mm pistol bullet"),
F("energy_556_m855_bullet_mass", "5.56 mm NATO ball M855: bullet mass", "verified", 0.0040175, "kg",
  "62 grains (4.02 g)",
  [TM, TM_C8],
  "Data sheet 'CARTRIDGE, 5.56MM, BALL, M855', page 10-19: 'Projectile: Weight ... 62 gr'. Use: 'Machine Gun, 5.56mm, M249E1; and Rifle, 5.56mm, M16A2.' 62 x 64.79891 mg = 4.0175 g. Skeptic: confirmed in both copies.",
  "US Army, 1994 (changes to 2005)"),
F("energy_556_m855_velocity", "5.56 mm NATO ball M855: bullet speed", "verified", 922.02, "m/s",
  "3,025 ft/s, 78 ft from the muzzle (922 m/s)",
  [TM, TM_C8],
  "Data sheet M855, page 10-19: 'Velocity ... 3025 fps, 78 ft from muzzle'. x 0.3048 = 922.02 m/s. Measured 78 ft (23.8 m) downrange, so muzzle speed is a little higher (not quantified). The sheet names the M16A2 rifle and M249 machine gun; shorter carbine barrels give less (not checked). Skeptic: confirmed in both copies.",
  "US Army, 1994 (changes to 2005)"),
F("energy_rifle_bullet_556", "Rifle bullet, 5.56 mm NATO (M855): kinetic energy", "derived", 1707.7, "J",
  "about 1.7 kJ (4.02 g at 922 m/s, 78 ft from the muzzle)",
  [TM, TM_C8],
  "KE = 1/2 m v^2 = 0.5 x 0.0040175 kg x (922.02 m/s)^2 = 1,708 J (energy_556_m855_bullet_mass, energy_556_m855_velocity). The brief's guess of about 2 kJ is close. Energy 24 m from the muzzle; at the muzzle slightly more, from a short carbine barrel somewhat less (neither quantified). Good to well within 2x. Skeptic: confirmed.",
  "Derived Oct 2026", page_short="a rifle bullet (5.56 mm NATO)"),
F("energy_762_m80_bullet_mass", "7.62 mm NATO ball M80: bullet mass", "verified", 0.0094606, "kg",
  "146 grains (9.46 g)",
  [TM],
  "Data sheet 'CARTRIDGE, 7.62MM, BAL., M80', page 11-17: 'Projectile: Weight ... 146 gr'. Use: 'Machine Guns, 7.62mm, M60, M219 and M240; and Rifle, 7.62mm, M14.' 146 x 64.79891 mg = 9.4606 g. Alternative only. Skeptic: confirmed on the rendered page.",
  "US Army, 1994 (changes to 2004)"),
F("energy_762_m80_velocity", "7.62 mm NATO ball M80: bullet speed", "verified", 838.2, "m/s",
  "2,750 ft/s, 78 ft from the muzzle (838 m/s)",
  [TM],
  "The M80 sheet (page 11-17) is misprinted in the page image itself: 'Velocity ... 27501) fps, 78 ft from muzzle' (also 'Chamber pressure 50,000)() psi'). The M80 overhead-fire sheet (page 11-19, 149 gr) reads cleanly 'Velocity ... 2750 fps, 78 ft from muzzle', as do the M59, M61 and M62 sheets. 2750 x 0.3048 = 838.2 m/s. Alternative only. Skeptic: rendered the page and confirmed the misprint is in the source and 2750 fps on the sister sheets.",
  "US Army, 1994 (changes to 2004)"),
F("energy_rifle_bullet_762", "Rifle bullet, 7.62 mm NATO (M80): kinetic energy (alternative)", "derived", 3323.4, "J",
  "about 3.3 kJ (9.46 g at 838 m/s, 78 ft from the muzzle)",
  [TM],
  "KE = 1/2 m v^2 = 0.5 x 0.0094606 x 838.2^2 = 3,323 J (energy_762_m80_bullet_mass, energy_762_m80_velocity). Not a recommended rung; the velocity reads through a misprint (see energy_762_m80_velocity). Skeptic: value confirmed; not needed.",
  "Derived Oct 2026", page_short="a battle-rifle bullet (7.62 mm NATO)"),
F("energy_usain_bolt_body_mass", "Usain Bolt: body mass (as listed)", "verified", 95, "kg",
  "95 kg (height 1.96 m), as listed in a 2019 biomechanics paper",
  [COH2019, COH2018],
  "Coh 2019: 'Usain Bolt (age: 25, height: 1.96 m, weight: 95 kg, BMI: 24.7)'. A listed figure, not a race-day weighing. Coh et al. 2018 abstract: 'vertical ground reaction force equal to 4.2 times body weight (3932 N)', implying 3932 / (4.2 x 9.80665) = 95.5 kg; consistent, but the same research group, so not independent. Skeptic: the 'body mass = 95 kg' in Coh 2019's force section is Taylor and Beneke's 2012 input quoted by Coh, not Coh's own; cross-check relabelled 'consistent'; the unchecked World Athletics remark removed.",
  "Coh 2019 (data from about 2011)"),
F("energy_usain_bolt_top_speed", "Usain Bolt at top speed: kinetic energy", "derived", 7327, "J",
  "about 7.3 kJ (95 kg at 12.42 m/s)",
  [COH2019, COH2018],
  "KE = 1/2 m v^2 = 0.5 x 95 kg x (12.42 m/s)^2 = 7,327 J. Speed: bolt_peak_running_speed (verified), his fastest 20 m average, 60-80 m, Berlin 2009 (Coh 2019 Table 2; the abstract wrongly attaches 12.42 to Zagreb); Zagreb 2011 gives 12.14 m/s, hence low 7,001 J. high 7,366 J uses the 95.5 kg implied by Coh 2018. Mass: energy_usain_bolt_body_mass. Counts only his body moving forward as a whole; swinging limbs left out, and a 20 m average sits slightly below the instantaneous peak (neither quantified). Good to about +/-10%. Skeptic: confirmed; high_si raised from 7,327 to 7,366 J for mass uncertainty.",
  "Berlin 2009 (speed); derived Oct 2026", low=7001, high=7366, page_short="Usain Bolt at top speed"),
F("energy_50cal_m33_bullet_mass", ".50-calibre ball M33: bullet mass", "verified", 0.042832, "kg",
  "661 grains (42.8 g)",
  [STANTON],
  "NSWC Crane slide 7, 'MK 322 Ball' vs 'M33 Ball': 'Bullet Weight 700 grains 661 grains'; M33 'Brass Jacket and Steel Core', 'Boat-tail', 'Bullet Length ... 2.3 inches'. Slide marked 'Approved for Public Release; Distribution Unlimited May 2012'. 661 x 64.79891 mg = 42.832 g. The Army data sheet for the M33 (TM 43-0001-27, page 9-29) lists no projectile weight. Skeptic: confirmed.",
  "NSWC Crane (US Navy), May 2012"),
F("energy_50cal_m33_velocity", ".50-calibre ball M33: bullet speed", "verified", 886.97, "m/s",
  "2,910 ft/s 78 ft from the muzzle (887 m/s, US Army); 885 (+/-) 9 m/s at 24 m (US Navy; the +/- sign is missing in the PDF and inferred)",
  [TM, STANTON],
  "TM 43-0001-27 sheet 'CARTRIDGE, CALIBER .50, BALL, M33', page 9-29: 'Velocity ... 2910 fps, 78 ft from muzzle'; use 'Machine Guns, Caliber .50, M2 and M85'. x 0.3048 = 886.97 m/s. NSWC Crane slide 7, M33: 'Velocity at 24m 885   9 mps' (78 ft = 23.8 m, the same point). low/high (876-894 m/s) read that as 885 +/- 9. Skeptic: the +/- glyph is absent in both the rendered slide and its text layer (font not embedded), so the range rests on an inferred sign; value_si comes from the Army sheet and is unaffected.",
  "US Army 1994; US Navy 2012", low=876, high=894),
F("energy_50cal_bullet", ".50-calibre machine-gun bullet (M33 ball): kinetic energy (alternative)", "derived", 16848, "J",
  "about 17 kJ (42.8 g at 887 m/s)",
  [TM, STANTON],
  "KE = 1/2 m v^2 = 0.5 x 0.042832 kg x (886.97 m/s)^2 = 16,848 J (energy_50cal_m33_bullet_mass, energy_50cal_m33_velocity); 16.4-17.1 kJ across 876-894 m/s (Navy figure, +/- sign inferred). The brief's guess of 15-20 kJ holds. Energy 24 m from the muzzle, slightly below muzzle energy (not quantified). Good to a few percent. Not in the recommended set (Bolt at 7.3 kJ covers the decade with fewer guns); swap it in for Bolt if the owner prefers (steps 9.9x and 4.0x). Skeptic: confirmed.",
  "Derived Oct 2026", low=16434, high=17116, page_short="a .50-calibre bullet"),
F("energy_sugar_teaspoon_mass", "Granulated sugar: mass of a teaspoon (USDA)", "verified", 0.0042, "kg",
  "4.2 g per teaspoon (also 2.3 g per cube, 2.8 g per packet)",
  [FDC_SUGAR],
  "FDC 169655 (SR Legacy, NDB 19335) 'Sugars, granulated', foodMeasures: '1 tsp' 4.2 g (no data-point count; a household measure); '1 serving 1 cube' 2.3 g; '1 serving packet' 2.8 g; '1 cup' 200 g. A heaped teaspoon holds more (not quantified). Sugar-cube sizes vary by brand, so the teaspoon is the steadier rung. Skeptic: confirmed.",
  "USDA SR Legacy; fetched Oct 2026"),
F("energy_sugar_food_energy_per_kg", "Granulated sugar: food energy per kilogram (USDA)", "verified", 16200000, "J/kg",
  "387 kcal (1,620 kJ) per 100 g",
  [FDC_SUGAR],
  "FDC 169655 nutrients: 'Energy' 387 kcal and 1620.0 kJ per 100 g, both 'Calculated'; 'Carbohydrate, by difference' 100 g; 'Total Sugars' 99.8 g (analytical, 7 data points, 99.2-100). carbohydrateValue 3.87 kcal/g (Atwater-type factor): metabolisable food energy, not a calorimeter measurement. 1620 kJ/100 g = 1.62e7 J/kg. Skeptic: confirmed, including lastUpdated 3/1/2009.",
  "USDA SR Legacy, nutrient values updated 2009"),
F("energy_sucrose_heat_of_combustion", "Sucrose: heat released by burning (cross-check)", "derived", 16487000, "J/kg",
  "5,643 kJ per mole = 16.5 kJ per gram",
  [NIST_SUCROSE],
  "NIST WebBook: 'Delta-c H-degree solid -5643.4 +/- 1.8 kJ/mol' (Ponomarev and Migarskaya, 1960, reanalysed by Cox and Pilcher, 1970); other entries -5637.4 to -5664.4 kJ/mol; molecular weight 342.2965. 5643.4 / 342.2965 = 16.49 kJ/g, 1.8% above USDA's 16.20 kJ/g. Supporting fact only. Skeptic: confirmed.",
  "NIST SRD 69; derived Oct 2026"),
F("energy_sugar_teaspoon_food_energy", "Food energy in a level teaspoon of sugar", "derived", 68040, "J",
  "about 68 kJ (16 kcal, i.e. 16 food Calories) per level teaspoon",
  [FDC_SUGAR, NIST_SUCROSE],
  "4.2 g (energy_sugar_teaspoon_mass) x 16.20 kJ/g (energy_sugar_food_energy_per_kg) = 68.0 kJ, or 4.2 x 3.87 = 16.3 kcal. Stored chemical energy: what the body can get from it, and (to 2%) the heat it gives when burned (energy_sucrose_heat_of_combustion). The same kind of comparison as the explosives on the ladder, not a motion. Heaped spoons hold more. A sugar cube (2.3 g, USDA) is 37 kJ. Skeptic: confirmed.",
  "Derived Oct 2026", page_short="the food energy in a teaspoon of sugar"),
F("energy_corolla_50kmh", "Toyota Corolla at 50 km/h: kinetic energy (alternative)", "derived", 129280, "J",
  "about 130 kJ (1,340 kg at 50 km/h)",
  [KBB],
  "KE = 1/2 m v^2 = 0.5 x 1,340.4 kg x (13.889 m/s)^2 = 129.3 kJ, using toyota_corolla_curb_mass (2026 LE, 2,955 lb, from KBB and iSeeCars, both secondary; Toyota's own spec page not reached). Empty car; a 90 kg driver adds about 7%. A quarter of the 100 km/h rung (doubling speed quadruples energy). Not a recommended rung: the same car 4x apart from the existing rung, so redundant under nearest-rung matching. Skeptic: value confirmed; redundant.",
  "Derived Oct 2026", page_short="a Corolla at 50 km/h"),
F("energy_corolla_100kmh", "Toyota Corolla at 100 km/h: kinetic energy (existing rung)", "derived", 517130, "J",
  "about 0.52 MJ (1,340 kg at 100 km/h)",
  [KBB],
  "Backs the existing 'carcrash' rung: build-data.py uses 0.5 x 1340 x (100/3.6)^2 = 516,980 J (0.03% below this fact's 517,130 J with 1,340.4 kg). Input: toyota_corolla_curb_mass, LE 1,340.4 kg, marked verified in final-objects.json but resting on KBB and iSeeCars (secondary; Toyota not reached); high_si uses the XSE (1,428.8 kg). Empty car, no occupants. The energy is insensitive to the source question. Skeptic: confirmed.",
  "Derived Oct 2026", low=517130, high=551230, page_short="a Corolla at 100 km/h"),
]

rec = ["energy_apple_small_lift_one_metre", "energy_air_rifle_england_wales_limit", "energy_fastest_pitch",
       "energy_rifle_bullet_556", "energy_usain_bolt_top_speed", "energy_sugar_teaspoon_food_energy", "energy_corolla_100kmh"]
by = {f["key"]: f for f in facts}
rungs = []
for k in rec:
    f = by[k]
    v, lo, hi = f["value_si"], f.get("low_si", f["value_si"]), f.get("high_si", f["value_si"])
    rungs.append({"key": k, "J": v, "page_short": f["page_short"], "rough": (hi / v > 2) or (v / lo > 2)})

gaps = ("None within this band. Recommended rungs from 0.99 J to 517 kJ step by at most 16.4x (apple to air rifle; then 10.0x, 10.5x, 4.3x, 9.3x, 7.6x, and 2.0x up to the existing grenade at about 1.0 MJ), "
        "so under ladder.js nearest-rung matching no energy from 0.86 J to the grenade needs a multiple above about 4x or a share below about 25%. "
        "Below the bottom rung: ladder.js puts anything under 0.99/1.15 = 0.86 J beyond the ladder. If the page's gentlest efforts go below that, a sub-joule rung is needed (none researched). "
        "The parent should measure the page's real minimum energy (the skeptic's probe gave about 3 J for a punch at F = 10 N).")

out = {"facts": facts, "rungs": rungs, "gaps": gaps}
for f in facts:
    assert len(f["notes"]) <= 900, (f["key"], len(f["notes"]))
os.makedirs(os.path.dirname(OUT), exist_ok=True)
json.dump(out, open(OUT, "w"), indent=1, ensure_ascii=False)
print(len(facts), "facts")
for r in rungs: print(r)
for f in facts: print(f["key"], len(f["notes"]))
