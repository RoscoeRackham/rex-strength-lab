global.window = {};
const R = __dirname + '/repo/src/';
const P = require(R + 'engine.js'); require(R + 'data.js'); const D = window.DINO_DATA, g = P.K.g;
const surf = (id) => D.surfaces.find((s) => s.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const M = P.RESTRAINT.MOVES;
console.log('TH', JSON.stringify(P.VIB.TH));
for (const lg of [2.5, 2.8, 2.9, 2.96, 2.98, 3.0, 3.5, 4, 6, 9]) for (const ub of [false, true]) {
  const c = { F: Math.pow(10, lg) * g, mode: 'comic', body: rex, surface: surf('sand'), anchor: 'friction', unbreakable: ub };
  const s = P.stomp(c), o = { surface: c.surface, body: rex, unbreakable: ub };
  const src = M.stomp.shake(s, o);
  console.log('lg', lg, 'ub', ub, 'vFoot', s.vFoot.toPrecision(3), 'ppv5 mm/s', (P.ppvAt(src, 5) * 1000).toPrecision(3), 'plaster reach', P.plasterReach(src).toPrecision(3), 'over plaster at 5', P.plasterOver(src, 5));
}
// the presets through planNow
for (const ub of [false, true]) {
  const c = { F: 1e6 * g, mode: 'comic', body: rex, surface: surf('sand'), anchor: 'friction', unbreakable: ub, ownRecoil: true, keepForm: true, airAbsorb: 1 };
  const p = P.RESTRAINT.planNow('stomp', c, { near: 5 });
  for (const e of ['rattle', 'plaster']) { const r = p.result('preset:' + e); console.log('ub', ub, e, r.never ? 'never' : (r.use / g).toPrecision(3) + ' kg'); }
  const h = p.result('hazard:shake'); console.log('ub', ub, 'hazard:shake', h && (h.never ? 'never' : (h.use / g).toPrecision(3)));
}
