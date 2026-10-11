const { P, D, g, ctx, obj } = require('./common.js');
console.log('MUSCLE', JSON.stringify(P.MUSCLE, null, 1));
const b = P.makeBody({});
console.log('body', JSON.stringify(b));
// human-strength results, both modes, app-default surface concrete/friction
for (const mode of ['real','comic']) {
  const c = ctx(511, mode);
  const s = P.throwObject(c, obj('shot'), 37);
  const bb = P.throwObject(c, obj('baseball'), 0);
  const j = P.jump(c), p = P.punch(c), st = P.stomp(c), cl = P.clap(c), sp = P.sprint(c);
  console.log(mode, 'shot v', s.v.toFixed(3), 'range', s.flight.range.toFixed(2), '| ball v', bb.v.toFixed(2),
    '| jump v', j.v.toFixed(3), 'apex', j.flight.apex.toFixed(3), 'vacApex', j.vacuumApex.toFixed(3),
    '| punch', p.vFist.toFixed(2), '| stomp', st.vFoot.toFixed(2), '| clap', cl.vHand.toFixed(2), '| sprint', sp.vTop.toFixed(2));
}
