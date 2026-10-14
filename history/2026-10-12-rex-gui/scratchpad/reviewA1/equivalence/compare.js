// Compare main vs branch results, after mapping main's text through the intended wording changes.
// Usage: node compare.js out0.jsonl out1.jsonl ...
const fs = require('fs');
const recs = process.argv.slice(2).flatMap((f) => fs.readFileSync(f, 'utf8').trim().split('\n').filter(Boolean).map(JSON.parse));
const INTENDED = [
  [' To stay put he needs to dig in: try “Claws dug in” or “Bolted to the planet” under Settings.', ' To stay put he needs to be bolted: turn on Bolted to the planet for Rex in Their powers.'],
  ['Pick firmer ground under Settings, or turn on Comic ground.', 'Pick firmer ground under Ground, or turn on Comic ground in Their powers.'],
  ['Pick soil, paving or rock under Settings to see the shaking.', 'Pick soil, paving or rock under Ground to see the shaking.'],
  ['(under Comic switches)', '(under Their powers)'],
  ['Pick a growth mode under Comic switches', 'Pick a growth mode under Their powers'],
  [' (plus a little claw or boot bite if dug in)', ''],
  ['A heavier body, or one dug in, wins.', 'A heavier body wins.'],
  [', plus shear × buried area if dug in', ''],
  [' (+ shear × buried area if dug in; unlimited if bolted)', ' (unlimited if bolted)'],
  [' + ¼ shear × buried area if dug in', ''],
  ['’s footing take most of it', '’s footing takes most of it'],
];
const mapMain = (t) => {
  if (typeof t !== 'string') return t;
  for (const [a, b] of INTENDED) t = t.split(a).join(b);
  // the shoving-match verdict no longer lower-cases a name
  t = t.replace(/Pushing straight across: (rex|ollie)\b/g, (m, n) => 'Pushing straight across: ' + n.charAt(0).toUpperCase() + n.slice(1));
  return t;
};
const FIELDS = ['verdict', 'status', 'tiles', 'effort', 'happens', 'callout', 'math', 'cases', 'all'];
let nCmp = 0, nTabs = 0, nTimeout = 0;
const diffs = [], raw = [], errs = [];
for (const r of recs) {
  if (!r.main || !r.branch) continue;
  if (r.main.crash || r.branch.crash) { errs.push([r.id, 'crash', r.main.crash, r.branch.crash]); continue; }
  if (r.main.errors.length || r.branch.errors.length) errs.push([r.id, 'errors', r.main.errors, r.branch.errors]);
  if (r.main.notes.length || r.branch.notes.length) if (JSON.stringify(r.main.notes) !== JSON.stringify(r.branch.notes)) errs.push([r.id, 'notes differ', r.main.notes, r.branch.notes]);
  for (const g of ['solo', 'duo']) for (const t of Object.keys(r.main[g] || {})) {
    const a = r.main[g][t], b = (r.branch[g] || {})[t];
    nTabs++;
    if (!b || a.timeout || b.timeout) { nTimeout++; errs.push([r.id, g, t, 'timeout', !!a.timeout, !b || !!b.timeout]); continue; }
    for (const k of FIELDS) {
      nCmp++;
      const A = JSON.stringify(a[k]), B = JSON.stringify(b[k]);
      if (A !== B) raw.push([r.id, g, t, k]);
      const Am = JSON.stringify(Array.isArray(a[k]) ? a[k].map(mapMain) : mapMain(a[k]));
      if (Am !== B) diffs.push({ id: r.id, g, t, k, M: a[k], B: b[k] });
    }
  }
}
console.log('records', recs.length, 'tabs compared', nTabs, 'field comparisons', nCmp, 'timeouts', nTimeout);
console.log('raw differences (before intended mapping):', raw.length);
const rawByKind = {};
for (const [id, g, t, k] of raw) rawByKind[g + '/' + t + '/' + k] = (rawByKind[g + '/' + t + '/' + k] || 0) + 1;
console.log(rawByKind);
console.log('unexplained differences:', diffs.length);
for (const d of diffs.slice(0, Number(process.env.SHOW || 40))) {
  // show the first point of difference
  const A = JSON.stringify(Array.isArray(d.M) ? d.M.map(mapMain) : mapMain(d.M)), B = JSON.stringify(d.B);
  let i = 0; while (i < A.length && A[i] === B[i]) i++;
  console.log('\n' + d.id, d.g, d.t, d.k, '@' + i, '\n  M: …' + A.slice(Math.max(0, i - 150), i + 250), '\n  B: …' + B.slice(Math.max(0, i - 150), i + 250));
}
console.log('\nerrors/notes:', errs.length);
for (const e of errs.slice(0, 30)) console.log(JSON.stringify(e).slice(0, 600));
