global.window = {};
require(process.argv[2] + '/src/data.js');
const D = window.DINO_DATA;
const E = require(process.argv[2] + '/research/final-energy.json');
const facts = Array.isArray(E) ? E : (E.facts || Object.values(E));
const byKey = {}; for (const f of facts) byKey[f.key] = f;
console.log(Object.keys(D).join(' '));
let prev = null;
for (const r of D.energyRefs) {
  const f = byKey[r.key] || {};
  console.log([r.id, r.J.toExponential(3), r.rough ? 'ROUGH' : 'firm', f.status, prev ? (r.J/prev).toFixed(1)+'x' : '', '|', r.short, '|', r.label].join(' '));
  prev = r.J;
}
