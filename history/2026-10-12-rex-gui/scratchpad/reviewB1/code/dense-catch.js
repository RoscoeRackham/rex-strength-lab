global.window = {};
const PM = require(process.argv[2]); const PB = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js'); const D = window.DINO_DATA;
const { canon } = require('/home/user/rex-strength-lab/rex-strength-lab/test/powers-off-cases.js');
const surf = D.surfaces.find(s => s.id === 'concrete'), g = 9.80665;
let diffs = 0, tot = 0;
for (const m of [1e9, 1e12, 1e15, 1e18, 1e20, 1e22, 1e24]) for (const oid of ['baseball', 'car', 'person']) for (const style of ['easy', 'hard']) for (const lg of [6, 12, 20, Infinity]) for (const Dd of [10, 30, 1000]) {
  const run = (P) => { const R = { F: isFinite(lg) ? Math.pow(10, lg) * g : Infinity, mode: 'comic', body: P.makeBody({ build: 'rex', H: 3.048, m }), surface: surf, anchor: 'friction' }; const O = Object.assign({}, R, { body: P.makeBody({ build: 'ollie', H: 3.048, m }) });
    const L = P.catchLeg(R, O, D.objects.find(o => o.id === oid), Dd, style); if (L && L.flight) L.flight = Object.assign({}, L.flight, { path: L.flight.path ? L.flight.path.length : 0 }); return L; };
  tot++;
  const a = run(PM), b = run(PB);
  const ca = canon(a), cb = canon(b);
  if (ca !== cb) { diffs++; if (diffs < 6) console.log('DIFF', m, oid, style, lg, Dd, a.result, b.result, a.vArrive, b.vArrive, a.catch && a.catch.E1, b.catch && b.catch.E1); }
}
console.log('cases', tot, 'diffs', diffs);
