const { P, D, g, surf, obj, rex, ollie, ON, ctxOf, sig } = require('./base.js');
const o = obj('car');
for (const [v0, th] of [[30, 45], [300, 45], [3000, 45], [300, 80]]) {
  const f = P.fly({ v0, thetaDeg: th, h0: 2.7, m: o.m, A: o.area, Cd: o.Cd, CdSup: o.CdSup, dragK: 0 });
  const f2 = P.flyTo({ v0, thetaDeg: th, h0: 2.7, hStop: 0, m: o.m, A: o.area, Cd: o.Cd, CdSup: o.CdSup, Rn: 1, dragK: 0, Dend: 1e9 });
  console.log(v0, th, 'fly ocean.P (|sum vec|)', sig(f.ocean && f.ocean.P), 'flyTo ocean.P (sum |D|dt)', sig(f2.ocean && f2.ocean.P), 'ratio', sig((f2.ocean && f2.ocean.P) / (f.ocean && f.ocean.P)), 'landed', f.landed, f2.landed);
}
