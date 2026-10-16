// The scratch PR3 engine (passenger split; landing blast taken back with Safe passenger) against the powers-off fixture:
// every case whose key mentions a person, plus every plan case run with the switches (sw) on. Then with main's
// passenger rule restored by a test-side shim.
global.window = {};
const ROOT = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/main-tree/rex-strength-lab';
const ENG = __dirname + '/engine-pr3.js';
require(ROOT + '/src/data.js');
const D = window.DINO_DATA;
const { cases, canon, hash, OFF } = require(ROOT + '/test/powers-off-cases.js');
const base = require(ROOT + '/test/fixtures/powers-off.json').fingerprints;
const only = process.argv[2] === 'all' ? () => true : (k) => /person/.test(k) || (/^plan\|/.test(k) && /\|5$/.test(k));
for (const shim of [false, true]) {
  delete require.cache[require.resolve(ENG)];
  const P = require(ENG);
  P.BUILDS.rex.kV = P.BUILDS.ollie.kV = 0.10017;
  const T = P.RESTRAINT.MOVES.throw, K = P.K;
  if (shim) T.passenger = (r, o) => !!o.obj.passenger && r.canMove && ((!o.safePassenger && r.launchG > 0 && P.PASSENGER.felt(Math.max(r.launchG, r.launchGPeak || 0), o.angle) > P.PASSENGER.noHarm(r.launchT)) || P.PASSENGER.dragG(o.obj, r.v) * P.dragFactor(o) > P.PASSENGER.noHarm(1));
  const list = cases(P, D).filter((c) => only(c.key));
  for (const [lab, extra] of [['left out', {}], ['OFF', OFF]]) {
    const diff = []; let missing = 0;
    for (const c of list) { const want = base[c.key]; if (!want) { missing++; continue; } if (hash(canon(c.run(extra))) !== want) diff.push(c.key); }
    console.log((shim ? 'PR3 engine + main passenger shim' : 'PR3 engine') + ' | ' + lab + ' | ' + list.length + ' cases, ' + missing + ' missing, ' + diff.length + ' differ' + (diff.length ? ': ' + diff.join(' ; ') : ''));
  }
}
