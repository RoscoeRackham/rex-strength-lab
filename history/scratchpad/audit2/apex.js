global.window = {}; const P = require('/home/user/dino-strength-sim/src/engine.js'); require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const obj = (id) => D.objects.find(o => o.id === id);
const base = (lg, extra) => Object.assign({ F: Math.pow(10, lg) * g, mode: 'comic', body: P.makeBody({ H: 2, m: 180 }), surface: D.surfaces.find(s => s.id === 'concrete'), groundHolds: false, anchor: 'friction', record: true }, extra || {});
const fmt = (x) => (x / 1000).toFixed(1) + ' km';
let n = 0, worst = [];
for (const id of D.objects.filter(o => !o.noThrow).map(o => o.id)) for (let lg = 2.7; lg <= 34; lg += 0.5) for (const ang of [10, 30, 45, 60, 80]) for (const anchor of ['friction', 'bolted']) {
  const r = P.throwObject(base(lg, { anchor }), obj(id), ang);
  if (!r.canHold || !r.canMove) continue; const f = r.flight; if (!f || f.relativistic || !f.path || f.path.length < 2 || f.escaped || f.orbit) continue;
  let ap = -Infinity; for (const p of f.path) ap = Math.max(ap, p[1]);
  const diff = (f.apex - ap) / f.apex;
  if (diff > 0.005) { n++; worst.push([diff, id, lg.toFixed(1), ang, anchor, fmt(f.apex), fmt(ap), f.path.length]); }
}
worst.sort((a, b) => b[0] - a[0]);
console.log('cases where chart "top" label < tile apex by >0.5%:', n);
console.log(worst.slice(0, 12).map(w => `${(w[0] * 100).toFixed(1)}% ${w[1]} lg${w[2]} ${w[3]}° ${w[4]} tile ${w[5]} chart ${w[6]} pts=${w[7]}`).join('\n'));
const r = P.throwObject(base(20), obj('titanic'), 45); console.log('titanic lg20 path pts', r.flight.path.length, r.flight.path.map(p => [Math.round(p[0] / 1000), Math.round(p[1] / 1000)]).join(' '));
