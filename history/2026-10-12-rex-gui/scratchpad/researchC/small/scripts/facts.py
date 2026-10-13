import json
TM = {"title": "US Army TM 43-0001-27, Army Ammunition Data Sheets: Small Caliber Ammunition (Apr 1994, changes to C7 of 14 Jul 2004; Distribution A), third-party PDF copy", "url": "https://bulletpicker.com/pdf/TM-43-0001-27.pdf"}
NSWC = {"title": "Stanton (NSWC Crane), Qualification of .50 Caliber Reduced Range Ammunition by U.S. Navy and Marine Corps, NDIA Joint Armaments Conference, May 2012 (approved for public release)", "url": "https://ndia.dtic.mil/wp-content/uploads/2012/armaments/Wednesday13981stanton.pdf"}
NISTB9 = {"title": "NIST SP 811 Appendix B.9 conversion factors (foot pound-force = 1.355 818 J)", "url": "https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b9"}
NISTG = {"title": "NIST CODATA: standard acceleration of gravity (fact earth_standard_gravity)", "url": "https://physics.nist.gov/cgi-bin/cuu/Value?gn"}
USDA_APPLE = {"title": "USDA FoodData Central, SR Legacy FDC 171688 'Apples, raw, with skin' (NDB 09003): portion weights, JSON behind the FDC food page", "url": "https://fdc.nal.usda.gov/portal-data/external/171688"}
USDA_SUGAR = {"title": "USDA FoodData Central, SR Legacy FDC 169655 'Sugars, granulated' (NDB 19335): energy and portion weights, JSON behind the FDC food page", "url": "https://fdc.nal.usda.gov/portal-data/external/169655"}
GWR_BAD = {"title": "Guinness World Records: Fastest badminton hit (male)", "url": "https://www.guinnessworldrecords.com/world-records/92507-fastest-badminton-hit-male"}
BWF1 = {"title": "BWF Statutes Section 4.1, Laws of Badminton, in force 29/05/2023, Version 2.1 (PDF copy hosted by cob.org)", "url": "https://cob.org/wp-content/uploads/Section-4.1-Laws-of-Badminton-29-May-2023-V2.1.pdf"}
BWF2 = {"title": "Laws of Badminton (copy on worldbadminton.com)", "url": "https://worldbadminton.com/laws/index.html"}
GWR_PITCH = {"title": "Guinness World Records: Fastest baseball pitch (male) (fact fastest_baseball_pitch)", "url": "http://www.guinnessworldrecords.com/world-records/fastest-baseball-pitch-male"}
MLB = {"title": "MLB Official Baseball Rules, 2025 Edition, Rule 3.01 The Ball", "url": "https://mktg.mlbstatic.com/mlb/official-information/2025-official-baseball-rules.pdf"}
COH19 = {"title": "Coh M. 2019, Usain Bolt: biomechanical model of sprint technique, Facta Universitatis PES 17(1):1-13 (PDF)", "url": "https://casopisi.junis.ni.ac.rs/index.php/FUPhysEdSport/article/download/4984/3002"}
COH18 = {"title": "Coh et al. 2018, The kinematics of Usain Bolt's maximal sprint velocity, Kinesiology 50(2):172-180 (abstract page)", "url": "https://ojs.srce.hr/kinesiology/article/view/5579"}
LEG = {"title": "The Firearms (Dangerous Air Weapons) Rules 1969, SI 1969/47, rule 2(1) (legislation.gov.uk, as made)", "url": "https://www.legislation.gov.uk/uksi/1969/47/made"}
NIST_SUC = {"title": "NIST Chemistry WebBook, Sucrose (CAS 57-50-1), condensed phase thermochemistry", "url": "https://webbook.nist.gov/cgi/cbook.cgi?ID=C57501&Mask=2"}
KBB = {"title": "Kelley Blue Book 2026 Corolla specs (fact toyota_corolla_curb_mass)", "url": "https://www.kbb.com/toyota/corolla/2026/specs"}

F = []
def add(**k):
    k.setdefault("category", "energy_reference")
    F.append(k)

