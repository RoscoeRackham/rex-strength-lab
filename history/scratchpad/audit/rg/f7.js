const { P, D, g, ctx, ctxO, obj } = require('./h.js');
for (const [mR, mO] of [[19.11, 19.11], [0, 0]]) {
  let hits = [];
  for (let lk = 1; lk <= 4; lk += 0.005) {
    const cR = ctx({ m: mR, logKg: lk }), cO = ctxO({ oM: mO, logKg: lk });
    const t = P.tossPartner(cR, cO.body, 'Ollie', 'hard', 10);
    if (t.result !== 'cant-hold' && !(t.v > 0)) hits.push(lk.toFixed(3) + ':' + t.result);
  }
  console.log(mR, mO, hits.length, hits.slice(0, 3).join(' '), hits.slice(-2).join(' '));
}
