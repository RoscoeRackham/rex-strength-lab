global.window = global.window || {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const P = require('/home/user/dino-strength-sim/src/engine.js');
const g = P.K.g;
const body = P.makeBody({ H: 2, m: 180 });
const S = (id) => D.surfaces.find(s => s.id === id);
// Holsapple (1993; Holsapple & Housen 2007) combined strength+gravity pi-scaling.
// pi_V = K1 { pi2 (rho/delta)^((6nu-2-mu)/(3mu)) + [K2 pi3 (rho/delta)^((6nu-2)/(3mu))]^((2+mu)/2) }^(-3mu/(2+mu))
// Diameter ratio (combined / gravity-only) = (1 + S/G)^(-mu/(2+mu)); K1 cancels so Collins' gravity constant is kept.
function strengthFactor({ L, v, rhoI, rhoT, Y, mu = 0.55, nu = 0.4, K2 = 1 }) {
  const a = L / 2, r = rhoT / rhoI;
  const pi2 = g * a / (v * v), pi3 = Y / (rhoT * v * v);
  const G = pi2 * Math.pow(r, (6 * nu - 2 - mu) / (3 * mu));
  const Sx = Math.pow(K2 * pi3 * Math.pow(r, (6 * nu - 2) / (3 * mu)), (2 + mu) / 2);
  return { SG: Sx / G, f: Math.pow(1 + Sx / G, -mu / (2 + mu)) };
}
const Ytab = { asphalt: 7.6e6 /*assume soft-rock class*/, concrete: 7.6e6, granite: 18e6 };
console.log('--- stomp, engine vs strength-corrected ---');
for (const sid of ['asphalt', 'concrete', 'granite']) {
  for (const lk of [7.5, 8, 9, 10, 12, 14]) {
    const c = { F: Math.pow(10, lk) * g, mode: 'comic', body, surface: S(sid), groundHolds: false, anchor: 'friction' };
    const r = P.stomp(c);
    if (!(r.crater > 0)) continue;
    const L = Math.cbrt(6 * body.legEff / (Math.PI * 1000));
    const s = strengthFactor({ L, v: r.vFoot, rhoI: 1000, rhoT: S(sid).rho, Y: Ytab[sid] });
    console.log(sid.padEnd(8), 'logKg', lk, 'vFoot', r.vFoot.toExponential(2), 'TNTkg', r.tnt.toExponential(2), 'engine D', r.crater.toFixed(2), 'S/G', s.SG.toFixed(1), 'factor', s.f.toFixed(3), 'corrected D', (r.crater * s.f).toFixed(2), 'overstate x', (1 / s.f).toFixed(2));
  }
}
console.log('--- sensitivity to Y (concrete, logKg 7.5 stomp) ---');
{
  const c = { F: Math.pow(10, 7.5) * g, mode: 'comic', body, surface: S('concrete'), groundHolds: false, anchor: 'friction' };
  const r = P.stomp(c); const L = Math.cbrt(6 * body.legEff / (Math.PI * 1000));
  for (const Y of [1e6, 3e6, 7.6e6, 18e6, 30e6]) { const s = strengthFactor({ L, v: r.vFoot, rhoI: 1000, rhoT: 2400, Y }); console.log('Y', (Y / 1e6) + ' MPa', 'S/G', s.SG.toFixed(0), 'D', (r.crater * s.f).toFixed(2), 'overstate x', (1 / s.f).toFixed(2)); }
}
console.log('--- strength-gravity transition: D_tr ~ Y/(rho g) ---');
for (const [n, Y, rho] of [['concrete', 7.6e6, 2400], ['granite', 18e6, 2700], ['asphalt', 2e6, 2300]]) console.log(n, (Y / (rho * g)).toFixed(0), 'm');
console.log('--- throws with crater shown (non-relativistic, Eimpact > 1 t TNT), concrete ---');
for (const id of ['baseball', 'shot', 'car', 'bus', 'tank', 'b747']) {
  const obj = D.objects.find(o => o.id === id);
  for (let lk = 6; lk <= 30; lk += 0.5) {
    const c = { F: Math.pow(10, lk) * g, mode: 'comic', body, surface: S('concrete'), groundHolds: false, anchor: 'friction' };
    const r = P.throwObject(c, obj, 45);
    const f = r.flight;
    if (r.canMove && !f.relativistic && f.vImpact > 0 && r.Eimpact > 4.184e9 && r.crater > 0) {
      const L = obj.L || Math.cbrt(6 * obj.m / (Math.PI * (obj.rho || 1000)));
      const s = strengthFactor({ L, v: f.vImpact, rhoI: obj.rho || 1000, rhoT: 2400, Y: 7.6e6 });
      console.log(id.padEnd(8), 'logKg', lk, 'vImp', f.vImpact.toExponential(2), 'E TNT t', (r.Eimpact / 4.184e9).toExponential(2), 'engine D', r.crater.toFixed(1), 'corrected', (r.crater * s.f).toFixed(1), 'overstate x', (1 / s.f).toFixed(2));
      break;
    }
  }
}
console.log('--- Carancas (2007) check with the engine formula; observed D ~13.5 m in wet sediment ---');
for (const [m, v] of [[3000, 3000], [3000, 4000], [10000, 3000], [10000, 4000]]) {
  const rhoI = 3300, L = Math.cbrt(6 * m / (Math.PI * rhoI));
  const D1 = P.craterDiameter({ L, v, rhoI, rhoT: 2000, angleDeg: 90 });
  const D2 = P.craterDiameter({ L, v, rhoI, rhoT: 2000, angleDeg: 45 });
  const s = strengthFactor({ L, v, rhoI, rhoT: 2000, Y: 1e6 });
  console.log('m', m, 'v', v, 'L', L.toFixed(2), 'engine D (90deg)', D1.toFixed(1), '(45deg)', D2.toFixed(1), '| with Y=1 MPa', (D1 * s.f).toFixed(1), '/', (D2 * s.f).toFixed(1));
}
