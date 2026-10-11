global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const P = require(process.argv[2] || '/home/user/dino-strength-sim/src/engine.js');
const g = 9.80665;
function ctx(s) {
  const H = s.H || 2;
  const body = P.makeBody({ H, m: 180 * Math.pow(H/2, 3) });
  const surface = D.surfaces.find((x) => x.id === s.surface);
  return { F: s.inf ? Infinity : Math.pow(10, s.logKg) * g, mode: 'real', body, surface, groundHolds: !!s.groundHolds, anchor: s.anchor };
}
const obj = (id) => D.objects.find((o) => o.id === id);
const lks = [2.7084, 6, 10, 14, 16, 17, 20, 23.2587, 24.776, 34, 'inf'];
const mk = (s, lk) => ctx(Object.assign({}, s, lk === 'inf' ? { inf: true } : { logKg: lk }));
for (const H of [0.4, 2, 50]) for (const surf of ['steel','granite','concrete','sand']) for (const anchor of ['friction','braced','bolted']) for (const gh of [false, true]) {
  const s = { H, surface: surf, anchor, groundHolds: gh };
  const cap = (k) => P.MUSCLE[k].vmax * H / 2;
  const pu = lks.map((lk) => (P.punch(mk(s, lk)).vFist / cap('punch')).toFixed(2));
  const cl = lks.map((lk) => (P.clap(mk(s, lk)).vHand / cap('clap')).toFixed(2));
  const th = lks.map((lk) => { const r = P.throwObject(mk(s, lk), obj('baseball'), 45); return (r.v / cap('throwWhip')).toFixed(2); });
  const ju = lks.map((lk) => { const r = P.jump(mk(s, lk)); return (r.push.vA + r.push.vB) / cap('jump'); }).map(x=>x.toFixed(2));
  const jv = lks.map((lk) => { const r = P.jump(mk(s, lk)); return (r.v / cap('jump')).toFixed(2); });
  const st = lks.map((lk) => { const r = P.stomp(mk(s, lk)); return ((r.push.vA + r.push.vB) / cap('stomp')).toFixed(2); });
  console.log(`H${H} ${surf} ${anchor} gh=${gh}\n  punch ${pu.join(' ')}\n  clap  ${cl.join(' ')}\n  ball  ${th.join(' ')}\n  jumpS ${ju.join(' ')}\n  jumpV ${jv.join(' ')}\n  stomp ${st.join(' ')}`);
}
