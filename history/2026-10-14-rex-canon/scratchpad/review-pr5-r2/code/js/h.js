// helpers: load the engine from a repo dir (default: my clone)
const path = require('path');
module.exports = function load(repoDir) {
  const R = repoDir || path.join(__dirname, '..', 'repo');
  const ENG = path.join(R, 'rex-strength-lab/src/engine.js');
  delete require.cache[require.resolve(ENG)];
  global.window = {};
  const P = require(ENG);
  const DATA = path.join(R, 'rex-strength-lab/src/data.js');
  delete require.cache[require.resolve(DATA)];
  require(DATA);
  const D = window.DINO_DATA;
  const LADP = path.join(R, 'rex-strength-lab/src/ladder.js');
  delete require.cache[require.resolve(LADP)];
  const LAD = require(LADP);
  const g = P.K.g;
  const surf = (id) => D.surfaces.find((x) => x.id === id);
  const obj = (id) => D.objects.find((x) => x.id === id);
  const R3 = P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex)), O3 = P.makeBody(Object.assign({ build: 'ollie' }, P.DEFAULT_BODIES.ollie));
  const DEF = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, safePassenger: true, noKnockback: true };
  const OFF = { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false, safePassenger: false, silentStrike: false, softLanding: false, noKnockback: false };
  const c9 = (F, body, x) => Object.assign({ F, mode: 'comic', body: body || R3, surface: surf('concrete'), anchor: 'friction' }, DEF, x || {});
  const dial = 100 * 907.18474 * g;
  const PE = (m, h) => m * (P.K.GM / P.K.R_E - P.K.GM / (P.K.R_E + h));
  const TB = P.RESTRAINT.takenBack;
  const glow = (J) => LAD.glow(J, D.energyRefs);
  const sig = (x, k) => Number(x).toPrecision(k || 3);
  return { P, D, LAD, g, surf, obj, R3, O3, DEF, OFF, c9, dial, PE, TB, glow, sig };
};
