global.window = {};
const P = require('/tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/review2/ci/repo/rex-strength-lab/src/engine.js'); require('/tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/review2/ci/repo/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g, R = P.RESTRAINT;
for (const b of [P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), P.makeBody({ build: 'ollie', H: 3.06, m: 3007 }), P.makeBody({})]) for (const sid of ['concrete', 'sand', 'granite']) {
  const sf = D.surfaces.find((s) => s.id === sid);
  const walk = P.walkStep(b, sf, { effort: 1 }).src[0];
  const vSt = Math.sqrt(2 * g * P.WALK.STAMP.thigh * b.H);
  // a stomp whose foot lands at the stamp's speed, through the Stomp tab's shake
  const fake = { vFoot: vSt, holeDepth: 0 };
  const st = R.MOVES.stomp.shake(fake, { surface: sf, body: b });
  console.log(b.build, sid, 'walk stamp ppv@5', P.ppvAt(walk, 5).toExponential(4), ' stomp at same foot speed', P.ppvAt(st, 5).toExponential(4));
}
