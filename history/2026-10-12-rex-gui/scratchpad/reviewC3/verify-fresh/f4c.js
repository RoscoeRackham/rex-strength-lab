const P = require(process.argv[2] + '/src/engine.js');
const rex = P.DEFAULT_BODIES.rex;
for (const E of [4.2e23, 5e23]) for (const s of [0.5, 1]) { const b = P.grownBody(rex, E, s); console.log(E, s, 'H', b.H.toFixed(2), 't_ms', (1000 * b.H / 1540).toFixed(2)); }
for (const E of [4.2e23, 5e23]) { const G = P.gradualGrowth(rex, E, 1); console.log('gradual pure size', E, (G.T / 60).toFixed(2), 'min'); const G2 = P.gradualGrowth(rex, E, 0.5); console.log('gradual mix', E, (G2.T).toFixed(1), 's'); }
