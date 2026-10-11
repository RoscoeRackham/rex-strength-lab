export const meta = {
  name: 'rex-fix-verification',
  description: 'Check every confirmed second-audit finding is fixed in the current Rex lab build, and hunt for regressions from the fixes',
  phases: [
    { title: 'Check fixes', detail: 'one checker per lens over its findings, plus a regression hunt' },
    { title: 'Verify', detail: 'refutation attempt per reported problem' },
  ],
}

const SCRATCH = '/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad'
const CONTEXT = `You are checking fixes in "Rex Super-Strength Lab", a single-page physics simulator for an indestructible plush dinosaur named Rex (default 2 m, 180 kg; strength from 511 kg deadlift to infinite).
Files (do NOT edit anything under /home/user/dino-strength-sim; scratch work goes in ${SCRATCH}/audit3/):
- Engine: /home/user/dino-strength-sim/src/engine.js (Node: global.window = {}; require engine; require('/home/user/dino-strength-sim/src/data.js') -> window.DINO_DATA)
- Page source: /home/user/dino-strength-sim/src/app.html; data generator: /home/user/dino-strength-sim/build-data.py; static text: src/static-data.js
- Built page: /home/user/dino-strength-sim/dist/index.html; browser wrapper dist/preview.html (regenerate with node /home/user/dino-strength-sim/test/shots.js, which also screenshots). Playwright: require('/opt/node22/lib/node_modules/playwright'), launch { executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }. Settings live in localStorage 'rex-lab-v1' ({logKg, inf, mode, surface, groundHolds, anchor, H, m, action, obj, angle}). Thresholds on the strength ladder compute asynchronously; wait ~5 s after load.
- Tests: node /home/user/dino-strength-sim/test/calibration.js (fast); test/sweep.js is slow (~9 min), skip unless needed.
The owner is a professional critic: accuracy and honest labelling come first. Report only real problems with a concrete repro, what is shown, what is correct, and a minimal fix.`

const FINDINGS_FILE = SCRATCH + '/audit2-args.json'
const LENSES = ['claims', 'regression', 'data', 'ux']

const PROBLEMS = {
  type: 'object',
  properties: {
    not_fixed: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, evidence: { type: 'string' }, fix: { type: 'string' } }, required: ['id', 'evidence', 'fix'] } },
    new_problems: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, severity: { type: 'string', enum: ['critical', 'major', 'minor'] }, title: { type: 'string' }, evidence: { type: 'string' }, fix: { type: 'string' } }, required: ['id', 'severity', 'title', 'evidence', 'fix'] } },
    fixed: { type: 'array', items: { type: 'string' } },
  },
  required: ['not_fixed', 'new_problems', 'fixed'],
}
const VERDICT = {
  type: 'object',
  properties: { real: { type: 'boolean' }, severity: { type: 'string', enum: ['critical', 'major', 'minor', 'not_a_bug'] }, reasoning: { type: 'string' }, better_fix: { type: 'string' } },
  required: ['real', 'severity', 'reasoning'],
}

const results = await pipeline(
  LENSES,
  (lens) => agent(`${CONTEXT}\n\nThe findings under the key "${lens}" in the JSON file ${FINDINGS_FILE} (read it first) were confirmed in the previous audit and should now be fixed. For EACH one, reproduce the original repro against the current build and decide: fixed, or not fixed (with evidence). Then spend remaining effort hunting for NEW problems introduced by the fixes in the same area (wrong numbers, contradictions, broken UI, NaN/Infinity leaks, regressions in calibration or monotonicity).`, { label: `check:${lens}`, phase: 'Check fixes', schema: PROBLEMS }),
  async (res, lens) => {
    if (!res) return null
    const items = [...res.not_fixed.map((p) => ({ kind: 'not_fixed', ...p })), ...res.new_problems.map((p) => ({ kind: 'new', ...p }))]
    const checked = await parallel(items.map((p) => () =>
      agent(`${CONTEXT}\n\nA checker reported this problem. Try to REFUTE it by reproducing it yourself against the current build. If real, give severity and the best minimal fix. Default to real=false if you cannot reproduce it.\n\nREPORT:\n${JSON.stringify(p, null, 2)}`, { label: `verify3:${lens}:${p.id}`, phase: 'Verify', schema: VERDICT })
        .then((v) => ({ ...p, verdict: v }))))
    return { lens, fixed: res.fixed, problems: checked.filter(Boolean) }
  },
)
return results.filter(Boolean)
