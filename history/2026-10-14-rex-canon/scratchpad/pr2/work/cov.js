global.window = {};
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js'); require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g, surf = (id) => D.surfaces.find((s) => s.id === id), obj = (id) => D.objects.find((o) => o.id === id);
const R3 = P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex)), O3 = P.makeBody(Object.assign({ build: 'ollie' }, P.DEFAULT_BODIES.ollie));
const ON = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
const STATES = [['off', {}], ['on', ON], ['UB', { unbreakable: true }], ['OR', { ownRecoil: true }], ['on,b', Object.assign({ anchor: 'bolted' }, ON)], ['off,b', { anchor: 'bolted' }]];
for (const [lab, st] of STATES) for (const F of [100 * 907.18474 * g, 1e9 * g, 1e12 * g]) {
  const c = Object.assign({ F, mode: 'comic', body: R3, surface: surf('concrete'), anchor: 'friction' }, st), cO = Object.assign({}, c, { body: O3, anchor: 'friction' });
  for (const D_ of [30]) { const L = P.catchLeg(c, cO, obj('car'), D_, 'hard'); const L2 = P.catchLeg(c, cO, obj('car'), 30, 'easy');
    const r = P.collide(Object.assign({}, c, { body: O3 }), c, { source: 'sprint' });
    console.log(lab.padEnd(6), (F / g).toExponential(1), 'hard', L.result, L.catch ? 'slips ' + L.catch.slips + ' uA ' + L.catch.uAfter.toPrecision(3) : '', '| easy', L2.result, '| collide', r.outcome, r.held, '| toss', P.tossPartner(c, O3, 'Ollie', 'easy', 10, 'friction').result);
  }
}
