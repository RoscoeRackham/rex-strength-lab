global.window = {};
const P = require(process.argv[2] || './engine-head.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA;
const g = P.K.g;
const surf = (id) => D.surfaces.find((s) => s.id === id);
const obj = (id) => D.objects.find((o) => o.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const ctxOf = (F, extra) => Object.assign({ F, mode: 'comic', body: rex, surface: surf('ice'), groundHolds: false, anchor: 'friction' }, extra || {});
const c = ctxOf(1e5 * g);
const bus = obj('bus');
console.log('bus', JSON.stringify(bus));
console.log('ice', JSON.stringify(surf('ice')));
const p = P.RESTRAINT.planNow('throw', c, { obj: bus, angle: 45, target: 30, near: 5 });
const ce = p.ceiling();
console.log('ceiling', ce.by, 'use kg', ce.use / g, 'below kg', ce.below / g);
const M = P.RESTRAINT.MOVES.throw;
for (const u of [ce.below, ce.use, undefined]) {
  const r = p.run(u);
  console.log('use', u == null ? 'allout' : (u / g).toPrecision(4) + ' kg', 'v', r.v, 'recoilV', r.recoilV, 'recoilE', r.recoilE, 'lurch xA', r.push && r.push.xA, 'pA', r.push && r.push.pA, 'pB', r.push && r.push.pB, 't', r.push && r.push.t, 'heldBack', r.heldBack, 'F', r.F, 'anchorR', r.anchor.R, 'slide', M.slide(r, p.opt), 'range', r.flight && r.flight.range, 'sinkRatio', r.sinkRatio);
}
const hz = p.hazards(); console.log(hz.map(h => h.id + ':' + (h.never ? 'never' : (h.use / g).toPrecision(4))).join(' '));
const pr = p.presets(); console.log(pr.map(h => h.id + ':' + (h.never ? 'never' : (h.use / g).toPrecision(4))).join(' '));
const gl = p.goal(); console.log('goal', gl.reached, (gl.use / g).toPrecision(4));
// bolted version
const cb = ctxOf(1e5 * g, { anchor: 'bolted' });
const pb = P.RESTRAINT.planNow('throw', cb, { obj: bus, angle: 45, target: 30, near: 5 });
const ceb = pb.ceiling();
console.log('BOLTED ceiling', ceb.by, ceb.use / g, ceb.below / g);
for (const u of [ce.below, ce.use, undefined]) {
  const r = pb.run(u);
  console.log('bolted use', u == null ? 'allout' : (u / g).toPrecision(4), 'v', r.v, 'recoilV', r.recoilV, 'pB', r.push.pB, 't', r.push.t, 'F', r.F, 'range', r.flight.range, 'sinkRatio', r.sinkRatio, 'slide', M.slide(r, pb.opt));
}
console.log(pb.hazards().map(h => h.id + ':' + (h.never ? 'never' : (h.use / g).toPrecision(4))).join(' '));
console.log(pb.presets().map(h => h.id + ':' + (h.never ? 'never' : (h.use / g).toPrecision(4))).join(' '));
const glb = pb.goal(); console.log('goal', glb.reached, (glb.use / g).toPrecision(4));
