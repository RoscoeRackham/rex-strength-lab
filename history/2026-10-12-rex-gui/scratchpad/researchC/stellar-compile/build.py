# Compile the stellar topic (researcher output + skeptic corrections) into compiled/stellar.json
import json, math, sys

OUT = sys.argv[1]
C2 = 299792458.0 ** 2
L_SUN = 3.828e26
YEAR = 31556930.0           # tropical year, NIST SP 811 B.8
M_SUN, M_EARTH, M_MOON, M_JUP = 1.9884e30, 5.9722e24, 7.346e22, 1.89813e27
MSUNC2 = M_SUN * C2

def r4(x):
    return float('%.5g' % x)

NIST_B8 = {"title": "NIST Guide to the SI (SP 811), Appendix B.8: Factors for units listed alphabetically (tropical year 3.155 693e7 s)",
           "url": "https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b8"}
IAU = {"title": "Prša et al. (2016), IAU 2015 Resolution B3, AJ 152, 41; arXiv:1510.07674 PDF (nominal solar luminosity 3.828e26 W)",
       "url": "https://arxiv.org/pdf/1510.07674"}
NIST_C = {"title": "NIST CODATA 2022: speed of light in vacuum, 299 792 458 m/s exact (existing fact growth_c_exact)",
          "url": "https://physics.nist.gov/cgi-bin/cuu/Value?c"}
EARTH = {"title": "NASA NSSDCA Earth Fact Sheet (last updated 15 Nov 2024)", "url": "https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html"}
JUP = {"title": "NASA NSSDCA Jupiter Fact Sheet (last updated 2 Oct 2024)", "url": "https://nssdc.gsfc.nasa.gov/planetary/factsheet/jupiterfact.html"}
SUN = {"title": "NASA NSSDCA Sun Fact Sheet (mass 1,988,400e24 kg; existing fact sun_mass)", "url": "https://nssdc.gsfc.nasa.gov/planetary/factsheet/sunfact.html"}
MOON = {"title": "NASA NSSDCA Moon Fact Sheet (mass 0.07346e24 kg; existing fact moon_mass)", "url": "https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html"}
REID = {"title": "Reid et al. (2019) Trigonometric parallaxes of high-mass star forming regions: our view of the Milky Way, ApJ 885, 131 (DOI 10.3847/1538-4357/ab4a11); arXiv abstract",
        "url": "https://arxiv.org/abs/1910.03357"}
NAD05 = {"title": "Nadyozhin & Imshennik (2005) Physics of supernovae, Int. J. Mod. Phys. A (DOI 10.1142/S0217751X05029630); arXiv PDF", "url": "https://arxiv.org/pdf/astro-ph/0501002"}
NAD08 = {"title": "Nadyozhin (2008) Physics of supernovae: theory, observations, unresolved problems, arXiv:0804.4350 PDF (lecture; no journal reference)", "url": "https://arxiv.org/pdf/0804.4350"}
BURROWS = {"title": "Burrows & Vartanyan (2021) Core-collapse supernova explosion theory, Nature 589, 29 (DOI 10.1038/s41586-020-03059-w); arXiv PDF v3", "url": "https://arxiv.org/pdf/2009.14157"}
JANKA = {"title": "Janka (2012) Explosion mechanisms of core-collapse supernovae, Annu. Rev. Nucl. Part. Sci. 62 (DOI 10.1146/annurev-nucl-102711-094901); arXiv PDF", "url": "https://arxiv.org/pdf/1206.2503"}

def sun_years(key, n, words, page_short, label, extra=''):
    v = L_SUN * n * YEAR
    return {"key": key, "category": "energy_reference", "label": label, "status": "derived",
            "value_si": r4(v), "unit_si": "J",
            "display": "about %s J (%s at 3.828 × 10^26 W)" % (('%.1e' % v).replace('e+', ' × 10^'), words),
            "sources": [IAU, NIST_B8],
            "notes": ("energy_sun_luminosity (3.828e26 W, existing verified fact) × %s × tropical_year_seconds (3.155693e7 s) = %.4e J. " % ({1: '1 year', 100: '100 years', 1000: '1,000 years', 1e6: '1e6 years', 1e9: '1e9 years'}[n], v)) + extra,
            "who_when": "Derived 2026-10-13 (IAU 2015; NIST)", "page_short": page_short}

facts = []

