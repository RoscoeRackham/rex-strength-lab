global.window = {};
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
for (const [sid, oid, dial] of [['gravel', 'piano', 1e7], ['granite', 'shot', 1e8]]) {
  const s = D.surfaces.find((x) => x.id === sid), obj = D.objects.find((x) => x.id === oid);
  const ctx = { F: dial * g, mode: 'real', body: rex, surface: s, groundHolds: false, anchor: 'friction' };
  let prev = null, flips = [], cnt = 0;
  const N = 2000;
  for (let i = 0; i <= N; i++) {
    const kg = 30.07 * Math.pow(dial / 30.07, i / N);
    const r = P.RESTRAINT.MOVES.throw.run(Object.assign({}, ctx, { use: kg * g }), { obj, angle: 45 });
    const on = r.canMove && r.gripRatio > 1;
    if (on) cnt++;
    if (prev !== null && on !== prev) flips.push((on ? 'ON ' : 'OFF ') + kg.toExponential(3) + ' grip ' + r.gripRatio.toFixed(3));
    prev = on;
  }
  console.log(sid, oid, 'real dial', dial, 'crush on at', cnt, 'of', N + 1, flips.join(' | '));
  const pl = P.RESTRAINT.plan('throw', ctx, { obj, angle: 45, target: 30, near: 5 });
  while (!pl.step()) {}
  const cr = pl.result('hazard:crush'), ce = pl.ceiling();
  console.log('  search crush', cr.never ? 'never' : (cr.use / g).toExponential(3), 'ceiling by', ce.by, isFinite(ce.below) ? (ce.below / g).toExponential(3) : ce.below);
  for (const kg of [5.5e5, 7.24e6]) {
    const r = P.RESTRAINT.MOVES.throw.run(Object.assign({}, ctx, { use: kg * g }), { obj, angle: 45 });
    console.log('  at', kg, 'grip', r.gripRatio.toFixed(3), 'heldBack', r.heldBack, 'v', r.v.toFixed(2), 'reach.crush', P.RESTRAINT.reach('throw', r, { obj, angle: 45, near: 5, surface: s, body: rex }).crush);
  }
}
