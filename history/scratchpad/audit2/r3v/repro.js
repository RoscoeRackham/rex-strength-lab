global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const P = require(process.argv[2] || '/home/user/dino-strength-sim/src/engine.js');
const g = 9.80665;
function ctx(s) {
  const body = P.makeBody({ H: s.H || 2, m: s.m || 180 * Math.pow((s.H||2)/2, 3) });
  const surface = D.surfaces.find((x) => x.id === s.surface);
  return { F: s.inf ? Infinity : Math.pow(10, s.logKg) * g, mode: 'real', body, surface, groundHolds: !!s.groundHolds, anchor: s.anchor };
}
const obj = (id) => D.objects.find((o) => o.id === id);
console.log('surfaces', D.surfaces.map(s=>s.id).join(','));
console.log('objects', D.objects.map(s=>s.id+':'+s.m).join(',').slice(0,500));
for (const surf of ['steel','granite','concrete']) for (const anchor of ['friction','braced','bolted']) {
  const row = [];
  for (const lk of [2.7084, 4, 6, 8, 10, 12, 14, 16, 17, 18, 20, 24]) {
    const c = ctx({ surface: surf, anchor, logKg: lk });
    const p = P.punch(c);
    row.push(lk + ':' + p.vFist.toFixed(2));
  }
  console.log('punch', surf, anchor, row.join(' '));
}
