// Does the Sources 'Ground shear strength' row's clay value drive anything besides the bolted tear-out?
const R = __dirname + '/repo/rex-strength-lab/src/';
const P = require(R + 'engine.js');
global.window = {}; require(R + 'data.js'); const D = window.DINO_DATA;
const soft = D.surfaces.find(s => s.id === 'softclay');
const body = P.makeBody({});
const ollie = P.makeBody(Object.assign({}, P.DEFAULT_BODIES.ollie));
for (const [lbl, su] of [['as published (20 kPa)', soft.shear], ['halved (10 kPa)', soft.shear / 2]]) {
  const s2 = Object.assign({}, soft, { shear: su });
  const f = P.footprint(body, s2, 300e3, false);
  const sd = P.standDepth ? P.standDepth(body, s2) : null;
  console.log(lbl, 'footprint at 300 kPa:', JSON.stringify(f), ' standDepth:', JSON.stringify(sd));
}
