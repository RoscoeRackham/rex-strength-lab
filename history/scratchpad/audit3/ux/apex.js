global.window = {}; const P = require('/home/user/dino-strength-sim/src/engine.js'); require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const obj = (id) => D.objects.find(o => o.id === id);
const base = (lg, extra) => Object.assign({ F: Math.pow(10, lg) * g, mode: 'comic', body: P.makeBody({ H: 2, m: 180 }), surface: D.surfaces.find(s => s.id === 'concrete'), groundHolds: false, anchor: 'friction', record: true }, extra || {});
const fmt = (x) => (x / 1000).toFixed(1) + ' km';
let n = 0, worst = [], maxGap = [];
const t0 = Date.now();
for (const mode of ['comic', 'real']) for (const id of D.objects.filter(o => !o.noThrow).map(o => o.id)) for (let lg = 2.7; lg <= 34; lg += 0.5) for (const ang of [10, 30, 45, 60, 80, 89]) for (const anchor of ['friction', 'bolted']) {
  const r = P.throwObject(base(lg, { anchor, mode }), obj(id), ang);
  if (!r.canHold || !r.canMove) continue; const f = r.flight; if (!f || f.relativistic || !f.path || f.path.length < 2 || f.escaped || f.orbit) continue;
  let ap = -Infinity; for (const p of f.path) ap = Math.max(ap, p[1]);
  const diff = (f.apex - ap) / f.apex;
  if (diff > 0.005) { n++; worst.push([diff, mode, id, lg.toFixed(1), ang, anchor, fmt(f.apex), fmt(ap), f.path.length]); }
  // largest angular gap between consecutive path points, relative to chart X extent
  let maxX = 0; for (const p of f.path) maxX = Math.max(maxX, p[0]);
  let gmax = 0; for (let i = 1; i < f.path.length; i++) gmax = Math.max(gmax, Math.hypot((f.path[i][0] - f.path[i - 1][0]) / maxX, (f.path[i][1] - f.path[i - 1][1]) / ap));
  maxGap.push([gmax, mode, id, lg.toFixed(1), ang, anchor, f.path.length]);
  // NaN in path?
  if (f.path.some(p => !isFinite(p[0]) || !isFinite(p[1]))) console.log('NONFINITE PATH', mode, id, lg, ang, anchor);
}
worst.sort((a, b) => b[0] - a[0]);
maxGap.sort((a, b) => b[0] - a[0]);
console.log('cases where chart apex < tile apex by >0.5%:', n, 'time', Date.now() - t0, 'ms');
console.log(worst.slice(0, 12).map(w => `${(w[0] * 100).toFixed(1)}% ${w[1]} ${w[2]} lg${w[3]} ${w[4]}° ${w[5]} tile ${w[6]} chart ${w[7]} pts=${w[8]}`).join('\n'));
console.log('largest normalized segment length (1 = full chart):'); console.log(maxGap.slice(0, 8).map(x => x.map(String).join(' ')).join('\n'));
const r = P.throwObject(base(18.7), obj('loco'), 80); console.log('loco 18.7 80 apex', fmt(r.flight.apex), 'pts', r.flight.path.length, 'pathmax', fmt(Math.max(...r.flight.path.map(p => p[1]))));
