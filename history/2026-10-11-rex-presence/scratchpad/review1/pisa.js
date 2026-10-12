const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
const src = { kind: 'hann', F: 2 * 997.4 / 0.03, T: 0.03, ground: { rho: 1850, cs: 150, xi: 0.03 } };
for (const d of [2.5, 5, 10, 20, 35, 60]) console.log(d, (P.ppvAt(src, d) * 1000).toFixed(2), 'mm/s');
// Rex walk at defaults
const D = require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
