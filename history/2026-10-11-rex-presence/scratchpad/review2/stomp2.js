const { P, D, g, surf, obj, rex, ollie, ctxOf } = require('./common.js');
for (const sid of ['concrete','sand','granite']) for (const F of [90718*g, 1e9*g]) {
const c = ctxOf(F, {surface: surf(sid)});
const p = P.RESTRAINT.planNow('stomp', c, {near:5});
const M = P.RESTRAINT.MOVES.stomp;
const show = (name) => { const res = p.result(name); if (res.never) return name+': never'; const r = p.run(res.use); const src = M.shake(r,p.opt); return name+': use '+(res.use/g).toPrecision(3)+' kg vFoot '+r.vFoot.toPrecision(3)+' hole '+(r.holeDepth||0).toPrecision(2)+' J_model '+(0.5*src.F*src.T).toPrecision(3)+' leg p '+(rex.legEff*r.vFoot).toPrecision(3)+' T '+src.T.toPrecision(3); };
console.log(sid, (F/g).toPrecision(3));
for (const n of ['goal','hazard:plaster','hazard:ground','hazard:air','hazard:boom','preset:rattle','preset:plaster']) console.log('  ', show(n));
}
