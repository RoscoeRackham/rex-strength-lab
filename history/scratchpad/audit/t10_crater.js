const P = require('/home/user/dino-strength-sim/src/engine.js');
const K = P.K, g = K.g;
const D = (function(){ const window = {}; eval(require('fs').readFileSync('/home/user/dino-strength-sim/src/data.js','utf8')); return window.DINO_DATA; })();
const body = P.makeBody({});
const surf = (id) => D.surfaces.find(s => s.id === id);
const ctx = (kg, sid, mode) => ({ F: kg * g, mode: mode || 'comic', body, surface: surf(sid || 'concrete'), groundHolds: false, anchor: 'friction' });
// Independent transcription of Collins et al. (2005) eq. 21/22/27
const Dtc = (L, v, ri, rt, thDeg) => 1.161 * Math.cbrt(ri / rt) * L ** 0.78 * v ** 0.44 * g ** -0.22 * Math.cbrt(Math.sin(thDeg * Math.PI / 180));
const Dfinal = (dtc) => dtc * 1.25 <= 3200 ? 1.25 * dtc : 1.17 * dtc ** 1.13 / 3200 ** 0.13;
console.log('--- transcription check');
for (const [L, v, ri, rt, th] of [[1, 2000, 1000, 2400, 90], [100, 20000, 3000, 2700, 45], [11020, 20000, 3000, 2400, 90]]) {
  const e = P.craterDiameter({ L, v, rhoI: ri, rhoT: rt, angleDeg: th });
  console.log(`L=${L} v=${v} ri=${ri} rt=${rt} th=${th}: engine ${e.toPrecision(8)} indep 1.25*Dtc ${(1.25 * Dtc(L, v, ri, rt, th)).toPrecision(8)} | with complex-crater eq.27: ${Dfinal(Dtc(L, v, ri, rt, th)).toPrecision(6)}`);
}
// --- relativistic stomp crater vs energy
console.log('--- stomp crater vs energy (concrete)');
const vRef = 20000, rhoAst = 3000;
for (const lk of [6, 8, 10, 15, 20, 25, 30, 34]) {
  const s = P.stomp(ctx(10 ** lk));
  // energy-equivalent stony impactor at 20 km/s, same target, same formula family
  const mEq = 2 * s.E / vRef ** 2, LEq = Math.cbrt(6 * mEq / (Math.PI * rhoAst));
  const eqD = Dfinal(Dtc(LEq, vRef, rhoAst, 2400, 90));
  console.log(`logKg ${lk}: vFoot ${(s.vFoot / K.c).toPrecision(4)} c (${s.vFoot.toExponential(3)} m/s) E ${s.E.toExponential(3)} J  engine crater ${s.crater.toFixed(1)} m | same-energy 20 km/s asteroid crater ${eqD.toExponential(3)} m | ratio ${(eqD / s.crater).toExponential(2)}`);
}
console.log('Chicxulub: E ~4.2e23 J (data.js), observed final diameter ~180 km');
// --- strength regime: Holsapple (1993) combined scaling, ratio vs gravity-only, soft rock (concrete-like) and hard rock
console.log('--- strength vs gravity regime (Holsapple pi-scaling, mu=0.55 nu=0.4, K2=1)');
const mu = 0.55, nu = 0.4;
function strengthRatio(a, U, rhoT, rhoI, Y) {
  const pi2 = g * a / U ** 2, pi3 = Y / (rhoT * U ** 2), dr = rhoT / rhoI;
  const G = pi2 * dr ** ((6 * nu - 2 - mu) / (3 * mu));
  const S = (pi3 * dr ** ((6 * nu - 2) / (3 * mu))) ** ((2 + mu) / 2);
  const volRatio = ((G + S) / G) ** (-3 * mu / (2 + mu));
  return { S_over_G: S / G, diamRatio: Math.cbrt(volRatio) };
}
const cases = [
  ['stomp foot 2 km/s, concrete (Y 7.6 MPa)', 0.276 / 2, 2000, 2400, 1000, 7.6e6],
  ['stomp foot 10 km/s, concrete', 0.276 / 2, 10000, 2400, 1000, 7.6e6],
  ['stomp foot 10 km/s, granite (Y 18 MPa)', 0.276 / 2, 10000, 2700, 1000, 18e6],
  ['tank 3 km/s, concrete', 4.74 / 2, 3000, 2400, 1200, 7.6e6],
  ['10 t chondrite 4 km/s into wet sediment (Y 1.14 MPa)', 1.795 / 2, 4000, 2000, 3300, 1.14e6],
];
for (const [n, a, U, rt, ri, Y] of cases) { const r = strengthRatio(a, U, rt, ri, Y); console.log(`${n}: S/G = ${r.S_over_G.toFixed(1)}; crater diameter with strength / gravity-only = ${r.diamRatio.toFixed(3)} (engine overstates by ${(1 / r.diamRatio).toFixed(2)}x)`); }
// Carancas 2007 sanity check with the engine's own formula
for (const [m, v] of [[3000, 3000], [10000, 4000]]) {
  const L = Math.cbrt(6 * m / (Math.PI * 3300));
  console.log(`Carancas-like ${m / 1000} t chondrite at ${v / 1000} km/s, 63 deg, into rho 2000: engine-formula final crater ${P.craterDiameter({ L, v, rhoI: 3300, rhoT: 2000, angleDeg: 63 }).toFixed(1)} m (observed ~13.5 m)`);
}
// --- where do craters appear in the UI? stomp threshold and Moon throw
const thr = P.threshold((F) => P.stomp(ctx(F / g)).vFoot >= 2000, 1e2, 1e40) / g;
const s0 = P.stomp(ctx(thr * 1.0001));
console.log(`stomp first crater at logKg ${Math.log10(thr).toFixed(3)}: vFoot ${s0.vFoot.toFixed(0)} E ${s0.E.toExponential(3)} J (${(s0.E / 4.184e6).toFixed(1)} kg TNT) crater ${s0.crater.toFixed(2)} m`);
const moon = D.objects.find(o => o.id === 'moon');
for (const th of [10, 45, 80]) {
  const r = P.throwObject(ctx(1e34), moon, th);
  const L = Math.cbrt(6 * moon.m / (Math.PI * moon.rho));
  console.log(`Moon thrown at logKg 34, ${th} deg: v ${r.v.toFixed(0)} vImpact ${r.flight.vImpact.toFixed(0)} impactAngle ${r.flight.impactAngleDeg.toFixed(1)} Eimp ${r.Eimpact.toExponential(3)} J crater ${(r.crater / 1e3).toFixed(0)} km (Dtc ${(r.crater / 1.25e3).toFixed(0)} km; impactor L ${(L / 1e3).toFixed(0)} km; Earth diameter 12742 km) quake M ${r.quake.toFixed(2)}`);
}
