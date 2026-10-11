export const meta = {
  name: 'dino-strength-research',
  description: 'Research + adversarially verify the data behind a super-strength physics simulator',
  phases: [
    { title: 'Research', detail: '4 researchers: humans/biomech, fiction canon, objects, environment/constants' },
    { title: 'Verify', detail: '2 independent verifiers per topic (source lens, skeptic lens)' },
    { title: 'Merge', detail: 'apply verdicts, resolve conflicts, emit final dataset' },
  ],
}

const CONTEXT = `PROJECT: We are building a physics simulator for a cartoon anthropomorphic dinosaur character who is indestructible and never tires. The user picks a strength level (from "strongest recorded human" through comic-book superheroes up to effectively infinite) and the sim computes the physics of famous feats: lift forces, throw speeds and ranges, recoil, ground failure under his feet, blast/seismic effects of punches/stomps/claps, etc. Your data feeds a JavaScript physics engine directly, so every number must be correct, sourced, and in SI.
The user is a professional critic who values factual accuracy above all. If something cannot be verified, say so and mark it; never invent a number or a citation. Today's date is 2026-10-09: sports records may have been broken recently (e.g., a 511 kg strongman deadlift by Raul Flores was reported in Sept 2026), so always search for the current state, not your memory.
Tools: use ToolSearch with query "select:WebSearch,WebFetch" to load web tools, then search and open real pages. Do not edit any files or repositories.
Output conventions: value_si in SI base units (kg, m, s, N, Pa, J, m/s, m^2, K). Metric tonne = 1000 kg. Short ton = 907.18474 kg; long ton = 1016.047 kg; lb = 0.45359237 kg. When a source says "tons", determine which ton it means and say so in notes. Use low_si/high_si when the honest answer is a range. key must be a unique snake_case id.`

