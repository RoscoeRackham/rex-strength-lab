const repo = process.argv[2], rn = require('path').basename(repo);
const load = (p) => { for (const k of Object.keys(require.cache)) delete require.cache[k]; global.window = {}; const P = require(p); require(repo + '/rex-strength-lab/src/data.js'); return { P, D: window.DINO_DATA }; };
const A = load(repo + '/rex-strength-lab/src/engine.js'), B = load(__dirname + '/mut/' + rn + '/jump-no-landing-ground/src/engine.js');
const f = ({ P, D }, sid, kg, mode, target) => { const g = P.K.g; const c = { F: kg * g, mode, body: P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), surface: D.surfaces.find((s) => s.id === sid), groundHolds: false, anchor: 'friction' }; const p = P.RESTRAINT.planNow('jump', c, { target, near: 5 }); const h = p.result('hazard:ground'); return h.never ? 'never' : (h.use / g).toPrecision(3); };
let shown = 0;
for (const sid of A.D.surfaces.map((s) => s.id)) for (const mode of ['comic', 'real']) for (const kg of [90718, 1e6, 1e7, 1e9]) {
  const a = f(A, sid, kg, mode, 3), b = f(B, sid, kg, mode, 3);
  if (a !== b && shown++ < 6) console.log(rn, sid, mode, kg, 'orig ground hazard', a, '| mutant', b);
}
console.log(rn, 'differences found:', shown);
