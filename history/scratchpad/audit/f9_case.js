const P = require('/home/user/dino-strength-sim/src/engine.js');
const o = { L: 11020, v: 20000, rhoI: 3000, rhoT: 2400 };
const Dfr = P.craterDiameter(o);
const Dtc = Dfr / 1.25;
const Dc = 3200;
const complex = 1.17 * Math.pow(Dtc, 1.13) / Math.pow(Dc, 0.13);
// independent Dtc
const g = 9.80665;
const DtcI = 1.161 * Math.cbrt(3000/2400) * Math.pow(11020, 0.78) * Math.pow(20000, 0.44) * Math.pow(g, -0.22);
console.log({ engineDfr_km: Dfr/1e3, Dtc_km: Dtc/1e3, DtcIndep_km: DtcI/1e3, complex_km: complex/1e3, ratio: complex/Dfr });
// at 45 deg
const D45 = P.craterDiameter({ ...o, angleDeg: 45 }); const t45 = D45/1.25;
console.log({ engine45_km: D45/1e3, complex45_km: 1.17*Math.pow(t45,1.13)/Math.pow(Dc,0.13)/1e3 });
// continuity at boundary
for (const dtc of [2559, 2560, 2561, 5000, 20000, 100000]) {
  console.log(dtc, 1.25*dtc, 1.17*Math.pow(dtc,1.13)/Math.pow(Dc,0.13));
}