# ---------------- apple
add(key="energy_apple_medium_mass", label="Medium apple: mass (USDA)", status="verified",
    value_si=0.182, unit_si="kg", low_si=0.101, high_si=0.223,
    display="182 g for a medium apple, 3 in (7.6 cm) across; 101 g extra small to 223 g large",
    sources=[USDA_APPLE],
    notes="FDC 171688 (SR Legacy, NDB 9003) 'Apples, raw, with skin'; footnote: 'Based on analytical data for red delicious, golden delicious, gala, granny smith, and fuji varieties.' foodMeasures: '1 medium (3\" dia)' gramWeight 182.0 (113 data points); 'small (2-3/4\" dia)' 149.0; 'extra small (2-1/2\" dia)' 101.0; 'large (3-1/4\" dia)' 223.0. low_si/high_si are the extra-small and large portion weights, not a statistical range. Read from the JSON the FDC web page loads (the public API's DEMO_KEY was rate-limited). Input to energy_apple_lift_one_metre.",
    who_when="USDA SR Legacy, record updated 1 Apr 2019; fetched Oct 2026")
add(key="energy_apple_lift_one_metre", label="Lifting a medium apple one metre (energy it gains)", status="derived",
    value_si=1.785, unit_si="J", low_si=1.461, high_si=2.187,
    display="about 1.8 J (0.182 kg x 9.80665 m/s^2 x 1 m); 1.5-2.2 J for a small to large apple",
    sources=[USDA_APPLE, NISTG],
    notes="E = m g h with m = 0.182 kg (energy_apple_medium_mass, USDA medium apple), g = 9.80665 m/s^2 (earth_standard_gravity), h = 1 m: 1.785 J. low/high use USDA's small (149 g) and large (223 g) apples; an extra-small apple (101 g) gives 0.99 J, which is the old rule of thumb that a joule lifts a small apple a metre. This is the energy the apple gains, not the food energy the lifter burns (muscles turn most of that into heat). Local gravity differs from standard by under 0.5%. Certain to about +/-25% for apple size, so a precise multiple is fine.",
    who_when="Derived Oct 2026", page_short="lifting an apple one metre")

# ---------------- air rifle
add(key="energy_air_rifle_uk_limit", label="UK air rifle: legal cap on pellet energy (England and Wales)", status="verified",
    value_si=16.27, unit_si="J",
    display="12 ft-lb (16.3 J) at the muzzle; above this an air rifle needs a firearm certificate. Air pistols: 6 ft-lb (8.1 J)",
    sources=[LEG, NISTB9],
    notes="Rule 2(1): applies to an air weapon 'capable of discharging a missile so that the missile has, on being discharged from the muzzle of the weapon, kinetic energy in excess, in the case of an air pistol, of 6 ft. lb. or, in the case of an air weapon other than an air pistol, of 12 ft. lb.' Rule 3 declares such weapons 'specially dangerous', which under s.1 Firearms Act 1968 means a firearm certificate is needed (explanatory note). Rule 1(2): 'These Rules shall not extend to Scotland.' legislation.gov.uk holds only the original text, so later changes were not checked. 12 x 1.355818 J (NIST) = 16.27 J. It is a cap: licence-free rifles shoot at or a little under it (not quantified). Air rifles elsewhere can be far stronger, so the page should say 'UK'.",
    who_when="SI 1969/47, made 13 Jan 1969, in force 1 May 1969; fetched Oct 2026", page_short="a UK air-rifle pellet")

# ---------------- badminton
add(key="energy_badminton_smash_record_speed", label="Fastest badminton hit (male): shuttle speed just after impact", status="verified",
    value_si=156.94, unit_si="m/s",
    display="565 km/h (351 mph; 156.9 m/s)",
    sources=[GWR_BAD],
    notes="Guinness: 'The fastest badminton hit (male) is 565 km/h (351.07 mph) and was achieved by Satwiksairaj Rankireddy (India) at a gymnasium at Yonex Co., Ltd. Tokyo Factory in Soka, Saitama, Japan, on 14 April 2023.' Measured by 'a NAC Image Technology ultrahigh-speed camera, capable of capturing 40,000 exposures per second, which determined the speed of the shuttlecock immediately following the moment of impact.' A test session at the racket maker's factory with its own racket, not a match. A shuttle slows very fast in flight, so this speed lasts only an instant. 565 / 3.6 = 156.94 m/s.",
    who_when="Satwiksairaj Rankireddy, 14 Apr 2023, Soka, Japan")
