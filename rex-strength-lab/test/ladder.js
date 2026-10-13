// Checks for the energy ladder (BRIEF-gui.md section 6): its rungs, their facts and sources, and the wording rule.
// Run: node test/ladder.js
global.window = {};
const fs = require('fs');
const path = require('path');
const L = require('../src/ladder.js');
require('../src/data.js');
const P = require('../src/engine.js');
const D = window.DINO_DATA;
let fails = 0, n = 0;
const ok = (name, cond, detail) => { n++; if (!cond) fails++; console.log((cond ? 'ok   ' : 'FAIL ') + name + (detail != null ? ': ' + detail : '')); };

const R = D.energyRefs.slice().sort((a, b) => a.J - b.J);
const facts = {};
for (const f of fs.readdirSync(path.join(__dirname, '..', 'research')).filter((x) => /^final-.*\.json$/.test(x)))
  for (const x of JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'research', f), 'utf8')).facts) facts[x.key] = x;
const STATUSES = ['verified', 'derived', 'reported', 'estimate', 'claimed', 'disputed'];
const fmt = (J) => J.toExponential(2) + ' J';

// 1. Each rung on the page has a fact with a status and a source, shown in the sources table
for (const r of R) {
  const f = facts[r.key];
  ok('rung ' + r.id + ': has a research fact (' + r.key + ')', !!f);
  if (!f) continue;
  ok('rung ' + r.id + ': its energy is the fact’s value', Math.abs(r.J - f.value_si) <= 1e-9 * f.value_si, fmt(r.J) + ' vs ' + fmt(f.value_si));
  ok('rung ' + r.id + ': the fact has a status and at least one web source', STATUSES.includes(f.status) && f.sources.length > 0 && f.sources.every((s) => /^https?:\/\//.test(s.url)), f.status + ', ' + f.sources.length + ' sources');
  const row = D.sourceRows.find((x) => x.label === 'Energy: ' + r.label);
  ok('rung ' + r.id + ': shown in the sources table with the fact’s status and its first source', !!row && row.status === f.status && row.sources.some((s) => s.url === f.sources[0].url), row ? row.status : 'no row');
  // uncertain by more than about 2× either way: rough wording only
  const wide = (f.high_si > 0 && f.high_si / f.value_si > 2) || (f.low_si > 0 && f.value_si / f.low_si > 2);
  ok('rung ' + r.id + ': marked rough exactly when its fact’s range runs more than 2× from its value, or the fact says rough with its reason', !!r.rough === (wide || f.rough === true) && (f.rough !== true || /Rough by judgement/.test(f.notes)), (f.low_si || '-') + ' to ' + (f.high_si || '-') + (f.rough ? ', rough by judgement' : ''));
}
// the ids the page uses elsewhere (growth what-if, milestones)
for (const id of ['krakatoa', 'chicxulub', 'sun', 'hiroshima', 'tsar', 'earthbind'])
  ok('rung id ' + id + ' still exists (used by the growth what-if or the milestones)', R.some((r) => r.id === id));

// 2. No step between neighbouring rungs wider than 100×, so every energy between gets ≤ 10× or ≥ 10%
const gaps = L.gaps(R);
ok('no step between neighbouring rungs is wider than 100×', gaps.length === 0, gaps.map((g) => g.from.id + ' → ' + g.to.id + ' ' + Math.round(g.ratio) + '×').join('; '));

// 3. Every decade between the bottom and top rungs, in steps of a fiftieth of a decade
{
  const lo = Math.log10(R[0].J), hi = Math.log10(R[R.length - 1].J);
  let bad = [], count = 0;
  for (let e = lo; e <= hi + 1e-9; e += 0.02) {
    const J = Math.min(Math.pow(10, e), R[R.length - 1].J), c = L.compare(J, R);
    count++;
    const m = c.text.match(/^(?:roughly )?([\d.]+)× /), s = c.text.match(/^(?:roughly )?([\d.]+)% of /);
    const good = (c.kind === 'same' && /^(about|roughly) the same as /.test(c.text))
      || (c.kind === 'times' && m && Number(m[1]) <= 10 && c.x <= 10.0001)
      || (c.kind === 'share' && s && Number(s[1]) >= 10 && c.x >= 0.09999);
    if (!good || /≈|e[+-]\d/.test(c.text)) bad.push(fmt(J) + ': ' + c.text);
  }
  ok('every energy from the bottom rung to the top one (' + count + ' points) compares with at most 10× or at least 10%, in plain words', bad.length === 0, bad.slice(0, 5).join(' | '));
}

// 4. Outside the ladder the page says so, and gives no multiple or share
for (const [J, kind] of [[R[0].J / 2, 'below'], [R[0].J / 1e6, 'below'], [R[R.length - 1].J * 2, 'above'], [R[R.length - 1].J * 1e9, 'above']]) {
  const c = L.compare(J, R);
  ok(fmt(J) + ' is beyond the ladder', c.kind === kind && /^beyond the ladder/.test(c.text) && !/\d/.test(c.text.replace(/\(.*\)/, '')), c.text);
}
ok('infinite energy: more than any finite amount', L.compare(Infinity, R).text === 'more than any finite amount');
ok('no energy (0 or NaN): nothing to compare', L.compare(0, R).kind === 'none' && L.compare(NaN, R).kind === 'none');

// 5. Rough wording for every rung marked uncertain, and only for those
for (const r of R) {
  const same = L.compare(r.J, R), up = L.compare(r.J * 1.9, R), down = L.compare(r.J / 1.9, R);
  const near = [up, down].filter((c) => c.ref === r);
  if (r.rough) ok('rough rung ' + r.id + ': “roughly” every time it is named', /^roughly the same as /.test(same.text) && near.every((c) => /^roughly /.test(c.text)), [same, ...near].map((c) => c.text).join(' | '));
  else ok('firm rung ' + r.id + ': “about the same as” at its own energy, and no “roughly”', /^about the same as /.test(same.text) && near.every((c) => !/roughly/.test(c.text)), [same, ...near].map((c) => c.text).join(' | '));
}

// 6. Every rung's short name reads in all three phrases (no capital article, no trailing full stop)
for (const r of R) ok('rung ' + r.id + ': page phrase “' + r.short + '” fits “3× ___” and “40% of ___”', r.short.length > 2 && !/^(The|A|An) /.test(r.short) && !/[.;:]$/.test(r.short));

// 7. The strength dial's own extremes land on the ladder (comic ground, the top of the dial, all four powers on)
{
  const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), surf = D.surfaces.find((x) => x.id === 'concrete');
  const c = { F: 1e34 * P.K.g, mode: 'comic', body: rex, surface: surf, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
  for (const [name, E] of [['punch', P.punch(c).E], ['clap', P.clap(c).E], ['stomp', P.stomp(c).E]])
    ok('top of the dial: the ' + name + ' (' + fmt(E) + ') is on the ladder', !/beyond/.test(L.compare(E, R).text), L.compare(E, R).text);
}

// 8. The page's card on the comparisons names the two ends of the ladder
{
  const card = D.assumptions.find((a) => a.t === 'Energy comparisons');
  ok('the Energy comparisons card names the bottom and top rungs', !!card && card.d.includes(R[0].short) && card.d.includes(R[R.length - 1].short));
}

console.log('\n' + (n - fails) + '/' + n + ' passed');
process.exit(fails ? 1 : 0);
