const { P, ctx, octx, K, g } = require('./h.js');
const C = P.COLLIDE || P;
const hb1 = (P.COLLIDE ? P.COLLIDE.holdOf : P.holdOf);
console.log(Object.keys(P).filter(k => /collide|COLLIDE|holdOf|standoff/i.test(k)));
const r1 = P.collide(octx({ unbreakable: false }), ctx({ unbreakable: false }), { source: 'jump' });
console.log('standing from above real: hold', r1.hold.H, r1.hold.why);
const r2 = P.collide(octx({ unbreakable: false }), ctx({ unbreakable: false, anchor: 'bolted' }), { source: 'jump' });
console.log('bolted from above real: hold', r2.hold.H, r2.hold.why, 'tear', r2.carry.tear, 'footJ', r2.carry.footJ, 'vs standing', r1.carry.footJ, 'depth', r2.after.splat.depth, r1.after.splat.depth, 'Eground', r2.after.splat.Eground, r1.after.splat.Eground);
// power off: bolted from above on real rock
const r3 = P.collide(octx({ unbreakable: false, ownRecoil: false }), ctx({ unbreakable: false, anchor: 'bolted', ownRecoil: false }), { source: 'jump' });
console.log('power off bolted from above real:', r3.outcome, r3.held, JSON.stringify(r3.rock));
