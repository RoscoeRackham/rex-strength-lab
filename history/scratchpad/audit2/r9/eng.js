const { P, ctx } = require('/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit/common.js');
const K = P.K;
for (const mode of ['comic','real']) {
  console.log('mode', mode);
  for (let lk = 20; lk <= 40; lk++) {
    const c = ctx(Math.pow(10, lk), { mode });
    const r = P.stomp(c);
    console.log(lk, 'E=%s vFoot=%s D=%s km D/2R=%s quake=%s disrupts=%s extrap=%s', r.E.toExponential(3), r.vFoot.toExponential(3), (r.crater/1000).toFixed(0), (r.crater/(2*K.R_E)).toFixed(3), r.quake.toFixed(2), r.disrupts, r.craterExtrapolated);
  }
  const c = ctx(Infinity, { mode }); const r = P.stomp(c); console.log('inf', r.E, r.crater, r.disrupts);
}
