const P = require('/home/user/dino-strength-sim/src/engine.js');
const K = P.K, g = K.g;
const D = (function(){ const window = {}; eval(require('fs').readFileSync('/home/user/dino-strength-sim/src/data.js','utf8')); return window.DINO_DATA; })();
const surf = D.surfaces.find(s => s.id === 'concrete');
const body = P.makeBody({});
const ctx = (kg, mode) => ({ F: kg * g, mode, body, surface: surf, groundHolds: false, anchor: 'friction' });
const obj = (id) => D.objects.find(o => o.id === id);
// baseball 0 deg vacuum
const bb = P.throwObject(ctx(511, 'real'), obj('baseball'), 0);
const ghost = P.fly({ v0: bb.v, thetaDeg: 0, h0: body.releaseHeight, m: 0.145, A: obj('baseball').area, Cd: 0 });
console.log('baseball 0deg v', bb.v.toFixed(2), 'drag range', bb.flight.range.toFixed(2), 'true vacuum range', ghost.range.toFixed(2), 'UI claim v^2/g', (bb.v ** 2 / g).toFixed(1));
// sweep angles for shot at 511 real
for (const th of [0, 10, 45, 70, 85, 90]) {
  const r = P.throwObject(ctx(511, 'real'), obj('baseball'), th);
  const gh = P.fly({ v0: r.v, thetaDeg: th, h0: body.releaseHeight, m: 0.145, A: obj('baseball').area, Cd: 0 });
  const shown = r.flight.range < 0.2 * (r.v * r.v / g);
  console.log(`baseball th=${th}: range ${r.flight.range.toFixed(2)} vac ${gh.range.toFixed(2)} UI v^2/g ${(r.v*r.v/g).toFixed(1)} sentence shown=${shown}`);
}
// find strength (comic) at which car thrown at 45 leaves at 20 km/s, 8 km/s
function kgFor(id, th, vT, mode) {
  return P.threshold((F) => P.throwObject(ctx(F / g, mode), obj(id), th).v >= vT, 1e2, 1e40) / g;
}
for (const [id, th, vT] of [['car', 45, 8000], ['car', 45, 20000], ['tank', 45, 20000], ['baseball', 45, 20000]]) {
  const kg = kgFor(id, th, vT, 'comic');
  const r = P.throwObject(ctx(kg, 'comic'), obj(id), th);
  const gh = P.fly({ v0: r.v, thetaDeg: th, h0: body.releaseHeight, m: obj(id).m, A: obj(id).area, Cd: 0, tMax: 4 * 86400 });
  console.log(`${id} th=${th} kg=${kg.toExponential(4)} v=${r.v.toFixed(0)} dragRange=${(r.flight.range/1e3).toFixed(2)} km; UI 'without air' = ${(Math.min(r.v*r.v/g, 2e7)/1e3).toFixed(0)} km (shown=${r.flight.range < 0.2*(r.v*r.v/g)}); true vacuum: escaped=${gh.escaped} range=${(gh.range/1e3).toFixed(0)} km`);
}
// Jump: vacuumApex vs round-earth vacuum apex
const R = K.R_E, GM = K.GM;
for (const vT of [3000, 7000, 10000, 12000, 1e5]) {
  const kg = P.threshold((F) => P.jump(ctx(F / g, 'comic')).v >= vT, 1e2, 1e40) / g;
  const j = P.jump(ctx(kg, 'comic'));
  const eps = 0.5 * j.v * j.v - GM / R;
  const trueVac = eps < 0 ? (-GM / eps - R) : Infinity;
  console.log(`jump kg=${kg.toExponential(4)} v=${j.v.toFixed(0)} dragApex=${(j.flight.apex/1e3).toFixed(2)} km esc=${j.flight.escaped} | UI no-air apex (v^2/2g)=${(j.vacuumApex/1e3).toFixed(0)} km | round-Earth vacuum apex=${isFinite(trueVac)?(trueVac/1e3).toFixed(0)+' km':'ESCAPES'} | vImpact ${j.flight.vImpact.toFixed(1)} vTerminal(UI) ${j.vTerminal.toFixed(1)}`);
}