# ---------------------------------------------------------------- input facts
facts.append({"key": "tropical_year_seconds", "category": "time", "label": "One year (tropical year) in seconds", "status": "verified",
    "value_si": 31556930, "unit_si": "s",
    "display": "1 tropical year = 3.155 693 × 10^7 s (NIST); a 365-day year is 3.1536 × 10^7 s",
    "sources": [NIST_B8],
    "notes": "Fetched page, 'Y' table: 'year (365 days) second (s) 3.1536 E+07'; 'year (sidereal) second (s) 3.155 815 E+07'; 'year (tropical) second (s) 3.155 693 E+07'. Used for every 'Sun's output for N years' rung. The choice of year changes those rungs by under 0.1%. Skeptic confirmed (page footer 'Updated August 18, 2025').",
    "who_when": "NIST SP 811 (page updated 18 Aug 2025)"})

facts.append({"key": "jupiter_mass", "category": "object_mass", "label": "Jupiter's mass", "status": "verified",
    "value_si": 1.89813e27, "unit_si": "kg", "display": "1,898.13 × 10^24 kg (317.83 Earth masses)", "sources": [JUP],
    "notes": "Fetched sheet, row 'Mass (10^24 kg)': Jupiter 1,898.13; Earth 5.9722; ratio 317.83. Input to energy_jupiter_orbital_kinetic and energy_jupiter_mass_energy. Same key and value as the planetary topic's fact.",
    "who_when": "NASA NSSDCA, 2024-10-02"})

facts.append({"key": "jupiter_mean_orbital_speed", "category": "space", "label": "Jupiter's mean orbital speed around the Sun", "status": "verified",
    "value_si": 13060, "unit_si": "m/s", "low_si": 12440, "high_si": 13720,
    "display": "13.06 km/s mean (12.44 km/s slowest, 13.72 km/s fastest)", "sources": [JUP],
    "notes": "Fetched sheet: 'Mean orbital velocity (km/s) 13.06 29.78 0.439'; 'Max. orbital velocity (km/s) 13.72 30.29 0.453'; 'Min. orbital velocity (km/s) 12.44 29.29 0.425' (columns: Jupiter, Earth, ratio). The range is the real change of speed around Jupiter's elliptical orbit, not measurement uncertainty. Key renamed from the researcher's jupiter_mean_orbital_velocity to match the planetary topic's fact for the same quantity.",
    "who_when": "NASA NSSDCA, 2024-10-02"})

facts.append({"key": "earth_mean_orbital_speed", "category": "space", "label": "Earth's mean orbital speed around the Sun", "status": "verified",
    "value_si": 29780, "unit_si": "m/s", "low_si": 29290, "high_si": 30290,
    "display": "29.78 km/s mean (29.29 to 30.29 km/s)", "sources": [EARTH],
    "notes": "Earth sheet: 'Mean orbital velocity (km/s) 29.78'; 'Max. orbital velocity (km/s) 30.29'; 'Min. orbital velocity (km/s) 29.29'. The range is the real change of speed around the orbit. Skeptic: min and max are on the Earth sheet itself, so the Jupiter sheet citation was removed. Key renamed from earth_mean_orbital_velocity to match the planetary topic's fact.",
    "who_when": "NASA NSSDCA, 2024-11-15"})

facts.append({"key": "sun_galactic_circular_speed", "category": "space", "label": "The Sun's speed around the centre of the Milky Way", "status": "verified",
    "value_si": 247000, "unit_si": "m/s", "low_si": 243000, "high_si": 251000,
    "display": "247 ± 4 km/s (full circular velocity of the Sun, Θ0 + V☉)", "sources": [REID],
    "notes": "Abstract (fetched): 'Our data strongly constrain the full circular velocity of the Sun, To + Vsun = 247 +/- 4 km/s, and its angular velocity, (To + Vsun)/Ro = 30.32 +/- 0.27 km/s/kpc.' Also Ro = 8.15 +/- 0.15 kpc, To = 236 +/- 7 km/s. Skeptic: adding the Sun's small radial and vertical motions (about 10.6 and 7.6 km/s, not from this source) changes the speed by 0.14%, so they are ignored.",
    "who_when": "Reid et al. 2019 (published ApJ)"})

