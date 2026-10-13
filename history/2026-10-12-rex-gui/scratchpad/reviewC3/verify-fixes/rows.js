global.window = {};
const R = '/home/user/rex-strength-lab/rex-strength-lab/src/';
require(R + 'data.js'); const D = window.DINO_DATA;
const P = require(R + 'engine.js');
const rows = D.sourceRows || [];
for (const r of rows) { const s = JSON.stringify(r); if (s.includes('10349743')) console.log(s.slice(0, 120), '...', (s.match(/Morgan[^"]*?NSF PAR[^"]*/g) || []).join(' || ')); }
const ref = D.energyRefs.find((e) => e.id === 'chicxulub');
console.log('chicxulub rung', ref.J, 'rough', ref.rough);
const body = { H: 3.048, m: 3007, rho: 1060 };
try {
  for (const E of [ref.J, 1.674e25]) { const g = P.grownBody(Object.assign({}, body), E, 0.5); console.log('E', E, 'H', g.H.toFixed(2), 'rho', Math.round(g.rho), 'dm t', (g.dm / 1000).toFixed(0), 'rise', ((g.H - 3.048) / 2).toFixed(2)); }
} catch (e) { console.log('engine call failed', e.message); }
