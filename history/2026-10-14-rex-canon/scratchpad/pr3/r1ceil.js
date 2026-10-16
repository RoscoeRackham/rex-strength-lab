global.window = {};
const path = require('path');
const ROOT = process.argv[2] || '/home/user/rex-strength-lab/rex-strength-lab';
const P = require(path.join(ROOT, 'src/engine.js')); require(path.join(ROOT, 'src/data.js')); const D = window.DINO_DATA;
const g = P.K.g, person = D.objects.find((o) => o.id === 'person'), R0 = P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex));
const ON = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, safePassenger: true };
for (const lk of [Math.log10(100 * 907.18474), 9]) for (const s of D.surfaces) {
  const c = Object.assign({ F: Math.pow(10, lk) * g, mode: 'comic', body: R0, surface: s, anchor: 'friction' }, ON);
  const p = P.RESTRAINT.planNow('throw', c, { near: 5, target: 30, obj: person, angle: 45, safePassenger: true, silentStrike: false, softLanding: false });
  const ce = p.ceiling(); const lg0 = P.PASSENGER.landGround(person, 1, s);
  let vC = null; if (ce.by) { const r = p.run(ce.use); vC = r.flight && r.flight.vImpact; }
  const rAll = p.run(undefined);
  console.log(lk.toFixed(2), s.id.padEnd(10), 'ceiling', ce.by || 'none', ce.use ? (ce.use / g).toPrecision(3) : '-', 'landing at ceiling', vC && vC.toFixed(1), 'vBear', lg0.vBear.toFixed(1), vC != null && vC > lg0.vBear ? 'ABOVE' : '', 'allout v', rAll.flight && rAll.flight.vImpact && rAll.flight.vImpact.toFixed(1));
}
