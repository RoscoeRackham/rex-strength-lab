global.window = {};
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const surf = D.surfaces.find((s) => s.id === 'concrete');
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), ollie = P.makeBody({ build: 'ollie', H: 3.048, m: 3007 });
const pw = { airAbsorb: 1, keepForm: true, unbreakable: false, ownRecoil: true };
for (const t of [63.4, 113]) {
  const F = t * 1000 * g;
  const cA = Object.assign({ F, mode: 'comic', body: ollie, surface: surf, anchor: 'friction' }, pw), cB = Object.assign({ F, mode: 'comic', body: rex, surface: surf, anchor: 'friction' }, pw);
  const r = P.collide(cA, cB, { source: 'jump', toGround: true });
  const src = r.toGround ? P.impulseSource(surf, r.toGround.J, r.toGround.T) : null;
  console.log(t + ' t:', 'outcome', r.outcome, 'toGround', JSON.stringify(r.toGround), 'plaster over at 3 m', src ? P.plasterOver(src, 3) : null, 'plaster reach', src ? P.plasterReach(src).toFixed(2) : null);
}
