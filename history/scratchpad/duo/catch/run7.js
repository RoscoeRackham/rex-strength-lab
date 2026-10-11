const X = require('./catch2.js');
const { P, K } = X;
require('/home/user/dino-strength-sim/src/data.js');
const DD = window.DINO_DATA;
const obj = (id) => DD.objects.find((o) => o.id === id);
const surf = (id) => DD.surfaces.find((s) => s.id === id);
const g = K.g;
const mk = (o) => Object.assign({ F: 100 * 907.18474 * g, mode: 'comic', body: P.makeBody({}), surface: surf('concrete'), groundHolds: false, anchor: 'friction' }, o || {});
for (const [id, D, F, anc] of [['baseball', 10, Infinity, 'friction'], ['baseball', 10, 1e16 * g, 'friction'], ['baseball', 100, 1e16 * g, 'friction'], ['pyramid', 10, 1e30 * g, 'bolted'], ['pyramid', 10, 1e30 * g, 'friction'], ['car', 10, 1e18 * g, 'friction']]) {
  const r = X.leg(mk({ F, anchor: anc }), mk({ F, anchor: anc }), obj(id), D, 'hard');
  console.log(id, D, F / g, anc, r.result, 'vL', r.vL, JSON.stringify(r.fireball));
}
