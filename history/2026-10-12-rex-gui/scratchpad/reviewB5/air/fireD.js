const { P, body, obj, ctx } = require('./load.js');
const ollie = P.makeBody({ build: 'ollie', H: 3.06, m: 3007 });
const bb = obj('baseball');
const F = 200e18 * 907.18474 * P.K.g;
for (const [D, s, kf] of [[1e6, 0.5, false], [1e6, 0, false], [1e6, 0, true], [20e3, 0.5, false], [1e6, 0.5, false]]) {
  const cR = ctx({ F, airAbsorb: s, keepForm: kf, unbreakable: true, ownRecoil: true });
  const cO = Object.assign({}, cR, { body: ollie });
  const L = P.catchLeg(cR, cO, bb, D, 'hard');
  const fb = L.fireball;
  console.log('D', D, 's', s, 'kf', kf, L.result, 'th', L.thetaDeg, fb && JSON.stringify({ kind: fb.kind, Egap: fb.Egap / fb.E, Earr: fb.Earr / fb.E, sweepK: fb.sweepK, sweep: fb.sweep, Eblast: fb.Eblast / fb.E }));
}
