const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
global.window = {}; require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA;
const body = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const sand = D.surfaces.find(s => s.id === 'sand');
const g = P.K.g;
const ctx = (kg, o) => Object.assign({ F: kg * g, mode: 'comic', body, surface: sand, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true }, o || {});
const ball = D.objects.find(o => o.id === 'baseball');
const qult = (sand.granular ? sand.qult * body.footB / sand.Bref : sand.qult);
const Nmax = qult * 2 * body.footArea;
const W = (body.m + ball.m) * g;
const R = P.RESTRAINT;
console.log(Object.keys(R));
for (const kg of [1e6, 1e8, 1e9]) {
  const r = P.throwObject(ctx(kg), ball, 90);
  const tg = r.toGround;
  const J = tg.J + (tg.supplied || 0);
  const jr = Math.min(J, Math.max(0, Nmax - W) * tg.T);
  const src = (j) => P.impulseSource ? P.impulseSource(sand, j, tg.T) : null;
  console.log('kg', kg, 'v', r.v.toExponential(3), 'push.t', r.push.t.toExponential(3), 'T', tg.T.toFixed(4), 'sinkRatioRaw', r.sinkRatioRaw.toExponential(3), 'J', J.toFixed(1), 'Jg', tg.J.toExponential(3), 'share%', (tg.J / J * 100).toExponential(3), 'jumpRule', jr.toFixed(1), (jr / J * 100).toFixed(1) + '%');
  const shake = R.MOVES.throw.shake ? R.MOVES.throw.shake(r, { surface: sand, body, obj: ball, m: body.m, unbreakable: true, ownRecoil: true }) : null;
  console.log('   engine shake ppv@5m mm/s', shake ? (P.ppvAt ? P.ppvAt(shake, 5) * 1000 : (R.ppvAt(shake, 5) * 1000)) : 'n/a');
}
