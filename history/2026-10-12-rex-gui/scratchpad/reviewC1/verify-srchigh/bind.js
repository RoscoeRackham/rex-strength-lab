global.window = {};
require(process.argv[2] + '/src/data.js');
const D = window.DINO_DATA; const L = require(process.argv[2] + '/src/ladder.js');
for (const J of [6.5e27, 1.56e28, 5.1e30, 1.02e31, 2.489e32, 1e32]) console.log(J.toExponential(2), '|', L.compare(J, D.energyRefs).text);
