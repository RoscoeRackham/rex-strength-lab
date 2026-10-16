const { P, D, g, R3, O3, c3, dial, sig, surf, conc } = require('./h.js');
const m = P.pushMatch(c3(dial, R3), c3(1000 * g, O3));
const slide = P.COLLIDE ? null : null;
const k = 0.5 * P.K.rho0 * O3.Cd * O3.frontArea, R = m.holdB;
const s = O3.m / (2 * k) * Math.log1p(k * m.v * m.v / R);
console.log(m.outcome, 'x', sig(m.x), 'v', sig(m.v), 'Ollie friction', sig(R), 'slide after the edge', sig(s), 'ends', sig(m.x + s), 'm from where he stood');
// the smallest pace at which he ends past 5 m
const gr = surf('gravel'), w1 = P.pushMatch(c3(dial, R3, { surface: gr }), c3(2200 * g, O3, { surface: gr }));
const R1 = w1.holdB, s1 = O3.m / (2 * k) * Math.log1p(k * w1.v * w1.v / R1);
console.log('gravel 2200:', w1.outcome, 'v', sig(w1.v), 'ends', sig(w1.x + s1));
