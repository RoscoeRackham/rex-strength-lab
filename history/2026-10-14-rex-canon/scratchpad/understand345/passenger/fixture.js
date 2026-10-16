// Which powers-off fixture cases (test/powers.js part 1) change if MOVES.throw.passenger stops firing with Safe passenger on?
global.window = {};
const ROOT = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/main-tree/rex-strength-lab';
const P = require(ROOT + '/src/engine.js');
require(ROOT + '/src/data.js');
const D = window.DINO_DATA;
const { cases, canon, hash, OFF } = require(ROOT + '/test/powers-off-cases.js');
const base = require(ROOT + '/test/fixtures/powers-off.json').fingerprints;
P.BUILDS.rex.kV = P.BUILDS.ollie.kV = 0.10017;
const M = P.RESTRAINT.MOVES, oldPass = M.throw.passenger;
const list = cases(P, D).filter((c) => /^plan\|throw\|person/.test(c.key) || /safePassenger/.test(c.key));
console.log('person-throw plan cases:', list.length, list.map((c) => c.key).join(' ; '));
for (const mode of ['main', 'PR3']) {
  M.throw.passenger = mode === 'PR3' ? (r, o) => (o.safePassenger ? false : oldPass(r, o)) : oldPass;
  for (const [lab, extra] of [['left out', {}], ['OFF', OFF]]) {
    const diff = [];
    for (const c of list) { const got = hash(canon(c.run(extra))); if (got !== base[c.key]) diff.push(c.key); }
    console.log(mode, lab, 'differ:', diff.length, diff.join(' ; '));
  }
}
