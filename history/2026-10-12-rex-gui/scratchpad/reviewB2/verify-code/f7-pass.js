global.window = {}; require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js'); const D = window.DINO_DATA;
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
const g = P.K.g, obj = (id) => D.objects.find((o) => o.id === id), surf = (id) => D.surfaces.find((s) => s.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), M = P.RESTRAINT.MOVES;
for (const kg of [5e4, 6e4, 7e4]) {
  const c = { F: kg * g, mode: 'comic', body: rex, surface: surf('concrete'), anchor: 'friction', airAbsorb: 0.6, safePassenger: true };
  const r = P.throwObject(c, obj('person'), 30), o = { obj: obj('person'), angle: 30, safePassenger: true };
  const dg = P.PASSENGER.dragG(obj('person'), r.v);
  console.log(kg, 'v', r.v.toFixed(1), 'dragG', dg.toFixed(2), 'p@60%', M.throw.passenger(r, Object.assign({ airAbsorb: 0.6 }, o)), 'p@0%', M.throw.passenger(r, Object.assign({ airAbsorb: 0 }, o)), 'noHarm(1)', P.PASSENGER.noHarm(1));
}
