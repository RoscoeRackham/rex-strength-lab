global.window = {};
const S = '/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/reviewB2/code';
const Pm = require(S + '/engine-main.js');
delete require.cache[require.resolve(S + '/engine-main.js')];
const Pb = require(S + '/lab/src/engine.js');
require(S + '/lab/src/data.js');
const D = window.DINO_DATA;
const { canon } = require(S + '/lab/test/powers-off-cases.js');
const g = 9.80665;
const surf = D.surfaces.find((s) => s.id === 'granite'), obj = (id) => D.objects.find((o) => o.id === id);
for (const m of [1e20, 1e23, 1e24, 1e25, 1e26]) for (const style of ['easy', 'hard']) for (const oid of ['baseball', 'car']) {
  const run = (P) => {
    const b = P.makeBody({ build: 'rex', H: 3.048, m }), bo = P.makeBody({ build: 'ollie', H: 3.048, m });
    const R = { F: 1e30 * g, mode: 'comic', body: b, surface: surf, anchor: 'bolted' }, O = { F: 1e30 * g, mode: 'comic', body: bo, surface: surf, anchor: 'bolted' };
    const L = P.catchLeg(R, O, obj(oid), 100, style);
    if (L && L.flight) L.flight = Object.assign({}, L.flight, { path: 0 });
    return L;
  };
  const a = run(Pm), b = run(Pb);
  const same = canon(a) === canon(b);
  console.log(m.toExponential(0), style, oid, 'result', a.result, '/', b.result, 'vArrive/c', a.vArrive != null ? (a.vArrive / 299792458).toPrecision(3) : '-', 'same', same, same ? '' : ('main Ecatch ' + (a.catch && a.catch.Ecatch).toPrecision(4) + ' branch ' + (b.catch && b.catch.Ecatch).toPrecision(4) + ' rel ' + (b.catch && b.catch.relativistic)));
}
