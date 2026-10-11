global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const g = P.K.g, c = P.K.c;
const surf = D.surfaces.find(s=>s.id==='concrete');
const defB = () => P.makeBody({H: P.DEFAULT_BODIES.rex.H, m: P.DEFAULT_BODIES.rex.m});
const defO = () => P.makeBody({H: P.DEFAULT_BODIES.ollie.H, m: P.DEFAULT_BODIES.ollie.m, build:'ollie'});
const objs = D.objects.filter(o => !o.noThrow && o.m >= 400);
let n=0, res={}, bad=[];
const t0 = Date.now();
for (const o of objs) for (let lk = 8; lk <= 24; lk += 2) for (const Dd of [100, 1e4, 1e5, 1e6]) for (const anc of ['friction','bolted']) {
  const mk = (b) => ({ F: Math.pow(10, lk) * g, mode: 'comic', body: b, surface: surf, groundHolds: false, anchor: anc });
  let r; try { r = P.catchLeg(mk(defB()), mk(defO()), o, Dd, 'hard'); } catch (e) { bad.push(['ERR', o.id, lk, Dd, anc, e.message]); continue; }
  n++; const key = r.result + (r.relativistic ? '-rel' : ''); res[key] = (res[key]||0)+1;
  if (r.result === 'fireball' && !(r.vL >= 0.01*c*0.999)) bad.push(['fireball<1%c', o.id, lk, Dd, anc, r.vL]);
  if (r.result === 'overshoots' && r.relativistic && !(r.vL >= 0.01*c*0.999)) bad.push(['relOvershoot<1%c', o.id, lk, Dd, anc, r.vL]);
  if (r.result === 'overshoots' && !r.relativistic && r.vL >= 0.01*c) bad.push(['overshoot rel speed but not flagged', o.id, lk, Dd, anc, r.vL]);
  if (r.fireball && (isNaN(r.fireball.E) || isNaN(r.fireball.Eblast))) bad.push(['NaN fb', o.id, lk, Dd, anc]);
}
console.log('n', n, 'ms', Date.now()-t0, JSON.stringify(res));
console.log(bad.slice(0,30).map(x=>JSON.stringify(x)).join('\n'), bad.length);
