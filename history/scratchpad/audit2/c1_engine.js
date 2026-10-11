global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const P = require('/home/user/dino-strength-sim/src/engine.js');
const K = P.K || P.CONST || {};
const c0 = 299792458;
const g = 9.80665;
for (const id of ['allstar','earth']) {
  const t = D.tiers.find(x=>x.id===id);
  const body = P.makeBody({ H: 2, m: 180 });
  const surface = D.surfaces.find(s=>s.id==='concrete');
  const c = { F: t.liftKg * g, mode: 'comic', body, surface, groundHolds: false, anchor: 'friction' };
  const car = D.objects.find(o=>o.id==='car');
  const th = P.throwObject(Object.assign({}, c, {record:true}), car, 45);
  const j = P.jump(c), s = P.stomp(c), p = P.punch(c), cl = P.clap(c);
  const f = (v) => (1 - v/c0).toExponential(2);
  console.log(id, {throwV: f(th.v), recoil: f(th.recoilV), jump: f(j.v), jumpPushVB: j.push && f(j.push.vB), stompFoot: f(s.vFoot ?? s.v ?? NaN), stompBody: f(s.vBody), punch: f(p.vFist), clap: f(cl.vHand ?? cl.v ?? NaN)});
}
