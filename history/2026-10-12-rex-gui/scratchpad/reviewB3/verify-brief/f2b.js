const { P, D, rex, surf, ctx } = require('./common.js');
const bus = D.objects.find(o => o.id === 'bus');
const sh = (kg) => { const c = ctx({ F: kg * P.K.g, anchor: 'bolted' }); const r = P.pull(c, bus); if (!r.canMove) return null; const J = P.vToMomentum(r.vEnd, bus.m) + r.resist * r.t10m; return { src: P.impulseSource(c.surface, J, r.t10m), r }; };
let lo = 1e3, hi = 1e7;
for (let i = 0; i < 60; i++) { const mid = Math.sqrt(lo*hi); const s = sh(mid); if (s && P.plasterOver(s.src, 5)) hi = mid; else lo = mid; }
const s = sh(hi);
console.log('plaster at 5 m from', (hi/1e3).toFixed(0), 't-force, t10m', s.r.t10m.toFixed(3), 'vEnd', s.r.vEnd.toFixed(1));
const s74 = sh(7.41e6); console.log('at 74% (7410 t): vEnd', s74.r.vEnd.toFixed(1), 'plaster reach', P.plasterReach(s74.src).toFixed(0), 'm');
