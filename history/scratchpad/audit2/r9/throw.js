const { P, D, ctx } = require('/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit/common.js');
const K = P.K;
let worst = [];
for (const mode of ['comic']) for (const o of D.objects) for (let lk = 1; lk <= 34; lk += 0.5) for (const ang of [0, 10, 45, 80, 90]) {
  const r = P.throwObject(ctx(Math.pow(10, lk), { mode }), o, ang);
  if (r.flight && r.flight.landed && r.crater > 0) worst.push({ o: o.id, lk, ang, D: r.crater, E: r.Eimpact, ratio: r.crater / (2 * K.R_E), dis: r.Eimpact >= K.EARTH_BIND });
}
worst.sort((a, b) => b.D - a.D);
console.log(worst.slice(0, 12).map(w => `${w.o} lk${w.lk} a${w.ang} D=${(w.D/1000).toFixed(0)}km D/2RE=${w.ratio.toFixed(3)} E=${w.E.toExponential(2)} dis=${w.dis}`).join('\n'));
console.log('count >1000km', worst.filter(w => w.D > 1e6).length);
