"""Compile the verified 'comic' research facts into scratchpad/compiled/comic.json.

Inputs: wfout/research_comic.json (researcher) and wfout/verify_comic.json (verifier).
Each fact below is rewritten from the researcher's fact with every verifier correction applied.
"""
import json
import math
import os

SP = '/tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad'
R = json.load(open(os.path.join(SP, 'wfout/research_comic.json'), encoding='utf-8'))
RF = {f['key']: f for f in R['facts']}
g = 9.80665

# ---------------------------------------------------------------- sources (URLs as fetched)
BOWER23 = {"title": "A. F. Bower, Applied Mechanics of Solids, §2.3.1 Linear momentum balance in terms of Cauchy stress (online text)", "url": "https://www.solidmechanics.org/text/Chapter2_3/Chapter2_3.htm"}
BOWER_EQ = {"title": "Equation image for §2.3.1 (eq0006), from the page above", "url": "https://www.solidmechanics.org/text/Chapter2_3/Chapter2_3_files/eq0006M.gif"}
BOWER22 = {"title": "A. F. Bower, Applied Mechanics of Solids, §2.2.1 Surface traction and internal body force", "url": "https://www.solidmechanics.org/text/Chapter2_2/Chapter2_2.htm"}
MICROG = {"title": "NASA EG-1997-08-110-HQ, Microgravity: A Teacher's Guide with Activities in Science, Mathematics, and Technology (Rogers, Vogt & Wargo 1997), PDF pp. 14 and 17", "url": "https://ntrs.nasa.gov/api/citations/19980007787/downloads/19980007787.pdf"}
BENEDETTO = {"title": "Benedetto (2026), Tidal forces and centrifugal gradients: a pedagogical clarification on the role of free fall and curvature, Revista Brasileira de Ensino de Física 48, doi:10.1590/1806-9126-RBEF-2026-0148", "url": "https://scielo.br/j/rbef/a/ynX4q9MB3HrTrVByNLW38HD/?lang=en"}
IAU_GM = {"title": "IAU 2015 Resolution B3, nominal GM of Earth (existing key earth_gm)", "url": "https://arxiv.org/abs/1510.07674"}
NASA_EARTH = {"title": "NASA NSSDCA Earth Fact Sheet, mean radius 6,371 km and mass (existing keys collide_earth_inertia_rotation, earth_mass)", "url": "https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html"}
KBB = {"title": "Kelley Blue Book, 2026 Toyota Corolla specs, LE curb weight 2,955 lb (existing key toyota_corolla_curb_mass)", "url": "https://www.kbb.com/toyota/corolla/2026/specs"}
EIBAND = {"title": "Eiband (1959), Human Tolerance to Rapidly Applied Accelerations: A Summary of the Literature, NASA Memorandum 5-19-59E (NTRS 19980228043)", "url": "https://ntrs.nasa.gov/api/citations/19980228043/downloads/19980228043.pdf"}
ASTM = {"title": "ASTM F2291-06a Standard Practice for Design of Amusement Rides and Devices, as incorporated by reference (Indiana 685 IAC 1-2-9) and posted by Public.Resource.Org", "url": "https://ia800607.us.archive.org/34/items/gov.law.astm.f2291.2006/astm.f2291.2006.pdf"}
STD3001 = {"title": "NASA-STD-3001 Volume 2 Revision F (approved 2026-07-14), §6.5.1 [V2 6064], Tables 6.5-1 to 6.5-3", "url": "https://standards.nasa.gov/system/files/tmp/NASA-STD-3001%20Vol%202%20Rev%20F.pdf"}
OCHMO = {"title": "NASA OCHMO Technical Brief OCHMO-TB-024 Occupant Protection (sustained >0.5 s; transient ≤0.5 s)", "url": "https://www.nasa.gov/sites/default/files/atoms/files/acceleration_technical_brief_ochmo.pdf"}
TM2020 = {"title": "Pattarini et al. (2020), Artemis Sustained Translational Acceleration Limits: Human Tolerance Evidence from Apollo to International Space Station, NASA/TM-20205008196, pp. 1–2", "url": "https://www.nasa.gov/wp-content/uploads/2023/03/tm-20205008196.pdf"}
SP3006_URL = "https://ntrs.nasa.gov/api/citations/19730006364/downloads/19730006364.pdf"
SP3006_FRASER = {"title": "Parker & West (eds.), Bioastronautics Data Book, 2nd ed., NASA SP-3006 (1973), ch. 4 Sustained Linear Acceleration, pp. 150–152 (PDF pp. 160–162)", "url": SP3006_URL}
SP3006_T44 = {"title": "Bioastronautics Data Book, NASA SP-3006 (1973), Table 4-4 'Range of Visual Thresholds in Relation to Unconsciousness' (after Cochran et al., 1954), p. 157 (PDF p. 167)", "url": SP3006_URL}
SP3006_IMPACT = {"title": "Bioastronautics Data Book, NASA SP-3006 (1973), ch. 6 Impact, p. 229 (PDF p. 239)", "url": SP3006_URL}
WHINNERY = {"title": "Whinnery & Forster (2013), The +Gz-induced loss of consciousness curve, Extreme Physiology & Medicine 2:19, doi:10.1186/2046-7648-2-19 (full text via Europe PMC)", "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC3710154/fullTextXML"}
RI8485_URL = "https://www.resolutionmineeis.us/sites/default/files/references/siskind-et-al-1980.pdf"
CFR816 = {"title": "30 CFR 816.67(b)(1) Use of explosives: control of adverse effects, Airblast limits (govinfo, CFR 2024 edition)", "url": "https://www.govinfo.gov/content/pkg/CFR-2024-title30-vol3/xml/CFR-2024-title30-vol3-sec816-67.xml"}
NASA_BOOM = {"title": "NASA Dryden Fact Sheet FS-2003-11-016, Sonic Booms", "url": "https://www.nasa.gov/wp-content/uploads/2021/09/120274main_fs-016-dfrc.pdf"}
OSHA = {"title": "OSHA 29 CFR 1910.95(b), Occupational noise exposure", "url": "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.95"}
OPENSTAX = {"title": "OpenStax University Physics Volume 1, §9.2 Impulse and Collisions", "url": "https://openstax.org/books/university-physics-volume-1/pages/9-2-impulse-and-collisions"}
CDC = {"title": "CDC NCHS FastStats, Body Measurements: US adult man 90.3 kg (existing key human_us_adult_male_mass)", "url": "https://www.cdc.gov/nchs/fastats/body-measurements.htm"}
CD_TUMBLE = {"title": "Carter et al., cube drag data (existing key cd_bluff_body_tumbling_subsonic, an estimate)", "url": "https://ntrs.nasa.gov/api/citations/20110016614/downloads/20110016614.pdf"}
ISA = {"title": "Wikipedia: International Standard Atmosphere, 1.225 kg/m³ (existing key atm_isa_sea_level_density)", "url": "https://en.wikipedia.org/wiki/International_Standard_Atmosphere"}
NILSSON = {"title": "Nilsson & Thorstensson (1989), Ground reaction forces at different speeds of human walking and running (existing key walking_running_peak_vertical_force)", "url": "https://pubmed.ncbi.nlm.nih.gov/2782094/"}
EUROPEPMC = [
    {"title": "Blue et al. (2012), Commercial spaceflight participant G-force tolerance during centrifuge-simulated suborbital flight, Aviat Space Environ Med 83:929, doi:10.3357/asem.3351.2012 (abstract, Europe PMC)", "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:23066613%20AND%20SRC:MED&format=json&resultType=core"},
    {"title": "Blue et al. (2014), Tolerance of centrifuge-simulated suborbital spaceflight by medical condition, Aviat Space Environ Med 85:721, doi:10.3357/asem.3956.2014 (abstract, Europe PMC)", "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:25022160%20AND%20SRC:MED&format=json&resultType=core"},
    {"title": "Suresh et al. (2017), Dysrhythmias in laypersons during centrifuge-simulated suborbital spaceflight, Aerosp Med Hum Perform 88:1008, doi:10.3357/amhp.4910.2017 (abstract, Europe PMC)", "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:29046176%20AND%20SRC:MED&format=json&resultType=core"},
    {"title": "Smith et al. (2022), Physiological effects of centrifuge-simulated suborbital spaceflight, Aerosp Med Hum Perform 93:830, doi:10.3357/amhp.6153.2022 (abstract, Europe PMC)", "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:36757241%20AND%20SRC:MED&format=json&resultType=core"},
]


