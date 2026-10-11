const { P, D, g, ctx, ctxO, obj } = require('./h.js');
const CG = P;
for (const [id, lk, logD, build] of [['eiffel', 20, 5, 'rex'], ['pyramid', 20.5, 5, 'rex'], ['eiffel', 20, 5, 'human'], ['pyramid', 20.5, 5, 'human']]) {
  const o = build === 'human' ? { H: 2, m: 180, build: 'human', oH: 2, oM: 180, logKg: lk } : { logKg: lk };
  const cR = ctx(o), cO = ctxO(o);
  // ollie with H2 m180 build ollie
  const ob = obj(id);
  const Dmin = P.catchMinD(cR.body, cO.body, ob);
  const Dd = Math.max(Dmin, Math.pow(10, logD));
  const t0 = Date.now();
  const a = P.catchLeg(cR, cO, ob, Dd, 'hard');
  console.log(id, lk, build, 'result', a.result, 'vL', a.vL || (a.aim && a.aim.vL), 'th', a.aim && a.aim.thetaDeg, a.thetaDeg, 'ms', Date.now() - t0);
  // exact speeds at angles
  const noFl = Object.assign({}, cR, { noFlight: true });
  const rows = [];
  for (const th of [0, 45, 75, 82.5, 84, 86, 88, 89, 89.5, 90]) { const r = P.throwObject(noFl, ob, th); rows.push(th + ':' + (r.canMove ? r.v.toPrecision(4) : 0)); }
  console.log('  exact', rows.join(' '));
}
