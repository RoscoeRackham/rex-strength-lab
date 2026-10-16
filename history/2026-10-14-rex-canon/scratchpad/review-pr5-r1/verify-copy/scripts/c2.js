const L='/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr5-r1/verify-copy/repo/rex-strength-lab';
const P = require(L+'/src/engine.js'); global.window = {}; require(L+'/src/data.js'); const D = window.DINO_DATA, g = P.K.g;
const mk = (o) => Object.assign({ F: 100 * 907.18474 * g, mode: 'comic', body: P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex)), surface: D.surfaces.find((x) => x.id === 'concrete'), anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, safePassenger: true, noKnockback: true }, o || {});
const O = () => P.makeBody(Object.assign({ build: 'ollie' }, P.DEFAULT_BODIES.ollie));
const gb = 0.001 / Math.sqrt(1 - 1e-6);
for (const rec of [true, false]) {
  const A = mk({ body: O(), ownRecoil: rec }), B = mk({ ownRecoil: rec });
  const r = P.collide(A, B, { source: 'set', gb });
  const t = P.RESTRAINT.takenBack('collide', r, { A, B, whoA: 'ollie' });
  console.log('ownRecoil', rec, 'outcome', r.outcome, 'E', t.E.toExponential(3), 'parts', JSON.stringify(Object.fromEntries(Object.entries(t.parts).filter(([k,v])=>v>0).map(([k,v])=>[k,v.toExponential(3)]))));
}
// game of catch: a car lobbed 10 m, ownRecoil on/off
const obj = (id) => D.objects.find((x) => x.id === id);
for (const rec of [true, false]) {
  const A = mk({ownRecoil: rec}), B = mk({ body: O(), ownRecoil: rec }), la = P.catchLeg(A, B, obj('car'), 10, 'easy');
  const t = P.RESTRAINT.takenBack('catch', { a: la, b: la }, { A, B, whoA: 'rex', obj: obj('car') });
  console.log('catch ownRecoil', rec, la.result, 'E', t.E, JSON.stringify(t.parts));
}
// Each switch alone (others off): which takes what in collide 0.1% c and the catch
const OFF = { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false, safePassenger: false, noKnockback: false, silentStrike: false, softLanding: false };
const A = mk(Object.assign({ body: O() }, OFF, { ownRecoil: true })), B = mk(Object.assign({}, OFF, { ownRecoil: true }));
const r = P.collide(A, B, { source: 'set', gb }); const t = P.RESTRAINT.takenBack('collide', r, { A, B, whoA: 'ollie' });
console.log('collide, ownRecoil alone:', r.outcome, t.E.toExponential(3), 'rex', t.by.rex.E.toExponential(3), 'ollie', t.by.ollie.E.toExponential(3));
