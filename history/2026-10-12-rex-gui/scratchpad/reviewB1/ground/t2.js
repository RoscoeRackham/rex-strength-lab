const { P, D, g, surf, obj, rex, ollie, ctxOf, ON, sig, M } = require('./common.js');
console.log('limbPulse rex', P.limbPulse(rex), 'expected', 2*0.026*Math.sqrt(0.45*3.048/0.9));
console.log('rex whipEff', rex.whipEff, 'handEff', rex.handEff, 'legEff', rex.legEff, 'feetMass', rex.feetMass, 'strokes', JSON.stringify(rex.strokes));
for (const [oid, kg, th] of [['baseball', 1e4, 0], ['baseball', 1e6, 0], ['car', 1e5, 30], ['bus', 1e5, 45], ['car', 1e7, 0], ['bus', 1e3, 0]]) {
  for (const ex of [{ ownRecoil: true }, { unbreakable: true }, ON]) {
    const r = P.throwObject(ctxOf(kg, ex), obj(oid), th);
    if (!r.canMove) { console.log(oid, kg, JSON.stringify(ex), 'cannot move'); continue; }
    const pObj = P.vToMomentum(r.v, obj(oid).m);
    const pRec = r.recoilV ? P.vToMomentum(r.recoilV, rex.m) : 0;
    console.log(oid, kg, th, JSON.stringify(ex), 'J', sig(r.toGround && r.toGround.J), 'T', sig(r.toGround && r.toGround.T), 'push.t', sig(r.push.t), 'pB', sig(r.push.pB), 'pA', sig(r.push.pA), 'pObj', sig(pObj), 'pRecoil', sig(pRec), 'net', sig(pObj - pRec), 'mode', r.push.t);
  }
}
