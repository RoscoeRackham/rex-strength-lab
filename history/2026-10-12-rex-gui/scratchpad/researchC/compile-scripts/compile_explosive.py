"""Compile the 'explosive' band (about 0.5 MJ to 50 GJ) from the researcher's
output and the skeptic's checks. Writes compiled/explosive.json."""
import json, math, sys

OUT = sys.argv[1]
WHO = "Compiled 2026-10-13"

NIST_B9 = {"title": "NIST SP 811 Appendix B.9: conversion factors",
           "url": "https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b9"}
FDA = {"title": "FDA: How to Understand and Use the Nutrition Facts Label ('2,000 calories a day is used as a general guide for nutrition advice')",
       "url": "https://www.fda.gov/food/nutrition-facts-label/how-understand-and-use-nutrition-facts-label"}
EIA_FAQ = {"title": "EIA FAQ: How much electricity does an American home use? (last updated 8 Jan 2024)",
           "url": "https://www.eia.gov/tools/faqs/faq.php?id=97&t=3"}
SIEMENS_DE = {"title": "Siemens Fact Sheet: Velaro D - Neuer ICE 3 (Baureihe 407), German",
              "url": "https://assets.new.siemens.com/siemens/assets/api/uuid:f87cebe5-71ab-4224-985d-baa30a934ff0/factsheet-velaro-d-de.pdf"}
SIEMENS_EN = {"title": "Siemens data sheet: Velaro D (Class 407), English",
              "url": "https://assets.new.siemens.com/siemens/assets/api/uuid:2f82dc92-66be-40b7-be36-78bd0f1bd0b1/high-speed-train-velaro-d-data-sheet-en.pdf"}
AIRBUS = {"title": "Airbus A380 Facts and Figures, January 2022",
          "url": "https://www.airbus.com/sites/g/files/jlcbta136/files/2022-01/EN-Airbus-A380-Facts-and-Figures-January-2022.pdf"}
NASA_ATM = {"title": "NASA Glenn: Earth Atmosphere Model, metric units",
            "url": "https://www.grc.nasa.gov/www/k-12/airplane/atmosmet.html"}
NASA_SOS = {"title": "NASA Glenn: Speed of Sound (a = sqrt(gamma R T))",
            "url": "https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/speed-of-sound-interactive/"}
KBB = {"title": "Kelley Blue Book: 2026 Toyota Corolla specs (trade guide, secondary)",
       "url": "https://www.kbb.com/toyota/corolla/2026/specs"}
EIA_BTU = {"title": "EIA Energy Explained: British thermal units (Btu), sample conversion factors",
           "url": "https://www.eia.gov/energyexplained/units-and-calculators/british-thermal-units.php"}
EIA_MER = {"title": "EIA Monthly Energy Review, Appendix A, thermal conversion factor documentation",
           "url": "https://www.eia.gov/totalenergy/data/monthly/pdf/mer_a_doc.pdf"}
AFDC = {"title": "DOE Alternative Fuels Data Center: Fuel Properties Comparison",
        "url": "https://afdc.energy.gov/files/u/publication/fuel_comparison_chart.pdf"}
LLNL = {"title": "LLNL, Dobratz (ed.), Properties of Chemical Explosives and Explosive Simulants, UCRL-51319 (Dec 1972, page dated 7/74), Table 5.3 Heats of detonation (UNT Digital Library copy)",
        "url": "https://digital.library.unt.edu/ark:/67531/metadc1022662/m2/1/high_res_d/4285272.pdf"}
ARMY = {"title": "US Army TC 3-23.30 Grenades and Pyrotechnic Signals, Fig. 3-15 ('Filler 6.5 ounces of Composition B')",
        "url": "https://armypubs.army.mil/epubs/DR_pubs/DR_a/ARN37340-TC_3-23.30-001-WEB-3.pdf"}

