global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const P = require('/home/user/dino-strength-sim/src/engine.js');
const K = P.K, g = 9.80665;
const fixT = (accel, d) => Math.sqrt(2 * d / accel + (d / K.c) ** 2);
const finding = (f, M, d) => (M * K.c / f) * Math.sqrt(Math.pow(1 + d * f / (M * K.c * K.c), 2) - 1);
function run(kg, objId, H, m, inf) {
  const body = P.makeBody({ H, m });
  const surface = D.surfaces.find((s) => s.id === 'concrete');
  const ctx = { F: inf ? Infinity : kg * g, mode: 'comic', body, surface, groundHolds: false, anchor: 'bolted' };
  const o = D.objects.find((x) => x.id === objId);
  const r = P.pull(ctx, o);
  const M = o.m + body.m, net = r.usable - r.resist;
  const tf = fixT(r.accel, 10);
  const xcheck = P.xOfT(net, M, tf);
  const vEnd = P.momentumToV(net * tf, M);
  console.log(objId, inf ? 'inf' : kg.toExponential(2), 'H', H, '| engine t10m', r.t10m.toExponential(4), '| fix t10m', tf.toExponential(4), '| xOfT(fix)=', xcheck, '| v_end/c', (vEnd / K.c).toPrecision(4), '| finding formula', finding(net, M, 10).toExponential(4));
}
run(1.81436948e23, 'car', 2, 180);
run(1e20, 'car', 2, 180);
run(1e20, 'cc177', 2, 180);
run(0, 'car', 2, 180, true);
run(1e34, 'car', 2, 180);
run(90718.474, 'car', 2, 180);
run(511, 'car', 2, 180);
run(1e15, 'car', 2, 180);
run(1e16, 'car', 2, 180);
run(1e17, 'car', 2, 180);
// precision of finding formula at ordinary strengths
const body = P.makeBody({ H: 2, m: 180 });
