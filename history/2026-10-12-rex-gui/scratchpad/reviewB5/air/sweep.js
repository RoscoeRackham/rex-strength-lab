const { P, body, obj } = require('./load.js');
const cases = [['car',45,50],['car',45,300],['car',45,3000],['baseball',45,40],['baseball',45,400],['baseball',45,5000],['car',80,2000],['bus',20,800],['baseball',-10,600]];
for (const [id,th,v] of cases) {
  const o = obj(id);
  let prev = null, bad = [];
  const rows = [];
  for (let s = 0; s <= 1.0001; s += 0.05) {
    const dK = 1 - Math.min(1, s);
    const f = P.fly({v0:v, thetaDeg:th, h0: body.releaseHeight, m:o.m, A:o.area, Cd:o.Cd, CdSup:o.CdSup, dragK:dK});
    const E0 = 0.5*o.m*v*v + o.m*(P.K.GM/P.K.R_E - P.K.GM/(P.K.R_E+body.releaseHeight));
    const Ebal = f.landed ? E0 - 0.5*o.m*f.vImpact*f.vImpact : NaN;
    const airE = f.air ? f.air.E : NaN;
    rows.push([s.toFixed(2), f.range.toPrecision(6), f.apex.toPrecision(5), airE.toPrecision(5), Ebal.toPrecision(5), f.ocean? f.ocean.E.toPrecision(5):'-', f.landed, f.steps]);
    if (prev) {
      if (f.range < prev.range*(1-1e-9) && f.landed) bad.push('range fell at '+s.toFixed(2));
      if (f.air && prev.air && f.air.E > prev.air.E*(1+1e-9)) bad.push('airE rose at '+s.toFixed(2));
    }
    prev = f;
  }
  console.log('==', id, th, v, bad.join('; ') || 'monotone');
  for (const r of rows) console.log(r.join('\t'));
}
