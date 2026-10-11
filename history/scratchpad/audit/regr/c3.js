const { P, D, g, surf, obj, V, C } = require('./h.js');
const CODE = { caught: 'C', 'cant-hold': 'H', 'cant-hold-it': 'h', 'too-weak': 'W', 'too-big': 'B', unreachable: 'U', 'breaks-up': 'K', 'burns-up': 'X', slams: 'S', wreckage: 'R', overshoots: 'O', 'no-arc': 'N', fireball: 'F', 'falls-back': 'L' };
const ids = process.argv[2].split(',');
const Ds = process.argv[3].split(',').map(Number);
const style = process.argv[4] || 'hard';
const extra = process.argv[5] ? JSON.parse(process.argv[5]) : {};
for (const id of ids) for (const Dd of Ds) {
  const o = obj(id);
  let prev = null; const row = []; const det = [];
  for (let lg = 1; lg <= 34; lg += 0.5) {
    const cR = C(Object.assign({ kg: Math.pow(10, lg) }, extra.R || {})), cO = C(Object.assign({ kg: Math.pow(10, lg) }, extra.O || {}));
    let L; try { L = P.catchLeg(cR, cO, o, Dd, style); } catch (e) { row.push('!'); det.push('THROW lg' + lg + ' ' + e.message); continue; }
    row.push(CODE[L.result] || '?');
    const cur = { lg, res: L.result, time: L.time, vA: L.vArrive, vL: L.aim && L.aim.vL };
    if (prev && prev.vA && cur.vA && cur.vA < prev.vA * 0.98 && style === 'hard') det.push('vArrive DROP lg' + prev.lg + ' ' + prev.vA.toPrecision(4) + ' ' + prev.res + ' -> lg' + lg + ' ' + cur.vA.toPrecision(4) + ' ' + cur.res + ' vL ' + (prev.vL||0).toPrecision(4) + '->' + (cur.vL||0).toPrecision(4));
    if (prev && prev.time && cur.time && cur.time > prev.time * 1.02 && style === 'hard') det.push('time RISE lg' + prev.lg + ' ' + prev.time.toPrecision(4) + ' ' + prev.res + ' -> lg' + lg + ' ' + cur.time.toPrecision(4) + ' ' + cur.res + ' vL ' + (prev.vL||0).toPrecision(4) + '->' + (cur.vL||0).toPrecision(4));
    prev = cur;
  }
  console.log(id.padEnd(9), style, String(Dd).padEnd(8), row.join(''));
  for (const d of det.slice(0, 6)) console.log('     ', d);
}
