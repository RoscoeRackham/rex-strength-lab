global.window = {}; const P = require('./repo/rex-strength-lab/src/engine.js'); require('./repo/rex-strength-lab/src/data.js'); const D = window.DINO_DATA; const g = P.K.g;
const conc = D.surfaces.find((s) => s.id === 'concrete');
const mk = (b, kg, ub, anchor) => ({ F: kg * g, mode: 'comic', body: P.makeBody({ build: b, H: 3.048, m: 3007 }), surface: conc, anchor, unbreakable: ub, keepForm: true, ownRecoil: true, airAbsorb: 1 });
for (const kg of [3690, 5000, 7860, 20000]) {
  const on = P.collide(mk('ollie', kg, true, 'friction'), mk('rex', kg, true, 'bolted'), { source: 'sprint' });
  const off = P.collide(mk('ollie', kg, false, 'friction'), mk('rex', kg, false, 'bolted'), { source: 'sprint' });
  const src = on.toGround ? P.impulseSource(conc, on.toGround.J, on.toGround.T) : null;
  console.log(kg, 'v0', on.v0.toPrecision(3), 'power on: J', on.toGround && on.toGround.J.toPrecision(3), 'plasterReach', src && P.plasterReach(src).toPrecision(3), '| real ground: held', off.held, 'rock rT', off.rock && off.rock.rT, 'toGround', off.toGround, 'h.inel.pT', off.h.inel.pT.toPrecision(3));
}
