const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
global.window = {}; require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js'); const D = window.DINO_DATA;
const K = P.K;
const bR = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const bO = P.makeBody({ build: 'ollie', H: 3.06, m: 3007 });
const surface = D.surfaces.find(s => s.id === 'concrete');
const mk = (body, share, kg, anchor) => ({ F: kg * K.g, mode: 'comic', body, surface, anchor: anchor || 'friction', airAbsorb: share, keepForm: true, unbreakable: true, ownRecoil: true });
for (const kg of [1e15, 1e20, 1e23, 1e26, 1e30]) for (const anchor of ['friction', 'bolted']) {
  const o = D.objects.find(x => x.id === 'baseball');
  const L = P.catchLeg(mk(bR, 1, kg), mk(bO, 1, kg, anchor), o, 1000, 'hard');
  const k = L.catch;
  const r = P.throwObject(Object.assign({}, mk(bR, 1, kg), { noFlight: true }), o, L.aim ? L.aim.thetaDeg : 0);
  const pExact = Math.sqrt(r.Eobj * r.Eobj + 2 * r.Eobj * o.m * K.c * K.c) / K.c;
  console.log(kg, anchor, L.result, 'vArr/c', L.vArrive / K.c, 'Eobj', r.Eobj.toExponential(4), 'pExact', pExact.toExponential(4), 'catch pIn', k && k.pIn && k.pIn.toExponential(4), 'Ecatch', k && k.Ecatch && k.Ecatch.toExponential(4), 'E1+E2?', k && (k.E1).toExponential(3), 'carried', k && k.carried, 'uAfter/c', k && k.uAfter / K.c, 'Enear', k && k.Enear && k.Enear.toExponential(3), 'toGroundC', JSON.stringify(L.toGroundC), 'time', L.time, 'chord', L.chord, 'hits', !!L.hitsGround);
}