add(key="energy_badminton_shuttle_mass", label="Badminton shuttle: legal mass range (BWF Laws)", status="verified",
    value_si=0.00512, unit_si="kg", low_si=0.00474, high_si=0.0055,
    display="4.74 to 5.50 g (Law 2.2.6); value used is the midpoint, 5.12 g",
    sources=[BWF1, BWF2],
    notes="Law 2.2.6: 'The shuttle shall weigh from 4.74 to 5.50 grams.' Law 2.3.3 applies the same weights to synthetic shuttles. BWF's own site (corporate.bwfbadminton.com) returned HTTP 403, so the text was read in two copies: a PDF headed 'BWF Statutes, Section 4.1: LAWS OF BADMINTON, In Force: 29/05/2023 Version 2.1' hosted by cob.org, and the laws page on worldbadminton.com; both give the same figure. value_si is the midpoint of the legal range; the mass of the record shuttle was not published.",
    who_when="BWF Laws of Badminton, version in force 29 May 2023")
add(key="energy_badminton_smash_record", label="Fastest badminton smash: shuttle kinetic energy", status="derived",
    value_si=63.06, unit_si="J", low_si=58.38, high_si=67.74,
    display="about 63 J (58-68 J across the legal shuttle masses)",
    sources=[GWR_BAD, BWF1],
    notes="KE = 1/2 m v^2 with v = 156.94 m/s (energy_badminton_smash_record_speed) and m = 5.12 g, the midpoint of the 4.74-5.50 g legal range (energy_badminton_shuttle_mass): 63.1 J; 58.4 J at 4.74 g, 67.7 J at 5.50 g. Energy at the instant after impact; drag removes most of it within metres. Uncertainty about +/-8% from shuttle mass, plus whatever error the camera measurement has (not stated by Guinness).",
    who_when="Derived Oct 2026", page_short="the fastest badminton smash")

# ---------------- pitch (existing rung)
add(key="energy_fastest_pitch", label="Fastest pitch on record: ball kinetic energy (existing rung)", status="derived",
    value_si=162.5, unit_si="J", low_si=158.5, high_si=166.5,
    display="about 162 J (105.8 mph; ball 5 to 5.25 oz)",
    sources=[GWR_PITCH, MLB],
    notes="Backs the existing 'pitch' rung, which build-data.py computes as 0.5 x 0.1453 x 47.297^2 = 162.5 J. Inputs: fastest_baseball_pitch (105.8 mph = 47.297 m/s, Guinness) and baseball_mass. MLB 2025 Official Baseball Rules, Rule 3.01, fetched as the primary source for the ball: 'It shall weigh not less than five nor more than 5 1/4 ounces avoirdupois' (141.7-148.8 g), giving 158.5-166.5 J. baseball_mass currently cites a reproduction of the rule (UmpireBible); this PDF can be added to it. Value checked; no change needed.",
    who_when="Aroldis Chapman, 24 Sep 2010; derived Oct 2026", page_short="the fastest pitch on record")

# ---------------- 9 mm
add(key="energy_9mm_m882_bullet_mass", label="9 mm NATO ball M882: bullet mass", status="verified",
    value_si=0.0072575, unit_si="kg",
    display="112 grains (7.26 g)",
    sources=[TM],
    notes="Data sheet 'CARTRIDGE, 9 MM, BALL, NATO, M882', page 12-5: 'Projectile weight ... 112 gr'. Use: 'Pistol, 9 mm, M9. The cartridge is intended for use against personnel.' 1 grain = 64.79891 mg exactly, so 112 gr = 7.2575 g. The PDF is a third-party copy of the Army manual (Distribution A, public release); the official copy sits behind an Army login.",
    who_when="US Army, 1994 (changes to 2004)")
