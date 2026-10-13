const {P,D,rex,surf,obj,ctx}=require('./h.js');
const g=P.K.g;
for (const oid of ['car','baseball','bus']) for (const ang of [0,45]) for (const lg of [3,4,5,6,7,8,9,10]) {
  const res = [];
  for (const s of [1,0]) {
    const c = ctx(Math.pow(10,lg),{airAbsorb:s});
    const p = P.RESTRAINT.planNow('throw', c, { obj: obj(oid), angle: ang, target: 30, near: 5 });
    const r = p.result('preset:windows');
    res.push(r.never ? 'never' : (r.use/g).toPrecision(2));
  }
  if (res[0]==='never' && res[1] !== 'never') console.log('HINT CASE', oid, ang, '1e'+lg, res.join(' / '));
  else console.log(oid, ang, '1e'+lg, res.join(' / '));
}
