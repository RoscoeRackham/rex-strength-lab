global.window = {};
const P = require(process.argv[2] + '/src/engine.js');
require(process.argv[2] + '/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const surf = (id) => D.surfaces.find((s) => s.id === id), obj = (id) => D.objects.find((o) => o.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
for (const [sid, oid, mode] of [['ice', 'liberty', 'real'], ['sand', 'pickup', 'real'], ['softclay', 'car', 'comic']]) {
  const row = [];
  for (const lg of [3, 6, 10, 20, 34]) {
    const c = { F: Infinity, mode, body: rex, surface: surf(sid), groundHolds: false, anchor: 'friction' };
    const t0 = Date.now(); const r = P.throwObject(c, obj(oid), 45); row.push('1e' + lg + ':' + (Date.now() - t0) + 'ms v=' + r.v.toPrecision(3));
  }
  const t0 = Date.now(); const r = P.throwObject({ F: Infinity, mode, body: rex, surface: surf(sid), groundHolds: false, anchor: 'friction' }, obj(oid), 45);
  console.log(sid, oid, mode, row.join('  '), '| all-out (no use):', Date.now() - t0, 'ms');
}