add(key="energy_9mm_m882_velocity", label="9 mm NATO ball M882: bullet speed", status="verified",
    value_si=384.96, unit_si="m/s", low_si=383.44, high_si=386.49,
    display="1,263 +/- 5 ft/s, 15 ft from the muzzle (385 m/s)",
    sources=[TM],
    notes="Data sheet M882, page 12-6, Performance: 'Velocity ... 1263 +/- 5 fps, 15 ft from muzzle'. x 0.3048 = 384.96 m/s (383.4-386.5). Measured 15 ft (4.6 m) out, so close to muzzle speed. The test weapon's barrel length is not given on the sheet.",
    who_when="US Army, 1994 (changes to 2004)")
add(key="energy_9mm_pistol_bullet", label="9 mm pistol bullet (US Army M882): kinetic energy", status="derived",
    value_si=537.8, unit_si="J", low_si=533.5, high_si=542.0,
    display="about 540 J (7.26 g at 385 m/s)",
    sources=[TM],
    notes="KE = 1/2 m v^2 = 0.5 x 0.0072575 kg x (384.96 m/s)^2 = 537.8 J (energy_9mm_m882_bullet_mass, energy_9mm_m882_velocity); low/high from the +/-5 ft/s tolerance only. The rung is the Army's standard 9 mm round; other 9 mm loads and pistols give somewhat different figures (not checked). Optional rung: it splits the 10.5x step from the pitch (162 J) to the 5.56 mm rifle bullet (1.7 kJ).",
    who_when="Derived Oct 2026", page_short="a 9 mm pistol bullet")

# ---------------- 5.56
add(key="energy_556_m855_bullet_mass", label="5.56 mm NATO ball M855: bullet mass", status="verified",
    value_si=0.0040175, unit_si="kg",
    display="62 grains (4.02 g)",
    sources=[TM],
    notes="Data sheet 'CARTRIDGE, 5.56MM, BALL, M855', page 10-19 (checked on the rendered page): 'Projectile: Weight ... 62 gr'. Use: 'Machine Gun, 5.56mm, M249E1; and Rifle, 5.56mm, M16A2.' 62 x 64.79891 mg = 4.0175 g.",
    who_when="US Army, 1994 (changes to 2004)")
add(key="energy_556_m855_velocity", label="5.56 mm NATO ball M855: bullet speed", status="verified",
    value_si=922.02, unit_si="m/s",
    display="3,025 ft/s, 78 ft from the muzzle (922 m/s)",
    sources=[TM],
    notes="Data sheet M855, page 10-19: 'Velocity ... 3025 fps, 78 ft from muzzle'. x 0.3048 = 922.02 m/s. Measured 78 ft (23.8 m) downrange, so the speed at the muzzle is a little higher (not quantified). The sheet names the M16A2 rifle and M249 machine gun; shorter carbine barrels give less (not checked).",
    who_when="US Army, 1994 (changes to 2004)")
add(key="energy_rifle_bullet_556", label="Rifle bullet, 5.56 mm NATO (M855): kinetic energy", status="derived",
    value_si=1707.7, unit_si="J",
    display="about 1.7 kJ (4.02 g at 922 m/s, 78 ft from the muzzle)",
    sources=[TM],
    notes="KE = 1/2 m v^2 = 0.5 x 0.0040175 kg x (922.02 m/s)^2 = 1,708 J (energy_556_m855_bullet_mass, energy_556_m855_velocity). The brief's guess of about 2 kJ is close. Energy 24 m from the muzzle; at the muzzle slightly more, and from a short carbine barrel somewhat less (neither quantified here). Good to well within 2x either way.",
    who_when="Derived Oct 2026", page_short="a rifle bullet (5.56 mm NATO)")

