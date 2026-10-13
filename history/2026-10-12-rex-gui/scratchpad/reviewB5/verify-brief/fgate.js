const R = __dirname + '/patched2/';
const P = require(R + 'engine.js'); global.window = {}; require(R + 'data.js'); const D = window.DINO_DATA;
const body = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }); const M = P.RESTRAINT.MOVES.jump;
const surface = D.surfaces.find(s => s.id === 'sand');
let prev = null;
for (let lg = 3.5; lg <= 4.2; lg += 0.005) {
  const c = { F: Math.pow(10, lg) * P.K.g, mode: 'comic', body, surface, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
  const r = P.jump(c); const v = P.ppvAt(M.shake(Object.assign({}, r, { pushOff: undefined }), { surface, body, m: body.m, unbreakable: true }), 5);
  if (prev && v < prev.v * 0.995) console.log('gate-only fix DROP', prev.lg.toFixed(3), '->', lg.toFixed(3), (prev.v * 1e3).toFixed(3), '->', (v * 1e3).toFixed(3), 'mm/s');
  prev = { lg, v };
}
