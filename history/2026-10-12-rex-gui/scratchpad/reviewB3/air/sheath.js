const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
global.window = {}; require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js'); const D = window.DINO_DATA;
const K = P.K;
const bR = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const bO = P.makeBody({ build: 'ollie', H: 3.06, m: 3007 });
const surface = D.surfaces.find(s => s.id === 'concrete');
const mk = (body, share, kg, anchor) => ({ F: kg * K.g, mode: 'comic', body, surface, anchor: anchor || 'friction', airAbsorb: share, keepForm: true, unbreakable: true, ownRecoil: true });
for (const kg of [1e18, 1e20, 1.81e23]) for (const share of [0.99, 0.999, 0.9999, 1]) for (const anchor of ['bolted', 'friction']) for (const Dd of [1000]) {
  const o = D.objects.find(x => x.id === 'baseball');
  const L = P.catchLeg(mk(bR, share, kg), mk(bO, share, kg, anchor), o, Dd, 'hard');
  const k = L.catch;
  const r = P.throwObject(Object.assign({}, mk(bR, share, kg), { noFlight: true }), o, L.aim ? L.aim.thetaDeg : (L.thetaDeg || 0));
  const fb = L.sheath;
  console.log(kg.toExponential(2), share, anchor, Dd, L.result, 'Eobj', r.Eobj.toExponential(3), 'sheath E', fb && fb.E.toExponential(3), 'sheath share', fb && fb.share.toExponential(2), 'vArr/c', L.vArrive && (L.vArrive / K.c), 'Ecatch', k && k.Ecatch.toExponential(3), 'Ecatch/Eobj', k && (k.Ecatch / r.Eobj).toExponential(3), 'pIn', k && k.pIn && k.pIn.toExponential(3), 'p true', (Math.sqrt(r.Eobj ** 2 + 2 * r.Eobj * o.m * K.c ** 2) / K.c).toExponential(3), 'carried', k && k.carried);
}
