global.window = {}; const R = process.argv[2]; require(R + '/src/data.js'); const P = require(R + '/src/engine.js');
const body = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
for (const E of [4.2e23, 5e23]) for (const s of [0.5, 1, 0]) {
  const g = P.grownBody(body, E, s);
  console.log(E, 's=' + s, 'H=' + g.H.toFixed(2), 'rho=' + g.rho.toFixed(0), 't_inst_ms=' + (1000 * g.H / 1540).toFixed(1), 'ratio=' + g.ratio.toFixed(0));
}
