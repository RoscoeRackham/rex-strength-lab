const { P, obj, ctxs } = require('./h.js');
const bb = obj('baseball');
const kg = 1e17;
for (const Dd of [55, 60, 62, 62.5, 63, 65, 70, 100]) {
  const [a, b] = ctxs(kg, { airAbsorb: 0.5 });
  const L = P.catchLeg(a, b, bb, Dd, 'hard');
  const o = { D: Dd, result: L.result, vL_c: L.aim ? +(L.aim.vL / P.K.c).toFixed(4) : +(L.vL / P.K.c).toFixed(4) };
  if (L.sheath) Object.assign(o, { sheathShare: +L.sheath.share.toFixed(4), vArr_c: +(L.vArrive / P.K.c).toFixed(4), carried: L.catch && L.catch.carried, uAfter: L.catch && L.catch.uAfter, Ecatch: L.catch && L.catch.Ecatch && L.catch.Ecatch.toExponential(3) });
  if (L.fireball) { const f = L.fireball; Object.assign(o, { kind: f.kind, Egap: +(f.Egap / f.E).toFixed(4), Eblast: f.Eblast.toExponential(3), E: f.E.toExponential(3), vLumpAt_c: +(f.vLumpAt / P.K.c).toFixed(4), rBlast: f.rBlast }); }
  console.log(JSON.stringify(o));
}
