global.window = {};
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA;
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const ollie = P.makeBody({ build: 'ollie', H: 3.06, m: 3007 });
const surf = (id) => D.surfaces.find(s => s.id === id);
const obj = (id) => D.objects.find(o => o.id === id);
function ctxs(kg, o) {
  const base = Object.assign({ F: kg * P.K.g, mode: 'comic', surface: surf('concrete'), anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true }, o || {});
  return [Object.assign({}, base, { body: rex }), Object.assign({}, base, { body: ollie })];
}
module.exports = { D, P, rex, ollie, surf, obj, ctxs };
