global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const P = require('/home/user/dino-strength-sim/src/engine.js');
const K = P.K, g = K.g;
function thresholds(st) {
  const body = P.makeBody({ H: st.H, m: st.m });
  const surface = D.surfaces.find((s) => s.id === st.surface);
  const base = { mode: st.mode, body, surface, groundHolds: st.groundHolds, anchor: st.anchor };
  const at = (kg, extra) => Object.assign({}, base, { F: kg * g }, extra || {});
  const car = D.objects.find((o) => o.id === 'car');
  const th = (pred) => P.threshold(pred, 10, 1e34);
  const W = (id) => D.overpressure.find((o) => o.id === id);
  const E = (id) => D.energyRefs.find((e) => e.id === id).J;
  const jumpPred = (extra) => (kg) => { const j = P.jump(at(kg, extra)); return j.v > 0 && (j.relativistic || j.flight.apex >= 93 || j.flight.escaped); };
  const preds = {
    boom: (kg) => P.punch(at(kg)).vFist >= K.a0,
    windows: (kg) => P.blastRadius(P.clap(at(kg)).E, W('windows').Pa) >= 10,
    carmach3: (kg) => P.throwObject(at(kg), car, 45).v >= 3 * K.a0,
    jumpliberty: jumpPred(),
    quake3: (kg) => P.stomp(at(kg)).quake >= 3,
    hiro: (kg) => P.punch(at(kg)).E >= E('hiroshima'),
    quake7: (kg) => P.stomp(at(kg)).quake >= 7,
    tsar: (kg) => P.clap(at(kg)).E >= E('tsar'),
    chix: (kg) => P.punch(at(kg)).E >= E('chicxulub'),
    earth: (kg) => P.punch(at(kg)).E >= E('earthbind'),
  };
  const out = {};
  for (const [k, p] of Object.entries(preds)) {
    const t = th(p);
    // monotonicity scan: sample 0.05-decade grid, find first true and any true->false flips
    let first = null, flips = [];
    let prev = null;
    for (let lg = 1; lg <= 34.0001; lg += 0.05) { const v = p(Math.pow(10, lg)); if (v && first == null) first = lg; if (prev === true && v === false) flips.push(+lg.toFixed(2)); prev = v; }
    out[k] = { th: t, thLog: Math.log10(t).toFixed(3), scanFirst: first == null ? null : first.toFixed(2), flips: flips.slice(0, 6), atTh: p(t), justBelow: p(t * 0.999) };
  }
  return out;
}
module.exports = { thresholds, D, P };
if (require.main === module) {
  const st = JSON.parse(process.argv[2] || '{}');
  const s = Object.assign({ mode: 'comic', surface: 'concrete', groundHolds: false, anchor: 'friction', H: 2, m: 180 }, st);
  const r = thresholds(s);
  console.log(JSON.stringify(s));
  for (const [k, v] of Object.entries(r)) console.log(k.padEnd(12), JSON.stringify(v));
}
