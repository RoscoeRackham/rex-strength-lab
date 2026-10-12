const { P, D, g, surf, obj, rex, ollie, ctxOf } = require('./common.js');
console.log('surfaces', D.surfaces.map(s=>[s.id,s.qult,s.Bref,s.granular,s.shear,s.rho,s.short].join(':')).join('\n'));
for (const sid of ['concrete','sand']) {
const c = ctxOf(90718*g, {surface: surf(sid)});
const p = P.RESTRAINT.planNow('stomp', c, {near:5});
const gl = p.goal(), ce = p.ceiling();
const r = p.run(gl.use);
const M = P.RESTRAINT.MOVES.stomp;
const src = M.shake(r, p.opt);
console.log(sid, 'goal use kg', (gl.use/g).toPrecision(3), 'vFoot', r.vFoot.toFixed(3), 'legEff', rex.legEff.toFixed(0), 'basis', r.basis);
console.log('src F', src.F.toFixed(0), 'T', src.T, 'impulse', (0.5*src.F*src.T).toFixed(0), 'leg momentum', (rex.legEff*r.vFoot).toFixed(0), 'pBody up', r.push.pA.toFixed(0), 'vBody', r.vBody);
console.log('ppv at 5 m', P.ppvAt(src,5)*1000, 'mm/s; with leg mass only:', P.ppvAt([{...src, F: 2*rex.legEff*r.vFoot/src.T}],5)*1000);
console.log('ceiling', ce.by, (ce.below/g).toPrecision(3));
}
