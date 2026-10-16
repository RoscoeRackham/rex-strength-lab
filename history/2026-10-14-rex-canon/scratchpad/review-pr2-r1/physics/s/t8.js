const { P, D, g, c, surf, obj, rex, ollie, ON, ctxOf, DEF, sig } = require('./hv.js');
const pOfE = (E, m) => (E > 0 ? (isFinite(E) ? Math.sqrt(E * E + 2 * E * m * c * c) / c : Infinity) : 0);
for (const [F, dl] of [[DEF, 'def'], [1e9 * g, '1e9'], [1e20 * g, '1e20']]) for (const [sn, st] of Object.entries({ on: ON, off: {}, unbr: { unbreakable: true }, own: { ownRecoil: true } })) for (const style of ['easy', 'hard']) {
  if (process.env.VER === 'main' && (sn === 'own' || sn === 'unbr')) continue;
  const cx = ctxOf(F, st);
  let t; try { t = P.tossPartner(cx, ollie, 'Ollie', style, 10, 'friction'); } catch (e) { console.log(dl, sn, style, 'ERR', e.message); continue; }
  const s = [dl, sn, style, t.result, 'v', sig(t.v)];
  if (t.flight) s.push('vImp', sig(t.flight.vImpact));
  if (t.catch) s.push('clean', t.catch.clean, 'uAfter', sig(t.catch.uAfter), 'vSlam', sig(t.catch.vSlam), 'tS', sig(t.catch.tStroke), 'sinkRaw', sig(t.catch.sinkRatioRaw));
  if (t.recoilAbsorbedT) s.push('RAT', sig(t.recoilAbsorbedT.J), 'indep m v', sig(P.vToMomentum(t.v, ollie.m)), 'T', sig(t.recoilAbsorbedT.T));
  if (t.recoilAbsorbedC) s.push('RAC', sig(t.recoilAbsorbedC.J), 'indep', t.flight ? sig(P.vToMomentum(t.flight.vImpact, ollie.m)) : '-');
  if (t.toGroundT) s.push('TGT', sig(t.toGroundT.J));
  if (t.toGroundC) s.push('TGC', sig(t.toGroundC.J));
  console.log(s.join(' '));
}
// wrestle throw
for (const [F, dl] of [[DEF, 'def'], [1e9 * g, '1e9']]) for (const [sn, st] of Object.entries({ on: ON, off: {}, unbr: { unbreakable: true }, own: { ownRecoil: true } })) {
  if (process.env.VER === 'main' && (sn === 'own' || sn === 'unbr')) continue;
  const cx = ctxOf(F, st), cO = Object.assign({}, cx, { body: ollie });
  const tp = P.throwPartner(cx, cO, 45), r = tp.r;
  if (!r) { console.log('WT', dl, sn, JSON.stringify(Object.keys(tp))); continue; }
  console.log('WT', dl, sn, 'v', sig(r.v), 'pO', sig(pOfE(r.Eobj, ollie.m)), 'RA', r.recoilAbsorbed ? sig(r.recoilAbsorbed.J) : '-', 'TG', r.toGround ? sig(r.toGround.J) : '-', 'land', tp.landToGround ? sig(tp.landToGround.J) : '-', 'sink', sig(r.sinkRatio), 'raw', sig(r.sinkRatioRaw), 'indepW', sig((rex.m + ollie.m) * g));
}
