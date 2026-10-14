const { P, D, rex, surf, obj, ctx, ON } = require('./h.js');
const RS = P.RESTRAINT;
const s = 'sand', q = P.qultFor(surf(s), rex.footB), Nmax = q * 2 * rex.footArea, mu = surf(s).mu;
for (const pw of [{ unbreakable: true }, { unbreakable: true, ownRecoil: true }, {}]) for (const kg of [90718, 1e6]) for (const th of [45, 20, 70]) {
  const c = ctx(Object.assign({ kg, s }, pw));
  const r = P.throwOnce(c, obj('car'), th);
  const tg = r.toGround;
  const o = Object.assign({ near: 5, body: rex, surface: surf(s), anchor: 'friction', m: rex.m, obj: obj('car'), angle: th }, pw);
  const src = RS.MOVES.throw.shake(r, o);
  const t = th * Math.PI / 180;
  const Jfull = tg ? tg.J + (tg.supplied || 0) : 0;
  const Jh = Jfull * Math.cos(t), T = tg ? tg.T : 0;
  const JhCap = Math.min(Jh, mu * Nmax * T);
  console.log(JSON.stringify(pw), kg, th, 'v', r.v.toFixed(1), 'recoilV', r.recoilV.toFixed(2), 'sinkRaw', (r.sinkRatioRaw || 0).toFixed(1), 'J', tg && tg.J.toFixed(0), 'Jh', Jh.toFixed(0), 'T', T.toFixed(3), 'mu*Nmax*T', (mu * Nmax * T).toFixed(0), 'ppv5', (P.ppvAt(src, 5) * 1e3).toFixed(2), 'mm/s; plasterReach', P.plasterReach(src).toFixed(1), 'from', RS.MOVES.throw.shakeFrom(r, o));
}
