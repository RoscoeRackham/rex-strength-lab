const { P, D, g, c, surf, obj, rex, ollie, ON, ctxOf, DEF, sig } = require('./hv.js');
const pOfE = (E, m) => (E > 0 ? (isFinite(E) ? Math.sqrt(E * E + 2 * E * m * c * c) / c : Infinity) : 0);
const STATES = { on: ON, off: {}, unbrOnly: { unbreakable: true }, ownOnly: { ownRecoil: true }, onAir0: Object.assign({}, ON, { airAbsorb: 0 }) };
for (const [F, dl] of [[DEF, 'def'], [1e9 * g, '1e9'], [1e12 * g, '1e12'], [1e20 * g, '1e20']]) for (const [oid, Dd] of [['bus', 10], ['car', 30], ['baseball', 10], ['person', 10]]) for (const style of ['hard', 'easy']) for (const [sn, st] of Object.entries(STATES)) {
  if (process.env.VER === 'main' && sn !== 'on' && sn !== 'off' && sn !== 'onAir0') continue;
  const cT = ctxOf(F, st), cC = Object.assign({}, cT, { body: ollie });
  let L; try { L = P.catchLeg(cT, cC, obj(oid), Dd, style); } catch (e) { console.log(dl, oid, style, sn, 'ERR', e.message); continue; }
  const k = L.catch;
  let s = [dl, oid, Dd, style, sn, L.result];
  if (L.vArrive != null) s.push('vArr ' + sig(L.vArrive));
  if (k) s.push('clean ' + k.clean, 'vSlam ' + sig(k.vSlam), 'uAfter ' + sig(k.uAfter), 'slide ' + sig(k.slide), 'carried ' + k.carried, 'rel ' + !!k.relativistic, 'pIn ' + sig(k.pIn), 'Ecatch ' + sig(k.Ecatch), 'F ' + sig(k.F), 'Fcap ' + sig(k.Fcap), 'tStroke ' + sig(k.tStroke));
  if (L.recoilAbsorbedT) s.push('RAT ' + sig(L.recoilAbsorbedT.J) + '@' + sig(L.recoilAbsorbedT.thetaDeg, 3));
  if (L.recoilAbsorbedC) s.push('RAC ' + sig(L.recoilAbsorbedC.J) + '@' + sig(L.recoilAbsorbedC.angleDeg, 3));
  if (L.toGroundT) s.push('TGT ' + sig(L.toGroundT.J));
  if (L.toGroundC) s.push('TGC ' + sig(L.toGroundC.J));
  if (L.aim) s.push('vL ' + sig(L.aim.vL), 'th ' + sig(L.aim.thetaDeg, 3));
  if (L.recoil) s.push('recoilv ' + sig(L.recoil.v));
  console.log(s.join(' '));
}
