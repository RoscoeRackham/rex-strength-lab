const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
global.window = {}; require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA;
const body = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const RS = P.RESTRAINT;
for (const surfId of ['concrete', 'sand']) {
  const surface = D.surfaces.find(s => s.id === surfId);
  for (const lk of [20, 24, 26, 26.5, 27, 28, 30, 34, Infinity]) {
    const F = isFinite(lk) ? Math.pow(10, lk) * P.K.g : Infinity;
    const ctx = { F, mode: 'comic', body, surface, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, use: 1 };
    const opt = { near: 5, m: body.m, body, surface, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
    const r = RS.MOVES.stomp.run(Object.assign({}, ctx, { use: F }), opt);
    const b = RS.MOVES.stomp.blow(r, opt);
    const rc = RS.reach('stomp', r, opt);
    console.log(surfId, 'logKg', lk, 'vFoot/c', r.vFoot / P.K.c, 'E', r.E, 'realBreaks', r.realBreaks, 'blow', JSON.stringify(b), 'plaster', rc.plaster);
  }
}
