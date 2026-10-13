global.window = {};
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA;
const surface = D.surfaces.find(s => s.id === (process.argv[2] || 'concrete'));
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const M = P.RESTRAINT.MOVES.jump;
for (let e = 4; e <= 12.001; e += 0.5) {
  const ctx = { F: Math.pow(10, e) * P.K.g, mode: 'comic', body: rex, surface, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
  const r = P.jump(ctx);
  const po = r.pushOff; const s = po && po.J > 0 ? P.impulseSource(surface, po.J, Math.max(1e-9, po.T)) : null;
  const shake = M.shake(r, Object.assign({ near: 12 }, ctx, { m: rex.m, obj: null }));
  console.log(e.toFixed(1), 'v', r.v.toFixed(1), 'pushOff J', po ? po.J.toExponential(3) : '-', 'T', po ? po.T.toExponential(3) : '-', 'pushOff plaster', s ? P.plasterReach(s).toFixed(2) : '-', 'all-shake plaster', shake ? P.plasterReach(shake).toFixed(2) : '-');
}
