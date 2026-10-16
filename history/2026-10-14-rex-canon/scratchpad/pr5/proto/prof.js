global.window = {};
const M = '/home/user/rex-strength-lab/rex-strength-lab';
const P = require(M + '/src/engine.js'); require(M + '/src/data.js');
const D = window.DINO_DATA, g = P.K.g, TB = P.RESTRAINT.takenBack;
const sf = (id) => D.surfaces.find((s) => s.id === id), obj = (id) => D.objects.find((o) => o.id === id);
const R3 = P.makeBody({ build: 'rex', ...P.DEFAULT_BODIES.rex }), O3 = P.makeBody({ build: 'ollie', ...P.DEFAULT_BODIES.ollie });
const OFF9 = { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false, safePassenger: false, silentStrike: false, softLanding: false, noKnockback: false };
const c9 = (F, body, x) => Object.assign({ F, mode: 'comic', body: body || R3, surface: sf('concrete'), anchor: 'friction' }, x || {});
const dial = 100 * 907.18474 * g;
const T = {};
const tm = (k, f) => { const t = Date.now(); const r = f(); T[k] = (T[k] || 0) + Date.now() - t; return r; };
for (const pw of [{ airAbsorb: 1 }, { ownRecoil: true }, {}]) for (const F of [dial, 1e9 * g, 1e16 * g]) {
  const c = c9(F, R3, Object.assign({}, OFF9, pw)), co = c9(F, O3, Object.assign({}, OFF9, pw));
  for (const [id, th] of [['car', 45], ['person', 45], ['baseball', 90]]) tm('throw ' + id, () => P.throwObject(c, obj(id), th));
  tm('jump', () => P.jump(c)); tm('stomp', () => P.stomp(c)); tm('wrestle', () => P.throwPartner(c, co, 45));
  for (const [id, D0, st] of [['baseball', 10, 'hard'], ['car', 10, 'easy'], ['person', 31.6e3, 'hard']]) tm('catch ' + id + st + F.toExponential(0), () => [P.catchLeg(c, co, obj(id), D0, st), P.catchLeg(co, c, obj(id), D0, st)]);
  for (const st of ['easy', 'hard']) tm('toss ' + st, () => P.tossPartner(c, O3, 'Ollie', st, 10, 'friction'));
  for (const o of [{ source: 'sprint' }, { source: 'jump' }]) tm('collide ' + o.source, () => P.collide(co, c, o));
}
console.log(Object.entries(T).sort((a, b) => b[1] - a[1]).slice(0, 12));
