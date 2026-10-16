const fs = require('fs'), path = require('path');
const SRC = path.join(__dirname, '..', 'repo', 'rex-strength-lab', 'src');
let s = fs.readFileSync(path.join(SRC, 'engine.js'), 'utf8');
const rep = (a, b) => { if (s.split(a).length !== 2) throw new Error('anchor ' + a); s = s.replace(a, b); };
// the fix: the count-once comparison against the arrival's whole kinetic energy (same convention as the real-air figure), and a float tolerance
rep("const tbDrag = (x, arrive) => (!(x > 0) || arrive === Infinity ? 0 : x === Infinity ? Infinity : Math.max(0, x - arrive));",
    "const tbDrag = (x, arrive) => (!(x > 0) || arrive === Infinity ? 0 : x === Infinity ? Infinity : x - arrive <= 1e-9 * x ? 0 : x - arrive);");
rep("} else if (reaches && C.ownRecoil && L.catch) arrive = add(whoC, 'catch', L.catch.Ecatch);",
    "} else if (reaches && C.ownRecoil && L.catch) { add(whoC, 'catch', L.catch.Ecatch); arrive = Math.max(tbJ(L.catch.Ecatch), L.vArrive > 0 ? keFromV(L.vArrive, ob.m) : 0); }");
const p = path.join(__dirname, 'tmp-fix-engine.js'); fs.writeFileSync(p, s);
global.window = {}; require(path.join(SRC, 'data.js')); const D = window.DINO_DATA;
const P0 = require(path.join(SRC, 'engine.js')), P1 = require(p);
const g = P0.K.g, obj = (id) => D.objects.find((x) => x.id === id), surf = D.surfaces.find((x) => x.id === 'concrete');
const DEF = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, safePassenger: true, noKnockback: true };
for (const [id, D0, kg] of [['baseball', 10, 1e14], ['baseball', 1000, 1e13], ['person', Math.pow(10, 4.5), 1e12], ['baseball', 300, 1e8], ['car', 1e4, 1e9]]) {
  const row = [id, D0, kg];
  for (const Q of [P0, P1]) {
    const R = Q.makeBody(Object.assign({ build: 'rex' }, Q.DEFAULT_BODIES.rex)), O = Q.makeBody(Object.assign({ build: 'ollie' }, Q.DEFAULT_BODIES.ollie));
    const A = Object.assign({ F: kg * g, mode: 'comic', body: R, surface: surf, anchor: 'friction' }, DEF), B = Object.assign({}, A, { body: O });
    const a = Q.catchLeg(A, B, obj(id), D0, 'hard'), b = Q.catchLeg(B, A, obj(id), D0, 'hard'), tb = Q.RESTRAINT.takenBack('catch', { a, b }, { A, B, whoA: 'rex', obj: obj(id) });
    row.push('drag ' + tb.parts.drag.toPrecision(3) + ' catch ' + tb.parts.catch.toPrecision(4));
  }
  console.log(row.join(' | '));
}
fs.unlinkSync(p);
