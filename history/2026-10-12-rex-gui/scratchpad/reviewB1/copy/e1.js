const P = require(process.cwd() + '/src/engine.js'); global.window = {}; require(process.cwd() + '/src/data.js'); const D = window.DINO_DATA;
const body = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const sf = D.surfaces.find(s => s.id === 'concrete');
const M = P.RESTRAINT.MOVES.throw;
for (const [objId, logKg, ang] of [['car', 5, 45], ['car', 6, 45], ['car', 8, 45], ['allstar', 23.2587, 0], ['baseball', 5, 45], ['bus', 6, 45]]) {
  const obj = D.objects.find(o => o.id === objId);
  const c = { F: Math.pow(10, logKg) * P.K.g, mode: 'comic', body, surface: sf, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
  const r = P.throwObject(c, obj, ang);
  const o = Object.assign({ obj, angle: ang, near: 5 }, c);
  const sh = M.shake(r, o);
  console.log(objId, logKg, 'v', r.v.toPrecision(3), 'landed', r.flight && r.flight.landed, 'esc', r.flight && r.flight.escaped, 'rel', r.flight && r.flight.relativistic, 'canMove', r.canMove, 'shakeFrom', M.shakeFrom(r, o), 'plaster reach', JSON.stringify((Array.isArray(sh)?sh:[sh]).map(s => s ? P.plasterReach(s).toPrecision(3) : null)), 'toGround', JSON.stringify(r.toGround));
}
