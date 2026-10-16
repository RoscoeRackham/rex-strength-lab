const lab = process.argv[2];
const P = require(lab + '/src/engine.js'); global.window = {}; require(lab + '/src/data.js'); const D = window.DINO_DATA;
const g = P.K.g, person = D.objects.find((o) => o.id === 'person'), M = P.RESTRAINT.MOVES;
const body = P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex)), conc = D.surfaces.find((s) => s.id === 'concrete');
const cOf = (logKg, x) => Object.assign({ F: (logKg === Infinity ? Infinity : Math.pow(10, logKg)) * g, mode: 'comic', body, surface: conc, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, safePassenger: true }, x || {});
for (const lk of [5, 9.15, 12, 14, 16, 18, 20, Infinity]) for (const x of [{}, { airAbsorb: 0 }, { airAbsorb: 0, keepForm: false }]) {
  const c = cOf(lk, x), r = P.throwObject(c, person, 45), f = r.flight || {};
  const pl = M.throw.passengerLanding(r, { obj: person, safePassenger: true });
  console.log('10^' + lk, JSON.stringify(x), 'v', r.v && r.v.toPrecision(3), 'landed', f.landed, 'rel', f.relativistic, 'esc', f.escaped, 'vImp', f.vImpact && f.vImpact.toPrecision(3), 'Eimp', r.Eimpact && r.Eimpact.toPrecision(3), 'stagT', f.maxStagT && f.maxStagT.toPrecision(3), 'pl', pl && pl.absorbed.toPrecision(3));
}
