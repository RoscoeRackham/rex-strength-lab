const { P, ctx } = require('./common.js');
const { refFly } = require('./ref.js');
const body = P.makeBody({ H: 50 });
console.log('kaiju m', body.m, 'topArea', body.topArea);
for (const v0 of [3000, 8000, 12000, 15000, 18000, 20000, 25000, 40000]) {
  const t0 = Date.now();
  const e = P.fly({ v0, thetaDeg: 90, h0: 0, m: body.m, A: body.topArea, Cd: body.Cd, CdSup: 1.75 });
  const ms = Date.now() - t0;
  console.log(`v0=${v0} eng: land=${e.landed} esc=${e.escaped} orb=${e.orbit} TO=${e.timedOut} apex=${(+e.apex.toPrecision(6))} t=${(+e.time.toPrecision(6))} vImp=${(+e.vImpact.toPrecision(5))} steps=${e.steps} ms=${ms}`);
}
// what jump speeds does the kaiju reach on the slider?
for (const lg of [8, 10, 12, 14, 16, 18, 20, 22, 24]) {
  for (const gh of [false, true]) {
    const c = ctx({ kg: Math.pow(10, lg), H: 50, groundHolds: gh, surface: 'granite' });
    const t0 = Date.now();
    const j = P.jump(c);
    console.log(`lg=${lg} holds=${gh} v=${j.v.toPrecision(5)} apex=${j.flight.apex.toPrecision(5)} esc=${j.flight.escaped} TO=${j.flight.timedOut} land=${j.flight.landed} vac=${j.vacuumApex.toPrecision(4)} ms=${Date.now()-t0}`);
  }
}
