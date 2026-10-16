const { P, g, sig, rex, ollie, ctx, ppv, ob, F0, sf } = require('./h.js');
for (const [label, ex] of [['air 0.5, all else on', { airAbsorb: 0.5 }], ['air 0.5, ownRecoil only', { airAbsorb: 0.5, unbreakable: false, keepForm: false }], ['air 0 all else on', { airAbsorb: 0 }]]) for (const D of [1000, 30]) {
  const cR = ctx(Object.assign({ F: 1e20 * g }, ex)), cO = ctx(Object.assign({ F: 1e20 * g }, ex), ollie);
  const L = P.catchLeg(cR, cO, ob('baseball'), D, 'hard');
  console.log(label, D, L.result, 'th', sig(L.thetaDeg), 'toGroundT', L.toGroundT && sig(L.toGroundT.J), 'recoil.v', L.recoil && sig(L.recoil.v), 'fb.kind', L.fireball && L.fireball.kind, 'fb.p', L.fireball && sig(L.fireball.p), 'push', L.fireball && JSON.stringify(L.fireball.push), 'Ecarry', L.fireball && sig(L.fireball.Ecarry), 'kept', L.kept, 'sheath', !!L.sheath, 'catch', L.catch && L.catch.carried);
}
