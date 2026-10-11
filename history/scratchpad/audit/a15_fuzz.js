const { P, D, g, ctx, obj } = require('./common.js');
let n = 0, bad = [];
const scan = (o, path, tag) => { for (const [k, v] of Object.entries(o)) { if (k === 'path') continue; if (typeof v === 'number' && Number.isNaN(v)) bad.push(tag + ' ' + path + k); else if (v && typeof v === 'object' && !Array.isArray(v)) scan(v, path + k + '.', tag); } };
for (const mode of ['real']) for (const H of [0.4, 2, 50]) for (const s of D.surfaces) for (const anchor of ['friction', 'braced', 'bolted']) for (const gh of [false, true])
  for (const lg of [1, 2, 2.708, 4, 6, 7, 8, 10, 12, 14, 20, 34, Infinity]) {
    const kg = lg === Infinity ? Infinity : 10 ** lg;
    const c = ctx(kg, mode, { H, m: 180 * (H / 2) ** 3, surface: s.id, anchor, groundHolds: gh });
    const tag = `${mode} H${H} ${s.id} ${anchor} gh${gh} 1e${lg}`;
    for (const [nm, f] of Object.entries({ punch: P.punch, clap: P.clap, stomp: P.stomp, jump: P.jump, sprint: P.sprint })) { scan(f(c), nm + '.', tag); n++; }
    for (const ob of ['baseball', 'shot', 'car']) for (const a of [0, 45, 90]) { scan(P.throwObject(c, obj(ob), a), 'throw.' + ob + a + '.', tag); n++; }
  }
console.log('cases', n, 'NaN fields', bad.length); console.log(bad.slice(0, 20).join('\n'));
