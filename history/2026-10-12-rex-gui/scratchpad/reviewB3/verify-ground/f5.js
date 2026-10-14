const { P, surf, ctx } = require('./common.js');
const R = P.RESTRAINT; const cc = surf('concrete');
const c = ctx(1e7, {});
const pl = R.planNow('stomp', c, { near: 5 });
const pre = pl.presets(); const ceil = pl.ceiling(); const goal = pl.goal();
console.log('plaster preset use (t)', (pre.find(p => p.id === 'plaster').use / P.K.g / 1e3).toFixed(1), 'ceiling by', ceil.by, (ceil.below / P.K.g / 1e3).toFixed(1), 't  goal', (goal.use / P.K.g / 1e3).toFixed(2), 't');
const u = pre.find(p => p.id === 'plaster').use;
const r = pl.run(u);
const o = Object.assign({}, pl.opt);
const src = R.MOVES.stomp.shake(r, o);
console.log('bolted', r.bolted, 'push.t ms', (r.push.t * 1e3).toFixed(2), 'footPulse/T ms', (src.T * 1e3).toFixed(1), 'blow J', (src.F * src.T / 2).toExponential(3), 'push pA', r.push.pA.toExponential(3), 'pB', r.push.pB.toExponential(3), 'vFoot', r.vFoot.toFixed(1));
console.log('ppv@5', (P.ppvAt(src, 5) * 1e3).toFixed(1), 'mm/s plasterReach', P.plasterReach(src).toFixed(2));
// without the power, same effort: body rises
const r0 = P.stomp(Object.assign({}, c, { use: u, ownRecoil: false }));
console.log('ownRecoil off: vBody', r0.vBody.toFixed(1), 'bolted', r0.bolted, 'vFoot', r0.vFoot.toFixed(1));
// default dial
const cd = ctx(100 * 907.18474, {});
const pd = R.planNow('stomp', cd, { near: 5 });
const gd = pd.goal(), cdl = pd.ceiling();
console.log('default dial: goal use', gd.use === Infinity ? 'none' : (gd.use / P.K.g / 1e3).toFixed(2) + ' t', 'ceiling by', cdl.by, cdl.by ? (cdl.below / P.K.g / 1e3).toFixed(2) + ' t' : '');
const rg = pd.run(gd.use); console.log('  at goal: bolted', rg.bolted, 'push.t ms', (rg.push.t*1e3).toFixed(1), 'vFoot', rg.vFoot.toFixed(2));
