const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
global.window = {}; require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA;
const body = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const sand = D.surfaces.find(s => s.id === 'sand');
const g = P.K.g;
const car = D.objects.find(o => o.id === 'car');
const ctx = (kg, o) => Object.assign({ F: kg * g, mode: 'comic', body, surface: sand, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: false }, o || {});
const qult = sand.qult * body.footB / sand.Bref, Nmax = qult * 2 * body.footArea;
for (const kg of [1e5, 1e6]) {
  const r = P.throwObject(ctx(kg), car, 45);
  const tg = r.toGround, th = Math.PI / 4;
  const J = tg.J + (tg.supplied || 0);
  const Jh = J * Math.cos(th);
  const muCap = sand.mu * Nmax * tg.T;
  const src = P.impulseSource(sand, tg.J, tg.T);
  const srcCap = P.impulseSource(sand, Math.hypot(Math.min(Jh, muCap), 0), tg.T);
  console.log('kg', kg, 'v', r.v.toFixed(1), 'recoilV', r.recoilV.toFixed(2), 'anchor.R', r.anchor.R, 'T', tg.T.toFixed(4), 'J', J.toFixed(0), 'Jground', tg.J.toFixed(0), 'Jh', Jh.toFixed(0), 'mu', sand.mu, 'mu Nmax T', muCap.toFixed(0));
  console.log('   ppv@5m engine push-only mm/s', (P.ppvAt(src, 5) * 1000).toFixed(1), 'capped horiz', (P.ppvAt(srcCap, 5) * 1000).toFixed(2));
  const sh = P.RESTRAINT.MOVES.throw.shake(r, { surface: sand, body, obj: car, m: body.m, unbreakable: true, ownRecoil: false, near: 5 });
  console.log('   MOVES.throw.shake ppv@5m', (P.ppvAt(sh, 5) * 1000).toFixed(1), Array.isArray(sh) ? sh.length : 1);
}
