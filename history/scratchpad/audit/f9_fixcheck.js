const P = require('./engine_f9fix.js');
global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = global.window.DINO_DATA;
const g = 9.81;
const surface = D.surfaces.find(s => s.id === 'concrete');
const tank = D.objects.find(o => o.id === 'tank');
const body = P.makeBody({});
for (const tier of ['human','spidey','allstar']) {
 for (const gh of [false, true]) {
  const t = D.tiers.find(x => x.id === tier);
  const c = { F: t.liftKg * g, mode: 'comic', body, surface, groundHolds: gh, anchor: 'friction' };
  const s = P.sprint(c), p = P.pull(c, tank), pu = P.punch(c);
  const th = P.throwObject(c, tank, 45);
  console.log(tier, 'groundHolds='+gh,
   '| sprint thrust', s.thrust.toExponential(3), s.limit, 'accelG', s.accelG.toExponential(3), 'vTop', s.vTop.toExponential(3), s.topLimit,
   '| pull anchor R', p.anchor.R.toFixed(0), p.anchor.limit, 'canMove', p.canMove, 'limitedBy', p.limitedBy,
   '| punch anchor R', pu.anchor.R.toFixed(0), pu.anchor.limit,
   '| throw anchor R', th.anchor.R.toExponential(3), th.anchor.limit);
 }
}
console.log('mu m g =', surface.mu*body.m*g, 'body.m', body.m);