# ---------------------------------------------------------------- energy references
v = 0.5 * M_EARTH * 29780 ** 2; lo = 0.5 * M_EARTH * 29290 ** 2; hi = 0.5 * M_EARTH * 30290 ** 2
facts.append({"key": "energy_earth_orbital_kinetic", "category": "energy_reference", "label": "Kinetic energy of Earth's motion around the Sun", "status": "derived",
    "value_si": r4(v), "unit_si": "J", "low_si": r4(lo), "high_si": r4(hi),
    "display": "about 2.6 × 10^33 J (½ × 5.9722 × 10^24 kg × (29.78 km/s)^2)",
    "sources": [{"title": "NASA NSSDCA Earth Fact Sheet (mass 5.9722e24 kg; mean orbital velocity 29.78 km/s, min 29.29, max 30.29)", "url": EARTH["url"]}],
    "notes": "KE = ½ m v² with earth_mass (5.9722e24 kg, existing fact) and earth_mean_orbital_speed (29.78 km/s): %.4e J. The range is the slowest and fastest points of the orbit (29.29 and 30.29 km/s), a real variation of ±3%%. Newtonian; speed measured relative to the Sun. Sits just below this topic's band; it splits the 48x step from Earth's binding energy (2.49e32 J) to the Sun's year (1.21e34 J) into 10.6x and 4.6x (Skeptic: recommended). Key renamed from energy_earth_orbit_kinetic to match the planetary topic's fact (2.65e33 J there)." % v,
    "who_when": "Derived 2026-10-13 from NASA NSSDCA", "page_short": "the energy of Earth’s motion around the Sun"})

facts.append(sun_years("energy_sun_output_year", 1, "1 year", "the Sun’s output for a year", "The Sun's total output for one year",
    "Today's output, treated as constant. Uncertainty well under 1%. Skeptic recomputed 1.20800e34 J (1.20720e34 J with a 365-day year). The planetary topic has the same key with a sidereal year (1.20804e34 J), 0.004% apart: keep one."))

v = 0.5 * M_JUP * 13060 ** 2; lo = 0.5 * M_JUP * 12440 ** 2; hi = 0.5 * M_JUP * 13720 ** 2
facts.append({"key": "energy_jupiter_orbital_kinetic", "category": "energy_reference", "label": "Kinetic energy of Jupiter's motion around the Sun", "status": "derived",
    "value_si": r4(v), "unit_si": "J", "low_si": r4(lo), "high_si": r4(hi),
    "display": "about 1.6 × 10^35 J (½ × 1.898 × 10^27 kg × (13.06 km/s)^2)",
    "sources": [{"title": "NASA NSSDCA Jupiter Fact Sheet (mass 1,898.13e24 kg; mean orbital velocity 13.06 km/s, min 12.44, max 13.72)", "url": JUP["url"]}],
    "notes": "KE = ½ m v² with jupiter_mass (1.89813e27 kg) and jupiter_mean_orbital_speed (13.06 km/s) = %.4e J. Range at the orbit's slowest and fastest speeds (12.44 and 13.72 km/s): %.3e to %.3e J. Newtonian; speed relative to the Sun. Skeptic: the energy varies about ±10%% around the orbit; the mean is known to better than 1%%, so a plain 'about' multiple is right. Key renamed from energy_jupiter_orbit_kinetic to match the planetary topic's fact (1.62e35 J there)." % (v, lo, hi),
    "who_when": "Derived 2026-10-13 from NASA NSSDCA", "page_short": "the energy of Jupiter’s motion around the Sun"})

facts.append(sun_years("energy_sun_output_century", 100, "100 years", "the Sun’s output for a century", "The Sun's total output for a century",
    "Assumes today's output held constant (fine over a century). Skeptic recomputed: correct."))
facts.append(sun_years("energy_sun_output_millennium", 1000, "1,000 years", "the Sun’s output for 1,000 years", "The Sun's total output for 1,000 years",
    "Assumes today's output held constant. Nothing better known and well sourced was found near 1e37 J. Skeptic recomputed: correct."))

