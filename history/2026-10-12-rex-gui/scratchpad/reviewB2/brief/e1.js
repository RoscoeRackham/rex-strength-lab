global.window = {}; const P = require('./repo/rex-strength-lab/src/engine.js'); require('./repo/rex-strength-lab/src/data.js'); const D = window.DINO_DATA; const g = P.K.g;
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), ol = P.makeBody({ build: 'ollie', H: 3.048, m: 3007 });
for (const lk of [4, 5, 6, 9]) for (const ub of [false, true]) {
  const c = (b) => ({ F: Math.pow(10, lk) * g, mode: 'comic', body: b, surface: D.surfaces.find((s) => s.id === 'concrete'), anchor: 'bolted', unbreakable: ub, keepForm: true, ownRecoil: true, airAbsorb: 1 });
  const r = P.pushMatch(c(rex), c(ol)); console.log('push both bolted 1e' + lk + ' unbreakable=' + ub, r.outcome, 'tear', r.tear && r.tear.toPrecision(3), 'toGround', JSON.stringify(r.toGround));
}
