global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const P = require('/home/user/dino-strength-sim/src/engine.js');
const K = P.K, g = 9.80665;
function sig(x, n) {
  if (!isFinite(x)) return x < 0 ? '−∞' : '∞';
  if (x === 0) return '0';
  const d = Math.floor(Math.log10(Math.abs(x)));
  const p = Math.pow(10, n - 1 - d);
  const r = Math.round(x * p) / p;
  return r.toLocaleString('en-US', { maximumFractionDigits: Math.max(0, n - 1 - d) });
}
function oldPct(b) { return sig(b * 100, 8).replace(/0+$/, ''); }
function newPct(b) {
  const dec = Math.max(1, Math.ceil(-Math.log10(1 - b)) - 1);
  return (b * 100).toFixed(dec).replace(/0+$/, '').replace(/\.$/, '');
}
function ctx(F, surf) {
  const body = P.makeBody({ H: 2, m: 180 });
  return { F, mode: 'comic', body, surface: D.surfaces.find((s) => s.id === (surf || 'concrete')), groundHolds: false, anchor: 'friction' };
}
const car = D.objects.find((o) => o.id === 'car');
for (const id of ['allstar', 'earth']) {
  const t = D.tiers.find((x) => x.id === id);
  const c = ctx(t.liftKg * g);
  const th = P.throwObject(c, car, 45), j = P.jump(c), st = P.stomp(c), pu = P.punch(c), cl = P.clap(c);
  const vals = { throwV: th.v, recoil: th.recoilV, jump: j.v, stompFoot: st.vFoot ?? st.v, stompBody: st.vBody, fist: pu.vFist, clap: cl.vHand ?? cl.v };
  console.log('==', id);
  for (const [k, v] of Object.entries(vals)) {
    if (v == null) { console.log(k, 'n/a'); continue; }
    const b = v / K.c;
    console.log(k.padEnd(10), 'b=', b.toPrecision(14), '1-b=', (1 - b).toExponential(2), 'old:', b >= 1 - 1e-12 ? 'LS' : oldPct(b), ' new:', b >= 1 - 1e-12 ? 'LS' : (b > 0.999 ? newPct(b) : '-'));
  }
  console.log(Object.keys(st), Object.keys(cl));
}
// edge cases for newPct
for (const b of [0.999, 0.9995, 0.99912, 0.99999, 0.9999999, 0.99999995, 0.99999997, 1 - 3.9e-10, 1 - 4.4e-11, 1 - 2e-12, 1 - 1.01e-12])
  console.log(b, 'old', oldPct(b), 'new', newPct(b));
