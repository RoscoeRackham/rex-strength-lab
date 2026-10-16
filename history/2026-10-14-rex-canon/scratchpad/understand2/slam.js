const { P, g, sig, rex, ollie, ctx, ppv, ob, F0, sf } = require('./h.js');
for (const anchor of ['friction', 'bolted']) for (const ex of [{}, { ownRecoil: false }]) {
  const cR = ctx(Object.assign({ F: 1e9 * g }, ex)), cO = ctx(Object.assign({ F: 1e3 * g, anchor }, ex), ollie);
  const L = P.catchLeg(cR, cO, ob('car'), 30, 'hard'); const k = L.catch;
  if (!k) { console.log(anchor, JSON.stringify(ex), L.result); continue; }
  const pIn = P.vToMomentum(L.vArrive, ob('car').m);
  console.log(anchor, JSON.stringify(ex), L.result, 'vArrive', sig(L.vArrive), 'pIn', sig(pIn), 'uAfter', sig(k.uAfter), '(M+m)u', sig((ollie.m + ob('car').m) * k.uAfter), 'slide', sig(k.slide), 'vSlam', sig(k.vSlam), 'toGroundC', L.toGroundC && sig(L.toGroundC.J), 'carried', k.carried, 'rel', !!k.relativistic);
}
