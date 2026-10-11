const P = require('/home/user/dino-strength-sim/src/engine.js');
const K = P.K, g = K.g;
const D = (function(){ const window = {}; eval(require('fs').readFileSync('/home/user/dino-strength-sim/src/data.js','utf8')); return window.DINO_DATA; })();
const surf = D.surfaces.find(s => s.id === 'concrete');
const body = P.makeBody({});
const ctx = (kg, mode) => ({ F: kg * g, mode, body, surface: surf, groundHolds: false, anchor: 'friction' });
const obj = (id) => D.objects.find(o => o.id === id);
for (const [id, th, vT] of [['moon', 45, 11175], ['moon', 0, 9000], ['tank', 45, 0]]) {
  if (id === 'tank') continue;
  const kg = P.threshold((F) => P.throwObject(ctx(F / g, 'comic'), obj(id), th).v >= vT, 1e2, 1e45) / g;
  const r = P.throwObject(ctx(kg, 'comic'), obj(id), th);
  console.log(`${id} th=${th} logKg=${Math.log10(kg).toFixed(6)} v=${r.v.toFixed(1)} escaped=${r.flight.escaped} timedOut=${r.flight.timedOut} range=${(r.flight.range/1e3).toExponential(4)} km apex=${(r.flight.apex/1e3).toFixed(0)} km time=${(r.flight.time/86400).toFixed(2)} d vImpact=${r.flight.vImpact} Eimpact=${r.Eimpact} quake=${r.quake} steps=${r.flight.steps}`);
}
