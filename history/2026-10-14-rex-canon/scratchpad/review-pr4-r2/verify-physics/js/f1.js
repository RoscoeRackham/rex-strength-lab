const { P, g, R3, O3, dial, c3 } = require('./common.js');
const cl = P.K.c;
function run(lab, FO, FR, o, xO, xR, s) {
  const r = P.collide(c3(FO, O3, xO, s), c3(FR, R3, xR, s), o);
  if (r.outcome !== 'carried') { console.log(lab, r.outcome); return; }
  const k = r.carry, sq = r.contact.s;
  const Fs = k.F * sq, KE = 0.5 * R3.m * r.vRel * r.vRel;
  const work = k.F * r.vRel * k.T;
  const during = r.after.splat.during;
  console.log(lab.padEnd(36), 'v', r.vRel.toFixed(3), 'F', (k.F/1e3).toFixed(1)+'kN', 'T', (k.T*1e3).toFixed(2)+'ms', 'hold', (k.hold/1e3).toFixed(1)+'kN', 's', sq.toFixed(4),
    '| Q', r.Q.toFixed(0), 'hitAbs', r.hitAbsorbed.E.toFixed(0), 'F*s', Fs.toFixed(0), 'ratio', (Fs/r.Q).toFixed(3),
    '| source work F v T', work.toFixed(0), '= KE', KE.toFixed(0), '+ hold*during', (k.hold*during).toFixed(0), '+ F*s', Fs.toFixed(0), 'sum', (KE + k.hold*during + Fs).toFixed(0));
  return r;
}
run('sprint all-out', dial, dial, { source: 'sprint' });
run('1 m/s', dial, dial, { source: 'set', gb: 1 / cl });
run('jump, UF off, concrete', dial, dial, { source: 'jump' }, { unbreakable: false }, { unbreakable: false });
run('jump, UF off, granite', dial, dial, { source: 'jump' }, { unbreakable: false }, { unbreakable: false }, 'granite');
run('bolted Rex real rock sprint', dial, dial, { source: 'sprint' }, { unbreakable: false }, { unbreakable: false, anchor: 'bolted' });
// meanIt: Elocal
for (const [lab, xO, xR, s, src] of [['sprint meanIt', {}, {}, 'concrete', 'sprint'], ['jump granite meanIt', { unbreakable: false }, { unbreakable: false }, 'granite', 'jump']]) {
  const r = P.collide(c3(dial, O3, xO, s), c3(dial, R3, xR, s), { source: src, meanIt: true });
  console.log(lab, 'Elocal', r.Elocal.toExponential(4), 'F*s', (r.carry.F * r.contact.s).toExponential(4), 'Eground', r.after.splat.Eground && r.after.splat.Eground.toExponential(4));
}
// compare with the non-carried power-off splatWithFooting convention: Q = F*s
const r0 = P.collide(c3(dial, O3, { ownRecoil: false }), c3(dial, R3, { ownRecoil: false }), { source: 'sprint' });
console.log('power off sprint: Q', r0.Q.toFixed(0), 'F*s', (r0.contact.soft.F * r0.contact.s).toFixed(0), 'partial?', !!r0.partial);
