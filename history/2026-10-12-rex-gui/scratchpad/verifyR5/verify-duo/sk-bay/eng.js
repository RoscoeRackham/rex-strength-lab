global.window = {};
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), ollie = P.makeBody({ build: 'ollie', H: 3.048, m: 3007 });
const sf = D.surfaces.find(s => s.id === 'concrete');
const kg = 113e3 / 1; // approx; effort use from page: lifting 113 t
for (const ub of [false, true]) for (const tg of [false, true]) {
  const base = { F: kg * g, mode: 'comic', surface: sf, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: ub, ownRecoil: true };
  const cA = Object.assign({}, base, { body: ollie }), cB = Object.assign({}, base, { body: rex });
  const r = P.collide(cA, cB, { source: 'jump', gb: Math.pow(10, 0), bounce: false, toGround: tg });
  console.log(`ub=${ub} toGround=${tg}: dir=${r.dir} outcome=${r.outcome} held=${r.held} hold=${r.hold && r.hold.H.toExponential(3)} why=${r.hold && r.hold.why} pA=${r.pA && r.pA.toFixed(0)} toGround=${JSON.stringify(r.toGround)} partial=${r.partial ? JSON.stringify({Jearth: r.partial.Jearth, tau: r.partial.tau}) : null} depth=${r.after && r.after.splat && r.after.splat.depth}`);
}
