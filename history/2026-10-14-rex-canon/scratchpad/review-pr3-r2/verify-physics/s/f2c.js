const R='/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr3-r2/verify-physics/repo/rex-strength-lab';
const P = require(R+'/src/engine.js'); global.window = {}; require(R+'/src/data.js'); const D = window.DINO_DATA;
const o = D.objects.find(x=>x.passenger), g = P.K.g;
const surface = D.surfaces.find(s => s.id === 'concrete');
const mk = (b, lk, air) => ({ F: Math.pow(10, lk)*g, mode: 'comic', body: P.makeBody({ build: b, ...P.DEFAULT_BODIES[b] }), surface, anchor: 'friction', airAbsorb: air, keepForm: true, unbreakable: true, ownRecoil: true, safePassenger: true });
for (const [lk, ld, air] of [[8, 2, 0], [Math.log10(100*907.18474), 1, 1], [Math.log10(100*907.18474), 1, 0]]) {
  const cR = mk('rex', lk, air), cO = mk('ollie', lk, air);
  const Dd = Math.max(P.catchMinD(cR.body, cO.body, o), Math.pow(10, ld));
  const a = P.catchLeg(cR, cO, o, Dd, 'hard');
  console.log('lk', lk.toFixed(2), 'D', Dd.toFixed(1), 'air', air, 'result', a.result, 'aim', JSON.stringify(a.aim), 'miss', JSON.stringify(a.miss));
  // rebuild the miss flight: flight(obj, vE, th, h0, 0) not exported? use flyTo/flight
}
console.log(Object.keys(P).filter(k=>/fl(y|ight)/i.test(k)));
