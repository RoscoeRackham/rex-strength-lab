global.window = {};
const P = require(process.argv[2] + '/src/engine.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), ollie = P.makeBody({ build: 'ollie', H: 3.048, m: 3007 });
const sf = D.surfaces.find(s => s.id === 'concrete');
for (const th of [10, 45]) {
  let prev = null, bad = [];
  for (let lg = 4.5; lg <= 7; lg += 0.01) {
    const cA = Object.assign({ F: Math.pow(10, lg) * g, mode: 'comic', body: rex, surface: sf, anchor: 'friction' }, { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true });
    const t = P.throwPartner(cA, Object.assign({}, cA, { body: ollie }), th);
    if (!t.r || !t.r.flight || !t.r.flight.landed) continue;
    const mo = { obj: t.obj, surface: sf };
    const s = t.landToGround ? P.impulseSource(sf, t.landToGround.J, t.landToGround.T) : P.RESTRAINT.MOVES.throw.landShake(t.r, mo);
    const pl = P.ppvAt(s, 5);
    if (prev && pl < prev.pl * (1 - 1e-6)) bad.push(`lg ${prev.lg.toFixed(2)}->${lg.toFixed(2)} (${(Math.pow(10,lg)/907.18474).toFixed(0)} st): ppv5 ${prev.pl.toFixed(4)} -> ${pl.toFixed(4)} mm/s, J ${prev.J.toFixed(0)} -> ${(t.landToGround ? t.landToGround.J : P.vToMomentum(t.r.flight.vImpact, ollie.m)).toFixed(0)}`);
    prev = { lg, pl, J: t.landToGround ? t.landToGround.J : P.vToMomentum(t.r.flight.vImpact, ollie.m) };
  }
  console.log(`th=${th}: ${bad.length} drops`); console.log(bad.slice(0, 5).join('\n'));
}
