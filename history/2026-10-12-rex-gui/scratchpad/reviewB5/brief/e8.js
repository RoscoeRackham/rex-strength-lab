global.window = {};
const R = __dirname + '/repo/src/';
const P = require(R + 'engine.js'); require(R + 'data.js'); const D = window.DINO_DATA, g = P.K.g;
const surf = (id) => D.surfaces.find((s) => s.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const M = P.RESTRAINT.MOVES;
const near = 1.5;
for (const lg of [2.5, 2.7, 2.8, 2.9, 2.95, 2.97, 2.99, 3.1, 4, 6]) {
  const c = { F: Math.pow(10, lg) * g, mode: 'comic', body: rex, surface: surf('sand'), anchor: 'friction', unbreakable: true, ownRecoil: true };
  const s = P.stomp(c), src = M.stomp.shake(s, { surface: c.surface, body: rex, unbreakable: true });
  console.log(lg, 'plasterOver at', near, P.plasterOver(src, near), (P.ppvAt(src, near)*1000).toPrecision(3));
}
