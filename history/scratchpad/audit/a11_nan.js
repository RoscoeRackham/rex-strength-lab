const { P, g, ctx, obj, D } = require('./lib.js');
function scan(x, path, out) {
  if (typeof x === 'number') { if (Number.isNaN(x)) out.push(path); return; }
  if (x && typeof x === 'object') for (const k of Object.keys(x)) { if (k === 'path') continue; scan(x[k], path + '.' + k, out); }
}
const issues = new Map();
const lgs = [0, 1, 2, 2.7, 4, 6, 8, 10, 14, 20, 26, 30, 34, 'inf'];
for (const mode of ['comic', 'real']) for (const surface of D.surfaces.map(s => s.id)) for (const groundHolds of [false, true]) for (const anchor of ['friction', 'braced', 'bolted']) for (const H of [0.4, 2, 50, 500]) for (const lg of lgs) {
  const c = ctx({ logKg: lg === 'inf' ? 0 : lg, inf: lg === 'inf', mode, surface, groundHolds, anchor, H, m: 180 * Math.pow(H / 2, 3) });
  const tag = `${mode}/${surface}/holds=${groundHolds}/${anchor}/H=${H}/lg=${lg}`;
  const res = { jump: P.jump(c), stomp: P.stomp(c), punch: P.punch(c), clap: P.clap(c), sprint: P.sprint(c) };
  for (const o of D.objects) { res['lift_' + o.id] = P.lift(c, o); res['pull_' + o.id] = P.pull(c, o); if (!o.noThrow) for (const a of [0, 45, 90]) res['throw_' + o.id + '_' + a] = P.throwObject(c, o, a); }
  for (const [k, v] of Object.entries(res)) { const out = []; scan(v, k, out); for (const p of out) { if (!issues.has(p)) issues.set(p, tag); } }
}
for (const [p, t] of issues) console.log('NaN at', p, 'first seen', t);
console.log('distinct NaN fields:', issues.size);
