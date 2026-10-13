const { P, D, rex, surf, ctx } = require('./common.js');
const ball = D.objects.find(o => o.id === 'baseball');
const M = P.RESTRAINT.MOVES.throw, R = P.RESTRAINT.R;
for (const share of [0, 0.01, 0.5, 0.99, 1]) {
  const c = ctx({ F: 1e8 * P.K.g, airAbsorb: share });
  const o = Object.assign({}, c, { obj: ball, angle: 30, near: 5 });
  const r = M.run(c, o);
  const b = M.blastParts(r, o), E = M.blast(r, o);
  console.log(`share=${share} v=${r.v.toFixed(0)} blast=${(E/1e6).toFixed(2)}MJ parts land=${(b.land/1e6).toFixed(2)} path=${(b.path/1e6).toFixed(2)} hand=${b.hand!=null?(b.hand/1e6).toFixed(2):'-'} windowsR=${P.blastRadius(E, R.DP_WINDOWS).toFixed(1)}m harmR=${P.blastRadius(E, R.DP_HARM).toFixed(1)}m`);
}
