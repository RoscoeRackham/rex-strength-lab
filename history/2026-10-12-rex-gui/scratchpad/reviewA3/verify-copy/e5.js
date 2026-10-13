global.window = {};
const R = '/home/user/rex-strength-lab/rex-strength-lab/src/';
const P = require(R + 'engine.js'); require(R + 'data.js');
const D = window.DINO_DATA, g = P.K.g;
const surf = (id) => D.surfaces.find((s) => s.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), ollie = P.makeBody({ build: 'ollie', H: 3.048, m: 3007 });
const F = 100 * 907.18474 * g;
const C = P.COLLIDE || P.collideModel || null;
const col = (P.COL && P.collide) ? P : (P.contest || P.CONTEST || P);
const fn = P.collide || (P.CONTEST && P.CONTEST.collide);
console.log(Object.keys(P).filter(k => /col|contest|standoff/i.test(k)));
const ctx = (body, anchor) => ({ F, mode: 'comic', body, surface: surf('concrete'), groundHolds: false, anchor });
for (const a of ['bolted', 'friction']) {
  const r = P.collide(ctx(rex, a), ctx(ollie, 'bolted'), { source: 'sprint', bounce: true });
  console.log('Rex', a, 'v0', r.v0.toFixed(1), 'held', r.held, 'bounce vA', r.h.el.vA.toFixed(1), 'slideA', r.after.bounce.slideA.toFixed(1));
}
// what would a "bolted" footing give for the slide? anchorCapacity bolted R = Infinity -> slideTo returns 0
console.log('friction R for Rex on concrete', P.anchorCapacity({ body: rex, surface: surf('concrete'), anchor: 'friction' }).R);
// jump onto bolted Rex on sand
for (const a of ['friction', 'bolted']) {
  const r = P.collide(Object.assign(ctx(ollie, 'friction'), { surface: surf('sand') }), Object.assign(ctx(rex, a), { surface: surf('sand') }), { source: 'jump', bounce: false });
  console.log('landed on Rex', a, 'hold', r.hold.why, r.hold.H, 'held', r.held, 'depth', r.after.splat.depth);
}
