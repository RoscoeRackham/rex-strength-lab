const { P, D, g, surf, obj, V, C } = require('./h.js');
const cfgs = [];
for (const mode of ['comic', 'real']) for (const gh of [false, true]) for (const anchor of ['friction', 'braced', 'bolted']) for (const [H, oH] of [[2, 2], [0.1, 2], [2, 0.1], [500, 2], [2, 500]]) cfgs.push({ mode, gh, anchor, H, oH });
let n = 0;
for (const cf of cfgs) {
  let pT = null, pS = null, pSl = null, row = '';
  for (let lg = 1; lg <= 34; lg += 0.25) {
    const kg = Math.pow(10, lg);
    const cA = C({ kg, mode: cf.mode, gh: cf.gh, anchor: cf.anchor, H: cf.H, m: 1000 * P.bodyVolume(cf.H) });
    const cB = C({ kg: 1e5, mode: cf.mode, gh: cf.gh, anchor: 'friction', H: cf.oH, m: 1000 * P.bodyVolume(cf.oH) });
    // throw partner at 45
    const t = P.throwPartner(cA, cB, 45);
    const R = t.r && t.r.canMove && t.r.flight ? t.r.flight.range : 0, v = t.r && t.r.canMove ? t.r.v : 0;
    if (pT && v < pT.v * 0.98) { n++; if (n < 40) console.log('THROW v DROP', JSON.stringify(cf), 'lg' + pT.lg, pT.v.toPrecision(4), '->', 'lg' + lg, v.toPrecision(4)); }
    if (pT && v >= pT.v && R < pT.R * 0.98 && v < 0.01 * 3e8 && !(t.r.flight && t.r.flight.escaped) && !pT.esc) { n++; if (n < 40) console.log('THROW range DROP', JSON.stringify(cf), 'lg' + pT.lg, pT.R.toPrecision(4), '->', 'lg' + lg, R.toPrecision(4), 'v', pT.v.toPrecision(4), v.toPrecision(4)); }
    pT = { v, R, lg, esc: t.r && t.r.flight && t.r.flight.escaped };
    // shove partner (B anchored friction, its strength fixed)
    const s = P.shove(cA, cB);
    if (pS && s.vB < pS.vB * 0.98) { n++; if (n < 40) console.log('SHOVE vB DROP', JSON.stringify(cf), 'lg' + pS.lg, pS.vB.toPrecision(4), '->', 'lg' + lg, s.vB.toPrecision(4)); }
    if (pS && isFinite(s.slideB) && isFinite(pS.slideB) && s.slideB < pS.slideB * 0.98 && s.vB >= pS.vB) { n++; if (n < 40) console.log('SHOVE slide DROP', JSON.stringify(cf), 'lg' + pS.lg, pS.slideB.toPrecision(4), '->', 'lg' + lg, s.slideB.toPrecision(4)); }
    pS = { vB: s.vB, slideB: s.slideB, lg };
  }
}
console.log('n', n);
