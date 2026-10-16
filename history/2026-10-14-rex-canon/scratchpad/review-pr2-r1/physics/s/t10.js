const { P, D, g, c, surf, obj, rex, ollie, ON, ctxOf, DEF, sig } = require('./hv.js');
let worst = 0, wcase = '';
for (const F of [DEF, 3 * DEF, 1e6 * g, 1e7 * g, 1e8 * g, 1e9 * g, 1e12 * g]) for (const oid of ['car', 'bus', 'baseball', 'semi', 'person', 'piano']) for (const Dd of [10, 30, 100, 1000]) for (const sid of ['concrete', 'sand']) {
  const cT = ctxOf(F, Object.assign({ surface: surf(sid) }, ON)), cC = Object.assign({}, cT, { body: ollie });
  let L; try { L = P.catchLeg(cT, cC, obj(oid), Dd, 'hard'); } catch (e) { continue; }
  if (!L.recoilAbsorbedT || !L.aim) continue;
  const m = obj(oid).m, pFlight = P.vToMomentum(L.aim.vL, m), J = L.recoilAbsorbedT.J;
  const rel = Math.abs(J - pFlight) / pFlight;
  if (rel > worst) { worst = rel; wcase = [sig(F / g), oid, Dd, sid, L.result, 'vL', sig(L.aim.vL), 'th', sig(L.aim.thetaDeg), 'J', sig(J), 'm vL', sig(pFlight), 'exact v', sig(P.catchReleaseTable(cT, obj(oid)).at(L.aim.thetaDeg).v)].join(' '); }
}
console.log('worst rel diff between RAT J and the flight momentum', sig(worst), wcase);