facts.append({"key": "energy_classical_nova", "category": "energy_reference",
    "label": "A classical nova (a thermonuclear explosion on the surface of a white dwarf, a dead star)", "status": "verified",
    "value_si": 1e38, "unit_si": "J", "high_si": 1.208e39,
    "display": "about 10^38 J (~10^45 erg, Hernanz & José 2000); models give 'a few times 10^45 erg' of nuclear energy (Hillman & Gerbi 2022); NASA outreach: 'up to 100,000 times the annual energy output of our sun' (about 1.2 × 10^39 J)",
    "sources": [
        {"title": "Hernanz & José (2000) Thermonuclear runaways on accreting white dwarfs: models of classical novae explosions, AIP Conf. Proc. (DOI 10.1063/1.1291734); arXiv PDF", "url": "https://arxiv.org/pdf/astro-ph/0001189"},
        {"title": "Hillman & Gerbi (2022) The effect of enriched accreted matter on the development of novae, MNRAS (DOI 10.1093/mnras/stac432); arXiv PDF", "url": "https://arxiv.org/pdf/2202.06894"},
        {"title": "NASA Scientific Visualization Studio 11608, 'Fermi Reveals Novae as a New Class of Gamma-Ray Sources' (31 Jul 2014; outreach text, used only for the upper bound)", "url": "https://svs.gsfc.nasa.gov/11608/"}],
    "notes": "Hernanz & José: 'classical novae release large amounts of energy (∼ 10^45 erg)'; Table 1 ejecta kinetic energies 1.1-1.5e45 erg. Hillman & Gerbi: nuclear energy 'a few times 10^45 erg for the models used here, which is in agreement with many estimates' (2-3e38 J); the light-to-motion ratio Erad/Ekin varies '3-4 orders' of magnitude between their models. High end: NASA outreach 'up to' = 1e5 × 1.208e34 J; weaker than the journals. Value 1e38 J is the most-quoted order (1 erg = 1e-7 J). Skeptic: low_si removed (it equalled the value and no lower bound is sourced); author list corrected to Hillman & Gerbi; high end labelled as outreach. Uncertain by about 10x: rough multiple only.",
    "who_when": "Hernanz & José 2000; Hillman & Gerbi 2022; NASA 2014",
    "page_short": "a nova (an explosion on a dead star)"})

# magnetar: Palmer 2e46 d15^2 erg; Hurley (3.7±0.9)e46 d15^2 erg
lo = 2e46 * (7.2 / 15) ** 2 * 1e-7
hi = 4.6e46 * (18.6 / 15) ** 2 * 1e-7
facts.append({"key": "energy_magnetar_flare_2004", "category": "energy_reference",
    "label": "Giant flare of the magnetar SGR 1806-20, 27 Dec 2004 (a magnetar is a dead star with an extreme magnetic field): energy of its first fraction of a second",
    "status": "disputed", "value_si": 2e39, "unit_si": "J", "low_si": r4(lo), "high_si": r4(hi),
    "display": "about 2 × 10^39 J in a fraction of a second; 0.5-7 × 10^39 J depending on the distance, which is still disputed (8.7 kpc, Bibby 2008; 9.4-18.6 kpc, Svirski 2011)",
    "sources": [
        {"title": "Palmer et al. (2005) Gamma-ray observations of a giant flare from the magnetar SGR 1806-20, Nature 434, 1107 (DOI 10.1038/nature03525); arXiv abstract", "url": "https://arxiv.org/abs/astro-ph/0503030"},
        {"title": "Palmer et al. (2005), arXiv PDF ('2 × 10^46 d15^2 erg in the spike')", "url": "https://arxiv.org/pdf/astro-ph/0503030"},
        {"title": "Hurley et al. (2005) An exceptionally bright flare from SGR 1806-20..., Nature 434, 1098 (DOI 10.1038/nature03519); arXiv PDF", "url": "https://arxiv.org/pdf/astro-ph/0502329"},
        {"title": "Bibby et al. (2008) A downward revision to the distance of the 1806-20 cluster and associated magnetar, MNRAS 386, L23 (DOI 10.1111/j.1745-3933.2008.00453.x); arXiv abstract", "url": "https://arxiv.org/abs/0802.0815"},
        {"title": "Svirski, Nakar & Ofek (2011) SGR 1806-20 distance and dust properties in molecular clouds by analysis of a flare x-ray echoes, MNRAS 415, 2485 (DOI 10.1111/j.1365-2966.2011.18872.x); arXiv abstract", "url": "https://arxiv.org/abs/1103.0006"}],
    "notes": "Palmer (PDF): '2 × 10^46 d15^2 erg in the spike' (d15 = distance/15 kpc; main spike ~0.5 s). Hurley: 'Espike=(3.7±0.9)×10^46 d15^2 erg, assuming isotropic emission' (first 0.2 s). Distance: Bibby '8.7^+1.8_-1.5 kpc'; Svirski 'a lower limit of 9.4 kpc and an upper limit of 18.6 kpc (90% confidence)'. Range: Palmer at 7.2 kpc (4.6e38 J) to Hurley's upper value at 18.6 kpc (7.1e39 J). Value 2e39 J: the geometric middle; both papers at about 12 kpc give 1.3-2.4e39 J. 'Isotropic' = assuming it shone equally in all directions. Skeptic: value raised from 1e39 J (which rested on Bibby's distance alone), high_si raised from 4.6e39 J, Svirski 2011 and the Palmer PDF added, '0.2 s' replaced by 'a fraction of a second'. Uncertain about 15x: rough multiple only.",
    "who_when": "Palmer et al. 2005; Hurley et al. 2005; distance Bibby et al. 2008, Svirski et al. 2011",
    "page_short": "the 2004 magnetar flare (a dead star’s outburst)"})

