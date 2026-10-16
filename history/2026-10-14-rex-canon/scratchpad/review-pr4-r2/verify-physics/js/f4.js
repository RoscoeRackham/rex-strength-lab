const { P, g, R3, O3, c3 } = require('./common.js');
const near = 5;
const bis = (f) => { let lo = 2000, hi = 1e6; for (let i = 0; i < 80; i++) { const m = Math.sqrt(lo * hi); if (f(m)) hi = m; else lo = m; } return hi; };
// steady push: Ollie pushes Rex (page default colWho ollie)
const sp = (kg) => P.standoff(c3(kg * g, O3), c3(kg * g, R3));
const slideOnly = bis((kg) => { const r = sp(kg); return r.drive && r.drive.slideB > near; });
const total = bis((kg) => { const r = sp(kg); return r.drive && r.drive.d + r.drive.slideB > near; });
let r = sp(slideOnly); console.log('steady push ceiling (slide only)', slideOnly.toFixed(0), 'kgf: stroke', r.drive.d.toFixed(2), 'slide', r.drive.slideB.toFixed(2), 'total', (r.drive.d + r.drive.slideB).toFixed(2));
r = sp(total); console.log('steady push ceiling (stroke + slide)', total.toFixed(0), 'kgf: stroke', r.drive.d.toFixed(2), 'slide', r.drive.slideB.toFixed(2));
// shoving match: equal efforts
const pm = (kg) => P.pushMatch(c3(kg * g, R3), c3(kg * g, O3));
const pushDist = (rr, who) => { const f = who === 'A' ? Math.max(0, rr.DB - rr.HA) : Math.max(0, rr.DA - rr.HB); const m = 3000; return P.xOfT(f, m, rr.t); };
const s1 = bis((kg) => { const rr = pm(kg); return rr.outcome === 'bothShoved' && rr.slideA > near && rr.slideB > near; });
const s2 = bis((kg) => { const rr = pm(kg); return rr.outcome === 'bothShoved' && pushDist(rr, 'A') + rr.slideA > near && pushDist(rr, 'B') + rr.slideB > near; });
let q = pm(s1); console.log('shoving match ceiling (slide only)', s1.toFixed(0), 'kgf: push dist', pushDist(q, 'A').toFixed(2), 'slide', q.slideA.toFixed(2), 'total', (pushDist(q, 'A') + q.slideA).toFixed(2));
q = pm(s2); console.log('shoving match ceiling (push + slide)', s2.toFixed(0), 'kgf: push dist', pushDist(q, 'A').toFixed(2), 'slide', q.slideA.toFixed(2));
// collide charge for comparison: moved = during + slide
const ch = P.collide(c3(4260 * g, O3), c3(4260 * g, R3), { source: 'sprint' });
console.log('collide charge at 4,260 kgf: during', ch.after.splat.during.toFixed(3), 'slide', ch.after.splat.slide.toFixed(2), 'moved', ch.after.splat.moved.toFixed(2));
