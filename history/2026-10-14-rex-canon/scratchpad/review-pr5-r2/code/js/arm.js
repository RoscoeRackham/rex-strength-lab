const H = require('./h.js')();
const { P, g, R3, O3, c9, sig, TB } = H;
for (const kg of [9.07e4, 1e7, 1e9, 1e11, 1e13]) {
  for (const ub of [true, false]) {
    const x = { unbreakable: ub };
    // Rex stronger than Ollie so there is a pin: Ollie at a tenth of the dial
    const A = c9(kg * g, R3, x), B = c9(kg * g / 10, O3, x);
    let r; try { r = P.armWrestle(A, B); } catch (e) { console.log('err', e.message); continue; }
    console.log(sig(kg), 'unbreakable', ub, 'outcome', r.outcome, 'pin v', r.pin ? sig(r.pin.v) : '-', 'E', r.pin ? sig(r.pin.E || (r.drag && r.drag.E) || 0) : '-', 'crater', sig(r.crater || 0), 'quake', sig(r.quake), 'toGround', !!r.toGround, 'tally', TB('arm', r, { A, B, whoA: 'rex' }).E);
  }
}
