const { P, g, surf, obj, rex, ON, ctxOf, sig } = require('./base.js');
const bus = obj('bus');
const c = ctxOf(90718.474, ON), pb = P.pull(Object.assign({}, c, { anchor: 'bolted' }), bus), pf = P.pull(c, bus);
const net = Math.min(c.F, c.F) - pb.resist;
console.log('bus m', bus.m, 'bolted+own accel', sig(pb.accel), 'net/M', sig(net / (bus.m + rex.m)), 'net/obj.m', sig(net / bus.m), '| friction+own accel', sig(pf.accel), 'feet cap', sig(pf.anchor.R / rex.m));
// stomp blow vs foot momentum
const st = P.stomp(c), M = P.RESTRAINT.MOVES, b = M.stomp.blow(st, Object.assign({ surface: c.surface, body: rex }, ON));
console.log('stomp pB', sig(st.push.pB), 'blow J', sig(b.J), 'extra term', sig(b.J - st.push.pB));
console.log('fly ocean P for least car', JSON.stringify(P.throwObject(Object.assign({}, c, { use: 22100 * g }), obj('car'), 45).flight.ocean));
