const { P, D, g, surf, rex, ollie, ON, ctxOf } = require('./setup.js');
for (const sid of ['concrete', 'asphalt', 'granite']) for (const lg of [3.5, 4, 4.5, 5, 5.5, 6]) {
  const cA = ctxOf(Math.pow(10, lg), Object.assign({}, ON, { unbreakable: false, surface: surf(sid) })), cB = ctxOf(Math.pow(10, lg), Object.assign({}, ON, { unbreakable: false, surface: surf(sid) }), ollie());
  const t = P.throwPartner(cA, cB, 45);
  const M = P.RESTRAINT.MOVES.throw;
  const mo = { obj: t.obj, surface: cA.surface, body: cA.body, anchor: cA.anchor, angle: 45, near: 5, airAbsorb: 1, keepForm: true, unbreakable: false, ownRecoil: true };
  console.log(sid, lg, 'v', t.r.v && t.r.v.toFixed(1), 'sinkRatio', t.r.sinkRatio && t.r.sinkRatio.toFixed(2), 'ground', M.ground(t.r, mo));
}
