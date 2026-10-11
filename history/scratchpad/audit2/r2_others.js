global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const P = require('/home/user/dino-strength-sim/src/engine.js');
const body = P.makeBody({ H: 2, m: 180 });
const surface = D.surfaces.find(s => s.id === 'concrete');
for (const F of [1e34*P.K.g, Infinity]) {
  const c = { F, mode: 'real', body, surface, groundHolds: false, anchor: 'friction' };
  const st = P.stomp(c), pu = P.punch(c), cl = P.clap(c);
  const th = P.throwObject(c, D.objects.find(o=>o.id==='car'), 45);
  console.log('F=',F, 'stomp vFoot', st.vFoot, 'vBody', st.vBody, '| punch', pu.vFist, '| clap', cl.vHand, '| throw car v', th.v);
}
