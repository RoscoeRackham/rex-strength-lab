for (const ROOT of ['repo', 'mut']) {
  const R = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr4-r3/verify-duo/' + ROOT + '/rex-strength-lab';
  for (const k of Object.keys(require.cache)) delete require.cache[k];
  const P = require(R + '/src/engine.js'); global.window = {}; require(R + '/src/data.js'); const D = window.DINO_DATA, g = P.K.g;
  const R3 = P.makeBody({ build: 'rex', ...P.DEFAULT_BODIES.rex }), O3 = P.makeBody({ build: 'ollie', ...P.DEFAULT_BODIES.ollie }), conc = D.surfaces.find(s => s.id === 'concrete');
  const ON = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
  const c3 = (F, body, x) => Object.assign({ F, mode: 'comic', body, surface: conc, anchor: 'friction' }, ON, x || {});
  const x = P.pushMatch(c3(3500 * g, R3), c3(1000 * g, O3));
  const near = (a, b, t) => Math.abs(a / b - 1) <= t;
  const ledgerL = (R3.m + O3.m) * x.v, ledgerR = (R3.m * x.accel + x.DB - x.HB) * x.t + x.recoilAbsorbedA.J;
  console.log(ROOT, 'atCap', x.v === x.vCap, 'J', x.recoilAbsorbedA.J.toFixed(1), 'formula ok', near(x.recoilAbsorbedA.J, O3.m * x.v + x.HB * x.t, 1e-12), 'wOk ledger L', ledgerL.toFixed(0), 'R', ledgerR.toFixed(0), 'ledger with R3.m*v', ((R3.m * x.v) + (x.DB - x.HB) * x.t + x.recoilAbsorbedA.J).toFixed(0));
}
