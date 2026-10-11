global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const P = require('./engine_m8.js');
const D = window.DINO_DATA;
const g = P.K.g;
let bad = 0, n = 0;
for (const H of [0.4, 2, 50]) for (const mode of ['comic', 'real']) for (const s of D.surfaces) for (const gh of [false, true]) for (const anchor of ['friction','braced','bolted'])
for (const kg of [10, 511, 1e3, 9e4, 1e9, 1.36e14, 1e20, 1e34, Infinity]) {
  const body = P.makeBody({ H, m: 180 * Math.pow(H / 2, 3) });
  const r = P.stomp({ F: kg * g, mode, body, surface: s, groundHolds: gh, anchor });
  n++;
  const vals = [r.E, r.vFoot, r.vBody, r.footShare, r.quake, r.holeDepth, r.crater];
  if (vals.some((x) => Number.isNaN(x))) { bad++; if (bad < 5) console.log('NaN', H, mode, s.id, gh, anchor, kg, vals); }
  if (anchor === 'bolted' && r.vBody !== 0) { bad++; console.log('vBody nonzero', H, mode, s.id, anchor, kg, r.vBody); }
}
console.log('cases', n, 'bad', bad);
const body = P.makeBody({ H: 2, m: 180 });
const s = D.surfaces.find((x) => x.id === 'concrete');
for (const kg of [511, 90718.474, 1e9, Infinity]) for (const mode of ['comic','real']) {
  const r = P.stomp({ F: kg * g, mode, body, surface: s, groundHolds: false, anchor: 'bolted' });
  console.log(mode, kg, 'E', r.E, 'vFoot', r.vFoot, 'vBody', r.vBody, 'share', r.footShare, 'apex', r.bodyFlight.apex);
}
