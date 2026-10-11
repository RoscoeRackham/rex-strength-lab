const which = process.argv[2];
global.window = {};
const vm = require('vm'); const fs = require('fs');
const code = fs.readFileSync(__dirname + '/' + which + '-engine.js', 'utf8');
global.module = undefined;
vm.runInThisContext(code);
vm.runInThisContext(fs.readFileSync(__dirname + '/' + which + '-data.js', 'utf8'));
const P = window.DinoPhys || globalThis.DinoPhys, D = window.DINO_DATA; const g = P.K.g;
const obj = (id) => D.objects.find((x) => x.id === id);
function ctx(o) { const body = P.makeBody({ H: 2, m: 180 }); return { F: Math.pow(10, o.logKg) * g, mode: o.mode, body, surface: D.surfaces.find(s => s.id === 'concrete'), groundHolds: false, anchor: 'friction' }; }
for (const mode of ['real','comic']) for (const id of ['shuttle','b777','loco','tank','car']) for (const ang of [89,45]) {
  let worst = 0, wl = 0, tot = 0, n = 0;
  for (let lg = 2.708; lg <= 12; lg += 0.25) {
    const t = process.hrtime.bigint();
    P.throwObject(Object.assign(ctx({ mode, logKg: lg }), {record: true}), obj(id), ang);
    const ms = Number(process.hrtime.bigint() - t) / 1e6;
    tot += ms; n++; if (ms > worst) { worst = ms; wl = lg; }
  }
  console.log(which, mode, id, ang, 'worst', worst.toFixed(1), 'at', wl.toFixed(2), 'mean', (tot/n).toFixed(1));
}