# ---------------- 7.62 alternative
add(key="energy_762_m80_bullet_mass", label="7.62 mm NATO ball M80: bullet mass", status="verified",
    value_si=0.0094606, unit_si="kg",
    display="146 grains (9.46 g)",
    sources=[TM],
    notes="Data sheet 'CARTRIDGE, 7.62MM, BAL., M80', page 11-17 (checked on the rendered page): 'Projectile: Weight ... 146 gr'. Use: 'Machine Guns, 7.62mm, M60, M219 and M240; and Rifle, 7.62mm, M14.' 146 x 64.79891 mg = 9.4606 g. Alternative rung only.",
    who_when="US Army, 1994 (changes to 2004)")
add(key="energy_762_m80_velocity", label="7.62 mm NATO ball M80: bullet speed", status="verified",
    value_si=838.2, unit_si="m/s",
    display="2,750 ft/s, 78 ft from the muzzle (838 m/s)",
    sources=[TM],
    notes="The M80 sheet (page 11-17) is misprinted in the PDF itself: 'Velocity ... 27501) fps, 78 ft from muzzle' (also 'Chamber pressure 50,000)() psi'). The M80 overhead-fire sheet in the same manual (page 11-19) reads cleanly 'Velocity ... 2750 fps, 78 ft from muzzle' (its projectile is listed at 149 gr). 2750 x 0.3048 = 838.2 m/s. Alternative rung only.",
    who_when="US Army, 1994 (changes to 2004)")
add(key="energy_rifle_bullet_762", label="Rifle bullet, 7.62 mm NATO (M80): kinetic energy (alternative)", status="derived",
    value_si=3323.4, unit_si="J",
    display="about 3.3 kJ (9.46 g at 838 m/s, 78 ft from the muzzle)",
    sources=[TM],
    notes="KE = 1/2 m v^2 = 0.5 x 0.0094606 x 838.2^2 = 3,323 J (energy_762_m80_bullet_mass, energy_762_m80_velocity). Not proposed as a rung: offered as a stand-in for Usain Bolt if the owner prefers fewer people on the ladder, though it adds a third gun. The velocity reads through a misprint (see energy_762_m80_velocity).",
    who_when="Derived Oct 2026", page_short="a battle-rifle bullet (7.62 mm NATO)")

# ---------------- Bolt
add(key="energy_usain_bolt_body_mass", label="Usain Bolt: body mass (as listed)", status="verified",
    value_si=95, unit_si="kg",
    display="95 kg (height 1.96 m), as listed in a 2019 biomechanics paper",
    sources=[COH19, COH18],
    notes="Coh 2019: 'Usain Bolt (age: 25, height: 1.96 m, weight: 95 kg, BMI: 24.7)'; also 'body mass = 95 kg' in the force calculation. A listed figure, not a weighing on race day. Cross-check: the Coh et al. 2018 abstract gives a 'vertical ground reaction force equal to 4.2 times body weight (3932 N)', which implies 3932 / (4.2 x 9.80665) = 95.5 kg. World Athletics' athlete profile gives no height or weight.",
    who_when="Coh 2019 (data from about 2011)")
add(key="energy_usain_bolt_top_speed", label="Usain Bolt at top speed: kinetic energy", status="derived",
    value_si=7327, unit_si="J", low_si=7001, high_si=7327,
    display="about 7.3 kJ (95 kg at 12.42 m/s)",
    sources=[COH19],
    notes="KE = 1/2 m v^2 = 0.5 x 95 kg x (12.42 m/s)^2 = 7,327 J. Speed: bolt_peak_running_speed (verified), his fastest 20 m average, 60-80 m, Berlin 2009 world record (12.42 m/s); Zagreb 2011 gives 12.14 m/s, hence low_si 7,001 J. Mass: energy_usain_bolt_body_mass. Counts only his body moving forward as a whole; the extra energy of his swinging arms and legs is left out (not quantified). A 20 m average sits slightly below the instantaneous peak. Good to about +/-10%.",
    who_when="Berlin 2009 (speed); derived Oct 2026", page_short="Usain Bolt at top speed")

