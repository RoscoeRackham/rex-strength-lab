global.window = global.window || {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const P = require('/home/user/dino-strength-sim/src/engine.js');
const g = P.K.g;
const body = P.makeBody({ H: 2, m: 180 });
const surf = (id) => D.surfaces.find(s => s.id === id);
function ctx(logKg, sid, mode) { return { F: Math.pow(10, logKg) * g, mode: mode || 'comic', body, surface: surf(sid), groundHolds: false, anchor: 'friction' }; }
for (const sid of ['sand','clay','asphalt','concrete','granite']) {
  for (const lk of [7.0, 7.5, 8, 9, 10, 12]) {
    const r = P.stomp(ctx(lk, sid));
    if (r.crater > 0) console.log(sid, 'logKg', lk, 'vFoot', r.vFoot.toFixed(0), 'E', r.E.toExponential(3), 'TNT kg', r.tnt.toFixed(2), 'crater', r.crater.toFixed(3));
  }
}
// first logKg where crater appears for stomp on concrete
const thr = P.threshold(F => P.stomp({ F, mode: 'comic', body, surface: surf('concrete'), groundHolds: false, anchor: 'friction' }).crater > 0);
console.log('stomp crater threshold logKg', Math.log10(thr / g).toFixed(3));
const L = Math.cbrt(6 * body.legEff / (Math.PI * 1000));
console.log('legEff', body.legEff, 'L', L);
// tank throw
const tank = D.objects.find(o => o.id === 'tank');
for (const lk of [8, 9, 10, 11]) {
  const t = P.throwObject(ctx(lk, 'concrete'), tank, 45);
  console.log('tank logKg', lk, 'v', t.v.toFixed(0), 'vImpact', t.flight.vImpact.toFixed(0), 'Eimp', t.Eimpact.toExponential(2), 'crater', t.crater.toFixed(2));
}
