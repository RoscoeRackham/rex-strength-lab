global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const E = P || window.RexEngine || window.PHYS;
const g = 9.80665;
const body = E.makeBody({ H: 2, m: 180 });
const surface = D.surfaces.find((s) => s.id === 'concrete');
const mk = (kg, extra) => Object.assign({ F: kg * g, mode: 'comic', body, surface, groundHolds: false, anchor: 'friction' }, extra || {});
const obj = (id) => D.objects.find((o) => o.id === id);
console.log('comicFrac', Object.fromEntries(Object.entries(E.MUSCLE).map(([k, v]) => [k, [v.forceFrac, v.comicFrac]])));
function thr(kg, id, ang) {
  const c = mk(kg);
  const r = E.throwObject(Object.assign({}, c, { record: true }), obj(id), ang);
  const rc = E.throwOnce(Object.assign({}, c, { record: true }), obj(id), ang);
  console.log(`throw ${id} ${kg.toPrecision(4)}kg ang ${ang}: basis=${r.basis} Fdrive=${r.Fdrive.toExponential(3)} F=${r.F.toExponential(3)} Ffull=${c.F.toExponential(3)} share=${(r.Fdrive / c.F / r.hands * 100).toFixed(1)}%/hand heldBack=${r.heldBack} anchorR=${r.anchor.R.toExponential(3)} v=${r.v.toFixed(3)} range=${r.flight && r.flight.range}  | comic-only v=${rc.v} canMove=${rc.canMove} Fdrive=${rc.Fdrive.toExponential(3)}`);
}
thr(90718.474, 'tank', 30);
thr(10 ** 1.5, 'bowling', 45);
thr(15800, 'car', 45);
for (const lk of [2.4]) {
  const c = mk(10 ** lk);
  const r = E.jump(c);
  console.log(`jump 10^${lk}: basis=${r.basis} F=${r.F} dial=${c.F} ratio=${r.F / c.F}`);
}
for (const fn of ['punch', 'clap', 'stomp']) {
  let lo = null, hi = null;
  for (let lk = 1; lk <= 12; lk += 0.25) {
    const r = E[fn](mk(10 ** lk));
    if (r.basis === 'real') { if (lo == null) lo = lk; hi = lk; }
  }
  console.log(fn, 'basis real from 10^' + lo + ' to 10^' + hi);
}
