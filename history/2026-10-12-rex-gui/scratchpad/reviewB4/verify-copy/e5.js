const R = __dirname + '/repo/rex-strength-lab/src/';
const P = require(R + 'engine.js'); global.window = {}; require(R + 'data.js'); const D = window.DINO_DATA;
const g = P.K.g, body = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
for (const [sf, kg] of [['sand', 100 * 907.18474], ['concrete', 1e8]]) {
  const c = { F: kg * g, mode: 'comic', body, surface: D.surfaces.find(s => s.id === sf), anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, use: Infinity };
  const r = P.jump(c); const L = r.landing; const p = P.vToMomentum ? P.vToMomentum(L.v, 3007) : 3007 * L.v;
  const ground = Math.min(p, r.landBear * L.t);
  console.log(sf, kg.toExponential(2), 'landing v', L.v.toFixed(2), 'T', L.t.toFixed(4), 'p_land', p.toFixed(0), 'landBear N', r.landBear.toFixed(0), 'ground takes', ground.toFixed(0), 'supplied', (p - ground).toFixed(0), 'share supplied', ((p - ground) / p * 100).toFixed(1) + '%');
}
