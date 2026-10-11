global.window = {};
const A = require('/home/user/dino-strength-sim/src/engine.js');
const B = require('./eng-fast.js');
require('/home/user/dino-strength-sim/src/data.js'); const D = window.DINO_DATA; const g = A.K.g;
const [mode, id, ang, surf, lg] = process.argv.slice(2);
for (const lgx of [Number(lg) - 0.01, Number(lg), Number(lg) + 0.01]) for (const [nm, P] of [['cur', A], ['fast', B]]) {
  const c = { F: Math.pow(10, lgx) * g, mode, body: P.makeBody({ H: 2, m: 180 }), surface: D.surfaces.find(s => s.id === surf), groundHolds: false, anchor: 'friction' };
  const t = process.hrtime.bigint();
  const r = P.throwObject(c, D.objects.find(x => x.id === id), Number(ang));
  const ms = Number(process.hrtime.bigint() - t) / 1e6;
  console.log(lgx.toFixed(2), nm, ms.toFixed(1) + 'ms', 'v', r.v, 'heldBack', r.heldBack, 'stalled', r.push && r.push.stalled, 't', r.push && r.push.t, 'xA', r.push && r.push.xA, 'xB', r.push && r.push.xB, r.basis || '');
}