# ---------------- .50
add(key="energy_50cal_m33_bullet_mass", label=".50-calibre ball M33: bullet mass", status="verified",
    value_si=0.042832, unit_si="kg",
    display="661 grains (42.8 g)",
    sources=[NSWC],
    notes="NSWC Crane slide 7 table, 'MK 322 Ball' vs 'M33 Ball': 'Bullet Weight 700 grains 661 grains'; same slide gives M33 'Brass Jacket and Steel Core', 'Boat-tail', 'Bullet Length ... 2.3 inches'. 661 x 64.79891 mg = 42.832 g. The Army data sheet for the M33 (TM 43-0001-27, page 9-29) lists no projectile weight. US Navy presentation, public release; DTIC-hosted.",
    who_when="NSWC Crane (US Navy), May 2012")
add(key="energy_50cal_m33_velocity", label=".50-calibre ball M33: bullet speed", status="verified",
    value_si=886.97, unit_si="m/s", low_si=876, high_si=894,
    display="2,910 ft/s 78 ft from the muzzle (887 m/s, US Army); 885 +/- 9 m/s at 24 m (US Navy)",
    sources=[TM, NSWC],
    notes="TM 43-0001-27 sheet 'CARTRIDGE, CALIBER .50, BALL, M33', page 9-29 (checked on the rendered page): 'Velocity ... 2910 fps, 78 ft from muzzle'; use 'Machine Guns, Caliber .50, M2 and M85'. x 0.3048 = 886.97 m/s. NSWC Crane slide 7: M33 'Velocity at 24m 885 [+/-] 9 mps' (78 ft = 23.8 m, so the same point). low/high are the Navy's 876-894 m/s.",
    who_when="US Army 1994; US Navy 2012")
add(key="energy_50cal_bullet", label=".50-calibre machine-gun bullet (M33 ball): kinetic energy", status="derived",
    value_si=16848, unit_si="J", low_si=16434, high_si=17116,
    display="about 17 kJ (42.8 g at 887 m/s)",
    sources=[TM, NSWC],
    notes="KE = 1/2 m v^2 = 0.5 x 0.042832 kg x (886.97 m/s)^2 = 16,848 J (energy_50cal_m33_bullet_mass, energy_50cal_m33_velocity); 16.4-17.1 kJ across the Navy's 885 +/- 9 m/s. The brief's guess of 15-20 kJ holds. Energy 24 m from the muzzle, slightly below muzzle energy (not quantified). Good to a few percent.",
    who_when="Derived Oct 2026", page_short="a .50-calibre bullet")

# ---------------- sugar
add(key="energy_sugar_teaspoon_mass", label="Granulated sugar: mass of a teaspoon (USDA)", status="verified",
    value_si=0.0042, unit_si="kg",
    display="4.2 g per teaspoon (also 2.3 g per cube, 2.8 g per packet)",
    sources=[USDA_SUGAR],
    notes="FDC 169655 (SR Legacy, NDB 19335) 'Sugars, granulated', foodMeasures: '1 tsp' 4.2 g; '1 serving 1 cube' 2.3 g; '1 serving packet' 2.8 g; '1 cup' 200 g. A household measure: a heaped teaspoon holds more (not quantified). Sugar-cube sizes vary by brand and country, so the teaspoon is the steadier rung.",
    who_when="USDA SR Legacy; fetched Oct 2026")
add(key="energy_sugar_food_energy_per_kg", label="Granulated sugar: food energy per kilogram (USDA)", status="verified",
    value_si=1.62e7, unit_si="J/kg",
    display="387 kcal (1,620 kJ) per 100 g",
    sources=[USDA_SUGAR],
    notes="FDC 169655 nutrients: 'Energy' 387 kcal and 'Energy' 1620.0 kJ per 100 g, both marked 'Calculated'; 'Carbohydrate, by difference' 100 g; 'Total Sugars' 99.8 g (analytical, 7 data points). Calorie conversion factor on the record: carbohydrateValue 3.87 kcal/g (Atwater-type factor), i.e. metabolisable food energy, not a lab measurement of heat. 1620 kJ/100 g = 1.62e7 J/kg.",
    who_when="USDA SR Legacy, nutrient values updated 2009")
