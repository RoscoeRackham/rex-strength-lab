const { P, D, g, surf, obj, rex, ollie, cal, big, ctxOf } = require('./h.js');
const person = obj('person');
const c = ctxOf(90718.474 * g);
const p = P.RESTRAINT.planNow('throw', c, { obj: person, angle: 45, target: 30 });
const ce = p.ceiling();
console.log('ceiling', ce.by, (ce.below / g).toFixed(0), 'kg');
for (const u of [ce.below, p.goal().use]) {
  const r = p.run(u);
  // peak: the push at the start of the stroke (Hill force at zero speed), net of the along-throw weight component
  const aPeak = (r.F - r.mB * g * Math.sin(Math.PI / 4)) / r.mB / g;
  console.log('use', (u / g).toFixed(0), 'kg basis', r.basis || 'comic', 'mean launchG', r.launchG.toFixed(2), 'felt(mean)', P.PASSENGER.felt(r.launchG, 45).toFixed(2), 'felt(start of push)', P.PASSENGER.felt(aPeak, 45).toFixed(2), 'push time', r.launchT.toFixed(3), 'noHarm', P.PASSENGER.noHarm(r.launchT).toFixed(2), 'Eiband', P.PASSENGER.injury(r.launchT).toFixed(1));
}
// numerically integrate the Hill push to get the true peak acceleration of the person (re-run pushApart with a fine record)
