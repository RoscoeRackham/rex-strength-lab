const { P, D, g, surf, obj, ctxOf } = require('./eng.js');
const c = ctxOf(1e12);
const o = { near: 5, target: 3 };
const p = P.RESTRAINT.planNow('jump', c, o);
for (const id of ['boom', 'air']) { const r = p.result('hazard:' + id); console.log(id, r.never ? 'never' : (r.use / g / 1000).toFixed(0) + ' t'); }
const w = p.result('preset:windows'); console.log('windows preset at', (w.use / g / 1000).toFixed(0), 't');
const r = p.run(w.use);
console.log('at windows preset: body v', r.v.toFixed(1), 'm/s; footSpeed', r.footSpeed.toFixed(0), 'm/s; apex', r.flight.apex.toFixed(0), 'm; boom test', P.RESTRAINT.HAZARDS[0].test(P.RESTRAINT.MOVES.jump, r, p.opt), 'air test', P.RESTRAINT.HAZARDS[1].test(P.RESTRAINT.MOVES.jump, r, p.opt));
