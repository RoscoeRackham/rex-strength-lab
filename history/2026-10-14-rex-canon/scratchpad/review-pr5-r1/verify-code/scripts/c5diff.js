const fs = require('fs'), path = require('path');
const C = require('./common.js'); const { P, g, R3, O3, c9, obj, sig, REPO } = C;
const orig = fs.readFileSync(REPO + '/src/engine.js', 'utf8');
const MUT = {};
for (const [k, from, to] of [
  ['01', "if (s > 0) add(whoA, 'drag', tbDrag(s * realAirThrow(rr, t.obj, opt.angle || 0, A.body), arrive));", "if (s > 0) add(whoA, 'drag', tbDrag(s * realAirThrow(rr, t.obj, 45, A.body), arrive));"],
  ['02', "if (!r || !r.canMove || !r.flight || r.fallsBack || !(r.v > 0)) return 0;", "if (!r || !r.canMove || !r.flight || !(r.v > 0)) return 0;"],
  ['04', "if (L.relativistic || L.vL >= CATCHGAME.CATCH.V_FIREBALL) return keFromV(L.vL, obj.m);", "if (L.relativistic || L.vL >= CATCHGAME.CATCH.V_FIREBALL) return 0;"],
  ['07', "if (person && T.safePassenger && !L.miss.leaves) arrive", "if (person && T.safePassenger) arrive"],
  ['08', "return f0.landed && !f0.escaped && !f0.orbit && !f0.timedOut ? Math.max(0, Ev - keFromV(f0.vImpact, obj.m)) : Ev;", "return f0.landed && !f0.escaped && !f0.orbit && !f0.timedOut ? Math.max(0, Ev - keFromV(f0.vImpact, obj.m)) : 0;"],
  ['09', "own = !(hg.airK > 0) ? hg.E : hg.kept && hg.own ? hg.own.E : 0;", "own = !(hg.airK > 0) ? hg.E : hg.own ? hg.own.E : 0;"],
  ['10', "const hard = L.style === 'hard' || !!L.fullStrength;", "const hard = L.style === 'hard';"],
  ['11', "B.unbreakable && f.landed && !f.relativistic && rr.crater > 0", "B.unbreakable && f.landed && rr.crater > 0"],
]) { const f = path.join(__dirname, 'eng-' + k + '.js'); fs.writeFileSync(f, orig.replace(from, to)); MUT[k] = require(f); }
const TBo = P.RESTRAINT.takenBack, TBm = (k) => MUT[k].RESTRAINT.takenBack;
const duo = (A, B, x) => Object.assign({ A, B, whoA: 'rex' }, x || {});
const cmp = (k, label, move, r, o) => { const a = TBo(move, r, o), b = TBm(k)(move, r, o); console.log(k, label, '| real', sig(a.E), JSON.stringify(nz(a.parts)), '| mutant', sig(b.E), JSON.stringify(nz(b.parts)), a.E === b.E ? 'SAME' : 'DIFFERS'); };
const nz = (p) => Object.fromEntries(Object.entries(p).filter(([, v]) => v).map(([k, v]) => [k, Number(v.toPrecision(4))]));
// 01: wrestle throw at 20 and 90 deg
for (const th of [20, 90]) { const A = c9(100 * 907.18474 * g), B = c9(100 * 907.18474 * g, O3); cmp('01', 'wrestle ' + th + ' deg at the dial', 'wrestleThrow', P.throwPartner(A, B, th), duo(A, B, { angle: th })); }
// 02: falls-back throw by a dense Rex
{ let found = 0; for (const mR of [1e10, 1e11, 1e12, 1e13]) for (const kg of [1e2, 1e3, 1e4, 1e5]) { if (found >= 2) break; const body = P.makeBody({ build: 'rex', H: 3.048, m: mR }), c = c9(kg * g, body), r = P.throwObject(c, obj('car'), 45);
  if (r.fallsBack && r.canMove) { found++; cmp('02', 'car 45 deg, Rex ' + sig(mR, 2) + ' kg, dial ' + sig(kg, 2) + ' kg (fallsBack)', 'throw', r, Object.assign({}, c, { obj: obj('car'), angle: 45 })); } } if (!found) console.log('02 no fallsBack found'); }
// 04: an overshoot past 1% of c?
{ let n = 0; for (const id of ['baseball', 'car', 'person']) for (let e = 8; e <= 22; e += 0.5) for (const D0 of [1e3, 1e5, 3e6, 1e7]) for (const st of ['hard', 'easy']) for (const x of [{}, { airAbsorb: 0.5 }, { keepForm: false }]) {
  const A = c9(Math.pow(10, e) * g, R3, x), B = c9(Math.pow(10, e) * g, O3, x); let L; try { L = P.catchLeg(A, B, obj(id), D0, st); } catch (er) { continue; }
  if (L.result === 'overshoots' && (L.relativistic || L.vL >= P.CATCH.V_FIREBALL)) { if (n++ < 1) cmp('04', id + ' ' + st + ' 10^' + e + ' kg ' + D0 + ' m ' + JSON.stringify(x), 'catch', { a: L }, duo(A, B, { obj: obj(id) })); } }
  console.log('04 overshoots past 1% c found:', n); }
