const { P, g, ON, OFF, DIAL, pair, sig, rex, ollie, surf, ctxOf } = require('./common.js');
const pick = (r) => JSON.stringify(Object.fromEntries(['outcome', 'winner', 'PA', 'PB', 'AA', 'AB', 'RA', 'RB', 'tableLat', 'tableBreaks', 'tableBreaksBy', 'padLoad', 'padBy', 'tableRatio', 'tableRatio2', 'slamRatio', 'footLimitedA', 'footLimitedB', 'loserSlides', 'clash', 'via', 'contact'].map((k) => [k, typeof r[k] === 'number' ? sig(r[k]) : r[k]])));
for (const [lab, x] of [['ON', ON], ['ON keepForm off', Object.assign({}, ON, { keepForm: false })], ['OFF', OFF], ['recoil only', { ownRecoil: true }]]) {
  for (const [FR, FO, fl] of [[DIAL, DIAL, 'dial=dial'], [DIAL, 1e3 * g, 'dial vs 1000kgf'], [1e5 * g, 2e5 * g, '1e5 vs 2e5'], [Infinity, Infinity, 'inf'], [2e3 * g, 1e3 * g, '2e3 vs 1e3']]) {
    const cR = ctxOf(FR, x, rex), cO = ctxOf(FO, x, ollie);
    const r = P.armWrestle(cR, cO);
    console.log(lab, fl, pick(r), r.pin ? 'pin v ' + sig(r.pin.v) + ' t ' + sig(r.pin.t) : '', r.drag ? 'drag v ' + sig(r.drag.v) : '', r.toGround ? 'toGround J ' + sig(r.toGround.J) : '');
  }
}
