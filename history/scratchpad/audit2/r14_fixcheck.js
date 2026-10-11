global.window = {};
const P = require(process.argv[2]);
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const body = P.makeBody({ H: 2, m: 180 });
let bad = 0;
for (const s of D.surfaces) {
  let prev = null, lgp;
  for (let i = 100; i <= 3400; i++) {
    const lg = i / 100;
    const r = P.stomp({ F: Math.pow(10, lg) * g, mode: 'comic', body, surface: s, groundHolds: false, anchor: 'friction' });
    if (prev && prev.crater > 0 && r.crater > 0) {
      const ratio = r.crater / prev.crater;
      if (ratio < 0.9999 || ratio > 1.03) { bad++; if (bad < 40) console.log(s.id, lgp, '->', lg, prev.crater.toFixed(1), '->', r.crater.toFixed(1), ((ratio - 1) * 100).toFixed(1) + '%'); }
    }
    if (s.id === 'concrete' && [9.49, 9.5, 17.95, 17.96, 18, 20, 25, 34].includes(lg)) console.log('  concrete', lg, r.crater.toFixed(1));
    prev = r; lgp = lg;
  }
}
console.log('irregular steps:', bad);
