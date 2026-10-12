global.window = {};
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js'); require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const surf = (id) => D.surfaces.find((s) => s.id === id), obj = (id) => D.objects.find((o) => o.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), ollie = P.makeBody({ build: 'ollie', H: 3.048, m: 3007 });
const c = (b, u) => ({ F: u, mode: 'real', body: b, surface: surf('concrete'), groundHolds: false, anchor: 'friction' });
const res = [];
for (let e = 3; e <= 34; e += 0.5) {
  const u = Math.pow(10, e) * g;
  const cpu0 = process.cpuUsage(), t0 = Date.now();
  P.catchLeg(c(rex, u), c(ollie, u), obj('car'), 10, 'easy'); P.catchLeg(c(ollie, u), c(rex, u), obj('car'), 10, 'easy');
  const cpu = process.cpuUsage(cpu0);
  res.push([e, Date.now() - t0, Math.round((cpu.user + cpu.system) / 1000)]);
}
res.sort((a, b) => b[2] - a[2]);
console.log('slowest full tests [log10 kg, wall ms, cpu ms]:', JSON.stringify(res.slice(0, 8)));
console.log('total cpu ms over grid', res.reduce((a, b) => a + b[2], 0));
