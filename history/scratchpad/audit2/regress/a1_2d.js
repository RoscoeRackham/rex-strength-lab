// 2-D check of the throw with a sliding anchor (comic constant force, classical speeds).
// Coordinates: X = Rex horizontal position, s = arm extension along u=(cos th, sin th). Rex stays on the ground (N < Nmax).
const { P, ctx, obj, g } = require('./common.js');
function twoD(F, mA, mB, th, mu, dig, d) {
  const c = Math.cos(th), s_ = Math.sin(th);
  let X = 0, Xd = 0, s = 0, sd = 0, t = 0; const dt = 1e-6;
  let maxN = 0;
  while (s < d) {
    // Unknowns Xdd, sdd. Try static (Xdd=0) first.
    let sdd = (F - mB * g * s_) / mB, Xdd = 0;
    const N0 = (mA + mB) * g + mB * sdd * s_;
    const demand = mB * sdd * c; // horizontal force ground must supply on the system (backward reaction balance)
    if (Xd < 0 || demand > mu * N0 + dig) {
      // sliding backward: friction +mu N + dig acts forward
      // (mA+mB)Xdd + mB sdd c = mu[(mA+mB)g + mB sdd s] + dig ;  sdd = (F - mB g s)/mB - Xdd c
      // => (mA+mB)Xdd + c(F - mB g s) - mB c^2 Xdd = mu(mA+mB)g + mu s (F - mB g s) - mu mB s c Xdd + dig
      const A = (mA + mB) - mB * c * c + mu * mB * s_ * c;
      const B = mu * (mA + mB) * g + mu * s_ * (F - mB * g * s_) + dig - c * (F - mB * g * s_);
      Xdd = B / A; sdd = (F - mB * g * s_) / mB - Xdd * c;
    }
    maxN = Math.max(maxN, (mA + mB) * g + mB * sdd * s_);
    Xd += Xdd * dt; sd += sdd * dt; X += Xd * dt; s += sd * dt; t += dt;
  }
  const vx = Xd + sd * c, vy = sd * s_;
  return { vObj: Math.hypot(vx, vy), angDeg: Math.atan2(vy, vx) * 180 / Math.PI, recoil: -Xd, t, maxN };
}
for (const [lg, oid, ang] of [[4.958, 'car', 45], [4.5, 'car', 45], [4.958, 'car', 30], [4.958, 'piano', 45], [4.958, 'motorcycle', 60]]) {
  const c = ctx({ kg: Math.pow(10, lg) });
  const o = obj(oid);
  const r = P.throwObject(c, o, ang);
  const th = ang * Math.PI / 180;
  const two = twoD(r.F, c.body.m - r.armMass, r.mB, th, c.surface.mu, 0, c.body.strokes.throw);
  console.log(`${oid} ${ang}deg lift 1e${lg}: engine v=${r.v.toFixed(2)} recoil=${r.recoilV.toFixed(2)} R=${(r.anchor.R/1e3).toFixed(1)}kN Nmax=${(r.anchor.Nmax/1e3).toFixed(0)}kN normalCapped=${r.anchor.normalCapped} | 2D: v=${two.vObj.toFixed(2)} at ${two.angDeg.toFixed(1)}deg, Rex slide=${two.recoil.toFixed(2)} m/s, maxN=${(two.maxN/1e3).toFixed(0)}kN`);
}
