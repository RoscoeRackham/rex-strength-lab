global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const P = require('/home/user/dino-strength-sim/src/engine.js');
const K = P.K || P.consts || {};
console.log(Object.keys(P).slice(0,80).join(' '));
console.log('rho0', K.rho0);
for (const o of D.objects) {
  const L = o.m / (1.225 * o.area);
  console.log((o.id||'').padEnd(16), (o.short||'').padEnd(24), 'm', o.m.toExponential(2), 'A', o.area, 'noThrow', !!o.noThrow, 'm/A', (o.m/o.area).toExponential(2), 'L(km)', (L/1000).toPrecision(3));
}
