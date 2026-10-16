const { P, g, R3, O3, c9, obj, PE, glow, sig } = require('./common.js');
const TB = P.RESTRAINT.takenBack;
{ const x = { keepForm: false, airAbsorb: 0.5 }, cR = c9(1e11 * g, R3, x), cO = c9(1e11 * g, O3, x), ob = obj('baseball');
  const a = P.catchLeg(cR, cO, ob, 300, 'hard');
  const tb = TB('catch', { a }, { A: cR, B: cO, whoA: 'rex', obj: ob });
  const E0 = P.keFromV(a.aim.vE, ob.m) + PE(ob.m, a.h0);
  console.log('burns-up leg: result', a.result, 'vE', sig(a.aim.vE), 'drag part', sig(tb.parts.drag), '0.5 x thrown', sig(0.5 * E0), 'over by', sig(tb.parts.drag / (0.5 * E0) - 1, 3));
}
// sweep: caught legs, 100% absorbed, default powers, dial .. 1e9 kg
let n = 0, pos = 0; const ex = [];
const dial = 100 * 907.18474;
for (const id of ['baseball', 'shot', 'person', 'bowling', 'car', 'piano']) for (const st of ['easy', 'hard']) for (let lD = 0; lD <= 4; lD += 0.5) for (const kg of [dial, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9]) {
  const ob = obj(id); if (!ob) continue;
  const cR = c9(kg * g, R3), cO = c9(kg * g, O3), D0 = Math.pow(10, lD);
  let a; try { a = P.catchLeg(cR, cO, ob, D0, st); } catch (e) { continue; }
  if (a.result !== 'caught') continue;
  n++;
  const tb = TB('catch', { a, b: a }, { A: cR, B: cO, whoA: 'rex', obj: ob });
  if (tb.by.rex.parts.drag > 0) { pos++; if (ex.length < 6) ex.push(id + ' ' + st + ' ' + sig(D0, 3) + ' m ' + sig(kg, 3) + ' kg: drag ' + sig(tb.by.rex.parts.drag, 3) + ' (' + glow(tb.by.rex.parts.drag).text + ') vs catch ' + sig(tb.by.rex.parts.catch, 3)); }
}
console.log('caught legs', n, 'with a Rex drag part > 0:', pos); console.log(ex.join('\n'));
