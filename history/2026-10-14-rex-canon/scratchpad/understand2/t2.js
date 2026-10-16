const { P, D, g, surf, obj, rex, ollie, ON, ctxOf, sig } = require('./base.js');
const M = P.RESTRAINT.MOVES;
const dials = [90718.474, 1e9, 1e12];
const S = (o) => o ? JSON.stringify(Object.fromEntries(Object.entries(o).map(([k, v]) => [k, sig(v)]))) : '-';
for (const kg of dials) for (const [lab, ex] of [['off', {}], ['on', ON], ['UB only', { unbreakable: true }], ['OR only', { ownRecoil: true }]]) {
  const c = ctxOf(kg, ex), o = Object.assign({ surface: c.surface, body: rex, m: rex.m }, ex);
  const st = P.stomp(c);
  const blow = M.stomp.blow(st, o);
  // stomp: foot pB down, body pA up (bolted -> 0)
  console.log('STOMP', sig(kg), lab, 'pFoot', sig(st.push.pB), 'pBody', sig(st.push.pA), 'vBody', sig(st.vBody), 'bolted', st.bolted, 't', sig(st.push.t), 'F*t', sig(st.F * st.push.t), 'mAg t', sig((rex.m - rex.legEff) * g * st.push.t), 'blow', S(blow), 'absorbed', sig(st.absorbed), 'basis', st.basis || 'comic');
  const pu = P.punch(c);
  console.log('PUNCH', sig(kg), lab, 'pFist', sig(pu.push.pB), 'pBody', sig(pu.push.pA), 'recoilV', sig(pu.recoilV), 'anchorR', sig(pu.anchor.R), 'toGround', S(pu.toGround), 'basis', pu.basis || 'comic');
  const cl = P.clap(c);
  console.log('CLAP', sig(kg), lab, 'pHand', sig(cl.push.pB), 'pA', sig(cl.push.pA));
  const j = P.jump(c);
  console.log('JUMP', sig(kg), lab, 'v', sig(j.v), 'pBody', sig(P.vToMomentum(j.v, rex.m)), 'push.pA', sig(j.push.pA), 'push.pB', sig(j.push.pB), 't', sig(j.push.t), 'pushOff', S(j.pushOff), 'landing', S({ v: j.landing.v, t: j.landing.t, absorbed: j.landing.absorbed }), 'landBear', sig(j.landBear), 'basis', j.basis || 'comic');
  const pl = P.pull(c, obj('car'));
  console.log('PULL', sig(kg), lab, 'canMove', pl.canMove, 'accel', sig(pl.accel), 'vEnd', sig(pl.vEnd), 't10m', sig(pl.t10m), 'resist', sig(pl.resist), 'ropeT', sig(pl.ropeT), 'usable', sig(pl.usable), 'anchorR', sig(pl.anchor.R), 'footLimited', pl.footLimited, 'shake', !!M.pull.shake(pl, Object.assign({ obj: obj('car') }, o)));
}
