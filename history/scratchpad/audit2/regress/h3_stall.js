const { P, D, ctx, obj } = require('./common.js');
let n = 0;
for (const o of D.objects.filter((x) => !x.noThrow)) for (const ang of [0, 30, 60, 89, 90]) for (const anchor of ['friction', 'bolted']) for (const surface of ['sand', 'concrete']) {
  for (let lg = 0.5; lg <= 14; lg += 0.25) {
    const kg = Math.pow(10, lg); if (kg < o.m * 1.02) continue;
    const c = ctx({ kg, mode: 'real', surface, anchor });
    const r = P.throwObject(c, o, ang);
    if (!r.canMove && r.F > r.mB * P.K.g * Math.sin(ang * Math.PI / 180) * 1.02) {
      if (n++ < 15) console.log(o.id, ang, anchor, surface, 'lift 1e' + lg, 'F', r.F.toExponential(3), 'RB', (r.mB * P.K.g * Math.sin(ang * Math.PI / 180)).toExponential(3), 'push', r.push && JSON.stringify({ t: r.push.t, xA: r.push.xA, xB: r.push.xB, st: r.push.stalled }));
    }
  }
}
console.log('stall cases', n);
