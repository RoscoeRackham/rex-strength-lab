const { P, ctx } = require('/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit/lib.js');
const K = P.K;
for (const L of [Math.log10(1.81436948e+23), Math.log10(5.9724e24)]) {
  const r = P.jump(ctx({ logKg: L }));
  const b = r.v / K.c;
  console.log(L.toFixed(4), 'v/c', b, '1-b', 1 - b, 'vB', r.push.vB, 'Eg', r.Eground.toExponential(3), 'work', r.push.work.toExponential(3));
  // what physical (uncapped, nonrelativistic) terminal speed would be
  const F = r.F, cB = K.PONCELET_K * 2400 * 2 * ctx({}).body.footArea;
}
const c = ctx({});
console.log('footArea', c.body.footArea, 'feetMass', c.body.feetMass, 'rho concrete', c.surface.rho, 'qult', c.surface.qult);
// where does cap start binding (comic concrete)
for (let L = 14; L <= 15; L += 0.05) { const r = P.jump(ctx({ logKg: L })); if (r.push.vB >= 0.01 * K.c * (1 - 1e-9)) { console.log('cap binds from logKg', L.toFixed(2)); break; } }
// where Eground crosses binding
for (let L = 33.8; L <= 34; L += 0.005) { const r = P.jump(ctx({ logKg: L })); if (r.Eground >= K.EARTH_BIND) { console.log('Eground >= bind from logKg', L.toFixed(3)); break; } }