def ri(where):
    return {"title": "Siskind, Stachura, Stagg & Kopp (1980), Structure Response and Damage Produced by Airblast from Surface Mining, US Bureau of Mines RI 8485, " + where + "; copy hosted in the Resolution Copper EIS reference library", "url": RI8485_URL}


def vj(obj):
    return json.dumps(obj, ensure_ascii=False, separators=(',', ':'))


facts = []


def F(key, label, status, value, unit, low, high, display, sources, notes, who_when, values=None):
    f = {"key": key, "category": "presence_comic", "label": label, "status": status,
         "value_si": value, "unit_si": unit, "low_si": low, "high_si": high, "display": display,
         "sources": sources, "notes": notes, "who_when": who_when}
    if values is not None:
        f["values_json"] = vj(values) if not isinstance(values, str) else values
    facts.append(f)


# ================================================================ (1) gentle hold
F("comic_cauchy_equation_of_motion",
  "Cauchy's equation of motion for a solid (Newton's second law for every bit of a body)",
  "verified", None, "", None, None,
  "∇·σ + ρb = ρa (σ stress, ρ density, b body force per unit mass, a acceleration)",
  [BOWER23, BOWER_EQ, BOWER22],
  "§2.3.1: 'Newton's third [sic] law of motion (F=ma) can be expressed as' ∇·σ + ρb = ρa (shown as an image, eq0006, read). §2.2.1: '(i) A force can be applied to its boundary: examples include fluid pressure, wind loading, or forces arising from contact with another solid. (ii) The solid can be subjected to body forces, which act on the interior of the solid. Examples include gravitational loading, or electromagnetic forces.' Use: a grip, the ground and air pressure are boundary forces (tractions), and they are what stress a body. Gentle hold turns his push into a body force. Verifier re-fetched both sections; the equation image matches.",
  "Bower, Applied Mechanics of Solids (CRC Press 2009; online edition)")

F("comic_uniform_body_force_no_stress",
  "A push spread through a body in proportion to its mass accelerates it with no internal stress",
  "derived", 0, "Pa", None, None,
  "If every kilogram gets the same push (b = a everywhere) and nothing touches the surface, stress = 0",
  [BOWER23, MICROG],
  "Derived from comic_cauchy_equation_of_motion. Body force per unit mass b = g + f/m, the same at every point (his push in proportion to mass), so the body accelerates uniformly at a = b. σ = 0 then satisfies ∇·σ + ρb = ρa everywhere, and the surface condition σ·n = t holds because nothing grips or supports the surface (t = 0). For a linear elastic body this is the only solution (Kirchhoff's uniqueness theorem: standard, not fetched). It also removes the stress of the body's own weight: held this way a car does not sag, as in orbit. What stays: self-balancing locked-in stresses (tyre pressure, bolt preload); loose contents not covered by the push; every surface force once it acts (air on the front, the ground at landing, a normal grip). A push exactly uniform per kilogram is canon, not real physics. Verifier: derivation sound.",
  "This research, 2026")

F("comic_free_fall_apparent_weight",
  "In free fall nothing feels its own weight: apparent weight P = m(a − g)",
  "verified", 0, "N", None, None,
  "Apparent weight P = m(a_e − g); falling freely (a_e = g), P = 0: 'you are weightless'",
  [MICROG],
  "PDF p. 14 (elevator example): 'Your apparent weight P=m(ae-g)=(60 kg)(-9.8 m/s2-(-9.8 m/s2)) = 0 kg m/s2; you are weightless.' PDF p. 17: 'the effects of gravity (apparent weight) can be removed quite easily by putting anything (a person, an object, an experiment) into a state of freefall.' The guide also quotes Einstein: 'If a person falls freely, he will not feel his own weight.' Use P = m(a − g) as a passenger's felt load: standing still 1 g, ballistic flight 0 g (plus drag), and 0 g under his spread push while it acts (canon). Verifier re-fetched; both passages match.",
  "NASA, 1997")

F("comic_tidal_effects_from_gradients",
  "Only differences in the field (tides) stretch a freely falling body",
  "verified", None, "", None, None,
  "Tidal acceleration along the line to a mass M at distance R: a_z = 2 z G M / R³ (z = offset from the centre of mass)",
  [BENEDETTO],
  "Quotes: 'tidal effects arise from spatial variations of the gravitational field rather than from the field itself'; in a uniform field 'neighboring freely falling particles experience no relative acceleration, and therefore no tidal effects are present'. Eq. 1: a_x = −xGM/R³, a_y = −yGM/R³, a_z = +2zGM/R³. This is the equivalence-principle half of the gentle-hold argument: a uniform push (or field) cannot stress a body; only its gradient can. RBEF is a peer-reviewed physics-teaching journal (received 18 Mar, accepted 7 Jun 2026). Read through WebFetch; the verifier re-fetched and confirmed the quote and signs.",
  "Benedetto, RBEF 2026")

F("comic_tidal_stress_car",
  "Tidal stretch on a 4 m car: Earth's tide versus his spread push",
  "derived", 0.0021, "N", None, None,
  "Earth's tide: about 2 mN through the middle of a 1,340 kg, 4 m car standing on end (1 part in 6 million of its weight). His push spread through it at 10 g: zero",
  [BENEDETTO, IAU_GM, NASA_EARTH, KBB],
  "Inputs: GM = 3.986004e14 m³/s² (earth_gm), R = 6.371e6 m, m = 1,340.4 kg (toyota_corolla_curb_mass), L = 4 m. Gradient 2GM/R³ = 3.08e-6 s⁻²; end to end the tidal difference is 1.2e-5 m/s² (1.3e-6 g). For a uniform rod along the vertical, mid-length tension = m L GM/(4R³) = 2.1e-3 N against a weight of 13,145 N (1 part in 6.4 million). His push, spread in proportion to mass, gives every kilogram the same acceleration, so its gradient and the stress it adds are zero at any acceleration. For contrast, 10 g through a grip puts m × 10 g = 131 kN through his hands. The 4 m is a round figure; the Corolla is 4.63 m (2.4 mN). Verifier recomputed every number.",
  "This research, 2026")

F("comic_eiband_restraint_spreads_force",
  "Spreading the force over the whole body is what raises tolerance (Eiband 1959)",
  "verified", None, "", None, None,
  "'Survival of impact forces increases with increased distribution of the arresting force to the entire skeleton'; people cannot move against more than 2–3 g",
  [EIBAND],
  "Conclusions: 'complete torso and extremity support is the primary variable in increasing survival of rapidly applied accelerations. Therefore, survival of impact forces increases with increased distribution of the arresting force to the entire skeleton, for blows from all directions.' Also: 'muscular effort is inadequate for resisting anything but the mildest of impacts' and 'human beings unable to move their bodies against forces exceeding 2 or 3 times normal body weight (2 or 3 G's).' Use: a perfectly spread push is the limiting case of gentle hold and safe passenger. By the same logic a person held only by the hands, with no seat or harness, is worse off than the harnessed volunteers behind every tolerance number; by how much is not measured. Verifier re-fetched; quotes match.",
  "Eiband, NASA Lewis, 1959")

