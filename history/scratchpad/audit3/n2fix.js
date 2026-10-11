global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA; const g = P.K.g;
const body = P.makeBody({ H: 2, m: 180 });
const S = (id) => D.surfaces.find((s) => s.id === id), O = (id) => D.objects.find((o) => o.id === id);
const rows = [];
for (const kg of [511, 5000, 90718.474, 1e7, 1e12, 1e34]) for (const s of ['sand','concrete','granite']) for (const o of ['baseball','shot','bowling','car','tank']) for (const anc of ['friction','braced']) {
  const c = { F: kg*g, mode: 'real', body, surface: S(s), groundHolds: false, anchor: anc };
  const r = P.throwObject(c, O(o), 45);
  if (!r.canMove || r.basis) continue;
  const RB = r.mB * g * Math.sin(Math.PI/4);
  const Favg = r.push.pB / r.push.t + RB;
  const newRatio = r.anchor.N(Favg) / r.anchor.Nmax;
  if (r.sinkRatio > 1 || newRatio > 1) rows.push([kg.toExponential(2), s, o, anc, 'old', r.sinkRatio.toPrecision(3), 'new', newRatio.toPrecision(3), 't_ms', (r.push.t*1e3).toFixed(1)].join(' '));
}
console.log(rows.join('\n'));
// comic identity check
const c = { F: 90718.474*g, mode: 'comic', body, surface: S('concrete'), groundHolds: false, anchor: 'friction', noBlend: true };
for (const o of ['shot','car','tank']) { const r = P.throwObject(c, O(o), 45); const RB = r.mB*g*Math.sin(Math.PI/4); console.log('comic', o, 'Fused-ish', r.F, 'pB/t+RB', r.push.pB/r.push.t+RB, 'heldBack', r.heldBack); }
