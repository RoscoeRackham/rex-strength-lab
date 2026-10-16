const ROOT = process.env.ROOT || '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr4-r3/verify-duo/repo/rex-strength-lab';
const P = require(ROOT + '/src/engine.js'); global.window = {}; require(ROOT + '/src/data.js'); const D = window.DINO_DATA;
const g = P.K.g;
const R3 = P.makeBody({ build: 'rex', ...P.DEFAULT_BODIES.rex }), O3 = P.makeBody({ build: 'ollie', ...P.DEFAULT_BODIES.ollie });
const conc = D.surfaces.find(s => s.id === 'concrete');
const ON = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
const c3 = (F, body, x) => Object.assign({ F, mode: 'comic', body, surface: conc, anchor: 'friction' }, ON, x || {});
const pm = (FR, FO, xR, xO) => P.pushMatch(c3(FR, R3, xR), c3(FO, O3, xO));
console.log('R3 m', R3.m, 'O3 m', O3.m);
// finding 2: walk vs vTop
for (const kg of [2500, 2571.4, 2572, 2600, 2800, 3000, 3050, 3100, 3200, 3500]) {
  const mc = P.moveCheck(kg * g, R3.m), sp = P.sprint(c3(kg * g, R3));
  const r = pm(kg * g, 1000 * g);
  console.log(kg, 'stand', mc.stand, 'walk', mc.walk, 'run', mc.run, 'walkNeedKg', mc.walkNeedKg.toFixed(1), 'vTop', sp.vTop && sp.vTop.toFixed(3), 'outcome', r.outcome, 'v', r.vA, r.vB, 'slideB', r.slideB);
}
// finding 3: custom 3.53 t
for (const kg of [3530, 3544]) {
  const r = pm(kg * g, 1000 * g);
  console.log('3.53t', kg, r.outcome, 'aLoser', r.aLoser, 'aFeet', r.aFeet, 'accel', r.accel, 'walkPush', r.walkPush, 'DA', r.DA, 'HB', r.HB, 'push less hold', r.DA - r.HB, 'v', r.v, 'vCap', r.vCap, 't', r.t, 'J', r.recoilAbsorbedA && r.recoilAbsorbedA.J, 'mut J', (r.HB + O3.m * r.accel) * r.t, 'right', O3.m * r.v + r.HB * r.t);
}
// finding 4: Ollie bolted, unbreakable off, Ollie 1 t, all-out Rex dial
{
  const dial = 100 * 907.18474 * g;
  const r = pm(dial, 1000 * g, { unbreakable: false }, { unbreakable: false, anchor: 'bolted' });
  console.log('torn', r.outcome, 'winner', r.winner, 'tornB', r.tornB, 'HB', r.HB, 'holdAfterB', r.holdAfterB, 'vB', r.vB, 'slideB', r.slideB, 'tearB', r.tearB);
}
// finding 6 N3 check at 3500
{
  const r = pm(3500 * g, 1000 * g);
  console.log('3500', r.outcome, 'v', r.v, 'vCap', r.vCap, 'J', r.recoilAbsorbedA.J, 'O3.m v + HB t', O3.m * r.v + r.HB * r.t, 'mutant (HB + m a) t', (r.HB + O3.m * r.accel) * r.t);
  const w1 = pm(100 * 907.18474 * g, 2200 * g, { surface: D.surfaces.find(s => s.id === 'gravel') }, { surface: D.surfaces.find(s => s.id === 'gravel') }), w2 = pm(100 * 907.18474 * g, 1000 * g);
  console.log('w1 v', w1.v, 'vCap', w1.vCap, 'w2 v', w2.v, 'vCap', w2.vCap);
}
