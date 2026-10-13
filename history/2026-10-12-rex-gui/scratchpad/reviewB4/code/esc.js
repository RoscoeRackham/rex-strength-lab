// does any powers-off case reach a supersonic, non-relativistic throw that never lands (the throwBlast fallback)?
global.window = {};
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js'); require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const s = D.surfaces.find((x) => x.id === 'concrete');
for (const oid of ['car', 'baseball', 'person', 'bus', 'shot']) for (const ang of [0, 20, 30, 45, 90]) {
  let found = null;
  for (let lg = 4; lg < 22; lg += 0.25) { const r = P.throwObject({ F: Math.pow(10, lg) * g, mode: 'comic', body: rex, surface: s, anchor: 'friction' }, D.objects.find((o) => o.id === oid), ang); if (r.canMove && !r.flight.relativistic && !r.flight.landed && r.v > 340) { found = lg; break; } }
  console.log(oid, ang, 'first never-lands supersonic dial 10^' + found);
}
