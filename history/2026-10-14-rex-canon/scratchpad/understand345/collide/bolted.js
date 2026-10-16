const { P, g, sig, F0, ctxOf, sf } = require('./common');
const { newCollide } = require('./proto');
const { facts } = require('./search');
const R = P.RESTRAINT;
const lo = P.W8.WALK_LOAD * 3000 * g / P.MUSCLE.jump.forceFrac;
console.log('lo (least effort to stand and walk):', sig(lo / g), 'kg');
for (const [label, st] of [['bolted sprint', { colSrc: 'sprint', anchor: 'bolted' }], ['friction jump near3', { colSrc: 'jump' }]]) {
  for (const col of [P.collide, newCollide]) {
    const at = (u, near) => facts(col, Object.assign({}, st, { FR: Math.min(F0 * (st.colSrc === 'jump' ? Math.pow(10, 6.25) / (100 * 907.18474) : 1), Math.max(u, lo)), FO: Math.min(F0 * (st.colSrc === 'jump' ? Math.pow(10, 6.25) / (100 * 907.18474) : 1), Math.max(u, lo)) }), { unbreakable: false }, near);
    const s = R.search((u) => !!at(u, st.colSrc === 'jump' ? 3 : 5).harm, lo, st.colSrc === 'jump' ? Math.pow(10, 6.25) * g : F0, false, null, 0.05); let i = 0; while (s.use === undefined && i++ < 500) s.step();
    console.log(label, col === newCollide ? 'proto' : 'main ', 'least:real', s.never ? 'never' : sig(s.below / g) + ' kg below; use ' + sig(s.use / g), 'harm at use:', at(s.use, st.colSrc === 'jump' ? 3 : 5).harm, 'at lo:', at(lo, st.colSrc === 'jump' ? 3 : 5).harm);
  }
}
// bolted on real rock, main: what holds and what cracks
const cO = ctxOf('ollie', { unbreakable: false }), cR = ctxOf('rex', { anchor: 'bolted', unbreakable: false });
const a = P.collide(cO, cR, { source: 'sprint', toGround: true });
console.log('main bolted real rock sprint:', a.outcome, 'held', a.held, 'boltsLate', a.boltsLate, 'rock rT', sig(a.rock && a.rock.rT), 'tearCap', sig(a.rock && a.rock.tearCap), 'contact F', sig(a.contact.soft.F), 'toGround', sig(a.toGround && a.toGround.J));
