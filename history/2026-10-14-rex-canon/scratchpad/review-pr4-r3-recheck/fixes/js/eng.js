// load the engine of a given rex-strength-lab dir
module.exports = (dir) => {
  const P = require(dir + '/src/engine.js'); global.window = global.window || {};
  delete require.cache[require.resolve(dir + '/src/data.js')];
  require(dir + '/src/data.js'); const D = window.DINO_DATA;
  const g = P.K.g;
  const R3 = P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex)), O3 = P.makeBody(Object.assign({ build: 'ollie' }, P.DEFAULT_BODIES.ollie));
  const surf = (id) => D.surfaces.find((s) => s.id === id);
  const mk = (o) => Object.assign({ F: 100 * 907.18474 * g, mode: 'comic', body: R3, surface: surf('concrete'), anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, safePassenger: true, noKnockback: true }, o || {});
  return { P, D, g, R3, O3, surf, mk };
};
