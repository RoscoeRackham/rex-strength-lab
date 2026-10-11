global.window = {}; const P = require('/home/user/dino-strength-sim/src/engine.js'); require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const res = [];
for (const mode of ['comic', 'real']) for (const anchor of ['friction', 'braced', 'bolted']) for (const o of D.objects.filter(x => !x.noThrow)) for (const ang of [45, 89]) for (let lg = 3; lg <= 34; lg += 1) {
  const c = { F: Math.pow(10, lg) * g, mode, body: P.makeBody({ H: 2, m: 180 }), surface: D.surfaces.find(s => s.id === 'concrete'), groundHolds: false, anchor, record: true };
  const t0 = process.hrtime.bigint(); P.throwObject(c, o, ang); const dt = Number(process.hrtime.bigint() - t0) / 1e6;
  res.push([dt, mode, anchor, o.id, ang, lg]);
}
res.sort((a, b) => b[0] - a[0]);
console.log('states > 50 ms:', res.filter(r => r[0] > 50).length, 'of', res.length);
console.log(res.slice(0, 15).map(r => r[0].toFixed(0) + ' ms ' + r.slice(1).join(' ')).join('\n'));
const by45 = res.filter(r => r[4] === 45 && r[0] > 50); console.log('45° states > 50 ms:', by45.length, by45.slice(0, 5).map(r => r[0].toFixed(0) + ' ' + r.slice(1).join(' ')).join(' | '));
