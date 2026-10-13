const { P, D, g, obj, rex, ollie, ctxOf, sig } = require('./common.js');
const c = P.K.c;
for (const id of ['baseball', 'car']) for (const dial of [1e24, 1e25, 1e26, 1e27, 1e30, Infinity]) {
  const ex = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
  const cR = ctxOf(dial * g, ex), cO = Object.assign({}, cR, { body: ollie, anchor: 'bolted' });
  const b = obj(id);
  const L = P.catchLeg(cR, cO, b, 1000, 'hard');
  const tab = P.catchReleaseTable(cR, b);
  const r = tab.at(L.aim ? L.aim.thetaDeg : 0);
  const E0 = r.Eobj;
  const k = L.catch;
  const pTrue = isFinite(E0) ? Math.sqrt(E0 * E0 + 2 * E0 * b.m * c * c) / c : Infinity;
  console.log(id, 'dial', dial, L.result, 'Eobj', sig(E0), 'tabE0', sig(tab.E0), 'Ecatch', k ? sig(k.Ecatch) : '-', 'ratio', k ? sig(k.Ecatch / E0) : '-', 'pIn', k ? sig(k.pIn) : '-', 'pTrue', sig(pTrue), 'toGroundC', L.toGroundC ? sig(L.toGroundC.J) : '-');
}
