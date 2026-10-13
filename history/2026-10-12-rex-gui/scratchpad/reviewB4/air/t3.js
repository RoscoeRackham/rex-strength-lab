const {P, obj} = require('./load.js');
const GM=P.K.GM, R=P.K.R_E;
for (const id of ['car','baseball','shot']) for (const v0 of [100, 300, 1000, 3000, 9000]) for (const s of [0.5, 0.9]) {
  const o=obj(id), h0=2.7;
  const f = P.fly({ v0, thetaDeg: 45, h0, m: o.m, A: o.area, Cd: o.Cd, CdSup: o.CdSup, dragK: 1-s });
  const ke0 = 0.5*o.m*v0*v0, pe = o.m*(GM/R - GM/(R+h0));
  const lost = f.landed ? ke0 + pe - 0.5*o.m*f.vImpact*f.vImpact : NaN;
  // momentum check: integrate? use impulse balance: m*v_final - m*v0 = gravity impulse - air impulse -> hard on round Earth; skip
  console.log(id, v0, s, f.landed, 'airE', f.air.E.toPrecision(5), 'KE lost', lost.toPrecision(5), 'ratio', (f.air.E/lost).toFixed(5), 'ocean/air', (f.ocean.E/f.air.E).toFixed(4), 'expect', (s/(1-s)).toFixed(4));
}
