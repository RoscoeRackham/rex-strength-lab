// Jump height vs strength on loose sand: engine (constant qA) vs velocity-dependent resistance (k=0.5, 1).
// Uses the same RK4 model as jump_pon.js (k=0 reproduces the engine to 3 s.f.).
const { P, D, g, S, T, ctx } = require('./common');
const src = require('fs').readFileSync(__dirname + '/jump_pon.js', 'utf8');
const sim = new Function('P', 'g', src.split('const fmt')[0].replace(/const \{[^}]+\} = require\('.\/common'\);/, '') + '; return sim;')(P, g);
const ap = (c, v) => P.fly({ v0: v, thetaDeg: 90, h0: 0, m: c.body.m, A: c.body.topArea, Cd: c.body.Cd }).apex;
for (const kg of [1500, 1930, 1940, 2000, 3000, 5000, 9072, 90718]) {
  const c = ctx(kg, { surface: 'sand' }); const r = P.jump(c);
  let s5 = '-', s1 = '-';
  if (r.groundFails) { s5 = ap(c, sim(r.F, c.body, S.sand, 0.5).v).toPrecision(3); s1 = ap(c, sim(r.F, c.body, S.sand, 1).v).toPrecision(3); }
  console.log(`lift ${String(kg).padStart(6)} kg  engine apex ${r.flight.apex.toPrecision(3).padStart(6)} m   k=0.5 apex ${s5.padStart(6)} m   k=1 apex ${s1.padStart(6)} m`);
}