const TOPICS = [
  {
    key: 'humans',
    title: 'Strongest recorded humans + biomechanics calibration',
    prompt: `TOPIC: Strongest recorded humans and the human biomechanics numbers needed to calibrate a muscle model.
Collect (current as of 2026-10-09; give person, date, venue, and status verified/disputed/claimed):
A) Lift records: strongman deadlift WR; raw and equipped powerlifting deadlift WRs (name the federation); partial-range lifts (silver dollar / 18-inch deadlift record; heaviest back lift - Gregg Ernst and others; Paul Anderson's claimed 1957 back lift, marked claimed/disputed); Olympic weightlifting clean & jerk and snatch WRs (note the IWF 2025 weight-class change and how records/world standards were reset); log press WR; atlas stone WR; heaviest squat WR.
B) Pull/drag records: heaviest aircraft pulled by one person (Guinness), heaviest vehicle/truck pulled, any "heaviest weight held/supported" record.
C) Throw/speed calibration: shot put WR (and implement mass 7.26 kg), hammer throw WR, javelin WR, discus WR, fastest recorded baseball pitch (mph and m/s), fastest measured human punch (fist speed, m/s) with source quality, highest standing vertical jump on record, standing long jump record, Usain Bolt peak running speed (m/s).
D) Biomechanics: body segment mass fractions (hand, forearm, upper arm, whole arm, foot, shank, thigh, whole leg) from Winter or Dempster with citation; Hill force-velocity model curvature parameter a/F0 (typical value and range) and the equation form; typical max limb endpoint speeds: elite punch fist speed, pitching hand/ball release speed, kick foot speed, vertical jump takeoff velocity for elite jumpers; peak ground reaction force in elite sprinting (multiples of body weight); barefoot plantar contact area of one adult foot standing (m^2); palm contact area of one adult hand (m^2).
Give each item as one fact. Include short notes on what the record actually measures (full range vs partial, equipped vs raw, suits/straps), because the sim must not overstate human ability.`,
  },
  {
    key: 'fiction',
    title: 'Superhero / myth strength canon',
    prompt: `TOPIC: Canon-stated strength figures and famous strength feats from comics, myth, and fiction.
A) Marvel: the Official Handbook of the Marvel Universe strength-class system. Give per-character lifting class with handbook edition/year for: Captain America, Spider-Man, Wolverine, Luke Cage, Colossus, She-Hulk, The Thing, Hulk, Thor, Hercules, Sentry (if stated), Gladiator (if stated). State whether the handbook's "tons" are short tons. Note where later handbooks changed values or went "incalculable".
B) Specific canon feats with an in-universe stated number: Secret Wars #4 (1984) Hulk holding the mountain range (verify the exact stated figure and wording); All-Star Superman #3 (2006) Superman's stated lift (verify "200 quintillion tons" or correct it); any DC or Marvel feat where the text states a mass/force (e.g., Superman moving the Earth or Moon, Hercules towing Manhattan, Thor and the Midgard Serpent). For each: issue, year, page/panel if findable, exact stated figure, and what object.
C) Famous depicted-but-unquantified feats worth simulating: Action Comics #1 (1938) Superman lifting the car on the cover (identify the car type and a realistic mass range for a late-1930s sedan as an estimate), Saitama's serious punch in One-Punch Man (no stated value - mark not_quantified), Superman catching/lifting airliners, etc.
D) Myth and legend: Atlas holding up the heavens; Thor lifting Utgarda-Loki's cat (Prose Edda, Gylfaginning - which chapter, what he achieved); Samson and the temple pillars (Judges 16 verse refs); Sun Wukong's staff Ruyi Jingu Bang stated weight (13,500 jin? verify, chapter) with the historical jin-to-kg conversion and resulting mass range; Milo of Croton carrying a bull; Heracles if there is a quantifiable feat.
Rules: Fan wikis (VS Battles, Fandom) and fan calculations are NOT sources for canon numbers; you may use them only as pointers, and the claim must be confirmed in a primary text or a reputable secondary source (publisher sites, reputable press, scans quoted in reputable outlets, Wikipedia with citations). Status values: canon_stated (number given in the work), not_quantified (shown but no number), claimed (number appears only in secondary/fan sources). If you cannot confirm, say "cannot verify" in notes and use status claimed.`,
  },
  {
    key: 'objects',
    title: 'Object library: masses, sizes, drag, materials',
    prompt: `TOPIC: Physical data for an object library the dinosaur can lift or throw.
For each object give: mass (value_si, with low/high if it varies), typical dimensions (L x W x H in m, in notes), frontal/cross-section area estimate for a thrown object in m^2, drag coefficient estimate (state the shape assumption; note tumbling bluff bodies are ~1.0 and supersonic spheres ~0.9-1.0), the material at the grip point and its crush/yield/compressive strength in Pa (e.g., car body sheet steel, aircraft aluminium skin, granite), and a one-line structural note on what happens if you try to lift the whole thing from one hand-sized contact point.
Objects: baseball; men's shot put; max-weight bowling ball; average adult human; Steinway Model D grand piano; a typical motorcycle; Toyota Corolla curb mass; Ford F-150 curb mass; full-size Type C school bus; US semi truck at the 80,000 lb legal max; M1A2 SEPv3 Abrams tank; adult blue whale (typical and largest recorded); EMD SD70ACe locomotive; Boeing 747-400 (operating empty and max takeoff); Airbus A380 max takeoff; Space Shuttle full stack at liftoff; Statue of Liberty (copper skin + steel framework + total); Eiffel Tower (iron structure and total); RMS Titanic displacement; Nimitz-class carrier full-load displacement; Empire State Building total mass estimate (state method/uncertainty); Great Pyramid of Giza mass; Mount Everest mass estimate (state the method and the definition of where the mountain ends, give a range); a typical cumulus cloud's water mass; the Moon; Earth; the Sun.
Prefer manufacturer specs, official agencies (NASA, USGS, NPS), and reputable references. Mark rough estimates as status estimate.`,
  },
  {
    key: 'environment',
    title: 'Ground, air, energy, blast and seismic constants',
    prompt: `TOPIC: Environment and physical constants for the engine.
A) Ground surfaces - for each: ultimate bearing capacity (Pa) for a small (~0.1 m^2) footing near the surface, with the allowable/presumptive value too if that's what references give (say which); shear strength (Pa); a reasonable friction coefficient for a scaly foot with keratin claws (an estimate, with reasoning). Surfaces: loose dry sand, dense sand/gravel, soft clay, stiff clay, asphalt pavement on compacted base, concrete slab (give f'c range and note punching shear of slab-on-grade), intact granite bedrock (UCS range and how bearing capacity of rock under a small punch relates to UCS - confinement factor), structural steel plate (yield), sea ice/freshwater ice (compressive strength).
B) Atmosphere (ISA sea level): density, pressure, temperature, speed of sound, ratio of specific heats, density scale height for the lower atmosphere, mass of the atmospheric column per m^2.
C) Earth: standard gravity, mean radius, escape velocity at surface, circular orbital velocity at surface.
D) Energy references: TNT equivalence (J per tonne); M67 grenade explosive mass; GBU-43 MOAB yield; Hiroshima yield; Castle Bravo; Tsar Bomba; Tunguska (range); 1883 Krakatoa (range); Chicxulub impact energy (range); Sun's luminosity; Earth's gravitational binding energy. Also the xkcd What If #1 "Relativistic Baseball" scenario (0.9c pitch) - the energy figure it gives, as a sanity reference.
E) Seismic: the Gutenberg-Richter energy-magnitude relation (exact form, units) with citation; seismic efficiency used for impacts (Collins, Melosh & Marcus 2005 Earth Impact Effects Program value, and the literature range).
F) Blast: the Kinney & Graham (1985) scaled-distance peak overpressure formula (exact equation, ambient pressure scaling, validity) and peak-overpressure damage thresholds: typical window breakage, eardrum rupture (50% threshold), residential collapse, reinforced concrete severe damage, lung damage/lethality. Also a typical sonic boom overpressure (e.g., Concorde) in Pa.
G) Cratering: the Collins, Melosh & Marcus (2005) transient crater diameter formula for impacts (exact equation, variables, units) and the simple-crater final diameter relation.
H) Aerothermal: stagnation temperature formula for a calorically perfect gas, and a caution on its validity above ~Mach 5-6 (dissociation); a reference figure for peak heating temperatures on reentry (e.g., Space Shuttle).
Cite textbooks, standards, agency pages, or peer-reviewed papers.`,
  },
]