def mc2(key, label, m, mname, mfact, src, page_short, extra):
    v = m * C2
    return {"key": key, "category": "energy_reference", "label": label, "status": "derived",
            "value_si": r4(v), "unit_si": "J",
            "display": "about %s J (%s kg × c²)" % (('%.1e' % v).replace('e+', ' × 10^'), mname),
            "sources": [src, NIST_C],
            "notes": "E = m c² = %s kg × 8.987552e16 m²/s² = %.4e J, from the existing verified facts %s and growth_c_exact. A thought-experiment yardstick, not a real event: no known process turns ordinary matter wholly into energy. The page should say 'turned wholly into energy'. Uncertainty negligible. %s" % (mname.replace(' × 10^', 'e'), v, mfact, extra),
            "who_when": "Derived 2026-10-13 (NASA NSSDCA; CODATA 2022)", "page_short": page_short}

facts.append(mc2("energy_moon_mass_energy", "The Moon's whole mass turned into energy (E = mc²)", M_MOON, "7.346 × 10^22", "moon_mass", MOON,
    "the Moon turned wholly into energy", "Skeptic recomputed: correct; page phrase reworded from 'the Moon's whole mass as energy', which reads badly after 'about 3x'."))

facts.append(sun_years("energy_sun_output_million_years", 1e6, "10^6 years", "the Sun’s output for a million years", "The Sun's total output for a million years (at today's output)",
    "Holds today's output constant. Alternate, not in the recommended ladder: the Moon's mass-energy (6.6e39 J) and the Sun's galactic motion (6.1e40 J) cover this decade. Skeptic recomputed: correct."))

v = 0.5 * M_SUN * 247e3 ** 2; lo = 0.5 * M_SUN * 243e3 ** 2; hi = 0.5 * M_SUN * 251e3 ** 2
facts.append({"key": "energy_sun_galactic_orbit_kinetic", "category": "energy_reference", "label": "Kinetic energy of the Sun's motion around the centre of the Milky Way", "status": "derived",
    "value_si": r4(v), "unit_si": "J", "low_si": r4(lo), "high_si": r4(hi),
    "display": "about 6 × 10^40 J (½ × 1.9884 × 10^30 kg × (247 km/s)^2)",
    "sources": [{"title": "Reid et al. (2019) ApJ 885, 131; arXiv abstract (To + Vsun = 247 ± 4 km/s)", "url": REID["url"]}, SUN],
    "notes": "KE = ½ m v² with sun_mass (1.9884e30 kg) and sun_galactic_circular_speed (247 ± 4 km/s): %.4e J (%.3e to %.3e J). This is the Sun's motion energy measured from the Galaxy's centre; the number depends on that choice of frame, so the page phrase names it. Newtonian (v/c ≈ 0.08%%). Uncertainty about 3%%. Skeptic recomputed: correct." % (v, lo, hi),
    "who_when": "Derived 2026-10-13 (Reid et al. 2019; NASA)", "page_short": "the energy of the Sun’s motion around the Milky Way’s centre"})

facts.append(mc2("energy_earth_mass_energy", "Earth's whole mass turned into energy (E = mc²)", M_EARTH, "5.9722 × 10^24", "earth_mass", {"title": "NASA NSSDCA Earth Fact Sheet (mass 5.9722e24 kg; existing fact earth_mass)", "url": EARTH["url"]},
    "Earth turned wholly into energy", "About 2 billion times Earth's gravitational binding energy (the 'blow Earth apart' rung). Skeptic recomputed: correct; page phrase reworded."))

facts.append({"key": "energy_supernova_light", "category": "energy_reference",
    "label": "All the light a supernova gives off (typical core-collapse supernova, the explosion of a massive star; Type Ia supernovae give a few times more)",
    "status": "verified", "value_si": 1e42, "unit_si": "J", "low_si": 1e42, "high_si": 1e43,
    "display": "about 10^42 J (~10^49 erg) for a core-collapse supernova; (1-10) × 10^49 erg across such events; Type Ia about 6 × 10^49 erg",
    "sources": [NAD05, NAD08],
    "notes": "Nadyozhin & Imshennik 2005, core collapse: 'The total energy of the electromagnetic emission is of ≈ 10^49 erg.' Type Ia: 'electromagnetic emission is of ≈ 6×10^49 erg'. Nadyozhin 2008: core-collapse radiation 'is as small as that for SN Ia, Erad = (1−10) x 10^49 erg, being strongly sensitive to the radius of the progenitor and the mass of its hydrogen envelope'. 1 erg = 1e-7 J. Value 1e42 J is the typical core-collapse figure; the range spans 10x across events (it rests on the 2008 lecture, used alongside the 2005 paper). Skeptic: label softened from 'a Type Ia gives about 6 times more' to 'a few times more'; the unsourced remark on superluminous supernovae was removed. Rough multiple only.",
    "who_when": "Nadyozhin & Imshennik 2005; Nadyozhin 2008", "page_short": "all the light of a supernova"})

