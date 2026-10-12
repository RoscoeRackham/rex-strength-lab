global.window = {};
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const body = P.makeBody({ build: 'human', H: 2, m: 180 });
const surf = (id) => D.surfaces.find((s) => s.id === id);
const s = surf(process.argv[2] || 'concrete');
const o = { near: 5, surface: s, body, m: body.m };
let prev = null;
const fig = (x) => Number(x.toPrecision(4));
for (let i = 0; i <= 600; i++) {
  const kg = Math.pow(10, 4 + i * (2.5 / 600));
  const r = P.jump({ F: 1e6 * g, use: kg * g, mode: 'comic', body, surface: s, groundHolds: false, anchor: 'friction' });
  const sh = P.RESTRAINT.MOVES.jump.shake(r, o);
  const on = P.plasterOver(sh, 5);
  if (on !== prev) {
    const parts = (sh || []).map((x) => (x ? (fig(P.ppvAt(x, 5) * 1000) + ' mm/s @ ' + fig(1 / x.T) + ' Hz') : '-'));
    console.log(kg.toExponential(3), 'plaster', on, parts.join(' ; '), 'reach', fig(P.plasterReach(sh)));
    prev = on;
  }
}
// also the RESTRAINT plan's result
const ctx = { F: 1e6 * g, mode: 'comic', body, surface: s, groundHolds: false, anchor: 'friction' };
const pl = P.RESTRAINT.plan('jump', ctx, { near: 5, target: 3 });
const res = pl.ensure ? (pl.ensure('hazard:plaster'), pl.result('hazard:plaster')) : null;
console.log('search hazard:plaster', res && { use: res.use / g, below: res.below / g, never: res.never });
for (const kg of [2.2e5, 4e5]) {
  const r = P.jump({ F: 1e6 * g, use: kg * g, mode: 'comic', body, surface: s, groundHolds: false, anchor: 'friction' });
  const sh = P.RESTRAINT.MOVES.jump.shake(r, o);
  console.log(kg, 'reach', fig(P.plasterReach(sh)), sh.map((x) => fig(P.ppvAt(x, 5) * 1000) + '@' + fig(1 / x.T)).join(' '));
}
