const R='/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr2-r2/verify-physics/repo/rex-strength-lab';
const P = require(R+'/src/engine.js'); global.window = {}; require(R+'/src/data.js'); const D = window.DINO_DATA;
const body = P.makeBody({ build: 'rex', ...P.DEFAULT_BODIES.rex });
const surface = D.surfaces.find(s => s.id === 'concrete');
const F = 90718.474 * P.K.g;
const objs = D.objects || D.throwables || [];
console.log('objects key', Object.keys(D).filter(k=>Array.isArray(D[k])).join(','));
const all = (D.objects||[]);
for (const o of all) {
  const ctx = { F, mode: 'comic', body, surface, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, groundHolds: false };
  let p; try { p = P.RESTRAINT.planNow('pull', ctx, { obj: o, target: 10, near: 5 }); } catch (e) { console.log(o.id, 'err', e.message); continue; }
  const g = p.goal();
  const uses = [['least', g.use], ['allout', Infinity]];
  for (const [name, u] of uses) {
    const r = p.run(u === Infinity ? p.hi : u);
    if (!r.canMove || !r.recoilAbsorbed) { console.log(o.id, name, 'no move'); continue; }
    const J = r.recoilAbsorbed.J, gr = r.resist * r.t10m;
    console.log(o.id.padEnd(14), name.padEnd(6), 'crr', o.crr, 'use kgf', (u===Infinity?p.hi:u)/P.K.g|0, 'J', J.toFixed(0), 'resist*t', gr.toFixed(0), 'share', (gr/J*100).toFixed(1)+'%', 't', r.t10m.toFixed(2));
  }
}
