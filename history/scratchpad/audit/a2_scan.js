const { P, D, g, ctx, obj } = require('./common.js');
const kgs = [511, 2e3, 1e4, 1e5, 1e6, 3e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12, 1e13, 1e14, 1e15, 1e18, 1e21, 1.8e20, Infinity];
for (const extra of [{}, { groundHolds: true }]) {
  console.log('=== real mode', JSON.stringify(extra));
  for (const kg of kgs) {
    const c = ctx(kg, 'real', extra);
    const p = P.punch(c), cl = P.clap(c), st = P.stomp(c), j = P.jump(c);
    const ball = P.throwObject(c, obj('baseball'), 45), car = P.throwObject(c, obj('car'), 45), shot = P.throwObject(c, obj('shot'), 45);
    console.log(kg.toExponential(1).padEnd(8),
      'punch', p.vFist.toFixed(2), p.push.saturated ? 'S' : ' ', p.push.stalled ? 'STALL' : '',
      '| clap', cl.vHand.toFixed(2),
      '| stomp', st.vFoot.toFixed(2), 'vBody', st.vBody.toFixed(3),
      '| jump v', j.v.toFixed(3), j.push.saturated ? 'S' : ' ', 'sink', j.sink.toFixed(3),
      '| ball', ball.v.toFixed(2), '| shot', shot.v.toFixed(2), 'recoil', shot.recoilV.toFixed(2), '| car', car.v.toFixed(2), car.push.saturated ? 'S' : ' ', car.canMove ? '' : 'NOMOVE');
  }
}
