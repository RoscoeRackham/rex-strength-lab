global.window = {}; const P = require('./repo/rex-strength-lab/src/engine.js'); require('./repo/rex-strength-lab/src/data.js'); const D = window.DINO_DATA; const g = P.K.g;
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), ol = P.makeBody({ build: 'ollie', H: 3.048, m: 3007 });
const conc = D.surfaces.find((x) => x.id === 'concrete');
const J = (x) => JSON.stringify(x, (k, v) => (typeof v === 'number' && !isFinite(v) ? String(v) : v));
let diffs = [];
for (const lk of [4, 6, 8, 12]) {
  const c0 = { F: Math.pow(10, lk) * g, mode: 'comic', body: rex, surface: conc, anchor: 'friction' }, c1 = Object.assign({}, c0, { airAbsorb: 1 });
  for (const fn of ['jump', 'punch', 'clap', 'sprint']) if (J(P[fn](c0)) !== J(P[fn](c1))) diffs.push(fn + ' 1e' + lk);
  for (const src of ['sprint', 'jump', 'stomp', 'set']) { const a = P.collide(Object.assign({}, c0, { body: ol }), c0, { source: src, gb: 1e-6 }), b = P.collide(Object.assign({}, c1, { body: ol }), c1, { source: src, gb: 1e-6 }); if (J(a) !== J(b)) diffs.push('collide ' + src + ' 1e' + lk); }
}
console.log('own-body results that change with airAbsorb:', diffs);