# ================================================================ (2) safe passenger: sources
F("comic_astm_f2291_ride_limits",
  "Amusement-ride acceleration limits for the general public (ASTM F2291-06a)",
  "verified", 58.84, "m/s^2", 10.79, 58.84,
  "Head-to-foot (+Gz) or pressed into the seat back (+Gx): 6 g for 0.2–1 s, 4 g for 2–4 s, 3 g for 5–11.8 s, then 2 g (+Gz) or 2.5 g (+Gx). Sideways 3 g → 2 g. Eyes-front (−Gx) 2 g at 0.2 s → 1.5 g. Eyes-up (−Gz) 2 g at 0.2 s → 1.5 g → 1.1 g from 7 s",
  [ASTM],
  "§3.1: impact means 'accelerations with duration of less than 200 ms'; §7.1.4.2: 'Impacts of less than 200 ms duration are not addressed by this practice.' §7.1.4.3: 'for patrons 48 in. in height and above'. §7.1.4.5: limits are 'for total net acceleration, inclusive of earth's gravity'. §7.1.4.6: over 90 s not addressed. Fig. 6 note: 'Must have headrest above 1.5 g unless onset rate is less than 5 g/sec; then 2.0 g is permissible. For no head rest case, max duration of above 1.5 g is 4 seconds.' §7.1.7.2: from 0 G to 2 G or more, onset 'less than 15 G/s'. §7.1.5.1: two axes at once are limited by an ellipse with radii 1.1 × the 200 ms limits. Values read from Figs. 6–10; the verifier rendered the figures and agrees. Assumes a designed seat and restraint. Verifier: later editions F2291-26 and 26a exist and were not checked. low_si is the lowest limit on any axis (1.1 g).",
  "ASTM International, F2291-06a (2006)",
  json.loads(RF["comic_astm_f2291_ride_limits"]["values_json"]))

F("comic_nasa_std3001_seated_limits",
  "NASA sustained acceleration limits for seated, restrained astronauts (upper bound, not for ordinary people)",
  "verified", 81.4, "m/s^2", 39.2, 186,
  RF["comic_nasa_std3001_seated_limits"]["display"],
  [STD3001, OCHMO],
  "[V2 6064]: limit crew exposure to sustained (> 0.5 s) acceleration 'by staying below the limits in Figures 6.5-(2-7) and Tables 6.5-(1-6) for seated and standing postures.' Rationale: 'All limits further assume adequate restraint(s)'; 'Unless stated otherwise, all limits also assume the crew is wearing a lower body compression garment'. Axes: '+X: Body accelerations forward/Eyes back'; '+Z: Body accelerations up/Eyes down'. Context only: trained, screened, strapped-in astronauts. The Rev D link on nasa.gov returned 404; Rev F was fetched from the standards site's 'system/files/tmp' path. Verifier re-fetched; all table values match. Verifier: Tables 6.5-4 to 6.5-6 are standing limits for crew after weightlessness (lunar lander) and must not be used for a passenger.",
  "NASA OCHMO, Rev F 2026",
  json.loads(RF["comic_nasa_std3001_seated_limits"]["values_json"]))

F("comic_nasa_standing_vs_seated_gz",
  "Relaxed head-to-foot tolerance: 2–5 g standing, 7–9 g seated",
  "verified", 19.62, "m/s^2", 19.62, 49.05,
  "Non-straining standing +Gz tolerance 19.6–49.1 m/s² (2–5 g); seated 68.7–88.3 m/s² (7–9 g)",
  [TM2020],
  "Quote: 'The range of non-straining, standing +Gz (head-to-foot) tolerance ranges from 19.62-49.05 m/s2 for healthy subjects, contrasted with 68.67-88.29 m/s2 for seated subjects of both sexes'. Also: 'Humans experience a 10% to 20% decrease in cardiac output with a shift from seated to standing posture'. Use: a passenger carried upright (standing or dangling) tolerates far less head-to-foot g than a seated rider. The seated figures sit above Cochran's relaxed unconsciousness mean (5.4 g), probably because of different end points; the TM does not define its end point. Use for direction and posture, not as an injury limit. Verifier re-fetched; quote matches.",
  "NASA JSC, 2020")

F("comic_gz_symptoms_fraser",
  "What steady g feels like, by direction (Fraser 1966 compilation)",
  "verified", None, "", None, None,
  RF["comic_gz_symptoms_fraser"]["display"],
  [SP3006_FRASER],
  "'The following compilation is derived from the study by Fraser (1966).' Quotes are in values_json. Subjects were centrifuge volunteers, mostly seated and restrained; onset rates are not given. Use for page wording ('feels twice as heavy', 'vision dims after a few seconds'), not as limits. Verifier re-fetched pp. 150–152; matches word for word. Fraser's primary report was not fetched.",
  "Fraser 1966, in NASA SP-3006, 1973",
  json.loads(RF["comic_gz_symptoms_fraser"]["values_json"]))

F("comic_relaxed_gz_thresholds_cochran",
  "Relaxed head-to-foot g at which vision and consciousness fail (means of a large group)",
  "verified", 52.96, "m/s^2", 40.21, 52.96,
  RF["comic_relaxed_gz_thresholds_cochran"]["display"],
  [SP3006_T44],
  "Table 4-4 (page image): 'Loss of peripheral vision 4.1 ±0.7 2.2 – 7.1; Blackout 4.7 ±0.8 2.7 – 7.8; Unconsciousness 5.4 ±0.9 3.0 – 8.4 (After Cochran et al., 1954)'. The table does not state onset rate, posture or exposure time; Cochran's paper was not fetched. Applies only to head-to-foot g held for several seconds (blood drains from the head). Not for brief pulses (comic_gloc_not_before_5s), chest-to-back g, or a passenger under his spread push (no felt g). value_si is unconsciousness (5.4 g); low_si is loss of peripheral vision (4.1 g). Verifier: matches; the text layer garbles the first SD, and the page image reads ±0.7.",
  "Cochran et al. 1954, in NASA SP-3006, 1973",
  json.loads(RF["comic_relaxed_gz_thresholds_cochran"]["values_json"]))

F("comic_gloc_not_before_5s",
  "Losing consciousness from g (G-LOC) took at least 5 s in 888 centrifuge episodes",
  "verified", 5, "s", None, None,
  "G-LOC did not occur earlier than 5 s; mean 9.1 s for onset ≥1 G/s; levels at G-LOC ranged +2.5 to +11.7 Gz (+4.7 Gz is the curve's defined minimum)",
  [WHINNERY],
  "Abstract: 'for onset rates ≥ 1.0 G/s, G-LOC will occur in a mean time of 9.10 s and is independent of the onset rate'; 'The minimum +Gz-level threshold tolerance was defined as +4.7 Gz'; 'G-LOC did not occur earlier than 5 s for any acceleration exposure.' +4.7 Gz is defined as 2 SD below the gradual-onset group's mean (+7.31 Gz); across all 888 episodes the +Gz level at G-LOC ranged from +2.5 to +11.7. The episodes were 'mostly in experienced military fighter pilots', with relaxed, straining and anti-G-suited runs mixed together. Use: under 5 s, loss of consciousness is unlikely (none seen in 888 episodes), but vision may still dim (Fraser: from 3–4 s); for short events, force injury is the limit. Verifier: relabelled from 'blacking out' (G-LOC is loss of consciousness, not of vision); +4.7 Gz is a curve parameter, not the lowest level seen.",
  "Whinnery & Forster 2013")

