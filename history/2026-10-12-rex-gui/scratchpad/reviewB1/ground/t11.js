const { P, D, g, surf, obj, rex, ollie, ctxOf, ON, sig, M } = require('./common.js');
for (const [oid, Dd, style, kg] of [['baseball', 10, 'easy', 1e4], ['baseball', 10, 'hard', 1e4], ['baseball', 10, 'hard', 1e6], ['car', 30, 'hard', 1e6]]) {
  for (const ex of [ON, { unbreakable: true }]) {
    const cR = ctxOf(kg, ex), cO = Object.assign({}, cR, { body: ollie });
    const L = P.catchLeg(cR, cO, obj(oid), Dd, style);
    const vL = L.aim && L.aim.vL, th = L.aim && L.aim.thetaDeg;
    // the solo throw at the same angle and effort giving the same release speed: use throwOnce with a matching 'use'
    const r = P.throwObject(Object.assign({}, cR), obj(oid), th);
    const armMass = r.armMass;
    console.log(oid, Dd, style, sig(kg, 2), JSON.stringify(ex).slice(0, 40), 'result', L.result, 'vL', sig(vL, 4), 'toGroundT.J', sig(L.toGroundT && L.toGroundT.J, 4), 'T', sig(L.toGroundT && L.toGroundT.T, 3), '| (m+arm)*vL', sig((obj(oid).m + armMass) * vL, 4), '| solo all-out at th: v', sig(r.v, 4), 'J', sig(r.toGround && r.toGround.J, 4), 'J/(m v)', sig(r.toGround && r.toGround.J / P.vToMomentum(r.v, obj(oid).m), 3));
  }
}
