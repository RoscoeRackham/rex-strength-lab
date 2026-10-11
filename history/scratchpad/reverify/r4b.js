global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const o = D.objects.find(x=>x.id==='tank');
const R = P.K.R_E;
const h0 = 2.74, hStop = 2.74;
const Dfl = 2.0015e7 - 5;
let best = null, n = 0;
for (let th = 20; th <= 85; th += 2.5) {
  let prevState = null;
  for (let lv = 4.5; lv <= 6.5; lv += 0.01) {
    const v = Math.pow(10, lv);
    const f = P.flyTo({ v0: v, thetaDeg: th, h0, hStop, m: o.m, A: o.area, Cd: o.Cd, CdSup: o.CdSup, Rn: Math.sqrt(o.area/Math.PI) });
    n++;
    const st = (f.escaped||f.orbit||f.timedOut) ? 'over' : (f.landed ? 'land' : 'other');
    if (st === 'land' && f.range >= 0.99*Dfl) { if (!best || v < best.v) best = { th, v, range: f.range }; console.log('LAND near antipode', th, v.toFixed(0), (f.range/1e3).toFixed(0)); break; }
    if (st === 'over') { console.log(th, 'first overshoot at', v.toFixed(0), 'last land range km', prevState && (prevState/1e3).toFixed(0), JSON.stringify({esc:f.escaped, orb:f.orbit, to:f.timedOut})); break; }
    prevState = f.range;
  }
}
console.log('best', JSON.stringify(best), n);
