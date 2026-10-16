const R = __dirname + '/../repo/rex-strength-lab/src/';
const P = require(R + 'engine.js'); global.window = {}; require(R + 'data.js'); const D = window.DINO_DATA; const g = P.K.g;
const body = P.makeBody({ build: 'rex', ...P.DEFAULT_BODIES.rex });
const mk = (o) => Object.assign({ F: 100 * 907.18474 * g, mode: 'comic', body, surface: D.surfaces.find((s) => s.id === 'concrete'), anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, safePassenger: true, noKnockback: true }, o || {});
const obj = (id) => D.objects.find((x) => x.id === id);
module.exports = { P, D, g, body, mk, obj };
if (require.main === module) {
  for (const s of [1, 0.5, 0.1]) {
    const c = mk({ airAbsorb: s }), r = P.throwObject(c, obj('car'), 20);
    const tb = P.RESTRAINT.takenBack('throw', r, Object.assign({}, c, { obj: obj('car'), angle: 20 }));
    console.log('car 20deg default dial, share', s, 'parts.drag', tb.parts.drag.toExponential(3), 'E', tb.E.toExponential(3));
  }
  for (const s of [0.5, 0.3]) {
    const c = mk({ airAbsorb: s, F: 1e6 * g }), r = P.throwObject(c, obj('baseball'), 45);
    const tb = P.RESTRAINT.takenBack('throw', r, Object.assign({}, c, { obj: obj('baseball'), angle: 45 }));
    const kAir = 1 - s;
    console.log('baseball 45 at 1e6 kg share', s, 'v', r.v.toFixed(0), 'dragLoss0', r.dragLoss0.toExponential(4), 'blast kAir*dragLoss0', (kAir * r.dragLoss0).toExponential(4), 'shimmer parts.drag', tb.parts.drag.toExponential(4));
  }
}
