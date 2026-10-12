const { P, D, g, surf, obj, rex, ctxOf } = require('./lib.js');
console.log(D.objects.map(o => o.id).join(','));
const M = P.RESTRAINT.MOVES.throw;
for (const oid of ['shot', 'bowling', 'person']) for (const sid of ['sand', 'concrete']) {
  const o = D.objects.find(x => x.id === oid || x.id.startsWith(oid));
  if (!o) { console.log('no', oid); continue; }
  const c = ctxOf(90718, { surface: surf(sid) });
  const p = P.RESTRAINT.planNow('throw', c, { obj: o, angle: 45, target: 30, near: 5 });
  const ce = p.ceiling(), gl = p.goal();
  const r = p.run(ce.use);
  const src = M.shake(r, p.opt);
  const f = src ? 1 / src.T : 0;
  console.log(o.id, sid, 'goal kg', gl.never ? 'never' : (gl.use / g).toPrecision(3), 'ceiling by', ce.by, (ce.use / g).toPrecision(3), 'vImpact', r.flight && r.flight.vImpact.toFixed(1), 'T ms', src && (src.T * 1e3).toFixed(1), 'f Hz', f.toFixed(0), 'ppv5 mm/s', (P.ppvAt(src, 5) * 1e3).toFixed(1));
  // PPV at goal effort
  const rg = p.run(gl.use); const sg = M.shake(rg, p.opt);
  console.log('    at goal: vImpact', rg.flight && rg.flight.vImpact.toFixed(1), 'ppv5', (P.ppvAt(sg, 5) * 1e3).toFixed(2), 'mm/s, f', sg && (1 / sg.T).toFixed(0));
}
// a 7.26 kg shot landing at 13.7 m/s on lab sand
const shot = D.objects.find(x => x.id.startsWith('shot'));
if (shot) { const L = shot.L || Math.cbrt(6 * shot.m / (Math.PI * (shot.rho || 1000))); const v = 13.7; const src = P.vibSource(surf('sand'), 'hann', 2 * shot.m * v / (L / v), L / v); console.log('shot', shot.m, 'L', L.toFixed(3), '13.7 m/s on sand ppv5 mm/s', (P.ppvAt(src, 5) * 1e3).toFixed(1), 'f', (v / L).toFixed(0)); }