F("comic_layperson_centrifuge_tolerance",
  "Ordinary people (would-be space tourists) on a centrifuge: up to +6 Gx and +4 Gz tolerated",
  "verified", 58.84, "m/s^2", 34.32, 58.84,
  "Screened, seated, strapped-in laypeople aged 18–88 (some with controlled medical conditions): peaks +3.5 to +4.0 Gz and +6.0 Gx (combined peaks about 5 s) tolerated; grey-out common (69–88%), one G-LOC in 24",
  EUROPEPMC,
  "Blue 2012: 77 people (65 men, 12 women), '22-88 yr old'; peaks 3.5 +Gz and 6.0 +Gx. Blue 2014: 86 people aged 20–78, recruited for hypertension, cardiovascular disease, diabetes, lung disease or back or neck problems, plus controls; combined peaks '+6.0 G(x)/+4.0 G(z)'; complaints 'grayout (69%), nausea (20%), and chest discomfort (6%)'. Suresh 2017: 148 subjects, 'peak +4.0 Gz, +6.0 Gx, duration 5 s'; dysrhythmias seen, none with symptoms. Smith 2022: 24 healthy subjects aged 18–80; '88% of subjects reporting greyout and 29% reporting blackout. There was one episode of G-LOC'. Abstracts only. All were screened, briefed, seated and strapped in: a best case, not a person held in someone's arms. value_si is the +6 Gx peak; low_si is +3.5 Gz. Verifier: age range corrected to 18–88; 'healthy' dropped, since Blue 2014 recruited people with medical conditions.",
  "UTMB / NASTAR and UK centrifuge groups, 2012–2022")

F("comic_eiband_voluntary_limits",
  "Brief jolts volunteers took uninjured in a full harness (Eiband 1959)",
  "verified", 392.3, "m/s^2", 98.07, 441.3,
  "Spineward, full harness: 45 g for 0.044 s, 40 g for 0.1 s, 25 g for 0.2 s, 13 g for 0.6 s, 10 g for 1.6 s. Animals survived (injury from none to severe shock and concussion) up to 56 g for 0.037 s and 43 g for 0.11 s (chimpanzees); hog 160 g for about 0.004 s marks Eiband's upper limit of moderate injury",
  [EIBAND],
  "p. 6: 'subjects have endured maximum uniform accelerations of 45 G's for 0.044 second with no injurious or debilitating (weakening) effects'; voluntary tolerance falls to '40 G's for intervals of 0.1-second duration and to 25 G's' at 0.2 s; with chest, arm, leg and helmet straps added, '13 G's for 0.6 second and 10 G's for 1.6 seconds could be tolerated'; straps 'drawn up tighter than a person usually would wear them'. p. 7: hog 160 G for about 0.004 s set 'The upper limit of moderate injury'; chimpanzees 'endured plateau accelerations of 56 G's for 0.037 second and 43 G's for 0.110 second'; their injuries 'ranged from moderate or none to severe shock and concussion, depending upon the severity of the exposure'. Conclusions: 'Tolerable magnitude decreases as onset rate increases.' Spineward: force on the front of the body. All assume a full harness. Verifier: animal wording corrected.",
  "Eiband, NASA Lewis, 1959",
  {"units": "G and seconds; trapezoidal pulses; onset about 500 G/s unless stated",
   "spineward, voluntary uninjured (lap, shoulder, thigh straps; the longer ones also chest, arm, leg, helmet straps)": {"0.044": 45, "0.1": 40, "0.2": 25, "0.6": 13, "1.6": 10},
   "sternumward, voluntary": {"0.12": 30, "0.19": 21},
   "headward (ejection seat)": "20 G for 0.005-0.5 s assumed tolerable (from cadaver vertebra strength); 16 G for up to 0.04 s endured with lap, shoulder straps and face curtain",
   "animals, spineward (injury from none to severe shock and concussion)": {"chimpanzee": "56 G for 0.037 s; 43 G for 0.110 s", "hog": "160 G for about 0.004 s (Eiband's upper limit of moderate injury)"},
   "moderate injury, human": "25 G for 0.93 s (Stapp): debilitated, normal duty in five days"})

F("comic_impact_survived_with_injury",
  "Impacts people survived with injury in harnessed sled tests",
  "verified", 245.2, "m/s^2", 245.2, 441.3,
  "25 g for 0.93 s: debilitated, back on duty in 5 days (Eiband). Severe shock at 38 g for 0.16 s with onset over 1,300 g per second; severe delayed effects at 45 g for 0.23 s (Stapp). 83 g for 0.04 s measured at the chest (applied input lower), rearward-facing, reversible injuries (Beeding & Mosely 1960). Air Force design limit for forward-facing (−Gx) impact in a double harness: about 45 g for 0.1 s, 25 g for 0.2 s",
  [EIBAND, SP3006_IMPACT],
  "Eiband p. 7: 25 G for 0.93 s 'completes the limit of the moderate-injury area ... the subject was debilitated but conscious ... The subject returned to normal duty in five days.' SP-3006 p. 229: Stapp 'found that 38 G's for 0.16 second at onset rates higher than 1300 G/sec produced signs of severe shock ... and 45 G (for 0.23 second) at 413 G/sec produced severe delayed effects'. 'Humans have survived impact, with reversible injuries, at a level of 83 G (chest acceleration, not actual input) at 3800 G/sec for 0.04 second's duration', rearward-facing (+Gx). Air Force limits are for forward-facing (−Gx) impact in a double harness; 'With a less adequate restraint system, some debilitation and injury may occur at these levels'. value_si is the 25 g applied point; the 83 g chest reading is not applied g. Verifier: bases separated, axes named, Stapp points added.",
  "Eiband 1959; Parker & West (NASA SP-3006) 1973",
  {"units": "G, duration s",
   "applied g, harnessed humans": [[0.93, 25, "debilitated, normal duty in 5 days (Eiband)"], [0.16, 38, "onset over 1300 G/s: severe shock (Stapp)"], [0.23, 45, "onset 413 G/s: severe delayed effects (Stapp)"]],
   "chest-measured, applied input lower (plot separately)": [[0.04, 83, "rearward-facing (+Gx), 3800 G/s, reversible injuries (Beeding & Mosely 1960)"]],
   "USAF design limit, forward-facing (-Gx), double harness": [[0.1, 45], [0.2, 25]]})

F("comic_passenger_onset_rate_limits",
  "How fast g may build up: onset-rate limits for passengers",
  "verified", 147.1, "m/s^3", 49.03, 147.1,
  "Ride standard: going from weightless (0 g) to 2 g or more, onset under 15 g per second; above 1.5 g with no headrest only if onset is under 5 g per second (then up to 2 g). Sled tests: 45 g for 0.09 s at 500 g/s caused no shock, but 38 g for 0.16 s at over 1,300 g/s caused severe shock",
  [ASTM, EIBAND, SP3006_IMPACT],
  "ASTM F2291-06a §7.1.7.2: 'When transitioning from sustained weightless (0 G) and more negative levels to 2 G and more positive levels, the effective onset of positive G shall be less than 15 G/s.' Fig. 6 (+Gx) note: 'Must have headrest above 1.5 g unless onset rate is less than 5 g/sec; then 2.0 g is permissible.' Eiband 1959 conclusions: '(2) Tolerable magnitude decreases as onset rate increases.' SP-3006 p. 229: Stapp 'reported that peak acceleration of approximately 45 G (0.09 second's duration) with a rate of onset of 500 G/sec resulted in no signs of shock. Yet, he found that 38 G's for 0.16 second at onset rates higher than 1300 G/sec produced signs of severe shock'. 15 g/s = 147 m/s³; 5 g/s = 49 m/s³. The verifier notes that Rex's throw and catch strokes imply onset rates far above these; the engine does not model onset. Added from the verifier's missing list.",
  "ASTM 2006; Eiband 1959; Stapp via NASA SP-3006, 1973")

