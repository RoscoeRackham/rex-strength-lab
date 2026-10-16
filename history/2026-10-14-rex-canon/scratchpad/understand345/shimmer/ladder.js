global.window = {};
const M = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/main-tree/rex-strength-lab';
const P = require(M + '/src/engine.js');
require(M + '/src/data.js');
const L = require(M + '/src/ladder.js');
const D = window.DINO_DATA;
const refs = D.energyRefs;
console.log('rungs', refs.length);
for (const r of refs) console.log(r.id.padEnd(14), r.key.padEnd(44), r.J.toExponential(3), r.rough ? 'ROUGH' : '', '|', r.short);
const E = (k) => refs.find((x) => x.key === k);
const lo = E('energy_corolla_100kmh_kinetic'), hi = E('energy_chicxulub_impact'), fl = E('energy_usain_bolt_top_speed');
console.log('\nflicker', lo.J, 'flare', hi.J, 'floor', fl.J, 'flicker/floor', (lo.J / fl.J).toFixed(1));
for (const q of [0.25, 0.5, 0.75]) {
  const e = Math.pow(10, Math.log10(lo.J) + q * (Math.log10(hi.J) - Math.log10(lo.J)));
  const sorted = refs.slice().sort((a, b) => Math.abs(Math.log(e / a.J)) - Math.abs(Math.log(e / b.J)));
  console.log('step', q, e.toExponential(3), 'nearest:', sorted.slice(0, 3).map((r) => r.id + ' ' + r.J.toExponential(2) + (r.rough ? ' rough' : '') + ' x' + (e / r.J).toPrecision(3)).join(' ; '));
  console.log('   ladder.compare:', L.compare(e, refs).text);
}
console.log('floor level (log): ', ((Math.log10(fl.J) - Math.log10(lo.J)) / (Math.log10(hi.J) - Math.log10(lo.J))).toFixed(4));
console.log('span decades', (Math.log10(hi.J) - Math.log10(lo.J)).toFixed(3));
