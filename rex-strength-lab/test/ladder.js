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
  ok('rung ' + r.id + ': its page phrase is the fact’s page_short', r.short === String(f.page_short).replace(/'/g, '’'), r.short);
  const row = D.sourceRows.find((x) => x.label === 'Energy: ' + r.label);
  const PLAIN = /\^|\d x \d|\de\d|\+\/-|~|≈|\berg\b|\bkpc\b|Bethe|\b[a-z]+_[a-z0-9_]+\b/;
  ok('rung ' + r.id + ': its sources-table row (label, value and link titles) uses plain notation (no ^, x for ×, 1e24, +/-, ~, ≈, erg, kpc, Bethe or fact keys)', !!row && !PLAIN.test(row.label + ' ' + row.value + ' ' + row.sources.map((x) => x.title).join(' ')), row && [row.value].concat(row.sources.map((x) => x.title)).find((t) => PLAIN.test(t)));
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

// 3. Every decade between the bottom and top rungs, in steps of a fiftieth of a decade. The rule is written out again
// here, independently of src/ladder.js, and the wording must match it exactly: the nearest rung on a log scale; within
// 15% of a firm rung (1.5× of a rough one) 'about (roughly) the same as'; else a multiple of the rung below it or a share
// of the rung above it, 2 significant figures (1 and 'roughly' for a rough rung).
const fig = (x, n) => { const k = n - 1 - Math.floor(Math.log10(x)); const r = k >= 0 ? Math.round(x * Math.pow(10, k)) / Math.pow(10, k) : Math.round(x / Math.pow(10, -k)) * Math.pow(10, -k); return String(r); };
const bandOf = (r) => (r.rough ? 1.5 : 1.15);
const want = (J) => {
  const lo = R[0], hi = R[R.length - 1];
  if (J < lo.J / bandOf(lo)) return 'beyond the ladder: less than its smallest rung (' + lo.short + ')';
  if (J > hi.J * bandOf(hi)) return 'beyond the ladder: more than its top rung (' + hi.short + ')';
  const near = R.reduce((b, r) => (Math.abs(Math.log(J / r.J)) < Math.abs(Math.log(J / b.J)) ? r : b));
  const x = J / near.J, band = bandOf(near);
  if (x < band && x > 1 / band) return (near.rough ? 'roughly' : 'about') + ' the same as ' + near.short;
  if (x >= 1) return (near.rough ? 'roughly ' + fig(x, 1) : fig(x, 2)) + '× ' + near.short;
  return (near.rough ? 'roughly ' + fig(100 * x, 1) : fig(100 * x, 2)) + '% of ' + near.short;
};
{
  const lo = Math.log10(R[0].J), hi = Math.log10(R[R.length - 1].J);
  let bad = [], wrong = [], count = 0;
  for (let e = lo; e <= hi + 1e-9; e += 0.02) {
    const J = Math.min(Math.pow(10, e), R[R.length - 1].J), c = L.compare(J, R);
    count++;
    const m = c.text.match(/^(?:roughly )?([\d.]+)× /), s = c.text.match(/^(?:roughly )?([\d.]+)% of /);
    const good = (c.kind === 'same' && /^(about|roughly) the same as /.test(c.text))
      || (c.kind === 'times' && m && Number(m[1]) <= 10 && c.x <= 10.0001)
      || (c.kind === 'share' && s && Number(s[1]) >= 10 && c.x >= 0.09999);
    const digits = (m || s) ? m ? m[1] : s[1] : '';
    if (!good || /≈|e[+-]\d/.test(c.text) || digits.replace(/^0\.0*|\./g, '').replace(/0+$/, '').length > (c.ref && c.ref.rough ? 1 : 2)) bad.push(fmt(J) + ': ' + c.text);
    if (c.text !== want(J)) wrong.push(fmt(J) + ': ' + c.text + ' (want ' + want(J) + ')');
  }
  ok('every energy from the bottom rung to the top one (' + count + ' points) compares with at most 10× or at least 10%, in plain words, with at most 2 figures (1 for a rough rung)', bad.length === 0, bad.slice(0, 5).join(' | '));
  ok('every one of those ' + count + ' comparisons names the nearest rung and words it exactly as the rule says', wrong.length === 0, wrong.slice(0, 3).join(' | '));
}
// a few pinned by hand
{
  const id = (k) => R.find((r) => r.id === k);
  const pins = [
    [id('hiroshima').J * 1.9, '1.9× the Hiroshima bomb'], [id('grenade').J * 3, '3× a hand grenade'],
    [id('chicxulub').J * 0.26, 'roughly 30% of the asteroid that killed the dinosaurs'], [id('lightning').J * 0.6, 'roughly 60% of a lightning bolt'],
    [id('krakatoa').J * 1.4, 'roughly the same as the great blast of Krakatoa in 1883'], [id('krakatoa').J * 1.6, 'roughly 2× the great blast of Krakatoa in 1883'],
    [id('hiroshima').J * 1.1, 'about the same as the Hiroshima bomb'], [id('hiroshima').J * 1.2, '1.2× the Hiroshima bomb'],
    [0.5, 'beyond the ladder: less than its smallest rung (the energy to lift a 100 g apple one metre)'],
    [1e48, 'beyond the ladder: more than its top rung (the first black-hole collision ever detected, in 2015)'],
    [R[0].J / 1.1, 'about the same as ' + R[0].short], [R[R.length - 1].J * 1.1, 'about the same as ' + R[R.length - 1].short],
    [R[0].J / 1.2, 'beyond the ladder: less than its smallest rung (' + R[0].short + ')'], [R[R.length - 1].J * 1.2, 'beyond the ladder: more than its top rung (' + R[R.length - 1].short + ')'],
  ];
  for (const [J, t] of pins) ok('pinned: ' + fmt(J) + ' reads “' + t + '”', L.compare(J, R).text === t, L.compare(J, R).text);
  for (const [x, n, t] of [[9.96, 2, '10'], [1.234, 2, '1.2'], [12.5, 2, '13'], [45.6, 2, '46'], [3.4, 1, '3'], [45, 1, '50'], [0.15, 2, '0.15']])
    ok('num(' + x + ', ' + n + ') is ' + t, L.num(x, n) === t, L.num(x, n));
}

// 4. Outside the ladder the page says so, and gives no multiple or share
for (const [J, kind] of [[R[0].J / 2, 'below'], [R[0].J / 1e6, 'below'], [R[R.length - 1].J * 2, 'above'], [R[R.length - 1].J * 1e9, 'above']]) {
  const c = L.compare(J, R);
  ok(fmt(J) + ' is beyond the ladder, naming the end rung', c.kind === kind && /^beyond the ladder/.test(c.text) && !/\d/.test(c.text.replace(/\(.*\)/, '')) && c.text.endsWith('(' + (kind === 'below' ? R[0] : R[R.length - 1]).short + ')'), c.text);
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
  const rex = P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex)), surf = D.surfaces.find((x) => x.id === 'concrete');
  const c = { F: 1e34 * P.K.g, mode: 'comic', body: rex, surface: surf, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
  for (const [name, E] of [['punch', P.punch(c).E], ['clap', P.clap(c).E], ['stomp', P.stomp(c).E]])
    ok('top of the dial: the ' + name + ' (' + fmt(E) + ') is on the ladder', !/beyond/.test(L.compare(E, R).text), L.compare(E, R).text);
}

// 8. The page's card on the comparisons names the two ends of the ladder
{
  const card = D.assumptions.find((a) => a.t === 'Energy comparisons');
  ok('the Energy comparisons card names the bottom and top rungs', !!card && card.d.includes(R[0].short) && card.d.includes(R[R.length - 1].short));
}

// 9. The shimmer's level (BRIEF-canon.md item 6, pull request 5): EnergyLadder.glow. A log scale between the canon's two
// anchors, a flicker at a car crash and a blinding flare at the dinosaur-killer, with a faint flicker fading to nothing at
// a floor (Usain Bolt at top speed: a design proposal). The anchors, the floor and the steps come from the ladder data by
// key: every expected figure below is worked out here from the rungs the test finds by key, never typed in.
{
  const K3 = L.GLOW_KEYS, rk = (refs, k) => refs.find((r) => r.key === k);
  const fo = rk(R, 'energy_usain_bolt_top_speed'), fl = rk(R, 'energy_corolla_100kmh_kinetic'), fx = rk(R, 'energy_chicxulub_impact');
  ok('9: the shimmer\'s anchors are ladder rungs found by key: the floor Usain Bolt at top speed, the flicker a Corolla at 100 km/h (a car crash), the flare the dinosaur-killer (rough)',
    !!fo && !!fl && !!fx && K3.floor === fo.key && K3.flicker === fl.key && K3.flare === fx.key && fx.rough === true && !fl.rough && !fo.rough && fo.J < fl.J && fl.J < fx.J, [fo, fl, fx].map((r) => r && r.id).join(', '));
  const lv = (J) => (Math.log10(J) - Math.log10(fl.J)) / (Math.log10(fx.J) - Math.log10(fl.J));
  const G = (J, refs) => L.glow(J, refs || R);
  // the anchors' own levels, and each step at a quarter, a half and three quarters of the log span, worded by compare()
  { const g = G(fl.J), stepJ = (k) => Math.pow(10, Math.log10(fl.J) + k * (Math.log10(fx.J) - Math.log10(fl.J)));
    const want = [['flicker', 0, fl.J], ['faint glow', 0.25, stepJ(0.25)], ['glow', 0.5, stepJ(0.5)], ['bright', 0.75, stepJ(0.75)], ['blinding flare', 1, fx.J]];
    const bad = want.filter(([w, k, J], i) => { const s = g.steps[i]; return !s || s.word !== w || s.level !== k || Math.abs(s.J - J) > 1e-12 * J || s.text !== L.compare(J, R).text; });
    ok('9: the named steps are the flicker, a quarter, a half and three quarters of the log span, and the flare, each worded with compare()', g.steps.length === 5 && !bad.length, g.steps.map((s) => s.word + ' ' + s.J.toExponential(2) + ': ' + s.text).join(' | '));
    // the spec's wordings (BRIEF-canon.md item 6, as the mapping found them): the house wording of each step's energy
    ok('9: the steps\' wordings are the brief\'s: about the same as a fully loaded A380 at cruising speed; 24% of the Chelyabinsk meteor of 2013; roughly 30% of the heat an average hurricane releases in a day',
      g.steps[1].text === 'about the same as a fully loaded A380 at cruising speed' && g.steps[2].text === '24% of the Chelyabinsk meteor of 2013' && g.steps[3].text === 'roughly 30% of the heat an average hurricane releases in a day', g.steps.slice(1, 4).map((s) => s.text).join(' | '));
    // rough by the ladder's own rule: the rung compare() words the step against is rough (the flare: its own rung)
    const roughWant = g.steps.map((s) => (s.level === 1 ? !!fx.rough : !!L.compare(s.J, R).ref.rough));
    ok('9: a step is rough by the ladder\'s rule (the rung it is worded against is rough): the three-quarter step (the hurricane) and the flare; the flicker, a quarter and a half are not',
      g.steps.every((s, i) => s.rough === roughWant[i]) && JSON.stringify(roughWant) === '[false,false,false,true,true]', JSON.stringify(g.steps.map((s) => s.rough)));
    ok('9: the anchors\' levels: the flicker 0, the flare 1, the floor below 0 (' + G(fl.J).floor.level.toFixed(3) + '), each worded with compare()',
      g.flicker.level === 0 && g.flare.level === 1 && Math.abs(g.floor.level - lv(fo.J)) < 1e-12 && g.floor.level < 0 && g.floor.text === L.compare(fo.J, R).text && g.flare.text === L.compare(fx.J, R).text);
  }
  // the words: too faint below the floor, a faint flicker from the floor to the flicker (canon: a faint flicker below a car
  // crash), then the nearest named step on the log scale; rough steps say 'roughly', the rest 'about'
  { const mid = (a, b) => Math.sqrt(a * b), at = (k) => Math.pow(10, Math.log10(fl.J) + k * (Math.log10(fx.J) - Math.log10(fl.J)));
    const cases = [[fo.J / 1.01, 'too faint to see', 'too faint to see'], [fo.J, 'faint flicker', 'a faint flicker'], [mid(fo.J, fl.J), 'faint flicker', 'a faint flicker'], [fl.J / 1.001, 'faint flicker', 'a faint flicker'],
      [fl.J, 'flicker', 'about a flicker'], [at(0.124), 'flicker', 'about a flicker'], [at(0.126), 'faint glow', 'about a faint glow'], [at(0.374), 'faint glow', 'about a faint glow'], [at(0.376), 'glow', 'about a glow'],
      [at(0.624), 'glow', 'about a glow'], [at(0.626), 'bright', 'roughly bright'], [at(0.874), 'bright', 'roughly bright'], [at(0.876), 'blinding flare', 'roughly a blinding flare'], [fx.J, 'blinding flare', 'roughly a blinding flare']];
    const bad = cases.filter(([J, w, t]) => { const g = G(J); return g.word !== w || g.text !== t || g.none; });
    ok('9: the word for each energy: too faint to see below the floor; a faint flicker from the floor up to a car crash; then the nearest step (flicker, faint glow, glow, bright, blinding flare), "roughly" for the rough ones', !bad.length, bad.map(([J, w]) => J.toExponential(2) + ' ' + G(J).word + ' (want ' + w + ')').join('; '));
    // (review round 2 of pull request 5: at an exact tie, a level exactly halfway between two steps, the word is the lower
    // step's, as src/ladder.js documents. The energies are found among the doubles next to each halfway point, where the
    // level the ladder works out is exactly as far from both steps)
    const ulp = (x, n) => { const b = new DataView(new ArrayBuffer(8)); b.setFloat64(0, x); b.setBigInt64(0, b.getBigInt64(0) + BigInt(n)); return b.getFloat64(0); };
    const ties = [];
    for (const [k, lo, hi] of [[0.125, 'flicker', 'faint glow'], [0.375, 'faint glow', 'glow'], [0.625, 'glow', 'bright'], [0.875, 'bright', 'blinding flare']]) {
      for (let n = -400; n <= 400; n++) { const J = ulp(at(k), n), g = G(J); if (Math.abs(g.level - (k - 0.125)) === Math.abs(g.level - (k + 0.125))) { ties.push([J, g.word, lo, hi]); break; } }
    }
    ok('9: at an exact tie between two steps the word is the lower step\'s (' + ties.length + ' ties found: ' + ties.map(([, w, lo, hi]) => lo + '/' + hi + ': ' + w).join(', ') + ')', ties.length >= 2 && ties.every(([, w, lo]) => w === lo), ties.map(([J]) => J.toExponential(17)).join(', '));
  }
  // held at the flare above it; unbounded is the flare; nothing taken back is no tile
  { const a = G(fx.J * 10), u = G(Infinity);
    ok('9: above the flare the level is held at 1 (held), the glow at full strength, the word the blinding flare', a.level === 1 && a.held && a.strength === 1 && a.word === 'blinding flare' && !G(fx.J).held, JSON.stringify([a.level, a.held, a.strength, a.word]));
    ok('9: unbounded energy (an unlimited run) is the flare at full strength, with no "roughly" and no figure', u.unbounded && u.level === 1 && u.strength === 1 && u.word === 'blinding flare' && u.text === 'a blinding flare' && !u.none, JSON.stringify([u.unbounded, u.level, u.text]));
    const nones = [0, -5, NaN, undefined, null].map((J) => G(J));
    ok('9: no energy (0, negative, NaN, missing) is no tile: none, no level, no word, no glow', nones.every((g) => g.none && g.level === null && g.word === null && g.strength === 0 && g.text === null && !g.unbounded));
  }
  // the glow's strength: 0 at the floor or below, 1 at the flare, linear in the log between them
  { const s = (J) => G(J).strength, want = (J) => (Math.log10(J) - Math.log10(fo.J)) / (Math.log10(fx.J) - Math.log10(fo.J));
    ok('9: the glow\'s strength is 0 at the floor and below, 1 at the flare and above, and the log of the energy\'s share of the way between them',
      s(fo.J) === 0 && s(fo.J / 10) === 0 && s(fx.J) === 1 && s(fx.J * 1e3) === 1 && [fl.J, 1e10, 1.35e14, 1e20].every((J) => Math.abs(s(J) - want(J)) < 1e-12), [s(fo.J), s(fl.J).toFixed(3), s(fx.J)].join(', '));
  }
  // the level never falls as the energy rises: the level, the strength and the step never go down (a fiftieth of a
  // decade from a millijoule to 10^30 J, and unbounded)
  { const order = ['too faint to see', 'faint flicker', 'flicker', 'faint glow', 'glow', 'bright', 'blinding flare'];
    let prev = null, bad = [], count = 0;
    for (let e = -3; e <= 30 + 1e-9; e += 0.02) {
      const J = Math.pow(10, e), g = G(J), cur = { J, level: g.level, s: g.strength, w: order.indexOf(g.word) };
      count++;
      if (cur.w < 0 || g.none) bad.push(J.toExponential(2) + ' has no word');
      if (prev && (cur.level < prev.level - 1e-15 || cur.s < prev.s - 1e-15 || cur.w < prev.w)) bad.push(J.toExponential(2) + ': ' + JSON.stringify([prev, cur]));
      prev = cur;
    }
    const u = G(Infinity);
    if (!(u.level >= prev.level && u.strength >= prev.s && order.indexOf(u.word) >= prev.w)) bad.push('unbounded below 1e30 J');
    ok('9: the level never falls as the energy rises (' + count + ' energies from 1 mJ to 10^30 J, and unbounded): nor the glow\'s strength, nor the step', !bad.length, bad.slice(0, 3).join(' | '));
  }
  // by key, from the data: a copy of the ladder with a rung's value changed moves what depends on it, and nothing else;
  // the order of the rungs changes nothing; a ladder without one of the three rungs is refused
  { const copy = (k, f) => R.map((r) => (r.key === k ? Object.assign({}, r, { J: f(r.J) }) : Object.assign({}, r)));
    const J0 = 1.35e14, base = G(J0);
    const flare10 = G(J0, copy(K3.flare, (x) => x * 10)), flick10 = G(J0, copy(K3.flicker, (x) => x * 10)), floor10 = G(J0, copy(K3.floor, (x) => x * 10));
    const lvWith = (refs, J) => { const a = rk(refs, K3.flicker).J, b = rk(refs, K3.flare).J; return (Math.log10(J) - Math.log10(a)) / (Math.log10(b) - Math.log10(a)); };
    ok('9: the flare from the data: ten times the dinosaur-killer\'s energy in a copy of the ladder moves the level of 135 TJ down (' + base.level.toFixed(3) + ' to ' + flare10.level.toFixed(3) + ') and the steps up',
      flare10.level < base.level && Math.abs(flare10.level - lvWith(copy(K3.flare, (x) => x * 10), J0)) < 1e-12 && flare10.steps[2].J > base.steps[2].J * 2 && flare10.flare.J === fx.J * 10);
    ok('9: the flicker from the data: ten times the Corolla\'s energy moves the level (' + base.level.toFixed(3) + ' to ' + flick10.level.toFixed(3) + ') and the first step', flick10.level < base.level && flick10.steps[0].J === fl.J * 10 && Math.abs(flick10.level - lvWith(copy(K3.flicker, (x) => x * 10), J0)) < 1e-12);
    ok('9: the floor from the data: ten times Usain Bolt\'s energy moves the glow\'s strength, and what was just above the floor is now too faint to see',
      floor10.strength < base.strength && floor10.level === base.level && G(fo.J * 2, copy(K3.floor, (x) => x * 10)).word === 'too faint to see' && G(fo.J * 2).word === 'faint flicker', base.strength.toFixed(3) + ' to ' + floor10.strength.toFixed(3));
    const other = G(J0, copy('energy_fastest_pitch_kinetic', (x) => x * 3)), shuffled = G(J0, R.slice().reverse());
    ok('9: only those three rungs count: changing another rung\'s value, or the rungs\' order, changes no level, strength or word', other.level === base.level && other.strength === base.strength && other.word === base.word && shuffled.level === base.level && shuffled.strength === base.strength && shuffled.word === base.word);
    let threw = 0;
    for (const k of [K3.floor, K3.flicker, K3.flare]) { try { G(J0, R.filter((r) => r.key !== k)); } catch (e) { threw++; } }
    ok('9: a ladder without one of the three rungs is refused, not read by position', threw === 3);
  }
}

console.log('\n' + (n - fails) + '/' + n + ' passed');
process.exit(fails ? 1 : 0);
