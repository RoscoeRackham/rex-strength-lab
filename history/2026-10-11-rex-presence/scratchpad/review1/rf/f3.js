const { P, D, g, surf, obj, ctx } = require('./lib.js');
for (const use of [undefined, 1e4*g]) for (const soft of [false, true]) {
  const c = ctx({ surface: surf('sand'), softLanding: soft, use });
  const r = P.jump(c);
  const L = r.landing;
  const o = { near: 5, target: 3, softLanding: soft, body: c.body, surface: c.surface, m: c.body.m };
  const rc = P.RESTRAINT.reach('jump', r, o);
  console.log('use', use ? (use/g)+' kg' : 'all-out', 'soft', soft, 'apex', r.flight.apex.toFixed(2), 'vLand', L.v.toFixed(2), 'F', L.F.toFixed(0), 'T', L.t.toFixed(3), 'RB', r.groundLimitForce.toFixed(0), 'ratio', L.ratio.toFixed(2), 'sink', L.sink.toFixed(3), 'feel', rc.feel.toFixed(1), 'shimmer', rc.shimmer.toFixed(1), 'rattle', rc.rattle.toFixed(1), 'ground haz', rc.ground);
}
const f = require('./wt/research/final-presence.json');
const all = JSON.stringify(f);
const facts = Array.isArray(f) ? f : (f.facts || Object.values(f).flat());
const fx = (k) => { const s = JSON.stringify(f); const i = s.indexOf('"' + k + '"'); return s.slice(i, i + 1600); };
console.log(fx('comic_soft_landing_force'));
