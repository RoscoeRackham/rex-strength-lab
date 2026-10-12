global.window = {};
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA;
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
for (const [n, E] of [['krak', 8.4e17], ['chix', 4.2e23], ['sun', 3.828e26]]) for (const s of [0.5, 1, 0]) {
  const G = P.gradualGrowth(rex, E, s);
  const I = P.instantGrowth(rex, E, s, { surface: D.surfaces.find(x=>x.id==='concrete') });
  console.log(n, s, 'T', G.T.toPrecision(3), 's (', (G.T/60).toPrecision(3), 'min) by', G.by, '| H', G.grown.H.toPrecision(3), 'rho', G.grown.rho.toPrecision(3), '| instant dpLo', I && I.dpLo && I.dpLo.toPrecision(3), 'dpHi', I && I.dpHi && I.dpHi.toPrecision(3), 't', I && I.t && I.t.toPrecision(3));
}
console.log(P.GROW);