# ================================================================ (2) safe passenger: derived and recommended
F("comic_passenger_felt_g",
  "The g a passenger feels: the push from what holds them, net of gravity",
  "derived", 9.80665, "m/s^2", None, None,
  "n = |a − g| / g (vectors). Standing still: 1 g. Lifted at 1 g: 2 g. Thrown (ballistic): 0 g plus drag. Under his spread push: 0 g",
  [ASTM, MICROG],
  "Felt acceleration = (sum of contact forces)/m = a − g, with g pointing down (ASTM §7.1.4.5: limits are 'total net acceleration, inclusive of earth's gravity'). A horizontal push of a gives n = √(a² + g²)/g, so a felt 2, 4 or 6 g needs a horizontal acceleration of 1.73, 3.87 or 5.92 g. A vertical launch at a gives n = a/g + 1. Air drag in flight acts on the front, so it is felt: n_drag = ½ρv²C_dA/(m g) (comic_passenger_drag_g). value_si is the 1 g felt when standing still. Verifier: formula right; but ASTM limits are per body axis, with a combined-axis ellipse (§7.1.5.1), so compare each axis's component with that axis's curve; comparing the magnitude n with one curve is only an approximation.",
  "This research, 2026")

F("comic_passenger_no_harm_limit",
  "Recommended 'no harm' limit for a passenger, by body axis (safe passenger switch off)",
  "estimate", 14.71, "m/s^2", 10.79, 58.84,
  "Orientation unknown (tumbling, a face-first catch, a push on the chest): eyes-front (−Gx) limit, 2 g at 0.2 s, 1.5 g from 0.5 s. Back-first cradle with head support (+Gx), or pushed up from below while seated upright (+Gz): 6 g to 1 s, 4 g at 2–4 s, 3 g at 5–11.8 s, then 2.5 g (+Gx) or 2 g (+Gz). Sideways 3 g → 2 g. Head-down (−Gz): as eyes-front to 4 s, then 1.1 g from 7 s. Pulses under 0.2 s: use the 0.2 s value",
  [ASTM, EIBAND],
  "Recommendation built from verified sources. ASTM F2291 is the only published design limit for the general public (healthy riders 48 in or taller, no training), and it sits inside the layperson centrifuge results and NASA crew limits. Choices, each an estimate: (1) unknown orientation defaults to −Gx, the lowest curve over the length of a throw or catch; use 6 g only with a stated back-first cradle and head support. (2) ASTM does not cover pulses under 200 ms; each curve keeps its 0.2 s value there (Eiband: tolerance rises for shorter pulses). (3) ASTM assumes a designed seat, restraint and headrest; Rex's arms are not a seat, so treat every curve as a best case. (4) Compare per axis. (5) Children under 48 in are not covered. Carry the headrest and onset conditions (comic_passenger_onset_rate_limits). Verifier: made axis-dependent; was 6 g for every phase.",
  "This research, 2026",
  {"basis": "ASTM F2291-06a base case (comic_astm_f2291_ride_limits)",
   "units": "G net (including gravity), duration s, linear between points; magnitudes (signs dropped)",
   "default, orientation unknown (-Gx eyes front)": [[0, 2], [0.2, 2], [0.5, 1.5], [90, 1.5]],
   "+Gx eyes back: back-first cradle with head support": [[0, 6], [1, 6], [2, 4], [4, 4], [5, 3], [11.8, 3], [12, 2.5], [90, 2.5]],
   "+Gz eyes down: pushed up from below, seated upright": [[0, 6], [1, 6], [2, 4], [4, 4], [5, 3], [11.8, 3], [12, 2], [90, 2]],
   "Gy sideways": [[0, 3], [1, 3], [2, 2], [90, 2]],
   "-Gz eyes up (head-down)": [[0, 2], [0.2, 2], [0.5, 1.5], [4, 1.5], [7, 1.1], [90, 1.1]],
   "conditions": "above 1.5 G needs head support unless onset is under 5 G/s (then 2.0 G); with no head support, above 1.5 G for at most 4 s; from 0 G to 2 G or more, onset under 15 G/s; two axes at once: ellipse with radii 1.1 x the 200 ms limits; under 0.2 s not covered by ASTM"})

F("comic_passenger_injury_level",
  "Recommended 'injury possible' band for a passenger (beyond what harnessed volunteers took uninjured)",
  "estimate", 392.3, "m/s^2", 98.07, 441.3,
  "Beyond Eiband's line for harnessed volunteers who were not injured (45 g at 0.044 s, 40 g at 0.1 s, 25 g at 0.2 s, 13 g at 0.6 s, 10 g at 1.6 s): injury possible; data sparse; worse at high onset rates. Human points survived with injury: 25 g for 0.93 s (applied); 83 g for 0.04 s measured at the chest (applied input lower). Held by hand with no harness: not measured",
  [EIBAND, SP3006_IMPACT, SP3006_T44],
  "Recommendation. Page bands: (a) under comic_passenger_no_harm_limit: within ride limits. (b) between that and Eiband's line: beyond what rides allow; nothing is measured for a person held by hand, so say so. (c) above Eiband's line: 'beyond what harnessed volunteers took uninjured; injury possible; data sparse; worse at high onset rates'. The line is the upper edge of uninjured voluntary exposures; above it lies a sparse moderate-injury zone with no measured probability. Eiband: 'Exposures that fatally injure human subjects have not been measured', so the page must not claim where death begins. (d) head-to-foot g held over 5 s: also flag grey-out, blackout and unconsciousness (comic_relaxed_gz_thresholds_cochran, comic_gloc_not_before_5s). Plot the 83 g chest point apart from applied g. Interpolate on log-log axes. Verifier: 'injury likely' and 'far lower' were overstated; reworded.",
  "This research, 2026",
  {"units": "G net, duration s",
   "edge of uninjured harnessed volunteer exposures (Eiband)": [[0.044, 45], [0.1, 40], [0.2, 25], [0.6, 13], [1.6, 10]],
   "humans, survived with injury (applied g, harnessed)": [[0.93, 25, "debilitated, back on duty in 5 days"], [0.16, 38, "severe shock, onset over 1300 G/s"], [0.23, 45, "severe delayed effects, onset 413 G/s"]],
   "chest-measured, not applied (plot separately)": [[0.04, 83, "reversible injuries, rearward-facing"]],
   "head-to-foot held over 5 s": "grey-out from about 4.1 G, unconsciousness about 5.4 G (means)",
   "fatal level": "not measured"})

# gentlest throw, recomputed on a consistent 45-degree push
H = 3.048
d_throw = 1.6 * H / 2
rows = {}
for n in (6, 4, 2):
    s = math.sin(math.pi / 4)
    A = (-2 * s + math.sqrt(4 * s * s - 4 * (1 - n * n))) / 2 * g
    v = math.sqrt(2 * A * d_throw)
    rows[n] = dict(a=A / g, v=v, t=2 * d_throw / v, rng=v * v / g, fall=v * v / (2 * g))
F("comic_passenger_gentlest_throw",
  "Fastest launch within the ride limit (landing not included)",
  "estimate", round(rows[6]['v'], 1), "m/s", round(rows[2]['v'], 1), round(rows[6]['v'], 1),
  "Pushed along 45° over Rex's 2.4 m throwing stroke at 6 g felt: release at about 16 m/s in 0.3 s, landing about 26 m away (no drag). At 4 g: 12 m/s, 16 m. At 2 g: 7.5 m/s, 6 m. The landing is not included: at about 16 m/s it is like a 13 m fall, a serious injury risk unless he catches them",
  [ASTM],
  "Felt g for a push of a along 45°: |a(cos45°, sin45°) + (0, g)| = n g, so a = 5.25 g at n = 6, 3.23 g at n = 4, 1.16 g at n = 2. Then v = √(2 a d), push time 2d/v, flat-ground range v²/g, landing speed v, and fall height v²/(2g); no drag; release height ignored. d = 1.6 × 3.048/2 = 2.44 m, the engine's throw stroke for a 10 ft body (body.strokes.throw in src/engine.js), itself an estimate. 6 g is allowed only for a back-first push with head support (+Gx); a push on the chest is −Gx, limited to 2 g at 0.2 s, 1.5 g after (comic_passenger_no_harm_limit). Onset rate is not modelled. A no-harm round trip needs him to catch them back over a similar stroke and axis. Verifier: recomputed on a consistent 45° push (was 17 m/s and 29 m, which mixed a horizontal-push formula with the 45° range); relabelled, since landing at about 16 m/s is not no-harm.",
  "This research, 2026",
  {"assumes": "push along 45 deg on the back (+Gx), head supported, over a 2.44 m stroke; no drag; release height ignored",
   "6 G felt": {"push (g)": round(rows[6]['a'], 2), "release speed (m/s)": round(rows[6]['v'], 1), "push time (s)": round(rows[6]['t'], 2), "range (m)": round(rows[6]['rng']), "landing like a fall of (m)": round(rows[6]['fall'], 1)},
   "4 G felt": {"push (g)": round(rows[4]['a'], 2), "release speed (m/s)": round(rows[4]['v'], 1), "push time (s)": round(rows[4]['t'], 2), "range (m)": round(rows[4]['rng']), "landing like a fall of (m)": round(rows[4]['fall'], 1)},
   "2 G felt": {"push (g)": round(rows[2]['a'], 2), "release speed (m/s)": round(rows[2]['v'], 1), "push time (s)": round(rows[2]['t'], 2), "range (m)": round(rows[2]['rng'], 1), "landing like a fall of (m)": round(rows[2]['fall'], 1)}})

