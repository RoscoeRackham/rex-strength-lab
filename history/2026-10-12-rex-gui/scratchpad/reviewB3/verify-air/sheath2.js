const { P, D, g, obj, rex, ollie, ctxOf, sig } = require('./common.js');
const c = P.K.c;
for (const dial of [1e18, 1e20, 1.81e23, 1e26]) {
  const row = [];
  for (const share of [0.01, 0.1, 0.5, 0.9, 0.99]) {
    const ex = { airAbsorb: share, keepForm: true, unbreakable: true, ownRecoil: true };
    const cR = ctxOf(dial * g, ex), cO = Object.assign({}, cR, { body: ollie, anchor: 'bolted' });
    const L = P.catchLeg(cR, cO, obj('baseball'), 1000, 'hard');
    if (!L.sheath) { row.push(share + ':' + L.result); continue; }
    const E0 = L.sheath.E / L.sheath.share;
    row.push(share + ':sheath Ecatch/E=' + sig(L.catch.Ecatch / E0));
  }
  console.log('dial', dial, row.join('  '));
}
