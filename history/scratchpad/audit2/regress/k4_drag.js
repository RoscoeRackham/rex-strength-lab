const { P, obj } = require('./common.js');
const { refFly } = require('./ref.js');
const body = P.makeBody({ H: 50 });
const fmt = (x) => x == null ? '-' : (+x.toPrecision(6));
const run = (label, o) => {
  const e = P.fly(o);
  // ref has constant Cd; give it Cd = CdSup if launch supersonic (approx); instead implement same cdAt
  const r = refFly(Object.assign({}, o, { rtol: 1e-10, tMax: 1e8 }));
  console.log(label + `\n  eng: land=${e.landed} esc=${e.escaped} orb=${e.orbit} TO=${e.timedOut} range=${fmt(e.range)} apex=${fmt(e.apex)} t=${fmt(e.time)} vImp=${fmt(e.vImpact)} ang=${fmt(e.impactAngleDeg)}\n  ref: esc=${!!r.escaped} TO=${!!r.timedOut} range=${fmt(r.range)} apex=${fmt(r.apex)} t=${fmt(r.time)} vImp=${fmt(r.vImpact)} ang=${fmt(r.impactAngleDeg)}`);
};
// Use constant Cd (no CdSup) so ref (constant Cd) is comparable
for (const v0 of [8000, 15000, 20000, 22000]) run('kaiju vertical ' + v0, { v0, thetaDeg: 90, h0: 0, m: body.m, A: body.topArea, Cd: 1.75 });
for (const v0 of [8000, 15000, 20000]) run('kaiju 80deg ' + v0, { v0, thetaDeg: 80, h0: 0, m: body.m, A: body.topArea, Cd: 1.75 });
const tank = obj('tank');
for (const [v0, th] of [[15000, 45], [20000, 30], [30000, 60], [12000, 89], [25000, 10]]) run(`tank ${v0} ${th}`, { v0, thetaDeg: th, h0: 1.8, m: tank.m, A: tank.area, Cd: 1.75 });
