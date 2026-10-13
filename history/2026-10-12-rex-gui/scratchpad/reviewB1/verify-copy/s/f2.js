const { P, D, ctx } = require('./env');
const obj = D.objects.find(o => o.id === 'baseball');
const c = ctx(1e9);
const r = P.throwObject(c, obj, 0);
const M = P.RESTRAINT.MOVES.throw;
const o = Object.assign({}, c, { obj, angle: 0, near: 5, surface: c.surface });
console.log('landed', r.flight.landed, 'escaped', r.flight.escaped, 'toGround', r.toGround);
console.log('shakeFrom', M.shakeFrom(r, o), 'shake', JSON.stringify(M.shake(r, o)));
console.log('landShake', M.landShake(r, o));
