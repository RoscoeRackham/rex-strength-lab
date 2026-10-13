const R='/home/user/rex-strength-lab/rex-strength-lab/';
const P = require(R+'src/engine.js'); global.window = {}; require(R+'src/data.js'); const D = window.DINO_DATA;
const mk = (kg, sid, ub) => ({ F: kg * P.K.g, mode: 'comic', body: P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), surface: D.surfaces.find(s => s.id === sid), anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: ub, ownRecoil: true });
for (const ub of [false, true]) {
  const p = P.RESTRAINT.planNow('stomp', mk(1e10, 'sand', ub));
  console.log('unbreakable', ub, p.hazards().map(x => x.id + '=' + (x.never ? 'never' : (x.use / P.K.g).toPrecision(3) + 'kg')).join('  '));
  const r = p.run(3e7 * P.K.g); console.log('  at 3e7 kg: vFoot', r.vFoot.toFixed(0), 'hole', (ub ? r.realHole : r.holeDepth).toFixed(2), 'm crater', r.crater, 'realBreaks', r.realBreaks, 'absorbed', r.absorbed, 'blastE', P.RESTRAINT.MOVES.stomp.blast(r, p.opt));
}
