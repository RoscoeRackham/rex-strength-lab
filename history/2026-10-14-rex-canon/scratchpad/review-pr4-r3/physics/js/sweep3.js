const { P, D, g, R3, O3, c3, dial, sig, surf } = require('./h.js');
const cl = P.K.c;
const bad = [], outs = {};
const lgs = [3.4, 3.6, 4, 5, 6, 7, 9, 12];
for (const sf of D.surfaces) for (const lo of lgs) for (const lr of lgs) for (const anc of ['friction', 'bolted']) for (const ub of [true, false]) for (const mode of ['comic', 'real'])
for (const [src, gb] of [['sprint'], ['jump'], ['stomp'], ['set', 1 / cl], ['set', 300 / cl], ['set', 3000 / cl]]) for (const bounce of [false, true]) {
  const FO = Math.pow(10, lo) * g, FR = Math.pow(10, lr) * g;
  const r = P.collide(c3(FO, O3, { surface: sf, unbreakable: ub, mode }), c3(FR, R3, { surface: sf, unbreakable: ub, mode, anchor: anc }), { source: src, gb, bounce });
  const key = r.outcome || r.noCharge; outs[key] = (outs[key] || 0) + 1;
  if (r.outcome !== 'carried') continue;
  const k = r.carry, tag = [sf.id, lo, lr, anc, ub, mode, src, gb, bounce].join(' ');
  for (const [kk, v] of Object.entries(k)) if (typeof v === 'number' && Number.isNaN(v)) bad.push(tag + ' NaN carry.' + kk);
  if (Number.isNaN(r.Q) || Number.isNaN(r.Elocal)) bad.push(tag + ' NaN Q/Elocal');
  if (!(Math.abs(k.supplied - (k.pGain + k.footJ)) <= 1e-9 * k.supplied)) bad.push(tag + ' supplied');
  if (!bounce && !(Math.abs(k.F * k.T - k.supplied) <= 1e-9 * k.supplied)) bad.push(tag + ' F*T ' + sig(k.F * k.T) + ' vs ' + sig(k.supplied));
  if (!bounce && k.v < 1e-5 * cl) {
    const W = k.F * k.v * k.T, rhs = P.momentumToKE(k.pGain, R3.m) + k.hold * r.after.splat.during + r.Q;
    if (!(Math.abs(W - rhs) <= 1e-6 * W)) bad.push(tag + ' work ' + sig(W) + ' vs ' + sig(rhs));
  }
  if (bounce && k.v < 1e-5 * cl) { const W = k.pGain * k.v; const KE = P.momentumToKE(k.pGain, R3.m); if (!(Math.abs(W - KE) <= 1e-6 * W)) bad.push(tag + ' bounce work ' + sig(W) + ' vs KE ' + sig(KE)); }
}
console.log(JSON.stringify(outs)); console.log(bad.length, bad.slice(0, 20).join('\n'));
