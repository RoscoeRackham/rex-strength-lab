export const meta = {
  name: 'canon-review',
  description: 'Adversarial review round of a BRIEF-canon.md pull request: one reviewer per lens finds defects, one skeptic per lens reproduces or refutes each finding with code',
  phases: [
    { title: 'Review', detail: 'one reviewer per lens, each in its own clone' },
    { title: 'Verify', detail: 'one skeptic per lens reproduces or refutes each finding' },
  ],
}
const A = args || {}
const REPO = '/home/user/rex-strength-lab'
const SCR = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr' + A.pr + '-r' + A.round + '/'
const CTX = `You are an independent reviewer of a change to the Rex Super-Strength Lab (rex-strength-lab/ in the repo ${REPO}), a self-contained HTML page (a claude.ai Artifact) that simulates Rex and Ollie. CLAUDE.md is already loaded for you: its canon (especially "Rulings of 14 Oct 2026", "Momentum", "Default powers", "Restraint and absorption") and the owner's standard apply. The change is pull request ${A.pr} of rex-strength-lab/BRIEF-canon.md, on branch ${A.branch} (base ${A.base}). ${A.what}
Read BRIEF-canon.md (${A.items}; "Rules for every item"; the Answers) and RUN-canon.md. The author's decisions are in the README section named below and the pull request; check whether each is justified by the canon, the physics and the code, and stated where the owner will see it. Do not report a decision as a defect merely because it departs from the brief's letter, unless it is wrong, unjustified or not stated.
DECISIONS AND CONTEXT FROM THE AUTHOR:
${A.decisions}
WORK IN YOUR OWN CLONE, never in ${REPO} (another process may be using it): mkdir -p ${SCR}<your-lens>/ && git clone -q ${REPO} ${SCR}<your-lens>/repo && cd ${SCR}<your-lens>/repo && git checkout -q ${A.branch} && git log --oneline -1. Diff: git diff ${A.base}...${A.branch} (the base's files: git show ${A.base}:<path>). Build: cd rex-strength-lab && python3 build-data.py && node build.js (git status must stay clean: generated files match). Tests (4 shared CPUs: run one at a time, only what you need): node test/calibration.js, node test/presence.js, node test/shots.js (several minutes; writes dist/preview.html and shots/), node test/powers.js (4 min; --skip-off skips the 75 s powers-off part), node test/ladder.js, node test/sweep.js. Engine in Node: const P = require('<clone>/rex-strength-lab/src/engine.js'); global.window = {}; require('<clone>/rex-strength-lab/src/data.js'); const D = window.DINO_DATA; bodies P.makeBody({ build: 'rex', ...P.DEFAULT_BODIES.rex }) (3,000 kg); a ctx is { F: kg * P.K.g, mode: 'comic'|'real', body, surface: D.surfaces.find(s => s.id === 'concrete'), anchor: 'friction'|'bolted', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, use }. The page's default dial is 100 short tons (90,718.474 kg-force). Render the page with Playwright: const { chromium } = require('/opt/node22/lib/node_modules/playwright'); chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }); wrap dist/index.html in '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>' and load it from a file URL in your scratch folder (or reuse test/shots.js's helpers: read it first). Settings persist in localStorage key 'rex-lab-v1'. window.DinoPhys is the engine, window.DINO_DATA the data. Background searches finish asynchronously: wait until no 'working it out' / 'Working out' text remains.
The owner is a professional critic: factual accuracy and honest labelling come first. Every finding must be REPRODUCED: give the exact input or place, what the page or code does (quote it, or your script's output), what is correct and why (with numbers), and a minimal fix. Report real defects only: wrong physics or formulas, momentum or energy bookkeeping errors, behaviour the brief or canon requires that is missing or wrong, results that changed with the powers off, wrong or unsupported claims, contradictions between page text and engine numbers, broken layout or controls, accessibility failures, state or migration bugs, tests that don't test what they say. Skip style preferences. Do NOT edit ${REPO}; do not commit or push anything.` + (A.prior ? '\n\nThis is review round ' + A.round + '. Earlier rounds found and fixed the items below; check each fix holds, look for regressions, and look for anything missed:\n' + A.prior : '')
const FINDINGS = { type: 'object', properties: {
  findings: { type: 'array', items: { type: 'object', properties: {
    id: { type: 'string' }, severity: { type: 'string', enum: ['critical', 'major', 'minor'] }, title: { type: 'string' }, location: { type: 'string' },
    evidence: { type: 'string' }, expected: { type: 'string' }, fix: { type: 'string' } }, required: ['id', 'severity', 'title', 'location', 'evidence', 'expected', 'fix'] } },
  verified_ok: { type: 'array', items: { type: 'string' } } }, required: ['findings', 'verified_ok'] }
const VERDICTS = { type: 'object', properties: {
  verdicts: { type: 'array', items: { type: 'object', properties: {
    id: { type: 'string' }, real: { type: 'boolean' }, severity: { type: 'string', enum: ['critical', 'major', 'minor', 'not_a_bug'] }, reasoning: { type: 'string' }, reproduction: { type: 'string' }, better_fix: { type: 'string' } }, required: ['id', 'real', 'severity', 'reasoning', 'reproduction'] } } }, required: ['verdicts'] }
const keys = Object.keys(A.lenses)
const results = await pipeline(keys,
  (k) => agent(CTX + '\n\n' + A.lenses[k] + '\n\nUnder verified_ok, list what you checked and found correct (with the numbers). Prefix finding ids with "' + k + '-".', { label: 'review:' + k, phase: 'Review', schema: FINDINGS }),
  (res, k) => {
    if (!res) return null
    if (!res.findings.length) return { lens: k, verified_ok: res.verified_ok, findings: [] }
    return agent(CTX + '\n\nAnother reviewer (' + k + ' lens) reported the findings below. For EACH one, try hard to REFUTE it: reproduce it yourself with your own script or browser run, independently of theirs, in your own clone under ' + SCR + 'verify-' + k + '/. Mark real=true only if you reproduced it; put the command and its output in reproduction. Check whether it is a real defect under the canon and the brief (a recorded, justified decision is not a defect). Confirm the severity and give the best minimal fix (exact code or text). Default to real=false if you cannot reproduce it.\n\nFINDINGS:\n' + JSON.stringify(res.findings, null, 1), { label: 'verify:' + k, phase: 'Verify', schema: VERDICTS })
      .then((v) => ({ lens: k, verified_ok: res.verified_ok, findings: res.findings.map((f) => Object.assign({}, f, { verdict: (v && v.verdicts || []).find((x) => x.id === f.id) || null })) }))
  })
return results.filter(Boolean)
