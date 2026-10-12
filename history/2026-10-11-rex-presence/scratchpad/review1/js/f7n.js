const { P, g, ctxOf, obj, ollie, rex } = require('./env.js');
const o = obj('person');
const lo = Math.max(P.W8.WALK_LOAD * rex.m * g / P.MUSCLE.jump.forceFrac, P.W8.WALK_LOAD * ollie.m * g / P.MUSCLE.jump.forceFrac);
const F = 90718.474 * g;
for (const u of [lo, lo * Math.sqrt(10), lo * 10, F, Infinity]) {
  const cap = Math.min(F, Math.max(u, lo));
  const L = P.catchLeg(ctxOf(cap), ctxOf(cap, { body: ollie }), o, 100, 'easy');
  if (!L.aim) { console.log("cap kg", (cap/g).toPrecision(4), "no aim", L.result); continue; }
  const nL = P.PASSENGER.felt(L.aim.vL / L.tPush / g, L.aim.thetaDeg || 0);
  const k = L.catch;
  const first = k && k.firstShare > 0.5;
  const nC = k ? (first ? k.F1[0] / (o.m * g) : k.decelG) : null, tC = k ? (first ? k.tContact[1] : k.tStroke) : null;
  console.log('cap kg', (cap / g).toPrecision(4), 'vL', L.aim.vL.toFixed(3), 'tPush', L.tPush.toPrecision(3), 'throw g', nL.toFixed(2), 'limit', P.PASSENGER.noHarm(L.tPush), 'result', L.result, 'catch g', nC && nC.toFixed(1), 'tC', tC && tC.toPrecision(2), 'catch limit', tC && P.PASSENGER.noHarm(tC), 'sig', [L.aim.vL, L.vArrive, L.result, L.bursts].join('|'));
}
