global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA; const { refHill } = require('./ref.js'); const { hillLimit } = require('./limit.js'); const { pushApartHillFixed } = require('./fix.js'); const g = P.K.g;
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
const ratioOf = (o) => o.F / (Math.max(o.mA, o.mB) * o.vmax * o.vmax / o.d + (isFinite(o.RA) ? o.RA : 0) + (isFinite(o.RB) ? o.RB : 0));
const st = {};
const upd = (key, err, info) => { const s = st[key] || (st[key] = { e: 0, info: '' }); if (err > s.e) { s.e = err; s.info = info; } };
for (const [H, surf, gh] of [[2, 'concrete', false], [2, 'granite', true], [0.4, 'concrete', false], [50, 'concrete', false], [2, 'sand', false]]) {
  for (let lg = 1; lg <= 34; lg += 0.125) {
    for (const [act, o] of Object.entries(cases(H, Math.pow(10, lg), surf, gh))) {
      const ratio = ratioOf(o);
      const f = pushApartHillFixed(o), e = P.pushApart(Object.assign({ mode: 'real' }, o));
      if (!isFinite(f[o.side]) || isNaN(f[o.side])) upd('NaN|' + act, 1, `H=${H} ${surf} 10^${lg}`);
      if (ratio < 3e4) {      // RK4 reference resolves the stiffness here
        const r = refHill(o); const truth = r.done ? r[o.side] : 0;
        const rel = (x) => truth > 1e-6 ? Math.abs(x - truth) / truth : Math.abs(x - truth);
        upd('ref|fix|' + act, rel(f[o.side]), `H=${H} ${surf} 10^${lg} fix=${f[o.side].toFixed(4)} ref=${truth.toFixed(4)}`);
        upd('ref|eng|' + act, rel(e[o.side]), `H=${H} ${surf} 10^${lg} eng=${e[o.side].toFixed(4)} ref=${truth.toFixed(4)}`);
      }
      if (ratio > 1e6) {      // compare with analytic limit
        const L = hillLimit(o)[o.side];
        const rel = (x) => L > 1e-6 ? Math.abs(x - L) / L : Math.abs(x - L);
        upd('lim|fix|' + act, rel(f[o.side]), `H=${H} ${surf} 10^${lg} fix=${f[o.side].toFixed(4)} limit=${L.toFixed(4)}`);
        upd('lim|eng|' + act, rel(e[o.side]), `H=${H} ${surf} 10^${lg} eng=${e[o.side].toFixed(4)} limit=${L.toFixed(4)}`);
      }
    }
  }
}
for (const k of Object.keys(st).sort()) console.log(k.padEnd(18), (100 * st[k].e).toFixed(3).padStart(8) + '%', st[k].info);
