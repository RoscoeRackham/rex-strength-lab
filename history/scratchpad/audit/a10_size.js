const { P, g, ctx, obj } = require('./common.js');
for (const H of [0.4, 2, 50]) {
  const m = 180 * (H / 2) ** 3;
  const c = ctx(Infinity, 'real', { H, m, groundHolds: true });
  const p = P.punch(c), j = P.jump(c), sp = P.sprint(c), cl = P.clap(c);
  const ball = P.throwObject(c, obj('baseball'), 45);
  console.log(`H ${H} m, m ${m.toFixed(1)} kg, real mode, infinite strength, comic ground: punch ${p.vFist.toFixed(1)} m/s (Mach ${(p.vFist/340.29).toFixed(2)}), clap ${cl.vHand.toFixed(1)}, jump takeoff ${j.v.toFixed(1)} m/s apex ${j.flight.apex.toFixed(1)} m, ball ${ball.v.toFixed(1)} m/s, sprint top ${sp.vTop.toFixed(1)} m/s`);
}
// human-strength at kaiju size: does comic==real still hold?
const ck = ctx(511, 'comic', { H: 50, m: 180 * 25 ** 3 }), rk = ctx(511, 'real', { H: 50, m: 180 * 25 ** 3 });
