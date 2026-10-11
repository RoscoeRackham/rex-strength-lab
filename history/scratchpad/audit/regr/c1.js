const { P, D, g, surf, obj, V, C } = require('./h.js');
// catch leg: time vs distance; vArrive vs strength
const objs = ['baseball', 'shot', 'car', 'bus', 'pyramid'];
const t0 = Date.now();
for (const id of objs) for (const style of ['easy', 'hard']) for (const lg of [2.7, 4.96, 8]) {
  const o = obj(id);
  const cR = C({ kg: Math.pow(10, lg) }), cO = C({ kg: Math.pow(10, lg) });
  let prev = null; const row = [];
  for (let ld = 0.5; ld <= 7.3; ld += 0.1) {
    const Dd = Math.pow(10, ld);
    const tt = Date.now();
    let L; try { L = P.catchLeg(cR, cO, o, Dd, style); } catch (e) { console.log('THROW', id, style, lg, ld.toFixed(1), e.message); break; }
    const dt = Date.now() - tt;
    if (dt > 1500) console.log('SLOW', id, style, lg, ld.toFixed(1), dt + 'ms');
    const cur = { ld, res: L.result, time: L.time, vL: L.aim && L.aim.vL, vA: L.vArrive };
    row.push(cur.res[0]);
    if (prev && prev.time != null && cur.time != null && isFinite(prev.time) && cur.time < prev.time * 0.98) console.log('TIME DROP', id, style, 'lg' + lg, 'D 10^' + prev.ld.toFixed(1), prev.time.toPrecision(4), prev.res, '-> 10^' + ld.toFixed(1), cur.time.toPrecision(4), cur.res, 'vL', prev.vL && prev.vL.toPrecision(4), cur.vL && cur.vL.toPrecision(4));
    if (style === 'easy' && prev && prev.vL && cur.vL && cur.vL < prev.vL * 0.98) console.log('EASY vL DROP', id, 'lg' + lg, 'D 10^' + prev.ld.toFixed(1), prev.vL.toPrecision(4), '-> 10^' + ld.toFixed(1), cur.vL.toPrecision(4), prev.res, cur.res);
    prev = cur;
  }
  console.log(id, style, lg, row.join(''));
}
console.log('total', (Date.now() - t0) / 1000, 's');
