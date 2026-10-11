global.window = {};
require('/home/user/dino-strength-sim/src/data.js'); const D = window.DINO_DATA;
for (const f of ['./eng-instr.js', './eng-fast-i.js']) {
  const P = require(f);
  for (const [id, ang, lg] of [['pyramid', 89, 10], ['shuttle', 89, 6.96], ['car', 45, 4.958]]) for (const mode of ['real', 'comic']) {
  globalThis.__ev = 0; globalThis.__it = 0; globalThis.__st = 0; globalThis.__calls = 0;
  const c = { F: Math.pow(10, lg) * 9.80665, mode, body: P.makeBody({ H: 2, m: 180 }), surface: D.surfaces.find(s => s.id === 'concrete'), groundHolds: false, anchor: 'friction' };
  const t = process.hrtime.bigint(); const r = P.throwObject(c, D.objects.find(x => x.id === id), ang); const ms = Number(process.hrtime.bigint() - t) / 1e6;
  console.log(f, id, ang, lg, mode, ms.toFixed(0) + 'ms', 'calls', __calls, 'steps', __st, 'evals/step', ((__ev || __it) / __st).toFixed(1));
  }
}
