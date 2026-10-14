global.window = {};
const R = '/home/user/rex-strength-lab/rex-strength-lab/src/';
const P = require(R + 'engine.js'); require(R + 'data.js');
const D = window.DINO_DATA, g = P.K.g;
console.log(D.surfaces.map(s => s.id + ' mu=' + s.mu + ' shear=' + s.shear).join('\n'));
const surf = (id) => D.surfaces.find((s) => s.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), ollie = P.makeBody({ build: 'ollie', H: 3.048, m: 3007 });
console.log('rex footArea', rex.footArea, 'footB', rex.footB, 'digArea', rex.digArea, 'H', rex.H);
console.log('ollie footArea', ollie.footArea, 'footB', ollie.footB, 'digArea', ollie.digArea, 'H', ollie.H);
const s = surf('sand');
for (const [n, b] of [['rex', rex], ['ollie', ollie]]) {
  const f = P.anchorCapacity({ body: b, surface: s });
  console.log(n, 'R', f.R, 'Nmax', f.Nmax, 'mu m g', s.mu * b.m * g, 'normalCapped', f.normalCapped);
}
