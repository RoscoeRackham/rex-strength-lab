const { P, ctx, obj } = require('../h.js');
for (const mode of ['real','comic']) for (const id of ['shuttle','b777','loco','cc177','liberty','tank','semi','car']) for (const ang of [89,45]) {
  let worst = 0, wl = 0, tot = 0, n = 0;
  for (let lg = 2.708; lg <= 12; lg += 0.25) {
    const c = ctx({ mode, logKg: lg });
    const t = process.hrtime.bigint();
    P.throwObject(c, obj(id), ang);
    const ms = Number(process.hrtime.bigint() - t) / 1e6;
    tot += ms; n++;
    if (ms > worst) { worst = ms; wl = lg; }
  }
  console.log(mode, id, ang, 'worst', worst.toFixed(1), 'at', wl.toFixed(2), 'mean', (tot/n).toFixed(1));
}
