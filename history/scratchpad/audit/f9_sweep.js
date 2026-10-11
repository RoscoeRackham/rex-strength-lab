const P = require('/home/user/dino-strength-sim/src/engine.js');
global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const g = P.K.g;
function ctx(s) {
  const body = P.makeBody({ H: s.H, m: 180 * Math.pow(s.H / 2, 3) });
  const surface = D.surfaces.find((x) => x.id === s.surface);
  return { F: s.inf ? Infinity : Math.pow(10, s.logKg) * g, mode: s.mode, body, surface, groundHolds: s.groundHolds, anchor: s.anchor };
}
const best = { stomp: null, throw: null };
const hits = { stomp: [], throw: [] };
const Hs = [0.4, 2, 50, 500];
const lks = []; for (let l = 1; l <= 34.0001; l += 0.25) lks.push(l);
for (const H of Hs) for (const mode of ['comic', 'real']) for (const surface of ['sand', 'concrete', 'granite']) for (const groundHolds of [false, true]) for (const anchor of ['friction', 'braced', 'bolted']) for (const lk of [...lks, 'inf']) {
  const s = { H, mode, surface, groundHolds, anchor, logKg: lk === 'inf' ? 0 : lk, inf: lk === 'inf' };
  const c = ctx(s);
  if (anchor === 'friction') {
    const r = P.stomp(c);
    if (r.crater > 0) {
      const dtc = r.crater / 1.25;
      if (!best.stomp || dtc > best.stomp.dtc) best.stomp = { dtc, s, vFoot: r.vFoot };
      if (dtc > 2560) hits.stomp.push({ dtc, H, mode, surface, lk, groundHolds });
    }
  }
  for (const o of D.objects.filter((x) => !x.noThrow)) for (const ang of [5, 15, 30, 45, 60, 75, 89]) {
    const r = P.throwObject(c, o, ang);
    const f = r.flight;
    const shown = r.canMove && !f.relativistic && f.vImpact > 0 && r.Eimpact > 4.184e9 && r.crater > 0;
    if (shown) {
      const dtc = r.crater / 1.25;
      if (!best.throw || dtc > best.throw.dtc) best.throw = { dtc, obj: o.id, ang, s, vImp: f.vImpact };
      if (dtc > 2560) hits.throw.push({ dtc: Math.round(dtc), obj: o.id, ang, H, mode, surface, anchor, groundHolds, lk, vImp: Math.round(f.vImpact) });
    }
  }
}
console.log('best stomp', JSON.stringify(best.stomp));
console.log('best throw', JSON.stringify(best.throw));
console.log('stomp hits >2560', hits.stomp.length, JSON.stringify(hits.stomp.slice(0, 5)));
console.log('throw hits >2560', hits.throw.length);
const byObj = {}; for (const h of hits.throw) { const k = h.obj + '/H' + h.H; byObj[k] = (byObj[k] || 0) + 1; }
console.log(byObj);
console.log(JSON.stringify(hits.throw.filter(h=>h.H===2).slice(0, 8), null, 0));
