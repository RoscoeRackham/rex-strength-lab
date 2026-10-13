// Braced states: the branch loading 'braced' must give exactly what 'friction' gives (on the branch, and on main after
// the intended wording changes). Also report how main's own braced results differ (the physics the page dropped).
const fs = require('fs');
const recs = fs.readFileSync(process.argv[2], 'utf8').trim().split('\n').map(JSON.parse);
const by = Object.fromEntries(recs.map((r) => [r.id, r]));
const INTENDED = require('./intended.js');
const F = ['verdict', 'status', 'tiles', 'effort', 'happens', 'callout', 'math', 'cases', 'all'];
const eq = (a, b, map) => { const bad = []; for (const g of ['solo', 'duo']) for (const t of Object.keys(a[g] || {})) for (const k of F) { const x = a[g][t][k], y = (b[g][t] || {})[k]; const X = JSON.stringify(map ? (Array.isArray(x) ? x.map(INTENDED) : INTENDED(x)) : x); if (X !== JSON.stringify(y)) bad.push(g + '/' + t + '/' + k); } return bad; };
let checks = 0, fails = 0;
const swap = { b: 'f', f: 'f', o: 'o' };
for (const r of recs) {
  const m = /^braced(\d+)(\w)(\w)$/.exec(r.id);
  if (!m || (m[2] !== 'b' && m[3] !== 'b')) continue;
  const twin = by['braced' + m[1] + swap[m[2]] + swap[m[3]]];
  if (!twin) { console.log('no twin for', r.id); continue; }
  const a = eq(r.branch, twin.branch, false); checks++;
  const b = eq(twin.main, r.branch, true); checks++;
  const c = eq(r.main, twin.main, false);
  if (a.length) { fails++; console.log(r.id, 'branch(braced) vs branch(friction) differ:', a.join(' ')); }
  if (b.length) { fails++; console.log(r.id, 'branch(braced) vs main(friction) differ:', b.join(' ')); }
  if (r.branch.errors.length) { fails++; console.log(r.id, 'branch errors', r.branch.errors); }
  const saved = r.branch.finalState || {};
  if (saved.anchor === 'braced' || saved.oAnchor === 'braced') { fails++; console.log(r.id, 'branch still saves braced', saved.anchor, saved.oAnchor); }
  console.log(r.id, 'ok-equal:', !a.length && !b.length, '| main(braced) differs from main(friction) in', c.length, 'fields', c.slice(0, 6).join(' '));
}
for (const r of recs.filter((x) => x.id.startsWith('group-'))) {
  const d = r.id.slice(6);
  const bad = eq(r.main, r.branch, true); checks++;
  const st = r.branch.finalState || {};
  console.log(r.id, 'main group duo vs branch (no duoOpen saved):', bad.length ? 'DIFFER ' + bad.join(' ') : 'same', '| branch saved duoOpen', st.duoOpen, 'group' in st ? 'group KEPT' : 'group dropped', '| timeouts', JSON.stringify(r.branch.duo[d] && r.branch.duo[d].timeout));
  if (bad.length) fails++;
}
console.log('checks', checks, 'fails', fails);
