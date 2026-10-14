global.window = {};
const P = require('./proj/rex-strength-lab/src/engine.js');
require('./proj/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const surf = (id) => D.surfaces.find((s) => s.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const F = 100 * 907.18474 * g;
for (const s of ['sand', 'softclay', 'concrete']) for (const anchor of ['friction', 'bolted']) for (const gh of [false, true]) {
  const r = P.sprint({ F, mode: 'comic', body: rex, surface: surf(s), groundHolds: gh, anchor });
  console.log(s, anchor, 'comicGround=' + gh, 'limit=' + r.limit, 'thrust=' + Math.round(r.thrust), 'sinks=' + r.sinks, 'mu*W=' + Math.round(surf(s).mu * rex.m * g));
}
