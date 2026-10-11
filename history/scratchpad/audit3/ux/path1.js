global.window = {}; const P = require('/home/user/dino-strength-sim/src/engine.js'); require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const obj = (id) => D.objects.find(o => o.id === id);
const base = (lg, extra) => Object.assign({ F: Math.pow(10, lg) * g, mode: 'comic', body: P.makeBody({ H: 2, m: 180 }), surface: D.surfaces.find(s => s.id === 'concrete'), groundHolds: false, anchor: 'friction', record: true }, extra || {});
const [id, lg, ang] = process.argv.slice(2);
const r = P.throwObject(base(+lg), obj(id), +ang);
const f = r.flight;
console.log('v', r.v, 'apex km', f.apex / 1000, 'range km', f.range / 1000, 'pts', f.path.length, 'landed', f.landed, 'time', f.time);
let maxX = Math.max(...f.path.map(p => p[0])), maxY = Math.max(...f.path.map(p => p[1]));
for (let i = 1; i < f.path.length; i++) { const d = Math.hypot((f.path[i][0] - f.path[i - 1][0]) / maxX, (f.path[i][1] - f.path[i - 1][1]) / maxY); if (d > 0.05) console.log('seg', i, f.path[i - 1].map(x => typeof x === 'number' ? (x / 1000).toFixed(2) : x), '->', f.path[i].map(x => typeof x === 'number' ? (x / 1000).toFixed(2) : x), 'norm', d.toFixed(3)); }
