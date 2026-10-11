const { P, D, g, surf, obj, V, C } = require('./h.js');
const H = Number(process.argv[2] || 2);
const sid = process.argv[3] || 'concrete';
let prev = null;
for (let lr = 1.5; lr <= 27.2; lr += 0.1) {
  const rho = Math.pow(10, lr), m = rho * P.bodyVolume(H);
  const c = C({ kg: 1e5, H, m, surface: sid });
  const t0 = Date.now();
  let w; try { w = P.weight(c); } catch (e) { console.log('THROW', lr.toFixed(1), e.message); continue; }
  const dt = Date.now() - t0;
  const reg = w.planet.regime !== 'none' ? w.planet.regime : w.ground.regime;
  const cur = { lr, reg, depth: w.fall && w.fall.stuck ? w.fall.stuck.depth : null, short: w.fall && w.fall.firstPass ? w.fall.firstPass.depthShort : null, t1: w.fall && w.fall.firstPass ? w.fall.firstPass.t : null, yrs: w.settle ? w.settle.years : null, sink: w.ground.sink, E: w.energyJ };
  const flag = [];
  if (dt > 1000) flag.push('SLOW ' + dt + 'ms');
  if (prev && prev.reg === cur.reg) {
    if (cur.depth != null && prev.depth != null && cur.depth < prev.depth * 0.98) flag.push('stuck depth DROP ' + prev.depth.toPrecision(4) + '->' + cur.depth.toPrecision(4));
    if (cur.sink != null && prev.sink != null && cur.sink < prev.sink * 0.98) flag.push('sink DROP ' + prev.sink.toPrecision(4) + '->' + cur.sink.toPrecision(4));
    if (cur.short != null && prev.short != null && cur.short > prev.short * 1.05 + 1) flag.push('depthShort RISE ' + prev.short.toPrecision(4) + '->' + cur.short.toPrecision(4));
    if (cur.yrs != null && prev.yrs != null && cur.yrs < prev.yrs * 0.9) flag.push('settle years DROP ' + prev.yrs.toPrecision(4) + '->' + cur.yrs.toPrecision(4));
  }
  for (const k of ['depth', 'short', 't1', 'yrs', 'sink', 'E']) if (cur[k] != null && !isFinite(cur[k])) flag.push(k + ' nonfinite ' + cur[k]);
  console.log('rho 10^' + lr.toFixed(1), reg.padEnd(14), 'dt', String(dt).padStart(5), 'depth', cur.depth && cur.depth.toPrecision(3), 'short', cur.short && cur.short.toPrecision(3), 't1', cur.t1 && cur.t1.toPrecision(3), 'yrs', cur.yrs && cur.yrs.toPrecision(3), 'sink', cur.sink && cur.sink.toPrecision(3), flag.join(' | '));
  prev = cur;
}
