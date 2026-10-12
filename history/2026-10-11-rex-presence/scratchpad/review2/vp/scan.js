const { P, D, g, surf, obj, rex, ollie, ctxOf } = require('./lib.js');
const cases = [];
const strengths = [3e4, 90718, 1e6, 1e7, 1e9, 1e12];
const moves = [['jump', { target: 3 }], ['throw', { obj: obj('car'), angle: 45, target: 30 }], ['throw', { obj: obj('loco'), angle: 45, target: 30 }], ['throw', { obj: obj('bus'), angle: 45, target: 30 }], ['stomp', {}], ['punch', { target: 10.4 }], ['sprint', { target: 12.42 }], ['pull', { obj: obj('bus'), target: 10 }]];
let bad = 0, tot = 0; const byMove = {};
for (const mode of ['comic', 'real']) for (const kg of strengths) for (const s of D.surfaces) for (const [mv, o] of moves) {
  const c = ctxOf(kg, { surface: s, mode });
  const p = P.RESTRAINT.planNow(mv, c, Object.assign({ near: 5 }, o));
  const M = P.RESTRAINT.MOVES[mv]; const ra = p.run(undefined);
  const viol = [];
  const gl = p.goal(); tot++;
  if (gl.never && M.goal(ra, p.opt)) viol.push('goal');
  for (const h of P.RESTRAINT.HAZARDS) { const r = p.result('hazard:' + h.id); if (r.never && h.test(M, ra, p.opt)) viol.push('haz:' + h.id); }
  for (const h of P.RESTRAINT.PRESETS) { const r = p.result('preset:' + h.id); if (r.never && h.test(M, ra, p.opt)) viol.push('pre:' + h.id); }
  if (viol.length) { bad++; const k = mv + (o.obj ? ':' + o.obj.id : ''); byMove[k] = (byMove[k] || 0) + 1; if (byMove[k] <= 3) console.log(mode, kg, s.id, k, viol.join(' '), 'ceiling', p.ceiling().by); }
}
console.log('bad', bad, 'of', tot, byMove);
