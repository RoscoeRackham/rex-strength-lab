export const meta = {
  name: 'rex-mass-from-picture',
  description: 'Estimate Rex (and Ollie) body volume and mass from the reference picture at a 10 ft height, three independent methods plus an adversarial check',
  phases: [{ title: 'Estimate', detail: 'three independent methods: pixel silhouette slices, segment solids, anthropometric scaling' }, { title: 'Check', detail: 're-measure, check arithmetic and assumptions, reconcile' }],
}
const IMG = '/root/.claude/uploads/6435a7db-fe21-5f3b-bca9-e49ba2609387/89c1d7ad-image.jpg'
const OUT = '/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/mass/'
const CTX = `Task: estimate the body volume and mass of two characters from one reference picture, for a physics simulator.
Picture: ${IMG} (1280 x 853 px JPEG; view it with the Read tool; analyse pixels with Python/PIL or numpy, e.g. python3 -c "from PIL import Image; im=Image.open('${IMG}')"). Left figure: Ollie, a hugely muscular bull-man (horns, nose ring, leather vest, dark cargo pants, laced boots, tufted tail behind him). Right figure: Rex, a hugely muscular dark scaly dinosaur (spiky crest, black tank top, belt, cargo pants with knee pads, wrist bands, clawed hands and feet, long thick tail curling out to the right). Plain grey studio background and floor. Both stand side by side at about the same distance from the camera, front view.
Owner's ruling: Rex's height is exactly 10 ft = 3.048 m. Define height as soles of the feet to the highest point of the head INCLUDING head features (Rex's crest spikes; Ollie's horns). Also report each figure's height to the top of the skull proper (excluding crest spikes / horns, and excluding Ollie's hair) so the choice can be revisited. Scale everything for Rex from his 3.048 m. For Ollie, use the same pixel scale as Rex (same distance from camera) to get his height in metres, and estimate his volume at that height.
Needed for each figure: (1) height in px and m under both definitions; (2) total body volume in m^3 at his real size (include Rex's tail; include Ollie's tail; clothing counts as body, it is tight; exclude nothing big), with a per-segment breakdown (head+neck, torso, each arm, each leg, feet, tail) so it can be checked; (3) frontal silhouette area in m^2 (for air drag); (4) area of one foot's sole touching the ground in m^2 (estimate from foot width and an assumed length); (5) whole-body density you assume with a cited source and range (lean, very muscular body; note lungs and gut gas lower whole-body density; muscle ~1,060 kg/m^3); (6) mass = volume x density, central value and a low-high range that honestly reflects the depth (front-to-back) uncertainty, perspective, and density. Front view hides depth: state every depth/width ratio you assume and why (cite human anthropometry such as ANSUR II chest depth/breadth where possible, and note these bodies are far more muscular than humans). Sanity-check against references: an average man scaled to 3.048 m (~75 kg x (3.048/1.75)^3 ~ 400 kg) and a large bodybuilder scaled to 3.048 m.
Write your scripts and a JSON of your results under ${OUT} (create it). Do not edit anything under /home/user/dino-strength-sim.`
const RESULT = { type: 'object', properties: {
  method: { type: 'string' },
  rex: { type: 'object', properties: {
    heightPx: { type: 'number' }, heightPxSkull: { type: 'number' }, mPerPx: { type: 'number' }, heightSkullM: { type: 'number' },
    volumeM3: { type: 'number' }, volumeLowM3: { type: 'number' }, volumeHighM3: { type: 'number' },
    segments: { type: 'string', description: 'per-segment volumes in m^3 with the dimensions used' },
    frontAreaM2: { type: 'number' }, footSoleM2: { type: 'number' },
    density: { type: 'number' }, densityLow: { type: 'number' }, densityHigh: { type: 'number' }, densitySource: { type: 'string' },
    massKg: { type: 'number' }, massLowKg: { type: 'number' }, massHighKg: { type: 'number' } },
    required: ['heightPx', 'mPerPx', 'volumeM3', 'volumeLowM3', 'volumeHighM3', 'segments', 'frontAreaM2', 'footSoleM2', 'density', 'massKg', 'massLowKg', 'massHighKg'] },
  ollie: { type: 'object', properties: {
    heightPx: { type: 'number' }, heightM: { type: 'number' }, heightSkullM: { type: 'number' },
    volumeM3: { type: 'number' }, volumeLowM3: { type: 'number' }, volumeHighM3: { type: 'number' }, segments: { type: 'string' },
    frontAreaM2: { type: 'number' }, footSoleM2: { type: 'number' }, massKg: { type: 'number' }, massLowKg: { type: 'number' }, massHighKg: { type: 'number' } },
    required: ['heightPx', 'heightM', 'volumeM3', 'segments', 'massKg', 'massLowKg', 'massHighKg'] },
  assumptions: { type: 'string', description: 'every depth ratio, perspective correction and density choice, with reasons' },
  sanity: { type: 'string' } }, required: ['method', 'rex', 'ollie', 'assumptions', 'sanity'] }
