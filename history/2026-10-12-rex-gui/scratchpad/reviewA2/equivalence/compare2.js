// Targeted cases: braced migration (branch(braced) == branch(friction) == main(friction) after the intended edits),
// the saved group 'duo', and everything else main vs branch. Usage: node compare2.js out2-*.jsonl
const fs = require('fs');
const { mapMain, mapSprintBolted, ADDED_EFFORT } = require('./intended.js');
const recs = process.argv.slice(2).flatMap((f) => fs.readFileSync(f, 'utf8').trim().split('\n').filter(Boolean).map(JSON.parse));
const by = Object.fromEntries(recs.map((r) => [r.id, r]));
const F = ['verdict', 'status', 'tiles', 'effort', 'happens', 'callout', 'math', 'cases', 'ctl', 'svg', 'all'];
const norm = (s) => (typeof s === 'string' ? s.replace(/\s+/g, ' ').trim() : s);
const mapAll = (x, f) => (Array.isArray(x) ? x.map(f) : f(x));
const prep = (x, isMain, bolted) => { let y = x; if (isMain) { y = mapAll(y, mapMain); if (bolted) y = mapAll(y, mapSprintBolted); } else if (bolted) y = mapAll(y, (s) => (typeof s === 'string' ? s.replace(ADDED_EFFORT, '') : s)); return JSON.stringify(mapAll(y, norm)); };
// fields of a vs b; aMain: a is main's text (mapped)
function eq(a, b, aMain) {
  const bad = [];
  for (const g of ['solo', 'duo']) for (const t of Object.keys(a[g] || {})) {
    const x = a[g][t], y = (b[g] || {})[t];
    if (!y) { bad.push(g + '/' + t + '/missing'); continue; }
    if (x.timeout || y.timeout) { bad.push(g + '/' + t + '/timeout'); continue; }
    const bolted = t === 'sprint' && JSON.stringify(y).includes('bolted: no friction limit');
    for (const k of F) if (prep(x[k], aMain, bolted) !== prep(y[k], false, bolted)) bad.push(g + '/' + t + '/' + k);
  }
  if (aMain !== null && a.ladder && JSON.stringify(a.ladder) !== JSON.stringify(b.ladder)) bad.push('ladder');
  if (a.dial !== b.dial) bad.push('dial');
  return bad;
}
let checks = 0, fails = 0;
const show = (r, bad) => { for (const k of bad.slice(0, 3)) { const [g, t, f] = k.split('/'); if (!r.main[g] || !r.main[g][t]) continue; const A = JSON.stringify(mapAll(r.main[g][t][f], mapMain)), B = JSON.stringify(r.branch[g][t][f]); let i = 0; while (i < A.length && A[i] === B[i]) i++; console.log('    ' + k + ' @' + i + '\n      M: …' + (A || '').slice(Math.max(0, i - 150), i + 250) + '\n      B: …' + (B || '').slice(Math.max(0, i - 150), i + 250)); } };
const swap = { b: 'f', f: 'f', o: 'o' };
for (const r of recs) {
  const errs = [].concat(r.main && r.main.errors || [], r.branch && r.branch.errors || []);
  if (errs.length) { fails++; console.log(r.id, 'page errors', errs.slice(0, 3)); }
  const m = /^braced(\d+)(\w)(\w)$/.exec(r.id);
  if (m) {
    if (m[2] !== 'b' && m[3] !== 'b') {
      // no braced side: plain main vs branch
      const bad = eq(r.main, r.branch, true); checks++;
      if (bad.length) { fails++; console.log(r.id, 'main vs branch differ:', bad.join(' ')); show(r, bad); }
      continue;
    }
    const twin = by['braced' + m[1] + swap[m[2]] + swap[m[3]]];
    if (!twin) { console.log('no twin for', r.id); continue; }
    const a = eq(r.branch, twin.branch, false); checks++;
    const b = eq(twin.main, r.branch, true); checks++;
    const c = eq(r.main, twin.main, false);
    if (a.length) { fails++; console.log(r.id, 'branch(braced) vs branch(friction) differ:', a.join(' ')); }
    if (b.length) { fails++; console.log(r.id, 'branch(braced) vs main(friction) differ:', b.join(' ')); }
    const saved = r.branch.finalState || {};
    if (saved.anchor === 'braced' || saved.oAnchor === 'braced') { fails++; console.log(r.id, 'branch still saves braced', saved.anchor, saved.oAnchor); }
    console.log(r.id, 'branch(braced)==branch(friction)==main(friction):', !a.length && !b.length, '| main(braced) differs from main(friction) in', c.length, 'fields:', c.slice(0, 8).join(' '));
    continue;
  }
  const bad = eq(r.main, r.branch, true); checks++;
  const st = r.branch.finalState || {};
  let extra = '';
  if (r.id.startsWith('group-')) extra = ' | branch saved duoOpen ' + st.duoOpen + ('group' in st ? ' group KEPT' : ' group dropped');
  if (bad.length) { fails++; console.log(r.id, 'DIFFER', bad.join(' ') + extra); show(r, bad); }
  else console.log(r.id, 'same' + extra);
}
console.log('checks', checks, 'fails', fails);
