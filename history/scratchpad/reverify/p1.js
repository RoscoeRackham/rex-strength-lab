global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const g = P.K.g;
const obj = (id) => D.objects.find((o) => o.id === id);
const surf = D.surfaces.find(s=>s.id==='concrete');
const mk = (logKg, anchor, body) => ({ F: Math.pow(10, logKg) * g, mode: 'comic', body: body || P.makeBody({}), surface: surf, groundHolds: false, anchor });
for (const [id, lk] of [['car',22],['pyramid',30],['baseball',16]]) for (const anc of ['bolted','friction']) {
  console.log('==', id, lk, anc);
  let prev = null;
  for (const Dd of [1e5,3e4,14500,5000,1000,300,100,30,10]) {
    let r; try { r = P.catchLeg(mk(lk,'bolted'), mk(lk, anc), obj(id), Dd, 'hard'); } catch(e) { console.log(Dd, 'ERR', e.message); continue; }
    const f = r.fireball;
    if (!f) { console.log(Dd, r.result); continue; }
    console.log(Dd, r.result, f.kind, 'E', f.E.toExponential(3), 'Egap', f.Egap.toExponential(3), 'Ehere', f.Ehere.toExponential(3), 'Enear', f.Enear.toExponential(3), 'Eblast', f.Eblast.toExponential(3), 'Ecarry', f.Ecarry.toExponential(3), 'sum', ((f.Ehere+f.Ecarry)/f.E).toFixed(6));
  }
}
