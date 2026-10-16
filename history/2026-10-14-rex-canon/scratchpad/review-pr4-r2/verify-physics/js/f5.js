const { P, g, R3, O3, dial, c3 } = require('./common.js');
const real = (x) => Object.assign({ mode: 'real' }, x || {});
const s = P.standoff(c3(dial, O3, real()), c3(dial, R3, real()));
const sc = P.standoff(c3(dial, O3), c3(dial, R3));
console.log('real: outcome', s.outcome, 'DA', s.DA, 'vB', s.drive && s.drive.vB, 'realUpper' in (s.drive || {}), 'realUpper' in s, '| comic vB', sc.drive.vB);
const pm = P.pushMatch(c3(dial, R3, real()), c3(dial, O3, real()));
console.log('pushMatch real: realUpper', pm.realUpper, 'vA', pm.vA);
console.log('MUSCLE.punch.vmax', P.MUSCLE.punch.vmax, 'throwPush.vmax', P.MUSCLE.throwPush.vmax, 'scale s', R3.s, '-> hand vmax', P.MUSCLE.punch.vmax * R3.s, P.MUSCLE.throwPush.vmax * R3.s);
// what does the real-mode Shove give (Hill-limited)?
const sh = P.shove(c3(dial, O3, real({ ownRecoil: true })), c3(dial, R3, real()));
console.log('real shove vB', sh.vB, 'basis', sh.basis);
