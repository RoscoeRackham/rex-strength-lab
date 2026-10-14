const { P, D, g, surf, obj, rex, ollie, ctx } = require('./base.js');
const M = P.RESTRAINT.MOVES;
const c = ctx(1e5, { surface: surf('ice') });
const p = P.RESTRAINT.planNow('throw', c, { obj: obj('bus'), angle: 45, target: 30, near: 5 }); const ce = p.ceiling();
console.log('bus ice ceiling', ce.by, (ce.below/g).toFixed(0), (ce.use/g).toFixed(0));
const r = p.run(ce.use); console.log('at use v', r.v.toFixed(3), 'recoil', r.recoilV.toFixed(3), 'slide', M.throw.slide(r, p.opt).toFixed(3));
const rb = P.throwObject(ctx(1e5, { surface: surf('ice'), anchor: 'bolted', use: ce.below }), obj('bus'), 45); console.log('bolted at below v', rb.v.toFixed(3));
const ra = P.throwObject(ctx(1e5, { surface: surf('ice') }), obj('bus'), 45); console.log('allout v', ra.v.toFixed(3), 'recoil', ra.recoilV.toFixed(3), 'range', ra.flight.range.toFixed(2), 'basis', ra.basis);
const rab = P.throwObject(ctx(1e5, { surface: surf('ice'), anchor:'bolted' }), obj('bus'), 45); console.log('allout bolted v', rab.v.toFixed(3), 'range', rab.flight.range.toFixed(2));
// All-Star bolted
const as = P.throwObject(ctx(1.8e23, { anchor: 'bolted' }), obj('baseball'), 0); console.log('allstar bolted Eobj', as.Eobj.toExponential(3), 'recoil', as.recoilV);
// grip ratios default 100 t car 45
for (const id of ['car','bus','piano']) { const t = P.throwObject(ctx(90718.474), obj(id), 45); console.log(id, 'grip', t.gripRatio.toFixed(3)); }
// default throw ceiling with gentle
for (const gh of [false, true]) { const c2 = ctx(90718.474, { gentleHold: gh }); const pp = P.RESTRAINT.planNow('throw', c2, { obj: obj('car'), angle: 45, target: 30, near: 5, gentleHold: gh }); const cc = pp.ceiling(); console.log('car ceiling gentle', gh, cc.by, cc.below && (cc.below/g).toFixed(0)); }
