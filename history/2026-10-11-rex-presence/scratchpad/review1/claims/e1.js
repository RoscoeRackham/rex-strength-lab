global.window = global;
require(__dirname + '/snap2/src/data.js');
const P = require(__dirname + '/snap2/src/engine.js');
const D = global.DINO_DATA;
const g = 9.80665;
const surf = (id) => D.surfaces.find((s) => s.id === id);
const rex = P.makeBody({ build: 'rex', H: P.DEFAULT_BODIES.rex.H, m: P.DEFAULT_BODIES.rex.m });
module.exports = { P, D, g, surf, rex };
if (require.main === module) {
  // stomp all-out at default strength: PPV at 3 m and 5 m, each surface
  for (const kg of [511, 90718.474, 1e6, 1e7]) for (const sf of ['concrete', 'sand', 'stiffclay', 'granite']) {
    const c = { F: kg * g, mode: 'comic', body: rex, surface: surf(sf), groundHolds: false, anchor: 'friction' };
    const r = P.stomp(c);
    const o = { near: 3, body: rex, surface: surf(sf), m: rex.m };
    const src = P.RESTRAINT.MOVES.stomp.shake(r, o);
    console.log(kg, sf, 'vFoot', r.vFoot.toFixed(2), 'PPV@3m mm/s', (P.ppvAt(src, 3) * 1000).toFixed(2), '@5m', (P.ppvAt(src, 5) * 1000).toFixed(2), 'hole', r.holeDepth);
  }
}
