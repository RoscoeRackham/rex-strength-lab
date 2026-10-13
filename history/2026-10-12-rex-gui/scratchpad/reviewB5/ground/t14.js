const { P, D, surf, obj, rex, ollie, tons, ctx } = require('./lib.js');
const fmt = (x) => (typeof x === 'number' ? x.toPrecision(4) : x);
const T = (o) => o ? JSON.stringify(Object.fromEntries(Object.entries(o).filter(([k,v])=>typeof v==='number').map(([k, v]) => [k, +v.toPrecision(4)]))) : '-';
// bolted Rex throws a car straight up on sand vs bolted Rex hit from above on sand
const c = ctx({ surface: 'sand', extra: { anchor: 'bolted' } });
const r = P.throwObject(c, obj('car'), 90);
console.log('bolted throw up sand toGround', T(r.toGround), 'ppv5', fmt(P.ppvAt(P.impulseSource(c.surface, r.toGround.J, r.toGround.T), 5) * 1e3));
const cO = ctx({ body: ollie(), surface: 'sand' }), cR = ctx({ body: rex(), surface: 'sand', extra: { anchor: 'bolted' } });
const h = P.collide(cO, cR, { source: 'jump', bounce: false });
console.log('bolted Rex hit from above sand toGround', T(h.toGround), 'ppv5', fmt(P.ppvAt(P.impulseSource(cR.surface, h.toGround.J, h.toGround.T), 5) * 1e3));
// bolted Rex catches the falling car? toss partner by bolted rex: catch
const tp = P.tossPartner(Object.assign({}, c), ollie(), 'Ollie', 'easy', 10, 'friction');
console.log('bolted Rex tosses+catches Ollie on sand: T', T(tp.toGroundT), 'C', T(tp.toGroundC));
// jump landing of bolted Rex (jump ignores bolting)
