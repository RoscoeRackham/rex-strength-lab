global.window = global.window || {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const P = require('/home/user/dino-strength-sim/src/engine.js');
const g = P.K.g;
const body = P.makeBody({ H: 2, m: 180 });
const S = (id) => D.surfaces.find(s => s.id === id);
for (const anchor of ['friction', 'bolted']) for (const gh of [false, true]) for (const id of ['shot', 'car', 'tank', 'everest', 'moon']) {
  const obj = D.objects.find(o => o.id === id);
  let shown = null;
  for (let lk = 3; lk <= 34; lk += 0.25) {
    const c = { F: Math.pow(10, lk) * g, mode: 'comic', body, surface: S('concrete'), groundHolds: gh, anchor };
    const r = P.throwObject(c, obj, 45);
    const f = r.flight;
    if (r.crater > 0 && !f.relativistic && f.vImpact > 0 && r.Eimpact > 4.184e9) { shown = { lk, v: r.v, vImp: f.vImpact, D: r.crater, L: obj.L || Math.cbrt(6 * obj.m / (Math.PI * (obj.rho || 1000))) }; break; }
  }
  console.log(anchor, 'groundHolds', gh, id, shown ? JSON.stringify(shown) : 'never shown');
}
