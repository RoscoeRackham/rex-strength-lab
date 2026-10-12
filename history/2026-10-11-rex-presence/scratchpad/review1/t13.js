const { P, D, g, surf, obj, rex, ollie, cal, big, ctxOf } = require('./h.js');
for (const sid of ['concrete', 'sand']) {
const c = ctxOf(Infinity, {surface: surf(sid)});
const p = P.RESTRAINT.planNow('stomp', c, { near: 3 });
const pl = p.result('hazard:plaster'), gr = p.result('hazard:ground');
const r = p.run(pl.use);
console.log(sid, 'stomp: plaster at 3 m from', (pl.use / g).toExponential(2), 'kg; vFoot', r.vFoot.toFixed(1), 'm/s; hole', r.holeDepth.toFixed(2), 'm; ground breaks from', (gr.use / g).toExponential(2), 'kg; boom?', r.vFoot >= 340);
// walk
for (const e of [0.5, 1]) { const w = P.presence(rex, surf(sid), { effort: e }); console.log('  walk effort', e, 'ppv 3m', (w.ppv(3) * 1000).toFixed(2), 'mm/s', 'plasterWalk reach', w.reach.plasterWalk.toFixed(2), 'plaster reach', w.reach.plaster.toFixed(2)); }
console.log('  walkEffortFor plasterWalk at 3m', P.walkEffortFor(rex, surf(sid), {}, P.VIB.TH.plasterWalk, 3));
}
