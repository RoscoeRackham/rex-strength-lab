// 5c: same push, same shaking: stomp, jump, throw on sand & concrete, unbreakable on vs off at equal efforts
const { P, D, surf, obj, rex, tons, ctx } = require('./lib.js');
const M = P.RESTRAINT.MOVES;
const fmt = (x) => (typeof x === 'number' ? x.toPrecision(4) : x);
for (const s of ['sand', 'concrete', 'gravel', 'softclay']) {
  for (const t of [1, 6, 30, 100, 1000, 1e5]) {
    const body = rex();
    const base = { F: tons(t) * P.K.g, mode: 'comic', body, surface: surf(s), anchor: 'friction', airAbsorb: 0, keepForm: false, ownRecoil: false };
    const on = Object.assign({}, base, { unbreakable: true }), off = Object.assign({}, base, { unbreakable: false });
    const o = (c) => Object.assign({ body, surface: c.surface, m: body.m, near: 5, anchor: 'friction' }, c);
    // stomp
    const rOn = M.stomp.run(on, o(on)), rOff = M.stomp.run(off, o(off));
    const sOn = M.stomp.shake(rOn, o(on)), sOff = M.stomp.shake(rOff, o(off));
    const bOn = M.stomp.blow(rOn, o(on)), bOff = M.stomp.blow(rOff, o(off));
    console.log(s, t + 't', 'STOMP vFoot', fmt(rOn.vFoot), fmt(rOff.vFoot), 'realBreaks', rOn.realBreaks, 'realHole', fmt(rOn.realHole), 'hole(off)', fmt(rOff.holeDepth),
      'J on/off', fmt(bOn && bOn.J), fmt(bOff && bOff.J), 'T on/off', fmt(bOn && bOn.T), fmt(bOff && bOff.T),
      'ppv5 on/off mm/s', fmt(P.ppvAt(sOn, 5) * 1e3), fmt(P.ppvAt(sOff, 5) * 1e3), 'plaster on/off', fmt(P.plasterReach(sOn)), fmt(P.plasterReach(sOff)));
  }
}
