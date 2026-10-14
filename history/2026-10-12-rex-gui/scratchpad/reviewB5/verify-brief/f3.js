const R = __dirname + '/copy/rex-strength-lab/src/';
const P = require(R + 'engine.js'); global.window = {}; require(R + 'data.js'); const D = window.DINO_DATA;
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), ollie = P.makeBody({ build: 'ollie', H: 3.06, m: 3007 });
const surface = D.surfaces.find(s => s.id === 'concrete');
for (const t of [50, 63.4, 80, 113]) {
  const base = { F: t * 1000 * P.K.g, mode: 'comic', surface, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: false, ownRecoil: true };
  const cA = Object.assign({}, base, { body: ollie }), cB = Object.assign({}, base, { body: rex });
  const r = P.collide(cA, cB, { source: 'jump', toGround: true });
  const r2 = P.collide(cA, cB, { source: 'jump' });
  const src = r.toGround ? P.impulseSource(surface, r.toGround.J, r.toGround.T) : null;
  console.log(t + ' t: outcome', r.outcome, 'toGround', r.toGround ? JSON.stringify({ J: Math.round(r.toGround.J), T: r.toGround.T.toFixed(3), how: r.toGround.how }) : null, 'plaster reach', src ? P.plasterReach(src).toFixed(2) + ' m' : '-', '| without toGround option:', r2.toGround ? 'has toGround' : 'no toGround');
}
