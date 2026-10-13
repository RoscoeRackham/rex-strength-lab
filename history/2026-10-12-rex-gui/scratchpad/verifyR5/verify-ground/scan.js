global.window = {};
const P = require(process.argv[2] || '/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, K = P.K;
const body = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const surface = D.surfaces.find(s => s.id === 'concrete');
let bad = [], below = 0, exact = 0;
for (let i = 2500; i <= 3400; i++) {
  const lg = i / 100;
  const r = P.stomp({ F: Math.pow(10, lg) * K.g, mode: 'comic', body, surface, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true });
  const b = P.RESTRAINT.MOVES.stomp.blow(r, { body, surface, unbreakable: true, groundHolds: false });
  const m = body.legEff, c = K.c;
  const pE = Math.sqrt(r.E * r.E + 2 * r.E * m * c * c) / c;
  const w = b.whole != null ? b.whole : b.J;
  if (r.vFoot >= c) exact++; else below++;
  if (Math.abs(w / pE - 1) > 0.05) bad.push(lg + ':' + (w / pE).toPrecision(3));
}
console.log('exact c', exact, 'below c', below, 'off >5%:', bad.length);
console.log(bad.join(' '));
