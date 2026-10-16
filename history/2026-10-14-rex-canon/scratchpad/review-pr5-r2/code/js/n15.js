const H = require('./h.js')();
const { P, g, R3, O3, c9, sig } = H;
const seen = {};
for (const kg of [1e2, 1e4, 9e4, 1e6, 1e8, 1e10, 1e12, 1e14, 1e16, 1e18, 1e20, Infinity]) for (const x of [{}, { anchor: 'bolted' }, { ownRecoil: false }, { unbreakable: false }, { noKnockback: false }]) {
  for (const o of [{ source: 'sprint' }, { source: 'jump' }, { source: 'stomp' }, { source: 'set', gb: 1e-6 }, { source: 'set', gb: 1e-3 }, { source: 'set', gb: 1 }, { source: 'set', gb: 1e3 }, { source: 'set', gb: Infinity }, { source: 'set', gb: 1e-3, bounce: true }, { source: 'set', gb: 1e-3, meanIt: true }, { source: 'set', gb: 1e-3, toGround: true }]) {
    for (const [A, B] of [[c9(kg * g, O3, x), c9(kg * g, R3, x)], [c9(kg * g, O3, x), c9(kg * g, R3, Object.assign({ anchor: 'bolted' }, x))], [c9(kg * g, P.makeBody({ build: 'ollie', H: 3.06, m: 1e6 }), x), c9(kg * g, R3, x)]]) {
      let r; try { r = P.collide(A, B, o); } catch (e) { continue; }
      const k = r.outcome + (r.hitAbsorbed ? ' hitAbs' + (r.hitAbsorbed.E > 0 ? '>0' : '=0') : '') + (r.carry && r.carry.stop ? ' stop' + (r.carry.stop.E > 0 ? '>0' : '=0') : '');
      seen[k] = (seen[k] || 0) + 1;
    }
  }
}
console.log(seen);
