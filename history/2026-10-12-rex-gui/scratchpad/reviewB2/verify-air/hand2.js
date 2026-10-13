const { P, body, obj, K } = require('./common');
const R = P.RESTRAINT.R;
const h = P.handAir(body, obj('baseball'), 22340, 1);
for (const f of [1, 0.5, 0.25]) console.log('factor', f, 'E', (h.E*f).toExponential(2), 'J; overpressure at 15 m', P.overpressureAt(h.E*f, 15).toFixed(0), 'Pa; windows radius', P.blastRadius(h.E*f, R.DP_WINDOWS).toFixed(1), 'm');
// Mach 1 hand: rattle at 5 m?
const h1 = P.handAir(body, obj('baseball'), K.a0, 1);
console.log('Mach 1 hand E', h1.E.toExponential(2), 'J; rattle radius (36 Pa)', P.blastRadius(h1.E, R.DP_RATTLE).toFixed(1), 'm; harm radius (100 Pa)', P.blastRadius(h1.E, R.DP_HARM).toFixed(1));
