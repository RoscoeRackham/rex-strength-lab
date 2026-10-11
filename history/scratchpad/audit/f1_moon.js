const P = require('/home/user/dino-strength-sim/src/engine.js');
global.window = {}; require('/home/user/dino-strength-sim/src/data.js'); const D = global.window.DINO_DATA;
const body = P.makeBody({ H: 2, m: 180 });
const moon = D.objects.find(o => o.id === 'moon');
for (const anchor of ['bolted', 'friction']) {
  const ctx = (lk) => ({ F: 10 ** lk * P.K.g, mode: 'comic', body, surface: D.surfaces.find(s => s.id === 'concrete'), groundHolds: false, anchor });
  // find logKg giving v in [7.9, 11.2] km/s at 0 deg using a quick probe of v
  let shown = 0;
  for (let k = 2800; k <= 3400 && shown < 6; k++) {
    const lk = k / 100;
    const t0 = Date.now();
    const r = P.throwObject(ctx(lk), moon, 0);
    const ms = Date.now() - t0;
    if (r.v > 7800 && r.v < 11300) {
      const f = r.flight;
      console.log(anchor, 'logKg', lk, 'v', r.v.toFixed(0), 'steps', f.steps, 'timedOut', f.timedOut, 'escaped', f.escaped, 'range km', (f.range / 1e3).toFixed(0), 'vImpact', f.vImpact.toFixed(0), 'time h', (f.time / 3600).toFixed(2), 'ms', ms);
      shown++;
    }
  }
  if (!shown) console.log(anchor, 'no slider value gives moon 7.8-11.3 km/s');
}
