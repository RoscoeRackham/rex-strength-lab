const { P, D, g, surf, obj, ctxOf } = require('./eng.js');
const c = ctxOf(1e9);
const o = { obj: obj('baseball'), angle: 45, near: 5, target: 30 };
const p = P.RESTRAINT.planNow('throw', c, o);
const h = p.result('hazard:plaster');
console.log('plaster hazard from', (h.use / g / 1000).toFixed(1), 't');
const r = p.run(h.use), src = P.RESTRAINT.MOVES.throw.shake(r, p.opt);
const T = src.T || 2 * src.tau;
console.log('landing v', r.flight.vImpact.toFixed(1), 'pulse T (s)', T, '=> ~', (1 / T).toFixed(0), 'Hz; PPV at 5 m', (P.ppvAt(src, 5) * 1000).toFixed(1), 'mm/s');
