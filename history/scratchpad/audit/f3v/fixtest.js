global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA; const { refHill } = require('./ref.js'); const { pushApartHillFixed } = require('./fix.js'); const g = P.K.g;
const S = Object.fromEntries(D.surfaces.map(s => [s.id, s])); const O = Object.fromEntries(D.objects.map(o => [o.id, o]));
function cases(H, kg, surf, gh) {
  const b = P.makeBody({ H, m: 180 * Math.pow(H / 2, 3) }); const su = S[surf];
  const anc0 = P.anchorCapacity({ body: b, surface: su, theta: 0, anchor: 'friction', groundHolds: gh });
  const thr = (obj, th) => { const t = th * Math.PI / 180, whip = obj.m <= 1, hands = obj.m > 20 ? 2 : 1, arm = hands * (whip ? b.whipEff : b.handEff), mB = obj.m + arm;
    const anc = P.anchorCapacity({ body: b, surface: su, theta: t, anchor: 'friction', groundHolds: gh, extraMass: obj.m });
    return { F: kg * g * 0.3, d: whip ? b.strokes.whip : b.strokes.throw, mA: b.m - arm, mB, RA: anc.R, RB: mB * g * Math.sin(t), vmax: 55 * b.s, side: 'vB' }; };
  return {
    punch: { F: kg * g * 0.3, d: b.strokes.punch, mA: b.m - b.handEff, mB: b.handEff, RA: anc0.R, RB: 0, vmax: 17 * b.s, side: 'vB' },
    clap: { F: kg * g * 0.3, d: b.strokes.clap, mA: b.m, mB: b.handEff, RA: Infinity, RB: 0, vmax: 17 * b.s, side: 'vB' },
    stomp: { F: kg * g * 0.5, d: b.strokes.stomp, mA: b.m - b.legEff, mB: b.legEff, RA: (b.m - b.legEff) * g, RB: 0, vmax: 16 * b.s, side: 'vB' },
    jump: { F: kg * g, d: b.strokes.leg, mA: b.m - b.feetMass, mB: b.feetMass, RA: (b.m - b.feetMass) * g, RB: gh ? Infinity : su.qult * 2 * b.footArea, vmax: 30 * b.s, side: 'vA' },
    baseball: thr(O.baseball, 0), shot: thr(O.shot, 37), car: thr(O.car, 45),
  };
}
const stats = {};
for (const [H, surf, gh] of [[2, 'concrete', false], [2, 'granite', true], [0.4, 'concrete', false], [50, 'concrete', false], [2, 'sand', false]]) {
  for (let lg = 1; lg <= 12; lg += 0.125) {
    for (const [act, o] of Object.entries(cases(H, Math.pow(10, lg), surf, gh))) {
      const r = refHill(o), truth = r.done ? r[o.side] : 0;
      const f = pushApartHillFixed(o)[o.side], e = P.pushApart(Object.assign({ mode: 'real' }, o))[o.side];
      const ef = truth > 1e-6 ? Math.abs(f - truth) / truth : Math.abs(f - truth);
      const ee = truth > 1e-6 ? Math.abs(e - truth) / truth : Math.abs(e - truth);
      const key = `${act}`; const s = stats[key] || (stats[key] = { fix: 0, fixAt: '', eng: 0, engAt: '' });
      if (ef > s.fix) { s.fix = ef; s.fixAt = `H=${H} ${surf} 10^${lg} fix=${f.toFixed(3)} ref=${truth.toFixed(3)}`; }
      if (ee > s.eng) { s.eng = ee; s.engAt = `H=${H} ${surf} 10^${lg} eng=${e.toFixed(3)} ref=${truth.toFixed(3)}`; }
    }
  }
}
for (const [k, s] of Object.entries(stats)) console.log(k.padEnd(9), 'engine maxErr', (100 * s.eng).toFixed(2).padStart(7) + '%', '[' + s.engAt + ']', '| fixed maxErr', (100 * s.fix).toFixed(3) + '%', '[' + s.fixAt + ']');
