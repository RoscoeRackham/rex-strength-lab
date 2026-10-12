global.window = global;
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
const D = global.DINO_DATA;
const sf = D.surfaces.find((s) => s.id === 'concrete');
const body = P.makeBody({ H: 3.048, m: 3007, build: 'rex' });
for (const E of [1e19, 3e19, 1e20, 3e20, 1e21, 3e21, 1e22]) {
  const g = P.grownBody(body, E, 0.5);
  const I = P.instantGrowth(body, E, 0.5, { surface: sf });
  console.log('E', E.toExponential(0), 'lnr', g.lnr.toFixed(4), 'dpLo', I.dpLo.toFixed(0), 'dpHi', I.dpHi.toFixed(0), 'Pa', I.dpHi < 3400 ? '-> page: "too little to break windows (that takes about 3.4 kPa)"' : '');
}
