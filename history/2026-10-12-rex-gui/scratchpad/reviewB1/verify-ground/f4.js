const { P, D, g, ON, OFF, ctx } = require('./h.js');
const ball = D.objects.find(o => o.id === 'baseball');
for (const kg of [1e4, Math.pow(10, 5.5), 1e6]) {
  for (const [nm, pw] of [['ON', ON], ['unb only', Object.assign({}, OFF, { unbreakable: true })]]) {
    const cR = ctx(kg, { pw }), cO = ctx(kg, { build: 'ollie', pw });
    const a = P.catchLeg(cR, cO, ball, 10, 'hard');
    const vL = a.aim ? a.aim.vL : a.vL;
    // solo throw at the same release speed: search use so r.v = vL at the same angle
    const th = a.aim ? a.aim.thetaDeg : a.thetaDeg;
    let lo = 1e-6, hi = kg * g;
    const run = (u) => P.throwObject(Object.assign({}, cR, { use: u, noFlight: true }), ball, th);
    for (let i = 0; i < 200; i++) { const mid = Math.sqrt(lo * hi); if (run(mid).v < vL) lo = mid; else hi = mid; }
    const r = run(hi);
    const sC = a.toGroundT && P.impulseSource(cR.surface, a.toGroundT.J, a.toGroundT.T);
    const sT = r.toGround && P.impulseSource(cR.surface, r.toGround.J, r.toGround.T);
    console.log(nm, (kg).toPrecision(3), 'result', a.result, 'vL', vL && vL.toFixed(2), 'th', th && th.toFixed(1), '| catch J', a.toGroundT && a.toGroundT.J.toPrecision(4), 'T', a.toGroundT && a.toGroundT.T.toPrecision(3), 'ppv5', sC && (P.ppvAt(sC, 5) * 1000).toFixed(3),
      '| throw v', r.v.toFixed(2), 'J', r.toGround && r.toGround.J.toPrecision(4), 'T', r.toGround && r.toGround.T.toPrecision(3), 'ppv5', sT && (P.ppvAt(sT, 5) * 1000).toFixed(3), 'mB', r.mB.toFixed(3), 'recoil(catch)', a.recoil && a.recoil.v);
  }
}
