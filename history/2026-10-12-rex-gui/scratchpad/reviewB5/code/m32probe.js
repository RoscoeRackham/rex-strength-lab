global.window = {};
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g, M = P.RESTRAINT.MOVES;
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
for (const sid of ['sand', 'gravel', 'softclay', 'stiffclay', 'concrete']) for (const lg of [2.7, 3, 3.5, 4, 5, 6, 8]) for (const mode of ['comic', 'real']) {
  const surface = D.surfaces.find((s) => s.id === sid);
  const c = { F: Math.pow(10, lg) * g, mode, body: rex, surface, anchor: 'friction' };
  const r = P.stomp(c), o = { surface, body: rex };
  const b = M.stomp.blow(r, o);
  if (!b) continue;
  const fp = b.T, hole = 2 * (r.holeDepth || 0) / r.vFoot;
  if (hole > 0.064) console.log(sid, lg, mode, 'vFoot', r.vFoot.toFixed(2), 'hole', r.holeDepth.toFixed(3), 'T', b.T.toFixed(3), 'holeT', hole.toFixed(3), 'plasterReach', P.plasterReach(M.stomp.shake(r, o)).toFixed(2));
}
