// jump: landing shaking on vs off at equal efforts; where real ground holds (landRatio <= 1)
const { P, D, surf, obj, rex, tons, ctx } = require('./lib.js');
const M = P.RESTRAINT.MOVES;
const fmt = (x) => (typeof x === 'number' ? x.toPrecision(4) : x);
for (const s of ['sand', 'gravel', 'softclay', 'concrete']) {
  for (const t of [3.4, 3.6, 4, 5, 6, 8, 10, 30, 100]) {
    const body = rex();
    const base = { F: tons(t) * P.K.g, mode: 'comic', body, surface: surf(s), anchor: 'friction', airAbsorb: 0, keepForm: false, ownRecoil: false };
    const on = Object.assign({}, base, { unbreakable: true }), off = Object.assign({}, base, { unbreakable: false });
    const o = (c) => Object.assign({ body, surface: c.surface, m: body.m, near: 5, anchor: 'friction' }, c);
    const rOn = M.jump.run(on, o(on)), rOff = M.jump.run(off, o(off));
    const sOn = M.jump.shake(rOn, o(on)), sOff = M.jump.shake(rOff, o(off));
    const L = rOn.landing, Lf = rOff.landing;
    // landing sources only (drop the push-off with power on)
    const landOnly = Array.isArray(sOn) ? sOn.slice(0, sOn.length - (rOn.pushOff ? 1 : 0)) : sOn;
    console.log(s, t + 't', 'v', fmt(rOn.v), fmt(rOff.v), 'vLand', fmt(L.v), fmt(Lf.v), 'landRatioReal', fmt(rOn.landRatioReal), 'landRatio(off)', fmt(Lf.ratio),
      'feet J', fmt(2 * body.legEff * L.v), 'cap', fmt(rOn.landBear * 0.06419),
      'ppv5 landing on/off', fmt(P.ppvAt(landOnly, 5) * 1e3), fmt(P.ppvAt(sOff, 5) * 1e3), 'with pushoff', fmt(P.ppvAt(sOn, 5) * 1e3), 'plaster', fmt(P.plasterReach(landOnly)), fmt(P.plasterReach(sOff)));
  }
}