facts.append(sun_years("energy_sun_output_billion_years", 1e9, "10^9 years", "the Sun’s output for a billion years at today’s rate", "The Sun's total output for a billion years (at today's output)",
    "Holds today's output constant over a billion years. The Sun's real output drifts slowly over such times (not quantified here), so the label and page phrase say 'at today's output' / 'at today's rate'. The arithmetic is exact. Skeptic recomputed: correct; caveat required."))

facts.append({"key": "energy_supernova_blast", "category": "energy_reference",
    "label": "A supernova's blast: the kinetic energy of its flying debris (typical; core-collapse and Type Ia alike)", "status": "verified",
    "value_si": 1e44, "unit_si": "J", "low_si": 5e43, "high_si": 2e44,
    "display": "about 10^44 J (~10^51 erg, 'one Bethe'); core collapse typically (0.5-2) × 10^51 erg",
    "sources": [BURROWS, NAD05, JANKA],
    "notes": "Burrows & Vartanyan: 'supernova explosion energies are “typically” one Bethe'; abstract: 'A 10^51-erg (one “Bethe”) explosion'. Nadyozhin & Imshennik: core collapse 'typically of (0.5 − 2)×10^51 erg'; Type Ia 'Eexp ≈ 10^51 erg ... almost all Eexp turns out to be converted into the kinetic energy'. Janka: kinetic energies 'ranging from ≳10^50 erg to some 10^51 erg for SNe and up to several 10^52 erg for HNe'. The low and high values are the typical range (0.5-2e51 erg); ordinary single events range from about 10^50 to a few 10^51 erg (Janka 2012). Skeptic: that sentence replaces 'single events span about 10x either side'. Typical value known to about 2x: at the edge of the rough-wording rule.",
    "who_when": "Burrows & Vartanyan 2021; Nadyozhin & Imshennik 2005; Janka 2012", "page_short": "a supernova’s blast (its flying debris)"})

facts.append(mc2("energy_jupiter_mass_energy", "Jupiter's whole mass turned into energy (E = mc²)", M_JUP, "1.89813 × 10^27", "jupiter_mass", {"title": "NASA NSSDCA Jupiter Fact Sheet (mass 1,898.13e24 kg)", "url": JUP["url"]},
    "Jupiter turned wholly into energy", "Only 1.7x above the supernova blast, but it narrows the 30x step from the blast to SN 1998bw (a disputed rung) to 18x and gives firm comparisons from 1.7e44 to 1.7e45 J. Skeptic recomputed: correct."))

facts.append({"key": "energy_hypernova_sn1998bw", "category": "energy_reference",
    "label": "SN 1998bw, an unusually energetic supernova linked to a gamma-ray burst; one model gives 3 × 10^52 erg (a 'hypernova'), an aspherical model about 15 times less",
    "status": "disputed", "value_si": 3e45, "unit_si": "J", "low_si": 2e44, "high_si": 5e45,
    "display": "about 3 × 10^45 J in one spherical model (3 × 10^52 erg; 2-5 × 10^52 erg); an aspherical model gives 2 × 10^51 erg (2 × 10^44 J)",
    "sources": [
        {"title": "Iwamoto et al. (1998) A 'hypernova' model for SN 1998bw associated with gamma-ray burst of 25 April 1998, Nature 395, 672 (DOI 10.1038/27155); arXiv abstract", "url": "https://arxiv.org/abs/astro-ph/9806382"},
        {"title": "Iwamoto et al. (1998), arXiv PDF", "url": "https://arxiv.org/pdf/astro-ph/9806382"},
        {"title": "Höflich, Wheeler & Wang (1999) Aspherical explosion models for SN 1998bw/GRB 980425, ApJ (DOI 10.1086/307521); arXiv abstract", "url": "https://arxiv.org/abs/astro-ph/9808086"},
        {"title": "Höflich, Wheeler & Wang (1998) SN 1998bw/GRB 980425: hypernova or aspherical explosion?, arXiv abstract", "url": "https://arxiv.org/abs/astro-ph/9807345"},
        {"title": "Janka (2012) Annu. Rev. Nucl. Part. Sci.; arXiv PDF ('up to several 10^52 erg for HNe')", "url": "https://arxiv.org/pdf/1206.2503"}],
    "notes": "Iwamoto abstract: 'The kinetic energy is as large as ∼2−5 × 10^52 ergs, more than ten times the previously known energy of supernovae'; best model CO138 'Eexp = 3 × 10^52 ergs'. Höflich, Wheeler & Wang fit the same supernova with an aspherical explosion: 'an explosion energy of 2foe and a total ejecta mass of 2 M_o' (2e51 erg = 2e44 J, 'consistent with core collapse supernovae (although at the 'bright' end)'). Value 3e45 J is Iwamoto's spherical model; range 2e44 J (Höflich) to 5e45 J (Iwamoto's upper value). Skeptic: status verified -> disputed, low_si lowered from 2e45 J, label no longer states 'more than ten times stronger than usual' as fact. Uncertain about 15x: rough multiple only. Kept as a rung only because nothing firmer was found near 1e45 J.",
    "who_when": "Iwamoto et al. 1998 (Nature); Höflich, Wheeler & Wang 1999 (ApJ)",
    "page_short": "SN 1998bw, an unusually energetic supernova"})

