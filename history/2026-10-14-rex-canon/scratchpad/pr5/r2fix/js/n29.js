// N29 (tbDrag without its arrive === Infinity guard): where does a drag part meet an unbounded arrival?
global.window = {};
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js'); require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const R3 = P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex)), O3 = P.makeBody(Object.assign({ build: 'ollie' }, P.DEFAULT_BODIES.ollie));
const conc = D.surfaces.find((s) => s.id === 'concrete'), obj = (id) => D.objects.find((o) => o.id === id);
const c9 = (F, body, x) => Object.assign({ F, mode: 'comic', body: body || R3, surface: conc, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, safePassenger: true, noKnockback: true, silentStrike: true, softLanding: true }, x || {});
const TB = P.RESTRAINT.takenBack;
const pr = (l, tb) => console.log(l, JSON.stringify(tb.parts), JSON.stringify(tb.by.rex.parts), JSON.stringify(tb.by.ollie.parts));
const ci = c9(Infinity), oi = c9(Infinity, O3);
for (const id of ['baseball', 'car', 'person']) for (const st of ['hard', 'easy']) {
  const a = P.catchLeg(ci, oi, obj(id), 10, st); pr('catch ' + id + ' ' + st + ' ' + a.result, TB('catch', { a, b: a }, { A: ci, B: oi, whoA: 'rex', obj: obj(id) }));
}
for (const st of ['hard', 'easy']) { const t = P.tossPartner(ci, O3, 'Ollie', st, 10, 'friction'); pr('toss ' + st + ' ' + t.result, TB('toss', t, { A: ci, B: oi, whoA: 'rex' })); }
const w = P.throwPartner(ci, oi, 45); pr('wrestle', TB('wrestleThrow', w, { A: ci, B: oi, whoA: 'rex', angle: 45 }));
const t = P.throwObject(ci, obj('person'), 45); pr('throw person', TB('throw', t, Object.assign({}, ci, { obj: obj('person'), angle: 45 })));