// 08: toss whose full-drag flight never lands
{ let n = 0; for (let e = 4; e <= 20; e += 0.5) for (const st of ['hard', 'easy']) for (const x of [{}, { airAbsorb: 0.5 }]) { const A = c9(Math.pow(10, e) * g, R3, x), B = c9(Math.pow(10, e) * g, O3, x); let t; try { t = P.tossPartner(A, O3, 'Ollie', st, 10, 'friction'); } catch (er) { continue; }
  const a = TBo('toss', t, duo(A, B)), b = TBm('08')('toss', t, duo(A, B)); if (a.E !== b.E) { if (n++ < 2) cmp('08', 'toss ' + st + ' 10^' + e + ' ' + JSON.stringify(x) + ' result ' + t.result, 'toss', t, duo(A, B)); } }
  // with the catch real (catcher recoil off) so the drag shows
  for (let e = 4; e <= 20; e += 0.5) { const x = { ownRecoil: false }, A = c9(Math.pow(10, e) * g, R3, x), B = c9(Math.pow(10, e) * g, O3, x); const t = P.tossPartner(A, O3, 'Ollie', 'hard', 10, 'friction');
    const a = TBo('toss', t, duo(A, B)), b = TBm('08')('toss', t, duo(A, B)); if (a.E !== b.E) { if (n++ < 3) cmp('08', 'toss hard 10^' + e + ' own recoil off, result ' + t.result, 'toss', t, duo(A, B)); } }
  console.log('08 differing:', n); }
// 09: hits-ground, below 100%, keepForm off
{ let n = 0; for (let e = 12; e <= 22; e += 0.5) for (const D0 of [3.16e4, 1e5]) { const x = { airAbsorb: 0.999, keepForm: false }, A = c9(Math.pow(10, e) * g, R3, x), B = c9(Math.pow(10, e) * g, O3, x); let L; try { L = P.catchLeg(A, B, obj('person'), D0, 'hard'); } catch (er) { continue; }
  if (L.result === 'hits-ground') { const a = TBo('catch', { a: L }, duo(A, B, { obj: obj('person') })), b = TBm('09')('catch', { a: L }, duo(A, B, { obj: obj('person') })); if (a.E !== b.E && n++ < 1) cmp('09', 'person hard 10^' + e + ' ' + D0 + ' m 99.9% keepForm off kept=' + L.hitsGround.kept + ' own=' + !!L.hitsGround.own, 'catch', { a: L }, duo(A, B, { obj: obj('person') })); } }
  console.log('09 differing:', n); }
// 10: an easy lob thrown all-out
{ let n = 0; for (const id of ['baseball', 'car', 'person', 'piano', 'bus']) for (let e = 2; e <= 8; e += 0.25) for (let lD = 0; lD <= 6; lD += 0.5) { const x = { ownRecoil: false }, A = c9(Math.pow(10, e) * g, R3, x), B = c9(Math.pow(10, e) * g, O3, x); let L; try { L = P.catchLeg(A, B, obj(id), Math.pow(10, lD), 'easy'); } catch (er) { continue; }
  if (L.fullStrength) { const a = TBo('catch', { a: L }, duo(A, B, { obj: obj(id) })), b = TBm('10')('catch', { a: L }, duo(A, B, { obj: obj(id) })); if (a.E !== b.E && n++ < 1) cmp('10', id + ' easy 10^' + e + ' kg ' + sig(Math.pow(10, lD), 3) + ' m fullStrength, ' + L.result + ', catcher recoil off', 'catch', { a: L }, duo(A, B, { obj: obj(id) })); } }
  console.log('10 differing:', n); }
// 11: wrestle throw relativistic landing
{ let n = 0; for (let e = 9; e <= 22; e += 0.5) for (const th of [-30, 0, 20, 45]) { const A = c9(Math.pow(10, e) * g), B = c9(Math.pow(10, e) * g, O3), t = P.throwPartner(A, B, th);
  const a = TBo('wrestleThrow', t, duo(A, B, { angle: th })), b = TBm('11')('wrestleThrow', t, duo(A, B, { angle: th })); if (a.E !== b.E) n++; } console.log('11 differing:', n); }
{ const body = P.makeBody({ build: 'rex', H: 3.048, m: 1e12 }), c = c9(1e11 * g, body), r = P.throwObject(c, obj('car'), 45);
  cmp('02', 'car 45 deg, Rex 10^12 kg, dial 10^11 kg, fallsBack=' + r.fallsBack, 'throw', r, Object.assign({}, c, { obj: obj('car'), angle: 45 })); }