const FACTS_SCHEMA = {
  type: 'object',
  properties: {
    facts: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          key: { type: 'string' },
          category: { type: 'string' },
          label: { type: 'string' },
          value_si: { type: 'number' },
          unit_si: { type: 'string' },
          low_si: { type: 'number' },
          high_si: { type: 'number' },
          display: { type: 'string' },
          status: { type: 'string', enum: ['verified', 'disputed', 'claimed', 'canon_stated', 'not_quantified', 'estimate'] },
          who_when: { type: 'string' },
          sources: { type: 'array', items: { type: 'object', properties: { url: { type: 'string' }, title: { type: 'string' } }, required: ['url'] } },
          notes: { type: 'string' },
        },
        required: ['key', 'category', 'label', 'status', 'sources', 'notes'],
      },
    },
    gaps: { type: 'array', items: { type: 'string' } },
  },
  required: ['facts', 'gaps'],
}

const VERDICT_SCHEMA = {
  type: 'object',
  properties: {
    checks: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          key: { type: 'string' },
          verdict: { type: 'string', enum: ['confirmed', 'corrected', 'unverifiable', 'wrong', 'misattributed', 'outdated'] },
          corrected_value_si: { type: 'number' },
          corrected_low_si: { type: 'number' },
          corrected_high_si: { type: 'number' },
          corrected_display: { type: 'string' },
          corrected_status: { type: 'string' },
          evidence: { type: 'array', items: { type: 'object', properties: { url: { type: 'string' }, quote: { type: 'string' } }, required: ['url'] } },
          reason: { type: 'string' },
        },
        required: ['key', 'verdict', 'reason'],
      },
    },
    missing: { type: 'array', items: { type: 'string' } },
  },
  required: ['checks', 'missing'],
}

