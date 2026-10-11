const { P } = require('./common.js');
const { refFly } = require('./ref.js');
const body = P.makeBody({});
for (const v0 of [100, 1000, 3000, 5000, 8000, 10000, 11000, 12000, 15000, 20000, 50000, 200000, 1e6]) {
  const t0 = Date.now();
  const e = P.fly({ v0, thetaDeg: 90, h0: 0, m: body.m, A: body.topArea, Cd: body.Cd, CdSup: 1.75 });
  const ms = Date.now() - t0;
  console.log(`v0=${v0} eng: land=${e.landed} esc=${e.escaped} orb=${e.orbit} TO=${e.timedOut} apex=${(+e.apex.toPrecision(6))} t=${(+e.time.toPrecision(6))} vImp=${(+e.vImpact.toPrecision(5))} steps=${e.steps} ms=${ms}`);
}
