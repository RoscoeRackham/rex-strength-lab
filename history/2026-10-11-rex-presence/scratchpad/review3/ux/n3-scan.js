global.window = {};
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const objs = process.argv[3] ? process.argv[3].split(',') : ['car'];
const mode = process.argv[4] || 'real';
const Fk = process.argv[2] === 'inf' ? Infinity : Number(process.argv[2]);
for (const id of objs) {
  const o = D.objects.find((x) => x.id === id);
  const slow = [];
  let n = 0;
  const top = isFinite(Fk) ? Math.log10(Fk) : 34;
  for (let lg = 1.5; lg <= top + 1e-9; lg += 0.05) {
    const c = { F: Fk * g, mode, body: rex, surface: D.surfaces.find((s) => s.id === 'concrete'), groundHolds: false, anchor: 'friction', use: Math.pow(10, lg) * g };
    const t0 = performance.now(); P.throwObject(c, o, 45); const t = performance.now() - t0; n++;
    if (t > 50) slow.push(lg.toFixed(2) + ':' + Math.round(t));
  }
  console.log(id, mode, 'F', process.argv[2], 'positions', n, 'over 50 ms:', slow.length, slow.join(' '));
}
