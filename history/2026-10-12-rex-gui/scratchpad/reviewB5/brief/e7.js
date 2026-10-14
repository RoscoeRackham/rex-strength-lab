global.window = {};
const R = __dirname + '/repo/src/';
const P = require(R + 'engine.js'); require(R + 'data.js'); const D = window.DINO_DATA, g = P.K.g;
const surf = (id) => D.surfaces.find((s) => s.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const M = P.RESTRAINT.MOVES;
for (const near of [2, 1.5, 1.2, 1]) for (const ub of [false, true]) {
  const c = { F: 1e6 * g, mode: 'comic', body: rex, surface: surf('sand'), anchor: 'friction', unbreakable: ub, ownRecoil: true, keepForm: true, airAbsorb: 1 };
  const p = P.RESTRAINT.planNow('stomp', c, { near });
  const pl = p.result('preset:plaster'), ce = p.ceiling();
  const all = p.run(undefined), sh = M.stomp.shake(all, Object.assign({ surface: c.surface, body: rex, near }, c));
  console.log('near', near, 'ub', ub, 'plaster preset', pl.never ? 'never' : (pl.use / g).toPrecision(3) + ' kg', '| ceiling', ce.by ? ce.by + ' below ' + (ce.below / g).toPrecision(3) + ' kg' : 'none', '| all-out plaster over?', P.plasterOver(sh, near), 'ppv', (P.ppvAt(sh, near) * 1000).toPrecision(3));
}