# ----------------------------------------------------------------- computed values
LB = 0.45359237
food_day = 2000 * 4184.0                      # J
food_month = 30 * food_day                    # J
truck = 0.5 * (80000 * LB) * (100 / 3.6) ** 2
home_year = 10791 * 3.6e6
home_day = home_year / 365
home_week = home_day * 7
v_train = 320 / 3.6
train = 0.5 * 454000 * v_train ** 2
train_loaded = 0.5 * (454000 + 460 * 80) * v_train ** 2
a_strat = math.sqrt(1.4 * 287.05 * 216.69)
v_a380 = 0.85 * a_strat
a380 = 0.5 * 575000 * v_a380 ** 2
a380_low = 0.5 * 386000 * v_a380 ** 2
gas = 120214 * 1055.056 / 3.785411784e-3      # J/m^3
gas_lo = 112114 * 1055.056 / 3.785411784e-3
gas_hi = 124340 * 1055.056 / 3.785411784e-3
tank = 13.2 * 120214 * 1055.056
tank_lo = 13.2 * 112114 * 1055.056
tank_hi = 13.2 * 124340 * 1055.056
m67 = 0.18427
gren_gas, gren_liq, gren_ratio = m67 * 4.69e6, m67 * 5.02e6, m67 * 1.10 * 4.184e6
moab_check = 18700 * LB / 1000 * 1.35 * 4.184e9

def r(x, sig=4):
    return float(f"{x:.{sig}g}")

facts = []

facts.append(dict(
    key="energy_day_of_food_2000_calories", category="energy_reference",
    label="A day's food: the 2,000-Calorie reference diet (FDA)", status="verified",
    value_si=r(food_day), unit_si="J",
    display="2,000 Calories (kcal) a day = 8.4 MJ (FDA's general guide; needs vary)",
    sources=[FDA, NIST_B9],
    notes=("FDA: '2,000 calories a day is used as a general guide for nutrition advice. Your calorie needs may be "
           "higher or lower and vary depending on your age, sex, height, weight, and physical activity level.' "
           "Food-label calories are kilocalories: NIST SP 811 B.9 'calorie th, kilogram (nutrition)' = 4.184 E+03 J "
           "(the IT value, 4.1868 E+03 J, is 0.07% higher). 2,000 x 4,184 J = 8.368e6 J. A label reference, not a "
           "measured average intake. The FDA Daily Value page gave no readable text, so the how-to page was used. "
           "Skeptic: removed the uncited gloss 'food energy the body can use'; page phrase changed from 'a day's "
           "food for an adult' (reads as what adults eat) to 'a day's food (2,000 Calories)'."),
    who_when="FDA (page accessed 2026-10-13); NIST SP 811",
    page_short="a day's food (2,000 Calories)"))

facts.append(dict(
    key="energy_month_of_food_2000_calories", category="energy_reference",
    label="A month's food at the 2,000-Calorie reference diet (30 days)", status="derived",
    value_si=r(food_month), unit_si="J",
    display="about 0.25 GJ (30 days x 2,000 Calories)",
    sources=[FDA, NIST_B9],
    notes=("30 x 8.368e6 J (energy_day_of_food_2000_calories) = 2.510e8 J. A 30-day month; an average calendar month "
           "(30.44 days) gives 2.547e8 J, 1.5% more. Inherits the day figure's caveat: 2,000 Calories is FDA's "
           "'general guide', and real needs vary with age, sex, size and activity. Added at the compile stage on the "
           "skeptic's suggestion, as a firm rung between a day's home electricity (1.06e8 J) and the high-speed "
           "train (1.79e9 J), so that decade does not rest only on the lightning rung (uncertain by 70x)."),
    who_when="Derived 2026-10-13 from FDA and NIST",
    page_short="a month's food (2,000 Calories a day)"))

