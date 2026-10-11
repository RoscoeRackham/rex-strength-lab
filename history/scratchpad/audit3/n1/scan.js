global.window = {};
const P = require(process.argv[2]);
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA, g = 9.80665;
const body = P.makeBody({ H: 2, m: 180 });
const objs = D.objects.filter(o => o.m < 1e7);
let n = 0, drops = [], sinkInf = 0, sinkInfList = [];
for (const s of D.surfaces) for (const anchor of ['friction', 'braced', 'bolted']) for (const gh of [false, true]) for (const o of objs) for (const ang of [0, 15, 30, 45, 60]) {
  const base = { mode: 'real', body, surface: s, groundHolds: gh, anchor };
  const a = P.throwObject(Object.assign({}, base, { F: 1e34 * g }), o, ang);
  const b = P.throwObject(Object.assign({}, base, { F: Infinity }), o, ang);
  const va = a.canMove ? a.v : 0, vb = b.canMove ? b.v : 0;
  n++;
  if (vb < va * 0.999) drops.push([s.id, anchor, gh, o.id, ang, va.toPrecision(4), vb.toPrecision(4), (100 * (1 - vb / va)).toFixed(0) + '%']);
  if (b.sinkRatio !== a.sinkRatio && !(Math.abs(b.sinkRatio - a.sinkRatio) <= 1e-9 * a.sinkRatio)) { sinkInf++; if (sinkInfList.length < 6) sinkInfList.push([s.id, anchor, gh, o.id, ang, a.sinkRatio, b.sinkRatio]); }
}
console.log('cases', n, 'drops at inf vs 1e34', drops.length);
for (const d of drops.slice(0, 12)) console.log(' ', d.join(' '));
const byObj = {}; for (const d of drops) byObj[d[3]] = (byObj[d[3]] || 0) + 1; console.log(byObj);
console.log('sinkRatio differs inf vs 1e34:', sinkInf); for (const x of sinkInfList) console.log(' ', x.join(' '));
