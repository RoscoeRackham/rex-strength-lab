const { P, D, g, surf, obj, rex, ollie, cal, big, ctxOf } = require('./h.js');
const person = obj('person');
console.log('person', JSON.stringify(person));
for (const [F, tgt] of [[90718.474 * g, 30], [90718.474 * g, 10], [90718.474*g, 100]]) {
  const c = ctxOf(F);
  const p = P.RESTRAINT.planNow('throw', c, { obj: person, angle: 45, target: tgt });
  const u = p.goal().use;
  const r = p.run(u);
  const Fpush = Math.min(r.Fdrive, r.push && r.push.Fcap || Infinity);
  const peakA = (r.F - r.mB * g * Math.sin(Math.PI / 4)) / r.mB / g;
  console.log('target', tgt, 'basis', r.basis || 'comic', 'use kg', (u / g).toFixed(0), 'v', r.v.toFixed(2), 't', r.push.t.toFixed(3), 'launchG(mean)', r.launchG.toFixed(2), 'felt(mean)', P.PASSENGER.felt(r.launchG, 45).toFixed(2), 'peak a (F-RB)/mB', peakA.toFixed(2), 'felt(peak)', P.PASSENGER.felt(peakA, 45).toFixed(2), 'heldBack', r.heldBack, 'noHarm', P.PASSENGER.noHarm(r.push.t), 'injury', P.PASSENGER.injury(r.push.t).toFixed(1));
}
