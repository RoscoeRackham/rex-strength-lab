export const meta = {
  name: 'rex-audit-fixes',
  description: 'Fix the 54 confirmed audit findings in four serial batches (density/weight, catch, collide/wrestle, arm/duo/misc), then re-verify every finding on the final build',
  phases: [{ title: 'Fix', detail: 'four batches, one after another on the same files' }, { title: 'Re-verify', detail: 'two reviewers re-run every reproduction on the final build' }],
}
const S = '/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/'
const CTX = `You are fixing confirmed audit findings in the "Rex Super-Strength Lab" physics simulator at /home/user/dino-strength-sim.
Findings file: ${S}audit-final.json. It is a JSON array of 4 lenses (physics, regression, data, ux). Each has a "confirmed" array. IDs are the lens initial plus the index in that array: p0 = physics.confirmed[0], r3 = regression.confirmed[3], d4 = data.confirmed[4], u10 = ux.confirmed[10]. Each finding has title, claim, evidence (exact repro), fix, and a skeptic's verdict with a refined fix. Line numbers may have drifted; search by content.
Files: src/engine.js (physics), src/app.html (page text and UI), src/static-data.js (assumption cards), research/final-*.json (sourced facts; build-data.py turns them into src/data.js), test/calibration.js (tests).
Build and test after every few fixes: cd /home/user/dino-strength-sim && python3 build-data.py && node build.js && node test/shots.js && node test/calibration.js   (calibration must end "all checks passed"; it takes about 75 s).
Render any page state and dump its text to check your fix: node ${S}a3/weightshot.js '[["name",1280,{STATE}]]'  (state keys: see DEFAULTS in src/app.html; screenshots land in ${S}a3/<name>.png; add "dark" as a 4th element for dark mode; use 390 for phone width).
Rules:
- Fix the root cause, minimally and consistently; do not widen scope. If two findings conflict, choose the physically correct option and say why.
- For each critical or major physics fix, add a regression check to test/calibration.js.
- Page text: plain, short sentences; every number sourced or labelled an estimate; never invent canon about Ollie (bull-man with horns, nose ring, earrings, vest, cargo pants, boots: no claws). Rex and Ollie are equally strong and equally indestructible.
- Do NOT change: the BUILDS / DEFAULT_BODIES values in src/engine.js (marked provisional; set separately), the art figures and avatars, or the line that forces state.oSame = true on load.
- Do not commit or push. Other agents fix other batches after you, on the same files: leave the tree building and passing.
Return a list of every finding ID in your batch with what you changed (file and function) and how you verified it, or why you left it.`
const BATCHES = [
  { key: 'density-weight', ids: 'p0, p6, p7, p8, d2, d5, d6, d8, d12, u3, u6, u8, r9, r3, u14', note: 'Weight tab, settle/fall-through, neutron-matter caveat, run/walk rules, Pull tab standing check, phone-width charts. p0 (settle units) is critical: fix it first and add the suggested check.' },
  { key: 'catch', ids: 'p1, p3, d4, p5, p12, r0, r10, r4, r5, r6, r7, u4, u9, u12, d9, d11', note: 'Game of catch and the solo Throw release-angle issue (r0/r10 share a root cause). p1 (energy released at the catcher in relativistic catches) is critical. For d4, use the object crush values only where they mean whole-object strength; otherwise label or add a separate strength. For d9 and d11, correct or add research facts.' },
  { key: 'collide-wrestle', ids: 'p4, u2, r2, u0, d3, d10, u5, u7, r1, u11, p11', note: 'Unstoppable force vs immovable object (Push and Charge), Wrestle tab. u0 (three tabs disagree on the same setup) is critical: make the tabs consistent, or state clearly why they model different situations.' },
  { key: 'arm-duo-misc', ids: 'p2, p9, p10, d0, d1, d13, u1, r8, u10, d7, r11, u13', note: 'Arm wrestling, the duo gate and fighter cards, assumption cards, Lift tile label, tiny-mass input, number formatting.' },
]
const REPORT = { type: 'object', properties: { items: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, status: { type: 'string', enum: ['fixed', 'partly', 'left'] }, change: { type: 'string' }, verified: { type: 'string' } }, required: ['id', 'status', 'change'] } }, testsPass: { type: 'boolean' }, notes: { type: 'string' } }, required: ['items', 'testsPass'] }
const reports = []
for (const b of BATCHES) {
  phase('Fix')
  const r = await agent(CTX + '\n\nYOUR BATCH (' + b.key + '): ' + b.ids + '.\n' + b.note, { label: 'fix:' + b.key, phase: 'Fix', schema: REPORT })
  reports.push({ batch: b.key, report: r })
  log(b.key + ': ' + (r ? r.items.filter((x) => x.status === 'fixed').length + '/' + r.items.length + ' fixed, tests ' + (r.testsPass ? 'pass' : 'FAIL') : 'no report'))
}
const VER = { type: 'object', properties: { items: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, fixed: { type: 'boolean' }, evidence: { type: 'string' }, regression: { type: 'string' } }, required: ['id', 'fixed', 'evidence'] } }, newIssues: { type: 'string' } }, required: ['items', 'newIssues'] }
const HALVES = ['p0 p1 p2 p3 p4 p5 p6 p7 p8 p9 p10 p11 p12 r0 r1 r2 r3 r4 r5 r6 r7 r8 r9 r10 r11', 'd0 d1 d2 d3 d4 d5 d6 d7 d8 d9 d10 d11 d12 d13 u0 u1 u2 u3 u4 u5 u6 u7 u8 u9 u10 u11 u12 u13 u14']
const ver = await parallel(HALVES.map((ids, i) => () => agent(CTX + '\n\nYou are now a SKEPTICAL RE-VERIFIER, not a fixer: do not edit project files (scratch scripts under ' + S + 'reverify/ only). Rebuild once, then for each of these finding IDs re-run its original reproduction on the current build and decide whether it is really fixed, and whether the fix introduced a new problem nearby: ' + ids + '.\n\nFixers\' reports:\n' + JSON.stringify(reports, null, 1), { label: 'reverify:' + (i + 1), phase: 'Re-verify', schema: VER })))
return { reports, verify: ver.filter(Boolean) }