F("comic_passenger_drag_g",
  "Air drag felt by a flying person, by speed (not removed by safe passenger once released)",
  "estimate", 108, "m/s", 44, 108,
  "For a 90 kg adult tumbling (area 0.67 m², C_d 1.1): drag decelerates them at 1 g at 44 m/s, 2 g at 63 m/s, 4 g at 89 m/s, 6 g at 108 m/s",
  [CDC, CD_TUMBLE, ISA],
  "v = √(2 n g m / (ρ C_d A)), with m = 90.26 kg (human_us_adult_male_mass), A = 0.67 m² (human_projected_area, orientation mean, an estimate), C_d = 1.1 (cd_bluff_body_tumbling_subsonic, an estimate), ρ = 1.225 kg/m³. Deceleration scales as A·C_d/m: head first (0.11 m²), 6 g comes only at about 270 m/s; broadside (0.79 m²), at about 100 m/s. The 1 g speed (44 m/s) is the tumbling terminal velocity. Drag acts on the front surface, so it is felt; safe passenger stops when he lets go. Dynamic pressure at 44–108 m/s is 1.2–7.2 kPa (windblast); no injury threshold for an unprotected person was sourced. Status estimate because A and C_d are estimates. Verifier recomputed all speeds.",
  "This research, 2026")

# ================================================================ (4) airblast and sonic boom
F("comic_airblast_rattle_onset",
  "Airblast at which people start to notice rattling: about 120 dB (20 Pa)",
  "verified", 20, "Pa", 20, 100,
  "Rattling complaints above about 120 dB (20 Pa, 0.003 psi; 6 Hz measuring system); at 134 dB (100 Pa; 0.1 Hz system) 5–10% of homes show rattling or fright disturbances",
  [ri("pp. 58 and 66 (PDF pp. 64, 72)")],
  "p. 58: 'complaints about rattling occur at airblast levels exceeding about 120 dB (6Hz), roughly corresponding to wall acceleration of 0.1 to 0.2 g'; 'Accelerations that cause something to rattle, move, and tilt, vary from 0.1 to 1.0 g'; 'A wall acceleration of 0.5 g is sufficient to shake most items'. p. 66: 'Levels exceeding 120 dB will produce some annoyance from rattling and fright, with as much as 5 to 10 pct of homes exhibiting such disturbances at the maximum level of 134 dBL (0.1-Hz high-pass).' p = 20 µPa × 10^(dB/20): 120 dB = 20 Pa, 134 dB = 100 Pa. Mine and quarry blasts are low frequency and long; a short, sharp pulse may need a higher peak. Verifier: the 120 dB figure is on a 6 Hz system, whose safe maximum is 129 dB (56 Pa), not 134 dB. Page numbers corrected from the verifier's copy (were pp. 56, 66–67).",
  "US Bureau of Mines, 1980")

F("comic_airblast_safe_max",
  "Airblast safe for houses (US mining regulation): 134 dB peak, about 100 Pa",
  "verified", 100.2, "Pa", 56.4, 100.2,
  "134 dB (0.1 Hz system) = 100 Pa; 133 dB (2 Hz) = 89 Pa; 129 dB (6 Hz) = 56 Pa; 105 dBC (C-weighted, slow)",
  [CFR816, ri("Conclusions, pp. 65–66 (PDF pp. 71–72)")],
  "30 CFR 816.67(b)(1)(i): 'Airblast shall not exceed the maximum limits listed below at the location of any dwelling, public building, school, church, or community or institutional building outside the permit area': 0.1 Hz flat 134 peak; 2 Hz 133; 6 Hz 129; C-weighted slow 105 peak dBC. Footnote 1, on the 0.1 Hz and C-weighted rows: 'Only when approved by the regulatory authority.' RI 8485: 'Based on a minimal probability of the most superficial type of damage in residential-type structures, any of the following represent safe maximum airblast levels', the same four numbers, with C-slow for 'events not exceeding 2-sec duration'; 'These criteria could be lowered at locations with many large plate glass windows.' NASA's sonic-boom sheet agrees: 'At one pound overpressure [48 Pa], no damage to structures would be expected'. Verifier: footnote and 2 s note added.",
  "OSMRE regulation (current); USBM 1980",
  json.loads(RF["comic_airblast_safe_max"]["values_json"]))

F("comic_airblast_sash_rattle_small_shots",
  "Window sashes rattled at 0.03–0.05 psi (207–345 Pa) in small-charge tests: not a harmless level",
  "verified", 207, "Pa", 207, 345,
  "0.03–0.05 psi (141–145 dB): rattling of window sashes, in tests with small charges. Overlaps the start of glass damage",
  [ri("Appendix G 'Other airblast damage research', p. 95 (PDF p. 101), and Appendix H 'Sonic boom damage', p. 98 (PDF p. 104)")],
  "App. G, as reproduced in RI 8485: Perkins and Jackson 'also noted that rattling of window sashes occurred at 0.03 to 0.05 lb/in2 (141 to 145 dB). It has been recognized that these levels are too high for continuous use in urban areas and where there are large number of people or objects affected. They do not provide realistic guidelines for either blast design or environmental regulation (57). The likely reasons for their high damage thresholds are the small high-frequency shots and small panes studied.' App. H (Wiggins, sonic booms): 'Much of the glass damage was attributed to impact of the severely rattling window sashes, rather than direct pressure against the panes.' So 207–345 Pa overlaps the start of glass damage (comic_glass_breakage_low_end). Do not use it as a harmless rattle target. Primary report not fetched. Verifier: notes corrected.",
  "Perkins & Jackson (BRL); Wiggins, as reproduced in USBM RI 8485, 1980")

