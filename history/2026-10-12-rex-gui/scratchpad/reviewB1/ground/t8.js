const { P, D, g, surf, obj, rex, ollie, ctxOf, ON, sig, M } = require('./common.js');
for (const E of [1e12, 1e15, 1e18, 4.2e23]) for (const form of [0.5, 1]) {
  const I0 = P.instantGrowth(rex, E, form, { surface: surf('concrete') });
  const I1 = P.instantGrowth(rex, E, form, { surface: surf('concrete'), unbreakable: true });
  const J = I1.grown.m * I1.vSole, T = I1.tau;
  const src = P.impulseSource(surf('concrete'), J, T);
  console.log('E', E, 'form', form, 'm', sig(I1.grown.m, 3), 'dH', sig(I1.grown.dH, 3), 'tau', sig(T, 3), 'vSole', sig(I1.vSole, 3), 'J', sig(J, 3), 'ppv5', sig(P.ppvAt(src, 5), 3), 'plaster reach', sig(P.plasterReach(src), 3), '| real ground: Eground', sig(I0.Eground, 3), 'quake', sig(I0.quake, 3), 'Pocean', sig(I0.Pocean, 3));
}
