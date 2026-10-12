global.window = {};
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), ollie = P.makeBody({ build: 'ollie', H: 3.06, m: 3007 });
const surf = D.surfaces.find((s) => s.id === 'concrete');
const o = D.objects.find((x) => x.id === process.argv[2]);
for (const lg of [5, 8, 12, 20, 28, 31, 33, 34, Infinity]) {
  const F = isFinite(lg) ? Math.pow(10, lg) * g : Infinity;
  const mk = (b) => ({ F, mode: process.argv[4] || 'comic', body: b, surface: surf, groundHolds: false, anchor: 'friction' });
  const L = P.catchLeg(mk(rex), mk(ollie), o, Math.pow(10, Number(process.argv[3])), 'hard');
  console.log(lg, L && L.aim ? L.aim.vL.toPrecision(4) : null, L && L.result, L && L.vArrive && L.vArrive.toPrecision(4), L && L.tPush);
}
