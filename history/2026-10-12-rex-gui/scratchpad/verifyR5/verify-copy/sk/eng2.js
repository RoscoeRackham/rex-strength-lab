global.window = {}; const P = require('./lab/src/engine.js'); require('./lab/src/data.js'); const D = window.DINO_DATA;
const body = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
for (const sid of ['ice', 'steel', 'concrete']) {
  const surface = D.surfaces.find((s) => s.id === sid);
  const ctx = { F: Infinity, mode: 'comic', body, surface, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
  const r = P.jump ? P.jump(ctx) : P.jumpOnce(ctx);
  console.log(sid, JSON.stringify(r.pushOff), 'impulseSource:', P.impulseSource(surface, r.pushOff.J, Math.max(1e-9, r.pushOff.T)), 'groundOf:', !!P.groundOf(surface));
}
