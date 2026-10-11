global.window = {};
const which = process.argv[2];
const P = require(which === 'exact' ? './engine_exact.js' : '/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA; const g = 9.80665;
const build = process.argv[3] || 'rex';
const mk = (b) => b === 'human' ? P.makeBody({ H: 2, m: 180, build: 'human' }) : P.makeBody({ H: 3.048, m: 0, build: 'rex' });
const mkO = (b) => b === 'human' ? P.makeBody({ H: 2, m: 180, build: 'ollie' }) : P.makeBody({ H: 3.048, m: 0, build: 'ollie' });
const surface = D.surfaces.find((s) => s.id === 'concrete');
const res = {};
const ids = ['piano', 'tank', 'loco', 'shuttle', 'liberty', 'eiffel', 'titanic', 'nimitz', 'esb', 'pyramid', 'ruyi'];
for (const id of ids) for (let lk = 6; lk <= 22; lk += 1) for (const ld of [1, 2, 3, 4, 5, 6, 7]) {
  const o = D.objects.find((x) => x.id === id);
  const cR = { F: Math.pow(10, lk) * g, mode: 'comic', body: mk(build), surface, groundHolds: false, anchor: 'friction' };
  const cO = Object.assign({}, cR, { body: mkO(build) });
  const Dd = Math.max(P.catchMinD(cR.body, cO.body, o), Math.pow(10, ld));
  const a = P.catchLeg(cR, cO, o, Dd, 'hard');
  res[id + '|' + lk + '|' + ld] = a.result + (a.result === 'fireball' ? '@' + Math.round(a.vL) : '') + (a.result === 'overshoots' ? (a.escaped ? ':esc' : ':orb') : '');
}
console.log(JSON.stringify(res));
