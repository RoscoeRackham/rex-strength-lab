// load a mutated engine from a temp copy and compare a case: node mutcase.js
const fs = require('fs'), path = require('path');
const SRC = path.join(__dirname, '..', 'repo', 'rex-strength-lab', 'src');
const mk = (name, find, rep) => { const s = fs.readFileSync(path.join(SRC, 'engine.js'), 'utf8'); if (s.split(find).length !== 2) throw new Error('find ' + name); const p = path.join(SRC, '..', '..', '..', 'tmp-' + name + '.js'); fs.writeFileSync(p, s.replace(find, rep)); return p; };
global.window = {}; require(path.join(SRC, 'data.js')); const D = window.DINO_DATA;
const P = require(path.join(SRC, 'engine.js'));
const PM32 = require(mk('n32', 'tbPE(obj.m, f.belowStop ? 0 : hEnd)', 'tbPE(obj.m, hEnd)'));
const PM18 = require(mk('n18', 'Math.max(0, Math.min(E1, f0.air.E))', 'f0.air.E'));
const PM25 = require(mk('n25', "if (s > 0) add(whoT, 'drag', tbDrag(s * realAirLeg", "if (s > 0) add(whoC, 'drag', tbDrag(s * realAirLeg"));
const g = P.K.g, obj = (id) => D.objects.find((x) => x.id === id), surf = D.surfaces.find((s) => s.id === 'concrete');
const DEF = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, safePassenger: true, noKnockback: true };
const ctx = (Q, F, body, x) => Object.assign({ F, mode: 'comic', body, surface: surf, anchor: 'friction' }, DEF, x || {});
const sig = (x) => Number(x).toPrecision(4);
for (const [nm, Q] of [['engine', P], ['N32 mutant', PM32], ['N25 mutant', PM25]]) {
  const R = Q.makeBody(Object.assign({ build: 'rex' }, Q.DEFAULT_BODIES.rex)), O = Q.makeBody({ build: 'ollie', H: 10, m: 3000 });
  const A = ctx(Q, 100 * 907.18474 * g, R, { ownRecoil: false }), B = ctx(Q, 100 * 907.18474 * g, O, { ownRecoil: false });
  const L = Q.catchLeg(A, B, obj('car'), 10, 'easy'), tb = Q.RESTRAINT.takenBack('catch', { a: L }, { A, B, whoA: 'rex', obj: obj('car') });
  console.log(nm, '| Ollie 10 m tall, a car lobbed 10 m, own recoil off:', L.result, 'drag', sig(tb.parts.drag), 'rex', sig(tb.by.rex.E), 'ollie', sig(tb.by.ollie.E));
}
for (const [nm, Q] of [['engine', P], ['N18 mutant', PM18]]) {
  const R = Q.makeBody(Object.assign({ build: 'rex' }, Q.DEFAULT_BODIES.rex)), c = ctx(Q, Math.pow(10, 16.5) * g, R), ob = obj('tank'), r = Q.throwObject(c, ob, 45);
  const tb = Q.RESTRAINT.takenBack('throw', r, Object.assign({}, c, { obj: ob, angle: 45 }));
  const E1 = Q.keFromV(r.vOut, ob.m) + ob.m * (Q.K.GM / Q.K.R_E - Q.K.GM / (Q.K.R_E + R.releaseHeight));
  console.log(nm, '| a tank at 45 deg, 10^16.5 kg, all-out:', 'v', sig(r.v), 'drag', sig(tb.parts.drag), 'E1', sig(E1), 'ratio', (tb.parts.drag / E1).toFixed(5));
}
