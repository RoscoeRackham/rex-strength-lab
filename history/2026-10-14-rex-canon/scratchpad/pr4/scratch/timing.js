// Times each two-player engine function over an effort sweep like the page's two-player effort search (60 efforts,
// log-spaced from the walking need to the default dial), with the page's default powers on and with them off, for
// pull request 3's engine (scratchpad copy) and this branch's. Best of 5 runs each.
global.window = {};
const ENGINES = { pr3: '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/pr4/base/engine.js', pr4: '/home/user/rex-strength-lab/rex-strength-lab/src/engine.js' };
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA;
const surf = (id) => D.surfaces.find((x) => x.id === id), obj = (id) => D.objects.find((x) => x.id === id);
const Ps = {}; for (const [k, f] of Object.entries(ENGINES)) { delete require.cache[require.resolve(f)]; Ps[k] = require(f); }
const g = 9.80665, dial = 100 * 907.18474 * g, need = 1.2 * 3000 * g / 1.4;
const N = 60, efforts = Array.from({ length: N }, (_, i) => need * Math.pow(dial / need, i / (N - 1)));
const POW = { on: { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, safePassenger: true, noKnockback: true }, off: {} };
const CASES = [
  ['armWrestle', (P, a, b) => P.armWrestle(a, b)], ['pushMatch', (P, a, b) => P.pushMatch(a, b)], ['shove', (P, a, b) => P.shove(a, b)], ['shoveBoth', (P, a, b) => P.shoveBoth(a, b)],
  ['liftPartner', (P, a, b) => P.liftPartner(a, b)], ['throwPartner 45', (P, a, b) => P.throwPartner(a, b, 45)], ['standoff', (P, a, b) => P.standoff(b, a)],
  ['collide sprint', (P, a, b) => P.collide(b, a, { source: 'sprint' })], ['collide sprint bounce', (P, a, b) => P.collide(b, a, { source: 'sprint', bounce: true })], ['collide jump', (P, a, b) => P.collide(b, a, { source: 'jump' })],
  ['collide stomp', (P, a, b) => P.collide(b, a, { source: 'stomp' })], ['collide set 0.1% c', (P, a, b) => P.collide(b, a, { source: 'set', gb: 0.001 })],
  ['catchLeg ball 10 m hard', (P, a, b) => P.catchLeg(a, b, obj('baseball'), 10, 'hard')], ['catchLeg car 1 km hard', (P, a, b) => P.catchLeg(a, b, obj('car'), 1000, 'hard')], ['tossPartner', (P, a, b) => P.tossPartner(a, b.body, 'Ollie', 'easy', 10, 'friction')],
];
const rows = [];
for (const [pw, x] of Object.entries(POW)) for (const [lab, f] of CASES) {
  const t = {};
  for (const [k, P] of Object.entries(Ps)) {
    const R = P.makeBody({ build: 'rex', ...P.DEFAULT_BODIES.rex }), O = P.makeBody({ build: 'ollie', ...P.DEFAULT_BODIES.ollie });
    let best = Infinity;
    for (let rep = 0; rep < 5; rep++) {
      const t0 = process.hrtime.bigint();
      for (const F of efforts) { const a = Object.assign({ F, mode: 'comic', body: R, surface: surf('concrete'), anchor: 'friction' }, x), b = Object.assign({}, a, { body: O }); f(P, a, b); }
      best = Math.min(best, Number(process.hrtime.bigint() - t0) / 1e6);
    }
    t[k] = best;
  }
  rows.push([pw, lab, t.pr3, t.pr4]);
}
console.log('powers'.padEnd(7), 'function'.padEnd(26), 'PR 3 (ms/60 efforts)'.padStart(22), 'PR 4'.padStart(10), 'ratio'.padStart(7));
for (const [pw, lab, a, b] of rows) console.log(pw.padEnd(7), lab.padEnd(26), a.toFixed(2).padStart(22), b.toFixed(2).padStart(10), (b / a).toFixed(2).padStart(7));