F("comic_glass_breakage_low_end",
  "Glass damage becomes improbable below about 0.030 psi (140 dB, ~200 Pa); single tests broke precracked panes from 364 Pa and stressed glass from 690 Pa",
  "verified", 207, "Pa", 117, 690,
  "Damage improbable below about 0.030 psi (140 dB, about 207 Pa; studies' safe levels for glass 0.017–0.10 psi, 117–690 Pa). Precracked windows broke from 7.6 psf (364 Pa); glass under strain from 0.10 psi (690 Pa); good 3 × 3 ft panes none below 20 psf (958 Pa); properly mounted glass 0.75 psi (5.2 kPa)",
  [ri("Airblast Damage Summary and Table 12, p. 60 (PDF p. 66); Appendix G, p. 95 (PDF p. 101); Appendix H, p. 98 (PDF p. 104)")],
  "p. 60: 'there is a consensus that damage becomes improbable below approximately 0.030 lb/in2 (140 dB)', Table 12 'based on no greater damage risk than one chance in a thousand'. Table 12 glass rows run from Reed 0.017 psi (136 dB; windows under 64 ft², 1 chance in 10³) through Blume 0.026, Reed 0.029 and Poulter 0.032 to Windes and Perkins 0.100 psi (151 dB, poorly mounted glass). App. G: 'glass under strain could fail at overpressures as low as 0.10 lb/in2 (151 dB)'. App. H (Sutherland): 'precracked windows failed at levels as low as 7.6 lb/ft2 (0.053 lb/in2, 145 dB)'; 24 panes 3 × 3 ft, none below 20 lb/ft2. This fills the gap in blast_window_breakage (Glasstone 0.5–1.0 psi 'shattering usually'). Verifier: relabelled; the old 'lowest breakage 364–690 Pa' ignored the report's own 207 Pa consensus; Table 12 folded in from the verifier's missing list.",
  "USBM RI 8485 (1980), compiling Windes, Perkins & Jackson, Poulter, Reed, Blume, Sutherland",
  {"units": "original units (Pa)",
   "consensus: damage improbable below (RI 8485 p. 60)": "0.030 lb/in2 (207 Pa, 140 dB)",
   "Table 12 max safe, glass": {"Reed, large surface blasts, <64 ft2 window, 1 chance in 10^3": "0.017 psi (117 Pa, 136 dB)", "Blume, sonic booms": "0.026 psi (179 Pa, 139 dB)", "Reed, general": "0.029 psi (200 Pa, 140 dB)", "Poulter, unconfined charges": "0.032 psi (221 Pa, 141 dB)", "Windes; Perkins, poorly mounted glass": "0.100 psi (690 Pa, 151 dB)"},
   "Table 12, other low rows": "Taylor 'threshold' and RI 8485's own production-blasting criterion 0.014 psi (97 Pa, 134 dB); Wiggins paint fleck 0.015 psi (103 Pa)",
   "precracked windows, sonic boom (Sutherland)": "7.6 lb/ft2 (364 Pa, 145 dB)",
   "poorly mounted glass under stress (Windes; Perkins & Jackson)": "0.10 lb/in2 (690 Pa, 151 dB)",
   "3 ft x 3 ft x 1/8 in windows, no failures below (Sutherland)": "20 lb/ft2 (958 Pa, 154 dB)",
   "properly mounted glass, damage threshold (Perkins & Jackson)": "0.75 lb/in2 (5,171 Pa, 168 dB)",
   "small open-air shots: damage / none (Windes)": "0.88-1.10 lb/in2 damage (6.1-7.6 kPa); none at 0.62-0.72 lb/in2 (4.3-5.0 kPa)"})

F("comic_sonic_boom_house_effects",
  "What sonic booms do to houses (White Sands tests)",
  "verified", 287, "Pa", 120, 527,
  RF["comic_sonic_boom_house_effects"]["display"],
  [ri("Appendix H 'Sonic boom damage', p. 98 (PDF p. 104), reproducing Sutherland")],
  "As reproduced in RI 8485: Sutherland 'notes that a sonic boom overpressure of 2.5 lb/ft2 (0.0174 lb/in2, 136 dB) would preclude damage'. 'The results of experimental sonic boom tolerance tests at White Sands were-- Cracks in plaster on wood lath 6.5-10 lb/ft2 ... Nail popping--1/2-inch gypsum board 10.3 lb/ft2 ... Falling bric-a-brac and rattling dishes 6-11 lb/ft2 (0.0417-0.0764 lb/in2, 143-148 dB).' Left out: a 'paint flaking' row whose psf and psi disagree (4.0 psf against 0.0625 psi = 9 psf). Sonic booms are long-wavelength N-waves, so these thresholds suit booms and big blasts, not a hand clap. 1 psf = 47.88 Pa. Primary (Sutherland 1968) not fetched. Verifier: text and conversions match. Page number corrected from the verifier's copy (was p. 96).",
  "Sutherland, as reproduced in USBM RI 8485, 1980",
  json.loads(RF["comic_sonic_boom_house_effects"]["values_json"]))

F("comic_sonic_boom_public_reaction",
  "Sonic booms people object to: 1.5–2 psf (72–96 Pa)",
  "verified", 72, "Pa", 72, 96,
  "1 psf (48 Pa): no damage expected; 1.5–2 psf (72–96 Pa): some public reaction",
  [NASA_BOOM],
  "Quotes: 'At one pound overpressure, no damage to structures would be expected.' 'Overpressures of 1 to 2 pounds are produced by supersonic aircraft flying at normal operating altitudes. Some public reaction could be expected between 1.5 and 2 pounds.' The rest of the sheet is already in blast_sonic_boom_concorde: rare minor damage at 2–5 psf, sound structures undamaged up to 11 psf. 1 psf = 47.88 Pa. Verifier re-fetched; quotes match.",
  "NASA DFRC, 2003")

F("comic_impulse_noise_limit",
  "Hearing-safety limit for impulse noise: 140 dB peak (200 Pa)",
  "verified", 200, "Pa", None, None,
  "140 dB peak sound pressure (200 Pa, 0.03 psi): US workplace limit for impulsive or impact noise",
  [OSHA],
  "After Table G-16: 'Exposure to impulsive or impact noise should not exceed 140 dB peak sound pressure level.' The wording is 'should', a guideline. 140 dB = 20 µPa × 10^7 = 200 Pa, about 170 times below eardrum rupture (34.5 kPa, blast_eardrum_rupture_threshold), so it is the 'people nearby come to no harm' line for a clap or punch blast. The same 140 dB is RI 8485's consensus level below which glass damage becomes improbable (comic_glass_breakage_low_end), so 200 Pa is safe for ears but at the start of possible window damage. NIOSH (1998) and ISO/EU documents reportedly use the same ceiling (not fetched). Read through WebFetch; the verifier re-fetched it the same way.",
  "OSHA, current regulation")

# ================================================================ (5) soft landing and absorption
F("comic_impulse_momentum_theorem",
  "Impulse–momentum: the same momentum change over a longer time needs less force",
  "verified", None, "", None, None,
  "J = Δp; F_ave = Δp / Δt",
  [OPENSTAX],
  "Quotes: 'An impulse applied to a system changes the system's momentum, and that change of momentum is exactly equal to the impulse that was applied'; 'the average force applied to an object is equal to the change of the momentum that the force causes, divided by the time interval over which this change of momentum occurs'; 'The change of momentum in a crash is the same, with or without an airbag; the force, however, is vastly different.' Read through WebFetch; the verifier confirmed the quotes.",
  "OpenStax, University Physics Vol. 1")

M = 3007
W = M * g
dleg = 0.5 * H / 2
land = {}
impossible = []
for v in (5, 20, 100):
    J = M * v
    cell = {"J (N s)": round(J)}
    bad = []
    for T in (0.1, 0.5, 2):
        cell[f"mean F over {T:g} s (kN)"] = round((J / T + W) / 1e3)
        travel = v * T / 2
        cell[f"constant-force travel for {T:g} s (m)"] = round(travel, 2)
        if travel > dleg:
            bad.append(f"{T:g} s")
    cell["minimum peak F within a 0.76 m knee bend (kN)"] = round((M * v * v / (2 * dleg) + W) / 1e3)
    cell["longest constant-force stop on his legs (s)"] = round(2 * dleg / v, 3)
    land[f"{v} m/s"] = cell
    impossible.append(f"{v} m/s: " + ", ".join(bad))
land = {"units": "Rex 3,007 kg; W = 29.5 kN; knee bend d = 0.76 m (engine strokes.leg, an estimate). mean F = J/T + W over stop time T; a constant-force stop of length T needs travel vT/2",
        **land,
        "not possible on his legs (constant-force travel over 0.76 m)": impossible}
