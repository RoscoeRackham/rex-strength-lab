const { P, D, g, S, O, T, ctx } = require('./common');
const b = P.makeBody({});
// anchorCapacity algebra check vs brute-force force balance
function brute(body, surf, th, anchor, extra) {
  // find max R such that: N = W + R sin th <= Nmax and R cos th <= mu N + dig
  const W = (body.m + (extra||0)) * g, Nmax = surf.qult * 2 * body.footArea;
  const dig = anchor === 'braced' ? surf.shear * body.digArea : 0;
  const ok = (R) => (W + R*Math.sin(th) <= Nmax + 1e-9 || Math.sin(th) < 1e-12) && (R*Math.cos(th) <= surf.mu*(W + R*Math.sin(th)) + dig + 1e-9);
  if (ok(1e30)) return Infinity;
  let lo = 0, hi = 1e30; if (!ok(0)) return 0;
  for (let i=0;i<300;i++){const m=(lo+hi)/2; if(ok(m)) lo=m; else hi=m;}
  return lo;
}
for (const sid of Object.keys(S)) for (const deg of [0, 10, 30, 45, 51, 52, 60, 90]) for (const an of ['friction','braced']) for (const ex of [0, 1360]) {
  const th = deg*Math.PI/180;
  const a = P.anchorCapacity({ body: b, surface: S[sid], theta: th, anchor: an, extraMass: ex });
  const r = brute(b, S[sid], th, an, ex);
  const rel = (a.R === r) ? 0 : Math.abs(a.R - r)/Math.max(r, 1);
  if (rel > 1e-6) console.log('MISMATCH', sid, deg, an, ex, a.R, r);
}
console.log('anchor algebra brute-force check done');
console.log('concrete theta0 friction R', P.anchorCapacity({body:b,surface:S.concrete,theta:0}).R, 'expect', 0.8*180*g);
console.log('concrete 45 friction R', P.anchorCapacity({body:b,surface:S.concrete,theta:Math.PI/4}));
console.log('self-lock angle concrete', Math.atan(1/0.8)*180/Math.PI);
// lift
for (const sid of Object.keys(S)) {
  const c = ctx(511, {surface: sid});
  const r = P.lift(c, O.car);
  console.log('lift car', sid, 'pressure', r.pressure.toFixed(0), 'groundRatio', r.groundRatio.toFixed(3), 'stand', r.standRatio.toFixed(3), 'footAreaNeeded', r.footAreaNeeded.toFixed(4), 'grip', r.gripPressure.toFixed(0), r.gripRatio.toFixed(3), 'plate', r.plateNeeded.toFixed(4));
}
