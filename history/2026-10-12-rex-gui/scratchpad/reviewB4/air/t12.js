const {P, obj, ctx, ALL} = require('./load.js');
const o = obj('car');
let lo = 1e5, hi = 1e15;
for (let i = 0; i < 60; i++) { const mid = Math.sqrt(lo*hi); const r = P.throwObject(Object.assign(ctx(mid, ALL), { noFlight: true }), o, 0); if (r.v > 9000) hi = mid; else lo = mid; }
console.log('logKg for 9 km/s level car:', Math.log10(hi));
const t0 = Date.now(); const r = P.throwObject(ctx(hi, ALL), o, 0); console.log(Date.now() - t0, 'ms', r.v, JSON.stringify({ landed: r.flight.landed, orbit: r.flight.orbit, timedOut: r.flight.timedOut, apex: r.flight.apex, time: r.flight.time }));
const r0 = P.throwObject(ctx(hi, Object.assign({}, ALL, {airAbsorb: 0})), o, 0); console.log('0%:', JSON.stringify({ landed: r0.flight.landed, range: r0.flight.range }));
