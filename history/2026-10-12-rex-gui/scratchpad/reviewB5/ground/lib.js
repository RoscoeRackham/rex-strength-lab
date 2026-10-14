const ROOT = __dirname + '/copy/rex-strength-lab';
global.window = {};
require(ROOT + '/src/data.js');
const D = window.DINO_DATA;
const P = require(ROOT + '/src/engine.js');
const surf = (id) => D.surfaces.find(s => s.id === id);
const obj = (id) => D.objects.find(o => o.id === id);
const rex = () => P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const ollie = () => P.makeBody({ build: 'ollie', H: 3.048, m: 3007 });
const tons = (t) => t * 907.18474;
function ctx(o = {}) {
  const body = o.body || rex();
  const kg = o.kg != null ? o.kg : tons(100);
  const all = o.powers === false ? { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false } : { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
  return Object.assign({ F: o.F != null ? o.F : kg * P.K.g, mode: 'comic', body, surface: surf(o.surface || 'concrete'), anchor: 'friction' }, all, o.extra || {});
}
module.exports = { P, D, surf, obj, rex, ollie, tons, ctx };
