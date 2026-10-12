const path = '/home/user/rex-strength-lab/rex-strength-lab/src/';
const P = require(path + 'engine.js');
global.window = {}; require(path + 'data.js'); const D = window.DINO_DATA;
const g = P.K.g;
function ctx(st = {}) {
  const s = Object.assign({ logKg: Math.log10(100 * 907.18474), inf: false, mode: 'comic', surface: 'concrete', groundHolds: false, anchor: 'friction', H: P.DEFAULT_BODIES.rex.H, m: P.DEFAULT_BODIES.rex.m, build: 'rex' }, st);
  const body = P.makeBody({ H: s.H, m: s.m, build: s.build });
  const surface = D.surfaces.find((x) => x.id === s.surface);
  return Object.assign({ F: s.inf ? Infinity : Math.pow(10, s.logKg) * g, mode: s.mode, body, surface, groundHolds: s.groundHolds, anchor: s.anchor, gentleHold: false, safePassenger: false, silentStrike: false, softLanding: false, coolFlight: false }, st.extra || {});
}
const obj = (id) => D.objects.find((o) => o.id === id);
module.exports = { P, D, g, ctx, obj };
