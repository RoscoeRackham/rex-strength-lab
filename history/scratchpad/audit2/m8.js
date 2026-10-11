global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const P = require('/home/user/dino-strength-sim/src/engine.js');
const D = window.DINO_DATA;
const g = P.K.g;
function ctx(kg, anchor, extra) {
  const body = P.makeBody({ H: 2, m: 180 });
  const surface = D.surfaces.find((s) => s.id === 'concrete');
  return Object.assign({ F: kg * g, mode: 'comic', body, surface, groundHolds: false, anchor }, extra || {});
}
for (const kg of [90718.474, 1e9]) for (const a of ['friction', 'braced', 'bolted']) {
  const r = P.stomp(ctx(kg, a));
  console.log(kg, a, 'E', r.E.toExponential(3), 'vFoot', r.vFoot.toFixed(2), 'vBody', r.vBody.toFixed(3), 'apex', r.bodyFlight.apex, 'footShare', r.footShare.toFixed(3));
}
// what if RA = Infinity
const body = P.makeBody({ H: 2, m: 180 });
for (const kg of [90718.474, 1e9]) {
  const c = ctx(kg, 'bolted');
  const F = c.F * P.MUSCLE.stomp.comicFrac;
  const mB = body.legEff, mA = body.m - mB;
  const pu = P.pushApart({ F, d: body.strokes.stomp, mA, mB, RA: Infinity, RB: 0, mode: 'comic', vmax: P.MUSCLE.stomp.vmax * body.s });
  const pu0 = P.pushApart({ F, d: body.strokes.stomp, mA, mB, RA: mA*g, RB: 0, mode: 'comic', vmax: P.MUSCLE.stomp.vmax * body.s });
  console.log('bolted-fix', kg, 'EB', pu.EB.toExponential(3), 'vB', pu.vB.toFixed(2), 'pA', pu.pA, ' | current EB', pu0.EB.toExponential(3), 'vB', pu0.vB.toFixed(2));
}
console.log('legEff', body.legEff, 'm', body.m, 'stroke', body.strokes.stomp, P.MUSCLE.stomp);
// compare punch with bolted vs friction
for (const a of ['friction','bolted']) { const r = P.punch(ctx(90718.474, a)); console.log('punch', a, r.vFist.toFixed(2), r.recoilV.toFixed(3), r.E.toExponential(3)); }
