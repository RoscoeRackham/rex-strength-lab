global.window = {};
require('/home/user/dino-strength-sim/src/data.js'); const D = window.DINO_DATA;
for (const f of ['./eng-instr.js', ...require('fs').readdirSync('.').filter(x => /^eng-(k8-4e|h)/.test(x)).map(x => './' + x)]) {
  const P = require(f); const row = [];
  for (const [id, ang, lg, surf] of [['pyramid', 89, 10, 'concrete'], ['shuttle', 89, 6.96, 'concrete'], ['car', 45, 4.958, 'concrete'], ['loco', 89, 6.5, 'sand'], ['baseball', 45, 11, 'sand']]) {
    globalThis.__ev = 0; globalThis.__it = 0; globalThis.__st = 0;
    const c = { F: Math.pow(10, lg) * 9.80665, mode: 'comic', body: P.makeBody({ H: 2, m: 180 }), surface: D.surfaces.find(s => s.id === surf), groundHolds: false, anchor: 'friction' };
    const t = process.hrtime.bigint(); P.throwObject(c, D.objects.find(x => x.id === id), ang); const ms = Number(process.hrtime.bigint() - t) / 1e6;
    row.push(id + ' ' + ms.toFixed(0) + 'ms ' + ((__ev || __it) / __st).toFixed(1) + 'ev');
  }
  console.log(f.padEnd(16), row.join(' | '));
}
