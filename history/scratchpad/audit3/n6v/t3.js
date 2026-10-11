global.window = {};
const P = require('./eng-instr.js'); require('/home/user/dino-strength-sim/src/data.js'); const D = window.DINO_DATA; const g = P.K.g;
const obj = (id) => D.objects.find((x) => x.id === id);
for (const [mode, id, ang, lg] of [['real','shuttle',89,6.96],['real','shuttle',89,5],['real','shuttle',89,9],['comic','shuttle',89,7.46],['comic','b777',89,6.71],['real','car',45,4.71],['real','tank',45,5.21]]) {
  globalThis.__it=0;globalThis.__st=0;globalThis.__calls=0;
  const body = P.makeBody({ H: 2, m: 180 });
  const c = { F: Math.pow(10, lg) * g, mode, body, surface: D.surfaces.find(s => s.id === 'concrete'), groundHolds: false, anchor: 'friction', record: true };
  const t = process.hrtime.bigint();
  const r = P.throwObject(c, obj(id), ang);
  const ms = Number(process.hrtime.bigint() - t) / 1e6;
  console.log(mode, id, ang, lg, ms.toFixed(1)+'ms', 'calls', __calls, 'steps', __st, 'iters', __it, 'it/step', (__it/__st).toFixed(1), 'v', r.v.toPrecision(5), r.basis||'', 'heldBack', r.heldBack);
}
