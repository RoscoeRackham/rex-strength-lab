const R='/home/user/rex-strength-lab/rex-strength-lab/';
const P = require(R+'src/engine.js'); global.window = {}; require(R+'src/data.js'); const D = window.DINO_DATA;
console.log(D.surfaces.map(s=>s.id).join(' '));
const mk = (kg, sid, pw) => ({ F: kg * P.K.g, mode: 'comic', body: P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), surface: D.surfaces.find(s => s.id === sid), anchor: 'friction', airAbsorb: pw?1:0, keepForm: pw, unbreakable: pw, ownRecoil: pw });
for (const [kg, sid] of [[500,'granite'],[500,'concrete'],[4000,'concrete'],[3e4,'sand'],[1e8,'sand']]) {
  if (!D.surfaces.find(s=>s.id===sid)) { console.log('no', sid); continue; }
  const r = P.stomp(mk(kg,sid,true)), r0 = P.stomp(mk(kg,sid,false));
  console.log(kg, sid, 'E', r.E.toPrecision(3), 'vFoot', r.vFoot.toPrecision(4), 'realHole', r.realHole, 'realCrater', r.realCrater, 'absorbed', r.absorbed && r.absorbed.toPrecision(3), 'realBreaks', r.realBreaks, '| off holeDepth', r0.holeDepth, 'crater', r0.crater);
  const M = P.RESTRAINT.MOVES.stomp;
  const o = (pw) => ({ surface: D.surfaces.find(s=>s.id===sid), body: mk(kg,sid,pw).body, near: P.RESTRAINT.R.NEAR, unbreakable: pw });
  console.log('   blast on', M.blast(r, o(true)), 'blast off', M.blast(r0, o(false)), 'ground off', M.ground(r0, o(false)));
}
