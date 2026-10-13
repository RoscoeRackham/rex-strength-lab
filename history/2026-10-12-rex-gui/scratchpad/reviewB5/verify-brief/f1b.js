const R = __dirname + '/copy/rex-strength-lab/src/';
const P = require(R + 'engine.js'); global.window = {}; require(R + 'data.js'); const D = window.DINO_DATA;
const body = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const M = P.RESTRAINT.MOVES.stomp;
for (const sid of D.surfaces.map(s => s.id)) {
  const surface = D.surfaces.find(s => s.id === sid);
  let prev = null, drops = [];
  for (let lg = 1.5; lg <= 12; lg += 0.005) {
    const c = { F: Math.pow(10, lg) * P.K.g, mode: 'comic', body, surface, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
    const r = M.run(c); const o = Object.assign({}, c, { near: 5 });
    const v = P.ppvAt(M.shake(r, o), 5);
    if (prev && v < prev.v * 0.99) drops.push(prev.lg.toFixed(3) + '->' + lg.toFixed(3) + ': ' + (prev.v * 1e3).toFixed(2) + ' -> ' + (v * 1e3).toFixed(2) + ' mm/s');
    prev = { lg, v };
  }
  console.log(sid, drops.length ? drops.join('; ') : 'monotonic (within 1%)');
}
const sand = D.surfaces.find(s => s.id === 'sand');
console.log('plaster limit at 1/0.064 Hz', (P.plasterLimitHz(1/0.0640) * 1e3).toFixed(1), 'mm/s');
