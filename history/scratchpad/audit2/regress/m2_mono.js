const { P, D, ctx, obj } = require('./common.js');
const metrics = {
  punchV: (c) => P.punch(c).vFist, punchE: (c) => P.punch(c).E, clapE: (c) => P.clap(c).E, stompE: (c) => P.stomp(c).E,
  stompCrater: (c) => P.stomp(c).crater, stompHole: (c) => P.stomp(c).holeDepth, stompBody: (c) => P.stomp(c).vBody,
  sprintV: (c) => P.sprint(c).vTop, sprintA: (c) => P.sprint(c).accel,
  carV: (c) => P.throwObject(c, obj('car'), 45).v, carRange: (c) => { const f = P.throwObject(c, obj('car'), 45).flight; return f && f.landed ? f.range : NaN; },
  ballV: (c) => P.throwObject(c, obj('baseball'), 0).v, shotRange: (c) => { const f = P.throwObject(c, obj('shot'), 37).flight; return f && f.landed ? f.range : NaN; },
  tankV: (c) => P.throwObject(c, obj('tank'), 45).v, carEimp: (c) => P.throwObject(c, obj('car'), 45).Eimpact, carCrater: (c) => P.throwObject(c, obj('car'), 45).crater,
};
const mode = process.argv[2] || 'comic';
const which = (process.argv[3] || Object.keys(metrics).join(',')).split(',');
for (const surface of ['sand', 'concrete', 'granite']) for (const anchor of ['friction', 'braced', 'bolted']) for (const gh of [false, true]) {
  for (const m of which) {
    let prev = -Infinity, prevLg = 0, drops = [];
    for (let lg = 1; lg <= 34; lg += 0.1) {
      const c = ctx({ kg: Math.pow(10, lg), mode, surface, anchor, groundHolds: gh });
      let v; try { v = metrics[m](c); } catch (e) { v = 'ERR ' + e.message; }
      if (typeof v === 'string' || Number.isNaN(v)) { if (typeof v === 'string') drops.push(lg.toFixed(1) + ' ' + v); continue; }
      if (v < prev * (1 - 1e-3) - 1e-12) drops.push(`${prevLg.toFixed(1)}->${lg.toFixed(1)}: ${prev.toPrecision(4)}->${v.toPrecision(4)}`);
      if (v >= prev) { prev = v; prevLg = lg; }
    }
    if (drops.length) console.log(mode, surface, anchor, 'holds=' + gh, m, drops.length, 'drops:', drops.slice(0, 3).join(' | '));
  }
}
