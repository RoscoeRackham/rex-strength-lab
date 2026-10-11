global.window = {}; require('/home/user/dino-strength-sim/src/data.js'); const D = window.DINO_DATA;
const P = require(process.argv[2] || '/home/user/dino-strength-sim/src/engine.js');
const g = 9.80665;
function ctx(opts) {
  const body = P.makeBody({ H: opts.H || 2, m: opts.m || (opts.H ? undefined : 180) });
  const surface = D.surfaces.find(s => s.id === (opts.surface || 'granite'));
  return { F: opts.inf ? Infinity : Math.pow(10, opts.lg) * g, mode: 'real', body, surface, groundHolds: !!opts.gh, anchor: opts.anchor || 'braced' };
}
const ball = D.objects.find(o => o.id === 'baseball');
for (const H of [2, 0.4]) {
  const m = H === 2 ? 180 : 180 * Math.pow(H / 2, 3);
  for (const anchor of ['friction', 'braced']) {
    for (const surface of ['granite', 'concrete', 'sand']) {
      const row = [];
      for (const lg of [3, 6, 9, 12, 14, 16, 20, 25, 30, 34]) {
        const c = ctx({ H, m, lg, surface, anchor });
        const pu = P.punch(c).vFist, j = P.jump(c).v, t = P.throwObject(c, ball, 45).v;
        row.push(lg + ':' + pu.toFixed(2) + '/' + j.toFixed(2) + '/' + t.toFixed(1));
      }
      console.log('H=' + H + ' ' + anchor + ' ' + surface + ' caps punch ' + (17 * H / 2) + ' jump ' + (12 * H / 2) + ' whip ' + (84.6 * H / 2));
      console.log('  ' + row.join('  '));
    }
  }
}
