global.window = {}; const P = require('./repo/src/engine.js'); require('./repo/src/data.js'); const D = window.DINO_DATA;
const g = P.K.g, surf = (id) => D.surfaces.find((s) => s.id === id), obj = (id) => D.objects.find((o) => o.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), ollie = P.makeBody({ build: 'ollie', H: 3.048, m: 3007 });
for (const [oid, lg, D0] of [['car', 9, 100], ['car', 8, 1000], ['baseball', 7, 100], ['shot', 8, 1000]]) {
  const row = [];
  for (const s of [0, 0.5, 0.75]) {
    const cR = { F: Math.pow(10, lg) * g, mode: 'comic', body: rex, surface: surf('concrete'), anchor: 'friction', airAbsorb: s, keepForm: true }, cO = Object.assign({}, cR, { body: ollie });
    const L = P.catchLeg(cR, cO, obj(oid), D0, 'hard');
    const k = P.dragFactor(cR);
    row.push({ s, result: L.result, vL: L.aim && L.aim.vL, dragE: L.drag && L.drag.E, KE: L.aim && 0.5 * obj(oid).m * L.aim.vL * L.aim.vL, judged: k * (L.drag ? L.drag.E : 0) });
  }
  const r0 = row[0];
  console.log(oid, lg, D0, row.map((x) => `${x.s}: ${x.result} v=${x.vL && x.vL.toPrecision(3)} KE=${x.KE && x.KE.toPrecision(3)} airTakes=${x.dragE && x.dragE.toPrecision(3)} judged=${x.judged.toPrecision(3)} (judged/0% ${(x.judged / r0.judged).toPrecision(3)}, airTakes/0% ${(x.dragE / r0.dragE).toPrecision(3)})`).join(' || '));
}
