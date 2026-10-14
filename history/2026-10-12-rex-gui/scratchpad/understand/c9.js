global.window = {};
const P = require('./head/engine.js'); require('./head/data.js'); const D = window.DINO_DATA;
const g = 9.80665;
const surf = (id) => D.surfaces.find((s) => s.id === id);
const F100 = 100 * 907.18474 * g;
for (const m of [3007, 3e4, 1e5]) {
  const R = { F: F100, mode: 'comic', body: P.makeBody({ H: 3.048, m, build: 'rex' }), surface: surf('sand'), groundHolds: false, anchor: 'friction' };
  const O = Object.assign({}, R, { body: P.makeBody({ H: 3.048, m, build: 'ollie' }) });
  const rg = P.groundUnderWeight(R.body, R.surface, false).regime, rgO = P.groundUnderWeight(O.body, O.surface, false).regime;
  const a0 = P.armWrestle(R, O), a1 = P.armWrestle(Object.assign({}, R, { groundHolds: true }), Object.assign({}, O, { groundHolds: true }));
  console.log('m', m, 'regime', rg, rgO, '| harm-check run (gh false): tableBreaks', a0.tableBreaks, a0.outcome, '| shown run (gate gh true): tableBreaks', a1.tableBreaks, a1.outcome);
}
// immovable mismatch
const R = { F: F100, mode: 'comic', body: P.makeBody({ H: 3.048, m: 3007, build: 'rex' }), surface: surf('concrete'), groundHolds: false, anchor: 'friction' };
const O = Object.assign({}, R, { body: P.makeBody({ H: 3.048, m: 3007, build: 'ollie' }) });
const a = P.collide(O, R, { source: 'sprint' }), b = P.collide(O, Object.assign({}, R, { immovable: true }), { source: 'sprint' });
console.log('collide shown (immovable):', b.outcome, 'moved', b.after.splat.moved, '| harm check run (no immovable):', a.outcome, 'moved', a.after.splat.moved.toFixed(2));
