const P = require('/home/user/dino-strength-sim/src/engine.js');
global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const cx = (H, lk, extra) => Object.assign({ F: lk === Infinity ? Infinity : Math.pow(10, lk) * g, mode: 'comic', body: P.makeBody({ H, m: 180 * Math.pow(H / 2, 3) }), surface: D.surfaces.find(s => s.id === 'concrete'), groundHolds: false, anchor: 'friction' }, extra || {});
const cplx = (dtc) => dtc > 2560 ? 1.17 * Math.pow(dtc, 1.13) / Math.pow(3200, 0.13) : 1.25 * dtc;
// stomp threshold at Kaiju chip (H=50) and 500 m
for (const H of [2, 50, 500]) {
  const th = P.threshold((F) => P.stomp(cx(H, Math.log10(F / g))).crater / 1.25 > 2560, 1e2, 1e40);
  console.log('H', H, 'stomp Dtc>2.56km first at lift', isFinite(th) ? (th / g).toExponential(3) + ' kg' : 'never');
}
for (const H of [50, 500]) for (const t of D.tiers) {
  const lk = isFinite(t.liftKg) ? Math.log10(t.liftKg) : Infinity;
  const r = P.stomp(cx(H, lk));
  if (r.crater > 0) { const dtc = r.crater / 1.25; console.log(`stomp H=${H} ${t.id}: vFoot=${r.vFoot.toExponential(3)} engine=${(r.crater/1e3).toFixed(2)} km, eq27=${(cplx(dtc)/1e3).toFixed(2)} km, ratio=${(cplx(dtc)/r.crater).toFixed(3)}`); }
}
// Moon throw, bolted, 45 deg: find lift range with an impact >=2 km/s
const moon = D.objects.find(o => o.id === 'moon');
let rows = [];
for (let lk = 29; lk <= 31; lk += 0.1) {
  const r = P.throwObject(cx(2, lk, { anchor: 'bolted' }), moon, 45);
  const f = r.flight;
  const shown = r.canMove && !f.relativistic && f.vImpact > 0 && r.Eimpact > 4.184e9 && r.crater > 0;
  if (shown) rows.push([lk.toFixed(1), Math.round(r.v), Math.round(f.vImpact), (r.crater / 1e3).toFixed(0), (cplx(r.crater / 1.25) / 1e3).toFixed(0), (cplx(r.crater/1.25)/r.crater).toFixed(2)]);
}
console.log('Moon (bolted, 45deg) [logKg, v0, vImp, engine km, eq27 km, ratio]:'); rows.forEach(r => console.log(r.join('  ')));
