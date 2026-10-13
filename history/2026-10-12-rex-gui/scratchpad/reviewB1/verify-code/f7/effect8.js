global.window = {};
const S = process.argv[2];
require(S + '/branch/rex-strength-lab/src/data.js'); const D = window.DINO_DATA;
const L = (n) => require(n === 'base' ? S + '/branch/rex-strength-lab/src/engine.js' : S + '/f7/' + n + '/src/engine.js');
const obj = (id) => D.objects.find((o) => o.id === id), surf = D.surfaces.find((s) => s.id === 'concrete');
const ON = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
for (const n of ['base', 'E7', 'E8', 'E12', 'E14']) {
  const P = L(n); const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), ollie = P.makeBody({ build: 'ollie', H: 3.048, m: 3007 });
  const c = (kg, x) => Object.assign({ F: kg * P.K.g, mode: 'comic', body: rex, surface: surf, anchor: 'friction' }, ON, x || {});
  const lg = P.catchLeg(c(1e6), c(1e6, { body: ollie }), obj('baseball'), 1e4, 'hard');
  const ts = P.tossPartner(c(1e6), ollie, 'Ollie', 'hard', 10, 'friction');
  const sh = P.shove(c(1e6), c(1e6, { body: ollie }));
  const fb = P.catchLeg(c(1e20, { airAbsorb: 0.5 }), c(1e20, { body: ollie, airAbsorb: 0.5 }), obj('baseball'), 1000, 'hard');
  console.log(n.padEnd(4), 'catch@100% vL', lg.aim && lg.aim.vL.toPrecision(4), 'drag.E', lg.drag && lg.drag.E && lg.drag.E.toPrecision(3), '| toss v', ts.v && ts.v.toPrecision(4), ts.result, '| shove toGround.J', sh.toGround && sh.toGround.J.toPrecision(3), '| fireball@50% Egap', fb.fireball && fb.fireball.Egap.toPrecision(3));
}
