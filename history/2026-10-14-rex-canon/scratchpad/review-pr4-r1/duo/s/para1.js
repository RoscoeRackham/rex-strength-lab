const { P, D, g, rex, ollie, surf, ON, OFF, ctx, DIAL } = require('./env.js');
const cR = ctx(Infinity, rex, Object.assign({}, ON, { anchor: 'bolted' })), cO = ctx(Infinity, ollie, ON);
const b = P.shoveBoth(cR, cO), s = P.shove(cR, cO), m = P.pushMatch(cR, cO), m9 = P.pushMatch(ctx(1e9, rex, Object.assign({}, ON, { anchor: 'bolted' })), ctx(1e9, ollie, ON)), m12 = P.pushMatch(ctx(1e12, rex, Object.assign({}, ON, { anchor: 'bolted' })), ctx(1e12, ollie, ON));
console.log('shoveBoth', b.clash, b.vA, b.vB, b.stalled, '| back (Ollie->Rex)', b.back.clash, '| shove Rex->Ollie alone', s.clash, s.vB, s.slideB);
console.log('pushMatch inf', m.outcome, m.vA, m.vB, '| 1e9', m9.outcome, m9.vB.toFixed(0), '| 1e12', m12.outcome, m12.vB.toFixed(0));
const off = P.shoveBoth(ctx(Infinity, rex, Object.assign({}, ON, { anchor: 'bolted', ownRecoil: false })), ctx(Infinity, ollie, Object.assign({}, ON, { ownRecoil: false })));
console.log('shoveBoth power off', off.clash, off.vA, off.vB, off.shover);