facts.append(dict(
    key="energy_semi_truck_100kmh", category="energy_reference",
    label="Fully loaded US semi-truck (80,000 lb) at 100 km/h: kinetic energy", status="derived",
    value_si=r(truck, 3), unit_si="J",
    display="about 14 MJ (36,287 kg at 100 km/h = 27.8 m/s)",
    sources=[{"title": "23 CFR 658.17(b): 'The maximum gross vehicle weight shall be 80,000 pounds' (Cornell LII)",
              "url": "https://www.law.cornell.edu/cfr/text/23/658.17"}],
    notes=("KE = 1/2 m v^2. m = 80,000 lb x 0.45359237 = 36,287 kg (existing fact semi_truck_80000lb_mass). 23 CFR "
           "658.17(b): 'The maximum gross vehicle weight shall be 80,000 pounds except where lower gross vehicle "
           "weight is dictated by the bridge formula.' v = 100 km/h (27.78 m/s) is a chosen speed, the same as the "
           "Corolla rung, not a sourced typical speed. Result 1.400e7 J; at 55, 65 and 75 mph, 11, 15 and 20 MJ. "
           "80,000 lb is the federal maximum on the Interstate System, so this is a fully loaded rig; many run "
           "lighter. Spinning wheels and drivetrain ignored (a few per cent, not quantified). Skeptic: confirmed, "
           "no change."),
    who_when="Derived 2026-10-13 from federal regulation (current eCFR)",
    page_short="a fully loaded semi-truck at 100 km/h"))

facts.append(dict(
    key="energy_us_home_electricity_year", category="energy_reference",
    label="Average US home's electricity purchases in a year (EIA, 2022)", status="verified",
    value_si=r(home_year, 5), unit_si="J",
    display="10,791 kWh a year (2022), about 899 kWh a month; state averages range from 6,178 (Hawaii) to 14,774 kWh (Louisiana)",
    sources=[EIA_FAQ, NIST_B9],
    notes=("EIA: 'In 2022, the average annual amount of electricity sold to (purchased by) a U.S. residential "
           "electric-utility customer was 10,791 kilowatthours (kWh), an average of about 899 kWh per month.' "
           "Louisiana highest at 14,774 kWh, Hawaii lowest at 6,178. EIA: 'Electricity purchases may not represent "
           "the total electricity consumption for some residential electricity customers' (rooftop solar). A "
           "residential customer includes flats, not only houses. 10,791 kWh x 3.6e6 J = 3.885e10 J. Electricity "
           "delivered, not power-station fuel. Skeptic: low_si/high_si removed; the state spread (2.22e10 to "
           "5.32e10 J) is variation between states, not uncertainty in the national average, and would wrongly "
           "trigger rough wording. Solar caveat added."),
    who_when="EIA, 2022 data (page last updated 8 Jan 2024; accessed 2026-10-13)",
    page_short="a year's electricity for an American home"))

facts.append(dict(
    key="energy_us_home_electricity_day", category="energy_reference",
    label="Average US home's electricity purchases in a day (2022 yearly average / 365)", status="derived",
    value_si=r(home_day), unit_si="J",
    display="about 29.6 kWh = 0.11 GJ (10,791 kWh a year / 365); state averages 17 kWh (Hawaii) to 40 kWh (Louisiana) a day",
    sources=[EIA_FAQ, NIST_B9],
    notes=("10,791 kWh a year (EIA 2022, energy_us_home_electricity_year) / 365 = 29.56 kWh = 1.064e8 J. A yearly "
           "average; real use swings with season and weather. Same EIA caveats: purchases may miss rooftop-solar "
           "use, and a residential customer includes flats. Electricity delivered, not power-station fuel. State "
           "averages: Hawaii 6.09e7 J a day, Louisiana 1.46e8 J. A week is 7.45e8 J (0.745 GJ), a spare rung from "
           "the same source. Skeptic: low_si/high_si removed (the state spread, 2.4x, is not uncertainty in the "
           "national figure and would wrongly mark the rung rough); week corrected from 0.74 to 0.745 GJ."),
    who_when="Derived 2026-10-13 from EIA 2022 data",
    page_short="a day's electricity for an American home"))

