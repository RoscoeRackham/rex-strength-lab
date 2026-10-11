const fs = require('fs'), vm = require('vm');
const P = require('/home/user/dino-strength-sim/src/engine.js');
const win = {}; vm.runInNewContext(fs.readFileSync('/home/user/dino-strength-sim/src/data.js','utf8'), { window: win });
const D = win.DINO_DATA, K = P.K, g = K.g;
const state = { logKg: Math.log10(511), inf: false, mode: 'comic', surface: 'concrete', groundHolds: false, anchor: 'friction', H: 2, m: 180 };
const base = { F: Math.pow(10, state.logKg) * g, mode: state.mode, body: P.makeBody({ H: state.H, m: state.m }), surface: D.surfaces.find(s => s.id === state.surface), groundHolds: state.groundHolds, anchor: state.anchor };
const at = (kg) => Object.assign({}, base, { F: kg * g });
const LMIN = 1, LMAX = 34;
const thApp = (pred) => P.threshold((F) => pred(F / g), 10 ** LMIN, 10 ** LMAX);   // verbatim app.html:952
const thKg  = (pred) => P.threshold(pred, 10 ** LMIN, 10 ** LMAX);                 // proposed fix
const car = D.objects.find(o => o.id === 'car');
const W = (id) => D.overpressure.find(o => o.id === id);
const E = (id) => D.energyRefs.find(e => e.id === id).J;
const preds = {
  boom: (kg) => P.punch(at(kg)).vFist >= K.a0,
  windows: (kg) => P.blastRadius(P.clap(at(kg)).E, W('windows').Pa) >= 10,
  carmach3: (kg) => P.throwObject(at(kg), car, 45).v >= 3 * K.a0,
  jumpliberty: (kg) => { const j = P.jump(at(kg)); return j.v > 0 && (j.flight.apex >= 93 || j.flight.escaped || j.flight.relativistic); },
  quake3: (kg) => P.stomp(at(kg)).quake >= 3,
  hiro: (kg) => P.punch(at(kg)).E >= E('hiroshima'),
  quake7: (kg) => P.stomp(at(kg)).quake >= 7,
  tsar: (kg) => P.clap(at(kg)).E >= E('tsar'),
  chix: (kg) => P.punch(at(kg)).E >= E('chicxulub'),
  earth: (kg) => P.punch(at(kg)).E >= E('earthbind'),
};
for (const [id, pr] of Object.entries(preds)) {
  const a = thApp(pr), b = thKg(pr);
  // check predicate just below/above each
  console.log(id.padEnd(12), 'app kg=', a.toExponential(4), ' correct kg=', b.toExponential(4), ' ratio=', (a / b).toFixed(4),
    ' pred(app*0.99/g... )', pr(a / g * 0.999), pr(a / g * 1.001), ' pred(correct*0.999,1.001)=', pr(b * 0.999), pr(b * 1.001));
}
// show what the user sees at the app's ladder value for the fist
const aBoom = thApp(preds.boom), bBoom = thKg(preds.boom);
console.log('fist speed at app ladder value', P.punch(at(aBoom)).vFist.toFixed(1), 'm/s, Mach', (P.punch(at(aBoom)).vFist / K.a0).toFixed(2));
console.log('fist speed at corrected value', P.punch(at(bBoom)).vFist.toFixed(1), 'm/s, Mach', (P.punch(at(bBoom)).vFist / K.a0).toFixed(2));
console.log('punch E at app hiro value / hiroshima', (P.punch(at(thApp(preds.hiro))).E / E('hiroshima')).toFixed(3));
