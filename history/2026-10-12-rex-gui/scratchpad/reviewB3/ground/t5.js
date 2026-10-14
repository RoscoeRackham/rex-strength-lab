const { P, D, g, surf, obj, rex, ollie, M, ctxOf, sig } = require('./common.js');
for (const oid of ['bus','car']) for (const kg of [1e4, 1e5, 1e6]) for (const anchor of ['friction','bolted']) {
  const c = ctxOf(kg*g, { ownRecoil: true, unbreakable: true, anchor });
  const r = P.pull(c, obj(oid));
  const o = { surface: c.surface, body: rex, obj: obj(oid), ownRecoil: true, unbreakable: true, anchor };
  const s = M.pull.shake(r, o);
  // the rope impulse (what goes into the planet via feet/bolts) for bolted: rope tension = m_obj a + resist
  const rope = obj(oid).m * r.accel + r.resist;
  console.log(oid, sig(kg), anchor, 'a', sig(r.accel), 't10', sig(r.t10m), 'rope N', sig(rope), 'ropeT', r.ropeT && sig(r.ropeT), 'shake ppv2', s ? sig(P.ppvAt(s,2)) : 'none (not counted)', 'J', sig(rope * r.t10m));
}
console.log('shakeOff bolted', P.RESTRAINT.shakeOff(M.pull, { ownRecoil: true, anchor: 'bolted' }));