facts.append(dict(
    key="energy_lightning_flash", category="energy_reference",
    label="A lightning flash: total energy", status="disputed",
    value_si=1.0e9, unit_si="J", low_si=1.0e8, high_si=7.0e9,
    display="about 1 GJ per flash (published estimates 0.1 to 7 GJ)",
    sources=[
        {"title": "Maggio, Marshall & Stolzenburg (2009) Estimations of charge transferred and energy released by lightning flashes, JGR 114, D14, doi:10.1029/2008JD011506 (abstract via Crossref)",
         "url": "https://api.crossref.org/works/10.1029/2008JD011506"},
        {"title": "Borucki & Chameides (1984) Lightning: estimates of the rates of energy dissipation and nitrogen fixation, Rev. Geophys. 22:363-372 (abstract via Crossref)",
         "url": "https://api.crossref.org/works/10.1029/RG022i004p00363"},
        {"title": "Koshak (2021) GLM estimates of LNOx over the continental US, NASA MSFC, AMS extended abstract J2A.8 (not peer-reviewed)",
         "url": "https://ntrs.nasa.gov/api/citations/20210000238/downloads/ams2021_paper_Koshak.pdf"},
        {"title": "US EPA AP-42 section 14.3 Lightning Emissions (9/96)",
         "url": "https://www.epa.gov/sites/production/files/2020-11/documents/c14s03.pdf"}],
    notes=("Maggio 2009: 'IC flashes released an average of 1.6 GJ ... CG flashes was about half as much ... 2 x 10^8 "
           "to 7 x 10^9 J' (40 flashes, New Mexico mountain storms). Borucki & Chameides 1984: '4 x 10^8 J per "
           "flash'. EPA AP-42: '1.0 E+08 joules/flash to 8.0 E+08 joules/flash', citing Borucki & Chameides (its "
           "ref. 5), so not independent. Koshak (NASA; conference abstract, modelled 'VCM-derived total "
           "electrostatic' energy): 'typically measured in giga-joules'; ground 5.3 GJ, cloud 2.7 GJ, all flashes "
           "3.9 GJ. Sources differ on which kind is larger and span 70x. 1 GJ is a round middle value, not a "
           "measured mean: rough multiples only. Skeptic: added the independence, peer-review, sample and "
           "all-flash caveats."),
    who_when="Journals 1984 and 2009; NASA 2021; EPA AP-42 (9/96)",
    page_short="a lightning bolt"))

facts.append(dict(
    key="ice3_velaro_d_empty_mass", category="object_mass",
    label="Siemens Velaro D (Deutsche Bahn ICE 3, class 407) empty weight", status="verified",
    value_si=454000, unit_si="kg",
    display="454 t empty, 8 cars, 200 m",
    sources=[SIEMENS_DE],
    notes=("Siemens factsheet, 'Technische Daten des Velaro D (pro Zug)': 'Leergewicht 454 Tonnen', 'Zuglänge 200 "
           "Meter', 'achtteilig', 'Sitzplätze (exkl. 16 Bistroplätze) 444'. The English data sheet gives no weight. "
           "The maker's empty weight; passengers and luggage add more. Skeptic: confirmed."),
    who_when="Siemens Mobility factsheet (c. 2015; mentions service from 15 June 2015), accessed 2026-10-13"))

facts.append(dict(
    key="ice3_velaro_d_max_speed", category="speed",
    label="Siemens Velaro D (ICE 3, class 407) maximum operating speed", status="verified",
    value_si=r(v_train, 5), unit_si="m/s",
    display="320 km/h",
    sources=[SIEMENS_DE, SIEMENS_EN],
    notes=("German sheet: 'Max. Betriebsgeschwindigkeit 320 Kilometer pro Stunde (Wechselstrom)'. English sheet: "
           "'Maximum speed 320 km/h'. 320 / 3.6 = 88.89 m/s, the maximum operating speed on AC power. Line speed "
           "limits in service are often lower (not verified). Skeptic: confirmed."),
    who_when="Siemens Mobility, accessed 2026-10-13"))

