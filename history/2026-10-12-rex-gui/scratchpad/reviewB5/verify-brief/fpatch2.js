const R = __dirname + '/patched/';
const P = require(R + 'engine.js'); global.window = {}; require(R + 'data.js'); const D = window.DINO_DATA;
const body = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }); const M = P.RESTRAINT.MOVES.stomp;
for (const sid of ['sand', 'softclay']) for (const lg of [2.97, 2.98, 3, 6, 10]) {
  const surface = D.surfaces.find(s => s.id === sid);
  const c = { F: Math.pow(10, lg) * P.K.g, mode: 'comic', body, surface, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
  const r = M.run(c), o = Object.assign({}, c, { near: 1.5 }), b = M.blow(r, o), s = M.shake(r, o);
  console.log('patched', sid, lg, 'J', b.J.toFixed(0), 'supplied', (b.supplied || 0).toFixed(0), 'ppv5', (P.ppvAt(s, 5) * 1e3).toFixed(2), 'plasterOver1.5', P.plasterOver(s, 1.5));
}
