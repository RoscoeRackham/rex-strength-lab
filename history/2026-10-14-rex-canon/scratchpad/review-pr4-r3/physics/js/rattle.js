const { P, D, g, R3, O3, c3, dial, sig, surf, conc } = require('./h.js');
// Both at once, Ollie bolted: the pulse into Ollie's bolts as the engine has it (Rex's stalled comic shove) and with Rex's
// static push at the real basis (his full strength, the basis the same view uses for Ollie's shove)
const at = (kg) => {
  const F = kg * 1000 * g;
  const b = P.shoveBoth(c3(F, R3), c3(F, O3, { anchor: 'bolted' }));
  if (!b.toGroundB) return null;
  const rT = b.back; const t = rT.push.t, T = b.toGroundB.T;
  const real = P.shove(Object.assign(c3(F, R3), { mode: 'real' }), c3(F, O3, { anchor: 'bolted' }));
  const srcE = P.impulseSource(conc, b.toGroundB.J, T), srcR = P.impulseSource(conc, real.Fdrive * t, T);
  return { kg, Jeng: b.toGroundB.J, Freal: real.Fdrive, Fcomic: b.Fdrive, ppvE: P.ppvAt(srcE, 5), ppvR: P.ppvAt(srcR, 5) };
};
for (const kg of [10, 20, 30, 40, 50, 58.8, 70, 90.7]) { const x = at(kg); if (x) console.log(kg, 't: J engine', sig(x.Jeng), 'Fcomic', sig(x.Fcomic), 'Freal', sig(x.Freal), 'ppv5m engine', sig(x.ppvE * 1000), 'mm/s; with real basis', sig(x.ppvR * 1000), 'mm/s'); }
