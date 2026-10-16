const { P, D, g, c, surf, obj, rex, ollie, ON, ctxOf, DEF, sig } = require('./hv.js');
const M = P.RESTRAINT.MOVES;
const cx = ctxOf(DEF, ON), r = P.pull(cx, obj('car'));
const o = Object.assign({ surface: cx.surface, body: rex, near: 5, obj: obj('car') }, ON);
const src = M.pull.shake ? M.pull.shake(r, o) : null;
console.log('pull shake src', !!src, src ? 'ppv5 mm/s ' + sig(1000 * P.ppvAt(src, 5)) : '');
// least-disruptive car throw
const p = P.RESTRAINT.planNow('throw', Object.assign({}, cx, { use: DEF }), { obj: obj('car'), angle: 45, target: 30, near: 5 });
const goal = p.goal(); const rr = p.run(goal.use);
console.log('least car throw use kgf', sig(goal.use / g), 'v', sig(rr.v), 'recoilAbsorbed', rr.recoilAbsorbed ? sig(rr.recoilAbsorbed.J) : '-', 'toGround', rr.toGround ? sig(rr.toGround.J) : '-', 'pObj', sig(obj('car').m * rr.v));
