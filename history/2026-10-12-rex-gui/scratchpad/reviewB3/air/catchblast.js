const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
global.window = {}; require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js'); const D = window.DINO_DATA;
const K = P.K;
const bR = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const bO = P.makeBody({ build: 'ollie', H: 3.06, m: 3007 });
const surface = D.surfaces.find(s => s.id === 'concrete');
const mk = (body, share, kg) => ({ F: kg * K.g, mode: 'comic', body, surface, anchor: 'friction', airAbsorb: share, keepForm: true, unbreakable: true, ownRecoil: true });
for (const [id, kg] of [['baseball', 1e5], ['baseball', 1e7], ['car', 1e7], ['car', 1e9], ['bus', 1e9]]) for (const Dd of [30, 300, 3000]) for (const style of ['hard']) {
  const o = D.objects.find(x => x.id === id);
  const res = [];
  for (const share of [0, 0.5, 0.9]) {
    const L = P.catchLeg(mk(bR, share, kg), mk(bO, share, kg), o, Dd, style);
    const k = 1 - share;
    const Eair = L.aim && L.aim.vL >= K.a0 && L.drag ? k * (L.drag.E || 0) : 0;
    res.push({ share, result: L.result, vL: L.aim && L.aim.vL, dragE: L.drag && L.drag.E, blastAir: Eair, hand: L.hand && L.hand.E, vArr: L.vArrive });
  }
  const b0 = res[0].blastAir;
  console.log(id, kg, Dd, style, res.map(r => `share ${r.share}: ${r.result} vL ${r.vL && r.vL.toFixed(0)} vArr ${r.vArr && r.vArr.toFixed(0)} dragE ${r.dragE && r.dragE.toExponential(3)} blastAir ${r.blastAir.toExponential(3)} (${b0 > 0 ? (r.blastAir / b0).toFixed(3) : '-'} of 0%) hand ${r.hand && r.hand.toExponential(2)}`).join(' | '));
}