add(key="energy_sucrose_heat_of_combustion", label="Sucrose: heat released by burning (cross-check)", status="derived",
    value_si=1.6487e7, unit_si="J/kg",
    display="5,643 kJ per mole = 16.5 kJ per gram",
    sources=[NIST_SUC],
    notes="NIST WebBook: 'Delta-c H-degree solid -5643.4 +/- 1.8 kJ/mol' (Ponomarev and Migarskaya, 1960, reanalysed by Cox and Pilcher, 1970); other entries -5637.4 to -5664.4 kJ/mol; molecular weight 342.2965. 5643.4 / 342.2965 = 16.49 kJ/g, within 2% of USDA's 16.20 kJ/g food energy. So the teaspoon rung is also, to 2%, the heat from burning the sugar. Supporting fact only.",
    who_when="NIST SRD 69; derived Oct 2026")
add(key="energy_sugar_teaspoon_food_energy", label="Food energy in a teaspoon of sugar", status="derived",
    value_si=68040, unit_si="J",
    display="about 68 kJ (16 kcal, i.e. 16 food Calories) per level teaspoon",
    sources=[USDA_SUGAR, NIST_SUC],
    notes="4.2 g (energy_sugar_teaspoon_mass) x 16.20 kJ/g (energy_sugar_food_energy_per_kg) = 68.0 kJ, or 4.2 x 3.87 = 16.3 kcal. Chemical energy: what the body can get from it, and (to 2%) the heat it gives when burned (energy_sucrose_heat_of_combustion). It is the same kind of comparison as the bombs already on the ladder (stored chemical energy), not a motion. Heaped spoons hold more. A sugar cube (2.3 g, USDA) is 37 kJ.",
    who_when="Derived Oct 2026", page_short="the food energy in a teaspoon of sugar")

# ---------------- Corolla
add(key="energy_corolla_50kmh", label="Toyota Corolla at 50 km/h: kinetic energy (optional rung)", status="derived",
    value_si=129280, unit_si="J",
    display="about 130 kJ (1,340 kg at 50 km/h)",
    sources=[KBB],
    notes="KE = 1/2 m v^2 = 0.5 x 1,340.4 kg x (13.889 m/s)^2 = 129.3 kJ, using toyota_corolla_curb_mass (2026 LE, 2,955 lb, verified via KBB and iSeeCars; Toyota's own spec page not reached). Empty car, no driver: with a 90 kg driver it is about 7% more. Exactly a quarter of the existing 100 km/h rung, which shows that doubling speed quadruples energy. Optional: the ladder already steps from the sugar (68 kJ) to the 100 km/h Corolla (517 kJ) in 7.6x.",
    who_when="Derived Oct 2026", page_short="a Corolla at 50 km/h")
add(key="energy_corolla_100kmh", label="Toyota Corolla at 100 km/h: kinetic energy (existing rung)", status="derived",
    value_si=517130, unit_si="J", low_si=517130, high_si=551230,
    display="about 0.52 MJ (1,340 kg at 100 km/h)",
    sources=[KBB],
    notes="Backs the existing 'carcrash' rung: build-data.py uses 0.5 x 1340 x (100/3.6)^2 = 517.0 kJ. Inputs: toyota_corolla_curb_mass, LE curb mass 1,340.4 kg (KBB, iSeeCars; secondary, Toyota not reached); high_si uses the XSE (1,428.8 kg). Empty car, no occupants. Value checked; no change needed.",
    who_when="Derived Oct 2026", page_short="a Corolla at 100 km/h")

for f in F:
    assert len(f["notes"]) <= 950, (f["key"], len(f["notes"]))
    for k in ("key","category","label","status","display","sources","notes"):
        assert k in f, (f.get("key"), k)
print(len(F))
for f in F: print(f["key"], f["status"], f.get("value_si"), len(f["notes"]))
json.dump(F, open("/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/researchC/small/out/facts.json","w"), indent=1, ensure_ascii=False)
