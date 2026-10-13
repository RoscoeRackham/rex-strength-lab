const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
global.window = {}; require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA;
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const ollie = P.makeBody({ build: 'ollie', H: 3.06, m: 3007 });
const sand = D.surfaces.find(s => s.id === 'sand');
const g = P.K.g;
const base = { mode: 'comic', surface: sand, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
for (const kg of [1e4, 1e5]) {
  const cA = Object.assign({}, base, { F: kg * g, body: ollie });
  const cB = Object.assign({}, base, { F: kg * g, body: rex });
  const q = P.collide(cA, cB, { source: 'jump', gb: 0, bounce: false });
  console.log('kg', kg, 'v0', q.v0 && q.v0.toFixed(2), 'outcome', q.outcome, 'hold', q.hold && q.hold.why, 'toGround', q.toGround);
}
const qult = sand.qult * rex.footB / sand.Bref, Nmax = qult * 2 * rex.footArea;
console.log('Nmax', Nmax.toFixed(0), 'Nmax-WR', (Nmax - rex.m * g).toFixed(0), '(Nmax-WR)*T', ((Nmax - rex.m * g) * P.limbPulse(rex)).toFixed(1), 'WR+WO', ((rex.m + ollie.m) * g).toFixed(0));
