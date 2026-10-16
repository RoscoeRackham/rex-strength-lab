// node common helpers for round 2 fix scripts: require('./common.js')(rootOfRexLab)
module.exports = (root) => {
  global.window = {};
  const path = require('path');
  const P = require(path.join(root, 'src', 'engine.js'));
  require(path.join(root, 'src', 'data.js'));
  const D = window.DINO_DATA, g = P.K.g;
  const surf = (id) => D.surfaces.find((x) => x.id === id), obj = (id) => D.objects.find((x) => x.id === id);
  const R3 = P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex)), O3 = P.makeBody(Object.assign({ build: 'ollie' }, P.DEFAULT_BODIES.ollie));
  const ON = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, safePassenger: true, noKnockback: true };
  const dial = 100 * 907.18474 * g, conc = surf('concrete');
  const c3 = (F, body, x) => Object.assign({ F, mode: 'comic', body, surface: conc, anchor: 'friction' }, x || {});
  const on = (x) => Object.assign({}, ON, x || {});
  return { P, D, g, surf, obj, R3, O3, ON, dial, conc, c3, on, sig: (x) => Number(x).toPrecision(4) };
};
