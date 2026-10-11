// Compare the original sine-interpolated arc with the true conic, before thinning, by monkeypatching the stride.
global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const Dd = window.DINO_DATA;
const fs = require('fs');
function load(file) {
  let s = fs.readFileSync(file, 'utf8').replace('Math.ceil(path.length / 400)', '1');
  const m = { exports: {} }; new Function('module', 'exports', 'require', s)(m, m.exports, require); return m.exports;
}
const A = load('/home/user/dino-strength-sim/src/engine.js'), B = load(process.argv[2]);
for (const [id, lk, ang] of [['loco', 18.7, 80], ['titanic', 20, 45]]) {
  const o = Dd.objects.find((x) => x.id === id);
  const out = [];
  for (const P of [A, B]) {
    const body = P.makeBody({ H: 2, m: 180 });
    const c = { F: Math.pow(10, lk) * 9.80665, mode: 'comic', body, surface: Dd.surfaces.find((s) => s.id === 'concrete'), groundHolds: false, anchor: 'friction', record: true };
    const f = P.throwObject(c, o, ang).flight;
    const arc = f.path.filter((p) => p[1] > 150e3);
    out.push(arc);
  }
  console.log(id, 'arc pts', out[0].length, out[1].length);
  for (let i = 0; i < out[0].length; i += 3) console.log('  x', (out[0][i][0] / 1e3).toFixed(0), 'sine h', (out[0][i][1] / 1e3).toFixed(0), ' conic h', out[1][i] ? (out[1][i][1] / 1e3).toFixed(0) : '-');
}