F("comic_soft_landing_force",
  "Soft landing: the momentum the ground must still take, and the least peak force his legs allow",
  "derived", None, "N", None, None,
  "Ground impulse J = m v. Time-mean ground force over a stop of T: J/T + W. Within a knee bend d, the peak force is at least m v²/(2d) + W. At 10 ft, a 0.76 m knee bend from 20 m/s needs a peak of at least 820 kN (28 × his weight)",
  [OPENSTAX, NILSSON],
  "J = m v (add any caught object's m v). The time-mean force over a stop of T is J/T + W. Work–energy: the distance-average ground force over a stop within travel d is m v²/(2d) + W, so the PEAK force is at least that, whatever the profile. 'T ≤ 2d/v' holds only for a constant force; a long-tailed profile can have a lower time-mean but a higher peak. Absorbing the energy (½mv² + m g d) removes crater and quake, not this. d = engine strokes.leg = 0.5 × H/2 = 0.76 m at 10 ft. On two paw soles (0.62 m², engine estimate) that is 1.3 MPa at 20 m/s; on Ollie's boot soles (0.30 m²), 2.7 MPa. Above the ground's bearing capacity he still sinks unless comic ground is on. Holding it to the walking load (1.2 W) needs T = v/(0.2 g): 2.5 s from 5 m/s, impossible on his feet. Earth's recoil energy J²/(2M_E) is 2e-17 to 8e-15 J. Verifier: peak-force rule stated; impossible cells flagged.",
  "This research, 2026",
  land)

F("comic_absorb_residual_energy",
  "Momentum cannot be passed on with zero energy: at least p²/(2M) stays in whatever takes it",
  "derived", None, "J", None, None,
  "Passing momentum p to a body of mass M leaves at least p²/(2M) in that body. For the Earth this is effectively nothing; for a small mass of air it can be large, though it shrinks as the moving air spreads",
  [OPENSTAX],
  "A body of mass M at rest given momentum p moves at p/M and carries kinetic energy p²/(2M) (its centre-of-mass energy), the least any receiver can end up with, so an absorbed switch can absorb everything except this. Example: a 3,007 kg Rex landing at 100 m/s passes p = 3.0e5 N s to the Earth (5.97e24 kg), which keeps 7.6e-15 J. That is why soft landing can absorb the energy and still pass on the momentum. Cool flight: at any moment the air carrying the momentum holds at least p²/(2 m_air); that bound shrinks as the wake spreads and more air shares the momentum, and the bulk motion ends as heat. Silent strike: the fist's own momentum returns through his arm and feet to the Earth; the small drag impulse the fist gives the air still goes to the air. Verifier: 'impossible' for cool flight was overstated; reworded.",
  "This research, 2026")

# ---------------------------------------------------------------- gaps
gaps = (
    "Not found or not verified:\n"
    "- Current ASTM F2291 edition. The ASTM store lists F2291-26 (June 2026) as active and a reseller lists F2291-26a (Aug 2026); neither was checked. The limits here are F2291-06a (Public.Resource.Org copy). EN 13814:2019 was not fetched. Say 'ASTM F2291-06a (later editions may differ)'.\n"
    "- Any measured tolerance for a person held or carried by hand, or for soft tissue squeezed by a grip, or for head and neck support (whiplash) without a headrest beyond ASTM's headrest rule. Every limit found assumes a seat or harness: on the page, 'for someone held in his hands, nobody has measured it; these limits are a best case'.\n"
    "- Pulses under 200 ms for ordinary, unrestrained people. ASTM does not cover them; Eiband's numbers are for fully harnessed volunteers. Keeping each curve's 0.2 s value is an estimate.\n"
    "- Onset rates of Rex's throw and catch strokes: not modelled; the ride limit is under 15 g/s from 0 g and 5 g/s without a headrest (comic_passenger_onset_rate_limits).\n"
    "- Ground-landing injury for a thrown, uncaught passenger (injury against impact speed or fall height): no source. Any uncaught throw has an unquantified landing hazard; the fastest ride-limit launch lands at about 16 m/s, like a 13 m fall.\n"
    "- How far a person's body gives on landing, so the landing g is unknown unless he catches them.\n"
    "- Windblast injury thresholds for an unprotected person at 1.2–7.2 kPa dynamic pressure (44–108 m/s); only the drag g is derived.\n"
    "- Children under 48 in, elderly or pregnant passengers: the ride limits do not cover them.\n"
    "- Primary papers read only as reproduced or summarised: Cochran et al. 1954 (via SP-3006 Table 4-4, which gives no onset rate or posture); Fraser 1966; Perkins & Jackson, Windes, Poulter, Reed, Blume, Wiggins and Sutherland (via USBM RI 8485); Beeding & Mosely 1960 and Stapp (via SP-3006). NIOSH 1998's 140 dB limit was not fetched (OSHA's was).\n"
    "- Kirchhoff's uniqueness theorem (the stress-free solution is the only one) is standard but was not fetched.\n"
    "- The sonic boom from a supersonic fist or hand, and the airblast from a clap in dB with its frequency content. The engine gives only peak overpressure; rattle and damage thresholds depend on pulse length and on the measuring system (RI 8485's 120 dB and 129 dB are on a 6 Hz system, 134 dB on 0.1 Hz). Call dB thresholds approximate.\n"
    "- Cool flight: the share of drag energy that heats the object rather than the air, and how fast the air's residual p²/(2 m_air) falls as the wake spreads.\n"
    "- Motion sickness or discomfort from the few seconds of weightlessness that safe passenger produces: not quantified. Say 'people feel weightless, as on a drop ride; some find it unpleasant'.\n"
    "Access notes: the NASA-STD-3001 Vol 2 Rev D link on nasa.gov returned 404, so Rev F (approved 2026-07-14) was used from a standards.nasa.gov 'system/files/tmp' path. NCBI Bookshelf and StatPearls blocked automated fetches, so G-LOC figures come from SP-3006 and Whinnery & Forster 2013. The VDV ride-limits paper (Rohde 2024) could not be fetched (expired TLS certificate). The centrifuge studies were read as abstracts only (Europe PMC); their subjects were screened, seated and strapped in.\n"
    "On the page, call the passenger limits 'the limits used for fairground rides', not 'safe for anyone'."
)

out = {"facts": facts, "gaps": gaps}
os.makedirs(os.path.join(SP, 'compiled'), exist_ok=True)
path = os.path.join(SP, 'compiled', 'comic.json')
with open(path, 'w', encoding='utf-8') as fh:
    json.dump(out, fh, ensure_ascii=False, indent=1)
    fh.write('\n')

# ---------------------------------------------------------------- checks
keys = [f['key'] for f in facts]
assert len(keys) == len(set(keys)), 'duplicate keys'
missing = set(RF) - set(keys)
print('facts', len(facts), 'dropped from research:', sorted(missing), 'new:', sorted(set(keys) - set(RF)))
for f in facts:
    assert f['value_si'] is None or isinstance(f['value_si'], (int, float)), f['key']
    for k in ('low_si', 'high_si'):
        assert f[k] is None or isinstance(f[k], (int, float)), (f['key'], k)
    if f['low_si'] is not None and f['high_si'] is not None:
        assert f['low_si'] <= f['high_si'], f['key']
        if f['value_si'] is not None:
            assert f['low_si'] <= f['value_si'] <= f['high_si'], (f['key'], f['value_si'], f['low_si'], f['high_si'])
    if 'values_json' in f:
        json.loads(f['values_json'])
    n = len(f['notes'])
    flag = '  <-- long' if n > 900 else ''
    print(f"{f['key']:42s} {f['status']:9s} notes {n}{flag}")
    old = RF.get(f['key'])
    RANKS = {'verified': 0, 'derived': 1, 'reported': 2, 'estimate': 3, 'disputed': 4}
    if old:
        assert RANKS[f['status']] >= RANKS[old['status']] or f['status'] == old['status'], ('status upgraded', f['key'])
print('rows', json.dumps({k: v for k, v in rows.items()}, default=lambda x: round(x, 2)))
print(json.dumps(land, ensure_ascii=False)[:900])
print('wrote', path)
