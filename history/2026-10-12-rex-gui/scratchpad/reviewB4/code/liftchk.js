global.window = {};
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js'); require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
for (const sid of ['concrete', 'granite', 'sand']) for (const mult of [1, 3, 10, 30]) {
  const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 * mult }), ollie = P.makeBody({ build: 'ollie', H: 3.048, m: 3007 * mult });
  const s = D.surfaces.find((x) => x.id === sid);
  const c = { F: 1e9 * g, mode: 'comic', surface: s, anchor: 'friction' };
  const r = P.liftPartner(Object.assign({ body: rex }, c), Object.assign({ body: ollie }, c));
  console.log(sid, mult, 'can', r.can, 'groundRatio', r.groundRatio.toPrecision(3));
}