facts.append({"key": "energy_supernova_total_neutrinos", "category": "energy_reference",
    "label": "Everything a core-collapse supernova (the explosion of a massive star) releases, about 99% of it as neutrinos (ghostly particles that pass through almost everything)",
    "status": "verified", "value_si": 3e46, "unit_si": "J", "low_si": 3e46, "high_si": 5e46,
    "display": "about 3 × 10^46 J (~3 × 10^53 erg in neutrinos; (3-5) × 10^53 erg depending on core mass)",
    "sources": [BURROWS, NAD05, NAD08],
    "notes": "Burrows & Vartanyan: 'a hot and lepton-rich PNS radiates ∼3×10^53 ergs in neutrinos as it transitions into a tightly bound, cold neutron star'. Nadyozhin & Imshennik: '(3 − 5)×10^53 erg = (10 − 15)% MFe c² radiated in form of neutrinos and antineutrinos'. Nadyozhin 2008: 'Eν = (3 − 5)×10^53 erg depending on the core mass'. The blast (about 10^51 erg) and the light (about 10^49 erg) add under 1%. Uncertain under 2x: plain multiple. Skeptic: values confirmed; page phrase reworded from 'a supernova, neutrinos included', which was unclear.",
    "who_when": "Burrows & Vartanyan 2021; Nadyozhin & Imshennik 2005", "page_short": "a supernova’s total energy (nearly all in neutrinos)"})

f = mc2("energy_sun_mass_energy", "The Sun's whole mass turned into energy (E = mc²)", M_SUN, "1.9884 × 10^30", "sun_mass",
    {"title": "NASA NSSDCA Sun Fact Sheet (mass 1,988,400e24 kg; 'Mass conversion rate (10^6 kg/s) 4260.')", "url": SUN["url"]},
    "the Sun turned wholly into energy",
    "The real Sun turns only a tiny share of its mass into energy: at the Sun sheet's 'Mass conversion rate (10^6 kg/s) 4260.', even 10 billion years would use about 1.3e27 kg, about 0.07% of its mass (Skeptic: source added for this remark).")
facts.append(f)

facts.append({"key": "energy_gw150914", "category": "energy_reference",
    "label": "GW150914: the energy two colliding black holes gave off as gravitational waves (ripples in space), the first such collision detected (14 Sep 2015)",
    "status": "verified", "value_si": r4(3.0 * MSUNC2), "unit_si": "J", "low_si": r4(2.5 * MSUNC2), "high_si": r4(3.5 * MSUNC2),
    "display": "3.0 ± 0.5 solar masses × c² ≈ 5.4 × 10^47 J, released in a fraction of a second",
    "sources": [
        {"title": "Abbott et al. (LIGO/Virgo, 2016) Observation of gravitational waves from a binary black hole merger, Phys. Rev. Lett. 116, 061102 (DOI 10.1103/PhysRevLett.116.061102); arXiv abstract", "url": "https://arxiv.org/abs/1602.03837"},
        {"title": "Same paper, published PRL version (arXiv PDF v1)", "url": "https://arxiv.org/pdf/1602.03837v1"}],
    "notes": "Abstract: 'the initial black hole masses are 36^+5_-4 M⊙ and 29^+4_-4 M⊙, and the final black hole mass is 62^+4_-4 M⊙, with 3.0^+0.5_-0.5 M⊙c² radiated in gravitational waves. All uncertainties define 90% credible intervals.' Text: 'Over 0.2 s, the signal increases in frequency'. Converted with sun_mass (1.9884e30 kg) and c: 1 M⊙c² = 1.7871e47 J. Uncertainty about 17%: plain multiple. Skeptic: confirmed. Top rung of the recommended ladder.",
    "who_when": "LIGO/Virgo, PRL Feb 2016", "page_short": "the first black-hole collision detected (2015)"})

