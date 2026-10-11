// Independent re-check of finding F1 (ladder thresholds in N labelled kg)
const fs = require('fs'), vm = require('vm');
const ROOT = '/home/user/dino-strength-sim/src/';
const P = require(ROOT + 'engine.js');
const win = {}; vm.runInNewContext(fs.readFileSync(ROOT + 'data.js', 'utf8'), { window: win });
const D = win.DINO_DATA, K = P.K, g = K.g;
const state = { logKg: Math.log10(511), inf: false, mode: process.argv[2] || 'comic', surface: 'concrete', groundHolds: false, anchor: 'friction', H: 2, m: 180 };
function ctx() {
  const body = P.makeBody({ H: state.H, m: state.m });
  const surface = D.surfaces.find((s) => s.id === state.surface);
  return { F: Math.pow(10, state.logKg) * g, mode: state.mode, body, surface, groundHolds: state.groundHolds, anchor: state.anchor };
}
const objById = (id) => D.objects.find((o) => o.id === id);
const LMIN = 1, LMAX = 34;
const base = ctx();
const at = (kg) => Object.assign({}, base, { F: kg * g });
const car = objById('car');
const W = (Pa) => D.overpressure.find((o) => o.id === Pa);
const preds = {
  boom: (kg) => P.punch(at(kg)).vFist >= K.a0,
  windows: (kg) => P.blastRadius(P.clap(at(kg)).E, W('windows').Pa) >= 10,
  carmach3: (kg) => P.throwObject(at(kg), car, 45).v >= 3 * K.a0,
  jumpliberty: (kg) => { const j = P.jump(at(kg)); return j.v > 0 && (j.flight.apex >= 93 || j.flight.escaped || j.flight.relativistic); },
  quake3: (kg) => P.stomp(at(kg)).quake >= 3,
  hiro: (kg) => P.punch(at(kg)).E >= D.energyRefs.find((e) => e.id === 'hiroshima').J,
  quake7: (kg) => P.stomp(at(kg)).quake >= 7,
  tsar: (kg) => P.clap(at(kg)).E >= D.energyRefs.find((e) => e.id === 'tsar').J,
  chix: (kg) => P.punch(at(kg)).E >= D.energyRefs.find((e) => e.id === 'chicxulub').J,
  earth: (kg) => P.punch(at(kg)).E >= D.energyRefs.find((e) => e.id === 'earthbind').J,
};
// verbatim app wrapper
const thApp = (pred) => P.threshold((F) => pred(F / g), Math.pow(10, LMIN), Math.pow(10, LMAX));
// proposed fix
const thFix = (pred) => P.threshold(pred, Math.pow(10, LMIN), Math.pow(10, LMAX));
console.log('mode', state.mode);
for (const [id, pr] of Object.entries(preds)) {
  const a = thApp(pr), f = thFix(pr);
  // Check: predicate value just below/above each value
  const chk = (x) => isFinite(x) ? `${pr(x * 0.999)}/${pr(x * 1.001)}` : '-';
  console.log(id.padEnd(12), 'app', a.toExponential(4).padEnd(12), 'fix', f.toExponential(4).padEnd(12), 'ratio', (a / f).toFixed(4), ' pred(app*0.999/1.001)', chk(a), ' pred(fix*.999/1.001)', chk(f), ' pred(1e34kg)', pr(1e34));
}
