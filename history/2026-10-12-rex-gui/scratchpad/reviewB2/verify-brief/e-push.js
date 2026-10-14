// Push match and Collide push, both bolted, on real ground and with Unbreakable footing
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
global.window = {}; require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const surface = D.surfaces.find((s) => s.id === 'concrete');
const mk = (kg, build, unb) => ({ F: kg * g, mode: 'comic', surface, anchor: 'bolted', airAbsorb: 1, keepForm: true, ownRecoil: true, unbreakable: unb, body: P.makeBody({ build, H: 3.048, m: 3007 }) });
for (const kg of [1e4, 5e4, 7e4, 7.2e4, 9.07e4, 1e5, 1e6, 1e9]) {
  for (const unb of [false, true]) {
    const r = P.pushMatch(mk(kg, 'rex', unb), mk(kg, 'ollie', unb));
    const c = P.collide(mk(kg, 'ollie', unb), mk(kg, 'rex', unb), { source: 'sprint', gb: 1e-6, bounce: false, push: true });
    console.log('kg', kg.toExponential(2), 'unbreakable', unb, 'pushMatch outcome', r.outcome, 'tear', r.tear && r.tear.toFixed(3));
  }
}
