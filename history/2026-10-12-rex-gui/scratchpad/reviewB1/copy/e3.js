const P = require(process.cwd() + '/src/engine.js'); global.window = {}; require(process.cwd() + '/src/data.js'); const D = window.DINO_DATA;
const body = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const sf = D.surfaces.find(s => s.id === 'concrete');
const M = P.RESTRAINT.MOVES.throw;
const obj = D.objects.find(o => o.id === 'baseball');
for (const k of [0, 0.5, 1]) {
  const c = { F: 1e7 * P.K.g, mode: 'comic', body, surface: sf, anchor: 'friction', airAbsorb: k, keepForm: true, unbreakable: true, ownRecoil: true };
  const r = P.throwObject(c, obj, 45);
  const o = Object.assign({ obj, angle: 45, near: 5 }, c);
  const b = M.blastParts(r, o);
  console.log('share', k, 'v', r.v.toFixed(0), 'Eobj', r.Eobj.toExponential(3), 'dragLoss', r.dragLoss && r.dragLoss.toExponential(3), 'flight.air', JSON.stringify(r.flight.air), 'ocean', JSON.stringify(r.flight.ocean), 'blast', JSON.stringify(b), 'radius100Pa', P.blastRadius(Math.max(b.land,b.path), 100).toFixed(1));
}
