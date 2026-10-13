global.window = {};
const R = '/home/user/rex-strength-lab/rex-strength-lab';
const P = require(R + '/src/engine.js'); require(R + '/src/data.js'); const D = window.DINO_DATA, g = P.K.g;
const surf = (id) => D.surfaces.find((s) => s.id === id), obj = (id) => D.objects.find((o) => o.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const M = P.RESTRAINT.MOVES;
for (const s of [0, 0.01, 0.5, 1]) {
  const c = { F: 1e8 * g, mode: 'comic', body: rex, surface: surf('concrete'), anchor: 'friction', airAbsorb: s, keepForm: true, unbreakable: true, ownRecoil: true };
  const r = P.throwObject(c, obj('baseball'), 0);
  const o = { obj: obj('baseball'), angle: 0, body: rex, surface: c.surface, anchor: 'friction', near: 5, airAbsorb: s, unbreakable: true, ownRecoil: true, keepForm: true };
  const b = M.throw.blastParts(r, o);
  const p = P.RESTRAINT.planNow('throw', c, { obj: obj('baseball'), angle: 0, target: 30, near: 5 });
  const w = p.result('preset:windows');
  console.log('share', s, 'v', r.v.toPrecision(3), 'blast land', b.land.toPrecision(3), 'path', b.path.toPrecision(3), 'hand', (b.hand || 0).toPrecision(3), '| windows R(6.9kPa)', P.blastRadius(Math.max(b.land, b.path), 6900).toFixed(1), 'm | windows preset', w.never ? 'never' : (w.use / g).toPrecision(3) + ' kg');
}
