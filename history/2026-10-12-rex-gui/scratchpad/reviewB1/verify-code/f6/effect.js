global.window = {};
const B = process.argv[2], M = process.argv[3];
require(B + '/src/data.js'); const D = window.DINO_DATA;
const Pb = require(B + '/src/engine.js');
const Pm = {};
for (const n of ['mA', 'mD', 'mF']) { Pm[n] = require(M + '/' + n + '.js'); }
const surf = D.surfaces.find((s) => s.id === 'concrete'), obj = (id) => D.objects.find((o) => o.id === id);
const OFF = { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false };
const ctx = (P, kg, x) => Object.assign({ F: kg * P.K.g, mode: 'comic', body: P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), surface: surf, anchor: 'friction' }, OFF, x || {});
// mA: catch fireball E
for (const kg of [1e16, 1e20, 1e23]) {
  const a = Pb.catchLeg(ctx(Pb, kg), ctx(Pb, kg, { body: Pb.makeBody({ build: 'ollie', H: 3.048, m: 3007 }) }), obj('baseball'), 30, 'hard');
  const b = Pm.mA.catchLeg(ctx(Pm.mA, kg), ctx(Pm.mA, kg, { body: Pm.mA.makeBody({ build: 'ollie', H: 3.048, m: 3007 }) }), obj('baseball'), 30, 'hard');
  console.log('mA catch baseball hard 30 m', kg, 'kg:', a.result, a.fireball && a.fireball.E.toPrecision(15), 'vs mutant', b.result, b.fireball && b.fireball.E.toPrecision(15));
}
// mD: toss
for (const lg of [14.5, 14.75, 15]) {
  const kg = Math.pow(10, lg);
  const a = Pb.tossPartner(ctx(Pb, kg), Pb.makeBody({ build: 'ollie', H: 3.048, m: 3007 }), 'Ollie', 'hard', 10, 'friction');
  const b = Pm.mD.tossPartner(ctx(Pm.mD, kg), Pm.mD.makeBody({ build: 'ollie', H: 3.048, m: 3007 }), 'Ollie', 'hard', 10, 'friction');
  console.log('mD toss hard', lg, ':', a.result, (a.v / Pb.K.c).toFixed(4) + 'c', 'vs mutant', b.result);
}
// mF: throw blast for a relativistic level baseball at 1e20
{
  const kg = 1e20;
  const rb = Pb.throwObject(ctx(Pb, kg), obj('baseball'), 0), rm = Pm.mF.throwObject(ctx(Pm.mF, kg), obj('baseball'), 0);
  const o = Object.assign({ obj: obj('baseball'), angle: 0, surface: surf, body: ctx(Pb, kg).body, anchor: 'friction' }, OFF);
  console.log('mF blast level baseball 1e20 kg:', Pb.RESTRAINT.MOVES.throw.blast(rb, o).toPrecision(4), 'vs mutant', Pm.mF.RESTRAINT.MOVES.throw.blast(rm, o).toPrecision(4));
}