facts.append(dict(
    key="energy_high_speed_train_full_speed", category="energy_reference",
    label="High-speed train (ICE 3 Velaro D, 454 t) at 320 km/h: kinetic energy", status="derived",
    value_si=r(train, 3), unit_si="J", low_si=r(train, 3), high_si=r(train_loaded, 3),
    display="about 1.8 GJ (454 t at 320 km/h); about 1.9 GJ full of passengers",
    sources=[SIEMENS_DE, SIEMENS_EN],
    notes=("KE = 1/2 x 454,000 kg (ice3_velaro_d_empty_mass) x (88.89 m/s)^2 (ice3_velaro_d_max_speed) = 1.79e9 J, "
           "empty. With every place filled (444 seats and 16 bistro places) at an assumed 80 kg per person with "
           "luggage (+37 t): 1.94e9 J (high_si). Check: the English sheet's maximum axle load, 17 t x 32 axles = "
           "544 t, is above the loaded 491 t. Spinning wheels and motors ignored (a few per cent). One 200 m set; "
           "two coupled sets carry twice as much. 320 km/h is the top operating speed; many lines run slower. "
           "Eurostar e320 rejected: Siemens publishes no mass for it. Skeptic: '460 seats' corrected to 444 seats "
           "and 16 bistro places; axle-load check added."),
    who_when="Derived 2026-10-13 from Siemens data",
    page_short="a high-speed train at full speed"))

facts.append(dict(
    key="a380_cruise_mach", category="speed",
    label="Airbus A380 cruise Mach number", status="verified",
    value_si=0.85, unit_si="1",
    display="Mach 0.85 (Airbus)",
    sources=[AIRBUS],
    notes=("Airbus: 'It offers a cruise Mach number of M 0.85' and, under Operating data, 'Long Range Cruise M 0.85'. "
           "The same sheet: 'Maximum takeoff weight 560 t / 575 t', 'Maximum landing weight 386 t /394 t', 'Maximum "
           "zero fuel weight 361 t /369 t' (MTOW is existing fact airbus_a380_mtow). The PDF blocks curl (bot wall); "
           "WebFetch retrieved it. Skeptic: confirmed."),
    who_when="Airbus, Jan 2022 (figures at end Dec 2021), accessed 2026-10-13"))

facts.append(dict(
    key="speed_of_sound_cruise_altitude", category="speed",
    label="Speed of sound at airliner cruising height (11-25 km, standard atmosphere)", status="derived",
    value_si=r(a_strat), unit_si="m/s", low_si=295.1, high_si=296.6,
    display="about 295 m/s (1,062 km/h) at -56.5 C",
    sources=[NASA_ATM, NASA_SOS],
    notes=("NASA Glenn model: lower stratosphere (11,000 to 25,000 m) 'T = -56.46' C; troposphere 'T = 15.04 - "
           ".00649 * h'. a = sqrt(gamma R T) with gamma = 1.4 and R = 287.05 J/(kg K) for dry air (standard values, "
           "not stated on the NASA page). 216.69 K gives 295.1 m/s; 35,000 ft (219.0 K) gives 296.6 m/s. Airliner "
           "cruise heights of 35,000 to 43,000 ft are not verified. The real atmosphere differs from the standard "
           "by a few per cent. Skeptic: confirmed."),
    who_when="Derived 2026-10-13 (NASA Glenn standard-atmosphere model)"))

