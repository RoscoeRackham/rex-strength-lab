global.window = {};
const S = '/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/reviewB2/code';
const Pb = require(S + '/lab/src/engine.js');
const Pm = require(S + '/engine-main.js');
require(S + '/lab/src/data.js');
const D = window.DINO_DATA, g = 9.80665;
const { canon } = require(S + '/lab/test/powers-off-cases.js');
const surf = D.surfaces.find((s) => s.id === 'granite');
for (const oH of [0.1, 0.2, 0.5]) for (const oM of [1e21, 3e21, 5.9e21]) for (const oid of ['shot', 'baseball']) for (const D0 of [10, 100]) {
  const run = (P) => { const b = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), bo = P.makeBody({ build: 'ollie', H: oH, m: oM });
    const R = { F: 1e30 * g, mode: 'comic', body: b, surface: surf, anchor: 'friction' }, O = { F: 1e30 * g, mode: 'comic', body: bo, surface: surf, anchor: 'friction' };
    const L = P.catchLeg(R, O, D.objects.find((o) => o.id === oid), D0, 'easy'); if (L && L.flight) L.flight = Object.assign({}, L.flight, { path: 0 }); return L; };
  const a = run(Pm), b = run(Pb);
  if (a.vArrive >= 0.005 * Pb.K.c || canon(a) !== canon(b)) console.log(oH, oM.toExponential(1), oid, D0, a.result, b.result, 'v/c', (a.vArrive / Pb.K.c).toPrecision(3), 'same', canon(a) === canon(b), 'Ecatch main', a.catch && a.catch.Ecatch && a.catch.Ecatch.toPrecision(3), 'branch', b.catch && b.catch.Ecatch && b.catch.Ecatch.toPrecision(3), 'bh', Pb.isBlackHole(Pb.makeBody({ build: 'ollie', H: oH, m: oM })));
}
console.log('done');
