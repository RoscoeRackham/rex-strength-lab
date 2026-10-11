const { P, g, ctx, obj, D } = require('./lib.js');
for (const mode of ['comic', 'real']) {
  const c = ctx({ kg: 511, mode, surface: 'concrete' });
  const s = P.throwObject(c, obj('shot'), 37), b = P.throwObject(c, obj('baseball'), 0);
  console.log(mode, '| shot v', s.v.toFixed(2), 'range', s.flight.range.toFixed(2), 'm (record 23.56 m) | pitch v', b.v.toFixed(2), 'm/s (record 47.3) | punch', P.punch(c).vFist.toFixed(2), '| jump', P.jump(c).v.toFixed(3), '| stomp', P.stomp(c).vFoot.toFixed(2), '| clap', P.clap(c).vHand.toFixed(2));
}
// comic vs real across strengths: does comic "overshoot" at the calibration point?
for (const kg of [100, 300, 511, 1000, 3000]) {
  const cc = ctx({ kg, mode: 'comic' }), cr = ctx({ kg, mode: 'real' });
  console.log('lift', kg, '| shot comic', P.throwObject(cc, obj('shot'), 37).v.toFixed(2), 'real', P.throwObject(cr, obj('shot'), 37).v.toFixed(2), '| punch comic', P.punch(cc).vFist.toFixed(2), 'real', P.punch(cr).vFist.toFixed(2));
}
