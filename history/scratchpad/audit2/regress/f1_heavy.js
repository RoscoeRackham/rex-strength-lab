const { P, D, ctx, obj } = require('./common.js');
for (const id of ['shuttle', 'eiffel', 'titanic', 'nimitz', 'esb', 'pyramid']) { const o = obj(id); console.log(id, 'm', o.m, 'A', o.area, 'm/A', (o.m / o.area).toFixed(0), 'Cd', o.Cd, o.CdSup); }
const o = obj('pyramid');
let n = 0;
for (let lg = 16.5; lg <= 18.5; lg += 0.005) {
  const c = ctx({ kg: Math.pow(10, lg), anchor: 'bolted' });
  const t0 = Date.now();
  const r = P.throwObject(c, o, 45);
  const f = r.flight, ms = Date.now() - t0;
  const vac = P.fly({ v0: r.v, thetaDeg: 45, h0: c.body.releaseHeight, m: o.m, A: o.area, Cd: 0 });
  if (f.timedOut || ms > 300 || (f.landed && f.time > 86400 * 30) || (vac.landed && vac.apex > 1.5e9) ) { console.log(lg.toFixed(2), 'v', r.v.toFixed(0), 'esc', f.escaped, 'TO', f.timedOut, 'land', f.landed, 'apex km', (f.apex / 1e3).toExponential(3), 'time d', (f.time / 86400).toFixed(1), 'range km', (f.range / 1e3).toFixed(0), 'ms', ms, '| vac apex km', (vac.apex/1e3).toExponential(3), 'vac t d', (vac.time/86400).toFixed(1), 'vac land', vac.landed, 'vac range', (vac.range/1e3).toFixed(0)); if (++n > 25) break; }
}
