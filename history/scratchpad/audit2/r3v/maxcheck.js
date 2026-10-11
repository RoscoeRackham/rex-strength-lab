global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const P = require(process.argv[2]);
const g = 9.80665;
const obj = (id) => D.objects.find((o) => o.id === id);
let worst = {};
const t0 = Date.now();
for (const H of [0.4, 2, 50]) for (const surf of D.surfaces.map(s=>s.id)) for (const anchor of ['friction','braced','bolted']) for (const gh of [false, true]) for (let lk = 2; lk <= 34; lk += 1) {
  const body = P.makeBody({ H, m: 180 * Math.pow(H/2, 3) });
  const surface = D.surfaces.find((x) => x.id === surf);
  const c = { F: Math.pow(10, lk) * g, mode: 'real', body, surface, groundHolds: gh, anchor };
  const rec = (k, val, cap) => { const r = val / cap; if (!worst[k] || r > worst[k].r) worst[k] = { r, H, surf, anchor, gh, lk, val }; };
  const s = H / 2;
  const pu = P.punch(c); rec('punch', pu.push.vA + pu.push.vB, 17 * s);
  const cl = P.clap(c); rec('clap', cl.push.vA + cl.push.vB, 17 * s);
  for (const o of ['baseball', 'shot']) { const th = P.throwObject(c, obj(o), 45); if (th.push) rec('throw-' + o, th.push.vA + th.push.vB, (o === 'baseball' ? 84.6 : 35) * s); }
  const j = P.jump(c); rec('jump', j.push.vA + j.push.vB, 12 * s);
  const st = P.stomp(c); rec('stomp', st.push.vA + st.push.vB, 16 * s);
}
for (const [k, w] of Object.entries(worst)) console.log(k, w.r.toFixed(5), JSON.stringify(w));
console.error('time', (Date.now() - t0) / 1000);
