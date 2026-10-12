global.window = {};
const P = require('./engine_mired.js');
require('./head/data.js');
const D = window.DINO_DATA;
const ol = P.makeBody({ build: 'ollie', H: 3.048, m: 3007 });
const sf = D.surfaces.find((s) => s.id === 'softclay');
const pr = P.presence(ol, sf, { pace: 'walk', effort: 0, groundHolds: false });
console.log(JSON.stringify(globalThis.__clay), 'knee 0.28H =', 0.28 * 3.048, 'footprint', JSON.stringify(pr.step && pr.step.footprint));
