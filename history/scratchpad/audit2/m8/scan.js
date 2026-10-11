global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const g = 9.80665;
const row = D.sourceRows.find(r => r.label === 'Crater size');
console.log('Sources row:', JSON.stringify(row.value), '|', row.sources.map(s=>s.title).join(';'));
const body = P.makeBody({ H: 2, m: 180 });
for (const sid of ['concrete']) {
  const surface = D.surfaces.find(s => s.id === sid);
  for (const mode of ['comic','real']) {
    let first = null;
    for (let lk = 3; lk <= 45; lk += 0.25) {
      const ctx = { F: Math.pow(10, lk) * g, mode, body, surface, groundHolds: false, anchor: 'friction' };
      const r = P.stomp(ctx);
      if (r.crater > 0) {
        // recompute Dtc via simple branch check: simple D = 1.25 Dtc <= 3200
        const complex = r.crater > 3200 + 1e-9;
        if (complex && !first) { first = lk; console.log(mode, sid, 'first complex stomp at 10^'+lk+' kg: crater', (r.crater/1000).toFixed(2),'km', 'vFoot', r.vFoot.toExponential(3), 'extrap', r.craterExtrapolated); }
      }
    }
    // Show a few values
    for (const lk of [18, 19, 19.5, 20, 21, 25, 30]) {
      const r = P.stomp({ F: Math.pow(10, lk) * g, mode, body, surface, groundHolds: false, anchor: 'friction' });
      console.log('  ', mode, '10^'+lk, 'crater', r.crater>0 ? (r.crater/1000).toPrecision(4)+' km' : 0);
    }
  }
}
// Compare formula outputs at a value: what would 1.25*Dtc give vs eq.27 at complex sizes
for (const Dtc of [2560, 5000, 1e4, 1e5, 1e6]) {
  const simple = 1.25*Dtc, cx = 1.17*Math.pow(Dtc,1.13)/Math.pow(3200,0.13);
  console.log('Dtc', Dtc, 'simple', simple.toFixed(0), 'eq27', cx.toFixed(0), 'ratio', (cx/simple).toFixed(3));
}
