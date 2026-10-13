const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
global.window = {}; require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js'); const D = window.DINO_DATA;
const K = P.K;
const body = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const surface = D.surfaces.find(s => s.id === 'concrete');
const M = P.RESTRAINT.MOVES.throw;
for (const [id, angle, vt] of [['pyramid', 90, 15000], ['pyramid', 90, 30000], ['esb', 90, 20000], ['everest', 60, 20000], ['shuttle', 90, 20000]]) {
 const o = D.objects.find(x => x.id === id);
 for (const share of [0, 0.5, 0.9]) {
  const c = { F: 1e30 * K.g, mode: 'comic', body, surface, anchor: 'friction', airAbsorb: share, keepForm: true, unbreakable: true, ownRecoil: true };
  let lo=1, hi=1e40; for (let i=0;i<200;i++){const mid=Math.sqrt(lo*hi); const r=P.throwObject(Object.assign({},c,{use:mid}),o,angle); if (r.v<vt) lo=mid; else hi=mid;}
  const r = P.throwObject(Object.assign({}, c, { use: Math.sqrt(lo*hi) }), o, angle);
  const opt = { obj: o, angle, body, surface, airAbsorb: share, keepForm: true, unbreakable: true, ownRecoil: true, near: 30 };
  const bl = M.blast(r, opt);
  // real-air take via a split flight with dragK just under 1
  const f1 = P.fly({ v0: r.vOut, thetaDeg: angle, h0: body.releaseHeight, m: o.m, A: o.area, Cd: o.Cd, CdSup: o.CdSup, dragK: 1 - 1e-9 });
  console.log(id, angle, vt, 'share', share, 'esc', r.flight.escaped, 'Eobj', r.Eobj.toExponential(3), 'flight.air.E', r.flight.air ? r.flight.air.E.toExponential(3) : '-', 'realAirTake', f1.air.E.toExponential(3), 'dragLoss0', r.dragLoss0 && r.dragLoss0.toExponential(3), 'blast', bl.toExponential(3), 'R100Pa', (P.blastRadius(bl,100)/1e3).toFixed(0)+' km', 'R100Pa(k*realTake)', (P.blastRadius((1-share)*f1.air.E || f1.air.E,100)/1e3).toFixed(0)+' km', 'R6.9kPa', (P.blastRadius(bl,6900)/1e3).toFixed(0), (P.blastRadius((1-share)*f1.air.E||f1.air.E,6900)/1e3).toFixed(0));
 }
}
