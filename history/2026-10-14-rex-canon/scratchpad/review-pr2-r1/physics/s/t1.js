const { P, g, c, surf, obj, rex, ON, OFF, ctxOf, DEF, sig, pOfE, pOfV } = require('./h.js');
const states = { on: ON, off: OFF, unbrOnly: { unbreakable: true }, ownOnly: { ownRecoil: true } };
for (const F of [DEF, 1e9 * g, 1e20 * g]) for (const sid of ['concrete', 'sand']) for (const oid of ['car', 'bus', 'baseball']) for (const th of [0, 45, 90]) {
  const row = [];
  for (const [sn, st] of Object.entries(states)) {
    const ctx = ctxOf(F, Object.assign({ surface: surf(sid) }, st));
    const r = P.throwObject(ctx, obj(oid), th);
    if (!r.canMove) { row.push(sn + ':cant'); continue; }
    const pO = pOfE(r.Eobj, obj(oid).m), pV = pOfV(r.v, obj(oid).m);
    const ra = r.recoilAbsorbed, tg = r.toGround;
    let s = sn + ': pObj ' + sig(pO) + (Math.abs(pV - pO) > 1e-6 * pO && isFinite(pO) ? '(pV ' + sig(pV) + ')' : '') + ' recoilV ' + sig(r.recoilV, 3);
    if (ra) s += ' RA ' + sig(ra.J) + ' relerr ' + sig((ra.J - pO) / pO, 2) + ' th ' + ra.thetaDeg + ' T ' + sig(ra.T, 3);
    if (tg) s += ' TG ' + sig(tg.J) + (tg.supplied ? ' sup ' + sig(tg.supplied) : '');
    s += ' sink ' + sig(r.sinkRatio, 3) + (r.sinkRatioRaw != null ? ' raw ' + sig(r.sinkRatioRaw, 3) : '');
    // check: with ownRecoil on, Nfeet == (m+M)g
    if (st.ownRecoil && r.anchor && isFinite(r.anchor.Nmax)) { const want = (rex.m + obj(oid).m) * g / r.anchor.Nmax; if (Math.abs(r.sinkRatio - want) > 1e-9 * want) s += ' SINKMISMATCH'; }
    row.push(s);
  }
  console.log(sig(F / g, 3) + 'kg ' + sid + ' ' + oid + ' ' + th + ': ' + row.join(' | '));
}
