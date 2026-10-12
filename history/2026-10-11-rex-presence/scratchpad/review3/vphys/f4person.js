global.window = {};
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
for (const sid of ['sand', 'softclay']) {
  const s = D.surfaces.find((x) => x.id === sid), obj = D.objects.find((x) => x.id === 'person');
  for (const sp of [false, true]) {
    const ctx = { F: 100 * 907.18474 * g, mode: 'comic', body: rex, surface: s, groundHolds: false, anchor: 'friction' };
    const pl = P.RESTRAINT.plan('throw', ctx, { obj, angle: 45, target: 30, near: 5, safePassenger: sp });
    while (!pl.step()) {}
    const pr = pl.result('hazard:plaster'), ce = pl.ceiling(), gl = pl.result('goal');
    console.log(sid, 'safePassenger', sp, 'goal use t', (gl.use / g / 1000).toFixed(2), 'plaster onset t', (pr.use / g / 1000).toFixed(2), 'ceiling by', ce.by, (ce.below / g / 1000).toFixed(2));
    for (const kg of [5e3, 8e3, 1.5e4]) {
      const r = P.RESTRAINT.MOVES.throw.run(Object.assign({}, ctx, { use: kg * g }), { obj, angle: 45 });
      const sh = P.RESTRAINT.MOVES.throw.shake(r, { obj, surface: s });
      console.log('   ', kg, 'range', r.flight.range.toFixed(1), 'vImp', r.flight.vImpact.toFixed(1), 'ppv5', (P.ppvAt(sh, 5) * 1000).toFixed(1), 'Hz', (1 / sh.T).toFixed(1), 'over', P.plasterOver(sh, 5));
    }
  }
}