facts.append(dict(
    key="energy_a380_cruise", category="energy_reference",
    label="Fully loaded Airbus A380 at cruising speed: kinetic energy", status="derived",
    value_si=r(a380, 3), unit_si="J", low_si=r(a380_low, 3), high_si=r(a380, 3),
    display="about 18 GJ (575 t at Mach 0.85, 251 m/s, about 900 km/h)",
    sources=[AIRBUS, NASA_ATM],
    notes=("v = 0.85 (a380_cruise_mach) x 295.1 m/s (speed_of_sound_cruise_altitude) = 250.8 m/s. KE = 1/2 x "
           "575,000 kg (airbus_a380_mtow) x 250.8^2 = 1.81e10 J. By cruise the plane has burned its climb fuel "
           "(not quantified), so 'fully loaded' overstates it by a few per cent. low_si uses 386 t, the 560 t "
           "variant's maximum landing weight (the 575 t variant's 394 t gives 1.24e10 J): 1.21e10 J, near the end "
           "of a flight. Range 1.5x, so a plain multiple is fine. Airspeed, not ground speed. Skeptic: confirmed; "
           "noted that the low end mixes variants."),
    who_when="Derived 2026-10-13 from Airbus data and the NASA standard atmosphere",
    page_short="a fully loaded A380 at cruising speed"))

facts.append(dict(
    key="toyota_corolla_fuel_tank", category="object_volume",
    label="Toyota Corolla sedan fuel tank capacity (2026 model year)", status="reported",
    value_si=r(13.2 * 3.785411784e-3, 5), unit_si="m^3",
    display="13.2 US gallons (50.0 L), all three trims (KBB)",
    sources=[KBB],
    notes=("KBB row 'Fuel Capacity': '13.2 gallons' for LE, SE and XSE, beside 'Curb Weight 2955 pounds 3110 pounds "
           "3150 pounds' (matching toyota_corolla_curb_mass). 13.2 x 3.785411784 L = 49.97 L. KBB is a trade guide, "
           "not Toyota; toyota.com renders by script and gave no readable spec, and a search found the same figure "
           "only on secondary sites. Skeptic: status verified -> reported; row label corrected from 'Fuel tank "
           "capacity' to 'Fuel Capacity'."),
    who_when="KBB, 2026 model year, accessed 2026-10-13"))

facts.append(dict(
    key="gasoline_heat_content", category="fuel_energy_density",
    label="Motor gasoline energy content per volume (US finished gasoline, gross)", status="verified",
    value_si=r(gas, 5), unit_si="J/m^3", low_si=r(gas_lo, 5), high_si=r(gas_hi, 5),
    display="120,214 Btu per US gallon (EIA, gross) = 33.5 MJ/L; AFDC gasoline/E10: 112,114-116,090 Btu/gal lower, 120,388-124,340 higher heating value",
    sources=[EIA_BTU, EIA_MER, AFDC, NIST_B9],
    notes=("EIA: 'Motor gasoline 1 gallon=120,214 Btu'; 'Each year, those factors are recalculated' (no year given). "
           "EIA MER Appendix A: since 2007 finished gasoline is 'the annual quantity-weighted average of ... gasoline "
           "blendstock and fuel ethanol', blendstock at '124,340 Btu per gallon' (gross). AFDC, Gasoline/E10 ('90% "
           "gasoline, 10% ethanol'): lower heating value '112,114-116,090 Btu/gal', higher '120,388-124,340 "
           "Btu/gal'. 120,214 x 1,055.056 J / 3.785411784e-3 m^3 = 3.351e10 J/m^3. low_si (AFDC lower, net) and "
           "high_si (gross, blendstock) are on different bases. Skeptic: added EIA MER Appendix A as the source "
           "for the gross, ethanol-blend basis, which the Btu page does not state."),
    who_when="EIA (current pages) and DOE AFDC, accessed 2026-10-13"))

