// Compare main vs branch results after mapping main's text through the intended wording changes.
// Usage: node compare.js [--a main --b branch] out0.jsonl out1.jsonl ...
const fs = require('fs');
const I = require('./intended.js');
const args = process.argv.slice(2);
let A = 'main', B = 'branch', noMap = false;
const files = [];
for (let i = 0; i < args.length; i++) { if (args[i] === '--a') A = args[++i]; else if (args[i] === '--b') B = args[++i]; else if (args[i] === '--nomap') noMap = true; else files.push(args[i]); }
const recs = files.flatMap((f) => fs.readFileSync(f, 'utf8').trim().split('\n').filter(Boolean).map(JSON.parse));
const FIELDS = ['verdict', 'status', 'tiles', 'effort', 'happens', 'callout', 'math', 'cases', 'ctl', 'svg', 'alts', 'all'];
const norm = (s) => (typeof s === 'string' ? s.replace(/\s+/g, ' ').trim() : s);
const mapAll = (x, f) => (Array.isArray(x) ? x.map(f) : typeof x === 'string' ? f(x) : x);
const hits = {}, checks = { sprintTooGentle: 0, sprintTooGentleBad: [], sprintBoltEffort: 0, sprintBoltEffortBad: [], sprintFormulaBad: [], armTearHidden: 0, armTearShown: 0, armReveal: [] };
let nCmp = 0, nTabs = 0, nTimeout = 0, nRaw = 0;
const diffs = [], errs = [];
const rawKinds = {};
const STRIP = (re) => (s) => (typeof s === 'string' ? s.replace(new RegExp(re.source, 'g'), '') : s);
for (const r of recs) {
  const ra = r[A], rb = r[B];
  if (!ra || !rb) continue;
  if (ra.crash || rb.crash) { errs.push([r.id, 'crash', ra.crash, rb.crash]); continue; }
  if (ra.errors.length || rb.errors.length) errs.push([r.id, 'errors', ra.errors, rb.errors]);
  if (JSON.stringify(ra.notes) !== JSON.stringify(rb.notes)) errs.push([r.id, 'notes differ', ra.notes, rb.notes]);
  else if (ra.notes.length) errs.push([r.id, 'notes (same on both)', ra.notes]);
  if (ra.dial !== rb.dial) diffs.push({ id: r.id, g: 'page', t: 'dial', k: 'dial', M: ra.dial, B: rb.dial });
  if (ra.featTab !== rb.featTab) diffs.push({ id: r.id, g: 'page', t: 'feat', k: 'featTab', M: ra.featTab, B: rb.featTab });
  if (ra.ladder || rb.ladder) { nCmp++; if (JSON.stringify(ra.ladder) !== JSON.stringify(rb.ladder)) diffs.push({ id: r.id, g: 'page', t: 'ladder', k: 'ladder', M: ra.ladder, B: rb.ladder }); }
  const anchorB = rb.loadedState && rb.loadedState.anchor;
  for (const g of ['solo', 'duo']) for (const t of Object.keys(ra[g] || {})) {
    const a = ra[g][t], b = (rb[g] || {})[t];
    nTabs++;
    if (!b || a.timeout || b.timeout) { nTimeout++; errs.push([r.id, g, t, 'timeout', !!a.timeout, !b || !!b.timeout]); continue; }
    // branch-side additions (Sprint), checked against the tiles before they are stripped
    let bb = JSON.parse(JSON.stringify(b)), aa = JSON.parse(JSON.stringify(a));
    if (t === 'sprint' && !noMap) {
      const H = (b.happens || []).join(' ');
      const tg = H.match(I.SPRINT_TOO_GENTLE);
      if (tg) {
        checks.sprintTooGentle++;
        const tilesT = (b.tiles || []).join(' ');
        if (!/0 N of push-off/.test(tilesT) || !/Push-off limited by effort/.test((b.status || []).join(' '))) checks.sprintTooGentleBad.push([r.id, tilesT.slice(0, 200), b.status]);
      }
      const be = H.match(I.SPRINT_BOLT_EFFORT);
      if (be) {
        checks.sprintBoltEffort++;
        const tilesT = (b.tiles || []).join(' ');
        if (!tilesT.includes(be[1] + ' of push-off')) checks.sprintBoltEffortBad.push([r.id, be[1], tilesT.slice(0, 200)]);
      }
      for (const k of FIELDS) bb[k] = mapAll(mapAll(bb[k], STRIP(I.SPRINT_TOO_GENTLE)), STRIP(I.SPRINT_BOLT_EFFORT));
      // the formula follows the footing
      const M = (b.math || []).join(' ');
      const wantBolt = anchorB === 'bolted';
      if (M && !(wantBolt ? M.includes(I.SPRINT_BOLT_FORMULA) : M.includes(I.SPRINT_STAND_FORMULA))) checks.sprintFormulaBad.push([r.id, anchorB, M.slice(0, 200)]);
      const formula = wantBolt ? I.SPRINT_BOLT_FORMULA : I.SPRINT_STAND_FORMULA;
      const mapS = (s) => {
        if (typeof s !== 'string') return s;
        s = s.split(I.SPRINT_MAIN_FORMULA).join(formula);
        if (wantBolt) s = s.replace(new RegExp(I.SPRINT_MAIN_STRENGTH.source, 'g'), (m, x) => I.SPRINT_BOLT_STRENGTH(x));
        return s;
      };
      for (const k of FIELDS) aa[k] = mapAll(aa[k], mapS);
    }
    if (t === 'arm' && g === 'duo' && !noMap) {
      const St = (a.status || []).join(' ');
      const breaks = /Table tears apart|Rex bolted|Rex’s feet|Ollie bolted|Ollie’s feet/.test(St);
      const hadTear = I.ARM_TEAR_CHIPS.some((c) => St.includes(c));
      if (hadTear && !breaks) {
        checks.armTearHidden++;
        const strip = (s) => { if (typeof s !== 'string') return s; for (const c of I.ARM_TEAR_CHIPS) s = s.split(c).join(''); return s.replace(new RegExp(I.ARM_TEAR_ITEM.source, 'g'), ''); };
        for (const k of FIELDS) aa[k] = mapAll(aa[k], strip);
        aa.svg = (aa.svg || []).filter((x) => x !== ''); bb.svg = (bb.svg || []).filter((x) => x !== '');
        // a sixth 'what happens' item can now show: accept it as a suffix, and list it
        const ah = norm((aa.happens || []).join('')), bh = norm((bb.happens || []).join(''));
        if (bh !== ah && bh.startsWith(ah)) { checks.armReveal.push([r.id, bh.slice(ah.length).slice(0, 200)]); bb.happens = aa.happens; bb.all = norm(bb.all).replace(bh.slice(ah.length).trim(), ''); aa.all = norm(aa.all); }
      } else if (hadTear) checks.armTearShown++;
    }
    for (const k of FIELDS) {
      nCmp++;
      if (JSON.stringify(a[k]) !== JSON.stringify(b[k])) { nRaw++; rawKinds[g + '/' + t + '/' + k] = (rawKinds[g + '/' + t + '/' + k] || 0) + 1; }
      const Am = noMap ? aa[k] : mapAll(aa[k], (s) => mapMain(s));
      const n2 = (x) => JSON.stringify(mapAll(x, norm));
      if (n2(Am) !== n2(bb[k])) diffs.push({ id: r.id, g, t, k, M: Am, B: bb[k] });
    }
  }
}
function mapMain(s) { return I.mapMain(s, hits); }
console.log('compare', A, 'vs', B, '| records', recs.length, 'tabs', nTabs, 'field comparisons', nCmp, 'timeouts', nTimeout, 'raw differences', nRaw);
console.log('intended mapping hits:', hits);
console.log('sprint: too-gentle sentences', checks.sprintTooGentle, 'bad', checks.sprintTooGentleBad.length, '| bolted effort sentences', checks.sprintBoltEffort, 'bad', checks.sprintBoltEffortBad.length, '| formula mismatches', checks.sprintFormulaBad.length);
console.log('arm: tear flags hidden while the table holds', checks.armTearHidden, '| tear flags still shown (table breaks)', checks.armTearShown, '| revealed sixth items', checks.armReveal.length);
for (const x of checks.sprintTooGentleBad.concat(checks.sprintBoltEffortBad, checks.sprintFormulaBad).slice(0, 10)) console.log('  check:', JSON.stringify(x));
for (const x of checks.armReveal.slice(0, 10)) console.log('  reveal:', JSON.stringify(x));
console.log('raw kinds:', JSON.stringify(rawKinds));
console.log('unexplained differences:', diffs.length);
const byKind = {};
for (const d of diffs) byKind[d.g + '/' + d.t + '/' + d.k] = (byKind[d.g + '/' + d.t + '/' + d.k] || 0) + 1;
console.log(byKind);
const seen = new Set();
for (const d of diffs) {
  const Aj = JSON.stringify(d.M), Bj = JSON.stringify(d.B);
  let i = 0; while (i < Aj.length && Aj[i] === Bj[i]) i++;
  const sig = d.g + d.t + d.k + (Aj || '').slice(Math.max(0, i - 40), i + 40);
  if (process.env.ALL !== '1' && seen.has(d.g + d.t + d.k) && seen.size > 60) continue;
  seen.add(d.g + d.t + d.k);
  if (seen.size > Number(process.env.SHOW || 60)) break;
  console.log('\n' + d.id, d.g, d.t, d.k, '@' + i, '\n  ' + A + ': …' + (Aj || '').slice(Math.max(0, i - 160), i + 260), '\n  ' + B + ': …' + (Bj || '').slice(Math.max(0, i - 160), i + 260));
}
console.log('\nerrors/notes:', errs.length);
for (const e of errs.slice(0, 40)) console.log(JSON.stringify(e).slice(0, 600));
