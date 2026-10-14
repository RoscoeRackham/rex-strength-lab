// proposed rule for the thrown partner's landing: sideways whole (he skids it out on unbroken ground) and the downward
// cap floored at what real ground takes at the landing it just bears; check that the ground take never falls with effort
const { P, g, ctxOf, oCtx, sig, surf, ollie } = require('./h.js');
const ang = +(process.argv[2] || 45), sf = surf(process.argv[3] || 'concrete'), own = process.argv[4] !== 'own-off';
let prevNow = 0, prevFix = 0, badNow = [], badFix = [];
for (let lg = 3.5; lg <= 10; lg += 0.05) {
  const cA = ctxOf(Math.pow(10, lg), { surface: sf, ownRecoil: own }), cB = oCtx(cA), t = P.throwPartner(cA, cB, ang), f = t.r.flight;
  if (!t.r.canMove || !f || !f.landed || t.fallsBack) continue;
  const v = f.vImpact, th = f.impactAngleDeg * Math.PI / 180, L = t.obj.L, T = Math.max(1e-3, L / v), J = P.vToMomentum(v, ollie.m);
  const Nmax = P.qultFor(sf, ollie.footB) * 2 * ollie.footArea, bear = Math.max(0, Nmax - ollie.m * g);
  const Jd = J * Math.sin(th), Jh = J * Math.cos(th);
  const floor = Math.sqrt(ollie.m * Math.sin(th) * bear * L);   // m v1 sin(th) at the landing real ground just bears (T = L / v1)
  const Jfix = Math.hypot(Jh, Math.min(Jd, Math.max(bear * T, floor)));
  const now = t.landToGround ? P.impulseSource(sf, t.landToGround.J, t.landToGround.T) : P.impulseSource(sf, J, T);
  const fix = P.impulseSource(sf, Jfix, T);
  const pN = P.plasterReach(now), pF = P.plasterReach(fix);
  if (pN < prevNow * (1 - 1e-6)) badNow.push(lg.toFixed(2) + ':' + sig(prevNow) + '->' + sig(pN));
  if (pF < prevFix * (1 - 1e-6)) badFix.push(lg.toFixed(2) + ':' + sig(prevFix) + '->' + sig(pF));
  prevNow = pN; prevFix = pF;
}
console.log('current rule, plaster reach falls at:', badNow.length ? badNow.slice(0, 4).join(' ') + ' ... (' + badNow.length + ' steps)' : 'never');
console.log('proposed rule, plaster reach falls at:', badFix.length ? badFix.slice(0, 4).join(' ') + ' (' + badFix.length + ' steps)' : 'never');
