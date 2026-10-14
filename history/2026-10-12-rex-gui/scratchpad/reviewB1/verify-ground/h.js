const R = __dirname + '/repo/rex-strength-lab';
const P = require(R + '/src/engine.js');
global.window = {}; require(R + '/src/data.js');
const D = window.DINO_DATA;
const g = P.K.g;
const ON = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
const OFF = { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false };
function ctx(kg, o = {}) {
  const body = P.makeBody({ build: o.build || 'rex', H: 3.048, m: 3007 });
  return Object.assign({ F: kg * g, mode: 'comic', body, surface: D.surfaces.find(s => s.id === (o.surf || 'concrete')), anchor: 'friction' }, o.pw || {}, o.extra || {});
}
module.exports = { P, D, g, ON, OFF, ctx };