facts.append({"key": "energy_gw190521", "category": "energy_reference",
    "label": "GW190521: the energy a pair of heavy black holes gave off as gravitational waves when they collided (21 May 2019)",
    "status": "verified", "value_si": r4(7.6 * MSUNC2), "unit_si": "J", "low_si": r4(5.0 * MSUNC2), "high_si": r4(10.6 * MSUNC2),
    "display": "7.6 (+2.2 / −1.9) solar masses × c² ≈ 1.4 × 10^48 J; 5.0-10.6 solar masses × c² across three waveform models",
    "sources": [
        {"title": "Abbott et al. (LIGO/Virgo, 2020) Properties and astrophysical implications of the 150 M☉ binary black hole merger GW190521, ApJL 900, L13 (DOI 10.3847/2041-8213/aba493); arXiv PDF (draft of 3 Sep 2020)", "url": "https://arxiv.org/pdf/2009.01190"},
        {"title": "Abbott et al. (2020) GW190521: a binary black hole merger with a total mass of 150 M☉, PRL 125, 101102 (DOI 10.1103/PhysRevLett.125.101102); arXiv abstract", "url": "https://arxiv.org/abs/2009.01075"},
        {"title": "Same PRL paper, arXiv PDF (typeset as PRL 125, 101102; Table I)", "url": "https://arxiv.org/pdf/2009.01075"}],
    "notes": "ApJL Table 1, 'Radiated energy Erad (M⊙c²)': 7.6^+2.2_-1.9 (NRSur PHM), 7.2^+2.7_-2.2 (Phenom PHM), 7.8^+2.8_-2.3 (SEOBNR PHM); 90% intervals. PRL Table I (PDF): total mass 150^+29_-17 M⊙, final mass 142^+28_-16 M⊙. 1 M⊙c² = 1.7871e47 J. Value from NRSur PHM; range spans all three models, 5.0-10.6 M⊙c². Skeptic: range widened from the one-model 1.02e48-1.75e48 J, PRL PDF added for Table I, unsourced remark that later events are heavier removed. Not a recommended rung (Skeptic: catalogue-code name, only 2.5x above GW150914); kept as an alternate fact.",
    "who_when": "LIGO/Virgo, ApJL and PRL Sep 2020", "page_short": "the 2019 black-hole collision GW190521"})

# ---------------------------------------------------------------- rungs
RUNG_KEYS = ["energy_earth_orbital_kinetic", "energy_sun_output_year", "energy_jupiter_orbital_kinetic", "energy_sun_output_century",
             "energy_sun_output_millennium", "energy_classical_nova", "energy_magnetar_flare_2004", "energy_moon_mass_energy",
             "energy_sun_galactic_orbit_kinetic", "energy_earth_mass_energy", "energy_supernova_light", "energy_sun_output_billion_years",
             "energy_supernova_blast", "energy_jupiter_mass_energy", "energy_hypernova_sn1998bw", "energy_supernova_total_neutrinos",
             "energy_sun_mass_energy", "energy_gw150914"]
by = {f["key"]: f for f in facts}
rungs = []
for k in RUNG_KEYS:
    f = by[k]; v = f["value_si"]
    rough = (f.get("high_si", v) / v > 2) or (v / f.get("low_si", v) > 2)   # nova: no low_si, 12x high
    rungs.append({"key": k, "J": v, "page_short": f["page_short"], "rough": bool(rough)})

gaps = None  # filled from the text file
d = {"facts": facts, "rungs": rungs, "gaps": open(sys.argv[2], encoding='utf-8').read().strip()}
import re
for f in facts:
    f["notes"] = re.sub(r'e\+(\d)', r'e\1', f["notes"])
    assert len(f["notes"]) <= 950, (f["key"], len(f["notes"]))
json.dump(d, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)

# report
prev = 2.49e32
print("from Earth binding 2.49e32")
for r in rungs:
    print("%-36s %10.4g  step %5.1fx  rough=%s  %s" % (r["key"], r["J"], r["J"] / prev, r["rough"], r["page_short"]))
    prev = r["J"]
for f in facts:
    print(f["key"], len(f["notes"]))