const METHODS = [
  { key: 'slices', text: 'METHOD A, pixel silhouette slices: segment each figure from the grey background by colour (check your mask by saving an overlay PNG and viewing it), separate the overlapping region between them sensibly, then integrate volume slice by slice (each 1-px row, and separately for arms/legs/tail where they are distinct blobs) as ellipses with width from the mask and depth = ratio x width, with region-specific ratios.' },
  { key: 'solids', text: 'METHOD B, segment solids: measure each body segment by hand from the picture (lengths and widths in px at several points), model each as ellipsoids, elliptic cylinders or frustums with stated depth ratios, and sum. Measure the tail along its curve.' },
  { key: 'girths', text: 'METHOD C, anthropometric scaling: compare each figure\'s proportions (shoulder breadth, chest, waist, upper-arm, forearm, thigh and calf widths, all as a fraction of height) against ANSUR II male means (fetch the ANSUR II report or a reliable summary) and against published measurements of elite bodybuilders; estimate volume as a scaled human volume times the squared ratio of segment widths, segment by segment, plus a separate tail volume (model it as a tapered cone measured in the picture).' },
]
const ests = await parallel(METHODS.map((m) => () => agent(CTX + '\n\n' + m.text, { label: 'estimate:' + m.key, phase: 'Estimate', schema: RESULT })))
const good = ests.filter(Boolean)
log('estimates back: ' + good.length)
const CHECK = { type: 'object', properties: {
  rexHeightPx: { type: 'number' }, rexMassKg: { type: 'number' }, rexMassLowKg: { type: 'number' }, rexMassHighKg: { type: 'number' }, rexVolumeM3: { type: 'number' },
  rexFrontAreaM2: { type: 'number' }, rexFootSoleM2: { type: 'number' }, density: { type: 'number' }, densityLow: { type: 'number' }, densityHigh: { type: 'number' }, densitySource: { type: 'string' }, densitySourceUrl: { type: 'string' },
  ollieHeightM: { type: 'number' }, ollieHeightRatio: { type: 'number', description: 'Ollie height / Rex height, same definition' }, ollieMassKg: { type: 'number' }, ollieMassLowKg: { type: 'number' }, ollieMassHighKg: { type: 'number' }, ollieVolumeM3: { type: 'number' }, ollieFrontAreaM2: { type: 'number' }, ollieFootSoleM2: { type: 'number' },
  errorsFound: { type: 'string' }, reasoning: { type: 'string', description: 'how the three were reconciled and why the range is what it is' },
  plainSummary: { type: 'string', description: '3-5 short plain sentences for the page explaining how the mass was estimated' } },
  required: ['rexMassKg', 'rexMassLowKg', 'rexMassHighKg', 'rexVolumeM3', 'rexFrontAreaM2', 'rexFootSoleM2', 'density', 'ollieHeightM', 'ollieHeightRatio', 'ollieMassKg', 'ollieMassLowKg', 'ollieMassHighKg', 'ollieVolumeM3', 'errorsFound', 'reasoning', 'plainSummary'] }
const check = await agent(CTX + '\n\nYou are the CHECKER. Three independent estimates are below. Be adversarial: re-measure the key pixel spans yourself (heights, shoulder breadth, arm and thigh widths, tail), recompute each estimate\'s arithmetic, find errors (wrong scale, double-counted overlap, implausible depth ratios, tail mis-measured), verify the density source by fetching it, and then give one reconciled central value and range for each figure. Prefer the method whose assumptions are best supported; do not just average. Round masses to 2 significant figures.\n\nESTIMATES:\n' + JSON.stringify(good, null, 1), { label: 'check', phase: 'Check', schema: CHECK })
return { estimates: good, check }