facts.append(dict(
    key="energy_car_fuel_tank_petrol", category="energy_reference",
    label="A car's full tank of petrol (Corolla, 13.2 gal): chemical energy", status="reported",
    value_si=r(tank, 3), unit_si="J", low_si=r(tank_lo, 3), high_si=r(tank_hi, 3),
    display="about 1.7 GJ (50 L x 33.5 MJ/L)",
    sources=[KBB, EIA_BTU, EIA_MER, AFDC],
    notes=("13.2 gal (toyota_corolla_fuel_tank) x 120,214 Btu/gal (gasoline_heat_content) x 1,055.056 J/Btu = "
           "1.674e9 J; the AFDC range (112,114 lower to 124,340 higher) gives 1.56e9 to 1.73e9 J. Heat from burning "
           "the whole tank; an engine turns only part of it into motion. Arithmetic checked by the skeptic, but the "
           "tank volume is 'reported' (KBB trade guide), so this is 'reported', not 'derived' (derived needs "
           "verified inputs). Spare, not a recommended rung: within 1.1x of the high-speed train."),
    who_when="Computed 2026-10-13 from KBB, EIA and AFDC",
    page_short="a car's full tank of petrol"))

facts.append(dict(
    key="comp_b3_heat_of_detonation", category="explosive_property",
    label="Composition B-3 (measured heat of detonation), used as a stand-in for the M67's Composition B; TNT's for the ratio",
    status="verified",
    value_si=4.69e6, unit_si="J/kg", low_si=4.69e6, high_si=5.02e6,
    display="Comp B-3: 1.12-1.20 kcal/g (4.69-5.02 MJ/kg); TNT: 1.02-1.09 kcal/g (4.27-4.56 MJ/kg); ratio about 1.10",
    sources=[LLNL],
    notes=("Table 5.3 (p. 5-3, PDF p. 39), experimental, 25 C. Comp B-3 (density 1.69, 8.47 mm charge): 1.20 kcal/g "
           "(5.02 MJ/kg) water liquid, 1.12 (4.69) water gas. TNT (density 1.54, 12.7 mm): 1.09 (4.56) and 1.02 "
           "(4.27). Ratio 1.10 in both columns. Comp B Grade A (with wax, the Army's 'Composition B') has only "
           "calculated maxima (1.54, 1.40), no measurement. Handbook: values 'vary with density, size, and "
           "confinement'. Values read from the page image (poor text layer). Skeptic: key and label changed from "
           "'Composition B' to Comp B-3 as a stand-in; noted that the 1.10 ratio compares different densities and "
           "diameters, so it is approximate."),
    who_when="LLNL 1972/1974"))

facts.append(dict(
    key="energy_m67_grenade_heat_of_detonation", category="energy_reference",
    label="M67 hand grenade: chemical energy of its filler (measured heat of detonation)", status="derived",
    value_si=8.9e5, unit_si="J", low_si=r(gren_ratio, 3), high_si=r(gren_liq, 3),
    display="about 0.9 MJ (0.184 kg Composition B x 4.7-5.0 MJ/kg)",
    sources=[ARMY, LLNL, NIST_B9],
    notes=("0.18427 kg (6.5 oz) Comp B (energy_m67_grenade_explosive_mass; Fig. 3-15 'Filler 6.5 ounces of "
           "Composition B', re-confirmed 2026-10-13) x 4.69-5.02 MJ/kg (comp_b3_heat_of_detonation, Comp B-3 as a "
           "stand-in) = 0.86-0.93 MJ; 0.89 MJ is the middle. low_si = 0.18427 x 1.10 x 4.184 MJ = 0.85 MJ, mixing "
           "the measured ratio with the conventional TNT figure. Replaces 1.0 MJ, which used a Wikipedia RE factor "
           "of 1.33 ('citation needed') that rates blast, not energy. The MOAB rung stays on an RE (blast) basis, "
           "so the two rungs are on different bases (fine at ladder precision, per the skeptic). Chemical energy released, "
           "not blast energy. Skeptic: confirmed; basis notes added."),
    who_when="Derived 2026-10-13",
    page_short="a hand grenade"))

