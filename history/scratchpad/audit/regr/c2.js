const { P, D, g, surf, obj, V, C } = require('./h.js');
const CODE = { caught: 'C', 'cant-hold': 'H', 'cant-hold-it': 'h', 'too-weak': 'W', 'too-big': 'B', unreachable: 'U', 'breaks-up': 'K', 'burns-up': 'X', slams: 'S', wreckage: 'R', overshoots: 'O', 'no-arc': 'N', fireball: 'F', 'falls-back': 'L' };
const ids = process.argv[2].split(',');
const lgs = process.argv[3].split(',').map(Number);
const styles = (process.argv[4] || 'easy,hard').split(',');
for (const id of ids) for (const style of styles) for (const lg of lgs) {
  const o = id === 'partner' ? null : obj(id);
  const cR = C({ kg: Math.pow(10, lg) }), cO = C({ kg: Math.pow(10, lg) });
  let prev = null; const row = []; const det = [];
  for (let ld = 0.5; ld <= 7.31; ld += 0.25) {
    const Dd = Math.pow(10, ld);
    const tt = Date.now();
    let L; try { L = P.catchLeg(cR, cO, o, Dd, style); } catch (e) { row.push('!'); det.push('THROW ' + ld + ' ' + e.message); continue; }
    const dt = Date.now() - tt;
    if (dt > 1500) det.push('SLOW ' + ld.toFixed(2) + ' ' + dt + 'ms');
    row.push(CODE[L.result] || '?' + L.result);
    const cur = { ld, res: L.result, time: L.time, vL: L.aim && L.aim.vL, vA: L.vArrive, th: L.aim && L.aim.thetaDeg };
    if (prev && prev.time != null && cur.time != null && cur.time < prev.time * 0.98) det.push('TIME DROP D 10^' + prev.ld.toFixed(2) + ' ' + prev.time.toPrecision(4) + ' ' + prev.res + ' th' + (prev.th||0).toFixed(1) + ' -> 10^' + ld.toFixed(2) + ' ' + cur.time.toPrecision(4) + ' ' + cur.res + ' th' + (cur.th||0).toFixed(1) + ' vL ' + (prev.vL||0).toPrecision(4) + ' ' + (cur.vL||0).toPrecision(4));
    if (style === 'easy' && prev && prev.vL && cur.vL && cur.vL < prev.vL * 0.98) det.push('EASY vL DROP D 10^' + prev.ld.toFixed(2) + ' ' + prev.vL.toPrecision(4) + ' -> ' + cur.vL.toPrecision(4) + ' ' + prev.res + ' ' + cur.res);
    prev = cur;
  }
  console.log(id.padEnd(9), style.padEnd(4), String(lg).padEnd(5), row.join(''));
  for (const d of det) console.log('     ', d);
}
