export const meta = {
  name: 'dino-engine-audit',
  description: 'Adversarially audit the super-strength physics engine from four physics lenses, then verify each finding',
  phases: [
    { title: 'Audit', detail: '4 lenses: mechanics/relativity, muscle model, ground/materials, flight/impact/blast' },
    { title: 'Verify', detail: 'independent refutation attempt per finding' },
  ],
}

const SCRATCH = '/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad'
const CONTEXT = `You are auditing the physics engine of a "super-strength simulator": a cartoon dinosaur (indestructible, never tires, default 2 m tall / 180 kg) whose strength is set from world-record human (511 kg deadlift) up to effectively infinite. The engine computes lifts, throws (with recoil and 2-D drag flight over a round Earth), jumps, stomps, punches, claps, sprints and pulls, plus blast radii (Kinney-Graham), seismic magnitude (Gutenberg-Richter energy relation, efficiency 1e-4), crater size (Collins, Melosh & Marcus 2005) and stagnation temperature.
Engine: /home/user/dino-strength-sim/src/engine.js (CommonJS-compatible; require() it from Node 22). UI that turns results into sentences: /home/user/dino-strength-sim/src/app.html (look at the bay* functions for the claims shown to users). Existing quick checks: /home/user/dino-strength-sim/test/sanity.js.
Key design: pushApart() models an internal force F pushing two bodies apart over a stroke d, each side resisted by a constant force R (Infinity = immovable); comic mode = constant force with relativistic momentum (closed form, bisection on time); real mode = Hill force-velocity curve, numeric integration. calibrateComic() sets each action's constant drive-force share so comic equals real muscle at 511 kg strength. anchorCapacity() gives the max axial reaction from friction (mu), bearing capacity (q_ult x foot area) or claw shear.
The user is a professional critic: correctness matters more than anything. Do NOT edit files under /home/user/dino-strength-sim. Write any scratch scripts under ${SCRATCH}/audit/ (create it). Run code to prove each finding: every finding needs a concrete input, the engine's output, the correct value with your derivation or source, and a proposed fix. Report real defects only (wrong physics, wrong formula transcription, numerical failure, NaN/Infinity leaks, misleading user-facing claim that the numbers do not support). Also list important missing physics that would change a headline conclusion by more than 2x. Do not report style nits.`

const LENSES = [
  { key: 'mechanics', prompt: `LENS: Classical + relativistic mechanics. Verify pushApart() closed form (xOfT, momentum/energy helpers), conservation of momentum and work-energy (E_A + E_B = F_A*x_A + F_B*x_B), behaviour at F = Infinity, tiny F, F barely above R, huge mass ratios (Earth, Moon objects), and extreme strengths (1e40 N). Check threshold() bisection correctness and monotonicity assumptions used by the UI ladder (app.html thresholds()). Check throwObject/jump/stomp/punch/clap/pull bookkeeping (which masses, which resistances, recoil, p->v conversions, jump takeoff using pA over full body mass).` },
  { key: 'muscle', prompt: `LENS: Biomechanics and the muscle model. Check the Hill equation implementation and integration (pushApartHill), the saturated shortcut, calibrateComic(), the per-action forceFrac/vmax/effective-mass choices against the human records they claim to match (shot put 23.56 m, ~47 m/s fastest pitch, vertical jump, punch fist speed ~10 m/s), sprint caps (12.4 m/s at record strength, 19.3 m/s theoretical cap from Weyand et al. 2010), size scaling of vmax and areas, and whether UI statements about real vs comic muscle are supported. Flag any place where the model contradicts known human data by more than ~30% at the human-strength setting.` },
  { key: 'ground', prompt: `LENS: Ground, friction and materials. Check anchorCapacity() (friction cone algebra, bearing limit, theta handling, extraMass), lift() (foot pressure, grip pressure, plate/footing needed), stomp hole depth, jump ground limit, pull() resistance logic, sprint friction limit (average normal force = weight). Judge whether treating ultimate bearing capacity as a constant resisting force for a fast-moving foot is a reasonable first approximation and what it misses (inertial/penetration resistance growing with speed, Poncelet form). Check the draft surface values in /home/user/dino-strength-sim/src/data.js for plausibility (they are drafts; flag ones off by more than 3x with sources).` },
  { key: 'flight', prompt: `LENS: Flight, atmosphere, impact, blast and seismic. Verify fly(): RK4 accuracy against analytic vacuum range/apex, terminal velocity in a uniform-density fall, escape detection near 11.19 km/s, step control at hypersonic sea-level speeds, impact interpolation, range unwrapping, timeouts. Verify the exponential atmosphere (Hs = p0/(rho0 g)), the e-fold distance claim, stagnation temperature use, the Collins et al. (2005) transient crater formula transcription and when it is valid, the Kinney & Graham (1985) overpressure formula transcription (check against the published equation and a published table value), blastRadius() solver, and seismicMagnitude() (Gutenberg-Richter log10 E = 1.5 M + 4.8). Use web sources (ToolSearch "select:WebSearch,WebFetch") to confirm formula transcriptions.` },
]

const FINDINGS = {
  type: 'object',
  properties: {
    findings: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          severity: { type: 'string', enum: ['critical', 'major', 'minor'] },
          title: { type: 'string' },
          location: { type: 'string' },
          evidence: { type: 'string' },
          expected: { type: 'string' },
          fix: { type: 'string' },
        },
        required: ['id', 'severity', 'title', 'location', 'evidence', 'expected', 'fix'],
      },
    },
    verified_ok: { type: 'array', items: { type: 'string' } },
  },
  required: ['findings', 'verified_ok'],
}
const VERDICT = {
  type: 'object',
  properties: {
    real: { type: 'boolean' },
    severity: { type: 'string', enum: ['critical', 'major', 'minor', 'not_a_bug'] },
    reasoning: { type: 'string' },
    better_fix: { type: 'string' },
  },
  required: ['real', 'severity', 'reasoning'],
}

const results = await pipeline(
  LENSES,
  (l) => agent(`${CONTEXT}\n\n${l.prompt}\n\nUnder verified_ok, list the specific things you checked and found correct (with the numbers).`, { label: `audit:${l.key}`, phase: 'Audit', schema: FINDINGS }),
  async (res, l) => {
    if (!res) return null
    const checked = await parallel(res.findings.map((f) => () =>
      agent(`${CONTEXT}\n\nAnother auditor (${l.key} lens) reported this finding. Try hard to REFUTE it: rerun their evidence yourself, check their derivation and sources. If it is real, confirm severity and suggest the best minimal fix. Default to real=false if you cannot reproduce it.\n\nFINDING:\n${JSON.stringify(f, null, 2)}`, { label: `verify:${l.key}:${f.id}`, phase: 'Verify', schema: VERDICT })
        .then((v) => ({ ...f, verdict: v }))))
    return { lens: l.key, verified_ok: res.verified_ok, findings: checked.filter(Boolean) }
  },
)
return results.filter(Boolean)
