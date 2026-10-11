const { P, D, g, surf, obj, V, C } = require('./h.js');
const CODE = { caught: 'C', 'cant-hold': 'H', 'cant-hold-it': 'h', 'too-weak': 'W', 'too-big': 'B', unreachable: 'U', 'breaks-up': 'K', 'burns-up': 'X', slams: 'S', wreckage: 'R', overshoots: 'O', 'no-arc': 'N', fireball: 'F', 'falls-back': 'L', 'thrower-black-hole': 'Z' };
const [rhoR, rhoO] = process.argv[2].split(',').map(Number);
const ids = process.argv[3].split(',');
const lgs = process.argv[4].split(',').map(Number);
for (const id of ids) for (const style of ['easy', 'hard']) for (const lg of lgs) {
  const o = obj(id);
  const cR = C({ kg: Math.pow(10, lg), m: rhoR * 0.18, gh: true }), cO = C({ kg: Math.pow(10, lg), m: rhoO * 0.18, gh: true });
  const Dmin = P.catchMinD(cR.body, cO.body, o);
  let prev = null; const row = []; const det = [];
  for (let ld = Math.log10(Dmin); ld <= 7.31; ld += 0.1) {
    const Dd = Math.pow(10, ld);
    const t0 = Date.now();
    let L; try { L = P.catchLeg(cR, cO, o, Dd, style); } catch (e) { row.push('!'); det.push('THROW ' + ld.toFixed(2) + ' ' + e.message); continue; }
    const dt = Date.now() - t0; if (dt > 1500) det.push('SLOW ' + ld.toFixed(2) + ' ' + dt);
    row.push((CODE[L.result] || '?') + (L.wells && L.wells.wellDominated ? '' : ''));
    const cur = { ld, res: L.result, time: L.time, vL: L.aim && L.aim.vL, vA: L.vArrive, wd: L.wells && L.wells.wellDominated };
    if (prev && prev.time != null && cur.time != null && cur.time < prev.time * 0.97) det.push('TIME DROP D10^' + prev.ld.toFixed(2) + ' ' + prev.time.toPrecision(4) + (prev.wd ? 'W' : '') + ' -> 10^' + ld.toFixed(2) + ' ' + cur.time.toPrecision(4) + (cur.wd ? 'W' : '') + ' vL ' + (prev.vL||0).toPrecision(4) + '->' + (cur.vL||0).toPrecision(4) + ' ' + prev.res + '/' + cur.res);
    if (prev && style === 'easy' && prev.vL != null && cur.vL != null && cur.vL < prev.vL * 0.97 && prev.vL > 1) det.push('LOB vL DROP D10^' + prev.ld.toFixed(2) + ' ' + prev.vL.toPrecision(4) + (prev.wd ? 'W' : '') + ' -> ' + cur.vL.toPrecision(4) + (cur.wd ? 'W' : ''));
    prev = cur;
  }
  console.log(id.padEnd(9), style.padEnd(4), String(lg).padEnd(5), 'Dmin', Dmin.toPrecision(3), row.join(''));
  for (const d of det.slice(0, 8)) console.log('     ', d);
}
