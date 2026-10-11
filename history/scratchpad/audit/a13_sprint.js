const { P, g, ctx, obj } = require('./common.js');
for (const [kg, H] of [[10, 2], [100, 2], [511, 2], [511, 50], [1238, 2], [1e6, 2]]) {
  const m = 180 * (H / 2) ** 3;
  for (const mode of ['real', 'comic']) {
    const c = ctx(kg, mode, { H, m });
    const s = P.sprint(c), j = P.jump(c);
    console.log(`${kg} kg strength, H ${H} (body ${m.toFixed(0)} kg, F/W = ${(kg / m).toFixed(4)}) ${mode}: sprint top ${s.vTop.toFixed(2)} m/s (${s.topLimit}), accel ${s.accelG.toFixed(3)} g | jump ${j.push.stalled ? 'stalled' : j.v.toFixed(2)}`);
  }
}
console.log('19.3 m/s =', (19.3 / 0.44704).toFixed(1), 'mph; Weyand press projection 35-40 mph =', (35 * 0.44704).toFixed(1), '-', (40 * 0.44704).toFixed(1), 'm/s');