const LENSES = [
  {
    key: 'source',
    prompt: `LENS: SOURCE CHECK. For every fact, independently re-find the number in a reputable source. Open the researcher's URLs and confirm they actually state the claim (flag any URL that does not support it). Find at least one independent second source where possible. Check currency: has the record been broken or the figure revised as of 2026-10-09? Verdict "confirmed" only if you personally saw the number in a reputable source.`,
  },
  {
    key: 'skeptic',
    prompt: `LENS: SKEPTIC. Assume the researcher made mistakes. Recompute every unit conversion (lb/kg, short/long/metric tons, psi/Pa, mph/m/s). Hunt for: misattribution; claimed or disputed feats presented as verified; partial-range or equipped lifts presented as full-range raw; allowable bearing capacity presented as ultimate; fan calculations presented as canon; implausible drag coefficients; ranges collapsed to falsely precise points; wrong issue numbers or years. Search the web to settle each doubt. Default to "unverifiable" when you cannot settle it.`,
  },
]

const results = await pipeline(
  TOPICS,
  (t) => agent(`${CONTEXT}\n\n${t.prompt}\n\nReturn every item as a fact. List anything you could not find under gaps.`, {
    label: `research:${t.key}`, phase: 'Research', schema: FACTS_SCHEMA,
  }),
  async (res, t) => {
    if (!res) return null
    const factsJson = JSON.stringify(res.facts)
    const verdicts = await parallel(LENSES.map((l) => () =>
      agent(`${CONTEXT}\n\nYou are verifying a researcher's dataset for topic "${t.title}".\n${l.prompt}\n\nThe researcher was asked:\n${t.prompt}\n\nDATASET (JSON):\n${factsJson}\n\nReturn one check per fact key. Under missing, list requested items the researcher omitted.`, {
        label: `verify-${l.key}:${t.key}`, phase: 'Verify', schema: VERDICT_SCHEMA,
      })))
    return { res, verdicts: verdicts.filter(Boolean) }
  },
  async (v, t) => {
    if (!v) return null
    const merged = await agent(`${CONTEXT}\n\nYou are the final editor for topic "${t.title}". Below are a researcher's dataset and the verdicts of two independent verifiers (a source checker and a skeptic). Produce the FINAL dataset:\n- Apply corrections both verifiers agree on.\n- Where verifiers disagree with each other or with the researcher, settle it yourself with a targeted web search and say how in notes.\n- Downgrade status where a claim could not be confirmed (verified -> claimed/estimate; canon_stated -> claimed). Never upgrade without evidence.\n- Fill items the verifiers listed as missing if you can source them quickly; otherwise list them in gaps.\n- Keep sources for every fact (url required).\n\nORIGINAL REQUEST:\n${t.prompt}\n\nDATASET:\n${JSON.stringify(v.res.facts)}\n\nRESEARCHER GAPS:\n${JSON.stringify(v.res.gaps)}\n\nVERDICTS:\n${JSON.stringify(v.verdicts)}`, {
      label: `merge:${t.key}`, phase: 'Merge', schema: FACTS_SCHEMA,
    })
    return { topic: t.key, final: merged, verdicts: v.verdicts }
  },
)

const out = {}
for (const r of results.filter(Boolean)) out[r.topic] = r
log(`Topics completed: ${Object.keys(out).join(', ')}`)
return out
