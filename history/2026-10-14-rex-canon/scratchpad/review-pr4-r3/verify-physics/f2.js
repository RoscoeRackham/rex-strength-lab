const R = __dirname + '/repo/rex-strength-lab/src/';
const P = require(R + 'engine.js'); global.window = {}; require(R + 'data.js'); const D = window.DINO_DATA;
const surf = (id) => D.surfaces.find(s => s.id === id);
const rex = P.makeBody({ build: 'rex', ...P.DEFAULT_BODIES.rex }), ol = P.makeBody({ build: 'ollie', ...P.DEFAULT_BODIES.ollie });
const ctx = (kg, body, o) => Object.assign({ F: kg * P.K.g, mode: 'comic', body, surface: surf('concrete'), anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true }, o || {});
const run = (kg) => P.collide(ctx(kg, ol), ctx(kg, rex), { source: 'sprint', bounce: true });
for (const kg of [3310, 3347, 3278]) {
  const r = run(kg);
  const T = r.contact.softEl.t, v = r.vRel;
  console.log(kg, { outcome: r.outcome, v: r.vRel, vB: r.carry.vB, T_el: T, s: r.contact.s, vT: v * T, piS: Math.PI * r.contact.s, slideB: r.after.bounce.slideB, end: v * T + r.after.bounce.slideB, splat: r.after.splat, F: r.contact.softEl.F, carryF: r.carry.F, carryT: r.carry.T });
}
const bis = (f) => { let lo = 1000, hi = 10000; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (f(m) > 5) hi = m; else lo = m; } return lo; };
console.log('slide only reaches 5 m at', bis(kg => run(kg).after.bounce.slideB).toFixed(0));
console.log('slide + contact travel reaches 5 m at', bis(kg => { const r = run(kg); return r.vRel * r.contact.softEl.t + r.after.bounce.slideB; }).toFixed(0));
