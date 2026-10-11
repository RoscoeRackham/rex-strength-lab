const fs = require('fs');
const P = require('/home/user/dino-strength-sim/src/engine.js');
global.window = {};
eval(fs.readFileSync('/home/user/dino-strength-sim/src/data.js', 'utf8'));
const D = window.DINO_DATA;
const g = P.K.g;
const surf = (id) => D.surfaces.find((s) => s.id === id);
const obj = (id) => D.objects.find((o) => o.id === id);
// mirror app.html ctx()
function ctx(o) {
  o = Object.assign({ logKg: Math.log10(511), inf: false, mode: 'comic', surface: 'concrete', groundHolds: false, anchor: 'friction', H: 2, m: 180 }, o || {});
  const body = P.makeBody({ H: o.H, m: o.m });
  return { F: o.inf ? Infinity : (o.kg != null ? o.kg : Math.pow(10, o.logKg)) * g, mode: o.mode, body, surface: surf(o.surface), groundHolds: o.groundHolds, anchor: o.anchor };
}
// verbatim copy of app.html thresholds()
const LMIN = 1, LMAX = 34;
function thresholds(base) {
  const K = P.K;
  const at = (kg) => Object.assign({}, base, { F: kg * g });
  const car = obj('car');
  const th = (pred) => P.threshold((F) => pred(F / g), Math.pow(10, LMIN), Math.pow(10, LMAX));
  const W = (Pa) => D.overpressure.find((o) => o.id === Pa);
  return [
    { id: 'boom', text: 'Fist breaks the sound barrier', kg: th((kg) => P.punch(at(kg)).vFist >= K.a0), pred: (kg) => P.punch(at(kg)).vFist >= K.a0 },
    { id: 'windows', text: 'Clap breaks windows 10 m away', kg: th((kg) => P.blastRadius(P.clap(at(kg)).E, W('windows').Pa) >= 10), pred: (kg) => P.blastRadius(P.clap(at(kg)).E, W('windows').Pa) >= 10 },
    { id: 'carbullet', text: 'Thrown car outpaces a rifle bullet', kg: th((kg) => P.throwObject(at(kg), car, 45).v >= 1000), pred: (kg) => P.throwObject(at(kg), car, 45).v >= 1000 },
    { id: 'jumpliberty', text: 'Jump clears the Statue of Liberty', kg: th((kg) => { const j = P.jump(at(kg)); return j.v > 0 && (j.flight.apex >= 93 || j.flight.escaped || j.flight.relativistic); }), pred: (kg) => { const j = P.jump(at(kg)); return j.v > 0 && (j.flight.apex >= 93 || j.flight.escaped || j.flight.relativistic); } },
    { id: 'quake3', text: 'Stomp felt as a magnitude 3 quake', kg: th((kg) => P.stomp(at(kg)).quake >= 3), pred: (kg) => P.stomp(at(kg)).quake >= 3 },
    { id: 'hiro', text: 'Punch carries a Hiroshima bomb', kg: th((kg) => P.punch(at(kg)).E >= D.energyRefs.find((e) => e.id === 'hiroshima').J), pred: (kg) => P.punch(at(kg)).E >= D.energyRefs.find((e) => e.id === 'hiroshima').J },
    { id: 'quake7', text: 'Stomp = magnitude 7 quake', kg: th((kg) => P.stomp(at(kg)).quake >= 7), pred: (kg) => P.stomp(at(kg)).quake >= 7 },
    { id: 'tsar', text: 'Clap = Tsar Bomba', kg: th((kg) => P.clap(at(kg)).E >= D.energyRefs.find((e) => e.id === 'tsar').J), pred: (kg) => P.clap(at(kg)).E >= D.energyRefs.find((e) => e.id === 'tsar').J },
    { id: 'chix', text: 'Punch out-hits the dinosaur-killer impact', kg: th((kg) => P.punch(at(kg)).E >= D.energyRefs.find((e) => e.id === 'chicxulub').J), pred: (kg) => P.punch(at(kg)).E >= D.energyRefs.find((e) => e.id === 'chicxulub').J },
    { id: 'earth', text: 'Punch could blow Earth apart', kg: th((kg) => P.punch(at(kg)).E >= D.energyRefs.find((e) => e.id === 'earthbind').J), pred: (kg) => P.punch(at(kg)).E >= D.energyRefs.find((e) => e.id === 'earthbind').J },
  ];
}
module.exports = { P, D, g, surf, obj, ctx, thresholds, LMIN, LMAX };
