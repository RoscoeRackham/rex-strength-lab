const P = require('/home/user/dino-strength-sim/src/engine.js');
let D; try { D = require('/home/user/dino-strength-sim/src/data.js'); } catch(e) { console.log('data load err', e.message); }
const g = P.K.g;
const body = P.makeBody({ H: 2, m: 180 });
console.log('body', body.m, 'Cd', body.Cd, 'front', body.frontArea, 'top', body.topArea);
const surfs = D ? (D.surfaces || (D.default && D.default.surfaces)) : null;
const concrete = surfs ? surfs.find(s=>s.id==='concrete') : { qult: 10e6, mu: 0.8, shear: 2e6, rho: 2400 };
for (const gh of [false, true]) for (const mode of ['comic','real']) for (const lk of [Math.log10(511), 3, 4, 5, 6, 7, 8, 10.97]) {
  const c = { F: Math.pow(10, lk) * g, mode, body, surface: concrete, groundHolds: gh, anchor: 'friction' };
  const r = P.jump(c); const f = r.flight;
  const shown = Math.min(r.vTerminal, f.vImpact || r.vTerminal);
  console.log(`gh=${gh} ${mode} logKg=${lk.toFixed(2)} v0=${r.v.toFixed(1)} apex=${f.apex.toFixed(1)} vImpact=${f.vImpact.toFixed(2)} vTerm(front)=${r.vTerminal.toFixed(2)} shown=${shown.toFixed(2)} esc=${f.escaped} rel=${f.relativistic} groundFails=${r.groundFails}`);
}
const vtTop = Math.sqrt(2*body.m*g/(P.K.rho0*body.Cd*body.topArea));
console.log('vTerm with topArea', vtTop);
