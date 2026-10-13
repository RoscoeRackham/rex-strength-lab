// Compare main vs branch results after mapping main's text through the intended wording changes.
// Usage: node compare.js out0.jsonl out1.jsonl ...
const fs = require('fs');
const { mapMain, mapSprintBolted, ADDED_EFFORT } = require('./intended.js');
const recs = process.argv.slice(2).flatMap((f) => fs.readFileSync(f, 'utf8').trim().split('\n').filter(Boolean).map(JSON.parse));
const FIELDS = ['verdict', 'status', 'tiles', 'effort', 'happens', 'callout', 'math', 'cases', 'ctl', 'svg', 'all'];
const mapAll = (x, f) => (Array.isArray(x) ? x.map(f) : f(x));
let nCmp = 0, nTabs = 0, nTimeout = 0, nSprintBolt = 0, nAddedEffort = 0;
const diffs = [], raw = [], errs = [];
const rawKinds = {};
for (const r of recs) {
  if (!r.main || !r.branch) continue;
  if (r.main.crash || r.branch.crash) { errs.push([r.id, 'crash', r.main.crash, r.branch.crash]); continue; }
  if (r.main.errors.length || r.branch.errors.length) errs.push([r.id, 'errors', r.main.errors, r.branch.errors]);
  if (JSON.stringify(r.main.notes) !== JSON.stringify(r.branch.notes)) errs.push([r.id, 'notes differ', r.main.notes, r.branch.notes]);
  else if (r.main.notes.length) errs.push([r.id, 'notes (same on both)', r.main.notes]);
  if (r.main.dial !== r.branch.dial) diffs.push({ id: r.id, g: 'page', t: 'dial', k: 'dial', M: r.main.dial, B: r.branch.dial });
  if (r.main.ladder || r.branch.ladder) { nCmp++; if (JSON.stringify(r.main.ladder) !== JSON.stringify(r.branch.ladder)) diffs.push({ id: r.id, g: 'page', t: 'ladder', k: 'ladder', M: r.main.ladder, B: r.branch.ladder }); }
  for (const g of ['solo', 'duo']) for (const t of Object.keys(r.main[g] || {})) {
    const a = r.main[g][t], b = (r.branch[g] || {})[t];
    nTabs++;
    if (!b || a.timeout || b.timeout) { nTimeout++; errs.push([r.id, g, t, 'timeout', !!a.timeout, !b || !!b.timeout]); continue; }
    const bolted = t === 'sprint' && JSON.stringify(b).includes('bolted: no friction limit');
    if (bolted) nSprintBolt++;
    for (const k of FIELDS) {
      nCmp++;
      const A = JSON.stringify(a[k]);
      let Bv = b[k];
      if (bolted && JSON.stringify(Bv).match(ADDED_EFFORT)) { nAddedEffort++; Bv = mapAll(Bv, (s) => (typeof s === 'string' ? s.replace(ADDED_EFFORT, '').replace(/\s+/g, ' ').trim() : s)); }
      const B = JSON.stringify(b[k]);
      if (A !== B) { raw.push([r.id, g, t, k]); rawKinds[g + '/' + t + '/' + k] = (rawKinds[g + '/' + t + '/' + k] || 0) + 1; }
      let Am = mapAll(a[k], mapMain);
      if (bolted) Am = mapAll(Am, mapSprintBolted);
      // the added sentence sits alone in its own happens item in 'happens' and inside 'all': normalise spaces both sides
      const norm = (x) => JSON.stringify(mapAll(x, (s) => (typeof s === 'string' ? s.replace(/\s+/g, ' ').trim() : s)));
      if (norm(Am) !== norm(Bv)) diffs.push({ id: r.id, g, t, k, M: Am, B: Bv });
    }
  }
}
console.log('records', recs.length, 'tabs compared', nTabs, 'field comparisons', nCmp, 'timeouts', nTimeout, 'sprint-bolted tabs', nSprintBolt, 'with the added effort sentence', nAddedEffort);
console.log('raw differences (before intended mapping):', raw.length);
console.log(rawKinds);
console.log('unexplained differences:', diffs.length);
const byKind = {};
for (const d of diffs) byKind[d.g + '/' + d.t + '/' + d.k] = (byKind[d.g + '/' + d.t + '/' + d.k] || 0) + 1;
console.log(byKind);
for (const d of diffs.slice(0, Number(process.env.SHOW || 40))) {
  const A = JSON.stringify(d.M), B = JSON.stringify(d.B);
  let i = 0; while (i < A.length && A[i] === B[i]) i++;
  console.log('\n' + d.id, d.g, d.t, d.k, '@' + i, '\n  M: …' + (A || '').slice(Math.max(0, i - 200), i + 300), '\n  B: …' + (B || '').slice(Math.max(0, i - 200), i + 300));
}
console.log('\nerrors/notes:', errs.length);
for (const e of errs.slice(0, 40)) console.log(JSON.stringify(e).slice(0, 700));
