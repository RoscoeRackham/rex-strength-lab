// Does the constant-bearing anchor (line 241) matter for throws/punches? Look for cases limited by
// 'bearing' where the dino's recoil speed exceeds v* = sqrt(q/rho) (velocity term would dominate).
const { P, D, g, S, T, ctx } = require('./common');
const O = Object.fromEntries(D.objects.map(o => [o.id, o]));
const fmt = (x) => x.toPrecision(3);
for (const sid of ['sand', 'clay', 'asphalt', 'concrete']) for (const tid of ['human', 'spidey', 'thing', 'secretwars']) for (const oid of ['car', 'tank', 'b747']) for (const ang of [45, 80]) {
  const c = ctx(T[tid].liftKg, { surface: sid });
  const r = P.throwObject(c, O[oid], ang);
  if (r.anchor.limit !== 'bearing') continue;
  const vs = Math.sqrt(S[sid].qult / S[sid].rho);
  console.log(`${sid} ${tid} ${oid} ${ang}deg: limit bearing R ${fmt(r.anchor.R)} N, recoilV ${fmt(r.recoilV)} (v* ${fmt(vs)}), obj v ${fmt(r.v)}, xA ${fmt(r.push.xA)} xB ${fmt(r.push.xB)}`);
}