facts.append(dict(
    key="energy_moab_h6_fill_cross_check", category="energy_reference",
    label="GBU-43/B MOAB: yield cross-check from its H6 fill", status="reported",
    value_si=r(moab_check, 3), unit_si="J",
    display="18,700 lb H6 x 1.35 = 11.5 t TNT equivalent = 4.8 x 10^10 J",
    sources=[{"title": "Air Force Armament Museum Foundation: GBU-43/B MOAB", "url": "https://afarmamentmuseum.com/artifact/gbu43/"},
             NIST_B9],
    notes=("Museum foundation page: 'delivers 18,700 lb of H6 explosive using a BLU-120/B warhead'; 'Armament 18,700 "
           "lbs of H6 Composition (1.35 times more powerful than TNT)'; 'Weight 21,600 lbs'. 8,482 kg x 1.35 = 11.45 "
           "t TNT x 4.184e9 J = 4.79e10 J, 4% above the 11 t (4.60e10 J) of energy_moab_yield. Consistent with the "
           "11 t figure, but both depend on RE (blast-equivalence) factors without a primary source, possibly the "
           "same arithmetic. The grenade rung now uses heat of detonation, so the two rungs are on different bases. "
           "'Reported': a museum foundation, not an Air Force specification. Existing fill 18,739 lb vs 18,700 lb "
           "here (0.2%). Skeptic: reworded from 'stands' to 'consistent with'."),
    who_when="Air Force Armament Museum Foundation, accessed 2026-10-13",
    page_short="the MOAB bomb"))

# ----------------------------------------------------------------- rungs
def rough(f):
    v = f["value_si"]
    return bool(("high_si" in f and f["high_si"] / v > 2) or ("low_si" in f and v / f["low_si"] > 2))

by = {f["key"]: f for f in facts}
rung_keys = ["energy_m67_grenade_heat_of_detonation", "energy_day_of_food_2000_calories", "energy_semi_truck_100kmh",
             "energy_us_home_electricity_day", "energy_month_of_food_2000_calories", "energy_lightning_flash",
             "energy_high_speed_train_full_speed", "energy_a380_cruise"]
rungs = [dict(key="toyota_corolla_curb_mass", J=517000.0, page_short="a Corolla at 100 km/h", rough=False)]
for k in rung_keys:
    f = by[k]
    rungs.append(dict(key=k, J=f["value_si"], page_short=f["page_short"], rough=rough(f)))
rungs.append(dict(key="energy_tnt_equivalent_per_tonne", J=4.184e9, page_short="a tonne of TNT", rough=False))
rungs.append(dict(key="energy_moab_yield", J=4.6024e10, page_short="the MOAB bomb", rough=False))
rungs.sort(key=lambda x: x["J"])

gaps = ("Inside this band (Corolla 5.2e5 J to MOAB 4.6e10 J): none. Steps: Corolla to grenade 1.7x, grenade to a "
        "day's food 9.4x (8.2x if the page keeps 1.0 MJ), to the semi-truck 1.7x, to a day's home electricity 7.6x, "
        "to a month's food 2.4x, to lightning 4.0x (rough), to the train 1.8x, to a tonne of TNT 2.3x, to the A380 "
        "4.3x, to the MOAB 2.5x. On firm rungs only (lightning left out), the month's food to the train is 7.1x, so "
        "still no gap. At the edges: above about 4.6e11 J (10x the MOAB) nothing is within 10x until the next band's "
        "first rung (Beirut, if confirmed near 1e12 J); the 1e11 to 1e12 J decade needs a rung from that band. Below "
        "about 5e4 J (a tenth of the Corolla) coverage depends on the lower band's rungs (bullets).")

out = {"facts": facts, "rungs": rungs, "gaps": gaps}
for f in facts:
    if len(f["notes"]) > 900:
        print("LONG NOTES", f["key"], len(f["notes"]))
json.dump(out, open(OUT, "w"), indent=1, ensure_ascii=False)
print(len(facts), "facts")
prev = None
for g in rungs:
    step = "" if prev is None else f"  step {g['J'] / prev:.2f}x"
    print(f"{g['key']:45s} {g['J']:.4g}  rough={g['rough']}  {g['page_short']}{step}")
    prev = g["J"]
