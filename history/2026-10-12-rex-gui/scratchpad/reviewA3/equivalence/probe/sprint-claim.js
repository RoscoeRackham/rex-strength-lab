// "in this sim his speed comes only from the force he has beyond his own weight" (branch Sprint, too-gentle item):
// check against engine sprint(): does the top speed follow the force beyond his weight?
global.window = global;
require('../branch/rex-strength-lab/src/data.js');
const D = global.DINO_DATA, P = require('../branch/rex-strength-lab/src/engine.js');
const g = P.K.g, body = P.makeBody({ H: 3.048, m: 3007, build: 'rex' }), W = body.m * g;
const surface = D.surfaces.find((s) => s.id === 'concrete');
for (const anchor of ['friction', 'bolted']) for (const kg of [1e5, 1e7, 2e7, 1e9, 2e9]) {
  const r = P.sprint({ F: kg * g, mode: 'comic', body, surface, groundHolds: false, anchor });
  console.log(anchor.padEnd(8), 'lifts', kg.toExponential(0), 'kg | force beyond weight', ((kg * g - W) / 1e6).toPrecision(3), 'MN | push-off', (r.thrust / 1e6).toPrecision(3), 'MN, limited by', r.limit, '| top speed', r.vTop.toPrecision(4), 'm/s, limited by', r.topLimit);
}
