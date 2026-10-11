const { P, D, g, ctx, ctxO, obj } = require('./h.js');
const o = obj('tank');
console.log('tank', o.m, o.area, o.Cd, o.CdSup, o.crush);
const cR = ctx({ logKg: 16, groundHolds: true }), cO = ctxO({ logKg: 16, groundHolds: true });
const Dmin = P.catchMinD(cR.body, cO.body, o);
const Dd = Math.max(Dmin, 1e7);
let t0 = Date.now();
const a = P.catchLeg(cR, cO, o, Dd, 'easy');
console.log('leg', a.result, a.thetaDeg, a.vL, 'Dfl', a.Dfl, Date.now() - t0, 'ms');
const h0 = cR.body.releaseHeight, hStop = cO.body.releaseHeight;
const fl = (v, th) => P.flyTo({ v0: v, thetaDeg: th, h0, hStop, m: o.m, A: o.area, Cd: o.Cd, CdSup: o.CdSup, Rn: Math.sqrt(o.area / Math.PI) });
for (const th of [30, 45, 55, 60, 65, 70, 75, 85]) {
  // bisection on v for landing at range >= Dfl; record landed solutions
  let found = [];
  for (let lv = 3.5; lv <= 6.5; lv += 0.02) {
    const v = Math.pow(10, lv); const f = fl(v, th);
    if (f.landed && !f.belowStop && f.range >= a.Dfl) { found.push([v, f.range, f.escaped, f.orbit, f.time, f.vImpact, f.heatLoad]); break; }
    if (f.escaped || f.orbit || f.timedOut || f.relativistic) { found.push(['over at', v, f.escaped ? 'esc' : f.orbit ? 'orb' : f.timedOut ? 'to' : 'rel']); break; }
  }
  console.log(th, JSON.stringify(found));
}
// full strength speed at 60-65
const noFl = Object.assign({}, cR, { noFlight: true });
for (const th of [60, 65, 85]) console.log('vmax', th, P.throwObject(noFl, o, th).v);
