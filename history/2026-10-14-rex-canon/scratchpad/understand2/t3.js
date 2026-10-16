const { P, D, g, surf, obj, rex, ollie, ON, ctxOf, sig } = require('./base.js');
const S = (o) => o ? JSON.stringify(Object.fromEntries(Object.entries(o).filter(([k, v]) => typeof v !== 'object' && typeof v !== 'function').map(([k, v]) => [k, sig(v)]))) : '-';
const dials = [90718.474, 1e9, 1e12];
const P2 = (lab, ex) => [lab, ex];
for (const kg of dials) for (const [lab, ex] of [['off', {}], ['on', ON], ['UB only', { unbreakable: true }], ['OR only', { ownRecoil: true }]]) {
  const cR = ctxOf(kg, ex), cO = Object.assign({}, cR, { body: ollie });
  // shove
  const sh = P.shove(cR, cO);
  const pB = P.vToMomentum(sh.vB, ollie.m), pA = P.vToMomentum(sh.vA, rex.m);
  console.log('SHOVE', sig(kg), lab, 'pB', sig(pB), 'pA', sig(pA), 'push.t', sig(sh.push.t), 'fB.R*t?', 'toGround', S(sh.toGround), 'toGroundB', S(sh.toGroundB), 'stalled', sh.stalled, 'basis', sh.basis || 'comic');
  // throwPartner
  const tp = P.throwPartner(cR, cO, 45);
  if (tp.r) console.log('THROWP', sig(kg), lab, 'v', sig(tp.r.v), 'pObj', sig(tp.r.canMove ? tp.r.push.pB * ollie.m / tp.r.mB : 0), 'recoilV', sig(tp.r.recoilV), 'toGround', S(tp.r.toGround), 'landToGround', S(tp.landToGround), 'fallsBack', tp.fallsBack);
  // arm wrestle
  const aw = P.armWrestle(cR, cO);
  console.log('ARM', sig(kg), lab, aw.outcome, 'pin', S(aw.pin), 'toGround', S(aw.toGround), 'tableBreaks', aw.tableBreaks);
  // catch leg car 30 m hard
  const L = P.catchLeg(cR, cO, obj('car'), 30, 'hard');
  console.log('CATCH', sig(kg), lab, L.result, 'vL', sig(L.aim && L.aim.vL), 'th', sig(L.aim && L.aim.thetaDeg), 'vArrive', sig(L.vArrive), 'angle', sig(L.angleDeg), 'recoil', S(L.recoil), 'toGroundT', S(L.toGroundT), 'toGroundC', S(L.toGroundC), 'catch', L.catch ? S({ uAfter: L.catch.uAfter, slide: L.catch.slide, R: L.catch.R, tStroke: L.catch.tStroke, slips: L.catch.slips, carried: L.catch.carried }) : '-');
  // toss
  const t = P.tossPartner(cR, ollie, 'Ollie', 'hard', 10, 'friction');
  console.log('TOSS', sig(kg), lab, t.result, 'v', sig(t.v), 'toGroundT', S(t.toGroundT), 'toGroundC', S(t.toGroundC), 'catch', t.catch ? S({ uAfter: t.catch.uAfter, slide: t.catch.slide }) : '-');
}
