const R = __dirname + '/copy/rex-strength-lab/src/';
const P = require(R + 'engine.js'); global.window = {}; require(R + 'data.js'); const D = window.DINO_DATA;
const body = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const M = P.RESTRAINT.MOVES.jump;
const surface = D.surfaces.find(s => s.id === 'sand');
for (const lg of [3.55, 3.6, 3.62, 3.65, 3.66]) {
  const c1 = { F: Math.pow(10, lg) * P.K.g, mode: 'comic', body, surface, anchor: 'friction', unbreakable: true, airAbsorb: 1, keepForm: true, ownRecoil: true };
  const j1 = P.jump(c1);
  const jl = Object.assign({}, j1, { pushOff: undefined });
  const o = { surface, body, m: body.m };
  const capped = M.shake(jl, Object.assign({ unbreakable: true }, o)), uncapped = M.shake(jl, o);
  console.log(lg, 'landRatioReal', j1.landRatioReal.toFixed(3), 'sink', j1.landing.sink, 'landing ppv5 with cap', (P.ppvAt(capped, 5) * 1e3).toFixed(3), 'same landing, no cap', (P.ppvAt(uncapped, 5) * 1e3).toFixed(3), 'mm/s; at 1.5 m', (P.ppvAt(capped, 1.5) * 1e3).toFixed(2), 'vs', (P.ppvAt(uncapped, 1.5) * 1e3).toFixed(2), 'plaster reach', P.plasterReach(capped).toFixed(3), P.plasterReach(uncapped).toFixed(3));
}
