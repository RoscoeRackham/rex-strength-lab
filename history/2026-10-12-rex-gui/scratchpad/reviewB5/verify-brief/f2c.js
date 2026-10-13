const R = __dirname + '/copy/rex-strength-lab/src/';
const P = require(R + 'engine.js'); global.window = {}; require(R + 'data.js'); const D = window.DINO_DATA;
const body = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const M = P.RESTRAINT.MOVES.jump;
const surface = D.surfaces.find(s => s.id === 'sand');
for (const lg of [3.6, 3.62, 3.65]) {
  const c1 = { F: Math.pow(10, lg) * P.K.g, mode: 'comic', body, surface, anchor: 'friction', unbreakable: true, airAbsorb: 1, keepForm: true, ownRecoil: true };
  const j1 = P.jump(c1); const o = { surface, body, m: body.m, unbreakable: true };
  const all = M.shake(j1, o);
  console.log(lg, 'sources ppv5 (mm/s):', all.map(s => (P.ppvAt(s, 5) * 1e3).toFixed(3)).join(', '), 'max', (P.ppvAt(all, 5) * 1e3).toFixed(3), 'pushOff', JSON.stringify(j1.pushOff));
  const j0 = P.jump(Object.assign({}, c1, { unbreakable: false, airAbsorb: 0, keepForm: false, ownRecoil: false }));
  console.log('   powers off total ppv5', (P.ppvAt(M.shake(j0, { surface, body, m: body.m }), 5) * 1e3).toFixed(3));
}
