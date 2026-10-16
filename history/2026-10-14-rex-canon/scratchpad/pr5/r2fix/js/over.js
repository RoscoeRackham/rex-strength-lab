global.window = {};
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js'); require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const R3 = P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex)), O3 = P.makeBody(Object.assign({ build: 'ollie' }, P.DEFAULT_BODIES.ollie));
const conc = D.surfaces.find((s) => s.id === 'concrete'), obj = (id) => D.objects.find((o) => o.id === id);
const c9 = (F, body) => ({ F, mode: 'comic', body: body || R3, surface: conc, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, safePassenger: true, noKnockback: true });
const t0 = Date.now();
for (const id of ['baseball']) for (const D0 of [Math.pow(10, 5), Math.pow(10, 5.5)]) for (let e = 8; e <= 16; e++) {
  const cR = c9(Math.pow(10, e) * g), cO = c9(Math.pow(10, e) * g, O3), L = P.catchLeg(cR, cO, obj(id), D0, 'hard');
  if (!L.catch) { console.log(id, D0, e, L.result); continue; }
  const tb = P.RESTRAINT.takenBack('catch', { a: L }, { A: cR, B: cO, whoA: 'rex', obj: obj(id) });
  console.log(id, D0.toPrecision(3), e, L.result, 'fast', !!L.fast, 'drag', tb.parts.drag.toPrecision(4), 'catch', tb.parts.catch.toPrecision(6), 'hArr?', L.hStop, L.h0);
}
console.log((Date.now() - t0) + ' ms');
